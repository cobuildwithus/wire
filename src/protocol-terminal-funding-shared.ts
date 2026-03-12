import { encodeAbiParameters, type Abi } from "viem";
import type { EvmAddress, HexBytes } from "./evm.js";
import { normalizeEvmAddress, normalizeHexByteString } from "./evm.js";
import { cobuildTerminalAddress } from "./protocol-addresses.js";
import {
  buildApprovalPlan,
  formatProtocolValueEthFromWei,
  normalizeProtocolBigInt,
  type ProtocolContractCallStep,
  type ProtocolPlanStep,
  type ProtocolTransaction,
  type BigintLike,
} from "./protocol-plans.js";
import { REVNET_NATIVE_TOKEN } from "./revnet/config.js";

export const cobuildGoalTerminalPayAbi = [
  {
    type: "function",
    name: "pay",
    stateMutability: "payable",
    inputs: [
      { name: "projectId", type: "uint256" },
      { name: "token", type: "address" },
      { name: "amount", type: "uint256" },
      { name: "beneficiary", type: "address" },
      { name: "minReturnedTokens", type: "uint256" },
      { name: "memo", type: "string" },
      { name: "metadata", type: "bytes" },
    ],
    outputs: [{ name: "beneficiaryTokenCount", type: "uint256" }],
  },
] as const satisfies Abi;

export const cobuildCommunityTerminalPayAbi = [
  {
    type: "function",
    name: "pay",
    stateMutability: "payable",
    inputs: [
      { name: "projectId", type: "uint256" },
      { name: "token", type: "address" },
      { name: "amount", type: "uint256" },
      { name: "beneficiary", type: "address" },
      { name: "minReturnedTokens", type: "uint256" },
      { name: "memo", type: "string" },
      { name: "metadata", type: "bytes" },
    ],
    outputs: [{ name: "beneficiaryTokenCount", type: "uint256" }],
  },
] as const satisfies Abi;

export const cobuildCommunityTerminalAddToBalanceAbi = [
  {
    type: "function",
    name: "addToBalanceOf",
    stateMutability: "payable",
    inputs: [
      { name: "projectId", type: "uint256" },
      { name: "token", type: "address" },
      { name: "amount", type: "uint256" },
      { name: "shouldReturnHeldFees", type: "bool" },
      { name: "memo", type: "string" },
      { name: "metadata", type: "bytes" },
    ],
    outputs: [],
  },
] as const satisfies Abi;

function normalizeUint32(
  value: BigintLike,
  label: string,
  overflowMessage = `${label} must fit in uint32.`
): number {
  const normalized = normalizeProtocolBigInt(value, label);
  if (normalized > 4_294_967_295n) {
    throw new Error(overflowMessage);
  }
  return Number(normalized);
}

export function resolveTerminalFundingToken(token?: string): EvmAddress {
  if (!token) {
    return REVNET_NATIVE_TOKEN;
  }
  return normalizeEvmAddress(token, "token");
}

export function isNativeTerminalFundingToken(token: EvmAddress): boolean {
  return token === REVNET_NATIVE_TOKEN;
}

export function resolveTerminalFundingValueEth(
  token: EvmAddress,
  amount: BigintLike,
  label: string
): string {
  if (!isNativeTerminalFundingToken(token)) {
    return "0";
  }
  return formatProtocolValueEthFromWei(amount, label);
}

export function resolveTerminalFundingMemo(memo?: string): string {
  return memo ?? "";
}

export function resolveTerminalFundingMetadata(metadata: string | undefined, label: string): HexBytes {
  if (metadata === undefined) {
    return "0x";
  }
  if (metadata.trim().toLowerCase() === "0x") {
    return "0x";
  }
  return normalizeHexByteString(metadata, label);
}

export function resolveCommunityTerminalAddress(terminal?: string): EvmAddress {
  if (!terminal) {
    return normalizeEvmAddress(cobuildTerminalAddress, "cobuildTerminalAddress");
  }
  return normalizeEvmAddress(terminal, "terminal");
}

