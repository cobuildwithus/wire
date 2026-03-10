# 2026-03-10 Protocol Address And Helper Surface

## Goal

Move the remaining shared Base protocol/token addresses and pure indexed-inspect helpers into `wire`, then publish that surface for downstream consumers.

## Scope

- Expand `src/protocol-addresses.ts` with the canonical Base token/protocol address values still duplicated downstream.
- Add a pure indexed-inspect helper module for reusable identifier/state/amount normalization.
- Export the new surface from `src/index.ts`.
- Add focused tests for the new shared addresses and helper behavior.
- Publish a new `@cobuild/wire` version and sync downstream consumers.

## Out Of Scope

- Notification DTO work.
- Farcaster contracts or helper surfaces.
- Any runtime-coupled helper that depends on DB, Fastify, React, or RPC clients.

## Constraints

- `wire` remains the source of truth for canonical shared Base protocol/token addresses.
- Keep app-only defaults local when they are not shared protocol data.
- Preserve the published-package workflow for sibling consumers.

## Verification

- `pnpm typecheck`
- `pnpm test`
- `pnpm test:coverage`
- `bash scripts/check-agent-docs-drift.sh`
- `bash scripts/doc-gardening.sh --fail-on-issues`

## Status

completed
