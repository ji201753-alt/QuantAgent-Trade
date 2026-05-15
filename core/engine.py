import asyncio
import logging
from core.event_bus import EventBus
from core.registry import registry
from core.ingestion_service import IngestionService
from analytics.services.microstructure_service import MicrostructureAnalyticsService
from forecasting.services.forecast_service import ForecastService
from signals.services.signal_service import SignalService
from decision.services.decision_service import DecisionCognitionService
from meta.services.meta_service import MetaIntelligenceService
from macro.services.macro_service import MacroIntelligenceService
from core.chronology import UnifiedChronologyService
from investigations.cases.manager import InvestigationManager
from api.app import create_app

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

async def main():
    event_bus = EventBus()

    # Register core platform components
    registry.register("services", "ingestion", IngestionService)
    registry.register("services", "analytics", MicrostructureAnalyticsService)
    registry.register("services", "forecasting", ForecastService)
    registry.register("services", "signals", SignalService)
    registry.register("services", "decision", DecisionCognitionService)
    registry.register("services", "meta", MetaIntelligenceService)
    registry.register("services", "macro", MacroIntelligenceService)
    registry.register("services", "chronology", UnifiedChronologyService)

    # Instantiate via Registry for platform extensibility
    instances = registry.instantiate_all("services", event_bus)
    investigations = InvestigationManager()

    # Start Services
    services = [event_bus.start()] + [inst.start() for inst in instances if hasattr(inst, 'start')]

    # Start API/WebSocket Server
    app = create_app(event_bus)

    logger.info("Starting Quant Intelligence Core...")

    # Run Flask in a separate thread to not block the event loop
    import threading
    api_thread = threading.Thread(target=lambda: app.run(host='0.0.0.0', port=5000, debug=False, use_reloader=False))
    api_thread.daemon = True
    api_thread.start()

    await asyncio.gather(*services)

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        logger.info("Shutting down...")
