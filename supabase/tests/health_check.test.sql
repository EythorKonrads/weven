begin;
select plan(9);

select has_table('public', 'health_check', 'health_check exists');
select is(
  (select relrowsecurity from pg_class where oid = 'public.health_check'::regclass),
  true,
  'RLS is enabled on health_check'
);

-- Act as the anonymous API role.
set local role anon;

select results_eq(
  'select message from public.health_check where id = 1',
  $$values ('Hello from Postgres'::text)$$,
  'anon can read the seeded row'
);

select throws_ok(
  $$insert into public.health_check (id, message) values (2, 'nope')$$,
  '42501',
  null,
  'anon cannot insert'
);
select throws_ok(
  $$update public.health_check set message = 'changed' where id = 1$$,
  '42501',
  null,
  'anon cannot update'
);
select throws_ok(
  $$delete from public.health_check where id = 1$$,
  '42501',
  null,
  'anon cannot delete'
);

-- Signed-in users can read but not write either.
reset role;
set local role authenticated;

select results_eq(
  'select count(*)::int from public.health_check',
  $$values (1)$$,
  'authenticated can read the row'
);
select throws_ok(
  $$insert into public.health_check (id, message) values (2, 'nope')$$,
  '42501',
  null,
  'authenticated cannot insert'
);

reset role;
select results_eq(
  'select message from public.health_check where id = 1',
  $$values ('Hello from Postgres'::text)$$,
  'the row is unchanged'
);

select * from finish();
rollback;
