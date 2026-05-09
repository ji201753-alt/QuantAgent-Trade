from abc import ABC, abstractmethod
from typing import Any, Dict, List
import pandas as pd
from common.models import ForecastResult

class BaseForecaster(ABC):
    @abstractmethod
    def predict(self, data: pd.DataFrame, horizon: str) -> ForecastResult:
        pass

    @abstractmethod
    def train(self, data: pd.DataFrame):
        pass
