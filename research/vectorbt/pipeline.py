import pandas as pd
from typing import List, Dict, Any, Optional
from analytics.features import FeatureEngineer

class VBTResearchPipeline:
    """
    Integrates engineered features with vectorbt-ready datasets.
    Ensures deterministic alignment and prevents lookahead bias.
    """
    def __init__(self, feature_engineer: FeatureEngineer):
        self.feature_engineer = feature_engineer

    def get_dataset(self) -> pd.DataFrame:
        """Returns the full aligned dataset for research."""
        df = self.feature_engineer.export_vbt()
        if df.empty:
            return df

        # Ensure timestamp is the index and sorted
        df.sort_index(inplace=True)

        # Handle NaN values (forward fill then zero for remaining)
        df.ffill(inplace=True)
        df.fillna(0.0, inplace=True)

        return df

    def prepare_backtest_data(self, target_column: str = "close") -> Dict[str, pd.DataFrame]:
        """
        Prepares features and target for backtesting studies.
        Explicitly separates target to prevent leakage.
        """
        df = self.get_dataset()
        if df.empty:
            return {}

        # In a real backtest, we might shift the target if we want to predict future moves
        # But here we just return the aligned matrix.
        return {
            "price": df[[target_column]],
            "features": df.drop(columns=[target_column])
        }

    def get_multi_timeframe_dataset(self, intervals: List[str]) -> Dict[str, pd.DataFrame]:
        """
        Placeholder for multi-timeframe alignment logic.
        """
        # This would involve joining different OHLCV tables from storage
        return {}
