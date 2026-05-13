from datetime import datetime
from typing import Dict, List, Optional, Any
from dataclasses import dataclass, field

@dataclass
class ConsensusState:
    symbol: str
    timestamp: datetime
    agreement_score: float # 0.0 to 1.0
    divergent_systems: List[str]
    dominant_hypothesis: str
    coherence_index: float

@dataclass
class StructuralConfidence:
    symbol: str
    timestamp: datetime
    overall_confidence: float
    uncertainty_topology: Dict[str, float] # system_name -> uncertainty
    persistence_score: float
    is_collapsing: bool = False

@dataclass
class MarketScenario:
    id: str
    timestamp: datetime
    trajectory_label: str
    probability: float
    precursor_events: List[str]
    supporting_context_ids: List[str]

@dataclass
class DecisionIntelligence:
    symbol: str
    timestamp: datetime
    consensus: ConsensusState
    confidence: StructuralConfidence
    active_scenarios: List[MarketScenario]
    operational_pressure: float # 0.0 to 1.0
    reliability_rating: float
