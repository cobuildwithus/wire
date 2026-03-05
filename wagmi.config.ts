import { defineConfig, loadEnv } from "@wagmi/cli";
import { etherscan } from "@wagmi/cli/plugins";

import { baseConfig, baseEntrypoints, baseImplementations } from "./src/protocol-addresses.js";

const BASE_CHAIN_ID = 8453 as const;

type ContractAddressConfig = {
  name: string;
  address: `0x${string}`;
};

const PROTOCOL_CONTRACTS: readonly ContractAddressConfig[] = [
  {
    name: "GoalFactory",
    address: baseEntrypoints.goalFactory,
  },
  {
    name: "BudgetTCRFactory",
    address: baseEntrypoints.budgetTcrFactory,
  },
  {
    name: "Flow",
    address: baseImplementations.customFlowImpl,
  },
  {
    name: "GoalTreasury",
    address: baseImplementations.goalTreasuryImpl,
  },
  {
    name: "BudgetTreasury",
    address: baseImplementations.budgetTreasuryImpl,
  },
  {
    name: "PremiumEscrow",
    address: baseImplementations.premiumEscrowImpl,
  },
  {
    name: "GoalStakeVault",
    address: baseImplementations.goalStakeVaultImpl,
  },
  {
    name: "BudgetStakeLedger",
    address: baseImplementations.budgetStakeLedgerImpl,
  },
  {
    name: "BudgetTCR",
    address: baseImplementations.budgetTcrImpl,
  },
  {
    name: "GoalFlowAllocationLedgerPipeline",
    address: baseImplementations.goalFlowAllocationLedgerPipelineImpl,
  },
  {
    name: "GoalRevnetSplitHook",
    address: baseImplementations.goalRevnetSplitHookImpl,
  },
  {
    name: "UMATreasurySuccessResolver",
    address: baseConfig.fakeUmaTreasurySuccessResolver,
  },
  {
    name: "UnderwriterSlasherRouter",
    address: baseImplementations.underwriterSlasherRouterImpl,
  },
  {
    name: "JurorSlasherRouter",
    address: baseImplementations.jurorSlasherRouterImpl,
  },
  {
    name: "ERC20VotesArbitrator",
    address: baseImplementations.erc20VotesArbitratorImpl,
  },
  {
    name: "BudgetTCRDeployer",
    address: baseImplementations.budgetTcrDeployerImpl,
  },
  {
    name: "RoundSubmissionTCR",
    address: baseImplementations.roundSubmissionTcrImpl,
  },
  {
    name: "RoundPrizeVault",
    address: baseImplementations.roundPrizeVaultImpl,
  },
  {
    name: "PrizePoolSubmissionDepositStrategy",
    address: baseImplementations.prizePoolSubmissionDepositStrategyImpl,
  },
  {
    name: "RoundFactory",
    address: baseImplementations.roundFactoryImpl,
  },
  {
    name: "AllocationMechanismTCR",
    address: baseImplementations.allocationMechanismTcrImpl,
  },
  {
    name: "BudgetFlowRouterStrategy",
    address: baseImplementations.budgetFlowRouterStrategyImpl,
  },
  {
    name: "CobuildSwapImpl",
    address: baseImplementations.cobuildSwapImpl,
  },
  {
    name: "CobuildTerminal",
    address: baseEntrypoints.cobuildTerminal,
  },
] as const;

export default defineConfig(() => {
  const env = { ...loadEnv({ mode: process.env.NODE_ENV, envDir: process.cwd() }), ...process.env };
  const basescanApiKey = env.BASESCAN_API_KEY ?? env.ETHERSCAN_API_KEY;

  if (!basescanApiKey) {
    throw new Error("BASESCAN_API_KEY or ETHERSCAN_API_KEY is required to generate ABIs.");
  }

  return {
    out: "src/generated/abis.ts",
    contracts: [],
    plugins: [
      etherscan({
        apiKey: basescanApiKey,
        chainId: BASE_CHAIN_ID,
        contracts: [...PROTOCOL_CONTRACTS],
      }),
    ],
  };
});
