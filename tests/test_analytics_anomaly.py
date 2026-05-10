import pytest
from datetime import datetime
import numpy as np
from analytics.anomaly_detection import AnomalyDetector

def test_anomaly_detector_stability():
    detector = AnomalyDetector("imbalance", window_size=10, threshold_z=2.0)
    # Baseline with some noise to avoid std=0
    for i in range(11):
        detector.check("BTC", datetime.now(), 0.1 + (i % 2) * 0.01)

    # Shock
    event = detector.check("BTC", datetime.now(), 1.0)
    assert event is not None
    assert event.severity in ["medium", "high"]

def test_anomaly_detector_zero_std():
    detector = AnomalyDetector("zeros", window_size=10, threshold_z=2.0)
    for _ in range(11):
        detector.check("BTC", datetime.now(), 0.0)

    # Zero to zero should not trigger
    event = detector.check("BTC", datetime.now(), 0.0)
    assert event is None

    # Zero to shock
    event = detector.check("BTC", datetime.now(), 1.0)
    assert event is not None
