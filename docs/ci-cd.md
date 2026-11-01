# CI, environments and deployment

Code moves local → PR preview → staging → production. The database schema only changes through migrations applied by CI.

## CI workflows (GitHub Actions)

A PR merges only when PR checks are green. Branch protection on `main` requires the `checks` job to pass and the branch to be up to date with `main`, and applies to admins too. A docs-only PR still passes: the workflow always starts, and `checks` is skipped, which GitHub counts as passed. Don't switch to `paths-ignore`: a required check that never starts blocks the PR forever.

| Workflow | Trigger | Steps |
| --- | --- | --- |
| `pr.yml` | Every PR and push to `main` | Skipped when only docs, Markdown, `.claude/` or factory dashboard/config files changed. Otherwise runs `factory/checks.sh`: install (pnpm cache) → typecheck → lint → unit tests → start local Supabase → migrations + seed → pgTAP → check generated types are current |
| `preview.yml` | Every same-repo PR (fork PRs are skipped) | Same docs/agent skip as `pr.yml`. Otherwise export web → `eas deploy` with no alias → unique URL posted, and updated on later pushes, as one PR comment. Runs against the staging Supabase project. Later: EAS Update to a PR channel (open the branch on your phone); Playwright against the preview |
| `main.yml` | Merge to `main`, or run by hand (deploys everything) | Only what changed: migrate staging (`supabase db push`) → deploy Edge Functions → export web → `eas deploy --alias staging`. Later: EAS Update to `staging` channel |
| `release.yml` | Tag `v*` | Migrate production → deploy Edge Functions → deploy web → EAS Build + Submit (iOS, Android) |
| `nightly.yml` | Schedule | Maestro e2e on a simulator build; dependency audit |
| `backup.yml` | Nightly | `supabase db dump` of production (schema + data), encrypted, stored as a workflow artifact (90-day retention). Needed while production is on the Free plan, which has no backups |

Notes:

- Node 22+ in CI: Supabase JS libraries dropped Node 20 on 2026-06-30.
- Secrets (Supabase access token, EAS token, Apple/Google credentials) in GitHub Environments `preview`, `staging` and `production`; production needs manual approval.
- `staging` environment (deploys from protected branches only): secrets `SUPABASE_ACCESS_TOKEN`, `SUPABASE_DB_PASSWORD` and `EXPO_TOKEN`; variables `SUPABASE_PROJECT_REF`, `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (public values, inlined into the web bundle). The staging DB password is also in the maintainer's macOS Keychain (`weven-staging-db`).
- `preview` environment (all branches, no required reviewers): secret `EXPO_TOKEN`; variables `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, set to staging's public values (see the Environments table). This is a manual maintainer setup step; `preview.yml` fails with a clear error until it is done. With `gh`:
  ```
  gh api -X PUT repos/EythorKonrads/weven/environments/preview
  gh secret set EXPO_TOKEN --env preview
  gh variable set EXPO_PUBLIC_SUPABASE_URL --env preview --body "<staging URL>"
  gh variable set EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY --env preview --body "<staging publishable key>"
  ```
  Or use Settings → Environments → New environment in the GitHub UI. Deployment branches default to all branches.
- `seed.sql` is local-only and never reaches cloud projects. Data every environment needs (like the `health_check` row) goes in a migration.
- Renovate or Dependabot opens weekly grouped dependency PRs. Expo SDK upgraded deliberately once per SDK release with `npx expo install --fix`.

## Environments

| Environment | Database | Web | Mobile |
| --- | --- | --- | --- |
| Local | `supabase start` (Docker) + `seed.sql` | `expo start --web` | Development build on simulator or phone |
| PR preview | Staging Supabase project (read/write against staging's schema; PRs with new migrations preview against the old schema) | EAS Hosting unique URL per deployment, no alias | Later |
| Staging | Supabase project `weven-staging` (ref `fgtrqsxmgqlzhprldags`, eu-north-1 Stockholm, Free plan). URL `https://fgtrqsxmgqlzhprldags.supabase.co`, publishable key `sb_publishable_82oyMTysNgEqy_ksZvwNmQ_tMg1fOJ1` (public, ships in the app) | EAS Hosting alias `staging`: https://weven--staging.expo.app (EAS project `@ekonrads/weven`) | Internal distribution build, `staging` channel |
| Production | Supabase project `weven-prod`, EU region | EAS Hosting, custom .com domain | App Store + Google Play, `production` channel |

## How a change ships

1. Branch, code, commit; open a PR. CI runs checks and posts a web preview link on the PR. A phone QR code comes later.
2. Squash-merge to `main`. CI migrates staging and pushes to staging web and the staging app channel.
3. When staging looks right, tag a release (`v0.4.0`). CI migrates production and deploys web.
4. JS-only change: EAS Update to production, live on phones in minutes, no store review.
5. Native change (new native module, permissions, SDK upgrade): EAS Build + Submit → TestFlight / Play internal testing → promote in store consoles.

## Safety rules

- **Backwards-compatible migrations.** Old app versions stay installed for weeks: add columns before code uses them, remove only after no live version reads them (expand, then contract).
- **Runtime version policy** in EAS ties OTA updates to compatible native builds.
- **Rollback**: web = redeploy previous build; OTA = republish previous update; database = a new forward migration, never edit history.
- **Monitoring**: Sentry for crashes and JS errors (source maps uploaded by CI); Supabase logs for DB and functions.
