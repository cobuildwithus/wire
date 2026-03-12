# 2026-03-10 Protocol Participant Preflights

## Goal

Add a narrow Base-only onchain preflight/read layer in `wire` so participant write commands can validate live eligibility, costs, and allowance context before building or executing protocol actions.

## Scope

- Add viem-client-injected read helpers for the participant action families that need fresh state:
  - TCR request phase, challenge window, timeout window, and deposit token/cost snapshots.
  - Arbitrator dispute phase, current round, voting/reveal timing, and voter receipt context.
  - Stake vault position, withdrawal-prepared state, juror delegation/exit readiness, and token/allowance hints.
  - Premium escrow claimability / checkpoint context.
  - Round prize entitlement / claimed state context.
  - Goal and budget donation readiness / token target context.
  - Flow allocation preview, existing commitment context, and child-sync requirement preview for allocator actions.
- Define stable preflight result shapes that downstream CLI commands can consume without re-deriving contract semantics.
- Add small eligibility helpers that turn raw onchain state into action labels such as `canChallenge`, `canReveal`, `canClaim`, `requiresApproval`, or `withdrawalBlocked`.

## Out Of Scope

- Full inspect SDK replacement for indexed reads.
- Executor/runtime logic in `cli`.
- Operator / keeper maintenance preflights for budget activation, sync, prune, removal finalization, mechanism funding release, or child-sync debt repair.
- Chat API wrappers or REST tool exposure.

## Constraints

- Keep the protocol surface Base-only for this phase.
- Keep helpers client-injected and side-effect-free; no internal client construction.
- Favor fresh onchain truth over indexed approximations for write gating.
- Keep returned shapes narrow and action-oriented rather than building a generic multicall snapshot framework.
- Avoid overlapping the existing governance / stake / premium planner modules except for additive exports and shared types.

## Parallelization Boundary

- This plan owns new read/preflight modules and tests.
- It should avoid modifying the existing write-planner modules except where an additive shared type/export is required.
- It can run in parallel with the participant helper gap-closure plan and the CLI plan-runner plan.

## Work Breakdown

1. Add shared protocol preflight module boundaries and public exports.
2. Implement TCR/arbitrator preflights needed for submit/challenge/execute/vote flows.
3. Implement stake, premium, prize-vault, and donation preflights needed for participant fund/stake/claim flows.
4. Implement flow allocation preflights needed for allocator commands, including child-sync preview wiring.
5. Add serializer helpers and tests that lock the returned shape and eligibility semantics.

## Success Criteria

- CLI can ask `wire` for fresh onchain participant-write preflights without hitting Chat API or re-encoding protocol rules.
- Preflights cover every participant command family planned for the CLI participant surface.
- Returned shapes are stable enough for machine-readable CLI output and dry-run presentation.

## Verification

- `pnpm typecheck`
- `pnpm test`
- `pnpm test:coverage`
- `bash scripts/check-agent-docs-drift.sh`
- `bash scripts/doc-gardening.sh --fail-on-issues`

Status: completed
Updated: 2026-03-12
Completed: 2026-03-12
