import pytest
import asyncio
from datetime import datetime
from common.models import VolatilityMetrics
from signals.models import IntelligentAlert
from core.event_bus import EventBus
from analytics.services.alert_service import AlertIntelligenceService

@pytest.mark.asyncio
async def test_alert_generation():
    bus = EventBus()
    service = AlertIntelligenceService(bus)
    await service.start()
    received = []
    bus.subscribe(IntelligentAlert, lambda e: received.append(e))
    bus_task = asyncio.create_task(bus.start())
    vol = VolatilityMetrics("BTC", datetime.now(), 0.05, 0.04, is_spike=True)
    await bus.publish(vol)
    await asyncio.sleep(0.1)
    assert len(received) > 0
    bus_task.cancel()
