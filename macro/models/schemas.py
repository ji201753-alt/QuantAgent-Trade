from datetime import datetime
from typing import Dict, List, Optional, Any
from dataclasses import dataclass, field

@dataclass
class MacroRegime:
    id: str
    timestamp: datetime
    label: str # e.g., "Global_Volatility_Expansion"
    synchronized_domains: List[str]
    instability_score: float
    description: str

@dataclass
class InterMarketCorrelation:
    timestamp: datetime
    pair: tuple[str, str]
    correlation_coefficient: float
    lead_lag_ms: float
    alignment_confidence: float

@dataclass
class StructuralContagion:
    id: str
    timestamp: datetime
    source_market: str
    target_markets: List[str]
    propagation_speed: float
    severity: float
    contagion_type: str # e.g., "volatility_cascade"

@dataclass
class EcosystemContext:
    timestamp: datetime
    primary_macro_regime: MacroRegime
    active_contagions: List[StructuralContagion]
    global_alignment_score: float
    information_flow_matrix: Dict[str, Dict[str, float]] # source -> target -> flow_strength
