// arg-system.js — ARG Mystery System v3
// Signal Scanner | WNCORE Terminal | KAGE addresses visitor | Online counter
// Supply drop cities are now fully random each time

// ── 1. Signal Scanner ────────────────────────────────────────
function createSignalScanner() {
  if (document.getElementById('signal-scanner-overlay')) return;

  const style = document.createElement('style');
  style.textContent = `
    #signal-scanner-overlay {
      position:fixed;inset:0;background:rgba(0,0,0,0.94);
      z-index:9500;display:flex;align-items:center;justify-content:center;
      font-family:'Space Mono',monospace;padding:12px;
    }
    #signal-scanner {
      width:min(380px,96vw);
      background:#040000;border:2px solid #440000;border-top:3px solid #cc0000;
      border-radius:3px;overflow:hidden;box-shadow:0 0 60px rgba(255,0,0,0.25);
    }
    .scan-hdr {
      display:flex;justify-content:space-between;align-items:center;
      padding:9px 14px;background:#0a0000;border-bottom:1px solid #280000;
    }
    .scan-hdr span{font-size:0.55rem;color:#cc0000;letter-spacing:2px;}
    .scan-close{background:transparent;border:1px solid #440000;color:#660000;cursor:pointer;padding:3px 9px;font-family:'Space Mono',monospace;font-size:0.5rem;transition:0.15s;}
    .scan-close:hover{border-color:#cc0000;color:#cc0000;}
    .scan-screen{position:relative;height:160px;background:#000;border-bottom:1px solid #280000;overflow:hidden;}
    #scanner-canvas{width:100%;height:100%;display:block;}
    .scan-readout{position:absolute;bottom:7px;left:10px;font-size:0.42rem;color:#550000;letter-spacing:2px;}
    .scan-found{
      position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);
      font-size:0.5rem;color:#ff0000;text-align:center;
      text-shadow:0 0 10px rgba(255,0,0,0.7);letter-spacing:1px;
      display:none;padding:10px 14px;background:rgba(0,0,0,0.88);
      border:1px solid #550000;max-width:92%;line-height:1.7;
      white-space:pre-wrap;
    }
    .scan-controls{padding:14px;background:#080000;}
    .scan-dial-row{display:flex;align-items:center;gap:10px;margin-bottom:7px;}
    .dial-label{font-size:0.48rem;color:#550000;flex-shrink:0;}
    .freq-dial{flex:1;-webkit-appearance:none;height:3px;background:linear-gradient(to right,#330000,#cc0000);outline:none;cursor:pointer;border-radius:2px;}
    .freq-dial::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:14px;background:#ff0000;border-radius:50%;box-shadow:0 0 8px rgba(255,0,0,0.6);}
    .freq-display{font-size:0.58rem;color:#ff0000;min-width:62px;text-align:right;}
    .scan-hint{font-size:0.36rem;color:#330000;text-align:center;letter-spacing:1px;}
    .scan-code-reward{font-size:0.42rem;color:#880000;text-align:center;margin-top:6px;letter-spacing:1px;padding:6px;border-top:1px solid #1a0000;}
  `;
  document.head.appendChild(style);

  const overlay = document.createElement('div');
  overlay.id = 'signal-scanner-overlay';
  overlay.innerHTML = `
    <div id="signal-scanner">
      <div class="scan-hdr">
        <span>WNCORE FREQUENCY SCANNER — 88.0–108.0 FM</span>
        <button class="scan-close" onclick="closeScanner()">✕</button>
      </div>
      <div class="scan-screen">
        <canvas id="scanner-canvas"></canvas>
        <div class="scan-readout" id="scan-readout">SCANNING...</div>
        <div class="scan-found" id="scan-found"></div>
      </div>
      <div class="scan-controls">
        <div class="scan-dial-row">
          <span class="dial-label">FREQ:</span>
          <input type="range" id="freq-dial" min="80" max="108" step="0.1" value="94.0" class="freq-dial">
          <span class="freq-display" id="freq-display">94.0 FM</span>
        </div>
        <div class="scan-hint">Tune carefully — hidden transmissions exist. Some carry decoder codes.</div>
        <div class="scan-code-reward" id="scan-code-reward"></div>
      </div>
    </div>`;
  document.body.appendChild(overlay);

  const canvas = document.getElementById('scanner-canvas');
  const ctx    = canvas.getContext('2d');
  let scanFrame, currentFreq = 94.0;

  const SECRETS = {
    88.7: {
      msg: '🔴 WNCORE 88.7 LOCKED\n"0.315126 — BLANK ZONE COORDINATES.\nMARCH 31 WAS NOT AN ACCIDENT. NINE."',
      code: '887',
      lore: 'Signal_Kage origin frequency'
    },
    91.3: {
      msg: '📡 LOST SCIENTIST BROADCAST\n"The prion theory is real. Signal rewires the brain.\nNot a virus. The source is still transmitting."',
      code: '913',
      lore: 'Lost Scientist — disappeared after this broadcast'
    },
    99.9: {
      msg: '⚡ MOON DOME INTERCEPT\n"Built 2012. Cleaning company = front.\nBillionaires knew 20 years in advance."',
      code: '999',
      lore: 'Classified Moon Dome construction timeline'
    },
    103.5: {
      msg: '🌑 FRAGMENTED — SUBJECT S\n"You are not supposed to be here.\nNine people. Only you remember. They still exist.\nThe question is where did they go."',
      code: '1035',
      lore: 'Direct address to Subject S'
    },
    107.1: {
      msg: '📶 SIGNAL_KAGE DIRECT\n"88.7. They knew in 2011.\nThe signal was not a warning.\nIt was instructions."',
      code: '1071',
      lore: 'SIGNAL_KAGE transmission'
    },
  };

  window.argProgress = window.argProgress || new Set();

  function drawStatic(freq) {
    canvas.width  = canvas.offsetWidth  || 380;
    canvas.height = canvas.offsetHeight || 160;
    const img = ctx.createImageData(canvas.width, canvas.height);
    const d   = img.data;

    const key      = Object.keys(SECRETS).find(f => Math.abs(freq - parseFloat(f)) < 0.35);
    const strength = key ? Math.max(0, 1 - Math.abs(freq - parseFloat(key)) / 0.35) : 0;

    for (let i = 0; i < d.length; i += 4) {
      const v = Math.random() > (0.48 + strength*0.42) ? Math.floor(Math.random()*65) : 0;
      d[i]=v?Math.min(v+75,185):0; d[i+1]=0; d[i+2]=0; d[i+3]=200;
    }
    ctx.putImageData(img, 0, 0);

    if (strength > 0) {
      const cy = canvas.height / 2;
      ctx.beginPath();
      ctx.strokeStyle = `rgba(255,0,0,${strength})`;
      ctx.lineWidth = 2;
      for (let x = 0; x < canvas.width; x++) {
        const y = cy + Math.sin(x*0.05 + Date.now()*0.01) * (22*strength);
        x === 0 ? ctx.moveTo(x,y) : ctx.lineTo(x,y);
      }
      ctx.stroke();
    }

    const foundEl = document.getElementById('scan-found');
    const readout = document.getElementById('scan-readout');
    const codeEl  = document.getElementById('scan-code-reward');

    if (key && strength > 0.78) {
      const s = SECRETS[key];
      foundEl.style.display = 'block';
      foundEl.textContent   = s.msg;
      readout.textContent   = `SIGNAL LOCKED — ${freq.toFixed(1)} FM`;
      codeEl.textContent    = `FLIP PHONE CODE: ${s.code} · ${s.lore}`;
      window.argProgress.add(key);
      checkARGProgress();
    } else {
      foundEl.style.display = 'none';
      codeEl.textContent    = '';
      readout.textContent   = `SCANNING ${freq.toFixed(1)} FM...`;
    }

    scanFrame = requestAnimationFrame(() => drawStatic(currentFreq));
  }

  document.getElementById('freq-dial').addEventListener('input', e => {
    currentFreq = parseFloat(e.target.value);
    document.getElementById('freq-display').textContent = currentFreq.toFixed(1) + ' FM';
  });

  drawStatic(currentFreq);

  window.closeScanner = () => {
    cancelAnimationFrame(scanFrame);
    overlay.remove();
  };
}

