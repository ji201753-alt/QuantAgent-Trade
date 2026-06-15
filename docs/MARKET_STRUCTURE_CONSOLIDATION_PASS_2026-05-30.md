# Market Structure Consolidation Pass — 2026-05-30

## Scope
This pass extends the existing microstructure backbone without introducing a new chart engine, replay system, overlay system, or state store. The goal is to make the current footprint, DOM, profile, chronology, replay, alert, and copilot paths converge around real `OrderBookSnapshot` and `TradeEvent` inputs.

## Existing systems preserved
- `MicrostructureFrameBuilder` remains the single frame constructor for replayable order-flow state.
- `MicrostructureAnalyticsService` remains the EventBus publisher for derived orderbook/trade analytics.
- `MicrostructureFrame` remains the chart/replay persistence unit consumed by overlays, panels, websocket clients, and chronology.
- The React workstation continues to use lightweight-charts, the existing overlay orchestrator, the existing websocket client, and the Zustand terminal store.

## Operational extensions
- Volume-at-price levels now expose imbalance ratios and classifications so footprint/profile views can identify stacked buy/sell imbalance from real execution buckets.
- Order-flow frames now include aggressive buy/sell volume and stacked imbalance counts derived from the current trade window and top-of-book context.
- Frame metadata now carries absorption, exhaustion, liquidity-vacuum, imbalance-transition, participation-shift, pressure-transition, depth-contraction, and spread-expansion scores.
- `MicrostructureSignal` is now a first-class EventBus event for significant market-structure transitions instead of a decorative frontend-only state.
- Chronology and websocket propagation now consume `MicrostructureSignal`, allowing replay, alerting, investigation anchoring, and copilot evidence references to share the same event path.

## Frontend convergence
- The former crypto market surface is now the native `Market Structure` workspace and is reachable from the operational rail and command palette.
- Footprint overlays show delta, cumulative delta, absorption, liquidity-vacuum, and stacked-imbalance state from replay-synchronized frames.
- Volume Profile overlays preserve HVN/LVN visibility and flag imbalance-classified price levels without replacing forecasts, Kronos analogs, zones, or investigation anchors.
- DOM/Depth displays runtime data mode and depth migration from the synchronized frame analytics.
- Microstructure alerts and copilot responses now reference first-class `MicrostructureSignal` events and can anchor replay/investigation workflows.

## Truthfulness contract
- All market-structure analytics are derived from available trade/orderbook inputs only.
- Data fidelity remains explicit through `LIMITED_DATA_MODE`, `PARTIAL_DEPTH_MODE`, or `LIVE_AGGREGATION_MODE`.
- The workstation does not claim market-by-order precision, full-depth visibility, or institutional footprint fidelity when connector inputs do not provide it.

## Remaining validation requirements
1. Add persisted microstructure-frame storage for historical reconstruction beyond bounded frontend memory.
2. Add replay equivalence tests that compare footprint, DOM, profile, alerts, and copilot evidence across repeated timestamps.
3. Add connector-level telemetry describing depth precision, trade aggressor reliability, and exchange sequence gaps.
4. Add endurance metrics for frame-buffer size, overlay render counts, websocket reconnects, and DOM update frequency.
