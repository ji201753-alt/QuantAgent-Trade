import numpy as np
from datetime import datetime
from typing import Dict, List
from decision.models import StructuralConfidence

class ConfidenceTopologySystem:
    """
    Models structural confidence and tracks uncertainty propagation.
    Identifies confidence convergence and potential collapse.
    """
    def __init__(self):
        self.confidence_history: List[float] = []

    def model_topology(self, symbol: str, system_uncertainties: Dict[str, float]) -> StructuralConfidence:
        # 1. Overall Confidence (inverse of average uncertainty)
        avg_uncertainty = np.mean(list(system_uncertainties.values())) if system_uncertainties else 0.5
        overall_conf = 1.0 - avg_uncertainty

        # 2. Check for collapse (sudden drop in confidence)
        is_collapsing = False
        if len(self.confidence_history) > 5:
            prior_avg = np.mean(self.confidence_history[-5:])
            if overall_conf < prior_avg * 0.6:
                is_collapsing = True

        self.confidence_history.append(overall_conf)
        if len(self.confidence_history) > 100: self.confidence_history.pop(0)

        return StructuralConfidence(
            symbol=symbol,
            timestamp=datetime.now(),
            overall_confidence=float(overall_conf),
            uncertainty_topology=system_uncertainties,
            persistence_score=0.8, # Mock
            is_collapsing=is_collapsing
        )
