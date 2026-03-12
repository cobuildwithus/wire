# Identity Address Normalization

## Goal

Centralize nullable EVM address parsing, address equality, Base-only CLI/web network canonicalization, and verified CLI JWT principal derivation in `wire`.

## Success Criteria

- `wire` exports the shared helpers needed by downstream consumers.
- Shared tests lock exact address/network/principal behavior.
- Downstream repos can delete repo-local normalization logic instead of preserving compatibility shims.

## Scope

- `src/evm.ts`
- `src/jwt.ts`
- `src/index.ts`
- matching `tests/**`

## Out Of Scope

- Farcaster signup or x402 payload contract changes.
- Protocol address/ABI/runtime changes unrelated to normalization.

## Risks / Constraints

- Keep Base-only semantics: `base` and `base-mainnet` canonicalize to `base`; `base-sepolia` stays unsupported for Base-only flows.
- Preserve lowercase address storage/output contracts.
- Avoid introducing a second principal-shaping contract in downstream repos.

## Verification

- `pnpm typecheck`
- `pnpm test`
- `pnpm test:coverage`
- `bash scripts/check-agent-docs-drift.sh`
- `bash scripts/doc-gardening.sh --fail-on-issues`

## Current Status

- Shared helpers and focused tests are in place.
- `pnpm typecheck` / `pnpm build` are currently blocked by pre-existing `src/farcaster/contracts.ts` errors and missing Farcaster export coverage unrelated to this normalization slice.
- Focused verification passed for `tests/evm.test.ts`, `tests/base-network.test.ts`, `tests/jwt.test.ts`, and `tests/wallet.test.ts`.

## Tasks

1. Extend shared address helpers with nullable parse and equality.
2. Add shared Base-only network canonicalization/explorer helpers.
3. Add verified CLI claim -> normalized principal derivation helpers.
4. Update tests and exports for downstream cutover.
Status: completed
Updated: 2026-03-12
Completed: 2026-03-12
