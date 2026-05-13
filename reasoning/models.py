from datetime import datetime
from typing import Dict, List, Optional, Any
from dataclasses import dataclass, field

@dataclass
class OperationalBriefing:
    id: str
    timestamp: datetime
    context_summary: str
    critical_instability_notes: str
    uncertainty_landscape: str
    historical_context_notes: str
    suggested_investigation_paths: List[str]

@dataclass
class ReasoningExploration:
    id: str
    investigation_id: str
    evidence_chain: List[str]
    conflicting_signals_analysis: str
    consensus_explanation: str
