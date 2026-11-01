# Testing

Test hardest where a bug costs someone money or leaks a group's data: the split maths and the RLS policies. UI gets lighter coverage.

| Layer | Tool | Covers | Runs |
| --- | --- | --- | --- |
| Domain (`packages/core`) | Vitest + fast-check | Splits sum to the total; balances net to zero; settle-up gives minimal transfers; currency rounding | Every PR, < 10 s |
| Database | pgTAP via `supabase test db` | RLS: non-members read nothing; SQL functions reject splits that don't add up | Every PR, local Supabase in CI |
| Components and hooks | Jest (jest-expo) + React Native Testing Library, MSW for Supabase | Forms, split editor, error and empty states | Every PR |
| Web end-to-end | Playwright | Sign in → create group → add expense → see balance | PR, against preview deploy |
| Mobile end-to-end | Maestro | Same happy path on a simulator build | Nightly + before release |
| Manual | TestFlight + Play internal testing | Real devices, real friends | Before each store release |

## Rules of thumb

- Property-based tests (fast-check) on split and balance functions are the best single investment; they find 1-øre rounding bugs nobody writes cases for.
- Every bug fix lands with a test that would have caught it.
- No numeric coverage target. `packages/core` and SQL functions must be fully covered; the rest is judgement.
