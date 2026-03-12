import { encodeFunctionData, type Abi } from "viem";
import { normalizeEvmAddress, type EvmAddress } from "../evm.js";
import {
  COBUILD_REVNET_PROJECT_ID,
  REVNET_CHAIN_ID,
  REVNET_INCLUDE_ROOT_PERMISSION,
  REVNET_INCLUDE_WILDCARD_PERMISSION,
  REVNET_LOAN_PERMISSION_ID,
  REVNET_NATIVE_TOKEN,
} from "./config.js";
import { jbMultiTerminalAbi, jbPermissionsAbi, revLoansAbi } from "./abis.js";
import { quoteRevnetLoan } from "./math.js";
import { getRevnetBorrowContext } from "./read.js";
import type {
  ContractWriteIntent,
  EncodedWriteIntent,
  RevnetBorrowContext,
  RevnetBorrowPermissionMode,
  RevnetBorrowPlan,
  RevnetLoanQuote,
  RevnetLoanSource,
  RevnetReadClient,
  RevnetWritePlanStep,
} from "./types.js";

type RevnetPayArgs = readonly [
  projectId: bigint,
  token: EvmAddress,
  amount: bigint,
  beneficiary: EvmAddress,
  minReturnedTokens: bigint,
  memo: string,
  metadata: `0x${string}`,
];

type RevnetCashOutArgs = readonly [
  holder: EvmAddress,
  projectId: bigint,
  cashOutCount: bigint,
  tokenToReclaim: EvmAddress,
  minTokensReclaimed: bigint,
  beneficiary: EvmAddress,
  metadata: `0x${string}`,
];

type RevnetGrantLoanPermissionArgs = readonly [
  account: EvmAddress,
  {
    operator: EvmAddress;
    projectId: bigint;
    permissionIds: readonly number[];
  },
];

type RevnetBorrowArgs = readonly [
  projectId: bigint,
  source: RevnetLoanSource,
  minBorrowAmount: bigint,
  collateralCount: bigint,
  beneficiary: EvmAddress,
  prepaidFeePercent: bigint,
];

export type RevnetPayIntent = ContractWriteIntent<typeof jbMultiTerminalAbi, "pay", RevnetPayArgs>;
export type RevnetCashOutIntent = ContractWriteIntent<
  typeof jbMultiTerminalAbi,
  "cashOutTokensOf",
  RevnetCashOutArgs
>;
export type RevnetGrantLoanPermissionIntent = ContractWriteIntent<
  typeof jbPermissionsAbi,
  "setPermissionsFor",
  RevnetGrantLoanPermissionArgs
>;
export type RevnetBorrowIntent = ContractWriteIntent<
  typeof revLoansAbi,
  "borrowFrom",
  RevnetBorrowArgs
>;
export type RevnetWriteIntent =
  | RevnetPayIntent
  | RevnetCashOutIntent
  | RevnetGrantLoanPermissionIntent
  | RevnetBorrowIntent;

function toBigInt(value: bigint | number): bigint {
  return typeof value === "bigint" ? value : BigInt(value);
}

export function buildRevnetPayIntent(params: {
  terminalAddress: EvmAddress;
  projectId?: bigint;
  amount?: bigint;
  paymentAmount?: bigint;
  token?: EvmAddress;
  paymentToken?: EvmAddress;
  beneficiary: EvmAddress;
  minReturnedTokens?: bigint;
  memo?: string;
  metadata?: `0x${string}`;
}): RevnetPayIntent {
  const amount = params.amount ?? params.paymentAmount ?? 0n;
  const token = normalizeEvmAddress(params.token ?? params.paymentToken ?? REVNET_NATIVE_TOKEN, "token");
  return {
    address: normalizeEvmAddress(params.terminalAddress, "terminalAddress"),
    abi: jbMultiTerminalAbi,
    functionName: "pay",
    args: [
      params.projectId ?? COBUILD_REVNET_PROJECT_ID,
      token,
      amount,
      normalizeEvmAddress(params.beneficiary, "beneficiary"),
      params.minReturnedTokens ?? 0n,
      params.memo ?? "",
      params.metadata ?? "0x",
    ],
    ...(token === REVNET_NATIVE_TOKEN ? { value: amount } : {}),
  };
}

export function buildRevnetCashOutIntent(params: {
  terminalAddress: EvmAddress;
  holder: EvmAddress;
  projectId?: bigint;
  cashOutCount: bigint;
  tokenToReclaim: EvmAddress;
  minTokensReclaimed?: bigint;
  beneficiary?: EvmAddress;
  metadata?: `0x${string}`;
}): RevnetCashOutIntent {
  return {
    address: normalizeEvmAddress(params.terminalAddress, "terminalAddress"),
    abi: jbMultiTerminalAbi,
    functionName: "cashOutTokensOf",
    args: [
      normalizeEvmAddress(params.holder, "holder"),
      params.projectId ?? COBUILD_REVNET_PROJECT_ID,
      params.cashOutCount,
      normalizeEvmAddress(params.tokenToReclaim, "tokenToReclaim"),
      params.minTokensReclaimed ?? 0n,
      normalizeEvmAddress(params.beneficiary ?? params.holder, "beneficiary"),
      params.metadata ?? "0x",
    ],
  };
}

