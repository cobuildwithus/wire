# Scaffold start block export

## Goal

Promote the Base scaffold cutover block to the published `@cobuild/wire` protocol-address surface so downstream consumers can use the same canonical deployment metadata source for addresses, ABIs, and start blocks.

## Constraints

- Keep the exported start block aligned with the current Base factory rollout at `43_290_000`.
- Preserve the existing `protocol-addresses` export shape for downstream consumers while extending `baseConfig` additively.
- Verify the shared export before publishing a new package version.

## Scope

- Add `BASE_SCAFFOLD_START_BLOCK` to `src/protocol-addresses.ts`.
- Mirror the value into `baseConfig.scaffoldStartBlock`.
- Extend `tests/protocol-addresses.test.ts` to cover the new export and config field.
- Publish a patch release so downstream repos can consume the new export from npm.

## Verification

- `pnpm typecheck`
- `pnpm test`
- `pnpm test:coverage`
- `bash scripts/check-agent-docs-drift.sh`
- `bash scripts/doc-gardening.sh --fail-on-issues`
