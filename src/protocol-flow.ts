import type { Abi } from "viem";
import type { EvmAddress, HexBytes, HexBytes32 } from "./evm.js";
import { normalizeBytes32, normalizeEvmAddress } from "./evm.js";
import {
  budgetStakeLedgerAbi,
  goalFlowAllocationLedgerPipelineAbi,
} from "./protocol-abis.js";
import {
  buildProtocolCallStep,
  normalizeProtocolBigInt,
  resolveProtocolPlanNetwork,
  serializeProtocolBigInts,
  type BigintLike,
  type ProtocolExecutionPlan,
} from "./protocol-plans.js";
import {
  buildReceiptEventBase,
  mapLatestReceiptEvent,
  mapReceiptEvents,
  requireReceiptAddress,
  requireReceiptBigInt,
  requireReceiptBoolean,
  requireReceiptBytes,
  requireReceiptBytes32,
  requireReceiptNumericBigInt,
  sortReceiptEventsByLogIndex,
  type ReceiptEventBase,
} from "./protocol-receipts.js";

const FLOW_ALLOCATION_PPM_SCALE = 1_000_000n;
const MAX_UINT32 = 4_294_967_295n;

export const flowParticipantAbi = [
  {
    type: "function",
    inputs: [
      { name: "recipientIds", internalType: "bytes32[]", type: "bytes32[]" },
      { name: "allocationsPpm", internalType: "uint32[]", type: "uint32[]" },
    ],
    name: "allocate",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [{ name: "allocationKey", internalType: "uint256", type: "uint256" }],
    name: "syncAllocation",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [{ name: "account", internalType: "address", type: "address" }],
    name: "syncAllocationForAccount",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [{ name: "allocationKey", internalType: "uint256", type: "uint256" }],
    name: "clearStaleAllocation",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      { name: "strategy", internalType: "address", type: "address", indexed: true },
      { name: "allocationKey", internalType: "uint256", type: "uint256", indexed: true },
      { name: "commit", internalType: "bytes32", type: "bytes32", indexed: false },
      { name: "weight", internalType: "uint256", type: "uint256", indexed: false },
    ],
    name: "AllocationCommitted",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      { name: "strategy", internalType: "address", type: "address", indexed: true },
      { name: "allocationKey", internalType: "uint256", type: "uint256", indexed: true },
      { name: "commit", internalType: "bytes32", type: "bytes32", indexed: false },
      { name: "weight", internalType: "uint256", type: "uint256", indexed: false },
      { name: "snapshotVersion", internalType: "uint8", type: "uint8", indexed: false },
      { name: "packedSnapshot", internalType: "bytes", type: "bytes", indexed: false },
    ],
    name: "AllocationSnapshotUpdated",
  },
] as const;

export type FlowAllocationVectorInput = {
  recipientIds: readonly string[];
  allocationsPpm: readonly BigintLike[];
};

export type FlowAllocationVector = {
  recipientIds: readonly HexBytes32[];
  allocationsPpm: readonly number[];
};

export type FlowAllocatePlan = ProtocolExecutionPlan<"flow.allocate"> & {
  flowAddress: EvmAddress;
  recipientIds: readonly HexBytes32[];
  allocationsPpm: readonly number[];
};

export type FlowSyncAllocationPlan = ProtocolExecutionPlan<"flow.sync-allocation"> & {
  flowAddress: EvmAddress;
  allocationKey: string;
};

export type FlowSyncAllocationForAccountPlan =
  ProtocolExecutionPlan<"flow.sync-allocation-for-account"> & {
    flowAddress: EvmAddress;
    account: EvmAddress;
  };

export type FlowClearStaleAllocationPlan =
  ProtocolExecutionPlan<"flow.clear-stale-allocation"> & {
    flowAddress: EvmAddress;
    allocationKey: string;
  };

export type FlowAllocationCommittedEvent = {
  strategy: EvmAddress;
  allocationKey: bigint;
  commit: HexBytes32;
  weight: bigint;
};

export type FlowAllocationSnapshotUpdatedEvent = FlowAllocationCommittedEvent & {
  snapshotVersion: bigint;
  packedSnapshot: HexBytes;
};

export type FlowReceiptSummary = {
  allocationCommitted: FlowAllocationCommittedEvent | null;
  allocationSnapshotUpdated: FlowAllocationSnapshotUpdatedEvent | null;
};

