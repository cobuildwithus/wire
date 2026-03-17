# Base deployment sync

## Goal

Sync `wire` to the latest Base `v1-core` factory + implementation deployment set, regenerate the shared ABI surface, publish the refreshed `@cobuild/wire` package, and move direct workspace consumers onto that published semver.

## Constraints

- Treat `v1-core/deploys/*.8453*` as the deployment source of truth.
- Use local `v1-core/out` artifacts for ABI regeneration when available.
- Keep committed downstream repos on published `@cobuild/wire` versions only.
- Release/publish flow is explicitly approved in the current chat turn.

## Scope

- Update copied Base deployment addresses in `src/protocol-addresses.ts`.
- Add newly relevant exported deployment addresses surfaced by the latest factory rollout.
- Regenerate `src/generated/abis.ts` and re-export any new ABI symbols required by the refreshed deployment set.
- Keep `protocol-goals` helpers/tests aligned with the refreshed GoalFactory deploy params and `GoalDeployed` stack shape.
- Publish the refreshed package after verification.
- Bump direct workspace consumers to the new released version.

## Verification

- `pnpm typecheck`
- `pnpm test`
- `pnpm test:coverage`
- `bash scripts/check-agent-docs-drift.sh`
- `bash scripts/doc-gardening.sh --fail-on-issues`

## Current Turn

- Refresh `src/protocol-addresses.ts` from `v1-core/deploys/DeployGoalFactory.8453.txt` and `v1-core/deploys/LATEST_IMPLEMENTATIONS.8453.{txt,toml}` generated on 2026-03-17.
- Regenerate `src/generated/abis.ts` from sibling `v1-core/out` using `pnpm generate:local`.
- Publish the resulting patch release and normalize direct consumers (`indexer`, `interface`, and any other direct `@cobuild/wire` workspace consumers) onto that published version, then rerun their typechecks.
- Verification before release prep passed on 2026-03-17 via `pnpm typecheck`, `pnpm test`, `pnpm test:coverage`, `bash scripts/check-agent-docs-drift.sh`, and `bash scripts/doc-gardening.sh --fail-on-issues`.
- `pnpm release:dry-run` confirmed the release helper requires a clean git tree before cutting the patch.
