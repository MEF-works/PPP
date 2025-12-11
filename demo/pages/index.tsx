import { useState, useEffect } from 'react'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
// Import ingester functions
// Note: In a real setup, you'd use the SDK or bundle the core
// For demo purposes, we'll use a simplified version
async function ingestIdentity(url: string) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch: ${response.statusText}`);
  return response.json();
}

function extractPreferences(identity: any) {
  return identity?.preferences || {};
}

interface Preferences {
  ui?: {
    theme?: string
    density?: string
    fontSize?: string
    colorBlindMode?: boolean
    reducedMotion?: boolean
  }
  interaction?: {
    tone?: string
    verbosity?: string
    confirmationStyle?: string
  }
  automation?: {
    level?: string
    aiSuggestions?: boolean
    autoSave?: boolean
  }
  notifications?: {
    enabled?: boolean
    frequency?: string
  }
}

export default function Home() {
  const [identityUrl, setIdentityUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [preferences, setPreferences] = useState<Preferences | null>(null)
  const [appliedTheme, setAppliedTheme] = useState('light')
  const [tone, setTone] = useState('friendly')
  const [verbosity, setVerbosity] = useState('moderate')

  const loadIdentity = async () => {
    if (!identityUrl.trim()) {
      setError('Please enter an identity URL')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const identity = await ingestIdentity(identityUrl)
      const prefs = extractPreferences(identity)
      setPreferences(prefs)

      // Apply preferences
      if (prefs.ui?.theme) {
        setAppliedTheme(prefs.ui.theme === 'auto' ? 'light' : prefs.ui.theme)
      }
      if (prefs.interaction?.tone) {
        setTone(prefs.interaction.tone)
      }
      if (prefs.interaction?.verbosity) {
        setVerbosity(prefs.interaction.verbosity)
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load identity')
      setPreferences(null)
    } finally {
      setLoading(false)
    }
  }

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', appliedTheme)
    if (preferences?.ui?.reducedMotion) {
      document.documentElement.style.setProperty('--animation-speed', '0s')
    } else {
      document.documentElement.style.removeProperty('--animation-speed')
    }
  }, [appliedTheme, preferences])

  const getToneMessage = () => {
    const messages = {
      formal: 'Welcome. Please proceed with your task.',
      casual: 'Hey! What\'s up? Ready to get started?',
      friendly: 'Welcome! Feel free to explore and let us know if you need help.',
      professional: 'Welcome. You may proceed with your work.',
      minimal: 'Welcome.'
    }
    return messages[tone as keyof typeof messages] || messages.friendly
  }

  const getVerbosityLevel = () => {
    const levels = {
      minimal: 'Just the essentials.',
      moderate: 'Here\'s what you need to know, with some helpful context.',
      detailed: 'Here\'s a comprehensive explanation with all the details you might find useful.',
      verbose: 'Let me provide you with an extensive, detailed explanation covering every aspect of this feature and how it works in various scenarios.'
    }
    return levels[verbosity as keyof typeof levels] || levels.moderate
  }

  return (
    <>
      <Head>
        <title>PIP Demo - Portable Preference Identity Protocol</title>
        <meta name="description" content="Demonstration of PIP - The Internet That Adapts to You" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main} data-density={preferences?.ui?.density || 'comfortable'}>
        <div className={styles.container}>
          <h1 className={styles.title}>
            PIP Demo
            <span className={styles.subtitle}>The Internet That Adapts to You</span>
          </h1>

          <div className={styles.identityLoader}>
            <h2>Load Your Identity</h2>
            <p>Paste your PIP identity URL to see instant personalization:</p>
            <div className={styles.inputGroup}>
              <input
                type="text"
                value={identityUrl}
                onChange={(e) => setIdentityUrl(e.target.value)}
                placeholder="https://example.com/identity.json"
                className={styles.input}
                onKeyPress={(e) => e.key === 'Enter' && loadIdentity()}
              />
              <button
                onClick={loadIdentity}
                disabled={loading}
                className={styles.button}
              >
                {loading ? 'Loading...' : 'Load Identity'}
              </button>
            </div>

            {error && (
              <div className={styles.error}>
                <strong>Error:</strong> {error}
              </div>
            )}

            {preferences && (
              <div className={styles.success}>
                <strong>✓ Identity loaded successfully!</strong>
                <p>The app has adapted to your preferences.</p>
              </div>
            )}
          </div>

          {preferences && (
            <div className={styles.demoSection}>
              <h2>Adaptive UI Demonstration</h2>

              <div className={styles.card}>
                <h3>Theme Adaptation</h3>
                <p>Current theme: <strong>{appliedTheme}</strong></p>
                <p>Your preference: <strong>{preferences.ui?.theme || 'default'}</strong></p>
                <div className={styles.themePreview}>
                  <div className={styles.themeBox}></div>
                </div>
              </div>

              <div className={styles.card}>
                <h3>Interaction Tone</h3>
                <p>Your preferred tone: <strong>{tone}</strong></p>
                <div className={styles.toneMessage}>
                  {getToneMessage()}
                </div>
              </div>

              <div className={styles.card}>
                <h3>Verbosity Level</h3>
                <p>Your preferred verbosity: <strong>{verbosity}</strong></p>
                <div className={styles.verbosityExample}>
                  {getVerbosityLevel()}
                </div>
              </div>

              <div className={styles.card}>
                <h3>Automation Settings</h3>
                <ul className={styles.preferenceList}>
                  <li>Level: <strong>{preferences.automation?.level || 'default'}</strong></li>
                  <li>AI Suggestions: <strong>{preferences.automation?.aiSuggestions ? 'Enabled' : 'Disabled'}</strong></li>
                  <li>Auto-save: <strong>{preferences.automation?.autoSave ? 'Enabled' : 'Disabled'}</strong></li>
                </ul>
              </div>

              <div className={styles.card}>
                <h3>UI Preferences</h3>
                <ul className={styles.preferenceList}>
                  <li>Density: <strong>{preferences.ui?.density || 'default'}</strong></li>
                  <li>Font Size: <strong>{preferences.ui?.fontSize || 'default'}</strong></li>
                  <li>Color Blind Mode: <strong>{preferences.ui?.colorBlindMode ? 'Enabled' : 'Disabled'}</strong></li>
                  <li>Reduced Motion: <strong>{preferences.ui?.reducedMotion ? 'Enabled' : 'Disabled'}</strong></li>
                </ul>
              </div>

              <div className={styles.card}>
                <h3>Notification Preferences</h3>
                <ul className={styles.preferenceList}>
                  <li>Enabled: <strong>{preferences.notifications?.enabled ? 'Yes' : 'No'}</strong></li>
                  <li>Frequency: <strong>{preferences.notifications?.frequency || 'default'}</strong></li>
                </ul>
              </div>

              <div className={styles.card}>
                <h3>Raw Preferences</h3>
                <pre className={styles.jsonPreview}>
                  {JSON.stringify(preferences, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {!preferences && (
            <div className={styles.placeholder}>
              <h2>Try It Out</h2>
              <p>Load a PIP identity to see how the app adapts instantly to your preferences.</p>
              <p>You can use one of the example identities from the <code>/examples</code> directory.</p>
            </div>
          )}
        </div>
      </main>
    </>
  )
}

