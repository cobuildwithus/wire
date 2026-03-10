# Security

- Never log secrets or raw auth headers.
- Validate all externally supplied wire fields.
- Fail closed for malformed auth/idempotency/x402 payloads.
- Keep shared bearer-auth helpers dependency-injected for runtime-specific key loading and session-liveness checks.
