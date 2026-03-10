import { parseEventLogs, type Abi } from "viem";
import type { EvmAddress } from "./evm.js";
import { normalizeEvmAddress } from "./evm.js";
import { premiumEscrowAbi } from "./protocol-abis.js";
import {
  buildProtocolCallStep,
  resolveProtocolPlanNetwork,
  serializeProtocolBigInts,
  type ProtocolExecutionPlan,
} from "./protocol-plans.js";

export type PremiumCheckpointPlan = ProtocolExecutionPlan<"premium.checkpoint"> & {
  premiumEscrowAddress: EvmAddress;
  account: EvmAddress;
};

export type PremiumClaimPlan = ProtocolExecutionPlan<"premium.claim"> & {
  premiumEscrowAddress: EvmAddress;
  recipient: EvmAddress;
};

export type PremiumCheckpointedEvent = {
  account: EvmAddress;
  previousCoverage: bigint;
  currentCoverage: bigint;
  claimableAmount: bigint;
  exposureIntegral: bigint;
  totalCoverage: bigint;
};

export type PremiumClaimedEvent = {
  account: EvmAddress;
  to: EvmAddress;
  amount: bigint;
};

export type PremiumEscrowReceiptSummary = {
  checkpointed: PremiumCheckpointedEvent | null;
  claimed: PremiumClaimedEvent | null;
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

function requireBigInt(value: Record<string, unknown>, key: string, label: string): bigint {
  const rawValue = value[key];
  if (typeof rawValue !== "bigint") {
    throw new Error(`${label} field "${key}" is missing.`);
  }
  return rawValue;
}

function decodeLatestEvent(logs: readonly unknown[], eventName: string) {
  return parseEventLogs({
    abi: premiumEscrowAbi as Abi,
    logs: logs as any[],
    eventName,
    strict: false,
  }).at(-1);
}

export function buildPremiumCheckpointPlan(params: {
  network?: string;
  premiumEscrowAddress: string;
  account: string;
}): PremiumCheckpointPlan {
  const premiumEscrowAddress = normalizeEvmAddress(
    params.premiumEscrowAddress,
    "premiumEscrowAddress"
  );
  const account = normalizeEvmAddress(params.account, "account");

  return {
    network: resolveProtocolPlanNetwork(params.network),
    action: "premium.checkpoint",
    riskClass: "claim",
    summary: `Checkpoint premium state for ${account} on escrow ${premiumEscrowAddress}.`,
    premiumEscrowAddress,
    account,
    preconditions: [],
    steps: [
      buildProtocolCallStep({
        contract: "PremiumEscrow",
        functionName: "checkpoint",
        label: "Checkpoint premium state",
        to: premiumEscrowAddress,
        abi: premiumEscrowAbi as Abi,
        args: [account],
      }),
    ],
  };
}

export function buildPremiumClaimPlan(params: {
  network?: string;
  premiumEscrowAddress: string;
  recipient: string;
}): PremiumClaimPlan {
  const premiumEscrowAddress = normalizeEvmAddress(
    params.premiumEscrowAddress,
    "premiumEscrowAddress"
  );
  const recipient = normalizeEvmAddress(params.recipient, "recipient");

  return {
    network: resolveProtocolPlanNetwork(params.network),
    action: "premium.claim",
    riskClass: "claim",
    summary: `Claim premium from escrow ${premiumEscrowAddress} to ${recipient}.`,
    premiumEscrowAddress,
    recipient,
    preconditions: [],
    steps: [
      buildProtocolCallStep({
        contract: "PremiumEscrow",
        functionName: "claim",
        label: "Claim premium",
        to: premiumEscrowAddress,
        abi: premiumEscrowAbi as Abi,
        args: [recipient],
      }),
    ],
  };
}

export function decodePremiumEscrowReceipt(logs: readonly unknown[]): PremiumEscrowReceiptSummary {
  const checkpointed = (() => {
    const latest = decodeLatestEvent(logs, "AccountCheckpointed");
    if (!latest) {
      return null;
    }
    const args = latest.args as unknown;
    if (!isRecord(args)) {
      throw new Error("AccountCheckpointed event args are missing.");
    }

    return {
      account: requireAddress(args, "account", "AccountCheckpointed"),
      previousCoverage: requireBigInt(args, "previousCoverage", "AccountCheckpointed"),
      currentCoverage: requireBigInt(args, "currentCoverage", "AccountCheckpointed"),
      claimableAmount: requireBigInt(args, "claimableAmount", "AccountCheckpointed"),
      exposureIntegral: requireBigInt(args, "exposureIntegral", "AccountCheckpointed"),
      totalCoverage: requireBigInt(args, "totalCoverage", "AccountCheckpointed"),
    };
  })();

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
      account: requireAddress(args, "account", "Claimed"),
      to: requireAddress(args, "to", "Claimed"),
      amount: requireBigInt(args, "amount", "Claimed"),
    };
  })();

  return {
    checkpointed,
    claimed,
  };
}

export function serializePremiumEscrowReceipt(
  summary: PremiumEscrowReceiptSummary
): Record<string, unknown> {
  return serializeProtocolBigInts(summary) as Record<string, unknown>;
}
