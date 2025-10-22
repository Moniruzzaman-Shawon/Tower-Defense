// Small utilities used by the Tiny TD project
// - Seeded PRNG (linear congruential generator) with string seed
// - localStorage save / load helpers for a single save blob

/* Seeded PRNG
 * Usage:
 *   const rng = new SeededRNG('TDMINI');
 *   rng.next() -> float in [0,1)
 */
class SeededRNG {
  constructor(seedString = 'TDMINI') {
    // Convert string seed to 32-bit integer
    let h = 2166136261 >>> 0;
    for (let i = 0; i < seedString.length; i++) {
      h ^= seedString.charCodeAt(i);
      h = Math.imul(h, 16777619) >>> 0;
    }
    this.state = h || 1;
  }

  // LCG parameters (32-bit)
  nextUint() {
    // constants from Numerical Recipes
    this.state = ( Math.imul(1664525, this.state) + 1013904223 ) >>> 0;
    return this.state;
  }

  next() {
    return this.nextUint() / 0x100000000;
  }

  // convenience: random integer in [0, n)
  randInt(n) {
    return Math.floor(this.next() * n);
  }
}

/* Persistence helpers
 * A single save blob is stored under key 'td_save_v1'
 * Save minimal state: waveIndex, player (coins,lives), towers array, rngState optional
 */
const SAVE_KEY = 'td_save_v1';

function saveGame(state) {
  try {
    const s = JSON.stringify(state);
    localStorage.setItem(SAVE_KEY, s);
    return true;
  } catch (e) {
    console.error('saveGame failed', e);
    return false;
  }
}

function loadGame() {
  try {
    const s = localStorage.getItem(SAVE_KEY);
    if (!s) return null;
    return JSON.parse(s);
  } catch (e) {
    console.error('loadGame failed', e);
    return null;
  }
}

function clearSave() {
  localStorage.removeItem(SAVE_KEY);
}

// Player name helper
const PLAYER_NAME_KEY = 'playerName';
function getPlayerName(){ return localStorage.getItem(PLAYER_NAME_KEY) || null; }
function setPlayerName(name){ if(typeof name==='string') localStorage.setItem(PLAYER_NAME_KEY, name); }

// Leaderboard helpers: stored as array of {name,score,iso}
const LEADERBOARD_KEY = 'leaderboard';
function loadLeaderboard(){ try{ const s = localStorage.getItem(LEADERBOARD_KEY); return s? JSON.parse(s): []; }catch(e){ console.error('loadLeaderboard',e); return []; }}
function saveLeaderboard(arr){ try{ localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(arr)); return true;}catch(e){ console.error('saveLeaderboard',e); return false; }}
function updateLeaderboardEntry(name, score){ if(!name) return; const arr = loadLeaderboard(); const iso = (new Date()).toISOString(); const existing = arr.find(r=>r.name===name);
  if(existing){ if(score > existing.score){ existing.score = score; existing.iso = iso; }} else { arr.push({name,score,iso}); }
  // sort desc by score, tiebreak by newest iso (most recent first)
  arr.sort((a,b)=>{
    if(b.score !== a.score) return b.score - a.score;
    const ta = Date.parse(a.iso) || 0;
    const tb = Date.parse(b.iso) || 0;
    return tb - ta;
  });
  saveLeaderboard(arr); return arr;
}

// Example: how to create initial save state
function makeInitialState() {
  return {
    waveIndex: 0,
    player: { coins: 100, lives: 15 },
    towers: [],
    // optional: store RNG integer state if using seeded RNG across saves
    rngState: null
  };
}

// Export for use in browser script tag (no module bundler assumed)
window.SeededRNG = SeededRNG;
window.saveGame = saveGame;
window.loadGame = loadGame;
window.clearSave = clearSave;
window.makeInitialState = makeInitialState;
