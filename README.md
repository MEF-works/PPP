# **Portable Preference Identity Protocol (PIP)**

### *The Internet That Adapts to You.*

---

## **Overview**

The Portable Preference Identity Protocol (PIP) is a new internet primitive that lets users carry their preferences, workflows, behavioral tendencies, and automation comfort levels anywhere they go online — through a simple, signed JSON profile.

Applications that support PIP can instantly adapt to a user the moment they arrive:

* UI preferences
* tone of interaction
* dark/light mode
* layout structure
* automation level
* risk tolerance
* notification style
* accessibility needs
* predictive action limits

No onboarding.
No repeated setup.
No guessing.
No analytics phase.
**The app simply behaves the way the user prefers.**

PIP is a **portable identity brain**, and the **universal ingester** is how any system reads and honors it.

---

## **Why PIP Exists**

Every app in the world asks users to repeat themselves:

* “Set your preferences.”
* “Choose a theme.”
* “Enable or disable automation.”
* “Tell us how you want to interact.”
* “Train the AI with your style.”

Users start from zero in every product — even though their preferences stay the same across the entire internet.

Meanwhile, developers constantly rebuild:

* onboarding
* personalization
* preference storage
* tone/UX modifiers
* accessibility options
* AI style training
* analytics pipelines

This is slow, expensive, and repetitive.

**PIP solves this by giving the user a single portable identity file that every supporting app can instantly interpret.**

The result:

* The user gets personalization from the first millisecond.
* Developers skip months of UX and analytics work.
* Businesses get higher conversions with zero friction.

---

## **What PIP Provides**

PIP consists of:

### **1. A Portable Identity Schema (`schema.json`)**

A structured JSON format describing how the user prefers software to behave around them:

* interaction style
* content preference
* automation settings
* UI/UX preferences
* behavior patterns
* risk flags
* accessibility adjustments
* version + metadata

The user hosts this file anywhere they want — URL, cloud, IPFS, etc.

---

### **2. Universal Ingester (JS + Python)**

A tiny library that allows any app to:

* fetch a user’s identity JSON
* validate it
* normalize it into a usable preferences object
* apply it to the interface and behavior
* gracefully fallback if values are missing

One line to fetch.
Two lines to adapt.

---

### **3. Adaptive Demo Application**

A Next.js reference app that demonstrates the protocol:

* dynamic layout switching
* theme adaptation
* tone/language adjustment
* contextual behavioral changes
* automation toggles

This shows the “aha moment” — instant personalization.

---

### **4. Smart Contract Pointer**

A minimal solidity contract used for:

* verifying authenticity
* mapping versions
* pointing to JSON storage locations

The blockchain is optional but useful for trust and consistency.

---

### **5. SDKs for Quick Adoption**

Developers can integrate PIP in minutes using:

* `sdk/js`
* `sdk/python`

Each provides simple helper functions and utilities.

---

### **6. Full Documentation**

Located in `/docs`, the documentation explains:

* what PIP is
* how it works
* how to integrate it
* how to build identity files
* how the ecosystem will evolve

The docs focus on **results**, not technical complexity.

---

## **How It Works**

1. A user hosts a PIP identity file at any public or semi-public URL.
2. An app retrieves the file with the PIP ingester.
3. The ingester validates and normalizes the identity.
4. The app instantly adapts behavior and UX based on that identity.
5. The user experiences the app as if it already “knows them.”

Everything is lightweight, human-readable, and easy to implement.

---

## **The Vision**

PIP aims to become:

* the **preference layer** of the internet
* the **standard personalization mechanism** for software
* a bridge between users and apps that eliminates onboarding friction
* a building block for future AI assistants and adaptive systems
* a protocol that empowers individuals with ownership over their digital identity

One identity.
Infinite compatibility.

**The user becomes portable.
The internet becomes adaptive.**

---

## **Repository Structure**

```
/protocol     – schema + spec + guidelines
/core         – ingesters + validators
/demo         – adaptive app demonstrating PIP
/contracts    – smart contract pointer
/sdk          – JS + Python SDKs
/docs         – documentation site
/examples     – identity examples + ingestion samples
```

---

## **Status**

This is an early protocol (v0.1).
The purpose of this repo is to demonstrate the concept, provide scaffolding, and establish a foundation for wider ecosystem adoption.

Refinements, extensions, and community discussion will shape PIP v1.0.

---

## **License**

MIT — open, flexible, permissive.

---

## **Contributions**

PIP is open to improvements, discussions, and extensions.
Propose schema adjustments, ingestion patterns, or new SDKs through pull requests.

---

## **Final Note**

This project is not about “a new app.”
It’s about **a new layer** — the missing personalization layer the internet has avoided for 30 years.

You’re witnessing (and building) the first step of an adaptive web.

By: MEFworks llc 
mike@mefworks.com
2025-12-10