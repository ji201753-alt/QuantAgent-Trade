from abc import ABC, abstractmethod
from typing import Any, List, Optional, Dict
from connectors.websocket_manager import WebSocketManager, ConnectionState

class BaseWebSocketConnector(ABC):
    """
    Abstract base class for all WebSocket-based market connectors.
    Wraps the WebSocketManager to provide a consistent interface.
    """
    def __init__(self, uri: str, name: str = "WebSocketConnector"):
        self.uri = uri
        self.name = name
        self.manager = WebSocketManager(
            uri=uri,
            on_message=self._handle_message,
            name=name,
            **self._get_manager_config()
        )

    def _get_manager_config(self) -> Dict[str, Any]:
        """Override this to provide custom manager configuration."""
        return {}

    async def connect(self):
        """Starts the underlying connection manager."""
        await self.manager.start()

    async def disconnect(self):
        """Stops the underlying connection manager."""
        await self.manager.stop()

    def get_state(self) -> ConnectionState:
        """Returns the current connection state."""
        return self.manager.get_state()

    @abstractmethod
    async def _handle_message(self, message: Any):
        """
        Process incoming raw messages.
        Must be implemented by subclasses to perform normalization and routing.
        """
        pass

    @abstractmethod
    async def subscribe(self, topics: List[str]):
        """
        Send subscription messages to the exchange.
        """
        pass
