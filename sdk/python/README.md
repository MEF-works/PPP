# PIP SDK for Python

Simple, easy-to-use SDK for loading and applying PIP identities in Python applications.

## Installation

```bash
pip install pip-sdk
```

Or use directly from the core:

```python
from sdk.python import load_identity
```

## Quick Start

```python
from pip_sdk import load_and_apply

# Load identity and apply preferences instantly
identity = load_and_apply('https://example.com/identity.json')
```

## API

### `load_identity(identity_url, timeout=5, validate=True, normalize=True)`

Loads a complete PIP identity from a URL.

```python
identity = load_identity('https://example.com/identity.json')
print(identity['preferences'])
```

### `load_preferences(identity_url, timeout=5, validate=True, normalize=True)`

Loads only the preferences from an identity.

```python
prefs = load_preferences('https://example.com/identity.json')
if prefs['ui']['theme'] == 'dark':
    apply_dark_mode()
```

### `load_behaviors(identity_url, timeout=5, validate=True, normalize=True)`

Loads only the behaviors from an identity.

```python
behaviors = load_behaviors('https://example.com/identity.json')
print(behaviors['workflow'])
```

### `apply_preferences(preferences, context=None)`

Applies preferences to a context (framework-specific).

```python
prefs = load_preferences(url)
apply_preferences(prefs, flask_app)
```

### `load_and_apply(identity_url, context=None, timeout=5, validate=True, normalize=True)`

Convenience function that loads and applies preferences in one call.

```python
identity = load_and_apply('https://example.com/identity.json', app)
```

## Examples

### Basic Usage

```python
from pip_sdk import load_and_apply

# Load and apply in one line
identity = load_and_apply(user_identity_url)
```

### Advanced Usage

```python
from pip_sdk import load_identity, apply_preferences

# Load identity
identity = load_identity(user_identity_url, timeout=10, validate=True)

# Apply preferences
apply_preferences(identity['preferences'])

# Use behaviors
if identity['behaviors']['workflow'] == 'linear':
    show_linear_navigation()
```

### Error Handling

```python
from pip_sdk import load_identity

try:
    identity = load_identity(user_identity_url)
    apply_preferences(identity['preferences'])
except ValueError as e:
    print(f'Failed to load identity: {e}')
    # Use default preferences
    apply_default_preferences()
```

### Flask Integration Example

```python
from flask import Flask, render_template
from pip_sdk import load_preferences

app = Flask(__name__)

@app.route('/')
def index():
    # Load user's identity
    prefs = load_preferences(user_identity_url)
    
    # Pass preferences to template
    return render_template('index.html', preferences=prefs)
```

### Django Integration Example

```python
from django.shortcuts import render
from pip_sdk import load_preferences

def index(request):
    # Load user's identity
    prefs = load_preferences(user_identity_url)
    
    # Pass preferences to template
    return render(request, 'index.html', {'preferences': prefs})
```

## Requirements

- Python 3.7+
- requests library

## License

MIT

