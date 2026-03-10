import { describe, expect, it } from "vitest";
import { encodeAbiParameters, encodeEventTopics, encodeFunctionData } from "viem";
import {
  budgetStakeLedgerAbi,
  buildFlowAllocatePlan,
  buildFlowClearStaleAllocationPlan,
  buildFlowSyncAllocationForAccountPlan,
  decodeFlowReceipt,
  decodeFlowReceiptEvents,
  flowParticipantAbi,
  goalFlowAllocationLedgerPipelineAbi,
  normalizeFlowAllocationVector,
  serializeFlowReceipt,
  serializeFlowReceiptEvents,
} from "../src/index.js";

const FLOW = "0x1111111111111111111111111111111111111111";
const ACCOUNT = "0x2222222222222222222222222222222222222222";
const STRATEGY = "0x3333333333333333333333333333333333333333";
const BUDGET = "0x4444444444444444444444444444444444444444";
const CHILD_FLOW = "0x5555555555555555555555555555555555555555";
const CHILD_STRATEGY = "0x6666666666666666666666666666666666666666";
const PARENT_FLOW = "0x7777777777777777777777777777777777777777";
const RECIPIENT_A = "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
const RECIPIENT_B = "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb";
const COMMIT = "0xcccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc";
const SKIP_REASON = "0xdddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd";

function buildEventLog(params: {
  abi: readonly unknown[];
  address: string;
  eventName: string;
  args: Record<string, unknown>;
  logIndex: number;
}) {
  const event = params.abi.find(
    (entry) =>
      typeof entry === "object" &&
      entry !== null &&
      (entry as any).type === "event" &&
      (entry as any).name === params.eventName
  );
  if (!event || (event as any).type !== "event") {
    throw new Error(`Missing event ${params.eventName}`);
  }

  return {
    address: params.address,
    blockHash: "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    blockNumber: 1n,
    data: encodeAbiParameters(
      (event as any).inputs.filter((input: any) => !input.indexed),
      (event as any).inputs
        .filter((input: any) => !input.indexed)
        .map((input: any) => params.args[input.name]) as readonly unknown[]
    ),
    logIndex: params.logIndex,
    removed: false,
    topics: encodeEventTopics({
      abi: [event],
      eventName: params.eventName,
      args: Object.fromEntries(
        (event as any).inputs
          .filter((input: any) => input.indexed)
          .map((input: any) => [input.name, params.args[input.name]])
      ),
    }),
    transactionHash: "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
    transactionIndex: 0,
  } as const;
}