export type FlowReceiptEvent =
  | (ReceiptEventBase & {
      family: "flow";
      eventName: "AllocationCommitted";
      strategy: EvmAddress;
      allocationKey: bigint;
      commit: HexBytes32;
      weight: bigint;
    })
  | (ReceiptEventBase & {
      family: "flow";
      eventName: "AllocationSnapshotUpdated";
      strategy: EvmAddress;
      allocationKey: bigint;
      commit: HexBytes32;
      weight: bigint;
      snapshotVersion: bigint;
      packedSnapshot: HexBytes;
    })
  | (ReceiptEventBase & {
      family: "ledger";
      eventName: "AllocationCheckpointed";
      account: EvmAddress;
      budget: EvmAddress;
      allocatedStake: bigint;
      checkpointTime: bigint;
    })
  | (ReceiptEventBase & {
      family: "pipeline";
      eventName: "ChildAllocationSyncAttempted";
      budgetTreasury: EvmAddress;
      childFlow: EvmAddress;
      strategy: EvmAddress;
      allocationKey: bigint;
      parentFlow: EvmAddress;
      parentStrategy: EvmAddress;
      parentAllocationKey: bigint;
      success: boolean;
    })
  | (ReceiptEventBase & {
      family: "pipeline";
      eventName: "ChildAllocationSyncFailed";
      budgetTreasury: EvmAddress;
      childFlow: EvmAddress;
      strategy: EvmAddress;
      allocationKey: bigint;
      parentFlow: EvmAddress;
      parentStrategy: EvmAddress;
      parentAllocationKey: bigint;
      reason: HexBytes;
    })
  | (ReceiptEventBase & {
      family: "pipeline";
      eventName: "ChildAllocationSyncSkipped";
      budgetTreasury: EvmAddress;
      childFlow: EvmAddress;
      parentFlow: EvmAddress;
      parentStrategy: EvmAddress;
      parentAllocationKey: bigint;
      reason: HexBytes32;
    })
  | (ReceiptEventBase & {
      family: "pipeline";
      eventName: "ChildSyncDebtCleared";
      account: EvmAddress;
      budgetTreasury: EvmAddress;
      childFlow: EvmAddress;
      reason: HexBytes32;
    })
  | (ReceiptEventBase & {
      family: "pipeline";
      eventName: "ChildSyncDebtOpened";
      account: EvmAddress;
      budgetTreasury: EvmAddress;
      childFlow: EvmAddress;
      childStrategy: EvmAddress;
      allocationKey: bigint;
      reason: HexBytes32;
    });

export function normalizeFlowAllocationVector(
  input: FlowAllocationVectorInput
): FlowAllocationVector {
  if (input.recipientIds.length === 0) {
    throw new Error("recipientIds must include at least one recipient.");
  }
  if (input.recipientIds.length !== input.allocationsPpm.length) {
    throw new Error("recipientIds and allocationsPpm must have the same length.");
  }

  const recipientIds = input.recipientIds.map((recipientId, index) =>
    normalizeBytes32(recipientId, `recipientIds[${index}]`)
  );

  for (let index = 1; index < recipientIds.length; index += 1) {
    if (recipientIds[index]! <= recipientIds[index - 1]!) {
      throw new Error("recipientIds must be sorted ascending with no duplicates.");
    }
  }

  let sum = 0n;
  const allocationsPpm = input.allocationsPpm.map((allocation, index) => {
    const normalized = normalizeProtocolBigInt(allocation, `allocationsPpm[${index}]`);
    if (normalized === 0n) {
      throw new Error(`allocationsPpm[${index}] must be greater than zero.`);
    }
    if (normalized > MAX_UINT32) {
      throw new Error(`allocationsPpm[${index}] must fit in uint32.`);
    }
    sum += normalized;
    return Number(normalized);
  });

  if (sum !== FLOW_ALLOCATION_PPM_SCALE) {
    throw new Error(`allocationsPpm must sum to ${FLOW_ALLOCATION_PPM_SCALE.toString()}.`);
  }

  return {
    recipientIds,
    allocationsPpm,
  };
}

export function buildFlowAllocatePlan(params: {
  network?: string;
  flowAddress: string;
  recipientIds: readonly string[];
  allocationsPpm: readonly BigintLike[];
}): FlowAllocatePlan {
  const flowAddress = normalizeEvmAddress(params.flowAddress, "flowAddress");
  const allocation = normalizeFlowAllocationVector({
    recipientIds: params.recipientIds,
    allocationsPpm: params.allocationsPpm,
  });

  return {
    network: resolveProtocolPlanNetwork(params.network),
    action: "flow.allocate",
    riskClass: "economic",
    summary: `Update default-strategy allocations on flow ${flowAddress}.`,
    flowAddress,
    recipientIds: allocation.recipientIds,
    allocationsPpm: allocation.allocationsPpm,
    preconditions: [],
    expectedEvents: ["AllocationCommitted"],
    steps: [
      buildProtocolCallStep({
        contract: "Flow",
        functionName: "allocate",
        label: "Update flow allocation",
        to: flowAddress,
        abi: flowParticipantAbi as Abi,
        args: [allocation.recipientIds, allocation.allocationsPpm],
      }),
    ],
  };
}

