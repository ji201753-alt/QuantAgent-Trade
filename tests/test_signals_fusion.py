import pytest
from datetime import datetime
from common.models import ImbalanceMetrics, ForecastingOutput, ForecastDistribution
from signals.fusion.engine import SignalFusionEngine
from signals.models import ProbabilisticSignal

def test_signal_fusion_basic():
    engine = SignalFusionEngine()
    imbalance = ImbalanceMetrics("BTC", datetime.now(), 0.5, 0.4, 1000, 500, 0.1)
    engine.update_state(imbalance)
    dist = ForecastDistribution(105, 1, 105, 103, 107)
    f = ForecastingOutput("BTC", datetime.now(), "1m", "price", 105, dist, (103, 107), 0.2, "model1")
    engine.update_state(f)
    signal = engine.fuse("BTC")
    assert isinstance(signal, ProbabilisticSignal)

def test_regime_aware_fusion():
    engine = SignalFusionEngine()
    from common.models import VolatilityMetrics
    vol = VolatilityMetrics("BTC", datetime.now(), 0.05, 0.05, is_spike=True)
    engine.update_state(vol)
    signal = engine.fuse("BTC")
    assert signal.volatility_expansion_prob > 0.5
