import asyncio
import logging
from typing import Any, Callable, Dict, List, Type
from collections import defaultdict

logger = logging.getLogger(__name__)

class EventBus:
    def __init__(self):
        self.subscribers: Dict[Type, List[Callable]] = defaultdict(list)
        self.queue = asyncio.Queue()

    def subscribe(self, event_type: Type, callback: Callable):
        self.subscribers[event_type].append(callback)
        logger.debug(f"Subscribed to {event_type.__name__}")

    async def publish(self, event: Any):
        await self.queue.put(event)

    async def start(self):
        logger.info("Event Bus started")
        while True:
            event = await self.queue.get()
            event_type = type(event)
            callbacks = self.subscribers.get(event_type, [])

            tasks = []
            for callback in callbacks:
                if asyncio.iscoroutinefunction(callback):
                    tasks.append(asyncio.create_task(callback(event)))
                else:
                    try:
                        callback(event)
                    except Exception as e:
                        logger.error(f"Error in callback for {event_type.__name__}: {e}")

            if tasks:
                await asyncio.gather(*tasks, return_exceptions=True)

            self.queue.task_done()

    async def stop(self):
        logger.info("Event Bus stopping")
