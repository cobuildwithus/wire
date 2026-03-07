# Shared sync helper cleanup

## Goal

Cut `wire` over to the shared `repo-tools` dependent-repo sync helper so the local workspace release flow no longer maintains a second full implementation, while preserving the current direct-consumer behavior and skip controls.

## Success criteria

- `wire/scripts/sync-dependent-repos.sh` becomes a thin wrapper around the shared helper.
- The wrapper preserves the current default consumer set: `cli`, `chat-api`, `indexer`, `interface/apps/web`.
- Local workflow remains usable before a repo-tools package publish by falling back to the sibling `repo-tools` checkout when the installed bin is absent.
- Docs and tests reflect the shared-helper model.

## Constraints

- Preserve committed published-package source-of-truth behavior.
- Do not touch consumer repos in this task.
- Keep release skip behavior unchanged (`--no-sync-upstreams`, `WIRE_SKIP_UPSTREAM_SYNC=1`).

## Plan

1. Add sibling-fallback resolution for repo-tools bins in `wire`.
2. Replace the local sync implementation with a thin wrapper over `cobuild-sync-dependent-repos`.
3. Update `wire` docs/tests to match.
4. If the same duplicate pattern still exists in `review-gpt-cli`, collapse that onto the shared helper too.
Status: completed
Updated: 2026-03-07
Completed: 2026-03-07
