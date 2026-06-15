import importlib
import importlib.util
import logging
import os
from pathlib import Path
from typing import Dict, List, Tuple

import numpy as np
import pandas as pd

from common.models import ForecastDistribution, ForecastingOutput
from forecasting.base.interfaces import BaseForecaster

logger = logging.getLogger(__name__)


class TimesFMForecaster(BaseForecaster):
    """
    Local TimesFM forecasting backend.

    This adapter only emits forecasts when the real `timesfm` package and local
    checkpoint are available. It never falls back to synthetic inference.
    """

    def __init__(self, context_len: int = 512, horizon_len: int = 128):
        super().__init__(model_name="TimesFM")
        self.context_len = context_len
        self.horizon_len = horizon_len
        self.model = None
        self.model_path: Path | None = None
        self.device = "UNKNOWN"
        self.backend = "cpu"

    def load_model(self) -> Tuple[bool, Dict]:
        logger.info("Validating TimesFM model prerequisites...")
        spec = importlib.util.find_spec("timesfm")
        if spec is None:
            self.model = None
            return False, {
                "status": "UNAVAILABLE",
                "reason": "MODEL_UNAVAILABLE",
                "device": "UNKNOWN",
                "timesfm_installed": False,
                "weights_available": False,
                "real_inference": False,
                "error": "timesfm package is not installed",
            }

        self.model_path = self._resolve_checkpoint_path()
        if self.model_path is None:
            self.model = None
            return False, {
                "status": "UNAVAILABLE",
                "reason": "WEIGHTS_MISSING",
                "device": "UNKNOWN",
                "timesfm_installed": True,
                "weights_available": False,
                "real_inference": False,
                "error": "Set TIMESFM_CHECKPOINT_PATH or place weights under checkpoints/timesfm-*",
            }

        timesfm_module = importlib.import_module("timesfm")
        device_state = self._detect_device()
        self.device = device_state["device"]
        self.backend = device_state["backend"]

        try:
            self.model = self._load_with_available_api(timesfm_module, self.model_path)
        except Exception as exc:
            self.model = None
            logger.exception("TimesFM model initialization failed")
            return False, {
                "status": "ERROR",
                "reason": "INITIALIZATION_FAILED",
                "device": self.device,
                "timesfm_installed": True,
                "weights_available": True,
                "real_inference": False,
                "fallback": device_state["fallback"],
                "error": str(exc),
            }

        return True, {
            "status": "FALLBACK_CPU_MODE" if device_state["fallback"] else "AVAILABLE",
            "reason": None,
            "device": self.device,
            "backend": self.backend,
            "timesfm_installed": True,
            "weights_available": True,
            "checkpoint_path": str(self.model_path),
            "fallback": device_state["fallback"],
            "real_inference": True,
            "error": None,
        }

    async def predict(self, context_data: pd.DataFrame, horizon: str) -> List[ForecastingOutput]:
        if context_data.empty or self.model is None:
            return []

        context = context_data.sort_index()
        values = context["close"].astype(float).tail(self.context_len).to_numpy()
        if values.size == 0:
            return []

        forecast_values, quantiles = self._forecast_values(values)
        if forecast_values.size == 0:
            return []

        symbol = str(context["symbol"].iloc[-1]) if "symbol" in context.columns else "UNKNOWN"
        timestamp = pd.Timestamp(context.index[-1]).to_pydatetime()
        horizons = [("1m", 0), ("5m", min(4, forecast_values.size - 1)), ("15m", min(14, forecast_values.size - 1))]
        outputs: List[ForecastingOutput] = []
        for label, idx in horizons:
            prediction = float(forecast_values[idx])
            distribution = None
            confidence_interval = None
            uncertainty = 0.0
            if quantiles is not None and np.asarray(quantiles).size > 0:
                q = np.asarray(quantiles)
                q_slice = q[0, idx] if q.ndim == 3 else q[idx]
                q_values = np.asarray(q_slice, dtype=float).flatten()
                if q_values.size >= 3:
                    p10 = float(np.nanmin(q_values))
                    p90 = float(np.nanmax(q_values))
                    median = float(np.nanmedian(q_values))
                    std = float(np.nanstd(q_values))
                    distribution = ForecastDistribution(mean=prediction, std=std, median=median, p10=p10, p90=p90)
                    confidence_interval = (p10, p90)
                    uncertainty = abs(p90 - p10) / max(abs(prediction), 1.0)
            outputs.append(ForecastingOutput(
                symbol=symbol,
                timestamp=timestamp,
                horizon=label,
                target_metric="price",
                prediction=prediction,
                distribution=distribution,
                confidence_interval=confidence_interval,
                uncertainty_score=float(min(max(uncertainty, 0.0), 1.0)),
                model_name="TimesFM",
                metadata={
                    "real_inference": True,
                    "device": self.device,
                    "checkpoint_path": str(self.model_path) if self.model_path else None,
                    "context_points": int(values.size),
                    "deterministic": True,
                },
            ))
        return outputs

    def _forecast_values(self, values: np.ndarray) -> tuple[np.ndarray, np.ndarray | None]:
        if hasattr(self.model, "forecast"):
            result = self.model.forecast([values], freq=[0])
            if isinstance(result, tuple):
                point_forecast = np.asarray(result[0], dtype=float)
                quantile_forecast = np.asarray(result[1], dtype=float) if len(result) > 1 else None
            else:
                point_forecast = np.asarray(result, dtype=float)
                quantile_forecast = None
            if point_forecast.ndim == 2:
                point_forecast = point_forecast[0]
            return point_forecast.flatten(), quantile_forecast

        if hasattr(self.model, "forecast_on_df"):
            df = pd.DataFrame({
                "unique_id": ["series"] * values.size,
                "ds": pd.date_range("2000-01-01", periods=values.size, freq="min"),
                "y": values,
            })
            result_df = self.model.forecast_on_df(df, freq="min", value_name="y", num_jobs=1)
            forecast_col = "timesfm" if "timesfm" in result_df.columns else result_df.select_dtypes("number").columns[-1]
            return result_df[forecast_col].astype(float).to_numpy(), None

        raise RuntimeError("Installed timesfm model exposes neither forecast nor forecast_on_df")

    def _load_with_available_api(self, timesfm_module, checkpoint_path: Path):
        checkpoint = str(checkpoint_path)

        if hasattr(timesfm_module, "TimesFM_2p5_200M_torch"):
            model = timesfm_module.TimesFM_2p5_200M_torch.from_pretrained(checkpoint)
            if hasattr(model, "compile") and hasattr(timesfm_module, "ForecastConfig"):
                config = timesfm_module.ForecastConfig(max_context=self.context_len, max_horizon=self.horizon_len)
                model.compile(config)
            return model

        if hasattr(timesfm_module, "TimesFm"):
            model = timesfm_module.TimesFm(
                context_len=self.context_len,
                horizon_len=self.horizon_len,
                input_patch_len=32,
                output_patch_len=128,
                num_layers=20,
                model_dims=1280,
                backend=self.backend,
            )
            try:
                model.load_from_checkpoint(checkpoint_path=checkpoint)
            except TypeError:
                model.load_from_checkpoint(repo_id=checkpoint)
            return model

        raise RuntimeError("Unsupported timesfm package API")

    def _resolve_checkpoint_path(self) -> Path | None:
        candidates = [
            os.environ.get("TIMESFM_CHECKPOINT_PATH"),
            os.environ.get("TIMESFM_CHECKPOINT"),
            "checkpoints/timesfm-2.5-200m-pytorch",
            "checkpoints/timesfm-2.0-500m-pytorch",
            "checkpoints/timesfm-1.0-200m",
        ]
        for candidate in candidates:
            if not candidate:
                continue
            path = Path(candidate).expanduser()
            if path.exists():
                return path
        return None

    def _detect_device(self) -> Dict:
        if importlib.util.find_spec("torch") is not None:
            torch = importlib.import_module("torch")
            if torch.cuda.is_available():
                return {"device": torch.cuda.get_device_name(0), "backend": "gpu", "fallback": False}
        return {"device": "CPU", "backend": "cpu", "fallback": True}