function buildFlowMaintenanceCall(params: {
  network?: string;
  flowAddress: string;
  functionName: "syncAllocation" | "syncAllocationForAccount" | "clearStaleAllocation";
  label: string;
  args: readonly unknown[];
}) {
  const flowAddress = normalizeEvmAddress(params.flowAddress, "flowAddress");

  return {
    network: resolveProtocolPlanNetwork(params.network),
    flowAddress,
    steps: [
      buildProtocolCallStep({
        contract: "Flow",
        functionName: params.functionName,
        label: params.label,
        to: flowAddress,
        abi: flowParticipantAbi as Abi,
        args: params.args,
      }),
    ],
  };
}

export function buildFlowSyncAllocationForAccountPlan(params: {
  network?: string;
  flowAddress: string;
  account: string;
}): FlowSyncAllocationForAccountPlan {
  const account = normalizeEvmAddress(params.account, "account");
  const execution = buildFlowMaintenanceCall({
    ...(params.network !== undefined ? { network: params.network } : {}),
    flowAddress: params.flowAddress,
    functionName: "syncAllocationForAccount",
    label: "Sync flow allocation for account",
    args: [account],
  });

  return {
    network: execution.network,
    action: "flow.sync-allocation-for-account",
    riskClass: "maintenance",
    summary: `Permissionlessly resync ${account}'s default allocation on flow ${execution.flowAddress}.`,
    flowAddress: execution.flowAddress,
    account,
    preconditions: [],
    steps: execution.steps,
  };
}

export function buildFlowSyncAllocationPlan(params: {
  network?: string;
  flowAddress: string;
  allocationKey: BigintLike;
}): FlowSyncAllocationPlan {
  const allocationKey = normalizeProtocolBigInt(params.allocationKey, "allocationKey");
  const execution = buildFlowMaintenanceCall({
    ...(params.network !== undefined ? { network: params.network } : {}),
    flowAddress: params.flowAddress,
    functionName: "syncAllocation",
    label: "Sync flow allocation",
    args: [allocationKey],
  });

  return {
    network: execution.network,
    action: "flow.sync-allocation",
    riskClass: "maintenance",
    summary: `Permissionlessly resync allocation ${allocationKey.toString()} on flow ${execution.flowAddress}.`,
    flowAddress: execution.flowAddress,
    allocationKey: allocationKey.toString(),
    preconditions: [],
    steps: execution.steps,
  };
}

export function buildFlowClearStaleAllocationPlan(params: {
  network?: string;
  flowAddress: string;
  allocationKey: BigintLike;
}): FlowClearStaleAllocationPlan {
  const allocationKey = normalizeProtocolBigInt(params.allocationKey, "allocationKey");
  const execution = buildFlowMaintenanceCall({
    ...(params.network !== undefined ? { network: params.network } : {}),
    flowAddress: params.flowAddress,
    functionName: "clearStaleAllocation",
    label: "Clear stale flow allocation",
    args: [allocationKey],
  });

  return {
    network: execution.network,
    action: "flow.clear-stale-allocation",
    riskClass: "maintenance",
    summary: `Clear stale allocation ${allocationKey.toString()} on flow ${execution.flowAddress}.`,
    flowAddress: execution.flowAddress,
    allocationKey: allocationKey.toString(),
    preconditions: [],
    steps: execution.steps,
  };
}

