# TCR Request Actor ABI Sync

## Goal

Regenerate the published wire ABI surface after the TCR event payload cutover so downstream consumers receive explicit requester, challenger, and request-index event fields.

## Scope

- `src/generated/abis.ts`
- Any docs or tests touched by the regenerated ABI refresh

## Constraints

- Keep the public export surface stable outside the ABI payload additions.
- Regenerate from local `v1-core` artifacts for this workspace cutover.

## Done

- Added coordination ownership for the ABI sync.
- Regenerated `src/generated/abis.ts` from local `v1-core` artifacts after the TCR requester/challenger event cutover.
- Updated `agent-docs/index.md` and regenerated doc inventory via the required docs gates.

## Now

- None.

## Next

- Remove this plan from the active set after downstream consumer publication/cleanup if it is no longer needed.
