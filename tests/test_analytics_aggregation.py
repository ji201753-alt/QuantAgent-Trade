import pytest
from datetime import datetime, timedelta
from common.models import TradeEvent
from analytics.aggregation import OHLCVAggregator

def test_ohlcv_aggregator():
    agg = OHLCVAggregator("BTC", 60) # 1m
    base_ts = datetime(2023, 1, 1, 12, 0, 0)

    # Trade in current minute
    agg.process_trade(TradeEvent("BTC", base_ts + timedelta(seconds=10), 100, 1, "buy"))
    agg.process_trade(TradeEvent("BTC", base_ts + timedelta(seconds=30), 105, 2, "sell"))

    # Trade in next minute triggers completion
    candle = agg.process_trade(TradeEvent("BTC", base_ts + timedelta(seconds=70), 102, 1, "buy"))

    assert candle is not None
    assert candle.open == 100
    assert candle.high == 105
    assert candle.low == 100
    assert candle.close == 105
    assert candle.volume == 3
    assert candle.timestamp == base_ts
