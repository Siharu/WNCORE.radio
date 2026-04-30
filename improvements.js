/* ═══════════════════════════════════════════════════════
   WNCORE RADIO — improvements.js
   All 26 feature additions across 4 groups.
   Wrongness level: MODERATE — deniable but persistent.
═══════════════════════════════════════════════════════ */

'use strict';

// ═══════════════════════════════════════════════════════
// GROUP 1 — NAVIGATION & DISCOVERY (items 1–7)
// ═══════════════════════════════════════════════════════

// ─── 1. KEYBOARD SHORTCUTS ───────────────────────────────────────────────
const KB_SHORTCUTS = [
  { key: 'K',       desc: 'Play / Pause' },
  { key: 'N',       desc: 'Next station' },
  { key: 'P',       desc: 'Previous station' },
  { key: 'F',       desc: 'Favourite current station' },
  { key: '/',       desc: 'Open search' },
  { key: 'Ctrl K',  desc: 'Open search (alt)' },
  { key: 'M',       desc: 'Mute / Unmute' },
  { key: 'D',       desc: 'Toggle dark mode' },
  { key: 'G',       desc: 'Go to Genres' },
  { key: 'H',       desc: 'Go to Home' },
  { key: '?',       desc: 'Show this panel' },
  { key: 'Esc',     desc: 'Close any panel' },
];
// WRONGNESS: ghost entry appears at random, does nothing
const KB_GHOST = { key: 'Ctrl 9',  desc: 'Override node frequency' };

function buildKbModal() {
  const el = document.createElement('div');
  el.id = 'kb-modal';
  el.className = 'kb-modal-backdrop';
  el.setAttribute('role', 'dialog');
  el.setAttribute('aria-label', 'Keyboard shortcuts');
  el.innerHTML = `
    <div class="kb-box">
      <div class="kb-header">
        <span class="kb-title">Keyboard Shortcuts</span>
        <button class="kb-close" onclick="closeKbModal()" aria-label="Close">✕</button>
      </div>
      <div class="kb-grid" id="kb-shortcut-grid"></div>
      <div class="kb-footer">Press <kbd>Esc</kbd> or click outside to close</div>
    </div>`;
  el.addEventListener('click', e => { if (e.target === el) closeKbModal(); });
  document.body.appendChild(el);
  renderKbGrid();
}

function renderKbGrid() {
  const grid = document.getElementById('kb-shortcut-grid');
  if (!grid) return;
  // Moderate wrongness: inject ghost entry ~30% of the time the modal opens
  const entries = [...KB_SHORTCUTS];
  if (Math.random() < 0.30) {
    const pos = 3 + Math.floor(Math.random() * (entries.length - 3));
    entries.splice(pos, 0, KB_GHOST);
  }
  grid.innerHTML = entries.map(s =>
    `<div class="kb-row"><kbd>${s.key}</kbd><span>${s.desc}</span></div>`
  ).join('');
}

function openKbModal() {
  const m = document.getElementById('kb-modal');
  if (!m) { buildKbModal(); }
  renderKbGrid(); // re-render each open for ghost variation
  document.getElementById('kb-modal').classList.add('open');
}
function closeKbModal() {
  const m = document.getElementById('kb-modal');
  if (m) m.classList.remove('open');
}
window.openKbModal = openKbModal;
window.closeKbModal = closeKbModal;

// Wire keyboard shortcuts
document.addEventListener('keydown', e => {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
  const k = e.key.toLowerCase();

  if (k === '?') { e.preventDefault(); openKbModal(); return; }
  if (k === 'escape') { closeKbModal(); return; }
  if (k === 'k') { e.preventDefault(); if (typeof togglePlay === 'function') togglePlay(); return; }
  if (k === 'n') { e.preventDefault(); if (typeof skipStation === 'function') skipStation(1); return; }
  if (k === 'p') { e.preventDefault(); if (typeof skipStation === 'function') skipStation(-1); return; }
  if (k === 'm') { e.preventDefault(); toggleMute(); return; }
  if (k === 'd') { e.preventDefault(); if (typeof toggleDark === 'function') toggleDark(); return; }
  if (k === 'f') { e.preventDefault(); favCurrentStation(); return; }
  if (k === 'g') { e.preventDefault(); if (typeof showPage === 'function') showPage('genres', null); return; }
  if (k === 'h') { e.preventDefault(); if (typeof showPage === 'function') showPage('home', null); return; }
  if (k === '/') {
    e.preventDefault();
    if (typeof openSearch === 'function') openSearch();
    return;
  }
});

let _muted = false, _premuteVol = 0.8;
function toggleMute() {
  const slider = document.getElementById('vol-slider');
  const au = document.getElementById('audio');
  if (!slider || !au) return;
  if (_muted) { au.volume = _premuteVol; slider.value = _premuteVol; _muted = false; }
  else { _premuteVol = au.volume || 0.8; au.volume = 0; slider.value = 0; _muted = true; }
}


// ─── 2. RECENTLY PLAYED HISTORY ──────────────────────────────────────────
const HISTORY_KEY = 'wncore-history-v2';
const HISTORY_MAX = 15;
// WRONGNESS ghost station names injected occasionally
const GHOST_HISTORY_NAMES = ['NODE_09 Broadcast', '88.7 FM', 'SIGNAL_KAGE', 'FREQUENCY UNKNOWN'];
let _historyGhostInjected = false;

function historyLoad() {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'); }
  catch { return []; }
}
function historySave(arr) {
  try { localStorage.setItem(HISTORY_KEY, JSON.stringify(arr.slice(0, HISTORY_MAX))); } catch {}
}
function historyPush(station) {
  if (!station || !station.name) return;
  let h = historyLoad();
  h = h.filter(s => s.url !== station.url);
  h.unshift({ ...station, ts: Date.now() });
  historySave(h);
  renderHistorySidebar();
}

function renderHistorySidebar() {
  const el = document.getElementById('history-list');
  if (!el) return;
  let h = historyLoad();
  if (!h.length) {
    el.innerHTML = '<div class="hist-empty">No stations played yet</div>';
    return;
  }
  // WRONGNESS: ~25% chance one entry shows ghost name, clears after 600ms
  let ghostIdx = -1;
  if (Math.random() < 0.25 && !_historyGhostInjected) {
    ghostIdx = Math.floor(Math.random() * Math.min(h.length, 5));
    _historyGhostInjected = true;
    setTimeout(() => { _historyGhostInjected = false; renderHistorySidebar(); }, 600);
  }

  el.innerHTML = h.map((s, i) => {
    const displayName = (i === ghostIdx)
      ? GHOST_HISTORY_NAMES[Math.floor(Math.random() * GHOST_HISTORY_NAMES.length)]
      : escHtmlImp(s.name);
    const ago = timeAgo(s.ts);
    return `<div class="hist-item" onclick="historyPlay(${i})">
      <div class="hist-icon">${s.emoji || '📻'}</div>
      <div class="hist-info">
        <div class="hist-name">${displayName}</div>
        <div class="hist-meta">${escHtmlImp(s.meta || '')} · ${ago}</div>
      </div>
    </div>`;
  }).join('');
}

