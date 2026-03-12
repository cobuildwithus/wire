import type { EvmAddress, HexBytes } from "./evm.js";
import { normalizeEvmAddress } from "./evm.js";
import {
  buildProtocolCallStep,
  normalizeProtocolBigInt,
  resolveProtocolPlanNetwork,
  type BigintLike,
  type ProtocolContractCallStep,
  type ProtocolExecutionPlan,
  type ProtocolTransaction,
} from "./protocol-plans.js";
import {
  buildTerminalFundingPlanArtifacts,
  cobuildGoalTerminalPayAbi,
  isNativeTerminalFundingToken,
  resolveTerminalFundingMemo,
  resolveTerminalFundingMetadata,
  resolveTerminalFundingToken,
  resolveTerminalFundingValueEth,
} from "./protocol-terminal-funding-shared.js";

export type GoalTerminalPayTransaction = ProtocolTransaction;

export type GoalTerminalPayPlan = ProtocolExecutionPlan<"goal.pay"> & {
  terminalAddress: EvmAddress;
  projectId: string;
  tokenAddress: EvmAddress;
  amount: string;
  beneficiary: EvmAddress;
  minReturnedTokens: string;
  memo: string;
  metadata: HexBytes;
  approvalIncluded: boolean;
};

type NormalizedGoalTerminalPayParams = {
  terminalAddress: EvmAddress;
  projectId: bigint;
  tokenAddress: EvmAddress;
  amount: bigint;
  beneficiary: EvmAddress;
  minReturnedTokens: bigint;
  memo: string;
  metadata: HexBytes;
  valueEth: string;
};

function normalizeGoalTerminalPayParams(params: {
  terminal: string;
  projectId: BigintLike;
  token?: string;
  amount: BigintLike;
  beneficiary: string;
  minReturnedTokens?: BigintLike;
  memo?: string;
  metadata?: string;
}): NormalizedGoalTerminalPayParams {
  const terminalAddress = normalizeEvmAddress(params.terminal, "terminal");
  const projectId = normalizeProtocolBigInt(params.projectId, "projectId");
  const tokenAddress = resolveTerminalFundingToken(params.token);
  const amount = normalizeProtocolBigInt(params.amount, "amount");
  const beneficiary = normalizeEvmAddress(params.beneficiary, "beneficiary");
  const minReturnedTokens = normalizeProtocolBigInt(
    params.minReturnedTokens ?? 0,
    "minReturnedTokens"
  );
  const memo = resolveTerminalFundingMemo(params.memo);
  const metadata = resolveTerminalFundingMetadata(params.metadata, "metadata");

  if (isNativeTerminalFundingToken(tokenAddress) && amount === 0n) {
    throw new Error("amount must be greater than 0 for native-token pays.");
  }

  return {
    terminalAddress,
    projectId,
    tokenAddress,
    amount,
    beneficiary,
    minReturnedTokens,
    memo,
    metadata,
    valueEth: resolveTerminalFundingValueEth(tokenAddress, amount, "amount"),
  };
}

function buildGoalTerminalPayStep(
  params: NormalizedGoalTerminalPayParams
): ProtocolContractCallStep {
  return buildProtocolCallStep({
    contract: "CobuildGoalTerminal",
    functionName: "pay",
    label: "Pay goal terminal",
    to: params.terminalAddress,
    abi: cobuildGoalTerminalPayAbi,
    args: [
      params.projectId,
      params.tokenAddress,
      params.amount,
      params.beneficiary,
      params.minReturnedTokens,
      params.memo,
      params.metadata,
    ],
    valueEth: params.valueEth,
  });
}

export function buildGoalTerminalPayTransaction(params: {
  terminal: string;
  projectId: BigintLike;
  token?: string;
  amount: BigintLike;
  beneficiary: string;
  minReturnedTokens?: BigintLike;
  memo?: string;
  metadata?: string;
}): GoalTerminalPayTransaction {
  const normalized = normalizeGoalTerminalPayParams(params);
  return buildGoalTerminalPayStep(normalized).transaction;
}

export function buildGoalTerminalPayPlan(params: {
  network?: string;
  terminal: string;
  projectId: BigintLike;
  token?: string;
  amount: BigintLike;
  beneficiary: string;
  minReturnedTokens?: BigintLike;
  memo?: string;
  metadata?: string;
}): GoalTerminalPayPlan {
  const normalized = normalizeGoalTerminalPayParams(params);
  const payStep = buildGoalTerminalPayStep(normalized);
  const execution = buildTerminalFundingPlanArtifacts({
    tokenAddress: normalized.tokenAddress,
    terminalAddress: normalized.terminalAddress,
    amount: normalized.amount,
    terminalLabel: "goal terminal",
    callStep: payStep,
  });

  return {
    network: resolveProtocolPlanNetwork(params.network),
    action: "goal.pay",
    riskClass: "economic",
    summary: `Pay goal ${normalized.projectId.toString()} through terminal ${normalized.terminalAddress}.`,
    terminalAddress: normalized.terminalAddress,
    projectId: normalized.projectId.toString(),
    tokenAddress: normalized.tokenAddress,
    amount: normalized.amount.toString(),
    beneficiary: normalized.beneficiary,
    minReturnedTokens: normalized.minReturnedTokens.toString(),
    memo: normalized.memo,
    metadata: normalized.metadata,
    approvalIncluded: execution.approvalIncluded,
    preconditions: execution.preconditions,
    expectedEvents: ["Pay"],
    steps: execution.steps,
  };
}
