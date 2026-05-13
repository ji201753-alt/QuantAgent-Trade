import pytest
import asyncio
from datetime import datetime
from core.event_bus import EventBus
from signals.models import ProbabilisticSignal
from common.models import ForecastingOutput, ForecastDistribution
from decision.models import DecisionIntelligence
from decision.services.decision_service import DecisionCognitionService

@pytest.mark.asyncio
async def test_decision_service_integration():
    bus = EventBus()
    service = DecisionCognitionService(bus)
    await service.start()

    received_decisions = []
    bus.subscribe(DecisionIntelligence, lambda e: received_decisions.append(e))

    bus_task = asyncio.create_task(bus.start())

    # Inject intelligence
    sig = ProbabilisticSignal("BTC", datetime.now(), 0.5, 0.8, 0.2, {}, 0.1, 0.1, 0.0)
    await bus.publish(sig)

    dist = ForecastDistribution(105, 1, 105, 103, 107)
    f = ForecastingOutput("BTC", datetime.now(), "1m", "price", 105, dist, (103, 107), 0.2, "model1")
    await bus.publish(f)

    await asyncio.sleep(0.1)

    assert len(received_decisions) > 0
    assert received_decisions[-1].symbol == "BTC"
    assert received_decisions[-1].consensus.agreement_score == 1.0

    bus_task.cancel()
    await service.stop()
