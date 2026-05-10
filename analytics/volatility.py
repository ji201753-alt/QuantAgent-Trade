import numpy as np
from typing import List, Optional
from datetime import datetime
from common.models import VolatilityMetrics

class VolatilityEngine:
    def __init__(self, window_size: int = 20):
        self.window_size = window_size
        self.prices: List[float] = []

    def update(self, symbol: str, timestamp: datetime, price: float) -> Optional[VolatilityMetrics]:
        self.prices.append(price)
        if len(self.prices) > self.window_size + 1:
            self.prices.pop(0)

        if len(self.prices) < self.window_size:
            return None

        returns = np.diff(self.prices) / self.prices[:-1]
        realized_vol = np.std(returns) * np.sqrt(len(returns)) # Local window volatility
        rolling_vol = np.std(returns) # Simplistic rolling std

        # Detect spike (e.g., > 3x average, simplistic for now)
        is_spike = False
        if len(returns) > 5:
            avg_past_vol = np.mean([np.std(returns[i:i+3]) for i in range(len(returns)-3)])
            if rolling_vol > avg_past_vol * 3:
                is_spike = True

        return VolatilityMetrics(
            symbol=symbol,
            timestamp=timestamp,
            realized_volatility=float(realized_vol),
            rolling_volatility=float(rolling_vol),
            is_spike=is_spike
        )
