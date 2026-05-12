import pytest
import asyncio
from datetime import datetime
from unittest.mock import MagicMock
from core.event_bus import EventBus
from context.models.schemas import MarketContext, RegimeInterpretation
from meta.services.meta_service import MetaIntelligenceService
from meta.models import MarketEvolution, OperationalAttention

@pytest.mark.asyncio
async def test_meta_service_integration():
    bus = EventBus()
    service = MetaIntelligenceService(bus)
    await service.start()

    received_evo = []
    bus.subscribe(MarketEvolution, lambda e: received_evo.append(e))

    bus_task = asyncio.create_task(bus.start())

    regime = RegimeInterpretation("BTC", datetime.now(), "vol_expansion", 0.9, "desc", [])
    ctx = MarketContext("BTC", datetime.now(), regime, "high", "sum", 0.1, 0.9, [])
    await bus.publish(ctx)

    await asyncio.sleep(0.1)

    assert len(received_evo) > 0
    assert "vol_expansion" in received_evo[0].transition_path

    bus_task.cancel()
    await service.stop()
