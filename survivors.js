// survivors.js — Automated Survivor Messages v2
// Smarter lore references | Varied cadence | Multi-segment conversations

const SURVIVOR_MESSAGES = [
  { char:'Suhana.28',    flag:'🇧🇩', msg:'the obsedia started again. third night in a row. sky looks like its bleeding down on us.' },
  { char:'Suhana.28',    flag:'🇧🇩', msg:'used to get hilsa from the old market. the jawies took that street months ago. i still remember how it smelled.' },
  { char:'Finn_22',      flag:'🇮🇪', msg:'i saw it again. march 31st replay. same silver shimmer on the moon. nobody else saw it. nobody.' },
  { char:'Finn_22',      flag:'🇮🇪', msg:'the outbreak started in nepal on april 5th. the sky glitched on march 31st. five days apart. that gap is not random.' },
  { char:'Yuki.12',      flag:'🇯🇵', msg:'振動を感じた。shiro oni nearby. staying completely still. do not move. do not breathe loud.' },
  { char:'Yuki.12',      flag:'🇯🇵', msg:'oldbones moved three blocks east overnight. they dont usually travel that far. something pushed them.' },
  { char:'Mateo_23',     flag:'🌍',  msg:'new logbook entry. aquatic variant — walks fully submerged at 40m. verified owl stamp. entry 7-C.' },
  { char:'Mateo_23',     flag:'🌍',  msg:'three unclassified variants this week. one exhibits coordinated behavior with others. logging as possible anomaly.' },
  { char:'Lars_09',      flag:'🇸🇪', msg:'this is wncore relay station 09. 88.7 clear for now. ghuul count holding at 173. stay on frequency.' },
  { char:'Lars_09',      flag:'🇸🇪', msg:'wncore 09. someone is scrambling our signal every 31 minutes exactly. that\'s not natural interference.' },
  { char:'Amara_21',     flag:'🇳🇬', msg:'the rain sample came back. its not water. not acid. molecular structure suggests artificial origin. the sky is not bleeding naturally.' },
  { char:'Amara_21',     flag:'🇳🇬', msg:'obsedia calms them. every time the rain falls, the mora stop moving for exactly the same duration. that is not coincidence.' },
  { char:'itsIsmael',    flag:'🇵🇰', msg:'karachi sector mostly quiet. mostly. you don\'t want to know what mostly means here.' },
  { char:'Tariq_13',     flag:'🇧🇩', msg:'bhola survived the 1970 cyclone. survived the liberation war. survived floods every year. this is just another storm. we endure.' },
  { char:'Dmitri_15',    flag:'🇷🇺', msg:'the prion theory holds. the brain isn\'t infected. it\'s been reprogrammed. there is a signal source. i will find it.' },
  { char:'Dmitri_15',    flag:'🇷🇺', msg:'if the signal started before april 5th, the outbreak wasn\'t the cause. the signal was. nepal was just where it manifested first.' },
  { char:'Ji-Woo.04',    flag:'🇲🇾', msg:'bite wound healed overnight. fully. but the tissue is black now. patient is still conscious. watching carefully.' },
  { char:'Ji-Woo.04',    flag:'🇲🇾', msg:'we\'re seeing the black tissue in patients who were never bitten. exposure only. white flag needs more samples.' },
  { char:'Ingrid.05',    flag:'🇩🇪', msg:'the fog moved 2km east today. berlin east sector now compromised. i still don\'t know why i survived it. i don\'t think i ever will.' },
  { char:'Bastian_25',   flag:'🌊',  msg:'three aquatics on the sea floor tonight. just walking. slow. like they forgot which direction the shore was.' },
  { char:'Bastian_25',   flag:'🌊',  msg:'the aquatics below don\'t react to obsedia rain. only the ones on land do. interesting.' },
  { char:'Zahara.18',    flag:'🇺🇸', msg:'chip delivery 0.315126 completed. alaska perimeter secure. do not approach the wall. they have orders.' },
  { char:'Zahara.18',    flag:'🇺🇸', msg:'alaska safe zone population: declining. not from infection. from infighting. the governments are not united.' },
  { char:'Elodie_01',    flag:'❓',  msg:'the sky. the sky. did you. the sky on march. do you. remember the sky on march.' },
  { char:'novafloria11', flag:'🇮🇸', msg:'the obsedia fell on the glacier tonight. black on white. the world is writing something. i just can\'t read it yet.' },
  { char:'Mei-Ling.14',  flag:'✈️',  msg:'cloud ceiling at 8000ft clear. obsedia layer at 12000. window is 4 hours. use it or lose it.' },
  { char:'ranirani7',    flag:'🇱🇰', msg:'someone is scrambling 88.7 deliberately. this isn\'t interference. someone doesn\'t want us talking.' },
  { char:'ranirani7',    flag:'🇱🇰', msg:'the blood pact knew about the outbreak before it started. i have proof. i\'m not sharing it over open channel.' },
  { char:'Arjun_17',     flag:'🇮🇳', msg:'ok so i made a tier list. S-tier: coastal settlements. A-tier: mountains. D-tier: cities. F-tier: germany obviously.' },
  { char:'Anaya.11',     flag:'❓',  msg:'broadcasting from the rooftop. signal clear. the light still reaches. it always reaches. we are still here.' },
  { char:'Rafael_02',    flag:'🇲🇽', msg:'blood pact is moving product. pre-outbreak tech. medical supplies. you want anything you come through us. that\'s how it is now.' },
  { char:'Elowen.27',    flag:'🌿',  msg:'the trees stopped flowering three weeks before the outbreak. plants don\'t lie. they knew before any signal.' },
  { char:'Add1s0n17',    flag:'🇺🇸', msg:'ok real talk the times square billboard glitched again. same footage as march 31st. anyone else seeing this or just me' },
  { char:'Anne24',       flag:'🇵🇭', msg:'i don\'t know if stay or move is the right call. rain here is black again. maybe move. maybe that\'s wrong too.' },
  { char:'Som25',        flag:'🇧🇩', msg:'...' },
  { char:'Som25',        flag:'🇧🇩', msg:'nine people. all gone. if anyone out there knew an anne from dumaguete. please. just tell me she existed somewhere.' },
  { char:'poma12',       flag:'🇧🇩', msg:'i\'m listening. keep talking. all of you.' },
  { char:'J07nHe77ere',  flag:'🇺🇸', msg:'who is add1s0n talking to on this channel. i see every message. i see all of them.' },
  { char:'sakia23',      flag:'🇹🇷', msg:'crossed the third border yesterday. wncore coordinates were accurate. whoever built this network — thank you.' },
  { char:'Luciana_31',   flag:'🌕',  msg:'the dome is fine. everything up here is fine. please do not send more people. we cannot take more people.' },
  { char:'Kwame.07',     flag:'🇸🇿', msg:'antarctica is colder than it should be. the migration passed us three days ago. nothing has come back south.' },
  { char:'Soren_19',     flag:'🇯🇵', msg:'japan government is not in a stronghold. it\'s a bunker with a flag. i left before they raised it.' },
];

