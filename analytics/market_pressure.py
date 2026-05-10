from datetime import datetime
from typing import List
from common.models import MarketPressure, ImbalanceMetrics, TradeEvent

class MarketPressureEngine:
    def __init__(self, alpha: float = 0.5):
        self.alpha = alpha

    def compute_pressure(self, imbalance: ImbalanceMetrics, last_trades: List[TradeEvent]) -> MarketPressure:
        buy_vol = sum(t.amount for t in last_trades if t.side == "buy")
        sell_vol = sum(t.amount for t in last_trades if t.side == "sell")
        total_vol = buy_vol + sell_vol

        flow_pressure = (buy_vol - sell_vol) / total_vol if total_vol > 0 else 0.0
        flow_pressure = max(-1.0, min(1.0, flow_pressure))

        composite = (self.alpha * flow_pressure) + ((1 - self.alpha) * imbalance.weighted_imbalance)
        composite = max(-1.0, min(1.0, composite))

        return MarketPressure(
            symbol=imbalance.symbol,
            timestamp=imbalance.timestamp,
            composite_pressure=float(composite),
            buy_pressure=float(buy_vol),
            sell_pressure=float(sell_vol)
        )
