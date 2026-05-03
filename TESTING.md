# WNCORE Radio — Testing Guide

## Overview

Comprehensive testing procedures for WNCORE Radio development, staging, and production environments.

## Pre-Deployment Checklist

### ✅ Functional Testing

#### 1. Navigation & Pages
- [ ] Home page loads without errors
- [ ] All navigation buttons work
- [ ] All 11 pages accessible: Home, Charts, Genres, Anime, Podcasts, Live Music, About, Privacy, Terms, DMCA, API
- [ ] Page switching smooth (no flicker)
- [ ] Back button works in browser
- [ ] All links point to correct pages

#### 2. Radio Streaming
- [ ] Can play at least 5 different stations
- [ ] Play/pause button toggles correctly
- [ ] Volume slider works (0-100%)
- [ ] Station info displays correctly (name, country, genre)
- [ ] Emoji icons show for all stations
- [ ] Stop button stops playback
- [ ] Next/previous functionality (if implemented)

#### 3. Search & Filtering
- [ ] Search by station name works
- [ ] Filter by genre works
- [ ] Filter by country works
- [ ] Results show correctly with pagination
- [ ] Results count accurate
- [ ] Clear search button works
- [ ] No console errors during search

#### 4. User Preferences
- [ ] Dark mode toggle works
- [ ] Light mode toggle works
- [ ] Minimal mode toggle works
- [ ] Preferences persist after reload
- [ ] All modes display correctly
- [ ] Text readable in all modes
- [ ] No styling breaks in any mode

#### 5. Favorites System
- [ ] Can favorite a station
- [ ] Favorited stations appear in favorites section
- [ ] Can unfavorite a station
- [ ] Favorite count updates
- [ ] Favorites persist after reload
- [ ] Heart icon shows favorite status

#### 6. Keyboard Shortcuts
- [ ] `?` shows help menu
- [ ] `K` plays/pauses
- [ ] `N` plays next station
- [ ] `P` plays previous station
- [ ] `F` favorites current station
- [ ] `D` toggles dark mode
- [ ] `G` shows globe (if applicable)
- [ ] `H` shows history
- [ ] `M` toggles minimal mode
- [ ] `/` focuses search

#### 7. Admin Panel Access
- [ ] `Ctrl+A` opens admin modal (Windows/Linux)
- [ ] `Cmd+A` opens admin modal (Mac)
- [ ] Modal displays login form
- [ ] Wrong password shows error
- [ ] Correct password: `node09`
- [ ] Admin panel loads after auth
- [ ] Dashboard shows metrics (uptime, listeners, coverage)
- [ ] Logout button works
- [ ] Cannot access without password

#### 8. Signal Lost Anomalies
- [ ] Anomalies appear on random interactions
- [ ] Signal Lost floating box displays
- [ ] Message changes each time
- [ ] Box auto-dismisses after ~2.5s
- [ ] Multiple messages include Node 09 references
- [ ] Position correct (bottom-right)
- [ ] Opacity transitions smooth

#### 9. ARG Elements
- [ ] Text occasionally glitches (wrongness.js)
- [ ] Phantom UI elements appear
- [ ] About page text scrambles
- [ ] Login sequence triggers eerie terminal
- [ ] Exposure system works (check console: `window.exposure`)
- [ ] Horror sequences escalate at milestones
- [ ] 88.7 MHz references appear

#### 10. Legal Pages
- [ ] Privacy policy page loads
- [ ] Terms of service page loads
- [ ] DMCA policy page loads
- [ ] API documentation page loads
- [ ] All pages readable and formatted
- [ ] Hidden ARG lore present but subtle
- [ ] Links in footer work

### 📱 Mobile Testing

#### Responsive Design
- [ ] **320px**: All content visible, no horizontal scroll
- [ ] **480px**: Touch targets min 44x44px
- [ ] **600px**: Layout adjusts correctly
- [ ] **768px**: Tablet layout works
- [ ] **1024px+**: Desktop layout optimal

