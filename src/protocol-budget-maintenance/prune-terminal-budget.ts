import { normalizeEvmAddress } from "../evm.js";
import {
  buildBudgetMaintenancePlan,
  normalizeBudgetControllerAddress,
  type BudgetMaintenancePlan,
} from "./shared.js";

export function buildBudgetPruneTerminalBudgetPlan(params: {
  network?: string;
  controllerAddress: string;
  budgetTreasuryAddress: string;
}): BudgetMaintenancePlan {
  const controllerAddress = normalizeBudgetControllerAddress(params.controllerAddress);
  const budgetTreasuryAddress = normalizeEvmAddress(
    params.budgetTreasuryAddress,
    "budgetTreasuryAddress"
  );

  return buildBudgetMaintenancePlan({
    network: params.network,
    action: "pruneTerminalBudget",
    summary: `Permissionlessly prune terminal budget treasury ${budgetTreasuryAddress} from controller ${controllerAddress} and resync the parent goal treasury.`,
    label: "Prune terminal budget recipient",
    controllerAddress,
    args: [budgetTreasuryAddress],
    expectedEvents: [
      "BudgetTerminalRecipientPruned",
      "BudgetTreasuryCallFailed",
      "FlowRateSynced",
      "FlowRateSyncManualInterventionRequired",
      "FlowRateSyncCallFailed",
    ],
    budgetTreasuryAddress,
  });
}
