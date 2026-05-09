import asyncio
from typing import List, Dict, Any
from connectors.base import MarketConnector
from orchestration.service import OrchestrationService
from storage.repository import DataRepository

class MarketIntelligenceEngine:
    def __init__(
        self,
        connectors: List[MarketConnector],
        orchestrator: OrchestrationService,
        repository: DataRepository
    ):
        self.connectors = connectors
        self.orchestrator = orchestrator
        self.repository = repository
        self.is_running = False

    async def start(self):
        self.is_running = True
        print("Market Intelligence Engine started.")
        # Initialization logic (no heavy workers yet)
        for connector in self.connectors:
            await connector.connect()

    async def stop(self):
        self.is_running = False
        for connector in self.connectors:
            await connector.disconnect()
        print("Market Intelligence Engine stopped.")

    async def run_forever(self):
        await self.start()
        try:
            while self.is_running:
                await asyncio.sleep(1)
        finally:
            await self.stop()
