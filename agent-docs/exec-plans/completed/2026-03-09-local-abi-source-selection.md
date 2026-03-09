# Local ABI Source Selection (Completed)

## Goal

Reduce protocol ABI refresh latency after `v1-core` deploys by letting `wire` generate ABIs from sibling Forge artifacts before explorer verification finishes, while preserving a fallback path for standalone `wire` environments.

## Scope

- Update `wagmi.config.ts` so `pnpm wagmi` / `pnpm generate` can source protocol ABIs from `../v1-core/out` when available.
- Preserve current Base-address wiring from `src/protocol-addresses.ts`.
- Keep a Basescan fallback for environments without a sibling `v1-core` checkout.
- Document source-selection behavior and env requirements.

## Constraints

- Preserve existing public ABI export names.
- Avoid requiring explorer verification for local workspace ABI refreshes.
- Keep standalone `wire` release and CI generation viable.

## Done

- Added explicit `WIRE_ABI_SOURCE=local` support in `wagmi.config.ts` while keeping Basescan as the default source of truth.
- Added `pnpm wagmi:local` and `pnpm generate:local` convenience scripts.
- Updated `README.md` and ABI contract docs to document the fast local refresh workflow and the Basescan default.
- Verified `pnpm wagmi:local` works with sibling `v1-core` Forge artifacts.
- Restored the canonical generated ABI output with default `pnpm wagmi`.
- Passed `pnpm typecheck`, `pnpm test`, `pnpm test:coverage`, `bash scripts/check-agent-docs-drift.sh`, and `bash scripts/doc-gardening.sh --fail-on-issues`.

## Now

- None.

## Next

- None.
