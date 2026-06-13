# SLICE

A lean, tool-agnostic workflow for AI-assisted development.
**The lead aligns; the team slices.**

> Status: early. Built and tested solo on Cursor first. A Claude Code adapter and a team workflow come next.

## The problem

AI coding agents drift. As a chat grows, the model fills its context, attention thins out past roughly 100k tokens, and decisions get sloppy whatever the advertised window says. Most "spec to code" setups make it worse by handing the agent one giant plan and hoping.

SLICE takes the other path. You reach a shared understanding with the model on one feature, write that down as a contract, cut it into thin vertical increments, and build them one at a time so every task stays in the model's smart zone.

## The name is the method

- **Scoped**: one feature, one contract, hard edges.
- **Lean**: keep every task inside the smart zone (~100k tokens), where quality holds.
- **Iterative**: one vertical slice at a time, through `build → review`.
- **Context-isolated**: heavy work runs in isolated subagents that return only a summary.
- **End-to-end**: every slice is vertical (data → service → API → UI → test) and ships on its own.

## The workflow

```
map → align → scope → slice → ( build → review )* → record
                              └─── reset between phases ───┘
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

`align` stays human-in-the-loop. You never skip it and never delegate it. It is where you and the model reach the same mental model before any code exists.

## Scope vs slice

A feature has one **scope**: the contract. It states what you build, the in/out edges, and the definition of done. You cut that scope into N **slices**: vertical, independently shippable increments. A slice is what one person builds in a single pass.

Scope defines *what* and *done*. Slice sequences *how*. If you can't phrase a slice end-to-end, it's horizontal, so re-cut it.

## Use it with Cursor

### 1. Add SLICE to your repo

```bash
npx slice-workflow init
```

This copies `.slice/`, writes `AGENTS.md`, links `CLAUDE.md` → `AGENTS.md`, and symlinks skills and agents into `.cursor/` and `.claude/`. Re-run with `--force` to refresh `.slice/` without touching an existing `AGENTS.md`.

Cursor reads `AGENTS.md` directly, so you skip `.cursor/rules`. That format stays Cursor-only and won't port to other tools later.

### 2. Map the steps to Cursor

SLICE keeps the heavy thinking on a strong model in read-only modes, and the implementation on a fast model in Agent mode. The Cursor adapter resolves to:

| Step | Model | Mode | Runs in |
|------|-------|------|---------|
| `map` | Composer 2.5 | Agent | `explore` (subagent) |
| `align` | Opus 4.8 | Ask | main thread |
| `scope` | Opus 4.8 | Plan | main thread |
| `slice` | Opus 4.8 | Plan | main thread |
| `build` | Composer 2.5 | Agent | `builder` (subagent) |
| `review` | Opus 4.8 | Ask | `reviewer` (subagent) |
| `record` | Composer 2.5 | Agent | main thread |
| `reset` | Composer 2.5 | Ask | main thread |

Escalation: when one slice hides a hard problem (concurrency, a subtle algorithm), run that slice's `build` on Opus instead of Composer, and mark it in the slice issue.

### 3. Run a feature

1. Run `map` to refresh the architecture map.
2. Run `align` in Ask mode on Opus. Let it interview you, one question at a time, until you both see the feature the same way. Write no code here.
3. Run `scope` in Plan mode. Turn the alignment into one contract: problem, decisions, in/out, acceptance criteria. Save it as the epic.
4. Run `slice` in Plan mode. Cut the scope into vertical increments with dependencies. Each one becomes an issue.
5. For each slice, run `build` in Agent on Composer (TDD red-green), then `review` in Ask on Opus in a fresh context. A rejection or the next slice loops back to `build`.
6. Run `record` to write the docs and any ADR.
7. Run `reset` between features to compact the context.

## Structure

```
.slice/
  SLICE.md          # the method
  policy.md         # per-step intent: reasoning + access + isolation
  skills/           # map align scope slice build review record reset
  agents/           # builder, reviewer
  templates/        # slice.md, scope.md, adr.md
  adapters/         # cursor.md, claude-code.md
AGENTS.md           # entry point
CLAUDE.md           # symlink → AGENTS.md
```

The only tool-specific file is `adapters/cursor.md`. `SLICE.md` and `policy.md` never name a model or a mode. To support another tool, you add one sibling adapter and change nothing else.

## Team workflow

See [docs/team-workflow.md](docs/team-workflow.md) for roles (PO, lead, member), epic + slice issue queue, and parallel pickup.

## Roadmap

- [x] Method spec and Cursor adapter
- [x] Claude Code adapter
- [x] `slice-workflow init` installer
- [x] Slice issue template
- [x] Team workflow (epic + issue queue)
- [ ] Real-world validation before wider promotion

## Credits

SLICE draws on ideas from Matt Pocock's grill-me coding workflow and the BMAD method. It borrows the thinking and reshapes it into a lean, portable form rather than copying it.

## License

MIT
