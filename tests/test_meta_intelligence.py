import pytest
from datetime import datetime
from meta.clustering.engine import StructuralClusteringEngine
from meta.evolution.tracker import EvolutionTracker
from meta.attention.learner import AttentionLearner
from memory.models import ContextualFingerprint

def test_clustering_archetypes():
    engine = StructuralClusteringEngine(similarity_threshold=0.8)
    fp = ContextualFingerprint("fp1", "BTC", datetime.now(), [0.5, 0.5, 0], "normal", "hash1")

    families = engine.cluster([fp])
    assert len(families) == 1
    assert families[0].archetype_id == "fp1"

def test_evolution_tracking():
    tracker = EvolutionTracker("BTC")
    tracker.record_regime("normal")
    tracker.record_regime("vol_spike")
    tracker.record_regime("vol_spike") # No double recording

    evo = tracker.get_current_evolution()
    assert len(evo.transition_path) == 2
    assert evo.instability_index == 1.0

def test_attention_evaluation():
    learner = AttentionLearner()
    att = learner.evaluate_attention("anomaly_1", 0.9, 0.8)
    assert att.importance_score > 0.8
    assert "Critical" in att.escalation_reason
