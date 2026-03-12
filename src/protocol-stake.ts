import type { Abi } from "viem";
import type { EvmAddress } from "./evm.js";
import { normalizeEvmAddress } from "./evm.js";
import { goalStakeVaultAbi } from "./protocol-abis.js";
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
import {
  decodeLatestReceiptEvent,
  requireReceiptAddress,
  requireReceiptBigInt,
  requireReceiptBoolean,
  requireReceiptRecord,
} from "./protocol-receipts.js";

export type GoalStakeDepositPlan = ProtocolExecutionPlan<"stake.deposit-goal"> & {
  stakeVaultAddress: EvmAddress;
  goalTokenAddress: EvmAddress;
  amount: string;
  approvalIncluded: boolean;
};

export type CobuildStakeDepositPlan = ProtocolExecutionPlan<"stake.deposit-cobuild"> & {
  stakeVaultAddress: EvmAddress;
  cobuildTokenAddress: EvmAddress;
  amount: string;
  approvalIncluded: boolean;
};

export type UnderwriterWithdrawalPreparationPlan =
  ProtocolExecutionPlan<"stake.prepare-underwriter-withdrawal"> & {
    stakeVaultAddress: EvmAddress;
    maxBudgets: string;
  };

export type JurorOptInPlan = ProtocolExecutionPlan<"stake.opt-in-juror"> & {
  stakeVaultAddress: EvmAddress;
  goalTokenAddress: EvmAddress;
  goalAmount: string;
  delegate: EvmAddress;
  approvalIncluded: boolean;
};

export type JurorExitRequestPlan = ProtocolExecutionPlan<"stake.request-juror-exit"> & {
  stakeVaultAddress: EvmAddress;
  goalAmount: string;
};

export type JurorExitFinalizationPlan =
  ProtocolExecutionPlan<"stake.finalize-juror-exit"> & {
    stakeVaultAddress: EvmAddress;
  };

export type JurorDelegateUpdatePlan = ProtocolExecutionPlan<"stake.set-juror-delegate"> & {
  stakeVaultAddress: EvmAddress;
  delegate: EvmAddress;
};

export type GoalStakeWithdrawalPlan = ProtocolExecutionPlan<"stake.withdraw-goal"> & {
  stakeVaultAddress: EvmAddress;
  recipient: EvmAddress;
  amount: string;
};

export type CobuildStakeWithdrawalPlan = ProtocolExecutionPlan<"stake.withdraw-cobuild"> & {
  stakeVaultAddress: EvmAddress;
  recipient: EvmAddress;
  amount: string;
};

export type GoalStakedEvent = {
  user: EvmAddress;
  amount: bigint;
  weightDelta: bigint;
};

export type CobuildStakedEvent = GoalStakedEvent;

export type GoalWithdrawnEvent = {
  user: EvmAddress;
  to: EvmAddress;
  amount: bigint;
};

export type CobuildWithdrawnEvent = GoalWithdrawnEvent;

export type UnderwriterWithdrawalPreparedEvent = {
  underwriter: EvmAddress;
  nextBudgetIndex: bigint;
  budgetCount: bigint;
  complete: boolean;
};

export type JurorOptedInEvent = {
  juror: EvmAddress;
  goalAmount: bigint;
  weightDelta: bigint;
  delegate: EvmAddress;
};

export type JurorExitRequestedEvent = {
  juror: EvmAddress;
  goalAmount: bigint;
  requestedAt: bigint;
  availableAt: bigint;
};

export type JurorExitFinalizedEvent = {
  juror: EvmAddress;
  goalAmount: bigint;
  weightDelta: bigint;
};

export type JurorDelegateSetEvent = {
  juror: EvmAddress;
  delegate: EvmAddress;
};

export type StakeVaultReceiptSummary = {
  goalStaked: GoalStakedEvent | null;
  cobuildStaked: CobuildStakedEvent | null;
  goalWithdrawn: GoalWithdrawnEvent | null;
  cobuildWithdrawn: CobuildWithdrawnEvent | null;
  underwriterWithdrawalPrepared: UnderwriterWithdrawalPreparedEvent | null;
  jurorOptedIn: JurorOptedInEvent | null;
  jurorExitRequested: JurorExitRequestedEvent | null;
  jurorExitFinalized: JurorExitFinalizedEvent | null;
  jurorDelegateSet: JurorDelegateSetEvent | null;
};

function decodeLatestEvent(logs: readonly unknown[], eventName: string) {
  return decodeLatestReceiptEvent(goalStakeVaultAbi as Abi, logs, eventName);
}

