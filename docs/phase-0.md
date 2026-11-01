# Phase 0 · Base project

Brief for Claude Code. Run it on the Mac from the repo root: `claude`, then
"Do docs/phase-0.md". Goal: the smallest app that proves front end, back end
and database are wired together, locally and in CI. **No product features**
(no groups, expenses, splits, auth screens).

Read first: CLAUDE.md, docs/architecture.md, docs/stack.md,
docs/coding-standards.md, docs/testing.md, docs/ci-cd.md, factory/checks.sh.

## Decided

- Client: Expo (latest SDK at `create-expo-app`), Expo Router, web via React Native Web
- Backend: Supabase (local via `supabase start`; no cloud projects yet)
- Scope: local + CI. No staging/production deploys, no EAS builds yet.

## Prerequisites (check, ask Eythor to install anything missing)

Node 22+, pnpm, Docker Desktop running, Supabase CLI, `gh` authenticated.

## Work on a branch

`git switch -c chore/phase-0`. Small Conventional Commits. Open a PR at the end.

## Build

1. **Workspace**: root `package.json` (private, `packageManager` pinned),
   `pnpm-workspace.yaml` (`apps/*`, `packages/*`), `.npmrc` with whatever
   Expo currently needs for pnpm monorepos (check Expo's monorepo guide;
   `node-linker=hoisted` if in doubt). Root scripts that run across the
   workspace: `typecheck`, `lint`, `test` (non-interactive), `format`.
   Commit `pnpm-lock.yaml`.
2. **TypeScript**: shared `tsconfig.base.json` with `strict` and
   `noUncheckedIndexedAccess`.
3. **Lint/format**: ESLint flat config (typescript-eslint, react-hooks, Expo
   config) + Prettier. Rule that `packages/core` can't import react, react-native,
   expo* or @supabase/*. Lefthook pre-commit running format + lint on staged files.
4. **`packages/core`** (name `@weven/core`): pure TS. `Money` type
   (`{ amount: number; currency: CurrencyCode }`, integer minor units) and
   `addMoney(a, b)` that throws on mixed currencies or non-integers. Vitest +
   fast-check property test (addition is commutative, stays integer). Also
   holds `src/database.types.ts` (generated, committed).
5. **Supabase**: `supabase init` at the repo root (project_id `weven`).
   - Migration `..._health_check.sql`: table `public.health_check`
     (`id smallint primary key`, `message text not null`, `checked_at timestamptz default now()`),
     RLS enabled, policy + grant: `anon` and `authenticated` may select; nobody
     may write through the API.
   - `seed.sql`: one row, message `Hello from Postgres`.
   - pgTAP test `supabase/tests/health_check.test.sql`: RLS is enabled; anon
     can read the row; anon insert/update/delete fail.
   - Edge Function `hello` (Deno/TS): returns JSON
     `{ message: "Hello from the Edge", time }`. CORS headers so web can call it.
   - Generate types into `packages/core/src/database.types.ts`.
6. **`apps/app`** (package name must be `app`; checks.sh filters on it):
   `create-expo-app` with the default/Router template, then trim the demo
   screens. Layout per docs/architecture.md: `app/`, `src/ui/`, `src/lib/`, `src/features/`.
   - `src/lib/supabase.ts`: client from `EXPO_PUBLIC_SUPABASE_URL` /
     `EXPO_PUBLIC_SUPABASE_ANON_KEY` (or publishable key, whatever current
     Supabase CLI prints), typed with `Database` from `@weven/core`.
   - `src/lib/query-client.ts`: TanStack Query provider in the root layout.
   - `src/lib/i18n.ts`: i18next with `da`, `en`, `is`; device locale, fallback `en`.
   - `src/ui/tokens.ts`: colours (navy accent), spacing, radii, type scale.
   - `app/index.tsx`: "Weven" title and three status rows, each
     loading → ok/error, all text via i18n:
     **Front end** (always ok, shows platform), **Back end** (calls the
     `hello` function), **Database** (selects the `health_check` row).
   - `.env.example` with the local values `supabase status` prints; `.env.local` gitignored.
   - One jest-expo + React Native Testing Library test for the screen with
     the Supabase calls mocked (ok and error state).
7. **CI** `.github/workflows/pr.yml` on pull_request and push to main, Node 22,
   pnpm cache, `supabase/setup-cli`. Run the same steps as `factory/checks.sh`
   (simplest: run the script itself).
8. **Checks**: `bash factory/checks.sh` exits 0 on the branch. Fix the app,
   not the script; if the script is genuinely wrong, change it and say why in
   the PR.

## Verify by hand

`supabase start && supabase functions serve` plus
`pnpm --filter app exec expo start --web`: all three rows green in the
browser. Also stop the function server and check the Back end row turns red.
Screenshot it for the PR.

## Finish

- Update README status, CLAUDE.md commands if anything changed, and tick the
  Phase 0 / checks / labels items in docs/software-factory.md.
- Open the PR, wait for CI green, squash-merge to `main`.
- Report back: what was built, anything that deviated from this brief, and
  what to set up next (Supabase staging project, Expo account, branch protection).
