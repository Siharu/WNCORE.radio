// EXAMPLE: How to integrate lore-manager into wncore-broadcast.js
// This shows the refactoring to use centralized lore instead of hardcoded TOPICS

// ════════════════════════════════════════════════════════════
// BEFORE: Hardcoded topics (duplicated across broadcast systems)
// ════════════════════════════════════════════════════════════

const TOPICS_OLD = [
  'Rain of Obsedia — recent observations and behavior changes in zombies during rainfall',
  'Ghuul sightings — new incidents, movement patterns, 173 count holding or shifting',
  'The Blank Zone (2028-2031) — new theories, recovered fragments, what was happening',
  // ... 15+ more hardcoded items
];

// ════════════════════════════════════════════════════════════
// AFTER: Fetch from centralized lore-manager API
// ════════════════════════════════════════════════════════════

import { createClient } from '@supabase/supabase-js';
import { fetchActiveLore } from './lore-manager.js';  // or fetch via HTTP

const sb = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// Option 1: Use ES6 import (if running in Node environment)
async function getTopicsFromLore() {
  try {
    const lore = await fetchActiveLore();
    // Transform lore items into discussion topics
    return lore.map(item => ({
      topic: item.content,
      category: item.category,
      author: item.author,
    }));
  } catch (err) {
    console.error('Failed to fetch lore:', err);
    return getDefaultTopics();  // fallback
  }
}

// Option 2: Fetch via HTTP (works from Vercel API)
async function getTopicsViaAPI() {
  try {
    const response = await fetch(
      `${process.env.API_BASE_URL || 'http://localhost:3000'}/api/lore-manager`,
      { headers: { 'Content-Type': 'application/json' } }
    );
    if (!response.ok) throw new Error('Lore API failed');
    const lore = await response.json();
    return lore.map(item => item.content);
  } catch (err) {
    console.error('Failed to fetch lore via API:', err);
    return getDefaultTopics();
  }
}

// Fallback topics (if lore system is down)
function getDefaultTopics() {
  return [
    'Rain of Obsedia — recent observations and behavior changes in zombies during rainfall',
    'Ghuul sightings — new incidents, movement patterns, 173 count holding or shifting',
  ];
}

// ════════════════════════════════════════════════════════════
// INTEGRATION: Use in broadcast handler
// ════════════════════════════════════════════════════════════

// OLD way (in wncore-broadcast.js):
// export default async function handler(req, res) {
//   const topic = pick(TOPICS);  // Hardcoded
//   ...
// }

// NEW way:
export default async function handler(req, res) {
  const isCron = req.headers['x-vercel-cron'] === '1';
  const isManual = req.headers['authorization'] === `Bearer ${process.env.WNCORE_SECRET}`;
  if (!isCron && !isManual) return res.status(401).json({error:'Unauthorized'});

  try {
    // Fetch lore dynamically
    const topics = await getTopicsViaAPI();
    
    // Pick random topic
    const topic = topics[Math.floor(Math.random() * topics.length)];
    
    // Rest of your broadcast logic...
    const { data: recent } = await sb
      .from('messages')
      .select('*')
      .eq('room_id','wncore')
      .order('created_at',{ascending:false})
      .limit(12);
    
    const msgs = (recent||[]).reverse();
    
    // Build prompt with lore-based topic
    const prompt = buildPrompt(firstChar, topic, msgs);
    const reply = await gemini(prompt);
    // ... save and respond
    
    return res.status(200).json({ 
      success: true, 
      topic,  // Now from lore system
      speakers: results 
    });
  } catch(err) {
    console.error('Broadcast error:', err);
    return res.status(500).json({error:err.message});
  }
}

// ════════════════════════════════════════════════════════════
// BENEFIT: Character can react to player-added lore
// ════════════════════════════════════════════════════════════

// Player adds lore via `lore-admin-panel.html` or API:
// POST { category: 'PLAYER_EVENT', content: '🎯 NEW THING — Survivors spotted new variant' }

// This appears in next broadcast naturally! NO code changes needed.
// Because broadcast now pulls from dynamic lore, not hardcoded list.

// ════════════════════════════════════════════════════════════
// ADVANCED: Filter lore by category for specific broadcasts
// ════════════════════════════════════════════════════════════

async function getTopicsByCategory(category) {
  try {
    const response = await fetch(
      `${process.env.API_BASE_URL || 'http://localhost:3000'}/api/lore-manager?category=${category}`
    );
    if (!response.ok) throw new Error('Lore API failed');
    const lore = await response.json();
    return lore.map(item => item.content);
  } catch (err) {
    console.error('Failed to fetch lore by category:', err);
    return [];
  }
}

// Example: Only broadcast variant alerts
async function runVariantBroadcast() {
  const variants = await getTopicsByCategory('VARIANT_ALERT');
  if (variants.length > 0) {
    const alert = variants[Math.floor(Math.random() * variants.length)];
      // Broadcast this alert (logging disabled for security)
  }
}

// ════════════════════════════════════════════════════════════
// CONSOLIDATION: The complete refactored section
// ════════════════════════════════════════════════════════════

// Replace this in wncore-broadcast.js:
// 
// const TOPICS = [...35 hardcoded items...];
// 
// With this:

const getTopics = async () => {
  try {
    const url = `${process.env.API_BASE_URL || 'http://localhost:3000'}/api/lore-manager`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`API ${response.status}`);
    const lore = await response.json();
    return lore.map(item => item.content).filter(Boolean);
  } catch (err) {
    console.error('Lore fetch failed:', err);
    return [
      'Rain of Obsedia — recent observations and behavior changes',
      'Ghuul sightings — new incidents, movement patterns, 173 count',
      'The Blank Zone (2028-2031) — new theories, recovered fragments',
    ];  // minimal fallback
  }
};

// Then in handler:
export default async function handler(req, res) {
  // ... auth check ...
  
  const topics = await getTopics();  // Now dynamic!
  const topic = topics[Math.floor(Math.random() * topics.length)];
  
  // ... rest of broadcast logic using dynamic topic ...
}

// ════════════════════════════════════════════════════════════
// TIMELINE FOR MIGRATION
// ════════════════════════════════════════════════════════════

// Week 1:
// [ ] Create lore-manager.js ✓
// [ ] Move lore to Supabase
// [ ] Update ticker.js to use API ✓
// [ ] Create admin panel ✓

// Week 2:
// [ ] Update wncore-broadcast.js to fetch topics dynamically
// [ ] Update wncore-bots.js to use shared lore
// [ ] Consolidate TOPICS across files (eliminate duplication)

// Week 3:
// [ ] Remove hardcoded lore (delete TOPICS constants)
// [ ] Test player-driven lore events
// [ ] Optimize API caching if needed

// ════════════════════════════════════════════════════════════
