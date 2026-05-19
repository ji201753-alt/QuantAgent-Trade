import aiosqlite
import json
import logging
from datetime import datetime
from typing import List, Optional
from common.models import OHLCV, TradeEvent, SignalEvent, OrderBookSnapshot
from storage.repository import DataRepository

logger = logging.getLogger(__name__)

class SQLiteRepository(DataRepository):
    def __init__(self, db_path: str = "market_data.db"):
        self.db_path = db_path
        self._db: Optional[aiosqlite.Connection] = None

    async def initialize(self):
        self._db = await aiosqlite.connect(self.db_path)
        await self._db.execute("""
            CREATE TABLE IF NOT EXISTS ohlcv (
                symbol TEXT,
                timestamp TEXT,
                open REAL,
                high REAL,
                low REAL,
                close REAL,
                volume REAL,
                PRIMARY KEY (symbol, timestamp)
            )
        """)
        await self._db.execute("""
            CREATE TABLE IF NOT EXISTS trades (
                symbol TEXT,
                timestamp TEXT,
                price REAL,
                amount REAL,
                side TEXT
            )
        """)
        await self._db.execute("""
            CREATE TABLE IF NOT EXISTS orderbooks (
                symbol TEXT,
                timestamp TEXT,
                bids TEXT,
                asks TEXT
            )
        """)
        await self._db.execute("""
            CREATE TABLE IF NOT EXISTS signals (
                symbol TEXT,
                timestamp TEXT,
                signal_type TEXT,
                direction TEXT,
                confidence REAL,
                source TEXT,
                metadata TEXT
            )
        """)
        await self._db.commit()
        logger.info(f"SQLite repository initialized at {self.db_path}")

    async def close(self):
        if self._db:
            await self._db.close()

    async def save_ohlcv(self, symbol: str, data: OHLCV):
        await self._db.execute(
            "INSERT OR REPLACE INTO ohlcv VALUES (?, ?, ?, ?, ?, ?, ?)",
            (symbol, data.timestamp.isoformat(), data.open, data.high, data.low, data.close, data.volume)
        )
        await self._db.commit()

    async def save_trade(self, symbol: str, trade: TradeEvent):
        await self._db.execute(
            "INSERT INTO trades VALUES (?, ?, ?, ?, ?)",
            (symbol, trade.timestamp.isoformat(), trade.price, trade.amount, trade.side)
        )
        await self._db.commit()

    async def save_orderbook(self, symbol: str, book: OrderBookSnapshot):
        bids_json = json.dumps([{"p": b.price, "a": b.amount} for b in book.bids])
        asks_json = json.dumps([{"p": a.price, "a": a.amount} for a in book.asks])
        await self._db.execute(
            "INSERT INTO orderbooks VALUES (?, ?, ?, ?)",
            (symbol, book.timestamp.isoformat(), bids_json, asks_json)
        )
        await self._db.commit()

    async def save_signal(self, signal: SignalEvent):
        await self._db.execute(
            "INSERT INTO signals VALUES (?, ?, ?, ?, ?, ?, ?)",
            (signal.symbol, signal.timestamp.isoformat(), signal.signal_type,
             signal.direction, signal.confidence, signal.source, json.dumps(signal.metadata))
        )
        await self._db.commit()

    async def get_ohlcv(self, symbol: str, limit: int) -> List[OHLCV]:
        async with self._db.execute(
            "SELECT * FROM ohlcv WHERE symbol = ? ORDER BY timestamp DESC LIMIT ?",
            (symbol, limit)
        ) as cursor:
            rows = await cursor.fetchall()
            return [OHLCV(
                symbol=r[0],
                timestamp=datetime.fromisoformat(r[1]),
                open=r[2], high=r[3], low=r[4], close=r[5], volume=r[6],
                interval="1m"
            ) for r in rows]

    async def get_trades(self, symbol: str, start: datetime, end: datetime) -> List[TradeEvent]:
        async with self._db.execute(
            "SELECT * FROM trades WHERE symbol = ? AND timestamp BETWEEN ? AND ? ORDER BY timestamp",
            (symbol, start.isoformat(), end.isoformat())
        ) as cursor:
            rows = await cursor.fetchall()
            return [TradeEvent(
                symbol=r[0],
                timestamp=datetime.fromisoformat(r[1]),
                price=r[2], amount=r[3], side=r[4]
            ) for r in rows]

    async def get_orderbooks(self, symbol: str, start: datetime, end: datetime) -> List[OrderBookSnapshot]:
        async with self._db.execute(
            "SELECT * FROM orderbooks WHERE symbol = ? AND timestamp BETWEEN ? AND ? ORDER BY timestamp",
            (symbol, start.isoformat(), end.isoformat())
        ) as cursor:
            rows = await cursor.fetchall()
            return [OrderBookSnapshot(
                symbol=r[0],
                timestamp=datetime.fromisoformat(r[1]),
                bids=[], # Simplified for model compatibility
                asks=[]
            ) for r in rows]
