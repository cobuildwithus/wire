import { parseEventLogs, type Abi } from "viem";
import type { EvmAddress, HexBytes, HexBytes32 } from "./evm.js";
import {
  normalizeBytes32,
  normalizeEvmAddress,
  normalizeHexByteString,
} from "./evm.js";
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
    inputs: [{ name: "account", internalType: "address", type: "address" }],
    name: "syncAllocationForAccount",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "strategy", internalType: "address", type: "address" },
      { name: "allocationKey", internalType: "uint256", type: "uint256" },
    ],
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

export type FlowSyncAllocationForAccountPlan =
  ProtocolExecutionPlan<"flow.sync-allocation-for-account"> & {
    flowAddress: EvmAddress;
    account: EvmAddress;
  };

export type FlowClearStaleAllocationPlan =
  ProtocolExecutionPlan<"flow.clear-stale-allocation"> & {
    flowAddress: EvmAddress;
    strategyAddress: EvmAddress;
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

type ReceiptEventBase = {
  contractAddress: EvmAddress;
  logIndex: number | null;
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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function requireAddress(value: Record<string, unknown>, key: string, label: string): EvmAddress {
  const rawValue = value[key];
  if (typeof rawValue !== "string") {
    throw new Error(`${label} field "${key}" is missing.`);
  }
  return normalizeEvmAddress(rawValue, `${label}.${key}`);
}

function requireBytes(value: Record<string, unknown>, key: string, label: string): HexBytes {
  const rawValue = value[key];
  if (typeof rawValue !== "string") {
    throw new Error(`${label} field "${key}" is missing.`);
  }
  return normalizeHexByteString(rawValue, `${label}.${key}`);
}

function requireBytes32(value: Record<string, unknown>, key: string, label: string): HexBytes32 {
  const rawValue = value[key];
  if (typeof rawValue !== "string") {
    throw new Error(`${label} field "${key}" is missing.`);
  }
  return normalizeBytes32(rawValue, `${label}.${key}`);
}

function requireBigInt(value: Record<string, unknown>, key: string, label: string): bigint {
  const rawValue = value[key];
  if (typeof rawValue !== "bigint") {
    throw new Error(`${label} field "${key}" is missing.`);
  }
  return rawValue;
}

function requireBoolean(value: Record<string, unknown>, key: string, label: string): boolean {
  const rawValue = value[key];
  if (typeof rawValue !== "boolean") {
    throw new Error(`${label} field "${key}" is missing.`);
  }
  return rawValue;
}

function buildReceiptBase(log: { address?: string; logIndex?: number }): ReceiptEventBase {
  if (typeof log.address !== "string") {
    throw new Error("receipt log address is missing.");
  }

  return {
    contractAddress: normalizeEvmAddress(log.address, "receiptLog.address"),
    logIndex:
      typeof log.logIndex === "number" && Number.isInteger(log.logIndex) ? log.logIndex : null,
  };
}

function sortReceiptEvents(events: readonly FlowReceiptEvent[]): FlowReceiptEvent[] {
  return [...events].sort((left, right) => {
    const leftIndex = left.logIndex ?? Number.MAX_SAFE_INTEGER;
    const rightIndex = right.logIndex ?? Number.MAX_SAFE_INTEGER;
    return leftIndex - rightIndex;
  });
}

function requireNumericBigInt(value: Record<string, unknown>, key: string, label: string): bigint {
  const rawValue = value[key];
  if (typeof rawValue === "bigint") {
    return rawValue;
  }
  if (typeof rawValue === "number" && Number.isInteger(rawValue) && rawValue >= 0) {
    return BigInt(rawValue);
  }
  throw new Error(`${label} field "${key}" is missing.`);
}

function decodeLatestEvent(logs: readonly unknown[], eventName: string) {
  return parseEventLogs({
    abi: flowParticipantAbi as Abi,
    logs: logs as any[],
    eventName,
    strict: false,
  }).at(-1);
}

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

export function buildFlowSyncAllocationForAccountPlan(params: {
  network?: string;
  flowAddress: string;
  account: string;
}): FlowSyncAllocationForAccountPlan {
  const flowAddress = normalizeEvmAddress(params.flowAddress, "flowAddress");
  const account = normalizeEvmAddress(params.account, "account");

  return {
    network: resolveProtocolPlanNetwork(params.network),
    action: "flow.sync-allocation-for-account",
    riskClass: "maintenance",
    summary: `Permissionlessly resync ${account}'s default allocation on flow ${flowAddress}.`,
    flowAddress,
    account,
    preconditions: [],
    steps: [
      buildProtocolCallStep({
        contract: "Flow",
        functionName: "syncAllocationForAccount",
        label: "Sync flow allocation for account",
        to: flowAddress,
        abi: flowParticipantAbi as Abi,
        args: [account],
      }),
    ],
  };
}

export function buildFlowClearStaleAllocationPlan(params: {
  network?: string;
  flowAddress: string;
  strategyAddress: string;
  allocationKey: BigintLike;
}): FlowClearStaleAllocationPlan {
  const flowAddress = normalizeEvmAddress(params.flowAddress, "flowAddress");
  const strategyAddress = normalizeEvmAddress(params.strategyAddress, "strategyAddress");
  const allocationKey = normalizeProtocolBigInt(params.allocationKey, "allocationKey");

  return {
    network: resolveProtocolPlanNetwork(params.network),
    action: "flow.clear-stale-allocation",
    riskClass: "maintenance",
    summary: `Clear stale allocation ${allocationKey.toString()} on flow ${flowAddress}.`,
    flowAddress,
    strategyAddress,
    allocationKey: allocationKey.toString(),
    preconditions: [],
    steps: [
      buildProtocolCallStep({
        contract: "Flow",
        functionName: "clearStaleAllocation",
        label: "Clear stale flow allocation",
        to: flowAddress,
        abi: flowParticipantAbi as Abi,
        args: [strategyAddress, allocationKey],
      }),
    ],
  };
}

export function decodeFlowReceipt(logs: readonly unknown[]): FlowReceiptSummary {
  const allocationCommitted = (() => {
    const latest = decodeLatestEvent(logs, "AllocationCommitted");
    if (!latest) {
      return null;
    }

    const args = latest.args as unknown;
    if (!isRecord(args)) {
      throw new Error("AllocationCommitted event args are missing.");
    }

    return {
      strategy: requireAddress(args, "strategy", "AllocationCommitted"),
      allocationKey: requireBigInt(args, "allocationKey", "AllocationCommitted"),
      commit: requireBytes32(args, "commit", "AllocationCommitted"),
      weight: requireBigInt(args, "weight", "AllocationCommitted"),
    };
  })();

  const allocationSnapshotUpdated = (() => {
    const latest = decodeLatestEvent(logs, "AllocationSnapshotUpdated");
    if (!latest) {
      return null;
    }

    const args = latest.args as unknown;
    if (!isRecord(args)) {
      throw new Error("AllocationSnapshotUpdated event args are missing.");
    }

    return {
      strategy: requireAddress(args, "strategy", "AllocationSnapshotUpdated"),
      allocationKey: requireBigInt(args, "allocationKey", "AllocationSnapshotUpdated"),
      commit: requireBytes32(args, "commit", "AllocationSnapshotUpdated"),
      weight: requireBigInt(args, "weight", "AllocationSnapshotUpdated"),
      snapshotVersion: requireNumericBigInt(
        args,
        "snapshotVersion",
        "AllocationSnapshotUpdated"
      ),
      packedSnapshot: requireBytes(args, "packedSnapshot", "AllocationSnapshotUpdated"),
    };
  })();

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
    ...parseEventLogs({
      abi: flowParticipantAbi as Abi,
      logs: logs as any[],
      eventName: "AllocationCommitted",
      strict: false,
    }).map((log) => {
      const args = log.args as unknown;
      if (!isRecord(args)) {
        throw new Error("AllocationCommitted event args are missing.");
      }

      return {
        ...buildReceiptBase(log),
        family: "flow" as const,
        eventName: "AllocationCommitted" as const,
        strategy: requireAddress(args, "strategy", "AllocationCommitted"),
        allocationKey: requireBigInt(args, "allocationKey", "AllocationCommitted"),
        commit: requireBytes32(args, "commit", "AllocationCommitted"),
        weight: requireBigInt(args, "weight", "AllocationCommitted"),
      };
    }),
    ...parseEventLogs({
      abi: flowParticipantAbi as Abi,
      logs: logs as any[],
      eventName: "AllocationSnapshotUpdated",
      strict: false,
    }).map((log) => {
      const args = log.args as unknown;
      if (!isRecord(args)) {
        throw new Error("AllocationSnapshotUpdated event args are missing.");
      }

      return {
        ...buildReceiptBase(log),
        family: "flow" as const,
        eventName: "AllocationSnapshotUpdated" as const,
        strategy: requireAddress(args, "strategy", "AllocationSnapshotUpdated"),
        allocationKey: requireBigInt(args, "allocationKey", "AllocationSnapshotUpdated"),
        commit: requireBytes32(args, "commit", "AllocationSnapshotUpdated"),
        weight: requireBigInt(args, "weight", "AllocationSnapshotUpdated"),
        snapshotVersion: requireBigInt(args, "snapshotVersion", "AllocationSnapshotUpdated"),
        packedSnapshot: requireBytes(args, "packedSnapshot", "AllocationSnapshotUpdated"),
      };
    }),
  ];

  const ledgerEvents = parseEventLogs({
    abi: budgetStakeLedgerAbi as Abi,
    logs: logs as any[],
    eventName: "AllocationCheckpointed",
    strict: false,
  }).map((log) => {
    const args = log.args as unknown;
    if (!isRecord(args)) {
      throw new Error("AllocationCheckpointed event args are missing.");
    }

    return {
      ...buildReceiptBase(log),
      family: "ledger" as const,
      eventName: "AllocationCheckpointed" as const,
      account: requireAddress(args, "account", "AllocationCheckpointed"),
      budget: requireAddress(args, "budget", "AllocationCheckpointed"),
      allocatedStake: requireBigInt(args, "allocatedStake", "AllocationCheckpointed"),
      checkpointTime: requireBigInt(args, "checkpointTime", "AllocationCheckpointed"),
    };
  });

  const pipelineEvents: FlowReceiptEvent[] = [
    ...parseEventLogs({
      abi: goalFlowAllocationLedgerPipelineAbi as Abi,
      logs: logs as any[],
      eventName: "ChildAllocationSyncAttempted",
      strict: false,
    }).map((log) => {
      const args = log.args as unknown;
      if (!isRecord(args)) {
        throw new Error("ChildAllocationSyncAttempted event args are missing.");
      }

      return {
        ...buildReceiptBase(log),
        family: "pipeline" as const,
        eventName: "ChildAllocationSyncAttempted" as const,
        budgetTreasury: requireAddress(args, "budgetTreasury", "ChildAllocationSyncAttempted"),
        childFlow: requireAddress(args, "childFlow", "ChildAllocationSyncAttempted"),
        strategy: requireAddress(args, "strategy", "ChildAllocationSyncAttempted"),
        allocationKey: requireBigInt(args, "allocationKey", "ChildAllocationSyncAttempted"),
        parentFlow: requireAddress(args, "parentFlow", "ChildAllocationSyncAttempted"),
        parentStrategy: requireAddress(args, "parentStrategy", "ChildAllocationSyncAttempted"),
        parentAllocationKey: requireBigInt(
          args,
          "parentAllocationKey",
          "ChildAllocationSyncAttempted"
        ),
        success: requireBoolean(args, "success", "ChildAllocationSyncAttempted"),
      };
    }),
    ...parseEventLogs({
      abi: goalFlowAllocationLedgerPipelineAbi as Abi,
      logs: logs as any[],
      eventName: "ChildAllocationSyncFailed",
      strict: false,
    }).map((log) => {
      const args = log.args as unknown;
      if (!isRecord(args)) {
        throw new Error("ChildAllocationSyncFailed event args are missing.");
      }

      return {
        ...buildReceiptBase(log),
        family: "pipeline" as const,
        eventName: "ChildAllocationSyncFailed" as const,
        budgetTreasury: requireAddress(args, "budgetTreasury", "ChildAllocationSyncFailed"),
        childFlow: requireAddress(args, "childFlow", "ChildAllocationSyncFailed"),
        strategy: requireAddress(args, "strategy", "ChildAllocationSyncFailed"),
        allocationKey: requireBigInt(args, "allocationKey", "ChildAllocationSyncFailed"),
        parentFlow: requireAddress(args, "parentFlow", "ChildAllocationSyncFailed"),
        parentStrategy: requireAddress(args, "parentStrategy", "ChildAllocationSyncFailed"),
        parentAllocationKey: requireBigInt(
          args,
          "parentAllocationKey",
          "ChildAllocationSyncFailed"
        ),
        reason: requireBytes(args, "reason", "ChildAllocationSyncFailed"),
      };
    }),
    ...parseEventLogs({
      abi: goalFlowAllocationLedgerPipelineAbi as Abi,
      logs: logs as any[],
      eventName: "ChildAllocationSyncSkipped",
      strict: false,
    }).map((log) => {
      const args = log.args as unknown;
      if (!isRecord(args)) {
        throw new Error("ChildAllocationSyncSkipped event args are missing.");
      }

      return {
        ...buildReceiptBase(log),
        family: "pipeline" as const,
        eventName: "ChildAllocationSyncSkipped" as const,
        budgetTreasury: requireAddress(args, "budgetTreasury", "ChildAllocationSyncSkipped"),
        childFlow: requireAddress(args, "childFlow", "ChildAllocationSyncSkipped"),
        parentFlow: requireAddress(args, "parentFlow", "ChildAllocationSyncSkipped"),
        parentStrategy: requireAddress(args, "parentStrategy", "ChildAllocationSyncSkipped"),
        parentAllocationKey: requireBigInt(
          args,
          "parentAllocationKey",
          "ChildAllocationSyncSkipped"
        ),
        reason: requireBytes32(args, "reason", "ChildAllocationSyncSkipped"),
      };
    }),
    ...parseEventLogs({
      abi: goalFlowAllocationLedgerPipelineAbi as Abi,
      logs: logs as any[],
      eventName: "ChildSyncDebtCleared",
      strict: false,
    }).map((log) => {
      const args = log.args as unknown;
      if (!isRecord(args)) {
        throw new Error("ChildSyncDebtCleared event args are missing.");
      }

      return {
        ...buildReceiptBase(log),
        family: "pipeline" as const,
        eventName: "ChildSyncDebtCleared" as const,
        account: requireAddress(args, "account", "ChildSyncDebtCleared"),
        budgetTreasury: requireAddress(args, "budgetTreasury", "ChildSyncDebtCleared"),
        childFlow: requireAddress(args, "childFlow", "ChildSyncDebtCleared"),
        reason: requireBytes32(args, "reason", "ChildSyncDebtCleared"),
      };
    }),
    ...parseEventLogs({
      abi: goalFlowAllocationLedgerPipelineAbi as Abi,
      logs: logs as any[],
      eventName: "ChildSyncDebtOpened",
      strict: false,
    }).map((log) => {
      const args = log.args as unknown;
      if (!isRecord(args)) {
        throw new Error("ChildSyncDebtOpened event args are missing.");
      }

      return {
        ...buildReceiptBase(log),
        family: "pipeline" as const,
        eventName: "ChildSyncDebtOpened" as const,
        account: requireAddress(args, "account", "ChildSyncDebtOpened"),
        budgetTreasury: requireAddress(args, "budgetTreasury", "ChildSyncDebtOpened"),
        childFlow: requireAddress(args, "childFlow", "ChildSyncDebtOpened"),
        childStrategy: requireAddress(args, "childStrategy", "ChildSyncDebtOpened"),
        allocationKey: requireBigInt(args, "allocationKey", "ChildSyncDebtOpened"),
        reason: requireBytes32(args, "reason", "ChildSyncDebtOpened"),
      };
    }),
  ];

  return sortReceiptEvents([...flowEvents, ...ledgerEvents, ...pipelineEvents]);
}

export function serializeFlowReceiptEvents(
  events: readonly FlowReceiptEvent[]
): readonly Record<string, unknown>[] {
  return serializeProtocolBigInts(events) as readonly Record<string, unknown>[];
}
