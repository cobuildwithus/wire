# 2026-03-10 - Farcaster hosted/signup contract hard cutover

## Goal

Extend `@cobuild/wire` so hosted Farcaster x402 responses, Farcaster signup result unions, and already-registered/funding-required helpers live in one shared contract surface that `interface` and `cli` consume without compatibility shims.

## Scope

- Add shared Farcaster signup result/error types, builders, and validators.
- Add shared hosted Farcaster x402 response types and validators.
- Export the new surface from the public `wire` entrypoints.
- Update contract docs/tests for the new shared surface.

## Non-Goals

- JWT or generic address-normalization contract work from other cutover plans.
- Runtime signing implementations in `interface` or `cli`.
- Publishing or release automation.

## Risks / Constraints

- Must stay runtime-light and framework-free.
- Must preserve the existing canonical Farcaster and x402 constants.
- Downstream repos depend on these helpers immediately, so validators need stable error text and narrow shapes.

## Verification

- `pnpm typecheck`
- `pnpm test`
- `pnpm test:coverage`
- `bash scripts/check-agent-docs-drift.sh`
- `bash scripts/doc-gardening.sh --fail-on-issues`

## Status

- Implemented shared Farcaster signup result/error contracts plus hosted x402 response builders/validators in `wire`.
- Exported the new surface from the public `wire` entrypoints and updated Farcaster contract docs.
- Verification status:
  - `pnpm build` passed.
  - `pnpm typecheck` passed.
  - `pnpm test` passed.
  - `pnpm test:coverage` passed.
  - `bash scripts/check-agent-docs-drift.sh` passed.
  - `bash scripts/doc-gardening.sh --fail-on-issues` passed.
