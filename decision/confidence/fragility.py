import numpy as np
from typing import List, Optional
from decision.models import StructuralConfidence

class StructuralFragilityAnalyzer:
    """
    Detects structural fragility and confidence degradation.
    Identifies when contextual structures become unstable.
    """
    def analyze_fragility(self, confidence_history: List[float]) -> float:
        if len(confidence_history) < 5: return 0.0

        # Fragility is high if variance of confidence is increasing
        # or if there's a negative trend
        recent = confidence_history[-5:]
        prior = confidence_history[-10:-5] if len(confidence_history) >= 10 else recent

        recent_std = np.std(recent)
        prior_std = np.std(prior)

        fragility = (recent_std - prior_std) / (prior_std + 1e-9)
        return float(np.clip(fragility, 0.0, 1.0))
