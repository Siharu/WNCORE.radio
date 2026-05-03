# 🎙️ WNCORE Radio — ARG Radio Platform

**A sophisticated, immersive Alternate Reality Game (ARG) web platform masquerading as a global radio streaming service.**

![Version](https://img.shields.io/badge/version-3.1.0-blue)
![Status](https://img.shields.io/badge/status-Production%20Ready-brightgreen)
![License](https://img.shields.io/badge/license-Proprietary-red)

## Overview

WNCORE Radio is a state-of-the-art ARG website that combines:
- **Fully functional radio streaming** (12,000+ real stations via Radio Browser API)
- **Hidden ARG elements** (Signal Lost anomalies, Admin panel with Ctrl+A access, psychological effects)
- **Professional legitimacy** (Fake legal pages, API docs, Terms of Service with hidden lore)
- **Mobile-first responsive design** (Works flawlessly on all devices)
- **Production-ready deployment** (Vercel, Docker, self-hosted)

## Features

### 🎧 Radio Platform
- Stream from 12,000+ verified radio stations worldwide
- Browse by 310 countries and 20+ genres
- Search stations by name, country, or genre
- Save favorite stations
- Real-time listener counts
- Live anime/J-Music channel
- Podcast and live music sections
- Globe visualization of broadcasting network

### 👁️ ARG Elements
- **Signal Lost Anomalies**: Cryptic notifications appear on random interactions (15% of cards are "anomalous")
- **Admin Panel**: Access with `Ctrl+A` + password (`node09`)
- **Psychological Effects** (wrongness.js):
  - Ghost cursor
  - Text glitches
  - Phantom UI elements
  - Screen micro-glitches
  - Phantom hover states
  - Subliminal messages in ticker
  
### ⚙️ Advanced Features
- Dark mode / Light mode / Minimal mode
- Keyboard shortcuts (?, K, N, P, F, D, G, H, M, /)
- Real-time account authentication terminal (triggers email horror sequence)
- About page with eerie text scrambling effect
- Data corruption terminal screen
- Eye system visual anomaly
- Exposure tracking (unlocks horror sequences at milestones)

### 📄 Legal Pages (with ARG Lore)
- Privacy Policy (mentions Node 09 and unverified transmissions)
- Terms of Service (Governance: Section 09 Redacted)
- DMCA Policy (with frequency lockout references)
- API Documentation (with Node 09 special routing)

### 📱 Mobile First
- Touch-friendly interfaces (min 44x44px buttons)
- Optimized for 320px - 1440px widths
- Performance optimized (no backdrop-filter on mobile)
- Lazy loading for images
- Smooth scrolling with -webkit-overflow-scrolling

## Installation

### Quick Start (Local)

```bash
# Clone repository
git clone https://github.com/yourname/wncore-radio.git
cd wncore-radio

# Serve locally
python -m http.server 8000
# Open http://localhost:8000
```

### With Environment Variables

```bash
cp .env.example .env
# Edit .env with your Supabase credentials, admin password, etc.
export $(cat .env | xargs)
npm run build
npm run start
```

## Deployment

### Vercel (Recommended)

```bash
# Connect to Vercel
vercel link

# Set environment variables
vercel env add SUPABASE_URL
vercel env add SUPABASE_ANON_KEY
vercel env add ADMIN_PASSWORD

# Deploy
vercel deploy --prod
```

### Docker

```bash
docker build -t wncore-radio .
docker run -p 3000:3000 -e ADMIN_PASSWORD=node09 wncore-radio
```

### Self-Hosted

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

## Architecture

```
wncore-radio/
├── index.html          # Main HTML (includes all pages)
├── style.css           # Global styles + mobile optimizations
├── main.js             # Core radio functionality
├── improvements.js     # 26 feature additions (keyboard shortcuts, history, etc.)
├── wrongness.js        # ARG psychological effects
├── admin.js            # Admin panel + Signal Lost triggers
├── vercel.json         # Deployment configuration
├── build.sh            # Production build script
└── DEPLOYMENT.md       # Deployment guide
```

### Key Files

| File | Purpose | Lines |
|------|---------|-------|
| main.js | Radio player, station loading, page switching | 1400+ |
| wrongness.js | Psychological effects, glitches, phantom UI | 800+ |
| admin.js | Admin panel, Ctrl+A access, Signal Lost | 280+ |
| style.css | All styling + mobile optimizations | 1600+ |
| index.html | HTML structure + legal pages + ARG UI | 800+ |

## Usage

### As a Player (Normal Mode)
- Click stations to play
- Use keyboard shortcuts (? for help)
- Explore genres and countries
- Save favorites
- Try dark mode / minimal mode

### As an ARG Player
- Press `Ctrl+A` to access admin panel (password: `node09`)
- Click "anomalous" cards randomly (they have special borders)
- Look for cryptic messages in the ticker
- Listen for Signal Lost anomalies
- Watch the exposure meter escalate horror
- Try signing in (triggers eerie terminal sequence)
- Visit About page for text scrambling effect

### As a Developer
- See DEPLOYMENT.md for production setup
- See BUGS_AND_FIXES.md for optimization details
- View admin.js for extending functionality
- Check Vercel configuration in vercel.json

## Configuration

### Environment Variables

```bash
SUPABASE_URL=          # Supabase project URL
SUPABASE_ANON_KEY=     # Supabase public key
ADMIN_PASSWORD=        # Admin panel password
RADIO_BROWSER_API=     # Radio API endpoint (default: radio-browser.info)
ENABLE_ARG_MODE=true   # Enable ARG features
ENABLE_ADMIN_PANEL=true
ENABLE_SIGNAL_LOST=true
```

### Admin Panel

- **Access**: Press `Ctrl+A` anywhere in the site
- **Password**: `node09` (change in production!)
- **Features**: 
  - Live system metrics
  - Uptime tracking
  - Listener count
  - Frequency coverage
  - Occasional glitches (ARG effect)

## API Reference

### Radio Browser API

```javascript
// Get stations by genre
fetch('https://all.api.radio-browser.info/json/stations/search?tag=jazz&limit=20')

// Get top stations
fetch('https://all.api.radio-browser.info/json/stations/search?order=clickcount&reverse=true&limit=50')

// Search by country
fetch('https://all.api.radio-browser.info/json/stations/search?country=United%20States&limit=20')
```

### Custom Functions

```javascript
// Play a station
playStation(url, name, country, emoji)

// Switch page
showPage(pageId, navElement)

// Toggle dark mode
toggleDark()

// Show admin panel
showAdminModal()

// Trigger Signal Lost
triggerSignalLost()
```

## Browser Support

| Browser | Version | Support |
|---------|---------|---------|
| Chrome | Latest | ✅ Full |
| Firefox | Latest | ✅ Full |
| Safari | 14+ | ✅ Full |
| Edge | Latest | ✅ Full |
| Mobile Safari | iOS 14+ | ✅ Full |
| Chrome Mobile | Android 10+ | ✅ Full |

## Performance

### Core Web Vitals (Target)
- **First Contentful Paint**: < 2.5s
- **Largest Contentful Paint**: < 4s
- **Cumulative Layout Shift**: < 0.1
- **Time to Interactive**: < 5s

### Lighthouse Score
- **Performance**: 85+
- **Accessibility**: 90+
- **Best Practices**: 90+
- **SEO**: 95+

## Security

- ✅ No personal data collection
- ✅ Environment variables for secrets
- ✅ CORS properly configured
- ✅ CSP headers in place
- ✅ Rate limiting on admin panel (5 attempts, 5-minute lockout)
- ✅ Admin password hashing ready (use bcrypt in production)
- ✅ XSS protection enabled
- ✅ HTTPS enforced

## Testing

### Manual Testing Checklist
- [ ] All stations play correctly
- [ ] Search works in all categories
- [ ] Mobile responsive at 320px, 480px, 768px
- [ ] Dark mode toggle works
- [ ] Keyboard shortcuts function
- [ ] Admin panel unlocks with Ctrl+A
- [ ] Signal Lost anomalies appear
- [ ] Legal pages display correctly
- [ ] No console errors
- [ ] Lighthouse score > 80

### Automated Testing
See BUGS_AND_FIXES.md for comprehensive testing matrix.

## Roadmap

**Upcoming Features**:
- [ ] Offline mode with Service Worker
- [ ] Mobile PWA app
- [ ] User accounts with Supabase
- [ ] Social listening features
- [ ] Recommendation engine
- [ ] Browser extension
- [ ] Voice search
- [ ] Multiple language support

## Troubleshooting

### Station won't play
- Check browser console for CORS errors
- Verify station URL is HTTPS
- Try a different station
- Check internet connection

### Mobile layout broken
- Clear browser cache
- Ensure viewport meta tag is present
- Test in Chrome DevTools device emulation

### Admin panel won't open
- Use `Ctrl+A` (not `Cmd+A` on Mac - both work)
- Check that admin.js is loaded
- Try password: `node09`

### Performance issues
- Disable animations in browser settings
- Close other tabs
- Check CPU/RAM usage
- Try minimal mode

## Contributing

This is a closed-source ARG project. For community contributions or bug reports, contact: dev@wncoreradio.net

## License

**Proprietary** - WNCORE Radio © 2025. All rights reserved.

## Credits

**Created by**: WNCORE Broadcasting (Node Management)
**Built with**: HTML5, CSS3, JavaScript (Vanilla)
**Powered by**: Radio Browser API, Supabase, Vercel
**ARG Design**: Immersive horror + radio nostalgia

## Support

- **Bugs**: bugs@wncoreradio.net
- **Deployment**: deploy@wncoreradio.net
- **API**: api@wncoreradio.net
- **Privacy**: privacy@wncoreradio.net

## Disclaimer

WNCORE Radio is a fictional project for entertainment purposes. Any resemblance to actual frequencies, organizations, or events is entirely coincidental. Some frequencies may contain anomalous or disturbing content.

---

**Last Updated**: January 2025  
**Version**: 3.1.0  
**Status**: ✅ Production Ready  
**Node 09 Status**: 🔴 SILENT (Since 2016)
