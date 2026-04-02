// chat.js — WNCORE Signal Chat v4
// Panel fixed left-middle | No drag | Mobile safe | Logo stays left

const SUPABASE_URL  = window.SUPABASE_URL  || '';
const SUPABASE_ANON = window.SUPABASE_ANON || '';
const WNCORE_USER   = 'Siharu847';
const WNCORE_PASS   = 'iwishiwasthere5555';

const ADJ  = ['hollow','static','broken','signal','rainy','neon','shadow','ghost','rusty','cursed','misty','fallen','echo','void','drift','pale','silent','ashen','lost','dead'];
const NOUN = ['drifter','walker','sender','watcher','runner','seeker','bearer','caller','keeper','wanderer','lurker','signal','carrier','remnant','survivor','echo','trace','shard','ember','voice'];
function genUser() {
  return ADJ[Math.floor(Math.random()*ADJ.length)] +
         NOUN[Math.floor(Math.random()*NOUN.length)] +
         (Math.floor(Math.random()*99)+1);
}

let sb             = null;
let me             = null;
let isAdmin        = false;
let wncoreUnlocked = false;
let room           = null;
let roomType       = 'global';
let rtChannel      = null;
let panelOpen      = false;
let isFullscreen   = false;
let history        = [];
let unread         = 0;
let tvAnimFrame    = null;

function initSB() {
  if (typeof window.supabase !== 'undefined' && SUPABASE_URL && SUPABASE_ANON) {
    sb = window.sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON);
  }
}

function getUser() {
  let u = localStorage.getItem('chat_user');
  if (!u) { u = genUser(); localStorage.setItem('chat_user', u); }
  if (u === WNCORE_USER) { isAdmin = true; wncoreUnlocked = true; }
  return u;
}

