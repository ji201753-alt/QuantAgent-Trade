import asyncio
import logging
from core.event_bus import EventBus
from core.ingestion_service import IngestionService
from analytics.pipeline import AnalyticsPipeline
from forecasting.services.forecast_service import ForecastService
from signals.services.signal_service import SignalService
from decision.services.decision_service import DecisionCognitionService
from meta.services.meta_service import MetaIntelligenceService
from api.app import create_app

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

async def main():
    event_bus = EventBus()

    # Initialize Core Services
    ingestion = IngestionService(event_bus)
    analytics = AnalyticsPipeline(event_bus)
    forecasting = ForecastService(event_bus)
    signals = SignalService(event_bus)
    decision = DecisionCognitionService(event_bus)
    meta = MetaIntelligenceService(event_bus)

    # Start Services
    services = [
        event_bus.start(),
        ingestion.start(),
        analytics.start(),
        forecasting.start(),
        signals.start(),
        decision.start(),
        meta.start()
    ]

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