export function buildRevnetGrantLoanPermissionIntent(params: {
  permissionsAddress: EvmAddress;
  account: EvmAddress;
  operator: EvmAddress;
  projectId?: bigint;
  permissionIds?: readonly number[];
}): RevnetGrantLoanPermissionIntent {
  return {
    address: normalizeEvmAddress(params.permissionsAddress, "permissionsAddress"),
    abi: jbPermissionsAbi,
    functionName: "setPermissionsFor",
    args: [
      normalizeEvmAddress(params.account, "account"),
      {
        operator: normalizeEvmAddress(params.operator, "operator"),
        projectId: params.projectId ?? COBUILD_REVNET_PROJECT_ID,
        permissionIds: params.permissionIds ?? [Number(REVNET_LOAN_PERMISSION_ID)],
      },
    ],
  };
}

export function buildRevnetBorrowIntent(params: {
  revLoansAddress: EvmAddress;
  projectId?: bigint;
  source: RevnetLoanSource;
  collateralCount: bigint;
  beneficiary: EvmAddress;
  prepaidFeePercent: bigint | number;
  minBorrowAmount?: bigint;
}): RevnetBorrowIntent {
  return {
    address: normalizeEvmAddress(params.revLoansAddress, "revLoansAddress"),
    abi: revLoansAbi,
    functionName: "borrowFrom",
    args: [
      params.projectId ?? COBUILD_REVNET_PROJECT_ID,
      params.source,
      params.minBorrowAmount ?? 0n,
      params.collateralCount,
      normalizeEvmAddress(params.beneficiary, "beneficiary"),
      toBigInt(params.prepaidFeePercent),
    ],
  };
}

export function buildRevnetBorrowPlan(params: {
  account: EvmAddress;
  projectId?: bigint;
  loanSource?: RevnetLoanSource;
  source?: RevnetLoanSource;
  collateralCount: bigint;
  prepaidFeePercent: bigint | number;
  needsPermission: boolean;
  permissionsAddress: EvmAddress;
  revLoansAddress: EvmAddress;
  beneficiary?: EvmAddress;
  minBorrowAmount?: bigint;
  borrowableAmount?: bigint | null;
  borrowableContext?: RevnetBorrowContext["borrowableContext"];
  revPrepaidFeePercent?: bigint | number;
  maxPrepaidFeePercent?: bigint | number;
  permissionMode?: RevnetBorrowPermissionMode;
}): RevnetBorrowPlan<RevnetWriteIntent> {
  const source = params.loanSource ?? params.source;
  if (!source) {
    throw new Error("loanSource is required.");
  }

  const permissionMode = params.permissionMode ?? "auto";
  const permissionRequired =
    permissionMode === "force" || (permissionMode === "auto" && params.needsPermission);
  const steps: RevnetWritePlanStep<RevnetWriteIntent>[] = [];

  if (permissionRequired) {
    steps.push({
      key: "permission",
      id: "permission",
      label: "Grant REV loan permission",
      intent: buildRevnetGrantLoanPermissionIntent({
        permissionsAddress: params.permissionsAddress,
        account: params.account,
        operator: params.revLoansAddress,
        ...(params.projectId !== undefined ? { projectId: params.projectId } : {}),
      }),
    });
  }

  steps.push({
    key: "borrow",
    id: "borrow",
    label: "Borrow from REV loan source",
    intent: buildRevnetBorrowIntent({
      revLoansAddress: params.revLoansAddress,
      ...(params.projectId !== undefined ? { projectId: params.projectId } : {}),
      source,
      collateralCount: params.collateralCount,
      beneficiary: params.beneficiary ?? params.account,
      prepaidFeePercent: params.prepaidFeePercent,
      ...(params.minBorrowAmount !== undefined ? { minBorrowAmount: params.minBorrowAmount } : {}),
    }),
  });

  const quote: RevnetLoanQuote | null =
    params.borrowableAmount == null || params.borrowableContext == null
      ? null
      : quoteRevnetLoan({
          borrowableAmount: params.borrowableAmount,
          borrowableContext: params.borrowableContext,
          prepaidFeePercent: params.prepaidFeePercent,
          ...(params.revPrepaidFeePercent !== undefined
            ? { revPrepaidFeePercent: params.revPrepaidFeePercent }
            : {}),
          ...(params.maxPrepaidFeePercent !== undefined
            ? { maxPrepaidFeePercent: params.maxPrepaidFeePercent }
            : {}),
        });

  const plan = {
    chainId: REVNET_CHAIN_ID,
    projectId: params.projectId ?? COBUILD_REVNET_PROJECT_ID,
    account: normalizeEvmAddress(params.account, "account"),
    loanSource: source,
    collateralCount: params.collateralCount,
    borrowableContext: params.borrowableContext ?? null,
    borrowableAmount: params.borrowableAmount ?? null,
    quote,
    permissionRequired,
    preconditions:
      permissionMode === "skip" && params.needsPermission
        ? [
            `Ensure ${params.account} has loan permission ${REVNET_LOAN_PERMISSION_ID} on revnet ${(params.projectId ?? COBUILD_REVNET_PROJECT_ID).toString()}.`,
            `The permission check includes root=${String(REVNET_INCLUDE_ROOT_PERMISSION)} and wildcard=${String(REVNET_INCLUDE_WILDCARD_PERMISSION)}.`,
          ]
        : [],
    steps,
  } satisfies Omit<RevnetBorrowPlan<RevnetWriteIntent>, "requiresPermission">;

  return {
    ...plan,
    requiresPermission: plan.permissionRequired,
  };
}

