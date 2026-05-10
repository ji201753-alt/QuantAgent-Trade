import asyncio
import logging
from typing import List, Any
from storage.repository import DataRepository
from common.models import TradeEvent, OrderBookSnapshot

logger = logging.getLogger(__name__)

class DataBatcher:
    def __init__(self, repository: DataRepository, batch_size: int = 100, flush_interval: float = 5.0):
        self.repository = repository
        self.batch_size = batch_size
        self.flush_interval = flush_interval
        self.trade_buffer: List[TradeEvent] = []
        self.book_buffer: List[OrderBookSnapshot] = []
        self.lock = asyncio.Lock()
        self._flush_task = None

    async def add_trade(self, trade: TradeEvent):
        async with self.lock:
            self.trade_buffer.append(trade)
            if len(self.trade_buffer) >= self.batch_size:
                await self.flush_trades()

    async def add_orderbook(self, book: OrderBookSnapshot):
        async with self.lock:
            self.book_buffer.append(book)
            if len(self.book_buffer) >= self.batch_size:
                await self.flush_books()

    async def flush_trades(self):
        if not self.trade_buffer:
            return
        logger.debug(f"Flushing {len(self.trade_buffer)} trades")
        for trade in self.trade_buffer:
            await self.repository.save_trade(trade.symbol, trade)
        self.trade_buffer = []

    async def flush_books(self):
        if not self.book_buffer:
            return
        logger.debug(f"Flushing {len(self.book_buffer)} orderbooks")
        for book in self.book_buffer:
            await self.repository.save_orderbook(book.symbol, book)
        self.book_buffer = []

    async def start(self):
        self._flush_task = asyncio.create_task(self.run_periodic_flush())

    async def stop(self):
        if self._flush_task:
            self._flush_task.cancel()
        async with self.lock:
            await self.flush_trades()
            await self.flush_books()

    async def run_periodic_flush(self):
        while True:
            await asyncio.sleep(self.flush_interval)
            async with self.lock:
                await self.flush_trades()
                await self.flush_books()
