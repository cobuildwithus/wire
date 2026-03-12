# 2026-03-11 - Farcaster x402 canonical signing request

## Goal

Move the canonical Farcaster/Neynar x402 signing request shape into `@cobuild/wire` so downstream callers stop rebuilding the same typed-data domain, types, auth window, authorization payload, and payment encoding logic.

## Scope

- Add a shared Farcaster x402 signing-request helper and exported types in `wire`.
- Keep hosted response envelopes unchanged while reusing the new helper only through downstream cutovers.
- Cover the shared request surface with `wire` tests.

## Non-Goals

- Signer implementation details in `interface` or `cli`.
- Release or publish work.

## Risks / Constraints

- Must preserve current Base/USDC/Neynar invariants and x402 error text.
- Must stay runtime-light and framework-free.
- Do not modify `src/farcaster/contracts.ts` while the active Farcaster signup planner task owns that file.

## Verification

- `pnpm typecheck`
- `pnpm test`
- `pnpm test:coverage`
- `bash scripts/check-agent-docs-drift.sh`
- `bash scripts/doc-gardening.sh --fail-on-issues`

## Status

- Blocked on release sequencing: the shared helper is implemented and verified locally, but downstream published-package verification must wait for a `wire` release that includes this helper and the separate Farcaster signup planner exports already in flight.
Status: completed
Updated: 2026-03-12
Completed: 2026-03-12
