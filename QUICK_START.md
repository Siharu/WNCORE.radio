# WNCORE Radio — Quick Start Guide

## 🚀 For the Impatient

### Immediate Start (Next 2 minutes)

```bash
# 1. Navigate to project
cd d:\rttt\WNCORE.radio-main

# 2. Start local server
python -m http.server 8000

# 3. Open browser
# Visit: http://localhost:8000

# Done! Site is running.
```

### Access Admin Panel (Right Now)
1. Open the site (localhost:8000)
2. Press `Ctrl+A` on keyboard
3. Type: `node09`
4. Press Enter
5. You're in! 🎉

---

## 📦 For Developers

### Setup Development Environment

```bash
# Install Node.js dependencies
npm install

# Start development server
npm run dev

# In another terminal, run build watcher (if desired)
# npm run build
```

### File Structure Quick Reference

```
├── index.html              # All pages (11 total)
├── main.js                 # Core radio player
├── admin.js                # Admin panel + Signal Lost
├── wrongness.js            # ARG psychological effects
├── improvements.js         # 26 keyboard shortcuts
├── style.css               # All styling
│
├── package.json            # Dependencies & scripts
├── Dockerfile              # Docker image
├── docker-compose.yml      # Docker orchestration
├── vercel.json             # Vercel deployment config
│
├── README.md               # Full documentation
├── DEPLOYMENT.md           # How to deploy
├── SECURITY.md             # Security policies
├── TESTING.md              # Test procedures
├── BUGS_AND_FIXES.md       # Optimization details
├── CHANGELOG.md            # Version history
└── .env.example            # Environment template
```

### Common Commands

```bash
# Development
npm run dev                 # Start local server (port 8000)
npm run build              # Build for production
npm run optimize           # Minify & optimize all assets

# Testing & Quality
npm run test               # Run test suite
npm run lint               # Check code quality
npm run analyze            # Lighthouse audit

# Deployment
npm run deploy:vercel      # Deploy to Vercel
npm run deploy:docker      # Build & run Docker image

# Server
npm run serve:dist         # Serve production build
```

### Key Features

| Feature | How to Test |
|---------|-------------|
| **Radio Streaming** | Click any station card |
| **Search** | Type in search box (top of page) |
| **Dark Mode** | Press `D` or use button |
| **Admin Panel** | Press `Ctrl+A` + password: `node09` |
| **Signal Lost** | Click random cards (15% are anomalous) |
| **Keyboard Shortcuts** | Press `?` for help menu |
| **Favorites** | Click heart on station or press `F` |

---

## 🌐 For Deployment

### Quick Deploy to Vercel

```bash
# 1. Connect account
vercel login

# 2. Deploy
npm run deploy:vercel

# 3. Check live site
vercel --prod
```

### Docker Deployment

```bash
# 1. Build image
docker build -t wncore-radio .

# 2. Run container
docker run -p 3000:3000 \
  -e ADMIN_PASSWORD=node09 \
  wncore-radio

# 3. Open browser to localhost:3000
```

### Full Deployment Guide
See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions (Vercel, Docker, self-hosted).

---

## 🧪 Quick Testing

### Manual Testing Checklist
- [ ] Station plays audio
- [ ] Search works
- [ ] Dark mode toggles
- [ ] Admin panel opens (Ctrl+A + node09)
- [ ] Signal Lost appears randomly
- [ ] Mobile responsive on phone

### Automated Testing
```bash
npm test                   # Run all tests
npm run lint              # Check code
npm run analyze           # Lighthouse audit
```

Full testing guide: [TESTING.md](TESTING.md)

---

## 🔧 Configuration

### Environment Variables

Copy `.env.example` → `.env` and edit:

```bash
cp .env.example .env
```

```
# .env file
SUPABASE_URL=your_url
SUPABASE_ANON_KEY=your_key
ADMIN_PASSWORD=your_password
ENABLE_ARG_MODE=true
```

### Admin Password
- **Development**: `node09` (default)
- **Production**: Use environment variable (see .env.example)

---

## 📚 Documentation Index

| Document | Purpose |
|----------|---------|
| [README.md](README.md) | Full project documentation |
| [DEPLOYMENT.md](DEPLOYMENT.md) | How to deploy anywhere |
| [SECURITY.md](SECURITY.md) | Security policies & practices |
| [TESTING.md](TESTING.md) | Comprehensive testing guide |
| [BUGS_AND_FIXES.md](BUGS_AND_FIXES.md) | Known issues & optimizations |
| [CHANGELOG.md](CHANGELOG.md) | Version history |

---

## ⚠️ Common Issues

### Station won't play
```javascript
// Check in browser console
console.log('Streams available:', window.currentStation)
```
→ Check station URL is HTTPS

### Admin panel won't open
→ Press `Ctrl+A` (not just `A`)
→ Try password: `node09`

### Mobile layout broken
→ Clear cache: `Ctrl+Shift+Del`
→ Check viewport meta tag in HTML

### Performance slow
→ Press `M` for minimal mode (disables animations)
→ Check `npm run analyze` for bottlenecks

---

## 🎯 Next Steps

### For First-Time Users
1. ✅ Open http://localhost:8000
2. ✅ Play a station (click any card)
3. ✅ Access admin panel (Ctrl+A + node09)
4. ✅ Explore ARG elements

### For Developers
1. ✅ Read [README.md](README.md)
2. ✅ Review [DEPLOYMENT.md](DEPLOYMENT.md)
3. ✅ Check [package.json](package.json) scripts
4. ✅ Run tests: `npm run test`
5. ✅ Deploy: `npm run deploy:vercel`

### For DevOps/Deployment
1. ✅ Review [DEPLOYMENT.md](DEPLOYMENT.md)
2. ✅ Check [vercel.json](vercel.json) or [Dockerfile](Dockerfile)
3. ✅ Set environment variables
4. ✅ Run `npm run build`
5. ✅ Deploy to production

### For Security Reviews
1. ✅ Read [SECURITY.md](SECURITY.md)
2. ✅ Check [BUGS_AND_FIXES.md](BUGS_AND_FIXES.md)
3. ✅ Review [admin.js](admin.js) for auth logic
4. ✅ Validate [TESTING.md](TESTING.md) security tests

---

## 🎬 Project Status

```
✅ Core radio player         COMPLETE
✅ Mobile responsive         COMPLETE
✅ Admin panel               COMPLETE
✅ ARG elements              COMPLETE
✅ Legal pages               COMPLETE
✅ Deployment ready          COMPLETE
✅ Documentation             COMPLETE
✅ Security hardened         COMPLETE
✅ Performance optimized     COMPLETE
✅ Production ready          🟢 YES
```

---

## 📞 Support

- **Questions**: Check [README.md](README.md)
- **Deployment Help**: See [DEPLOYMENT.md](DEPLOYMENT.md)
- **Bugs**: File issue on GitHub or email bugs@wncoreradio.net
- **Security Issues**: Email security@wncoreradio.net

---

## 🎉 You're All Set!

```bash
# Ready to go:
npm run dev

# Open: http://localhost:8000
# Admin: Ctrl+A + node09
# Deploy: npm run deploy:vercel
```

**Version**: 3.1.0 | **Status**: ✅ Production Ready
