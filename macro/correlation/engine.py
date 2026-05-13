import numpy as np
from datetime import datetime
from typing import List, Dict, Any, Optional
from macro.models.schemas import InterMarketCorrelation

class CrossMarketCorrelationEngine:
    """
    Computes rolling correlations and lead-lag relationships between markets.
    Identifies synchronized structural behavior.
    """
    def __init__(self, window_size: int = 50):
        self.window_size = window_size
        self.market_data: Dict[str, List[float]] = {} # symbol -> list of mid_prices

    def update_market(self, symbol: str, price: float):
        if symbol not in self.market_data:
            self.market_data[symbol] = []
        self.market_data[symbol].append(price)
        if len(self.market_data[symbol]) > self.window_size:
            self.market_data[symbol].pop(0)

    def compute_pair_correlation(self, sym1: str, sym2: str) -> Optional[InterMarketCorrelation]:
        if sym1 not in self.market_data or sym2 not in self.market_data:
            return None

        d1 = self.market_data[sym1]
        d2 = self.market_data[sym2]

        if len(d1) < self.window_size or len(d2) < self.window_size:
            return None

        # Align lengths
        min_len = min(len(d1), len(d2))
        v1 = np.array(d1[-min_len:])
        v2 = np.array(d2[-min_len:])

        corr = np.corrcoef(v1, v2)[0, 1]

        # Lead-lag via cross-correlation shift (simplistic)
        # In real engine, we'd use multiple shifts to find max correlation

        return InterMarketCorrelation(
            timestamp=datetime.now(),
            pair=(sym1, sym2),
            correlation_coefficient=float(corr) if not np.isnan(corr) else 0.0,
            lead_lag_ms=0.0, # Placeholder
            alignment_confidence=0.8
        )
