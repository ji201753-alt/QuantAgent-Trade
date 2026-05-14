import asyncio
import logging
from datetime import datetime
from typing import List, Any
from storage.repository import DataRepository
from core.event_bus import EventBus
from common.models import TradeEvent, OrderBookSnapshot

logger = logging.getLogger(__name__)

class ReplayEngine:
    """
    Deterministic replay engine for historical market reconstruction.
    Synchronizes across all registered system consumers via EventBus.
    """
    def __init__(self, repository: DataRepository, event_bus: EventBus):
        self.repository = repository
        self.event_bus = event_bus
        self.is_replaying = False

    async def stream_historical_interval(
        self,
        symbol: str,
        start: datetime,
        end: datetime,
        playback_speed: float = 1.0
    ):
        """
        Streams historical events from storage into the EventBus.
        Maintains temporal fidelity according to original timestamps.
        """
        self.is_replaying = True
        logger.info(f"Starting replay: {symbol} from {start} to {end} [Speed: {playback_speed}x]")

        try:
            # 1. Fetch trades and orderbook snapshots
            # Implementation assumes repository has these methods (they should be added to the interface)
            trades = await self.repository.get_trades(symbol, start, end)
            books = await self.repository.get_orderbooks(symbol, start, end)

            # 2. Interleave and sort by timestamp
            events = sorted(trades + books, key=lambda x: x.timestamp)

            if not events:
                logger.warning("No events found for the specified interval")
                return

            # 3. Stream through EventBus with temporal delays
            last_ts = events[0].timestamp
            for event in events:
                if not self.is_replaying:
                    break

                delay = (event.timestamp - last_ts).total_seconds() / playback_speed
                if delay > 0:
                    await asyncio.sleep(delay)

                await self.event_bus.publish(event)
                last_ts = event.timestamp

        except Exception as e:
            logger.error(f"Replay failed: {e}")
        finally:
            self.is_replaying = False
            logger.info("Replay cycle completed")

    def stop_replay(self):
        self.is_replaying = False
        logger.info("Replay stop requested")
