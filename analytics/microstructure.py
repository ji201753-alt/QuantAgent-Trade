from typing import List, Dict, Optional
from datetime import datetime
from common.models import OrderBookSnapshot, ImbalanceMetrics, LiquiditySnapshot

class ImbalanceEngine:
    def __init__(self, window_size: int = 10):
        self.window_size = window_size
        self.history: List[float] = []

    def compute_imbalance(self, book: OrderBookSnapshot) -> ImbalanceMetrics:
        bid_vol_top = book.bids[0].amount if book.bids else 0.0
        ask_vol_top = book.asks[0].amount if book.asks else 0.0

        # Top of book imbalance
        total_top = bid_vol_top + ask_vol_top
        tob_imbalance = (bid_vol_top - ask_vol_top) / total_top if total_top > 0 else 0.0

        # Weighted depth imbalance (using up to 5 levels)
        bid_depth_total = sum(b.amount for b in book.bids[:5])
        ask_depth_total = sum(a.amount for a in book.asks[:5])
        total_depth = bid_depth_total + ask_depth_total
        weighted_imbalance = (bid_depth_total - ask_depth_total) / total_depth if total_depth > 0 else 0.0

        # Imbalance momentum
        self.history.append(tob_imbalance)
        if len(self.history) > self.window_size:
            self.history.pop(0)

        momentum = 0.0
        if len(self.history) > 1:
            momentum = self.history[-1] - self.history[0]

        return ImbalanceMetrics(
            symbol=book.symbol,
            timestamp=book.timestamp,
            top_of_book_imbalance=tob_imbalance,
            weighted_imbalance=weighted_imbalance,
            bid_depth_total=bid_depth_total,
            ask_depth_total=ask_depth_total,
            imbalance_momentum=momentum
        )

class LiquidityEngine:
    @staticmethod
    def analyze_liquidity(book: OrderBookSnapshot) -> LiquiditySnapshot:
        if not book.bids or not book.asks:
            return LiquiditySnapshot(
                symbol=book.symbol,
                timestamp=book.timestamp,
                spread=0.0,
                mid_price=0.0,
                bid_depth_levels={},
                ask_depth_levels={},
                liquidity_concentration=0.0
            )

        best_bid = book.bids[0].price
        best_ask = book.asks[0].price
        spread = best_ask - best_bid
        mid_price = (best_bid + best_ask) / 2.0

        bid_depths = {i: b.amount for i, b in enumerate(book.bids[:5])}
        ask_depths = {i: a.amount for i, a in enumerate(book.asks[:5])}

        # Concentration: % of depth in top 2 levels
        total_bid_depth = sum(b.amount for b in book.bids)
        top_2_bid = sum(b.amount for b in book.bids[:2])
        concentration = top_2_bid / total_bid_depth if total_bid_depth > 0 else 0.0

        return LiquiditySnapshot(
            symbol=book.symbol,
            timestamp=book.timestamp,
            spread=spread,
            mid_price=mid_price,
            bid_depth_levels=bid_depths,
            ask_depth_levels=ask_depths,
            liquidity_concentration=concentration
        )
