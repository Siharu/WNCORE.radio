# WNCORE Radio — Security Policy

## Overview

WNCORE Radio is built with security-first principles to protect user privacy and system integrity while maintaining the ARG experience.

## Security Measures

### 1. Client-Side Security

#### XSS Protection
- All user input is sanitized before rendering
- No `innerHTML` used with user data
- CSP headers prevent inline script execution
- DOM API used for safe element creation

#### CSRF Protection
- Tokens validated for state-changing operations
- SameSite cookie attribute set to Strict
- POST-only for sensitive actions

#### Data Encryption
- All API calls use HTTPS only
- Local storage data not sensitive (no auth tokens stored client-side)
- Session data cleared on logout
- Environment variables never exposed to client

### 2. Server-Side Security (Deployment)

#### API Security
```json
{
  "headers": {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "geolocation=(), microphone=(), camera=()"
  }
}
```

#### CORS Configuration
- Only allow verified domains
- Credentials sent only to same origin
- Preflight requests validated

### 3. Admin Panel Security

#### Authentication
- Rate limiting: 5 failed attempts → 5 minute lockout
- Password never stored in client-side JavaScript
- Use environment variables for production credentials
- Implement bcrypt hashing for password verification

#### Authorization
- Admin access requires valid password
- Session timeout after 30 minutes of inactivity
- IP whitelisting recommended for production

#### Audit Logging
- Log all admin panel access attempts
- Track sensitive operations
- Monitor for brute-force attacks

### 4. Data Protection

#### Personal Data
- **Collected**: None (no user accounts required)
- **Stored**: Only preferences (dark mode, favorites) in localStorage
- **Third-party sharing**: None

#### Station Metadata
- Fetched from Radio Browser API (open-source)
- Cached locally for 1 hour
- No personal data linked to stations

#### Exposed Frequencies
- 88.7 MHz (fictional network)
- Node 09 status (ARG lore)
- These are NOT real broadcast frequencies

### 5. Infrastructure Security

#### Vercel Deployment
```bash
# Environment variables secured
SUPABASE_URL=
SUPABASE_ANON_KEY=
ADMIN_PASSWORD=
ENABLE_ARG_MODE=true
```

#### Docker Deployment
- Run as non-root user (UID 1000)
- Read-only file system where possible
- Resource limits enforced
- Health checks enabled

#### Self-Hosted
- Use reverse proxy (Nginx/Apache)
- Enable HTTPS with valid certificate
- Keep Node.js updated
- Monitor for suspicious activity

### 6. Dependency Security

#### Minimal Dependencies
- **Production**: No dependencies (static site)
- **Development**: Terser, CSSO, ESLint (vetted packages)
- No abandoned packages in use
- Regular security updates checked

#### Supply Chain
- Dependencies pinned to exact versions
- Security advisory checks (npm audit)
- Regular vulnerability scanning

### 7. Threat Modeling

#### Attack Vectors & Mitigations

| Attack | Impact | Mitigation |
|--------|--------|-----------|
| XSS Injection | Account takeover | CSP headers, input validation |
| CSRF | Unauthorized actions | Token validation, SameSite cookies |
| DDoS | Service unavailability | CDN protection (Vercel) |
| SQL Injection | N/A (no database) | N/A |
| Brute Force | Admin access | Rate limiting, 5-attempt lockout |
| Man-in-the-Middle | Data interception | HTTPS only, Strict-Transport-Security |

### 8. Incident Response

#### If Security Breach Detected

1. **Immediate Actions**
   - Disable compromised admin credentials
   - Review audit logs for suspicious activity
   - Take service offline if necessary

2. **Investigation**
   - Determine scope of exposure
   - Identify affected systems
   - Document timeline

3. **Remediation**
   - Patch vulnerabilities
   - Reset all credentials
   - Deploy fixed version

4. **Communication**
   - Notify affected users (if applicable)
   - Public disclosure if required
   - Update security documentation

#### Contact Security Issues
Email: security@wncoreradio.net (confidential)

**DO NOT** publicly disclose security vulnerabilities without responsible disclosure period (30 days).

## Compliance

### GDPR Compliance
- ✅ No personal data collection
- ✅ No tracking pixels or analytics
- ✅ Privacy policy available
- ✅ No third-party data sharing

### CCPA Compliance
- ✅ Transparent data practices
- ✅ User can clear data (localStorage)
- ✅ No personal information required
- ✅ No data selling

### WCAG 2.1 Accessibility
- ✅ Level AA compliance
- ✅ Keyboard navigation
- ✅ Screen reader support
- ✅ Color contrast compliance

### ARG Appropriateness
- ⚠️ Some content may be unsettling
- ⚠️ Audio may contain eerie sounds
- ⚠️ Flashing effects possible (warning)
- ✅ No malware or actual threats

## Best Practices

### For Administrators

```bash
# 1. Secure Deployment
export ADMIN_PASSWORD=$(openssl rand -base64 32)  # Strong password
export SUPABASE_URL="https://your-project.supabase.co"
export ENABLE_HTTPS=true

# 2. Regular Backups
docker exec wncore-radio tar czf backup.tar.gz /app

# 3. Monitoring
# Enable Sentry error tracking
# Set up Uptime Robot monitoring
# Enable CloudFlare DDoS protection

# 4. Updates
npm audit fix
docker pull node:18-slim && docker build -t wncore-radio .
```

### For Users

- ✅ Use HTTPS connections only (enforced)
- ✅ Keep browser updated
- ✅ Disable extensions if issues occur
- ✅ Clear cache if behavior seems unusual
- ✅ Report suspicious activity

## Security Headers

### Implemented Headers

```
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'
```

## Penetration Testing

### Authorized Testing
- Annual security audit by third party
- Results documented in security report
- Vulnerabilities patched before disclosure

### Testing Restrictions
- **DO NOT** perform security testing without authorization
- **DO NOT** attempt to access production admin panel
- **DO NOT** attempt brute-force attacks
- Unauthorized testing is illegal

## Responsible Disclosure

If you discover a security vulnerability:

1. **DO NOT** publish the vulnerability publicly
2. **DO** email security@wncoreradio.net with details
3. **DO** provide proof-of-concept (if possible)
4. **DO** allow 30 days for response
5. **DO** expect credit if you wish

## Change Log

### v3.1.0
- ✅ Added rate limiting to admin panel
- ✅ Implemented CSP headers
- ✅ Added environment variable support
- ✅ Implemented security headers in Vercel config
- ✅ Secured admin password access

### v3.0.0
- ✅ Initial security audit
- ✅ HTTPS enforcement
- ✅ CORS configuration
- ✅ CSP headers

## Support

- **Security Issues**: security@wncoreradio.net
- **General Questions**: support@wncoreradio.net
- **Deployment Help**: deploy@wncoreradio.net

---

**Last Updated**: January 2025  
**Next Review**: July 2025  
**Security Level**: 🟢 High (for entertainment project)
