# Completion Workflow

Last verified: 2026-03-28

## Sequence

1. Run the simplify pass. Expect about 5 to 10 minutes on non-trivial diffs; do not rush it or cancel it early just because it has not answered in the first minute.
2. Run the coverage audit pass. Expect about 5 to 10 minutes on non-trivial diffs; do not rush it or cancel it early just because it has not answered in the first minute.
3. Run the final review pass. Expect about 5 to 10 minutes on non-trivial diffs; do not rush it or cancel it early just because it has not answered in the first minute.
4. Run required checks.
5. If a required check fails for a credibly unrelated pre-existing reason, still commit your exact touched files after recording the failing command, the failing target, and why your diff did not cause it. If you cannot defend that separation, treat the failure as blocking.

## Coordination Ledger

- Before coding work, add or update an active row in `agent-docs/exec-plans/active/COORDINATION_LEDGER.md`.
- Treat rows as active-work notices by default, not hard locks.
- Overlap is allowed when agents stay within declared scope, read the current file state first, and preserve adjacent edits.
- Mark a row as exclusive only when overlap is unsafe, such as a broad refactor or a delicate cross-cutting rewrite.
- Remove the row immediately when the task is complete or abandoned.

## Audit Patience

- Prefer a patient wait window over repeated short polling for simplify, coverage, and final-review subagents.
- A realistic default is 5 to 10 minutes for each audit pass on medium or large diffs.
- Do not cancel or close an audit subagent early just because it has been running for under 10 minutes unless you have concrete evidence that it is stuck or operating on the wrong scope.