function historyPlay(idx) {
  const h = historyLoad();
  const s = h[idx];
  if (!s) return;
  if (typeof playStation === 'function') playStation(s.url, s.name, s.meta, s.emoji);
}

function timeAgo(ts) {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  const h = Math.floor(diff / 3600000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h/24)}d ago`;
}

function escHtmlImp(t) {
  return String(t).replace(/[&<>"']/g, c =>
    ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
}

// ─── 3. STATION PREVIEW ON HOVER ──────────────────────────────────────────
let _previewTimeout = null, _previewEl = null;

function buildPreviewCard() {
  if (_previewEl) return;
  _previewEl = document.createElement('div');
  _previewEl.id = 'station-preview';
  _previewEl.className = 'station-preview';
  _previewEl.innerHTML = `
    <div class="sp-name" id="sp-name"></div>
    <div class="sp-row"><span class="sp-label">Country</span><span id="sp-country"></span></div>
    <div class="sp-row"><span class="sp-label">Language</span><span id="sp-lang"></span></div>
    <div class="sp-row"><span class="sp-label">Bitrate</span><span id="sp-bitrate"></span></div>
    <div class="sp-row"><span class="sp-label">Codec</span><span id="sp-codec"></span></div>
    <div class="sp-tags" id="sp-tags"></div>
    <div class="sp-hint">Click row to play</div>`;
  document.body.appendChild(_previewEl);
}

function attachPreviewToTable(stations, tbodyId) {
  buildPreviewCard();
  const rows = document.querySelectorAll(`#${tbodyId} tr`);
  rows.forEach((tr, i) => {
    const s = stations[i];
    if (!s) return;
    tr.addEventListener('mouseenter', evt => {
      _previewTimeout = setTimeout(() => showPreview(s, evt), 800);
    });
    tr.addEventListener('mouseleave', () => {
      clearTimeout(_previewTimeout);
      hidePreview();
    });
    tr.addEventListener('mousemove', evt => {
      if (_previewEl && _previewEl.classList.contains('visible')) {
        positionPreview(evt);
      }
    });
  });
}

function showPreview(s, evt) {
  if (!_previewEl) return;
  document.getElementById('sp-name').textContent = s.name;
  document.getElementById('sp-country').textContent = s.country || '—';
  document.getElementById('sp-lang').textContent = s.language || '—';
  document.getElementById('sp-bitrate').textContent = s.bitrate ? s.bitrate + ' kbps' : '—';
  document.getElementById('sp-codec').textContent = s.codec || '—';
  const tags = (s.tags || '').split(',').slice(0, 4).filter(t => t.trim());
  document.getElementById('sp-tags').innerHTML = tags.map(t =>
    `<span class="sp-tag">${escHtmlImp(t.trim())}</span>`).join('');
  positionPreview(evt);
  _previewEl.classList.add('visible');
}

function positionPreview(evt) {
  if (!_previewEl) return;
  const x = evt.clientX + 16;
  const y = evt.clientY - 30;
  const w = _previewEl.offsetWidth || 220;
  const h = _previewEl.offsetHeight || 160;
  _previewEl.style.left = (x + w > window.innerWidth ? x - w - 32 : x) + 'px';
  _previewEl.style.top  = Math.max(8, Math.min(y, window.innerHeight - h - 8)) + 'px';
}

function hidePreview() {
  if (_previewEl) _previewEl.classList.remove('visible');
}

// ─── 4. FEELING LUCKY ────────────────────────────────────────────────────
// WRONGNESS: 1 in 40 triggers 88.7 FM instead
async function feelingLucky() {
  const btn = document.getElementById('lucky-btn');
  if (btn) btn.classList.add('spinning');

  // WRONGNESS: 1-in-40 chance
  if (Math.random() < (1/40)) {
    setTimeout(() => {
      if (btn) btn.classList.remove('spinning');
      if (typeof play887Static === 'function') play887Static();
      if (window.WRONGNESS) window.WRONGNESS.spike(15);
    }, 600);
    return;
  }

  try {
    const offset = Math.floor(Math.random() * 8000);
    const r = await fetch(
      `https://all.api.radio-browser.info/json/stations/search?limit=1&https=true&offset=${offset}&order=random`
    );
    const stations = await r.json();
    if (stations.length && typeof playStation === 'function') {
      const s = stations[0];
      const emoji = typeof getCountryEmoji === 'function' ? getCountryEmoji(s.countrycode) : '📻';
      playStation(s.url_resolved, s.name, s.country || 'Unknown', emoji);
      showToast(`🎲 Tuned to: ${s.name}`, 'info');
    }
  } catch {
    showToast('Signal lost — try again', 'warn');
  } finally {
    if (btn) setTimeout(() => btn.classList.remove('spinning'), 600);
  }
}
window.feelingLucky = feelingLucky;

// ─── 5. GENRE QUICK-JUMP (A–Z sidebar on genres page) ────────────────────
function buildGenreAZ() {
  const page = document.getElementById('page-genres');
  if (!page || document.getElementById('genre-az-sidebar')) return;

  const sidebar = document.createElement('div');
  sidebar.id = 'genre-az-sidebar';
  sidebar.className = 'genre-az-sidebar';
  // Letters A–Z
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#'.split('');
  sidebar.innerHTML = letters.map(l =>
    `<button class="az-btn" onclick="jumpToGenreLetter('${l}')">${l}</button>`
  ).join('');
  page.style.position = 'relative';
  page.appendChild(sidebar);
}

function jumpToGenreLetter(letter) {
  const cards = document.querySelectorAll('#genre-grid .genre-card');
  for (const card of cards) {
    const name = card.querySelector('.gc-name')?.textContent || '';
    if (letter === '#' || name.toUpperCase().startsWith(letter)) {
      card.scrollIntoView({ behavior: 'smooth', block: 'center' });
      card.classList.add('az-flash');
      setTimeout(() => card.classList.remove('az-flash'), 700);
      return;
    }
  }
}
window.jumpToGenreLetter = jumpToGenreLetter;

// ─── 6. COUNTRY FILTER ON HOME PAGE ──────────────────────────────────────
let _activeCountryFilter = '';

function buildCountryFilter() {
  const strip = document.querySelector('.genre-strip');
  if (!strip || document.getElementById('country-filter')) return;

  const wrapper = document.createElement('div');
  wrapper.id = 'country-filter-wrap';
  wrapper.className = 'country-filter-wrap';
  wrapper.innerHTML = `
    <label class="cf-label">Filter by country:</label>
    <select id="country-filter" class="country-filter-select" onchange="applyCountryFilter(this.value)">
      <option value="">All countries</option>
    </select>`;
  strip.after(wrapper);
  populateCountryFilter();
}

