import { parseEventLogs, type Abi } from "viem";
import type { EvmAddress } from "./evm.js";
import { normalizeEvmAddress } from "./evm.js";
import { budgetTreasuryAbi, goalTreasuryAbi } from "./protocol-abis.js";
import {
  buildApprovalPlan,
  buildProtocolCallStep,
  normalizeProtocolBigInt,
  resolveProtocolPlanNetwork,
  serializeProtocolBigInts,
  type BigintLike,
  type ProtocolApprovalMode,
  type ProtocolExecutionPlan,
} from "./protocol-plans.js";

export type GoalTreasuryDonationPlan = ProtocolExecutionPlan<"treasury.donate-goal"> & {
  treasuryAddress: EvmAddress;
  underlyingTokenAddress: EvmAddress;
  amount: string;
  approvalIncluded: boolean;
};

export type BudgetTreasuryDonationPlan = ProtocolExecutionPlan<"treasury.donate-budget"> & {
  treasuryAddress: EvmAddress;
  underlyingTokenAddress: EvmAddress;
  amount: string;
  approvalIncluded: boolean;
};

export type GoalTreasuryDonationRecordedEvent = {
  donor: EvmAddress;
  sourceToken: EvmAddress;
  sourceAmount: bigint;
  superTokenAmount: bigint;
  totalRaised: bigint;
};

export type BudgetTreasuryDonationRecordedEvent = {
  donor: EvmAddress;
  sourceToken: EvmAddress;
  sourceAmount: bigint;
  superTokenAmount: bigint;
};

export type GoalTreasuryReceiptSummary = {
  donationRecorded: GoalTreasuryDonationRecordedEvent | null;
};

