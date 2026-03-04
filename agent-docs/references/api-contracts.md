# API Contracts

- OAuth scopes and PKCE rules
- Redirect URI loopback policy
- JWT claim key mapping (`agent_key` <-> `agentKey`)
- Idempotency header and UUID schema
- x402 payload schema and invariants
- Protocol address exports and aliases:
  - canonical Base deployment sets (`baseEntrypoints`, `baseImplementations`, `baseDefaults`, `baseConfig`)
  - convenience aliases for token/revnet/swap fields in camelCase, snake_case, and constant-case forms (`cobuildTokenAddress`, `cobuildSwapAddress`, `cobuild_token`, `cobuild_revnet_id`, `cobuild_swap`, `cobuild_swap_impl`, `COBUILD_TOKEN`, `COBUILD_REVNET_ID`, `COBUILD_SWAP`, `COBUILD_SWAP_IMPL`)
- Farcaster signup wire contracts:
  - canonical contract addresses and ABIs (IdGateway, KeyGateway, IdRegistry)
  - SignedKeyRequest typed-data domain/types/message builders
  - deterministic signup preflight status classification (`already_registered`, `needs_funding`, `ready`)
  - hosted/local shared signup call-plan intent shapes
