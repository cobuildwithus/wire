import { defineConfig, loadEnv } from "@wagmi/cli";
import { etherscan } from "@wagmi/cli/plugins";

const COBUILD_SWAP_IMPL = "0xe5e248e5877cc4d71986ec6fc2b4cc321c80a23e" as const;

const PROTOCOL_CONTRACT_ADDRESS_ENV = [
  { name: "Flow", env: "CORE_GOAL_FLOW_ADDRESS" },
  { name: "GoalTreasury", env: "CORE_GOAL_TREASURY_ADDRESS" },
  { name: "BudgetTreasury", env: "CORE_BUDGET_TREASURY_ADDRESS" },
  { name: "PremiumEscrow", env: "CORE_PREMIUM_ESCROW_ADDRESS" },
  { name: "GoalStakeVault", env: "CORE_GOAL_STAKE_VAULT_ADDRESS" },
  { name: "BudgetStakeLedger", env: "CORE_BUDGET_STAKE_LEDGER_ADDRESS" },
  { name: "BudgetTCR", env: "CORE_BUDGET_TCR_ADDRESS" },
  { name: "BudgetTCRFactory", env: "CORE_BUDGET_TCR_FACTORY_ADDRESS" },
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

export default defineConfig(() => {
  const env = loadEnv({ mode: process.env.NODE_ENV, envDir: process.cwd() });
  const basescanApiKey = env.BASESCAN_API_KEY;

  if (!basescanApiKey) {
    throw new Error("BASESCAN_API_KEY is required to generate ABIs.");
  }

  const missingProtocolEnvKeys: string[] = [];
  const protocolContracts = PROTOCOL_CONTRACT_ADDRESS_ENV.flatMap((entry) => {
    const address = asAddress(env[entry.env]);
    if (!address) {
      missingProtocolEnvKeys.push(entry.env);
      return [];
    }

    return [{ name: entry.name, address }];
  });

  if (missingProtocolEnvKeys.length > 0) {
    console.warn(
      `[wagmi] Skipping protocol ABI fetch for unset/invalid env vars: ${missingProtocolEnvKeys.join(", ")}`
    );
  }

  return {
    out: "src/generated/abis.ts",
    contracts: [],
    plugins: [
      etherscan({
        apiKey: basescanApiKey,
        chainId: 8453,
        contracts: [{ name: "CobuildSwapImpl", address: COBUILD_SWAP_IMPL }, ...protocolContracts],
      }),
    ],
  };
});
