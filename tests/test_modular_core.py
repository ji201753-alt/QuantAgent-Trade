import pytest
import asyncio
from common.models import OHLCV, MarketSnapshot
from analytics.indicators import IndicatorCalculator
from connectors.base import MarketConnector
from connectors.adapters.binance import BinanceConnector
from orchestration.service import OrchestrationService
from datetime import datetime
import pandas as pd

def test_indicator_calculator():
    data = {
        "Close": [100.0, 101.0, 102.0, 103.0, 104.0, 105.0] * 5,
        "High": [106.0] * 30,
        "Low": [99.0] * 30
    }
    df = pd.DataFrame(data)
    rsi = IndicatorCalculator.compute_rsi(df, period=14)
    assert len(rsi) == 30
    assert isinstance(rsi, list)

def test_market_snapshot_creation():
    snapshot = MarketSnapshot(
        symbol="BTC/USDT",
        timestamp=datetime.now(),
        price=50000.0
    )
    assert snapshot.symbol == "BTC/USDT"
    assert snapshot.price == 50000.0

@pytest.mark.asyncio
async def test_orchestration_service():
    service = OrchestrationService()
    snapshot = MarketSnapshot(
        symbol="BTC/USDT",
        timestamp=datetime.now(),
        price=50000.0
    )
    signal = await service.process_market_event(snapshot)
    # By default, no factors added, so final_signal should be None or handle it
    assert signal is None

def test_binance_connector_interface():
    connector = BinanceConnector()
    assert isinstance(connector, MarketConnector)
