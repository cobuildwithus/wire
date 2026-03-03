import { describe, expect, it } from "vitest";
import {
  IDEMPOTENCY_DEPRECATED_HEADER,
  IDEMPOTENCY_PRIMARY_HEADER,
  assertIdempotencyKey,
  buildIdempotencyRequestHeaders,
  isIdempotencyKey,
} from "../src/idempotency.js";

describe("idempotency contract", () => {
  it("accepts UUID v4", () => {
    const key = "8e03978e-40d5-43e8-bc93-6894a57f9324";
    expect(isIdempotencyKey(key)).toBe(true);
    expect(assertIdempotencyKey(key)).toBe(key);
  });

  it("rejects non-UUID v4", () => {
    expect(isIdempotencyKey("abc")).toBe(false);
    expect(() => assertIdempotencyKey("abc")).toThrow("Idempotency key must be a UUID v4");
  });

  it("builds dual header payload", () => {
    const key = "8e03978e-40d5-43e8-bc93-6894a57f9324";
    expect(buildIdempotencyRequestHeaders(key)).toEqual({
      [IDEMPOTENCY_PRIMARY_HEADER]: key,
      [IDEMPOTENCY_DEPRECATED_HEADER]: key,
    });
  });
});
