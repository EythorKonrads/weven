-- Phase 0: a one-row table the app reads to prove app ↔ API ↔ Postgres is wired up.
create table public.health_check (
  id smallint primary key,
  message text not null,
  checked_at timestamptz not null default now()
);

comment on table public.health_check is 'Phase 0 wiring check. Readable by anyone through the API; writable by nobody.';

alter table public.health_check enable row level security;

-- Supabase's default privileges grant everything on new public tables to the API roles.
-- Start from nothing and grant only what is needed.
revoke all on table public.health_check from anon, authenticated;
grant select on table public.health_check to anon, authenticated;

create policy "Anyone can read the health check"
  on public.health_check
  for select
  to anon, authenticated
  using (true);

-- No insert/update/delete policies or grants: writes through the API are refused.
