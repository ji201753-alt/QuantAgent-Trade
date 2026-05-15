# Quant Intelligence Workstation (v1.1)

An immersive, professional-grade operational platform for quantitative market intelligence and forensic investigation. Designed for high-fidelity situational awareness, historical reconstruction, and cinematic ecosystem cognition.

## 🚀 Immersive Operational Engine

The workstation transforms complex market microstructure into a unified operational surface.

- **Unified Intelligence Surface**: The charting environment is the central surface where forecasting, structural pressure, and contextual reasoning visually converge.
- **Layered Intelligence**:
    - **Structural Zones**: Visualizes liquidity concentration and volatility expansion boundaries.
    - **Probabilistic Trajectories**: Dynamic multi-horizon forecast rendering with uncertainty shading.
    - **Kronos Cognitive Markers**: Direct on-chart visualization of historical structural analogs and regime transitions.
- **Cinematic Experience**: Reactive environmental lighting, layered glass aesthetics, and subconscious visual feedback for structural instability.
- **Grounded Reasoning & Forensic Drill-Down**: Interactive briefings with direct links to chart event markers and evidence chains.

## 🧠 Model Orchestration (TimesFM & Kronos)

The workstation supports professional local-first model execution:

### TimesFM Setup
1. **Model Weights**: Place model checkpoints in `checkpoints/timesfm-1.0-200m/`.
2. **Inference Acceleration**: The system automatically detects CUDA-capable GPUs with automatic fallback to CPU.
3. **Runtime Activation**: Enable via `config/settings.yaml` under `forecasting.timesfm.enabled: true`.
4. **Diagnostics**: Real-time monitoring of inference latency and model status in the Observability Panel.

### Kronos Structural Cognition
- **Fingerprinting**: Local-first generation of multi-factor structural embeddings.
- **Analogs**: Real-time indexing of historical structural fingerprints for high-speed similarity search.

## 🛠 Platform Architecture

- `/core`: Registry-based service orchestration and health monitoring.
- `/connectors`: Resilient market adapters (Polymarket CLOB, Crypto).
- `/analytics`: Quantitative engines for real-time microstructure synthesis.
- `/forecasting`: TimesFM integration and probabilistic inference orchestration.
- `/investigations`: Forensic case management and analytical reporting.
- `/frontend`: High-fidelity cinematic terminal (Unified Operational Surface).

## ⚙️ Quick Start

1. **Initialize**: Run `./install.sh`.
2. **Launch Engine**: `python -m core.engine`.
3. **Launch Terminal**: `cd frontend && npm run dev`.

---
*v1.1 — The Unified Operational Intelligence Surface.*
