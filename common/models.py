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
class VolumeAtPriceLevel:
    price: float
    bid_volume: float = 0.0
    ask_volume: float = 0.0
    total_volume: float = 0.0
    delta: float = 0.0
    imbalance_ratio: float = 0.0
    classification: str = "NEUTRAL"

@dataclass
class OrderFlowDelta:
    symbol: str
    timestamp: datetime
    buy_volume: float
    sell_volume: float
    delta: float
    cumulative_delta: float
    trade_count: int
    data_mode: str = "LIMITED_DATA_MODE"
    aggressive_buy_volume: float = 0.0
    aggressive_sell_volume: float = 0.0
    stacked_imbalance_count: int = 0

@dataclass
class MicrostructureFrame:
    symbol: str
    timestamp: datetime
    bid_depth_total: float
    ask_depth_total: float
    depth_imbalance: float
    spread: float
    mid_price: float
    order_flow: OrderFlowDelta
    volume_profile: List[VolumeAtPriceLevel] = field(default_factory=list)
    data_mode: str = "LIMITED_DATA_MODE"
    replay_anchor: Optional[str] = None
    metadata: Dict[str, Any] = field(default_factory=dict)

@dataclass
class MicrostructureSignal:
    symbol: str
    timestamp: datetime
    signal_type: str
    severity: str
    value: float
    threshold: float
    description: str
    frame_anchor: str
    data_mode: str = "LIMITED_DATA_MODE"
    metadata: Dict[str, Any] = field(default_factory=dict)

@dataclass
class NormalizedExternalEvent:
    id: str
    timestamp: datetime
    category: str
    title: str
    summary: str
    severity: str = "info"
    source: str = "manual"
    affected_symbols: List[str] = field(default_factory=list)
    metadata: Dict[str, Any] = field(default_factory=dict)

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

@dataclass
class ForecastDistribution:
    mean: float
    std: float
    median: float
    p10: float
    p90: float

@dataclass
class ForecastingOutput:
    symbol: str
    timestamp: datetime
    horizon: str
    target_metric: str # e.g., "price", "volatility", "imbalance"
    prediction: float
    distribution: Optional[ForecastDistribution] = None
    confidence_interval: Optional[tuple[float, float]] = None
    uncertainty_score: float = 0.0 # 0.0 to 1.0
    model_name: str = "generic"
    metadata: Dict[str, Any] = field(default_factory=dict)