// ── 2. WNCORE Terminal ────────────────────────────────────────
// Random city pool for supply command
const _TERM_CITIES = [
  'Dhaka','Tokyo','Lagos','Istanbul','Dublin','Auckland','Moscow','Mumbai',
  'Karachi','Colombo','Stockholm','Reykjavik','Nairobi','São Paulo',
  'Singapore','Manila','Bogotá','Warsaw','Bucharest','Osaka','Cairo',
  'Jakarta','Ulaanbaatar','Addis Ababa','Lima','Sydney','Helsinki',
  'Sector 7-G','Grid ECHO-9','BLANK ZONE','Node NINE',
];
function _randCity() { return _TERM_CITIES[Math.floor(Math.random() * _TERM_CITIES.length)]; }

function createWNCORETerminal() {
  if (document.getElementById('wncore-terminal-overlay')) return;

  const style = document.createElement('style');
  style.textContent = `
    #wncore-terminal-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.96);z-index:9500;display:flex;align-items:center;justify-content:center;font-family:'Space Mono',monospace;padding:12px;}
    #wncore-terminal{width:min(560px,97vw);height:min(440px,90dvh);background:#000;border:1px solid #2a0000;border-top:2px solid #cc0000;display:flex;flex-direction:column;box-shadow:0 0 40px rgba(255,0,0,0.18);}
    .term-bar{display:flex;justify-content:space-between;align-items:center;padding:6px 12px;background:#080000;border-bottom:1px solid #1a0000;}
    .term-bar span{font-size:0.48rem;color:#660000;letter-spacing:2px;}
    .term-exit{background:transparent;border:none;color:#440000;cursor:pointer;font-family:'Space Mono',monospace;font-size:0.65rem;padding:2px 8px;transition:0.15s;}
    .term-exit:hover{color:#cc0000;}
    #term-out{flex:1;overflow-y:auto;padding:12px;font-size:0.52rem;color:#880000;line-height:1.85;scrollbar-width:thin;scrollbar-color:#330000 transparent;}
    #term-out .t-sys{color:#cc0000;}
    #term-out .t-u  {color:#660000;}
    #term-out .t-r  {color:#993333;padding-left:12px;}
    #term-out .t-err{color:#440000;}
    #term-out .t-sec{color:#ff0000;text-shadow:0 0 5px rgba(255,0,0,0.4);}
    .term-in-row{display:flex;border-top:1px solid #1a0000;background:#030000;}
    .term-prompt{padding:9px 8px 9px 12px;color:#550000;font-size:0.52rem;flex-shrink:0;align-self:center;}
    #term-input{flex:1;background:transparent;border:none;outline:none;color:#cc0000;font-family:'Space Mono',monospace;font-size:0.52rem;padding:9px 0;letter-spacing:1px;caret-color:#ff0000;}
  `;
  document.head.appendChild(style);

  const overlay = document.createElement('div');
  overlay.id = 'wncore-terminal-overlay';
  overlay.innerHTML = `
    <div id="wncore-terminal">
      <div class="term-bar">
        <span>WNCORE TERMINAL — NODE 09</span>
        <button class="term-exit" onclick="closeTerminal()">✕ EXIT</button>
      </div>
      <div id="term-out">
        <div class="t-sys">WNCORE NODE 09 — CONNECTED</div>
        <div class="t-sys">Freq: 88.7 | Encryption: ACTIVE | Type HELP</div>
        <div class="t-sys">─────────────────────────────</div>
      </div>
      <div class="term-in-row">
        <span class="term-prompt">NODE09&gt;</span>
        <input type="text" id="term-input" placeholder="enter command..." autocomplete="off" spellcheck="false" maxlength="60" />
      </div>
    </div>`;
  document.body.appendChild(overlay);

  const out   = document.getElementById('term-out');
  const input = document.getElementById('term-input');

  const COMMANDS = {
    help: () => ['{ cls · status · intel · signal · blank-zone · incident-zero',
                  '  ghuul-count · cygnus · supply · scan · decode [base64] · exit }'],
    cls:  () => { out.innerHTML = ''; return []; },
    status: () => ['WORLD STATUS [2032]:','  Immune: 8.28%','  Infected: 26.00%','  Converted: 64.00%','  Active Ghuuls: 173','  WNCORE nodes: 9','  Moon Dome: NO SIGNAL [72h+]','  Governments: ALASKA ONLY'],
    intel:  () => ['ACTIVE INTEL:','  Rain of ████████ — global, daily','  ████ of Medusa — Germany, spreading east','  Freq 88.7 — actively scrambled','  SIGNAL_KAGE — unknown entity, still transmitting','  Great Migration — insects/birds moving north'],
    signal: () => ['SIGNAL ANALYSIS:','  Primary: 88.7 FM — WNCORE active','  Interference source: UNKNOWN','  Decoded string: "0.315126"','  Pattern repeats: every 31 minutes','  First detected: March 31st, 2032','  ██████████: [CLASSIFIED — use SCAN]'],
    'blank-zone': () => ['BLANK ZONE:','  Period: 2028–2031 (3 years, 1 month, 4 days)','  Global records: NONE','  Witnesses: NONE','  Moon Dome finished: 2029 [during Blank Zone]','  SIGNAL_KAGE first appeared: 2030 [during Blank Zone]','  Theory: deliberate erasure. Someone benefited.'],
    'incident-zero': () => ['  [ACCESS RESTRICTED — PARTIAL ONLY]','  First Ghuul — Dhaka, Bangladesh','  Entity retains emotional response','  Entity glitches between ██████ realities','  Connection to Subject S: [REDACTED]','  WARNING: Do not pursue. Node 09 order.','  NOTE: Entity is aware of what it is.'],
    'ghuul-count': () => ['GHUUL REGISTRY:','  Total confirmed: 173','  Shiro Oni (Japan): 23','  Shada Bhuture (Bangladesh): 4','  Snow Demons (Alaska): 8','  European sector: 31','  Germany: 0 [Fog prevents all survival]','  Incident Zero: UNTRACKED — glitches between realities'],
    cygnus: () => ['CYGNUS SIGNAL:','  Detected: 2007 | Origin: Cygnus X-1','  Decoded 2011: "They lied to us. Send help.','    Any way possible. No matter who is out there."','  Response sent: UNKNOWN','  Outbreak link: PROBABLE','  Blank Zone link: CONFIRMED (Dmitri_15 research)','  ████████████: [DATA CORRUPTED]'],
    // Supply command — fully random city every call
    supply: () => {
      const city = _randCity();
      const contents = ['medical supplies','weapons cache','encrypted chips','rations','fuel reserves','biological samples','radio equipment'][Math.floor(Math.random()*7)];
      return ['SUPPLY REGISTRY:',`  Last drop: ${city}`,'  Cargo: ' + contents,'  Next drop ETA: [CALCULATING]','  Blood Pact interference: POSSIBLE','  Use WNCORE channel for live coordinates.'];
    },
    scan:  () => { setTimeout(()=>{ closeTerminal(); createSignalScanner(); },300); return ['Launching frequency scanner...']; },
    exit:  () => { setTimeout(closeTerminal,200); return ['Disconnecting from Node 09...']; },
  };

  function addLine(text, cls='t-r') {
    const d = document.createElement('div');
    d.className = cls; d.textContent = text;
    out.appendChild(d); out.scrollTop = out.scrollHeight;
  }

  function run(raw) {
    const cmd = raw.trim().toLowerCase();
    addLine('> ' + raw, 't-u');
    if (!cmd) return;
    if (cmd.startsWith('decode ')) {
      try { addLine('DECODED: ' + atob(raw.slice(7).trim()), 't-sec'); }
      catch { addLine('DECODE FAILED — not valid base64','t-err'); }
      return;
    }
    const fn = COMMANDS[cmd];
    if (fn) { const lines = fn(); if (lines) lines.forEach(l => addLine(l)); }
    else { addLine(`Unknown: "${cmd}"`, 't-err'); addLine('Type HELP for commands.','t-err'); }
  }

  input.addEventListener('keydown', e => { if (e.key==='Enter') { run(input.value); input.value=''; } });
  input.focus();
  window.closeTerminal = () => overlay.remove();
}

