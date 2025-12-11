"""
PIP Identity Ingester (Python)
Fetches, validates, and normalizes PIP identity files
"""

import json
import re
from typing import Dict, Optional, Any, List
from datetime import datetime
from urllib.parse import urlparse
import requests


def validate_identity(identity: Dict[str, Any]) -> Dict[str, Any]:
    """
    Validates an identity object against the PIP schema
    
    Args:
        identity: The identity dictionary to validate
        
    Returns:
        Dictionary with 'valid' (bool) and 'errors' (list) keys
    """
    errors = []
    
    if not identity or not isinstance(identity, dict):
        return {'valid': False, 'errors': ['Identity must be a dictionary']}
    
    # Check required fields
    if 'version' not in identity:
        errors.append('Missing required field: version')
    elif not isinstance(identity['version'], str):
        errors.append('Field "version" must be a string')
    elif not re.match(r'^\d+\.\d+\.\d+$', identity['version']):
        errors.append('Field "version" must follow semantic versioning (e.g., "0.1.0")')
    
    if 'metadata' not in identity:
        errors.append('Missing required field: metadata')
    else:
        metadata = identity['metadata']
        if 'created' not in metadata:
            errors.append('Missing required field: metadata.created')
        elif not _is_valid_iso8601(metadata['created']):
            errors.append('Field "metadata.created" must be a valid ISO 8601 date-time')
        
        if 'updated' not in metadata:
            errors.append('Missing required field: metadata.updated')
        elif not _is_valid_iso8601(metadata['updated']):
            errors.append('Field "metadata.updated" must be a valid ISO 8601 date-time')
    
    # Validate preferences if present
    if 'preferences' in identity:
        pref_errors = _validate_preferences(identity['preferences'])
        errors.extend(pref_errors)
    
    # Validate behaviors if present
    if 'behaviors' in identity:
        behavior_errors = _validate_behaviors(identity['behaviors'])
        errors.extend(behavior_errors)
    
    return {
        'valid': len(errors) == 0,
        'errors': errors
    }


def _validate_preferences(preferences: Dict[str, Any]) -> List[str]:
    """Validates preferences object"""
    errors = []
    
    if not isinstance(preferences, dict):
        return ['Preferences must be a dictionary']
    
    # Validate UI preferences
    if 'ui' in preferences:
        ui = preferences['ui']
        if 'theme' in ui and ui['theme'] not in ['light', 'dark', 'auto', 'high-contrast']:
            errors.append('Invalid ui.theme value')
        if 'density' in ui and ui['density'] not in ['compact', 'comfortable', 'spacious']:
            errors.append('Invalid ui.density value')
        if 'fontSize' in ui and ui['fontSize'] not in ['small', 'medium', 'large', 'xlarge']:
            errors.append('Invalid ui.fontSize value')
    
    # Validate interaction preferences
    if 'interaction' in preferences:
        interaction = preferences['interaction']
        if 'tone' in interaction and interaction['tone'] not in ['formal', 'casual', 'friendly', 'professional', 'minimal']:
            errors.append('Invalid interaction.tone value')
        if 'verbosity' in interaction and interaction['verbosity'] not in ['minimal', 'moderate', 'detailed', 'verbose']:
            errors.append('Invalid interaction.verbosity value')
        if 'confirmationStyle' in interaction and interaction['confirmationStyle'] not in ['always', 'destructive-only', 'never']:
            errors.append('Invalid interaction.confirmationStyle value')
    
    # Validate automation preferences
    if 'automation' in preferences:
        automation = preferences['automation']
        if 'level' in automation and automation['level'] not in ['none', 'suggestions', 'auto-approve-safe', 'aggressive']:
            errors.append('Invalid automation.level value')
        if 'maxAutomationScope' in automation and automation['maxAutomationScope'] not in ['local', 'session', 'account', 'global']:
            errors.append('Invalid automation.maxAutomationScope value')
    
    # Validate notification preferences
    if 'notifications' in preferences:
        notifications = preferences['notifications']
        if 'frequency' in notifications and notifications['frequency'] not in ['realtime', 'batched', 'digest', 'off']:
            errors.append('Invalid notifications.frequency value')
        if 'channels' in notifications:
            if not isinstance(notifications['channels'], list):
                errors.append('notifications.channels must be a list')
            else:
                valid_channels = ['in-app', 'email', 'push', 'sms']
                invalid_channels = [ch for ch in notifications['channels'] if ch not in valid_channels]
                if invalid_channels:
                    errors.append(f'Invalid notification channels: {", ".join(invalid_channels)}')
    
    # Validate content preferences
    if 'content' in preferences:
        content = preferences['content']
        if 'language' in content and not re.match(r'^[a-z]{2}(-[A-Z]{2})?$', content['language']):
            errors.append('Invalid content.language format (expected ISO 639-1)')
        if 'dateFormat' in content and content['dateFormat'] not in ['ISO', 'US', 'EU', 'relative']:
            errors.append('Invalid content.dateFormat value')
        if 'timeFormat' in content and content['timeFormat'] not in ['12h', '24h']:
            errors.append('Invalid content.timeFormat value')
        if 'currency' in content and not re.match(r'^[A-Z]{3}$', content['currency']):
            errors.append('Invalid content.currency format (expected ISO 4217)')
    
    # Validate privacy preferences
    if 'privacy' in preferences:
        privacy = preferences['privacy']
        if 'dataSharing' in privacy and privacy['dataSharing'] not in ['none', 'anonymized', 'full']:
            errors.append('Invalid privacy.dataSharing value')
    
    # Validate accessibility preferences
    if 'accessibility' in preferences:
        accessibility = preferences['accessibility']
        if 'focusIndicators' in accessibility and accessibility['focusIndicators'] not in ['minimal', 'standard', 'enhanced']:
            errors.append('Invalid accessibility.focusIndicators value')
    
    # Validate risk preferences
    if 'risk' in preferences:
        risk = preferences['risk']
        if 'tolerance' in risk and risk['tolerance'] not in ['conservative', 'moderate', 'aggressive']:
            errors.append('Invalid risk.tolerance value')
        if 'maxTransactionAmount' in risk:
            if not isinstance(risk['maxTransactionAmount'], (int, float)) or risk['maxTransactionAmount'] < 0:
                errors.append('risk.maxTransactionAmount must be a non-negative number')
    
    return errors


