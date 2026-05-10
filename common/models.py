from datetime import datetime
from typing import Dict, List, Optional, Any
from dataclasses import dataclass, field

@dataclass
class OHLCV:
    symbol: str
    timestamp: datetime
    open: float
    high: float
    low: float
    close: float
    volume: float
    interval: str # e.g., "1s", "1m", "1h"

@dataclass
class MarketSnapshot:
    symbol: str
    timestamp: datetime
    price: float
    ohlcv: Optional[OHLCV] = None
    metadata: Dict[str, Any] = field(default_factory=dict)

@dataclass
class OrderBookLevel:
    price: float
    amount: float

@dataclass
class OrderBookSnapshot:
    symbol: str
    timestamp: datetime
    bids: List[OrderBookLevel]
    asks: List[OrderBookLevel]
    nonce: Optional[int] = None

@dataclass
class TradeEvent:
    symbol: str
    timestamp: datetime
    price: float
    amount: float
    side: str  # "buy" or "sell"
    trade_id: Optional[str] = None

@dataclass
class ImbalanceMetrics:
    symbol: str
    timestamp: datetime
    top_of_book_imbalance: float # (bid_vol - ask_vol) / (bid_vol + ask_vol)
    weighted_imbalance: float
    bid_depth_total: float
    ask_depth_total: float
    imbalance_momentum: float

@dataclass
class LiquiditySnapshot:
    symbol: str
    timestamp: datetime
    spread: float
    mid_price: float
    bid_depth_levels: Dict[int, float] # depth at levels
    ask_depth_levels: Dict[int, float]
    liquidity_concentration: float

@dataclass
class VolatilityMetrics:
    symbol: str
    timestamp: datetime
    realized_volatility: float
    rolling_volatility: float
    is_spike: bool = False
    atr: Optional[float] = None

@dataclass
class MarketPressure:
    symbol: str
    timestamp: datetime
    composite_pressure: float # derived from flow, imbalance, etc.
    buy_pressure: float
    sell_pressure: float

@dataclass
class AnomalyEvent:
    symbol: str
    timestamp: datetime
    metric_name: str
    z_score: float
    severity: str # "low", "medium", "high"
    description: str

@dataclass
class SignalEvent:
    symbol: str
    timestamp: datetime
    signal_type: str  # e.g., "trend_follow", "mean_reversion"
    direction: str  # "long", "short", "neutral"
    confidence: float  # 0.0 to 1.0
    source: str  # e.g., "indicator_agent"
    metadata: Dict[str, Any] = field(default_factory=dict)

@dataclass
class ForecastResult:
    symbol: str
    timestamp: datetime
    horizon: str
    predicted_value: float
    model_name: str
    confidence_interval: Optional[tuple[float, float]] = None
