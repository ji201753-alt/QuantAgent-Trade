from flask import Flask
from api.routes import register_routes
from core.event_bus import EventBus

def create_app(event_bus: EventBus):
    app = Flask(__name__)
    register_routes(app, event_bus)
    return app
