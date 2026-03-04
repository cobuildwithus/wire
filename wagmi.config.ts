import { readFileSync } from "node:fs";
import path from "node:path";

import { defineConfig } from "@wagmi/cli";

import { baseConfig, baseEntrypoints, baseImplementations } from "./src/protocol-addresses.js";

const BASE_CHAIN_ID = 8453 as const;
const V1_CORE_OUT_DIR = path.resolve(process.cwd(), "../v1-core/out");

type ContractArtifactConfig = {
  name: string;
  artifact: string;
  address: `0x${string}`;
};

const PROTOCOL_CONTRACTS: readonly ContractArtifactConfig[] = [
  {
    name: "GoalFactory",
    artifact: "GoalFactory.sol/GoalFactory.json",
    address: baseEntrypoints.goalFactory,
  },
  {
    name: "BudgetTCRFactory",
    artifact: "BudgetTCRFactory.sol/BudgetTCRFactory.json",
    address: baseEntrypoints.budgetTcrFactory,
  },
  {
    name: "Flow",
    artifact: "Flow.sol/Flow.json",
    address: baseImplementations.customFlowImpl,
  },
  {
    name: "GoalTreasury",
    artifact: "GoalTreasury.sol/GoalTreasury.json",
    address: baseImplementations.goalTreasuryImpl,
  },
  {
    name: "BudgetTreasury",
    artifact: "BudgetTreasury.sol/BudgetTreasury.json",
    address: baseImplementations.budgetTreasuryImpl,
  },
  {
    name: "PremiumEscrow",
    artifact: "PremiumEscrow.sol/PremiumEscrow.json",
    address: baseImplementations.premiumEscrowImpl,
  },
  {
    name: "GoalStakeVault",
    artifact: "StakeVault.sol/StakeVault.json",
    address: baseImplementations.goalStakeVaultImpl,
  },
  {
    name: "BudgetStakeLedger",
    artifact: "BudgetStakeLedger.sol/BudgetStakeLedger.json",
    address: baseImplementations.budgetStakeLedgerImpl,
  },
  {
    name: "BudgetTCR",
    artifact: "BudgetTCR.sol/BudgetTCR.json",
    address: baseImplementations.budgetTcrImpl,
  },
  {
    name: "GoalFlowAllocationLedgerPipeline",
    artifact: "GoalFlowAllocationLedgerPipeline.sol/GoalFlowAllocationLedgerPipeline.json",
    address: baseImplementations.goalFlowAllocationLedgerPipelineImpl,
  },
  {
    name: "GoalRevnetSplitHook",
    artifact: "GoalRevnetSplitHook.sol/GoalRevnetSplitHook.json",
    address: baseImplementations.goalRevnetSplitHookImpl,
  },
  {
    name: "UMATreasurySuccessResolver",
    artifact: "UMATreasurySuccessResolver.sol/UMATreasurySuccessResolver.json",
    address: baseConfig.fakeUmaTreasurySuccessResolver,
  },
  {
    name: "UnderwriterSlasherRouter",
    artifact: "UnderwriterSlasherRouter.sol/UnderwriterSlasherRouter.json",
    address: baseImplementations.underwriterSlasherRouterImpl,
  },
  {
    name: "JurorSlasherRouter",
    artifact: "JurorSlasherRouter.sol/JurorSlasherRouter.json",
    address: baseImplementations.jurorSlasherRouterImpl,
  },
  {
    name: "ERC20VotesArbitrator",
    artifact: "ERC20VotesArbitrator.sol/ERC20VotesArbitrator.json",
    address: baseImplementations.erc20VotesArbitratorImpl,
  },
  {
    name: "BudgetTCRDeployer",
    artifact: "BudgetTCRDeployer.sol/BudgetTCRDeployer.json",
    address: baseImplementations.budgetTcrDeployerImpl,
  },
  {
    name: "RoundSubmissionTCR",
    artifact: "RoundSubmissionTCR.sol/RoundSubmissionTCR.json",
    address: baseImplementations.roundSubmissionTcrImpl,
  },
  {
    name: "RoundPrizeVault",
    artifact: "RoundPrizeVault.sol/RoundPrizeVault.json",
    address: baseImplementations.roundPrizeVaultImpl,
  },
  {
    name: "PrizePoolSubmissionDepositStrategy",
    artifact: "PrizePoolSubmissionDepositStrategy.sol/PrizePoolSubmissionDepositStrategy.json",
    address: baseImplementations.prizePoolSubmissionDepositStrategyImpl,
  },
  {
    name: "RoundFactory",
    artifact: "RoundFactory.sol/RoundFactory.json",
    address: baseImplementations.roundFactoryImpl,
  },
  {
    name: "AllocationMechanismTCR",
    artifact: "AllocationMechanismTCR.sol/AllocationMechanismTCR.json",
    address: baseImplementations.allocationMechanismTcrImpl,
  },
  {
    name: "BudgetFlowRouterStrategy",
    artifact: "BudgetFlowRouterStrategy.sol/BudgetFlowRouterStrategy.json",
    address: baseImplementations.budgetFlowRouterStrategyImpl,
  },
  {
    name: "CobuildSwapImpl",
    artifact: "CobuildSwap.sol/CobuildSwap.json",
    address: baseImplementations.cobuildSwapImpl,
  },
  {
    name: "CobuildTerminal",
    artifact: "CobuildTerminal.sol/CobuildTerminal.json",
    address: baseEntrypoints.cobuildTerminal,
  },
] as const;

function loadArtifactAbi(artifact: string): readonly unknown[] {
  const artifactPath = path.join(V1_CORE_OUT_DIR, artifact);
  const artifactJson = JSON.parse(readFileSync(artifactPath, "utf8")) as { abi?: unknown };

  if (!Array.isArray(artifactJson.abi)) {
    throw new Error(`ABI not found in artifact: ${artifactPath}`);
  }

  return artifactJson.abi;
}

function baseAddress(address: `0x${string}`): Record<number, `0x${string}`> {
  return {
    [BASE_CHAIN_ID]: address,
  };
}

export default defineConfig(() => ({
  out: "src/generated/abis.ts",
  contracts: PROTOCOL_CONTRACTS.map((entry) => ({
    name: entry.name,
    abi: loadArtifactAbi(entry.artifact),
    address: baseAddress(entry.address),
  })),
}));
