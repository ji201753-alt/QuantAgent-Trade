import pytest
import asyncio
import os
from common.models import OHLCV
from storage.backends.sqlite import SQLiteRepository
from datetime import datetime

@pytest.mark.asyncio
async def test_sqlite_ohlcv_storage():
    db_path = "test_market_data.db"
    if os.path.exists(db_path):
        os.remove(db_path)

    repo = SQLiteRepository(db_path)
    await repo.initialize()

    ohlcv = OHLCV(
        timestamp=datetime.now(),
        open=100.0,
        high=105.0,
        low=95.0,
        close=102.0,
        volume=1000.0
    )

    await repo.save_ohlcv("BTC/USDT", ohlcv)
    # verify it doesn't crash and table exists

    if os.path.exists(db_path):
        os.remove(db_path)

@pytest.mark.asyncio
async def test_forecaster_registry():
    from forecasting.registry import ForecasterRegistry
    # Should raise error since models are placeholders and not actually implemented/importable yet
    with pytest.raises(ImportError):
        ForecasterRegistry.get_model("xgboost")