function normalizeStakeEvent(
  logs: readonly unknown[],
  eventName: "GoalStaked" | "CobuildStaked"
): GoalStakedEvent | null {
  const latest = decodeLatestEvent(logs, eventName);
  if (!latest) {
    return null;
  }

  const args = requireReceiptRecord(latest.args as unknown, `${eventName} event args are missing.`);

  return {
    user: requireReceiptAddress(args, "user", eventName),
    amount: requireReceiptBigInt(args, "amount", eventName),
    weightDelta: requireReceiptBigInt(args, "weightDelta", eventName),
  };
}

function normalizeWithdrawnEvent(
  logs: readonly unknown[],
  eventName: "GoalWithdrawn" | "CobuildWithdrawn"
): GoalWithdrawnEvent | null {
  const latest = decodeLatestEvent(logs, eventName);
  if (!latest) {
    return null;
  }

  const args = requireReceiptRecord(latest.args as unknown, `${eventName} event args are missing.`);

  return {
    user: requireReceiptAddress(args, "user", eventName),
    to: requireReceiptAddress(args, "to", eventName),
    amount: requireReceiptBigInt(args, "amount", eventName),
  };
}

function normalizeJurorOptedInEvent(logs: readonly unknown[]): JurorOptedInEvent | null {
  const latest = decodeLatestEvent(logs, "JurorOptedIn");
  if (!latest) {
    return null;
  }

  const args = requireReceiptRecord(latest.args as unknown, "JurorOptedIn event args are missing.");

  return {
    juror: requireReceiptAddress(args, "juror", "JurorOptedIn"),
    goalAmount: requireReceiptBigInt(args, "goalAmount", "JurorOptedIn"),
    weightDelta: requireReceiptBigInt(args, "weightDelta", "JurorOptedIn"),
    delegate: requireReceiptAddress(args, "delegate", "JurorOptedIn"),
  };
}

function normalizeJurorExitRequestedEvent(logs: readonly unknown[]): JurorExitRequestedEvent | null {
  const latest = decodeLatestEvent(logs, "JurorExitRequested");
  if (!latest) {
    return null;
  }

  const args = requireReceiptRecord(
    latest.args as unknown,
    "JurorExitRequested event args are missing."
  );

  return {
    juror: requireReceiptAddress(args, "juror", "JurorExitRequested"),
    goalAmount: requireReceiptBigInt(args, "goalAmount", "JurorExitRequested"),
    requestedAt: requireReceiptBigInt(args, "requestedAt", "JurorExitRequested"),
    availableAt: requireReceiptBigInt(args, "availableAt", "JurorExitRequested"),
  };
}

function normalizeJurorExitFinalizedEvent(logs: readonly unknown[]): JurorExitFinalizedEvent | null {
  const latest = decodeLatestEvent(logs, "JurorExitFinalized");
  if (!latest) {
    return null;
  }

  const args = requireReceiptRecord(
    latest.args as unknown,
    "JurorExitFinalized event args are missing."
  );

  return {
    juror: requireReceiptAddress(args, "juror", "JurorExitFinalized"),
    goalAmount: requireReceiptBigInt(args, "goalAmount", "JurorExitFinalized"),
    weightDelta: requireReceiptBigInt(args, "weightDelta", "JurorExitFinalized"),
  };
}

function normalizeJurorDelegateSetEvent(logs: readonly unknown[]): JurorDelegateSetEvent | null {
  const latest = decodeLatestEvent(logs, "JurorDelegateSet");
  if (!latest) {
    return null;
  }

  const args = requireReceiptRecord(
    latest.args as unknown,
    "JurorDelegateSet event args are missing."
  );

  return {
    juror: requireReceiptAddress(args, "juror", "JurorDelegateSet"),
    delegate: requireReceiptAddress(args, "delegate", "JurorDelegateSet"),
  };
}

