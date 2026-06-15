from collections import defaultdict, deque
from typing import Deque, Dict, Optional

from common.models import (
    MicrostructureFrame,
    MicrostructureSignal,
    OrderBookSnapshot,
    OrderFlowDelta,
    TradeEvent,
    VolumeAtPriceLevel,
)


class MicrostructureFrameBuilder:
    """
    Builds replayable microstructure state from the existing trade and orderbook stream.

    The builder is intentionally conservative: it exposes LIMITED/PARTIAL data modes when
    the incoming connector stream lacks full tick-by-tick or deep book information.
    """

    def __init__(self, trade_window: int = 250, price_precision: int = 4):
        self.trade_window = trade_window
        self.price_precision = price_precision
        self._trades: Dict[str, Deque[TradeEvent]] = defaultdict(lambda: deque(maxlen=trade_window))
        self._cumulative_delta: Dict[str, float] = defaultdict(float)
        self._last_book: Dict[str, OrderBookSnapshot] = {}
        self._last_frame: Dict[str, MicrostructureFrame] = {}
        self._last_signal_state: Dict[tuple[str, str], str] = {}

    def update_trade(self, trade: TradeEvent) -> Optional[MicrostructureFrame]:
        self._trades[trade.symbol].append(trade)
        signed = trade.amount if trade.side.lower() == "buy" else -trade.amount
        self._cumulative_delta[trade.symbol] += signed
        book = self._last_book.get(trade.symbol)
        if not book:
            return None
        return self.build_frame(book)

    def update_book(self, book: OrderBookSnapshot) -> MicrostructureFrame:
        self._last_book[book.symbol] = book
        return self.build_frame(book)

    def build_frame(self, book: OrderBookSnapshot) -> MicrostructureFrame:
        previous = self._last_frame.get(book.symbol)
        trades = list(self._trades[book.symbol])
        buy_volume = sum(t.amount for t in trades if t.side.lower() == "buy")
        sell_volume = sum(t.amount for t in trades if t.side.lower() != "buy")
        delta = buy_volume - sell_volume

        best_bid = book.bids[0].price if book.bids else 0.0
        best_ask = book.asks[0].price if book.asks else 0.0
        mid_price = (best_bid + best_ask) / 2 if best_bid and best_ask else 0.0
        spread = best_ask - best_bid if best_bid and best_ask else 0.0
        bid_depth_total = sum(level.amount for level in book.bids)
        ask_depth_total = sum(level.amount for level in book.asks)
        total_depth = bid_depth_total + ask_depth_total
        depth_imbalance = (bid_depth_total - ask_depth_total) / total_depth if total_depth else 0.0

        mode = self._data_mode(book, trades)
        profile = self._volume_profile(trades)
        stacked_imbalance_count = sum(1 for level in profile if abs(level.imbalance_ratio) >= 0.6)
        aggressive_buy_volume = sum(t.amount for t in trades if t.side.lower() == "buy" and best_ask and t.price >= best_ask)
        aggressive_sell_volume = sum(t.amount for t in trades if t.side.lower() != "buy" and best_bid and t.price <= best_bid)
        analytics = self._frame_analytics(
            previous=previous,
            buy_volume=buy_volume,
            sell_volume=sell_volume,
            delta=delta,
            mid_price=mid_price,
            spread=spread,
            total_depth=total_depth,
            depth_imbalance=depth_imbalance,
            stacked_imbalance_count=stacked_imbalance_count,
            aggressive_buy_volume=aggressive_buy_volume,
            aggressive_sell_volume=aggressive_sell_volume,
            profile=profile,
        )

        order_flow = OrderFlowDelta(
            symbol=book.symbol,
            timestamp=book.timestamp,
            buy_volume=buy_volume,
            sell_volume=sell_volume,
            delta=delta,
            cumulative_delta=self._cumulative_delta[book.symbol],
            trade_count=len(trades),
            data_mode=mode,
            aggressive_buy_volume=aggressive_buy_volume,
            aggressive_sell_volume=aggressive_sell_volume,
            stacked_imbalance_count=stacked_imbalance_count,
        )
        frame = MicrostructureFrame(
            symbol=book.symbol,
            timestamp=book.timestamp,
            bid_depth_total=bid_depth_total,
            ask_depth_total=ask_depth_total,
            depth_imbalance=depth_imbalance,
            spread=spread,
            mid_price=mid_price,
            order_flow=order_flow,
            volume_profile=profile,
            data_mode=mode,
            replay_anchor=book.timestamp.isoformat(),
            metadata={
                "bid_levels": len(book.bids),
                "ask_levels": len(book.asks),
                "trade_window": len(trades),
                "analytics": analytics,
            },
        )
        self._last_frame[book.symbol] = frame
        return frame

    def derive_signals(self, frame: MicrostructureFrame) -> list[MicrostructureSignal]:
        analytics = frame.metadata.get("analytics", {})
        candidates = [
            ("ABSORPTION", analytics.get("absorption_score", 0.0), 0.65, "high", "Aggressive flow met opposing depth without matching mid-price migration"),
            ("EXHAUSTION", analytics.get("exhaustion_score", 0.0), 0.7, "medium", "Execution intensity faded after elevated participation"),
            ("LIQUIDITY_VACUUM", analytics.get("liquidity_vacuum_score", 0.0), 0.6, "high", "Depth contracted or spread expanded relative to the previous frame"),
            ("IMBALANCE_TRANSITION", analytics.get("imbalance_transition_score", 0.0), 0.5, "medium", "Depth imbalance crossed sides between consecutive frames"),
            ("PARTICIPATION_SHIFT", analytics.get("participation_shift_score", 0.0), 0.8, "medium", "Trade participation changed materially inside the rolling window"),
            ("PRESSURE_TRANSITION", analytics.get("pressure_transition_score", 0.0), 0.55, "high", "Execution delta and depth pressure transitioned across the zero line"),
        ]
        signals: list[MicrostructureSignal] = []
        for signal_type, value, threshold, severity, description in candidates:
            state = "active" if value >= threshold else "inactive"
            state_key = (frame.symbol, signal_type)
            if state != "active" or self._last_signal_state.get(state_key) == state:
                self._last_signal_state[state_key] = state
                continue
            self._last_signal_state[state_key] = state
            signals.append(MicrostructureSignal(
                symbol=frame.symbol,
                timestamp=frame.timestamp,
                signal_type=signal_type,
                severity=severity,
                value=value,
                threshold=threshold,
                description=description,
                frame_anchor=frame.replay_anchor or frame.timestamp.isoformat(),
                data_mode=frame.data_mode,
                metadata={
                    "depth_imbalance": frame.depth_imbalance,
                    "delta": frame.order_flow.delta,
                    "cumulative_delta": frame.order_flow.cumulative_delta,
                    "spread": frame.spread,
                    "analytics": analytics,
                },
            ))
        return signals

    def _data_mode(self, book: OrderBookSnapshot, trades: list[TradeEvent]) -> str:
        if not trades:
            return "LIMITED_DATA_MODE"
        if len(book.bids) < 5 or len(book.asks) < 5:
            return "PARTIAL_DEPTH_MODE"
        return "LIVE_AGGREGATION_MODE"

    def _volume_profile(self, trades: list[TradeEvent]) -> list[VolumeAtPriceLevel]:
        buckets: dict[float, dict[str, float]] = defaultdict(lambda: {"bid": 0.0, "ask": 0.0})
        for trade in trades:
            price = round(trade.price, self.price_precision)
            if trade.side.lower() == "buy":
                buckets[price]["ask"] += trade.amount
            else:
                buckets[price]["bid"] += trade.amount
        levels = []
        for price, values in sorted(buckets.items()):
            total = values["bid"] + values["ask"]
            delta = values["ask"] - values["bid"]
            imbalance_ratio = delta / total if total else 0.0
            if abs(imbalance_ratio) >= 0.6:
                classification = "STACKED_BUY_IMBALANCE" if imbalance_ratio > 0 else "STACKED_SELL_IMBALANCE"
            elif total == 0:
                classification = "LIQUIDITY_VOID"
            else:
                classification = "BALANCED"
            levels.append(VolumeAtPriceLevel(
                price=price,
                bid_volume=values["bid"],
                ask_volume=values["ask"],
                total_volume=total,
                delta=delta,
                imbalance_ratio=imbalance_ratio,
                classification=classification,
            ))
        return levels

    def _frame_analytics(
        self,
        previous: Optional[MicrostructureFrame],
        buy_volume: float,
        sell_volume: float,
        delta: float,
        mid_price: float,
        spread: float,
        total_depth: float,
        depth_imbalance: float,
        stacked_imbalance_count: int,
        aggressive_buy_volume: float,
        aggressive_sell_volume: float,
        profile: list[VolumeAtPriceLevel],
    ) -> dict[str, float | str | int]:
        total_volume = buy_volume + sell_volume
        aggressive_total = aggressive_buy_volume + aggressive_sell_volume
        previous_depth = (previous.bid_depth_total + previous.ask_depth_total) if previous else total_depth
        previous_spread = previous.spread if previous else spread
        previous_mid = previous.mid_price if previous else mid_price
        previous_delta = previous.order_flow.delta if previous else delta
        previous_trade_count = previous.order_flow.trade_count if previous else len(profile)

        price_migration = abs(mid_price - previous_mid) / previous_mid if previous_mid else 0.0
        depth_contraction = max(0.0, (previous_depth - total_depth) / previous_depth) if previous_depth else 0.0
        spread_expansion = max(0.0, (spread - previous_spread) / previous_spread) if previous_spread else 0.0
        participation_shift = abs(total_volume - (previous.order_flow.buy_volume + previous.order_flow.sell_volume if previous else total_volume)) / max(total_volume, 1.0)
        aggressive_ratio = aggressive_total / max(total_volume, 1.0)
        imbalance_transition = 1.0 if previous and previous.depth_imbalance * depth_imbalance < 0 else 0.0
        pressure_transition = 1.0 if previous and previous_delta * delta < 0 and abs(depth_imbalance) > 0.15 else 0.0
        absorption = min(1.0, aggressive_ratio * (1.0 - min(price_migration * 100.0, 1.0)) * (0.5 + abs(depth_imbalance)))
        exhaustion = min(1.0, max(0.0, (previous_trade_count - len(profile)) / max(previous_trade_count, 1)) + max(0.0, (abs(previous_delta) - abs(delta)) / max(abs(previous_delta), 1.0)))
        liquidity_vacuum = min(1.0, depth_contraction + spread_expansion)
        hvn = max(profile, key=lambda level: level.total_volume, default=None)
        lvn_count = sum(1 for level in profile if hvn and level.total_volume < hvn.total_volume * 0.2)

        return {
            "absorption_score": round(absorption, 4),
            "exhaustion_score": round(exhaustion, 4),
            "liquidity_vacuum_score": round(liquidity_vacuum, 4),
            "imbalance_transition_score": imbalance_transition,
            "participation_shift_score": round(min(1.0, participation_shift), 4),
            "pressure_transition_score": pressure_transition,
            "aggressive_ratio": round(aggressive_ratio, 4),
            "price_migration": round(price_migration, 6),
            "depth_contraction": round(depth_contraction, 4),
            "spread_expansion": round(spread_expansion, 4),
            "stacked_imbalance_count": stacked_imbalance_count,
            "low_volume_node_count": lvn_count,
            "high_volume_node": hvn.price if hvn else 0.0,
        }
