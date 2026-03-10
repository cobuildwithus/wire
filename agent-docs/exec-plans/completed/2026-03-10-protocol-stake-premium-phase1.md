# 2026-03-10 Protocol Stake Premium Phase 1

## Goal

Add shared Base-only `wire` helpers for the first stake/premium execution slice so downstream repos can stop hand-rolling calldata, approval logic, and receipt parsing.

## Scope

- Add reusable protocol transaction-plan types for approval-aware execution helpers.
- Add shared stake-vault planners for goal/cobuild deposit, underwriter withdrawal preparation, and goal/cobuild withdrawal.
- Add shared premium-escrow planners for checkpoint and claim.
- Add receipt/event decoders for the stake-vault and premium-escrow actions in scope.
- Export the new helpers from the package root and document the expanded protocol helper surface.

## Constraints

- Keep the protocol surface Base-only for this phase.
- Keep planners pure and deterministic; no RPC client dependencies in the new helpers.
- Keep onchain read helpers out of scope for now; downstream repos can supply allowance/token context until a narrower read surface is introduced.
- Do not modify the active notification helper work outside explicitly listed files.

## Verification

- `pnpm typecheck`
- `pnpm test`
- `pnpm test:coverage`
- `bash scripts/check-agent-docs-drift.sh`
- `bash scripts/doc-gardening.sh --fail-on-issues`

Status: completed
Updated: 2026-03-10
Completed: 2026-03-10
