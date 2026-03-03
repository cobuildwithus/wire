export const UUID_V4_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const IDEMPOTENCY_PRIMARY_HEADER = "Idempotency-Key";
export const IDEMPOTENCY_DEPRECATED_HEADER = "X-Idempotency-Key";

export const IDEMPOTENCY_HEADER_NAMES = [
  IDEMPOTENCY_PRIMARY_HEADER,
  IDEMPOTENCY_DEPRECATED_HEADER,
] as const;

export const IDEMPOTENCY_KEY_EXAMPLE = "8e03978e-40d5-43e8-bc93-6894a57f9324";
export const IDEMPOTENCY_KEY_PATTERN = UUID_V4_REGEX;
export const IDEMPOTENCY_KEY_VALIDATION_ERROR =
  `Idempotency key must be a UUID v4 (e.g. ${IDEMPOTENCY_KEY_EXAMPLE})`;

export function isIdempotencyKey(value: string): boolean {
  return IDEMPOTENCY_KEY_PATTERN.test(value.trim());
}

export function assertIdempotencyKey(value: string): string {
  const normalized = value.trim();
  if (!isIdempotencyKey(normalized)) {
    throw new Error(IDEMPOTENCY_KEY_VALIDATION_ERROR);
  }
  return normalized;
}

export function buildIdempotencyRequestHeaders(idempotencyKey: string): Record<string, string> {
  const normalized = assertIdempotencyKey(idempotencyKey);
  return {
    [IDEMPOTENCY_PRIMARY_HEADER]: normalized,
    [IDEMPOTENCY_DEPRECATED_HEADER]: normalized,
  };
}
