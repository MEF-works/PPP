# Portable Preference Identity Protocol (PIP)

## The Internet That Adapts to You

Welcome to PIP — a new internet primitive that enables **instant personalization** across any application that supports it.

## What Is PIP?

PIP is a **portable identity file** that carries your preferences, behaviors, and interaction style anywhere you go online. When you visit a PIP-enabled app, it reads your identity and adapts immediately — no onboarding, no setup, no guessing.

### The Problem PIP Solves

Every application asks you to:
- Set up preferences from scratch
- Choose themes and layouts
- Configure automation levels
- Train AI assistants
- Adjust accessibility settings

This happens **every single time** you use a new app, even though your preferences are consistent across the entire internet.

### The PIP Solution

With PIP, you create **one identity file** that describes how you like software to behave. When you visit a PIP-enabled app:

1. The app requests your identity URL
2. The app fetches and validates your identity
3. The app adapts instantly to your preferences
4. You experience the app as if it already "knows you"

**Zero friction. Instant personalization.**

## How It Works

### For Users

1. **Create** a PIP identity file using the schema
2. **Host** it anywhere (your website, cloud storage, IPFS, etc.)
3. **Share** your identity URL with PIP-enabled apps
4. **Experience** instant personalization everywhere

### For Developers

1. **Integrate** the PIP SDK (3 lines of code)
2. **Request** identity URL from user
3. **Fetch** and validate identity
4. **Apply** preferences to your app
5. **Watch** your app adapt instantly

## What PIP Provides

### 1. Portable Identity Schema

A structured JSON format describing:
- UI preferences (theme, density, fonts)
- Interaction style (tone, verbosity)
- Automation comfort level
- Notification preferences
- Content preferences (language, formats)
- Privacy settings
- Accessibility needs
- Risk tolerance

### 2. Universal Ingester

Tiny libraries (JS + Python) that:
- Fetch identity files
- Validate schemas
- Normalize preferences
- Apply defaults gracefully

### 3. Adaptive Demo App

A Next.js reference app that demonstrates:
- Dynamic theme switching
- Tone adaptation
- Automation level adjustment
- Instant personalization

### 4. Smart Contract Pointer

Optional blockchain integration for:
- Identity authenticity
- Version verification
- URI mapping

### 5. Developer SDKs

Simple SDKs for quick adoption:
- JavaScript/TypeScript
- Python
- More coming soon

## Quick Start

### As a User

1. Create your identity file (see [Creating an Identity](/docs/creating-identity))
2. Host it at a public URL
3. Share your URL with PIP-enabled apps

### As a Developer

```javascript
import { loadAndApply } from '@pip/sdk';

// That's it. One line.
await loadAndApply(userIdentityUrl);
```

See [Integration Guide](/docs/integration) for more details.

## The Vision

PIP aims to become the **preference layer of the internet** — a standard that eliminates onboarding friction and enables true personalization at scale.

When PIP is widely adopted:
- Users carry their preferences everywhere
- Apps adapt instantly without configuration
- The internet becomes truly personal
- Onboarding becomes obsolete

## Learn More

- [Protocol Specification](/docs/protocol-spec)
- [Creating an Identity](/docs/creating-identity)
- [Integration Guide](/docs/integration)
- [Security Guidelines](/docs/security)
- [Examples](/examples)

## Get Started

Ready to try PIP? Check out the [demo app](/demo) or start [creating your identity](/docs/creating-identity).

---

**PIP v0.1.0** — Building the personalization layer of the internet.

