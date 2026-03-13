import {
  budgetTcrAbi as generatedBudgetTcrAbi,
  managedBudgetControllerAbi as generatedManagedBudgetControllerAbi,
} from "./generated/abis.js";

function dedupeAbiItems<const T extends readonly unknown[]>(abi: T): T {
  const seen = new Set<string>();

  return abi.filter((item) => {
    const sizeBefore = seen.size;
    seen.add(JSON.stringify(item));
    return seen.size > sizeBefore;
  }) as unknown as T;
}

export const budgetTcrAbi = dedupeAbiItems(generatedBudgetTcrAbi);
export const managedBudgetControllerAbi = dedupeAbiItems(
  generatedManagedBudgetControllerAbi,
);

export {
  allocationMechanismTcrAbi,
  budgetSingleAllocatorStrategyAbi,
  budgetSingleAllocatorStrategyFactoryAbi,
  budgetFlowRouterStrategyAbi,
  budgetStakeLedgerAbi,
  budgetTcrDeployerAbi,
  budgetTcrFactoryAbi,
  budgetTreasuryAbi,
  cobuildSwapImplAbi,
  cobuildSwapImplAddress,
  cobuildSwapImplConfig,
  cobuildTerminalAbi,
  erc20VotesArbitratorAbi,
  flowAbi,
  goalFactoryAbi,
  goalDeploymentRegistryAbi,
  goalFlowAllocationLedgerPipelineAbi,
  goalRevnetSplitHookAbi,
  goalStakeVaultAbi,
  goalTreasuryAbi,
  jurorSlasherRouterAbi,
  linearSpendPolicyAbi,
  premiumEscrowAbi,
  prizePoolSubmissionDepositStrategyAbi,
  roundFactoryAbi,
  roundPrizeVaultAbi,
  roundSubmissionTcrAbi,
  singleAllocatorStrategyAbi,
  stakeCoverageGatePolicyAbi,
  umaTreasurySuccessResolverAbi,
  underwriterSlasherRouterAbi,
} from "./generated/abis.js";
