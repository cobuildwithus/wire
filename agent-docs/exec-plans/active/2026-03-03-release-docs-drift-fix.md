# Release Docs Drift Fix

## Goal

Unblock release patch verification by adding the required non-generated docs artifact linkage for the recent OAuth/JWT/x402 cutover commit.

## Scope

- Add this active execution plan artifact.
- Update `agent-docs/index.md` to include this active plan path.
- Run required verification commands, including docs drift and doc gardening gates.

## Constraints

- Keep scope docs-only; no runtime contract changes.
- Preserve existing architecture and API contracts unless follow-up documentation is clearly required.

## Done

- Claimed ownership in `agent-docs/exec-plans/active/COORDINATION_LEDGER.md`.
- Added this active execution plan file.

## Now

- Update `agent-docs/index.md` with this plan path.
- Run required checks.

## Next

- If checks pass, land the docs patch and then move this plan to completed when broader Farcaster wire work is finalized.
