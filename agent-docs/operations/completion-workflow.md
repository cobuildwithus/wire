# Completion Workflow

1. Simplify pass
2. Coverage audit pass
3. Final review pass
4. Run required checks
5. If a required check fails for a credibly unrelated pre-existing reason, still commit your exact touched files after recording the failing command, the failing target, and why your diff did not cause it. If you cannot defend that separation, treat the failure as blocking.

## Coordination Ledger

- Before coding work, add or update an active row in `agent-docs/exec-plans/active/COORDINATION_LEDGER.md`.
- Treat rows as active-work notices by default, not hard locks.
- Overlap is allowed when agents stay within declared scope, read the current file state first, and preserve adjacent edits.
- Mark a row as exclusive only when overlap is unsafe, such as a broad refactor or a delicate cross-cutting rewrite.
- Remove the row immediately when the task is complete or abandoned.
