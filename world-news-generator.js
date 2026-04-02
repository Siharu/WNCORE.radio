// world-news-generator.js — AI World News System
// Generates realistic news from LORE_DUMP shared database
// Reads by Gemini 2.0 Flash, displayed in index.html

(function() {
  const NEWS_STORAGE_KEY = 'wncore_world_news';
  const NEWS_CACHE_TIME = 5 * 60 * 1000; // 5 minutes
  const MAX_NEWS_HISTORY = 20;
  
  // Load LORE_DUMP from shared file
  function loadLoreDump() {
    return typeof LORE_DUMP !== 'undefined' ? LORE_DUMP : null;
  }

  // Fetch world news from Gemini based on lore
  async function generateWorldNews() {
    const loreDump = loadLoreDump();
    if (!loreDump) {
      console.error('LORE_DUMP not loaded');
      return null;
    }

    try {
      const response = await fetch('/api/world-news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate',
          loreDump: loreDump,
          currentYear: loreDump.worldBackground.currentYear,
        }),
      });

      const data = await response.json();
      if (data.success) {
        return {
          headline: data.headline,
          content: data.content,
          category: data.category,
          timestamp: new Date().toISOString(),
          sourceRegion: data.region,
        };
      }
    } catch (error) {
      console.error('News generation error:', error);
    }
    return null;
  }

  // Store news in history
  function saveNewsToHistory(newsItem) {
    const stored = JSON.parse(localStorage.getItem(NEWS_STORAGE_KEY) || '[]');
    stored.unshift(newsItem);
    if (stored.length > MAX_NEWS_HISTORY) stored.pop();
    localStorage.setItem(NEWS_STORAGE_KEY, JSON.stringify(stored));
  }

  // Get latest news
  function getLatestNews() {
    const stored = JSON.parse(localStorage.getItem(NEWS_STORAGE_KEY) || '[]');
    return stored.length > 0 ? stored[0] : null;
  }

  // Get news history
  function getNewsHistory() {
    return JSON.parse(localStorage.getItem(NEWS_STORAGE_KEY) || '[]');
  }

  // Clear old cache if needed
  function checkCacheExpiry() {
    const lastUpdate = localStorage.getItem(NEWS_STORAGE_KEY + '_lastUpdate');
    const now = Date.now();
    if (lastUpdate && now - parseInt(lastUpdate) > NEWS_CACHE_TIME) {
      return true; // Needs refresh
    }
    return false;
  }

  // Main refresh function
  async function refreshNews() {
    if (checkCacheExpiry()) {
      const newNews = await generateWorldNews();
      if (newNews) {
        saveNewsToHistory(newNews);
        localStorage.setItem(NEWS_STORAGE_KEY + '_lastUpdate', Date.now().toString());
        return newNews;
      }
    }
    return getLatestNews();
  }

  // Display news in DOM
  function displayNews(newsItem) {
    const container = document.getElementById('world-news-display');
    if (!container || !newsItem) return;

    const dateStr = new Date(newsItem.timestamp).toLocaleDateString();
    container.innerHTML = `
      <div class="news-headline">${newsItem.headline}</div>
      <div class="news-preview">${newsItem.content.substring(0, 120)}...</div>
      <div class="news-meta">${newsItem.sourceRegion} — ${dateStr}</div>
    `;
  }

  // Show history modal
  function showNewsHistory() {
    const history = getNewsHistory();
    const modal = document.getElementById('world-news-modal');
    if (!modal) return;

    const historyHTML = history
      .map(
        (n, i) => `
      <div class="news-item" onclick="window.selectNews(${i})">
        <div class="news-hist-headline">${n.headline}</div>
        <div class="news-hist-date">${new Date(n.timestamp).toLocaleDateString()}</div>
      </div>
    `
      )
      .join('');

    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <span>WORLD NEWS ARCHIVE</span>
          <button onclick="document.getElementById('world-news-modal').style.display='none'" style="background:transparent;border:none;color:#cc0000;cursor:pointer;font-size:1.5rem;">✕</button>
        </div>
        <div class="news-history-list">
          ${historyHTML}
        </div>
      </div>
    `;
    modal.style.display = 'block';
  }

  // Select specific news from history
  function selectNews(index) {
    const history = getNewsHistory();
    if (history[index]) {
      displayNews(history[index]);
      document.getElementById('world-news-modal').style.display = 'none';
    }
  }

  // Initialize on page load
  function init() {
    // Display latest news
    const latest = getLatestNews();
    if (latest) displayNews(latest);

    // Set up click handler
    const newsBox = document.getElementById('world-news-box');
    if (newsBox) {
      newsBox.addEventListener('click', showNewsHistory);
    }

    // Auto-refresh every 5 minutes
    setInterval(async () => {
      const updated = await refreshNews();
      if (updated) displayNews(updated);
    }, NEWS_CACHE_TIME);
  }

  // Expose to window
  window.worldNewsSystem = {
    refreshNews,
    getLatestNews,
    getNewsHistory,
    selectNews,
    showNewsHistory,
  };

  // Init when DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
