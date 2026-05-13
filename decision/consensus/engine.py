import numpy as np
from datetime import datetime
from typing import List, Dict, Any, Optional
from common.models import ForecastingOutput, AnomalyEvent
from signals.models import ProbabilisticSignal
from decision.models import ConsensusState

class ConsensusIntelligenceEngine:
    """
    Measures agreement and divergence between multiple intelligence systems.
    Identifies dominant hypotheses and calculates coherence indices.
    """
    def __init__(self):
        self.last_signals: List[ProbabilisticSignal] = []
        self.last_forecasts: List[ForecastingOutput] = []

    def update_intelligence(self, item: Any):
        if isinstance(item, ProbabilisticSignal):
            self.last_signals.append(item)
            if len(self.last_signals) > 10: self.last_signals.pop(0)
        elif isinstance(item, ForecastingOutput):
            self.last_forecasts.append(item)
            if len(self.last_forecasts) > 10: self.last_forecasts.pop(0)

    def evaluate_consensus(self, symbol: str) -> ConsensusState:
        if not self.last_signals or not self.last_forecasts:
            return ConsensusState(symbol, datetime.now(), 0.5, [], "insufficient_data", 0.0)

        # 1. Measure Directional Alignment
        sig_dir = np.mean([s.directional_pressure for s in self.last_signals])
        f_dir = np.mean([f.prediction for f in self.last_forecasts if f.target_metric == "price"])

        # Agreement score based on sign match and magnitude correlation
        agreement = 1.0 if np.sign(sig_dir) == np.sign(f_dir) else 0.0

        divergent = []
        if agreement == 0:
            divergent = ["forecasting", "signals"]

        return ConsensusState(
            symbol=symbol,
            timestamp=datetime.now(),
            agreement_score=float(agreement),
            divergent_systems=divergent,
            dominant_hypothesis="bullish" if sig_dir > 0 else "bearish",
            coherence_index=float(abs(sig_dir + f_dir) / 2.0)
        )
