# Testing / CI Map

- Type safety: `pnpm typecheck`
- Unit tests: `pnpm test`
- Coverage gate: `pnpm test:coverage`
- Docs gates: drift + gardening scripts
- Review command: `pnpm review:gpt` -> `cobuild-review-gpt --config scripts/review-gpt.config.sh`
- Release publish pipeline: `.github/workflows/release.yml` (tag `v*.*.*` -> verify/build/package -> GitHub Release -> npm publish via trusted publishing)
- Release helper commands: `pnpm release:check`, `pnpm release:dry-run`, `pnpm release:patch|minor|major`
- Drift checks ignore execution-plan-only churn when deciding whether `agent-docs/index.md` must change.
- `agent-docs/exec-plans/active/COORDINATION_LEDGER.md` alone does not count as an active execution plan for docs-drift relief.
- Dependency-only `package.json` + optional `pnpm-lock.yaml` updates do not require matching docs updates.
- Local pre-commit runs doc gardening only when docs/governance files are staged.
