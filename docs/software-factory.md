# Software factory

Weven uses the [ZazenCodes software factory v2](https://github.com/zazencodes/zazencodes-season-3/tree/main/src/software-factory-claude-code-v2) to build GitHub issues with Claude Code agents, several at once.

## How it works

```
issues labeled `factory`
        │
        ▼
intake (fable) ── NEEDS-INFO → asks on the issue, waits for a reply
        │         REJECT     → says why, removes the label
        ▼ ACCEPT (maybe rescoped), rates risk + surfaces
route (script)    picks reviewers and models from factory/config.json
        ▼
spec-writer (opus) → spec.md
        ▼
builder (sonnet, opus when high risk) → commits, pushes, draft PR "Closes #n"
        ▼            ▲
gate (script) ─FAIL──┤  factory/checks.sh; no reviewer runs on a failing build
        ▼ PASS       │
reviewers ─CHANGES───┘  code, + ux & ui on UI changes, + security when flagged
        ▼ all PASS
approver (opus) ── APPROVE  → sync with main, gate again, squash-merge the PR
                └─ ESCALATE → PR ready for you, issue labeled factory:needs-human
```

## Running several tickets at once

- One Claude Code session runs `/factory run` and orchestrates every job, `concurrency` at a time (3, in `factory/config.json`).
- Each job gets its own branch `factory/<job-id>` and git worktree at `../weven-factory/<job-id>/`, so builders never touch each other's files or your checkout.
- Each job gets its own dev-server ports (5100 + 10 × job number) and its own browser session.
- **Shared database:** all worktrees use the same local Supabase stack. `factory/checks.sh` wraps the database step (reset to the branch's migrations, pgTAP, type check) in `factory/bin/db-lock`, so jobs take turns there and run everything else in parallel. Your local database gets reset by factory runs; `seed.sql` puts dev data back.
- State lives in `factory/jobs/`. If the session dies, `/factory run` picks every job back up.

## Commands

```
/factory run          every open `factory` issue, `concurrency` at a time; also resumes
/factory issue <n>    one issue now
/factory <feature>    create the issue (labeled), then run it
/factory rework <n>   send an escalated job back to the builder with your PR comments
```

You approve an escalated job by merging its PR on GitHub.

## Weven tailoring

| File | Change from the reference |
| --- | --- |
| `factory/checks.sh` | pnpm install, typecheck, lint, test, Expo web export, then locked Supabase reset + pgTAP + generated-types check |
| `factory/bin/db-lock` | New: serialises the database step across parallel jobs (macOS has no `flock`) |
| `factory/config.json` | `merge_method: squash`; protected paths add `supabase/migrations/*`, `supabase/tests/*`, `*.test.ts(x)`, `e2e/*`, `.github/workflows/*`, `factory/bin/*`, `.claude/*` |
| `intake.md` | What Weven is for; money maths, migrations and RLS rate `high`; migrations, RLS, invites, membership flag `security` |
| `reviewer-security.md` | RLS + grants + pgTAP, security-definer functions, invites, keys, receipts, Edge Functions, money integrity |
| `reviewer-ui.md` | Tokens and components in `apps/app/src/ui/`, mobile-first |
| `reviewer-ux.md` | Weven's users: invitees on a laptop, placeholder members, family on phones; locale-aware amounts |
| `approver.md` | Always escalates money logic, migrations/RLS, auth/invites, Edge Functions, native config/SDK, CLAUDE.md and docs |

Protected paths mean a builder may **add** a migration or test but never edit an existing one; the gate fails the branch otherwise.

## Setup checklist

The factory can't run until these are done, in order:

- [x] Move the agent files into `.claude/`
- [ ] Install prerequisites: Claude Code 2.1.257+ (`claude --version`), Python 3.10+, Docker, pnpm, Supabase CLI, `gh` (`gh auth login`), and the [`agent-browser`](https://github.com/vercel-labs/agent-browser) CLI for the UX/UI reviewers.
- [x] `git init -b main` and first commit
- [ ] Create the GitHub repo and push (`gh repo create weven --private --source . --push`).
- [ ] Do **Phase 0** ([docs/phase-0.md](phase-0.md); docs/roadmap.md) interactively with Claude Code, not the factory: scaffold the pnpm workspace, Expo app, `packages/core`, Supabase, `apps/app/.env.example`, the scripts `typecheck`, `lint`, `test`, and `packages/core/src/database.types.ts`. The factory can't gate the scaffold because `checks.sh` needs it to exist.
- [ ] `bash factory/checks.sh` exits 0 on a clean `main`. If it doesn't, the factory can never pass a job.
- [ ] Create the labels:
      `gh label create factory --color 5319E7 --description "Build this with the software factory"`
      `gh label create factory:needs-info --color FBCA04 --description "The factory asked the author a question"`
      `gh label create factory:needs-human --color D93F0B --description "The factory needs a human decision on the PR"`
- [ ] Merge all of this to `main` on GitHub (jobs branch from `origin/main`).
- [ ] Write a few small issues, label them `factory`, and run `/factory run` from the repo root.

## Cost and safety

### Capacity on Claude Pro (estimate)

Anthropic doesn't publish token numbers for Pro: it has a 5-hour session limit and a weekly limit shared between Claude chat and Claude Code. A factory job spawns 5–8 agents (intake, spec, builder, 1–4 reviewers, approver), up to 3 rounds, so one job uses roughly what an hour or more of normal interactive coding does.

- **Pro (USD 20):** set `concurrency: 1`. Expect roughly 1–3 small jobs per 5-hour window and a handful per week; at `concurrency: 2–3` you'd hit the 5-hour limit within about an hour and then everything pauses. Measure your own: check `/usage` before and after one job.
- **Fable intake isn't in Pro's limits**: it bills to usage credits at API rates. On Pro, change `model: fable` to `model: opus` in `.claude/agents/intake.md`.
- **Stretch Pro further:** route more work to Sonnet/Haiku in `config.json`, and keep issues small.
- **Real parallelism:** Max 5x (USD 100/month, 5× Pro) for 2–3 jobs at once; Max 20x (USD 200/month) for 3+ all day.

- It runs on your Claude plan. Intake runs on Fable once per issue, which can bill to usage credits rather than included usage depending on the plan. Three parallel jobs use limits roughly three times as fast.
- Start with small, low-risk issues and read every PR until you trust it. Lower `concurrency` to 1 if limits run out.
- The factory pushes only `factory/*` branches, merges only through `gh pr merge`, and never deploys. Releases stay with the tag-based flow in [ci-cd.md](ci-cd.md).
- Issue text reaches agents only as quoted data. Only people with triage/write access can add the `factory` label.
- The factory files are GPLv3 (ZazenCodes); the repo is public, so they stay GPLv3 with the licence in [factory/LICENSE](../factory/LICENSE). See the License section in the README.
