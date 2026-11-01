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
| 2026-11-01 | Phase 0 scope: hello world proving app ↔ Edge Function ↔ Postgres, local + CI; no cloud deploys yet | Foundations first; staging comes with the first feature |
| 2026-11-01 | Client: Expo / React Native; backend: Supabase | Native UI plus web from one codebase; Postgres + auth + RLS free to start. Plain migrations keep a move to RDS possible ([stack.md](stack.md#supabase-vs-aws-cost-note)) |
| 2026-11-01 | App name is Weven (was BillSplitt); GitHub repo `weven` | billsplitt.com was taken |
| 2026-11-01 | Start production on Supabase Free, upgrade to Pro when real users depend on it; nightly dumps as backup meanwhile | Saves ~2,500 kr./year early on; free limits are far above a friends-and-family app's needs |
| 2026-11-01 | Host all web (staging, PR previews, production) on EAS Hosting free; not Netlify | Netlify Personal has 1,000 credits/month shared with another project; deploys cost 15 each, and the factory merges often enough to burn them |
| 2026-11-01 | ~~Host web on the existing Netlify Personal plan~~ (superseded same day) | — |
| 2026-11-01 | Use the ZazenCodes software factory v2 to build issues in parallel | Several tickets at once, each in its own worktree and PR, with checks and reviews before merge |
| 2026-11-01 | Navy accent colour for the design | Chosen during design work |
| 2026-11-01 | Mobile-first, same features on web and native | Product scope |