// ── DOM Injection ─────────────────────────────────────────────
function inject() {
  const html = `
  <div id="chat-toggle-btn" title="WNCORE Signal Chat">
    <img src="images/wncorelogo.png" alt="W" onerror="this.style.display='none'" />
    <div id="chat-unread-badge"></div>
  </div>

  <div id="chat-panel" class="chat-hidden">
    <div id="chat-header">
      <div id="chat-header-left">
        <img src="images/wncorelogo.png" alt="W" id="chat-header-logo" onerror="this.style.display='none'" />
        <span id="chat-room-name">GLOBAL SIGNAL</span>
        <div id="chat-status-dot"></div>
      </div>
      <div id="chat-header-right">
        <button class="chat-hdr-btn" id="chat-fs-btn" title="Fullscreen">⛶</button>
        <button class="chat-hdr-btn" id="chat-close-btn" title="Close">✕</button>
      </div>
    </div>

    <div id="chat-toolbar">
      <button class="theme-switch-btn active" data-theme="wncore">WNCORE</button>
      <button class="theme-switch-btn" data-theme="classic">CLASSIC</button>
      <button class="theme-switch-btn" data-theme="bunker">BUNKER</button>
      <button class="theme-switch-btn" data-theme="signal">SIGNAL</button>
      <span class="toolbar-spacer"></span>
      <input type="color" id="color-custom" value="#ff0000" title="Custom" />
    </div>

    <div id="chat-tabs">
      <button class="chat-tab active" data-room="global"  data-type="global">🌐 GLOBAL</button>
      <button class="chat-tab"        data-room="wncore"  data-type="wncore">📡 WNCORE</button>
      <button class="chat-tab"        data-room="private" data-type="private">🔒 PRIVATE</button>
    </div>

    <div id="private-setup">
      <input id="private-room-input" placeholder="ROOM CODE..." maxlength="24" />
      <label class="gone-row">
        <input type="checkbox" id="gone-toggle" />
        <span>GONE MODE</span><span class="gone-note">(vanish on exit)</span>
      </label>
      <button id="private-join-btn">▶ JOIN</button>
    </div>

    <div id="wncore-login">
      <div class="wncore-login-title">⚡ OPERATOR AUTH</div>
      <input type="text"     id="wncore-user-input" placeholder="OPERATOR ID..."  autocomplete="off" spellcheck="false" />
      <input type="password" id="wncore-pass-input" placeholder="AUTH KEY..."     autocomplete="off" />
      <button id="wncore-auth-btn">AUTHENTICATE</button>
      <div id="wncore-auth-error"></div>
    </div>

    <div id="chat-userbar">
      <span id="chat-username"></span>
      <span id="chat-roomtag"></span>
    </div>

    <div id="chat-messages"></div>

    <div id="chat-typing">
      <span id="chat-typing-name"></span>
      <span class="typing-dots"><span>.</span><span>.</span><span>.</span></span>
    </div>

    <div id="wncore-viewonly">
      <span class="viewonly-text">👁 VIEW ONLY — WNCORE RESTRICTED</span>
    </div>

    <div id="chat-input-area">
      <input id="chat-input" placeholder="TRANSMIT..." maxlength="500"
             autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"
             enterkeyhint="send" inputmode="text" />
      <button id="chat-send-btn">▶</button>
    </div>
  </div>

  <div id="retro-tv">
    <div class="tv-body">
      <div class="tv-screen-wrap">
        <canvas id="tv-canvas"></canvas>
        <div class="tv-screen-glare"></div>
      </div>
      <div class="tv-label">SIGNAL TV</div>
      <div class="tv-knobs"><div class="tv-knob"></div><div class="tv-knob"></div></div>
    </div>
  </div>

  <div id="tv-fullscreen">
    <canvas id="tv-fullscreen-canvas"></canvas>
    <button id="tv-close-btn">✕ CLOSE</button>
  </div>

  <div id="news-ticker-wrap">
    <div class="ticker-label">📡 WNCORE</div>
    <div class="ticker-track">
      <div class="ticker-inner" id="ticker-inner"></div>
    </div>
  </div>
  `;

  const wrap = document.createElement('div');
  wrap.id = 'chat-wrapper';
  wrap.innerHTML = html;
  document.body.appendChild(wrap);

  initTicker();

  const t = localStorage.getItem('chat_theme') || 'wncore';
  applyTheme(t);

  bindEvents();

  const el = document.getElementById('chat-username');
  if (el) el.textContent = isAdmin ? me + ' ⚡' : me;
}

function initTicker() {
  const inner = document.getElementById('ticker-inner');
  if (!inner || inner.children.length > 0) return;
  if (window.buildTickerHTML) inner.innerHTML = window.buildTickerHTML();
}

// ── TV Static ─────────────────────────────────────────────────
function startTVStatic(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  function draw() {
    canvas.width  = canvas.offsetWidth  || 100;
    canvas.height = canvas.offsetHeight || 75;
    const img = ctx.createImageData(canvas.width, canvas.height);
    const d   = img.data;
    for (let i = 0; i < d.length; i += 4) {
      const v = Math.random() > 0.5 ? Math.floor(Math.random()*75) : 0;
      d[i]=v?Math.min(v+50,180):0; d[i+1]=0; d[i+2]=0; d[i+3]=220;
    }
    ctx.putImageData(img, 0, 0);
    if (Math.random() > 0.88) {
      const y = Math.floor(Math.random()*canvas.height);
      ctx.fillStyle=`rgba(255,0,0,${Math.random()*0.4})`;
      ctx.fillRect(0,y,canvas.width,1+Math.floor(Math.random()*3));
    }
    tvAnimFrame = requestAnimationFrame(draw);
  }
  draw();
}

