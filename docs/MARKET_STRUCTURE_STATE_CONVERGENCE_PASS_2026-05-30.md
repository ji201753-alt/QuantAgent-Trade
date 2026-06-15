# MarketStructureState Convergence Pass — 2026-05-30

## Scope
This pass does not add analytics, models, data feeds, overlays, or chart systems. It consolidates interpretation of the existing `MicrostructureFrame` and `MicrostructureSignal` streams into one frontend `MarketStructureState` snapshot so DOM, footprint, profile, alerts, investigations, replay, and copilot grounding resolve the same structural context.

## Propagation audit findings
- **Frame authority**: `MicrostructureFrameBuilder` is the only source of replayable order-flow frames. The frontend previously re-selected frames independently in DOM, footprint/profile overlays, alerts, and copilot surfaces.
- **Signal authority**: `MicrostructureSignal` is the first-class structural event stream. Alerts and copilot previously read raw microstructure arrays directly and could drift from replay-filtered frame context.
- **Replay authority**: replay timestamp selection lived in each consumer; this created risk that panels would choose different frames for the same timestamp.
- **Overlay authority**: overlays read frame buffers independently, so footprint/profile/zones could interpret different frame windows.
- **Investigation context**: alert investigation anchors and copilot evidence needed to reference the same structural context id rather than each panel inventing its own anchor.

## Consolidation implemented
- `deriveMarketStructureState()` now resolves active frame, replay-filtered frames, active signals, active profile, analytics metadata, data mode, overlay order, replay alignment, and a compact interpretation object from existing Zustand buffers only.
- `marketStructure` is recomputed whenever market data, microstructure frames, microstructure signals, replay mode, replay speed, or overlay activation changes.
- DOM, footprint/profile overlays, alert generation, copilot grounding, and the Microstructure panel now read from `marketStructure` rather than independently filtering raw buffers.
- The consolidation layer performs no new analytics; it only selects and normalizes existing runtime outputs into an authoritative UI snapshot.

## Operational effect
- A replay timestamp now resolves one active structural frame for all market-structure surfaces.
- Alerts and investigations reference the same active signals and frame anchors used by the visual layers.
- Footprint, Volume Profile, DOM, and microstructure analytics panels share the same data mode and analytics metadata.
- Overlay ordering is visible in a single state object, reducing the chance of conflicting layer interpretation during replay or workspace switching.

## Remaining validation requirements
1. Add replay equivalence tests that assert identical `MarketStructureState` output for repeated timestamps.
2. Persist backend microstructure frame/signal history so cold-launch replay can reconstruct the same state beyond frontend memory buffers.
3. Add runtime telemetry counters for frame/signal buffer size and replay alignment failures.
4. Continue connecting investigation persistence to structured frame/signal anchors rather than serialized text evidence only.
