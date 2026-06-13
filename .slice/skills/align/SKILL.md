---
name: slice-align
description: Reach a shared understanding with the developer on one feature before any code or plan exists. Use at the start of every feature. Human-in-the-loop; never delegate this.
---

# align

The heart of SLICE. Resolve model/mode from `../../policy.md`: reasoning `heavy`, access `read`, isolation `inline`. Strongest model, read-only. Produce shared understanding, not an artifact.

## Procedure

1. Interview the developer relentlessly, one question at a time. For each question, give your recommended answer, then wait.
2. Walk down each branch of the design tree, resolving dependencies between decisions one at a time.
3. Ground questions in the real codebase and docs so you surface actual constraints, not hypotheticals.
4. Surface edge cases, failure modes, and out-of-scope temptations as you go.
5. Continue until you both see the feature the same way (often 40-100 questions). Stop when new questions stop changing the picture.

## Rules

- One question at a time.
- Write no code and no scope doc during align.
- The output is the alignment itself; it feeds `scope`.
