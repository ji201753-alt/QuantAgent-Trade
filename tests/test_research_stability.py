import pytest
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from analytics.features import FeatureEngineer
from research.vectorbt.pipeline import VBTResearchPipeline
from common.models import OHLCV

def test_vbt_pipeline_alignment_with_nans():
    engineer = FeatureEngineer(window_size=10)
    # Inject some data with missing features
    ts = datetime.now()
    ohlcv1 = OHLCV("BTC", ts, 100, 101, 99, 100.5, 10, "1m")
    engineer.generate_features(ohlcv1) # No imbalance

    ohlcv2 = OHLCV("BTC", ts + timedelta(minutes=1), 101, 102, 100, 101.5, 12, "1m")
    engineer.generate_features(ohlcv2)

    pipeline = VBTResearchPipeline(engineer)
    df = pipeline.get_dataset()

    assert not df.isnull().values.any()
    assert len(df) == 2

def test_vbt_pipeline_deterministic_sorting():
    engineer = FeatureEngineer(window_size=10)
    ts = datetime.now()
    # Insert out of order
    engineer.generate_features(OHLCV("BTC", ts + timedelta(minutes=1), 101, 102, 100, 101.5, 12, "1m"))
    engineer.generate_features(OHLCV("BTC", ts, 100, 101, 99, 100.5, 10, "1m"))

    pipeline = VBTResearchPipeline(engineer)
    df = pipeline.get_dataset()

    assert df.index[0] < df.index[1]
