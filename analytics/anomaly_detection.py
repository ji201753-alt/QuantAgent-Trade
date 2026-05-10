import numpy as np
from typing import List, Optional
from datetime import datetime
from common.models import AnomalyEvent

class AnomalyDetector:
    def __init__(self, metric_name: str, window_size: int = 30, threshold_z: float = 3.0):
        self.metric_name = metric_name
        self.window_size = window_size
        self.threshold_z = threshold_z
        self.values: List[float] = []

    def check(self, symbol: str, timestamp: datetime, value: float) -> Optional[AnomalyEvent]:
        if value is None or not np.isfinite(value):
            return None

        self.values.append(value)
        if len(self.values) > self.window_size:
            self.values.pop(0)

        if len(self.values) < 10:
            return None

        if all(v == 0 for v in self.values):
            return None

        mean = np.mean(self.values[:-1])
        std = np.std(self.values[:-1])

        if std < 1e-9:
            if abs(value - mean) < 1e-9:
                return None
            std = 1e-9

        z_score = (value - mean) / std

        if abs(z_score) > self.threshold_z:
            severity = "high" if abs(z_score) > self.threshold_z * 2 else "medium"
            return AnomalyEvent(
                symbol=symbol,
                timestamp=timestamp,
                metric_name=self.metric_name,
                z_score=float(z_score),
                severity=severity,
                description=f"Abnormal {self.metric_name} shift: z-score {z_score:.2f}"
            )
        return None
