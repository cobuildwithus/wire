# 2026-03-10 OAuth + Tool HTTP Contracts

## Goal

Move canonical CLI OAuth and `/v1/tools*` HTTP DTO validators/helpers into `wire`, then provide one shared contract surface for downstream producers and consumers.

## Scope

- Extend `src/oauth.ts` with shared OAuth request/response DTO parsing and serialization helpers.
- Add shared tool catalog / tool execution DTO parsing and serialization helpers.
- Export the new surface from `src/index.ts`.
- Add/adjust tests for the shared contracts.

## Constraints

- Keep `wire` runtime-light and side-effect free.
- Do not preserve legacy envelope compatibility in the shared parsers.
- Avoid touching unrelated protocol helper work already in the tree.

## Planned Verification

- `pnpm typecheck`
- `pnpm test`
- `pnpm test:coverage`
- `bash scripts/check-agent-docs-drift.sh`
- `bash scripts/doc-gardening.sh --fail-on-issues`

## Verification Outcome

- `pnpm typecheck` passed.
- `pnpm test` passed.
- `pnpm test:coverage` failed on unrelated existing threshold misses in `src/protocol-participant-preflights.ts`.
- `bash scripts/check-agent-docs-drift.sh` passed.
- `bash scripts/doc-gardening.sh --fail-on-issues` passed.
