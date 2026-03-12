import type { ContractFunctionArgs } from "viem";
import type { EvmAddress, HexBytes } from "./evm.js";
import { normalizeEvmAddress } from "./evm.js";
import { resolveProtocolAddresses } from "./protocol-addresses.js";
import {
  buildProtocolCallStep,
  normalizeProtocolBigInt,
  resolveProtocolPlanNetwork,
  type BigintLike,
  type ProtocolExecutionPlan,
  type ProtocolPlanStep,
  type ProtocolTransaction,
} from "./protocol-plans.js";
import {
  buildTerminalFundingPlanArtifacts,
  cobuildCommunityTerminalPayAbi,
  isNativeTerminalFundingToken,
  resolveCommunityTerminalAddress,
  resolveCommunityTerminalPayMetadata,
  resolveTerminalFundingMemo,
  resolveTerminalFundingToken,
  resolveTerminalFundingValueEth,
} from "./protocol-terminal-funding-shared.js";

export type CommunityTerminalPayRouteInput = {
  goalIds?: readonly BigintLike[];
  weights?: readonly BigintLike[];
};

export type CommunityTerminalPayRoute = {
  goalIds: readonly bigint[];
  weights: readonly number[];
};

export type CommunityTerminalPayArgs = ContractFunctionArgs<
  typeof cobuildCommunityTerminalPayAbi,
  "payable",
  "pay"
>;

export type CommunityTerminalPayTransaction = ProtocolTransaction;

export type CommunityTerminalPayWriteContractRequest = {
  address: EvmAddress;
  abi: typeof cobuildCommunityTerminalPayAbi;
  functionName: "pay";
  args: CommunityTerminalPayArgs;
  value?: bigint;
};

export type CommunityTerminalPayPlan = ProtocolExecutionPlan<"community.pay"> & {
  chainId: number;
  network: "base";
  terminal: EvmAddress;
  projectId: bigint;
  token: EvmAddress;
  amount: bigint;
  beneficiary: EvmAddress;
  minReturnedTokens: bigint;
  memo: string;
  route: CommunityTerminalPayRoute;
  jbMetadata: HexBytes;
  metadata: HexBytes;
  approvalIncluded: boolean;
  transaction: CommunityTerminalPayTransaction;
  writeContract: CommunityTerminalPayWriteContractRequest;
};

type ResolvedCommunityTerminalPayArtifacts = {
  chainId: number;
  network: "base";
  terminal: EvmAddress;
  projectId: bigint;
  token: EvmAddress;
  amount: bigint;
  beneficiary: EvmAddress;
  minReturnedTokens: bigint;
  memo: string;
  route: CommunityTerminalPayRoute;
  jbMetadata: HexBytes;
  metadata: HexBytes;
  approvalIncluded: boolean;
  transaction: CommunityTerminalPayTransaction;
  writeContract: CommunityTerminalPayWriteContractRequest;
  steps: readonly ProtocolPlanStep[];
  preconditions: readonly string[];
};

type CommunityTerminalPayPlanParams = {
  terminal?: string;
  projectId: BigintLike;
  token?: string;
  amount: BigintLike;
  beneficiary: string;
  minReturnedTokens?: BigintLike;
  memo?: string;
  route?: CommunityTerminalPayRouteInput;
  jbMetadata?: string;
  network?: string;
};

function resolveCommunityTerminalPayArtifacts(
  params: CommunityTerminalPayPlanParams
): ResolvedCommunityTerminalPayArtifacts {
  const protocolAddresses = resolveProtocolAddresses(params.network ?? "base");
  const network = resolveProtocolPlanNetwork(params.network);
  const terminal = resolveCommunityTerminalAddress(params.terminal);
  const projectId = normalizeProtocolBigInt(params.projectId, "projectId");
  const token = resolveTerminalFundingToken(params.token);
  const amount = normalizeProtocolBigInt(params.amount, "amount");
  const beneficiary = normalizeEvmAddress(params.beneficiary, "beneficiary");
  const minReturnedTokens = normalizeProtocolBigInt(
    params.minReturnedTokens ?? 0,
    "minReturnedTokens"
  );
  const memo = resolveTerminalFundingMemo(params.memo);
  const { metadata, goalIds, weights, jbMetadata } = resolveCommunityTerminalPayMetadata({
    ...(params.route?.goalIds !== undefined ? { goalIds: params.route.goalIds } : {}),
    ...(params.route?.weights !== undefined ? { weights: params.route.weights } : {}),
    ...(params.jbMetadata !== undefined ? { jbMetadata: params.jbMetadata } : {}),
    weightOverflowMessage: (label) => `${label} exceeds uint32.`,
  });
  const args = [
    projectId,
    token,
    amount,
    beneficiary,
    minReturnedTokens,
    memo,
    metadata,
  ] as const satisfies CommunityTerminalPayArgs;
  const writeContract: CommunityTerminalPayWriteContractRequest = {
    address: terminal,
    abi: cobuildCommunityTerminalPayAbi,
    functionName: "pay",
    args,
    ...(isNativeTerminalFundingToken(token) ? { value: amount } : {}),
  };
  const payStep = buildProtocolCallStep({
    contract: "CobuildCommunityTerminal",
    functionName: "pay",
    label: "Pay community terminal",
    to: terminal,
    abi: cobuildCommunityTerminalPayAbi,
    args,
    valueEth: resolveTerminalFundingValueEth(token, amount, "amount"),
  });
  const execution = buildTerminalFundingPlanArtifacts({
    tokenAddress: token,
    terminalAddress: terminal,
    amount,
    terminalLabel: "community terminal",
    callStep: payStep,
  });
  return {
    chainId: protocolAddresses.chainId,
    network,
    terminal,
    projectId,
    token,
    amount,
    beneficiary,
    minReturnedTokens,
    memo,
    route: {
      goalIds,
      weights,
    },
    jbMetadata,
    metadata,
    approvalIncluded: execution.approvalIncluded,
    transaction: execution.transaction,
    writeContract,
    preconditions: execution.preconditions,
    steps: execution.steps,
  };
}

export function buildCommunityTerminalPayPlan(
  params: CommunityTerminalPayPlanParams
): CommunityTerminalPayPlan {
  const artifacts = resolveCommunityTerminalPayArtifacts(params);

  return {
    chainId: artifacts.chainId,
    network: artifacts.network,
    action: "community.pay",
    riskClass: "economic",
    summary: `Pay community ${artifacts.projectId.toString()} through terminal ${artifacts.terminal}.`,
    terminal: artifacts.terminal,
    projectId: artifacts.projectId,
    token: artifacts.token,
    amount: artifacts.amount,
    beneficiary: artifacts.beneficiary,
    minReturnedTokens: artifacts.minReturnedTokens,
    memo: artifacts.memo,
    route: artifacts.route,
    jbMetadata: artifacts.jbMetadata,
    metadata: artifacts.metadata,
    approvalIncluded: artifacts.approvalIncluded,
    transaction: artifacts.transaction,
    writeContract: artifacts.writeContract,
    preconditions: artifacts.preconditions,
    expectedEvents: ["Pay"],
    steps: artifacts.steps,
  };
}

export function buildCommunityTerminalPayWriteContractRequest(
  params: CommunityTerminalPayPlanParams
): CommunityTerminalPayWriteContractRequest {
  return resolveCommunityTerminalPayArtifacts(params).writeContract;
}

export function buildCommunityTerminalPayTransaction(
  params: CommunityTerminalPayPlanParams
): CommunityTerminalPayTransaction {
  return resolveCommunityTerminalPayArtifacts(params).transaction;
}
