# Quant Intelligence Workstation (v1.9-Stable)
## Institutional Operational Handbook & Deployment Manual

Welcome to the **Quant Intelligence Workstation**, a local-first, production-grade quantitative market intelligence platform. This workstation is designed to transform high-frequency market data into actionable institutional intelligence through advanced forensic investigation, probabilistic forecasting, and structural cognition.

---

## 1. Introduction: What is the Workstation?

The Quant Intelligence Workstation is a converged operating system for market professionals. Unlike traditional trading terminals that focus merely on price execution, this platform focuses on **Intelligence and Forensics**.

It is a "Market Intelligence OS" that integrates disparate data streams—from prediction markets to global arbitrage spreads—into a single, high-fidelity operational surface.

### Core Capabilities
*   **Real-time Monitoring**: Continuous ingestion and normalization of multi-domain market feeds (Crypto, Forex, Prediction Markets).
*   **Forensic Investigation**: Deep replay-driven analysis to reconstruct the "how" and "why" behind market movements.
*   **Structural Cognition (Kronos)**: Identifying historical analogues and recurring patterns in market microstructure.
*   **Probabilistic Forecasting (TimesFM)**: Generating multi-horizon predictions with grounded uncertainty metrics using 200M parameter foundation models.
*   **Operational Support**: A unified control surface for decision-making in complex, high-stakes environments.

### What it is NOT
*   **NOT an Execution Bot**: This system provides intelligence and decision support; it does not automatically place trades or manage capital.
*   **NOT a Demo/UI Mockup**: This is a fully functional, local-first engine designed for thousands of events per second.
*   **NOT a Cloud SaaS**: All data, models, and intelligence stay on your local hardware. There are no external API keys required by default for the core engine.

---

## 2. Getting Started: The Onboarding Flow

This section is designed for operators who may not be developers. We will walk through setting up the entire environment from scratch.

