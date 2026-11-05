# Coding standards

Standards are enforced by tools in CI, not by memory. Anything a linter can check, a linter checks.

## TypeScript

- `strict: true` plus `noUncheckedIndexedAccess`. No `any`; use `unknown` and narrow.
- Database types generated with `supabase gen types` and committed; regenerate after every migration.
- Validate everything crossing a boundary (forms, deep-link params, Edge Function input) with Zod.
- A `Money` type (`{ amount: bigint | number; currency: CurrencyCode }`) is the only way amounts move around. No bare numbers for money.

## Lint and format

- ESLint (flat config) with typescript-eslint, react-hooks and the Expo config; Prettier for formatting. Biome is a fine single-tool alternative.
- Import boundaries: `packages/core` may not import React, Expo or Supabase. Features may not import other features' internals.
- Pre-commit hook (lefthook, or husky + lint-staged) runs format and lint on staged files.

## Conventions

| Thing | Rule |
| --- | --- |
| Files | `kebab-case.ts`; components `PascalCase.tsx` |
| Hooks | `useThing`, one per file, in the feature folder |
| Feature folder | `api.ts` (queries/mutations), `components/`, `hooks/`, `types.ts` |
| SQL | `snake_case`, plural table names; every table has RLS enabled and an explicit grant |
| Migrations | One concern per file, never edited after merge |
| Strings | All user-facing text through i18n keys |
| Styling | Tailwind classes only, with colours and fonts from `packages/theme/theme.css`. ESLint rejects `StyleSheet` and `style` props in the app; a runtime-only value needs an `eslint-disable` comment with the reason. Prettier sorts classes. Third-party components that need `className` are wrapped with `withUniwind` |
| Accessibility | Every touchable has an accessible label; text scales with OS font size |

## Git workflow

- Trunk-based: short-lived branches off `main`, squash-merge via PR, even solo. PRs give CI, preview builds and clean history.
- Conventional Commits (`feat:`, `fix:`, `chore:`) feed an automatic changelog.
- `main` is always releasable and protected: green CI required.

## Agentic development

- `CLAUDE.md` at the root states stack, layout, money rules, commands and definition of done.
- Definition of done, human or Claude: types pass, lint passes, tests added for new logic, migration + regenerated types if the schema changed.
- Claude Code works on a branch and opens the PR; CI is the reviewer.
