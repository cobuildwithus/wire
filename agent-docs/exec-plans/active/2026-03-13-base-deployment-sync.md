# Base deployment sync

## Goal

Sync `wire` to the latest Base `v1-core` factory + implementation deployment set, regenerate the shared ABI surface, and prepare the next published package cut so direct workspace consumers can move back to a refreshed published semver.

## Constraints

- Treat `v1-core/deploys/*.8453*` as the deployment source of truth.
- Use local `v1-core/out` artifacts for ABI regeneration when available.
- Keep committed downstream repos on published `@cobuild/wire` versions only.
- Do not run the actual release/publish flow without explicit user approval.

## Scope

- Update copied Base deployment addresses in `src/protocol-addresses.ts`.
- Add newly relevant exported deployment addresses surfaced by the latest factory rollout.
- Regenerate `src/generated/abis.ts` and re-export any new ABI symbols required by the refreshed deployment set.
- Keep `protocol-goals` helpers/tests aligned with the refreshed GoalFactory deploy params and `GoalDeployed` stack shape.
- After a user-approved publish, bump direct workspace consumers to the new released version.

## Verification

- `pnpm typecheck`
- `pnpm test`
- `pnpm test:coverage`
- `bash scripts/check-agent-docs-drift.sh`
- `bash scripts/doc-gardening.sh --fail-on-issues`
