# ABI Etherscan Docs Drift Fix

## Goal

Restore docs drift-gate compliance for commit `ff248bd` by recording the ABI generation source-of-truth change and required execution-plan linkage.

## Scope

- Add this active execution plan artifact.
- Update `agent-docs/index.md` with this plan path and a recent update entry.
- Update `agent-docs/references/api-contracts.md` with current ABI generation contract details.
- Run required verification commands.

## Constraints

- Keep scope docs/process only; do not modify runtime exports or ABI generation code.
- Preserve existing architecture and API compatibility statements outside this remediation.

## Done

- Claimed ownership in `agent-docs/exec-plans/active/COORDINATION_LEDGER.md`.
- Updated `agent-docs/index.md` and `agent-docs/references/api-contracts.md` to document the Wagmi Etherscan ABI fetch workflow and env requirements.
- Ran required checks successfully: `pnpm typecheck`, `pnpm test`, `pnpm test:coverage`, `bash scripts/check-agent-docs-drift.sh`, `bash scripts/doc-gardening.sh --fail-on-issues`.
- Closed coordination-ledger ownership entry.

## Now

- Awaiting review/commit.

## Next

- Optionally move this plan to `agent-docs/exec-plans/completed/` after the branch is finalized.
Status: completed
Updated: 2026-03-12
Completed: 2026-03-12
