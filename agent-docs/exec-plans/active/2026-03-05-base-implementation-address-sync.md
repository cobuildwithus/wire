# Base Implementation Address Sync

## Goal

Sync wire’s canonical Base protocol address exports and regenerated ABIs to the latest deployed `v1-core` implementation set so downstream consumers (including `indexer`) consume current factories and implementation ABI surfaces.

## Scope

- Update `src/protocol-addresses.ts` from latest `v1-core/deploys/LATEST_IMPLEMENTATIONS.8453.{txt,toml}` values.
- Regenerate ABI exports via `pnpm wagmi` to refresh `src/generated/abis.ts`.
- Align address assertions in `tests/protocol-addresses.test.ts`.

## Constraints

- Preserve existing public export names and module boundaries.
- Keep `GoalFactory` and `BudgetTCRFactory` entrypoints stable while updating implementation/default/config fields.
- Avoid introducing runtime behavior changes outside address/ABI sync.

## Done

- Updated Base terminal/config/default + implementation addresses in `src/protocol-addresses.ts`.
- Regenerated protocol ABIs in `src/generated/abis.ts` using `pnpm wagmi` (with retries for explorer rate limits).
- Updated `tests/protocol-addresses.test.ts` to assert the latest terminal address.
- Ran required verification commands successfully:
  - `pnpm typecheck`
  - `pnpm test`
  - `pnpm test:coverage`
  - `bash scripts/check-agent-docs-drift.sh`
  - `bash scripts/doc-gardening.sh --fail-on-issues`

## Now

- None.

## Next

- Move this plan to `agent-docs/exec-plans/completed/` when release/branch finalization occurs.