export function buildRevnetBorrowPlanFromContext(
  context: RevnetBorrowContext,
  params: {
    prepaidFeePercent: bigint | number;
    beneficiary?: EvmAddress;
    minBorrowAmount?: bigint;
    permissionMode?: RevnetBorrowPermissionMode;
  }
): RevnetBorrowPlan<RevnetWriteIntent> {
  if (!context.selectedLoanSource) {
    throw new Error("Loan not available for this project.");
  }
  if (!context.account) {
    throw new Error("Borrow plan context requires an account.");
  }

  return buildRevnetBorrowPlan({
    account: context.account,
    ...(context.projectId !== undefined ? { projectId: context.projectId } : {}),
    source: context.selectedLoanSource,
    collateralCount: context.collateralCount,
    prepaidFeePercent: params.prepaidFeePercent,
    needsPermission: context.needsBorrowPermission,
    permissionsAddress: context.permissionsAddress,
    revLoansAddress: context.revLoansAddress,
    ...(params.beneficiary !== undefined ? { beneficiary: params.beneficiary } : {}),
    ...(params.minBorrowAmount !== undefined ? { minBorrowAmount: params.minBorrowAmount } : {}),
    ...(context.borrowableAmount !== null ? { borrowableAmount: context.borrowableAmount } : {}),
    ...(context.borrowableContext !== null ? { borrowableContext: context.borrowableContext } : {}),
    revPrepaidFeePercent: context.feeConfig.revPrepaidFeePercent,
    maxPrepaidFeePercent: context.feeConfig.maxPrepaidFeePercent,
    ...(params.permissionMode !== undefined ? { permissionMode: params.permissionMode } : {}),
  });
}

export async function buildRevnetBorrowPlanFromClient(
  client: RevnetReadClient,
  params: {
    projectId?: bigint;
    account: EvmAddress;
    collateralCount: bigint;
    prepaidFeePercent: bigint | number;
    beneficiary?: EvmAddress;
    minBorrowAmount?: bigint;
    permissionMode?: RevnetBorrowPermissionMode;
    preferredBaseToken?: string;
    preferredLoanToken?: string;
  }
): Promise<RevnetBorrowPlan<RevnetWriteIntent>> {
  const context = await getRevnetBorrowContext(client, {
    account: params.account,
    ...(params.projectId !== undefined ? { projectId: params.projectId } : {}),
    ...(params.collateralCount !== undefined ? { collateralCount: params.collateralCount } : {}),
    ...(params.preferredBaseToken !== undefined
      ? { preferredBaseToken: params.preferredBaseToken }
      : {}),
    ...(params.preferredLoanToken !== undefined
      ? { preferredLoanToken: params.preferredLoanToken }
      : {}),
  });

  if (!context.selectedLoanSource) {
    throw new Error("Loan not available for this project.");
  }

  return buildRevnetBorrowPlan({
    account: params.account,
    projectId: context.projectId,
    source: context.selectedLoanSource,
    collateralCount: params.collateralCount,
    prepaidFeePercent: params.prepaidFeePercent,
    needsPermission: context.needsBorrowPermission,
    permissionsAddress: context.permissionsAddress,
    revLoansAddress: context.revLoansAddress,
    ...(params.beneficiary !== undefined ? { beneficiary: params.beneficiary } : {}),
    ...(params.minBorrowAmount !== undefined ? { minBorrowAmount: params.minBorrowAmount } : {}),
    ...(context.borrowableAmount !== null ? { borrowableAmount: context.borrowableAmount } : {}),
    ...(context.borrowableContext !== null ? { borrowableContext: context.borrowableContext } : {}),
    revPrepaidFeePercent: context.feeConfig.revPrepaidFeePercent,
    maxPrepaidFeePercent: context.feeConfig.maxPrepaidFeePercent,
    ...(params.permissionMode !== undefined ? { permissionMode: params.permissionMode } : {}),
  });
}

export function encodeWriteIntent<TAbi extends Abi>(intent: ContractWriteIntent<TAbi>): EncodedWriteIntent {
  return {
    to: normalizeEvmAddress(intent.address, "intent.address"),
    data: encodeFunctionData({
      abi: intent.abi as Abi,
      functionName: intent.functionName as never,
      args: intent.args as never,
    }),
    value: intent.value ?? 0n,
  };
}
