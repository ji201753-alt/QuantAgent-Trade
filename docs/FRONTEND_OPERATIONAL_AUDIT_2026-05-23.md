# Frontend Operational Audit — 2026-05-23

## Scope
Panel-by-panel truthfulness and interaction coherence audit focused on runtime-backed behavior vs decorative behavior.

## Findings Summary

### Runtime-truthful or improved
- Runtime diagnostics panel now consumes backend telemetry endpoint and marks unsupported claims as `UNVERIFIED`.
- Forecasting panel now renders runtime-streamed `ForecastingOutput` events rather than hardcoded forecasts.

### Previously deceptive, corrected in this pass
1. **Orderbook panel**
   - Prior behavior: generated random mock bids/asks and static spread/mid labels.
   - Current behavior: binds to Zustand `marketData.orderbook`; shows explicit empty-state when no live depth.
2. **Observability panel**
   - Prior behavior: hardcoded bus load, latency, `ACTIVE_GPU`, and fake capacity bar.
   - Current behavior: binds to runtime telemetry for bus load/latency/state; hides utilization bar until real metric exists.
3. **High-frequency chart shell**
   - Prior behavior: synthetic candle history + synthetic Kronos markers + static headline value.
   - Current behavior: initializes empty and only renders provided data feed; removes synthetic markers and static certainty label.

### Still requiring follow-up hardening
- Chart data feed for `HighFrequencyChart` is not yet wired to real OHLCV stream in `App.tsx` / panel composition path.
- Overlay orchestrator requires validation that overlays are sourced from real store/runtime events rather than assumptions.
- Replay synchronization controls remain mostly local-state driven and need backend replay equivalence validation harness.
- Some workspaces likely retain static illustrative data (Arbitrage/Prediction/Investigation surfaces need dedicated pass).

## Interaction & synchronization risk inventory
- Potential Zustand churn risk from full-object telemetry polling every 3 seconds.
- WebSocket message fanout updates store directly inside `App.tsx`; requires selector-based render profiling under load.
- Cross-panel hover/context propagation appears wired but needs stress validation for rerender storms.

## Immediate next validation targets
1. Wire real OHLCV/candle stream to chart series and verify viewport/zoom persistence.
2. Run overlay integrity audit (TimesFM/Kronos/liquidity zones) for stale/dangling layer state.
3. Add replay traversal equivalence checks for forecast overlay state at identical timestamps.
4. Workspace-by-workspace interaction audit for action controls with no runtime effect.