// ── 3. ARG Progress tracker ───────────────────────────────────
function checkARGProgress() {
  const p = window.argProgress || new Set();
  if (p.size >= 3 && !sessionStorage.getItem('arg_toast_shown')) {
    sessionStorage.setItem('arg_toast_shown','1');
    setTimeout(() => {
      const t = document.createElement('div');
      t.style.cssText='position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:#060000;border:1px solid #ff0000;color:#ff0000;font-family:Space Mono,monospace;font-size:0.5rem;padding:12px 20px;z-index:9999;letter-spacing:2px;box-shadow:0 0 20px rgba(255,0,0,0.35);text-align:center;max-width:92vw;';
      t.innerHTML='⚡ WNCORE NODE 09: SIGNAL PATTERN UNLOCKED<br><span style="font-size:0.38rem;color:#660000;">Terminal cmd: decode TUFSQUggMzEgV0FTIE5PVCBBTiBBQ0NJREVOVA==</span>';
      document.body.appendChild(t);
      setTimeout(() => t.remove(), 9000);
    }, 1000);
  }
}

// ── 4. SIGNAL_KAGE addresses visitor ─────────────────────────
async function kageAddressVisitor(username) {
  if (sessionStorage.getItem('kage_addr')) return;
  sessionStorage.setItem('kage_addr','1');
  if (!window.sb) return;

  const delay = (3 + Math.random()*6) * 60 * 1000;
  setTimeout(async () => {
    if (!window.sb) return;
    const lines = [
      `${username}. you found this place.`,
      `we see everyone who connects to 88.7.`,
      `the blank zone. ask yourself what happened between 2028 and 2031.`,
    ];
    for (const content of lines) {
      try {
        await window.sb.from('messages').insert({
          room_id:'global', username:'SIGNAL_KAGE', content,
          is_ai:true, flag:'📶', created_at:new Date().toISOString()
        });
      } catch {}
      await new Promise(r => setTimeout(r, 4500));
    }
  }, delay);
}

