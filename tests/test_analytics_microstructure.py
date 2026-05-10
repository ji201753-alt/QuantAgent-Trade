import pytest
from datetime import datetime
from common.models import OrderBookSnapshot, OrderBookLevel
from analytics.microstructure import ImbalanceEngine, LiquidityEngine

def test_imbalance_engine():
    engine = ImbalanceEngine(window_size=5)
    book = OrderBookSnapshot(
        symbol="BTC",
        timestamp=datetime.now(),
        bids=[OrderBookLevel(100, 10), OrderBookLevel(99, 20)],
        asks=[OrderBookLevel(101, 5), OrderBookLevel(102, 15)]
    )

    metrics = engine.compute_imbalance(book)
    assert metrics.top_of_book_imbalance == (10 - 5) / (10 + 5)
    assert metrics.bid_depth_total == 30
    assert metrics.ask_depth_total == 20
    assert metrics.weighted_imbalance == (30 - 20) / (30 + 20)

def test_liquidity_engine():
    book = OrderBookSnapshot(
        symbol="BTC",
        timestamp=datetime.now(),
        bids=[OrderBookLevel(100, 10)],
        asks=[OrderBookLevel(102, 10)]
    )
    liq = LiquidityEngine.analyze_liquidity(book)
    assert liq.spread == 2.0
    assert liq.mid_price == 101.0
