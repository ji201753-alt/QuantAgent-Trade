from abc import ABC, abstractmethod
from typing import AsyncGenerator, List, Optional
from common.models import MarketSnapshot, OrderBookSnapshot, TradeEvent, OHLCV

class MarketConnector(ABC):
    @abstractmethod
    async def connect(self):
        pass

    @abstractmethod
    async def disconnect(self):
        pass

class WebSocketConnector(MarketConnector):
    @abstractmethod
    async def subscribe_trades(self, symbol: str) -> AsyncGenerator[TradeEvent, None]:
        pass

    @abstractmethod
    async def subscribe_orderbook(self, symbol: str) -> AsyncGenerator[OrderBookSnapshot, None]:
        pass

class RESTConnector(MarketConnector):
    @abstractmethod
    async def get_latest_snapshot(self, symbol: str) -> MarketSnapshot:
        pass

class HistoricalConnector(MarketConnector):
    @abstractmethod
    async def get_historical_ohlcv(
        self, symbol: str, start_time: str, end_time: str, interval: str
    ) -> List[OHLCV]:
        pass
