# 2026-03-11 - Cobuild project centralization

## Goal

Expose one canonical COBUILD project identifier from `@cobuild/wire` so downstream repos stop pinning their own Base revnet/project IDs.

## Scope

- Add exported COBUILD project constants to `src/protocol-addresses.ts`.
- Keep the canonical COBUILD token address on the shared wire address surface.
- Cover the new shared constants with wire tests.

## Constraints

- Preserve the existing published `cobuildRevnetId` config field while adding the explicit `cobuildProjectId`/exported constants used by downstream repos.
- Keep the token address aligned with the deployed Base entrypoint address.

## Verification

- `pnpm typecheck`
- `pnpm test`
- `pnpm test:coverage`
- `bash scripts/check-agent-docs-drift.sh`
- `bash scripts/doc-gardening.sh --fail-on-issues`

## Status

- Implemented and locally verified on 2026-03-11.
- Pending patch release publication and downstream consumer normalization back to the published semver.
Status: completed
Updated: 2026-03-12
Completed: 2026-03-12