const MULTI_PART = [
  {
    char:'Dmitri_15', flag:'🇷🇺',
    parts:[
      'theory: the cygnus signal and the outbreak are connected.',
      '"they lied to us." who is they. what did they lie about.',
      'i think someone sent that signal knowing what was coming. and someone here knew too.',
    ]
  },
  {
    char:'Finn_22', flag:'🇮🇪',
    parts:[
      'march 31st. everyone needs to think about march 31st.',
      'sky glitched. moon shimmered silver. i saw it with my own eyes.',
      'outbreak started in nepal five days later. that is not a coincidence. it never was.',
    ]
  },
  {
    char:'Suhana.28', flag:'🇧🇩',
    parts:[
      'used to buy hilsa from the old market in dhaka.',
      'the same market is full of jawies now. i can\'t go back.',
      'i still remember how it smelled. i think about it more than i should.',
    ]
  },
  {
    char:'Elodie_01', flag:'❓',
    parts:[
      'the signal. the signal is still.',
      'frequency. the frequency is.',
      '88.7. listen to 88.7. please.',
    ]
  },
  {
    char:'Lars_09', flag:'🇸🇪',
    parts:[
      'wncore 09 status update: 88.7 partially clear.',
      'ghuul count still 173. that count has not changed in six weeks.',
      'something is limiting them. or something is keeping the count exact. i don\'t know which.',
    ]
  },
  {
    char:'Mateo_23', flag:'🌍',
    parts:[
      'logbook update: 14 new variant sightings this week.',
      '3 remain unclassified. one shows coordinated movement with other variants.',
      'if you\'ve seen something without a name — describe it. i\'ll add it. that\'s what logbook is for.',
    ]
  },
  {
    char:'Amara_21', flag:'🇳🇬',
    parts:[
      'the obsedia rain has a pattern.',
      'it falls heaviest in areas where ghuul sightings are highest. not random.',
      'the rain calms them. and it falls where they are. i don\'t think that\'s weather.',
    ]
  },
  {
    char:'Bastian_25', flag:'🌊',
    parts:[
      'eight aquatics tonight.',
      'they\'re moving in the same direction. all of them.',
      'aquatics have never coordinated before. something changed.',
    ]
  },
];

// ── State ─────────────────────────────────────────────────────
let survTimer = null, survRunning = false, lastChar = null;

function startSurvivors() {
  if (survRunning) return;
  survRunning = true;
  schedule();
}

function schedule() {
  if (!survRunning) return;
  // Random 3-7 min
  const delay = (3 + Math.random()*4) * 60 * 1000;
  survTimer = setTimeout(post, delay);
}

async function post() {
  if (!survRunning) return;
  if (typeof sb === 'undefined' || !sb) { schedule(); return; }

  // 35% chance multi-part
  if (Math.random() < 0.35) {
    const msg = MULTI_PART[Math.floor(Math.random()*MULTI_PART.length)];
    for (let i=0; i<msg.parts.length; i++) {
      await save(msg.char, msg.flag, msg.parts[i]);
      if (i < msg.parts.length-1) await sleep(1200 + Math.random()*2000);
    }
    lastChar = msg.char;
  } else {
    const pool = SURVIVOR_MESSAGES.filter(m => m.char !== lastChar);
    const entry = pool[Math.floor(Math.random()*pool.length)];
    lastChar = entry.char;
    await save(entry.char, entry.flag, entry.msg);
  }
  schedule();
}

async function save(char, flag, content) {
  try {
    await sb.from('messages').insert({
      room_id:'global', username:char, content,
      is_ai:true, flag, created_at:new Date().toISOString()
    });
  } catch(e) { console.error('Survivor save err:', e); }
}

function sleep(ms) { return new Promise(r=>setTimeout(r,ms)); }

// Wait for sb
const _si = setInterval(() => {
  if (typeof sb !== 'undefined' && sb) {
    clearInterval(_si);
    setTimeout(startSurvivors, 35000);
  }
}, 1000);
