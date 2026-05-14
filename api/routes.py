import json
import logging
import asyncio
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
        """
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)

        async def handle_events():
            # In a real implementation, we'd use a shared queue or
            # register a callback that pushes to the WS
            while True:
                # Placeholder for event broadcast logic
                await asyncio.sleep(1)
                try:
                    ws.send(json.dumps({"type": "heartbeat", "timestamp": str(datetime.now())}))
                except:
                    break

        loop.run_until_complete(handle_events())
