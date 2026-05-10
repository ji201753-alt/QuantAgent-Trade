import pandas as pd
import numpy as np
from typing import Dict

class FactorAnalyzer:
    """
    Perform statistical factor research on engineered features.
    """
    @staticmethod
    def compute_rolling_correlations(df: pd.DataFrame, window: int = 20) -> pd.DataFrame:
        """Compute rolling correlations between all columns and the close price."""
        if "close" not in df.columns:
            return pd.DataFrame()

        corrs = df.rolling(window=window).corr()
        try:
            # Extract correlations with close price
            return corrs.xs("close", level=1).drop(columns=["close"])
        except Exception:
            return pd.DataFrame()

    @staticmethod
    def test_factor_significance(df: pd.DataFrame, factor_col: str, target_col: str = "close") -> Dict[str, float]:
        """Simple significance test for a factor."""
        if factor_col not in df.columns or target_col not in df.columns:
            return {}

        returns = df[target_col].pct_change().shift(-1) # Forward returns
        correlation = df[factor_col].corr(returns)

        return {
            "forward_correlation": float(correlation) if not np.isnan(correlation) else 0.0,
            "factor_mean": float(df[factor_col].mean()),
            "factor_std": float(df[factor_col].std())
        }
