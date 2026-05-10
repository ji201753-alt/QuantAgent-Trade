import pandas as pd
from typing import List, Dict, Any, Optional
from analytics.features import FeatureEngineer

class VBTResearchPipeline:
    """
    Integrates engineered features with vectorbt-ready datasets.
    """
    def __init__(self, feature_engineer: FeatureEngineer):
        self.feature_engineer = feature_engineer

    def get_dataset(self) -> pd.DataFrame:
        """Returns the full aligned dataset for research."""
        return self.feature_engineer.export_vbt()

    def prepare_backtest_data(self, target_column: str = "close") -> Dict[str, pd.DataFrame]:
        """
        Prepares features and target for backtesting studies.
        """
        df = self.get_dataset()
        if df.empty:
            return {}

        return {
            "price": df[[target_column]],
            "features": df.drop(columns=[target_column])
        }
