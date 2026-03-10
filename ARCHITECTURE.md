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
- `evm`: strict EVM address/private-key/network validation and normalization helpers.
- `wallet`: wallet mode and network/token constants shared by CLI surfaces.
- `parse-bearer-token`: bearer extraction utility.
- `idempotency`: UUIDv4/idempotency header contract.
- `x402`: typed-data domain/types and xPayment payload encode/decode validation.
- `protocol-goals`: shared GoalFactory deploy-param normalization, goal-create transaction/write-request builders, and `GoalDeployed` receipt decoding helpers.
- `farcaster`: Farcaster signup constants, typed-data contract helpers, preflight status classifier, call-plan builders, and executable-call builders.
