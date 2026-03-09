# 2026-03-09 Wallet Notifications Scope

## Goal

Add shared OAuth scope support for wallet notification reads so downstream consumers can issue and validate tokens that access the notification inbox tool.

## Scope

- Extend supported CLI OAuth scopes with `notifications:read`.
- Include notification-read in the default read bundle and full write bundle.
- Update shared tests and contract docs for the new bundle shape.

## Constraints

- Keep bundle validation deterministic and explicit.
- Do not introduce notification write scope in this change.
- Preserve existing write-capability derivation semantics.

## Verification

- Required checks: `pnpm typecheck`, `pnpm test`, `pnpm test:coverage`, `bash scripts/check-agent-docs-drift.sh`, `bash scripts/doc-gardening.sh --fail-on-issues`
Status: completed
Updated: 2026-03-09
Completed: 2026-03-09
