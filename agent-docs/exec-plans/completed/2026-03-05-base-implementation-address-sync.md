# Base Implementation Address Sync

## Goal

Sync wire’s canonical Base protocol address exports and regenerated ABIs to the latest deployed `v1-core` implementation and entrypoint set so downstream consumers (including `indexer`) consume current factories and implementation ABI surfaces.

## Scope

- Update `src/protocol-addresses.ts` from latest `v1-core/deploys/LATEST_IMPLEMENTATIONS.8453.{txt,toml}` values.
- Refresh `goalFactory` and `budgetTcrFactory` entrypoints from `v1-core/deploys/DeployGoalFactory.8453.txt`.
- Regenerate ABI exports via `pnpm wagmi` to refresh `src/generated/abis.ts`.
- Align address assertions in `tests/protocol-addresses.test.ts`.

## Constraints

- Preserve existing public export names and module boundaries.
- Avoid introducing runtime behavior changes outside address/ABI sync.

## Done

- Updated Base terminal/config/default + implementation addresses in `src/protocol-addresses.ts`.
- Updated Base `GoalFactory` and `BudgetTCRFactory` entrypoint addresses in `src/protocol-addresses.ts`.
- Regenerated protocol ABIs in `src/generated/abis.ts` using `pnpm wagmi` (with retries for explorer rate limits).
- Updated `tests/protocol-addresses.test.ts` to assert the latest factory addresses.

## Now

- None.

## Next

- Move this plan to `agent-docs/exec-plans/completed/` when release/branch finalization occurs.
Status: completed
Updated: 2026-03-12
Completed: 2026-03-12
