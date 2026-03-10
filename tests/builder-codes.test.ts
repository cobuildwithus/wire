import { describe, expect, it } from "vitest";
import {
  BASE_BUILDER_CODE,
  BASE_BUILDER_CODE_CHAIN_IDS,
  BASE_BUILDER_CODE_DATA_SUFFIX,
  BASE_BUILDER_CODE_NETWORKS,
  appendBaseBuilderCodeDataSuffix,
  appendDataSuffix,
  baseBuilderCodeDataSuffixForChainId,
  baseBuilderCodeDataSuffixForNetwork,
  canonicalizeBaseBuilderCodeAttributedData,
  hasDataSuffix,
  isBaseBuilderCodeChainId,
  isBaseBuilderCodeNetwork,
  maybeAppendBaseBuilderCodeDataSuffix,
  normalizeHex,
  stripBaseBuilderCodeDataSuffix,
  stripDataSuffix,
} from "../src/builder-codes.js";

describe("builder codes contract", () => {
  it("exposes base builder constants", () => {
    expect(BASE_BUILDER_CODE).toBe("bc_ddyrslix");
    expect(BASE_BUILDER_CODE_CHAIN_IDS).toEqual([8453]);
    expect(BASE_BUILDER_CODE_NETWORKS).toEqual(["base"]);
    expect(BASE_BUILDER_CODE_DATA_SUFFIX).toBe(
      "0x0b62635f64647972736c69780080218021802180218021802180218021"
    );
    const suffix = BASE_BUILDER_CODE_DATA_SUFFIX.slice(2);
    expect(suffix.slice(-32)).toBe("8021".repeat(8));
    expect(suffix.slice(-34, -32)).toBe("00");
    expect(suffix.slice(0, 2)).toBe("0b");
  });

  it("resolves suffixes for supported chain ids and networks", () => {
    expect(isBaseBuilderCodeChainId(8453)).toBe(true);
    expect(isBaseBuilderCodeChainId(84532)).toBe(false);
    expect(isBaseBuilderCodeChainId(10)).toBe(false);

    expect(isBaseBuilderCodeNetwork("base")).toBe(true);
    expect(isBaseBuilderCodeNetwork(" BASE ")).toBe(true);
    expect(isBaseBuilderCodeNetwork("base-sepolia")).toBe(false);
    expect(isBaseBuilderCodeNetwork("optimism")).toBe(false);

    expect(baseBuilderCodeDataSuffixForChainId(8453)).toBe(BASE_BUILDER_CODE_DATA_SUFFIX);
    expect(baseBuilderCodeDataSuffixForChainId(84532)).toBeUndefined();
    expect(baseBuilderCodeDataSuffixForChainId(10)).toBeUndefined();
    expect(baseBuilderCodeDataSuffixForNetwork("base")).toBe(BASE_BUILDER_CODE_DATA_SUFFIX);
    expect(baseBuilderCodeDataSuffixForNetwork("Base-Sepolia")).toBeUndefined();
    expect(baseBuilderCodeDataSuffixForNetwork("optimism")).toBeUndefined();
  });

  it("appends suffixes once and keeps operations idempotent", () => {
    const callData = "0x12345678";
    const withSuffix = appendBaseBuilderCodeDataSuffix(callData);

    expect(withSuffix).toBe(`${callData}${BASE_BUILDER_CODE_DATA_SUFFIX.slice(2)}`);
    expect(hasDataSuffix(withSuffix, BASE_BUILDER_CODE_DATA_SUFFIX)).toBe(true);
    expect(appendBaseBuilderCodeDataSuffix(withSuffix)).toBe(withSuffix);
    expect(appendDataSuffix(withSuffix, BASE_BUILDER_CODE_DATA_SUFFIX)).toBe(withSuffix);
  });

  it("normalizes and strips suffixes for canonical comparison", () => {
    const upperData = "0xABCDEF";
    const upperSuffix = BASE_BUILDER_CODE_DATA_SUFFIX.toUpperCase() as `0x${string}`;
    const withSuffix = `${upperData}${BASE_BUILDER_CODE_DATA_SUFFIX.slice(2)}` as `0x${string}`;

    expect(normalizeHex(upperData)).toBe("0xabcdef");
    expect(stripDataSuffix(withSuffix, upperSuffix)).toBe("0xabcdef");
    expect(stripBaseBuilderCodeDataSuffix(withSuffix)).toBe("0xabcdef");
    expect(canonicalizeBaseBuilderCodeAttributedData(withSuffix)).toBe("0xabcdef");
    expect(canonicalizeBaseBuilderCodeAttributedData("0xabcdef")).toBe("0xabcdef");
  });

  it("conditionally appends builder suffix only for base and non-empty calldata by default", () => {
    expect(maybeAppendBaseBuilderCodeDataSuffix({ data: "0x1234", network: "base" })).toBe(
      `0x1234${BASE_BUILDER_CODE_DATA_SUFFIX.slice(2)}`
    );
    expect(maybeAppendBaseBuilderCodeDataSuffix({ data: "0x1234", chainId: 84532 })).toBe("0x1234");
    expect(maybeAppendBaseBuilderCodeDataSuffix({ data: "0x1234", network: "optimism" })).toBe(
      "0x1234"
    );
    expect(maybeAppendBaseBuilderCodeDataSuffix({ data: "0x", network: "base" })).toBe("0x");
    expect(
      maybeAppendBaseBuilderCodeDataSuffix({
        data: "0x",
        network: "base",
        requireNonEmptyData: false,
      })
    ).toBe(BASE_BUILDER_CODE_DATA_SUFFIX);
  });
});
