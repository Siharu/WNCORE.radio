// ============================================================
// RNG CREDENTIALS
// ============================================================
const RNG_CHARS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
function randStr(len) {
  let s = '';
  for (let i = 0; i < len; i++) s += RNG_CHARS[Math.floor(Math.random() * RNG_CHARS.length)];
  return s;
}
const RNG_USER = randStr(8 + Math.floor(Math.random() * 5));
const RNG_PASS = randStr(10 + Math.floor(Math.random() * 6));

const EXCEPTION_CODES = [
  { user: 'Siharu847',         pass: 'iwishiwasthere555' },
  { user: 'Kat242424',         pass: 'godlovesyou1111'   },
  { user: 'whatsyourbirthday', pass: '12345678910'       },
];

// ============================================================
// LOADER + BOOT OVERLAY
// ============================================================
window.addEventListener("load", () => {
  const boot = document.getElementById("boot");
  if (!boot) return;

  const sigUser = document.getElementById('signal-user');
  const sigPass = document.getElementById('signal-pass');
  if (sigUser) sigUser.textContent = 'USER: ' + RNG_USER;
  if (sigPass) sigPass.textContent = 'PASS: ' + RNG_PASS;

  const increments = Array.from(document.querySelectorAll('.loader-increment'));
  const percentEl  = document.querySelector('.loader-percent');
  const loaderText = document.querySelector('.loader-text');

  if (!increments.length || !percentEl || !loaderText) {
    boot.style.opacity = "1";
    setTimeout(() => {
      boot.style.opacity = "0";
      setTimeout(() => { boot.style.display = "none"; }, 500);
    }, 1800);
    return;
  }

  const loaderLength = increments.length;
  const ratio = 100 / loaderLength;
  let loaded = 0;
  let currentInc = null;

  function formatPercent(val) {
    const rounded = Math.round(val * 10) / 10;
    let str = rounded.toFixed(1);
    if (val < 10) str = "  " + str;
    else if (val < 100) str = " " + str;
    return str + "%";
  }

  function updateDisplay() {
    percentEl.textContent = formatPercent(loaded);
    const newInc = Math.round(loaded / ratio);
    if (newInc !== currentInc && newInc < loaderLength) {
      currentInc = newInc;
      increments[currentInc].textContent = "█ ";
    }
  }

  const loading = setInterval(() => {
    if (loaded < 99.9) {
      loaded += 0.1;
      updateDisplay();
    } else {
      clearInterval(loading);
      loaderText.textContent = "Loaded";
      percentEl.textContent  = "100.0%";
      increments.forEach(inc => { if (inc.textContent.trim() === '') inc.textContent = "█ "; });
      setTimeout(() => {
        boot.classList.add('glitch-out');
        setTimeout(() => { boot.style.display = "none"; }, 500);
      }, 400);
    }
  }, 10);
});

// ============================================================
// NAVIGATION
// ============================================================
const enterBtn      = document.getElementById('enter-archive');
const heroSection   = document.getElementById('hero');
const loginScreen   = document.getElementById('login-screen');
const archiveSelect = document.getElementById('archive-select');

if (enterBtn) {
  enterBtn.addEventListener('click', e => {
    e.preventDefault();
    heroSection.style.display  = 'none';
    loginScreen.style.display  = 'flex';
    startLoginStaticTimer();
  });
}

function showHome() {
  hideAllFx();
  stopLoginStatic();
  if (loginScreen)   loginScreen.style.display   = 'none';
  if (archiveSelect) archiveSelect.style.display  = 'none';
  if (heroSection)   heroSection.style.display    = 'flex';
}

// ============================================================
// LOGIN SCREEN — TV STATIC ON TITLE AFTER 10s
// ============================================================
let loginStaticTimer  = null;
let loginStaticFrame  = null;
let loginStaticActive = false;

function startLoginStaticTimer() {
  loginStaticTimer = setTimeout(() => { activateLoginStatic(); }, 10000);
}

function activateLoginStatic() {
  loginStaticActive = true;
  const canvas = document.getElementById('login-static-canvas');
  const title  = document.getElementById('login-title');
  if (!canvas || !title) return;

  canvas.classList.add('active');
  title.classList.add('hidden');

  const ctx = canvas.getContext('2d');
  function drawStatic() {
    if (!loginStaticActive) return;
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const imgData = ctx.createImageData(canvas.width, canvas.height);
    const d = imgData.data;
    for (let i = 0; i < d.length; i += 4) {
      const v = Math.random() > 0.5 ? 255 : 0;
      d[i]   = v > 0 ? 180 + Math.random() * 75 : 0;
      d[i+1] = 0; d[i+2] = 0; d[i+3] = 200;
    }
    ctx.putImageData(imgData, 0, 0);
    loginStaticFrame = requestAnimationFrame(drawStatic);
  }
  drawStatic();
}

