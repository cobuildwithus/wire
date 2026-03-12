# Protocol Notification Completeness

## Goal

Finish the shared protocol notification contract for the remaining lifecycle reasons and more actionable app paths.

## Scope

- Add shared presenter support for goal and budget success-assertion reasons.
- Cover finalize-failed, resolver-lifecycle, juror reward, and reminder reason families through the same shared contract.
- Add controller-like role-aware copy without splitting semantic reasons.
- Route budget, mechanism, success-assertion, and dispute notifications to the most relevant existing app surfaces with structured query refs intact.
- Preserve richer shared payload metadata for schedules, amounts, reminder context labels, and reward buckets.
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

Status: completed
Updated: 2026-03-12
Completed: 2026-03-12
