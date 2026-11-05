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
| 2026-11-05 | Landing page sends a strict same-origin CSP and other security headers through `apps/landing/public/_headers`; HSTS starts at one day with no `includeSubDomains` or `preload` | The page loads nothing cross-origin, so a tight policy costs nothing; a short HSTS is easy to back out until every subdomain is known to serve HTTPS |
| 2026-11-05 | All styling is Tailwind v4 with one theme (`packages/theme/theme.css`); the app uses Uniwind 1.x, not NativeWind or `StyleSheet`; lint enforces it. The theme has light values only until dark mode is built | One styling language across app and web, tied to the design tokens. Uniwind is stable on Tailwind v4; NativeWind's stable release is on Tailwind v3 and its v5 is a release candidate |
| 2026-11-05 | Coming-soon page at wevenapp.com is static HTML with Tailwind in `apps/landing`, its own Pages project `weven-landing`, self-hosted fonts, no analytics yet (#18); no email form or log in yet (#15, #16) | No framework or JavaScript to maintain, stays separate from the app, needs no cookie banner for now, and no visitor data goes to Google |
| 2026-11-05 | Landing page uses GA4 (`G-WWBMDVC8E3`) behind self-hosted CookieConsent v3 with Consent Mode v2 default-denied; GA loads only after the visitor accepts statistics; no ads or Google signals; Norduo is the controller; consent is stored only in the browser (`cc_cookie`). Supersedes the "no analytics yet / no cookie banner" part of the row above (#18) | We want to know how visitors find the page. Loading GA only after consent keeps it GDPR-compliant without a consent server, and self-hosting the banner means no request to a CDN |
| 2026-11-05 | `design/` is committed to the public repo; the spec targets React Native, not Vue | The project is also a public portfolio piece; factory agents need the designs in their worktrees |
| 2026-11-04 | Web hosting (staging, PR previews, production) moves from EAS Hosting to Cloudflare Pages free; domain `wevenapp.com` with DNS on Cloudflare. Staging: Pages project `weven-staging` at https://staging.wevenapp.com; previews are its `pr-<n>` branches. Supersedes the 2026-11-01 EAS Hosting rows | EAS Hosting has no custom domain on the free tier (Starter USD 19/month); Pages includes custom domains and unlimited static requests for free. EAS stays for builds and OTA updates |
| 2026-11-04 | Supabase CLI pinned to 2.122.0 in CI (`pr.yml`, `main.yml`), same as local; deploy commands pass `--yes` | `latest` pulled CLI 3.0.0, released 2026-11-02, and the staging Functions deploy stopped at a confirmation prompt. Major upgrades happen on purpose |
| 2026-11-04 | EAS project moved to the Expo organization `weveno` (`@weveno/weven`); CI deploys with robot-user tokens per GitHub environment | Robots exist only on organizations; a leaked preview token can then reach only this organization with the Developer role, not the personal account |
| 2026-11-01 | App identifier `com.weven.app` on iOS and Android; EAS profiles `development` and `staging` (Android APK plus iOS Simulator, internal distribution, manual `eas build`); `fingerprint` runtime version policy | Identifiers are permanent once registered; no Apple Developer account yet; fingerprint catches native changes without manual version bumps |
| 2026-11-01 | EAS project `@ekonrads/weven`; staging web at https://weven--staging.expo.app, deployed by `main.yml` after Supabase | Same vendor as builds and updates; Supabase deploys first so new app code never meets an old schema |
| 2026-11-01 | Supabase region eu-north-1 (Stockholm) for staging, and for production later | Closest Supabase region to Denmark and Iceland; projects can't change region |
| 2026-11-01 | Staging migrates and deploys Edge Functions from `main.yml` on merges touching `supabase/`; reference data lives in migrations, `seed.sql` is local-only | Staging matches `main` without manual steps; cloud projects never get dev seed data |
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
| 2026-11-01 | PR previews use the staging Supabase project and unaliased EAS Hosting deployments | CI's local Supabase is unreachable from a deployed preview, and the EAS free tier has only 5 aliases |
