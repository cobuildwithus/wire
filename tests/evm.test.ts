import { describe, expect, it } from "vitest";
import {
  isSameEvmAddress,
  normalizeEvmAddress,
  parseEvmAddress,
} from "../src/evm.js";

describe("evm helpers", () => {
  it("normalizes valid addresses", () => {
    expect(normalizeEvmAddress(" 0xAbC0000000000000000000000000000000000000 ", "owner")).toBe(
      "0xabc0000000000000000000000000000000000000"
    );
  });

  it("parses nullable addresses", () => {
    expect(parseEvmAddress("0xAbC0000000000000000000000000000000000000")).toBe(
      "0xabc0000000000000000000000000000000000000"
    );
    expect(parseEvmAddress("   ")).toBeNull();
    expect(parseEvmAddress(null)).toBeNull();
    expect(parseEvmAddress(123)).toBeNull();
    expect(parseEvmAddress("0xabc")).toBeNull();
  });

  it("compares addresses case-insensitively", () => {
    expect(
      isSameEvmAddress(
        "0xABC0000000000000000000000000000000000000",
        "0xabc0000000000000000000000000000000000000"
      )
    ).toBe(true);
    expect(
      isSameEvmAddress(
        "0xabc0000000000000000000000000000000000000",
        "0xdef0000000000000000000000000000000000000"
      )
    ).toBe(false);
    expect(isSameEvmAddress("0xabc", null)).toBe(false);
  });
});
