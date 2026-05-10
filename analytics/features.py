import pandas as pd
import numpy as np
from typing import List, Dict, Any, Optional
from datetime import datetime
from common.models import OHLCV, ImbalanceMetrics, VolatilityMetrics, LiquiditySnapshot, MarketPressure

class FeatureEngineer:
    def __init__(self, window_size: int = 100):
        self.window_size = window_size
        self.feature_store: List[Dict[str, Any]] = []

    def generate_features(
        self,
        ohlcv: OHLCV,
        imbalance: Optional[ImbalanceMetrics] = None,
        volatility: Optional[VolatilityMetrics] = None,
        liquidity: Optional[LiquiditySnapshot] = None,
        pressure: Optional[MarketPressure] = None
    ) -> Dict[str, Any]:

        feature_row = {
            "timestamp": ohlcv.timestamp,
            "symbol": ohlcv.symbol,
            "close": ohlcv.close,
            "volume": ohlcv.volume,
        }

        if imbalance:
            feature_row["imbalance_tob"] = imbalance.top_of_book_imbalance
            feature_row["imbalance_weighted"] = imbalance.weighted_imbalance
            feature_row["imbalance_mom"] = imbalance.imbalance_momentum

        if volatility:
            feature_row["vol_realized"] = volatility.realized_volatility
            feature_row["vol_rolling"] = volatility.rolling_volatility
            feature_row["vol_is_spike"] = 1.0 if volatility.is_spike else 0.0

        if liquidity:
            feature_row["liq_spread"] = liquidity.spread
            feature_row["liq_concentration"] = liquidity.liquidity_concentration

        if pressure:
            feature_row["pressure_composite"] = pressure.composite_pressure

        if liquidity and volatility:
            feature_row["regime_micro"] = self._detect_regime(liquidity, volatility)

        self.feature_store.append(feature_row)
        if len(self.feature_store) > self.window_size:
            self.feature_store.pop(0)

        if len(self.feature_store) >= 10:
            feature_row.update(self._compute_rolling_features())

        return feature_row

    def _detect_regime(self, liq: LiquiditySnapshot, vol: VolatilityMetrics) -> float:
        if vol.is_spike and liq.spread > liq.mid_price * 0.005: return 3.0
        if vol.is_spike: return 1.0
        if liq.spread > liq.mid_price * 0.005: return 2.0
        return 0.0

    def _compute_rolling_features(self) -> Dict[str, float]:
        df = pd.DataFrame(self.feature_store[-20:])
        results = {}
        if "close" in df.columns:
            results["mom_10"] = (df["close"].iloc[-1] / df["close"].iloc[-10]) - 1 if len(df) >= 10 else 0.0
            vol_mean = df["volume"].mean()
            vol_std = df["volume"].std()
            results["vol_zscore"] = (df["volume"].iloc[-1] - vol_mean) / vol_std if vol_std > 1e-9 else 0.0
        return results

    def export_vbt(self) -> pd.DataFrame:
        if not self.feature_store:
            return pd.DataFrame()
        df = pd.DataFrame(self.feature_store)
        df.set_index("timestamp", inplace=True)
        df.sort_index(inplace=True)
        return df
