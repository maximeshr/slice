# SLICE — Execution policy

Tool-neutral. This file declares *how each step should run* in the abstract. It never names a model or a mode. Each `adapters/<tool>.md` binds these axes to that tool's concrete models and modes.

## Axes

- **reasoning** — how much thinking the step needs.
  - `heavy` — design, judgment, decomposition. Use the strongest model available.
  - `light` — mechanical execution or summarization. Use the fast, cheap model.

- **access** — what the step is allowed to touch.
  - `read` — analysis or dialogue only; writes nothing.
  - `plan` — writes planning artifacts only (scope briefs, slice issues); never source.
  - `edit` — may modify source, tests, and docs.

- **isolation** — where the step's heavy context work runs.
  - `inline` — in the main thread.
  - `worker` — delegated to an isolated subagent that returns only a summary, keeping the main context lean. Tools without subagents run it inline.

## Steps

| Step | reasoning | access | isolation | Notes |
|------|-----------|--------|-----------|-------|
| map | light | edit | worker | Scan delegated; synthesize a compact map, never dump the codebase. |
| align | heavy | read | inline | Relentless interview; human-in-the-loop, cannot be delegated. |
| scope | heavy | plan | inline | Produce the one-doc feature contract + acceptance criteria. |
| slice | heavy | plan | inline | Cut into vertical, independently shippable increments. |
| build | light | edit | worker | TDD red-green on one slice; fresh context per slice. |
| review | heavy | read | worker | Independent judgment in a fresh context; reports, never fixes. |
| record | light | edit | inline | Write docs / ADR / changelog from the still-fresh slice. |
| reset | light | read | inline | Compaction / handoff between phases; no repo changes. |

## Escalation

`build` defaults to `light`. If a slice hides a genuinely hard problem (concurrency, subtle algorithm), escalate *that slice only* to `heavy`. Mark it in the slice issue (`reasoning: heavy`) so the adapter picks the strong model for that run.

## Reading this as a tool

Resolve each step against your adapter: `reasoning` → model, `access` → mode, `isolation` → subagent or inline. If your tool lacks a concept (for example, no `plan` mode), fall back to the nearest stricter one, then perform the write under `edit`.
