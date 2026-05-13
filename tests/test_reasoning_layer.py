import pytest
from datetime import datetime
from unittest.mock import MagicMock
from context.models.schemas import MarketContext, RegimeInterpretation
from decision.models import DecisionIntelligence, ConsensusState, StructuralConfidence
from reasoning.briefing.engine import BriefingEngine
from reasoning.exploration.assistant import ExplorationAssistant

def test_briefing_generation():
    engine = BriefingEngine()

    # Mock context & decision
    regime = RegimeInterpretation("BTC", datetime.now(), "normal", 0.9, "desc", [])
    ctx = MarketContext("BTC", datetime.now(), regime, "low", "Market is stable.", 0.1, 0.9, [])

    consensus = ConsensusState("BTC", datetime.now(), 1.0, [], "bullish", 0.8)
    confidence = StructuralConfidence("BTC", datetime.now(), 0.9, {}, 0.9, False)
    decision = DecisionIntelligence("BTC", datetime.now(), consensus, confidence, [], 0.1, 0.9)

    briefing = engine.generate_briefing(ctx, decision)
    assert "NORMAL" in briefing.context_summary
    assert "High system consensus" in briefing.uncertainty_landscape

def test_exploration_assistant():
    assistant = ExplorationAssistant()
    consensus = ConsensusState("BTC", datetime.now(), 0.0, ["forecasting"], "bearish", 0.2)
    confidence = StructuralConfidence("BTC", datetime.now(), 0.4, {}, 0.3, True)
    decision = DecisionIntelligence("BTC", datetime.now(), consensus, confidence, [], 0.8, 0.4)

    exploration = assistant.explore_decision("inv_1", decision)
    assert "Disagreement found in: forecasting" in exploration.conflicting_signals_analysis
