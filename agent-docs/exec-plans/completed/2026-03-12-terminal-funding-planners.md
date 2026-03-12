# 2026-03-12 Terminal Funding Planners

## Goal

Add shared `wire` planner helpers for the missing goal/community funding-terminal write actions so CLI wallet tools can use canonical builders instead of hand-encoding calldata.

## Scope

- Widen the shared protocol-plan transaction contract to support payable terminal actions without regressing current zero-value helpers.
- Add focused planners and optional receipt helpers for:
  - `CobuildGoalTerminal.pay`
  - `CobuildCommunityTerminal.pay`
  - `CobuildCommunityTerminal.addToBalanceOf`
- Export the new helpers from the package root.
- Lock the new behavior with focused unit tests.

## Out Of Scope

- Any Solidity changes in `v1-core`.
- Hosted protocol-step validation changes.
- New RPC-backed preflight readers for terminal commands.

## Constraints

- Keep the shared planner surface deterministic and Base-only.
- Preserve existing plan shapes and idempotency inputs for current commands.
- Treat the community routing metadata envelope as the canonical `abi.encode(goalIds, weights, jbMetadata)` shape.

## Parallelization Boundary

- Parent scope owns shared transaction/value contract changes plus root exports.
- Child worker scopes own exactly one terminal function each in isolated new planner/test files.

## Planned Verification

- `pnpm typecheck`
- `pnpm test`
- `pnpm test:coverage`
- `bash scripts/check-agent-docs-drift.sh`
- `bash scripts/doc-gardening.sh --fail-on-issues`

## Outcome

- Added shared planners for `goal.pay`, `community.pay`, and `community.add-to-balance`.
- Kept terminal funding Base-only and exported the helpers from the package root.
- Added focused planner coverage for native-value flows, ERC-20 approval flows, metadata encoding, and validation errors.

## Verification

- `pnpm build`
- `pnpm typecheck`
- `pnpm test`
- `pnpm test:coverage`
- `pnpm docs:drift`
- `pnpm docs:gardening`

Status: completed
Updated: 2026-03-12
Completed: 2026-03-12
