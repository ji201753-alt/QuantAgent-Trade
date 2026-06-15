from flask import Flask
from api.routes import register_routes
from core.event_bus import EventBus

def create_app(event_bus: EventBus, runtime_orchestrator=None):
    app = Flask(__name__)
    app.config["RUNTIME_ORCHESTRATOR"] = runtime_orchestrator
    register_routes(app, event_bus)
    return app
