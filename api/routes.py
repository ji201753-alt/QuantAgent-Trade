import json
import logging
from flask import Flask, request, jsonify
from flask_sock import Sock
from core.event_bus import EventBus
from common.models import SignalEvent

logger = logging.getLogger(__name__)

def register_routes(app: Flask, event_bus: EventBus):
    sock = Sock(app)

    @app.route('/health')
    def health():
        return jsonify({"status": "healthy", "core": "operational"})

    @sock.route('/ws')
    def websocket_bridge(ws):
        """
        Bridges the internal EventBus to the external frontend WebSocket.
        """
        async def event_forwarder(event):
            try:
                ws.send(json.dumps({
                    "type": type(event).__name__,
                    "data": str(event) # Simplified
                }))
            except Exception as e:
                logger.error(f"WS send error: {e}")

        # In a real implementation, we'd manage registration/deregistration
        # logic carefully. For now, this establishes the bridge.
        pass

    @app.route('/api/investigations', methods=['GET'])
    def list_investigations():
        return jsonify([])
