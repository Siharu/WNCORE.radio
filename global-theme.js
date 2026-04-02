// global-theme.js — Universal Dark/Light Mode + Moon Theme
// Include in ALL HTML files: <script src="global-theme.js"></script>

(function() {
  // ════════════════════════════════════════════════════════
  // GLOBAL THEME SYSTEM
  // ════════════════════════════════════════════════════════
  
  const THEME_KEY = 'site_theme';
  const THEME_BUTTON_ID = 'global-theme-btn';
  
  // Initialize theme on page load
  function initTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY) || 'dark';
    applyTheme(savedTheme);
    
    // Create theme button if it doesn't exist
    if (!document.getElementById(THEME_BUTTON_ID)) {
      createThemeButton();
    } else {
      updateThemeButton(savedTheme);
    }
  }
  
  // Apply theme to document
  function applyTheme(theme) {
    if (theme === 'light') {
      document.body.classList.add('site-light');
      document.documentElement.classList.add('site-light');
    } else {
      document.body.classList.remove('site-light');
      document.documentElement.classList.remove('site-light');
    }
    localStorage.setItem(THEME_KEY, theme);
    updateThemeButton(theme);
  }
  
  // Toggle theme
  function toggleTheme() {
    const isLight = document.body.classList.contains('site-light');
    applyTheme(isLight ? 'dark' : 'light');
  }
  
  // Update button appearance
  function updateThemeButton(theme) {
    const btn = document.getElementById(THEME_BUTTON_ID);
    if (btn) {
      btn.textContent = theme === 'light' ? '●' : '◐';
      btn.title = theme === 'light' ? 'Dark mode' : 'Light mode';
    }
  }
  
  // Create theme button in header if it doesn't exist
  function createThemeButton() {
    // Try to find header
    const header = document.querySelector('header') || document.querySelector('[role="banner"]');
    if (header) {
      const btn = document.createElement('button');
      btn.id = THEME_BUTTON_ID;
      btn.className = 'global-theme-btn';
      btn.title = 'Toggle light/dark mode';
      btn.addEventListener('click', toggleTheme);
      
      // Add styling
      btn.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: transparent;
        border: 1px solid #330000;
        color: #660000;
        padding: 8px 12px;
        cursor: pointer;
        font-family: 'Space Mono', monospace;
        font-size: 1.2rem;
        transition: 0.2s;
        z-index: 999;
        border-radius: 2px;
      `;
      
      btn.addEventListener('mouseenter', () => {
        btn.style.borderColor = '#cc0000';
        btn.style.color = '#cc0000';
      });
      
      btn.addEventListener('mouseleave', () => {
        btn.style.borderColor = '#330000';
        btn.style.color = '#660000';
      });
      
      document.body.appendChild(btn);
    }
  }
  
  // Listen for theme changes from other tabs/windows
  window.addEventListener('storage', (e) => {
    if (e.key === THEME_KEY && e.newValue) {
      applyTheme(e.newValue);
    }
  });
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTheme);
  } else {
    initTheme();
  }
  
  // Expose to window for manual control
  window.toggleGlobalTheme = toggleTheme;
  window.setGlobalTheme = applyTheme;
})();
