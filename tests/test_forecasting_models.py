import pytest
import pandas as pd
from datetime import datetime
from forecasting.models.volatility_model import VolatilityForecaster
from forecasting.models.regime_model import RegimeForecaster

@pytest.mark.asyncio
async def test_volatility_forecaster():
    model = VolatilityForecaster()
    df = pd.DataFrame({"vol_realized": [0.01]*5, "symbol": ["BTC"]*5})
    df.index = pd.date_range(datetime.now(), periods=5, freq="1min")
    results = await model.predict(df, "m")
    assert len(results) > 0

@pytest.mark.asyncio
async def test_regime_forecaster():
    model = RegimeForecaster()
    df = pd.DataFrame({"regime_micro": [0]*5, "liq_spread": [0.1, 0.2, 0.3, 0.4, 0.5], "vol_realized": [0.01, 0.02, 0.03, 0.04, 0.05], "symbol": ["BTC"]*5})
    df.index = pd.date_range(datetime.now(), periods=5, freq="1min")
    results = await model.predict(df, "m")
    assert len(results) == 1
