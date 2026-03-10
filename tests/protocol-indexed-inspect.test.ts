import { describe, expect, it } from "vitest";

import {
  BUDGET_STATE_LABELS,
  GOAL_STATE_LABELS,
  buildPremiumAccountId,
  buildTcrItemId,
  buildTcrRequestId,
  budgetStateLabel,
  compositeIdEndsWithAddress,
  goalStateLabel,
  normalizeAccountLookup,
  normalizeGoalLookupKey,
  normalizeHexAddress,
  normalizeIndexedIdentifier,
  normalizeLookupIdentifier,
  normalizeOptionalHexLike,
  subtractAmounts,
  toIsoTimestamp,
  toStateCode,
} from "../src/protocol-indexed-inspect.js";

describe("protocol indexed inspect helpers", () => {
  it("exports stable state label tables", () => {
    expect(GOAL_STATE_LABELS).toEqual(["Funding", "Active", "Succeeded", "Expired"]);
    expect(BUDGET_STATE_LABELS).toEqual(["Funding", "Active", "Succeeded", "Failed", "Expired"]);
  });

  it("normalizes identifiers and addresses", () => {
    expect(normalizeLookupIdentifier("  Goal-1  ")).toBe("Goal-1");
    expect(normalizeGoalLookupKey("  Goal-1  ")).toBe("goal-1");
    expect(normalizeIndexedIdentifier("  0xAbCd  ")).toBe("0xabcd");
    expect(normalizeHexAddress("0xA0b86991c6218b36c1d19d4a2e9eb0ce3606eb48")).toBe(
      "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    );
    expect(normalizeOptionalHexLike(" 0xAbCd ")).toBe(" 0xabcd ");
    expect(normalizeOptionalHexLike("")).toBeNull();
    expect(normalizeAccountLookup(" Example.User ")).toBe("example.user");
    expect(normalizeAccountLookup("0xA0b86991c6218b36c1d19d4a2e9eb0ce3606eb48")).toBe(
      "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    );
  });

  it("builds and matches composite identifiers", () => {
    expect(buildTcrItemId("0xAbCd", "0xEf01")).toBe("0xabcd:0xef01");
    expect(buildTcrRequestId("0xAbCd", "0xEf01", "2")).toBe("0xabcd:0xef01:2");
    expect(buildPremiumAccountId("0xAbCd", " Example.User ")).toBe("0xabcd:example.user");
    expect(compositeIdEndsWithAddress("stake:0xabc", "0xAbC")).toBe(true);
    expect(compositeIdEndsWithAddress("stake:0xabc", "0xdef")).toBe(false);
  });

  it("maps timestamps, state codes, and arithmetic safely", () => {
    expect(toIsoTimestamp("1710000000")).toBe("2024-03-09T16:00:00.000Z");
    expect(toIsoTimestamp("not-a-number")).toBeNull();
    expect(toStateCode(2)).toBe(2);
    expect(toStateCode(null)).toBeNull();
    expect(goalStateLabel(0)).toBe("Funding");
    expect(goalStateLabel(4)).toBeNull();
    expect(budgetStateLabel(3)).toBe("Failed");
    expect(budgetStateLabel(8)).toBeNull();
    expect(subtractAmounts("10", "3")).toBe("7");
    expect(subtractAmounts(undefined, undefined)).toBeNull();
    expect(subtractAmounts("invalid", "3")).toBeNull();
  });
});
