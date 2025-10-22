````markdown
# Research: RNG-state persistence for deterministic Continue

Feature: Leaderboard & Visuals (Phase 0 research task)

Decision

Persist the PRNG internal state (the integer LCG state) on every autosave event. Autosave events are defined by the project constitution and `specs/td-01.md` as: between waves (wave completion) and after player actions that alter game state (place, upgrade, sell towers). The saved state is stored in the save blob `td_save_v1` under the field `rngState`.

Rationale

- Determinism requirement: The constitution mandates that all gameplay affecting reproducibility use the seeded RNG string "TDMINI" and that PRNG state be persisted if exact mid-wave continuation is required. Capturing the RNG state at every autosave ensures that restoring from any saved state (including mid-wave saves if implemented) recreates the exact same RNG sequence from that point forward.
- Correctness vs. cost: Capturing a single integer (`rng.state`) is negligible in storage and CPU cost. The implementation complexity is minimal (store integer at the same times the save blob is written). The approach avoids subtle non-deterministic bugs introduced when RNG-influenced events (like spawn timing or projectile randomness) occur after save / before restore.
- Developer ergonomics: By using the existing `saveGame(state)` flow, we reuse the same save points already required by the constitution (between waves and after place/upgrade/sell). This avoids introducing a new save cadence while guaranteeing reproducibility for typical playflows.

Alternatives considered

- Capture RNG only at wave boundaries: cheaper and aligned to coarse-grain reproducibility, but fails exact mid-wave continuation when saves occur mid-wave (e.g., after tower placement that happens while waves are active). Rejected because the constitution explicitly allows mid-wave building and requires autosave after placements.
- Capture RNG on every frame: redundant and unnecessary; high-frequency writes can be expensive and risk localStorage write contention. Rejected as overkill.
- Deterministic replay log instead of RNG state: record all RNG outputs to reconstruct sequence. Rejected due to increased storage and complexity.

Implementation notes

- Store `state.rngState = rng.state` in the save blob immediately before calling `saveGame(state)` during autosave points. Already implemented in several save locations (wave completion, post-placement); ensure all other autosave paths also set this field.
- On load/continue, if `state.rngState` exists set `rng.state = state.rngState` before resuming game logic.
- Ensure the serializer stores `rngState` as a plain number (32-bit unsigned integer) so it survives JSON roundtrip safely.

Testing & verification

- Smoke test: seed RNG with "TDMINI", simulate a short play session applying identical actions, capture coin/wave/tower outcomes; save mid-wave, reload from the same saved blob, and run until wave end — outcomes must match between original and resumed run for determinism.
- Unit test idea: expose a small deterministic harness that advances RNG N steps and compares sequences when restoring `rng.state` to ensure equality.

Conclusion

Capture RNG state at every autosave. It's low-cost, aligns with constitution requirements, and provides the strongest guarantee for deterministic Continue behavior.

````
