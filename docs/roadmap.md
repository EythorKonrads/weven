# Roadmap, accounts and costs

Building and beta-testing costs close to nothing; fixed costs arrive with the store listings.

## Phases

| Phase | Scope | Exit criterion |
| --- | --- | --- |
| 0 · Foundations | Repo, CI, Supabase projects, auth + schema v1, `packages/core` tested | CI green on `main` |
| 1 · MVP | Groups + members, equal + exact splits, balances, settle-up | We use it at home |
| 2 · Private beta | Invite links, push, receipts, currencies, store test tracks | Beta groups keep using it |
| 3 · Public launch | Store listings, privacy + account deletion, Sentry, Supabase Pro, [launch checklist](#before-public-launch) | Live in both stores |

Phase 1 is the one that matters: once your own household settles up in it, the rest is polish and distribution.

## Accounts and costs

Estimates as of 2026-11-01, USD, before Danish VAT. Check prices before signing up.

| Item | Cost | Needed from |
| --- | --- | --- |
| Claude Pro | 20/month | Now (the factory runs on it) |
| GitHub (private repo + Actions) | Free (2,000 Linux CI minutes/month) | Day 1 |
| Supabase staging | Free org (2 free projects; pauses after 7 days idle) | Day 1 |
| Supabase production | Free plan to start (500 MB DB, 50k users, 1 GB files, 5 GB egress; no backups; pauses after 7 idle days). Pro 25/month once real users depend on it | Beta → upgrade later |
| Expo / EAS | Free: 15 iOS + 15 Android builds/month, 1,000 OTA-update users, web hosting 100k requests/month. Starter 19/month when outgrown | First device build |
| Apple Developer Program | 99/year | TestFlight |
| Google Play Console | 25 once | Play internal testing |
| Domain (.com) | ~10–15/year | Web launch |
| Web hosting | Cloudflare Pages free plan for staging, PR previews and production, custom domain included. EAS Hosting not used for web: no custom domain on its free tier (Starter USD 19/month). Netlify not used: its 1,000 credits/month are shared with another project | Web launch |
| Transactional email (magic links) | Free tier of e.g. Resend; Supabase's built-in SMTP is rate-limited and not for production | Beta |
| Push notifications | Free (Expo Push) | Beta |
| FX rates | Free (ECB-based API such as Frankfurter) | Multi-currency |
| Sentry | Free tier | Beta |

### Per year in DKK

At 1 USD ≈ 6.70 DKK (Wise mid-market, 2026-11-01). "Incl. moms" adds 25% Danish VAT.

Plan: Supabase Free for staging and production, web on Cloudflare Pages free.

| Item | USD/year | DKK/year |
| --- | --- | --- |
| Claude Pro | 240 | 1,608 |
| Apple Developer | 99 | 663 |
| Domain | ~12 | ~80 |
| Google Play (year 1 only) | 25 | 168 |
| Supabase, Expo (builds + web hosting), email, Sentry | 0 | 0 |

| Scenario | Excl. moms | Incl. moms |
| --- | --- | --- |
| Year 1 | ~2,500 DKK | ~3,150 DKK |
| Year 2 onwards | ~2,350 DKK | ~2,950 DKK |
| + Supabase Pro when upgrading | +2,010 DKK/year | +2,510 DKK/year |

Upgrade Supabase production to Pro when any of these happens: people outside family and friends depend on it, the database nears 400 MB, egress nears 5 GB/month, or you want point-in-time restores instead of nightly dumps.

Cost risks: Supabase compute add-ons and branching sit outside the spend cap; EAS usage beyond the free tier; Claude usage credits if the factory runs past Pro limits.

## Before public launch

Added to Phase 3's scope. Do the name check first, since it can change everything else.

- [ ] **Name check:** search trademarks (EUIPO, the Danish and Icelandic registers) and the App Store and Google Play for "Weven" before spending on branding or store listings
- [ ] **Terms of service and a support contact:** published on the site and linked from the store listings
- [ ] **Data processing agreements** with every vendor handling user data: Supabase, Cloudflare, Expo and Sentry
- [ ] **Tested restore:** restore the nightly database backup into a scratch project at least once, and write down the steps
- [ ] **Uptime alert:** a free monitor on the web app and the backend that alerts us before users notice
- [ ] **Danish and Icelandic landing page:** the page is English only today, while the app ships in da, en and is

## Next steps

- [ ] Settle the app name; grab the .com, App Store name and bundle ID together
- [ ] Create the GitHub repo, Supabase staging + prod projects, Expo account
- [ ] Enrol in the Apple Developer Program early (approval can take days)
