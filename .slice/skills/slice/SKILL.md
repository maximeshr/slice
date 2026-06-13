---
name: slice-slice
description: Cut a scope into vertical, independently shippable increments. Use right after scope.
---

# slice

Resolve model/mode from `../../policy.md`: reasoning `heavy`, access `plan`.

## Procedure

1. Cut the scope into the smallest vertical slices that each deliver one end-to-end behavior (data to service to API to UI to test).
2. Verticality test: if a slice can't be phrased as one end-to-end behavior, it's horizontal. Re-cut it.
3. Order the slices with explicit dependencies (blocked-by / blocks).
4. Create an issue per slice from `../../templates/slice.md`. Each issue must be self-sufficient: readable cold, without replaying the align.
5. If a slice hides a hard problem, mark it `reasoning: heavy` so `build` escalates.

## Output

N slice issues, dependency-ordered, linked to the epic.
