import { readFileSync } from "node:fs";
import path from "node:path";

import { defineConfig, loadEnv } from "@wagmi/cli";
import { etherscan } from "@wagmi/cli/plugins";

const COBUILD_SWAP_IMPL = "0xe5e248e5877cc4d71986ec6fc2b4cc321c80a23e" as const;
const V1_CORE_OUT_DIR = path.resolve(process.cwd(), "../v1-core/out");

const LOCAL_ABI_ARTIFACT_CONTRACTS = [
  { name: "GoalFactory", artifact: "GoalFactory.sol/GoalFactory.json" },
  { name: "BudgetTCRFactory", artifact: "BudgetTCRFactory.sol/BudgetTCRFactory.json" },
] as const;

const ETHERSCAN_CONTRACT_ADDRESS_ENV = [
  { name: "Flow", env: "CORE_GOAL_FLOW_ADDRESS" },
  { name: "GoalTreasury", env: "CORE_GOAL_TREASURY_ADDRESS" },
  { name: "BudgetTreasury", env: "CORE_BUDGET_TREASURY_ADDRESS" },
  { name: "PremiumEscrow", env: "CORE_PREMIUM_ESCROW_ADDRESS" },
  { name: "GoalStakeVault", env: "CORE_GOAL_STAKE_VAULT_ADDRESS" },
  { name: "BudgetStakeLedger", env: "CORE_BUDGET_STAKE_LEDGER_ADDRESS" },
  { name: "BudgetTCR", env: "CORE_BUDGET_TCR_ADDRESS" },
  {
    name: "GoalFlowAllocationLedgerPipeline",
    env: "CORE_GOAL_FLOW_ALLOCATION_LEDGER_PIPELINE_ADDRESS",
  },
  { name: "GoalRevnetSplitHook", env: "CORE_GOAL_REVNET_SPLIT_HOOK_ADDRESS" },
] as const;

const ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/;

function asAddress(value: string | undefined): `0x${string}` | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (!ADDRESS_REGEX.test(trimmed)) return null;
  return trimmed as `0x${string}`;
}

function loadArtifactAbi(artifact: string): readonly unknown[] {
  const artifactPath = path.join(V1_CORE_OUT_DIR, artifact);
  const artifactJson = JSON.parse(readFileSync(artifactPath, "utf8")) as { abi?: unknown };

  if (!Array.isArray(artifactJson.abi)) {
    throw new Error(`ABI not found in artifact: ${artifactPath}`);
  }

  return artifactJson.abi;
}

export default defineConfig(() => {
  const env = { ...loadEnv({ mode: process.env.NODE_ENV, envDir: process.cwd() }), ...process.env };
  const basescanApiKey = env.BASESCAN_API_KEY ?? env.ETHERSCAN_API_KEY;

  if (!basescanApiKey) {
    throw new Error("BASESCAN_API_KEY or ETHERSCAN_API_KEY is required to generate ABIs.");
  }

  const missingProtocolEnvKeys: string[] = [];
  const etherscanContracts = ETHERSCAN_CONTRACT_ADDRESS_ENV.map((entry) => {
    const address = asAddress(env[entry.env]);
    if (!address) {
      missingProtocolEnvKeys.push(entry.env);
      return null;
    }

    return { name: entry.name, address };
  });

  if (missingProtocolEnvKeys.length > 0) {
    throw new Error(
      `Missing or invalid required protocol address env vars: ${missingProtocolEnvKeys.join(", ")}`
    );
  }

  return {
    out: "src/generated/abis.ts",
    contracts: [
      { name: "CobuildSwapImpl", address: COBUILD_SWAP_IMPL, abi: [] as const },
      ...LOCAL_ABI_ARTIFACT_CONTRACTS.map((entry) => ({
        name: entry.name,
        abi: loadArtifactAbi(entry.artifact),
      })),
    ],
    plugins: [
      etherscan({
        apiKey: basescanApiKey,
        chainId: 8453,
        contracts: [...(etherscanContracts as {
          name: string;
          address: `0x${string}`;
        }[])],
      }),
    ],
  };
});
