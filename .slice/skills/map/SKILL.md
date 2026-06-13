---
name: slice-map
description: Refresh the project's architecture map. Use at the start of a feature, or when the codebase has changed enough that the existing map is stale.
---

# map

Produce a compact, current map of the **application codebase**. Resolve model/mode from `../../policy.md`: reasoning `light`, access `edit`, isolation `worker`.

## Procedure

1. Delegate the scan to an isolated explorer subagent so raw code never fills the main context.
2. **Exclusions** — the worker must not read or summarize these paths:
   - SLICE install surface: `.slice/`, `.cursor/`, `.claude/`, `AGENTS.md`, `CLAUDE.md`
   - Standard noise: `node_modules/`, `.git/`, build artifacts (`dist/`, `build/`, `.next/`, `coverage/`, etc.)
3. Scan **remaining** paths for structure only: modules, public exports, boundaries, data flow. Skip file bodies.
4. Have the worker return a compact summary, not raw code.
5. **Greenfield branch** — if no substantive application source remains after exclusions (no `src/`, `app/`, application `lib/`, `packages/`, etc.; only docs, config, and SLICE files):
   - Do not invent modules or architecture.
   - Write `docs/ARCHITECTURE.md` from the greenfield section of `../../templates/architecture.md`.
   - Pull stack hints from the **Project** section of `AGENTS.md` when filled in; otherwise write "not set".
   - Tell the lead: **greenfield — no application code to map.** First vertical slices establish structure; `align` designs from constraints, not existing code.
6. **Brownfield branch** — otherwise write or update `docs/ARCHITECTURE.md` from the brownfield section of `../../templates/architecture.md`: a symbol-level map (modules, responsibilities, key types, boundaries). Keep each area readable in one screen.

## Output

- **Brownfield:** updated, compact `docs/ARCHITECTURE.md`. If the map runs past a page or two per area, you're including too much detail.
- **Greenfield:** stub `docs/ARCHITECTURE.md` with `status: greenfield` plus an explicit greenfield notice to the lead. No invented modules.
