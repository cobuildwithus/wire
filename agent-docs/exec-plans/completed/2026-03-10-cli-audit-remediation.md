# 2026-03-10 CLI Audit Remediation

## Goal

Remove the `base-sepolia` alias from Base-only configured-network helpers so downstream repos fail closed instead of silently rewriting unsupported networks to Base mainnet.

## Scope

- `src/base-network.ts`
- Matching tests and docs that describe Base-only parsing

## Risks and Guards

- Runtime and configured-network parsing must remain aligned after the alias removal.
- Downstream repos should receive explicit unsupported-network errors rather than implicit rewrites.

## Verification

- `pnpm typecheck`
- `pnpm test`
- `pnpm test:coverage`
- `bash scripts/check-agent-docs-drift.sh`
- `bash scripts/doc-gardening.sh --fail-on-issues`

## Status

In progress.
Status: completed
Updated: 2026-03-12
Completed: 2026-03-12
