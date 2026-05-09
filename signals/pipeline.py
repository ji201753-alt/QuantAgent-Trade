from typing import List, Dict, Any
from common.models import SignalEvent, MarketSnapshot
from datetime import datetime

class SignalPipeline:
    def __init__(self):
        self.factors = []

    def add_factor(self, factor_fn):
        self.factors.append(factor_fn)

    def generate_signals(self, snapshot: MarketSnapshot) -> List[SignalEvent]:
        signals = []
        for factor in self.factors:
            signal = factor(snapshot)
            if signal:
                signals.append(signal)
        return signals

    def evaluate_multi_factor(self, signals: List[SignalEvent]) -> SignalEvent:
        if not signals:
            return None

        # Simple weighted average of confidence for example
        avg_confidence = sum(s.confidence for s in signals) / len(signals)

        # Determine consensus direction
        directions = [s.direction for s in signals]
        consensus_direction = max(set(directions), key=directions.count)

        return SignalEvent(
            symbol=signals[0].symbol,
            timestamp=datetime.now(),
            signal_type="multi_factor_consensus",
            direction=consensus_direction,
            confidence=avg_confidence,
            source="signal_pipeline"
        )

class ConfidenceScorer:
    @staticmethod
    def score(signal: SignalEvent, market_volatility: float) -> float:
        # Adjust confidence based on market conditions
        if market_volatility > 0.05:  # High vol
            return signal.confidence * 0.8
        return signal.confidence
