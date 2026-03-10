# 2026-03-10 Shared CLI Bearer Verifier

## Goal

Add a pure shared CLI bearer-auth verifier to `wire` so downstream repos can share bearer parsing, JWT/principal validation, live-session scope matching, and required-scope enforcement without moving DB access into the package.

## Scope

- Add a reusable bearer verifier helper to `src/`.
- Reuse shared JWT verification logic in `src/jwt.ts`.
- Export the new helper from `src/index.ts`.
- Add focused unit coverage for bearer parsing, invalid token/session failures, scope mismatch rejection, and required-scope enforcement.

## Out Of Scope

- Any DB client, Fastify, Next.js, or Prisma bindings.
- OAuth route behavior changes.
- Token minting or refresh-token storage changes.

## Constraints

- Keep `wire` runtime-pure aside from generic JWT verification helpers.
- Live session checks must remain dependency-injected by consumers.
- Preserve current CLI JWT issuer/audience defaults and principal shape.

## Verification

- `pnpm typecheck`
- `pnpm test`
- `pnpm test:coverage`
- `bash scripts/check-agent-docs-drift.sh`
- `bash scripts/doc-gardening.sh --fail-on-issues`

## Status

In progress.
Status: completed
Updated: 2026-03-10
Completed: 2026-03-10
