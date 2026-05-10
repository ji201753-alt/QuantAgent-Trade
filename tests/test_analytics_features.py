import pytest
from datetime import datetime
from common.models import OHLCV, ImbalanceMetrics
from analytics.features import FeatureEngineer

def test_feature_engineer_export():
    engineer = FeatureEngineer(window_size=10)
    ts = datetime.now()
    ohlcv = OHLCV("BTC", ts, 100, 101, 99, 100.5, 10.0, "1m")
    imbalance = ImbalanceMetrics("BTC", ts, 0.5, 0.4, 1000, 500, 0.1)

    engineer.generate_features(ohlcv, imbalance=imbalance)

    df = engineer.export_vbt()
    assert not df.empty
    assert "imbalance_tob" in df.columns
    assert df.index.name == "timestamp"
    assert df.iloc[0]["close"] == 100.5
