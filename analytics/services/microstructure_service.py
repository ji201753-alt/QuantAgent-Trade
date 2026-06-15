import asyncio
import logging
from common.models import OrderBookSnapshot, TradeEvent, OHLCV, MicrostructureFrame
from core.event_bus import EventBus
from analytics.microstructure import ImbalanceEngine, LiquidityEngine
from analytics.volatility import VolatilityEngine
from analytics.anomaly_detection import AnomalyDetector
from analytics.aggregation import MultiTimeframeAggregator
from analytics.market_pressure import MarketPressureEngine
from analytics.features import FeatureEngineer
from analytics.orderflow import MicrostructureFrameBuilder
from storage.repository import DataRepository

logger = logging.getLogger(__name__)

class MicrostructureAnalyticsService:
    def __init__(self, event_bus: EventBus, repository: DataRepository):
        self.event_bus = event_bus
        self.repository = repository
        self.imbalance_engine = ImbalanceEngine()
        self.liquidity_engine = LiquidityEngine()
        self.volatility_engine = VolatilityEngine()
        self.anomaly_detector = AnomalyDetector("imbalance")
        self.aggregator = MultiTimeframeAggregator("GLOBAL", [1, 60])
        self.pressure_engine = MarketPressureEngine()
        self.feature_engineer = FeatureEngineer()
        self.frame_builder = MicrostructureFrameBuilder()
        self._last_trades = []
        self._is_running = False

    async def start(self):
        self._is_running = True
        self.event_bus.subscribe(OrderBookSnapshot, self._handle_book)
        self.event_bus.subscribe(TradeEvent, self._handle_trade)
        logger.info("Microstructure Analytics Service started")

    async def stop(self):
        self._is_running = False
        self.event_bus.unsubscribe(OrderBookSnapshot, self._handle_book)
        self.event_bus.unsubscribe(TradeEvent, self._handle_trade)
        logger.info("Microstructure Analytics Service stopped")

    async def _handle_book(self, book: OrderBookSnapshot):
        try:
            imbalance = self.imbalance_engine.compute_imbalance(book)
            await self.event_bus.publish(imbalance)
            liquidity = self.liquidity_engine.analyze_liquidity(book)
            await self.event_bus.publish(liquidity)
            anomaly = self.anomaly_detector.check(book.symbol, book.timestamp, imbalance.weighted_imbalance)
            if anomaly:
                await self.event_bus.publish(anomaly)
            vol = self.volatility_engine.update(book.symbol, book.timestamp, liquidity.mid_price)
            if vol:
                await self.event_bus.publish(vol)
            pressure = self.pressure_engine.compute_pressure(imbalance, self._last_trades[-10:])
            await self.event_bus.publish(pressure)
            frame = self.frame_builder.update_book(book)
            await self._publish_frame(frame)
        except Exception as e:
            logger.error(f"Error in analytics _handle_book: {e}")

    async def _publish_frame(self, frame: MicrostructureFrame):
        await self.event_bus.publish(frame)
        for signal in self.frame_builder.derive_signals(frame):
            await self.event_bus.publish(signal)

    async def _handle_trade(self, trade: TradeEvent):
        try:
            self._last_trades.append(trade)
            if len(self._last_trades) > 100:
                self._last_trades.pop(0)
            frame = self.frame_builder.update_trade(trade)
            if frame:
                await self._publish_frame(frame)
            completed_candles = self.aggregator.process_trade(trade)
            for candle in completed_candles:
                await self.event_bus.publish(candle)
                if candle.interval == "1m":
                    self.feature_engineer.generate_features(candle)
        except Exception as e:
            logger.error(f"Error in analytics _handle_trade: {e}")
