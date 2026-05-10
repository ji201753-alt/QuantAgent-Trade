from datetime import datetime, timedelta
from typing import Dict, List, Optional
from common.models import TradeEvent, OHLCV

class OHLCVAggregator:
    def __init__(self, symbol: str, interval_seconds: int):
        self.symbol = symbol
        self.interval_seconds = interval_seconds
        self.current_candle: Optional[OHLCV] = None
        self.interval_str = f"{interval_seconds}s" if interval_seconds < 60 else f"{interval_seconds//60}m"

    def process_trade(self, trade: TradeEvent) -> Optional[OHLCV]:
        # Floor timestamp to interval
        candle_ts = trade.timestamp.replace(microsecond=0)
        seconds = (candle_ts - datetime.min).total_seconds()
        candle_ts = datetime.min + timedelta(seconds=(seconds // self.interval_seconds) * self.interval_seconds)

        completed_candle = None

        if self.current_candle and self.current_candle.timestamp < candle_ts:
            completed_candle = self.current_candle
            self.current_candle = None

        if not self.current_candle:
            self.current_candle = OHLCV(
                symbol=self.symbol,
                timestamp=candle_ts,
                open=trade.price,
                high=trade.price,
                low=trade.price,
                close=trade.price,
                volume=trade.amount,
                interval=self.interval_str
            )
        else:
            self.current_candle.high = max(self.current_candle.high, trade.price)
            self.current_candle.low = min(self.current_candle.low, trade.price)
            self.current_candle.close = trade.price
            self.current_candle.volume += trade.amount

        return completed_candle

class MultiTimeframeAggregator:
    def __init__(self, symbol: str, intervals: List[int]):
        self.aggregators = [OHLCVAggregator(symbol, i) for i in intervals]

    def process_trade(self, trade: TradeEvent) -> List[OHLCV]:
        completed = []
        for agg in self.aggregators:
            candle = agg.process_trade(trade)
            if candle:
                completed.append(candle)
        return completed
