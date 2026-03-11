import { isAddress } from "viem";
import { describe, expect, it } from "vitest";

import {
  COBUILD_PROJECT_ID,
  COBUILD_PROJECT_ID_BIGINT,
  COBUILD_TOKEN_ADDRESS,
  USDC_BASE_ADDRESS,
  WETH_ADDRESS,
  baseAddresses,
  baseContracts,
  baseDefaults,
  baseEcosystemContracts,
  baseEntrypoints,
  baseImplementations,
  baseTokens,
  budgetTcrFactoryAddress,
  buybackHookAddress,
  buybackHookDataHookAddress,
  cobuildSwapAddress,
  cobuildTerminalAddress,
  cobuildTokenAddress,
  goalFactoryAddress,
  normalizeProtocolNetwork,
  resolveProtocolAddresses,
} from "../src/protocol-addresses.js";

describe("protocol address exports", () => {
  it("exports canonical Base chain constants", () => {
    expect(baseAddresses.chainId).toBe(8453);
    expect(COBUILD_PROJECT_ID).toBe(138);
    expect(COBUILD_PROJECT_ID_BIGINT).toBe(138n);
    expect(goalFactoryAddress).toBe("0x47e83655026b6cAAD68D32919f165CE9C3Bd8a8F");
    expect(budgetTcrFactoryAddress).toBe("0x6FDbE9f8330CA9B22d74E21a1e5aA29c7AE4E4fD");
    expect(cobuildTokenAddress).toBe("0x62F05b13239B24B8eEFF36696344dE0Db7D2efDD");
    expect(COBUILD_TOKEN_ADDRESS).toBe(cobuildTokenAddress);
    expect(cobuildSwapAddress).toBe("0x5d09ddd53feffc52f5139a59246ced560d8c45df");
    expect(cobuildTerminalAddress).toBe("0x5f4eF83207FbaCe6f66f670865A8F2a0D4A689D7");
    expect(buybackHookDataHookAddress).toBe("0xB6133A222315f8E9d25E7C77BAC5DdEB3451D088");
    expect(buybackHookAddress).toBe("0xB6133A222315f8E9d25E7C77BAC5DdEB3451D088");
    expect(WETH_ADDRESS).toBe("0x4200000000000000000000000000000000000006");
    expect(USDC_BASE_ADDRESS).toBe("0x833589fcd6edb6e08f4c7c32d4f71b54bda02913");
  });

  it("exports convenience entrypoint aliases", () => {
    expect(goalFactoryAddress).toBe(baseEntrypoints.goalFactory);
    expect(budgetTcrFactoryAddress).toBe(baseEntrypoints.budgetTcrFactory);
    expect(cobuildTokenAddress).toBe(baseEntrypoints.cobuildToken);
    expect(cobuildSwapAddress).toBe(baseEntrypoints.cobuildSwap);
    expect(cobuildTerminalAddress).toBe(baseEntrypoints.cobuildTerminal);
    expect(buybackHookDataHookAddress).toBe(baseEntrypoints.buybackHookDataHook);
    expect(buybackHookAddress).toBe(baseEntrypoints.buybackHook);
    expect(WETH_ADDRESS).toBe(baseTokens.weth);
    expect(USDC_BASE_ADDRESS).toBe(baseTokens.usdc);
  });

  it("exports the flattened Base contracts surface for downstream consumers", () => {
    expect(baseAddresses.tokens).toBe(baseTokens);
    expect(baseAddresses.ecosystemContracts).toBe(baseEcosystemContracts);
    expect(baseAddresses.contracts).toBe(baseContracts);
    expect(baseAddresses.config.cobuildProjectId).toBe(COBUILD_PROJECT_ID);
    expect(baseAddresses.config.cobuildRevnetId).toBe(COBUILD_PROJECT_ID);
    expect(baseContracts.CobuildSwap).toBe(baseEntrypoints.cobuildSwap);
    expect(baseContracts.CobuildSwapImpl).toBe(baseImplementations.cobuildSwapImpl);
    expect(baseContracts.CobuildToken).toBe(baseEntrypoints.cobuildToken);
    expect(baseContracts.CustomFlowImpl).toBe(baseImplementations.customFlowImpl);
    expect(baseContracts.USDCBase).toBe(baseTokens.usdc);
    expect(baseContracts.REVDeployer).toBe(baseEntrypoints.revDeployer);
    expect(baseContracts.REVLoans).toBe(baseEcosystemContracts.revLoans);
    expect(baseContracts.JBDirectory).toBe(baseEcosystemContracts.jbDirectory);
  });

  it("uses valid EVM addresses for Base entrypoints, tokens, ecosystem contracts, implementations, and defaults", () => {
    const addresses = [
      ...Object.values(baseTokens),
      ...Object.values(baseEntrypoints),
      ...Object.values(baseEcosystemContracts),
      ...Object.values(baseImplementations),
      ...Object.values(baseDefaults),
    ];

    for (const address of addresses) {
      expect(isAddress(address, { strict: false })).toBe(true);
    }
  });

  it("resolves the canonical Base-only protocol network", () => {
    expect(normalizeProtocolNetwork(" base ")).toBe("base");
    expect(resolveProtocolAddresses()).toBe(baseAddresses);
    expect(resolveProtocolAddresses("base")).toBe(baseAddresses);
    expect(() => normalizeProtocolNetwork("base-sepolia")).toThrow("unsupported protocol network");
  });
});