def _validate_behaviors(behaviors: Dict[str, Any]) -> List[str]:
    """Validates behaviors object"""
    errors = []
    
    if not isinstance(behaviors, dict):
        return ['Behaviors must be a dictionary']
    
    if 'workflow' in behaviors and behaviors['workflow'] not in ['linear', 'exploratory', 'task-focused', 'multi-tasking']:
        errors.append('Invalid behaviors.workflow value')
    
    if 'learningStyle' in behaviors and behaviors['learningStyle'] not in ['tutorial', 'examples', 'trial-and-error', 'documentation']:
        errors.append('Invalid behaviors.learningStyle value')
    
    if 'decisionSpeed' in behaviors and behaviors['decisionSpeed'] not in ['deliberate', 'balanced', 'quick']:
        errors.append('Invalid behaviors.decisionSpeed value')
    
    return errors


def _is_valid_iso8601(date_string: str) -> bool:
    """Checks if a string is a valid ISO 8601 date-time"""
    if not isinstance(date_string, str):
        return False
    try:
        datetime.fromisoformat(date_string.replace('Z', '+00:00'))
        return 'T' in date_string
    except (ValueError, AttributeError):
        return False


def normalize_identity(identity: Dict[str, Any]) -> Dict[str, Any]:
    """
    Normalizes an identity object, applying defaults for missing fields
    
    Args:
        identity: Identity dictionary to normalize
        
    Returns:
        Normalized identity dictionary
    """
    if not identity or not isinstance(identity, dict):
        raise ValueError('Invalid identity object')
    
    prefs = identity.get('preferences', {})
    
    normalized = {
        **identity,
        'preferences': {
            'ui': {
                'theme': prefs.get('ui', {}).get('theme', 'auto'),
                'density': prefs.get('ui', {}).get('density', 'comfortable'),
                'fontSize': prefs.get('ui', {}).get('fontSize', 'medium'),
                'colorBlindMode': prefs.get('ui', {}).get('colorBlindMode', False),
                'reducedMotion': prefs.get('ui', {}).get('reducedMotion', False),
                **(prefs.get('ui', {}))
            },
            'interaction': {
                'tone': prefs.get('interaction', {}).get('tone', 'friendly'),
                'verbosity': prefs.get('interaction', {}).get('verbosity', 'moderate'),
                'confirmationStyle': prefs.get('interaction', {}).get('confirmationStyle', 'destructive-only'),
                'keyboardShortcuts': prefs.get('interaction', {}).get('keyboardShortcuts', True),
                **(prefs.get('interaction', {}))
            },
            'automation': {
                'level': prefs.get('automation', {}).get('level', 'suggestions'),
                'aiSuggestions': prefs.get('automation', {}).get('aiSuggestions', True),
                'autoSave': prefs.get('automation', {}).get('autoSave', True),
                'predictiveActions': prefs.get('automation', {}).get('predictiveActions', False),
                'maxAutomationScope': prefs.get('automation', {}).get('maxAutomationScope', 'session'),
                **(prefs.get('automation', {}))
            },
            'notifications': {
                'enabled': prefs.get('notifications', {}).get('enabled', True),
                'frequency': prefs.get('notifications', {}).get('frequency', 'batched'),
                'channels': prefs.get('notifications', {}).get('channels', ['in-app']),
                **(prefs.get('notifications', {}))
            },
            'content': {
                'language': prefs.get('content', {}).get('language', 'en'),
                'dateFormat': prefs.get('content', {}).get('dateFormat', 'ISO'),
                'timeFormat': prefs.get('content', {}).get('timeFormat', '24h'),
                'currency': prefs.get('content', {}).get('currency', 'USD'),
                'contentFilter': prefs.get('content', {}).get('contentFilter', 'moderate'),
                **(prefs.get('content', {}))
            },
            'privacy': {
                'dataSharing': prefs.get('privacy', {}).get('dataSharing', 'anonymized'),
                'analytics': prefs.get('privacy', {}).get('analytics', True),
                'personalization': prefs.get('privacy', {}).get('personalization', True),
                **(prefs.get('privacy', {}))
            },
            'accessibility': {
                'screenReader': prefs.get('accessibility', {}).get('screenReader', False),
                'highContrast': prefs.get('accessibility', {}).get('highContrast', False),
                'focusIndicators': prefs.get('accessibility', {}).get('focusIndicators', 'standard'),
                **(prefs.get('accessibility', {}))
            },
            'risk': {
                'tolerance': prefs.get('risk', {}).get('tolerance', 'moderate'),
                'requireConfirmation': prefs.get('risk', {}).get('requireConfirmation', True),
                **(prefs.get('risk', {}))
            },
            **prefs
        },
        'behaviors': {
            **(identity.get('behaviors', {}))
        }
    }
    
    return normalized


