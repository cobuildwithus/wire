# 2026-03-12 Budget Maintenance Helper Surface

## Goal

Add shared `wire` planners for the missing BudgetTCR/controller permissionless maintenance operations so downstream CLI commands can execute them through the canonical hosted/local wallet split.

## Scope

- Add shared planners for:
  - `activateRegisteredBudget`
  - `finalizeRemovedBudget`
  - `retryRemovedBudgetResolution`
  - `pruneTerminalBudget`
  - `syncBudgetTreasuries`
- Export the new helpers from the package root.
- Add focused wire tests for the new plan builders.

## Constraints

- Keep planners deterministic and RPC-free.
- Reuse the existing protocol-plan model and Base-only execution assumptions.
- Avoid unrelated active `revnet` and `flow` ownership in this repo.

## Parallelization Boundary

- Parent `codex-budget-maint-parent` owns shared wire glue and verification:
  - `src/protocol-budget-maintenance/shared.ts`
  - `src/protocol-budget-maintenance/index.ts`
  - `src/index.ts`
  - `tests/protocol-budget-maintenance.test.ts`
  - `agent-docs/index.md`
- Worker `codex2-budget-activate` owns:
  - `src/protocol-budget-maintenance/activate-registered-budget.ts`
- Worker `codex2-budget-finalize-removed` owns:
  - `src/protocol-budget-maintenance/finalize-removed-budget.ts`
- Worker `codex2-budget-retry-resolution` owns:
  - `src/protocol-budget-maintenance/retry-removed-budget-resolution.ts`
- Worker `codex2-budget-prune` owns:
  - `src/protocol-budget-maintenance/prune-terminal-budget.ts`
- Worker `codex2-budget-sync` owns:
  - `src/protocol-budget-maintenance/sync-budget-treasuries.ts`

## Planned Verification

- `pnpm typecheck`
- `pnpm test`
- `pnpm test:coverage`
- `bash scripts/check-agent-docs-drift.sh`
- `bash scripts/doc-gardening.sh --fail-on-issues`

## Notes

- `v1-core` already exposes the ABI/interface surface for all five selectors; this plan is downstream helper coverage only.
- These actions were explicitly out of scope for the earlier participant helper closure and now form their own maintenance-oriented helper slice.

## Outcome

- Added shared planners for the five missing budget maintenance actions and exported them from the package root.
- Covered the new planners with focused ABI/data assertions in `tests/protocol-budget-maintenance.test.ts`.

## Verification

- `pnpm typecheck`
- `pnpm test`
- `pnpm test:coverage`
- `bash scripts/check-agent-docs-drift.sh`
- `bash scripts/doc-gardening.sh --fail-on-issues`

Status: completed
Updated: 2026-03-12
Completed: 2026-03-12
