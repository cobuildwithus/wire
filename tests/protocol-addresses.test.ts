import { isAddress } from "viem";
import { describe, expect, it } from "vitest";

import {
  BASE_SCAFFOLD_START_BLOCK,
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
    expect(BASE_SCAFFOLD_START_BLOCK).toBe(43_315_703);
    expect(goalFactoryAddress).toBe("0xA8a7d64D4bb1Fe9B73F69336a607979CB24B771E");
    expect(budgetTcrFactoryAddress).toBe("0x39E473250eD0cb7b8BF41faeea9f7BdDb97A1d57");
    expect(goalFactoryPairDeployerAddress).toBe("0xee3Df653da8bD16ac15B715Aa7297BCa53cA7bCf");
    expect(goalDeploymentRegistryAddress).toBe("0x5309E5D691d1D02b4776EAd1c4bac2152e9DC225");
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
    expect(baseAddresses.config.scaffoldStartBlock).toBe(BASE_SCAFFOLD_START_BLOCK);
    expect(baseContracts.GoalFactory).toBe(baseEntrypoints.goalFactory);
    expect(baseContracts.BudgetTCRFactory).toBe(baseEntrypoints.budgetTcrFactory);
    expect(baseContracts.GoalFactoryPairDeployer).toBe(baseEntrypoints.goalFactoryPairDeployer);
    expect(baseContracts.GoalDeploymentRegistry).toBe(baseEntrypoints.goalDeploymentRegistry);
    expect(baseContracts.GoalPaymentTerminal).toBe(baseEntrypoints.goalPaymentTerminal);
    expect(baseContracts.CobuildSwap).toBe(baseEntrypoints.cobuildSwap);
    expect(baseContracts.CobuildSwapImpl).toBe(baseImplementations.cobuildSwapImpl);
    expect(baseContracts.CobuildToken).toBe(baseEntrypoints.cobuildToken);
    expect(baseContracts.CustomFlowImpl).toBe(baseImplementations.customFlowImpl);
    expect(baseContracts.ManagedBudgetControllerImpl).toBe(
      baseImplementations.managedBudgetControllerImpl
    );
    expect(baseContracts.ManagedGoalAllocatorStrategyImpl).toBe(
      baseImplementations.managedGoalAllocatorStrategyImpl
    );
    expect(baseContracts.ManagedBudgetChildStrategyImpl).toBe(
      baseImplementations.managedBudgetChildStrategyImpl
    );
    expect(baseContracts.ManagedBudgetChildStrategyFactoryImpl).toBe(
      baseImplementations.managedBudgetChildStrategyFactoryImpl
    );
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
      "0x51f8038804F42E654759D39E6207884dB7259ae4"
    );
    expect(baseDefaults.defaultOpenBudgetGatePolicy).toBe(
      "0x1789a58F923EfCb3266552CD4C7479976d54eDfF"
    );
    expect(baseDefaults.defaultGoalSpendPolicy).toBe(
      "0xe8A9362ad891beEcfF0fF0df58FF44420726daD0"
    );
    expect(baseDefaults.defaultBudgetSpendPolicy).toBe(
      "0xCD7290e0ae4CEcEB3ED03F24233f636FDda0eA88"
    );
    expect(baseAddresses.config.fakeUmaTreasurySuccessResolver).toBe(
      "0x7A370FCB7bF250053b660601a3f50362C47310E9"
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
