# TimesFM + Kronos MarketStructureState Integration — 2026-06-02

## Scope
This pass integrates TimesFM forecast interpretation and Kronos analog interpretation into the existing `MarketStructureState` without adding a new data source, chart engine, replay system, overlay system, or state store.

## TimesFM runtime changes
- `TimesFMForecaster` now attempts real local `timesfm` package loading and local checkpoint resolution from `TIMESFM_CHECKPOINT_PATH`, `TIMESFM_CHECKPOINT`, or `checkpoints/timesfm-*` directories.
- Device state is detected through local torch availability. CUDA uses GPU mode; missing CUDA is reported as `FALLBACK_CPU_MODE` when the model is actually loaded on CPU.
- The runtime reports `AVAILABLE`, `UNAVAILABLE`, `ERROR`, `FALLBACK_CPU_MODE`, or `STALE_INFERENCE` and never emits synthetic forecasts.
- `ForecastService` keeps a bounded per-symbol OHLCV context window and uses the shared TimesFM runtime bridge so runtime telemetry and forecast publication refer to the same model instance.

## MarketStructureState integration
- Forecast state now resolves inside `MarketStructureState.forecasts` with replay-filtered active forecasts, runtime status, stale flag, and error state.
- Kronos state now resolves inside `MarketStructureState.kronos` with active analogs, runtime status, regime transitions, trajectory sets, and unverified/offline reasons.
- Overlay orchestration reads TimesFM and Kronos state from `MarketStructureState`, preserving coexistence with footprint, profile, zones, and microstructure overlays.

## UI and workflow integration
- Forecasting, diagnostics, interpretability, alerts, copilot, footer status, and Kronos workspace surfaces now display model availability/error states from the unified market-structure snapshot.
- Forecast and Kronos alert/evidence paths anchor to the same replay context as microstructure frames and signals.
- Kronos visualization remains additive: analog trajectories render through the existing overlay orchestrator and do not replace microstructure or forecast overlays.

## Verification notes
- Forecast output remains unavailable unless the operator installs the real `timesfm` package and local checkpoints.
- Kronos backend generation remains unverified; UI surfaces now expose that status instead of implying a populated structural cognition index.
- Replay consistency depends on persisted forecast/analog history; current frontend filtering keeps live-session replay coherent but cold-launch reconstruction still requires backend persistence work.
