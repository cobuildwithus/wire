# Protocol Notification Hard Cutover

## Goal

Remove compatibility-only legacy protocol-notification reason aliases from `wire` so canonical reason names are the only accepted shared surface.

## Scope

- `src/protocol-notifications.ts`
- `tests/protocol-notifications.test.ts`
- `agent-docs/references/api-contracts.md`
- matching `agent-docs/**` index/plan references

## Constraints

- Do not add replacement aliases.
- Preserve the existing canonical reason names and shared presenter behavior for those canonical reasons.
- Make stale emitters fail by falling back to unknown routing/presentation behavior instead of silently normalizing to canonical names.
- No release or publish work in this sweep.

## Verification

- `pnpm typecheck`
- `pnpm test`
- `pnpm test:coverage`
- `bash scripts/check-agent-docs-drift.sh`
- `bash scripts/doc-gardening.sh --fail-on-issues`

## Status

completed
