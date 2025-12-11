"""
Example: Loading and applying a PIP identity in Python
"""

from pip_sdk import load_identity, load_preferences, apply_preferences

# Example 1: Basic usage
def example1():
    identity_url = 'https://example.com/identity.json'
    
    try:
        identity = load_identity(identity_url)
        apply_preferences(identity['preferences'])
        print('Identity loaded and applied!')
    except ValueError as e:
        print(f'Failed to load identity: {e}')
        # Use default preferences

# Example 2: Loading only preferences
def example2():
    identity_url = 'https://example.com/identity.json'
    
    try:
        prefs = load_preferences(identity_url)
        
        # Apply theme
        if prefs.get('ui', {}).get('theme'):
            theme = prefs['ui']['theme']
            print(f'Applying theme: {theme}')
        
        # Apply tone
        if prefs.get('interaction', {}).get('tone'):
            tone = prefs['interaction']['tone']
            update_messaging(tone)
        
        # Apply automation
        if prefs.get('automation', {}).get('level'):
            level = prefs['automation']['level']
            configure_automation(level)
    except ValueError as e:
        print(f'Failed to load preferences: {e}')

# Example 3: Flask integration
def example3():
    from flask import Flask, render_template
    from pip_sdk import load_preferences
    
    app = Flask(__name__)
    
    @app.route('/')
    def index():
        identity_url = 'https://example.com/identity.json'
        
        try:
            prefs = load_preferences(identity_url)
            return render_template('index.html', preferences=prefs)
        except ValueError:
            return render_template('index.html', preferences=None)
    
    return app

# Helper functions (examples)
def update_messaging(tone):
    tone_map = {
        'formal': 'Please proceed with your task.',
        'casual': 'Hey! Ready to get started?',
        'friendly': 'Welcome! Feel free to explore.',
        'professional': 'You may proceed with your work.',
        'minimal': 'Welcome.'
    }
    print(tone_map.get(tone, tone_map['friendly']))

def configure_automation(level):
    print(f'Automation level set to: {level}')

# Run example
if __name__ == '__main__':
    example1()

