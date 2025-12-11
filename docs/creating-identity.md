# Creating a PIP Identity

This guide explains how to create your own PIP identity file.

## Overview

A PIP identity is a JSON file that describes your preferences, behaviors, and interaction style. You host this file anywhere (your website, cloud storage, IPFS, etc.) and share the URL with PIP-enabled apps.

## Basic Structure

A PIP identity has this basic structure:

```json
{
  "version": "0.1.0",
  "metadata": {
    "created": "2025-01-10T12:00:00Z",
    "updated": "2025-01-10T12:00:00Z",
    "owner": "your-identifier"
  },
  "preferences": {
    "ui": { ... },
    "interaction": { ... },
    "automation": { ... },
    ...
  },
  "behaviors": { ... }
}
```

## Step-by-Step Guide

### 1. Start with Metadata

```json
{
  "version": "0.1.0",
  "metadata": {
    "created": "2025-01-10T12:00:00Z",
    "updated": "2025-01-10T12:00:00Z",
    "owner": "your-email@example.com"
  }
}
```

- `version`: Always use the current PIP schema version (currently "0.1.0")
- `created`: ISO 8601 timestamp when you created the identity
- `updated`: ISO 8601 timestamp (same as created initially)
- `owner`: Your identifier (email, wallet address, username, etc.)

### 2. Add UI Preferences

```json
{
  "preferences": {
    "ui": {
      "theme": "dark",
      "density": "comfortable",
      "fontSize": "medium",
      "colorBlindMode": false,
      "reducedMotion": false
    }
  }
}
```

**Options:**
- `theme`: `"light"`, `"dark"`, `"auto"`, or `"high-contrast"`
- `density`: `"compact"`, `"comfortable"`, or `"spacious"`
- `fontSize`: `"small"`, `"medium"`, `"large"`, or `"xlarge"`
- `colorBlindMode`: `true` or `false`
- `reducedMotion`: `true` or `false`

### 3. Add Interaction Preferences

```json
{
  "preferences": {
    "interaction": {
      "tone": "friendly",
      "verbosity": "moderate",
      "confirmationStyle": "destructive-only",
      "keyboardShortcuts": true
    }
  }
}
```

**Options:**
- `tone`: `"formal"`, `"casual"`, `"friendly"`, `"professional"`, or `"minimal"`
- `verbosity`: `"minimal"`, `"moderate"`, `"detailed"`, or `"verbose"`
- `confirmationStyle`: `"always"`, `"destructive-only"`, or `"never"`
- `keyboardShortcuts`: `true` or `false`

### 4. Add Automation Preferences

```json
{
  "preferences": {
    "automation": {
      "level": "suggestions",
      "aiSuggestions": true,
      "autoSave": true,
      "predictiveActions": false,
      "maxAutomationScope": "session"
    }
  }
}
```

**Options:**
- `level`: `"none"`, `"suggestions"`, `"auto-approve-safe"`, or `"aggressive"`
- `aiSuggestions`: `true` or `false`
- `autoSave`: `true` or `false`
- `predictiveActions`: `true` or `false`
- `maxAutomationScope`: `"local"`, `"session"`, `"account"`, or `"global"`

### 5. Add Other Preferences

See the [full schema](/protocol/schema.json) for all available preference categories:
- Notifications
- Content (language, date format, currency)
- Privacy
- Accessibility
- Risk tolerance

### 6. Add Behaviors (Optional)

```json
{
  "behaviors": {
    "workflow": "linear",
    "learningStyle": "examples",
    "decisionSpeed": "balanced"
  }
}
```

## Complete Example

See `/examples/minimal.json` for a complete example identity file.

## Validation

Before hosting your identity, validate it against the schema:

```javascript
import { validateIdentity } from './core/validator.js';

const identity = { ... }; // Your identity
const result = validateIdentity(identity);

if (!result.valid) {
  console.error('Validation errors:', result.errors);
}
```

## Hosting Your Identity

Once you've created your identity file:

1. **Save it** as `identity.json` (or any name)
2. **Host it** at a public URL:
   - Your personal website
   - GitHub Gist
   - Cloud storage (S3, GCS, etc.)
   - IPFS
   - Any HTTPS endpoint
3. **Share the URL** with PIP-enabled apps

## Updating Your Identity

When your preferences change:

1. Update the `metadata.updated` timestamp
2. Modify the preferences you want to change
3. Re-upload to your hosting location
4. Apps will pick up changes on next fetch (or when you reload)

## Security Considerations

- Always use HTTPS for hosting
- Consider signing your identity (see [Security Guide](/docs/security))
- Don't include personal information (PII) in preferences
- Keep your identity file readable but don't expose sensitive data

## Tips

- Start minimal: Only include preferences you care about
- Be specific: Clear preferences lead to better adaptation
- Update regularly: Keep your identity current with your preferences
- Test with the demo: Use the [demo app](/demo) to see how your identity works

## Next Steps

- Check out [example identities](/examples)
- Try the [demo app](/demo)
- Read the [integration guide](/docs/integration) if you're a developer

