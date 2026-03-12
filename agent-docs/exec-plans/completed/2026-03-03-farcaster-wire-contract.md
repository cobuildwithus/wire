# Farcaster Wire Contract Surface

## Goal

Add a wire-level Farcaster signup contract module that captures shared constants, typed-data shapes, preflight outcomes, and call-plan builders, so hosted and local executors can reuse one source of truth.

## Scope

- Add `src/farcaster.ts` with pure, deterministic helpers.
- Export Farcaster helpers from `src/index.ts`.
- Add `tests/farcaster.test.ts`.
- Update docs (`README.md`, `ARCHITECTURE.md`, `agent-docs/references/api-contracts.md`).

## Constraints

- Keep package runtime-light and side-effect free.
- No framework/CDP/database runtime logic.
- Contract-only surface (types, constants, validators, builders).

## Done

- Claimed ownership in coordination ledger.
- Added `src/farcaster.ts` with Farcaster signup constants, typed-data builders, preflight evaluator, and call-plan builders.
- Exported Farcaster helpers from `src/index.ts`.
- Added `tests/farcaster.test.ts` with coverage for typed-data, metadata, call plans, and preflight statuses.
- Updated docs: `README.md`, `ARCHITECTURE.md`, and `agent-docs/references/api-contracts.md`.
- Updated `agent-docs/index.md` to include this active execution plan path.
- Split `src/farcaster.ts` into focused modules under `src/farcaster/`:
  - `constants.ts`
  - `types.ts`
  - `normalize.ts`
  - `typed-data.ts`
  - `signup-plan.ts`
- Kept `src/farcaster.ts` as a compatibility barrel that re-exports all module symbols.
- Added wallet-focused wire modules and exports:
  - `src/evm.ts` for EVM private-key/address/network validation + normalization.
  - `src/wallet.ts` for wallet mode and network/token surface contracts.
- Added `src/farcaster/signup-plan.ts` executable-call builders:
  - `encodeFarcasterSignedKeyRequestMetadata`
  - `buildFarcasterSignupExecutableCalls`
- Expanded OAuth/JWT/x402 contract surfaces for hard cutover naming parity and write-capability checks.
- Added/updated tests for wallet contracts, OAuth/JWT parsing, bearer parsing, x402 payloads, and Farcaster planning helpers.
- Ran required checks:
  - `pnpm typecheck`
  - `pnpm test`
  - `pnpm test:coverage`
  - `bash scripts/check-agent-docs-drift.sh`
  - `bash scripts/doc-gardening.sh --fail-on-issues`

## Now

- None.

## Next

- Publish a wire release containing these contracts, then move this plan into `agent-docs/exec-plans/completed/`.
Status: completed
Updated: 2026-03-12
Completed: 2026-03-12
