# Sync Impact Report
<!--
Version change: unknown -> 0.1.0
Modified principles: template placeholders ->
	- I. Single-file SPA & Determinism
	- II. Simplicity & No External Assets
	- III. Persistence & Autosave
	<!--
	Sync Impact Report
	Version change: unknown -> 0.1.0
	Modified principles: template placeholders replaced with concrete guidance:
		- I. Single-file SPA & Determinism
		- II. Simplicity & No External Assets
		- III. Persistence & Autosave
		- IV. Performance & Rendering
		- V. Acceptance‑led Changes & Testability
	Added sections: Constraints & Standards; Development Workflow
	Removed sections: none
	Templates requiring review: .specify/templates/plan-template.md (reviewed),
															.specify/templates/spec-template.md (reviewed),
															.specify/templates/tasks-template.md (reviewed)
	Follow-up TODOs:
	 - RATIFICATION_DATE: TODO(RATIFICATION_DATE) — original adoption date unknown
	-->

	# Tiny TD Constitution

	## Core Principles

	### I. Single-file SPA & Determinism
	The project MUST remain a single-page, canvas-based game implemented with
	`index.html`, `style.css`, and a single authoritative `game.js` (no build step).
	All gameplay that affects reproducibility MUST be deterministic: use the
	seeded RNG string "TDMINI" for deterministic behavior. Persist PRNG state in
	the save blob if exact mid-wave continuation is required.

	### II. Simplicity & No External Assets
	The game MUST not use external images or audio; visuals are simple shapes and
	default fonts. Prefer small, composable functions (e.g., update(dt), render(),
	spawnWave()) and avoid introducing heavy dependencies or build tooling.

	### III. Persistence & Autosave (NON-NEGOTIABLE)
	Autosave is required between waves and after place/upgrade/sell actions.
	Persist a single minimal save blob in localStorage (wave index, player
	coins/lives, towers with positions/tiers, optional RNG state). The UI MUST
	present a Continue flow on load when a save exists.

	### IV. Performance & Rendering
	Render entirely on the canvas and target 60 FPS on a typical laptop. Use
	requestAnimationFrame, batch updates, and avoid per-creep DOM operations. Keep
	draw/update loops efficient and measurable (frame budget ~16ms).

	### V. Acceptance‑led Changes & Testability
	All behavior changes that affect player-facing rules (waves, towers, coins,
		 required constraints.
	systems (seeded RNG, spawn order, targeting) MUST include small tests or
	smoke-checks validating reproducibility.

	## Constraints & Standards

	- Canvas nominal size: 800×500 px; grid 20×12 tiles, tile size 40 px. Path defined
		in specs/td-01.md and converted: tile_x*40 + 20, tile_y*40 + 20.
	- No external assets. No build step. Prefer vanilla JS and browser-native APIs.
	- Save format: single JSON blob under a documented localStorage key. Save
		only stable game state; avoid storing large transient arrays (projectiles,
		ephemeral particle effects).

	## Development Workflow

	- Run locally with a simple static server (from repo root):

	```bash
	python3 -m http.server 8000
	# open http://localhost:8000
	```

	- Use browser DevTools for performance profiling and console diagnostics.
	- Use .specify/scripts/bash/update-agent-context.sh to refresh agent guidance
		files (see AGENTS.md). Keep agent docs in sync when plans or templates
		change.

	## Governance

	Amendments to this constitution MUST be made via a documented PR that includes:

	1. A clear rationale for the change and affected components.
	2. A version bump following semantic rules:
		 - MAJOR: backward-incompatible redefinitions of core principles or removal of
			 required constraints.
		 - MINOR: addition of new principles or material expansion of guidance.
		 - PATCH: clarifications, wording fixes, non-semantic refinements.
	3. A migration plan for any template or automation changes (e.g., update
		 scripts, validation gates).

	All PRs that change game behavior MUST reference specs/td-01.md and include
	tests or manual validation steps for acceptance criteria. Compliance checks in
	/.specify/templates are the gate for Phase 0 → Phase 1 transitions.

	**Version**: 0.1.0 | **Ratified**: TODO(RATIFICATION_DATE) | **Last Amended**: 2025-10-21

	 - MINOR: addition of new principles or material expansion of guidance.
	 - PATCH: clarifications, wording fixes, non-semantic refinements.
3. A migration plan for any template or automation changes (e.g., update
	 scripts, validation gates).

All PRs that change game behavior MUST reference `specs/td-01.md` and include
tests or manual validation steps for acceptance criteria. Compliance checks in
`/.specify/templates` are the gate for Phase 0 → Phase 1 transitions.

**Version**: 0.1.0 | **Ratified**: 2025-10-21 | **Last Amended**: 2025-10-21

<!--
Sync Impact Report
Version change: unknown -> 0.1.0
Modified principles: template placeholders replaced with concrete guidance:
	- I. Single-file SPA & Determinism
	- II. Simplicity & No External Assets
	- III. Persistence & Autosave
	- IV. Performance & Rendering
	- V. Acceptance‑led Changes & Testability
Added sections: Constraints & Standards; Development Workflow
Removed sections: none
Templates requiring review: .specify/templates/plan-template.md (reviewed),
														.specify/templates/spec-template.md (reviewed),
														.specify/templates/tasks-template.md (reviewed)
Follow-up TODOs:
 - RATIFICATION_DATE: TODO(RATIFICATION_DATE) — original adoption date unknown
-->

# Tiny TD Constitution

## Core Principles

### I. Single-file SPA & Determinism
The project MUST remain a single-page, canvas-based game implemented with
`index.html`, `style.css`, and a single authoritative `game.js` (no build step).
All gameplay that affects reproducibility MUST be deterministic: use the
seeded RNG string "TDMINI" for deterministic behavior. Persist PRNG state in
the save blob if exact mid-wave continuation is required.

### II. Simplicity & No External Assets
The game MUST not use external images or audio; visuals are simple shapes and
default fonts. Prefer small, composable functions (e.g., update(dt), render(),
spawnWave()) and avoid introducing heavy dependencies or build tooling.

### III. Persistence & Autosave (NON-NEGOTIABLE)
Autosave is required between waves and after place/upgrade/sell actions.
Persist a single minimal save blob in localStorage (wave index, player
coins/lives, towers with positions/tiers, optional RNG state). The UI MUST
present a Continue flow on load when a save exists.

### IV. Performance & Rendering
Render entirely on the canvas and target 60 FPS on a typical laptop. Use
requestAnimationFrame, batch updates, and avoid per-creep DOM operations. Keep
draw/update loops efficient and measurable (frame budget ~16ms).

### V. Acceptance‑led Changes & Testability
All behavior changes that affect player-facing rules (waves, towers, coins,
autosave, sell values, targeting) MUST update specs/td-01.md. Deterministic
systems (seeded RNG, spawn order, targeting) MUST include small tests or
smoke-checks validating reproducibility.

## Constraints & Standards

- Canvas nominal size: 800×500 px; grid 20×12 tiles, tile size 40 px. Path defined
	in specs/td-01.md and converted: tile_x*40 + 20, tile_y*40 + 20.
- No external assets. No build step. Prefer vanilla JS and browser-native APIs.
- Save format: single JSON blob under a documented localStorage key. Save
	only stable game state; avoid storing large transient arrays (projectiles,
	ephemeral particle effects).

## Development Workflow

- Run locally with a simple static server (from repo root):

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

- Use browser DevTools for performance profiling and console diagnostics.
- Use .specify/scripts/bash/update-agent-context.sh to refresh agent guidance
	files (see AGENTS.md). Keep agent docs in sync when plans or templates
	change.

## Governance

Amendments to this constitution MUST be made via a documented PR that includes:

1. A clear rationale for the change and affected components.
2. A version bump following semantic rules:
	 - MAJOR: backward-incompatible redefinitions of core principles or removal of
		 required constraints.
	 - MINOR: addition of new principles or material expansion of guidance.
	 - PATCH: clarifications, wording fixes, non-semantic refinements.
3. A migration plan for any template or automation changes (e.g., update
	 scripts, validation gates).

All PRs that change game behavior MUST reference specs/td-01.md and include
tests or manual validation steps for acceptance criteria. Compliance checks in
/.specify/templates are the gate for Phase 0 → Phase 1 transitions.

**Version**: 0.1.0 | **Ratified**: TODO(RATIFICATION_DATE) | **Last Amended**: 2025-10-21

state when exact mid-wave continuation is required.

### II. Simplicity & No External Assets
The game MUST not use external images or audio; visuals are simple shapes and
default fonts. Favor small, composable functions (e.g., update(dt), render(),
spawnWave()) and avoid introducing heavy dependencies or build tooling.

### III. Persistence & Autosave (NON-NEGOTIABLE)
Autosave is required between waves and after place/upgrade/sell actions.
Persist a single minimal save blob in `localStorage` (wave index, player
coins/lives, towers with positions/tiers, optional RNG state). The UI MUST
# Sync Impact Report
<!--
Version change: unknown -> 0.1.0
Modified principles: template placeholders ->
	- I. Single-file SPA & Determinism
	- II. Simplicity & No External Assets
	- III. Persistence & Autosave
	- IV. Performance & Rendering
	- V. Acceptance‑led Changes & Testability
Added sections: Constraints & Standards; Development Workflow
Removed sections: none
Templates reviewed: .specify/templates/plan-template.md (checked),
										.specify/templates/spec-template.md (checked),
										.specify/templates/tasks-template.md (checked)
Follow-up TODOs:
- RATIFICATION_DATE: TODO(RATIFICATION_DATE) - original adoption date unknown
-->

# Tiny TD Constitution

## Core Principles

### I. Single-file SPA & Determinism
The project MUST remain a single-page, canvas-based game implemented with
`index.html`, `style.css`, and a single authoritative `game.js` (no build step).
All gameplay that affects reproducibility MUST be deterministic: use the
seeded RNG string "TDMINI" for deterministic behavior. Persist PRNG state in
the save blob if exact mid-wave continuation is required.

### II. Simplicity & No External Assets
The game MUST not use external images or audio; visuals are simple shapes and
default fonts. Prefer small, composable functions (e.g., update(dt), render(),
spawnWave()) and avoid introducing heavy dependencies or build tooling.

### III. Persistence & Autosave (NON-NEGOTIABLE)
Autosave is required between waves and after place/upgrade/sell actions.
Persist a single minimal save blob in `localStorage` (wave index, player
coins/lives, towers with positions/tiers, optional RNG state). The UI MUST
present a Continue flow on load when a save exists.

### IV. Performance & Rendering
Render entirely on the canvas and target 60 FPS on a typical laptop. Use
`requestAnimationFrame`, batch updates, and avoid per-creep DOM operations. Keep
draw/update loops efficient and measurable (frame budget ~16ms).

### V. Acceptance‑led Changes & Testability
All behavior changes that affect player-facing rules (waves, towers, coins,
autosave, sell values, targeting) MUST update `specs/td-01.md`. Deterministic
systems (seeded RNG, spawn order, targeting) MUST include small tests or
smoke-checks validating reproducibility.

## Constraints & Standards

- Canvas nominal size: 800×500 px; grid 20×12 tiles, tile size 40 px. Path defined
	in `specs/td-01.md` and converted: tile_x*40 + 20, tile_y*40 + 20.
- No external assets. No build step. Prefer vanilla JS and browser-native APIs.
- Save format: single JSON blob under a documented `localStorage` key. Save
	only stable game state; avoid storing large transient arrays (projectiles,
	ephemeral particle effects).

## Development Workflow

- Run locally with a simple static server (from repo root):

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

- Use browser DevTools for performance profiling and console diagnostics.
- Use `.specify/scripts/bash/update-agent-context.sh` to refresh agent guidance
	files (see `AGENTS.md`). Keep agent docs in sync when plans or templates
	change.

## Governance

Amendments to this constitution MUST be made via a documented PR that includes:

1. A clear rationale for the change and affected components.
2. A version bump following semantic rules:
	 - MAJOR: backward-incompatible redefinitions of core principles or removal of
		 required constraints.
	 - MINOR: addition of new principles or material expansion of guidance.
	 - PATCH: clarifications, wording fixes, non-semantic refinements.
3. A migration plan for any template or automation changes (e.g., update
	 scripts, validation gates).

All PRs that change game behavior MUST reference `specs/td-01.md` and include
tests or manual validation steps for acceptance criteria. Compliance checks in
`/.specify/templates` are the gate for Phase 0 → Phase 1 transitions.

**Version**: 0.1.0 | **Ratified**: TODO(RATIFICATION_DATE) | **Last Amended**: 2025-10-21
