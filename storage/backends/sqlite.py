import aiosqlite
import json
from typing import List
from common.models import OHLCV, TradeEvent, SignalEvent
from storage.repository import DataRepository

class SQLiteRepository(DataRepository):
    def __init__(self, db_path: str = "market_data.db"):
        self.db_path = db_path

    async def initialize(self):
        async with aiosqlite.connect(self.db_path) as db:
            await db.execute("""
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
            await db.execute("""
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
            await db.commit()

    async def save_ohlcv(self, symbol: str, data: OHLCV):
        async with aiosqlite.connect(self.db_path) as db:
            await db.execute(
                "INSERT OR REPLACE INTO ohlcv VALUES (?, ?, ?, ?, ?, ?, ?)",
                (symbol, data.timestamp.isoformat(), data.open, data.high, data.low, data.close, data.volume)
            )
            await db.commit()

    async def get_ohlcv(self, symbol: str, limit: int) -> List[OHLCV]:
        # Implementation for retrieval
        return []

    async def save_trade(self, symbol: str, trade: TradeEvent):
        pass

    async def save_signal(self, signal: SignalEvent):
        async with aiosqlite.connect(self.db_path) as db:
            await db.execute(
                "INSERT INTO signals VALUES (?, ?, ?, ?, ?, ?, ?)",
                (signal.symbol, signal.timestamp.isoformat(), signal.signal_type,
                 signal.direction, signal.confidence, signal.source, json.dumps(signal.metadata))
            )
            await db.commit()
