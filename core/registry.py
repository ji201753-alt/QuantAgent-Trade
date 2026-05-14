import logging
from typing import Dict, Type, Any, List

logger = logging.getLogger(__name__)

class ComponentRegistry:
    """
    A lightweight registry for modular platform components.
    Allows for dynamic discovery and registration of connectors,
    analytics engines, and reasoning assistants.
    """
    def __init__(self):
        self._categories: Dict[str, Dict[str, Type]] = {
            "connectors": {},
            "analytics": {},
            "reasoning": {},
            "forecasting": {},
            "services": {}
        }

    def register(self, category: str, name: str, component_class: Type):
        if category not in self._categories:
            self._categories[category] = {}
        self._categories[category][name] = component_class
        logger.debug(f"Registered {category}/{name}")

    def get(self, category: str, name: str) -> Type:
        return self._categories.get(category, {}).get(name)

    def list(self, category: str) -> List[str]:
        return list(self._categories.get(category, {}).keys())

    def instantiate_all(self, category: str, *args, **kwargs) -> List[Any]:
        instances = []
        for name, cls in self._categories.get(category, {}).items():
            try:
                instances.append(cls(*args, **kwargs))
            except Exception as e:
                logger.error(f"Failed to instantiate {category}/{name}: {e}")
        return instances

# Global Platform Registry
registry = ComponentRegistry()
