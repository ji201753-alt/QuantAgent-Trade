import json
import os
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from investigations.models import InvestigationCase

class DateTimeEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, datetime):
            return obj.isoformat()
        if isinstance(obj, tuple):
            return list(obj)
        return super().default(obj)

class InvestigationManager:
    """
    Manages persistent investigation cases and session continuity.
    """
    def __init__(self, storage_dir: str = "storage/investigations/"):
        self.storage_dir = storage_dir
        os.makedirs(self.storage_dir, exist_ok=True)
        self.cases: Dict[str, InvestigationCase] = {}
        self._load_all_cases()

    def create_case(self, title: str, event_id: str, start: datetime, end: datetime) -> InvestigationCase:
        case_id = str(uuid.uuid4())
        case = InvestigationCase(
            id=case_id,
            title=title,
            created_at=datetime.now(),
            updated_at=datetime.now(),
            status="active",
            initial_event_id=event_id,
            replay_interval=(start, end)
        )
        self.cases[case_id] = case
        self._save_to_disk(case)
        return case

    def add_annotation(self, case_id: str, text: str, metadata: Optional[Dict] = None):
        if case_id in self.cases:
            case = self.cases[case_id]
            case.annotations.append({
                "timestamp": datetime.now().isoformat(),
                "text": text,
                "metadata": metadata or {}
            })
            case.updated_at = datetime.now()
            self._save_to_disk(case)

    def attach_evidence(self, case_id: str, evidence_type: str, data: Any):
        if case_id in self.cases:
            case = self.cases[case_id]
            case.evidence_references.append({
                "type": evidence_type,
                "timestamp": datetime.now().isoformat(),
                "data": data
            })
            case.updated_at = datetime.now()
            self._save_to_disk(case)

    def update_status(self, case_id: str, status: str):
        if case_id in self.cases:
            case = self.cases[case_id]
            case.status = status
            case.updated_at = datetime.now()
            self._save_to_disk(case)

    def _save_to_disk(self, case: InvestigationCase):
        path = os.path.join(self.storage_dir, f"{case.id}.json")
        data = {
            "id": case.id,
            "title": case.title,
            "created_at": case.created_at.isoformat(),
            "updated_at": case.updated_at.isoformat(),
            "status": case.status,
            "initial_event_id": case.initial_event_id,
            "replay_interval": [case.replay_interval[0].isoformat(), case.replay_interval[1].isoformat()],
            "annotations": case.annotations,
            "reasoning_summaries": case.reasoning_summaries,
            "evidence_references": case.evidence_references,
            "context_snapshots": case.context_snapshots,
            "historical_comparisons": case.historical_comparisons,
            "metadata": case.metadata
        }
        with open(path, 'w') as f:
            json.dump(data, f, indent=4, cls=DateTimeEncoder)

    def _load_all_cases(self):
        if not os.path.exists(self.storage_dir):
            return

        for filename in os.listdir(self.storage_dir):
            if filename.endswith(".json"):
                try:
                    with open(os.path.join(self.storage_dir, filename), 'r') as f:
                        data = json.load(f)
                        case = InvestigationCase(
                            id=data["id"],
                            title=data["title"],
                            created_at=datetime.fromisoformat(data["created_at"]),
                            updated_at=datetime.fromisoformat(data["updated_at"]),
                            status=data["status"],
                            initial_event_id=data["initial_event_id"],
                            replay_interval=(
                                datetime.fromisoformat(data["replay_interval"][0]),
                                datetime.fromisoformat(data["replay_interval"][1])
                            ),
                            annotations=data.get("annotations", []),
                            reasoning_summaries=data.get("reasoning_summaries", []),
                            evidence_references=data.get("evidence_references", []),
                            context_snapshots=data.get("context_snapshots", []),
                            historical_comparisons=data.get("historical_comparisons", []),
                            metadata=data.get("metadata", {})
                        )
                        self.cases[case.id] = case
                except Exception as e:
                    print(f"Error loading case {filename}: {e}")

    def list_cases(self) -> List[InvestigationCase]:
        return list(self.cases.values())

    def get_case(self, case_id: str) -> Optional[InvestigationCase]:
        return self.cases.get(case_id)
