import pandas as pd
import talib
from typing import Dict, List, Any

class IndicatorCalculator:
    @staticmethod
    def compute_rsi(df: pd.DataFrame, period: int = 14) -> List[float]:
        rsi = talib.RSI(df["Close"], timeperiod=period)
        return rsi.fillna(0).round(2).tolist()

    @staticmethod
    def compute_macd(df: pd.DataFrame, fastperiod: int = 12, slowperiod: int = 26, signalperiod: int = 9) -> Dict[str, List[float]]:
        macd, macd_signal, macd_hist = talib.MACD(
            df["Close"],
            fastperiod=fastperiod,
            slowperiod=slowperiod,
            signalperiod=signalperiod,
        )
        return {
            "macd": macd.fillna(0).round(2).tolist(),
            "macd_signal": macd_signal.fillna(0).round(2).tolist(),
            "macd_hist": macd_hist.fillna(0).round(2).tolist(),
        }

    @staticmethod
    def compute_stoch(df: pd.DataFrame) -> Dict[str, List[float]]:
        stoch_k, stoch_d = talib.STOCH(
            df["High"],
            df["Low"],
            df["Close"],
            fastk_period=14,
            slowk_period=3,
            slowd_period=3,
        )
        return {
            "stoch_k": stoch_k.fillna(0).round(2).tolist(),
            "stoch_d": stoch_d.fillna(0).round(2).tolist(),
        }

    @staticmethod
    def compute_roc(df: pd.DataFrame, period: int = 10) -> List[float]:
        roc = talib.ROC(df["Close"], timeperiod=period)
        return roc.fillna(0).round(2).tolist()

    @staticmethod
    def compute_willr(df: pd.DataFrame, period: int = 14) -> List[float]:
        willr = talib.WILLR(df["High"], df["Low"], df["Close"], timeperiod=period)
        return willr.fillna(0).round(2).tolist()

class StatisticsCalculator:
    @staticmethod
    def compute_rolling_stats(df: pd.DataFrame, window: int = 20) -> Dict[str, Any]:
        return {
            "rolling_mean": df["Close"].rolling(window=window).mean().fillna(0).tolist(),
            "rolling_std": df["Close"].rolling(window=window).std().fillna(0).tolist(),
        }

    @staticmethod
    def compute_volatility(df: pd.DataFrame, window: int = 20) -> float:
        returns = df["Close"].pct_change().dropna()
        return returns.std() * (252**0.5)  # Annualized volatility
