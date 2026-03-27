# Simplify Audit Prompt

Read `agent-docs/exec-plans/active/COORDINATION_LEDGER.md` first. Honor any explicit exclusive/refactor notes; otherwise work carefully on top of active rows without reverting adjacent edits.

Runtime expectation:
- This audit may take 5 to 10 minutes on a non-trivial diff.
- Work methodically instead of rushing to a shallow answer.
- Parent agent: allow the run to continue and do not cancel it early unless there is clear evidence the audit is stuck or off scope.

Review changes for behavior-preserving simplifications and remove unnecessary complexity.
