import { describe, expect, it } from "vitest";
import {
  BASE_EXPLORER_ROOT,
  canonicalizeBaseOnlyConfiguredNetwork,
  getBaseExplorerRoot,
  getBaseExplorerTxUrl,
  parseBaseOnlyNetwork,
} from "../src/base-network.js";

describe("base network helpers", () => {
  it("parses runtime Base-only network aliases", () => {
    expect(parseBaseOnlyNetwork("base")).toBe("base");
    expect(parseBaseOnlyNetwork(" BASE-MAINNET ")).toBe("base");
    expect(parseBaseOnlyNetwork("base-sepolia")).toBeNull();
    expect(parseBaseOnlyNetwork("ethereum")).toBeNull();
  });

  it("canonicalizes configured Base aliases", () => {
    expect(canonicalizeBaseOnlyConfiguredNetwork("base")).toBe("base");
    expect(canonicalizeBaseOnlyConfiguredNetwork("base-mainnet")).toBe("base");
    expect(canonicalizeBaseOnlyConfiguredNetwork(" base-sepolia ")).toBeNull();
    expect(canonicalizeBaseOnlyConfiguredNetwork("")).toBeNull();
    expect(canonicalizeBaseOnlyConfiguredNetwork("ethereum")).toBeNull();
  });

  it("builds explorer URLs for supported runtime aliases only", () => {
    expect(BASE_EXPLORER_ROOT).toBe("https://basescan.org");
    expect(getBaseExplorerRoot("base")).toBe("https://basescan.org");
    expect(getBaseExplorerRoot("base-mainnet")).toBe("https://basescan.org");
    expect(getBaseExplorerRoot("base-sepolia")).toBeNull();
    expect(getBaseExplorerTxUrl("base", "0xabc")).toBe("https://basescan.org/tx/0xabc");
    expect(getBaseExplorerTxUrl("BASE-MAINNET", "0xdef")).toBe("https://basescan.org/tx/0xdef");
    expect(getBaseExplorerTxUrl("base-sepolia", "0xghi")).toBeNull();
    expect(getBaseExplorerTxUrl("base", "")).toBeNull();
  });
});