// ── 5. Triggers ───────────────────────────────────────────────
function injectARGTriggers() {
  // TV: 3 clicks → scanner
  const tv = document.getElementById('retro-tv');
  if (tv) {
    let tvClicks = 0, tvTimer;
    tv.addEventListener('click', () => {
      tvClicks++;
      clearTimeout(tvTimer);
      tvTimer = setTimeout(() => { tvClicks = 0; }, 1200);
      if (tvClicks >= 3) { tvClicks = 0; clearTimeout(tvTimer); createSignalScanner(); }
    });
  }

  // Keyboard: type "wncore" → terminal
  let keyBuf = '';
  document.addEventListener('keydown', e => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    keyBuf = (keyBuf + e.key.toLowerCase()).slice(-6);
    if (keyBuf === 'wncore') { createWNCORETerminal(); keyBuf = ''; }
  });

  // Long-press logo on mobile → terminal
  const logo = document.getElementById('logo-siharu') || document.querySelector('.logo-siharu');
  if (logo) {
    let pt;
    logo.addEventListener('touchstart', () => { pt = setTimeout(() => createWNCORETerminal(), 1500); }, {passive:true});
    logo.addEventListener('touchend',   () => clearTimeout(pt));
    logo.addEventListener('touchmove',  () => clearTimeout(pt));
  }

  // Page title glitch — ARG hints
  const GLITCH_TITLES = [
    'THEY LIED TO US', '0.315126', 'NINE OF THEM',
    'SIHARU | WHO ARE YOU', 'MARCH 31 — FIND THE SIGNAL',
    'THE SKY KNEW', 'BLANK ZONE 2028-2031',
  ];
  setInterval(() => {
    if (Math.random() < 0.14) {
      const orig = document.title;
      document.title = GLITCH_TITLES[Math.floor(Math.random() * GLITCH_TITLES.length)];
      setTimeout(() => { document.title = orig; }, 2000 + Math.random()*3000);
    }
  }, 35000);
}