export function decodeFlowReceipt(logs: readonly unknown[]): FlowReceiptSummary {
  const allocationCommitted = mapLatestReceiptEvent(
    flowParticipantAbi as Abi,
    logs,
    "AllocationCommitted",
    (args) => ({
      strategy: requireReceiptAddress(args, "strategy", "AllocationCommitted"),
      allocationKey: requireReceiptBigInt(args, "allocationKey", "AllocationCommitted"),
      commit: requireReceiptBytes32(args, "commit", "AllocationCommitted"),
      weight: requireReceiptBigInt(args, "weight", "AllocationCommitted"),
    })
  );

  const allocationSnapshotUpdated = mapLatestReceiptEvent(
    flowParticipantAbi as Abi,
    logs,
    "AllocationSnapshotUpdated",
    (args) => ({
      strategy: requireReceiptAddress(args, "strategy", "AllocationSnapshotUpdated"),
      allocationKey: requireReceiptBigInt(args, "allocationKey", "AllocationSnapshotUpdated"),
      commit: requireReceiptBytes32(args, "commit", "AllocationSnapshotUpdated"),
      weight: requireReceiptBigInt(args, "weight", "AllocationSnapshotUpdated"),
      snapshotVersion: requireReceiptNumericBigInt(
        args,
        "snapshotVersion",
        "AllocationSnapshotUpdated"
      ),
      packedSnapshot: requireReceiptBytes(args, "packedSnapshot", "AllocationSnapshotUpdated"),
    })
  );

  return {
    allocationCommitted,
    allocationSnapshotUpdated,
  };
}

export function serializeFlowReceipt(summary: FlowReceiptSummary): Record<string, unknown> {
  return serializeProtocolBigInts(summary) as Record<string, unknown>;
}

