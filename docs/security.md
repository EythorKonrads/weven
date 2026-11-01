# Security, privacy and compliance

The app holds who owes whom inside friendships and families. Treat it as personal financial data from day one.

- **RLS on every table**, tested in pgTAP. The app only uses the public anon key; the service role key lives only in Edge Functions and CI secrets.
- **New tables need explicit grants**: Supabase no longer auto-exposes new `public` tables to the Data API (enforced on all projects from 2026-10-30). Each table-adding migration grants access and enables RLS. ([changelog](https://supabase.com/changelog))
- **GDPR**: EU-hosted project, privacy policy, data export, real account deletion. Deleted users become "Former member" on old expenses so others' balances stay correct.
- **Store requirements**: in-app account deletion (Apple), Sign in with Apple alongside Google, privacy nutrition labels, Play data-safety form.
- **No payments in v1.** Settle-up records that someone paid (MobilePay, bank transfer); it never moves money. Keeps the app out of payment licensing.
- **Receipts** in a private storage bucket, group-scoped policies, signed URLs.
- **Secrets** never in the repo: `.env.local` for dev; EAS secrets and GitHub Environments for builds.
