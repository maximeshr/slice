# SLICE adapter — Cursor

Binds the abstract axes in `../policy.md` to Cursor's models and modes. This is the only Cursor-specific file in the framework. Nothing here changes the method; it only renames.

## Bindings

```
reasoning
  heavy  → Opus 4.8        (Fable 5 for the deepest design: a novel or
                            architecturally hard align / slice)
  light  → Composer 2.5

access
  read   → Ask
  plan   → Plan
  edit   → Agent

isolation
  worker → subagent in .cursor/agents/ ; map uses Cursor's built-in `explore`
  inline → main thread
```

## Discovery

Cursor doesn't auto-discover skills, so link the canonical files into the paths Cursor looks in (an install step does this):

```
.cursor/skills/*  →  ../../.slice/skills/*
.cursor/agents/*  →  ../../.slice/agents/*
```

Project context lives in `AGENTS.md` at the repo root. Cursor reads it natively, so SLICE never touches `.cursor/rules` (that format is Cursor-only).

## Resolved, per step

| Step | Model | Mode | Runs in |
|------|-------|------|---------|
| map | Composer 2.5 | Agent | explore (worker) |
| align | Opus 4.8 | Ask | main thread |
| scope | Opus 4.8 | Plan | main thread |
| slice | Opus 4.8 | Plan | main thread |
| build | Composer 2.5 | Agent | builder (worker) |
| review | Opus 4.8 | Ask | reviewer (worker) |
| record | Composer 2.5 | Agent | main thread |
| reset | Composer 2.5 | Ask | main thread |

Escalation: a slice marked `reasoning: heavy` in its issue runs `build` on Opus 4.8 instead of Composer 2.5. Everything else unchanged.
