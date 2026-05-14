from datetime import datetime
from typing import Dict, List, Optional, Any
from dataclasses import dataclass, field

@dataclass
class InvestigationCase:
    id: str
    title: str
    created_at: datetime
    updated_at: datetime
    status: str # "active", "archived", "completed"

    # Contextual triggers
    initial_event_id: str
    replay_interval: tuple[datetime, datetime]

    # Evidence & Annotations
    annotations: List[Dict[str, Any]] = field(default_factory=list)
    reasoning_summaries: List[str] = field(default_factory=list)
    evidence_references: List[Dict[str, Any]] = field(default_factory=list)
    context_snapshots: List[Dict[str, Any]] = field(default_factory=list)
    historical_comparisons: List[str] = field(default_factory=list)

    # Forensic Branching
    parent_case_id: Optional[str] = None
    child_case_ids: List[str] = field(default_factory=list)
    related_catalysts: List[str] = field(default_factory=list) # IDs of macro catalysts

    metadata: Dict[str, Any] = field(default_factory=dict)

@dataclass
class InvestigationReport:
    case_id: str
    generated_at: datetime
    summary_markdown: str
    data_payload: Dict[str, Any]
