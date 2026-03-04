import { isAddress } from "viem";
import { describe, expect, it } from "vitest";

import {
  COBUILD_REVNET_ID,
  COBUILD_TOKEN,
  baseAddresses,
  baseConfig,
  baseDefaults,
  baseEntrypoints,
  baseImplementations,
  budgetTcrFactoryAddress,
  cobuild_revnet_id,
  cobuild_token,
  cobuildTokenAddress,
  goalFactoryAddress,
} from "../src/protocol-addresses.js";

describe("protocol address exports", () => {
  it("exports canonical Base chain constants", () => {
    expect(baseAddresses.chainId).toBe(8453);
    expect(cobuildTokenAddress).toBe("0x62F05b13239B24B8eEFF36696344dE0Db7D2efDD");
    expect(cobuild_revnet_id).toBe(138);
    expect(COBUILD_TOKEN).toBe("0x62F05b13239B24B8eEFF36696344dE0Db7D2efDD");
    expect(COBUILD_REVNET_ID).toBe(138);
  });

  it("exports convenience entrypoint/config aliases", () => {
    expect(goalFactoryAddress).toBe(baseEntrypoints.goalFactory);
    expect(budgetTcrFactoryAddress).toBe(baseEntrypoints.budgetTcrFactory);
    expect(cobuildTokenAddress).toBe(baseEntrypoints.cobuildToken);
    expect(cobuild_token).toBe(baseEntrypoints.cobuildToken);
    expect(cobuild_revnet_id).toBe(baseConfig.cobuildRevnetId);
    expect(COBUILD_TOKEN).toBe(baseEntrypoints.cobuildToken);
    expect(COBUILD_REVNET_ID).toBe(baseConfig.cobuildRevnetId);
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