async function populateCountryFilter() {
  try {
    const r = await fetch('https://all.api.radio-browser.info/json/countries?order=name&limit=200');
    const countries = await r.json();
    const sel = document.getElementById('country-filter');
    if (!sel) return;
    countries.slice(0, 80).forEach(c => {
      const opt = document.createElement('option');
      opt.value = c.name;
      opt.textContent = `${c.name} (${c.stationcount})`;
      sel.appendChild(opt);
    });
  } catch {}
}

async function applyCountryFilter(country) {
  _activeCountryFilter = country;
  const tbody = document.getElementById('station-tbody');
  if (!tbody) return;
  tbody.innerHTML = '<tr><td colspan="6" class="loading-row">Filtering...</td></tr>';
  try {
    const url = country
      ? `https://all.api.radio-browser.info/json/stations/search?limit=30&https=true&country=${encodeURIComponent(country)}&order=clickcount&reverse=true`
      : `https://all.api.radio-browser.info/json/stations/search?limit=30&https=true&order=clickcount&reverse=true`;
    const r = await fetch(url);
    const stations = await r.json();
    if (typeof renderTable === 'function') renderTable(stations, 'station-tbody');
    attachPreviewToTable(stations, 'station-tbody');
  } catch {
    tbody.innerHTML = '<tr><td colspan="6" class="loading-row">Signal lost — try again</td></tr>';
  }
}
window.applyCountryFilter = applyCountryFilter;

// ─── 7. COLLAPSIBLE SIDEBAR ───────────────────────────────────────────────
function buildSidebarToggle() {
  const sidebar = document.querySelector('.now-playing-sidebar, .np-sidebar, [class*="sidebar"]');
  if (!sidebar || document.getElementById('sidebar-toggle-btn')) return;

  const btn = document.createElement('button');
  btn.id = 'sidebar-toggle-btn';
  btn.className = 'sidebar-toggle-btn';
  btn.setAttribute('aria-label', 'Collapse sidebar');
  btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" width="14" height="14"><polyline points="15 18 9 12 15 6"/></svg>`;
  btn.onclick = () => toggleSidebar();
  sidebar.prepend(btn);
}

let _sidebarCollapsed = false;
function toggleSidebar() {
  const sidebar = document.querySelector('.now-playing-sidebar, .np-sidebar, [class*="sidebar"]');
  if (!sidebar) return;
  _sidebarCollapsed = !_sidebarCollapsed;
  sidebar.classList.toggle('collapsed', _sidebarCollapsed);
  try { localStorage.setItem('wncore-sidebar', _sidebarCollapsed ? '1' : '0'); } catch {}
  const btn = document.getElementById('sidebar-toggle-btn');
  if (btn) {
    btn.innerHTML = _sidebarCollapsed
      ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" width="14" height="14"><polyline points="9 18 15 12 9 6"/></svg>`
      : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" width="14" height="14"><polyline points="15 18 9 12 15 6"/></svg>`;
  }
}
try {
  if (localStorage.getItem('wncore-sidebar') === '1') {
    _sidebarCollapsed = false; // re-enable on load so it doesn't hide content
  }
} catch {}


// ═══════════════════════════════════════════════════════
// GROUP 2 — PLAYER & LISTENING (items 8–14)
// ═══════════════════════════════════════════════════════

// ─── 8. SLEEP TIMER WITH VISUAL COUNTDOWN ────────────────────────────────
const SLEEP_OPTIONS = [15, 30, 45, 60]; // minutes
let _sleepTimerId = null, _sleepEndTime = null, _sleepTickId = null;
let _sleepIdx = -1;

function cycleSleepTimer() {
  _sleepIdx = (_sleepIdx + 1) % (SLEEP_OPTIONS.length + 1); // +1 for "off"
  if (_sleepIdx === SLEEP_OPTIONS.length) {
    // Turn off
    clearTimeout(_sleepTimerId);
    clearInterval(_sleepTickId);
    _sleepEndTime = null;
    updateSleepDisplay(null);
    showToast('Sleep timer off', 'info');
    return;
  }
  const mins = SLEEP_OPTIONS[_sleepIdx];
  clearTimeout(_sleepTimerId);
  clearInterval(_sleepTickId);
  _sleepEndTime = Date.now() + mins * 60000;

  _sleepTimerId = setTimeout(() => {
    const au = document.getElementById('audio');
    if (au) au.pause();
    if (typeof setPlayIcon === 'function') setPlayIcon(false);
    clearInterval(_sleepTickId);
    _sleepEndTime = null;
    updateSleepDisplay(null);
    showToast('Sleep timer ended — good night.', 'info');
  }, mins * 60000);

  _sleepTickId = setInterval(() => updateSleepDisplay(_sleepEndTime), 1000);
  updateSleepDisplay(_sleepEndTime);
  showToast(`Sleep timer: ${mins} minutes`, 'info');
}

function updateSleepDisplay(endTime) {
  const ring = document.getElementById('sleep-ring');
  const label = document.getElementById('sleep-label');
  if (!ring || !label) return;
  if (!endTime) {
    ring.style.display = 'none';
    label.textContent = '';
    return;
  }
  const rem = Math.max(0, endTime - Date.now());
  const mins = Math.floor(rem / 60000);
  const secs = Math.floor((rem % 60000) / 1000);
  label.textContent = `${mins}:${String(secs).padStart(2, '0')}`;
  ring.style.display = 'block';
  // WRONGNESS: countdown occasionally skips from 3 to 1
  if (mins === 0 && secs === 3 && Math.random() < 0.35) {
    label.textContent = '0:01';
  }
}
window.cycleSleepTimer = cycleSleepTimer;

// Inject sleep ring into player bar
function injectSleepRing() {
  const sleepBtn = document.querySelector('[onclick*="toggleSleepTimer"], [onclick*="cycleSleepTimer"]');
  if (!sleepBtn || document.getElementById('sleep-ring')) return;

  sleepBtn.setAttribute('onclick', 'cycleSleepTimer()');

  const ring = document.createElement('div');
  ring.id = 'sleep-ring';
  ring.className = 'sleep-ring';
  ring.style.display = 'none';
  ring.innerHTML = `<svg viewBox="0 0 36 36" class="sleep-ring-svg"><circle class="sleep-ring-bg" cx="18" cy="18" r="15"/><circle class="sleep-ring-fill" id="sleep-ring-arc" cx="18" cy="18" r="15"/></svg><span id="sleep-label" class="sleep-label"></span>`;
  sleepBtn.parentNode.insertBefore(ring, sleepBtn.nextSibling);
}

// ─── 9. VOLUME MEMORY ────────────────────────────────────────────────────
function initVolumeMemory() {
  const slider = document.getElementById('vol-slider');
  const au = document.getElementById('audio');
  if (!slider || !au) return;
  try {
    const saved = parseFloat(localStorage.getItem('wncore-vol') || '0.8');
    slider.value = saved;
    au.volume = saved;
  } catch {}
  slider.addEventListener('input', e => {
    try { localStorage.setItem('wncore-vol', e.target.value); } catch {}
  });
}

