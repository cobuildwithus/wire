# 2026-03-10 Protocol Participant Helper Gap Closure

## Goal

Close the remaining `wire` helper gaps for participant-owned protocol writes so the CLI can expose a coherent participant command surface without falling back to opaque raw calldata.

## Scope

- Add shared planners, normalizers, and receipt helpers for the participant actions not yet covered by the current phase-one helper set:
  - Goal donation and budget donation through treasury donation paths.
  - Stake-vault juror lifecycle: opt in, request exit, finalize exit, and delegate updates.
  - Round prize vault claim and permissionless downgrade helpers.
  - Flow allocation / maintenance helpers for `allocate`, `syncAllocationForAccount`, and `clearStaleAllocation`.
- Export these helpers from the package root and document the expanded participant helper surface.
- Reuse the existing `ProtocolExecutionPlan` model wherever possible so downstream execution stays uniform.

## Out Of Scope

- Goal / budget lifecycle maintenance (`sync`, `activateRegisteredBudget`, `finalizeRemovedBudget`, `retryRemovedBudgetResolution`, `pruneTerminalBudget`).
- Allocation-mechanism activation / funding release.
- Slashing, `burnOnGoalFailure`, `retryForwarding`, or `repairChildSyncDebt`.
- Community-root routing and `CobuildPaymentTerminal` first-class wrappers.
- Admin / controller / resolver-only selectors.

## Constraints

- Keep the protocol surface Base-only for this phase.
- Keep new helpers deterministic and planner-oriented; no embedded RPC clients.
- Reuse existing plan-step and serialization helpers instead of creating action-specific execution contracts.
- Preserve the current position that low-level admin and keeper flows remain outside the normal participant surface.

## Parallelization Boundary

- This plan owns new participant write helpers and receipt serializers.
- It should not own onchain preflight readers; those belong to the participant preflights plan.
- It can run in parallel with the preflight plan as long as shared types stay additive.

## Work Breakdown

1. Add treasury donation planners and normalized input contracts.
2. Add juror lifecycle planners and any required receipt/event helpers.
3. Add round prize vault claim / downgrade planners and receipt helpers.
4. Add flow allocation and maintenance planners with stable input validation.
5. Export the new helpers and lock behavior with focused tests and docs.

## Success Criteria

- Every participant command family in the planned CLI surface has a `wire` helper path for payload building.
- Approval-aware and multi-step participant actions still fit the shared protocol plan model.
- Downstream repos no longer need to encode participant action calldata by hand.

## Verification

- `pnpm typecheck`
- `pnpm test`
- `pnpm test:coverage`
- `bash scripts/check-agent-docs-drift.sh`
- `bash scripts/doc-gardening.sh --fail-on-issues`

Status: in_progress
Updated: 2026-03-10
