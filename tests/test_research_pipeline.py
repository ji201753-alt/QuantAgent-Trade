import pytest
import pandas as pd
from datetime import datetime, timedelta
from analytics.features import FeatureEngineer
from research.vectorbt.pipeline import VBTResearchPipeline
from research.factors.analyzer import FactorAnalyzer
from common.models import OHLCV

def test_research_dataset_export():
    engineer = FeatureEngineer(window_size=30)
    for i in range(20):
        ts = datetime.now() + timedelta(minutes=i)
        ohlcv = OHLCV("BTC", ts, 100+i, 101+i, 99+i, 100.5+i, 10, "1m")
        engineer.generate_features(ohlcv)

    pipeline = VBTResearchPipeline(engineer)
    df = pipeline.get_dataset()
    assert len(df) == 20

    backtest_data = pipeline.prepare_backtest_data()
    assert "price" in backtest_data
    assert "features" in backtest_data

def test_factor_analysis():
    df = pd.DataFrame({
        "close": [10, 11, 10.5, 12, 11.5, 13, 12.5, 14],
        "factor": [1, 2, 1.5, 3, 2.5, 4, 3.5, 5]
    })
    df.index = pd.date_range(datetime.now(), periods=len(df), freq="1min")

    corrs = FactorAnalyzer.compute_rolling_correlations(df, window=5)
    assert not corrs.empty

    significance = FactorAnalyzer.test_factor_significance(df, "factor")
    assert "forward_correlation" in significance
