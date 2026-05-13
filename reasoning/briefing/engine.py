from datetime import datetime
from typing import Optional
from context.models.schemas import MarketContext
from decision.models import DecisionIntelligence
from reasoning.models import OperationalBriefing

class BriefingEngine:
    """
    Generates operational briefings by synthesizing quantified intelligence.
    Grounded strictly in existing contextual and decision data.
    """
    def generate_briefing(self, context: MarketContext, decision: DecisionIntelligence) -> OperationalBriefing:
        # 1. Grounded Context Summary
        summary = f"Regime: {context.regime.primary_regime.upper()}. {context.situational_summary}"

        # 2. Instability Notes
        instability = "Stable"
        if decision.confidence.is_collapsing: instability = "CRITICAL_COLLAPSE_RISK"
        elif decision.operational_pressure > 0.7: instability = "ELEVATED_DECISION_PRESSURE"

        # 3. Uncertainty Landscape
        uncertainty = f"Aggregated uncertainty at {context.aggregated_uncertainty:.2f}. "
        if decision.consensus.agreement_score < 0.5:
            uncertainty += f"Systemic disagreement detected between {', '.join(decision.consensus.divergent_systems)}."
        else:
            uncertainty += "High system consensus on current hypothesis."

        return OperationalBriefing(
            id=f"brf_{int(datetime.now().timestamp())}",
            timestamp=datetime.now(),
            context_summary=summary,
            critical_instability_notes=instability,
            uncertainty_landscape=uncertainty,
            historical_context_notes="Historical analogs show moderate recurrence probability.", # Mock
            suggested_investigation_paths=["Review volatility precursors", "Verify liquidity depth clusters"]
        )
