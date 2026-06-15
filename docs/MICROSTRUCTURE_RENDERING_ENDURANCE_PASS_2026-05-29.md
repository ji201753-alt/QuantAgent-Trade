# Microstructure Rendering + Endurance Pass — 2026-05-29

## Scope
This pass extends the existing chart/microstructure surface without replacing lightweight-charts, Zustand, EventBus, or the workstation shell.

## Synchronization audit findings
- Chart overlays now have three independent runtime data sources: TimesFM forecasts, Kronos analog trajectories, and microstructure frames.
- The highest drift risk remains replay traversal because backend replay equivalence is not yet implemented; frontend rendering now filters footprint/profile state against the replay timestamp to avoid future-frame leakage.
- DOM stability depends on incoming connector depth quality; full market-by-order visibility is not available, so DOM and footprint surfaces disclose partial/aggregated modes.
- Overlay endurance risk was reduced by keeping microstructure footprint/profile rendering in the chart container and letting existing series overlays continue to manage TimesFM/Kronos/zones separately.

## Rendering additions

### Footprint layer
- Added a chart-local footprint overlay derived only from `MicrostructureFrame.order_flow` values.
- Displays:
  - per-frame delta,
  - cumulative delta progression,
  - aggressive execution detection,
  - replay-filtered history.
- Uses `AGGREGATED_FOOTPRINT_MODE` when live aggregation is available and exposes the incoming degraded data mode otherwise.

### Volume Profile layer
- Aggregates `volume_profile` from replay-synchronized microstructure frames.
- Displays high-volume node emphasis and low-liquidity gap opacity reduction.
- Coexists with TimesFM, Kronos, and liquidity-zone overlays because it renders as an independent chart overlay region.

### DOM / Depth surface
- DOM panel now renders depth bars per level and reports `DOM_MODE` from runtime microstructure state.
- Hovering ladder levels still propagates contextual focus with side/amount/mode metadata.

## Remaining endurance hardening
1. Persist chart viewport/time-scale range and restore after workspace transitions.
2. Add explicit memory/runtime counters for overlay object counts and frame-buffer size.
3. Add backend replay equivalence checks for footprint/profile/DOM at identical replay timestamps.
4. Validate sustained websocket reconnect cycles with footprint/profile overlays active.
