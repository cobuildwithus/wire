import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { defineConfig, loadEnv } from "@wagmi/cli";
import { etherscan } from "@wagmi/cli/plugins";
import type { Abi } from "viem";

import { baseConfig, baseEntrypoints, baseImplementations } from "./src/protocol-addresses.js";

const BASE_CHAIN_ID = 8453 as const;
const CONFIG_DIR = dirname(fileURLToPath(import.meta.url));
const DEFAULT_V1_CORE_ROOT = "../v1-core";

type ContractAddressConfig = {
  name: string;
  address: `0x${string}`;
};

type ProtocolAbiSourceMode = "basescan" | "local";

type ProtocolContractConfig = ContractAddressConfig & {
  artifact: string;
};

const PROTOCOL_CONTRACTS: readonly ProtocolContractConfig[] = [
  {
    name: "GoalFactory",
    address: baseEntrypoints.goalFactory,
    artifact: "GoalFactory.sol/GoalFactory.json",
  },
  {
    name: "BudgetTCRFactory",
    address: baseEntrypoints.budgetTcrFactory,
    artifact: "BudgetTCRFactory.sol/BudgetTCRFactory.json",
  },
  {
    name: "Flow",
    address: baseImplementations.customFlowImpl,
    artifact: "Flow.sol/Flow.json",
  },
  {
    name: "GoalTreasury",
    address: baseImplementations.goalTreasuryImpl,
    artifact: "GoalTreasury.sol/GoalTreasury.json",
  },
  {
    name: "BudgetTreasury",
    address: baseImplementations.budgetTreasuryImpl,
    artifact: "BudgetTreasury.sol/BudgetTreasury.json",
  },
  {
    name: "PremiumEscrow",
    address: baseImplementations.premiumEscrowImpl,
    artifact: "PremiumEscrow.sol/PremiumEscrow.json",
  },
  {
    name: "GoalStakeVault",
    address: baseImplementations.goalStakeVaultImpl,
    artifact: "StakeVault.sol/StakeVault.json",
  },
  {
    name: "BudgetStakeLedger",
    address: baseImplementations.budgetStakeLedgerImpl,
    artifact: "BudgetStakeLedger.sol/BudgetStakeLedger.json",
  },
  {
    name: "BudgetTCR",
    address: baseImplementations.budgetTcrImpl,
    artifact: "BudgetTCR.sol/BudgetTCR.json",
  },
  {
    name: "GoalFlowAllocationLedgerPipeline",
    address: baseImplementations.goalFlowAllocationLedgerPipelineImpl,
    artifact: "GoalFlowAllocationLedgerPipeline.sol/GoalFlowAllocationLedgerPipeline.json",
  },
  {
    name: "GoalRevnetSplitHook",
    address: baseImplementations.goalRevnetSplitHookImpl,
    artifact: "GoalRevnetSplitHook.sol/GoalRevnetSplitHook.json",
  },
  {
    name: "UMATreasurySuccessResolver",
    address: baseConfig.fakeUmaTreasurySuccessResolver,
    artifact: "FakeUMATreasurySuccessResolver.sol/FakeUMATreasurySuccessResolver.json",
  },
  {
    name: "UnderwriterSlasherRouter",
    address: baseImplementations.underwriterSlasherRouterImpl,
    artifact: "UnderwriterSlasherRouter.sol/UnderwriterSlasherRouter.json",
  },
  {
    name: "JurorSlasherRouter",
    address: baseImplementations.jurorSlasherRouterImpl,
    artifact: "JurorSlasherRouter.sol/JurorSlasherRouter.json",
  },
  {
    name: "ERC20VotesArbitrator",
    address: baseImplementations.erc20VotesArbitratorImpl,
    artifact: "ERC20VotesArbitrator.sol/ERC20VotesArbitrator.json",
  },
  {
    name: "BudgetTCRDeployer",
    address: baseImplementations.budgetTcrDeployerImpl,
    artifact: "BudgetTCRDeployer.sol/BudgetTCRDeployer.json",
  },
  {
    name: "RoundSubmissionTCR",
    address: baseImplementations.roundSubmissionTcrImpl,
    artifact: "RoundSubmissionTCR.sol/RoundSubmissionTCR.json",
  },
  {
    name: "RoundPrizeVault",
    address: baseImplementations.roundPrizeVaultImpl,
    artifact: "RoundPrizeVault.sol/RoundPrizeVault.json",
  },
  {
    name: "PrizePoolSubmissionDepositStrategy",
    address: baseImplementations.prizePoolSubmissionDepositStrategyImpl,
    artifact: "PrizePoolSubmissionDepositStrategy.sol/PrizePoolSubmissionDepositStrategy.json",
  },
  {
    name: "RoundFactory",
    address: baseImplementations.roundFactoryImpl,
    artifact: "RoundFactory.sol/RoundFactory.json",
  },
  {
    name: "AllocationMechanismTCR",
    address: baseImplementations.allocationMechanismTcrImpl,
    artifact: "AllocationMechanismTCR.sol/AllocationMechanismTCR.json",
  },
  {
    name: "BudgetFlowRouterStrategy",
    address: baseImplementations.budgetFlowRouterStrategyImpl,
    artifact: "BudgetFlowRouterStrategy.sol/BudgetFlowRouterStrategy.json",
  },
  {
    name: "CobuildSwapImpl",
    address: baseImplementations.cobuildSwapImpl,
    artifact: "CobuildSwap.sol/CobuildSwap.json",
  },
  {
    name: "CobuildTerminal",
    address: baseEntrypoints.cobuildTerminal,
    artifact: "CobuildTerminal.sol/CobuildTerminal.json",
  },
] as const;

