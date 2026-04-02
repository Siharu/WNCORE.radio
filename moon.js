// moon.js — Visual Moon Element for Global Interface
// Include in pages with: <script src="moon.js"></script>
// Optional: <div id="moon-container"></div> in HTML

(function() {
  const MOON_CONTAINER_ID = 'celestial-display';
  
  // Create moon container if it doesn't exist
  function initMoon() {
    // Try to find or create container
    let container = document.getElementById(MOON_CONTAINER_ID);
    if (!container) {
      container = document.createElement('div');
      container.id = MOON_CONTAINER_ID;
      container.style.cssText = `
        position: fixed;
        top: 20px;
        left: 20px;
        width: 60px;
        height: 60px;
        z-index: 998;
        pointer-events: none;
      `;
      document.body.appendChild(container);
    }
    
    renderMoon(container);
  }
  
  // Render moon SVG
  function renderMoon(container) {
    container.innerHTML = `
      <svg viewBox="0 0 100 100" width="60" height="60" style="filter: drop-shadow(0 0 8px rgba(200,180,180,0.4));">
        <defs>
          <radialGradient id="moonGrad" cx="35%" cy="35%">
            <stop offset="0%" style="stop-color:#f5e6d3;stop-opacity:1" />
            <stop offset="70%" style="stop-color:#d4c5a9;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#8b7355;stop-opacity:1" />
          </radialGradient>
          <!-- Craters for detail -->
          <circle id="crater1" cx="35" cy="30" r="4" fill="#a89b89" opacity="0.6" />
          <circle id="crater2" cx="55" cy="45" r="3" fill="#a89b89" opacity="0.5" />
          <circle id="crater3" cx="45" cy="65" r="5" fill="#a89b89" opacity="0.4" />
        </defs>
        
        <!-- Moon disc -->
        <circle cx="50" cy="50" r="48" fill="url(#moonGrad)" stroke="#8b7355" stroke-width="1" opacity="0.85" />
        
        <!-- Craters -->
        <use href="#crater1" />
        <use href="#crater2" />
        <use href="#crater3" />
        
        <!-- Glow effect -->
        <circle cx="50" cy="50" r="48" fill="none" stroke="rgba(200,180,180,0.1)" stroke-width="3" />
      </svg>
    `;
  }
  
  // Respond to theme changes
  function updateMoonTheme() {
    const isLight = document.body.classList.contains('site-light');
    const container = document.getElementById(MOON_CONTAINER_ID);
    if (container) {
      const svg = container.querySelector('svg');
      if (svg) {
        const gradient = svg.querySelector('#moonGrad');
        if (isLight) {
          svg.style.filter = 'drop-shadow(0 0 8px rgba(100,100,100,0.3))';
          gradient.innerHTML = `
            <stop offset="0%" style="stop-color:#ffffff;stop-opacity:0.95" />
            <stop offset="70%" style="stop-color:#e8e0d0;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#9a8b7a;stop-opacity:1" />
          `;
        } else {
          svg.style.filter = 'drop-shadow(0 0 8px rgba(200,180,180,0.4))';
          gradient.innerHTML = `
            <stop offset="0%" style="stop-color:#f5e6d3;stop-opacity:1" />
            <stop offset="70%" style="stop-color:#d4c5a9;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#8b7355;stop-opacity:1" />
          `;
        }
      }
    }
  }
  
  // Listen for theme changes
  window.addEventListener('storage', (e) => {
    if (e.key === 'site_theme') {
      updateMoonTheme();
    }
  });
  
  // Watch for theme class changes
  const observer = new MutationObserver(() => {
    updateMoonTheme();
  });
  observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMoon);
  } else {
    initMoon();
  }
  
  // Expose to window
  window.updateMoon = updateMoonTheme;
})();
