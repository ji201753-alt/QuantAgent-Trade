import json
import logging
import asyncio
from flask import Flask, jsonify, request
from flask_sock import Sock

logger = logging.getLogger(__name__)

class WebSocketBridge:
    def __init__(self):
        self.clients = set()
        self.loop = asyncio.get_event_loop()

    def add_client(self, ws):
        self.clients.add(ws)
        logger.info(f"Client connected. Total: {len(self.clients)}")

    def remove_client(self, ws):
        if ws in self.clients:
            self.clients.remove(ws)
            logger.info(f"Client disconnected. Total: {len(self.clients)}")

    def broadcast(self, event):
        """Bridge between async EventBus and blocking WS sends."""
        # This will be called from EventBus subscribers (async context)
        payload = json.dumps(event, default=lambda x: str(x))
        for client in list(self.clients):
            try:
                client.send(payload)
            except Exception as e:
                logger.error(f"Failed to send to client: {e}")
                self.remove_client(client)

def create_app(engine, event_bus):
    app = Flask(__name__)
    sock = Sock(app)
    bridge = WebSocketBridge()

    # Bridge EventBus to WebSocket
    async def event_subscriber(event):
        bridge.broadcast(event)

    # In a real startup, we'd ensure this subscription happens
    # event_bus.subscribe(object, event_subscriber)

    @app.route("/status", methods=["GET"])
    def get_status():
        return jsonify({
            "status": "running" if engine.is_running else "stopped",
            "connectors": len(engine.connectors),
            "clients": len(bridge.clients)
        })

    @sock.route("/ws")
    def stream_events(ws):
        bridge.add_client(ws)
        try:
            while True:
                data = ws.receive()
                if data == "ping":
                    ws.send("pong")
        except Exception:
            pass
        finally:
            bridge.remove_client(ws)

    return app, bridge
