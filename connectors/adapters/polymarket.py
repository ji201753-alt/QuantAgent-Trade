from connectors.base import RESTConnector
from common.models import MarketSnapshot

class PolymarketConnector(RESTConnector):
    async def connect(self):
        pass

    async def disconnect(self):
        pass

    async def get_latest_snapshot(self, symbol: str) -> MarketSnapshot:
        pass