// ── Themes ────────────────────────────────────────────────────
const THEMES = {
  wncore: { '--c-accent':'#ff0000','--c-accent-dim':'#440000','--c-glow':'rgba(255,0,0,0.15)','--c-bg':'#080808','--c-bg-head':'#0d0000','--c-bg-input':'#050000','--c-border':'#2a0000','--c-text':'#ddbbbb','--c-text-dim':'#662222','--c-bubble-own':'#1a0000','--c-bubble-other':'#0a0000','--c-bubble-ai':'#110000','--c-sender':'#cc0000','--c-dot':'rgba(255,0,0,0.5)','--c-tab-active':'#ff0000','--c-system':'#440000' },
  classic:{ '--c-accent':'#00cc44','--c-accent-dim':'#003311','--c-glow':'rgba(0,200,68,0.1)','--c-bg':'#0a0f0a','--c-bg-head':'#0d120d','--c-bg-input':'#060a06','--c-border':'#1a2e1a','--c-text':'#aaccaa','--c-text-dim':'#336633','--c-bubble-own':'#001a00','--c-bubble-other':'#0a0f0a','--c-bubble-ai':'#001100','--c-sender':'#00aa33','--c-dot':'rgba(0,200,68,0.5)','--c-tab-active':'#00cc44','--c-system':'#003311' },
  bunker: { '--c-accent':'#ff8800','--c-accent-dim':'#3a1a00','--c-glow':'rgba(255,136,0,0.1)','--c-bg':'#0a0800','--c-bg-head':'#100d00','--c-bg-input':'#060500','--c-border':'#2a1a00','--c-text':'#ddcc88','--c-text-dim':'#664400','--c-bubble-own':'#1a0e00','--c-bubble-other':'#0a0800','--c-bubble-ai':'#110b00','--c-sender':'#cc6600','--c-dot':'rgba(255,136,0,0.5)','--c-tab-active':'#ff8800','--c-system':'#3a1a00' },
  signal: { '--c-accent':'#00ccff','--c-accent-dim':'#001a2a','--c-glow':'rgba(0,200,255,0.08)','--c-bg':'#000a10','--c-bg-head':'#000d15','--c-bg-input':'#000508','--c-border':'#001a2a','--c-text':'#88ccdd','--c-text-dim':'#225566','--c-bubble-own':'#001a2a','--c-bubble-other':'#000a10','--c-bubble-ai':'#001015','--c-sender':'#0099cc','--c-dot':'rgba(0,200,255,0.5)','--c-tab-active':'#00ccff','--c-system':'#001a2a' },
};

function applyTheme(theme, customHex) {
  const wrap = document.getElementById('chat-wrapper');
  if (!wrap) return;
  localStorage.setItem('chat_theme', theme);
  const vars = THEMES[theme];
  if (vars) {
    Object.entries(vars).forEach(([k,v]) => wrap.style.setProperty(k,v));
  } else if (theme === 'custom' && customHex) {
    applyCustomColor(wrap, customHex);
    localStorage.setItem('chat_custom_color', customHex);
  }
  document.querySelectorAll('.theme-switch-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.theme === theme);
  });
}

function applyCustomColor(el, hex) {
  const r=parseInt(hex.slice(1,3),16), g=parseInt(hex.slice(3,5),16), b=parseInt(hex.slice(5,7),16);
  const vars = {
    '--c-accent':hex, '--c-accent-dim':`rgb(${Math.floor(r*.25)},${Math.floor(g*.25)},${Math.floor(b*.25)})`,
    '--c-glow':`rgba(${r},${g},${b},0.12)`, '--c-bg':`rgb(${Math.floor(r*.03)},${Math.floor(g*.03)},${Math.floor(b*.03)})`,
    '--c-bg-head':`rgb(${Math.floor(r*.05)},${Math.floor(g*.05)},${Math.floor(b*.05)})`, '--c-bg-input':'#000',
    '--c-border':`rgb(${Math.floor(r*.15)},${Math.floor(g*.15)},${Math.floor(b*.15)})`,
    '--c-text':`rgb(${Math.min(r+140,255)},${Math.min(g+140,255)},${Math.min(b+140,255)})`,
    '--c-text-dim':`rgba(${r},${g},${b},0.5)`, '--c-bubble-own':`rgba(${r},${g},${b},0.1)`,
    '--c-bubble-other':`rgb(${Math.floor(r*.04)},${Math.floor(g*.04)},${Math.floor(b*.04)})`,
    '--c-bubble-ai':`rgba(${r},${g},${b},0.06)`, '--c-sender':hex,
    '--c-dot':`rgba(${r},${g},${b},0.4)`, '--c-tab-active':hex, '--c-system':`rgb(${Math.floor(r*.2)},${Math.floor(g*.2)},${Math.floor(b*.2)})`,
  };
  Object.entries(vars).forEach(([k,v]) => el.style.setProperty(k,v));
}

