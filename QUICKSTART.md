# PIP Quick Start Guide

Get started with PIP in 5 minutes.

## For Users

### 1. Create Your Identity

Create a file called `identity.json`:

```json
{
  "version": "0.1.0",
  "metadata": {
    "created": "2025-01-10T12:00:00Z",
    "updated": "2025-01-10T12:00:00Z",
    "owner": "your-email@example.com"
  },
  "preferences": {
    "ui": {
      "theme": "dark",
      "density": "comfortable"
    },
    "interaction": {
      "tone": "friendly"
    }
  }
}
```

### 2. Host Your Identity

Upload `identity.json` to:
- Your personal website
- GitHub Gist
- Cloud storage (S3, GCS, etc.)
- IPFS
- Any HTTPS endpoint

### 3. Share Your URL

Share your identity URL with PIP-enabled apps:
```
https://your-domain.com/identity.json
```

### 4. Experience Instant Personalization

Apps will adapt to your preferences automatically!

## For Developers

### 1. Install the SDK

**JavaScript:**
```bash
npm install @pip/sdk
```

**Python:**
```bash
pip install pip-sdk
```

### 2. Load Identity

**JavaScript:**
```javascript
import { loadAndApply } from '@pip/sdk';

await loadAndApply(userIdentityUrl);
```

**Python:**
```python
from pip_sdk import load_and_apply

load_and_apply(user_identity_url)
```

### 3. Apply Preferences

```javascript
const identity = await loadIdentity(userIdentityUrl);
const prefs = identity.preferences;

// Apply theme
if (prefs.ui.theme === 'dark') {
  applyDarkMode();
}

// Apply tone
updateMessaging(prefs.interaction.tone);
```

That's it! Your app is now personalized.

## Try the Demo

1. Navigate to `/demo`
2. Run `npm install`
3. Run `npm run dev`
4. Load an example identity from `/examples`

## Next Steps

- Read the [full documentation](/docs)
- Check out [example identities](/examples)
- Review the [protocol specification](/protocol/protocol-spec.md)
- See [integration examples](/examples/ingestion-example.js)

## Need Help?

- Check the [documentation](/docs)
- Review [examples](/examples)
- Open an issue on GitHub

Welcome to PIP — the personalization layer of the internet!