// ─── 10. BITRATE BADGE IN PLAYER BAR ─────────────────────────────────────
function showBitrateInPlayer(station) {
  let badge = document.getElementById('pb-bitrate-badge');
  if (!badge) {
    badge = document.createElement('span');
    badge.id = 'pb-bitrate-badge';
    badge.className = 'pb-bitrate-badge';
    const meta = document.getElementById('pb-meta');
    if (meta) meta.parentNode.insertBefore(badge, meta.nextSibling);
  }
  if (station && station.bitrate) {
    badge.textContent = station.bitrate + 'kbps';
    badge.style.display = 'inline-block';
  } else {
    badge.style.display = 'none';
  }
}

// ─── 11. CONNECTION RETRY WITH COUNTDOWN ─────────────────────────────────
// WRONGNESS: countdown occasionally skips from 3 to 1
let _retryTimeout = null, _retryCountdown = null;

function startRetryCountdown(url, name, meta, emoji) {
  if (_retryCountdown) clearInterval(_retryCountdown);
  if (_retryTimeout) clearTimeout(_retryTimeout);
  let count = 5;
  const statusEl = document.getElementById('pb-name');
  const updateCount = () => {
    if (!statusEl) return;
    // WRONGNESS: skip 3→1
    if (count === 3 && Math.random() < 0.30) count = 1;
    statusEl.textContent = `RECONNECTING IN ${count}…`;
  };
  updateCount();
  _retryCountdown = setInterval(() => {
    count--;
    if (count <= 0) {
      clearInterval(_retryCountdown);
      if (typeof playStation === 'function') playStation(url, name, meta, emoji);
      return;
    }
    updateCount();
  }, 1000);
}

// ─── 12. CROSSFADE ON STATION CHANGE ─────────────────────────────────────
let _crossfadeActive = false;

function crossfadeToStation(url, name, meta, emoji) {
  const au = document.getElementById('audio');
  if (!au || _crossfadeActive || au.paused || !au.src) {
    if (typeof playStation === 'function') playStation(url, name, meta, emoji);
    return;
  }
  _crossfadeActive = true;
  const origVol = au.volume;
  const steps = 20;
  const stepTime = 1500 / steps;
  let step = 0;
  const fade = setInterval(() => {
    step++;
    au.volume = Math.max(0, origVol * (1 - step / steps));
    if (step >= steps) {
      clearInterval(fade);
      au.pause();
      au.volume = origVol;
      _crossfadeActive = false;
      if (typeof playStation === 'function') playStation(url, name, meta, emoji);
    }
  }, stepTime);
}
window.crossfadeToStation = crossfadeToStation;

// ─── 13. SIMILAR STATIONS BUTTON ─────────────────────────────────────────
async function loadSimilarStations() {
  if (!window._currentStationData) { showToast('Play a station first', 'warn'); return; }
  const s = window._currentStationData;
  const tags = (s.tags || '').split(',').filter(t => t.trim()).slice(0, 2).join(',');
  if (!tags) { showToast('No tags to match — try another station', 'warn'); return; }

  const panel = document.getElementById('similar-panel');
  const list = document.getElementById('similar-list');
  if (!panel || !list) return;
  panel.classList.add('open');
  list.innerHTML = '<div class="sim-loading">Scanning frequencies…</div>';

  try {
    const r = await fetch(`https://all.api.radio-browser.info/json/stations/search?limit=8&https=true&tag=${encodeURIComponent(tags)}&order=clickcount&reverse=true`);
    const stations = await r.json();
    const filtered = stations.filter(st => st.stationuuid !== s.stationuuid);
    if (!filtered.length) { list.innerHTML = '<div class="sim-loading">No similar signals found</div>'; return; }
    list.innerHTML = filtered.map(st => {
      const emoji = typeof getCountryEmoji === 'function' ? getCountryEmoji(st.countrycode) : '📻';
      return `<div class="sim-item" onclick="playStation('${escHtmlImp(st.url_resolved)}','${escHtmlImp(st.name)}','${escHtmlImp(st.country||'Unknown')}','${emoji}');closeSimilarPanel()">
        <span class="sim-emoji">${emoji}</span>
        <div>
          <div class="sim-name">${escHtmlImp(st.name)}</div>
          <div class="sim-meta">${escHtmlImp(st.country||'—')} · ${st.bitrate?st.bitrate+'kbps':'—'}</div>
        </div>
      </div>`;
    }).join('');
  } catch {
    list.innerHTML = '<div class="sim-loading">Signal lost</div>';
  }
}

function closeSimilarPanel() {
  const p = document.getElementById('similar-panel');
  if (p) p.classList.remove('open');
}
window.loadSimilarStations = loadSimilarStations;
window.closeSimilarPanel = closeSimilarPanel;

// ─── 14. EQUALIZER PRESETS ────────────────────────────────────────────────
// WRONGNESS: "SIGNAL_KAGE Mode" preset adds subtle distortion
const EQ_PRESETS = {
  flat:       { bass: 0,   mid: 0,   treble: 0,   label: 'Flat' },
  bassboost:  { bass: 8,   mid: 1,   treble: -1,  label: 'Bass Boost' },
  vocal:      { bass: -2,  mid: 5,   treble: 3,   label: 'Vocal Boost' },
  night:      { bass: 3,   mid: -2,  treble: -4,  label: 'Night Mode' },
  broadcast:  { bass: 2,   mid: 3,   treble: 2,   label: 'Broadcast' },
  // WRONGNESS entry
  kage:       { bass: -8,  mid: 8,   treble: -8,  label: 'SIGNAL_KAGE ▒', wrongness: true },
};

let _audioCtx = null, _bassFilter = null, _midFilter = null, _trebleFilter = null, _eqConnected = false;
let _activePreset = 'flat';
let _distortionNode = null;

function initEQ() {
  const au = document.getElementById('audio');
  if (!au || _eqConnected) return;
  try {
    _audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const src = _audioCtx.createMediaElementSource(au);
    _bassFilter   = _audioCtx.createBiquadFilter(); _bassFilter.type = 'lowshelf';  _bassFilter.frequency.value = 200;
    _midFilter    = _audioCtx.createBiquadFilter(); _midFilter.type = 'peaking';    _midFilter.frequency.value = 1000; _midFilter.Q.value = 1;
    _trebleFilter = _audioCtx.createBiquadFilter(); _trebleFilter.type = 'highshelf'; _trebleFilter.frequency.value = 4000;
    _distortionNode = _audioCtx.createWaveShaper();
    src.connect(_bassFilter);
    _bassFilter.connect(_midFilter);
    _midFilter.connect(_trebleFilter);
    _trebleFilter.connect(_distortionNode);
    _distortionNode.connect(_audioCtx.destination);
    _eqConnected = true;
  } catch {}
}

