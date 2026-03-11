# @cobuild/wire Agent Docs Index

Last verified: 2026-03-11 (Farcaster x402 signing-request cutover)

## Purpose

Canonical map for docs used by agents working in this repository.

## Canonical Docs

| Path | Purpose |
| --- | --- |
| `ARCHITECTURE.md` | High-level module boundaries and design constraints. |
| `agent-docs/PLANS.md` | Planning expectations for multi-step work. |
| `agent-docs/PRODUCT_SENSE.md` | Product-level expectations for contract boundaries. |
| `agent-docs/QUALITY_SCORE.md` | Quality rubric reference for reviews. |
| `agent-docs/RELIABILITY.md` | Reliability invariants for wire contracts. |
| `agent-docs/SECURITY.md` | Security invariants for auth/wallet wire formats. |
| `agent-docs/product-specs/index.md` | Product-spec index. |
| `agent-docs/product-specs/chat-api-behavior.md` | Compatibility notes for existing consumer naming. |
| `agent-docs/references/README.md` | References map. |
| `agent-docs/references/api-contracts.md` | API-level contract definitions and compatibility notes. |
| `agent-docs/references/data-infra-map.md` | Data/infra touchpoint map for contract owners. |
| `agent-docs/references/runtime-ai-flow.md` | Runtime flow notes. |
| `agent-docs/references/tool-catalog.md` | Tooling references used during development. |
| `agent-docs/references/testing-ci-map.md` | Verification, CI, review command, release publish workflow, and release helper command map. |
| `agent-docs/prompts/simplify.md` | Simplification audit prompt. |
| `agent-docs/prompts/test-coverage-audit.md` | Coverage audit prompt. |
| `agent-docs/prompts/task-finish-review.md` | Completion review prompt. |
| `agent-docs/operations/completion-workflow.md` | Completion workflow definition. |
| `agent-docs/generated/README.md` | Generated-doc artifact guide. |
| `agent-docs/generated/doc-inventory.md` | Generated inventory artifact. |
| `agent-docs/generated/doc-gardening-report.md` | Generated doc-gardening report. |
| `agent-docs/exec-plans/active/` | Active execution plan workspace. |
| `agent-docs/exec-plans/active/README.md` | Active execution plan conventions. |
| `agent-docs/exec-plans/active/COORDINATION_LEDGER.md` | Cross-agent ownership ledger. |
| `agent-docs/exec-plans/active/2026-03-11-farcaster-x402-canonical-signing-request.md` | Active execution plan for canonical Farcaster/Neynar x402 signing-request extraction. |
| `agent-docs/exec-plans/active/2026-03-10-farcaster-hosted-contracts.md` | Active execution plan for shared Farcaster hosted/signup contract hard cutover. |
| `agent-docs/exec-plans/active/2026-03-10-final-hard-cutover-sweep.md` | Active execution plan for removing final compatibility-only shared-surface aliases. |
| `agent-docs/exec-plans/active/2026-03-10-protocol-notification-hard-cutover.md` | Active execution plan for removing legacy protocol-notification reason aliases from the shared presenter surface. |
| `agent-docs/exec-plans/active/2026-03-03-farcaster-wire-contract.md` | Active execution plan for Farcaster wire contract additions. |
| `agent-docs/exec-plans/active/2026-03-03-release-docs-drift-fix.md` | Active execution plan to restore docs drift gate compliance for release patch verification. |
| `agent-docs/exec-plans/active/2026-03-04-abi-etherscan-docs-drift-fix.md` | Active execution plan to restore docs drift compliance after migrating ABI generation to Wagmi Etherscan plugin fetches. |
| `agent-docs/exec-plans/active/2026-03-05-base-implementation-address-sync.md` | Active execution plan for syncing Base implementation + factory entrypoint addresses and regenerated ABI outputs to latest v1-core deployments. |
| `agent-docs/exec-plans/active/2026-03-10-protocol-governance-phase1.md` | Active execution plan for shared Base-only TCR/vote/dispute planners, payload coders, and receipt decoders. |
| `agent-docs/exec-plans/active/2026-03-10-protocol-address-helper-surface.md` | Active execution plan for shared Base token/ecosystem address exports and pure indexed-inspect helper extraction. |
| `agent-docs/exec-plans/active/2026-03-10-protocol-notification-completeness.md` | Active execution plan for expanding the shared notification presenter across the remaining protocol lifecycle reasons. |
| `agent-docs/exec-plans/active/2026-03-10-tcr-request-actor-abi-sync.md` | Active execution plan for regenerating wire ABIs after the TCR requester/challenger event payload cutover. |
| `agent-docs/exec-plans/completed/` | Completed execution plan archive. |
| `agent-docs/exec-plans/completed/2026-03-10-protocol-phase1-foundation.md` | Completed execution record for Base-only goal-create helper extraction and shared protocol utility cleanup. |
| `agent-docs/exec-plans/completed/2026-03-10-protocol-stake-premium-phase1.md` | Completed execution record for shared Base-only stake/premium planner and receipt-decoder helpers. |
| `agent-docs/exec-plans/completed/2026-03-07-shared-sync-helper-cleanup.md` | Completed execution record for routing wire sibling-sync automation through the shared repo-tools helper. |
| `agent-docs/exec-plans/completed/2026-03-07-wire-post-publish-sync.md` | Completed execution record for adding post-publish sibling consumer sync automation to wire releases. |
| `agent-docs/exec-plans/completed/2026-03-07-published-consumer-rollout-guidance.md` | Completed execution record for documenting published-package expectations and downstream consumer bump guidance. |
| `agent-docs/exec-plans/completed/2026-03-07-installed-package-wrapper-cleanup.md` | Completed execution record for moving direct repo-tools wrappers and release-note generation onto installed published packages. |
| `agent-docs/exec-plans/completed/2026-03-05-repo-tools-release-consolidation.md` | Completed execution record for consolidating package release tooling onto shared repo-tools wrappers. |
| `agent-docs/exec-plans/completed/2026-03-05-repo-tools-extraction.md` | Completed execution record for extracting shared repo-operation tooling into `@cobuild/repo-tools`. |
| `agent-docs/exec-plans/completed/README.md` | Completed plan archive conventions. |
| `agent-docs/exec-plans/completed/2026-03-03-abi-source-of-truth-centralization.md` | Completed execution record for ABI source-of-truth centralization in wire. |
| `agent-docs/exec-plans/completed/2026-03-03-base-address-exports.md` | Completed execution record for Base canonical protocol address exports. |
| `agent-docs/exec-plans/tech-debt-tracker.md` | Shared tech debt tracker. |

