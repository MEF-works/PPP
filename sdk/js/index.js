/**
 * PIP SDK for JavaScript
 * Simple, easy-to-use functions for loading and applying PIP identities
 */

import { ingestIdentity, extractPreferences, extractBehaviors } from '../../core/ingester.js';

/**
 * Loads a PIP identity from a URL and returns preferences
 * @param {string} identityUrl - URL to the identity JSON file
 * @param {Object} options - Optional configuration
 * @returns {Promise<Object>} - Identity object with preferences
 * 
 * @example
 * const identity = await loadIdentity('https://example.com/identity.json');
 * applyTheme(identity.preferences.ui.theme);
 */
export async function loadIdentity(identityUrl, options = {}) {
  try {
    const identity = await ingestIdentity(identityUrl, options);
    return identity;
  } catch (error) {
    throw new Error(`Failed to load PIP identity: ${error.message}`);
  }
}

/**
 * Loads only the preferences from an identity URL
 * @param {string} identityUrl - URL to the identity JSON file
 * @param {Object} options - Optional configuration
 * @returns {Promise<Object>} - Preferences object
 * 
 * @example
 * const prefs = await loadPreferences('https://example.com/identity.json');
 * if (prefs.ui.theme === 'dark') applyDarkMode();
 */
export async function loadPreferences(identityUrl, options = {}) {
  try {
    const identity = await loadIdentity(identityUrl, options);
    return extractPreferences(identity);
  } catch (error) {
    throw new Error(`Failed to load preferences: ${error.message}`);
  }
}

/**
 * Loads only the behaviors from an identity URL
 * @param {string} identityUrl - URL to the identity JSON file
 * @param {Object} options - Optional configuration
 * @returns {Promise<Object>} - Behaviors object
 */
export async function loadBehaviors(identityUrl, options = {}) {
  try {
    const identity = await loadIdentity(identityUrl, options);
    return extractBehaviors(identity);
  } catch (error) {
    throw new Error(`Failed to load behaviors: ${error.message}`);
  }
}

/**
 * Applies UI preferences to the document
 * @param {Object} uiPreferences - UI preferences object
 */
export function applyUIPreferences(uiPreferences) {
  if (!uiPreferences) return;

  // Apply theme
  if (uiPreferences.theme) {
    const theme = uiPreferences.theme === 'auto' 
      ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : uiPreferences.theme;
    document.documentElement.setAttribute('data-theme', theme);
  }

  // Apply density
  if (uiPreferences.density) {
    document.documentElement.setAttribute('data-density', uiPreferences.density);
  }

  // Apply font size
  if (uiPreferences.fontSize) {
    const fontSizeMap = {
      small: '14px',
      medium: '16px',
      large: '18px',
      xlarge: '20px'
    };
    document.documentElement.style.fontSize = fontSizeMap[uiPreferences.fontSize] || '16px';
  }

  // Apply reduced motion
  if (uiPreferences.reducedMotion) {
    document.documentElement.style.setProperty('--animation-speed', '0s');
  }
}

/**
 * Applies all preferences from an identity
 * @param {Object} preferences - Full preferences object
 */
export function applyPreferences(preferences) {
  if (!preferences) return;

  if (preferences.ui) {
    applyUIPreferences(preferences.ui);
  }

  // Additional preference application can be added here
  // (interaction tone, automation level, etc.)
}

/**
 * Convenience function: Load and apply preferences in one call
 * @param {string} identityUrl - URL to the identity JSON file
 * @param {Object} options - Optional configuration
 * @returns {Promise<Object>} - Loaded identity object
 * 
 * @example
 * await loadAndApply('https://example.com/identity.json');
 * // App is now personalized!
 */
export async function loadAndApply(identityUrl, options = {}) {
  const identity = await loadIdentity(identityUrl, options);
  applyPreferences(identity.preferences);
  return identity;
}

// Re-export core functions for advanced usage
export { ingestIdentity, extractPreferences, extractBehaviors } from '../../core/ingester.js';

