Integration notes: wiring `game-utils.js` into the Tiny TD game

This repo currently provides `game-utils.js` with a small seeded PRNG and
localStorage helpers. There is no `index.html` or `game.js` in the repo root —
the examples below show a minimal, non-invasive integration you can add to
`game.js` (or a new file) to get deterministic RNG and autosave/continue.

1) Include the utility script in `index.html` before `game.js`:

```html
<script src="game-utils.js"></script>
<script src="game.js"></script>
```

2) Initialize state and RNG at startup (example snippet for `game.js`):

```javascript
// Attempt to restore a saved game, otherwise create initial state
let state = loadGame() || makeInitialState();

// Create seeded RNG. If you choose to persist RNG across saves,
// store `rng.state` and restore it on load.
const rng = new SeededRNG('TDMINI');

// If save contains rngState: rng.state = saved.rngState;

// Example: deterministic spawn choice
function chooseCreepType(list) {
  return list[rng.randInt(list.length)];
}
```

3) Autosave points (call `saveGame(state)`):
- Between waves (when a wave completes)
- After placing/upgrading/selling a tower

Example: save when wave ends

```javascript
function onWaveComplete() {
  // update state.waveIndex etc.
  saveGame(state);
}
```

4) Continue flow on load

- If `loadGame()` returns non-null, show a small HUD modal: "Continue saved game (Wave X)" with a Continue button.
- On Continue: restore `state` into your game model and continue the main loop.

5) Optional: persist PRNG state

- If you want exact deterministic continuation mid-wave, store `rng.state` inside the save blob and
  restore it on load. Example:

```javascript
// Before save
state.rngState = rng.state;
saveGame(state);

// After load
if (state.rngState) rng.state = state.rngState;
```

Notes
- Keep saved blob minimal (waveIndex, player coins/lives, towers array, optional rngState). Avoid storing
  large transient arrays like active projectiles — those can be reconstructed.
- Call `clearSave()` for the Clear Save UI button.