// ── Events ────────────────────────────────────────────────────
function bindEvents() {
  const toggleBtn = document.getElementById('chat-toggle-btn');
  const panel     = document.getElementById('chat-panel');

  // Simple tap/click toggle — no drag
  toggleBtn.addEventListener('click', () => togglePanel());
  toggleBtn.addEventListener('touchend', e => { e.preventDefault(); togglePanel(); }, { passive:false });

  document.getElementById('chat-close-btn').addEventListener('click', () => {
    panelOpen = false;
    panel.classList.add('chat-hidden');
    panel.classList.remove('chat-visible');
    document.getElementById('chat-toggle-btn').classList.remove('chat-open');
    if (isFullscreen) exitFullscreen();
  });
  document.getElementById('chat-fs-btn').addEventListener('click', toggleFullscreen);

  document.querySelectorAll('.theme-switch-btn').forEach(btn => {
    btn.addEventListener('click', () => applyTheme(btn.dataset.theme));
  });

  const picker = document.getElementById('color-custom');
  if (picker) {
    const saved = localStorage.getItem('chat_custom_color');
    if (saved) picker.value = saved;
    picker.addEventListener('input', () => applyTheme('custom', picker.value));
  }

  document.querySelectorAll('.chat-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.chat-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const rt = tab.dataset.type, ri = tab.dataset.room;
      document.getElementById('private-setup').classList.remove('visible');
      document.getElementById('wncore-login').classList.remove('visible');
      if (rt === 'private') document.getElementById('private-setup').classList.add('visible');
      else joinRoom(ri, rt);
    });
  });

  document.getElementById('private-join-btn').addEventListener('click', joinPrivate);
  document.getElementById('private-room-input').addEventListener('keydown', e => { if (e.key==='Enter') joinPrivate(); });

  document.getElementById('wncore-auth-btn').addEventListener('click', handleWNCOREAuth);
  document.getElementById('wncore-pass-input').addEventListener('keydown', e => { if (e.key==='Enter') handleWNCOREAuth(); });

  document.getElementById('chat-send-btn').addEventListener('click', send);
  document.getElementById('chat-input').addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  });

  document.addEventListener('keydown', e => { if (e.key === 'Escape' && isFullscreen) exitFullscreen(); });

  // TV
  const tv = document.getElementById('retro-tv');
  if (tv) {
    tv.addEventListener('click', openTVFullscreen);
    startTVStatic('tv-canvas');
  }
  document.getElementById('tv-close-btn')?.addEventListener('click', closeTVFullscreen);
  document.getElementById('tv-fullscreen')?.addEventListener('click', e => {
    if (e.target === document.getElementById('tv-fullscreen')) closeTVFullscreen();
  });
}

// ── Panel ─────────────────────────────────────────────────────
function togglePanel() {
  panelOpen = !panelOpen;
  const panel = document.getElementById('chat-panel');
  const badge = document.getElementById('chat-unread-badge');
  const btn   = document.getElementById('chat-toggle-btn');
  if (panelOpen) {
    panel.classList.remove('chat-hidden');
    panel.classList.add('chat-visible');
    if (btn) btn.classList.add('chat-open');
    if (!room) joinRoom('global', 'global');
    unread = 0; badge.classList.remove('visible');
  } else {
    panel.classList.add('chat-hidden');
    panel.classList.remove('chat-visible');
    if (btn) btn.classList.remove('chat-open');
    if (isFullscreen) exitFullscreen();
  }
}

