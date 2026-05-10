import asyncio
import logging
import time
import random
from enum import Enum
from typing import Optional, Callable, Any, Awaitable

import websockets
from websockets.exceptions import ConnectionClosed

logger = logging.getLogger(__name__)

class ConnectionState(Enum):
    DISCONNECTED = "disconnected"
    CONNECTING = "connecting"
    CONNECTED = "connected"
    RECONNECTING = "reconnecting"
    CLOSING = "closing"

class WebSocketManager:
    """
    Production-grade async WebSocket connection manager with:
    - Automatic reconnection with exponential backoff
    - Heartbeat handling and stale connection detection
    - Non-blocking message buffering via asyncio.Queue
    - Structured logging and state tracking
    """
    def __init__(
        self,
        uri: str,
        on_message: Callable[[Any], Awaitable[None]],
        heartbeat_interval: float = 30.0,
        heartbeat_payload: Optional[str] = None,
        stale_timeout: float = 60.0,
        initial_backoff: float = 1.0,
        max_backoff: float = 60.0,
        queue_size: int = 10000,
        name: str = "WebSocketManager"
    ):
        self.uri = uri
        self.on_message = on_message
        self.heartbeat_interval = heartbeat_interval
        self.heartbeat_payload = heartbeat_payload
        self.stale_timeout = stale_timeout
        self.initial_backoff = initial_backoff
        self.max_backoff = max_backoff
        self.name = name

        self.state = ConnectionState.DISCONNECTED
        self.ws: Optional[websockets.WebSocketClientProtocol] = None
        self._last_msg_time = 0.0
        self._stop_event = asyncio.Event()
        self._conn_task: Optional[asyncio.Task] = None
        self._heartbeat_task: Optional[asyncio.Task] = None
        self._worker_task: Optional[asyncio.Task] = None
        self._queue = asyncio.Queue(maxsize=queue_size)
        self._backoff_delay = initial_backoff

    async def start(self):
        """Starts the WebSocket manager and message processing worker."""
        if self.state != ConnectionState.DISCONNECTED:
            logger.warning("[%s] Already started or in transition: %s", self.name, self.state)
            return

        self._stop_event.clear()
        self._worker_task = asyncio.create_task(self._message_worker())
        self._conn_task = asyncio.create_task(self._run_forever())
        logger.info("[%s] Manager started for %s", self.name, self.uri)

    async def stop(self):
        """Stops the WebSocket manager gracefully."""
        if self.state == ConnectionState.DISCONNECTED:
            return

        logger.info("[%s] Stopping manager...", self.name)
        self.state = ConnectionState.CLOSING
        self._stop_event.set()

        if self.ws:
            try:
                await self.ws.close()
            except Exception as e:
                logger.error("[%s] Error closing websocket: %s", self.name, e)

        # Wait for connection task to finish
        if self._conn_task:
            try:
                await asyncio.wait_for(self._conn_task, timeout=5.0)
            except (asyncio.TimeoutError, asyncio.CancelledError):
                if self._conn_task:
                    self._conn_task.cancel()

        if self._heartbeat_task:
            self._heartbeat_task.cancel()

        if self._worker_task:
            self._worker_task.cancel()

        self.state = ConnectionState.DISCONNECTED
        logger.info("[%s] Manager stopped", self.name)

    async def send(self, message: str):
        """Sends a message over the WebSocket if connected."""
        if self.ws and self.state == ConnectionState.CONNECTED:
            await self.ws.send(message)
        else:
            logger.warning("[%s] Cannot send message, not connected", self.name)

    async def _message_worker(self):
        """Processes messages from the queue asynchronously."""
        while not self._stop_event.is_set():
            try:
                message = await self._queue.get()
                await self.on_message(message)
                self._queue.task_done()
            except asyncio.CancelledError:
                break
            except Exception as e:
                logger.error("[%s] Error processing message in worker: %s", self.name, e)

    async def _run_forever(self):
        """Main loop for maintaining the connection."""
        try:
            while not self._stop_event.is_set():
                try:
                    self.state = ConnectionState.CONNECTING
                    logger.info("[%s] Connecting to %s...", self.name, self.uri)

                    async with websockets.connect(self.uri) as ws:
                        self.ws = ws
                        self.state = ConnectionState.CONNECTED
                        self._last_msg_time = time.time()
                        self._backoff_delay = self.initial_backoff # Reset backoff on success
                        logger.info("[%s] Connected successfully", self.name)

                        # Start heartbeat loop
                        if self.heartbeat_interval > 0:
                            if self._heartbeat_task:
                                self._heartbeat_task.cancel()
                            self._heartbeat_task = asyncio.create_task(self._heartbeat_loop())

                        async for message in ws:
                            if self._stop_event.is_set():
                                break
                            self._last_msg_time = time.time()
                            try:
                                self._queue.put_nowait(message)
                            except asyncio.QueueFull:
                                logger.error("[%s] Message queue full, dropping message", self.name)

                except (ConnectionClosed, Exception) as e:
                    if self.state != ConnectionState.CLOSING and not self._stop_event.is_set():
                        logger.error("[%s] Connection lost or failed: %s", self.name, e)
                        self.state = ConnectionState.RECONNECTING

                        # Exponential backoff with jitter
                        sleep_time = self._backoff_delay + random.uniform(0, 0.1 * self._backoff_delay)
                        logger.info("[%s] Reconnecting in %.2fs...", self.name, sleep_time)

                        try:
                            await asyncio.wait_for(self._stop_event.wait(), timeout=sleep_time)
                            break # Stop event set
                        except asyncio.TimeoutError:
                            pass # Continue to next reconnect attempt

                        self._backoff_delay = min(self._backoff_delay * 2, self.max_backoff)
                    else:
                        break
                finally:
                    self.ws = None
                    if self._heartbeat_task:
                        self._heartbeat_task.cancel()
                        self._heartbeat_task = None
        except asyncio.CancelledError:
            logger.info("[%s] Connection task cancelled", self.name)
        finally:
            self.state = ConnectionState.DISCONNECTED

    async def _heartbeat_loop(self):
        """Monitors connection liveness and sends heartbeats."""
        try:
            while self.state == ConnectionState.CONNECTED:
                await asyncio.sleep(self.heartbeat_interval)

                # Check for stale connection
                if time.time() - self._last_msg_time > self.stale_timeout:
                    logger.warning("[%s] Connection stale, no messages for %.1fs", self.name, self.stale_timeout)
                    if self.ws:
                        await self.ws.close()
                    break

                # Send heartbeat if payload is provided
                if self.heartbeat_payload and self.ws:
                    logger.debug("[%s] Sending heartbeat", self.name)
                    await self.ws.send(self.heartbeat_payload)

        except asyncio.CancelledError:
            pass
        except Exception as e:
            logger.error("[%s] Error in heartbeat loop: %s", self.name, e)

    def get_state(self) -> ConnectionState:
        return self.state
