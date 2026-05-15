import asyncio
import logging
from typing import List
from connectors.adapters.polymarket import PolymarketConnector
from common.normalization import PolymarketNormalizer
from core.event_bus import EventBus
from storage.batcher import DataBatcher
from common.models import TradeEvent, OrderBookSnapshot

logger = logging.getLogger(__name__)

class IngestionService:
    def __init__(self, event_bus: EventBus, batcher: DataBatcher, asset_ids: List[str]):
        self.normalizer = PolymarketNormalizer()
        self.event_bus = event_bus
        self.batcher = batcher
        self.asset_ids = asset_ids
        self.connector = PolymarketConnector(asset_ids, on_market_data=self._on_raw_data)
        self._is_running = False

    async def _on_raw_data(self, raw_msg: dict):
        event_type = raw_msg.get("event_type")
        try:
            if event_type == "book":
                norm_book = self.normalizer.normalize_book(raw_msg)
                await self.event_bus.publish(norm_book)
                await self.batcher.add_orderbook(norm_book)

            elif event_type == "price_change":
                norm_books = self.normalizer.normalize_price_change(raw_msg)
                for nb in norm_books:
                    await self.event_bus.publish(nb)
                    await self.batcher.add_orderbook(nb)

            elif event_type == "last_trade_price":
                norm_trade = self.normalizer.normalize_last_trade_price(raw_msg)
                await self.event_bus.publish(norm_trade)
                await self.batcher.add_trade(norm_trade)
        except Exception as e:
            logger.error(f"Error normalizing Polymarket data: {e}")

    async def start(self):
        self._is_running = True
        logger.info(f"Starting Polymarket Ingestion Service for {self.asset_ids}")
        await self.connector.connect()

    async def stop(self):
        self._is_running = False
        await self.connector.disconnect()
        logger.info("Polymarket Ingestion Service stopped")