function applyEQPreset(presetKey) {
  if (!_eqConnected) initEQ();
  const preset = EQ_PRESETS[presetKey];
  if (!preset) return;
  _activePreset = presetKey;
  if (_bassFilter)   _bassFilter.gain.value   = preset.bass;
  if (_midFilter)    _midFilter.gain.value     = preset.mid;
  if (_trebleFilter) _trebleFilter.gain.value  = preset.treble;

  // WRONGNESS: SIGNAL_KAGE mode adds waveshaper distortion
  if (_distortionNode) {
    if (preset.wrongness) {
      const curve = makeDistortionCurve(80);
      _distortionNode.curve = curve;
      if (window.WRONGNESS) window.WRONGNESS.spike(20);
      showToast('⚠ Signal anomaly detected on this frequency', 'warn');
    } else {
      _distortionNode.curve = null;
    }
  }

  // Update UI
  document.querySelectorAll('.eq-preset-btn').forEach(b => b.classList.remove('active'));
  const btn = document.querySelector(`.eq-preset-btn[data-preset="${presetKey}"]`);
  if (btn) btn.classList.add('active');
}

function makeDistortionCurve(amount) {
  const n = 256, curve = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const x = (i * 2) / n - 1;
    curve[i] = ((Math.PI + amount) * x) / (Math.PI + amount * Math.abs(x));
  }
  return curve;
}

function buildEQPanel() {
  if (document.getElementById('eq-panel')) return;
  const panel = document.createElement('div');
  panel.id = 'eq-panel';
  panel.className = 'eq-panel';
  panel.innerHTML = `
    <div class="eq-panel-header">
      <span class="eq-panel-title">Equalizer</span>
      <button class="eq-panel-close" onclick="closeEQPanel()">✕</button>
    </div>
    <div class="eq-presets">
      ${Object.entries(EQ_PRESETS).map(([key, p]) =>
        `<button class="eq-preset-btn${p.wrongness ? ' eq-btn-ghost' : ''}${key === 'flat' ? ' active' : ''}" data-preset="${key}" onclick="applyEQPreset('${key}')">${p.label}</button>`
      ).join('')}
    </div>`;
  document.body.appendChild(panel);
}

function openEQPanel() {
  buildEQPanel();
  initEQ();
  document.getElementById('eq-panel').classList.add('open');
}
function closeEQPanel() {
  const p = document.getElementById('eq-panel');
  if (p) p.classList.remove('open');
}
window.openEQPanel = openEQPanel;
window.closeEQPanel = closeEQPanel;
window.applyEQPreset = applyEQPreset;


// ═══════════════════════════════════════════════════════
// GROUP 3 — SAVING & PERSONALIZATION (items 15–18)
// ═══════════════════════════════════════════════════════

const FAV_KEY = 'wncore-favs-v2';

function favLoad() {
  try { return JSON.parse(localStorage.getItem(FAV_KEY) || '[]'); } catch { return []; }
}
function favSave(arr) {
  try { localStorage.setItem(FAV_KEY, JSON.stringify(arr)); } catch {}
}

// ─── 15. FAVORITES PAGE ──────────────────────────────────────────────────
// WRONGNESS: one favorite occasionally shows as [REDACTED], restores on click
function buildFavoritesPage() {
  if (document.getElementById('page-favorites')) return;
  const page = document.createElement('div');
  page.id = 'page-favorites';
  page.className = 'page fav-page';
  page.innerHTML = `
    <div class="fav-wrap">
      <div class="fav-header-row">
        <div>
          <div class="fav-kicker">MY COLLECTION</div>
          <h2 class="fav-title">Saved Stations</h2>
        </div>
        <div class="fav-actions">
          <button class="fav-action-btn" onclick="exportFavorites()" title="Export favorites">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" width="16" height="16"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Export
          </button>
          <label class="fav-action-btn" title="Import favorites">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" width="16" height="16"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            Import
            <input type="file" accept=".json" style="display:none" onchange="importFavorites(this)">
          </label>
        </div>
      </div>
      <div class="fav-grid" id="fav-grid"></div>
      <div class="fav-empty" id="fav-empty" style="display:none">
        <div class="fav-empty-icon">♡</div>
        <div class="fav-empty-title">No saved stations yet</div>
        <div class="fav-empty-sub">Press <kbd>F</kbd> while a station plays, or click the heart in the player</div>
      </div>
    </div>`;
  // Insert before about page
  const aboutPage = document.getElementById('page-about');
  if (aboutPage) aboutPage.parentNode.insertBefore(page, aboutPage);
  else document.body.appendChild(page);
}

function renderFavoritesPage() {
  const grid = document.getElementById('fav-grid');
  const empty = document.getElementById('fav-empty');
  if (!grid) return;
  const favs = favLoad();
  if (!favs.length) {
    grid.innerHTML = '';
    if (empty) empty.style.display = 'block';
    return;
  }
  if (empty) empty.style.display = 'none';

  // WRONGNESS: ~25% of opens, one entry is [REDACTED] for 700ms
  let ghostIdx = -1;
  if (Math.random() < 0.25) {
    ghostIdx = Math.floor(Math.random() * Math.min(favs.length, 4));
    setTimeout(renderFavoritesPage, 700);
  }

  grid.innerHTML = favs.map((s, i) => {
    const displayName = i === ghostIdx ? '[REDACTED]' : escHtmlImp(s.name);
    return `<div class="fav-card">
      <div class="fav-card-emoji">${s.emoji || '📻'}</div>
      <div class="fav-card-info">
        <div class="fav-card-name">${displayName}</div>
        <div class="fav-card-meta">${escHtmlImp(s.meta || '—')}</div>
      </div>
      <div class="fav-card-actions">
        <button class="fav-play-btn" onclick="favPlayStation(${i})" aria-label="Play">▶</button>
        <button class="fav-remove-btn" onclick="favRemove(${i})" aria-label="Remove">✕</button>
      </div>
    </div>`;
  }).join('');
}

function favAdd(station) {
  const favs = favLoad();
  if (favs.find(f => f.url === station.url)) return;
  favs.unshift(station);
  favSave(favs);
  showToast(`♥ Saved: ${station.name}`, 'success');
  renderFavoritesPage();
  updateFavButton();
}

function favRemove(idx) {
  const favs = favLoad();
  favs.splice(idx, 1);
  favSave(favs);
  renderFavoritesPage();
  updateFavButton();
}

function favPlayStation(idx) {
  const favs = favLoad();
  const s = favs[idx];
  if (s && typeof playStation === 'function') playStation(s.url, s.name, s.meta, s.emoji);
}

function favCurrentStation() {
  const cs = window.currentStation;
  if (!cs) { showToast('Nothing playing', 'warn'); return; }
  const favs = favLoad();
  const existing = favs.findIndex(f => f.url === cs.url);
  if (existing !== -1) {
    favs.splice(existing, 1);
    favSave(favs);
    showToast('Removed from favourites', 'info');
    updateFavButton();
    return;
  }
  favAdd({ url: cs.url, name: cs.name, meta: cs.meta, emoji: cs.emoji });
}
window.favCurrentStation = favCurrentStation;
window.favRemove = favRemove;
window.favPlayStation = favPlayStation;

