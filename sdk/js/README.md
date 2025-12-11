# PIP SDK for JavaScript

Simple, easy-to-use SDK for loading and applying PIP identities in JavaScript applications.

## Installation

```bash
npm install @pip/sdk
```

Or use directly from the core:

```javascript
import { loadIdentity } from './sdk/js/index.js';
```

## Quick Start

```javascript
import { loadAndApply } from '@pip/sdk';

// Load identity and apply preferences instantly
await loadAndApply('https://example.com/identity.json');
```

## API

### `loadIdentity(identityUrl, options)`

Loads a complete PIP identity from a URL.

```javascript
const identity = await loadIdentity('https://example.com/identity.json');
console.log(identity.preferences);
```

### `loadPreferences(identityUrl, options)`

Loads only the preferences from an identity.

```javascript
const prefs = await loadPreferences('https://example.com/identity.json');
if (prefs.ui.theme === 'dark') {
  applyDarkMode();
}
```

### `loadBehaviors(identityUrl, options)`

Loads only the behaviors from an identity.

```javascript
const behaviors = await loadBehaviors('https://example.com/identity.json');
console.log(behaviors.workflow);
```

### `applyUIPreferences(uiPreferences)`

Applies UI preferences to the document.

```javascript
applyUIPreferences({
  theme: 'dark',
  density: 'compact',
  fontSize: 'large'
});
```

### `applyPreferences(preferences)`

Applies all preferences from a preferences object.

```javascript
const prefs = await loadPreferences(url);
applyPreferences(prefs);
```

### `loadAndApply(identityUrl, options)`

Convenience function that loads and applies preferences in one call.

```javascript
await loadAndApply('https://example.com/identity.json');
```

## Options

All load functions accept an optional `options` object:

```javascript
{
  timeout: 5000,        // Request timeout in milliseconds
  validate: true,       // Validate identity schema
  normalize: true      // Apply default values
}
```

## Examples

### Basic Usage

```javascript
import { loadAndApply } from '@pip/sdk';

// Load and apply in one line
await loadAndApply(userIdentityUrl);
```

### Advanced Usage

```javascript
import { loadIdentity, applyPreferences } from '@pip/sdk';

// Load identity
const identity = await loadIdentity(userIdentityUrl, {
  timeout: 10000,
  validate: true
});

// Apply preferences
applyPreferences(identity.preferences);

// Use behaviors
if (identity.behaviors.workflow === 'linear') {
  showLinearNavigation();
}
```

### Error Handling

```javascript
import { loadIdentity } from '@pip/sdk';

try {
  const identity = await loadIdentity(userIdentityUrl);
  applyPreferences(identity.preferences);
} catch (error) {
  console.error('Failed to load identity:', error.message);
  // Use default preferences
  applyDefaultPreferences();
}
```

## Browser Support

Works in all modern browsers that support:
- ES6 modules
- Fetch API
- async/await

## License

MIT

