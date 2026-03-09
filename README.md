# @cobuild/wire

Shared wire-level contracts for Cobuild clients/services.

## Scope

- OAuth constants + scope/PKCE/redirect validation helpers
- JWT claim parsing helpers for CLI access token payloads
- EVM/wallet validation helpers for network/token/mode contracts
- Bearer token parsing
- Idempotency key/header contract
- x402 payload/domain/type builders + payload validation
- Farcaster signup wire contracts (typed-data, preflight, call-plan + executable-call builders)

## Non-goals

- Signing runtime (wallet/CDP implementations)
- DB adapters or framework/server bindings
- UI components

## Quick start

```bash
pnpm install
pnpm typecheck
pnpm test
```

## Protocol ABI generation

`pnpm wagmi` and `pnpm generate` keep Basescan as the default ABI source of truth. For fast post-deploy refreshes inside this workspace, use the local-artifact mode instead.

- `pnpm generate:local` (or `WIRE_ABI_SOURCE=local pnpm wagmi`) uses sibling `v1-core/out` artifacts so ABI refreshes do not wait on explorer verification.
- Default mode is Basescan; `WIRE_ABI_SOURCE=basescan` forces the same behavior explicitly.
- `WIRE_ABI_SOURCE=local` requires sibling Forge artifacts and fails fast if they are missing.
- `BASESCAN_API_KEY` (fallback `ETHERSCAN_API_KEY`) is required for default Basescan generation.
- `WIRE_V1_CORE_PATH` can override the default sibling `v1-core` repo location when needed.

## Consumer workflow

Committed downstream state should use the published `@cobuild/wire` package, not a sibling `link:` or `file:` dependency.

- Current direct consumers in this workspace: `cli`, `chat-api`, `indexer`, and `interface/apps/web`.
- `cli`, `chat-api`, and `interface/apps/web` expose temporary local integration helpers (`wire:use-local` / `wire:use-published`) for testing unpublished `wire` changes against a sibling checkout.
- `cli`, `chat-api`, `interface`, and `indexer` all run `wire:ensure-published` from pre-commit so local link/file specs do not land in commits by accident.

After publishing a new `@cobuild/wire` version, bump only the sibling repos that consume the changed surface:

- ABI/address/event changes usually require `indexer` first, then any user-facing consumers.
- Auth, wallet, x402, or Farcaster helper changes usually require `chat-api`, `cli`, and/or `interface/apps/web`.
- Use each consumer repo's local published-version helper where present; otherwise update the dependency semver directly and refresh the lockfile.

`wire` now exposes a manual sibling sync helper:

```bash
pnpm run sync:repos -- --version 0.1.5 --wait-for-publish
```

The wrapper delegates to the shared `cobuild-sync-dependent-repos` helper from `@cobuild/repo-tools`. Before the next published repo-tools bump lands here, it falls back to the sibling `repo-tools` checkout in this workspace if the installed bin is not present yet.

Release runs can invoke the same flow automatically after push. Use `--no-sync-upstreams` or `WIRE_SKIP_UPSTREAM_SYNC=1` when you need to prepare a release tag without bumping sibling repos yet.
