from datetime import datetime
from typing import Dict, List, Optional, Any
from dataclasses import dataclass, field

@dataclass
class OHLCV:
    timestamp: datetime
    open: float
    high: float
    low: float
    close: float
    volume: float

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

@dataclass
class TradeEvent:
    symbol: str
    timestamp: datetime
    price: float
    amount: float
    side: str  # "buy" or "sell"
    trade_id: Optional[str] = None

@dataclass
class VolatilityMetrics:
    symbol: str
    timestamp: datetime
    realized_volatility: float
    atr: Optional[float] = None
    bollinger_bands: Optional[Dict[str, float]] = None

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
