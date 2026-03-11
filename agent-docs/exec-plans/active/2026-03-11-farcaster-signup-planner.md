# Extract shared Farcaster signup planner

Status: complete
Created: 2026-03-11
Updated: 2026-03-11

## Goal

- Move the duplicated Farcaster signup state-machine logic into `@cobuild/wire` so downstream callers reuse one canonical planner and one canonical extra-storage normalization contract.

## Success criteria

- `wire` exposes a shared signup planner that returns either the canonical funding-required result or a transport-agnostic bundle for the remaining signing/execution steps.
- Shared Farcaster extra-storage parsing/normalization lives in the Farcaster contract surface and is reused by downstream consumers.
- `interface` and `cli` stop rebuilding the middle signup algorithm locally and instead consume the new `wire` planner contract.

## Scope

- In scope:
  - Add shared planner/result types and helper builders in `src/farcaster`.
  - Export the new planner and extra-storage helpers from the public `wire` surface.
  - Update Farcaster tests/docs that cover the signup planner contract.
- Out of scope:
  - Transport-specific execution details in `interface` smart-account handling or CLI wallet sending beyond consuming the planner.
  - Farcaster posting flows unrelated to signup.

## Constraints

- Technical constraints:
  - Keep the planner pure and stop before transport-specific submission.
  - Preserve canonical Farcaster DTOs, typed-data builders, metadata encoding, and call encoding already owned by `wire`.
- Product/process constraints:
  - Hard cutover only; no compatibility shims or duplicate planner behavior.

## Risks and mitigations

1. Risk: Downstream callers drift if planner outputs are underspecified.
   Mitigation: Return explicit ready-state data for typed-data signing plus executable-call construction inputs.
2. Risk: `extraStorage` validation diverges again across hosted and local paths.
   Mitigation: Move normalization into shared Farcaster contract helpers and have both downstream callers consume that surface.

## Tasks

1. Define shared planner inputs/outputs and add pure signup planning helpers in `src/farcaster`.
2. Update exports/tests/docs for the new planner and extra-storage normalization.
3. Coordinate downstream cutovers in `interface` and `cli`.

## Decisions

- The shared planner will stop after producing canonical typed-data details plus a builder for executable calls once the request-signer address and signature are known.

## Verification

- Commands to run:
  - `pnpm typecheck`
  - `pnpm test`
  - `pnpm test:coverage`
  - `bash scripts/check-agent-docs-drift.sh`
  - `bash scripts/doc-gardening.sh --fail-on-issues`
- Expected outcomes:
  - All commands pass with the new planner surface exported and covered by tests.
- Result:
  - All listed commands passed on 2026-03-11.
