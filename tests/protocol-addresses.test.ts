import { isAddress } from "viem";
import { describe, expect, it } from "vitest";

import {
  baseAddresses,
  baseDefaults,
  baseEntrypoints,
  baseImplementations,
  budgetTcrFactoryAddress,
  cobuildTokenAddress,
  goalFactoryAddress,
} from "../src/protocol-addresses.js";

describe("protocol address exports", () => {
  it("exports canonical Base chain constants", () => {
    expect(baseAddresses.chainId).toBe(8453);
    expect(cobuildTokenAddress).toBe("0x62F05b13239B24B8eEFF36696344dE0Db7D2efDD");
  });

  it("exports convenience entrypoint aliases", () => {
    expect(goalFactoryAddress).toBe(baseEntrypoints.goalFactory);
    expect(budgetTcrFactoryAddress).toBe(baseEntrypoints.budgetTcrFactory);
    expect(cobuildTokenAddress).toBe(baseEntrypoints.cobuildToken);
  });

  it("uses valid EVM addresses for entrypoints, implementations, and defaults", () => {
    const addresses = [
      ...Object.values(baseEntrypoints),
      ...Object.values(baseImplementations),
      ...Object.values(baseDefaults),
    ];

    for (const address of addresses) {
      expect(isAddress(address, { strict: false })).toBe(true);
    }
  });
});