function stopLoginStatic() {
  loginStaticActive = false;
  if (loginStaticTimer) { clearTimeout(loginStaticTimer); loginStaticTimer = null; }
  if (loginStaticFrame) { cancelAnimationFrame(loginStaticFrame); loginStaticFrame = null; }
  const canvas = document.getElementById('login-static-canvas');
  const title  = document.getElementById('login-title');
  if (canvas) canvas.classList.remove('active');
  if (title)  title.classList.remove('hidden');
}

// ============================================================
// LOGIN LOGIC
// ============================================================
const loginSubmit = document.getElementById('login-submit');

if (loginSubmit) {
  loginSubmit.addEventListener('click', handleLogin);
  document.addEventListener('keydown', e => {
    if (loginScreen && loginScreen.style.display !== 'none' && e.key === 'Enter') handleLogin();
  });
}

function handleLogin() {
  const user = document.getElementById('login-user').value.trim();
  const pass = document.getElementById('login-pass').value.trim();

  const isException = EXCEPTION_CODES.some(c => c.user === user && c.pass === pass);
  if (isException) { loginSuccess(); return; }

  if (user === RNG_USER && pass === RNG_PASS) {
    if (Math.random() < 0.47) { loginSuccess(); return; }
    triggerFailEffect(); return;
  }

  if (Math.random() < 0.02) { loginSuccess(); return; }
  triggerFailEffect();
}

// ============================================================
// LOGIN SUCCESS — STRIPE REVEAL + SHADOWY FALCON LOGO
// ============================================================
function loginSuccess() {
  stopLoginStatic();
  loginScreen.style.display   = 'none';
  archiveSelect.style.display = 'block';
  stripeReveal();
  const falconDelay = Math.random() * 4000 + 500;
  setTimeout(triggerFalcon, falconDelay);
}

function stripeReveal() {
  const canvas = document.getElementById('stripe-canvas');
  if (!canvas) return;
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  const ctx = canvas.getContext('2d');
  const stripes = [];

  for (let i = 0; i < 80; i++) {
    const hue    = Math.round(Math.random() * 360);
    const color  = `hsl(${hue}, 80%, 65%)`;
    const height = Math.round(Math.random() * 12 + 2);
    const width  = Math.round(canvas.width / 10 + Math.random() * canvas.width / 8);
    const x      = Math.round((canvas.width + width) * Math.random() - width);
    const y      = Math.round(canvas.height * Math.random());
    const born   = performance.now() + Math.random() * 400;
    stripes.push({ x, y, width, height, color, born, life: 0 });
  }

  function drawStripes(now) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let allDead = true;
    for (const s of stripes) {
      if (now < s.born) { allDead = false; continue; }
      s.life = now - s.born;
      if (s.life > 300) continue;
      allDead = false;
      const progress = Math.min(s.life / 300, 1);
      const alpha    = 1 - Math.pow(progress, 2);
      const wobble   = Math.sin(s.life * 0.1) * 8;
      const shrinkW  = s.width * (1 - progress * 0.5);
      ctx.globalAlpha = alpha;
      ctx.fillStyle   = s.color;
      ctx.fillRect(s.x + wobble, s.y, shrinkW, s.height);
    }
    ctx.globalAlpha = 1;
    if (!allDead) requestAnimationFrame(drawStripes);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  requestAnimationFrame(drawStripes);
}

