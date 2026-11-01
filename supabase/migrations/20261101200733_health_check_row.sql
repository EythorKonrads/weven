-- The health_check row is reference data every environment needs (local, staging,
-- production), not dev data, so it lives in a migration. seed.sql is local only.
insert into public.health_check (id, message)
values (1, 'Hello from Postgres')
on conflict (id) do nothing;
