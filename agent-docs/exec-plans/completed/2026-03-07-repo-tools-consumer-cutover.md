# Repo Tools Consumer Cutover

Status: completed
Created: 2026-03-07
Updated: 2026-03-07

## Goal

- Replace the remaining duplicated local audit package script logic with the shared `@cobuild/repo-tools` bin while keeping the same local script entrypoint.

## Success criteria

- `scripts/package-audit-context.sh` is a thin repo-tools wrapper.
- Wire-specific audit bundle behavior remains encoded in local config.
- `package.json` and `pnpm-lock.yaml` use the published repo-tools version that contains the new bin.
- Required checks pass.

## Verification

- `pnpm typecheck`
- `pnpm test`
- `pnpm test:coverage`
- `bash scripts/check-agent-docs-drift.sh`
- `bash scripts/doc-gardening.sh --fail-on-issues`
Completed: 2026-03-07
