from flask import Flask, jsonify, request

def create_app(engine):
    app = Flask(__name__)

    @app.route("/status", methods=["GET"])
    def get_status():
        return jsonify({
            "status": "running" if engine.is_running else "stopped",
            "connectors": len(engine.connectors)
        })

    @app.route("/signals", methods=["GET"])
    def get_signals():
        # Placeholder for returning recent signals
        return jsonify([])

    return app
