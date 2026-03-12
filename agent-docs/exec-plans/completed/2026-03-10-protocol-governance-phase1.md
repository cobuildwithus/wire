# 2026-03-10 Protocol Governance Phase 1

## Goal

Add shared Base-only `wire` helpers for the governance execution slice so downstream repos can stop hand-rolling TCR listing payloads, approvals, vote commits, and receipt parsing.

## Scope

- Add reusable protocol transaction-plan types for approval-aware execution helpers.
- Add shared TCR planners for budget listings, mechanism listings, and round submissions plus generic request lifecycle actions.
- Add shared arbitrator planners for commit/reveal vote, ruling execution, and reward/slash actions.
- Add shared payload coders and item-id helpers for budget listings, mechanism listings, and round submissions.
- Add receipt/event decoders for the TCR and arbitrator actions in scope.
- Export the new helpers from the package root and document the expanded protocol helper surface.

## Constraints

- Keep the protocol surface Base-only for this phase.
- Keep planners pure and deterministic; no RPC client dependencies in the new helpers.
- Keep onchain read helpers out of scope for now; downstream repos can supply cost, request-type, and allowance context until a narrower read surface is introduced.
- Do not modify the active notification helper work outside explicitly listed files.

## Verification

- `pnpm typecheck`
- `pnpm test`
- `pnpm test:coverage`
- `bash scripts/check-agent-docs-drift.sh`
- `bash scripts/doc-gardening.sh --fail-on-issues`

Status: completed
Updated: 2026-03-12
Completed: 2026-03-12
