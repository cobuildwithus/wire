# Protocol Notification Completeness

## Goal

Finish the shared protocol notification contract for the remaining lifecycle reasons and more actionable app paths.

## Scope

- Add shared presenter support for goal and budget success-assertion reasons.
- Add controller-like role-aware copy without splitting semantic reasons.
- Route budget, mechanism, success-assertion, and dispute notifications to the most relevant existing app surfaces with structured query refs intact.
- Keep web and chat consumers aligned through the shared presenter contract.

## Constraints

- Keep the payload contract stable so downstream consumers only need the published presenter update.
- Preserve a single source of truth for deep-link selection instead of rebuilding route matrices in consumer repos.

## Verification

- `pnpm typecheck`
- `pnpm test`
- `pnpm test:coverage`
- `pnpm docs:drift`
- `pnpm docs:gardening`

Status: in_progress
Updated: 2026-03-10
