import pytest
import asyncio
from datetime import datetime
from macro.correlation.engine import CrossMarketCorrelationEngine
from macro.propagation.tracker import InformationFlowTracker
from common.models import AnomalyEvent

def test_cross_market_correlation():
    engine = CrossMarketCorrelationEngine(window_size=5)
    # Market 1
    for p in [100, 101, 102, 103, 104]:
        engine.update_market("BTC", p)
    # Market 2 (Correlated)
    for p in [50, 51, 52, 53, 54]:
        engine.update_market("ETH", p)

    corr = engine.compute_pair_correlation("BTC", "ETH")
    assert corr is not None
    assert corr.correlation_coefficient > 0.9

def test_propagation_tracking():
    tracker = InformationFlowTracker(window_seconds=5)
    # Anomaly in Market A
    tracker.track_anomaly(AnomalyEvent("BTC", datetime.now(), "vol", 1.0, "high", "desc"))
    # Followed by Market B
    contagions = tracker.track_anomaly(AnomalyEvent("ETH", datetime.now(), "vol", 1.0, "high", "desc"))

    assert len(contagions) > 0
    assert contagions[0].source_market == "BTC"
    assert "ETH" in contagions[0].target_markets
