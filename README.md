# Weven

An app for splitting bills with friends and family. Native iOS and Android plus web, mobile-first, with the same features everywhere.

> Formerly Weven (weven.com was taken). The .com domain for Weven is still open.

## Status

Planning. No code yet. See [docs/roadmap.md](docs/roadmap.md) for phases and [docs/decisions.md](docs/decisions.md) for what is still undecided.

## Documentation

| File | What it covers |
| --- | --- |
| [docs/stack.md](docs/stack.md) | Technology choices and alternatives considered |
| [docs/architecture.md](docs/architecture.md) | Repo layout, domain model, money rules, data flow |
| [docs/coding-standards.md](docs/coding-standards.md) | TypeScript, lint, conventions, git workflow |
| [docs/testing.md](docs/testing.md) | Test strategy per layer |
| [docs/ci-cd.md](docs/ci-cd.md) | CI workflows, environments, deployment flow |
| [docs/security.md](docs/security.md) | RLS, GDPR, store requirements, secrets |
| [docs/roadmap.md](docs/roadmap.md) | Phases, accounts to create, costs |
| [docs/decisions.md](docs/decisions.md) | Open decisions and a log of decisions made |
| [docs/software-factory.md](docs/software-factory.md) | The agent pipeline that builds GitHub issues in parallel |
| [CLAUDE.md](CLAUDE.md) | Instructions for Claude Code working in this repo |

## Stack at a glance

| Area | Choice |
| --- | --- |
| Client | Expo (React Native) + Expo Router, web via React Native Web |
| Language | TypeScript, strict |
| Backend | Supabase: Postgres, Auth, RLS, Realtime, Storage, Edge Functions |
| Server state | TanStack Query + generated Supabase types |
| Domain logic | `packages/core`, pure TypeScript |
| CI | GitHub Actions |
| Delivery | EAS Build/Submit/Update, EAS Hosting (free) for web, Supabase CLI migrations |

## License

The software factory is from the [ZazenCodes Software Factory for Claude Code v2](https://github.com/zazencodes/zazencodes-season-3/tree/main/src/software-factory-claude-code-v2), created by ZazenCodes, and is licensed under GPLv3 ([factory/LICENSE](factory/LICENSE)). It is modified for Weven (see [docs/software-factory.md](docs/software-factory.md#weven-tailoring)). This covers:

- `factory/` (scripts, config, checks and dashboard)
- `.claude/agents/`
- `.claude/skills/factory/`

These files are separate development tools; the Weven app code is not built on them and is not covered by the GPL.
