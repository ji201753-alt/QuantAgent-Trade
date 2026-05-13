from datetime import datetime
from typing import List, Dict
from decision.models import MarketScenario

class ScenarioCognitionEngine:
    """
    Generates parallel probabilistic trajectories based on competing contextual interpretations.
    """
    def generate_scenarios(self, symbol: str, directional_pressure: float) -> List[MarketScenario]:
        # Generate two competing hypotheses
        s1 = MarketScenario(
            id="hyp_bull",
            timestamp=datetime.now(),
            trajectory_label="Upside Continuation",
            probability=float(0.5 + directional_pressure/2.0),
            precursor_events=["momentum_alignment"],
            supporting_context_ids=[]
        )

        s2 = MarketScenario(
            id="hyp_bear",
            timestamp=datetime.now(),
            trajectory_label="Mean Reversion / Breakdown",
            probability=float(0.5 - directional_pressure/2.0),
            precursor_events=["liquidity_exhaustion"],
            supporting_context_ids=[]
        )

        return [s1, s2]
