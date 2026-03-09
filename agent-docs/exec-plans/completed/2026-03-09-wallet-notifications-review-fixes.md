# Wallet Notifications Review Fixes

## Goal

Make the notification scope rollout compatible during mixed-version deployments.

## Scope

- Accept legacy and notification-aware scope bundles where appropriate.
- Keep normalized bundle outputs deterministic.
- Add rollout regression tests.

## Verification

- `pnpm typecheck`
- `pnpm test`
- `pnpm test:coverage`