// --- Shadowy SVG Falcon ---
function triggerFalcon() {
  const logoEl = document.getElementById('logo-siharu');
  if (!logoEl) return;

  const originalHTML = logoEl.innerHTML;

  // Inline SVG falcon silhouette — dark, dramatic, side-profile diving pose
  const falconSVG = `
    <span class="logo-falcon">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 60" width="60" height="30">
        <defs>
          <filter id="falcon-glow">
            <feGaussianBlur stdDeviation="3" result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <!-- Body -->
        <path d="M55 28 C48 22 30 18 10 20 C20 24 35 26 42 30 C30 32 15 36 5 42 C18 38 38 36 50 35 C52 40 54 46 58 50 C60 44 60 38 58 33 C68 30 85 25 100 18 C85 20 70 24 60 28 Z" 
              fill="#0a0a0a" filter="url(#falcon-glow)" opacity="0.95"/>
        <!-- Wing sweep -->
        <path d="M58 28 C70 18 90 8 115 5 C100 12 80 20 65 28 Z" 
              fill="#111" filter="url(#falcon-glow)" opacity="0.9"/>
        <!-- Head -->
        <ellipse cx="54" cy="22" rx="7" ry="5" fill="#0d0d0d" filter="url(#falcon-glow)"/>
        <!-- Beak -->
        <path d="M47 21 C44 22 43 24 45 25 C47 24 49 23 47 21 Z" fill="#1a1a1a"/>
        <!-- Eye glint -->
        <circle cx="51" cy="21" r="1.2" fill="#ff0000" opacity="0.8"/>
        <!-- Tail feathers -->
        <path d="M58 48 C55 52 52 56 56 58 C58 54 60 50 58 48 Z" fill="#0a0a0a" opacity="0.85"/>
        <path d="M60 47 C58 52 57 57 61 58 C61 53 62 49 60 47 Z" fill="#0a0a0a" opacity="0.75"/>
      </svg>
    </span>
  `;

  logoEl.innerHTML = falconSVG;

  setTimeout(() => {
    logoEl.innerHTML = originalHTML;
  }, 1200);
}

// ============================================================
// FAILURE EFFECTS
// ============================================================
function hideAllFx() {
  ['fx-blood','fx-malware','fx-rain','fx-static','fx-countdown'].forEach(id => {
    const el = document.getElementById(id);
    if (el) { el.style.display = 'none'; el.style.opacity = '1'; }
  });
}

function triggerFailEffect() {
  const effect = Math.floor(Math.random() * 5) + 1;
  loginScreen.style.display = 'none';
  stopLoginStatic();
  switch(effect) {
    case 1: fxBlood();     break;
    case 2: fxMalware();   break;
    case 3: fxWhiteRain(); break;
    case 4: fxStatic();    break;
    case 5: fxCountdown(); break;
  }
}

function fxBlood() {
  const overlay = document.getElementById('fx-blood');
  overlay.style.display = 'flex';
  const canvas = document.getElementById('blood-canvas');
  canvas.width = window.innerWidth; canvas.height = window.innerHeight;
  const ctx = canvas.getContext('2d');
  const drops = Array.from({length: 80}, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * -canvas.height,
    speed: 4 + Math.random() * 6,
    len: 15 + Math.random() * 30,
    width: 1 + Math.random() * 3,
  }));
  let frame;
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drops.forEach(d => {
      ctx.beginPath();
      ctx.strokeStyle = `rgba(${180 + Math.floor(Math.random()*75)},0,0,0.85)`;
      ctx.lineWidth = d.width;
      ctx.moveTo(d.x, d.y);
      ctx.lineTo(d.x, d.y + d.len);
      ctx.stroke();
      d.y += d.speed;
      if (d.y > canvas.height) { d.y = -d.len; d.x = Math.random() * canvas.width; }
    });
    frame = requestAnimationFrame(draw);
  }
  draw();
  setTimeout(() => {
    cancelAnimationFrame(frame);
    overlay.style.transition = 'opacity 1s';
    overlay.style.opacity = '0';
    setTimeout(() => { overlay.style.display='none'; overlay.style.opacity='1'; showHome(); }, 1000);
  }, 4000);
}

