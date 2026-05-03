/* ═══════════════════════════════════════════════════════
   WNCORE RADIO — admin.js
   Admin panel, Ctrl+A access, Signal Lost triggers
═══════════════════════════════════════════════════════ */

'use strict';

// ─── CONFIG ───────────────────────────────────────────────────────────────
// Load password from environment or use default (for demo)
// In production, use bcrypt hash verification
const ADMIN_CONFIG = {
  password: typeof process !== 'undefined' && process.env.ADMIN_PASSWORD 
    ? process.env.ADMIN_PASSWORD 
    : 'node09', // Demo password - change in production!
  ctrlAPressed: false,
  ctrlATimeout: null,
  maxLoginAttempts: 5,
  lockoutTime: 300000, // 5 minutes
  loginAttempts: 0,
  lockedOut: false,
  lockedOutUntil: null,
};

// ─── RATE LIMITING ────────────────────────────────────────────────────────
function checkLoginAttempts() {
  if (ADMIN_CONFIG.lockedOut && Date.now() < ADMIN_CONFIG.lockedOutUntil) {
    alert('Too many failed attempts. Try again in 5 minutes.');
    return false;
  }
  if (ADMIN_CONFIG.lockedOut && Date.now() >= ADMIN_CONFIG.lockedOutUntil) {
    ADMIN_CONFIG.lockedOut = false;
    ADMIN_CONFIG.loginAttempts = 0;
  }
  return true;
}

// ─── CTRL+A ADMIN ACCESS TRIGGER ──────────────────────────────────────────
document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'a') {
    e.preventDefault();
    ADMIN_CONFIG.ctrlAPressed = true;
    showAdminModal();
  }
});

function showAdminModal() {
  if (!checkLoginAttempts()) return;
  const modal = document.getElementById('admin-unlock-modal');
  modal.style.display = 'flex';
  document.getElementById('admin-password').focus();
}

function closeAdminModal() {
  document.getElementById('admin-unlock-modal').style.display = 'none';
  document.getElementById('admin-password').value = '';
  ADMIN_CONFIG.ctrlAPressed = false;
}

function checkAdminPassword() {
  if (!checkLoginAttempts()) return;
  
  const pass = document.getElementById('admin-password').value.trim();
  if (!pass) return;
  
  if (pass === ADMIN_CONFIG.password) {
    // Reset login attempts on success
    ADMIN_CONFIG.loginAttempts = 0;
    ADMIN_CONFIG.lockedOut = false;
    
    closeAdminModal();
    showPage('admin', null);
    document.querySelector('#admin-login-form').style.display = 'none';
    document.querySelector('#admin-dashboard').style.display = 'block';
    initAdminDashboard();
  } else {
    // Increment failed attempts
    ADMIN_CONFIG.loginAttempts++;
    document.getElementById('admin-password').style.borderColor = 'var(--accent)';
    
    if (ADMIN_CONFIG.loginAttempts >= ADMIN_CONFIG.maxLoginAttempts) {
      ADMIN_CONFIG.lockedOut = true;
      ADMIN_CONFIG.lockedOutUntil = Date.now() + ADMIN_CONFIG.lockoutTime;
      alert('Too many failed attempts. Try again later.');
      closeAdminModal();
    }
    
    setTimeout(() => {
      document.getElementById('admin-password').style.borderColor = '';
    }, 800);
  }
}

function logoutAdmin() {
  showPage('home', null);
  document.querySelector('#admin-login-form').style.display = 'block';
  document.querySelector('#admin-dashboard').style.display = 'none';
  document.getElementById('admin-password').value = '';
}

// Allow Enter key to submit
document.addEventListener('keydown', (e) => {
  const passwordInput = document.getElementById('admin-password');
  if (e.key === 'Enter' && document.getElementById('admin-unlock-modal').style.display === 'flex') {
    checkAdminPassword();
  }
});

// ─── SIGNAL LOST FLOATING BOX ─────────────────────────────────────────────
const SIGNAL_LOST_TRIGGERS = {
  clickableSectors: [],
  activeZones: new Set(),
};

