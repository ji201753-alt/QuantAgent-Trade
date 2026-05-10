import pandas as pd
import numpy as np

def compute_entropy(series: pd.Series, bins: int = 10) -> float:
    """Compute Shannon entropy of a series."""
    if series.empty: return 0.0
    try:
        c_vals = pd.cut(series, bins=bins).value_counts()
        probs = c_vals / len(series)
        return -np.sum(probs * np.log2(probs + 1e-9))
    except Exception:
        return 0.0

def compute_zscore(series: pd.Series) -> pd.Series:
    """Compute z-score of a series."""
    return (series - series.mean()) / (series.std() + 1e-9)
