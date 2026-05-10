import asyncio
import pytest
from unittest.mock import AsyncMock, patch, MagicMock
from connectors.websocket_manager import WebSocketManager, ConnectionState

@pytest.mark.asyncio
async def test_websocket_manager_cancellation_during_backoff():
    on_message = AsyncMock()
    manager = WebSocketManager(uri="ws://localhost:9999", on_message=on_message, initial_backoff=5.0)

    with patch("websockets.connect", side_effect=Exception("Connection Failed")):
        await manager.start()
        await asyncio.sleep(0.2)
        assert manager.get_state() == ConnectionState.RECONNECTING

        start_time = asyncio.get_event_loop().time()
        await manager.stop()
        end_time = asyncio.get_event_loop().time()

        assert end_time - start_time < 1.0
        assert manager.get_state() == ConnectionState.DISCONNECTED

@pytest.mark.asyncio
async def test_websocket_stale_detection():
    on_message = AsyncMock()
    manager = WebSocketManager(uri="ws://localhost:9999", on_message=on_message, heartbeat_interval=0.1, stale_timeout=0.2)

    mock_ws = AsyncMock()
    mock_ws.close = AsyncMock()

    async def mock_iter(self):
        await asyncio.sleep(1.0)
        yield "never"

    mock_ws.__aiter__ = mock_iter

    class MockContextManager:
        async def __aenter__(self): return mock_ws
        async def __aexit__(self, *args): pass

    with patch("websockets.connect", return_value=MockContextManager()):
        await manager.start()
        await asyncio.sleep(0.5)
        assert mock_ws.close.called
        await manager.stop()
