# COORDINATION_LEDGER

| task_id | goal | scope | owner | status | updated |
| --- | --- | --- | --- | --- | --- |
| codex-gpt5-router-uma-abi-exports-2026-03-04 | Export router + UMA resolver ABIs and updated GoalTreasury/GoalFactory ABI tuple fields for indexer consumption | `src/generated/abis.ts`, `src/protocol-abis.ts`, `tests/protocol-abis.test.ts`, `agent-docs/index.md`, `agent-docs/exec-plans/active/COORDINATION_LEDGER.md` | add `umaTreasurySuccessResolverAbi`; add `underwriterSlasherRouterAbi`; add `jurorSlasherRouterAbi`; extend `goalTreasuryAbi` GoalConfigured inputs with `successResolver`; extend `goalFactoryAbi` `DeployedGoalStack` tuple fields for routers/resolver; export/re-export new ABI constants | Changes are additive ABI-surface exports; indexer depends on names staying stable and event arg ordering matching `../v1-core` | 2026-03-04 |
