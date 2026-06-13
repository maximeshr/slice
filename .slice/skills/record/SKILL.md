---
name: slice-record
description: Persist documentation for a finished slice. Use after a slice passes review.
---

# record

Resolve model/mode from `../../policy.md`: reasoning `light`, access `edit`.

## Procedure

1. While the slice is still fresh, update `docs/ARCHITECTURE.md` for any structural change.
2. If the slice settled a significant decision, write an ADR from `../../templates/adr.md`.
3. Update the changelog and the PR body from the issue's Log.

## Output

Updated project docs, plus an ADR if the slice warranted one.