export function decodeFlowReceiptEvents(logs: readonly unknown[]): FlowReceiptEvent[] {
  const flowEvents: FlowReceiptEvent[] = [
    ...mapReceiptEvents(flowParticipantAbi as Abi, logs, "AllocationCommitted", (args, log) => ({
        ...buildReceiptEventBase(log),
        family: "flow" as const,
        eventName: "AllocationCommitted" as const,
        strategy: requireReceiptAddress(args, "strategy", "AllocationCommitted"),
        allocationKey: requireReceiptBigInt(args, "allocationKey", "AllocationCommitted"),
        commit: requireReceiptBytes32(args, "commit", "AllocationCommitted"),
        weight: requireReceiptBigInt(args, "weight", "AllocationCommitted"),
      })),
    ...mapReceiptEvents(flowParticipantAbi as Abi, logs, "AllocationSnapshotUpdated", (args, log) => ({
        ...buildReceiptEventBase(log),
        family: "flow" as const,
        eventName: "AllocationSnapshotUpdated" as const,
        strategy: requireReceiptAddress(args, "strategy", "AllocationSnapshotUpdated"),
        allocationKey: requireReceiptBigInt(args, "allocationKey", "AllocationSnapshotUpdated"),
        commit: requireReceiptBytes32(args, "commit", "AllocationSnapshotUpdated"),
        weight: requireReceiptBigInt(args, "weight", "AllocationSnapshotUpdated"),
        snapshotVersion: requireReceiptNumericBigInt(
          args,
          "snapshotVersion",
          "AllocationSnapshotUpdated"
        ),
        packedSnapshot: requireReceiptBytes(args, "packedSnapshot", "AllocationSnapshotUpdated"),
      })),
  ];

  const ledgerEvents = mapReceiptEvents(
    budgetStakeLedgerAbi as Abi,
    logs,
    "AllocationCheckpointed",
    (args, log) => ({
      ...buildReceiptEventBase(log),
      family: "ledger" as const,
      eventName: "AllocationCheckpointed" as const,
      account: requireReceiptAddress(args, "account", "AllocationCheckpointed"),
      budget: requireReceiptAddress(args, "budget", "AllocationCheckpointed"),
      allocatedStake: requireReceiptBigInt(args, "allocatedStake", "AllocationCheckpointed"),
      checkpointTime: requireReceiptBigInt(args, "checkpointTime", "AllocationCheckpointed"),
    })
  );

  const pipelineEvents: FlowReceiptEvent[] = [
    ...mapReceiptEvents(
      goalFlowAllocationLedgerPipelineAbi as Abi,
      logs,
      "ChildAllocationSyncAttempted",
      (args, log) => ({
        ...buildReceiptEventBase(log),
        family: "pipeline" as const,
        eventName: "ChildAllocationSyncAttempted" as const,
        budgetTreasury: requireReceiptAddress(args, "budgetTreasury", "ChildAllocationSyncAttempted"),
        childFlow: requireReceiptAddress(args, "childFlow", "ChildAllocationSyncAttempted"),
        strategy: requireReceiptAddress(args, "strategy", "ChildAllocationSyncAttempted"),
        allocationKey: requireReceiptBigInt(args, "allocationKey", "ChildAllocationSyncAttempted"),
        parentFlow: requireReceiptAddress(args, "parentFlow", "ChildAllocationSyncAttempted"),
        parentStrategy: requireReceiptAddress(args, "parentStrategy", "ChildAllocationSyncAttempted"),
        parentAllocationKey: requireReceiptBigInt(
          args,
          "parentAllocationKey",
          "ChildAllocationSyncAttempted"
        ),
        success: requireReceiptBoolean(args, "success", "ChildAllocationSyncAttempted"),
      })
    ),
    ...mapReceiptEvents(
      goalFlowAllocationLedgerPipelineAbi as Abi,
      logs,
      "ChildAllocationSyncFailed",
      (args, log) => ({
        ...buildReceiptEventBase(log),
        family: "pipeline" as const,
        eventName: "ChildAllocationSyncFailed" as const,
        budgetTreasury: requireReceiptAddress(args, "budgetTreasury", "ChildAllocationSyncFailed"),
        childFlow: requireReceiptAddress(args, "childFlow", "ChildAllocationSyncFailed"),
        strategy: requireReceiptAddress(args, "strategy", "ChildAllocationSyncFailed"),
        allocationKey: requireReceiptBigInt(args, "allocationKey", "ChildAllocationSyncFailed"),
        parentFlow: requireReceiptAddress(args, "parentFlow", "ChildAllocationSyncFailed"),
        parentStrategy: requireReceiptAddress(args, "parentStrategy", "ChildAllocationSyncFailed"),
        parentAllocationKey: requireReceiptBigInt(
          args,
          "parentAllocationKey",
          "ChildAllocationSyncFailed"
        ),
        reason: requireReceiptBytes(args, "reason", "ChildAllocationSyncFailed"),
      })
    ),
    ...mapReceiptEvents(
      goalFlowAllocationLedgerPipelineAbi as Abi,
      logs,
      "ChildAllocationSyncSkipped",
      (args, log) => ({
        ...buildReceiptEventBase(log),
        family: "pipeline" as const,
        eventName: "ChildAllocationSyncSkipped" as const,
        budgetTreasury: requireReceiptAddress(args, "budgetTreasury", "ChildAllocationSyncSkipped"),
        childFlow: requireReceiptAddress(args, "childFlow", "ChildAllocationSyncSkipped"),
        parentFlow: requireReceiptAddress(args, "parentFlow", "ChildAllocationSyncSkipped"),
        parentStrategy: requireReceiptAddress(args, "parentStrategy", "ChildAllocationSyncSkipped"),
        parentAllocationKey: requireReceiptBigInt(
          args,
          "parentAllocationKey",
          "ChildAllocationSyncSkipped"
        ),
        reason: requireReceiptBytes32(args, "reason", "ChildAllocationSyncSkipped"),
      })
    ),
    ...mapReceiptEvents(
      goalFlowAllocationLedgerPipelineAbi as Abi,
      logs,
      "ChildSyncDebtCleared",
      (args, log) => ({
        ...buildReceiptEventBase(log),
        family: "pipeline" as const,
        eventName: "ChildSyncDebtCleared" as const,
        account: requireReceiptAddress(args, "account", "ChildSyncDebtCleared"),
        budgetTreasury: requireReceiptAddress(args, "budgetTreasury", "ChildSyncDebtCleared"),
        childFlow: requireReceiptAddress(args, "childFlow", "ChildSyncDebtCleared"),
        reason: requireReceiptBytes32(args, "reason", "ChildSyncDebtCleared"),
      })
    ),
    ...mapReceiptEvents(
      goalFlowAllocationLedgerPipelineAbi as Abi,
      logs,
      "ChildSyncDebtOpened",
      (args, log) => ({
        ...buildReceiptEventBase(log),
        family: "pipeline" as const,
        eventName: "ChildSyncDebtOpened" as const,
        account: requireReceiptAddress(args, "account", "ChildSyncDebtOpened"),
        budgetTreasury: requireReceiptAddress(args, "budgetTreasury", "ChildSyncDebtOpened"),
        childFlow: requireReceiptAddress(args, "childFlow", "ChildSyncDebtOpened"),
        childStrategy: requireReceiptAddress(args, "childStrategy", "ChildSyncDebtOpened"),
        allocationKey: requireReceiptBigInt(args, "allocationKey", "ChildSyncDebtOpened"),
        reason: requireReceiptBytes32(args, "reason", "ChildSyncDebtOpened"),
      })
    ),
  ];

  return sortReceiptEventsByLogIndex([...flowEvents, ...ledgerEvents, ...pipelineEvents]);
}

export function serializeFlowReceiptEvents(
  events: readonly FlowReceiptEvent[]
): readonly Record<string, unknown>[] {
  return serializeProtocolBigInts(events) as readonly Record<string, unknown>[];
}
