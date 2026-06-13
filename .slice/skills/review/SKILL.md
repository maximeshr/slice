---
name: slice-review
description: Judge a built slice independently in a fresh context. Use after build, before merge.
---

# review

Resolve model/mode from `../../policy.md`: reasoning `heavy`, access `read`, isolation `worker`. Strong model, fresh context, read-only.

## Procedure

1. Start clean. Don't inherit the build conversation. Read the diff, the slice issue, and its acceptance criteria.
2. Judge correctness against the criteria, design fit against the architecture map, security, and test usefulness: do the tests prove the behavior, or just cover lines?
3. Report findings. Don't fix. A rejection sends the slice back to `build`.

## Output

A pass, or a findings list that returns the slice to `build`.
