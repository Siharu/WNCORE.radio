# WNCORE Radio - Deployment Guide

## Pre-Deployment Checklist

### Code & Assets
- [ ] All JavaScript files minified (use Terser/UglifyJS in CI/CD)
- [ ] CSS concatenated and minified
- [ ] Images optimized (use ImageOptim or similar)
- [ ] No console.log statements in production
- [ ] Error handling in place for all API calls
- [ ] CORS headers properly configured

### Configuration
- [ ] Environment variables loaded from `.env`
- [ ] Admin password hashed (use bcrypt)
- [ ] Supabase credentials secured
- [ ] API keys not exposed in client-side code
- [ ] Sentry error tracking configured (optional)

### Security
- [ ] CSP headers configured in vercel.json
- [ ] Passwords never hardcoded (admin.js uses env var)
- [ ] Input validation on all forms
- [ ] XSS protection enabled
- [ ] Rate limiting on API endpoints

### Performance
- [ ] Lazy loading for images
- [ ] Code splitting enabled
- [ ] CDN configured for static assets
- [ ] Gzip compression enabled
- [ ] Cache headers properly set

### Testing
- [ ] Mobile responsiveness tested on real devices
- [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)
- [ ] Accessibility tested (WCAG 2.1 AA)
- [ ] ARG features tested (Signal Lost, admin panel)
- [ ] All pages render correctly

## Deployment Steps

### Vercel Deployment

1. **Connect Repository**
   ```bash
   vercel link
   ```

2. **Set Environment Variables**
   ```bash
   vercel env add SUPABASE_URL
   vercel env add SUPABASE_ANON_KEY
   vercel env add ADMIN_PASSWORD_HASH
   ```

3. **Configure vercel.json**
   See vercel.json.example for proper configuration

4. **Deploy**
   ```bash
   vercel deploy --prod
   ```

### Docker Deployment

```bash
docker build -t wncore-radio .
docker run -p 3000:3000 -e SUPABASE_URL=... wncore-radio
```

### Self-Hosted Deployment

1. Clone repository
2. Install dependencies: `npm install`
3. Set environment variables in `.env`
4. Build assets: `npm run build`
5. Start server: `npm start`

## Post-Deployment

- Monitor error logs via Sentry
- Check Core Web Vitals in Google Search Console
- Verify SSL certificate is valid
- Test admin panel with test credentials
- Confirm all radio stations are streaming
- Monitor uptime and response times

## Production Security Best Practices

1. **Admin Password**: Hash with bcrypt, never store plaintext
   ```javascript
   const bcrypt = require('bcrypt');
   const hash = await bcrypt.hash(password, 10);
   ```

2. **API Keys**: Store in Vercel secrets, use `process.env`

3. **CORS**: Only allow your domain
   ```json
   {
     "headers": [
       {
         "key": "Access-Control-Allow-Origin",
         "value": "https://yourdomain.com"
       }
     ]
   }
   ```

4. **CSP Headers**: Restrict script sources
   ```
   default-src 'self';
   script-src 'self' 'unsafe-inline';
   ```

## Monitoring

### Key Metrics to Track
- Page load time (< 3s)
- API response time (< 500ms)
- Error rate (< 0.1%)
- Uptime (> 99.9%)
- Active listeners

### Tools
- Google Analytics for traffic
- Sentry for error tracking
- Vercel Analytics for performance
- Uptime Robot for monitoring

## Rollback Plan

If issues occur in production:

1. **Immediate**: Revert to last stable version
   ```bash
   vercel rollback
   ```

2. **Investigation**: Check Sentry for errors
3. **Fix**: Apply hotfix and test
4. **Deploy**: Deploy fixed version

## Support

For deployment issues, contact: deploy@wncoreradio.net
