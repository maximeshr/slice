# Team workflow

How a team runs SLICE from feature request to shipped slices.

## Roles

| Role | Owns | Does not do |
|------|------|-------------|
| **PO / stakeholder** | Problem, priority, acceptance at feature level | Write slices, pick models, edit framework files |
| **Lead** | Front half once per feature: `map → align → scope → slice` | Implement slices (unless solo) |
| **Member** | Back half per slice: `build → review → record` | Re-open scope, add slices, change the contract |

The lead is the bottleneck only at the next feature. Slice work runs in parallel.

## Artifacts

```
Feature request
      ↓
   Epic (scope)          ← one contract per feature
      ↓
 Slice issue queue       ← N vertical increments
      ↓
   PRs (one per slice)
```

- **Epic** — the scope doc from `scope`. Lives as a GitHub issue or doc linked from the epic. States problem, decisions, in/out, feature-level acceptance criteria.
- **Slice issue** — one vertical increment from `slice`. Self-sufficient: a member reads only the issue + architecture map, never replays `align`.
- **`.slice/`** — versioned framework config. Same for every member. Do not edit during feature work.

## Lifecycle

### 1. Intake (PO → lead)

PO opens a feature request with the problem and business priority. Lead picks it up when capacity allows.

### 2. Front half (lead, once per feature)

Run in order on the strong model (see your adapter):

1. **`map`** — refresh `docs/ARCHITECTURE.md` (or equivalent). Delegated scan; compact map only.
2. **`align`** — Ask-mode interview until lead and model share one mental model. No code.
3. **`scope`** — Plan-mode contract: problem, decisions, in/out, acceptance criteria. Publish as the **epic**.
4. **`slice`** — Plan-mode cut into vertical increments. Each becomes a **slice issue** using the slice template. Set dependencies (`Blocked by` / `Blocks`).

Lead updates the epic's **Slices** checklist with issue numbers.

### 3. Queue (lead → team)

Slice issues form the work queue. Ordering rules:

- Respect `Blocked by` / `Blocks` links.
- Otherwise, members pick any unblocked slice.
- One person, one slice at a time. Finish `build → review → record` before grabbing the next.

Mark `reasoning: heavy` on a slice when its `build` needs the strong model (concurrency, subtle algorithms).

### 4. Back half (member, per slice)

For each assigned slice:

1. **`build`** — TDD red-green in a fresh context (`builder` worker). Fill the issue **Log**.
2. **`review`** — Independent judgment in a fresh context (`reviewer` worker). Pass or send back to `build`.
3. **`record`** — Docs, ADR, changelog for what shipped in this slice.
4. Open PR. Link epic + slice issue.

Rejected review loops to `build` on the same slice. Do not start a new slice until the current one passes review.

### 5. Close feature (lead)

When all slice issues are done and feature acceptance criteria are met:

- Lead runs **`record`** for any epic-level docs.
- Lead runs **`reset`** — handoff summary, compact context before the next feature.
- Close the epic.

## Parallelism

```
Lead:     [ map · align · scope · slice ]───────► record · reset
                    │         │         │
Member A:           └─ build·review·record (slice 1)
Member B:             └─ build·review·record (slice 2)
Member C:               └─ build·review·record (slice 3)
```

Members never need the full align transcript. The epic and each slice issue carry the contract forward.

## GitHub setup

1. Install SLICE: `npx slice init`
2. Enable the **Slice** issue template (`.github/ISSUE_TEMPLATE/slice.md`).
3. Use labels: `epic` for scope issues, `slice` for work items.
4. Link every slice issue to its epic (`Epic: #___` in the template).

Optional: add a **Scope** issue template from `.slice/templates/scope.md` when you want epics on GitHub too.

## Escalation

- **Slice too hard for fast model** — set `reasoning: heavy` on the issue; adapter picks strong model for `build` only.
- **Slice is horizontal** — lead re-cuts during `slice`; do not patch by expanding one issue.
- **Scope wrong mid-flight** — stop, re-run `align → scope`, re-cut slices. Do not drift the contract in a PR.

## Solo mode

One person plays all roles. Same steps, same artifacts. The queue is just ordered slice issues you pick up one at a time.
