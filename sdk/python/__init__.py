"""
PIP SDK for Python
Simple, easy-to-use functions for loading and applying PIP identities
"""

from .pip_sdk import (
    load_identity,
    load_preferences,
    load_behaviors,
    apply_preferences
)

__version__ = '0.1.0'
__all__ = [
    'load_identity',
    'load_preferences',
    'load_behaviors',
    'apply_preferences'
]

