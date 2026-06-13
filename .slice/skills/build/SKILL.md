---
name: slice-build
description: Implement one slice with TDD. Use when picking up a single slice issue.
---

# build

Resolve model/mode from `../../policy.md`: reasoning `light` (unless the issue marks `heavy`), access `edit`, isolation `worker`. Fast model, fresh context per slice.

## Procedure

1. Read only the slice issue and the area of `docs/ARCHITECTURE.md` it touches. Don't load the whole scope or other slices.
2. Work red-green-refactor: write a failing test for the next acceptance criterion, make it pass, refactor. Repeat per criterion.
3. Run the suite until green. Loop on failures.
4. Fill the issue's Log section with decisions and any deviation from plan.

## Output

Code + tests, green, for exactly one slice. Hand off to `review`.
