# API Contracts

- OAuth scopes and PKCE rules
- Redirect URI loopback policy
- JWT claim key mapping (`agent_key` <-> `agentKey`)
- Idempotency header and UUID schema
- x402 payload schema and invariants
- Farcaster signup wire contracts:
  - canonical contract addresses and ABIs (IdGateway, KeyGateway, IdRegistry)
  - SignedKeyRequest typed-data domain/types/message builders
  - deterministic signup preflight status classification (`already_registered`, `needs_funding`, `ready`)
  - hosted/local shared signup call-plan intent shapes
