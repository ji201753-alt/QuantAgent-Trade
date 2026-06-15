import asyncio
import logging
from typing import Any, Callable, Dict, List, Type
from collections import defaultdict

logger = logging.getLogger(__name__)

class EventBus:
    def __init__(self):
        self.subscribers: Dict[Type, List[Callable]] = defaultdict(list)
        self.queue = asyncio.Queue()
        self._running = False
        self._stop_event = asyncio.Event()
        self._dispatcher_task: asyncio.Task | None = None
        self._metrics = {
            "published_total": 0,
            "processed_total": 0,
            "callback_errors": 0,
            "max_queue_size": 0,
        }

    def subscribe(self, event_type: Type, callback: Callable):
        self.subscribers[event_type].append(callback)
        logger.debug(f"Subscribed to {event_type.__name__}")

    def unsubscribe(self, event_type: Type, callback: Callable):
        if callback in self.subscribers[event_type]:
            self.subscribers[event_type].remove(callback)
            logger.debug(f"Unsubscribed from {event_type.__name__}")

    async def publish(self, event: Any):
        if not self._running and self._stop_event.is_set():
            logger.warning("Dropping event publish after EventBus stop")
            return
        await self.queue.put(event)
        self._metrics["published_total"] += 1
        self._metrics["max_queue_size"] = max(self._metrics["max_queue_size"], self.queue.qsize())

    async def _dispatch_loop(self):
        logger.info("Event Bus started")
        while not self._stop_event.is_set() or not self.queue.empty():
            event = await self.queue.get()
            event_type = type(event)
            callbacks = self.subscribers.get(event_type, [])

            tasks = []
            for callback in callbacks:
                if asyncio.iscoroutinefunction(callback):
                    tasks.append(asyncio.create_task(callback(event)))
                else:
                    try:
                        callback(event)
                    except Exception as e:
                        self._metrics["callback_errors"] += 1
                        logger.error(f"Error in callback for {event_type.__name__}: {e}")

            if tasks:
                await asyncio.gather(*tasks, return_exceptions=True)

            self._metrics["processed_total"] += 1
            self.queue.task_done()

    async def start(self):
        if self._running:
            return
        self._running = True
        self._stop_event.clear()
        self._dispatcher_task = asyncio.create_task(self._dispatch_loop())
        try:
            await self._dispatcher_task
        finally:
            self._running = False

    async def stop(self):
        logger.info("Event Bus stopping")
        self._stop_event.set()
        if self._dispatcher_task and not self._dispatcher_task.done():
            await self.queue.put(None)
            await self._dispatcher_task
        self._running = False

    def get_telemetry(self) -> Dict[str, Any]:
        return {
            "running": self._running,
            "queue_depth": self.queue.qsize(),
            "subscriber_counts": {getattr(k, "__name__", str(k)): len(v) for k, v in self.subscribers.items()},
            **self._metrics,
        }
