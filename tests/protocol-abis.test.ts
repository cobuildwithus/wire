import { describe, expect, it } from "vitest";

import * as generated from "../src/generated/abis.js";
import * as protocolAbis from "../src/protocol-abis.js";

function countEvent(abi: readonly unknown[], eventName: string): number {
  return abi
    .filter(
      (item): item is { type: string; name?: string } =>
        typeof item === "object" &&
        item !== null &&
        "type" in item &&
        "name" in item &&
        typeof (item as { type?: unknown }).type === "string",
    )
    .filter((item) => item.type === "event" && item.name === eventName).length;
}

function dedupeAbiItems<T>(abi: readonly T[]): readonly T[] {
  const seen = new Set<string>();

  return abi.filter((item) => {
    const key = JSON.stringify(item);

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

describe("protocol ABI exports", () => {
  it("re-exports wagmi-generated ABIs", () => {
    expect(protocolAbis.cobuildSwapImplAbi).toBe(generated.cobuildSwapImplAbi);
    expect(protocolAbis.cobuildSwapImplAbi.length).toBeGreaterThan(0);
    expect(protocolAbis.cobuildSwapImplAddress).toBe(
      generated.cobuildSwapImplAddress,
    );
    expect(protocolAbis.cobuildSwapImplAddress[8453].toLowerCase()).toBe(
      "0x21a580054e7a5e833f38033f2d958e00e4c50f0f",
    );
    expect(protocolAbis.goalFactoryAbi).toBe(generated.goalFactoryAbi);
    expect(protocolAbis.flowAbi).toBe(generated.flowAbi);
    expect(protocolAbis.goalTreasuryAbi).toBe(generated.goalTreasuryAbi);
    expect(protocolAbis.budgetTreasuryAbi).toBe(generated.budgetTreasuryAbi);
    expect(protocolAbis.premiumEscrowAbi).toBe(generated.premiumEscrowAbi);
    expect(protocolAbis.goalStakeVaultAbi).toBe(generated.goalStakeVaultAbi);
    expect(protocolAbis.budgetStakeLedgerAbi).toBe(
      generated.budgetStakeLedgerAbi,
    );
    expect(protocolAbis.budgetTcrDeployerAbi).toBe(
      generated.budgetTcrDeployerAbi,
    );
    expect(protocolAbis.budgetTcrFactoryAbi).toBe(
      generated.budgetTcrFactoryAbi,
    );
    expect(protocolAbis.goalFlowAllocationLedgerPipelineAbi).toBe(
      generated.goalFlowAllocationLedgerPipelineAbi,
    );
    expect(protocolAbis.goalRevnetSplitHookAbi).toBe(
      generated.goalRevnetSplitHookAbi,
    );
    expect(protocolAbis.erc20VotesArbitratorAbi).toBe(
      generated.erc20VotesArbitratorAbi,
    );
    expect(protocolAbis.roundSubmissionTcrAbi).toBe(
      generated.roundSubmissionTcrAbi,
    );
    expect(protocolAbis.roundPrizeVaultAbi).toBe(generated.roundPrizeVaultAbi);
    expect(protocolAbis.roundFactoryAbi).toBe(generated.roundFactoryAbi);
    expect(protocolAbis.prizePoolSubmissionDepositStrategyAbi).toBe(
      generated.prizePoolSubmissionDepositStrategyAbi,
    );
    expect(protocolAbis.allocationMechanismTcrAbi).toBe(
      generated.allocationMechanismTcrAbi,
    );
    expect(protocolAbis.budgetFlowRouterStrategyAbi).toBe(
      generated.budgetFlowRouterStrategyAbi,
    );
    expect(protocolAbis.cobuildTerminalAbi).toBe(generated.cobuildTerminalAbi);
    expect(protocolAbis.umaTreasurySuccessResolverAbi).toBe(
      generated.umaTreasurySuccessResolverAbi,
    );
    expect(protocolAbis.underwriterSlasherRouterAbi).toBe(
      generated.underwriterSlasherRouterAbi,
    );
    expect(protocolAbis.jurorSlasherRouterAbi).toBe(
      generated.jurorSlasherRouterAbi,
    );
  });

  it("dedupes exact duplicate public ABI events", () => {
    const generatedBudgetTcrFailures = countEvent(
      generated.budgetTcrAbi,
      "BudgetTreasuryCallFailed",
    );
    const publicBudgetTcrFailures = countEvent(
      protocolAbis.budgetTcrAbi,
      "BudgetTreasuryCallFailed",
    );

    expect(publicBudgetTcrFailures).toBeLessThanOrEqual(
      generatedBudgetTcrFailures,
    );
    expect(protocolAbis.budgetTcrAbi).toEqual(
      dedupeAbiItems(generated.budgetTcrAbi),
    );

    const generatedManagedBudgetControllerFailures = countEvent(
      generated.managedBudgetControllerAbi,
      "BudgetTreasuryCallFailed",
    );
    const publicManagedBudgetControllerFailures = countEvent(
      protocolAbis.managedBudgetControllerAbi,
      "BudgetTreasuryCallFailed",
    );

    expect(publicManagedBudgetControllerFailures).toBeLessThanOrEqual(
      generatedManagedBudgetControllerFailures,
    );
    expect(protocolAbis.managedBudgetControllerAbi).toEqual(
      dedupeAbiItems(generated.managedBudgetControllerAbi),
    );
  });

  it("does not expose fallback resolver API", () => {
    expect("resolveGeneratedOrFallbackAbi" in protocolAbis).toBe(false);
  });
});
