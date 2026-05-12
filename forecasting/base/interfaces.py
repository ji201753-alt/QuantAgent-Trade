from abc import ABC, abstractmethod
from typing import List, Optional, Any
import pandas as pd
from common.models import ForecastingOutput

class BaseForecaster(ABC):
    """
    Abstract base class for all forecasting models.
    Supports lazy loading and incremental inference.
    """
    def __init__(self, model_name: str):
        self.model_name = model_name
        self._is_loaded = False

    @abstractmethod
    def load_model(self):
        """Lazy load model weights or artifacts."""
        pass

    @abstractmethod
    async def predict(self, context_data: pd.DataFrame, horizon: str) -> List[ForecastingOutput]:
        """Perform inference on the provided context."""
        pass

    def ensure_loaded(self):
        if not self._is_loaded:
            self.load_model()
            self._is_loaded = True
