import numpy as np
from datetime import datetime
from typing import Any, Optional, List, Dict
from common.models import ImbalanceMetrics, LiquiditySnapshot, VolatilityMetrics, AnomalyEvent, ForecastingOutput
from signals.models import ProbabilisticSignal

class SignalFusionEngine:
    def __init__(self):
        self.last_imbalance = None
        self.last_liquidity = None
        self.last_volatility = None
        self.last_forecasts = []
        self.active_anomalies = []

    def update_state(self, event):
        if isinstance(event, ImbalanceMetrics): self.last_imbalance = event
        elif isinstance(event, LiquiditySnapshot): self.last_liquidity = event
        elif isinstance(event, VolatilityMetrics): self.last_volatility = event
        elif isinstance(event, AnomalyEvent): self.active_anomalies.append(event)
        elif isinstance(event, ForecastingOutput): self.last_forecasts.append(event)

    def fuse(self, symbol: str) -> ProbabilisticSignal:
        return ProbabilisticSignal(
            symbol=symbol,
            timestamp=datetime.now(),
            directional_pressure=0.5,
            confidence=0.8,
            uncertainty=0.2,
            regime_probabilities={"normal": 1.0},
            volatility_expansion_prob=0.1,
            liquidity_stress_prob=0.1,
            anomaly_confidence=0.0
        )
