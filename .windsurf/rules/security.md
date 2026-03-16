---
trigger: always_on
description: Security-first coding practices for both platforms
---

# 🔒 Security First Guidelines

<security_rules>
## Never Do This
❌ Hardcode API keys or secrets
❌ Log sensitive user data
❌ Trust user input without validation
❌ Use outdated dependencies with CVEs

## Android Security
- Use EncryptedSharedPreferences for tokens
- Implement certificate pinning for critical APIs
- Enable ProGuard/R8 obfuscation
- Use biometric authentication when available
- Validate intent filters and deep links

## Web Security
- Implement Content Security Policy headers
- Use Helmet.js for Express apps
- Sanitize all user input (XSS prevention)
- Rate limit API endpoints
- Use HTTP-only cookies for sessions
- Implement CSRF tokens for forms

## API Security
- Always use HTTPS
- Implement OAuth2/OIDC properly
- Validate JWT signatures and expiry
- Use parameterized queries (no raw SQL)
- Implement request signing for sensitive operations
</security_rules>
