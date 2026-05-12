import asyncio
from core.event_bus import EventBus
from signals.fusion.engine import SignalFusionEngine
from common.models import ForecastingOutput

class SignalIntelligenceService:
    def __init__(self, event_bus: EventBus):
        self.event_bus = event_bus
        self.fusion_engine = SignalFusionEngine()

    async def start(self):
        self.event_bus.subscribe(ForecastingOutput, self._on_forecast)

    async def _on_forecast(self, forecast):
        self.fusion_engine.update_state(forecast)
        signal = self.fusion_engine.fuse(forecast.symbol)
        await self.event_bus.publish(signal)

    async def stop(self): pass
