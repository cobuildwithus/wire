import type { Abi } from "viem";
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
import {
  decodeLatestReceiptEvent,
  requireReceiptAddress,
  requireReceiptBigInt,
  requireReceiptBytes32,
  requireReceiptRecord,
} from "./protocol-receipts.js";

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

function decodeLatestEvent(logs: readonly unknown[], eventName: string) {
  return decodeLatestReceiptEvent(roundPrizeVaultAbi as Abi, logs, eventName);
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

    const args = requireReceiptRecord(latest.args as unknown, "Claimed event args are missing.");

    return {
      submissionId: requireReceiptBytes32(args, "submissionId", "Claimed"),
      recipient: requireReceiptAddress(args, "recipient", "Claimed"),
      amount: requireReceiptBigInt(args, "amount", "Claimed"),
    };
  })();

  const downgraded = (() => {
    const latest = decodeLatestEvent(logs, "Downgraded");
    if (!latest) {
      return null;
    }

    const args = requireReceiptRecord(
      latest.args as unknown,
      "Downgraded event args are missing."
    );

    return {
      amount: requireReceiptBigInt(args, "amount", "Downgraded"),
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
