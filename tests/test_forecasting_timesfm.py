import pytest
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from forecasting.timesfm.model import TimesFMForecaster

@pytest.mark.asyncio
async def test_timesfm_lazy_loading():
    forecaster = TimesFMForecaster()
    assert forecaster._is_loaded is False

    # Context data
    df = pd.DataFrame({
        "close": [100 + i for i in range(10)],
        "symbol": ["BTC"] * 10
    })
    df.index = pd.date_range(datetime.now(), periods=10, freq="1min")

    results = await forecaster.predict(df, "m")
    assert forecaster._is_loaded is True
    assert len(results) == 3
    assert results[0].model_name == "TimesFM"
    assert results[0].distribution is not None
