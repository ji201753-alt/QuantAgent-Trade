import logging
from datetime import datetime, timedelta
from typing import List, Dict, Any
from common.models import AnomalyEvent
from macro.models.schemas import StructuralContagion

logger = logging.getLogger(__name__)

class InformationFlowTracker:
    """
    Detects which markets reacted first and tracks propagation chains.
    Identifies directional flow of information and volatility.
    """
    def __init__(self, window_seconds: int = 10):
        self.window_seconds = window_seconds
        self.anomaly_buffer: List[AnomalyEvent] = []

    def track_anomaly(self, event: AnomalyEvent) -> List[StructuralContagion]:
        self.anomaly_buffer.append(event)

        # Cleanup
        cutoff = datetime.now() - timedelta(seconds=self.window_seconds)
        self.anomaly_buffer = [a for a in self.anomaly_buffer if a.timestamp > cutoff]

        if len(self.anomaly_buffer) < 2: return []

        contagions = []
        # Check if same metric triggered across symbols in short window
        symbols = [a.symbol for a in self.anomaly_buffer]
        if len(set(symbols)) > 1:
            # We have cross-market activity
            source = self.anomaly_buffer[0].symbol
            targets = list(set(symbols) - {source})

            contagions.append(StructuralContagion(
                id=f"cont_{int(datetime.now().timestamp())}",
                timestamp=datetime.now(),
                source_market=source,
                target_markets=targets,
                propagation_speed=1.0, # Placeholder
                severity=0.7,
                contagion_type=f"{self.anomaly_buffer[0].metric_name}_propagation"
            ))

        return contagions
