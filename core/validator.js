/**
 * PIP Identity Validator
 * Validates identity JSON files against the PIP schema
 */

const schema = require('../protocol/schema.json');

/**
 * Validates an identity object against the PIP schema
 * @param {Object} identity - The identity object to validate
 * @returns {Object} - { valid: boolean, errors: Array<string> }
 */
function validateIdentity(identity) {
  const errors = [];

  // Check if identity is an object
  if (!identity || typeof identity !== 'object') {
    return { valid: false, errors: ['Identity must be an object'] };
  }

  // Check required fields
  if (!identity.version) {
    errors.push('Missing required field: version');
  } else if (typeof identity.version !== 'string') {
    errors.push('Field "version" must be a string');
  } else if (!/^\d+\.\d+\.\d+$/.test(identity.version)) {
    errors.push('Field "version" must follow semantic versioning (e.g., "0.1.0")');
  }

  if (!identity.metadata) {
    errors.push('Missing required field: metadata');
  } else {
    if (!identity.metadata.created) {
      errors.push('Missing required field: metadata.created');
    } else if (!isValidISO8601(identity.metadata.created)) {
      errors.push('Field "metadata.created" must be a valid ISO 8601 date-time');
    }

    if (!identity.metadata.updated) {
      errors.push('Missing required field: metadata.updated');
    } else if (!isValidISO8601(identity.metadata.updated)) {
      errors.push('Field "metadata.updated" must be a valid ISO 8601 date-time');
    }
  }

  // Validate preferences if present
  if (identity.preferences) {
    const prefErrors = validatePreferences(identity.preferences);
    errors.push(...prefErrors);
  }

  // Validate behaviors if present
  if (identity.behaviors) {
    const behaviorErrors = validateBehaviors(identity.behaviors);
    errors.push(...behaviorErrors);
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validates preferences object
 * @param {Object} preferences - Preferences object
 * @returns {Array<string>} - Array of error messages
 */
function validatePreferences(preferences) {
  const errors = [];

  if (typeof preferences !== 'object') {
    return ['Preferences must be an object'];
  }

  // Validate UI preferences
  if (preferences.ui) {
    const ui = preferences.ui;
    if (ui.theme && !['light', 'dark', 'auto', 'high-contrast'].includes(ui.theme)) {
      errors.push('Invalid ui.theme value');
    }
    if (ui.density && !['compact', 'comfortable', 'spacious'].includes(ui.density)) {
      errors.push('Invalid ui.density value');
    }
    if (ui.fontSize && !['small', 'medium', 'large', 'xlarge'].includes(ui.fontSize)) {
      errors.push('Invalid ui.fontSize value');
    }
  }

  // Validate interaction preferences
  if (preferences.interaction) {
    const interaction = preferences.interaction;
    if (interaction.tone && !['formal', 'casual', 'friendly', 'professional', 'minimal'].includes(interaction.tone)) {
      errors.push('Invalid interaction.tone value');
    }
    if (interaction.verbosity && !['minimal', 'moderate', 'detailed', 'verbose'].includes(interaction.verbosity)) {
      errors.push('Invalid interaction.verbosity value');
    }
    if (interaction.confirmationStyle && !['always', 'destructive-only', 'never'].includes(interaction.confirmationStyle)) {
      errors.push('Invalid interaction.confirmationStyle value');
    }
  }

  // Validate automation preferences
  if (preferences.automation) {
    const automation = preferences.automation;
    if (automation.level && !['none', 'suggestions', 'auto-approve-safe', 'aggressive'].includes(automation.level)) {
      errors.push('Invalid automation.level value');
    }
    if (automation.maxAutomationScope && !['local', 'session', 'account', 'global'].includes(automation.maxAutomationScope)) {
      errors.push('Invalid automation.maxAutomationScope value');
    }
  }

  // Validate notification preferences
  if (preferences.notifications) {
    const notifications = preferences.notifications;
    if (notifications.frequency && !['realtime', 'batched', 'digest', 'off'].includes(notifications.frequency)) {
      errors.push('Invalid notifications.frequency value');
    }
    if (notifications.channels) {
      if (!Array.isArray(notifications.channels)) {
        errors.push('notifications.channels must be an array');
      } else {
        const validChannels = ['in-app', 'email', 'push', 'sms'];
        const invalidChannels = notifications.channels.filter(ch => !validChannels.includes(ch));
        if (invalidChannels.length > 0) {
          errors.push(`Invalid notification channels: ${invalidChannels.join(', ')}`);
        }
      }
    }
  }

  // Validate content preferences
  if (preferences.content) {
    const content = preferences.content;
    if (content.language && !/^[a-z]{2}(-[A-Z]{2})?$/.test(content.language)) {
      errors.push('Invalid content.language format (expected ISO 639-1)');
    }
    if (content.dateFormat && !['ISO', 'US', 'EU', 'relative'].includes(content.dateFormat)) {
      errors.push('Invalid content.dateFormat value');
    }
    if (content.timeFormat && !['12h', '24h'].includes(content.timeFormat)) {
      errors.push('Invalid content.timeFormat value');
    }
    if (content.currency && !/^[A-Z]{3}$/.test(content.currency)) {
      errors.push('Invalid content.currency format (expected ISO 4217)');
    }
  }

  // Validate privacy preferences
  if (preferences.privacy) {
    const privacy = preferences.privacy;
    if (privacy.dataSharing && !['none', 'anonymized', 'full'].includes(privacy.dataSharing)) {
      errors.push('Invalid privacy.dataSharing value');
    }
  }

  // Validate accessibility preferences
  if (preferences.accessibility) {
    const accessibility = preferences.accessibility;
    if (accessibility.focusIndicators && !['minimal', 'standard', 'enhanced'].includes(accessibility.focusIndicators)) {
      errors.push('Invalid accessibility.focusIndicators value');
    }
  }

  // Validate risk preferences
  if (preferences.risk) {
    const risk = preferences.risk;
    if (risk.tolerance && !['conservative', 'moderate', 'aggressive'].includes(risk.tolerance)) {
      errors.push('Invalid risk.tolerance value');
    }
    if (risk.maxTransactionAmount !== undefined && (typeof risk.maxTransactionAmount !== 'number' || risk.maxTransactionAmount < 0)) {
      errors.push('risk.maxTransactionAmount must be a non-negative number');
    }
  }

  return errors;
}

/**
 * Validates behaviors object
 * @param {Object} behaviors - Behaviors object
 * @returns {Array<string>} - Array of error messages
 */
function validateBehaviors(behaviors) {
  const errors = [];

  if (typeof behaviors !== 'object') {
    return ['Behaviors must be an object'];
  }

  if (behaviors.workflow && !['linear', 'exploratory', 'task-focused', 'multi-tasking'].includes(behaviors.workflow)) {
    errors.push('Invalid behaviors.workflow value');
  }

  if (behaviors.learningStyle && !['tutorial', 'examples', 'trial-and-error', 'documentation'].includes(behaviors.learningStyle)) {
    errors.push('Invalid behaviors.learningStyle value');
  }

  if (behaviors.decisionSpeed && !['deliberate', 'balanced', 'quick'].includes(behaviors.decisionSpeed)) {
    errors.push('Invalid behaviors.decisionSpeed value');
  }

  return errors;
}

/**
 * Checks if a string is a valid ISO 8601 date-time
 * @param {string} dateString - String to validate
 * @returns {boolean}
 */
function isValidISO8601(dateString) {
  if (typeof dateString !== 'string') return false;
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime()) && dateString.includes('T');
}

/**
 * Normalizes an identity object, applying defaults for missing fields
 * @param {Object} identity - Identity object to normalize
 * @returns {Object} - Normalized identity
 */
function normalizeIdentity(identity) {
  if (!identity || typeof identity !== 'object') {
    throw new Error('Invalid identity object');
  }

  const normalized = {
    ...identity,
    preferences: {
      ui: {
        theme: identity.preferences?.ui?.theme || 'auto',
        density: identity.preferences?.ui?.density || 'comfortable',
        fontSize: identity.preferences?.ui?.fontSize || 'medium',
        colorBlindMode: identity.preferences?.ui?.colorBlindMode ?? false,
        reducedMotion: identity.preferences?.ui?.reducedMotion ?? false,
        ...identity.preferences?.ui
      },
      interaction: {
        tone: identity.preferences?.interaction?.tone || 'friendly',
        verbosity: identity.preferences?.interaction?.verbosity || 'moderate',
        confirmationStyle: identity.preferences?.interaction?.confirmationStyle || 'destructive-only',
        keyboardShortcuts: identity.preferences?.interaction?.keyboardShortcuts ?? true,
        ...identity.preferences?.interaction
      },
      automation: {
        level: identity.preferences?.automation?.level || 'suggestions',
        aiSuggestions: identity.preferences?.automation?.aiSuggestions ?? true,
        autoSave: identity.preferences?.automation?.autoSave ?? true,
        predictiveActions: identity.preferences?.automation?.predictiveActions ?? false,
        maxAutomationScope: identity.preferences?.automation?.maxAutomationScope || 'session',
        ...identity.preferences?.automation
      },
      notifications: {
        enabled: identity.preferences?.notifications?.enabled ?? true,
        frequency: identity.preferences?.notifications?.frequency || 'batched',
        channels: identity.preferences?.notifications?.channels || ['in-app'],
        ...identity.preferences?.notifications
      },
      content: {
        language: identity.preferences?.content?.language || 'en',
        dateFormat: identity.preferences?.content?.dateFormat || 'ISO',
        timeFormat: identity.preferences?.content?.timeFormat || '24h',
        currency: identity.preferences?.content?.currency || 'USD',
        contentFilter: identity.preferences?.content?.contentFilter || 'moderate',
        ...identity.preferences?.content
      },
      privacy: {
        dataSharing: identity.preferences?.privacy?.dataSharing || 'anonymized',
        analytics: identity.preferences?.privacy?.analytics ?? true,
        personalization: identity.preferences?.privacy?.personalization ?? true,
        ...identity.preferences?.privacy
      },
      accessibility: {
        screenReader: identity.preferences?.accessibility?.screenReader ?? false,
        highContrast: identity.preferences?.accessibility?.highContrast ?? false,
        focusIndicators: identity.preferences?.accessibility?.focusIndicators || 'standard',
        ...identity.preferences?.accessibility
      },
      risk: {
        tolerance: identity.preferences?.risk?.tolerance || 'moderate',
        requireConfirmation: identity.preferences?.risk?.requireConfirmation ?? true,
        ...identity.preferences?.risk
      },
      ...identity.preferences
    },
    behaviors: {
      ...identity.behaviors
    }
  };

  return normalized;
}

module.exports = {
  validateIdentity,
  normalizeIdentity
};

