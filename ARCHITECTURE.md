# @cobuild/wire Architecture

This package provides canonical wire-contract utilities shared between CLI, chat-api, and interface.

## Design constraints

- Pure TypeScript and runtime-light utilities.
- No framework coupling.
- Deterministic, side-effect-free helpers.
- Narrow API surface; additive evolution by semver.

## Module map

- `oauth`: scopes, PKCE, loopback redirect validation, authorize query parsing.
- `jwt`: CLI JWT claim key mapping/parsers and scope capability derivation.
- `cli-bearer-auth`: shared bearer-auth verification flow with injected JWT verification and live-session lookup hooks.
- `evm`: strict EVM address/private-key/network validation and normalization helpers.
- `wallet`: wallet mode and network/token constants shared by CLI surfaces.
- `parse-bearer-token`: bearer extraction utility.
- `idempotency`: UUIDv4/idempotency header contract.
- `x402`: typed-data domain/types and xPayment payload encode/decode validation.
- `cli-protocol-exec`: canonical hosted `protocol-step` request builders/validators and protocol-step log-kind helpers for server-side policy enforcement.
- `protocol-goals`: shared GoalFactory deploy-param normalization, goal-create transaction/write-request builders, hosted goal-create protocol-plan helpers, and `GoalDeployed` receipt decoding helpers.
- `protocol-governance`: Base-only TCR/arbitrator payload coders, execution planners, commit-hash helpers, and governance receipt decoders.
- `protocol-stake`: Base-only stake-vault deposit/withdraw/juror planners and stake-vault receipt decoders.
- `protocol-premium`: Base-only premium-escrow checkpoint/claim planners and receipt decoders.
- `protocol-treasury`: Base-only goal/budget treasury donation planners and donation receipt helpers.
- `protocol-prize-vault`: Base-only round prize-vault claim/downgrade planners and receipt decoders.
- `protocol-flow`: Base-only flow allocation/maintenance planners, structural allocation normalizers, and allocation receipt helpers.
- `protocol-notifications`: shared wallet notification DTOs, protocol payload normalization, route-state/app-path builders, and shared presenter copy for protocol lifecycle notifications.
- `revnet`: Base revnet config, JB/REV contract ABIs, issuance math/transforms, read helpers, and write-intent builders shared by interface, chat-api, and CLI adapters.
- `farcaster`: Farcaster signup constants, typed-data contract helpers, preflight status classifier, call-plan builders, executable-call builders, and canonical hosted/signup response builders and validators.
