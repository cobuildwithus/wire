# Wire post-publish sync

## Goal

Add a deliberate post-publish dependent-repo sync flow for `@cobuild/wire` so releases can update direct workspace consumers without relying on undocumented manual follow-up.

## Success criteria

- `wire` exposes a manual `sync:repos` helper that bumps direct workspace consumers to a target published `@cobuild/wire` version.
- The release flow can invoke that helper after push and after npm publish visibility.
- Docs explain the automation, the current consumer set, and how to skip or run it manually.
- Existing verification and release behavior stay intact outside the new post-push step.

## Constraints

- Keep the synced repo set explicit and limited to direct workspace consumers.
- Preserve published-package committed state; local link/file helpers remain temporary only.
- Do not touch consumer repos in this task.

## Plan

1. Add the sync script and package entrypoint.
2. Wire the release config to call the script after push.
3. Update docs and verification references.
4. Run required checks, then close the plan and clear the ledger entry.
Status: completed
Updated: 2026-03-07
Completed: 2026-03-07
