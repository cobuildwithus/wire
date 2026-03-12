import { describe, expect, it } from "vitest";

import { buildRevnetIssuanceBaseTerms, buildRevnetIssuanceTerms } from "../src/index.js";

describe("revnet issuance semantics", () => {
  it("keeps current summary fields null before the first stage starts", () => {
    const terms = buildRevnetIssuanceTerms({
      rawRulesets: [
        {
          chainId: 8453,
          projectId: 138,
          rulesetId: 1n,
          start: 100,
          duration: 50,
          weight: 2n * 10n ** 18n,
          weightCutPercent: 100000000n,
          reservedPercent: 5000,
          cashOutTaxRate: 2500,
        },
      ],
      baseSymbol: "ETH",
      tokenSymbol: "REV",
      nowMs: 50_000,
    });

    expect(terms.activeStageIndex).toBeNull();
    expect(terms.summary).toEqual({
      currentIssuance: null,
      nextIssuance: 2,
      nextChangeAt: 100_000,
      nextChangeType: "stage",
      reservedPercent: null,
      cashOutTaxRate: null,
      activeStage: null,
      nextStage: 1,
    });
  });

  it("does not silently fall back to other projects when primaryProject misses", () => {
    const rulesets = [
      {
        chainId: 1,
        projectId: 1,
        rulesetId: 1n,
        start: 0,
        duration: 0,
        weight: 10n ** 18n,
        weightCutPercent: 0n,
        reservedPercent: 1000,
        cashOutTaxRate: 2000,
      },
      {
        chainId: 8453,
        projectId: 138,
        rulesetId: 2n,
        start: 50,
        duration: 0,
        weight: 2n * 10n ** 18n,
        weightCutPercent: 0n,
        reservedPercent: 2000,
        cashOutTaxRate: 3000,
      },
    ] as const;

    const baseTerms = buildRevnetIssuanceBaseTerms({
      rulesets,
      baseSymbol: "ETH",
      tokenSymbol: "REV",
      primaryProject: { chainId: 8453, projectId: 999 },
    });

    expect(baseTerms).toEqual({
      baseSymbol: "ETH",
      tokenSymbol: "REV",
      stages: [],
      chartData: [],
      chartStart: 0,
      chartEnd: 0,
    });

    const terms = buildRevnetIssuanceTerms({
      rawRulesets: rulesets,
      baseSymbol: "ETH",
      tokenSymbol: "REV",
      primaryProject: { chainId: 8453, projectId: 999 },
      nowMs: 75_000,
    });

    expect(terms.stages).toEqual([]);
    expect(terms.activeStageIndex).toBeNull();
    expect(terms.summary).toEqual({
      currentIssuance: null,
      nextIssuance: null,
      nextChangeAt: null,
      nextChangeType: null,
      reservedPercent: null,
      cashOutTaxRate: null,
      activeStage: null,
      nextStage: null,
    });
  });
});