export type BudgetTreasuryReceiptSummary = {
  donationRecorded: BudgetTreasuryDonationRecordedEvent | null;
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

function decodeLatestGoalTreasuryEvent(logs: readonly unknown[], eventName: string) {
  return parseEventLogs({
    abi: goalTreasuryAbi as Abi,
    logs: logs as any[],
    eventName,
    strict: false,
  }).at(-1);
}

function decodeLatestBudgetTreasuryEvent(logs: readonly unknown[], eventName: string) {
  return parseEventLogs({
    abi: budgetTreasuryAbi as Abi,
    logs: logs as any[],
    eventName,
    strict: false,
  }).at(-1);
}

function buildTreasuryDonationPlan(params: {
  network?: string;
  treasuryAddress: string;
  underlyingTokenAddress: string;
  amount: BigintLike;
  currentAllowance?: BigintLike | null;
  approvalAmount?: BigintLike;
  approvalMode?: ProtocolApprovalMode;
  action: "treasury.donate-goal" | "treasury.donate-budget";
  contract: "GoalTreasury" | "BudgetTreasury";
  tokenLabel: "goal treasury" | "budget treasury";
  abi: Abi;
}): GoalTreasuryDonationPlan | BudgetTreasuryDonationPlan {
  const treasuryAddress = normalizeEvmAddress(params.treasuryAddress, "treasuryAddress");
  const underlyingTokenAddress = normalizeEvmAddress(
    params.underlyingTokenAddress,
    "underlyingTokenAddress"
  );
  const amount = normalizeProtocolBigInt(params.amount, "amount");
  const approvalPlan = buildApprovalPlan({
    tokenAddress: underlyingTokenAddress,
    spenderAddress: treasuryAddress,
    requiredAmount: amount,
    tokenLabel: "underlying token",
    spenderLabel: params.tokenLabel,
    ...(params.approvalMode ? { mode: params.approvalMode } : {}),
    ...(params.currentAllowance !== undefined ? { currentAllowance: params.currentAllowance } : {}),
    ...(params.approvalAmount !== undefined ? { approvalAmount: params.approvalAmount } : {}),
  });

  return {
    network: resolveProtocolPlanNetwork(params.network),
    action: params.action,
    riskClass: "economic",
    summary: `Donate underlying tokens to ${params.contract} ${treasuryAddress}.`,
    treasuryAddress,
    underlyingTokenAddress,
    amount: amount.toString(),
    approvalIncluded: approvalPlan.approvalIncluded,
    preconditions: approvalPlan.preconditions,
    expectedEvents: ["DonationRecorded"],
    steps: [
      ...approvalPlan.steps,
      buildProtocolCallStep({
        contract: params.contract,
        functionName: "donateUnderlyingAndUpgrade",
        label: "Donate and upgrade treasury funding",
        to: treasuryAddress,
        abi: params.abi,
        args: [amount],
      }),
    ],
  };
}

export function buildGoalTreasuryDonationPlan(params: {
  network?: string;
  treasuryAddress: string;
  underlyingTokenAddress: string;
  amount: BigintLike;
  currentAllowance?: BigintLike | null;
  approvalAmount?: BigintLike;
  approvalMode?: ProtocolApprovalMode;
}): GoalTreasuryDonationPlan {
  return buildTreasuryDonationPlan({
    ...params,
    action: "treasury.donate-goal",
    contract: "GoalTreasury",
    tokenLabel: "goal treasury",
    abi: goalTreasuryAbi as Abi,
  }) as GoalTreasuryDonationPlan;
}

export function buildBudgetTreasuryDonationPlan(params: {
  network?: string;
  treasuryAddress: string;
  underlyingTokenAddress: string;
  amount: BigintLike;
  currentAllowance?: BigintLike | null;
  approvalAmount?: BigintLike;
  approvalMode?: ProtocolApprovalMode;
}): BudgetTreasuryDonationPlan {
  return buildTreasuryDonationPlan({
    ...params,
    action: "treasury.donate-budget",
    contract: "BudgetTreasury",
    tokenLabel: "budget treasury",
    abi: budgetTreasuryAbi as Abi,
  }) as BudgetTreasuryDonationPlan;
}

export function decodeGoalTreasuryReceipt(
  logs: readonly unknown[]
): GoalTreasuryReceiptSummary {
  const latest = decodeLatestGoalTreasuryEvent(logs, "DonationRecorded");
  if (!latest) {
    return {
      donationRecorded: null,
    };
  }

  const args = latest.args as unknown;
  if (!isRecord(args)) {
    throw new Error("DonationRecorded event args are missing.");
  }

  return {
    donationRecorded: {
      donor: requireAddress(args, "donor", "DonationRecorded"),
      sourceToken: requireAddress(args, "sourceToken", "DonationRecorded"),
      sourceAmount: requireBigInt(args, "sourceAmount", "DonationRecorded"),
      superTokenAmount: requireBigInt(args, "superTokenAmount", "DonationRecorded"),
      totalRaised: requireBigInt(args, "totalRaised", "DonationRecorded"),
    },
  };
}

export function decodeBudgetTreasuryReceipt(
  logs: readonly unknown[]
): BudgetTreasuryReceiptSummary {
  const latest = decodeLatestBudgetTreasuryEvent(logs, "DonationRecorded");
  if (!latest) {
    return {
      donationRecorded: null,
    };
  }

  const args = latest.args as unknown;
  if (!isRecord(args)) {
    throw new Error("DonationRecorded event args are missing.");
  }

  return {
    donationRecorded: {
      donor: requireAddress(args, "donor", "DonationRecorded"),
      sourceToken: requireAddress(args, "sourceToken", "DonationRecorded"),
      sourceAmount: requireBigInt(args, "sourceAmount", "DonationRecorded"),
      superTokenAmount: requireBigInt(args, "superTokenAmount", "DonationRecorded"),
    },
  };
}

export function serializeGoalTreasuryReceipt(
  summary: GoalTreasuryReceiptSummary
): Record<string, unknown> {
  return serializeProtocolBigInts(summary) as Record<string, unknown>;
}

export function serializeBudgetTreasuryReceipt(
  summary: BudgetTreasuryReceiptSummary
): Record<string, unknown> {
  return serializeProtocolBigInts(summary) as Record<string, unknown>;
}
