import type { BudgetMaintenancePlan } from "./shared.js";
import { buildBudgetMaintenancePlan } from "./shared.js";

export function buildBudgetActivateRegisteredBudgetPlan(params: {
  network?: string;
  controllerAddress: string;
  itemId: string;
}): BudgetMaintenancePlan {
  return buildBudgetMaintenancePlan({
    network: params.network,
    action: "activateRegisteredBudget",
    summary: `Activate registered budget ${params.itemId} on BudgetTCR ${params.controllerAddress}.`,
    label: "Activate registered budget",
    controllerAddress: params.controllerAddress,
    args: [params.itemId],
    expectedEvents: ["BudgetStackDeployed", "BudgetAllocationMechanismDeployed"],
    itemId: params.itemId,
  });
}
