# Agent guidance index

This repository provides a small set of files intended to guide AI coding agents and
automation scripts. Keep this file up-to-date when you add new agent-specific guidance.

Available agent files

- `.github/copilot-instructions.md` — primary Copilot-style instructions for quick edits and
  integration guidance (canvas size, seeded RNG, autosave expectations).
- `.specify/prompts/speckit.constitution.prompt.md` — prompt used to update the project
  constitution template at `.specify/memory/constitution.md`.
- `.specify/scripts/bash/update-agent-context.sh` — helper script to refresh agent files based on
  feature plans. See script header for usage.
- `game-utils.js`, `INTEGRATION.md` — utility snippets and integration notes added for developer convenience.

Updating agent files

Run the helper script to refresh or generate agent files from templates and plan data:

```bash
cd $(git rev-parse --show-toplevel)
./.specify/scripts/bash/update-agent-context.sh
```

Notes
- The update script expects `.specify/templates/agent-file-template.md` and plan.md files in
  feature spec directories. It will attempt to create or update agent-format files (Claude, Copilot,
  Gemini, etc.) depending on availability.
- If you add a new agent guidance file (e.g., `CLAUDE.md`), add a reference here so other agents know
  it exists.
