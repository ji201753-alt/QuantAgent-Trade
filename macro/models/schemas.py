from datetime import datetime
from typing import Dict, List, Optional, Any
from dataclasses import dataclass, field

@dataclass
class MacroCalendarEvent:
    timestamp: datetime
    event_name: str
    country: str
    importance: str # "low", "medium", "high"
    actual: Optional[float] = None
    forecast: Optional[float] = None
    previous: Optional[float] = None
    category: str # "employment", "inflation", "monetary_policy", etc.

@dataclass
class NewsCatalyst:
    timestamp: datetime
    source: str
    headline: str
    sentiment_score: float # -1.0 to 1.0
    impact_magnitude: float # 0.0 to 1.0
    related_symbols: List[str] = field(default_factory=list)
    tags: List[str] = field(default_factory=list)

@dataclass
class ExternalVolatilityIndex:
    timestamp: datetime
    index_name: str # e.g., "VIX", "DVOL"
    value: float
    change_pct: float

@dataclass
class MarketSessionState:
    timestamp: datetime
    session_name: str # "London", "New York", "Asia"
    is_open: bool
    is_transition: bool
    overlapping_sessions: List[str] = field(default_factory=list)

@dataclass
class EcosystemEvent:
    """A high-level event synthesized from multiple catalysts and internal signals."""
    id: str
    timestamp: datetime
    title: str
    severity: str # "low", "medium", "high", "critical"
    primary_category: str # "macro", "microstructure", "liquidity", "contagion"
    description: str
    catalysts: List[Any] = field(default_factory=list)
    affected_markets: List[str] = field(default_factory=list)
    uncertainty_impact: float = 0.0
