import time
import logging
from dataclasses import dataclass, field
from typing import Dict, Any
from core.event_bus import EventBus

logger = logging.getLogger(__name__)

@dataclass
class ServiceHealth:
    name: str
    status: str # "healthy", "degraded", "down"
    last_check: float
    metrics: Dict[str, Any] = field(default_factory=dict)

class HealthMonitor:
    """
    Monitors the operational health of all core services and event throughput.
    """
    def __init__(self, event_bus: EventBus):
        self.event_bus = event_bus
        self.services: Dict[str, ServiceHealth] = {}
        self.start_time = time.time()
        self.msg_count = 0

    async def start(self):
        logger.info("Health Monitor initialized")
        # Subscribe to heartbeat-like events if they exist
        # In a real system, we'd have a Heartbeat event type

    def update_service(self, name: str, status: str, metrics: Dict = None):
        self.services[name] = ServiceHealth(
            name=name,
            status=status,
            last_check=time.time(),
            metrics=metrics or {}
        )

    def get_report(self) -> Dict:
        return {
            "uptime": time.time() - self.start_time,
            "services": {k: v.__dict__ for k, v in self.services.items()},
            "throughput": self.msg_count / max(1, (time.time() - self.start_time)),
            "diagnostics": {
                "storage_pressure": 0.12, # Mock
                "event_bus_backlog": self.event_bus.queue.qsize(),
                "active_websockets": 1
            }
        }
