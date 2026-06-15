import logging
import time
from typing import Dict, List

from common.models import ForecastingOutput
from forecasting.timesfm.model import TimesFMForecaster

logger = logging.getLogger(__name__)


class TimesFMRuntimeBridge:
    """
    Orchestrates local TimesFM inference, managing model lifecycle and diagnostics.
    """
    def __init__(self):
        self.forecaster = TimesFMForecaster()
        self.is_loaded = False
        self.last_inference_ts: float | None = None
        self.metrics = {
            "latency_ms": 0,
            "status": "UNAVAILABLE",
            "reason": "NOT_INITIALIZED",
            "device": "PENDING",
            "backend": "UNKNOWN",
            "error": None,
            "fallback": False,
            "timesfm_installed": False,
            "weights_available": False,
            "stale_inference": True,
            "real_inference": False,
            "deterministic": True,
        }

    async def initialize(self):
        if self.is_loaded:
            return
        logger.info("Initializing TimesFM Runtime Engine...")
        loaded, state = self.forecaster.load_model()
        self.metrics.update(state)
        self.is_loaded = loaded

    async def run_inference(self, context_data) -> List[ForecastingOutput]:
        if not self.is_loaded:
            await self.initialize()
        if not self.is_loaded:
            self.metrics["stale_inference"] = True
            return []
        start = time.time()
        try:
            results = await self.forecaster.predict(context_data, "1m")
        except Exception as exc:
            logger.exception("TimesFM inference failed")
            self.metrics.update({
                "status": "ERROR",
                "reason": "INFERENCE_FAILED",
                "error": str(exc),
                "stale_inference": True,
                "real_inference": False,
            })
            return []
        self.metrics["latency_ms"] = (time.time() - start) * 1000
        self.last_inference_ts = time.time()
        self.metrics["stale_inference"] = False
        if self.metrics.get("status") == "STALE_INFERENCE":
            self.metrics["status"] = "FALLBACK_CPU_MODE" if self.metrics.get("fallback") else "AVAILABLE"
        self.metrics["real_inference"] = True
        return results

    def get_diagnostics(self) -> Dict:
        if self.last_inference_ts is not None and (time.time() - self.last_inference_ts) > 30:
            self.metrics["stale_inference"] = True
            if self.metrics.get("real_inference"):
                self.metrics["status"] = "STALE_INFERENCE"
        return self.metrics


_SHARED_TIMESFM_RUNTIME = TimesFMRuntimeBridge()


def get_timesfm_runtime() -> TimesFMRuntimeBridge:
    return _SHARED_TIMESFM_RUNTIME
