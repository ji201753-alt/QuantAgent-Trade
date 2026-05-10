from abc import ABC, abstractmethod
from typing import Any, List, Optional
from common.models import OHLCV, TradeEvent, SignalEvent, OrderBookSnapshot

class DataRepository(ABC):
    @abstractmethod
    async def initialize(self):
        pass

    @abstractmethod
    async def save_ohlcv(self, symbol: str, data: OHLCV):
        pass

    @abstractmethod
    async def get_ohlcv(self, symbol: str, limit: int) -> List[OHLCV]:
        pass

    @abstractmethod
    async def save_trade(self, symbol: str, trade: TradeEvent):
        pass

    @abstractmethod
    async def save_orderbook(self, symbol: str, book: OrderBookSnapshot):
        pass

    @abstractmethod
    async def save_signal(self, signal: SignalEvent):
        pass