export function buildGoalStakeDepositPlan(params: {
  network?: string;
  stakeVaultAddress: string;
  goalTokenAddress: string;
  amount: BigintLike;
  currentAllowance?: BigintLike | null;
  approvalAmount?: BigintLike;
  approvalMode?: ProtocolApprovalMode;
}): GoalStakeDepositPlan {
  const stakeVaultAddress = normalizeEvmAddress(params.stakeVaultAddress, "stakeVaultAddress");
  const goalTokenAddress = normalizeEvmAddress(params.goalTokenAddress, "goalTokenAddress");
  const amount = normalizeProtocolBigInt(params.amount, "amount");
  const approvalPlan = buildApprovalPlan({
    tokenAddress: goalTokenAddress,
    spenderAddress: stakeVaultAddress,
    requiredAmount: amount,
    tokenLabel: "goal token",
    spenderLabel: "stake vault",
    ...(params.approvalMode ? { mode: params.approvalMode } : {}),
    ...(params.currentAllowance !== undefined ? { currentAllowance: params.currentAllowance } : {}),
    ...(params.approvalAmount !== undefined ? { approvalAmount: params.approvalAmount } : {}),
  });

  return {
    network: resolveProtocolPlanNetwork(params.network),
    action: "stake.deposit-goal",
    riskClass: "stake",
    summary: `Deposit goal tokens into stake vault ${stakeVaultAddress}.`,
    stakeVaultAddress,
    goalTokenAddress,
    amount: amount.toString(),
    approvalIncluded: approvalPlan.approvalIncluded,
    preconditions: approvalPlan.preconditions,
    steps: [
      ...approvalPlan.steps,
      buildProtocolCallStep({
        contract: "GoalStakeVault",
        functionName: "depositGoal",
        label: "Deposit goal stake",
        to: stakeVaultAddress,
        abi: goalStakeVaultAbi as Abi,
        args: [amount],
      }),
    ],
  };
}

export function buildCobuildStakeDepositPlan(params: {
  network?: string;
  stakeVaultAddress: string;
  cobuildTokenAddress: string;
  amount: BigintLike;
  currentAllowance?: BigintLike | null;
  approvalAmount?: BigintLike;
  approvalMode?: ProtocolApprovalMode;
}): CobuildStakeDepositPlan {
  const stakeVaultAddress = normalizeEvmAddress(params.stakeVaultAddress, "stakeVaultAddress");
  const cobuildTokenAddress = normalizeEvmAddress(
    params.cobuildTokenAddress,
    "cobuildTokenAddress"
  );
  const amount = normalizeProtocolBigInt(params.amount, "amount");
  const approvalPlan = buildApprovalPlan({
    tokenAddress: cobuildTokenAddress,
    spenderAddress: stakeVaultAddress,
    requiredAmount: amount,
    tokenLabel: "cobuild token",
    spenderLabel: "stake vault",
    ...(params.approvalMode ? { mode: params.approvalMode } : {}),
    ...(params.currentAllowance !== undefined ? { currentAllowance: params.currentAllowance } : {}),
    ...(params.approvalAmount !== undefined ? { approvalAmount: params.approvalAmount } : {}),
  });

  return {
    network: resolveProtocolPlanNetwork(params.network),
    action: "stake.deposit-cobuild",
    riskClass: "stake",
    summary: `Deposit cobuild tokens into stake vault ${stakeVaultAddress}.`,
    stakeVaultAddress,
    cobuildTokenAddress,
    amount: amount.toString(),
    approvalIncluded: approvalPlan.approvalIncluded,
    preconditions: approvalPlan.preconditions,
    steps: [
      ...approvalPlan.steps,
      buildProtocolCallStep({
        contract: "GoalStakeVault",
        functionName: "depositCobuild",
        label: "Deposit cobuild stake",
        to: stakeVaultAddress,
        abi: goalStakeVaultAbi as Abi,
        args: [amount],
      }),
    ],
  };
}

export function buildJurorOptInPlan(params: {
  network?: string;
  stakeVaultAddress: string;
  goalTokenAddress: string;
  goalAmount: BigintLike;
  delegate: string;
  currentAllowance?: BigintLike | null;
  approvalAmount?: BigintLike;
  approvalMode?: ProtocolApprovalMode;
}): JurorOptInPlan {
  const stakeVaultAddress = normalizeEvmAddress(params.stakeVaultAddress, "stakeVaultAddress");
  const goalTokenAddress = normalizeEvmAddress(params.goalTokenAddress, "goalTokenAddress");
  const goalAmount = normalizeProtocolBigInt(params.goalAmount, "goalAmount");
  const delegate = normalizeEvmAddress(params.delegate, "delegate");
  const approvalPlan = buildApprovalPlan({
    tokenAddress: goalTokenAddress,
    spenderAddress: stakeVaultAddress,
    requiredAmount: goalAmount,
    tokenLabel: "goal token",
    spenderLabel: "stake vault",
    ...(params.approvalMode ? { mode: params.approvalMode } : {}),
    ...(params.currentAllowance !== undefined ? { currentAllowance: params.currentAllowance } : {}),
    ...(params.approvalAmount !== undefined ? { approvalAmount: params.approvalAmount } : {}),
  });

  return {
    network: resolveProtocolPlanNetwork(params.network),
    action: "stake.opt-in-juror",
    riskClass: "stake",
    summary: `Lock goal stake as juror weight on vault ${stakeVaultAddress}.`,
    stakeVaultAddress,
    goalTokenAddress,
    goalAmount: goalAmount.toString(),
    delegate,
    approvalIncluded: approvalPlan.approvalIncluded,
    preconditions: approvalPlan.preconditions,
    expectedEvents: ["JurorOptedIn"],
    steps: [
      ...approvalPlan.steps,
      buildProtocolCallStep({
        contract: "GoalStakeVault",
        functionName: "optInAsJuror",
        label: "Opt in as juror",
        to: stakeVaultAddress,
        abi: goalStakeVaultAbi as Abi,
        args: [goalAmount, delegate],
      }),
    ],
  };
}

