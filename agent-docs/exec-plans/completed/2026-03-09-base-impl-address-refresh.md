# Base Implementation Address Refresh

## Goal

Refresh `@cobuild/wire` so its canonical Base deployment exports and generated ABI address constants match the newest implementation/config set from `v1-core/deploys/LATEST_IMPLEMENTATIONS.8453.{txt,toml}`.

## Scope

- Update `src/protocol-addresses.ts` implementation/default/config addresses from the latest Base deploy artifacts.
- Regenerate `src/generated/abis.ts` so address constants track the refreshed deployment set while preserving the existing ABI source-selection work.
- Update `tests/protocol-addresses.test.ts` assertions for any changed exported addresses.
- Verify `wire`, then validate downstream consumers against the refreshed local package surface.

## Constraints

- Preserve public export names and module boundaries.
- Do not overwrite unrelated in-flight ABI source-selection changes in `wire`.
- Keep downstream repos on published semver in committed state unless the user explicitly asks for a local-link commit.

## Done

- Added the active coordination-ledger entry for this task.
- Synced `src/protocol-addresses.ts` to the latest Base terminal, implementation, default, and fake UMA resolver addresses from `v1-core/deploys/LATEST_IMPLEMENTATIONS.8453.{txt,toml}`.
- Updated local-artifact ABI generation to preserve chain-keyed address export shapes in `src/generated/abis.ts`.
- Regenerated `src/generated/abis.ts` from sibling `v1-core/out` artifacts.
- Updated `tests/protocol-addresses.test.ts` for the new Base terminal address.
- Verified `wire` with `pnpm typecheck`, `pnpm test`, `pnpm test:coverage`, `bash scripts/check-agent-docs-drift.sh`, `bash scripts/doc-gardening.sh --fail-on-issues`, and `pnpm build`.
- Validated `interface/apps/web` and `indexer` typechecks against a temporary local `@cobuild/wire` link, then restored both repos to their published-package installs.

## Now

- None.

## Next

- Publish/release `@cobuild/wire` only if explicitly requested, then bump committed downstream semver ranges to the released version.
Status: completed
Updated: 2026-03-12
Completed: 2026-03-12
