# Quant Intelligence Workstation (v1.0-RC1)

A professional, local-first operational platform for quantitative market intelligence and forensic investigation. Designed for high-fidelity situational awareness, historical reconstruction, and ecosystem cognition.

## 🚀 Key Features

- **Institutional Microstructure Core**: Real-time engines for orderbook imbalance, liquidity concentration, and structural volatility.
- **Forensic Investigation System**: Multi-threaded case management with evidence-chain building and publication-quality exports.
- **Unified Market Chronology**: A persistent timeline correlating internal signals with external macro catalysts.
- **Deterministic Historical Replay**: Cinematic reconstruction of market states with full synchronization across analytical layers.
- **Ecosystem Cognition**: Systemic tracking of cross-domain pressure, structural contagion, and liquidity migration.
- **Grounded Investigation Copilot**: AI-assisted briefings strictly grounded in quantified system intelligence.

## 🛠 Platform Architecture

The system is built on a modular, async-first quantitative core:
- `/core`: Registry-based service orchestration and high-throughput EventBus.
- `/connectors`: Resilient market adapters (Polymarket CLOB, Crypto).
- `/analytics`: Quantitative engines for real-time microstructure synthesis.
- `/forecasting`: Probabilistic inference and ensemble models (TimesFM).
- `/investigations`: Forensic case management and local archival.
- `/storage`: Async-safe batched persistence (SQLite/Parquet).
- `/frontend`: High-fidelity cinematic terminal workstation.

## ⚙️ Operational Setup

### Prerequisites
- **Python 3.12+**
- **Node.js v22+**
- **TA-Lib** (Technical Analysis Library)

### Quick Start
1. **Clone & Initialize**: Run `./install.sh` to set up dependencies and local storage.
2. **Configure**: Edit `config/settings.yaml` to enable connectors or adjust paths.
3. **Launch Engine**: `python -m core.engine`
4. **Launch Terminal**: `cd frontend && npm run dev`

## 🛡 Operational Philosophy

- **Local-First**: All data, intelligence, and memory are executed and persisted locally. Zero cloud dependency by default.
- **Durable Continuity**: Robust reconnection logic and session-aware state hydration for long-duration operation.
- **Probabilistic**: Focus on uncertainty and structural pressure to support human decision-making.
- **Grounded**: AI components are restricted to evidence-based synthesis—no autonomous trading.

## 📁 Repository Structure
- `api/`: WebSocket bridge and lightweight REST endpoints.
- `common/`: Universal normalized market and intelligence schemas.
- `config/`: Professional configuration management.
- `docs/`: (Planned) Detailed extension and troubleshooting guides.
- `macro/`: Ecosystem-level catalyst and correlation services.
- `meta/`: Structural taxonomy and pattern evolution tracking.
- `reasoning/`: Grounded briefings and exploration co-pilot.

---
*v1.0 Release Candidate — Institutional Market Intelligence Platform.*
