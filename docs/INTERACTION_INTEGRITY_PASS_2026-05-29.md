# Interaction Integrity Pass — 2026-05-29

## Objective
Validate and harden visible workstation controls so interactive surfaces either mutate real workstation state or explicitly disclose unavailable runtime control paths.

## Corrections made

### Workstation shell
- Added missing `OperationalRail` and `CommandHeader` components required by `App.tsx`.
- Workspace navigation now writes directly to Zustand `activeWorkspaceId`.
- Rail overlay buttons mutate shared `activeOverlays` state instead of acting as decorative controls.
- Header now displays runtime telemetry queue depth, TimesFM state, and websocket connection state.

### Replay controls
- Skip back/forward controls now advance replay time by deterministic one-minute increments.
- Exit-to-live now clears replay timestamp and returns replay mode to live state.

### Chart and overlays
- WebSocket bridge now streams `OHLCV` events.
- Frontend websocket handler stores OHLCV candles into `marketData.candles`.
- `HighFrequencyChart` consumes live candle state when no explicit data prop is supplied.
- Forecast overlay now renders runtime forecast points aligned by forecast timestamp + horizon.
- Overlay lifecycle no longer tears down every overlay on each update; cleanup is separated from update flow to reduce flicker/drift.

### Investigation controls
- Investigation sync/annotate now captures a context snapshot and writes investigation state.
- Export report now serializes the current investigation to JSON.
- Timeline event clicks now anchor replay time.
- Synthesize investigation now creates a real investigation record from chronology events.

### Runtime truthfulness
- Data source connector buttons are disabled because no backend connector lifecycle API exists yet; local-only toggles were removed from the surface to avoid false runtime state.
- Hardware utilization and recalibration controls now explicitly disclose unavailable backend instrumentation instead of implying live GPU control.
- Reasoning refresh is now a context snapshot action and evidence values derive from runtime store state where available.

## Remaining risks
- `npm run build` remains blocked by missing frontend `tsconfig.json`; targeted TypeScript validation was used for changed interaction files.
- Some advanced workspaces still require dedicated panel-by-panel audits for static literals and runtime gaps.
- Replay determinism is improved at the UI state level, but backend replay equivalence verification is still pending.
