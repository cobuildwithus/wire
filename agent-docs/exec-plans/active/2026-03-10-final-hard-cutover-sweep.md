# 2026-03-10 Final Hard Cutover Sweep

## Goal

Remove the last compatibility-only shared-surface exports in `wire` so downstream repos depend on the canonical address tables and notification/tool contracts only.

## Scope

- `src/protocol-addresses.ts`
- `tests/protocol-addresses.test.ts`
- matching `agent-docs/**`

## Constraints

- Do not add replacement aliases.
- Preserve the canonical camelCase/shared-table exports already consumed downstream.
- No release or publish work in this sweep.

## Verification

- `pnpm typecheck`
- `pnpm test`
- `pnpm test:coverage`
- `bash scripts/check-agent-docs-drift.sh`
- `bash scripts/doc-gardening.sh --fail-on-issues`

## Status

completed
