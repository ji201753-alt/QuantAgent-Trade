# Release Readiness Audit — 2026-05-30

## Scope
Full workstation-wide operational audit for continuous operation across live data, replay, investigations, TimesFM, Kronos, microstructure rendering, alerting, reasoning, websocket reconnects, and workspace switching.

## Production-ready foundations
- **EventBus lifecycle telemetry**: operational queue depth, published/processed counters, callback-error count, and subscriber visibility are exposed through runtime telemetry.
- **Runtime truthfulness contract**: diagnostic panels and footer no longer present hardcoded GPU, database, connector, or cognition certainty when backend telemetry is unavailable.
- **Microstructure backbone**: orderbook/trade streams can produce bounded replayable `MicrostructureFrame` history with explicit data fidelity modes.
- **Websocket lifecycle**: frontend websocket service has connect/disconnect semantics and bounded frontend histories for candles, forecasts, and microstructure frames.
- **Operator workflow continuity**: active workspace, replay state, overlays, symbol, and investigation can hydrate from local session state.

## Operationally usable, with limitations
- **Live market workspace**: chart, DOM, microstructure, alerts, and forecasts share the same store/runtime event path.
- **Replay/investigation workspace**: replay controls, chronology, investigation state, and grounded copilot now operate in one surface.
- **Alert-to-investigation path**: runtime alerts can anchor replay and initialize an investigation with evidence.
- **Microstructure rendering**: footprint/profile/DOM render from real frames, but they remain aggregated views when connector precision is limited.

## Experimental or partially implemented
- **TimesFM**: package/weight detection is truthful, but real local inference remains disabled until the official TimesFM adapter is wired. The runtime reports `MODEL_UNAVAILABLE`, `WEIGHTS_MISSING`, or `ADAPTER_UNIMPLEMENTED`; it no longer emits synthetic forecasts.
- **Kronos**: frontend state and overlays exist, but backend structural discovery/index generation remains unverified. Kronos must remain marked `UNVERIFIED` unless runtime telemetry confirms generation.
- **Macro/arbitrage workspaces**: still contain illustrative/static operating surfaces and are marked as experimental static surfaces until runtime feeds are connected.
- **Replay determinism**: frontend timestamp anchoring is wired, but backend equivalence tests for chart, forecast, Kronos, microstructure, chronology, alerts, reasoning, and investigations remain pending.

## External requirements
- Exchange/websocket connectivity is required for real orderbook/trade/OHLCV streams.
- TimesFM package and local checkpoints are required before adapter wiring can be completed.
- Backend connector lifecycle APIs are required before connector activation controls can be enabled truthfully.
- Persisted microstructure-frame storage is required for complete historical replay reconstruction beyond in-memory frontend buffers.

## v1 release blockers
1. Wire and validate the official local TimesFM inference adapter, or keep TimesFM disabled in release builds.
2. Validate Kronos backend generation, indexing, replay synchronization, and investigation grounding.
3. Add replay equivalence tests for repeated timestamps across overlays, microstructure, forecasts, chronology, alerts, and investigations.
4. Persist chart viewport/time-scale state across workspace switching and cold launch.
5. Replace or connect remaining static macro/arbitrage surfaces to runtime telemetry before claiming operational status.
6. Add endurance counters for websocket reconnects, overlay object counts, frame-buffer sizes, and long-session memory growth.

## Operational conclusion
The workstation has crossed from prototype-style presentation into a truthful recovery build. It is operationally usable for local monitoring and investigation workflows where runtime data exists, but it is not v1 production-ready until TimesFM, Kronos, replay determinism, connector lifecycle control, and remaining static surfaces are validated end-to-end.
