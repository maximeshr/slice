# AGENTS.md

This repository follows the **SLICE** method, a lean, tool-agnostic workflow for AI-assisted development.

Before acting, read `.slice/SLICE.md`.

## How to work here

- The workflow has eight steps: map · align · scope · slice · build · review · record · reset. Each is a skill in `.slice/skills/`.
- Resolve the model and mode for each step from `.slice/policy.md` against your tool's adapter in `.slice/adapters/`.
- Pick up new work as a slice issue using `.slice/templates/slice.md`. A slice issue must be self-sufficient: readable without replaying the align.
- Stay lean: one slice per loop, fresh context per slice, reset between phases.

## Project

- Build: npm test
- Test: npm test
- Stack: Node.js CLI, SLICE framework files

## Boundaries

- Treat `.slice/` as framework config. Don't edit it while implementing a feature.