// ── 6. Online counter — WNCORE_ADMIN always counts ───────────
async function initOnlineCounter() {
  if (!window.sb) return;
  const username = localStorage.getItem('chat_user') || 'anonymous';

  const counter = document.createElement('div');
  counter.id = 'online-counter';
  // Start at 2 (user + WNCORE_ADMIN always online)
  counter.textContent = '● 2 ONLINE';
  document.body.appendChild(counter);

  try {
    const pc = window.sb.channel('online-presence', {
      config:{ presence:{ key: username } }
    });
    pc.on('presence', { event:'sync' }, () => {
      const n = Object.keys(pc.presenceState()).length;
      // Always add 1 for WNCORE_ADMIN
      const total = n + 1;
      counter.textContent = `● ${total} ONLINE`;
      counter.style.color = total > 2 ? '#660000' : '#330000';
    }).subscribe(async status => {
      if (status === 'SUBSCRIBED') {
        await pc.track({ username, online_at: new Date().toISOString() });
      }
    });
  } catch(e) { /* Presence system handled */}
}

// ── Boot ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  injectARGTriggers();

  const waitSB = setInterval(() => {
    if (window.sb) {
      clearInterval(waitSB);
      initOnlineCounter();
      const u = localStorage.getItem('chat_user');
      if (u) setTimeout(() => kageAddressVisitor(u), 15000);
    }
  }, 1000);
});
