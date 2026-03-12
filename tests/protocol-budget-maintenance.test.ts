import { describe, expect, it } from "vitest";
import { encodeFunctionData } from "viem";
import {
  budgetTcrAbi,
  buildBudgetActivateRegisteredBudgetPlan,
  buildBudgetFinalizeRemovedBudgetPlan,
  buildBudgetPruneTerminalBudgetPlan,
  buildBudgetRetryRemovedBudgetResolutionPlan,
  buildBudgetSyncBudgetTreasuriesPlan,
} from "../src/index.js";

const CONTROLLER = "0x1111111111111111111111111111111111111111" as const;
const BUDGET_TREASURY = "0x2222222222222222222222222222222222222222" as const;
const ITEM_ID_A = `0x${"aa".repeat(32)}` as `0x${string}`;
const ITEM_ID_B = `0x${"bb".repeat(32)}` as `0x${string}`;

describe("protocol budget maintenance contract", () => {
  it("builds an activateRegisteredBudget maintenance plan", () => {
    const plan = buildBudgetActivateRegisteredBudgetPlan({
      controllerAddress: CONTROLLER,
      itemId: ITEM_ID_A,
    });

    expect(plan).toMatchObject({
      family: "budget",
      action: "activateRegisteredBudget",
      controllerAddress: CONTROLLER,
      itemId: ITEM_ID_A,
      network: "base",
      riskClass: "maintenance",
      expectedEvents: expect.arrayContaining(["BudgetStackDeployed"]),
    });
    expect(plan.steps).toHaveLength(1);
    expect(plan.steps[0]).toMatchObject({
      kind: "contract-call",
      contract: "BudgetTCR",
      functionName: "activateRegisteredBudget",
      transaction: {
        to: CONTROLLER,
      },
    });

    const step = plan.steps[0];
    if (!step || step.kind !== "contract-call") {
      throw new Error("missing activate step");
    }
    expect(step.transaction.data).toBe(
      encodeFunctionData({
        abi: budgetTcrAbi,
        functionName: "activateRegisteredBudget",
        args: [ITEM_ID_A],
      })
    );
  });

  it("builds finalize and retry removal maintenance plans", () => {
    const finalizePlan = buildBudgetFinalizeRemovedBudgetPlan({
      controllerAddress: CONTROLLER,
      itemId: ITEM_ID_A,
    });
    expect(finalizePlan).toMatchObject({
      family: "budget",
      action: "finalizeRemovedBudget",
      controllerAddress: CONTROLLER,
      itemId: ITEM_ID_A,
      expectedEvents: expect.arrayContaining(["BudgetStackRemovalHandled"]),
    });
    expect(finalizePlan.steps[0]).toMatchObject({
      kind: "contract-call",
      functionName: "finalizeRemovedBudget",
    });
    const finalizeStep = finalizePlan.steps[0];
    if (!finalizeStep || finalizeStep.kind !== "contract-call") {
      throw new Error("missing finalize step");
    }
    expect(finalizeStep.transaction.data).toBe(
      encodeFunctionData({
        abi: budgetTcrAbi,
        functionName: "finalizeRemovedBudget",
        args: [ITEM_ID_A],
      })
    );

    const retryPlan = buildBudgetRetryRemovedBudgetResolutionPlan({
      controllerAddress: CONTROLLER,
      itemId: ITEM_ID_A,
    });
    expect(retryPlan).toMatchObject({
      family: "budget",
      action: "retryRemovedBudgetResolution",
      controllerAddress: CONTROLLER,
      itemId: ITEM_ID_A,
      expectedEvents: expect.arrayContaining(["BudgetStackTerminalizationRetried"]),
    });
    expect(retryPlan.steps[0]).toMatchObject({
      kind: "contract-call",
      functionName: "retryRemovedBudgetResolution",
    });
    const retryStep = retryPlan.steps[0];
    if (!retryStep || retryStep.kind !== "contract-call") {
      throw new Error("missing retry step");
    }
    expect(retryStep.transaction.data).toBe(
      encodeFunctionData({
        abi: budgetTcrAbi,
        functionName: "retryRemovedBudgetResolution",
        args: [ITEM_ID_A],
      })
    );
  });

  it("builds prune and sync maintenance plans", () => {
    const prunePlan = buildBudgetPruneTerminalBudgetPlan({
      controllerAddress: CONTROLLER,
      budgetTreasuryAddress: BUDGET_TREASURY,
    });
    expect(prunePlan).toMatchObject({
      family: "budget",
      action: "pruneTerminalBudget",
      controllerAddress: CONTROLLER,
      budgetTreasuryAddress: BUDGET_TREASURY,
      expectedEvents: expect.arrayContaining(["BudgetTerminalRecipientPruned"]),
    });
    expect(prunePlan.steps[0]).toMatchObject({
      kind: "contract-call",
      functionName: "pruneTerminalBudget",
    });
    const pruneStep = prunePlan.steps[0];
    if (!pruneStep || pruneStep.kind !== "contract-call") {
      throw new Error("missing prune step");
    }
    expect(pruneStep.transaction.data).toBe(
      encodeFunctionData({
        abi: budgetTcrAbi,
        functionName: "pruneTerminalBudget",
        args: [BUDGET_TREASURY],
      })
    );

    const syncPlan = buildBudgetSyncBudgetTreasuriesPlan({
      controllerAddress: CONTROLLER,
      itemIds: [ITEM_ID_A, ITEM_ID_B],
    });
    expect(syncPlan).toMatchObject({
      family: "budget",
      action: "syncBudgetTreasuries",
      controllerAddress: CONTROLLER,
      itemIds: [ITEM_ID_A, ITEM_ID_B],
      expectedEvents: expect.arrayContaining(["BudgetTreasuryBatchSyncAttempted"]),
    });
    expect(syncPlan.steps[0]).toMatchObject({
      kind: "contract-call",
      functionName: "syncBudgetTreasuries",
    });
    const syncStep = syncPlan.steps[0];
    if (!syncStep || syncStep.kind !== "contract-call") {
      throw new Error("missing sync step");
    }
    expect(syncStep.transaction.data).toBe(
      encodeFunctionData({
        abi: budgetTcrAbi,
        functionName: "syncBudgetTreasuries",
        args: [[ITEM_ID_A, ITEM_ID_B]],
      })
    );

    expect(
      buildBudgetSyncBudgetTreasuriesPlan({
        controllerAddress: CONTROLLER,
        itemIds: [ITEM_ID_A],
      }).summary
    ).toContain("1 item ID");
  });
});
