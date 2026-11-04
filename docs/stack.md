# Stack

One TypeScript codebase on Expo (iOS, Android and web from the same code) with Supabase as the backend. It is the smallest stack that gives real native apps plus a web app for a solo developer.

## Client

- **Expo, current SDK.** SDK 56 shipped May 2026 with React Native 0.85 and React 19.2; SDK 57 is expected autumn 2026. Start on whatever is latest at `create-expo-app`. Phase 0 started on **SDK 58** (React Native 0.88, React 19.3). ([Expo SDK 56](https://expo.dev/sdk/56))
- **Expo Router**: file-based routing (similar to Nuxt pages). Gives deep links for invite links on all platforms.
- **Web** via React Native Web from the same screens. Web is first-class: invitees often open a link on a laptop.
- **Styling**: NativeWind (Tailwind for RN) or a small token-based StyleSheet layer. Navy accent and spacing live in one tokens file.
- **Forms**: React Hook Form + Zod. Zod schemas are shared with the backend.
- **State**: TanStack Query for server data (replaces a Pinia store full of fetch calls); Zustand only for small local UI state.
- **i18n**: i18next with Danish, English and Icelandic; numbers and currency via `Intl`.

## Backend

- **Supabase**, managed Postgres in an EU region: database, auth, storage (receipt photos), realtime, Edge Functions.
- **Auth**: email magic link, Sign in with Apple, Google. Apple sign-in is required on iOS when Google is offered. Passkeys (beta at Supabase) later.
- **Business rules in Postgres**: RLS decides who sees which group; SQL functions handle multi-row writes atomically.
- **Edge Functions** (Deno/TS) only for things needing secrets or third parties: push, FX rates, invite emails.

## Alternatives considered

| Option | Upside | Why not now |
| --- | --- | --- |
| Vue 3 + Ionic + Capacitor | Uses Vue strength directly | Web views, not native UI |
| Nuxt web + separate RN app | Best-in-class web | Two codebases for one person |
| Django + DRF | Known; full control | Run and secure a server; more code before first feature |
| Firebase | Mature mobile tooling | NoSQL is a poor fit for a ledger |
| Self-built on AWS (RDS + Lambda/containers + Cognito + S3) | Full control, AWS experience | No hard spend cap; auth, API, backups and IaC to build and run yourself |

Fallback if React Native is too much of a detour: Ionic + Capacitor. Everything except the client sections still applies.

## Supabase vs AWS cost note

- Supabase Pro is USD 25/month per org, includes USD 10 compute credit (one Micro instance), and has a **spend cap on by default**. Over quota with the cap on → restricted, not billed. Compute add-ons sit outside the cap. ([pricing](https://supabase.com/pricing), [billing FAQ](https://supabase.com/docs/guides/platform/billing-faq))
- AWS Budgets are alerts, not limits; surprise bills usually come from NAT gateways, data transfer and forgotten resources.
- Supabase runs on AWS; region is chosen, so data is still in an AWS EU data centre.
- Exit path: keep the schema plain Postgres migrations and the maths in `packages/core`, so moving to RDS later is a migration, not a rewrite.

## Cheaper-than-Supabase-Pro options considered

| Option | Cost | Verdict |
| --- | --- | --- |
| Supabase Free for production | 0 | **Chosen to start.** Same stack, upgrade is a billing switch. Gaps: no backups (nightly dump instead), pauses after 7 idle days |
| Netlify Database (Neon Postgres) | Shared Netlify credits: 10 per compute-unit hour, sleeps after 5 idle min | No auth, RLS setup, realtime or storage; would need a hand-built API in Netlify Functions, and eats the other project's credits |
| Self-hosted Supabase on Hetzner (CX23) | ~€5.49/month (~41 kr.) | Cheap but you run Docker, updates, security and backups yourself |
| One AWS Lightsail server (self-host Supabase or own API + Postgres) | Micro 1 GB USD 7/month (~563 kr./yr); Small 2 GB USD 12/month (~965 kr./yr) for self-hosted Supabase; backups extra | More than the Free plan's 0 kr. Becomes the cheaper path only instead of Supabase Pro (USD 25/month), at the price of running the server yourself |
| PocketBase on a VPS | ~€5.49/month | SQLite + auth in one binary; leaves the Postgres/RLS plan behind |
| Firebase Spark (free) | 0 | NoSQL is a poor fit for a ledger |

## Web hosting

Cloudflare Pages free plan for staging, PR previews and production. The web export is static files (`web.output: single`), so any static host works. Free includes custom domains (100 per project), unlimited static requests and unlimited preview deployments, and allows commercial use. Domain `wevenapp.com` (Namecheap, DNS on Cloudflare).

Not EAS Hosting: its free tier has no custom domains; Starter costs USD 19/month for one domain. EAS stays for builds, submissions and OTA updates. If the web app ever needs server code (Expo API routes), revisit: EAS Hosting runs it, or Cloudflare Workers.

Not Netlify: Personal has 1,000 credits/month, already shared with another project. Each production deploy costs 15 credits, bandwidth 20/GB, requests 2 per 10k. Staging deploys on every merge from the factory (2–3 a day) would cost ~900–1,350 credits a month on their own.

