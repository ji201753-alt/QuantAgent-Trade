import logging
from typing import List, Dict, Any
from reasoning.models import ReasoningExploration
from decision.models import DecisionIntelligence

logger = logging.getLogger(__name__)

class ExplorationAssistant:
    """
    Assists operators in exploring reasoning chains and conflicting signals.
    """
    def explore_decision(self, investigation_id: str, decision: DecisionIntelligence) -> ReasoningExploration:
        # 1. Evidence Chain
        evidence = [
            f"Consensus Score: {decision.consensus.agreement_score}",
            f"Overall Confidence: {decision.confidence.overall_confidence}",
            f"Dominant Hypothesis: {decision.consensus.dominant_hypothesis}"
        ]

        # 2. Conflicting Signals Analysis
        conflicts = "None"
        if decision.consensus.divergent_systems:
            conflicts = f"Disagreement found in: {', '.join(decision.consensus.divergent_systems)}"

        return ReasoningExploration(
            id=f"exp_{investigation_id}",
            investigation_id=investigation_id,
            evidence_chain=evidence,
            conflicting_signals_analysis=conflicts,
            consensus_explanation="Automated reconstruction of cross-system probabilistic agreement."
        )
