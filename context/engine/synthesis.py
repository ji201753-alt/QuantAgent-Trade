import logging
from datetime import datetime
from typing import List, Dict, Any, Optional
from common.models import ImbalanceMetrics, LiquiditySnapshot, VolatilityMetrics, AnomalyEvent, ForecastingOutput
from context.models.schemas import MarketContext, RegimeInterpretation, EventCorrelation

logger = logging.getLogger(__name__)

class ContextSynthesisEngine:
    """
    Synthesizes multi-factor intelligence into a unified MarketContext.
    Handles signal compression and operational prioritization.
    """
    def __init__(self):
        self.last_imbalance: Optional[ImbalanceMetrics] = None
        self.last_liquidity: Optional[LiquiditySnapshot] = None
        self.last_volatility: Optional[VolatilityMetrics] = None
        self.last_forecasts: Dict[str, ForecastingOutput] = {}
        self.active_anomalies: List[AnomalyEvent] = []

    def update_factor(self, factor: Any):
        if isinstance(factor, ImbalanceMetrics): self.last_imbalance = factor
        elif isinstance(factor, LiquiditySnapshot): self.last_liquidity = factor
        elif isinstance(factor, VolatilityMetrics): self.last_volatility = factor
        elif isinstance(factor, AnomalyEvent): self.active_anomalies.append(factor)
        elif isinstance(factor, ForecastingOutput): self.last_forecasts[factor.horizon] = factor

        # Cleanup
        if len(self.active_anomalies) > 10: self.active_anomalies.pop(0)

    def synthesize(self, symbol: str) -> MarketContext:
        ts = datetime.now()

        # 1. Determine Operational Priority
        priority = "low"
        if any(a.severity == "high" for a in self.active_anomalies):
            priority = "critical"
        elif self.last_volatility and self.last_volatility.is_spike:
            priority = "high"
        elif self.last_liquidity and self.last_liquidity.spread > 0.005:
            priority = "medium"

        # 2. Aggregated Uncertainty
        uncertainty = 0.5
        if self.last_forecasts:
            uncertainty = sum(f.uncertainty_score for f in self.last_forecasts.values()) / len(self.last_forecasts)

        # 3. Situational Summary (Compression)
        summary = self._generate_summary()

        # 4. Regime Interpretation (Placeholder for next step)
        regime = RegimeInterpretation(
            symbol=symbol,
            timestamp=ts,
            primary_regime="stable_monitoring",
            confidence=0.8,
            description="Market structure is stable within normal parameters.",
            supporting_evidence=["Volatility low", "Liquidity stable"]
        )

        return MarketContext(
            symbol=symbol,
            timestamp=ts,
            regime=regime,
            operational_priority=priority,
            situational_summary=summary,
            aggregated_uncertainty=float(uncertainty),
            alignment_score=1.0, # Placeholder
            active_correlations=[],
            explainability={
                "priority_drivers": [a.metric_name for a in self.active_anomalies] if priority == "critical" else [],
                "active_factors": ["imbalance", "volatility", "liquidity"]
            }
        )

    def _generate_summary(self) -> str:
        if not self.last_volatility: return "Waiting for market data..."

        parts = []
        if self.last_volatility.is_spike: parts.append("Volatility spiking")
        if self.last_liquidity and self.last_liquidity.spread > 0.005: parts.append("Low liquidity")
        if self.last_imbalance and abs(self.last_imbalance.weighted_imbalance) > 0.5: parts.append("Heavy imbalance")

        if not parts: return "Market condition: Normal / Stable"
        return "Market condition: " + " + ".join(parts)
