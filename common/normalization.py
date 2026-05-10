from datetime import datetime
from typing import Dict, Any, List, Optional
from common.models import MarketSnapshot, OrderBookSnapshot, OrderBookLevel, TradeEvent, OHLCV

class PolymarketNormalizer:
    @staticmethod
    def normalize_book(data: Dict[str, Any]) -> OrderBookSnapshot:
        """Normalizes Polymarket CLOB 'book' event."""
        asset_id = data.get("asset_id")
        timestamp_ms = int(data.get("timestamp", 0))
        timestamp = datetime.fromtimestamp(timestamp_ms / 1000.0)

        bids = [OrderBookLevel(price=float(b["price"]), amount=float(b["size"])) for b in data.get("bids", [])]
        asks = [OrderBookLevel(price=float(a["price"]), amount=float(a["size"])) for a in data.get("asks", [])]

        return OrderBookSnapshot(
            symbol=asset_id,
            timestamp=timestamp,
            bids=bids,
            asks=asks
        )

    @staticmethod
    def normalize_price_change(data: Dict[str, Any]) -> List[OrderBookSnapshot]:
        """
        Normalizes Polymarket CLOB 'price_change' event.
        """
        results = []
        timestamp_ms = int(data.get("timestamp", 0))
        timestamp = datetime.fromtimestamp(timestamp_ms / 1000.0)

        for pc in data.get("price_changes", []):
            asset_id = pc.get("asset_id")
            bids = []
            asks = []
            if "best_bid" in pc and pc["best_bid"]:
                bids.append(OrderBookLevel(price=float(pc["best_bid"]), amount=0))
            if "best_ask" in pc and pc["best_ask"]:
                asks.append(OrderBookLevel(price=float(pc["best_ask"]), amount=0))

            results.append(OrderBookSnapshot(
                symbol=asset_id,
                timestamp=timestamp,
                bids=bids,
                asks=asks
            ))
        return results

    @staticmethod
    def normalize_last_trade_price(data: Dict[str, Any]) -> TradeEvent:
        """Normalizes Polymarket CLOB 'last_trade_price' event."""
        asset_id = data.get("asset_id")
        timestamp_ms = int(data.get("timestamp", 0))
        timestamp = datetime.fromtimestamp(timestamp_ms / 1000.0)

        return TradeEvent(
            symbol=asset_id,
            timestamp=timestamp,
            price=float(data.get("price", 0)),
            amount=float(data.get("size", 0)),
            side=data.get("side", "").lower()
        )
