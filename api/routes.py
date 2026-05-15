import json
import logging
import asyncio
from datetime import datetime
from flask import Flask, request, jsonify
from flask_sock import Sock
from core.event_bus import EventBus
from common.models import TradeEvent, OrderBookSnapshot, SignalEvent

logger = logging.getLogger(__name__)

def register_routes(app: Flask, event_bus: EventBus):
    sock = Sock(app)

    @app.route('/health')
    def health():
        return jsonify({"status": "healthy", "core": "operational"})

    @sock.route('/ws')
    def websocket_bridge(ws):
        """
        Bridges the internal async EventBus to the threaded Flask WebSocket.
        Handles reconnection and state synchronization for operational continuity.
        """
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)

        async def handle_events():
            logger.info("Terminal WebSocket connection established")

            # Create a localized bridge queue
            client_queue = asyncio.Queue()

            # Define the callback to be registered with the EventBus
            async def event_callback(event):
                await client_queue.put(event)

            # Subscribe to all major event types to stream to the terminal
            event_bus.subscribe(SignalEvent, event_callback)
            event_bus.subscribe(TradeEvent, event_callback)
            event_bus.subscribe(OrderBookSnapshot, event_callback)

            # 1. Initial State Sync
            ws.send(json.dumps({
                "type": "system_sync",
                "status": "ready",
                "version": "1.0.0"
            }))

            while True:
                try:
                    # Wait for next event from the EventBus
                    event = await client_queue.get()
                    ws.send(json.dumps({
                        "type": type(event).__name__,
                        "data": str(event) # Simplified serialization
                    }))
                except Exception as e:
                    logger.warning(f"WebSocket disconnected: {e}")
                    break

        loop.run_until_complete(handle_events())