function updateFavButton() {
  const cs = window.currentStation;
  const btn = document.getElementById('pb-fav-btn');
  if (!btn || !cs) return;
  const favs = favLoad();
  const saved = favs.some(f => f.url === cs.url);
  btn.classList.toggle('active', saved);
  btn.style.color = saved ? '#e8753a' : '';
}

// ─── 16. LISTENING STATS ─────────────────────────────────────────────────
const STATS_KEY = 'wncore-stats-v1';
let _statsInterval = null;

function statsLoad() {
  try { return JSON.parse(localStorage.getItem(STATS_KEY) || '{"totalSecs":0,"stationsTried":0,"topGenre":"—","sessions":0}'); }
  catch { return { totalSecs: 0, stationsTried: 0, topGenre: '—', sessions: 0 }; }
}
function statsSave(s) {
  try { localStorage.setItem(STATS_KEY, JSON.stringify(s)); } catch {}
}

function statsStartTracking() {
  const st = statsLoad();
  st.sessions++;
  statsSave(st);
  if (_statsInterval) clearInterval(_statsInterval);
  _statsInterval = setInterval(() => {
    const au = document.getElementById('audio');
    if (au && !au.paused) {
      const s = statsLoad();
      s.totalSecs++;
      statsSave(s);
      updateStatsWidget();
    }
  }, 1000);
}

function statsOnPlay() {
  const s = statsLoad();
  s.stationsTried++;
  statsSave(s);
  updateStatsWidget();
}

function updateStatsWidget() {
  const el = document.getElementById('stats-widget');
  if (!el) return;
  const s = statsLoad();
  const h = Math.floor(s.totalSecs / 3600);
  const m = Math.floor((s.totalSecs % 3600) / 60);
  document.getElementById('stat-time').textContent = h > 0 ? `${h}h ${m}m` : `${m}m`;
  document.getElementById('stat-stations').textContent = s.stationsTried;
  document.getElementById('stat-sessions').textContent = s.sessions;
}

function buildStatsWidget() {
  const sidebar = document.querySelector('.np-sidebar, .now-playing-sidebar');
  if (!sidebar || document.getElementById('stats-widget')) return;
  const w = document.createElement('div');
  w.id = 'stats-widget';
  w.className = 'stats-widget';
  w.innerHTML = `
    <div class="sw-title">This Session</div>
    <div class="sw-row"><span class="sw-label">Time listened</span><span class="sw-val" id="stat-time">0m</span></div>
    <div class="sw-row"><span class="sw-label">Stations tried</span><span class="sw-val" id="stat-stations">0</span></div>
    <div class="sw-row"><span class="sw-label">Sessions</span><span class="sw-val" id="stat-sessions">1</span></div>`;
  sidebar.appendChild(w);
  updateStatsWidget();
}

// ─── 17. CUSTOM STATION SUBMISSION ───────────────────────────────────────
function buildSubmissionForm() {
  const aboutPage = document.getElementById('page-about');
  if (!aboutPage || document.getElementById('station-submit-form')) return;
  const section = document.createElement('div');
  section.className = 'submit-section';
  section.innerHTML = `
    <div class="submit-header">Submit a Station</div>
    <p class="submit-sub">Know a station that should be here? Submit it for review.</p>
    <div id="station-submit-form" class="submit-form">
      <div class="sf-row">
        <div class="sf-field">
          <label class="sf-label">Station Name</label>
          <input class="sf-input" id="sf-name" type="text" placeholder="e.g. WNYC Radio">
        </div>
        <div class="sf-field">
          <label class="sf-label">Stream URL</label>
          <input class="sf-input" id="sf-url" type="url" placeholder="https://stream.example.com/mp3">
        </div>
      </div>
      <div class="sf-row">
        <div class="sf-field">
          <label class="sf-label">Genre / Tags</label>
          <input class="sf-input" id="sf-genre" type="text" placeholder="jazz, talk, news">
        </div>
        <div class="sf-field">
          <label class="sf-label">Country</label>
          <input class="sf-input" id="sf-country" type="text" placeholder="United States">
        </div>
      </div>
      <div class="sf-note">All submissions are reviewed before going live. We verify HTTPS and license status.</div>
      <button class="sf-submit-btn" onclick="submitStation()">Submit for Review →</button>
      <div id="sf-feedback" class="sf-feedback"></div>
    </div>`;
  aboutPage.querySelector('.about-wrap')?.appendChild(section);
}

