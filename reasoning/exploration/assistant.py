import logging
from typing import List, Dict, Any
from reasoning.models import ReasoningExploration
from decision.models import DecisionIntelligence
from context.models.schemas import MarketContext

logger = logging.getLogger(__name__)

class ExplorationAssistant:
    """
    Assists operators in exploring reasoning chains, conflicting signals,
    and investigation-linked summaries.
    """
    def explore_decision(self, investigation_id: str, decision: DecisionIntelligence) -> ReasoningExploration:
        evidence = [
            f"Consensus Score: {decision.consensus.agreement_score}",
            f"Overall Confidence: {decision.confidence.overall_confidence}",
            f"Dominant Hypothesis: {decision.consensus.dominant_hypothesis}"
        ]

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

    def summarize_replay_interval(self, contexts: List[MarketContext]) -> str:
        """Summarizes a set of contextual states for a replay briefing."""
        if not contexts: return "No contextual data for this interval."

        regimes = set(c.regime.primary_regime for c in contexts)
        return f"Replay interval captured transitions across {len(regimes)} regimes: {', '.join(regimes)}."