function parseAbiSourceMode(value: string | undefined): ProtocolAbiSourceMode {
  const normalized = (value ?? "basescan").toLowerCase();

  if (normalized === "basescan" || normalized === "local") {
    return normalized;
  }

  throw new Error(
    `WIRE_ABI_SOURCE must be one of: local, basescan. Received: ${normalized}`
  );
}

function resolveV1CoreRoot(env: Record<string, string | undefined>): string {
  return resolve(CONFIG_DIR, env.WIRE_V1_CORE_PATH ?? DEFAULT_V1_CORE_ROOT);
}

function readArtifactAbi(artifactPath: string): Abi {
  const artifact = JSON.parse(readFileSync(artifactPath, "utf8")) as { abi?: Abi };

  if (!artifact.abi?.length) {
    throw new Error(`Artifact ABI is missing or empty: ${artifactPath}`);
  }

  return artifact.abi;
}

function getMissingLocalArtifacts(artifactsDir: string): string[] {
  return PROTOCOL_CONTRACTS.map(({ artifact }) => artifact).filter(
    (artifact) => !existsSync(resolve(artifactsDir, artifact))
  );
}

function getLocalContracts(artifactsDir: string) {
  return PROTOCOL_CONTRACTS.map(({ artifact, ...contract }) => ({
    ...contract,
    abi: readArtifactAbi(resolve(artifactsDir, artifact)),
  }));
}

export default defineConfig(() => {
  const env = { ...loadEnv({ mode: process.env.NODE_ENV, envDir: process.cwd() }), ...process.env };
  const abiSourceMode = parseAbiSourceMode(env.WIRE_ABI_SOURCE);
  const v1CoreRoot = resolveV1CoreRoot(env);
  const localArtifactsDir = resolve(v1CoreRoot, "out");
  const missingLocalArtifacts = getMissingLocalArtifacts(localArtifactsDir);
  const canUseLocalArtifacts = missingLocalArtifacts.length === 0;

  if (abiSourceMode === "local" && canUseLocalArtifacts) {
    console.log("[wire:wagmi] Using sibling v1-core Forge artifacts for protocol ABI generation.");

    return {
      out: "src/generated/abis.ts",
      contracts: getLocalContracts(localArtifactsDir),
      plugins: [],
    };
  }

  if (abiSourceMode !== "basescan") {
    throw new Error(
      `WIRE_ABI_SOURCE=local requires sibling v1-core Forge artifacts. Missing: ${missingLocalArtifacts.join(
        ", "
      )}`
    );
  }

  const basescanApiKey = env.BASESCAN_API_KEY ?? env.ETHERSCAN_API_KEY;

  if (!basescanApiKey) {
    throw new Error(
      "BASESCAN_API_KEY or ETHERSCAN_API_KEY is required when ABI generation falls back to Basescan."
    );
  }

  if (abiSourceMode === "auto") {
    console.log("[wire:wagmi] Local v1-core Forge artifacts unavailable; falling back to Basescan.");
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
