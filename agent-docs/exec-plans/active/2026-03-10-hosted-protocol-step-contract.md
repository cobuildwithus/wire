# 2026-03-10 Hosted Protocol Step Contract

## Goal

Define a shared hosted protocol execution contract in `wire` so protocol writes keep semantic intent through hosted execution instead of collapsing to generic raw tx envelopes.

## Scope

- Add a canonical hosted `protocol-step` request surface and validator.
- Validate protocol-step transaction semantics against supported protocol contracts/functions.
- Add a goal-create protocol plan helper so `goal create` can use the same hosted protocol path.
- Update public exports and wire tests.

## Constraints

- Keep the existing generic `tx` helper surface as an explicit escape hatch.
- Preserve current protocol-plan step shapes for downstream consumers.
- Do not require a consumer-specific runtime dependency from `wire`.

## Planned Verification

- `pnpm build`
- `pnpm typecheck`
- `pnpm test`
- `pnpm test:coverage`

## Status

- Completed on 2026-03-10.
- Added the shared `protocol-step` execution contract and semantic validator.
- Added a shared `goal.create` protocol-plan builder for hosted execution.
- Verification passed: `pnpm build`, `pnpm typecheck`, `pnpm test`, `pnpm test:coverage`, `bash scripts/check-agent-docs-drift.sh`, `bash scripts/doc-gardening.sh --fail-on-issues`.
