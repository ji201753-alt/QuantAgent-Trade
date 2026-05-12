import pandas as pd
from forecasting.base.interfaces import BaseForecaster
from common.models import ForecastingOutput

class RegimeForecaster(BaseForecaster):
    def __init__(self): super().__init__("RegimeShift")
    def load_model(self): pass
    async def predict(self, context, horizon):
        return [ForecastingOutput(symbol="BTC", timestamp=pd.Timestamp.now(), horizon=horizon, target_metric="regime", prediction=0.1)]
