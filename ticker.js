// ticker.js — WNCORE News Ticker v5
// Now fetches dynamic lore from lore-manager API
// Seamless infinite scroll with triple-loop

let TICKER_ITEMS = [];

// Fetch lore from API and build ticker
async function loadAndBuildTicker() {
  try {
    const response = await fetch('/api/lore-manager');
    if (!response.ok) throw new Error('Failed to load lore');
    const loreData = await response.json();
    
    // Extract content from lore items, fallback if needed
    TICKER_ITEMS = loreData.map(item => 
      item.content || item
    ).filter(item => typeof item === 'string');

    if (TICKER_ITEMS.length === 0) {
      console.warn('No lore items loaded, using fallback');
      TICKER_ITEMS = getFallbackTicker();
    }

    refreshAllTickers();
  } catch (err) {
    console.error('Lore load error:', err);
    TICKER_ITEMS = getFallbackTicker();
    refreshAllTickers();
  }
}

// Fallback ticker items (if API fails)
function getFallbackTicker() {
  return [
    '⚠ WNCORE BROADCAST — Rain of ████████ reported over Japan, UK, Russia, Bangladesh, Nepal, Bhutan, Australia, Singapore, India, UAE — 3rd consecutive day. Signal loss in non-WNCORE sectors; global blackout in effect.',
    '📡 SIGNAL DETECTED — Frequency 88.7 intermittent. Decoded transmission (2011) re-looping: "THEY LIED TO US. SEND HELP. ANY WAY POSSIBLE. NO MATTER WHO IS OUT THERE."',
    '❗ CRITICAL ALERT — Unknown yellow ████ spreading beyond German borders. Contact renders water supplies toxic; fatal to all fauna and humans. Maintain 30m minimum distance from low-altitude smoke.',
    '☣ VARIANT IDENTIFIED — "████████ ZERO" variant spotted in South Asian sectors. High-speed movement confirmed between ████████ zones. Origin: unknown.',
    '❄ GLOBAL CHILLING — Rapid temperature drops recorded across 47 regions. Severe hail warning issued. ████████-infused ice crystals detected in multiple samples.',
  ];
}

function buildTickerHTML() {
  if (TICKER_ITEMS.length === 0) return '';
  
  // Triple the items so the ticker never visibly loops/gaps
  // The CSS animation translates -33.33% which = 1 full copy
  const triple = [...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS];
  return triple.map(item =>
    `<span class="ticker-item">${item}</span><span class="ticker-sep"> ◆ </span>`
  ).join('');
}

function refreshAllTickers() {
  // Update main ticker
  const tickerInner = document.getElementById('ticker-inner');
  if (tickerInner) {
    tickerInner.innerHTML = buildTickerHTML();
  }

  // Update stories ticker if present
  const storiesTickerInner = document.getElementById('ticker-inner-stories');
  if (storiesTickerInner) {
    storiesTickerInner.innerHTML = buildTickerHTML();
  }

  // Update any other .ticker-inner elements
  document.querySelectorAll('.ticker-inner').forEach(el => {
    if (!el.id) {
      el.innerHTML = buildTickerHTML();
    }
  });
}

function initTicker() {
  // Load lore and populate tickers
  loadAndBuildTicker();
}

// Expose for external use
window.buildTickerHTML = buildTickerHTML;
window.refreshTicker = function() {
  console.log('Manually refreshing ticker...');
  loadAndBuildTicker();
};

// Run on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTicker);
} else {
  initTicker();
}

// Auto-refresh every 5 minutes to pull new lore
setInterval(loadAndBuildTicker, 5 * 60 * 1000);
