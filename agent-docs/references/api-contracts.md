# API Contracts

- OAuth scopes and PKCE rules
- Redirect URI loopback policy
- JWT claim key mapping (`agent_key` <-> `agentKey`)
- Idempotency header and UUID schema
- x402 payload schema and invariants
- Protocol address exports and aliases:
  - canonical Base deployment sets (`baseEntrypoints`, `baseImplementations`, `baseDefaults`, `baseConfig`)
  - convenience aliases for token/revnet/swap fields in camelCase and constant-case forms (`cobuildTokenAddress`, `cobuildSwapAddress`, `COBUILD_TOKEN`, `COBUILD_REVNET_ID`, `COBUILD_SWAP`, `COBUILD_SWAP_IMPL`)
- Protocol ABI exports:
  - `pnpm wagmi` / `pnpm generate` fetch protocol ABIs from Basescan via Wagmi `etherscan` plugin (`chainId=8453`) and require `BASESCAN_API_KEY` (fallback `ETHERSCAN_API_KEY`).
  - `CobuildSwapImpl` ABI is sourced from Basescan (not an empty placeholder ABI), and `cobuildSwapImplAddress` is pinned to `0x21a580054e7a5e833f38033f2d958e00e4c50f0f`
- Farcaster signup wire contracts:
  - canonical contract addresses and ABIs (IdGateway, KeyGateway, IdRegistry)
  - SignedKeyRequest typed-data domain/types/message builders
  - deterministic signup preflight status classification (`already_registered`, `needs_funding`, `ready`)
  - hosted/local shared signup call-plan intent shapes
