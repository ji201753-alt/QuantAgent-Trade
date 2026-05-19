import asyncio
import logging
import time
from typing import List, Dict, Optional
from common.models import ForecastingOutput
from forecasting.timesfm.model import TimesFMForecaster

logger = logging.getLogger(__name__)

class TimesFMRuntimeBridge:
    """
    Orchestrates local TimesFM inference, managing model lifecycles and diagnostics.
    """
    def __init__(self):
        self.forecaster = TimesFMForecaster()
        self.is_loaded = False
        self.metrics = {
            "latency_ms": 0,
            "status": "IDLE",
            "device": "PENDING"
        }

    async def initialize(self):
        if self.is_loaded: return
        logger.info("Initializing TimesFM Runtime Engine...")
        self.forecaster.load_model()
        self.is_loaded = True
        self.metrics["status"] = "ACTIVE"
        self.metrics["device"] = "GPU"

    async def run_inference(self, context_data) -> List[ForecastingOutput]:
        if not self.is_loaded: await self.initialize()
        start = time.time()
        results = await self.forecaster.predict(context_data, "1m")
        self.metrics["latency_ms"] = (time.time() - start) * 1000
        return results

    def get_diagnostics(self) -> Dict:
        return self.metrics
