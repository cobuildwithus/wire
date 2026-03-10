import { parseEventLogs, type Abi } from "viem";
import type { EvmAddress, HexBytes32 } from "./evm.js";
import { normalizeBytes32, normalizeEvmAddress } from "./evm.js";
import { roundPrizeVaultAbi } from "./protocol-abis.js";
import {
  buildProtocolCallStep,
  normalizeProtocolBigInt,
  resolveProtocolPlanNetwork,
  serializeProtocolBigInts,
  type BigintLike,
  type ProtocolExecutionPlan,
} from "./protocol-plans.js";

export type RoundPrizeVaultClaimPlan = ProtocolExecutionPlan<"prize-vault.claim"> & {
  prizeVaultAddress: EvmAddress;
  submissionId: HexBytes32;
};

export type RoundPrizeVaultDowngradePlan = ProtocolExecutionPlan<"prize-vault.downgrade"> & {
  prizeVaultAddress: EvmAddress;
  amount: string;
};

export type RoundPrizeVaultClaimedEvent = {
  submissionId: HexBytes32;
  recipient: EvmAddress;
  amount: bigint;
};

export type RoundPrizeVaultDowngradedEvent = {
  amount: bigint;
};

export type RoundPrizeVaultReceiptSummary = {
  claimed: RoundPrizeVaultClaimedEvent | null;
  downgraded: RoundPrizeVaultDowngradedEvent | null;
};

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

function decodeLatestEvent(logs: readonly unknown[], eventName: string) {
  return parseEventLogs({
    abi: roundPrizeVaultAbi as Abi,
    logs: logs as any[],
    eventName,
    strict: false,
  }).at(-1);
}

export function buildRoundPrizeVaultClaimPlan(params: {
  network?: string;
  prizeVaultAddress: string;
  submissionId: string;
}): RoundPrizeVaultClaimPlan {
  const prizeVaultAddress = normalizeEvmAddress(params.prizeVaultAddress, "prizeVaultAddress");
  const submissionId = normalizeBytes32(params.submissionId, "submissionId");

  return {
    network: resolveProtocolPlanNetwork(params.network),
    action: "prize-vault.claim",
    riskClass: "claim",
    summary: `Claim round prize entitlement ${submissionId} from ${prizeVaultAddress}.`,
    prizeVaultAddress,
    submissionId,
    preconditions: [],
    expectedEvents: ["Claimed"],
    steps: [
      buildProtocolCallStep({
        contract: "RoundPrizeVault",
        functionName: "claim",
        label: "Claim round prize",
        to: prizeVaultAddress,
        abi: roundPrizeVaultAbi as Abi,
        args: [submissionId],
      }),
    ],
  };
}

export function buildRoundPrizeVaultDowngradePlan(params: {
  network?: string;
  prizeVaultAddress: string;
  amount: BigintLike;
}): RoundPrizeVaultDowngradePlan {
  const prizeVaultAddress = normalizeEvmAddress(params.prizeVaultAddress, "prizeVaultAddress");
  const amount = normalizeProtocolBigInt(params.amount, "amount");

  return {
    network: resolveProtocolPlanNetwork(params.network),
    action: "prize-vault.downgrade",
    riskClass: "maintenance",
    summary: `Downgrade prize-vault super tokens on ${prizeVaultAddress}.`,
    prizeVaultAddress,
    amount: amount.toString(),
    preconditions: [],
    expectedEvents: ["Downgraded"],
    steps: [
      buildProtocolCallStep({
        contract: "RoundPrizeVault",
        functionName: "downgrade",
        label: "Downgrade prize-vault balance",
        to: prizeVaultAddress,
        abi: roundPrizeVaultAbi as Abi,
        args: [amount],
      }),
    ],
  };
}

export function decodeRoundPrizeVaultReceipt(
  logs: readonly unknown[]
): RoundPrizeVaultReceiptSummary {
  const claimed = (() => {
    const latest = decodeLatestEvent(logs, "Claimed");
    if (!latest) {
      return null;
    }

    const args = latest.args as unknown;
    if (!isRecord(args)) {
      throw new Error("Claimed event args are missing.");
    }

    return {
      submissionId: requireBytes32(args, "submissionId", "Claimed"),
      recipient: requireAddress(args, "recipient", "Claimed"),
      amount: requireBigInt(args, "amount", "Claimed"),
    };
  })();

  const downgraded = (() => {
    const latest = decodeLatestEvent(logs, "Downgraded");
    if (!latest) {
      return null;
    }

    const args = latest.args as unknown;
    if (!isRecord(args)) {
      throw new Error("Downgraded event args are missing.");
    }

    return {
      amount: requireBigInt(args, "amount", "Downgraded"),
    };
  })();

  return {
    claimed,
    downgraded,
  };
}

export function serializeRoundPrizeVaultReceipt(
  summary: RoundPrizeVaultReceiptSummary
): Record<string, unknown> {
  return serializeProtocolBigInts(summary) as Record<string, unknown>;
}
