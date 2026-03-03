# Testing / CI Map

- Type safety: `pnpm typecheck`
- Unit tests: `pnpm test`
- Coverage gate: `pnpm test:coverage`
- Docs gates: drift + gardening scripts
- Release publish pipeline: `.github/workflows/release.yml` (tag `v*.*.*` -> verify/build/package -> GitHub Release -> npm publish via trusted publishing)
- Release helper commands: `pnpm release:check`, `pnpm release:dry-run`, `pnpm release:patch|minor|major`
