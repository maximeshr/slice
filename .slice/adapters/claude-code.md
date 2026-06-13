# SLICE adapter — Claude Code

Binds the abstract axes in `../policy.md` to Claude Code's models and modes. The only Claude-Code-specific file in the framework. Proof that a new tool costs one sibling file and no changes to the method.

## Bindings

```
reasoning
  heavy  → Opus 4.8
  light  → Sonnet 4.6      (Haiku 4.5 for trivial summarization, e.g. reset)

access
  read   → plan mode (read-only)
  plan   → plan mode
  edit   → default edit mode

isolation
  worker → subagent in .claude/agents/
  inline → main thread
```

## Discovery

Claude Code auto-discovers skills and agents, so link the canonical files:

```
.claude/skills/*  →  ../../.slice/skills/*
.claude/agents/*  →  ../../.slice/agents/*
```

Project context is `CLAUDE.md` at the repo root, a symlink to `AGENTS.md`, auto-loaded as memory.

## Resolved, per step

| Step | Model | Mode | Runs in |
|------|-------|------|---------|
| map | Sonnet 4.6 | edit | explorer (worker) |
| align | Opus 4.8 | plan | main thread |
| scope | Opus 4.8 | plan | main thread |
| slice | Opus 4.8 | plan | main thread |
| build | Sonnet 4.6 | edit | builder (worker) |
| review | Opus 4.8 | plan | reviewer (worker) |
| record | Sonnet 4.6 | edit | main thread |
| reset | Haiku 4.5 | plan | main thread |

Escalation: a slice marked `reasoning: heavy` runs `build` on Opus 4.8 instead of Sonnet 4.6.
