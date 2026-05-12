from datetime import datetime
from typing import Dict, List, Optional, Any
from dataclasses import dataclass, field

@dataclass
class RegimeInterpretation:
    symbol: str
    timestamp: datetime
    primary_regime: str # e.g., "volatility_expansion", "liquidity_recovery"
    confidence: float
    description: str
    supporting_evidence: List[str]
    is_transitional: bool = False
    metadata: Dict[str, Any] = field(default_factory=dict)

@dataclass
class EventCorrelation:
    id: str
    timestamp: datetime
    primary_event_id: str
    correlated_event_ids: List[str]
    correlation_type: str # e.g., "anomaly_cluster", "precursor_sequence"
    strength: float
    description: str

@dataclass
class MarketContext:
    symbol: str
    timestamp: datetime
    regime: RegimeInterpretation
    operational_priority: str # "low", "medium", "high", "critical"
    situational_summary: str
    aggregated_uncertainty: float
    alignment_score: float # multi-timeframe/multi-factor alignment
    active_correlations: List[EventCorrelation]
    explainability: Dict[str, Any] = field(default_factory=dict)
