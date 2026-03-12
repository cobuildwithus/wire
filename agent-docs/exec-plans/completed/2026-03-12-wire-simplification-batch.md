# 2026-03-12 Wire Simplification Batch

## Goal

Address the current TypeScript-library simplification audit in `wire` by consolidating duplicated parser and receipt helpers, removing double-normalization paths, and reducing high-drift switch duplication without changing exported behavior.

## Scope

- Add shared internal parsing primitives for JSON/object validation and known-key enforcement.
- Add shared protocol receipt/event decode helpers used by flow/stake/premium/prize-vault/treasury/governance modules.
- Remove duplicate normalization work in goal-create and community-terminal planners.
- Reduce duplicated action/risk registry maintenance in `cli-protocol-exec`.
- Simplify notification helper duplication and participant-preflight normalization where the change is behavior-preserving.
- Keep public compatibility fields/aliases unless removal is clearly internal-only.
- Follow up on the payable protocol-plan validation bug so `valueEth` survives validation when payable steps are explicitly allowed.
- Finish the remaining receipt-decoder consolidation in `protocol-flow`.
- Collapse the largest remaining parallel notification reason routing/copy switch sets into shared descriptor data without changing supported reason spellings.
- Fold the TCR preflight shared registry/deposit-cost context and remaining internal aliases/derived fields into single-source helpers.

## Constraints

- Do not touch the in-progress budget-maintenance files owned by the separate active ledger entry unless they become explicitly unblocked.
- Preserve current public exports and runtime semantics unless a duplicate is provably dead/internal-only.
- Respect the dirty worktree; integrate with existing changes instead of reverting them.

## Verification

- `pnpm typecheck`
- `pnpm test`
- `pnpm test:coverage`
- `bash scripts/check-agent-docs-drift.sh`
- `bash scripts/doc-gardening.sh --fail-on-issues`

## Outcome

- Fixed the hosted payable-plan validation path so explicitly allowed `valueEth` survives request validation.
- Centralized remaining protocol receipt decoding in shared helpers and moved `protocol-flow` onto them.
- Reduced notification drift with shared descriptor maps and covered the new descriptor-backed paths.
- Consolidated terminal funding planners, TCR preflight context reads, and the remaining internal compatibility-only aliases.

Status: completed
Updated: 2026-03-12
Completed: 2026-03-12
