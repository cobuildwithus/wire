import type { EvmAddress, HexBytes } from "./evm.js";
import {
  buildProtocolCallStep,
  normalizeProtocolBigInt,
  resolveProtocolPlanNetwork,
  type BigintLike,
  type ProtocolExecutionPlan,
  type ProtocolTransaction,
} from "./protocol-plans.js";
import {
  buildTerminalFundingPlanArtifacts,
  cobuildCommunityTerminalAddToBalanceAbi,
  resolveCommunityTerminalAddress,
  resolveTerminalFundingMemo,
  resolveTerminalFundingMetadata,
  resolveTerminalFundingToken,
  resolveTerminalFundingValueEth,
} from "./protocol-terminal-funding-shared.js";

export type CommunityTerminalAddToBalancePlan =
  ProtocolExecutionPlan<"community.add-to-balance"> & {
    terminalAddress: EvmAddress;
    projectId: string;
    tokenAddress: EvmAddress;
    token: EvmAddress;
    amount: string;
    memo: string;
    metadata: HexBytes;
    approvalIncluded: boolean;
    transaction: ProtocolTransaction;
  };

type CommunityTerminalAddToBalancePlanCore = Omit<
  CommunityTerminalAddToBalancePlan,
  "token"
>;

export function buildCommunityTerminalAddToBalancePlan(params: {
  network?: string;
  terminal?: string;
  projectId: BigintLike;
  token?: string;
  amount: BigintLike;
  memo?: string;
  metadata?: string;
}): CommunityTerminalAddToBalancePlan {
  const terminalAddress = resolveCommunityTerminalAddress(params.terminal);
  const projectId = normalizeProtocolBigInt(params.projectId, "projectId");
  const tokenAddress = resolveTerminalFundingToken(params.token);
  const amount = normalizeProtocolBigInt(params.amount, "amount");
  if (amount === 0n) {
    throw new Error("amount must be greater than 0.");
  }
  const memo = resolveTerminalFundingMemo(params.memo);
  const metadata = resolveTerminalFundingMetadata(params.metadata, "metadata");
  const valueEth = resolveTerminalFundingValueEth(tokenAddress, amount, "amount");
  const step = buildProtocolCallStep({
    contract: "CobuildCommunityTerminal",
    functionName: "addToBalanceOf",
    label: "Add balance to community terminal",
    to: terminalAddress,
    abi: cobuildCommunityTerminalAddToBalanceAbi,
    args: [projectId, tokenAddress, amount, false, memo, metadata],
    valueEth,
  });
  const execution = buildTerminalFundingPlanArtifacts({
    tokenAddress,
    terminalAddress,
    amount,
    terminalLabel: "community terminal",
    callStep: step,
    nativePreconditions: [
      `Ensure the transaction sends exactly ${amount.toString()} wei as msg.value.`,
    ],
  });

  const plan = {
    network: resolveProtocolPlanNetwork(params.network),
    action: "community.add-to-balance",
    riskClass: "economic",
    summary: `Add balance to community ${projectId.toString()} through terminal ${terminalAddress}.`,
    terminalAddress,
    projectId: projectId.toString(),
    tokenAddress,
    amount: amount.toString(),
    memo,
    metadata,
    approvalIncluded: execution.approvalIncluded,
    transaction: execution.transaction,
    preconditions: execution.preconditions,
    expectedEvents: ["AddToBalance"],
    steps: execution.steps,
  } satisfies CommunityTerminalAddToBalancePlanCore;

  return {
    ...plan,
    token: plan.tokenAddress,
  };
}
