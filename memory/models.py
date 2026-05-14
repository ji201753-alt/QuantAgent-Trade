from datetime import datetime
from typing import Dict, List, Optional, Any
from dataclasses import dataclass, field

@dataclass
class ContextualFingerprint:
    id: str
    timestamp: datetime
    vector: List[float] # Multi-factor structural embedding
    metadata: Dict[str, Any] = field(default_factory=dict)

@dataclass
class HistoricalAnalog:
    current_id: str
    analog_id: str
    similarity_score: float
    description: str
    temporal_distance_days: int
