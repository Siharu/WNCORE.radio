// site-logs.js — Public log drawer, admin-only edit
// Fixed date handling and proper update functionality

(function() {
  const ADMIN_USER = 'theMainauthor345';
  const ADMIN_PASS = 'illgetoutofthisworld275745397';

  let isAdmin = false;
  let logs = [];
  let drawerOpen = false;

  // ── Check if admin already logged in ─────────────────────
  function checkAdminStatus() {
    const u = localStorage.getItem('chapters_admin_user') || '';
    if (u === ADMIN_USER) { isAdmin = true; return true; }
    const sess = sessionStorage.getItem('logs_admin');
    if (sess === '1') { isAdmin = true; return true; }
    return false;
  }

  // ── Load/save logs from localStorage ─────────────────────
  function loadLogs() {
    try {
      const raw = localStorage.getItem('site_logs_data');
      logs = raw ? JSON.parse(raw) : getDefaultLogs();
    } catch {
      logs = getDefaultLogs();
    }
  }

  function saveLogs() {
    try {
      localStorage.setItem('site_logs_data', JSON.stringify(logs));
      console.log('Logs saved:', logs.length);
    } catch(e) {
      console.error('Error saving logs:', e);
    }
  }

  function getDefaultLogs() {
    return [
      {
        id: Date.now(),
        date: '2032-03-31',
        title: 'SITE INITIALIZED',
        content: 'WNCORE archive established. Signal active on 88.7. Waiting.',
      },
      {
        id: Date.now()-1,
        date: '2032-04-05',
        title: 'OUTBREAK BEGINS',
        content: 'Nepal reports confirmed. Signal spreading. Obsedia rain detected globally. Archive documenting everything.',
      },
    ];
  }

  // ── Inject styles ─────────────────────────────────────────
  function injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
      #site-logs-tab {
        position: fixed;
        bottom: 28px;
        left: 80px;
        z-index: 4000;
        background: #040000;
        border: 1px solid #2a0000;
        border-bottom: 2px solid #cc0000;
        color: #550000;
        font-family: 'Space Mono', monospace;
        font-size: 0.34rem;
        padding: 4px 9px;
        cursor: pointer;
        letter-spacing: 2px;
        transition: 0.2s;
        user-select: none;
        white-space: nowrap;
      }
      #site-logs-tab:hover {
        border-color: #cc0000;
        color: #cc0000;
        box-shadow: 0 0 8px rgba(255,0,0,0.2);
      }

      #site-logs-drawer {
        position: fixed;
        bottom: 56px;
        left: 80px;
        z-index: 4001;
        width: min(320px, 90vw);
        max-height: 400px;
        background: #030000;
        border: 1px solid #330000;
        border-top: 2px solid #cc0000;
        display: flex;
        flex-direction: column;
        font-family: 'Space Mono', monospace;
        box-shadow: 0 0 24px rgba(255,0,0,0.12);
        opacity: 0;
        pointer-events: none;
        transform: translateY(8px);
        transition: opacity 0.2s, transform 0.2s;
      }
      #site-logs-drawer.open {
        opacity: 1;
        pointer-events: all;
        transform: translateY(0);
      }

      .slg-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 7px 10px;
        background: #060000;
        border-bottom: 1px solid #1a0000;
        flex-shrink: 0;
      }
      .slg-header-title {
        font-size: 0.4rem;
        color: #cc0000;
        letter-spacing: 2px;
      }
      .slg-header-right {
        display: flex;
        gap: 5px;
        align-items: center;
      }
      .slg-admin-btn {
        background: transparent;
        border: 1px solid #330000;
        color: #440000;
        font-family: 'Space Mono', monospace;
        font-size: 0.34rem;
        padding: 2px 7px;
        cursor: pointer;
        letter-spacing: 1px;
        transition: 0.15s;
      }
      .slg-admin-btn:hover { border-color: #880000; color: #880000; }
      .slg-admin-btn.active { border-color: #cc0000; color: #cc0000; }

      .slg-body {
        flex: 1;
        overflow-y: auto;
        padding: 8px;
        display: flex;
        flex-direction: column;
        gap: 6px;
        scrollbar-width: thin;
        scrollbar-color: #330000 transparent;
      }

      .log-entry {
        background: #060000;
        border: 1px solid #1a0000;
        border-left: 2px solid #440000;
        padding: 7px 9px;
        position: relative;
      }
      .log-entry:hover { border-left-color: #880000; }

      .log-date {
        font-size: 0.32rem;
        color: #440000;
        letter-spacing: 2px;
        margin-bottom: 3px;
      }
      .log-title {
        font-size: 0.42rem;
        color: #cc0000;
        letter-spacing: 1px;
        margin-bottom: 4px;
      }
      .log-content {
        font-size: 0.38rem;
        color: #886666;
        line-height: 1.65;
      }

      .log-edit-btn {
        position: absolute;
        top: 5px;
        right: 5px;
        background: transparent;
        border: none;
        color: #330000;
        font-family: 'Space Mono', monospace;
        font-size: 0.3rem;
        cursor: pointer;
        padding: 2px 4px;
        display: none;
        transition: 0.15s;
      }
      .log-edit-btn:hover { color: #cc0000; }
      .log-entry.admin-mode .log-edit-btn { display: block; }

      /* Add log form */
      .slg-add-form {
        display: none;
        flex-direction: column;
        gap: 6px;
        padding: 8px;
        border-top: 1px solid #1a0000;
        background: #040000;
        flex-shrink: 0;
      }
      .slg-add-form.visible { display: flex; }
      .slg-input, .slg-textarea {
        background: #000;
        border: none;
        border-bottom: 1px solid #440000;
        color: #cc8888;
        font-family: 'Space Mono', monospace;
        font-size: 0.42rem;
        padding: 5px 6px;
        outline: none;
        letter-spacing: 1px;
        width: 100%;
        box-sizing: border-box;
      }
      .slg-textarea {
        border: 1px solid #1a0000;
        resize: none;
        height: 60px;
        line-height: 1.5;
      }
      .slg-textarea:focus, .slg-input:focus { border-bottom-color: #ff0000; }
      .slg-input::placeholder, .slg-textarea::placeholder { color: #330000; font-size: 0.36rem; }
      .slg-form-row { display: flex; gap: 5px; }
      .slg-form-row .slg-input { flex: 1; }
      .slg-submit {
        background: transparent;
        border: 1px solid #cc0000;
        color: #cc0000;
        font-family: 'Space Mono', monospace;
        font-size: 0.38rem;
        padding: 5px 10px;
        cursor: pointer;
        letter-spacing: 1px;
        transition: 0.15s;
        white-space: nowrap;
      }
      .slg-submit:hover { background: rgba(200,0,0,0.12); }

      /* Edit modal */
      #slg-edit-modal {
        display: none;
        position: fixed;
        inset: 0;
        z-index: 9500;
        background: rgba(0,0,0,0.95);
        align-items: center;
        justify-content: center;
        padding: 16px;
        font-family: 'Space Mono', monospace;
      }
      #slg-edit-modal.open { display: flex; }
      .slg-edit-box {
        width: min(340px, 96vw);
        background: #040000;
        border: 1px solid #440000;
        border-top: 2px solid #cc0000;
        padding: 20px;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      .slg-edit-title { font-size: 0.46rem; color: #cc0000; letter-spacing: 2px; }
      .slg-edit-actions { display: flex; gap: 7px; margin-top: 4px; }
      .slg-delete-btn {
        background: transparent;
        border: 1px solid #440000;
        color: #660000;
        font-family: 'Space Mono', monospace;
        font-size: 0.38rem;
        padding: 6px 10px;
        cursor: pointer;
        transition: 0.15s;
      }
      .slg-delete-btn:hover { border-color: #ff0000; color: #ff0000; }

      /* Login for logs admin */
      #slg-login-modal {
        display: none;
        position: fixed;
        inset: 0;
        z-index: 9500;
        background: rgba(0,0,0,0.96);
        align-items: center;
        justify-content: center;
        padding: 16px;
        font-family: 'Space Mono', monospace;
      }
      #slg-login-modal.open { display: flex; }
      .slg-login-box {
        width: min(280px, 90vw);
        background: #040000;
        border: 1px solid #440000;
        border-top: 2px solid #cc0000;
        padding: 20px;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      .slg-login-title { font-size: 0.46rem; color: #cc0000; letter-spacing: 2px; }
      .slg-login-error { font-size: 0.36rem; color: #ff0000; min-height: 14px; letter-spacing: 1px; }
      .slg-login-row { display: flex; gap: 7px; }

      @media(max-width:600px) {
        #site-logs-tab { left: 70px; bottom: 20px; font-size: 0.3rem; padding: 3px 7px; }
        #site-logs-drawer { left: 10px; width: calc(100vw - 20px); bottom: 50px; }
      }
    `;
    document.head.appendChild(style);
  }

  // ── Build drawer HTML ─────────────────────────────────────
  function buildDrawer() {
    // Tab
    const tab = document.createElement('div');
    tab.id = 'site-logs-tab';
    tab.textContent = '[SITE_LOGS]';
    tab.onclick = toggleDrawer;
    document.body.appendChild(tab);

    // Drawer
    const drawer = document.createElement('div');
    drawer.id = 'site-logs-drawer';
    drawer.innerHTML = `
      <div class="slg-header">
        <span class="slg-header-title">SITE_LOGS</span>
        <div class="slg-header-right">
          <span id="slg-mode-label" style="font-size:0.32rem;color:#330000;letter-spacing:1px;">VIEW ONLY</span>
          <button class="slg-admin-btn" id="slg-auth-btn" onclick="siteLogsAuth()">⚡ EDIT</button>
        </div>
      </div>
      <div class="slg-body" id="slg-body"></div>
      <div class="slg-add-form" id="slg-add-form">
        <div class="slg-form-row">
          <input type="date" class="slg-input" id="slg-new-date" style="max-width:130px;" />
          <input type="text" class="slg-input" id="slg-new-title" placeholder="LOG TITLE..." maxlength="60" />
        </div>
        <textarea class="slg-textarea" id="slg-new-content" placeholder="Log entry content..."></textarea>
        <div style="display:flex;gap:6px;">
          <button class="slg-submit" onclick="siteLogsAdd()">▶ ADD LOG</button>
          <button class="slg-submit" onclick="siteLogsLogout()" style="border-color:#440000;color:#440000;">LOGOUT</button>
        </div>
      </div>
    `;
    document.body.appendChild(drawer);

    // Edit modal
    const editModal = document.createElement('div');
    editModal.id = 'slg-edit-modal';
    editModal.innerHTML = `
      <div class="slg-edit-box">
        <div class="slg-edit-title">EDIT LOG ENTRY</div>
        <input type="date" class="slg-input" id="slg-edit-date" />
        <input type="text" class="slg-input" id="slg-edit-title-inp" placeholder="Title..." maxlength="60" />
        <textarea class="slg-textarea" id="slg-edit-content" style="height:80px;"></textarea>
        <div class="slg-edit-actions">
          <button class="slg-submit" onclick="siteLogsSaveEdit()">▶ SAVE</button>
          <button class="slg-delete-btn" onclick="siteLogsDelete()">DELETE</button>
          <button class="slg-delete-btn" onclick="document.getElementById('slg-edit-modal').classList.remove('open')">CANCEL</button>
        </div>
      </div>
    `;
    document.body.appendChild(editModal);

    // Login modal
    const loginModal = document.createElement('div');
    loginModal.id = 'slg-login-modal';
    loginModal.innerHTML = `
      <div class="slg-login-box">
        <div class="slg-login-title">⚡ OPERATOR AUTH</div>
        <input type="text" class="slg-input" id="slg-login-user" placeholder="OPERATOR ID..." autocomplete="off" spellcheck="false" />
        <input type="password" class="slg-input" id="slg-login-pass" placeholder="AUTH KEY..." autocomplete="off" />
        <div class="slg-login-error" id="slg-login-error"></div>
        <div class="slg-login-row">
          <button class="slg-submit" onclick="siteLogsSubmitAuth()">▶ AUTH</button>
          <button class="slg-delete-btn" onclick="document.getElementById('slg-login-modal').classList.remove('open')">CANCEL</button>
        </div>
      </div>
    `;
    document.body.appendChild(loginModal);

    // Enter key on login
    document.getElementById('slg-login-pass')?.addEventListener('keydown', e => {
      if (e.key === 'Enter') siteLogsSubmitAuth();
    });

    renderLogs();
  }

  // ── Render logs ───────────────────────────────────────────
  function renderLogs() {
    const body = document.getElementById('slg-body');
    if (!body) return;

    const sorted = [...logs].sort((a,b) => new Date(b.date) - new Date(a.date));

    if (!sorted.length) {
      body.innerHTML = '<div style="font-size:0.38rem;color:#220000;padding:10px;letter-spacing:1px;">No logs yet.</div>';
      return;
    }

    body.innerHTML = sorted.map(log => `
      <div class="log-entry ${isAdmin ? 'admin-mode' : ''}" data-id="${log.id}">
        <div class="log-date">${log.date}</div>
        <div class="log-title">${escHtml(log.title)}</div>
        <div class="log-content">${escHtml(log.content)}</div>
        <button class="log-edit-btn" onclick="siteLogsOpenEdit(${log.id})">✎ EDIT</button>
      </div>
    `).join('');
  }

  function escHtml(s) {
    return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  // ── Toggle drawer ─────────────────────────────────────────
  function toggleDrawer() {
    drawerOpen = !drawerOpen;
    const drawer = document.getElementById('site-logs-drawer');
    if (drawer) drawer.classList.toggle('open', drawerOpen);
    if (drawerOpen) {
      checkAdminStatus();
      updateAdminUI();
    }
  }

  function updateAdminUI() {
    const form   = document.getElementById('slg-add-form');
    const label  = document.getElementById('slg-mode-label');
    const authBtn= document.getElementById('slg-auth-btn');
    if (!form) return;
    if (isAdmin) {
      form.classList.add('visible');
      if (label) label.textContent = '⚡ OPERATOR';
      if (label) label.style.color = '#cc0000';
      if (authBtn) { authBtn.textContent = 'EDIT ON'; authBtn.classList.add('active'); }
      const today = new Date().toISOString().split('T')[0];
      const dateEl = document.getElementById('slg-new-date');
      if (dateEl && !dateEl.value) dateEl.value = today;
      renderLogs();
    } else {
      form.classList.remove('visible');
      if (label) label.textContent = 'VIEW ONLY';
      if (label) label.style.color = '#330000';
      if (authBtn) { authBtn.textContent = '⚡ EDIT'; authBtn.classList.remove('active'); }
    }
  }

  // ── Auth ──────────────────────────────────────────────────
  window.siteLogsAuth = function() {
    if (isAdmin) return;
    document.getElementById('slg-login-modal')?.classList.add('open');
    setTimeout(() => document.getElementById('slg-login-user')?.focus(), 100);
  };

  window.siteLogsSubmitAuth = function() {
    const u = document.getElementById('slg-login-user')?.value.trim();
    const p = document.getElementById('slg-login-pass')?.value.trim();
    const err = document.getElementById('slg-login-error');
    if (u === ADMIN_USER && p === ADMIN_PASS) {
      isAdmin = true;
      sessionStorage.setItem('logs_admin', '1');
      localStorage.setItem('chapters_admin_user', u); // Cross-sync
      document.getElementById('slg-login-modal')?.classList.remove('open');
      updateAdminUI();
    } else {
      if (err) { err.textContent = '// ACCESS DENIED'; setTimeout(() => err.textContent='', 2000); }
    }
  };

  window.siteLogsLogout = function() {
    isAdmin = false;
    sessionStorage.removeItem('logs_admin');
    updateAdminUI();
  };

  // ── Add log ───────────────────────────────────────────────
  window.siteLogsAdd = function() {
    if (!isAdmin) return;
    const date    = document.getElementById('slg-new-date')?.value;
    const title   = document.getElementById('slg-new-title')?.value.trim();
    const content = document.getElementById('slg-new-content')?.value.trim();
    
    if (!date || !title || !content) {
      alert('All fields required');
      return;
    }
    
    logs.unshift({ id: Date.now(), date, title, content });
    saveLogs();
    renderLogs();
    
    // Clear form
    document.getElementById('slg-new-title').value = '';
    document.getElementById('slg-new-content').value = '';
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('slg-new-date').value = today;
  };

  // ── Edit ──────────────────────────────────────────────────
  let editingId = null;
  window.siteLogsOpenEdit = function(id) {
    if (!isAdmin) return;
    const log = logs.find(l => l.id == id);
    if (!log) return;
    editingId = id;
    document.getElementById('slg-edit-date').value = log.date;
    document.getElementById('slg-edit-title-inp').value = log.title;
    document.getElementById('slg-edit-content').value = log.content;
    document.getElementById('slg-edit-modal').classList.add('open');
  };

  window.siteLogsSaveEdit = function() {
    if (!isAdmin || !editingId) return;
    const log = logs.find(l => l.id == editingId);
    if (!log) return;
    
    log.date    = document.getElementById('slg-edit-date').value;
    log.title   = document.getElementById('slg-edit-title-inp').value.trim();
    log.content = document.getElementById('slg-edit-content').value.trim();
    
    saveLogs();
    renderLogs();
    document.getElementById('slg-edit-modal').classList.remove('open');
    editingId = null;
  };

  window.siteLogsDelete = function() {
    if (!isAdmin || !editingId) return;
    if (!confirm('Delete this log entry?')) return;
    
    logs = logs.filter(l => l.id != editingId);
    saveLogs();
    renderLogs();
    document.getElementById('slg-edit-modal').classList.remove('open');
    editingId = null;
  };

  // ── Init ──────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    loadLogs();
    checkAdminStatus();
    injectStyles();
    buildDrawer();
  });

})();
