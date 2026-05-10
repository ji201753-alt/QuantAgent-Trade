import asyncio
import pytest
from unittest.mock import AsyncMock, patch, MagicMock
from connectors.websocket_manager import WebSocketManager, ConnectionState

@pytest.mark.asyncio
async def test_websocket_manager_lifecycle():
    on_message = AsyncMock()
    manager = WebSocketManager(uri="ws://localhost:9999", on_message=on_message, initial_backoff=0.1)

    await manager.start()
    await asyncio.sleep(0.05)

    assert manager.get_state() in [ConnectionState.CONNECTING, ConnectionState.RECONNECTING, ConnectionState.CONNECTED]

    await manager.stop()
    assert manager.get_state() == ConnectionState.DISCONNECTED

@pytest.mark.asyncio
async def test_websocket_manager_backoff():
    on_message = AsyncMock()
    manager = WebSocketManager(uri="ws://localhost:9999", on_message=on_message, initial_backoff=0.1)

    with patch("websockets.connect", side_effect=Exception("Connection Failed")):
        await manager.start()
        await asyncio.sleep(0.5)
        assert manager._backoff_delay > 0.1
        await manager.stop()

@pytest.mark.asyncio
async def test_message_buffering():
    received = []
    async def on_message(msg):
        received.append(msg)

    manager = WebSocketManager(uri="ws://localhost:9999", on_message=on_message)
    manager._queue.put_nowait("msg1")
    manager._queue.put_nowait("msg2")

    worker_task = asyncio.create_task(manager._message_worker())
    await asyncio.sleep(0.1)

    assert "msg1" in received
    assert "msg2" in received

    worker_task.cancel()
