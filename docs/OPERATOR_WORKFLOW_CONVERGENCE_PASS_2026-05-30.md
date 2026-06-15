# Operator Workflow Convergence Pass — 2026-05-30

## Objective
Unify the operator path from live monitoring → alert discovery → replay anchoring → evidence collection → reasoning consultation → return to live operation without adding new systems, workspaces, overlays, or runtime authorities.

## Cold-launch and session continuity audit
- Zustand now hydrates the last active symbol, workspace, replay state, overlays, and active investigation from `quant_session_v1`.
- `App.tsx` persists session continuity whenever workspace, replay, overlays, symbol, or investigation changes.
- Remaining risk: chart viewport/time-scale range is still not persisted, so a cold launch restores operating context but not exact zoom/scroll state.

## End-to-end operator workflow corrections

### Alert → Replay → Investigation
- Alert timeline is now runtime-derived from decision collapse, anomaly events, microstructure imbalance, and macro regime state.
- Selecting an alert anchors replay time, updates contextual focus, navigates to the replay workspace, and creates/updates an investigation record.
- Alert actions no longer use static sample incidents.

### Replay workspace convergence
- Replay workspace now presents replay controls, chronology, active investigation, and grounded assistant together.
- This reduces the previous fragmentation where chronology, replay controls, investigation state, and assistant grounding lived in disconnected surfaces.

### Reasoning and assistant grounding
- Copilot responses now summarize current runtime state from TimesFM telemetry, forecast availability, microstructure frames, Kronos analog state, active overlays, and replay mode.
- Evidence buttons navigate to the relevant workspace/context instead of being decorative.
- Unsupported evidence is stated explicitly (for example, unavailable Kronos analogs or missing forecasts).

## UI/UX convergence findings
- Navigation remains shell-driven through `OperationalRail`; replay investigation is now a coherent operational route rather than a standalone builder screen.
- Critical runtime alerts now provide a natural investigation path rather than requiring manual workspace switching.
- Microstructure, forecasting, chronology, and investigation state can now be traversed from a single event anchor.

## Remaining convergence risks
1. Chart viewport persistence is still pending.
2. Backend replay equivalence validation is still pending.
3. Kronos backend generation remains partially unverified; UI surfaces must continue to expose unavailable states truthfully.
4. Long-session memory counters for chart overlays/websocket reconnect loops are not yet instrumented.
