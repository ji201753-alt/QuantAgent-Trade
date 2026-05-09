import asyncio
from typing import List, Dict, Any, Optional
from common.models import MarketSnapshot, SignalEvent, ForecastResult
from analytics.indicators import IndicatorCalculator
from signals.pipeline import SignalPipeline

class OrchestrationService:
    def __init__(self):
        self.signal_pipeline = SignalPipeline()
        self.running_tasks: Dict[str, asyncio.Task] = {}

    async def process_market_event(self, event: MarketSnapshot):
        """Coordinate analytics and signal generation for a market event."""
        # 1. Run Analytics (e.g., if ohlcv is present)
        if event.ohlcv:
            # This would be expanded to use the Analytics Layer
            pass

        # 2. Generate Signals
        signals = self.signal_pipeline.generate_signals(event)

        # 3. Aggregate Signals
        final_signal = self.signal_pipeline.evaluate_multi_factor(signals)

        return final_signal

    async def start_worker(self, worker_id: str, coro):
        """Start an async worker task."""
        task = asyncio.create_task(coro)
        self.running_tasks[worker_id] = task
        try:
            await task
        except asyncio.CancelledError:
            print(f"Worker {worker_id} cancelled")
        finally:
            self.running_tasks.pop(worker_id, None)

    async def stop_worker(self, worker_id: str):
        if worker_id in self.running_tasks:
            self.running_tasks[worker_id].cancel()

class TaskQueue:
    def __init__(self):
        self.queue = asyncio.Queue()

    async def push(self, task_data: Any):
        await self.queue.put(task_data)

    async def pop(self) -> Any:
        return await self.queue.get()
