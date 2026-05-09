from connectors.base import WebSocketConnector, RESTConnector
from common.models import TradeEvent, OrderBookSnapshot, MarketSnapshot
from typing import AsyncGenerator

class BinanceConnector(WebSocketConnector, RESTConnector):
    async def connect(self):
        pass

    async def disconnect(self):
        pass

    async def subscribe_trades(self, symbol: str) -> AsyncGenerator[TradeEvent, None]:
        if False: yield TradeEvent(...)

    async def subscribe_orderbook(self, symbol: str) -> AsyncGenerator[OrderBookSnapshot, None]:
        if False: yield OrderBookSnapshot(...)

    async def get_latest_snapshot(self, symbol: str) -> MarketSnapshot:
        pass