describe("protocol flow contract", () => {
  it("normalizes allocation vectors and builds participant plans", () => {
    expect(() =>
      normalizeFlowAllocationVector({
        recipientIds: [],
        allocationsPpm: [],
      })
    ).toThrow("recipientIds must include at least one recipient.");

    expect(
      normalizeFlowAllocationVector({
        recipientIds: [RECIPIENT_A.toUpperCase(), RECIPIENT_B],
        allocationsPpm: [600_000, "400000"],
      })
    ).toEqual({
      recipientIds: [RECIPIENT_A, RECIPIENT_B],
      allocationsPpm: [600_000, 400_000],
    });

    expect(() =>
      normalizeFlowAllocationVector({
        recipientIds: [RECIPIENT_A, RECIPIENT_B],
        allocationsPpm: [600_000],
      })
    ).toThrow("recipientIds and allocationsPpm must have the same length.");

    expect(() =>
      normalizeFlowAllocationVector({
        recipientIds: [RECIPIENT_B, RECIPIENT_A],
        allocationsPpm: [600_000, 400_000],
      })
    ).toThrow("recipientIds must be sorted ascending with no duplicates.");

    expect(() =>
      normalizeFlowAllocationVector({
        recipientIds: [RECIPIENT_A, RECIPIENT_B],
        allocationsPpm: [0, 1_000_000],
      })
    ).toThrow("allocationsPpm[0] must be greater than zero.");

    expect(() =>
      normalizeFlowAllocationVector({
        recipientIds: [RECIPIENT_A],
        allocationsPpm: [999_999],
      })
    ).toThrow("allocationsPpm must sum to 1000000.");
    expect(() =>
      normalizeFlowAllocationVector({
        recipientIds: [RECIPIENT_A],
        allocationsPpm: [4_294_967_296n],
      })
    ).toThrow("allocationsPpm[0] must fit in uint32.");

    const allocatePlan = buildFlowAllocatePlan({
      flowAddress: FLOW,
      recipientIds: [RECIPIENT_A, RECIPIENT_B],
      allocationsPpm: [600_000, 400_000],
    });
    expect(allocatePlan.steps[0]).toMatchObject({
      kind: "contract-call",
      functionName: "allocate",
    });
    const allocateStep = allocatePlan.steps[0];
    if (!allocateStep || allocateStep.kind !== "contract-call") {
      throw new Error("missing allocate step");
    }
    expect(allocateStep.transaction.data).toBe(
      encodeFunctionData({
        abi: flowParticipantAbi,
        functionName: "allocate",
        args: [[RECIPIENT_A, RECIPIENT_B], [600_000, 400_000]],
      })
    );

    expect(
      buildFlowSyncAllocationForAccountPlan({
        flowAddress: FLOW,
        account: ACCOUNT,
      }).steps[0]
    ).toMatchObject({
      kind: "contract-call",
      functionName: "syncAllocationForAccount",
    });

    expect(
      buildFlowClearStaleAllocationPlan({
        flowAddress: FLOW,
        strategyAddress: STRATEGY,
        allocationKey: 12n,
      }).steps[0]
    ).toMatchObject({
      kind: "contract-call",
      functionName: "clearStaleAllocation",
    });
  });

  it("decodes flow allocation receipts and serializes bigint fields", () => {
    expect(decodeFlowReceipt([])).toEqual({
      allocationCommitted: null,
      allocationSnapshotUpdated: null,
    });

    const summary = decodeFlowReceipt([
      buildEventLog({
        abi: flowParticipantAbi,
        address: FLOW,
        eventName: "AllocationCommitted",
        args: {
          strategy: STRATEGY,
          allocationKey: 8n,
          commit: COMMIT,
          weight: 20n,
        },
        logIndex: 0,
      }),
      buildEventLog({
        abi: flowParticipantAbi,
        address: FLOW,
        eventName: "AllocationSnapshotUpdated",
        args: {
          strategy: STRATEGY,
          allocationKey: 8n,
          commit: COMMIT,
          weight: 20n,
          snapshotVersion: 1n,
          packedSnapshot: "0x1234",
        },
        logIndex: 1,
      }),
    ]);

    expect(summary.allocationCommitted).toEqual({
      strategy: STRATEGY,
      allocationKey: 8n,
      commit: COMMIT,
      weight: 20n,
    });
    expect(summary.allocationSnapshotUpdated).toEqual({
      strategy: STRATEGY,
      allocationKey: 8n,
      commit: COMMIT,
      weight: 20n,
      snapshotVersion: 1n,
      packedSnapshot: "0x1234",
    });

    expect(serializeFlowReceipt(summary)).toMatchObject({
      allocationCommitted: {
        allocationKey: "8",
        weight: "20",
      },
      allocationSnapshotUpdated: {
        snapshotVersion: "1",
      },
    });
  });

  it("decodes flow pipeline and ledger receipt events in log order", () => {
    expect(decodeFlowReceiptEvents([])).toEqual([]);

    const events = decodeFlowReceiptEvents([
      buildEventLog({
        abi: flowParticipantAbi,
        address: FLOW,
        eventName: "AllocationCommitted",
        args: {
          strategy: STRATEGY,
          allocationKey: 8n,
          commit: COMMIT,
          weight: 20n,
        },
        logIndex: 0,
      }),
      buildEventLog({
        abi: budgetStakeLedgerAbi,
        address: BUDGET,
        eventName: "AllocationCheckpointed",
        args: {
          account: ACCOUNT,
          budget: BUDGET,
          allocatedStake: 21n,
          checkpointTime: 22n,
        },
        logIndex: 1,
      }),
      buildEventLog({
        abi: goalFlowAllocationLedgerPipelineAbi,
        address: FLOW,
        eventName: "ChildAllocationSyncAttempted",
        args: {
          budgetTreasury: BUDGET,
          childFlow: CHILD_FLOW,
          strategy: CHILD_STRATEGY,
          allocationKey: 9n,
          parentFlow: PARENT_FLOW,
          parentStrategy: STRATEGY,
          parentAllocationKey: 8n,
          success: true,
        },
        logIndex: 2,
      }),
      buildEventLog({
        abi: goalFlowAllocationLedgerPipelineAbi,
        address: FLOW,
        eventName: "ChildAllocationSyncFailed",
        args: {
          budgetTreasury: BUDGET,
          childFlow: CHILD_FLOW,
          strategy: CHILD_STRATEGY,
          allocationKey: 9n,
          parentFlow: PARENT_FLOW,
          parentStrategy: STRATEGY,
          parentAllocationKey: 8n,
          reason: "0x1234",
        },
        logIndex: 3,
      }),
      buildEventLog({
        abi: goalFlowAllocationLedgerPipelineAbi,
        address: FLOW,
        eventName: "ChildAllocationSyncSkipped",
        args: {
          budgetTreasury: BUDGET,
          childFlow: CHILD_FLOW,
          parentFlow: PARENT_FLOW,
          parentStrategy: STRATEGY,
          parentAllocationKey: 8n,
          reason: SKIP_REASON,
        },
        logIndex: 4,
      }),
      buildEventLog({
        abi: goalFlowAllocationLedgerPipelineAbi,
        address: FLOW,
        eventName: "ChildSyncDebtCleared",
        args: {
          account: ACCOUNT,
          budgetTreasury: BUDGET,
          childFlow: CHILD_FLOW,
          reason: SKIP_REASON,
        },
        logIndex: 5,
      }),
      buildEventLog({
        abi: goalFlowAllocationLedgerPipelineAbi,
        address: FLOW,
        eventName: "ChildSyncDebtOpened",
        args: {
          account: ACCOUNT,
          budgetTreasury: BUDGET,
          childFlow: CHILD_FLOW,
          childStrategy: CHILD_STRATEGY,
          allocationKey: 9n,
          reason: SKIP_REASON,
        },
        logIndex: 6,
      }),
    ]);

    expect(events.map((event) => event.eventName)).toEqual([
      "AllocationCommitted",
      "AllocationCheckpointed",
      "ChildAllocationSyncAttempted",
      "ChildAllocationSyncFailed",
      "ChildAllocationSyncSkipped",
      "ChildSyncDebtCleared",
      "ChildSyncDebtOpened",
    ]);
    expect(events[1]).toMatchObject({
      family: "ledger",
      account: ACCOUNT,
      budget: BUDGET,
      allocatedStake: 21n,
    });
    expect(events[2]).toMatchObject({
      family: "pipeline",
      success: true,
      parentAllocationKey: 8n,
    });
    expect(events[3]).toMatchObject({
      family: "pipeline",
      reason: "0x1234",
    });
    expect(events[6]).toMatchObject({
      family: "pipeline",
      childStrategy: CHILD_STRATEGY,
      allocationKey: 9n,
    });

    expect(serializeFlowReceiptEvents(events)).toMatchObject([
      {
        eventName: "AllocationCommitted",
        allocationKey: "8",
      },
      {
        eventName: "AllocationCheckpointed",
        allocatedStake: "21",
      },
      {
        eventName: "ChildAllocationSyncAttempted",
        parentAllocationKey: "8",
      },
      {
        eventName: "ChildAllocationSyncFailed",
        reason: "0x1234",
      },
      {
        eventName: "ChildAllocationSyncSkipped",
        reason: SKIP_REASON,
      },
      {
        eventName: "ChildSyncDebtCleared",
        reason: SKIP_REASON,
      },
      {
        eventName: "ChildSyncDebtOpened",
        allocationKey: "9",
      },
    ]);
  });
});
