# Security

- Never log secrets or raw auth headers.
- Validate all externally supplied wire fields.
- Fail closed for malformed auth/idempotency/x402 payloads.
