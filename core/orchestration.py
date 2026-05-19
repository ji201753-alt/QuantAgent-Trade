import asyncio
import logging
from enum import Enum, auto
from typing import List, Any, Dict, Optional
from core.event_bus import EventBus
from core.registry import registry

logger = logging.getLogger(__name__)

class SystemState(Enum):
    BOOTING = auto()
    PERSISTENCE_READY = auto()
    SERVICES_INITIALIZED = auto()
    MODELS_WARMING = auto()
    CONNECTORS_ACTIVE = auto()
    API_READY = auto()
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
        self.instances = {}

    async def orchestrate(self):
        try:
            logger.info(f"System State: {self.state.name}")
            await self.event_bus.publish({"type": "LIFECYCLE", "state": self.state.name})

            # 1. Persistence Layer
            logger.info("Initializing Persistence Layer...")
            from storage.backends.sqlite import SQLiteRepository
            from storage.batcher import DataBatcher
            repo = SQLiteRepository()
            await repo.initialize()
            batcher = DataBatcher(repo)
            self.state = SystemState.PERSISTENCE_READY
            await self.event_bus.publish({"type": "LIFECYCLE", "state": self.state.name})

            # 2. Register & Initialize Services
            logger.info("Initializing Intelligence Services...")
            from core.ingestion_service import IngestionService
            from analytics.services.microstructure_service import MicrostructureAnalyticsService
            from forecasting.services.forecast_service import ForecastService
            from signals.services.signal_service import SignalIntelligenceService
            from decision.services.decision_service import DecisionCognitionService
            from meta.services.meta_service import MetaIntelligenceService
            from macro.services.macro_service import MacroIntelligenceService
            from core.chronology import UnifiedChronologyService

            registry.register("services", "ingestion", lambda eb: IngestionService(eb, batcher, ["980224"]))
            registry.register("services", "analytics", lambda eb: MicrostructureAnalyticsService(eb, repo))
            registry.register("services", "forecasting", ForecastService)
            registry.register("services", "signals", SignalIntelligenceService)
            registry.register("services", "decision", DecisionCognitionService)
            registry.register("services", "meta", MetaIntelligenceService)
            registry.register("services", "macro", MacroIntelligenceService)
            registry.register("services", "chronology", UnifiedChronologyService)

            self.instances = registry.instantiate_all("services", self.event_bus)

            # Start Background Services
            for inst in self.instances:
                if hasattr(inst, 'start'):
                    asyncio.create_task(inst.start())

            self.state = SystemState.SERVICES_INITIALIZED
            await self.event_bus.publish({"type": "LIFECYCLE", "state": self.state.name})

            # 3. Model Warming (Lazy but sequenced)
            logger.info("Warming Intelligence Models...")
            # Runtime Orchestrator handles this lazily, but we signal readiness
            self.state = SystemState.MODELS_WARMING
            await self.event_bus.publish({"type": "LIFECYCLE", "state": self.state.name})

            # 4. Connectors Activation
            logger.info("Activating Market Connectors...")
            # Ingestion service starts feeds
            self.state = SystemState.CONNECTORS_ACTIVE
            await self.event_bus.publish({"type": "LIFECYCLE", "state": self.state.name})

            # 5. API Layer
            self.state = SystemState.API_READY
            await self.event_bus.publish({"type": "LIFECYCLE", "state": self.state.name})

            self.state = SystemState.READY
            logger.info("System fully operational.")
            await self.event_bus.publish({"type": "LIFECYCLE", "state": self.state.name})

        except Exception as e:
            self.state = SystemState.ERROR
            logger.error(f"Startup failure: {e}", exc_info=True)
            await self.event_bus.publish({"type": "LIFECYCLE", "state": "ERROR", "error": str(e)})
            raise e

    def get_instances(self):
        return self.instances
