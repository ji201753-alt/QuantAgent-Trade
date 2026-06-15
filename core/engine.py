import asyncio
import logging
import threading
from typing import List, Optional

from api.app import create_app
from core.event_bus import EventBus
from core.orchestration import StartupOrchestrator
from core.runtime_orchestrator import ModelRuntimeOrchestrator

logger = logging.getLogger(__name__)


class MarketIntelligenceEngine:
    """
    Single runtime authority for workstation lifecycle.

    Consolidates startup orchestration, runtime model orchestration,
    websocket/API serving, and graceful shutdown into one deterministic path.
    """
    def __init__(self, connectors: Optional[List[object]] = None, orchestrator=None, repository=None):
        self.connectors = connectors or []
        self._external_orchestrator = orchestrator
        self._external_repository = repository

        self.event_bus = EventBus()
        self.startup = StartupOrchestrator(self.event_bus)
        self.runtime_orchestrator = ModelRuntimeOrchestrator(self.event_bus)

        self._api_thread: Optional[threading.Thread] = None
        self._service_tasks: List[asyncio.Task] = []
        self.is_running = False

    async def start(self):
        if self.is_running:
            return

        await self.startup.orchestrate()

        # EventBus dispatcher is the core runtime loop authority.
        self._service_tasks.append(asyncio.create_task(self.event_bus.start()))

        # Ensure model runtime telemetry/lifecycle authority is active.
        self._service_tasks.append(asyncio.create_task(self.runtime_orchestrator.start()))

        # Start all startup-instantiated services
        for instance in self.startup.get_instances():
            if hasattr(instance, "start"):
                self._service_tasks.append(asyncio.create_task(instance.start()))

        app = create_app(self.event_bus, self.runtime_orchestrator)
        self._api_thread = threading.Thread(
            target=lambda: app.run(host="0.0.0.0", port=5000, debug=False, use_reloader=False),
            daemon=True,
        )
        self._api_thread.start()

        self.is_running = True
        logger.info("MarketIntelligenceEngine started")

    async def stop(self):
        if not self.is_running:
            return

        for instance in self.startup.get_instances():
            if hasattr(instance, "stop"):
                try:
                    await instance.stop()
                except Exception:
                    logger.exception("Service stop failure during shutdown")

        await self.event_bus.stop()

        for task in self._service_tasks:
            if not task.done():
                task.cancel()
        if self._service_tasks:
            await asyncio.gather(*self._service_tasks, return_exceptions=True)

        self._service_tasks.clear()
        self.is_running = False
        logger.info("MarketIntelligenceEngine stopped")


async def main():
    engine = MarketIntelligenceEngine()
    await engine.start()
    # Keep main alive while background tasks run.
    while True:
        await asyncio.sleep(1)


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        logger.info("Shutting down...")
