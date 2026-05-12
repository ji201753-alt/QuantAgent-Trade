import logging
from datetime import datetime
from typing import List, Dict, Optional
from meta.models import MarketEvolution

logger = logging.getLogger(__name__)

class EvolutionTracker:
    """
    Tracks regime transitions and structural evolution over time.
    Calculates instability indices and persistence metrics.
    """
    def __init__(self, symbol: str):
        self.symbol = symbol
        self.transition_path: List[str] = []
        self.start_time = datetime.now()

    def record_regime(self, regime_label: str):
        if not self.transition_path or self.transition_path[-1] != regime_label:
            self.transition_path.append(regime_label)
            logger.info(f"Market Evolution: Transition to {regime_label}")

    def get_current_evolution(self) -> MarketEvolution:
        # Simple persistence: ratio of unique states
        unique_states = len(set(self.transition_path))
        instability = unique_states / len(self.transition_path) if self.transition_path else 0.0

        return MarketEvolution(
            symbol=self.symbol,
            start_time=self.start_time,
            end_time=datetime.now(),
            transition_path=self.transition_path,
            persistence_matrix={}, # Mock
            instability_index=instability
        )
