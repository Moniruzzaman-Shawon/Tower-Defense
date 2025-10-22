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
