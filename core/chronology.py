import logging
import json
import os
from datetime import datetime
from typing import List, Any, Dict
from core.event_bus import EventBus
from common.models import AnomalyEvent, SignalEvent, MicrostructureFrame, MicrostructureSignal, NormalizedExternalEvent
from macro.models.schemas import NewsCatalyst, EcosystemEvent

logger = logging.getLogger(__name__)

class UnifiedChronologyService:
    """
    Maintains a persistent, synchronized timeline of all significant operational events.
    Serves as the foundational market chronology for investigations and reasoning.
    """
    def __init__(self, event_bus: EventBus, storage_path: str = "storage/chronology/"):
        self.event_bus = event_bus
        self.storage_path = storage_path
        self.events: List[Dict[str, Any]] = []
        os.makedirs(storage_path, exist_ok=True)

    async def start(self):
        logger.info("Unified Chronology Service initialized")

        # Subscribe to all relevant event types
        self.event_bus.subscribe(AnomalyEvent, self._log_event)
        self.event_bus.subscribe(SignalEvent, self._log_event)
        self.event_bus.subscribe(NewsCatalyst, self._log_event)
        self.event_bus.subscribe(EcosystemEvent, self._log_event)
        self.event_bus.subscribe(MicrostructureFrame, self._log_event)
        self.event_bus.subscribe(MicrostructureSignal, self._log_event)
        self.event_bus.subscribe(NormalizedExternalEvent, self._log_event)

    async def _log_event(self, event: Any):
        event_type = type(event).__name__
        ts = getattr(event, 'timestamp', datetime.now())

        entry = {
            "type": event_type,
            "timestamp": ts.isoformat() if isinstance(ts, datetime) else ts,
            "title": getattr(event, 'title', getattr(event, 'metric_name', getattr(event, 'signal_type', event_type))),
            "severity": getattr(event, 'severity', 'info'),
            "symbol": getattr(event, 'symbol', None),
            "replay_anchor": getattr(event, 'frame_anchor', getattr(event, 'replay_anchor', None)),
            "raw_data": str(event) # Simplified for now
        }

        self.events.append(entry)
        await self._persist_event(entry)

        # Publish chronology update if needed
        # await self.event_bus.publish(ChronologyUpdate(entry))

    async def _persist_event(self, entry: Dict):
        # Local-first batched persistence
        today = datetime.now().strftime("%Y-%m-%d")
        path = os.path.join(self.storage_path, f"chronology_{today}.jsonl")
        with open(path, 'a') as f:
            f.write(json.dumps(entry) + "\n")

    def get_timeline(self, start: datetime, end: datetime) -> List[Dict]:
        """Retrieves a filtered chronology for a specific interval."""
        # Implementation for historical retrieval
        return self.events
