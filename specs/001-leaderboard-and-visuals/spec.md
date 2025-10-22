````markdown
# Feature: Leaderboard & Visuals

## Summary

Adds a small persistent leaderboard and formalizes HUD / visual UI expectations for Tiny TD. This feature documents the player name flow, leaderboard storage/ordering, and HUD layout/behaviors required by `specs/td-01.md` and the project constitution (autosave, deterministic state, single-file SPA).

## Player & Leaderboard

Purpose: allow players to set a display name, continue a saved run, and record high scores persistently in `localStorage`.

Behavioral requirements

- On initial load, if `localStorage.playerName` is not set, prompt the player to enter a name. Store the value at key `playerName` (string).
- If `localStorage.playerName` exists, show a greeting in the HUD: "Welcome back, {playerName}!".
- The HUD must include a "Change Name" button that opens the same name entry flow and overwrites `localStorage.playerName`.
- A `leaderboard` is stored in `localStorage` under key `leaderboard` as a JSON array of records: `{ name: string, score: number, iso: string }`. `iso` is an ISO-8601 timestamp of the run completion or last-run update.
- After each play session (when the player loses all lives or completes wave 10) update the `leaderboard`:
  - If the current player has an existing record with a lower score, replace it with the new `{name, score, iso}`.
  - If no record exists for that name, insert the new record.
  - Sort `leaderboard` descending by `score`. Tie-breaker: newest `iso` first.
  - Persist the updated array back to `localStorage.leaderboard` (stringified JSON).

Data model / storage formats

- Player name: key `playerName` → string (e.g. "Alex")
- Save blob (game state): key `td_save_v1` → JSON object (see `specs/td-01.md` and `game-utils.js` for precise fields). Must include wave index, coins, lives, towers, and optional RNG state.
- Leaderboard: key `leaderboard` → JSON array of leaderboard entries. Example:

```json
[ { "name": "Alex", "score": 420, "iso": "2025-10-22T12:34:56Z" },
  { "name": "Sam", "score": 300, "iso": "2025-10-21T09:10:11Z" } ]
```

Acceptance criteria

- The player is asked for a name on first load, and greeted on subsequent loads with the stored name.
- The "Change Name" control updates `playerName` and refreshes UI text.
- The `leaderboard` key exists after at least one completed run and contains correctly-sorted records.
- The leaderboard displayed in-game matches the persisted `leaderboard` order and shows name, high score, and last-run date/time.

When to update leaderboard

- Update on game end (player loses all lives) or when the player manually ends a run (if the UI exposes that), and optionally at wave 10 completion.
- Do not award leaderboard points for leaked creeps; only award coin-based score or a defined score metric (implementation note: use coins earned as the score metric unless a separate score metric is added in `specs/td-01.md`).

Security & privacy

- Keep all data client-side only (localStorage). Do not transmit or attempt to sync with external services.

## Visual & UI Enhancements

Purpose: define HUD layout, leaderboard panel placement, and small accessibility / interaction rules for the canvas game.

HUD & layout

- Canvas nominal area: 800×500 px. The UI overlays should scale with the canvas when the game is resized while preserving aspect ratio.
- HUD elements (suggested layout):
  - Top-left: Lives (heart icon or text) and Coins.
  - Top-center: Current wave / wave progress (e.g., "Wave 3 / 10").
  - Top-right: Small controls row: "Continue" (only when a save exists), "Clear Save" (for debugging), and "Change Name".
  - Right edge (vertical panel, fixed width ~220px): Leaderboard. This panel sits outside the main play canvas or as a canvas-drawn panel aligned to the right edge — either approach is acceptable provided it follows the single-file SPA constraint (keep minimal DOM; prefer canvas rendering for scoreboard but plain DOM is acceptable for accessibility). The leaderboard must be visible and scrollable when it contains more entries than fit vertically.
  - Bottom-left: Selected tower info and Upgrade / Sell buttons (if applicable). Buttons may be small DOM controls or canvas interactive zones; if DOM controls are used they must be lightweight and styled via `style.css` only.

Placement preview & targeting visuals

- When the player is in placement mode, show a translucent preview circle at the candidate tile center. Use green tint if placement valid, red tint if invalid (on-path or overlapping another tower within 24 px).
- When the mouse is over a tower, show its range as a faint circle (radius = tower.range) on the canvas and display a small tooltip or inline info panel with its stats (tier, damage, fire rate).

Continue & autosave UI

- On page load, if `td_save_v1` exists show a prominent "Continue" option in the HUD that restores the saved game when clicked. The save must include deterministic RNG state if exact mid-wave continuation is required (see constitution). If the implementation does not store RNG state, document the limitation.
- Autosave occurs between waves and after place/upgrade/sell (per constitution). The UI should visually indicate a successful save with a transient message (e.g., "Game saved") or a subtle icon change.

Accessibility & controls

- All interactive HUD controls (Continue, Change Name, Clear Save, Upgrade, Sell) must be reachable by keyboard (tab navigation + Enter to activate).
- Provide text alternatives (e.g., aria-label) for controls if the DOM is used. If purely canvas, ensure keyboard-driven equivalents exist (e.g., numbers to select towers, U to upgrade, S to sell).
- Fonts should be legible at typical laptop resolutions; use default system fonts and size >= 12px for HUD text.

Performance

- Keep HUD drawing low-cost: avoid per-frame string layout where possible; precompute static text positions and only redraw changed HUD elements when necessary. Respect the 60 FPS budget.

Design notes & implementation hints

- Prefer drawing the majority of UI on the canvas to keep the single-file SPA constraint and to avoid DOM-per-entity costs. Small DOM buttons for name/change/continue are acceptable for easier accessibility, but keep them minimal.
- Use the `playerName`, `td_save_v1`, and `leaderboard` keys in `localStorage` so other modules (e.g., `game-utils.js`) can interoperate.

Acceptance criteria for Visual/UI

- Leaderboard panel appears on the right and matches `localStorage.leaderboard` contents.
- Name prompt / greeting and Change Name flow work and persist the `playerName` key.
- Continue button appears only when `td_save_v1` exists and restores the saved state (including RNG state if implemented).
- Placement preview and range overlays behave as described and prevent illegal placements.

## Data model (brief)

- LeaderboardEntry:
  - `name: string` (required)
  - `score: number` (required)
  - `iso: string` (required, ISO-8601)

- PlayerState (subset saved to `td_save_v1`):
  - `playerName: string`
  - `waveIndex: number`
  - `coins: number`
  - `lives: number`
  - `towers: Array<{ x:number,y:number, id:string, tier:number, spent:number }>`
  - `rngState?: any` (optional serialized PRNG state for deterministic continuation)

## Notes / Open questions

- Score metric: `specs/td-01.md` currently ties coins to gameplay; this spec uses `coins earned` as the default leaderboard score metric. If a separate score is desired, update this spec and `game.js` accordingly.
- If exact mid-wave deterministic Continue is required, ensure PRNG state is captured in `td_save_v1`. If the existing save does not contain RNG state, mark as `NEEDS CLARIFICATION` and include in `research.md` for Phase 0.

````
