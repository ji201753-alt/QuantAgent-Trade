# Quant Intelligence Workstation

An institutional-grade, local-first quantitative market intelligence and operational investigation workstation focused on market microstructure, probabilistic forecasting, and cross-domain cognition.

## 🚀 Overview

The workstation is a production-grade environment designed for high-frequency market intelligence. It transforms raw ingestion into contextual cognition through a multi-layered quantitative core, providing operators with high-fidelity situational awareness and investigation tools.

### Core Systems
- **Real-time Ingestion**: Resilient WebSocket-based ingestion for Polymarket CLOB, featuring exponential backoff, sequence tracking, and normalized universal schemas.
- **Microstructure Analytics**: Real-time engines for orderbook imbalance, liquidity concentration, volatility spikes, and market pressure velocity.
- **Forecasting (TimesFM)**: Probabilistic multi-horizon forecasting integrated as a lazy-loading modular component.
- **Signal Intelligence**: Uncertainty-aware signal fusion combining microstructure, forecasts, and macro-regimes with Bayesian weight calibration.
- **Contextual Cognition**: High-level synthesis of market structure into explainable operational regimes, situational summaries, and automated event correlation.
- **Market Memory**: Persistent historical cognition using contextual fingerprinting, structural similarity retrieval, and historical analog discovery.
- **Macro Ecosystem Awareness**: Cross-market correlation, systemic contagion analysis, and information flow tracking between disparate market domains.
- **Decision Intelligence**: Modeling of structural confidence, consensus coherence (agreement between analytical systems), and structural fragility.
- **Grounded Reasoning**: LLM-assisted investigation co-pilot strictly grounded in quantified intelligence, providing explainable operational briefings.

## 🛠 Architecture

The system is structured as a modular, async-first quantitative core designed for local execution:
```
/core           - Engine orchestration & high-throughput EventBus
/connectors     - Resilient market ingestion adapters (Polymarket CLOB)
/analytics      - Quantitative microstructure & real-time aggregation
/forecasting    - Probabilistic inference & TimesFM integration
/signals        - Multi-factor signal fusion & uncertainty calibration
/context        - Situational awareness, regime interpretation & correlation
/memory         - Historical archival, fingerprinting & analog retrieval
/meta           - Structural taxonomy & pattern family evolution tracking
/macro          - Cross-domain correlation & systemic contagion
/decision       - Confidence topology, fragility & consensus intelligence
/reasoning      - Grounded operational briefings & exploration co-pilot
/investigations - Persistent case management & evidence-chain tracking
/storage        - Async-safe batched persistence (SQLite/Parquet)
/frontend       - Institutional React terminal workstation
```

## 🖥 Workstation Features

- **Multi-Workspace Environment**:
    - **Real-time Monitoring**: High-frequency charting, orderbook depth, and real-time microstructure metrics.
    - **Research/Factor Analysis**: Deep exploration of predictive factors and statistical alignment.
    - **Macro Cognition**: Systemic overview of cross-market contagion and structural propagation.
    - **Operational Investigation**: Dedicated workflow for analyzing anomalies, shocks, and regime shifts.
- **Investigation Workflows**: Persistent case management allowing operators to bookmark events, attach evidence chains, and generate institutional reports.
- **Historical Replay**: Deterministic reconstruction of prior market states synchronized across all analytical panels for post-mortem analysis.
- **Explainable Intelligence**: Evidence-based narratives explaining the structural drivers behind regime shifts or confidence collapses.
- **System Observability**: Real-time monitoring of EventBus throughput, stream latency, and cognitive load.

## 🛡 Operational Philosophy

- **Local-First**: All data, intelligence, memory, and models are persisted and executed locally. No mandatory cloud dependency.
- **Probabilistic**: No deterministic BUY/SELL signals. The workstation focuses on uncertainty, reliability, and situational pressure to support human decision-making.
- **Grounded**: AI components (Reasoning Engine) are used as assistants to quantified data, strictly restricted to synthesizing existing intelligence.
- **Modular**: Market-agnostic architecture allowing for rapid integration of new data sources via normalized adapters.

## ⚙️ Getting Started

### Prerequisites
- Python 3.12+
- Node.js v22+
- TA-Lib

### Installation
1. Install Python dependencies: `pip install -r requirements.txt`
2. Install Frontend dependencies: `cd frontend && npm install`

### Execution
1. Start the Quantitative Core: `python -m core.engine`
2. Start the Terminal: `cd frontend && npm run dev`

---
*Institutional quantitative workstation for professional market cognition.*
