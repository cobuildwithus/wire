# 2026-03-10 Base Network Alias Remediation

## Goal

Remove unsupported `base-sepolia` aliasing from the shared Base-only network helpers so downstream repos fail closed instead of silently targeting Base mainnet.

## Scope

- Delete configured-network alias support for `base-sepolia`.
- Update shared tests/docs that still mention the alias.

## Constraints

- Keep the Base mainnet aliases (`base`, `base-mainnet`) intact.
- Coordinate downstream consumer updates in `interface` and `cli` in the same workstream.

## Verification

- `pnpm typecheck`
- `pnpm test`
- `pnpm test:coverage`
- `bash scripts/check-agent-docs-drift.sh`
- `bash scripts/doc-gardening.sh --fail-on-issues`

Status: completed
Updated: 2026-03-12
Completed: 2026-03-12
