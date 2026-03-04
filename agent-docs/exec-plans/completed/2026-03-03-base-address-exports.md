# Base Address Exports (Completed)

Date: 2026-03-03
Owner: codex-gpt5

## Goal

Export canonical Base V1 core contract addresses from `wire` so downstream repos have one typed entrypoint.

## Changes

- Added `src/protocol-addresses.ts` with Base-only exports:
  - entrypoints (GoalFactory, BudgetTCRFactory, Cobuild token, REV deployer, Superfluid host)
  - implementation addresses (goal treasury, flow, split hook, budget TCR stack implementations)
  - deployment defaults/config constants
  - convenience aliases (`goalFactoryAddress`, `budgetTcrFactoryAddress`, `cobuildTokenAddress`)
- Exported address module via `src/index.ts`.
- Added `tests/protocol-addresses.test.ts`.

## Source of Truth

- `v1-core/deploys/LATEST_IMPLEMENTATIONS.txt` (Base chain, `8453`).

## Verification

- `pnpm typecheck`
- `pnpm test`
- `pnpm test:coverage`
- `bash scripts/check-agent-docs-drift.sh`
- `bash scripts/doc-gardening.sh --fail-on-issues`
