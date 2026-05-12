from datetime import datetime
from typing import Dict, List, Optional, Any
from dataclasses import dataclass, field

@dataclass
class ProbabilisticSignal:
    symbol: str
    timestamp: datetime
    directional_pressure: float
    confidence: float
    uncertainty: float
    regime_probabilities: Dict[str, float]
    volatility_expansion_prob: float
    liquidity_stress_prob: float
    anomaly_confidence: float
    metadata: Dict[str, Any] = field(default_factory=dict)

@dataclass
class IntelligentAlert:
    id: str
    symbol: str
    timestamp: datetime
    alert_type: str
    severity: str
    confidence: float
    message: str
    explanation: str
    affected_metrics: List[str]
    regime_context: str
    metadata: Dict[str, Any] = field(default_factory=dict)
