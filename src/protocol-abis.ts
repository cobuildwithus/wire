import {
  budgetTcrAbi as generatedBudgetTcrAbi,
  managedBudgetControllerAbi as generatedManagedBudgetControllerAbi,
} from "./generated/abis.js";

function dedupeAbiItems<const T extends readonly unknown[]>(abi: T): T {
  const seen = new Set<string>();
  let duplicated = false;

  const deduped = abi.filter((item) => {
    const key = JSON.stringify(item);

    if (seen.has(key)) {
      duplicated = true;
      return false;
    }

    seen.add(key);
    return true;
  });

  return (duplicated ? deduped : abi) as T;
}

export const budgetTcrAbi = dedupeAbiItems(generatedBudgetTcrAbi);
export const managedBudgetControllerAbi = dedupeAbiItems(generatedManagedBudgetControllerAbi);

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
