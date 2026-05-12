import logging
from typing import Dict, List
from meta.models import OperationalAttention

logger = logging.getLogger(__name__)

class AttentionLearner:
    """
    Learns which market structures deserve operational attention.
    Calculates importance scores based on historical escalation and persistence.
    """
    def __init__(self):
        self.attention_history: List[OperationalAttention] = []

    def evaluate_attention(self, target_id: str, severity: float, persistence: float) -> OperationalAttention:
        # High severity and high persistence escalate importance
        score = (severity * 0.7) + (persistence * 0.3)

        reason = "Baseline monitoring"
        if score > 0.8: reason = "Critical structural escalation"
        elif score > 0.5: reason = "Elevated regime instability"

        attention = OperationalAttention(
            id=f"att_{target_id}",
            target_id=target_id,
            importance_score=float(score),
            escalation_reason=reason,
            historical_relevance=0.5 # Mock
        )
        self.attention_history.append(attention)
        return attention
