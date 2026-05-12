import logging
from typing import List, Dict, Optional
from datetime import datetime
from meta.models import MarketEvolution

logger = logging.getLogger(__name__)

class ContextualGenealogy:
    """
    Tracks the ancestry and descendants of market patterns and regimes.
    Enables structural inheritance analysis.
    """
    def __init__(self):
        self.genealogy_tree: Dict[str, List[str]] = {} # regime_id -> children_regime_ids

    def record_inheritance(self, parent_regime: str, child_regime: str):
        if parent_regime not in self.genealogy_tree:
            self.genealogy_tree[parent_regime] = []

        if child_regime not in self.genealogy_tree[parent_regime]:
            self.genealogy_tree[parent_regime].append(child_regime)
            logger.info(f"Genealogy: {child_regime} inherited from {parent_regime}")

    def get_descendants(self, regime_id: str) -> List[str]:
        return self.genealogy_tree.get(regime_id, [])

    def get_lineage_path(self, start_regime: str) -> List[str]:
        # Simplistic linear path reconstruction for demo
        path = [start_regime]
        curr = start_regime
        while curr in self.genealogy_tree and self.genealogy_tree[curr]:
            curr = self.genealogy_tree[curr][0]
            path.append(curr)
        return path
