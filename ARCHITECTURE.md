# @cobuild/wire Architecture

This package provides canonical wire-contract utilities shared between CLI, chat-api, and interface.

## Design constraints

- Pure TypeScript and runtime-light utilities.
- No framework coupling.
- Deterministic, side-effect-free helpers.
- Narrow API surface; additive evolution by semver.

## Module map

- `oauth`: scopes, PKCE, loopback redirect validation, authorize query parsing.
- `jwt`: CLI JWT claim key mapping and parsers.
- `parse-bearer-token`: bearer extraction utility.
- `idempotency`: UUIDv4/idempotency header contract.
- `x402`: typed-data domain/types and xPayment payload encode/decode validation.
- `farcaster`: Farcaster signup constants, typed-data contract helpers, preflight status classifier, and call-plan builders.