#### Touch Interactions
- [ ] Buttons clickable (not too close together)
- [ ] No hover states stuck after touch
- [ ] Swipe navigation works (if implemented)
- [ ] Form inputs don't trigger zoom
- [ ] Keyboard appears when needed
- [ ] Scrolling smooth

#### Mobile Devices
Test on actual devices when possible:

**iOS (iPhone)**
- [ ] iPhone SE (375px)
- [ ] iPhone 12 (390px)
- [ ] iPhone 14 Pro Max (430px)
- [ ] iPad (768px width)
- [ ] iPad Pro (1024px width)

**Android**
- [ ] Samsung Galaxy A13 (360px)
- [ ] Samsung Galaxy S21 (360px)
- [ ] Pixel 6a (412px)
- [ ] Tablet (768px width)

#### Mobile Browsers
- [ ] Safari (iOS)
- [ ] Chrome Mobile (Android)
- [ ] Firefox Mobile
- [ ] Samsung Internet
- [ ] Edge Mobile

#### Mobile Performance
- [ ] Page loads in < 3 seconds
- [ ] Animations smooth at 60fps
- [ ] No animation stutter
- [ ] Music plays smoothly
- [ ] Touch responses instant

### 🖥️ Desktop Testing

#### Browsers
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

#### Screen Sizes
- [ ] 1440x900 (HD)
- [ ] 1920x1080 (Full HD)
- [ ] 2560x1440 (2K)
- [ ] 3840x2160 (4K)

#### Features
- [ ] All features work as intended
- [ ] No console errors
- [ ] Smooth scrolling
- [ ] Transitions and animations smooth
- [ ] Hover states work correctly

### ⚡ Performance Testing

#### Lighthouse Audit
```bash
npm run analyze
```

Targets:
- [ ] Performance: 85+
- [ ] Accessibility: 90+
- [ ] Best Practices: 90+
- [ ] SEO: 95+

#### Core Web Vitals
- [ ] **Largest Contentful Paint (LCP)**: < 4s
- [ ] **First Input Delay (FID)**: < 100ms
- [ ] **Cumulative Layout Shift (CLS)**: < 0.1
- [ ] **First Contentful Paint (FCP)**: < 2.5s
- [ ] **Time to Interactive (TTI)**: < 5s

#### Load Testing
- [ ] Home page loads in < 2s
- [ ] Search responds in < 500ms
- [ ] Station switches in < 300ms
- [ ] Navigation responsive at all times

### ♿ Accessibility Testing

#### Keyboard Navigation
- [ ] Tab key navigates all interactive elements
- [ ] Shift+Tab navigates backwards
- [ ] Enter activates buttons
- [ ] Space toggles checkboxes
- [ ] Escape closes modals
- [ ] Focus indicators visible

#### Screen Reader (VoiceOver/NVDA)
- [ ] Page title announced
- [ ] Headings properly structured
- [ ] Links have descriptive text
- [ ] Buttons have labels
- [ ] Form fields have labels
- [ ] Images have alt text
- [ ] Dynamic content announced

#### Color Contrast
- [ ] Light mode: WCAG AA (4.5:1 text)
- [ ] Dark mode: WCAG AA (4.5:1 text)
- [ ] Minimal mode: WCAG AAA (7:1 text)
- [ ] No color-only instructions

#### Zoom & Resize
- [ ] 200% zoom readable
- [ ] Text resize works
- [ ] No fixed widths break layout
- [ ] Word wrap correct

### 🔒 Security Testing

#### Admin Panel
- [ ] Rate limiting: 5 failed attempts lock out
- [ ] Lockout duration: 5 minutes
- [ ] Password field masked
- [ ] CSRF token present
- [ ] No password in JavaScript

#### Data Protection
- [ ] HTTPS only (when deployed)
- [ ] No personal data exposed
- [ ] No credentials in console
- [ ] Local storage data not sensitive
- [ ] Secure headers present

#### Input Validation
- [ ] Search sanitized
- [ ] No XSS possible
- [ ] No SQL injection possible
- [ ] No admin bypass

### 🌍 Browser Compatibility

