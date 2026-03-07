# Installed Package Wrapper Cleanup

## Goal

Keep `wire` release and repo-operation scripts aligned with the published-package workflow by resolving shared repo-tools binaries from installed dependencies instead of `pnpm exec`, and unblock release-note generation in GitHub Actions.

## Scope

- Add a repo-local helper for resolving installed repo-tools binaries.
- Switch direct shell wrappers to use the installed binary helper.
- Install dependencies in the GitHub release-notes job before invoking wrapper scripts.

## Constraints

- Preserve the existing script names and release behavior.
- Do not require a sibling checkout of `repo-tools`.
- Keep the change limited to tooling/release paths; no runtime export changes.

## Done

- Claimed ownership in `agent-docs/exec-plans/active/COORDINATION_LEDGER.md`.
- Added this active execution plan artifact.

## Now

- Finish verification for shell wrapper and workflow changes.

## Next

- Move this plan to completed after the tooling cleanup lands and the required checks stay green.
Status: completed
Updated: 2026-03-07
Completed: 2026-03-07
