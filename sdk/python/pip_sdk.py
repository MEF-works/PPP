"""
PIP SDK for Python
Simple, easy-to-use functions for loading and applying PIP identities
"""

import sys
import os

# Add core directory to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '../../core'))

from ingester import (
    ingest_identity,
    extract_preferences,
    extract_behaviors
)


def load_identity(identity_url, timeout=5, validate=True, normalize=True):
    """
    Loads a PIP identity from a URL and returns the full identity object
    
    Args:
        identity_url: URL to the identity JSON file
        timeout: Request timeout in seconds (default: 5)
        validate: Whether to validate the identity (default: True)
        normalize: Whether to normalize with defaults (default: True)
        
    Returns:
        Identity dictionary with preferences and behaviors
        
    Example:
        >>> identity = load_identity('https://example.com/identity.json')
        >>> print(identity['preferences']['ui']['theme'])
        'dark'
    """
    try:
        identity = ingest_identity(identity_url, timeout, validate, normalize)
        return identity
    except Exception as e:
        raise ValueError(f'Failed to load PIP identity: {str(e)}')


def load_preferences(identity_url, timeout=5, validate=True, normalize=True):
    """
    Loads only the preferences from an identity URL
    
    Args:
        identity_url: URL to the identity JSON file
        timeout: Request timeout in seconds (default: 5)
        validate: Whether to validate the identity (default: True)
        normalize: Whether to normalize with defaults (default: True)
        
    Returns:
        Preferences dictionary
        
    Example:
        >>> prefs = load_preferences('https://example.com/identity.json')
        >>> if prefs['ui']['theme'] == 'dark':
        ...     apply_dark_mode()
    """
    try:
        identity = load_identity(identity_url, timeout, validate, normalize)
        return extract_preferences(identity)
    except Exception as e:
        raise ValueError(f'Failed to load preferences: {str(e)}')


def load_behaviors(identity_url, timeout=5, validate=True, normalize=True):
    """
    Loads only the behaviors from an identity URL
    
    Args:
        identity_url: URL to the identity JSON file
        timeout: Request timeout in seconds (default: 5)
        validate: Whether to validate the identity (default: True)
        normalize: Whether to normalize with defaults (default: True)
        
    Returns:
        Behaviors dictionary
        
    Example:
        >>> behaviors = load_behaviors('https://example.com/identity.json')
        >>> print(behaviors['workflow'])
        'linear'
    """
    try:
        identity = load_identity(identity_url, timeout, validate, normalize)
        return extract_behaviors(identity)
    except Exception as e:
        raise ValueError(f'Failed to load behaviors: {str(e)}')


def apply_preferences(preferences, context=None):
    """
    Applies preferences to a context (framework-specific implementations)
    
    This is a placeholder function. Framework-specific implementations
    should override this to apply preferences to their UI framework.
    
    Args:
        preferences: Preferences dictionary
        context: Optional context object (framework-specific)
        
    Example:
        >>> prefs = load_preferences(url)
        >>> apply_preferences(prefs, flask_app)
    """
    if not preferences:
        return
    
    # Framework-specific implementations would go here
    # For now, this is a placeholder that can be extended
    
    if 'ui' in preferences:
        ui = preferences['ui']
        if 'theme' in ui:
            # Apply theme logic here
            pass
        if 'density' in ui:
            # Apply density logic here
            pass
    
    return preferences


def load_and_apply(identity_url, context=None, timeout=5, validate=True, normalize=True):
    """
    Convenience function that loads and applies preferences in one call
    
    Args:
        identity_url: URL to the identity JSON file
        context: Optional context object (framework-specific)
        timeout: Request timeout in seconds (default: 5)
        validate: Whether to validate the identity (default: True)
        normalize: Whether to normalize with defaults (default: True)
        
    Returns:
        Loaded identity dictionary
        
    Example:
        >>> identity = load_and_apply('https://example.com/identity.json', app)
        >>> # Preferences are now applied!
    """
    identity = load_identity(identity_url, timeout, validate, normalize)
    apply_preferences(identity['preferences'], context)
    return identity

