# Decisions

## Open

- [ ] **Account to join a group?** Placeholder members allow "add Mom now, she signs up later", but complicate merging identities.
- [ ] **Multi-currency in v1?** Touches the schema early; decide before the first migration even if the UI comes later.
- [ ] **Offline expense entry** in v1, or online-first with an outbox later.
- [ ] **.com domain** for Weven.

## Log

Newest first. One line per decision: date · decision · why.

| Date | Decision | Why |
| --- | --- | --- |
| 2026-11-01 | `main` is protected: required `checks` job, branch up to date, admins included. CI skips `checks` for docs-only changes through a `changes` job, not `paths-ignore` | Green CI before every merge, also for the factory; no CI minutes spent on Markdown edits |
| 2026-11-01 | Expo SDK 58; Expo Router screens in `apps/app/app/` (template default is `src/app/`) | Latest at scaffold; keeps the layout in architecture.md |
| 2026-11-01 | pnpm 12 with `nodeLinker: hoisted` in `pnpm-workspace.yaml` | Expo's monorepo guide; flat node_modules avoids React Native resolution issues. pnpm 10+ reads settings from the workspace file, not `.npmrc` |
| 2026-11-01 | Local Supabase on ports 553xx instead of 543xx | Runs alongside other local Supabase projects on the same machine |
| 2026-11-01 | ESLint 9 (not 10) | eslint-config-expo's plugins (import, react) don't support ESLint 10 yet |
| 2026-11-01 | Web output `single` (SPA), not server/static rendering | No SEO needs; avoids running device-locale and Supabase code at build time. Revisit for a public landing page |
| 2026-11-01 | App uses the Supabase **publishable** key (`EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY`), not the legacy anon JWT | What the current CLI prints; Edge Functions validate it with `@supabase/server` |
| 2026-11-01 | Phase 0 scope: hello world proving app ↔ Edge Function ↔ Postgres, local + CI; no cloud deploys yet | Foundations first; staging comes with the first feature |
| 2026-11-01 | Client: Expo / React Native; backend: Supabase | Native UI plus web from one codebase; Postgres + auth + RLS free to start. Plain migrations keep a move to RDS possible ([stack.md](stack.md#supabase-vs-aws-cost-note)) |
| 2026-11-01 | App name is Weven (was BillSplitt); GitHub repo `weven` | billsplitt.com was taken |
| 2026-11-01 | Start production on Supabase Free, upgrade to Pro when real users depend on it; nightly dumps as backup meanwhile | Saves ~2,500 kr./year early on; free limits are far above a friends-and-family app's needs |
| 2026-11-01 | Host all web (staging, PR previews, production) on EAS Hosting free; not Netlify | Netlify Personal has 1,000 credits/month shared with another project; deploys cost 15 each, and the factory merges often enough to burn them |
| 2026-11-01 | ~~Host web on the existing Netlify Personal plan~~ (superseded same day) | — |
| 2026-11-01 | Use the ZazenCodes software factory v2 to build issues in parallel | Several tickets at once, each in its own worktree and PR, with checks and reviews before merge |
| 2026-11-01 | Navy accent colour for the design | Chosen during design work |
| 2026-11-01 | Mobile-first, same features on web and native | Product scope |
