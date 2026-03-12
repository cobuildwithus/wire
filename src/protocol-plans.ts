import {
  encodeFunctionData,
  erc20Abi,
  formatEther,
  parseEther,
  type Abi,
  type Hex,
} from "viem";
import type { EvmAddress } from "./evm.js";
import { normalizeEvmAddress } from "./evm.js";
import { normalizeProtocolNetwork, type ProtocolNetwork } from "./protocol-addresses.js";

export type BigintLike = string | number | bigint;
export type ProtocolApprovalMode = "auto" | "force" | "skip";
export type ProtocolRiskClass =
  | "stake"
  | "claim"
  | "governance"
  | "maintenance"
  | "economic";

export type ProtocolTransaction = {
  to: EvmAddress;
  data: Hex;
  valueEth: string;
};

export type ProtocolContractCallStep = {
  kind: "contract-call";
  label: string;
  contract: string;
  functionName: string;
  transaction: ProtocolTransaction;
};

export type ProtocolErc20ApprovalStep = {
  kind: "erc20-approval";
  label: string;
  tokenAddress: EvmAddress;
  spenderAddress: EvmAddress;
  amount: string;
  transaction: ProtocolTransaction;
};

export type ProtocolPlanStep = ProtocolContractCallStep | ProtocolErc20ApprovalStep;

export type ProtocolExecutionPlan<TAction extends string = string> = {
  network: ProtocolNetwork;
  action: TAction;
  riskClass: ProtocolRiskClass;
  summary: string;
  preconditions: readonly string[];
  steps: readonly ProtocolPlanStep[];
  expectedEvents?: readonly string[];
};

type SerializedRecord = Record<string, unknown>;

function isRecord(value: unknown): value is SerializedRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function normalizeProtocolBigInt(value: BigintLike, label: string): bigint {
  if (typeof value === "bigint") {
    if (value < 0n) {
      throw new Error(`${label} must be a non-negative integer.`);
    }
    return value;
  }

  if (typeof value === "number") {
    if (!Number.isFinite(value) || !Number.isInteger(value) || value < 0) {
      throw new Error(`${label} must be a non-negative integer.`);
    }
    return BigInt(value);
  }

  const normalized = value.trim();
  if (!/^\d+$/.test(normalized)) {
    throw new Error(`${label} must be a non-negative integer.`);
  }
  return BigInt(normalized);
}

export function normalizeProtocolValueEth(value: string, label: string): string {
  const normalized = value.trim();
  if (normalized.length === 0) {
    throw new Error(`${label} must be a non-negative ETH amount string.`);
  }

  try {
    const wei = parseEther(normalized);
    if (wei < 0n) {
      throw new Error("negative");
    }
    return formatEther(wei);
  } catch {
    throw new Error(`${label} must be a non-negative ETH amount string.`);
  }
}

export function formatProtocolValueEthFromWei(value: BigintLike, label: string): string {
  return formatEther(normalizeProtocolBigInt(value, label));
}

export function normalizeOptionalProtocolBigInt(
  value: BigintLike | null | undefined,
  label: string
): bigint | null {
  if (value === null || value === undefined) {
    return null;
  }
  return normalizeProtocolBigInt(value, label);
}

export function buildProtocolCallStep(params: {
  contract: string;
  functionName: string;
  label: string;
  to: string;
  abi: Abi;
  args?: readonly unknown[];
  valueEth?: string;
}): ProtocolContractCallStep {
  return {
    kind: "contract-call",
    label: params.label,
    contract: params.contract,
    functionName: params.functionName,
    transaction: {
      to: normalizeEvmAddress(params.to, `${params.contract} address`),
      data: encodeFunctionData({
        abi: params.abi,
        functionName: params.functionName,
        ...(params.args ? { args: params.args } : {}),
      }),
      valueEth:
        params.valueEth === undefined
          ? "0"
          : normalizeProtocolValueEth(params.valueEth, `${params.contract}.${params.functionName} valueEth`),
    },
  };
}

export function buildProtocolApprovalStep(params: {
  label: string;
  tokenAddress: string;
  spenderAddress: string;
  amount: BigintLike;
}): ProtocolErc20ApprovalStep {
  const tokenAddress = normalizeEvmAddress(params.tokenAddress, "tokenAddress");
  const spenderAddress = normalizeEvmAddress(params.spenderAddress, "spenderAddress");
  const amount = normalizeProtocolBigInt(params.amount, "approvalAmount");

  return {
    kind: "erc20-approval",
    label: params.label,
    tokenAddress,
    spenderAddress,
    amount: amount.toString(),
    transaction: {
      to: tokenAddress,
      data: encodeFunctionData({
        abi: erc20Abi,
        functionName: "approve",
        args: [spenderAddress, amount],
      }),
      valueEth: "0",
    },
  };
}

export function buildApprovalPlan(params: {
  mode?: ProtocolApprovalMode;
  tokenAddress: string;
  spenderAddress: string;
  requiredAmount: BigintLike;
  currentAllowance?: BigintLike | null;
  approvalAmount?: BigintLike;
  tokenLabel: string;
  spenderLabel: string;
}): {
  approvalIncluded: boolean;
  preconditions: string[];
  steps: ProtocolPlanStep[];
} {
  const mode = params.mode ?? "auto";
  const requiredAmount = normalizeProtocolBigInt(params.requiredAmount, "requiredAmount");
  const currentAllowance = normalizeOptionalProtocolBigInt(
    params.currentAllowance,
    "currentAllowance"
  );
  const approvalAmount = normalizeProtocolBigInt(
    params.approvalAmount ?? requiredAmount,
    "approvalAmount"
  );

  if (mode === "skip") {
    return {
      approvalIncluded: false,
      preconditions: [
        `Ensure ${params.tokenLabel} allowance for ${params.spenderLabel} covers at least ${requiredAmount.toString()}.`,
      ],
      steps: [],
    };
  }

  if (mode === "auto") {
    if (currentAllowance === null) {
      return {
        approvalIncluded: false,
        preconditions: [
          `Ensure ${params.tokenLabel} allowance for ${params.spenderLabel} covers at least ${requiredAmount.toString()}.`,
        ],
        steps: [],
      };
    }

    if (currentAllowance >= requiredAmount) {
      return {
        approvalIncluded: false,
        preconditions: [],
        steps: [],
      };
    }
  }

  return {
    approvalIncluded: true,
    preconditions: [],
    steps: [
      buildProtocolApprovalStep({
        label: `Approve ${params.tokenLabel} for ${params.spenderLabel}`,
        tokenAddress: params.tokenAddress,
        spenderAddress: params.spenderAddress,
        amount: approvalAmount,
      }),
    ],
  };
}

export function resolveProtocolPlanNetwork(network?: ProtocolNetwork | string): ProtocolNetwork {
  const normalized = (network ?? "base").trim().toLowerCase();
  return normalizeProtocolNetwork(normalized === "base-mainnet" ? "base" : normalized);
}

export function serializeProtocolBigInts(value: unknown): unknown {
  if (typeof value === "bigint") {
    return value.toString(10);
  }
  if (Array.isArray(value)) {
    return value.map((entry) => serializeProtocolBigInts(entry));
  }
  if (isRecord(value)) {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [key, serializeProtocolBigInts(entry)])
    );
  }
  return value;
}
