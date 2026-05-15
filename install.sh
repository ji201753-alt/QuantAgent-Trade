#!/bin/bash
set -e

echo "Initializing Quant Intelligence Workstation environment..."

# 1. Python Environment
echo "Setting up Python dependencies..."
pip install -r requirements.txt

# 2. Frontend Environment
echo "Setting up Node.js dependencies..."
cd frontend
npm install
cd ..

# 3. Local Storage
echo "Preparing local storage directories..."
mkdir -p storage/data storage/investigations storage/chronology storage/reports

# 4. Default Config
if [ ! -f config/settings.yaml ]; then
    echo "Creating default settings.yaml..."
    cat <<EOF > config/settings.yaml
engine:
  auto_start: true
storage:
  path: "storage/data/market_data.db"
connectors:
  polymarket:
    enabled: true
EOF
fi

echo "Setup complete. Launch with: python -m core.engine"
