# AGENTS.md

## Purpose

This file is the routing map for agent work in this repository.
Durable guidance lives in `agent-docs/`.

## Precedence

1. Explicit user instruction in the current chat turn.
2. `Hard Rules (Non-Negotiable)` in this file.
3. Other sections in this file.
4. Detailed process docs under `agent-docs/**`.

If instructions still conflict after applying this order, ask the user before acting.

## Read Order

1. `agent-docs/index.md`
2. `ARCHITECTURE.md`
3. `agent-docs/product-specs/index.md`
4. `agent-docs/RELIABILITY.md`
5. `agent-docs/SECURITY.md`
6. `agent-docs/references/api-contracts.md`
7. `agent-docs/references/testing-ci-map.md`
8. `agent-docs/operations/completion-workflow.md`

## Hard Rules (Non-Negotiable)

- Never access `.env` or `.env*` files.
- Never print or commit full tokens or raw `Authorization` headers.
- Historical plan docs under `agent-docs/exec-plans/completed/` are immutable snapshots.
- Always keep `agent-docs/exec-plans/active/COORDINATION_LEDGER.md` current for every coding task (single-agent and multi-agent): claim scope before first edit, list planned symbol add/rename/delete work, and remove your entry when done.
- Any spawned subagent that may review or edit code must read `COORDINATION_LEDGER.md` first and must not touch files or symbols owned by another active entry.
- Keep this file short and route-oriented; move durable detail into `agent-docs/`.

## How To Work

- Before implementation, do a quick assumptions check; ask only for high-impact clarifications.
- Continue working in the current tree even when unrelated external dirty changes appear.
- Never revert, delete, or rewrite existing edits you did not make unless the user explicitly asks.
- If architecture-significant behavior changes, update matching docs in `agent-docs/`.
- For multi-file or high-risk work, add an execution plan in `agent-docs/exec-plans/active/`.

## Required Checks

- Always run:
  - `pnpm typecheck`
  - `pnpm test`
  - `pnpm test:coverage`
  - `bash scripts/check-agent-docs-drift.sh`
  - `bash scripts/doc-gardening.sh --fail-on-issues`

## Notes

- `agent-docs/index.md` is the canonical docs map. Update it whenever docs move or change.
