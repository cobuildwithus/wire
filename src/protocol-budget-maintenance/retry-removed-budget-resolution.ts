import {
  buildBudgetMaintenancePlan,
  normalizeBudgetControllerAddress,
  normalizeBudgetItemId,
  type BudgetMaintenancePlan,
} from "./shared.js";

export function buildBudgetRetryRemovedBudgetResolutionPlan(params: {
  network?: string;
  controllerAddress: string;
  itemId: string;
}): BudgetMaintenancePlan {
  const controllerAddress = normalizeBudgetControllerAddress(params.controllerAddress);
  const itemId = normalizeBudgetItemId(params.itemId);

  return buildBudgetMaintenancePlan({
    network: params.network,
    action: "retryRemovedBudgetResolution",
    summary: `Retry terminal resolution for removed budget ${itemId} on controller ${controllerAddress}.`,
    label: "Retry removed budget resolution",
    controllerAddress,
    args: [itemId],
    expectedEvents: [
      "BudgetTreasuryCallFailed",
      "BudgetTerminalizationStepFailed",
      "BudgetStackTerminalizationRetried",
    ],
    itemId,
  });
}
