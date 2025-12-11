# Integration Guide

This guide explains how to integrate PIP into your application.

## Quick Start

### JavaScript/TypeScript

```javascript
import { loadAndApply } from '@pip/sdk';

// One line to personalize your app
await loadAndApply(userIdentityUrl);
```

### Python

```python
from pip_sdk import load_and_apply

# One line to personalize your app
load_and_apply(user_identity_url, app)
```

That's it. Your app is now personalized.

## Step-by-Step Integration

### 1. Request Identity URL

Ask the user for their PIP identity URL. This can be:
- A one-time input during onboarding
- A saved preference in your app
- A profile field
- A URL parameter

**Example UI:**
```
"Have a PIP identity? Paste your identity URL to personalize instantly."
[Input field] [Load Identity]
```

### 2. Load Identity

Use the PIP SDK to load the identity:

```javascript
import { loadIdentity } from '@pip/sdk';

const identity = await loadIdentity(userIdentityUrl);
```

### 3. Apply Preferences

Apply preferences to your app:

```javascript
const prefs = identity.preferences;

// Apply theme
if (prefs.ui.theme === 'dark') {
  document.body.classList.add('dark-mode');
}

// Apply tone
updateMessaging(prefs.interaction.tone);

// Apply automation level
configureAutomation(prefs.automation.level);
```

### 4. Handle Errors

Always provide fallbacks:

```javascript
try {
  const identity = await loadIdentity(userIdentityUrl);
  applyPreferences(identity.preferences);
} catch (error) {
  console.warn('Failed to load identity, using defaults');
  applyDefaultPreferences();
}
```

## Preference Categories

### UI Preferences

```javascript
const ui = identity.preferences.ui;

// Theme
switch (ui.theme) {
  case 'dark': applyDarkTheme(); break;
  case 'light': applyLightTheme(); break;
  case 'auto': applyAutoTheme(); break;
  case 'high-contrast': applyHighContrast(); break;
}

// Density
applyDensity(ui.density); // compact, comfortable, spacious

// Font size
setFontSize(ui.fontSize); // small, medium, large, xlarge

// Accessibility
if (ui.colorBlindMode) enableColorBlindPalette();
if (ui.reducedMotion) disableAnimations();
```

### Interaction Style

```javascript
const interaction = identity.preferences.interaction;

// Tone affects copy and messaging
const toneMap = {
  formal: 'Please proceed with...',
  casual: 'Hey! Go ahead and...',
  friendly: 'Feel free to...',
  professional: 'You may proceed...',
  minimal: 'Proceed.'
};

updateMessaging(toneMap[interaction.tone]);

// Verbosity affects help text
if (interaction.verbosity === 'minimal') {
  hideHelpText();
} else if (interaction.verbosity === 'verbose') {
  showDetailedHelp();
}
```

### Automation Level

```javascript
const automation = identity.preferences.automation;

switch (automation.level) {
  case 'none':
    disableAllAutomation();
    break;
  case 'suggestions':
    showSuggestionsOnly();
    break;
  case 'auto-approve-safe':
    autoApproveSafeActions();
    break;
  case 'aggressive':
    enableFullAutomation();
    break;
}
```

See [Ingestion Guidelines](/protocol/ingestion-guidelines.md) for complete examples.

## Best Practices

### 1. Partial Application

Not all preferences apply to all apps. Apply what's relevant:

```javascript
if (identity.preferences.ui) {
  applyUIPreferences(identity.preferences.ui);
}

if (identity.preferences.automation) {
  applyAutomationPreferences(identity.preferences.automation);
}
```

### 2. Graceful Degradation

Handle missing fields:

```javascript
const theme = identity.preferences?.ui?.theme || 'auto';
const tone = identity.preferences?.interaction?.tone || 'friendly';
```

### 3. Caching

Cache identity files to reduce fetches:

```javascript
const cacheKey = `pip-identity-${identityUrl}`;
const cached = localStorage.getItem(cacheKey);

if (cached) {
  const identity = JSON.parse(cached);
  applyPreferences(identity.preferences);
} else {
  const identity = await loadIdentity(identityUrl);
  localStorage.setItem(cacheKey, JSON.stringify(identity));
  applyPreferences(identity.preferences);
}
```

### 4. User Override

Allow users to override preferences:

```javascript
// Apply PIP preferences
applyPIPPreferences(identity.preferences);

// But allow user to override
if (userHasLocalOverrides()) {
  applyLocalOverrides();
}
```

## Framework-Specific Examples

### React

```javascript
import { useEffect, useState } from 'react';
import { loadIdentity } from '@pip/sdk';

function App() {
  const [preferences, setPreferences] = useState(null);

  useEffect(() => {
    loadIdentity(userIdentityUrl)
      .then(identity => {
        setPreferences(identity.preferences);
        applyPreferences(identity.preferences);
      })
      .catch(error => {
        console.error('Failed to load identity:', error);
      });
  }, []);

  return <div>{/* Your app */}</div>;
}
```

### Vue

```javascript
import { onMounted, ref } from 'vue';
import { loadIdentity } from '@pip/sdk';

export default {
  setup() {
    const preferences = ref(null);

    onMounted(async () => {
      try {
        const identity = await loadIdentity(userIdentityUrl);
        preferences.value = identity.preferences;
        applyPreferences(identity.preferences);
      } catch (error) {
        console.error('Failed to load identity:', error);
      }
    });

    return { preferences };
  }
};
```

### Flask (Python)

```python
from flask import Flask, render_template
from pip_sdk import load_preferences

app = Flask(__name__)

@app.route('/')
def index():
    try:
        prefs = load_preferences(user_identity_url)
        return render_template('index.html', preferences=prefs)
    except ValueError:
        return render_template('index.html', preferences=None)
```

## Testing

Test your integration with sample identities:

```javascript
const testIdentities = [
  'examples/minimal.json',
  'examples/maximal.json',
  'examples/accessibility-focused.json'
];

for (const url of testIdentities) {
  const identity = await loadIdentity(url);
  console.log('Loaded:', identity);
  applyPreferences(identity.preferences);
}
```

## Performance Considerations

1. **Lazy Loading**: Load identity after initial page render
2. **Caching**: Cache identity files with appropriate TTL
3. **Debouncing**: Debounce preference application if needed
4. **Incremental Updates**: Apply preferences incrementally

## Security

- Always use HTTPS for identity URLs
- Validate identity files before applying
- Handle errors gracefully
- Don't log sensitive preference data

See [Security Guidelines](/docs/security) for more details.

## Next Steps

- Check out the [demo app](/demo) for a complete example
- Read [Ingestion Guidelines](/protocol/ingestion-guidelines.md) for detailed examples
- Explore [example identities](/examples)

