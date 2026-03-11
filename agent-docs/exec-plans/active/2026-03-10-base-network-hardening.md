# 2026-03-10 Base Network Hardening

## Goal

Remove unsupported Base Sepolia aliasing from shared Base-only helpers so downstream repos stop silently treating testnet configuration as Base mainnet.

## Scope

- Tighten Base-only configured/runtime alias maps.
- Update any directly affected tests and docs.

## Risks and Guards

- Preserve the supported `base` and `base-mainnet` aliases.
- Keep downstream consumer messaging explicit when unsupported values are provided.

## Verification

- `pnpm typecheck`
- `pnpm test`
- `pnpm test:coverage`
- `bash scripts/check-agent-docs-drift.sh`
- `bash scripts/doc-gardening.sh --fail-on-issues`

Status: in_progress
Updated: 2026-03-10
