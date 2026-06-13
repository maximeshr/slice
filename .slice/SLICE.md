# SLICE

A lean, tool-agnostic workflow for AI-assisted development.
**The lead aligns; the team slices.**

## Principles

- **Scoped** — one feature, one contract, hard edges.
- **Lean** — keep every task inside the model's smart zone (~100k tokens). Past that, quality degrades; small tasks beat long context.
- **Iterative** — one vertical slice at a time, through `build → review`.
- **Context-isolated** — heavy context work runs in isolated workers that return only a summary, keeping the main thread lean.
- **End-to-end** — every slice is vertical (data → service → API → UI → test) and ships on its own.

## The unit of work

A **feature** has exactly one **scope**: the contract. It states what you build, the in/out edges, and the definition of done. You cut that scope into N **slices**: vertical, independently shippable increments.

A slice is what one person implements in a single `build → review → record` pass. Scope defines *what* and *done*; slice sequences *how*. If you can't phrase a slice end-to-end, it's horizontal, so re-cut it.

## The steps

```
map → align → scope → slice → ( build → review )* → record
                              └──── reset between phases ────┘
```

| Step | Does | Output |
|------|------|--------|
| `map` | Refresh the architecture map (delegated scan; application code only, greenfield stub if empty) | a compact repo map |
| `align` | Interview to a shared understanding | a shared mental model |
| `scope` | Write the feature contract | one scope doc / epic |
| `slice` | Cut into vertical increments | N slice issues |
| `build` | TDD red-green on one slice | code + tests, green |
| `review` | Independent judgment, fresh context | findings (pass / back) |
| `record` | Write docs, ADR, changelog | updated docs |
| `reset` | Compaction between phases | a lean context |

`align` is human-in-the-loop. You never skip it and never delegate it. It is the one step where the human and the model reach a shared mental model before any code exists.

## Roles and flow

- **Lead** owns the front half (map, align, scope, slice), once per feature. This is the expensive reasoning, concentrated where it has the most leverage.
- **Team** owns the back half (build, review, record), one slice each, in parallel, on the fast model. The lead is a bottleneck only at the next feature.

Centralization has three layers:

- scope → an **epic** (the contract),
- slices → **issues** (the work queue, picked up one at a time),
- behavior → this **`.slice/` directory**, versioned, so every member's agent behaves identically.

## How an agent runs this

1. Resolve each step's model and mode from `policy.md` against your `adapters/<tool>.md`. The policy is tool-neutral; the adapter renames.
2. Pick up work as a slice issue using `templates/slice.md`. The issue must be self-sufficient: readable cold, without replaying the align.
3. Stay in the smart zone: one slice per loop, fresh context per slice, reset between phases.

## Layout

```
.slice/
  SLICE.md      policy.md
  skills/       map align scope slice build review record reset
  agents/       builder reviewer
  templates/    slice.md scope.md adr.md
  adapters/     cursor.md claude-code.md
AGENTS.md       entry point
CLAUDE.md       symlink to AGENTS.md
```
