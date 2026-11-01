# Architecture

Three layers with one rule: splitting and balance maths live in a pure TypeScript package that knows nothing about React or Supabase.

```
Expo app (iOS, Android, web)
  Screens (Expo Router)
    → Feature hooks (TanStack Query)
      → packages/core (split, balances, settle-up)
      → Supabase client (generated types, auth session)
          → Supabase (EU)
              Postgres + Row Level Security  ← every read/write checked
              Auth · Storage · Realtime → back to open screens
              Edge Functions ← DB webhook (push, FX rates, invite emails)
```

## Repo layout

pnpm workspaces in one GitHub repo. Add Turborepo only if builds get slow.

```
billsplitt/
  apps/
    app/              Expo app (iOS, Android, web)
      app/            Expo Router screens: (auth)/, (tabs)/, group/[id]/...
      src/features/   groups, expenses, balances, settle-up, profile
      src/ui/         design system components + tokens
      src/lib/        supabase client, query client, i18n
  packages/
    core/             pure TS: money, split, balances, settle-up, zod schemas
  supabase/
    migrations/       SQL migrations (the only way the schema changes)
    functions/        Edge Functions
    tests/            pgTAP tests for RLS and SQL functions
    seed.sql          local dev data
  .github/workflows/
  CLAUDE.md
```

## Domain model

| Table | Holds | Notes |
| --- | --- | --- |
| profiles | name, avatar, default currency, locale | 1:1 with auth user |
| groups | name, base currency, created_by | "Summer house", "Household" |
| group_members | group, user (or placeholder name), role | Placeholders allow adding people before they sign up |
| invites | group, token, expires_at | Deep link opens app or web |
| expenses | group, payer, amount, currency, fx rate, date, category, note, receipt path | Never hard-deleted; soft delete + history |
| expense_splits | expense, member, share amount | Sum must equal the expense amount (DB check) |
| settlements | group, from member, to member, amount | Recorded payments, e.g. a MobilePay transfer |

Balances are derived, never stored: a SQL view sums paid minus owed per member. Settle-up suggestions (fewest transfers) are computed in `packages/core`.

## Money rules

- Amounts are **integers in minor units** in a `bigint` column. Never floats.
- Every amount carries an ISO 4217 currency code. A currency table decides decimals (ISK effectively has none).
- Split modes: equal, exact amounts, percentages, shares. Remainders are distributed deterministically (e.g. first members get the extra øre) so parts always sum to the total.
- Foreign-currency expenses store the rate used at entry time; history never changes when rates move.

## Data flow

Screens call feature hooks (`useGroupBalances`) → TanStack Query → Supabase client → Postgres, where RLS checks group membership on every row. Multi-table writes go through one SQL function so they succeed or fail together. Realtime subscriptions invalidate queries when someone else adds an expense.

## Offline and notifications

- v1: online-first, optimistic updates, clear "offline" banner; query cache persisted so balances show without signal.
- Later: queued-writes outbox if offline expense entry matters.
- Push via Expo Notifications, sent from an Edge Function triggered by a DB webhook on new expenses.
