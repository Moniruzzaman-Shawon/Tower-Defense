## Purpose

Quick, focused instructions for AI coding agents working on this Tiny Tower Defense project.
Keep edits small, testable, and aligned to the single-file SPA constraints in `specs/td-01.md`.

## Big picture (what to know immediately)

- Single-page canvas game (vanilla JS). Target files: `index.html`, `style.css`, `game.js` (no build step).
- Canvas nominal size: 800×500 px; game grid 20×12 tiles (40 px tile). Path is defined by tile centers in
  `specs/td-01.md` and should be converted to pixel coordinates (tile_x*40 + 20, tile_y*40 + 20).
- Deterministic behavior required: seeded RNG string "TDMINI" (search for RNG, seed usage or implement a
  small seeded PRNG if missing).
- Autosave requirement: saves to `localStorage` between waves and after place/upgrade/sell; implement
  save/restore and a Continue flow on load.

Quick snippets (copy into `game.js` as-needed):

// Seeded RNG
// const rng = new SeededRNG('TDMINI');
// const r = rng.next(); // float [0,1)

// Save/load
// const state = loadGame() || makeInitialState();
// saveGame(state);

## Architecture & components (where logic should live)

- Rendering/input: canvas draw + pointer events in `game.js`.
- Game model & rules: keep a clear separation between data (creeps, towers, waves, player state) and
  rendering. Prefer small functions: update(dt), spawnWave(), applyProjectileHits().
- Persistence: single save blob in `localStorage` (serialize minimal state: wave index, player coins/lives,
  towers with positions & tiers, RNG state if used).

## Project-specific conventions & patterns

- No external assets (no images/audio). Use simple shapes and default fonts.
- Keep performance to 60 FPS: batch game updates with requestAnimationFrame and scale UI drawing to the
  canvas size. Avoid per-creep DOM updates; keep everything on canvas.
- Placement rules: towers only on non-path tiles and non-overlapping (min center distance 24 px).
  Validate placement on mouse-up and show preview (green/red) during placement.
- Targeting: towers use "First" (highest path progress). Towers keep target while target remains in range.

## Helpful search terms (use these to find hotspots)

- "seed", "TDMINI", "localStorage", "autosave", "wave", "spawn", "path", "tile", "requestAnimationFrame",
  "projectile", "aoe", "sell", "upgrade", "coins", "lives".

## Dev / run / debug workflow

1. No build. Open `index.html` in a browser or serve the folder from a simple static server to avoid
   file:// issues.

```bash
# from repo root
python3 -m http.server 8000
# then open http://localhost:8000 in browser
```

2. Use browser DevTools for console logs, breakpoints, and performance profiling.
3. Add small unit-like smoke tests by isolating pure functions (e.g., RNG, path progress) into modules and
   manually running them in Node or in-browser test harnesses.

## Acceptance-sensitive behaviors (verify when changing logic)

- Creep movement along the hard-coded path from `specs/td-01.md` and leak → lives--.
- Tower fire rate, projectile speed, AOE behavior (Cannon) must match table in `specs/td-01.md`.
- Coins awarded on kill only; selling returns 70% of total spent (including upgrades).
- Autosave occurs between waves and after build/upgrade/sell; Continue restores the exact game state.

## When you change game rules

- Update `specs/td-01.md` only if the design intentionally changes. Otherwise keep code aligned to that spec.
- Add clear, minimal tests for deterministic systems (seeded RNG, spawn order, targeting selection) and keep
  them next to the affected module.

## If you are uncertain

- Ask the maintainer which file is the single authoritative game file before splitting logic into many files.
- Prefer small, reversible changes and add autosave/restore tests before changing persistence formats.

## Key files to inspect now

- `specs/td-01.md` — authoritative game design and acceptance criteria (start here).
- `.specify/templates/*` — project templates and workflow expectations; conform to their gates.
- `.github/prompts/speckit.constitution.prompt.md` — agent prompts and constitution workflow.

Keep changes minimal and verifiable. If you add new files, update `.specify/templates` references and the
top-level README to reflect the run/debug steps.


### Player Setup
- When the game loads, prompt the user to enter their name.
- Store the name in localStorage under `playerName`.
- If a name already exists, greet the player:  
  “Welcome back, {playerName}!”
- Allow them to change their name via a “Change Name” button in the HUD.


### Leaderboard
- A vertical leaderboard appears on the right edge of the screen.
- Each entry shows player name, high score, and date/time of last run.
- Data is persisted to localStorage under `leaderboard`.
- After each play, update or insert the player’s record if the score is higher.
- Sort descending by score.