def ingest_identity(identity_url: str, timeout: int = 5, validate: bool = True, normalize: bool = True) -> Dict[str, Any]:
    """
    Fetches and processes a PIP identity from a URL
    
    Args:
        identity_url: URL to the identity JSON file
        timeout: Request timeout in seconds (default: 5)
        validate: Whether to validate the identity (default: True)
        normalize: Whether to normalize with defaults (default: True)
        
    Returns:
        Processed identity dictionary
    """
    if not identity_url or not isinstance(identity_url, str):
        raise ValueError('Identity URL must be a non-empty string')
    
    # Ensure HTTPS (security requirement)
    if not identity_url.startswith('https://'):
        raise ValueError('Identity URL must use HTTPS for security')
    
    # Fetch identity
    try:
        response = requests.get(
            identity_url,
            headers={
                'Accept': 'application/json',
                'User-Agent': 'PIP-Ingester-Python/0.1.0'
            },
            timeout=timeout
        )
        response.raise_for_status()
    except requests.exceptions.Timeout:
        raise ValueError(f'Identity fetch timed out after {timeout} seconds')
    except requests.exceptions.RequestException as e:
        raise ValueError(f'Failed to fetch identity: {str(e)}')
    
    # Parse JSON
    try:
        identity = response.json()
    except json.JSONDecodeError as e:
        raise ValueError(f'Failed to parse identity JSON: {str(e)}')
    
    # Validate identity
    if validate:
        validation = validate_identity(identity)
        if not validation['valid']:
            raise ValueError(f'Identity validation failed: {", ".join(validation["errors"])}')
    
    # Normalize identity (apply defaults)
    if normalize:
        try:
            identity = normalize_identity(identity)
        except ValueError as e:
            raise ValueError(f'Failed to normalize identity: {str(e)}')
    
    return identity


def extract_preferences(identity: Dict[str, Any]) -> Dict[str, Any]:
    """
    Extracts preferences from an identity object
    
    Args:
        identity: Identity dictionary
        
    Returns:
        Preferences dictionary
    """
    if not identity or not isinstance(identity, dict):
        raise ValueError('Invalid identity object')
    
    return identity.get('preferences', {})


def extract_behaviors(identity: Dict[str, Any]) -> Dict[str, Any]:
    """
    Extracts behaviors from an identity object
    
    Args:
        identity: Identity dictionary
        
    Returns:
        Behaviors dictionary
    """
    if not identity or not isinstance(identity, dict):
        raise ValueError('Invalid identity object')
    
    return identity.get('behaviors', {})

