# CLAUDE.md

Instructions for Claude Code (and any other agent) working in this repo. Read the linked docs before changing related code.

## Project

Weven splits bills between friends and family. One TypeScript codebase: an Expo app (iOS, Android, web) and a Supabase backend.

## Layout

```
apps/app/            Expo app (Expo Router screens in app/, features in src/features/)
apps/landing/        Coming-soon page for wevenapp.com: static HTML, no build, not i18n'd yet
packages/core/       Pure TS: money, split, balances, settle-up, zod schemas
supabase/migrations/ SQL migrations — the only way the schema changes
supabase/functions/  Edge Functions (Deno)
supabase/tests/      pgTAP tests
docs/                Project documentation
design/              UI designs and spec (DESIGN.md): reference only, not shipped
```

## Hard rules

- **Money is integers in minor units** (øre, cents) plus an ISO 4217 currency code. Never floats. Use the `Money` type.
- Splits must always sum exactly to the expense total; remainders are distributed deterministically.
- `packages/core` must not import React, Expo or Supabase.
- Every new table: RLS enabled, policies written, explicit grants, pgTAP test proving a non-member can't read it.
- Never edit a merged migration. Add a new one. Migrations must be backwards compatible (expand, then contract).
- `supabase/seed.sql` is local dev data only. Data every environment needs goes in a migration.
- No secrets in the repo. No service role key in the app.
- All user-facing text through i18n keys (da, en, is).

## Fresh checkout (also every factory worktree)

```
pnpm install                                   # pnpm 12 (version pinned in package.json)
cp apps/app/.env.example apps/app/.env.local   # local Supabase URL + publishable key
supabase start                                 # needs Docker; shared by all worktrees
supabase functions serve                       # Edge Functions with hot reload (optional)
```

Weven's local Supabase uses ports 553xx (API http://127.0.0.1:55321, DB 55322,
Studio 55323), not the CLI's default 543xx, so it can run next to other local
Supabase projects. pnpm settings (`nodeLinker: hoisted`, `allowBuilds`) live in
`pnpm-workspace.yaml`, not `.npmrc`.

All worktrees share one local Supabase stack. Never run `supabase stop` or
`supabase db reset` outside `factory/checks.sh` while factory jobs are running.

## Dev server on a given port

```
pnpm --filter app exec expo start --web --port <port>
```

Web is the surface agents check in a browser; native is checked by humans.

## Commands

```
pnpm typecheck
pnpm lint
pnpm test                # unit + component tests, non-interactive (no watch mode)
pnpm format              # Prettier (lefthook also formats + lints staged files on commit)
supabase db reset        # apply migrations + seed
supabase test db         # pgTAP tests
supabase gen types typescript --local > packages/core/src/database.types.ts
```

`factory/checks.sh` runs all of these plus a web export; it is the definition of
"checks pass" for humans, Claude and the factory alike.

## Definition of done

- [ ] Typecheck and lint pass
- [ ] Tests added for new logic (property tests for anything in split/balance maths)
- [ ] Schema change → migration + regenerated types + pgTAP test
- [ ] Conventional Commit message (`feat:`, `fix:`, `chore:` …)
- [ ] Work on a branch; open a PR, never push to `main`

## Docs

Stack: docs/stack.md · Architecture: docs/architecture.md · Standards: docs/coding-standards.md · Testing: docs/testing.md · CI/CD: docs/ci-cd.md · Security: docs/security.md

When a decision changes, update docs/decisions.md and the affected doc in the same PR.

## Software factory

`/factory run` builds every open GitHub issue labeled `factory` through
intake → spec → build → gate → review → approve, one PR per issue, up to
`concurrency` jobs at once (`factory/config.json`). State is in `factory/jobs/`
(gitignored); `factory/bin/job` is its only writer. Checks:
`factory/checks.sh`. Dashboard: `bash factory/dashboard.sh` (opens
http://localhost:8000/dashboard.html). Details: docs/software-factory.md.