function toggleFullscreen() {
  isFullscreen = !isFullscreen;
  const panel = document.getElementById('chat-panel');
  const btn   = document.getElementById('chat-fs-btn');
  if (isFullscreen) { panel.classList.add('chat-fullscreen'); btn.textContent = '⊡'; }
  else exitFullscreen();
}
function exitFullscreen() {
  isFullscreen = false;
  document.getElementById('chat-panel').classList.remove('chat-fullscreen');
  document.getElementById('chat-fs-btn').textContent = '⛶';
}

// ── TV ────────────────────────────────────────────────────────
function openTVFullscreen()  { document.getElementById('tv-fullscreen').classList.add('visible'); startTVStatic('tv-fullscreen-canvas'); }
function closeTVFullscreen() { document.getElementById('tv-fullscreen').classList.remove('visible'); }

// ── Rooms ─────────────────────────────────────────────────────
function joinPrivate() {
  const code = document.getElementById('private-room-input').value.trim();
  if (!code) return;
  document.getElementById('private-setup').classList.remove('visible');
  joinRoom('priv_'+btoa(code).replace(/[^a-zA-Z0-9]/g,'').slice(0,20), 'private');
}

async function joinRoom(rid, rtype) {
  room = rid; roomType = rtype;
  const names = { global:'GLOBAL SIGNAL', wncore:'WNCORE COALITION', private:'PRIVATE CHANNEL' };
  document.getElementById('chat-room-name').textContent = names[rtype] || rid.toUpperCase();
  document.getElementById('chat-roomtag').textContent   = '#' + rid;
  document.getElementById('chat-messages').innerHTML    = '';
  history = [];

  document.getElementById('wncore-login').classList.remove('visible');
  document.getElementById('wncore-viewonly').classList.remove('visible');
  document.getElementById('chat-input-area').style.display = 'flex';

  if (rtype === 'wncore' && !wncoreUnlocked) {
    document.getElementById('wncore-login').classList.add('visible');
    document.getElementById('wncore-viewonly').classList.add('visible');
    document.getElementById('chat-input-area').style.display = 'none';
    systemMsg('📡 WNCORE COALITION — Survivor Intelligence Network');
    systemMsg('👁 VIEW ONLY — Operator credentials required');
  }

  if (rtChannel && sb) sb.removeChannel(rtChannel);
  if (!sb) { systemMsg('⚠ Signal lost.'); return; }

  const { data } = await sb.from('messages').select('*').eq('room_id', rid)
    .order('created_at', { ascending: true }).limit(500);
  if (data) { data.forEach(renderMsg); history = data; scrollBottom(); }

  rtChannel = sb.channel('room:'+rid)
    .on('postgres_changes', { event:'INSERT', schema:'public', table:'messages', filter:`room_id=eq.${rid}` }, p => {
      const msg = p.new;
      if (msg.username !== me) {
        renderMsg(msg); history.push(msg); scrollBottom();
        if (!panelOpen) {
          unread++;
          const badge = document.getElementById('chat-unread-badge');
          badge.textContent = unread > 9 ? '9+' : unread;
          badge.classList.add('visible');
        }
      }
    }).subscribe();
}

function handleWNCOREAuth() {
  const u = document.getElementById('wncore-user-input').value.trim();
  const p = document.getElementById('wncore-pass-input').value.trim();
  const err = document.getElementById('wncore-auth-error');
  if (u === WNCORE_USER && p === WNCORE_PASS) {
    wncoreUnlocked = true; isAdmin = true;
    me = WNCORE_USER; localStorage.setItem('chat_user', WNCORE_USER);
    document.getElementById('chat-username').textContent = WNCORE_USER + ' ⚡';
    document.getElementById('wncore-login').classList.remove('visible');
    document.getElementById('wncore-viewonly').classList.remove('visible');
    document.getElementById('chat-input-area').style.display = 'flex';
    document.getElementById('chat-input').placeholder = 'BROADCAST TO WNCORE...';
    systemMsg('⚡ OPERATOR ACCESS GRANTED — Welcome, ' + WNCORE_USER);
  } else {
    err.textContent = '// ACCESS DENIED';
    setTimeout(() => { err.textContent = ''; }, 2500);
  }
}

