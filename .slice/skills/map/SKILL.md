---
name: slice-map
description: Refresh the project's architecture map. Use at the start of a feature, or when the codebase has changed enough that the existing map is stale.
---

# map

Produce a compact, current map of the codebase. Resolve model/mode from `../../policy.md`: reasoning `light`, access `edit`, isolation `worker`.

## Procedure

1. Delegate the scan to an isolated explorer subagent so raw code never fills the main context.
2. Scan for structure only: modules, public exports, boundaries, data flow. Skip file bodies.
3. Have the worker return a compact summary, not raw code.
4. Write or update `docs/ARCHITECTURE.md`: a symbol-level map (modules, responsibilities, key types, boundaries). Keep each area readable in one screen.

## Output

An updated, compact `docs/ARCHITECTURE.md`. If the map runs past a page or two per area, you're including too much detail.