export function buildTerminalFundingApprovalPlan(params: {
  tokenAddress: EvmAddress;
  terminalAddress: EvmAddress;
  amount: BigintLike;
  terminalLabel: string;
}) {
  if (isNativeTerminalFundingToken(params.tokenAddress)) {
    return {
      approvalIncluded: false,
      preconditions: [] as string[],
      steps: [] as const,
    };
  }

  return buildApprovalPlan({
    mode: "force",
    tokenAddress: params.tokenAddress,
    spenderAddress: params.terminalAddress,
    requiredAmount: params.amount,
    tokenLabel: "payment token",
    spenderLabel: params.terminalLabel,
  });
}

export function buildTerminalFundingPlanArtifacts<TStep extends ProtocolContractCallStep>(params: {
  tokenAddress: EvmAddress;
  terminalAddress: EvmAddress;
  amount: BigintLike;
  terminalLabel: string;
  callStep: TStep;
  nativePreconditions?: readonly string[];
}): {
  approvalIncluded: boolean;
  preconditions: readonly string[];
  transaction: ProtocolTransaction;
  steps: readonly ProtocolPlanStep[];
} {
  const approvalPlan = buildTerminalFundingApprovalPlan({
    tokenAddress: params.tokenAddress,
    terminalAddress: params.terminalAddress,
    amount: params.amount,
    terminalLabel: params.terminalLabel,
  });

  return {
    approvalIncluded: approvalPlan.approvalIncluded,
    preconditions:
      isNativeTerminalFundingToken(params.tokenAddress) && params.nativePreconditions
        ? [...params.nativePreconditions]
        : approvalPlan.preconditions,
    transaction: params.callStep.transaction,
    steps: [...approvalPlan.steps, params.callStep],
  };
}

function normalizeCommunityTerminalPayRoute(params: {
  goalIds?: readonly BigintLike[];
  weights?: readonly BigintLike[];
  weightOverflowMessage?: (label: string) => string;
}): {
  goalIds: bigint[];
  weights: number[];
} {
  const goalIds = (params.goalIds ?? []).map((goalId, index) =>
    normalizeProtocolBigInt(goalId, `route.goalIds[${index}]`)
  );
  const weights = (params.weights ?? []).map((weight, index) =>
    normalizeUint32(
      weight,
      `route.weights[${index}]`,
      params.weightOverflowMessage?.(`route.weights[${index}]`)
    )
  );
  if (goalIds.length !== weights.length) {
    throw new Error("route.goalIds and route.weights must have the same length.");
  }

  return {
    goalIds,
    weights,
  };
}

export function resolveCommunityTerminalPayMetadata(params: {
  goalIds?: readonly BigintLike[];
  weights?: readonly BigintLike[];
  jbMetadata?: string;
  weightOverflowMessage?: (label: string) => string;
}): {
  metadata: HexBytes;
  goalIds: bigint[];
  weights: number[];
  jbMetadata: HexBytes;
} {
  const { goalIds, weights } = normalizeCommunityTerminalPayRoute(params);
  const jbMetadata = resolveTerminalFundingMetadata(params.jbMetadata, "jbMetadata");
  return {
    metadata: encodeAbiParameters(
      [
        { type: "uint256[]" },
        { type: "uint32[]" },
        { type: "bytes" },
      ],
      [goalIds, weights, jbMetadata]
    ),
    goalIds,
    weights,
    jbMetadata,
  };
}

export function encodeCommunityTerminalPayMetadata(params: {
  goalIds?: readonly BigintLike[];
  weights?: readonly BigintLike[];
  jbMetadata?: string;
}): {
  metadata: HexBytes;
  goalIds: bigint[];
  weights: number[];
  jbMetadata: HexBytes;
} {
  return resolveCommunityTerminalPayMetadata(params);
}
