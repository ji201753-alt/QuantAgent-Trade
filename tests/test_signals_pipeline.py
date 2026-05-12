import pytest
import asyncio
from datetime import datetime
from common.models import ForecastingOutput, ForecastDistribution
from signals.models import ProbabilisticSignal
from core.event_bus import EventBus
from signals.services.signal_service import SignalIntelligenceService

@pytest.mark.asyncio
async def test_signal_service_integration():
    bus = EventBus()
    service = SignalIntelligenceService(bus)
    await service.start()
    received = []
    bus.subscribe(ProbabilisticSignal, lambda e: received.append(e))
    bus_task = asyncio.create_task(bus.start())
    dist = ForecastDistribution(100, 1, 100, 98, 102)
    f = ForecastingOutput("BTC", datetime.now(), "1m", "price", 101, dist, (98, 102), 0.1, "TimesFM")
    await bus.publish(f)
    await asyncio.sleep(0.1)
    assert len(received) > 0
    bus_task.cancel()
    await service.stop()