### Step 1: Install Visual Studio Code (VSCode)
VSCode is the professional environment where you will run and monitor the workstation.
1.  Download and install **Visual Studio Code** from [code.visualstudio.com](https://code.visualstudio.com/).
2.  Open VSCode and go to the **Extensions** view (click the square icon on the left sidebar).
3.  Search for and install:
    *   **Python** (by Microsoft) - Essential for the backend engine.
    *   **Tailwind CSS IntelliSense** - Helpful for frontend visual adjustments.

### Step 2: Install Python (The Engine)
Python is the language that powers the analytical core.
1.  **Windows**: Download Python 3.11 or 3.12 from [python.org](https://www.python.org/).
2.  **CRITICAL**: During the installation process, you **MUST** check the box that says **"Add Python to PATH"**. If you miss this, the computer won't know how to run the workstation.
3.  **macOS/Linux**: Usually comes with Python. Verify by opening a terminal and typing `python3 --version`.
4.  **Verify**: Open a new terminal in VSCode (`Terminal` > `New Terminal`) and type `python --version`. If it shows 3.11.x or 3.12.x, you are ready.

### Step 3: Install Git
Git allows you to download and update the workstation code.
1.  Download and install Git from [git-scm.com](https://git-scm.com/).
2.  Follow the default installation prompts.

### Step 4: Install Node.js (The Visual Surface)
Node.js powers the high-performance terminal interface.
1.  Download the **LTS** version of Node.js from [nodejs.org](https://nodejs.org/).
2.  **Verify**: In your VSCode terminal, type `node -v`. It should show v18 or higher (e.g., v20.x).

---

## 3. Installation & Deployment

Now that your foundation is ready, let's deploy the workstation.

### Phase A: Clone the Repository
Open your VSCode terminal and navigate to the folder where you want the project to live:
```bash
git clone <repository-url>
cd quant-workstation
```

### Phase B: Backend Setup (The Brain)
We use a "Virtual Environment" (venv) to keep the workstation dependencies isolated. This ensures the workstation doesn't interfere with other software on your computer.
```bash
# 1. Create the environment
python -m venv venv

# 2. Activate it (Windows)
.\venv\Scripts\activate

# 2. Activate it (macOS/Linux)
source venv/bin/activate

# 3. Install the intelligence requirements
pip install -r requirements.txt
```
*Expected Outcome*: You should see a list of packages (numpy, pandas, torch, etc.) being installed.

### Phase C: Frontend Setup (The Eyes)
```bash
# 1. Navigate to the frontend directory
cd frontend

# 2. Install visual components
npm install

# 3. Go back to the main folder
cd ..
```

---

## 4. Intelligence System Setup: TimesFM & Kronos

The workstation uses two primary intelligence systems that require manual configuration to reach full capability.

### TimesFM (Forecasting Layer)
TimesFM is a state-of-the-art time-series foundation model developed by Google Research.
1.  **Clone the Model Core**: Clone the `google-research/timesfm` repository into the `forecasting/timesfm/src/` folder.
2.  **Installation**: Inside your activated Python environment (venv):
    ```bash
    cd forecasting/timesfm/src
    pip install -e .
    cd ../../../
    ```
3.  **Model Weights**: Place the pre-trained model checkpoints in `checkpoints/timesfm-1.0-200m/`.
4.  **Hardware Acceleration**: If you have an NVIDIA GPU, the system will automatically use **CUDA** for near-instant forecasting. If not, it will fallback to CPU inference (slower but functional).

### Kronos (Structural Cognition Layer)
Kronos indexes market microstructure to identify historical structural similarities.
1.  **Operation**: Unlike TimesFM, Kronos builds its knowledge base dynamically as you monitor markets.
2.  **Indexing**: Ensure your `storage/` directory has enough disk space. Kronos creates lightweight temporal fingerprints of market events.
3.  **Analog Discovery**: When in **Replay Mode**, Kronos will automatically suggest historical periods that "look like" the current situation based on microstructure signature.

---

## 5. Architectural Blueprint

The workstation is built on a **Modular, Async-First Architecture**.

*   **Ingestion Layer (`/connectors`)**: High-frequency adapters that normalize exchange-specific data (JSON/Websocket) into a Universal Market Schema.
*   **EventBus (`/core/event_bus.py`)**: The central nervous system. It routes thousands of events per second between analytics, forecasting, and the UI.
*   **Analytics Engine (`/analytics`)**: Market-agnostic modules that calculate volatility, orderbook imbalance, and z-score anomalies in real-time.
*   **Runtime Orchestration (`/core/orchestration.py`)**: Manages the "Startup Sequence"—ensuring the database starts before the bus, and the bus starts before the connectors.
*   **Persistence Layer (`/storage`)**: Uses a local SQLite database for structured data and Parquet for high-volume trade history.
*   **Websocket Bridge (`/api`)**: A thread-safe bridge that streams engine intelligence directly to your browser-based terminal.

---

## 6. Directory Structure: Where Things Live

Understanding the folder layout is key to navigating the workstation:

*   `/core`: The heart of the system. Contains the EventBus and Startup Orchestrator.
*   `/connectors`: Market-specific adapters (Polymarket, Binance, etc.).
*   `/analytics`: Reusable math modules for market-agnostic signals.
*   `/forecasting`: Infrastructure for TimesFM and other predictive models.
*   `/signals`: Logic that combines analytics and forecasts into actionable "Signal Events".
*   `/storage`: Your local database and data management logic.
*   `/investigations`: Logic for saving and loading forensic cases.
*   `/api`: The internal server that connects the backend to the frontend.
*   `/frontend`: The React-based terminal code (Visual Interface).

---

## 7. Operational Workspaces: The Operator's View

The workstation interface is organized into specialized workspaces.

### 1. Prediction Markets Workspace
Specialized for event-driven markets like Polymarket. Features:
*   **Probability Convergence**: Watch how different market participants price the same outcome.
*   **Whale Tracking**: Monitor large-volume entries that move the needle.

### 2. Arbitrage Surface
A real-time matrix of global price spreads. It tracks "Inefficiency" across different regions and asset classes.

### 3. Forensic Replay Console
The most powerful investigative tool. You can "Anchor" the workstation to any point in the past. The entire UI—including the AI assistant and forecasts—will reconstruct exactly what was known at that moment.

### 4. Investigation Builder
A persistent space for documenting evidence. You can "Pin" anomalies, forecasting graphs, and AI-reasoning blocks into a structured report that survives system restarts.

---

## 8. How to Launch & Operate

Follow this exact sequence for a healthy startup:

1.  **Terminal 1 (The Engine)**:
    ```bash
    .\venv\Scripts\activate  # (Windows)
    python -m core.engine
    ```
    *What to look for*: You should see "System State: READY" and "Connected to Polymarket" in the logs.

2.  **Terminal 2 (The Interface)**:
    ```bash
    cd frontend
    npm run dev
    ```
    *What to look for*: The terminal will say "Local: http://localhost:5173".

3.  **Access the Surface**: Open Chrome or Edge and go to `http://localhost:5173`.

4.  **Operational Check**:
    *   Check the **Runtime Diagnostics** panel.
    *   Verify **Telemetry** is moving (Websocket stats).
    *   Open the **Forecasting** tab; if TimesFM is active, you will see blue confidence intervals on the price charts.

---

## 9. Troubleshooting & Recovery

*   **Python Command Fails**: Try using `python3` instead of `python`.
*   **"No Module Named..."**: You likely forgot to activate your virtual environment (`venv`). Run the activation command and try again.
*   **WebSocket Disconnected**: This happens if the backend engine crashes or isn't started. Restart `python -m core.engine`.
*   **Charts are Empty**: Ensure your internet connection is active for the initial data ingestion, or check if the market you are tracking is currently active.
*   **GPU not detected**: Ensure you have the latest NVIDIA drivers and "CUDA Toolkit" installed. The workstation will still work on CPU but will be slower.

---

## 10. Operational Philosophy

*   **Deterministic Replay**: Past events should yield the same intelligence every time. We don't just "log" data; we preserve the state of the world.
*   **Grounded Reasoning**: The AI Assistant (Copilot) is restricted to the data currently in the EventBus. It does not "hallucinate" external news—it reasons about quantified market facts.
*   **Local-First Resilience**: If the internet goes down, your local intelligence, indices, and investigation history remain fully accessible.

---
*v1.9 — The foundational operating system for the future of quantitative market intelligence.*
