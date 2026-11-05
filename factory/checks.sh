#!/usr/bin/env bash
# Weven's checks. Exit 0 only when the branch is fit to review.
#
# The gate runs this script from the main checkout with the job's worktree as
# the working directory. It must stay non-interactive and must not rewrite
# source files. Keep it in step with "Commands" in CLAUDE.md and with
# .github/workflows/pr.yml.
#
# Parallel jobs: everything here runs in the job's own worktree, except the
# database step. All worktrees share one local Supabase stack (same project_id,
# same Docker containers), so that step holds a lock: one job at a time resets
# the local database to its branch's migrations and runs pgTAP against it.
set -euo pipefail

FACTORY_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [ ! -f package.json ]; then
  echo "No package.json: the app isn't scaffolded yet. Do Phase 0 (docs/roadmap.md) before running the factory." >&2
  exit 1
fi

# Fresh worktrees need dependencies; pnpm's shared store makes this quick.
pnpm install --frozen-lockfile --prefer-offline

pnpm typecheck
pnpm lint
pnpm test

# Web build must succeed (written to a temp dir, not the repo).
WEB_OUT="$(mktemp -d)"
trap 'rm -rf "$WEB_OUT"' EXIT
pnpm --filter app exec expo export --platform web --output-dir "$WEB_OUT"

# Landing page: Tailwind builds, and all styling stays in Tailwind classes.
pnpm --filter landing build
if grep -nE '<style|[[:space:]]style=' apps/landing/public/index.html; then
  echo "apps/landing/public/index.html has inline CSS: use Tailwind classes." >&2
  exit 1
fi

# Database: migrations apply cleanly, pgTAP passes, generated types are current.
"$FACTORY_DIR/bin/db-lock" bash -euo pipefail -c '
  supabase status >/dev/null 2>&1 || supabase start
  supabase db reset --local
  supabase test db
  TYPES="$(mktemp)"
  supabase gen types typescript --local > "$TYPES"
  if ! diff -q "$TYPES" packages/core/src/database.types.ts >/dev/null; then
    echo "packages/core/src/database.types.ts is stale: run supabase gen types typescript --local > packages/core/src/database.types.ts and commit it." >&2
    rm -f "$TYPES"; exit 1
  fi
  rm -f "$TYPES"
'
