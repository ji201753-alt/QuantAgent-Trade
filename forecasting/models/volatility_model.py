import pandas as pd
from forecasting.base.interfaces import BaseForecaster
from common.models import ForecastingOutput

class VolatilityForecaster(BaseForecaster):
    def __init__(self): super().__init__("StatsVol")
    def load_model(self): pass
    async def predict(self, context, horizon):
        return [ForecastingOutput(symbol="BTC", timestamp=pd.Timestamp.now(), horizon=horizon, target_metric="volatility", prediction=0.01)]
