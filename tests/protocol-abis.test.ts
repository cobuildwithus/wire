import { describe, expect, it } from "vitest";

import { cobuildSwapImplAbi, flowAbi, resolveGeneratedOrFallbackAbi } from "../src/protocol-abis.js";

describe("protocol ABI contract", () => {
  it("returns fallback ABI when generated export is missing", () => {
    const fallback = [{ type: "event", name: "FallbackOnly" }] as const;
    const resolved = resolveGeneratedOrFallbackAbi("missingAbiExport", fallback);

    expect(resolved).toBe(fallback);
  });

  it("uses generated ABI when export exists", () => {
    const fallback = [{ type: "event", name: "FallbackOnly" }] as const;
    const resolved = resolveGeneratedOrFallbackAbi("cobuildSwapImplAbi", fallback);

    expect(resolved).not.toBe(fallback);
    expect(Array.isArray(resolved)).toBe(true);
    expect(resolved).toBe(cobuildSwapImplAbi);
  });

  it("exposes typed fallback event ABIs for protocol contracts", () => {
    const eventNames = flowAbi
      .filter((item): item is (typeof flowAbi)[number] & { type: "event"; name: string } => item.type === "event")
      .map((item) => item.name);

    expect(eventNames).toContain("ChildFlowDeployed");
    expect(eventNames).toContain("FlowInitialized");
  });
});
