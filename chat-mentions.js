// chat-mentions.js — @ Mention System for Chat
// Allows users to mention SHADOW_KAGE, Siharu847, or AI characters
// Shows autocomplete suggestions and @ mention button

(function() {
  const MENTIONABLE_USERS = {
    SHADOW_KAGE: {
      role: 'AI Network Operator',
      icon: '🤖',
      description: 'Primary AI system monitor',
    },
    Siharu847: {
      role: 'WNCORE Editor',
      icon: '👤',
      description: 'Website archive manager',
    },
    Lars: { role: 'Survivor', icon: '🎖️', description: 'Supply coordinator' },
    Zahara: { role: 'Courier', icon: '📡', description: 'Signal specialist' },
    Mateo_23: { role: 'Researcher', icon: '📚', description: 'Variant expert' },
    'Ji-Woo': { role: 'Navigator', icon: '🗺️', description: 'Zone scout' },
    Finn: { role: 'Medic', icon: '⚕️', description: 'Health specialist' },
    Dmitri: { role: 'Security', icon: '🔒', description: 'Network defense' },
    Suhana: { role: 'Logistics', icon: '📦', description: 'Resource manager' },
    Ingrid: { role: 'Analyst', icon: '📊', description: 'Data specialist' },
    Yuki: { role: 'Operator', icon: '💻', description: 'Tech specialist' },
    Amara: { role: 'Leader', icon: '👑', description: 'Network coordinator' },
  };

  // Create mention suggestion box
  function createMentionSuggestions() {
    const box = document.createElement('div');
    box.id = 'mention-suggestions';
    box.style.cssText = `
      position: absolute;
      background: #000;
      border: 1px solid #330000;
      color: #cc0000;
      font-family: 'Space Mono', monospace;
      font-size: 0.8rem;
      max-height: 200px;
      overflow-y: auto;
      z-index: 1000;
      display: none;
      min-width: 200px;
    `;
    document.body.appendChild(box);
    return box;
  }

  // Create @ button in chat
  function createMentionButton() {
    const btn = document.createElement('button');
    btn.id = 'chat-mention-btn';
    btn.textContent = '@';
    btn.title = 'Mention a user';
    btn.style.cssText = `
      background: transparent;
      border: 1px solid #330000;
      color: #660000;
      padding: 8px 10px;
      cursor: pointer;
      font-family: 'Space Mono', monospace;
      font-size: 0.9rem;
      transition: 0.2s;
      margin-right: 5px;
    `;

    btn.addEventListener('mouseover', () => {
      btn.style.borderColor = '#cc0000';
      btn.style.color = '#cc0000';
    });

    btn.addEventListener('mouseout', () => {
      btn.style.borderColor = '#330000';
      btn.style.color = '#660000';
    });

    btn.addEventListener('click', showMentionPicker);

    return btn;
  }

  // Show user picker modal
  function showMentionPicker() {
    const modal = document.createElement('div');
    modal.id = 'mention-picker-modal';
    modal.style.cssText = `
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.9);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      font-family: 'Space Mono', monospace;
    `;

    const userList = Object.entries(MENTIONABLE_USERS)
      .map(
        ([name, info]) => `
      <div onclick="window.insertMention('${name}')" style="
        padding: 12px;
        border-bottom: 1px solid #1a0000;
        cursor: pointer;
        transition: 0.2s;
      " onmouseover="this.style.backgroundColor='#1a0000'" onmouseout="this.style.backgroundColor='transparent'">
        <div style="font-weight: bold; color: #cc0000;">${info.icon} ${name}</div>
        <div style="color: #880000; font-size: 0.75rem;">${info.role} — ${info.description}</div>
      </div>
    `
      )
      .join('');

    modal.innerHTML = `
      <div style="
        border: 2px solid #330000;
        background: #000;
        padding: 0;
        max-width: 350px;
        max-height: 500px;
        overflow-y: auto;
        border-top: 3px solid #cc0000;
      ">
        <div style="
          padding: 15px;
          border-bottom: 1px solid #1a0000;
          font-size: 0.9rem;
          color: #cc0000;
          letter-spacing: 2px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: sticky;
          top: 0;
          background: #050000;
        ">
          <span>@ MENTION USER</span>
          <button onclick="document.getElementById('mention-picker-modal').remove()" style="
            background: transparent;
            border: 1px solid #330000;
            color: #550000;
            cursor: pointer;
            padding: 5px 10px;
            font-family: 'Space Mono', monospace;
          ">✕</button>
        </div>
        <div>${userList}</div>
      </div>
    `;

    document.body.appendChild(modal);
  }

  // Insert mention into chat input
  window.insertMention = function(userName) {
    const input = document.getElementById('msg-input') || document.querySelector('input[placeholder*="message"]');
    if (input) {
      const cursor = input.selectionStart;
      const text = input.value;
      const before = text.substring(0, cursor);
      const after = text.substring(cursor);
      input.value = before + `@${userName} ` + after;
      input.focus();
      input.setSelectionRange(cursor + userName.length + 2, cursor + userName.length + 2);
    }
    document.getElementById('mention-picker-modal')?.remove();
  };

  // Handle @ autocomplete in input
  function setupAutocomplete() {
    const input = document.getElementById('msg-input') || document.querySelector('input[placeholder*="message"]');
    if (!input) return;

    const suggestions = createMentionSuggestions();

    input.addEventListener('input', e => {
      const text = input.value;
      const lastWord = text.split(/\s+/).pop();

      if (lastWord.startsWith('@')) {
        const query = lastWord.substring(1).toUpperCase();
        const matches = Object.keys(MENTIONABLE_USERS).filter(u =>
          u.toUpperCase().includes(query),
        );

        if (matches.length > 0) {
          const pos = input.getBoundingClientRect();
          suggestions.style.left = pos.left + 'px';
          suggestions.style.top = pos.bottom + 10 + 'px';
          suggestions.style.display = 'block';

          suggestions.innerHTML = matches
            .map(
              m => `
            <div onclick="window.completeMention('${m}')" style="
              padding: 10px 15px;
              border-bottom: 1px solid #1a0000;
              cursor: pointer;
              transition: 0.2s;
            " onmouseover="this.style.backgroundColor='#1a0000'" onmouseout="this.style.backgroundColor='transparent'">
              <div style="color: #cc0000;">${MENTIONABLE_USERS[m].icon} ${m}</div>
              <div style="color: #660000; font-size: 0.7rem;">${MENTIONABLE_USERS[m].role}</div>
            </div>
          `
            )
            .join('');
        } else {
          suggestions.style.display = 'none';
        }
      } else {
        suggestions.style.display = 'none';
      }
    });

    input.addEventListener('blur', () => {
      setTimeout(() => (suggestions.style.display = 'none'), 200);
    });
  }

  // Complete mention from autocomplete
  window.completeMention = function(userName) {
    const input = document.getElementById('msg-input') || document.querySelector('input[placeholder*="message"]');
    if (input) {
      const text = input.value;
      const lastAtIndex = text.lastIndexOf('@');
      if (lastAtIndex !== -1) {
        const before = text.substring(0, lastAtIndex);
        const after = text.substring(text.indexOf(' ', lastAtIndex));
        input.value = before + `@${userName}` + after;
      }
    }
    document.getElementById('mention-suggestions').style.display = 'none';
  };

  // Initialize
  function init() {
    // Add @ button near chat input
    const chatControls = document.querySelector('.chat-controls') || document.querySelector('[id*="chat"]');
    if (chatControls) {
      const btn = createMentionButton();
      chatControls.prepend(btn);
    }

    // Set up autocomplete
    setupAutocomplete();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose system
  window.mentionSystem = {
    users: MENTIONABLE_USERS,
    insertMention: window.insertMention,
    completeMention: window.completeMention,
  };
})();
