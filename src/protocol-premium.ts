import type { Abi } from "viem";
import type { EvmAddress } from "./evm.js";
import { normalizeEvmAddress } from "./evm.js";
import { premiumEscrowAbi } from "./protocol-abis.js";
import {
  buildProtocolCallStep,
  resolveProtocolPlanNetwork,
  serializeProtocolBigInts,
  type ProtocolExecutionPlan,
} from "./protocol-plans.js";
import {
  decodeLatestReceiptEvent,
  requireReceiptAddress,
  requireReceiptBigInt,
  requireReceiptRecord,
} from "./protocol-receipts.js";

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

function decodeLatestEvent(logs: readonly unknown[], eventName: string) {
  return decodeLatestReceiptEvent(premiumEscrowAbi as Abi, logs, eventName);
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
    const args = requireReceiptRecord(latest.args as unknown, "AccountCheckpointed event args are missing.");

    return {
      account: requireReceiptAddress(args, "account", "AccountCheckpointed"),
      previousCoverage: requireReceiptBigInt(args, "previousCoverage", "AccountCheckpointed"),
      currentCoverage: requireReceiptBigInt(args, "currentCoverage", "AccountCheckpointed"),
      claimableAmount: requireReceiptBigInt(args, "claimableAmount", "AccountCheckpointed"),
      exposureIntegral: requireReceiptBigInt(args, "exposureIntegral", "AccountCheckpointed"),
      totalCoverage: requireReceiptBigInt(args, "totalCoverage", "AccountCheckpointed"),
    };
  })();

  const claimed = (() => {
    const latest = decodeLatestEvent(logs, "Claimed");
    if (!latest) {
      return null;
    }
    const args = requireReceiptRecord(latest.args as unknown, "Claimed event args are missing.");

    return {
      account: requireReceiptAddress(args, "account", "Claimed"),
      to: requireReceiptAddress(args, "to", "Claimed"),
      amount: requireReceiptBigInt(args, "amount", "Claimed"),
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
