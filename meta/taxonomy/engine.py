from typing import List, Optional
from meta.models import TaxonomyNode

class TaxonomyEngine:
    """
    Classifies market states into a hierarchical structural taxonomy.
    """
    def __init__(self):
        # Initial root nodes
        self.nodes = {
            "root": TaxonomyNode("root", "Market_Structure", None, [], []),
            "vol": TaxonomyNode("vol", "Volatility_Archetypes", "root", [], []),
            "liq": TaxonomyNode("liq", "Liquidity_Archetypes", "root", [], [])
        }

    def classify(self, regime_label: str) -> List[str]:
        # Return path of nodes for a given regime
        if "vol" in regime_label:
            return ["root", "vol"]
        if "liq" in regime_label:
            return ["root", "liq"]
        return ["root"]

    def get_node(self, node_id: str) -> Optional[TaxonomyNode]:
        return self.nodes.get(node_id)
