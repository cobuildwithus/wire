# 2026-03-12 - Revnet loan-source canonicalization

## Goal

Make `wire` the canonical revnet loan-source resolver so downstream consumers use the same source availability and accounting-context semantics.

## Scope

- Update `src/revnet/read.ts` so empty `loanSourcesOf` results do not fabricate a fallback source.
- Resolve `selectedLoanAccountingContext` against the selected source terminal instead of assuming `contracts.multiTerminal`.
- Add regression coverage for empty-source and non-default-terminal loan-source reads.

## Constraints

- Preserve the existing shared read API shape.
- Do not introduce framework-specific logic into `wire`.
- Respect existing in-progress edits in unrelated revnet files.

## Verification

- `pnpm typecheck`
- `pnpm test`
- `pnpm test:coverage`
- `bash scripts/check-agent-docs-drift.sh`
- `bash scripts/doc-gardening.sh --fail-on-issues`

## Status

- Completed.
Status: completed
Updated: 2026-03-12
Completed: 2026-03-12
