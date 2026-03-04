import { isAddress } from "viem";
import { describe, expect, it } from "vitest";

import {
  BUYBACK_HOOK,
  BUYBACK_HOOK_DATA_HOOK,
  COBUILD_REVNET_ID,
  COBUILD_SWAP,
  COBUILD_SWAP_IMPL,
  COBUILD_TERMINAL,
  COBUILD_TOKEN,
  baseAddresses,
  baseConfig,
  baseDefaults,
  baseEntrypoints,
  baseImplementations,
  budgetTcrFactoryAddress,
  buybackHookAddress,
  buybackHookDataHookAddress,
  cobuildSwapAddress,
  cobuildTerminalAddress,
  cobuildTokenAddress,
  goalFactoryAddress,
} from "../src/protocol-addresses.js";

describe("protocol address exports", () => {
  it("exports canonical Base chain constants", () => {
    expect(baseAddresses.chainId).toBe(8453);
    expect(cobuildTokenAddress).toBe("0x62f05B1aD94c5d7B9f989A294d2A0f36a1AE10Fb");
    expect(COBUILD_TOKEN).toBe("0x62f05B1aD94c5d7B9f989A294d2A0f36a1AE10Fb");
    expect(COBUILD_REVNET_ID).toBe(138);
    expect(cobuildSwapAddress).toBe("0x5d09ddd53feffc52f5139a59246ced560d8c45df");
    expect(cobuildTerminalAddress).toBe("0xA0BF03DE899D98411cC38Eb140Be8Ee225F62D40");
    expect(buybackHookDataHookAddress).toBe("0xB6133A222315f8E9d25E7C77BAC5DdEB3451D088");
    expect(buybackHookAddress).toBe("0xB6133A222315f8E9d25E7C77BAC5DdEB3451D088");
    expect(COBUILD_SWAP).toBe("0x5d09ddd53feffc52f5139a59246ced560d8c45df");
    expect(COBUILD_TERMINAL).toBe("0xA0BF03DE899D98411cC38Eb140Be8Ee225F62D40");
    expect(BUYBACK_HOOK_DATA_HOOK).toBe("0xB6133A222315f8E9d25E7C77BAC5DdEB3451D088");
    expect(BUYBACK_HOOK).toBe("0xB6133A222315f8E9d25E7C77BAC5DdEB3451D088");
    expect(COBUILD_SWAP_IMPL).toBe("0x21a580054e7a5e833f38033f2d958e00e4c50f0f");
  });

  it("exports convenience entrypoint/config aliases", () => {
    expect(goalFactoryAddress).toBe(baseEntrypoints.goalFactory);
    expect(budgetTcrFactoryAddress).toBe(baseEntrypoints.budgetTcrFactory);
    expect(cobuildTokenAddress).toBe(baseEntrypoints.cobuildToken);
    expect(cobuildSwapAddress).toBe(baseEntrypoints.cobuildSwap);
    expect(cobuildTerminalAddress).toBe(baseEntrypoints.cobuildTerminal);
    expect(buybackHookDataHookAddress).toBe(baseEntrypoints.buybackHookDataHook);
    expect(buybackHookAddress).toBe(baseEntrypoints.buybackHook);
    expect(COBUILD_TOKEN).toBe(baseEntrypoints.cobuildToken);
    expect(COBUILD_REVNET_ID).toBe(baseConfig.cobuildRevnetId);
    expect(COBUILD_SWAP).toBe(baseEntrypoints.cobuildSwap);
    expect(COBUILD_TERMINAL).toBe(baseEntrypoints.cobuildTerminal);
    expect(BUYBACK_HOOK_DATA_HOOK).toBe(baseEntrypoints.buybackHookDataHook);
    expect(BUYBACK_HOOK).toBe(baseEntrypoints.buybackHook);
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
