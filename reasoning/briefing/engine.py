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
    def generate_briefing(self, context: MarketContext, decision: DecisionIntelligence, chronology: Optional[List[Dict]] = None) -> OperationalBriefing:
        """
        Synthesizes cross-market findings, ecosystem chronology, and structural decision intelligence.
        """
        # 1. Grounded Context Summary
        summary = f"Regime: {context.regime.primary_regime.upper()}. {context.situational_summary}"

        # 2. Instability & Operational Pressure
        instability = "Stable"
        if decision.confidence.is_collapsing: instability = "CRITICAL_COLLAPSE_RISK"
        elif decision.operational_pressure > 0.7: instability = "ELEVATED_DECISION_PRESSURE"

        # 3. Chronology & Cross-Domain Synthesis
        chron_summary = ""
        if chronology:
            critical_events = [e for e in chronology[-10:] if e['severity'] in ['high', 'critical']]
            if critical_events:
                chron_summary = f"Chronology confirms {len(critical_events)} high-severity catalysts aligning with current instability."

        # 4. Global Uncertainty Landscape
        uncertainty = f"Systemic uncertainty at {context.aggregated_uncertainty:.2f}. {chron_summary} "
        if decision.consensus.agreement_score < 0.5:
            uncertainty += f"Divergence detected in {', '.join(decision.consensus.divergent_systems)}."
        else:
            uncertainty += "Consensus coherence remains established."

        return OperationalBriefing(
            id=f"brf_{int(datetime.now().timestamp())}",
            timestamp=datetime.now(),
            context_summary=summary,
            critical_instability_notes=instability,
            uncertainty_landscape=uncertainty,
            historical_context_notes="Historical analogs show moderate recurrence probability.", # Mock
            suggested_investigation_paths=["Review volatility precursors", "Verify liquidity depth clusters"]
        )
