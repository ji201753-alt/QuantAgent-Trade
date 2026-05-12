import pytest
import json
from unittest.mock import MagicMock
from api.routes import create_app

def test_api_status_endpoint():
    engine = MagicMock()
    engine.is_running = True
    engine.connectors = []
    bus = MagicMock()

    app, bridge = create_app(engine, bus)
    client = app.test_client()

    resp = client.get('/status')
    assert resp.status_code == 200
    data = resp.get_json()
    assert data['status'] == 'running'
    assert 'clients' in data

def test_websocket_bridge_broadcast():
    engine = MagicMock()
    bus = MagicMock()
    app, bridge = create_app(engine, bus)

    # Mock a client
    mock_client = MagicMock()
    bridge.add_client(mock_client)

    event = {"type": "test_event", "value": 42}
    bridge.broadcast(event)

    assert mock_client.send.called
    payload = mock_client.send.call_args[0][0]
    assert json.loads(payload)['type'] == "test_event"
