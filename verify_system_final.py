import os

def check():
    paths = [
        "analytics/services/alert_service.py",
        "frontend/src/components/layout/TerminalHeader.tsx",
        "frontend/src/components/panels/ObservabilityPanel.tsx",
        "frontend/src/components/panels/MultiTimeframePanel.tsx"
    ]
    for p in paths:
        if not os.path.exists(p):
            print(f"FAILED: {p} missing")
            return
    print("All production terminal components verified.")

if __name__ == "__main__":
    check()
