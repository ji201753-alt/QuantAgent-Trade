# Quant Intelligence Workstation (v1.3)

A converged market cognition environment designed for real-time intelligence, forensic investigation, and ecosystem monitoring.

## 🚀 The Unified Operational Surface

The workstation transforms complex market microstructure into a unified interactive surface where intelligence converged from across the core is projected directly into the operator's focus.

### Converged Charting Engine
The charting environment is the central surface of operational cognition.
- **Layered Intelligence**: Integrated overlays for structural zones, probabilistic trajectories, and Kronos cognitive markers.
- **Kronos Structural Cognition**: Visual discovery of historical analogs rendered as structural shadow paths directly in the chart timeline.
- **Forensic Scrubbing**: Deep temporal navigation that reconstructs the entire analytical stack coherently across all panels and overlays.

### Operational Intelligence OS
- **Operational Copilot**: A state-aware reasoning assistant that synchronizes with the active replay, symbol, and investigation context.
- **Contextual Command Palette**: Rapid forensic navigation (⌘K) for investigations, analog structural comparison, and overlay management.
- **Analog Investigation Workspace**: Side-by-side comparative analysis of live states vs. structurally similar historical analogs.
- **VectorBT Integration**: Launch comparative factor studies and alignment analysis directly from forensic replay windows.

## 🧠 Model Orchestration (TimesFM & Kronos)

The workstation supports professional local-first model execution for complete analytical continuity:

### TimesFM Setup
1. **Repository**: Clone `google-research/timesfm` into `forecasting/timesfm/src/`.
2. **Weights**: Place checkpoints in `checkpoints/timesfm-1.0-200m/`.
3. **Hardware Acceleration**: The system automatically detects CUDA-capable GPUs with seamless fallback to CPU.
4. **Activation**: Enable via `config/settings.yaml` under `forecasting.timesfm.enabled: true`.
5. **Runtime Diagnostics**: Monitor inference latency and engine status in the Observability panel.

## 🛠 Platform Architecture

- `/core`: Extensible registry-based orchestration and operational health monitoring.
- `/connectors`: Resilient market adapters (Polymarket CLOB, Crypto).
- `/analytics`: Real-time microstructure synthesis engines.
- `/forecasting`: TimesFM inference orchestration and probabilistic trajectory generation.
- `/memory`: Kronos structural fingerprinting and similarity indexing.
- `/investigations`: Forensic case management and publication reporting.
- `/frontend`: Cinematic terminal workstation (Unified Operational Surface).

## ⚙️ Quick Start

1. **Environment**: Run `./install.sh`.
2. **Models**: Follow the TimesFM setup guide above.
3. **Launch Engine**: `python -m core.engine`.
4. **Launch Terminal**: `cd frontend && npm run dev`.

---
*v1.3 — The Converged Market Intelligence Operating System.*
