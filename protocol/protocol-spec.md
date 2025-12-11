# Portable Preference Identity Protocol (PIP) Specification

## What Is PIP?

The Portable Preference Identity Protocol (PIP) is a new internet primitive that enables **instant personalization** across any application that supports it.

Instead of configuring preferences in every app you use, you create **one identity file** that describes how you like software to behave. When you visit a PIP-enabled app, it reads your identity and adapts immediately — no onboarding, no setup, no guessing.

## Why PIP Exists

### The Problem

Every application asks users to:
- Set up preferences from scratch
- Choose themes and layouts
- Configure automation levels
- Train AI assistants
- Adjust accessibility settings
- Set notification preferences

This happens **every single time** you use a new app, even though your preferences are consistent across the entire internet.

### The Solution

PIP provides:
- **One identity file** that travels with you
- **Universal ingestion** that any app can use
- **Instant adaptation** from the first millisecond
- **Zero friction** onboarding

## How PIP Works

### 1. Identity Creation

A user creates a PIP identity JSON file following the schema defined in `schema.json`. This file contains:
- UI preferences (theme, density, fonts)
- Interaction style (tone, verbosity)
- Automation comfort level
- Notification preferences
- Content preferences (language, formats)
- Privacy settings
- Accessibility needs
- Risk tolerance

### 2. Identity Hosting

The user hosts this JSON file anywhere:
- Personal website
- Cloud storage (S3, GCS, etc.)
- IPFS
- GitHub Gist
- Any publicly accessible URL

### 3. Identity Ingestion

When a user visits a PIP-enabled app:
1. The app requests the user's identity URL
2. The app uses the PIP ingester to fetch the JSON
3. The ingester validates the schema
4. The ingester normalizes preferences into a usable object
5. The app applies preferences to UI and behavior
6. The user experiences instant personalization

### 4. Identity Verification (Optional)

For trust and authenticity:
- Identity files can be signed cryptographically
- Smart contracts can store identity hashes and URIs
- Apps can verify signatures before applying preferences

## Core Principles

### 1. User Ownership

The user owns and controls their identity file. They can:
- Host it anywhere
- Update it anytime
- Revoke access by removing the file
- Maintain multiple identities for different contexts

### 2. Graceful Degradation

Apps must handle missing or invalid identity files gracefully:
- Default to sensible defaults
- Never break if fields are missing
- Support partial identity application

### 3. Privacy First

- Identity files contain preferences, not personal data
- No tracking or analytics in the protocol itself
- Users control what they share

### 4. Developer Friendly

- Simple integration (3 lines of code)
- Clear schema
- Multiple SDKs (JS, Python, more to come)
- Extensive documentation

## Protocol Flow

```
┌─────────────┐
│   User      │
│  Creates    │
│  Identity   │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Hosts     │
│   Identity  │
│   (URL)     │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   App       │
│   Requests  │
│   Identity  │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Ingester   │
│  Fetches +  │
│  Validates  │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   App       │
│   Adapts    │
│   Instantly │
└─────────────┘
```

## Schema Structure

The identity JSON follows a hierarchical structure:

- **version**: Schema version for compatibility
- **metadata**: Creation date, updates, owner, signature
- **preferences**: All user preferences organized by category
  - `ui`: Visual preferences
  - `interaction`: Communication style
  - `automation`: Automation comfort
  - `notifications`: Notification preferences
  - `content`: Content formatting
  - `privacy`: Privacy settings
  - `accessibility`: Accessibility needs
  - `risk`: Risk tolerance
- **behaviors**: Behavioral patterns and tendencies

See `schema.json` for the complete schema definition.

## Versioning

PIP uses semantic versioning (MAJOR.MINOR.PATCH):
- **MAJOR**: Breaking changes to schema
- **MINOR**: New optional fields
- **PATCH**: Bug fixes, clarifications

Apps should support multiple schema versions and gracefully handle unknown fields.

## Security Considerations

1. **Signature Verification**: Apps can verify identity authenticity using cryptographic signatures
2. **HTTPS Only**: Identity files should be served over HTTPS
3. **CORS**: Identity hosts should configure CORS appropriately
4. **Rate Limiting**: Apps should implement rate limiting for identity fetches
5. **Validation**: Always validate identity files against the schema

See `security.md` for detailed security guidelines.

## Adoption Path

### For Users

1. Create a PIP identity file using the schema
2. Host it at a public URL
3. Share your identity URL with PIP-enabled apps
4. Update your identity as preferences change

### For Developers

1. Integrate the PIP SDK (JS or Python)
2. Request identity URL from user
3. Use ingester to fetch and validate
4. Apply preferences to your app
5. Watch your app adapt instantly

See `ingestion-guidelines.md` for implementation details.

## The Vision

PIP aims to become the **preference layer of the internet** — a standard that eliminates onboarding friction and enables true personalization at scale.

When PIP is widely adopted:
- Users carry their preferences everywhere
- Apps adapt instantly without configuration
- The internet becomes truly personal
- Onboarding becomes obsolete

This is the future of personalization.

