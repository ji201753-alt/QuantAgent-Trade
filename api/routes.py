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
        Uses a thread-safe approach to communicate between the internal async
        EventBus and the threaded Flask-Sock environment.
        """
        import queue
        from dataclasses import asdict, is_dataclass
        bridge_queue = queue.Queue()

        def event_callback(event):
            bridge_queue.put(event)

        # Register callbacks on the event bus
        event_bus.subscribe(SignalEvent, event_callback)
        event_bus.subscribe(TradeEvent, event_callback)
        event_bus.subscribe(OrderBookSnapshot, event_callback)

        try:
            # Initial State Sync
            ws.send(json.dumps({
                "type": "system_sync",
                "status": "ready",
                "version": "1.0.0"
            }))

            while True:
                try:
                    # Wait for next event from the bridge queue
                    event = bridge_queue.get(timeout=10)

                    # Proper JSON serialization for dataclasses
                    if is_dataclass(event):
                        data = asdict(event)
                        # Handle non-serializable types like datetime
                        for k, v in data.items():
                            if isinstance(v, datetime): data[k] = v.isoformat()
                    else:
                        data = str(event)

                    ws.send(json.dumps({
                        "type": type(event).__name__,
                        "data": data
                    }))
                except queue.Empty:
                    ws.send(json.dumps({"type": "heartbeat"}))
                except Exception as e:
                    logger.warning(f"WebSocket internal error: {e}")
                    break
        finally:
            # Prevent memory leak: Unregister callbacks on disconnect
            event_bus.unsubscribe(SignalEvent, event_callback)
            event_bus.unsubscribe(TradeEvent, event_callback)
            event_bus.unsubscribe(OrderBookSnapshot, event_callback)
            logger.info("Terminal WebSocket connection closed and unsubscribed")
