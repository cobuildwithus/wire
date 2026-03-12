import { budgetTcrAbi } from "../protocol-abis.js";
import type { EvmAddress, HexBytes32 } from "../evm.js";
import { normalizeBytes32, normalizeEvmAddress } from "../evm.js";
import {
  buildProtocolCallStep,
  resolveProtocolPlanNetwork,
  type ProtocolExecutionPlan,
} from "../protocol-plans.js";

export const BUDGET_MAINTENANCE_ACTIONS = [
  "activateRegisteredBudget",
  "finalizeRemovedBudget",
  "retryRemovedBudgetResolution",
  "pruneTerminalBudget",
  "syncBudgetTreasuries",
] as const;

export type BudgetMaintenanceAction = (typeof BUDGET_MAINTENANCE_ACTIONS)[number];

export type BudgetMaintenancePlan = ProtocolExecutionPlan<BudgetMaintenanceAction> & {
  family: "budget";
  controllerAddress: EvmAddress;
  itemId?: HexBytes32;
  itemIds?: readonly HexBytes32[];
  budgetTreasuryAddress?: EvmAddress;
};

export function normalizeBudgetControllerAddress(value: string): EvmAddress {
  return normalizeEvmAddress(value, "controllerAddress");
}

export function normalizeBudgetItemId(value: string, label = "itemId"): HexBytes32 {
  return normalizeBytes32(value, label);
}

export function normalizeBudgetItemIds(
  values: readonly string[],
  label = "itemIds"
): readonly HexBytes32[] {
  if (values.length === 0) {
    throw new Error(`${label} must include at least one item ID.`);
  }

  return values.map((value, index) => normalizeBudgetItemId(value, `${label}[${index}]`));
}

export function buildBudgetMaintenancePlan(params: {
  network?: string | undefined;
  action: BudgetMaintenanceAction;
  summary: string;
  label: string;
  controllerAddress: string;
  args: readonly unknown[];
  expectedEvents: readonly string[];
  itemId?: string;
  itemIds?: readonly string[];
  budgetTreasuryAddress?: string;
}): BudgetMaintenancePlan {
  const controllerAddress = normalizeBudgetControllerAddress(params.controllerAddress);

  return {
    family: "budget",
    action: params.action,
    controllerAddress,
    ...(params.itemId ? { itemId: normalizeBudgetItemId(params.itemId) } : {}),
    ...(params.itemIds ? { itemIds: normalizeBudgetItemIds(params.itemIds) } : {}),
    ...(params.budgetTreasuryAddress
      ? {
          budgetTreasuryAddress: normalizeEvmAddress(
            params.budgetTreasuryAddress,
            "budgetTreasuryAddress"
          ),
        }
      : {}),
    network: resolveProtocolPlanNetwork(params.network),
    riskClass: "maintenance",
    summary: params.summary,
    preconditions: [],
    steps: [
      buildProtocolCallStep({
        contract: "BudgetTCR",
        functionName: params.action,
        label: params.label,
        to: controllerAddress,
        abi: budgetTcrAbi,
        args: params.args,
      }),
    ],
    expectedEvents: [...params.expectedEvents],
  };
}
