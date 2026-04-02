// gallery-protection.js — Password-Protected Gallery System
// Two passwords: static and dynamic (SHADOW_KAGE tells dynamic in chat)
// Wrong password redirects to cat photo or Wikipedia page after 5 attempts

(function() {
  const STATIC_PASSWORD = 'jackiejackerjackingoffto991';
  const DYNAMIC_PASSWORD_KEY = 'wncore_gallery_dynamic_password';
  const ATTEMPTS_KEY = 'gallery_password_attempts';
  const MAX_ATTEMPTS = 5;

  // Check if already authenticated
  function isAuthenticated() {
    return sessionStorage.getItem('gallery_authenticated') === 'true';
  }

  // Verify password
  function verifyPassword(input) {
    const trimmed = input.trim();
    const dynamic = localStorage.getItem(DYNAMIC_PASSWORD_KEY);

    return trimmed === STATIC_PASSWORD || (dynamic && trimmed === dynamic);
  }

  // Get remaining attempts
  function getRemainingAttempts() {
    const attempts = parseInt(localStorage.getItem(ATTEMPTS_KEY) || '0');
    return Math.max(0, MAX_ATTEMPTS - attempts);
  }

  // Increment failed attempts
  function recordFailedAttempt() {
    const attempts = parseInt(localStorage.getItem(ATTEMPTS_KEY) || '0');
    localStorage.setItem(ATTEMPTS_KEY, attempts + 1);
    return getRemainingAttempts();
  }

  // Reset attempts on successful auth
  function resetAttempts() {
    localStorage.removeItem(ATTEMPTS_KEY);
  }

  // Random cat picture from API
  async function getRandomCatPicture() {
    try {
      const response = await fetch('https://api.thecatapi.com/v1/images/search');
      const data = await response.json();
      if (data[0]) {
        return data[0].url;
      }
    } catch (e) {
      console.error('Cat API error:', e);
    }
    // Fallback random cat
    return 'https://placekitten.com/800/600?' + Math.random();
  }

  // Redirect options on failed authentication
  async function handleFailedAuth() {
    const options = [
      {
        name: 'cat',
        action: async () => {
          const catUrl = await getRandomCatPicture();
          window.location.href = catUrl;
        },
      },
      {
        name: 'wikipedia',
        action: () => {
          window.location.href = 'https://en.wikipedia.org/wiki/Dunning%E2%80%93Kruger_effect';
        },
      },
      {
        name: 'home',
        action: () => {
          window.location.href = 'index.html';
        },
      },
    ];

    const chosen = options[Math.floor(Math.random() * options.length)];
    await chosen.action();
  }

  // Show password modal
  function showPasswordModal() {
    const modal = document.createElement('div');
    modal.id = 'gallery-password-modal';
    modal.style.cssText = `
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.95);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 99999;
      font-family: 'Space Mono', monospace;
    `;

    const remaining = getRemainingAttempts();
    const attemptsText = remaining > 0 ? `(${remaining} attempts left)` : '';

    modal.innerHTML = `
      <div style="
        border: 2px solid #330000;
        background: #000;
        padding: 30px;
        max-width: 400px;
        text-align: center;
        border-top: 3px solid #cc0000;
      ">
        <div style="
          font-size: 1.2rem;
          color: #cc0000;
          letter-spacing: 2px;
          margin-bottom: 20px;
          font-weight: bold;
        ">🔐 GALLERY ACCESS</div>
        
        <div style="
          font-size: 0.9rem;
          color: #880000;
          margin-bottom: 20px;
          line-height: 1.6;
        ">
          [AUTHORIZED PERSONALS ONLY]<br>
          Ask WNCORE editor SHADOW_KAGE<br>
          for your password via chat
        </div>

        <input 
          id="gallery-password-input" 
          type="password" 
          placeholder="ENTER PASSWORD..." 
          style="
            width: 100%;
            background: #040000;
            border: none;
            border-bottom: 1px solid #660000;
            color: #cc0000;
            font-family: 'Space Mono', monospace;
            padding: 10px 5px;
            font-size: 0.9rem;
            outline: none;
            margin-bottom: 20px;
          "
        >

        <div id="gallery-password-error" style="
          color: #330000;
          font-size: 0.8rem;
          margin-bottom: 15px;
          min-height: 16px;
        "></div>

        <button onclick="window.submitGalleryPassword()" style="
          width: 100%;
          padding: 12px;
          background: transparent;
          border: 1px solid #440000;
          color: #660000;
          font-family: 'Space Mono', monospace;
          font-size: 0.9rem;
          cursor: pointer;
          letter-spacing: 1px;
          transition: 0.2s;
          margin-bottom: 10px;
        " onmouseover="this.style.borderColor='#cc0000';this.style.color='#cc0000'" onmouseout="this.style.borderColor='#440000';this.style.color='#660000'">
          ▶ VERIFY
        </button>

        <div style="
          font-size: 0.75rem;
          color: #330000;
          letter-spacing: 1px;
        ">
          ${attemptsText}
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    document.getElementById('gallery-password-input').focus();
    document.getElementById('gallery-password-input').addEventListener('keydown', e => {
      if (e.key === 'Enter') window.submitGalleryPassword();
    });
  }

  // Submit password
  window.submitGalleryPassword = function() {
    const input = document.getElementById('gallery-password-input');
    const error = document.getElementById('gallery-password-error');

    if (verifyPassword(input.value)) {
      resetAttempts();
      sessionStorage.setItem('gallery_authenticated', 'true');
      document.getElementById('gallery-password-modal').remove();
      // Reload to show gallery content
      location.reload();
    } else {
      const remaining = recordFailedAttempt();

      if (remaining <= 0) {
        error.textContent = '// ACCESS DENIED — Redirecting...';
        setTimeout(() => handleFailedAuth(), 2000);
      } else {
        error.textContent = `// WRONG USER — ${remaining} attempts left`;
        input.value = '';
      }
    }
  };

  // Set dynamic password (called by chat or admin)
  window.setGalleryDynamicPassword = function(password) {
    localStorage.setItem(DYNAMIC_PASSWORD_KEY, password);
    // Password set securely (no console output)
  };

  // Check protection on page load
  function init() {
    if (!isAuthenticated() && window.location.pathname.includes('gallery.html')) {
      showPasswordModal();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose status
  window.galleryAuth = {
    isAuthenticated,
    getRemainingAttempts,
    setDynamicPassword: window.setGalleryDynamicPassword,
  };
})();
