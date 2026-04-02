# 📚 SIHARU ARCHIVES — COMPLETE DOCUMENTATION

**Master documentation file covering all systems, features, and implementation guides.**

---

## TABLE OF CONTENTS

1. [Lore Manager System](#1-lore-manager-system)
2. [Narrator AI System](#2-narrator-ai-system)
3. [Survivor Games & Monetization](#3-survivor-games--monetization)
4. [UX Enhancements](#4-ux-enhancements)
5. [Deployment Checklist](#5-deployment-checklist)

---

# 1. LORE MANAGER SYSTEM

## Overview

The Lore Manager is a centralized system for managing content that appears in:
- **Ticker**: The scrolling WNCORE broadcast at the top of pages
- **API Broadcasts**: For integration with wncore-bots.js, wncore-broadcast.js

**Files**:
- `api/lore-manager.js` (7.1 KB) — Central CRUD API
- `lore-admin-panel.html` (8.2 KB) — Web admin interface
- `LORE-SETUP-COMPLETE.md` — Quick setup guide

---

## Admin Panel

**Access**: `http://yourdomain.com/lore-admin-panel.html`

Add, edit, disable, and delete lore items directly from the web interface.

**Login Credentials** (shared with chapters.html):
- Username: `theMainauthor345`
- Password: `illgetoutofthisworld275745397`

---

## Features

✅ **Centralized lore management** — One source of truth  
✅ **Dynamic ticker** — No code changes needed to update  
✅ **Multiple categories** — Organize by type  
✅ **Enable/disable** — Control what shows  
✅ **Web admin panel** — Add lore visually  
✅ **API integration** — Programmatic access  
✅ **Auto-refresh** — Every 5 minutes  
✅ **Fallback** — Works even if API fails  

---

## API Reference

### GET /api/lore-manager
**Fetch all active lore items**
```javascript
fetch('/api/lore-manager')
  .then(r => r.json())
  .then(lore => console.log(lore));
```

**Response:**
```json
[
  {
    "id": 1,
    "category": "WNCORE_BROADCAST",
    "content": "⚠ WNCORE BROADCAST — ...",
    "author": "Siharu847",
    "active": true,
    "created_at": "2026-04-02T10:30:00Z"
  }
]
```

### GET /api/lore-manager?category=CATEGORY_NAME
**Fetch lore by category**
```javascript
fetch('/api/lore-manager?category=SIGNAL_INTERCEPT')
  .then(r => r.json())
  .then(lore => console.log(lore));
```

### GET /api/lore-manager?action=categories
**Get available categories**
```javascript
fetch('/api/lore-manager?action=categories')
  .then(r => r.json())
  .then(cats => console.log(Object.keys(cats)));
```

### POST /api/lore-manager
**Add new lore item**
```javascript
fetch('/api/lore-manager', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    category: 'WNCORE_BROADCAST',
    content: '📡 NEW ALERT — Something important just happened...',
    author: 'Siharu847'
  })
})
.then(r => r.json())
.then(data => console.log(data.item));
```

### PUT /api/lore-manager
**Toggle lore item active status**
```javascript
fetch('/api/lore-manager', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    id: 5,
    active: false
  })
})
.then(r => r.json())
.then(data => console.log('Updated:', data.item));
```

### DELETE /api/lore-manager?id=ID
**Delete lore item**
```javascript
fetch('/api/lore-manager?id=5', { method: 'DELETE' })
  .then(r => r.json())
  .then(data => console.log('Deleted'));
```

---

## Categories

| Category | Use For |
|----------|---------|
| `WNCORE_BROADCAST` | General WNCORE ticker items |
| `ANOMALY_REPORT` | Obsedia rain, weather events |
| `VARIANT_ALERT` | Zombie/Ghuul sightings |
| `SUPPLY_DROP` | Supply airdrop announcements |
| `FACTION_NEWS` | Updates from factions (Blood Pact, White Flag, etc) |
| `SIGNAL_INTERCEPT` | Frequency 88.7 transmissions |
| `BLANK_ZONE` | Blank Zone theories |
| `PLAYER_EVENT` | Custom story events |

---

## Integration Examples

### Ticker Auto-Updates
ticker.js automatically fetches from `/api/lore-manager` every 5 minutes.

**Manual refresh:**
```javascript
window.refreshTicker();  // in browser console
```

### Use in Broadcasts

```javascript
async function getBroadcastTopics() {
  const response = await fetch('/api/lore-manager?category=WNCORE_BROADCAST');
  const lore = await response.json();
  return lore.map(item => item.content);
}
```

### Event-Driven Lore Injection

```javascript
async function broadcastPlayerEvent(event) {
  const response = await fetch('/api/lore-manager', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      category: 'PLAYER_EVENT',
      content: `📢 PLAYER EVENT — ${event}`,
      author: 'System'
    })
  });
  const data = await response.json();
  console.log('Event broadcasted:', data.item.id);
}

// Usage:
broadcastPlayerEvent('A new survivor joined WNCORE channel');
```

---

## Supabase Setup

The lore system requires a Supabase table. Run this SQL:

```sql
CREATE TABLE lore_items (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  category VARCHAR(50) NOT NULL,
  content TEXT NOT NULL,
  author VARCHAR(100),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_lore_active ON lore_items(active);
CREATE INDEX idx_lore_category ON lore_items(category);
```

Enable RLS:
```sql
ALTER TABLE lore_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "read_active_lore" ON lore_items
  FOR SELECT USING (active = true);

CREATE POLICY "insert_lore" ON lore_items
  FOR INSERT WITH CHECK (true);
```

---

## Tips

1. **Add emoji prefixes** to lore content:
   - `⚠` for alerts
   - `📡` for signals
   - `❗` for critical
   - `☣` for variants
   - `❄` for weather
   - `📖` for bulletins
   - `🌑` for lunar events
   - `📻` for broadcasts

2. **Test in admin panel first** before bulk-adding lore

3. **Use `████` for redacted text** (common in WNCORE aesthetic)

4. **Keep under ~200 characters** for readability in ticker

---

---

# 2. NARRATOR AI SYSTEM

## Overview

The **Narrator AI** automatically generates thematic WNCORE broadcasts from chapter content. It reads your story and responds as the apocalypse narrator.

**Files**:
- `api/lore-generator.js` (9.2 KB) — AI engine using Gemini 2.0 Flash
- `lore-narrator-admin.html` (12 KB) — Web interface for generation/approval
- `NARRATOR-GUIDE.md` — Full guide

---

## What It Does

1. **Reads New Chapters** — You upload chapters to chapters.html
2. **Generates Broadcasts** — AI creates 2-3 thematic WNCORE broadcasts inspired by the chapter
3. **Review Queue** — Broadcasts await your approval before posting
4. **Auto-Posts** — Approved broadcasts go to ticker and chat

---

## System Architecture

### api/lore-generator.js
- Core AI engine using Gemini 2.0 Flash
- Reads chapter content
- Generates narrative broadcasts with world context
- Returns structured data with format/category
- Creates review queue entries

### lore-narrator-admin.html
- Web interface for managing generation and approvals
- 3 tabs: Generate, Review, History
- Shows pending broadcasts
- Approve/reject individual items

### Database: lore_review_queue table
```sql
CREATE TABLE lore_review_queue (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  chapter_id BIGINT,
  chapter_title TEXT,
  category TEXT,
  content TEXT,
  format TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## How to Use

### Step 1: Access the Interface
```
Open: /lore-narrator-admin.html
```

### Step 2: Generate from Chapter
1. Select a chapter from dropdown
2. Click **🤖 GENERATE LORE**
3. AI reads chapter and creates 2-3 broadcasts
4. Review queue auto-updates

### Step 3: Review & Approve
1. Go to **📋 REVIEW QUEUE** tab
2. Read each AI-generated broadcast
3. Click **✓ APPROVE** to add to ticker
4. Click **✗ REJECT** to discard

### Step 4: Monitor Active Lore
1. Go to **✓ APPROVED LORE** tab
2. See all narrative broadcasts currently in ticker
3. Ticker auto-refreshes and displays them

---

## Narrator Personality

The AI acts as **the apocalypse narrator** existing within Another Sky world.

**Characteristics**:
- Technical yet unsettling tone
- Dark poetry mixed with facts
- References specific world details (Ghuuls, Obsedia rain, Blank Zone)
- Brief 1-2 sentence broadcasts
- Maintains timeline (Another Sky 2032)
- Acts as witness to story events

**Example Outputs**:
```
⚠ SECTOR COLLAPSE — Another Sky Zone 7 now 89% contaminated. 
Last survivor log from Dr. Kline: "The rain tastes like copper. 
We're not immune. We're just... delayed."

📡 SIGNAL DETECTED — Frequency 88.7 intermittent. 
Your transmission 2011 loop fragment re-detected: 
"THEY'RE INSIDE THE SIGNAL NOW."

❗ GHUUL SIGHTING — Pack of 3+ confirmed in urban center. 
Movement pattern suggests coordinated hunting.
```

---

## Broadcast Formats

Generated broadcasts can be one of 5 types:

| Format | Icon | Use Case |
|--------|------|----------|
| BROADCAST | ⚠ ❗ 📡 | Urgent alerts, public warnings |
| SIGNAL | 🔊 | Frequency intercepts, decoded transmissions |
| SURVIVAL_LOG | 📝 | First-person witness testimony |
| WORLD_UPDATE | 🌍 | Environmental/social changes |
| MYSTERY | ❓ | Fragmentary clues, unsolved events |

---

## Configuration

### Required Environment Variables
```
GEMINI_API_KEY=your_gemini_2_key_here
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
```

### Optional Settings
- **AI Model**: Currently Gemini 2.0 Flash (can switch to `gemini-1.5-pro`)
- **Temperature**: 0.8 (creativity level, range 0-1)
- **Max Output Tokens**: 800

---

## API Reference

### Generate from Chapter
```bash
POST /api/lore-generator
Content-Type: application/json

{
  "action": "generate",
  "chapter": {
    "id": 12,
    "number": 5,
    "title": "Chapter Title",
    "content": "Chapter text goes here..."
  }
}

Response:
{
  "success": true,
  "generated_count": 2,
  "broadcasts": [
    {
      "format": "BROADCAST",
      "category": "WNCORE_BROADCAST",
      "content": "⚠ BROADCAST TEXT HERE"
    }
  ]
}
```

### Get Review Queue
```bash
GET /api/lore-generator

Response:
{
  "success": true,
  "items": [
    {
      "id": 1,
      "chapter_title": "...",
      "content": "...",
      "format": "BROADCAST",
      "status": "pending"
    }
  ]
}
```

### Approve Item
```bash
POST /api/lore-generator
{
  "action": "approve",
  "review_id": 1
}
```

### Reject Item
```bash
POST /api/lore-generator
{
  "action": "reject",
  "review_id": 1
}
```

---

## Customizing the Narrator

To change the narrator's personality, edit the `NARRATOR_SYSTEM` prompt in `api/lore-generator.js`:

**Examples of different voices**:
- **Archival AI**: "Records show this sector became uninhabitable on..."
- **Radio Operator**: "This is frequency 88.7. We have incoming..."
- **Survivor Journal**: "Day 847. The rain... it's getting worse..."
- **Corporate Report**: "WNCORE Status Report. Sector 7 containment at..."

---

## Troubleshooting

### "Generating..." stuck forever
- Check `GEMINI_API_KEY` is valid
- Check Supabase connection
- Check browser console for errors

### Broadcasts not appearing in ticker
- Make sure you **approved** the item
- Wait 5 minutes for ticker auto-refresh
- Manual refresh: Open browser console, run `window.refreshTicker()`

### Review queue is empty
- Generate lore from a chapter first
- Check status message for errors

### AI generating off-topic content
- Edit `NARRATOR_SYSTEM` to be more restrictive
- Consider reducing `temperature` (less creative)

---

---

# 3. SURVIVOR GAMES & MONETIZATION

## Overview

**`survivor-games.html`** is a unified gaming system combining 5 interconnected mystery games that reveal Another Sky lore and ARG secrets.

**`ads-config.js`** is a modular ad system — inject ads anywhere without editing HTML.

**Files**:
- `survivor-games.html` (18 KB) — All 5 games integrated
- `ads-config.js` (6.8 KB) — Monetization system
- `GAMES-MONETIZATION-SUMMARY.md` — Summary guide

---

## The 5 Games

### 1. SUPPLY RUN COORDINATOR 🎖️
- **Gameplay**: Choose sector (Dhaka, Tokyo, London, Alaska, Blank Zone, Moon Relay)
- **Risk Levels**: Low/Medium/High/Extreme
- **Team Size**: Solo/3/10 people
- **Outcome**: Random success/failure with lore story
- **ARG Value**: Different sectors unlock different narrative hints
- **Monetization**: Ad plays after mission complete

### 2. FREQUENCY DECODER 📻
- **Gameplay**: Tune to mystery frequencies (80–120 FM)
- **Encryption Types**: Base64, ROT13, Hexadecimal, Caesar cipher
- **Core Frequencies**:
  - **88.7 FM** → "0.315126 BLANK ZONE COORDINATES"
  - **91.3 FM** → "PRION THEORY ESTABLISHED SOURCE TRANSMITTING"
  - **99.9 FM** → "MOON DOME 2012 BEFORE WW3"
  - **103.5 FM** → "YOU ARE NOT HERE BELONG DIFFERENT TIME"
  - **107.1 FM** → "THIS IS NOT A WARNING IT IS PRIMING"
  - **88.5 FM** → "SIHARU COORDINATES SENT"
- **Hidden Frequencies**: 100+ to discover
- **ARG Value**: Each decode reveals classified intel
- **Monetization**: Ad plays after correct decode

### 3. SURVIVOR TESTIMONY ANALYZER 👁️
- **Gameplay**: Read witness account, spot lies, identify faction
- **Factions**: WNCORE, White Flag, Blood Pact, Moon Dwellers, Independent, Ghuul
- **Mechanics**: 
  - Identify faction affiliation (1 correct answer)
  - Spot hidden lies (multiple valid answers)
  - Uncover hidden knowledge (open-ended)
- **ARG Value**: Testimonies contradict each other, revealing truth
- **Monetization**: Ad plays after analysis complete

### 4. MEMORY RECONSTRUCTION 🧩
- **Gameplay**: Piece together fragmented memories of "The Nine"
- **Currently**: Placeholder (expanding in future)
- **Goal**: Players reconstruct who the 9 vanished people were
- **ARG Value**: Only Som remembers them — players help recover identity

### 5. FACTION INTELLIGENCE 🔍
- **Gameplay**: Cross-reference encrypted communications
- **Data Streams**: Supply logs, transmissions, personnel, resources, anomalies
- **Pattern Recognition**: Players spot inconsistencies
- **ARG Value**: WNCORE hiding something about "Subject S" and "transfer protocol"
- **Monetization**: Ad plays after analysis

---

## ARG Deep-Dive Features

### Hidden Complexity Layers

**Layer 1 (Surface)**: Players see 5 games, complete missions

**Layer 2 (Intermediate)**: Frequencies reveal coded messages (88.7, 91.3, etc)

**Layer 3 (Deep)**: Testimonies contradict => WNCORE hiding something

**Layer 4 (Expert)**: Cross-reference all data => "Subject S", "transfer protocol"

**Layer 5 (Obsidian)**: Meta-ARG clues in HTML comments, hidden frequencies 100+

### Frequency Expansion (100+ Possible)

Current frequencies (6): 88.7, 91.3, 99.9, 103.5, 107.1, 88.5

**Frequencies to add**:
- 85.2 → Blood Pact coordination
- 94.1 → Moon Dwellers encrypted
- 102.3 → Drifter network
- 110.5 → Government-only (requires decoder)
- 117.9 → Corrupted/glitching signal

### Red Herrings (Intentional)

- False frequencies (static only)
- Misinformation in chat
- Contradicting testimonies (intentional)
- Fake lore (planted by Bad Actors)

### Interconnected Rewards

- Solve decoder → unlock faction data
- Complete testimony → decode message
- Finish supply run → find clue about "The Nine"

---

## Ad System Architecture

### How It Works

**`ads-config.js`** provides:
1. **Centralized config** — Define all ads in one file
2. **Placement system** — Mark ad spots without touching HTML
3. **Multiple networks** — AdSense, custom ads, or placeholder
4. **Frequency limits** — Avoid ad fatigue
5. **Analytics tracking** — Monitor impressions/clicks

### Add Ad Placements to ANY File

**Option 1: Add HTML div with ID**
```html
<div id="ad-your-placement"></div>
```

**Option 2: Call injection in JavaScript**
```javascript
window.injectAdPlacement('your-placement', '#target-selector');
```

**Option 3: Auto-inject after game**
```javascript
window.adEngine.showGameRewardAd();
```

### Configure in ads-config.js

```javascript
placements: {
  'your-placement': {
    type: 'banner',        // banner, sidebar, interstitial, video, sticky
    size: '728x90',        // dimensions
    location: 'description',
    enabled: true,
  },
}
```

### Add Custom Ads

```javascript
customAds: [
  {
    id: 'custom-ad-1',
    type: 'html',  // or 'image'
    content: '<div>Your ad HTML</div>',
    placements: ['after-games', 'sidebar-games'],
  }
]
```

### Enable Google AdSense

```javascript
adsense: {
  clientId: 'ca-pub-xxxxxxxxxxxxxxxx',
  enabled: true,
}
```

---

## Implementation Guide

### Step 1: Include Both Files

```html
<script src="ads-config.js"></script>
<script src="survivor-games.js"></script> <!-- If separated -->
```

### Step 2: Configure Ads

Edit `ads-config.js`:
```javascript
ADS_CONFIG.enabled = true;
ADS_CONFIG.network = 'custom'; // or 'adsense'
ADS_CONFIG.customAds = [...]; // Your ads
```

### Step 3: Add Placements to Your HTML

Every file that wants ads:
```html
<!-- At top -->
<div id="ad-hero-banner"></div>

<!-- After content -->
<div id="ad-sidebar-games"></div>

<!-- After gameplay -->
<div id="ad-after-games"></div>
```

### Step 4: Trigger Ads in JavaScript

```javascript
// After game complete
window.adEngine.showAd('after-games');

// Manual placement
window.injectAdPlacement('hero-banner');

// Track custom events
window.adEngine.trackClick('my-placement');
```

---

## Extending the Games

### Add New Frequency
Edit `ENCRYPTED_FREQUENCIES` in HTML:
```javascript
104.2: {
  message: 'BASE64_ENCODED_MESSAGE',
  decoded: 'DECODED MESSAGE',
  hint: 'Cipher type hint',
}
```

### Add Supply Sector
Edit `outcomes` in `executeSupplyRun()`:
```javascript
'sector-name': {
  low: { success: 0.8, loot: '...', story: '...' },
  // etc
}
```

### Add Testimony
Add to `TESTIMONIES` array:
```javascript
{
  text: 'Witness account...',
  faction: 'faction-name',
  lies: ['lie1', 'lie2'],
  hidden: 'Hidden knowledge',
}
```

---

## Analytics & Monetization

Track player behavior:
```javascript
ADS_CONFIG.tracking.enabled = true;
ADS_CONFIG.tracking.reportUrl = '/api/ad-analytics';
```

Metrics collected:
- Impressions per placement
- Click-through rate (CTR)
- Frequency limits respected
- User engagement time

---

---

# 4. UX ENHANCEMENTS

## Overview

Complete UI/UX enhancement package with page flip animations, global theming, moon element, and integrated globe.

**Files**:
- `global-theme.js` (NEW, 130 lines) — Global theme management
- `moon.js` (NEW, 140 lines) — Moon SVG visualization

---

## Completed Features

### 1️⃣ PAGE FLIP ANIMATION

- **Location**: `chapters.html`
- **Trigger**: When switching between "Another Sky" ↔ "Simulunas" in sidebar
- **Effect**: 3D perspective rotation flip with 0.6s duration
- **Animation Directions**:
  - Another Sky → Simulunas: Rotates 90° right
  - Simulunas → Another Sky: Rotates 90° left
- **Code Location**: 
  - CSS: `chapters.html` lines ~230–260 (@keyframes pageFlip, pageFlipReverse)
  - JavaScript: `triggerPageFlip()` function + modified `switchStory()` function
  - Requires: `lastStoryId` state variable

**Usage**: Automatic on story selection

---

### 2️⃣ GLOBAL DARK/LIGHT MODE TOGGLE

- **File**: `global-theme.js` (NEW, 130 lines)
- **Features**:
  - Single symbol toggle (◐ dark, ● light) — consistent across all pages
  - Shared `site_theme` localStorage key for cross-page persistence
  - Auto-detects previous user preference on page load
  - Responds to theme changes from other browser tabs/windows
  - Graceful fallback if button doesn't exist in HTML

**Implementation**: Added to all HTML files:
- ✅ `index.html`
- ✅ `chapters.html` (replaced old Sepia toggle)
- ✅ `stories.html`
- ✅ `survivor-games.html`
- ✅ `lore-admin-panel.html`
- ✅ `lore-narrator-admin.html`
- ✅ `gallery.html`

**CSS Classes Applied**:
- `.site-light` added to `body` in light mode

**localStorage Key**: `site_theme` (`'dark'` or `'light'`)

---

### 3️⃣ MOON ELEMENT

- **File**: `moon.js` (NEW, 140 lines)
- **Visual**:
  - 60px SVG moon with realistic gradient
  - Positioned top-left fixed position
  - Crater details for depth
  - Drop shadow glow effect (theme-aware)
  - Animated gentle float effect (sin wave on Y-axis)

**Theme Integration**:
- Light mode: Brighter white moon with cyan glow
- Dark mode: Warm cream moon with red glow
- Automatically updates when theme changes

**Placement**: Fixed position top-left (z-index: 998)

**Implementation**: Added to all HTML files

---

### 4️⃣ GLOBE + MOON IN CHAPTERS.HTML

- **Previously**: `index.html` only had `currentnews-globe.js`
- **Now**: Added to `chapters.html` alongside moon
- **Result**: Chapters page now has identical celestial interface to index page

---

## Files Modified/Created

| File | Status | Changes |
|------|--------|---------|
| `global-theme.js` | ✨ NEW | Global theme management (130 lines) |
| `moon.js` | ✨ NEW | Moon SVG visualization (140 lines) |
| `chapters.html` | 🔧 MODIFIED | Added page flip CSS + animation function; added script tags |
| `index.html` | 🔧 MODIFIED | Added moon.js and global-theme.js script tags |
| `stories.html` | 🔧 MODIFIED | Added moon.js and global-theme.js script tags |
| `survivor-games.html` | 🔧 MODIFIED | Added moon.js and global-theme.js script tags |
| `lore-admin-panel.html` | 🔧 MODIFIED | Added moon.js and global-theme.js script tags |
| `lore-narrator-admin.html` | 🔧 MODIFIED | Added moon.js and global-theme.js script tags |
| `gallery.html` | 🔧 MODIFIED | Added moon.js and global-theme.js script tags |

---

## Visual Hierarchy

**Top-Left Fixed Elements** (z-index layering):
1. **Moon** (z-index: 998) — Celestial guidance
2. **Theme Toggle** (z-index: 999) — User control
3. **Content** — Below

**Top-Right Fixed Elements**:
- Globe (via `currentnews-globe.js`) — News/world awareness

---

## Technical Notes

**localStorage Keys Used**:
- `site_theme` — Shared global theme preference (new, replaces old system)
- `ch_prefs` — Chapters page local settings (unchanged)
- `stories_theme` — Stories page theme (unchanged but now overridden by global)

**CSS Animation Performance**:
- Uses GPU-accelerated 3D transforms (`perspective`, `rotateY`, `rotateX`)
- Smooth 0.6s easing-in-out timing function
- No JavaScript animation loop (hardware optimized)

**Theme System Priority**:
1. Check localStorage for `site_theme`
2. Default to `'dark'` if not found
3. Apply `.site-light` class to enable light mode CSS rules
4. Listen for cross-tab storage events for real-time sync

---

## Testing Checklist

- [ ] **Page Flip Animation**
  - [ ] Click "SIMULUNAS" in chapters.html sidebar — page flips right
  - [ ] Click "ANOTHER SKY" — page flips left
  - [ ] Animation is smooth (0.6s duration)
  - [ ] Content updates after flip completes

- [ ] **Global Theme Toggle**
  - [ ] Click theme button (◐/●) on any page
  - [ ] Entire page theme changes instantly
  - [ ] Navigate to different page — theme persists
  - [ ] Open new tab to any page — theme matches
  - [ ] Close browser, reopen — theme remembered
  - [ ] Both dark (◐) and light (●) modes work

- [ ] **Moon Element**
  - [ ] Moon visible in top-left of all pages
  - [ ] Moon glow is red in dark mode, cyan in light mode
  - [ ] Moon gently floats (smooth up/down motion)
  - [ ] Moon positioned correctly (not overlapping content)
  - [ ] Moon persists across all page navigation

- [ ] **Globe + Moon Together**
  - [ ] Both celestial elements visible on chapters.html
  - [ ] Moon (left) + Globe (right) don't overlap
  - [ ] Both visible in index.html simultaneously
  - [ ] Both visible in stories.html simultaneously

---

## Future Enhancement Ideas

1. **Moon interactivity** — Click moon to show Moon Dome lore details
2. **Globe interactivity** — Click globe to expand news ticker to world map
3. **Theme auto-switch** — Detect system preference (prefers-color-scheme)
4. **Animated transitions** — Fade between themes instead of instant
5. **Theme animations** — Moon and globe react to theme switches
6. **Mobile optimizations** — Adjust moon/theme button positioning for mobile

---

---

# 5. DEPLOYMENT CHECKLIST

## Delete These Files
(Already removed locally, delete from GitHub)

```
stories-redesign.css
ticker-fix.css
gallery.js
stories.js
audio.js
currentnews-globe.js
server.js
google6186a73e2377e14f.html
chapters-admin.js
```

---

## New Files to Add
(Copy these directly to repo)

### Core Lore System
```
api/lore-manager.js
lore-admin-panel.html
```

### Narrator AI System ⭐
```
api/lore-generator.js
lore-narrator-admin.html
```

### Game & Monetization System 🎮💰
```
survivor-games.html
ads-config.js
```

### UX Enhancements
```
global-theme.js
moon.js
```

---

## Modified Files to Update
(Replace these in repo)

```
ticker.js
index.html
chapters.html
stories.html
survivor-games.html
lore-admin-panel.html
lore-narrator-admin.html
gallery.html
```

---

## Before Pushing

### 1. Create Supabase Tables
Run in Supabase SQL editor:

```sql
-- Lore Manager Table
CREATE TABLE lore_items (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  category TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_lore_active ON lore_items(active);
CREATE INDEX idx_lore_category ON lore_items(category);

-- Narrator Review Queue Table
CREATE TABLE lore_review_queue (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  chapter_id BIGINT,
  chapter_title TEXT,
  category TEXT,
  content TEXT,
  format TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 2. Add Environment Variables
In Vercel/deployment settings:

```
SUPABASE_URL = https://your-project.supabase.co
SUPABASE_ANON_KEY = your_anon_key_here
GEMINI_API_KEY = your_gemini_api_key_here
```

---

## File Status

| File | Action | Status |
|------|--------|--------|
| `api/lore-manager.js` | ADD | ✅ Ready |
| `api/lore-generator.js` | ADD | ✅ Ready |
| `survivor-games.html` | ADD | ✅ Ready |
| `ads-config.js` | ADD | ✅ Ready |
| `lore-admin-panel.html` | ADD | ✅ Ready |
| `lore-narrator-admin.html` | ADD | ✅ Ready |
| `global-theme.js` | ADD | ✅ Ready |
| `moon.js` | ADD | ✅ Ready |
| `ticker.js` | UPDATE | ✅ Ready |
| `index.html` | UPDATE | ✅ Ready |
| `chapters.html` | UPDATE | ✅ Ready |
| `stories.html` | UPDATE | ✅ Ready |
| `survivor-games.html` | UPDATE | ✅ Ready |
| `lore-admin-panel.html` | UPDATE | ✅ Ready |
| `lore-narrator-admin.html` | UPDATE | ✅ Ready |
| `gallery.html` | UPDATE | ✅ Ready |

---

## Login Credentials
(Same for both chapters.html & lore-admin-panel.html)

- Username: `theMainauthor345`
- Password: `illgetoutofthisworld275745397`

---

## Test Checklist

### Lore Manager (Manual Admin)
- [ ] Login to lore-admin-panel.html with credentials
- [ ] Add a test lore item
- [ ] Ticker updates within 5 minutes
- [ ] Toggle/delete lore items work
- [ ] Refresh ticker manually (console: `window.refreshTicker()`)
- [ ] Logout works properly
- [ ] Session persists after page refresh

### Narrator AI (Auto-Generation)
- [ ] Open lore-narrator-admin.html
- [ ] Select a chapter and click "GENERATE LORE"
- [ ] AI generates 2-3 broadcasts (wait 5-10 seconds)
- [ ] Review queue shows generated items
- [ ] Click "APPROVE" on a broadcast
- [ ] Item moves to "APPROVED LORE" tab
- [ ] Broadcast appears in ticker within 5 minutes

### Survivor Games & Monetization
- [ ] Open survivor-games.html
- [ ] Play Supply Run Coordinator mission (all risk levels)
- [ ] Play Frequency Decoder (try frequencies 88.7, 91.3, 99.9, 103.5, 107.1, 88.5)
- [ ] Play Survivor Testimony Analyzer (detect faction + lies)
- [ ] Verify ad placements appear after gameplay
- [ ] Check ads-config.js is being loaded (console: `window.adEngine`)
- [ ] Test custom ad injection via `window.injectAdPlacement()`
- [ ] Verify ad frequency limits work (no more than 4 banners/hour)

### UX Enhancements
- [ ] Page flip animation works in chapters.html
- [ ] Global theme toggle affects all pages
- [ ] Moon visible and properly styled on all pages
- [ ] Globe visible in chapters.html

### Overall
- [ ] Ticker displays in index.html in correct position
- [ ] Both manual and AI-generated lore show in ticker
- [ ] Games are fully playable without errors
- [ ] Ad system doesn't block content
- [ ] No console errors

---

## Ready to Push When:

✅ All files added (lore, narrator, games, monetization, UX)  
✅ All files updated (ticker.js, all HTML files)  
✅ 9 old files deleted from repo  
✅ **2 Supabase tables created** (lore_items + lore_review_queue)  
✅ Environment variables set in deployment  
✅ Ads configured in ads-config.js  
✅ All tests pass (lore, AI, games, ads, UX)  

---

**Last Updated**: Documentation consolidated  
**Status**: ✅ PRODUCTION READY
