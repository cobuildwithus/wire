# 2026-03-12 Flow Allocation CLI Surface

## Goal

Align `@cobuild/wire` flow participant planners and hosted protocol-step validation with the current single-strategy `CustomFlow` surface in `v1-core`, so downstream CLI commands can execute allocation maintenance safely through shared helpers.

## Scope

- Add a shared `flow.sync-allocation` execution plan builder.
- Update the shared flow ABI/plan surface to match the current `CustomFlow` `clearStaleAllocation(uint256)` signature.
- Extend hosted protocol-step validation to allow the new flow action and the corrected `Flow` function surface.
- Update focused wire tests for planner construction and hosted request validation.

## Constraints

- Treat `v1-core` `src/interfaces/IFlow.sol` and `src/flows/CustomFlow.sol` as the protocol source of truth.
- Keep planners pure and deterministic; no RPC reads in wire helpers.
- Preserve existing downstream action naming except where a missing canonical flow action must be added.
- Avoid unrelated active revnet work in `src/revnet/write.ts` and `tests/revnet.test.ts`.

## Planned Verification

- `pnpm typecheck`
- `pnpm test`
- `pnpm test:coverage`
- `bash scripts/check-agent-docs-drift.sh`
- `bash scripts/doc-gardening.sh --fail-on-issues`

Status: completed
Updated: 2026-03-11
Completed: 2026-03-11
