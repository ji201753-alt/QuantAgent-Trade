from datetime import datetime
from typing import Dict, List, Optional, Any
from dataclasses import dataclass, field

@dataclass
class PatternFamily:
    id: str
    name: str # e.g., "Liquidity Collapse Cluster"
    archetype_id: str
    member_fingerprint_ids: List[str]
    recurrence_stats: Dict[str, float]
    metadata: Dict[str, Any] = field(default_factory=dict)

@dataclass
class TaxonomyNode:
    id: str
    label: str
    parent_id: Optional[str]
    contextual_rules: List[str] # Logic that defines this node
    associated_regimes: List[str]

@dataclass
class MarketEvolution:
    symbol: str
    start_time: datetime
    end_time: datetime
    transition_path: List[str] # List of regime IDs
    persistence_matrix: Dict[str, float] # Time spent in each state
    instability_index: float

@dataclass
class OperationalAttention:
    id: str
    target_id: str # e.g., anomaly_id, regime_id
    importance_score: float # 0.0 to 1.0
    escalation_reason: str
    historical_relevance: float
