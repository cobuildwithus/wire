import { describe, expect, it } from "vitest";
import { parseBearerToken } from "../src/parse-bearer-token.js";

describe("parseBearerToken", () => {
  it("parses case-insensitive bearer values", () => {
    expect(parseBearerToken("Bearer abc")).toBe("abc");
    expect(parseBearerToken("bearer xyz")).toBe("xyz");
  });

  it("returns null for non-bearer values", () => {
    expect(parseBearerToken("Token abc")).toBeNull();
    expect(parseBearerToken(undefined)).toBeNull();
  });
});
