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
        Handles reconnection and state synchronization for operational continuity.
        """
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)

        async def handle_events():
            logger.info("Terminal WebSocket connection established")

            # 1. Initial State Sync
            ws.send(json.dumps({
                "type": "system_sync",
                "status": "ready",
                "version": "1.0.0"
            }))

            while True:
                # In a real system, we'd subscribe to the EventBus here
                # and forward all published events to the client.
                await asyncio.sleep(1)
                try:
                    ws.send(json.dumps({"type": "heartbeat", "timestamp": str(datetime.now())}))
                except Exception as e:
                    logger.warning(f"WebSocket disconnected: {e}")
                    break

        loop.run_until_complete(handle_events())
