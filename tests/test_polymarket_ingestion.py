import pytest
import asyncio
import json
from unittest.mock import AsyncMock, patch, MagicMock
from core.ingestion_service import PolymarketIngestionService
from core.event_bus import EventBus
from storage.batcher import DataBatcher
from common.models import OrderBookSnapshot, TradeEvent

@pytest.mark.asyncio
async def test_polymarket_ingestion_flow():
    bus = EventBus()
    repo = MagicMock()
    repo.save_trade = AsyncMock()
    repo.save_orderbook = AsyncMock()
    batcher = DataBatcher(repo, batch_size=1)

    asset_ids = ["TOKEN1"]
    service = PolymarketIngestionService(bus, batcher, asset_ids)

    # Simulate raw websocket messages
    book_msg = {
        "event_type": "book",
        "asset_id": "TOKEN1",
        "timestamp": "1778373446793",
        "bids": [{"price": "0.5", "size": "100"}],
        "asks": [{"price": "0.51", "size": "100"}]
    }

    trade_msg = {
        "event_type": "last_trade_price",
        "asset_id": "TOKEN1",
        "timestamp": "1778373448366",
        "price": "0.505",
        "size": "10",
        "side": "BUY"
    }

    # Verify normalization and routing
    await service._on_raw_data(book_msg)
    await service._on_raw_data(trade_msg)

    # We don't need to run the whole bus loop if we just want to check repo calls
    # since batcher calls repo immediately when batch_size=1

    assert repo.save_orderbook.called
    assert repo.save_trade.called

    # Check if they were published to bus
    assert bus.queue.qsize() == 2