// Initialize clickable zones that trigger Signal Lost anomaly
function initSignalLostZones() {
  // Certain areas when clicked will show Signal Lost notification
  document.querySelectorAll('.featured-card, .anime-station-card, .lm-card').forEach((el, idx) => {
    if (Math.random() < 0.15) {  // 15% of cards are "anomalous"
      el.dataset.isAnomalous = 'true';
      el.addEventListener('click', function(e) {
        if (this.dataset.isAnomalous === 'true' && Math.random() < 0.3) {
          triggerSignalLost();
        }
      });
    }
  });
  
  // Also trigger on certain navigation actions
  const nav = document.querySelectorAll('nav a, .mobile-nav a');
  nav.forEach((link, idx) => {
    if (idx % 7 === 0) {  // Every 7th link has anomaly potential
      link.addEventListener('click', function() {
        if (Math.random() < 0.08) {
          triggerSignalLost();
        }
      });
    }
  });
}

function triggerSignalLost() {
  const box = document.getElementById('signal-lost-box');
  if (!box) return;
  
  const messages = [
    'Frequency 88.7 MHz<br/>No carrier detected',
    'Signal anomaly detected<br/>Node 09 status unknown',
    'Transmission lost<br/>Attempting recovery...',
    'Carrier interrupted<br/>Source redacted',
    '——— SIGNAL LOST ———<br/>Please stand by',
  ];
  
  document.getElementById('signal-lost-message').innerHTML = messages[Math.floor(Math.random() * messages.length)];
  box.style.display = 'block';
  box.style.opacity = '1';
  
  // Auto-dismiss after 2.5 seconds
  setTimeout(() => {
    box.style.opacity = '0';
    setTimeout(() => {
      box.style.display = 'none';
    }, 300);
  }, 2500);
  
  // Bump exposure slightly if using wrongness system
  if (typeof exposure !== 'undefined') {
    exposure += 2;
  }
}

// Show Signal Lost on startup with low probability
function initSignalLostStartup() {
  if (Math.random() < 0.05) {  // 5% chance on page load
    setTimeout(() => {
      triggerSignalLost();
    }, Math.random() * 8000 + 3000);  // Delay 3-11 seconds
  }
}

// ─── ADMIN DASHBOARD ──────────────────────────────────────────────────────
let adminUpdateInterval = null;

function initAdminDashboard() {
  // Start updating dashboard metrics
  updateAdminMetrics();
  adminUpdateInterval = setInterval(updateAdminMetrics, 5000);
}

function updateAdminMetrics() {
  // Simulate system metrics
  const uptime = Math.floor(Math.random() * 600) + 200;  // Hours
  const listeners = Math.floor(Math.random() * 300000) + 100000;
  const coverage = (90 + Math.random() * 9).toFixed(1);
  
  const uptimeEl = document.getElementById('uptime-display');
  const listenersEl = document.getElementById('listeners-display');
  const coverageEl = document.getElementById('coverage-display');
  
  if (uptimeEl) uptimeEl.textContent = uptime + ' hours';
  if (listenersEl) listenersEl.textContent = listeners.toLocaleString();
  if (coverageEl) coverageEl.textContent = coverage + '%';
  
  // ARG element: occasionally glitch the display
  if (Math.random() < 0.08) {
    if (uptimeEl) uptimeEl.textContent = '██████ ██';
    setTimeout(() => {
      if (uptimeEl) uptimeEl.textContent = uptime + ' hours';
    }, 200);
  }
}

function stopAdminDashboard() {
  if (adminUpdateInterval) {
    clearInterval(adminUpdateInterval);
    adminUpdateInterval = null;
  }
}

// ─── INITIALIZATION ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initSignalLostZones();
  initSignalLostStartup();
  
  // Add small visual indicator for anomalous cards (very subtle - for ARG players)
  setTimeout(() => {
    document.querySelectorAll('[data-is-anomalous="true"]').forEach(el => {
      el.style.borderColor = 'rgba(200,71,42,' + (0.1 + Math.random() * 0.1).toFixed(2) + ')';
    });
  }, 1000);
});

// Clean up on page change
const originalShowPage = window.showPage || function(){};
window.showPage = function(id, linkEl) {
  if (id !== 'admin') {
    stopAdminDashboard();
  }
  if (typeof originalShowPage === 'function') {
    originalShowPage(id, linkEl);
  }
};
