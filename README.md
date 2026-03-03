# @cobuild/wire

Shared wire-level contracts for Cobuild clients/services.

## Scope

- OAuth constants + scope/PKCE/redirect validation helpers
- JWT claim parsing helpers for CLI access token payloads
- Bearer token parsing
- Idempotency key/header contract
- x402 payload/domain/type builders + payload validation
- Farcaster signup wire contracts (typed-data, preflight, call-plan builders)

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
