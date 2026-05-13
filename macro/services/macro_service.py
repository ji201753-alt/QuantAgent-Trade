import asyncio
import logging
from typing import Any, List
from core.event_bus import EventBus
from common.models import LiquiditySnapshot, AnomalyEvent
from macro.correlation.engine import CrossMarketCorrelationEngine
from macro.propagation.tracker import InformationFlowTracker
from macro.models.schemas import EcosystemContext, MacroRegime

logger = logging.getLogger(__name__)

class MacroIntelligenceService:
    """
    Coordinates cross-domain macro-intelligence.
    Orchestrates correlation tracking, propagation analysis, and macro-regime cognition.
    """
    def __init__(self, event_bus: EventBus):
        self.event_bus = event_bus
        self.correlation_engine = CrossMarketCorrelationEngine()
        self.flow_tracker = InformationFlowTracker()
        self._is_running = False
        self.symbols = set()

    async def start(self):
        self._is_running = True
        self.event_bus.subscribe(LiquiditySnapshot, self._on_liquidity)
        self.event_bus.subscribe(AnomalyEvent, self._on_anomaly)
        logger.info("Macro Intelligence Service started")

    async def stop(self):
        self._is_running = False
        logger.info("Macro Intelligence Service stopped")

    async def _on_liquidity(self, snapshot: LiquiditySnapshot):
        if not self._is_running: return
        self.symbols.add(snapshot.symbol)

        # 1. Update Correlations
        self.correlation_engine.update_market(snapshot.symbol, snapshot.mid_price)

        # 2. Check all pairs (if enough symbols)
        if len(self.symbols) >= 2:
            sym_list = list(self.symbols)
            for i in range(len(sym_list)):
                for j in range(i + 1, len(sym_list)):
                    corr = self.correlation_engine.compute_pair_correlation(sym_list[i], sym_list[j])
                    if corr:
                        await self.event_bus.publish(corr)

    async def _on_anomaly(self, event: AnomalyEvent):
        if not self._is_running: return

        # 3. Track Propagation
        contagions = self.flow_tracker.track_anomaly(event)
        for contagion in contagions:
            await self.event_bus.publish(contagion)

        # 4. Macro Regime Check (Simulated)
        if len(contagions) > 0:
            macro_regime = MacroRegime(
                id=f"macro_{int(asyncio.get_event_loop().time())}",
                timestamp=event.timestamp,
                label="Synchronized_Ecosystem_Instability",
                synchronized_domains=list(self.symbols),
                instability_score=0.85,
                description="Synchronized structural instability propagating across domains."
            )
            await self.event_bus.publish(macro_regime)