async function send() {
  const inp     = document.getElementById('chat-input');
  const content = inp.value.trim();
  if (!content || !room) return;
  if (roomType === 'wncore' && !wncoreUnlocked) return;
  inp.value = '';

  const msg = {
    room_id: room, username: me, content,
    is_ai: false, flag: isAdmin ? '⚡' : null,
    created_at: new Date().toISOString()
  };
  renderMsg(msg); history.push(msg); scrollBottom();

  if (sb) {
    const gone = document.getElementById('gone-toggle')?.checked;
    if (!gone || roomType !== 'private') await sb.from('messages').insert(msg);
  }

  if (roomType !== 'wncore') triggerAI(content);
}

async function triggerAI(msg) {
  if (Math.random() < 0.1) return;
  try {
    const res = await fetch('/api/chat', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ message:msg, roomType, recentMessages:history.slice(-15), senderUsername:me })
    });
    if (!res.ok) return;
    const data = await res.json();
    if (data.seen || !data.segments?.length) return;
    const { charData, segments, delay } = data;
    setTimeout(() => showTyping(charData.name), Math.min(delay * 0.3, 8000));
    segments.forEach((seg, i) => {
      setTimeout(async () => {
        if (i === segments.length-1) hideTyping();
        const aiMsg = { room_id:room, username:charData.name, content:seg, is_ai:true, flag:charData.flag||null, created_at:new Date().toISOString() };
        renderMsg(aiMsg); history.push(aiMsg); scrollBottom();
        if (sb) await sb.from('messages').insert(aiMsg);
      }, delay + i*(800+Math.random()*1200));
    });
  } catch(e) { /* Error handled */}
}

function renderMsg(msg) {
  const el     = document.getElementById('chat-messages');
  const isOwn  = msg.username === me;
  const isAI   = msg.is_ai;
  const flag   = msg.flag || '';
  const isSys  = msg.username === 'WNCORE_SYSTEM';

  if (isSys) {
    const div = document.createElement('div');
    div.className = 'system-broadcast-msg';
    div.textContent = msg.content;
    el.append(div); return;
  }

  const wrap   = document.createElement('div');
  wrap.className = 'msg-wrap ' + (isOwn ? 'msg-own' : 'msg-other');
  const bubble = document.createElement('div');
  bubble.className = 'msg-bubble ' + (isOwn ? 'own' : isAI ? 'ai' : 'other');
  const sender = document.createElement('div');
  sender.className = 'msg-sender';
  sender.textContent = isOwn ? (isAdmin ? 'you ⚡' : 'you') : (flag ? `${msg.username} ${flag}` : msg.username);
  const text = document.createElement('div');
  text.className = 'msg-text'; text.textContent = msg.content;
  const time = document.createElement('div');
  time.className = 'msg-time';
  time.textContent = new Date(msg.created_at).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});
  bubble.append(sender, text, time); wrap.append(bubble); el.append(wrap);
}

function systemMsg(text) {
  const el = document.createElement('div');
  el.className = 'system-msg'; el.textContent = text;
  document.getElementById('chat-messages').append(el);
}
function showTyping(name) { document.getElementById('chat-typing-name').textContent = name; document.getElementById('chat-typing').classList.add('visible'); scrollBottom(); }
function hideTyping()      { document.getElementById('chat-typing').classList.remove('visible'); }
function scrollBottom()    { const el = document.getElementById('chat-messages'); if (el) el.scrollTop = el.scrollHeight; }

// ── Boot ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initSB();
  me = getUser();
  inject();
});
