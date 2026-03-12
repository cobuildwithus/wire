import type { BudgetMaintenancePlan } from "./shared.js";
import {
  buildBudgetMaintenancePlan,
  normalizeBudgetControllerAddress,
  normalizeBudgetItemId,
} from "./shared.js";

export function buildBudgetFinalizeRemovedBudgetPlan(params: {
  network?: string;
  controllerAddress: string;
  itemId: string;
}): BudgetMaintenancePlan {
  const controllerAddress = normalizeBudgetControllerAddress(params.controllerAddress);
  const itemId = normalizeBudgetItemId(params.itemId);

  return buildBudgetMaintenancePlan({
    network: params.network,
    action: "finalizeRemovedBudget",
    summary: `Finalize removed budget ${itemId} on BudgetTCR ${controllerAddress}.`,
    label: "Finalize removed budget",
    controllerAddress,
    args: [itemId],
    expectedEvents: ["BudgetStackRemovalHandled"],
    itemId,
  });
}