## Recent Updates

- Added a canonical shared Farcaster/Neynar x402 signing-request helper so downstream hosted/local signers reuse one typed-data domain, validity window, and payment encoder.
- Removed compatibility-only protocol-notification reason aliases so only canonical success-assertion and reminder spellings reach the shared presenter/routing surface.
- Expanded shared protocol notification normalization, routing, and presenter coverage for finalize-failed, resolver lifecycle, juror reward, and reminder reason families.
- Added canonical shared Base token/ecosystem contract exports plus pure indexed-inspect normalization/state helpers for downstream `chat-api` and `interface` cutover.
- Regenerated GoalFactory ABI exports from local `v1-core` artifacts and hard-cut goal-create helpers to the current deploy shape (required spend-policy addresses, no `revnet.owner`, no `underwriting.coverageLambda`).
- Added shared goal-create calldata/receipt helpers and documented the Base-only protocol utility direction for phase one.
- Added shared Base-only TCR/vote/dispute planners, payload coders, commit-hash helpers, and receipt decoders for downstream governance execution surfaces.
- Added shared Base-only stake-vault and premium-escrow planner/receipt helpers for the first downstream execution slice.
- Added shared Base-only participant write planners/receipt helpers for treasury donations, stake-vault juror lifecycle, round prize vault actions, and flow allocation maintenance.
- Routed `wire` sibling sync through the shared repo-tools helper while preserving the current direct-consumer set and local sibling fallback before the next repo-tools publish.
- Added explicit `pnpm wagmi:local` / `pnpm generate:local` support so workspace ABI refreshes can use sibling `v1-core` Forge artifacts without changing the default Basescan source of truth.
- Added a manual and release-hooked `sync:repos` flow for bumping direct `@cobuild/wire` workspace consumers after publish.
- Documented the published-package expectation for direct `@cobuild/wire` consumers and the required downstream bump decision after release.
- Updated the active Base address-sync execution plan scope to include GoalFactory/BudgetTCRFactory entrypoint refresh from `DeployGoalFactory.8453.txt`.
- Completed the installed-package wrapper cleanup across release and repo-tools shell entrypoints.
- Recorded the direct `pnpm review:gpt` package entrypoint in the testing/CI map.
- Added an active execution plan for Base implementation-address + ABI regeneration sync (`2026-03-05-base-implementation-address-sync`).
- Recorded active docs remediation plan for commit `ff248bd` (`feat(abi): fetch protocol ABIs via wagmi etherscan plugin`).
- Switched ABI generation to Wagmi `etherscan` plugin fetches for Base (`chainId=8453`) and documented required `BASESCAN_API_KEY` (fallback `ETHERSCAN_API_KEY`) for `pnpm wagmi` / `pnpm generate`.
- Added shared Base builder-code utilities (`builder-codes`) and exported them from the wire public surface.
- Synced Base `GoalFactory` and `BudgetTCRFactory` entrypoint addresses to latest `v1-core/deploys/DeployGoalFactory.8453.txt`.
- Refreshed `protocol-addresses` constants to the newest Base deployment set in `v1-core/deploys/LATEST_IMPLEMENTATIONS.8453.{txt,toml}` (token, terminal, implementation, defaults, fake UMA resolver).
- Synced canonical Base deployment addresses to `v1-core/deploys/LATEST_IMPLEMENTATIONS.8453.{txt,toml}` and added entrypoint aliases for terminal + buyback hook addresses.
- Switched protocol ABI generation to local `v1-core/out` artifacts and regenerated the full contract ABI surface (no manual resolver/router ABI appendages).
- Closed the active coordination-ledger entry for GoalFactory/GoalTreasury ABI expansion after cross-repo sync completion.
- Added router + UMA resolver event-only ABI exports and extended GoalFactory/GoalTreasury event payload ABI fields for indexer discovery wiring.
- ABI source-of-truth now relies on generated-only wagmi ABI exports (manual fallback parsing removed).
- Updated active coordination ledger for GoalTreasury `GoalConfigured` ABI payload sync (added slasher/token event fields).
- `CobuildSwapImpl` ABI generation now fetches verified ABI from Basescan at `0x21a580054e7a5e833f38033f2d958e00e4c50f0f` (no empty placeholder ABI export).
- Added canonical Base V1 core address exports (`protocol-addresses`) for entrypoints and implementation addresses.
- Removed constant-case protocol address compatibility aliases after downstream cutover.
- Added an active execution plan to track docs drift-gate remediation for release patch verification.
- Synced Base `8453` implementation/default/config addresses to latest `DeployGoalFactoryImplementations.8453.txt` and updated wagmi ABI generation to fetch verified impl ABIs from Basescan with local factory ABI fallback.
