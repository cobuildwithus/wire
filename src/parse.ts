export type JsonRecord = Record<string, unknown>;

export function asRecord(value: unknown): JsonRecord | null {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return null;
  }

  return value as JsonRecord;
}

export function asJsonRecord(input: unknown, errorMessage: string): JsonRecord {
  const record = asRecord(input);
  if (!record) {
    throw new Error(errorMessage);
  }

  return record;
}

export function assertKnownKeys(
  record: JsonRecord,
  allowedKeys: readonly string[],
  label: string
): void {
  const allowed = new Set(allowedKeys);
  for (const key of Object.keys(record)) {
    if (!allowed.has(key)) {
      throw new Error(`${label} includes unsupported field "${key}"`);
    }
  }
}

export function requireTrimmedString(
  value: unknown,
  options: {
    fieldPath: string;
    maxLength?: number;
    requiredMessage?: string;
    invalidTypeMessage?: string;
  }
): string {
  const requiredMessage =
    options.requiredMessage ?? `${options.fieldPath} must be a non-empty string.`;
  if (typeof value !== "string") {
    throw new Error(options.invalidTypeMessage ?? requiredMessage);
  }

  const trimmed = value.trim();
  if (!trimmed) {
    throw new Error(requiredMessage);
  }
  if (options.maxLength !== undefined && trimmed.length > options.maxLength) {
    throw new Error(`${options.fieldPath} must be at most ${options.maxLength} characters`);
  }

  return trimmed;
}

export function optionalTrimmedString(
  value: unknown,
  options: {
    fieldPath: string;
    maxLength?: number;
    invalidTypeMessage?: string;
  }
): string | undefined {
  if (value === undefined) {
    return undefined;
  }
  if (typeof value !== "string") {
    throw new Error(options.invalidTypeMessage ?? `${options.fieldPath} must be a string`);
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return undefined;
  }
  if (options.maxLength !== undefined && trimmed.length > options.maxLength) {
    throw new Error(`${options.fieldPath} must be at most ${options.maxLength} characters`);
  }

  return trimmed;
}

export function requireBoolean(
  value: unknown,
  fieldPath: string,
  errorMessage = `${fieldPath} must be a boolean`
): boolean {
  if (typeof value !== "boolean") {
    throw new Error(errorMessage);
  }

  return value;
}

export function requireInteger(
  value: unknown,
  fieldPath: string,
  options: {
    allowZero?: boolean;
    integerMessage?: string;
  } = {}
): number {
  if (typeof value !== "number" || !Number.isInteger(value)) {
    throw new Error(options.integerMessage ?? `${fieldPath} must be an integer`);
  }
  if (options.allowZero ? value < 0 : value <= 0) {
    throw new Error(
      `${fieldPath} must be ${options.allowZero ? "zero or greater" : "greater than zero"}`
    );
  }

  return value;
}
