# 2026-03-11 - Revnet library consolidation

## Goal

Create a canonical revnet helper surface in `@cobuild/wire` so `interface` can stay a UI adapter, `chat-api` can stay the indexed read adapter, and `cli` can stay the wallet-execution adapter.

## Scope

- Add shared revnet config, types, math, issuance transforms, read helpers, and write-intent builders under `src/revnet/**`.
- Export the new surface from `src/index.ts`.
- Keep the shared layer framework-agnostic and `viem`-based.

## Constraints

- Do not move React hooks, Next cache wrappers, SWR, or UI formatting into `wire`.
- `wire` should build intents and perform chain reads, but should not execute transactions itself.
- Downstream repos will consume the new surface in follow-up changes; keep the API explicit and stable.

## Verification

- `pnpm typecheck`
- `pnpm test`
- `pnpm test:coverage`
- `bash scripts/check-agent-docs-drift.sh`
- `bash scripts/doc-gardening.sh --fail-on-issues`

## Status

- In progress.
