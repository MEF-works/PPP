# PIP Ingestion Guidelines

## Overview

This document explains how to integrate PIP identity ingestion into your application. The goal is to make personalization **instant and effortless** for users.

## Quick Start

### JavaScript/TypeScript

```javascript
import { loadIdentity } from '@pip/sdk';

// Fetch and apply identity
const identity = await loadIdentity('https://example.com/identity.json');
applyPreferences(identity.preferences);
```

### Python

```python
from pip_sdk import load_identity

# Fetch and apply identity
identity = load_identity('https://example.com/identity.json')
apply_preferences(identity['preferences'])
```

That's it. Three lines of code.

## Integration Steps

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

### 2. Fetch Identity

Use the PIP ingester to fetch the identity file:

```javascript
const identity = await loadIdentity(userIdentityUrl);
```

The ingester will:
- Fetch the JSON file
- Validate the schema
- Normalize preferences
- Return a usable object

### 3. Apply Preferences

Apply preferences to your app:

```javascript
// Theme
if (identity.preferences.ui.theme === 'dark') {
  document.body.classList.add('dark-mode');
}

// Tone
const tone = identity.preferences.interaction.tone;
updateUIText(tone); // Adjust copy based on tone

// Automation
if (identity.preferences.automation.level === 'aggressive') {
  enableAdvancedAutomation();
}
```

### 4. Handle Errors Gracefully

Always provide fallbacks:

```javascript
try {
  const identity = await loadIdentity(url);
  applyPreferences(identity.preferences);
} catch (error) {
  // Use default preferences
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

// Confirmation dialogs
if (interaction.confirmationStyle === 'never') {
  skipConfirmations();
} else if (interaction.confirmationStyle === 'always') {
  confirmAllActions();
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

if (automation.aiSuggestions) {
  enableAISuggestions();
}

if (automation.autoSave) {
  enableAutoSave();
}

if (automation.predictiveActions) {
  enablePredictiveActions(automation.maxAutomationScope);
}
```

### Notifications

```javascript
const notifications = identity.preferences.notifications;

if (!notifications.enabled) {
  disableAllNotifications();
} else {
  setNotificationFrequency(notifications.frequency);
  setNotificationChannels(notifications.channels);
  
  if (notifications.quietHours?.enabled) {
    setQuietHours(
      notifications.quietHours.start,
      notifications.quietHours.end
    );
  }
}
```

### Content Preferences

```javascript
const content = identity.preferences.content;

setLanguage(content.language);
setDateFormat(content.dateFormat);
setTimeFormat(content.timeFormat);
setCurrency(content.currency);
setContentFilter(content.contentFilter);
```

### Privacy Settings

```javascript
const privacy = identity.preferences.privacy;

if (privacy.dataSharing === 'none') {
  disableDataSharing();
} else if (privacy.dataSharing === 'anonymized') {
  enableAnonymizedSharing();
}

if (!privacy.analytics) {
  disableAnalytics();
}

if (!privacy.personalization) {
  disableBehavioralPersonalization();
}
```

### Accessibility

```javascript
const accessibility = identity.preferences.accessibility;

if (accessibility.screenReader) {
  enableScreenReaderOptimizations();
}

if (accessibility.highContrast) {
  enableHighContrast();
}

setFocusIndicators(accessibility.focusIndicators);
```

### Risk Tolerance

```javascript
const risk = identity.preferences.risk;

setRiskTolerance(risk.tolerance);

if (risk.requireConfirmation) {
  requireConfirmationForRiskyActions();
}

if (risk.maxTransactionAmount) {
  setTransactionLimit(risk.maxTransactionAmount);
}
```

## Behavioral Patterns

Use behavioral patterns to inform UX decisions:

```javascript
const behaviors = identity.behaviors;

// Workflow style
if (behaviors.workflow === 'linear') {
  showLinearNavigation();
} else if (behaviors.workflow === 'exploratory') {
  showExploratoryInterface();
}

// Learning style
if (behaviors.learningStyle === 'tutorial') {
  showTutorialOnboarding();
} else if (behaviors.learningStyle === 'examples') {
  showExampleGallery();
}

// Decision speed
if (behaviors.decisionSpeed === 'deliberate') {
  showMoreInformation();
  slowDownAnimations();
}
```

## Best Practices

### 1. Partial Application

Not all preferences apply to all apps. Apply what's relevant:

```javascript
// Only apply preferences that make sense for your app
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

### 4. Version Handling

Support multiple schema versions:

```javascript
const version = identity.version;
if (version.startsWith('0.1.')) {
  // Handle v0.1.x
} else if (version.startsWith('1.0.')) {
  // Handle v1.0.x
}
```

### 5. User Override

Allow users to override preferences:

```javascript
// Apply PIP preferences
applyPIPPreferences(identity.preferences);

// But allow user to override
if (userHasLocalOverrides()) {
  applyLocalOverrides();
}
```

## Testing

Test your integration with sample identities:

```javascript
// Test with different preference combinations
const testIdentities = [
  'examples/minimal.json',
  'examples/maximal.json',
  'examples/accessibility-focused.json',
  'examples/automation-aggressive.json'
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
4. **Incremental Updates**: Apply preferences incrementally, not all at once

## Common Patterns

### Pattern 1: Onboarding Skip

```javascript
// If user has PIP identity, skip onboarding
const identity = await loadIdentity(userIdentityUrl);
if (identity) {
  applyPreferences(identity.preferences);
  skipOnboarding();
} else {
  showOnboarding();
}
```

### Pattern 2: Progressive Enhancement

```javascript
// Load app with defaults
renderApp();

// Then enhance with identity
loadIdentity(userIdentityUrl).then(identity => {
  enhanceWithPreferences(identity.preferences);
});
```

### Pattern 3: Multi-Context

```javascript
// Load different identities for different contexts
const workIdentity = await loadIdentity(workIdentityUrl);
const personalIdentity = await loadIdentity(personalIdentityUrl);

if (isWorkContext()) {
  applyPreferences(workIdentity.preferences);
} else {
  applyPreferences(personalIdentity.preferences);
}
```

## Conclusion

PIP ingestion is designed to be **simple and powerful**. Start with basic preference application and enhance as needed. The goal is to make your app adapt instantly to each user's preferences.

For more examples, see the `/examples` directory.

