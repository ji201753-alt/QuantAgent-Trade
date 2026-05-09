from typing import Dict, Any

MODULAR_CONFIG: Dict[str, Any] = {
    "engine": {
        "auto_start": True,
        "max_workers": 10,
    },
    "storage": {
        "type": "sqlite",
        "path": "market_data.db",
    },
    "llm": {
        "agent_model": "gpt-4o-mini",
        "graph_model": "gpt-4o",
        "temperature": 0.1,
    },
    "connectors": {
        "binance": {"enabled": False},
        "polymarket": {"enabled": False},
        "forex": {"enabled": False},
    }
}
