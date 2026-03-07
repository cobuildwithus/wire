# Testing / CI Map

- Type safety: `pnpm typecheck`
- Unit tests: `pnpm test`
- Coverage gate: `pnpm test:coverage`
- Docs gates: drift + gardening scripts
- Review command: `pnpm review:gpt` -> `cobuild-review-gpt --config scripts/review-gpt.config.sh`
- Release publish pipeline: `.github/workflows/release.yml` (tag `v*.*.*` -> verify/build/package -> GitHub Release -> npm publish via trusted publishing)
- Release helper commands: `pnpm release:check`, `pnpm release:dry-run`, `pnpm release:patch|minor|major`, `pnpm sync:repos -- --version <semver>`
- Published-package policy: committed downstream consumers should point at published `@cobuild/wire` semver ranges. Local `link:` / `file:` specs are temporary integration-only states.
- Current direct workspace consumers: `cli`, `chat-api`, `indexer`, `interface/apps/web`.
- Local integration helpers exist in `cli`, `chat-api`, and `interface/apps/web` via `wire:use-local` / `wire:use-published`; `wire:ensure-published` is the guard that restores published semver before commit.
- Post-publish rollout rule: `scripts/repo-tools.config.sh` invokes `scripts/sync-dependent-repos.sh` after a pushed release and after npm publish visibility. The wrapper delegates to `cobuild-sync-dependent-repos` from repo-tools and falls back to the sibling `repo-tools` checkout in this workspace when the installed bin has not been bumped yet. Skip with `--no-sync-upstreams` or `WIRE_SKIP_UPSTREAM_SYNC=1` when the downstream bump should be deferred.
- Drift checks ignore execution-plan-only churn when deciding whether `agent-docs/index.md` must change.
- `agent-docs/exec-plans/active/COORDINATION_LEDGER.md` alone does not count as an active execution plan for docs-drift relief.
- Dependency-only `package.json` + optional `pnpm-lock.yaml` updates do not require matching docs updates.
- Local pre-commit runs doc gardening only when docs/governance files are staged.
