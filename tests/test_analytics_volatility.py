import pytest
from datetime import datetime
from analytics.volatility import VolatilityEngine

def test_volatility_engine():
    engine = VolatilityEngine(window_size=5)
    # Feed some prices
    prices = [100, 101, 99, 102, 100, 105]
    metrics = None
    for p in prices:
        metrics = engine.update("BTC", datetime.now(), p)

    assert metrics is not None
    assert metrics.realized_volatility > 0
    assert isinstance(metrics.is_spike, bool)
