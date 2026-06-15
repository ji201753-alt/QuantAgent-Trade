# Runtime Consolidation Pass — 2026-05-23

## Objective
Eliminate runtime authority fragmentation across `core/engine.py`, `core/orchestration.py`, and `core/runtime_orchestrator.py` without large rewrites.

## What was consolidated
1. **Single startup authority**
   - `MarketIntelligenceEngine` now routes startup through `StartupOrchestrator.orchestrate()`.
2. **Single runtime lifecycle authority**
   - `MarketIntelligenceEngine` owns long-running task lifecycle (EventBus, model runtime, service tasks).
3. **Single shutdown authority**
   - `MarketIntelligenceEngine.stop()` now performs deterministic stop ordering:
     - service stop hooks,
     - EventBus stop,
     - task cancellation/join.
4. **EventBus operational hardening**
   - Added stop event, dispatcher task tracking, stop-safe publish behavior, queue/processing metrics, subscriber visibility telemetry.

## Drift addressed
- Resolved `SignalService` naming drift by removing direct stale references in engine path and using orchestrator-instantiated services.
- Removed duplicate service-start behavior in `StartupOrchestrator` to avoid split ownership with engine task management.

## Remaining known gaps
- Replay synchronization authority is still skeletal (`ModelRuntimeOrchestrator.sync_replay` remains placeholder).
- TimesFM runtime is still scaffolded (real inference/device fallback not implemented yet).
- API server shutdown remains thread-daemon based (graceful Flask socket server shutdown still pending deeper integration).
