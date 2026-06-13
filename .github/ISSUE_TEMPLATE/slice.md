---
name: Slice
description: A vertical, shippable increment of a feature
title: "slice: "
labels: ["slice"]
---

> Entry point: `/build` (resolve model/mode from policy.md via your adapter)
> Epic: #___    ·    Slice ___ / ___
> reasoning: light   <!-- set to heavy to escalate this slice's build -->

## Goal
<!-- The end-to-end behavior this slice adds, in 1-2 sentences.
     Verticality test: if you can't phrase it end-to-end,
     the slice is horizontal, so re-cut it. -->

## Context (excerpt from scope)
<!-- The 2-4 lines of the scope-contract that apply, COPIED here.
     The reader must understand without reopening the epic. -->

## Acceptance criteria
<!-- The definition of done for THIS slice. This is what the tests prove. -->
- [ ] Given ... when ... then ...
- [ ] ...

## Technical surface
<!-- The slice of the architecture map it touches. Confirms verticality. -->
- Layers crossed: migration · model · service · controller · view
- Expected files / modules:

## Test expectations
<!-- What to prove, at which level. Edge cases caught during align. -->
- Backend:
- Frontend:
- Edge cases:

## Dependencies
- Blocked by: #___
- Blocks: #___

## Out of scope for this slice
<!-- What we are NOT doing here. Kills scope creep before it starts. -->

## Log
<!-- Filled during build. Decisions made, deviations from plan.
     Feeds record (docs/ADR) and the PR body. -->
