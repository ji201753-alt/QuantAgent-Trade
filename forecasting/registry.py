import importlib
from typing import Dict, Type
from forecasting.base import BaseForecaster

class ForecasterRegistry:
    _models: Dict[str, str] = {
        "xgboost": "forecasting.models.xgboost_model.XGBoostForecaster",
        "lightgbm": "forecasting.models.lgbm_model.LGBMForecaster",
        "timesfm": "forecasting.models.timesfm_model.TimesFMForecaster",
    }
    _instances: Dict[str, BaseForecaster] = {}

    @classmethod
    def get_model(cls, name: str) -> BaseForecaster:
        if name not in cls._instances:
            if name not in cls._models:
                raise ValueError(f"Model {name} not found in registry")

            module_path, class_name = cls._models[name].rsplit(".", 1)
            try:
                module = importlib.import_module(module_path)
                model_class: Type[BaseForecaster] = getattr(module, class_name)
                cls._instances[name] = model_class()
            except ImportError as e:
                print(f"Warning: Could not load model {name}. Ensure dependencies are installed. Error: {e}")
                raise
        return cls._instances[name]
