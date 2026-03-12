# 2026-03-12 - Protocol plan batch contract

## Goal

Add a hosted-only shared `protocol-plan` execution contract in `@cobuild/wire` so downstream hosted runtimes can submit a whole validated protocol plan as one smart-account user operation while local wallets keep their existing sequential semantics.

## Scope

- Add a shared `protocol-plan` request type, log-kind builder, builder helper, and validator.
- Reuse the existing protocol action/risk/step validation rules instead of inventing a new plan model.
- Export the new surface from the public `wire` entrypoint.
- Extend contract coverage for canonical success and validation failures.

## Non-Goals

- Changing `ProtocolExecutionPlan` itself.
- Adding plan-level execution-group metadata or hosted/local hints.
- Shipping interface or CLI runtime behavior from this repo.

## Constraints

- Preserve the current `protocol-step` contract and error text where possible.
- Keep validation framework-free and runtime-light.
- Stay within the existing protocol action allowlist used by downstream CLI and interface callers.

## Verification

- `pnpm typecheck`
- `pnpm test`
- `pnpm test:coverage`
- `bash scripts/check-agent-docs-drift.sh`
- `bash scripts/doc-gardening.sh --fail-on-issues`

## Status

- Completed.
- `wire` is the source of truth for the new hosted batch request surface.
  Status: completed
  Updated: 2026-03-12
  Completed: 2026-03-12
