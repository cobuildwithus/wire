# ABI Source-Of-Truth Centralization (Completed)

Date: 2026-03-03
Owner: codex-gpt5

## Goal

Move protocol ABI ownership into `wire` so downstream repos consume one canonical source.

## Changes

- Added `wagmi.config.ts` with Basescan fetching and optional `CORE_*` address env wiring.
- Added package scripts:
  - `pnpm wagmi` (`wagmi generate`)
  - `pnpm generate` (`pnpm wagmi && pnpm build`)
- Added `src/protocol-abis.ts`:
  - resolves generated wagmi exports when available
  - falls back to canonical static event ABIs for pre-deploy/unset-address workflows
- Added `src/generated/abis.ts` placeholder so installs/builds succeed before first generate.
- Exported protocol ABI surface from `src/index.ts`.
- Added `tests/protocol-abis.test.ts`.

## Verification

- `pnpm typecheck`
- `pnpm test`
- `pnpm test:coverage`
- `bash scripts/check-agent-docs-drift.sh`
- `bash scripts/doc-gardening.sh --fail-on-issues`

## Notes

- `pnpm generate` requires `BASESCAN_API_KEY`.
- Protocol contract fetches require valid `CORE_*` addresses; missing values are skipped and fallback ABIs remain available.
