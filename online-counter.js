// online-counter.js — Real-time Online User Counter
// Shows active users connected to WNCORE network

(function() {
  const ONLINE_KEY = 'wncore_online_users';
  const SESSION_ID = 'session_' + Math.random().toString(36).substr(2, 9);
  const HEARTBEAT_INTERVAL = 5000; // 5 seconds
  const SESSION_TIMEOUT = 15000; // 15 seconds

  // Get online count
  function getOnlineCount() {
    const sessions = JSON.parse(localStorage.getItem(ONLINE_KEY) || '{}');
    const now = Date.now();
    let active = 0;

    for (const [id, lastSeen] of Object.entries(sessions)) {
      if (now - lastSeen < SESSION_TIMEOUT) {
        active++;
      } else {
        delete sessions[id];
      }
    }

    localStorage.setItem(ONLINE_KEY, JSON.stringify(sessions));
    return active;
  }

  // Update session heartbeat
  function updateHeartbeat() {
    const sessions = JSON.parse(localStorage.getItem(ONLINE_KEY) || '{}');
    sessions[SESSION_ID] = Date.now();
    localStorage.setItem(ONLINE_KEY, JSON.stringify(sessions));
  }

  // Display counter
  function displayCounter() {
    const count = getOnlineCount();
    const display = document.getElementById('online-count');
    if (display) {
      display.textContent = String(count).padStart(2, '0');
    }
  }

  // Initialize
  function init() {
    // Register this session
    updateHeartbeat();

    // Display initial count
    displayCounter();

    // Update heartbeat every 5 seconds
    setInterval(updateHeartbeat, HEARTBEAT_INTERVAL);

    // Update display every 3 seconds
    setInterval(displayCounter, 3000);

    // Cross-tab sync via storage events
    window.addEventListener('storage', e => {
      if (e.key === ONLINE_KEY) {
        displayCounter();
      }
    });

    // Clean up on unload
    window.addEventListener('beforeunload', () => {
      const sessions = JSON.parse(localStorage.getItem(ONLINE_KEY) || '{}');
      delete sessions[SESSION_ID];
      localStorage.setItem(ONLINE_KEY, JSON.stringify(sessions));
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose to window
  window.onlineCounter = {
    getCount: getOnlineCount,
  };
})();