export function buildJurorExitRequestPlan(params: {
  network?: string;
  stakeVaultAddress: string;
  goalAmount: BigintLike;
}): JurorExitRequestPlan {
  const stakeVaultAddress = normalizeEvmAddress(params.stakeVaultAddress, "stakeVaultAddress");
  const goalAmount = normalizeProtocolBigInt(params.goalAmount, "goalAmount");

  return {
    network: resolveProtocolPlanNetwork(params.network),
    action: "stake.request-juror-exit",
    riskClass: "stake",
    summary: `Request juror stake exit on vault ${stakeVaultAddress}.`,
    stakeVaultAddress,
    goalAmount: goalAmount.toString(),
    preconditions: [],
    expectedEvents: ["JurorExitRequested"],
    steps: [
      buildProtocolCallStep({
        contract: "GoalStakeVault",
        functionName: "requestJurorExit",
        label: "Request juror exit",
        to: stakeVaultAddress,
        abi: goalStakeVaultAbi as Abi,
        args: [goalAmount],
      }),
    ],
  };
}

export function buildJurorExitFinalizationPlan(params: {
  network?: string;
  stakeVaultAddress: string;
}): JurorExitFinalizationPlan {
  const stakeVaultAddress = normalizeEvmAddress(params.stakeVaultAddress, "stakeVaultAddress");

  return {
    network: resolveProtocolPlanNetwork(params.network),
    action: "stake.finalize-juror-exit",
    riskClass: "stake",
    summary: `Finalize juror exit on vault ${stakeVaultAddress}.`,
    stakeVaultAddress,
    preconditions: [],
    expectedEvents: ["JurorExitFinalized"],
    steps: [
      buildProtocolCallStep({
        contract: "GoalStakeVault",
        functionName: "finalizeJurorExit",
        label: "Finalize juror exit",
        to: stakeVaultAddress,
        abi: goalStakeVaultAbi as Abi,
      }),
    ],
  };
}

export function buildJurorDelegateUpdatePlan(params: {
  network?: string;
  stakeVaultAddress: string;
  delegate: string;
}): JurorDelegateUpdatePlan {
  const stakeVaultAddress = normalizeEvmAddress(params.stakeVaultAddress, "stakeVaultAddress");
  const delegate = normalizeEvmAddress(params.delegate, "delegate");

  return {
    network: resolveProtocolPlanNetwork(params.network),
    action: "stake.set-juror-delegate",
    riskClass: "stake",
    summary: `Update juror delegate on vault ${stakeVaultAddress}.`,
    stakeVaultAddress,
    delegate,
    preconditions: [],
    expectedEvents: ["JurorDelegateSet"],
    steps: [
      buildProtocolCallStep({
        contract: "GoalStakeVault",
        functionName: "setJurorDelegate",
        label: "Set juror delegate",
        to: stakeVaultAddress,
        abi: goalStakeVaultAbi as Abi,
        args: [delegate],
      }),
    ],
  };
}

export function buildUnderwriterWithdrawalPreparationPlan(params: {
  network?: string;
  stakeVaultAddress: string;
  maxBudgets: BigintLike;
}): UnderwriterWithdrawalPreparationPlan {
  const stakeVaultAddress = normalizeEvmAddress(params.stakeVaultAddress, "stakeVaultAddress");
  const maxBudgets = normalizeProtocolBigInt(params.maxBudgets, "maxBudgets");

  return {
    network: resolveProtocolPlanNetwork(params.network),
    action: "stake.prepare-underwriter-withdrawal",
    riskClass: "stake",
    summary: `Prepare underwriter withdrawal batches on stake vault ${stakeVaultAddress}.`,
    stakeVaultAddress,
    maxBudgets: maxBudgets.toString(),
    preconditions: [],
    steps: [
      buildProtocolCallStep({
        contract: "GoalStakeVault",
        functionName: "prepareUnderwriterWithdrawal",
        label: "Prepare underwriter withdrawal",
        to: stakeVaultAddress,
        abi: goalStakeVaultAbi as Abi,
        args: [maxBudgets],
      }),
    ],
  };
}

