import {
  buildBudgetMaintenancePlan,
  normalizeBudgetControllerAddress,
  normalizeBudgetItemIds,
  type BudgetMaintenancePlan,
} from "./shared.js";

export function buildBudgetSyncBudgetTreasuriesPlan(params: {
  network?: string;
  controllerAddress: string;
  itemIds: readonly string[];
}): BudgetMaintenancePlan {
  const controllerAddress = normalizeBudgetControllerAddress(params.controllerAddress);
  const itemIds = normalizeBudgetItemIds(params.itemIds, "itemIds");
  const itemCountLabel = itemIds.length === 1 ? "item ID" : "item IDs";

  return buildBudgetMaintenancePlan({
    network: params.network,
    action: "syncBudgetTreasuries",
    summary: `Permissionlessly sync budget treasury state for ${itemIds.length} ${itemCountLabel} on controller ${controllerAddress}.`,
    label: "Sync budget treasuries",
    controllerAddress,
    args: [itemIds],
    expectedEvents: [
      "BudgetTreasuryBatchSyncAttempted",
      "BudgetTreasuryBatchSyncSkipped",
      "BudgetTreasuryCallFailed",
      "BudgetCreditCapEnforcementFailed",
    ],
    itemIds,
  });
}
