import json
import logging
from typing import Any, List, Optional, Dict
from connectors.base_websocket import BaseWebSocketConnector

logger = logging.getLogger(__name__)

class PolymarketConnector(BaseWebSocketConnector):
    def __init__(self, asset_ids: List[str], on_market_data: Optional[Any] = None):
        uri = "wss://ws-subscriptions-clob.polymarket.com/ws/market"
        super().__init__(uri, name="Polymarket")
        self.asset_ids = asset_ids
        self.on_market_data = on_market_data

    async def subscribe(self, topics: List[str] = None):
        sub_msg = {
            "assets_ids": self.asset_ids,
            "type": "market"
        }
        await self.manager.send(json.dumps(sub_msg))
        logger.info(f"Polymarket subscribed to {self.asset_ids}")

    async def _handle_message(self, message: Any):
        data = json.loads(message)
        if self.on_market_data:
            if isinstance(data, list):
                for item in data:
                    await self.on_market_data(item)
            else:
                await self.on_market_data(data)

    async def connect(self):
        await super().connect()
        # Polymarket doesn't need explicit subscribe call for the initial subscription
        # in some versions, but we do it here for clarity.
        await self.subscribe()
