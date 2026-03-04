import { readFileSync } from "node:fs";
import path from "node:path";

import { defineConfig } from "@wagmi/cli";

const COBUILD_SWAP_IMPL = "0xe5e248e5877cc4d71986ec6fc2b4cc321c80a23e" as const;
const V1_CORE_OUT_DIR = path.resolve(process.cwd(), "../v1-core/out");

const V1_CORE_ABI_ARTIFACTS = [
  { name: "GoalFactory", artifact: "GoalFactory.sol/GoalFactory.json" },
  { name: "Flow", artifact: "CustomFlow.sol/CustomFlow.json" },
  { name: "GoalTreasury", artifact: "GoalTreasury.sol/GoalTreasury.json" },
  { name: "BudgetTreasury", artifact: "BudgetTreasury.sol/BudgetTreasury.json" },
  { name: "PremiumEscrow", artifact: "PremiumEscrow.sol/PremiumEscrow.json" },
  { name: "GoalStakeVault", artifact: "StakeVault.sol/StakeVault.json" },
  { name: "BudgetStakeLedger", artifact: "BudgetStakeLedger.sol/BudgetStakeLedger.json" },
  { name: "BudgetTCR", artifact: "BudgetTCR.sol/BudgetTCR.json" },
  { name: "BudgetTCRFactory", artifact: "BudgetTCRFactory.sol/BudgetTCRFactory.json" },
  {
    name: "GoalFlowAllocationLedgerPipeline",
    artifact: "GoalFlowAllocationLedgerPipeline.sol/GoalFlowAllocationLedgerPipeline.json",
  },
  { name: "GoalRevnetSplitHook", artifact: "GoalRevnetSplitHook.sol/GoalRevnetSplitHook.json" },
] as const;

function loadArtifactAbi(artifact: string): readonly unknown[] {
  const artifactPath = path.join(V1_CORE_OUT_DIR, artifact);
  const artifactJson = JSON.parse(readFileSync(artifactPath, "utf8")) as { abi?: unknown };

  if (!Array.isArray(artifactJson.abi)) {
    throw new Error(`ABI not found in artifact: ${artifactPath}`);
  }

  return artifactJson.abi;
}

export default defineConfig({
  out: "src/generated/abis.ts",
  contracts: [
    { name: "CobuildSwapImpl", address: COBUILD_SWAP_IMPL, abi: [] as const },
    ...V1_CORE_ABI_ARTIFACTS.map((entry) => ({ name: entry.name, abi: loadArtifactAbi(entry.artifact) })),
  ],
});
