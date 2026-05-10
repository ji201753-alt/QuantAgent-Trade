import pytest
import asyncio
from datetime import datetime
from unittest.mock import MagicMock, AsyncMock
from common.models import OrderBookSnapshot, OrderBookLevel, TradeEvent, ImbalanceMetrics
from core.event_bus import EventBus
from analytics.services.microstructure_service import MicrostructureAnalyticsService

@pytest.mark.asyncio
async def test_analytics_pipeline_integration():
    bus = EventBus()
    repo = MagicMock()
    service = MicrostructureAnalyticsService(bus, repo)

    await service.start()

    received_metrics = []
    bus.subscribe(ImbalanceMetrics, lambda e: received_metrics.append(e))

    bus_task = asyncio.create_task(bus.start())

    book = OrderBookSnapshot(
        symbol="BTC",
        timestamp=datetime.now(),
        bids=[OrderBookLevel(100, 10)],
        asks=[OrderBookLevel(101, 5)]
    )
    await bus.publish(book)

    await asyncio.sleep(0.1)

    assert len(received_metrics) > 0
    assert received_metrics[0].symbol == "BTC"

    bus_task.cancel()
