# Synchronization + Microstructure Integration Pass — 2026-05-29

## Targeted synchronization audit

### Chart state continuity
- `HighFrequencyChart` now consumes replayable OHLCV candle state from Zustand when no explicit data prop is supplied.
- Remaining risk: viewport and zoom persistence are not yet serialized, so workspace switching can still reset chart viewport.

### Overlay persistence
- Forecast overlays are timestamp-aligned by `forecast.timestamp + horizon` and update existing series instead of recreating every render.
- Microstructure liquidity-zone overlay now consumes `MicrostructureFrame` mid-price history when the existing `zones` overlay is enabled.
- Remaining risk: Kronos analog trajectories still depend on frontend-provided `kronos.activeAnalogs`; backend analog generation remains unverified.

### Replay traversal
- UI replay stepping mutates shared replay timestamp deterministically.
- Microstructure frames include `replay_anchor` so they can be aligned with future replay reconstruction.
- Remaining risk: backend replay equivalence harness is still pending.

### Websocket lifecycle
- Websocket bridge now streams `MicrostructureFrame` events in addition to OHLCV, forecasts, orderbooks, trades, and signals.
- Frontend stores bounded candle and microstructure frame histories to reduce unbounded state growth.

## Microstructure integration

### Backend additions
- Added `OrderFlowDelta`, `VolumeAtPriceLevel`, and `MicrostructureFrame` models.
- Added `MicrostructureFrameBuilder` to aggregate:
  - orderbook depth totals,
  - depth imbalance,
  - spread and mid price,
  - rolling buy/sell volume,
  - order-flow delta and cumulative delta,
  - volume-at-price reconstruction.
- Data mode is explicit:
  - `LIMITED_DATA_MODE` when trades are unavailable,
  - `PARTIAL_DEPTH_MODE` when book depth is shallow,
  - `LIVE_AGGREGATION_MODE` when usable trade and depth streams are both present.
- Existing `MicrostructureAnalyticsService` publishes frames through the existing EventBus rather than creating a parallel stream.
- Chronology now subscribes to microstructure frames for replay/investigation alignment.

### Frontend additions
- Zustand stores bounded `microstructureFrames` and `latestMicrostructure` state.
- `MicrostructurePanel` now renders real frame values and data-mode status instead of static metrics.
- Existing `zones` overlay can render microstructure mid-liquidity history without overwriting TimesFM or Kronos overlays.

## Future event-cognition preparation
- Added `NormalizedExternalEvent` as a neutral ingestion model for future macro/geopolitical/weather/regulatory catalysts.
- Chronology subscribes to this normalized model, creating a path for future event ingestion without introducing fake feeds or a parallel cognition subsystem.

## Remaining hardening items
1. Persist `MicrostructureFrame` to repository storage for full replay reconstruction.
2. Add viewport persistence for chart time scale and zoom range.
3. Add replay equivalence tests for candles, forecasts, zones, and microstructure frames.
4. Validate frontend render frequency under sustained frame publishing.
