import os
import yaml
from typing import Dict, Any
from config.default_config import MODULAR_CONFIG

class ConfigManager:
    """
    Handles professional-grade local configuration for the workstation platform.
    Supports YAML-based overrides and environment variables.
    """
    def __init__(self, config_path: str = "config/settings.yaml"):
        self.config_path = config_path
        self.settings = MODULAR_CONFIG.copy()
        self._load_overrides()

    def _load_overrides(self):
        # 1. Load YAML overrides
        if os.path.exists(self.config_path):
            with open(self.config_path, 'r') as f:
                overrides = yaml.safe_load(f)
                if overrides:
                    self._deep_update(self.settings, overrides)

        # 2. Load Environment Variables (e.g., QUANT_STORAGE_PATH)
        for env_key, value in os.environ.items():
            if env_key.startswith("QUANT_"):
                path = env_key[6:].lower().replace("_", ".")
                self._update_by_path(self.settings, path, value)

    def _update_by_path(self, base: Dict, path: str, value: Any):
        keys = path.split('.')
        curr = base
        for k in keys[:-1]:
            curr = curr.setdefault(k, {})
        curr[keys[-1]] = value

    def _deep_update(self, base: Dict, overrides: Dict):
        for k, v in overrides.items():
            if isinstance(v, dict) and k in base and isinstance(base[k], dict):
                self._deep_update(base[k], v)
            else:
                base[k] = v

    def get(self, key_path: str, default: Any = None) -> Any:
        keys = key_path.split('.')
        val = self.settings
        for k in keys:
            if isinstance(val, dict) and k in val:
                val = val[k]
            else:
                return default
        return val

# Global config singleton
settings = ConfigManager()
