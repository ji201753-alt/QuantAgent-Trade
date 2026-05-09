import pytest
import asyncio
from core.engine import MarketIntelligenceEngine
from connectors.adapters.binance import BinanceConnector
from orchestration.service import OrchestrationService
from storage.backends.sqlite import SQLiteRepository

@pytest.mark.asyncio
async def test_engine_lifecycle():
    connector = BinanceConnector()
    orchestrator = OrchestrationService()
    repository = SQLiteRepository(":memory:")
    await repository.initialize()

    engine = MarketIntelligenceEngine([connector], orchestrator, repository)

    await engine.start()
    assert engine.is_running is True

    await engine.stop()
    assert engine.is_running is False
