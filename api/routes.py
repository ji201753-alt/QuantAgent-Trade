import json
import logging
import asyncio
from datetime import datetime
from flask import Flask, request, jsonify, current_app
from flask_sock import Sock
from core.event_bus import EventBus
from common.models import TradeEvent, OrderBookSnapshot, SignalEvent, ForecastingOutput, OHLCV, MicrostructureFrame, MicrostructureSignal

logger = logging.getLogger(__name__)

def register_routes(app: Flask, event_bus: EventBus):
    sock = Sock(app)

    @app.route('/health')
    def health():
        return jsonify({"status": "healthy", "core": "operational"})

    @app.route('/runtime/telemetry')
    def runtime_telemetry():
        runtime_orchestrator = current_app.config.get("RUNTIME_ORCHESTRATOR")
        runtime = runtime_orchestrator.get_runtime_telemetry() if runtime_orchestrator else {}
        return jsonify({
            "event_bus": event_bus.get_telemetry(),
            "runtime_orchestrator": runtime,
        })

    @sock.route('/ws')
    def websocket_bridge(ws):
        """
        Bridges the internal async EventBus to the threaded Flask WebSocket.
        Uses a thread-safe approach to communicate between the internal async
        EventBus and the threaded Flask-Sock environment.
        """
        import queue
        bridge_queue = queue.Queue()

        def event_callback(event):
            bridge_queue.put(event)

        def serialize(value):
            from dataclasses import asdict, is_dataclass
            if is_dataclass(value):
                return serialize(asdict(value))
            if isinstance(value, datetime):
                return value.isoformat()
            if isinstance(value, list):
                return [serialize(item) for item in value]
            if isinstance(value, dict):
                return {key: serialize(item) for key, item in value.items()}
            return value

        # Register callbacks on the event bus
        event_bus.subscribe(SignalEvent, event_callback)
        event_bus.subscribe(TradeEvent, event_callback)
        event_bus.subscribe(OrderBookSnapshot, event_callback)
        event_bus.subscribe(ForecastingOutput, event_callback)
        event_bus.subscribe(OHLCV, event_callback)
        event_bus.subscribe(MicrostructureFrame, event_callback)
        event_bus.subscribe(MicrostructureSignal, event_callback)

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

                    data = serialize(event)

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
            event_bus.unsubscribe(ForecastingOutput, event_callback)
            event_bus.unsubscribe(OHLCV, event_callback)
            event_bus.unsubscribe(MicrostructureFrame, event_callback)
            event_bus.unsubscribe(MicrostructureSignal, event_callback)
            logger.info("Terminal WebSocket connection closed and unsubscribed")
