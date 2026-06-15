import logging
from collections import defaultdict, deque

import pandas as pd

from common.models import OHLCV
from core.event_bus import EventBus
from forecasting.timesfm.runtime import get_timesfm_runtime

logger = logging.getLogger(__name__)


class ForecastService:
    def __init__(self, event_bus: EventBus):
        self.event_bus = event_bus
        self.timesfm = get_timesfm_runtime()
        self._history = defaultdict(lambda: deque(maxlen=512))

    async def start(self):
        logger.info("Forecast Service started")
        self.event_bus.subscribe(OHLCV, self.generate_forecasts)

    async def stop(self):
        self.event_bus.unsubscribe(OHLCV, self.generate_forecasts)
        logger.info("Forecast Service stopped")

    async def generate_forecasts(self, ohlcv: OHLCV):
        history = self._history[ohlcv.symbol]
        history.append({
            "timestamp": pd.Timestamp(ohlcv.timestamp),
            "symbol": ohlcv.symbol,
            "close": ohlcv.close,
        })
        df = pd.DataFrame(list(history)).set_index("timestamp")
        outputs = await self.timesfm.run_inference(df)
        for output in outputs:
            await self.event_bus.publish(output)
