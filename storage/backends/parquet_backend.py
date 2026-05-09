import pandas as pd
import os
from common.models import OHLCV

class ParquetStorage:
    def __init__(self, base_path: str = "data/parquet"):
        self.base_path = base_path
        os.makedirs(base_path, exist_ok=True)

    def save_ohlcv(self, symbol: str, df: pd.DataFrame):
        path = os.path.join(self.base_path, f"{symbol}.parquet")
        df.to_parquet(path)
