# TimesFM Runtime Validation Pass — 2026-05-23

## Objective
Move TimesFM from synthetic placeholder behavior toward operational truthfulness using the existing runtime architecture.

## Changes made
1. Added explicit TimesFM runtime state surfacing:
   - `MODEL_UNAVAILABLE` when `timesfm` package is missing.
   - `WEIGHTS_MISSING` when checkpoints are not present.
   - `INITIALIZATION_FAILED` when runtime setup errors.
   - `FALLBACK_CPU_MODE` when CUDA is unavailable.
   - `ACTIVE` when runtime initializes with acceleration.
2. Added runtime diagnostics fields:
   - `timesfm_installed`, `weights_available`, `fallback`, `error`, `stale_inference`.
3. Removed random synthetic forecast behavior; inference now returns deterministic outputs from observed context and never silently simulates unavailable model paths.
4. Integrated forecast publication into existing EventBus flow via `ForecastService`.
5. Extended websocket bridge to stream `ForecastingOutput` events.
6. Bound frontend forecasting panel to runtime forecast stream + runtime telemetry status.

## Truth-model status after this pass
- Runtime now exposes explicit degraded/unavailable states instead of implied confidence.
- Forecast panel now renders runtime-fed forecasts only; when unavailable, UI shows absence explicitly.
- Replay determinism for TimesFM remains pending full replay pipeline validation harness.

## Remaining work
- Replace integration-ready model bootstrap with direct official TimesFM API loading once local env dependency contract is finalized.
- Attach forecast events to replay anchor persistence and reconstruction validation.
- Add determinism equivalence checks across repeated replay timestamps.
