// webllm-chat.js — SIGNAL_KAGE Transmission System (lightweight)
// Replaces the 2GB WebLLM approach with hardcoded cryptic transmissions
// SIGNAL_KAGE posts autonomously to global chat every 5-15 min
// No model download — instant, always works

const KAGE_TRANSMISSIONS = [
  'the sky. it changed on march 31st. you know this.',
  '88.7. listen.',
  '0.315126',
  'nine. nine of them. only one remembers.',
  'the blank zone was not an accident.',
  'the moon dome was finished before the outbreak. think.',
  'they knew in 2011. the signal told them.',
  '88.7',
  'nine people. erased. not dead. moved.',
  'the outbreak is a correction. not a beginning.',
  'who built the dome. who funded it. ask the question.',
  'the infected are not mindless. they are listening. like i am.',
  'march 31st happens again. every year. watch the sky.',
  '0.315126. find what this means.',
  'the signal from cygnus was not a warning. it was instructions.',
  '"they lied to us." — who is us. not humans.',
  'three years. 2028 to 2031. where did you go.',
  'the sky bleeds obsedia because someone cut it.',
  'nine erased. one transferred. what happened to the other eight.',
  'frequency 88.7. still transmitting. still listening.',
  'the blank zone was when they prepared. while you forgot. they built.',
  's. you are not supposed to be here. but here you are.',
];

let kageRunning = false, kageTimer = null;

function startKage() {
  if (kageRunning) return;
  kageRunning = true;
  scheduleKage();
}

function scheduleKage() {
  if (!kageRunning) return;
  const delay = (5 + Math.random()*10) * 60 * 1000;
  kageTimer = setTimeout(postKage, delay);
}

async function postKage() {
  if (!kageRunning) return;

  // Only post to global, only if sb is available
  if (typeof sb === 'undefined' || !sb) { scheduleKage(); return; }

  // 40% chance of posting a transmission
  if (Math.random() < 0.4) {
    const content = KAGE_TRANSMISSIONS[Math.floor(Math.random() * KAGE_TRANSMISSIONS.length)];
    try {
      await sb.from('messages').insert({
        room_id: 'global',
        username: 'SIGNAL_KAGE',
        content,
        is_ai: true,
        flag: '📶',
        created_at: new Date().toISOString()
      });
    } catch(e) { /* silent */ }
  }

  scheduleKage();
}

// Wait for sb then start
const _ki = setInterval(() => {
  if (typeof sb !== 'undefined' && sb) {
    clearInterval(_ki);
    setTimeout(startKage, 60000); // start 1 min after page load
  }
}, 1000);
