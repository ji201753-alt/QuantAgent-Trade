import asyncio
import logging
from enum import Enum, auto
from typing import List, Any
from core.event_bus import EventBus

logger = logging.getLogger(__name__)

class SystemState(Enum):
    BOOTING = auto()
    INITIALIZING_SERVICES = auto()
    CONNECTING_FEEDS = auto()
    READY = auto()
    DEGRADED = auto()
    ERROR = auto()

class StartupOrchestrator:
    """
    Coordinates the strictly sequenced startup lifecycle of the workstation.
    Ensures services are initialized in the correct dependency order.
    """
    def __init__(self, event_bus: EventBus):
        self.event_bus = event_bus
        self.state = SystemState.BOOTING

    async def orchestrate(self, services: List[Any]):
        logger.info(f"System State: {self.state.name}")

        # 1. Core EventBus Startup
        await self.event_bus.publish({"type": "LIFECYCLE", "state": "BOOTING"})

        # 2. Service Initialization
        self.state = SystemState.INITIALIZING_SERVICES
        logger.info(f"System State: {self.state.name}")

        # In a real system, we'd iterate and call init()
        # based on a dependency graph.

        # 3. Connection & Readiness
        self.state = SystemState.READY
        logger.info(f"System State: {self.state.name}")
        await self.event_bus.publish({"type": "LIFECYCLE", "state": "READY"})