export function buildGoalStakeWithdrawalPlan(params: {
  network?: string;
  stakeVaultAddress: string;
  amount: BigintLike;
  recipient: string;
}): GoalStakeWithdrawalPlan {
  const stakeVaultAddress = normalizeEvmAddress(params.stakeVaultAddress, "stakeVaultAddress");
  const recipient = normalizeEvmAddress(params.recipient, "recipient");
  const amount = normalizeProtocolBigInt(params.amount, "amount");

  return {
    network: resolveProtocolPlanNetwork(params.network),
    action: "stake.withdraw-goal",
    riskClass: "stake",
    summary: `Withdraw goal stake from vault ${stakeVaultAddress} to ${recipient}.`,
    stakeVaultAddress,
    recipient,
    amount: amount.toString(),
    preconditions: [],
    steps: [
      buildProtocolCallStep({
        contract: "GoalStakeVault",
        functionName: "withdrawGoal",
        label: "Withdraw goal stake",
        to: stakeVaultAddress,
        abi: goalStakeVaultAbi as Abi,
        args: [amount, recipient],
      }),
    ],
  };
}

export function buildCobuildStakeWithdrawalPlan(params: {
  network?: string;
  stakeVaultAddress: string;
  amount: BigintLike;
  recipient: string;
}): CobuildStakeWithdrawalPlan {
  const stakeVaultAddress = normalizeEvmAddress(params.stakeVaultAddress, "stakeVaultAddress");
  const recipient = normalizeEvmAddress(params.recipient, "recipient");
  const amount = normalizeProtocolBigInt(params.amount, "amount");

  return {
    network: resolveProtocolPlanNetwork(params.network),
    action: "stake.withdraw-cobuild",
    riskClass: "stake",
    summary: `Withdraw cobuild stake from vault ${stakeVaultAddress} to ${recipient}.`,
    stakeVaultAddress,
    recipient,
    amount: amount.toString(),
    preconditions: [],
    steps: [
      buildProtocolCallStep({
        contract: "GoalStakeVault",
        functionName: "withdrawCobuild",
        label: "Withdraw cobuild stake",
        to: stakeVaultAddress,
        abi: goalStakeVaultAbi as Abi,
        args: [amount, recipient],
      }),
    ],
  };
}

export function decodeStakeVaultReceipt(logs: readonly unknown[]): StakeVaultReceiptSummary {
  return {
    goalStaked: normalizeStakeEvent(logs, "GoalStaked"),
    cobuildStaked: normalizeStakeEvent(logs, "CobuildStaked"),
    goalWithdrawn: normalizeWithdrawnEvent(logs, "GoalWithdrawn"),
    cobuildWithdrawn: normalizeWithdrawnEvent(logs, "CobuildWithdrawn"),
    underwriterWithdrawalPrepared: (() => {
      const latest = decodeLatestEvent(logs, "UnderwriterWithdrawalPrepared");
      if (!latest) {
        return null;
      }
      const args = requireReceiptRecord(
        latest.args as unknown,
        "UnderwriterWithdrawalPrepared event args are missing."
      );
      return {
        underwriter: requireReceiptAddress(args, "underwriter", "UnderwriterWithdrawalPrepared"),
        nextBudgetIndex: requireReceiptBigInt(
          args,
          "nextBudgetIndex",
          "UnderwriterWithdrawalPrepared"
        ),
        budgetCount: requireReceiptBigInt(args, "budgetCount", "UnderwriterWithdrawalPrepared"),
        complete: requireReceiptBoolean(args, "complete", "UnderwriterWithdrawalPrepared"),
      };
    })(),
    jurorOptedIn: normalizeJurorOptedInEvent(logs),
    jurorExitRequested: normalizeJurorExitRequestedEvent(logs),
    jurorExitFinalized: normalizeJurorExitFinalizedEvent(logs),
    jurorDelegateSet: normalizeJurorDelegateSetEvent(logs),
  };
}

export function serializeStakeVaultReceipt(summary: StakeVaultReceiptSummary): Record<string, unknown> {
  return serializeProtocolBigInts(summary) as Record<string, unknown>;
}