function fxMalware() {
  const overlay = document.getElementById('fx-malware');
  overlay.style.display = 'flex';
  const canvas = document.getElementById('matrix-canvas');
  canvas.width = window.innerWidth; canvas.height = window.innerHeight;
  const ctx = canvas.getContext('2d');
  const cols = Math.floor(canvas.width / 16);
  const drops = Array(cols).fill(1);
  let frame;
  function drawMatrix() {
    ctx.fillStyle = 'rgba(0,0,0,0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#00ff00';
    ctx.font = '14px monospace';
    drops.forEach((y, i) => {
      ctx.fillText(String.fromCharCode(0x30A0 + Math.random() * 96), i * 16, y * 16);
      if (y * 16 > canvas.height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    });
    if (Math.random() > 0.7) {
      ctx.fillStyle = `rgba(255,0,0,${Math.random()*0.3})`;
      ctx.fillRect(Math.random()*canvas.width, Math.random()*canvas.height, Math.random()*200+50, Math.random()*10+2);
    }
    frame = requestAnimationFrame(drawMatrix);
  }
  drawMatrix();
  setTimeout(() => {
    cancelAnimationFrame(frame);
    overlay.style.display = 'none';
    window.location.href = 'https://www.google.com';
  }, 3000);
}

function fxWhiteRain() {
  const overlay = document.getElementById('fx-rain');
  overlay.style.display = 'flex';
  overlay.style.background = '#000';
  const canvas = document.getElementById('rain-canvas');
  canvas.width = window.innerWidth; canvas.height = window.innerHeight;
  const ctx = canvas.getContext('2d');
  let phase = 'white', bgWhiteness = 0, puddleHeight = 0, elapsed = 0;
  const drops = Array.from({length: 120}, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * -canvas.height,
    speed: 5 + Math.random() * 7,
    len: 12 + Math.random() * 20,
  }));
  let frame;
  function draw() {
    elapsed += 16;
    if (elapsed > 2000 && phase === 'white') phase = 'black';
    if (elapsed > 4000 && phase === 'black') phase = 'puddle';
    if (phase === 'white') {
      bgWhiteness = Math.min(bgWhiteness + 2, 255);
      overlay.style.background = `rgb(${bgWhiteness},${bgWhiteness},${bgWhiteness})`;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (phase !== 'puddle') {
      drops.forEach(d => {
        ctx.beginPath();
        ctx.strokeStyle = phase === 'white' ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.85)';
        ctx.lineWidth = 1.5;
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x, d.y + d.len);
        ctx.stroke();
        d.y += d.speed;
        if (d.y > canvas.height) { d.y = -d.len; d.x = Math.random() * canvas.width; }
      });
    }
    if (phase === 'puddle') {
      puddleHeight = Math.min(puddleHeight + 1.5, canvas.height * 0.4);
      const grad = ctx.createLinearGradient(0, canvas.height - puddleHeight, 0, canvas.height);
      grad.addColorStop(0, 'rgba(10,0,0,0)');
      grad.addColorStop(1, 'rgba(5,0,0,0.95)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, canvas.height - puddleHeight, canvas.width, puddleHeight);
    }
    frame = requestAnimationFrame(draw);
  }
  draw();
  setTimeout(() => {
    cancelAnimationFrame(frame);
    overlay.style.transition = 'opacity 1s';
    overlay.style.opacity = '0';
    setTimeout(() => {
      overlay.style.display = 'none';
      overlay.style.opacity = '1';
      overlay.style.background = '#000';
      showHome();
    }, 1000);
  }, 6000);
}

function fxStatic() {
  const overlay = document.getElementById('fx-static');
  overlay.style.display = 'flex';
  const canvas = document.getElementById('static-canvas');
  canvas.width = window.innerWidth; canvas.height = window.innerHeight;
  const ctx = canvas.getContext('2d');
  let frame;
  function drawStatic() {
    const imgData = ctx.createImageData(canvas.width, canvas.height);
    const d = imgData.data;
    for (let i = 0; i < d.length; i += 4) {
      const v = Math.random() > 0.5 ? 255 : 0;
      d[i]=v; d[i+1]=v; d[i+2]=v; d[i+3]=180;
    }
    ctx.putImageData(imgData, 0, 0);
    frame = requestAnimationFrame(drawStatic);
  }
  drawStatic();
  setTimeout(() => {
    cancelAnimationFrame(frame);
    overlay.style.display = 'none';
    showHome();
  }, 3000);
}

function fxCountdown() {
  const overlay = document.getElementById('fx-countdown');
  overlay.style.display = 'flex';
  const numEl = document.getElementById('countdown-num');
  let count = 10;
  if (numEl) numEl.textContent = count;
  const interval = setInterval(() => {
    count--;
    if (numEl) numEl.textContent = count;
    if (count <= 0) {
      clearInterval(interval);
      overlay.style.display = 'none';
      showHome();
    }
  }, 1000);
}

// ============================================================
// EXISTING EFFECTS (preserved)
// ============================================================
setInterval(() => {
  document.body.style.transform = `translate(${Math.random()*4-2}px,${Math.random()*4-2}px)`;
  setTimeout(() => { document.body.style.transform = ""; }, 120);
}, 7000);

document.querySelectorAll(".art-card, .btn-access").forEach(el => {
  el.addEventListener("click", () => {
    el.classList.add("glitch");
    setTimeout(() => { el.classList.remove("glitch"); }, 250);
  });
});
