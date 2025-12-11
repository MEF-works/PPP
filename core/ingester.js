/**
 * PIP Identity Ingester
 * Fetches, validates, and normalizes PIP identity files
 */

const { validateIdentity, normalizeIdentity } = require('./validator');

/**
 * Fetches and processes a PIP identity from a URL
 * @param {string} identityUrl - URL to the identity JSON file
 * @param {Object} options - Optional configuration
 * @param {number} options.timeout - Request timeout in milliseconds (default: 5000)
 * @param {boolean} options.validate - Whether to validate the identity (default: true)
 * @param {boolean} options.normalize - Whether to normalize with defaults (default: true)
 * @returns {Promise<Object>} - Processed identity object
 */
async function ingestIdentity(identityUrl, options = {}) {
  const {
    timeout = 5000,
    validate = true,
    normalize = true
  } = options;

  // Validate URL
  if (!identityUrl || typeof identityUrl !== 'string') {
    throw new Error('Identity URL must be a non-empty string');
  }

  // Ensure HTTPS (security requirement)
  if (!identityUrl.startsWith('https://')) {
    throw new Error('Identity URL must use HTTPS for security');
  }

  // Fetch identity
  let response;
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    response = await fetch(identityUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'PIP-Ingester/0.1.0'
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error(`Identity fetch timed out after ${timeout}ms`);
    }
    throw new Error(`Failed to fetch identity: ${error.message}`);
  }

  // Check response status
  if (!response.ok) {
    throw new Error(`Identity fetch failed with status ${response.status}: ${response.statusText}`);
  }

  // Parse JSON
  let identity;
  try {
    identity = await response.json();
  } catch (error) {
    throw new Error(`Failed to parse identity JSON: ${error.message}`);
  }

  // Validate identity
  if (validate) {
    const validation = validateIdentity(identity);
    if (!validation.valid) {
      throw new Error(`Identity validation failed: ${validation.errors.join(', ')}`);
    }
  }

  // Normalize identity (apply defaults)
  if (normalize) {
    try {
      identity = normalizeIdentity(identity);
    } catch (error) {
      throw new Error(`Failed to normalize identity: ${error.message}`);
    }
  }

  return identity;
}

/**
 * Fetches multiple identities (for multi-context scenarios)
 * @param {Array<string>} identityUrls - Array of identity URLs
 * @param {Object} options - Optional configuration
 * @returns {Promise<Array<Object>>} - Array of processed identities
 */
async function ingestIdentities(identityUrls, options = {}) {
  if (!Array.isArray(identityUrls)) {
    throw new Error('identityUrls must be an array');
  }

  const results = await Promise.allSettled(
    identityUrls.map(url => ingestIdentity(url, options))
  );

  const identities = [];
  const errors = [];

  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      identities.push(result.value);
    } else {
      errors.push({
        url: identityUrls[index],
        error: result.reason.message
      });
    }
  });

  if (errors.length > 0 && identities.length === 0) {
    throw new Error(`All identity fetches failed: ${errors.map(e => e.error).join('; ')}`);
  }

  return {
    identities,
    errors: errors.length > 0 ? errors : undefined
  };
}

/**
 * Extracts preferences from an identity object
 * @param {Object} identity - Identity object
 * @returns {Object} - Preferences object
 */
function extractPreferences(identity) {
  if (!identity || typeof identity !== 'object') {
    throw new Error('Invalid identity object');
  }

  return identity.preferences || {};
}

/**
 * Extracts behaviors from an identity object
 * @param {Object} identity - Identity object
 * @returns {Object} - Behaviors object
 */
function extractBehaviors(identity) {
  if (!identity || typeof identity !== 'object') {
    throw new Error('Invalid identity object');
  }

  return identity.behaviors || {};
}

module.exports = {
  ingestIdentity,
  ingestIdentities,
  extractPreferences,
  extractBehaviors
};