#### Desktop
| Browser | Version | Result |
|---------|---------|--------|
| Chrome | Latest | ✅/❌ |
| Firefox | Latest | ✅/❌ |
| Safari | 14+ | ✅/❌ |
| Edge | Latest | ✅/❌ |

#### Mobile
| Browser | OS | Result |
|---------|-----|--------|
| Safari | iOS 14+ | ✅/❌ |
| Chrome | Android 10+ | ✅/❌ |
| Firefox | Android | ✅/❌ |
| Samsung Internet | Android | ✅/❌ |

## Automated Testing

### Unit Tests (if implemented)
```bash
npm test
```

### Lint Check
```bash
npm run lint
```

### Build Validation
```bash
npm run build
npm run serve:dist
```

## Manual Test Cases

### Test Case 1: First-Time Visitor
1. Open site on new browser
2. Verify home page displays
3. Click random station to play
4. Toggle dark mode
5. Search for "rock" genre
6. Add station to favorites
7. Verify no errors

**Expected Result**: Smooth experience, no console errors

### Test Case 2: Admin Discovery
1. Open site normally
2. Press `Ctrl+A` (or `Cmd+A` on Mac)
3. Admin modal opens
4. Try wrong password
5. Try correct password: `node09`
6. Verify admin dashboard loads
7. Check metrics display
8. Logout
9. Verify back on home page

**Expected Result**: Admin panel locked until correct password

### Test Case 3: Signal Lost Anomaly
1. Play a station
2. Click various interface elements
3. Watch for Signal Lost notifications
4. Note that it appears randomly
5. Check console for exposure value

**Expected Result**: Anomalies appear unpredictably (~15% of cards)

### Test Case 4: Mobile Experience
1. Open on mobile device
2. Verify no horizontal scroll
3. Tap play button (min 44x44px)
4. Search for station
5. Toggle dark mode
6. Scroll smoothly
7. Try all pages
8. Test on landscape

**Expected Result**: All features work, no layout breaks

### Test Case 5: Legal Compliance
1. Scroll to footer
2. Click "Privacy Policy"
3. Verify page loads
4. Click "Terms of Service"
5. Verify page loads
6. Click "DMCA"
7. Click "API"
8. Verify all load correctly

**Expected Result**: All legal pages display with ARG lore

## Production Testing

### Before Deployment
- [ ] Run full test suite
- [ ] Lighthouse score > 80
- [ ] All manual tests pass
- [ ] No console errors
- [ ] Performance metrics met
- [ ] Security audit passed
- [ ] Backup current version

### After Deployment
- [ ] Monitor uptime (UptimeRobot)
- [ ] Check error logs (Sentry)
- [ ] Monitor performance
- [ ] User feedback collected
- [ ] Analytics reviewed

## Test Report Template

```markdown
# WNCORE Radio - Test Report

**Date**: [Date]
**Version**: 3.1.0
**Tester**: [Name]
**Environment**: [Dev/Staging/Prod]

## Summary
- **Total Tests**: XX
- **Passed**: XX
- **Failed**: XX
- **Status**: ✅ PASS / ⚠️ ISSUES / ❌ CRITICAL

## Issues Found
1. [Issue Description]
   - Severity: Low/Medium/High/Critical
   - Steps to Reproduce: ...
   - Expected: ...
   - Actual: ...

## Recommendations
- [ ] Action item 1
- [ ] Action item 2

## Sign-off
- Tested by: [Name]
- Approved by: [Name]
```

## Continuous Testing

### Daily Checks
- [ ] Verify site loads
- [ ] Check admin panel works
- [ ] Monitor error rates

### Weekly Checks
- [ ] Full test suite
- [ ] Performance audit
- [ ] User reports review

### Monthly Checks
- [ ] Security audit
- [ ] Browser compatibility update
- [ ] Dependency updates

## Support

For testing help:
- Email: qa@wncoreradio.net
- Slack: #testing-channel

---

**Last Updated**: January 2025  
**Version**: 3.1.0  
**Status**: Testing Framework Ready ✅
