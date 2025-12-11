/**
 * Example: Loading and applying a PIP identity in JavaScript
 */

import { loadIdentity, applyPreferences } from '@pip/sdk';

// Example 1: Basic usage
async function example1() {
  const identityUrl = 'https://example.com/identity.json';
  
  try {
    const identity = await loadIdentity(identityUrl);
    applyPreferences(identity.preferences);
    console.log('Identity loaded and applied!');
  } catch (error) {
    console.error('Failed to load identity:', error.message);
    // Use default preferences
  }
}

// Example 2: With error handling and caching
async function example2() {
  const identityUrl = 'https://example.com/identity.json';
  const cacheKey = `pip-identity-${identityUrl}`;
  
  // Check cache first
  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    const identity = JSON.parse(cached);
    applyPreferences(identity.preferences);
    return;
  }
  
  // Fetch and cache
  try {
    const identity = await loadIdentity(identityUrl);
    localStorage.setItem(cacheKey, JSON.stringify(identity));
    applyPreferences(identity.preferences);
  } catch (error) {
    console.error('Failed to load identity:', error.message);
  }
}

// Example 3: Applying specific preferences
async function example3() {
  const identityUrl = 'https://example.com/identity.json';
  
  try {
    const identity = await loadIdentity(identityUrl);
    const prefs = identity.preferences;
    
    // Apply theme
    if (prefs.ui?.theme) {
      document.documentElement.setAttribute('data-theme', prefs.ui.theme);
    }
    
    // Apply tone
    if (prefs.interaction?.tone) {
      updateMessaging(prefs.interaction.tone);
    }
    
    // Apply automation
    if (prefs.automation?.level) {
      configureAutomation(prefs.automation.level);
    }
  } catch (error) {
    console.error('Failed to load identity:', error.message);
  }
}

// Helper functions (examples)
function updateMessaging(tone) {
  const toneMap = {
    formal: 'Please proceed with your task.',
    casual: 'Hey! Ready to get started?',
    friendly: 'Welcome! Feel free to explore.',
    professional: 'You may proceed with your work.',
    minimal: 'Welcome.'
  };
  console.log(toneMap[tone] || toneMap.friendly);
}

function configureAutomation(level) {
  console.log(`Automation level set to: ${level}`);
}

// Run example
example1();

