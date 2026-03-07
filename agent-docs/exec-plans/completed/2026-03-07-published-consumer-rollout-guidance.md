# Published consumer rollout guidance

## Goal

Make the expected consumer workflow for `@cobuild/wire` explicit: published package versions are the committed source of truth, local sibling links are temporary only, and release follow-up should include intentional downstream bumps where the new surface is consumed.

## Success criteria

- `AGENTS.md`, `README.md`, and `agent-docs/references/testing-ci-map.md` explain the published-vs-local policy clearly.
- The docs name the current direct consumer repos and the normal post-publish bump path.
- No runtime exports, tests, release tags, or consumer repos change in this task.

## Constraints

- Keep the change documentation-only.
- Preserve the existing consumer helper scripts and release behavior.
- Do not assume every release requires every sibling repo to bump.

## Plan

1. Record the work in the active coordination ledger.
2. Update the agent-facing rules and release/testing map with the committed-state policy.
3. Update the public README with the same policy and current consumer set.
4. Run required verification and then clear the ledger entry when done.
Status: completed
Updated: 2026-03-07
Completed: 2026-03-07
