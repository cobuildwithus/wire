# @cobuild/wire Agent Docs Index

Last verified: 2026-03-04

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
| `agent-docs/references/testing-ci-map.md` | Verification, CI, release publish workflow, and release helper command map. |
| `agent-docs/prompts/simplify.md` | Simplification audit prompt. |
| `agent-docs/prompts/test-coverage-audit.md` | Coverage audit prompt. |
| `agent-docs/prompts/task-finish-review.md` | Completion review prompt. |
| `agent-docs/operations/completion-workflow.md` | Completion workflow definition. |
| `agent-docs/generated/README.md` | Generated-doc artifact guide. |
| `agent-docs/generated/doc-inventory.md` | Generated inventory artifact. |
| `agent-docs/generated/doc-gardening-report.md` | Generated doc-gardening report. |
| `agent-docs/exec-plans/active/README.md` | Active execution plan conventions. |
| `agent-docs/exec-plans/active/COORDINATION_LEDGER.md` | Cross-agent ownership ledger. |
| `agent-docs/exec-plans/active/2026-03-03-farcaster-wire-contract.md` | Active execution plan for Farcaster wire contract additions. |
| `agent-docs/exec-plans/active/2026-03-03-release-docs-drift-fix.md` | Active execution plan to restore docs drift gate compliance for release patch verification. |
| `agent-docs/exec-plans/completed/README.md` | Completed plan archive conventions. |
| `agent-docs/exec-plans/completed/2026-03-03-abi-source-of-truth-centralization.md` | Completed execution record for ABI source-of-truth centralization in wire. |
| `agent-docs/exec-plans/completed/2026-03-03-base-address-exports.md` | Completed execution record for Base canonical protocol address exports. |
| `agent-docs/exec-plans/tech-debt-tracker.md` | Shared tech debt tracker. |

## Recent Updates

- Added router + UMA resolver event-only ABI exports and extended GoalFactory/GoalTreasury event payload ABI fields for indexer discovery wiring.
- ABI source-of-truth now relies on generated-only wagmi ABI exports (manual fallback parsing removed).
- Updated active coordination ledger for GoalTreasury `GoalConfigured` ABI payload sync (added slasher/token event fields).
- `CobuildSwapImpl` ABI generation now fetches verified ABI from Basescan at `0x21a580054e7a5e833f38033f2d958e00e4c50f0f` (no empty placeholder ABI export).
- Added canonical Base V1 core address exports (`protocol-addresses`) for entrypoints and implementation addresses.
- Added compatibility aliases for protocol token/revnet/swap exports in constant-case: `COBUILD_TOKEN`, `COBUILD_REVNET_ID`, `COBUILD_SWAP`, and `COBUILD_SWAP_IMPL`.
- Added an active execution plan to track docs drift-gate remediation for release patch verification.
- Synced Base `8453` implementation/default/config addresses to latest `DeployGoalFactoryImplementations.8453.txt` and updated wagmi ABI generation to fetch verified impl ABIs from Basescan with local factory ABI fallback.
