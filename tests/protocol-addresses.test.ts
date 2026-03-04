import { isAddress } from "viem";
import { describe, expect, it } from "vitest";

import {
  COBUILD_REVNET_ID,
  COBUILD_SWAP,
  COBUILD_SWAP_IMPL,
  COBUILD_TOKEN,
  baseAddresses,
  baseConfig,
  baseDefaults,
  baseEntrypoints,
  baseImplementations,
  budgetTcrFactoryAddress,
  cobuildSwapAddress,
  cobuildTokenAddress,
  goalFactoryAddress,
} from "../src/protocol-addresses.js";

describe("protocol address exports", () => {
  it("exports canonical Base chain constants", () => {
    expect(baseAddresses.chainId).toBe(8453);
    expect(cobuildTokenAddress).toBe("0x62F05b13239B24B8eEFF36696344dE0Db7D2efDD");
    expect(COBUILD_TOKEN).toBe("0x62F05b13239B24B8eEFF36696344dE0Db7D2efDD");
    expect(COBUILD_REVNET_ID).toBe(138);
    expect(cobuildSwapAddress).toBe("0x5d09ddd53feffc52f5139a59246ced560d8c45df");
    expect(COBUILD_SWAP).toBe("0x5d09ddd53feffc52f5139a59246ced560d8c45df");
    expect(COBUILD_SWAP_IMPL).toBe("0x21a580054e7a5e833f38033f2d958e00e4c50f0f");
  });

  it("exports convenience entrypoint/config aliases", () => {
    expect(goalFactoryAddress).toBe(baseEntrypoints.goalFactory);
    expect(budgetTcrFactoryAddress).toBe(baseEntrypoints.budgetTcrFactory);
    expect(cobuildTokenAddress).toBe(baseEntrypoints.cobuildToken);
    expect(cobuildSwapAddress).toBe(baseEntrypoints.cobuildSwap);
    expect(COBUILD_TOKEN).toBe(baseEntrypoints.cobuildToken);
    expect(COBUILD_REVNET_ID).toBe(baseConfig.cobuildRevnetId);
    expect(COBUILD_SWAP).toBe(baseEntrypoints.cobuildSwap);
    expect(COBUILD_SWAP_IMPL).toBe(baseImplementations.cobuildSwapImpl);
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
