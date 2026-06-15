# Architectural Recovery Audit — 2026-05-23

## Scope
This audit focuses on platform recovery readiness across backend orchestration, EventBus/runtime behavior, websocket/frontend synchronization, replay/investigation continuity, and TimesFM/Kronos operational validity.

## Executive Status
- **Stable/usable surfaces**
  - Core async EventBus dispatch loop exists with subscribe/unsubscribe semantics and async callback fanout.
  - Flask websocket bridge correctly unsubscribes event callbacks on disconnect.
  - Store has broad workstation state model covering replay, overlays, contextual focus, investigations, and Kronos settings.
- **Partially stable (scaffold present, runtime weak/incomplete)**
  - Startup orchestration and runtime lifecycle models exist but are not fully integrated with engine entrypoint.
  - Forecasting service subscribes, but forecast generation pipeline is placeholder.
  - Replay/model sync hooks exist but are not yet fully implemented.
- **Placeholder-only / non-operational risk**
  - TimesFM model loading and inference are mocked (no real model execution).
  - Several frontend operational surfaces are mock-data based.
- **High-risk incoherences**
  - Frontend websocket service had no exported singleton, no disconnect path, and reconnect loop risk.
  - App boot connected websocket without cleanup, risking leaked reconnect behavior on remount.
  - Runtime telemetry in footer is hardcoded and not trustworthy as operational diagnostics.

## Detailed Findings

### 1) Backend orchestration & runtime
- `core/engine.py` boots EventBus/services directly and launches Flask thread, but does not use `StartupOrchestrator`; this creates lifecycle divergence between declared orchestration and actual runtime path.
- `core/orchestration.py` defines richer sequenced startup states, but references a different signal service class name (`SignalIntelligenceService`) than `core/engine.py` (`SignalService`), indicating architecture drift.
- `core/runtime_orchestrator.py` has state enums/telemetry shells and TimesFM bridge integration, but Kronos orchestration is not implemented beyond status bookkeeping.

### 2) EventBus integrity
- `core/event_bus.py` provides minimal fanout and error containment for sync callbacks and async gather for coroutine callbacks.
- No built-in backpressure/queue metrics, no shutdown sentinel, and no explicit task cancellation path in `stop()`, so graceful shutdown semantics remain weak.

### 3) Websocket synchronization
- Backend bridge (`api/routes.py`) correctly queues internal events to websocket and unsubscribes callbacks in `finally`.
- Frontend websocket client previously lacked singleton export and lifecycle cleanup; this was a concrete boot/runtime defect (fixed in this pass).

### 4) Frontend shell coherence (`App.tsx`)
- Workspace switching shell is coherent stylistically and preserves dense operational composition.
- Operational footer diagnostics are static literals, not bound to runtime state, creating observability illusion.
- App previously connected websocket with no teardown handling, now stabilized with subscription and disconnect cleanup.

### 5) Zustand propagation
- `terminalState.ts` includes broad domain state with persistence helpers and replay/investigation fields.
- Risks observed:
  - Monolithic store increases rerender pressure without selector discipline.
  - Multiple localStorage writes in action methods can become hot under frequent user operations.
  - Several state segments appear disconnected from validated backend feeds (telemetry confidence risk).

### 6) TimesFM validation
- `forecasting/timesfm/model.py` uses mocked load marker (`LOADED_PROD_MOCK`) and synthetic random outputs; this is not production inference.
- `forecasting/timesfm/runtime.py` reports `GPU` on initialize without hardware detection and relies on mocked model layer.
- Conclusion: TimesFM is **integration scaffold**, not verified operational inference.

### 7) Kronos validation
- Frontend store contains Kronos state model (`kronos` object), but backend orchestration evidence for true structural cognition generation/synchronization is minimal in the inspected runtime path.
- Conclusion: Kronos appears **partially represented in state/UI scaffolding**, but operational backend generation pipeline needs deeper hard validation.

### 8) Replay & investigation continuity
- Investigation persistence hooks exist in Zustand (`saveInvestigation`) and session persistence exists.
- Deterministic replay reconstruction hooks are mostly declarative; full cross-layer replay determinism is not established in inspected runtime code.

## Changes Applied in This Pass (stabilization-first, minimal)
1. Frontend websocket service hardening:
   - Added singleton export (`terminalWS`) required by `App.tsx` import.
   - Added idempotent `connect()` guard.
   - Added `disconnect()` with reconnect timer cancellation.
   - Added synthetic connection-status events for store synchronization.
2. App lifecycle hardening:
   - Added websocket subscription to update `isConnected` in Zustand.
   - Added proper unmount cleanup (`unsubscribe` + `disconnect`).

## Priority Recovery Plan (next incremental passes)
1. Unify runtime entrypoint with startup orchestrator (single source of truth).
2. Implement EventBus shutdown semantics and queue telemetry.
3. Replace static diagnostics with bound runtime telemetry.
4. Convert TimesFM from mock to true local inference path + real device detection/fallback.
5. Trace Kronos end-to-end generation/sync path and remove dead scaffolds after dependency mapping.
6. Build replay determinism verification harness (snapshot equivalence checks across layers).
