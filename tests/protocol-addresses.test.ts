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
  goalDeploymentRegistryAddress,
  goalFactoryAddress,
  goalFactoryPairDeployerAddress,
  goalPaymentTerminalAddress,
  normalizeProtocolNetwork,
  resolveProtocolAddresses,
} from "../src/protocol-addresses.js";

describe("protocol address exports", () => {
  it("exports canonical Base chain constants", () => {
    expect(baseAddresses.chainId).toBe(8453);
    expect(COBUILD_PROJECT_ID).toBe(138);
    expect(COBUILD_PROJECT_ID_BIGINT).toBe(138n);
    expect(goalFactoryAddress).toBe("0x0f27EE0Aa0F01A6BcAF64e662977337dA5D476ce");
    expect(budgetTcrFactoryAddress).toBe("0x2EA70b65C2d1243A967C0eac37d63a296A3E40cb");
    expect(goalFactoryPairDeployerAddress).toBe("0x65F3c0B21bA6ea7C73fe588F581Cd30c694325C9");
    expect(goalDeploymentRegistryAddress).toBe("0xa7E5161B7eb788217b7BB22549C531300273bb52");
    expect(goalPaymentTerminalAddress).toBe("0x0000000000000000000000000000000000000000");
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
    expect(goalFactoryPairDeployerAddress).toBe(baseEntrypoints.goalFactoryPairDeployer);
    expect(goalDeploymentRegistryAddress).toBe(baseEntrypoints.goalDeploymentRegistry);
    expect(goalPaymentTerminalAddress).toBe(baseEntrypoints.goalPaymentTerminal);
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
    expect(baseContracts.GoalFactory).toBe(baseEntrypoints.goalFactory);
    expect(baseContracts.BudgetTCRFactory).toBe(baseEntrypoints.budgetTcrFactory);
    expect(baseContracts.GoalFactoryPairDeployer).toBe(baseEntrypoints.goalFactoryPairDeployer);
    expect(baseContracts.GoalDeploymentRegistry).toBe(baseEntrypoints.goalDeploymentRegistry);
    expect(baseContracts.GoalPaymentTerminal).toBe(baseEntrypoints.goalPaymentTerminal);
    expect(baseContracts.CobuildSwap).toBe(baseEntrypoints.cobuildSwap);
    expect(baseContracts.CobuildSwapImpl).toBe(baseImplementations.cobuildSwapImpl);
    expect(baseContracts.CobuildToken).toBe(baseEntrypoints.cobuildToken);
    expect(baseContracts.CustomFlowImpl).toBe(baseImplementations.customFlowImpl);
    expect(baseContracts.LinearSpendPolicyImpl).toBe(baseImplementations.linearSpendPolicyImpl);
    expect(baseContracts.DefaultSubmissionDepositStrategy).toBe(
      baseDefaults.defaultSubmissionDepositStrategy
    );
    expect(baseContracts.DefaultOpenBudgetGatePolicy).toBe(baseDefaults.defaultOpenBudgetGatePolicy);
    expect(baseContracts.DefaultGoalSpendPolicy).toBe(baseDefaults.defaultGoalSpendPolicy);
    expect(baseContracts.DefaultBudgetSpendPolicy).toBe(baseDefaults.defaultBudgetSpendPolicy);
    expect(baseContracts.USDCBase).toBe(baseTokens.usdc);
    expect(baseContracts.REVDeployer).toBe(baseEntrypoints.revDeployer);
    expect(baseContracts.REVLoans).toBe(baseEcosystemContracts.revLoans);
    expect(baseContracts.JBDirectory).toBe(baseEcosystemContracts.jbDirectory);
  });

  it("exports the refreshed Base default-policy and fake UMA rollout values", () => {
    expect(baseDefaults.defaultSubmissionDepositStrategy).toBe(
      "0x0e46e93Fba439303AB347361d73C2Fdd48006d22"
    );
    expect(baseDefaults.defaultOpenBudgetGatePolicy).toBe(
      "0x2E00c4bE6BBEDeea7a600f6B8c4ef21bDBBaf536"
    );
    expect(baseDefaults.defaultGoalSpendPolicy).toBe(
      "0x46c08e7FBa9947Ae14e3C7Df3F82DBfF9e951c20"
    );
    expect(baseDefaults.defaultBudgetSpendPolicy).toBe(
      "0x2CFB6B81C69BDF9c11cBeaafFcb657E4039e3536"
    );
    expect(baseAddresses.config.fakeUmaTreasurySuccessResolver).toBe(
      "0xc9a16Da48BA31C12253Ea438a66247D5d70Df195"
    );
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