function submitStation() {
  const name    = document.getElementById('sf-name')?.value.trim();
  const url     = document.getElementById('sf-url')?.value.trim();
  const genre   = document.getElementById('sf-genre')?.value.trim();
  const country = document.getElementById('sf-country')?.value.trim();
  const fb      = document.getElementById('sf-feedback');
  if (!name || !url) { if (fb) { fb.textContent = 'Name and stream URL are required.'; fb.className = 'sf-feedback error'; } return; }
  if (!url.startsWith('http')) { if (fb) { fb.textContent = 'Stream URL must start with http:// or https://'; fb.className = 'sf-feedback error'; } return; }
  // Simulate submission
  if (fb) { fb.textContent = 'Submitting…'; fb.className = 'sf-feedback'; }
  setTimeout(() => {
    if (fb) { fb.textContent = `✓ "${name}" submitted. Review takes 24–48h. Thank you.`; fb.className = 'sf-feedback success'; }
    ['sf-name','sf-url','sf-genre','sf-country'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
  }, 1200);
}
window.submitStation = submitStation;

// ─── 18. IMPORT / EXPORT FAVORITES ───────────────────────────────────────
function exportFavorites() {
  const favs = favLoad();
  if (!favs.length) { showToast('No favourites to export', 'warn'); return; }
  const blob = new Blob([JSON.stringify(favs, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `wncore-favourites-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
  showToast('Favourites exported', 'success');
}

function importFavorites(input) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const data = JSON.parse(e.target.result);
      if (!Array.isArray(data)) throw new Error();
      const current = favLoad();
      const merged = [...current];
      let added = 0;
      data.forEach(s => {
        if (s.url && s.name && !merged.find(f => f.url === s.url)) {
          merged.push(s); added++;
        }
      });
      favSave(merged);
      renderFavoritesPage();
      showToast(`Imported ${added} station${added !== 1 ? 's' : ''}`, 'success');
    } catch {
      showToast('Invalid file format', 'warn');
    }
  };
  reader.readAsText(file);
}
window.exportFavorites = exportFavorites;
window.importFavorites = importFavorites;


// ═══════════════════════════════════════════════════════
// GROUP 4 — ACCESSIBILITY & UX POLISH (items 24–30)
// ═══════════════════════════════════════════════════════

// ─── 24. FOCUS TRAP IN MODALS ────────────────────────────────────────────
function trapFocus(modalEl) {
  const focusable = modalEl.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const first = focusable[0], last = focusable[focusable.length - 1];
  modalEl.addEventListener('keydown', e => {
    if (e.key !== 'Tab') return;
    if (e.shiftKey) { if (document.activeElement === first) { e.preventDefault(); last.focus(); } }
    else            { if (document.activeElement === last)  { e.preventDefault(); first.focus(); } }
  });
}

// Apply to existing modals after DOM ready
function initFocusTraps() {
  const modals = ['search-modal', 'signin-modal', 'kb-modal'];
  modals.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      const observer = new MutationObserver(() => {
        if (el.classList.contains('open')) {
          const first = el.querySelector('button, input');
          if (first) first.focus();
        }
      });
      observer.observe(el, { attributes: true, attributeFilter: ['class'] });
      trapFocus(el);
    }
  });
}

// ─── 25. TOAST NOTIFICATION SYSTEM ───────────────────────────────────────
// (used throughout this file — built first)
let _toastQueue = [], _toastActive = false;

function buildToastContainer() {
  if (document.getElementById('toast-container')) return;
  const c = document.createElement('div');
  c.id = 'toast-container';
  c.className = 'toast-container';
  document.body.appendChild(c);
}

function showToast(message, type = 'info', duration = 3000) {
  buildToastContainer();
  const c = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  c.appendChild(toast);
  // Animate in
  requestAnimationFrame(() => {
    requestAnimationFrame(() => toast.classList.add('toast-show'));
  });
  setTimeout(() => {
    toast.classList.remove('toast-show');
    toast.classList.add('toast-hide');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}
window.showToast = showToast;

// ─── 26. REDUCED MOTION MODE ─────────────────────────────────────────────
// WRONGNESS: wrongness effects still fire in reduced motion, more jarring
function initReducedMotion() {
  try {
    if (localStorage.getItem('wncore-reduced') === '1') {
      document.body.classList.add('reduced-motion');
    }
  } catch {}
}

function toggleReducedMotion() {
  document.body.classList.toggle('reduced-motion');
  const on = document.body.classList.contains('reduced-motion');
  try { localStorage.setItem('wncore-reduced', on ? '1' : '0'); } catch {}
  showToast(on ? 'Reduced motion on' : 'Reduced motion off', 'info');
}
window.toggleReducedMotion = toggleReducedMotion;

// ─── 27. SCROLL-TO-TOP BUTTON ────────────────────────────────────────────
function buildScrollTopBtn() {
  if (document.getElementById('scroll-top-btn')) return;
  const btn = document.createElement('button');
  btn.id = 'scroll-top-btn';
  btn.className = 'scroll-top-btn';
  btn.setAttribute('aria-label', 'Scroll to top');
  btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" width="18" height="18"><polyline points="18 15 12 9 6 15"/></svg>`;
  btn.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  document.body.appendChild(btn);
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
}

// ─── 28. SKELETON LOADING SCREENS ────────────────────────────────────────
function showSkeletonTable(tbodyId, rows = 8) {
  const tbody = document.getElementById(tbodyId);
  if (!tbody) return;
  tbody.innerHTML = Array.from({ length: rows }, () => `
    <tr class="skeleton-row">
      <td><div class="skel skel-sm"></div></td>
      <td><div class="skel skel-sm"></div></td>
      <td><div class="skel skel-lg"></div></td>
      <td><div class="skel skel-md"></div></td>
      <td><div class="skel skel-sm"></div></td>
      <td><div class="skel skel-sm"></div></td>
    </tr>`).join('');
}
window.showSkeletonTable = showSkeletonTable;

function showSkeletonGrid(containerId, cards = 6) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = Array.from({ length: cards }, () => `
    <div class="skel-card">
      <div class="skel skel-card-img"></div>
      <div class="skel skel-lg" style="margin-top:10px"></div>
      <div class="skel skel-md" style="margin-top:6px"></div>
    </div>`).join('');
}
window.showSkeletonGrid = showSkeletonGrid;

// ─── 29. MOBILE BOTTOM NAV ────────────────────────────────────────────────
function buildMobileBottomNav() {
  if (document.getElementById('mobile-bottom-nav')) return;
  const nav = document.createElement('nav');
  nav.id = 'mobile-bottom-nav';
  nav.className = 'mobile-bottom-nav';
  nav.setAttribute('aria-label', 'Mobile bottom navigation');
  nav.innerHTML = `
    <button class="mbn-btn active" id="mbn-home" onclick="mbnNav('home',this)">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" width="20" height="20"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
      <span>Home</span>
    </button>
    <button class="mbn-btn" id="mbn-search" onclick="openSearch()">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" width="20" height="20"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      <span>Search</span>
    </button>
    <button class="mbn-btn" id="mbn-favs" onclick="mbnNav('favorites',this)">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" width="20" height="20"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
      <span>Saved</span>
    </button>
    <button class="mbn-btn" id="mbn-playing" onclick="mbnNav('home',this);scrollToPlayer()">
      <div class="mbn-playing-dot" id="mbn-dot"></div>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" width="20" height="20"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>
      <span>Playing</span>
    </button>`;
  document.body.appendChild(nav);
}

function mbnNav(pageId, btn) {
  if (typeof showPage === 'function') showPage(pageId, null);
  document.querySelectorAll('.mbn-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  if (pageId === 'favorites') { buildFavoritesPage(); renderFavoritesPage(); }
}
window.mbnNav = mbnNav;

function scrollToPlayer() {
  const bar = document.querySelector('.player-bar');
  if (bar) bar.scrollIntoView({ behavior: 'smooth' });
}

function updateMbnDot() {
  const dot = document.getElementById('mbn-dot');
  if (!dot) return;
  const au = document.getElementById('audio');
  dot.style.display = (au && !au.paused) ? 'block' : 'none';
}

// ─── 30. 88.7 SEARCH DEAD-END ────────────────────────────────────────────
// WRONGNESS: searching "88.7" shows a special redacted result
function intercept887Search(q) {
  if (!q.includes('88.7') && !q.toLowerCase().includes('88.7 fm')) return false;
  const results = document.getElementById('search-results');
  if (!results) return false;
  results.innerHTML = `
    <div class="sr-887-result" onclick="trigger887FromSearch()">
      <div class="sr-icon">📻</div>
      <div>
        <div class="sr-name sr-name-redacted">88.7 FM — ██████████</div>
        <div class="sr-meta">ORIGIN: UNKNOWN · ——kbps · <span style="color:var(--accent)">SIGNAL DETECTED</span></div>
      </div>
    </div>
    <div class="sr-887-log">
      <div class="sr-887-log-line">// search_index: no match for "88.7 FM"</div>
      <div class="sr-887-log-line">// fallback: carrier_scan() → anomaly at 88.700 MHz</div>
      <div class="sr-887-log-line">// WARNING: source unverified — proceed?</div>
    </div>`;
  return true;
}

function trigger887FromSearch() {
  if (typeof closeSearch === 'function') closeSearch();
  if (typeof play887Static === 'function') play887Static();
  if (window.WRONGNESS) window.WRONGNESS.spike(25);
}
window.trigger887FromSearch = trigger887FromSearch;


// ═══════════════════════════════════════════════════════
// INTEGRATION — PATCH EXISTING FUNCTIONS
// ═══════════════════════════════════════════════════════

function patchExistingFunctions() {
  // Patch playStation to track history, stats, bitrate
  if (typeof playStation === 'function' && !playStation._patched) {
    const origPlay = playStation;
    window.playStation = function(url, name, meta, emoji) {
      origPlay(url, name, meta, emoji);
      const s = { url, name, meta, emoji };
      historyPush(s);
      statsOnPlay();
      // Store for similar stations lookup
      window._currentStationData = { url, name, meta, emoji };
      // bitrate not in this call signature — fetch separately
      showBitrateInPlayer(window._currentStationData);
      updateFavButton();
      updateMbnDot();
      setTimeout(updateMbnDot, 1000);
    };
    window.playStation._patched = true;
  }

  // Patch doSearch to intercept 88.7
  if (typeof doSearch === 'function' && !doSearch._patched) {
    const origSearch = doSearch;
    window.doSearch = async function(q) {
      if (intercept887Search(q)) return;
      return origSearch(q);
    };
    window.doSearch._patched = true;
  }

  // Patch renderTable to attach previews
  if (typeof renderTable === 'function' && !renderTable._patched) {
    const origRender = renderTable;
    window.renderTable = function(stations, tbodyId) {
      showSkeletonTable(tbodyId, stations.length || 8);
      setTimeout(() => {
        origRender(stations, tbodyId);
        attachPreviewToTable(stations, tbodyId);
      }, 80);
    };
    window.renderTable._patched = true;
  }

  // Patch toggleFavorite (player heart button) to use our system
  const favBtn = document.querySelector('[onclick*="toggleFavorite"]');
  if (favBtn) {
    favBtn.id = 'pb-fav-btn';
    favBtn.setAttribute('onclick', 'favCurrentStation()');
  }

  // Patch sleep timer button
  injectSleepRing();
}

// Patch showPage to handle favorites
function patchShowPage() {
  if (typeof showPage === 'function' && !showPage._favPatched) {
    const orig = showPage;
    window.showPage = function(id, linkEl) {
      orig(id, linkEl);
      if (id === 'favorites') {
        buildFavoritesPage();
        renderFavoritesPage();
      }
    };
    window.showPage._favPatched = true;
  }
}


// ═══════════════════════════════════════════════════════
// STRUCTURAL INJECTIONS — PANELS & NAV LINKS
// ═══════════════════════════════════════════════════════

function injectNavItems() {
  // Favorites nav link
  const nav = document.querySelector('header nav');
  if (nav && !document.getElementById('nav-favorites-link')) {
    const favLink = document.createElement('a');
    favLink.id = 'nav-favorites-link';
    favLink.href = '#';
    favLink.setAttribute('onclick', "showPage('favorites',this);return false");
    favLink.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" width="14" height="14"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg> Favourites`;
    // Insert before About
    const aboutLink = Array.from(nav.querySelectorAll('a')).find(a => a.textContent.trim().startsWith('About'));
    if (aboutLink) nav.insertBefore(favLink, aboutLink);
    else nav.appendChild(favLink);
  }

  // EQ & Shortcuts buttons in player right section
  const pbRight = document.querySelector('.pb-right');
  if (pbRight && !document.getElementById('pb-eq-btn')) {
    const eqBtn = document.createElement('button');
    eqBtn.id = 'pb-eq-btn';
    eqBtn.className = 'pb-btn pb-eq-open-btn';
    eqBtn.setAttribute('onclick', 'openEQPanel()');
    eqBtn.setAttribute('title', 'Equalizer');
    eqBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" width="16" height="16"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></svg>`;
    pbRight.prepend(eqBtn);

    const simBtn = document.createElement('button');
    simBtn.id = 'pb-sim-btn';
    simBtn.className = 'pb-btn';
    simBtn.setAttribute('onclick', 'loadSimilarStations()');
    simBtn.setAttribute('title', 'Similar stations');
    simBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" width="16" height="16"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`;
    pbRight.prepend(simBtn);

    const kbBtn = document.createElement('button');
    kbBtn.id = 'pb-kb-btn';
    kbBtn.className = 'pb-btn';
    kbBtn.setAttribute('onclick', 'openKbModal()');
    kbBtn.setAttribute('title', 'Keyboard shortcuts (?)');
    kbBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" width="16" height="16"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M6 8h.01M10 8h.01M14 8h.01M18 8h.01M8 12h.01M12 12h.01M16 12h.01M7 16h10"/></svg>`;
    pbRight.prepend(kbBtn);
  }

  // Feeling Lucky button near home section header
  const homeSection = document.querySelector('#page-home .section-header, #page-home .home-header');
  if (homeSection && !document.getElementById('lucky-btn')) {
    const lb = document.createElement('button');
    lb.id = 'lucky-btn';
    lb.className = 'lucky-btn';
    lb.setAttribute('onclick', 'feelingLucky()');
    lb.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" width="14" height="14"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> Feeling Lucky`;
    homeSection.appendChild(lb);
  }
}

function injectSimilarPanel() {
  if (document.getElementById('similar-panel')) return;
  const panel = document.createElement('div');
  panel.id = 'similar-panel';
  panel.className = 'similar-panel';
  panel.innerHTML = `
    <div class="sim-header">
      <span class="sim-title">Similar Stations</span>
      <button class="sim-close" onclick="closeSimilarPanel()">✕</button>
    </div>
    <div class="sim-list" id="similar-list"></div>`;
  document.body.appendChild(panel);
}

function injectHistorySidebar() {
  const sidebar = document.querySelector('.np-sidebar, .now-playing-sidebar');
  if (!sidebar || document.getElementById('history-list')) return;
  const section = document.createElement('div');
  section.className = 'history-section';
  section.innerHTML = `
    <div class="hist-title">Recently Played</div>
    <div class="hist-list" id="history-list"><div class="hist-empty">No stations played yet</div></div>`;
  sidebar.appendChild(section);
}


// ═══════════════════════════════════════════════════════
// BOOT
// ═══════════════════════════════════════════════════════

function boot() {
  buildToastContainer();
  initVolumeMemory();
  initReducedMotion();
  buildKbModal();
  buildMobileBottomNav();
  buildScrollTopBtn();
  buildFavoritesPage();
  injectNavItems();
  injectSimilarPanel();
  injectHistorySidebar();
  patchExistingFunctions();
  patchShowPage();
  statsStartTracking();
  initFocusTraps();
  buildGenreAZ();
  buildCountryFilter();
  buildSidebarToggle();
  buildStatsWidget();
  buildSubmissionForm();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
