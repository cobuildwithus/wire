import { erc20Abi, zeroAddress } from "viem";
import { isSameEvmAddress, normalizeEvmAddress, parseEvmAddress, type EvmAddress } from "../evm.js";
import {
  baseRevnetContracts,
  COBUILD_REVNET_PROJECT_ID,
  REVNET_CHAIN_ID,
  REVNET_INCLUDE_ROOT_PERMISSION,
  REVNET_INCLUDE_WILDCARD_PERMISSION,
  REVNET_LOAN_PERMISSION_ID,
  REVNET_NATIVE_TOKEN,
  REVNET_PREFERRED_BASE_TOKEN,
  resolveRevnetContractAddresses,
  type RevnetContractAddresses,
} from "./config.js";
import {
  jbControllerAbi,
  jbDirectoryAbi,
  jbMultiTerminalAbi,
  jbPermissionsAbi,
  jbTerminalStoreAbi,
  jbTokensAbi,
  revDeployerAbi,
  revLoansAbi,
} from "./abis.js";
import {
  applyJbDaoCashOutFee,
  applyRevnetCashOutFee,
  quoteRevnetLoan,
  selectPreferredAccountingContext,
  selectPreferredLoanSource,
} from "./math.js";
import type {
  RevnetAccountingContext,
  RevnetBorrowContext,
  RevnetCashOutContext,
  RevnetCashOutQuote,
  RevnetCurrentRuleset,
  RevnetLoanQuote,
  RevnetLoanSource,
  RevnetPaymentContext,
  RevnetPositionContext,
  RevnetProjectTokenContext,
  RevnetReadClient,
} from "./types.js";

type CurrentRulesetReadResult = readonly [
  {
    cycleNumber: bigint | number;
    id: bigint | number;
    basedOnId: bigint | number;
    start: bigint | number;
    duration: bigint | number;
    weight: bigint | number;
    weightCutPercent: bigint | number;
    approvalHook: string;
    metadata: bigint | number;
  },
  {
    reservedPercent: bigint | number;
    cashOutTaxRate: bigint | number;
    baseCurrency: bigint | number;
    pausePay: boolean;
  },
];

function resolveOptionalNonZeroAddress(value: string): EvmAddress | null {
  const parsed = parseEvmAddress(value);
  if (!parsed || isSameEvmAddress(parsed, zeroAddress)) return null;
  return parsed;
}

function normalizeAccountingContext(raw: {
  token: string;
  decimals: bigint | number;
  currency: bigint | number;
}): RevnetAccountingContext {
  return {
    token: normalizeEvmAddress(raw.token, "accountingContext.token"),
    decimals: Number(raw.decimals),
    currency: Number(raw.currency),
  };
}

function normalizeLoanSource(raw: { token: string; terminal: string }): RevnetLoanSource {
  return {
    token: normalizeEvmAddress(raw.token, "loanSource.token"),
    terminal: normalizeEvmAddress(raw.terminal, "loanSource.terminal"),
  };
}

async function readOptionalLoanContext(
  client: RevnetReadClient,
  params: {
    projectId: bigint;
    preferredLoanToken?: string;
    selectedAccountingContext: RevnetAccountingContext | null;
    revLoansAddress: EvmAddress;
  }
): Promise<{
  loanSources: readonly RevnetLoanSource[];
  selectedLoanSource: RevnetLoanSource | null;
  selectedLoanAccountingContext: RevnetAccountingContext | null;
}> {
  let loanSources: readonly RevnetLoanSource[] = [];
  try {
    const loanSourcesRaw = (await client.readContract({
      address: params.revLoansAddress,
      abi: revLoansAbi,
      functionName: "loanSourcesOf",
      args: [params.projectId],
    })) as Array<{ token: string; terminal: string }>;
    loanSources = loanSourcesRaw.map(normalizeLoanSource);
  } catch {
    return {
      loanSources,
      selectedLoanSource: null,
      selectedLoanAccountingContext: null,
    };
  }

  const selectedLoanSource = selectPreferredLoanSource(
    loanSources,
    params.preferredLoanToken ?? params.selectedAccountingContext?.token
  );
  if (!selectedLoanSource) {
    return {
      loanSources,
      selectedLoanSource,
      selectedLoanAccountingContext: null,
    };
  }

  try {
    const selectedLoanAccountingContext = normalizeAccountingContext(
      (await client.readContract({
        address: selectedLoanSource.terminal,
        abi: jbMultiTerminalAbi,
        functionName: "accountingContextForTokenOf",
        args: [params.projectId, selectedLoanSource.token],
      })) as { token: string; decimals: bigint | number; currency: bigint | number }
    );
    return {
      loanSources,
      selectedLoanSource,
      selectedLoanAccountingContext,
    };
  } catch {
    return {
      loanSources,
      selectedLoanSource,
      selectedLoanAccountingContext: null,
    };
  }
}

function normalizeCurrentRuleset(result: CurrentRulesetReadResult): RevnetCurrentRuleset {
  const [ruleset, metadata] = result;
  return {
    ruleset: {
      cycleNumber: BigInt(ruleset.cycleNumber),
      id: BigInt(ruleset.id),
      basedOnId: BigInt(ruleset.basedOnId),
      start: BigInt(ruleset.start),
      duration: BigInt(ruleset.duration),
      weight: BigInt(ruleset.weight),
      weightCutPercent: BigInt(ruleset.weightCutPercent),
      approvalHook: normalizeEvmAddress(ruleset.approvalHook, "ruleset.approvalHook"),
      metadata: BigInt(ruleset.metadata),
    },
    metadata: {
      reservedPercent: Number(metadata.reservedPercent),
      cashOutTaxRate: Number(metadata.cashOutTaxRate),
      baseCurrency: Number(metadata.baseCurrency),
      pausePay: metadata.pausePay,
    },
  };
}

async function readProjectTokenContext(
  client: RevnetReadClient,
  projectId: bigint,
  account: EvmAddress | null,
  contracts: RevnetContractAddresses
): Promise<RevnetProjectTokenContext> {
  const tokenAddress = resolveOptionalNonZeroAddress(
    (await client.readContract({
      address: contracts.tokens,
      abi: jbTokensAbi,
      functionName: "tokenOf",
      args: [projectId],
    })) as string
  );
  const [symbol, decimals, balance] = await Promise.all([
    tokenAddress
      ? (client.readContract({
          address: tokenAddress,
          abi: erc20Abi,
          functionName: "symbol",
        }) as Promise<string>)
      : Promise.resolve(null),
    tokenAddress
      ? (client.readContract({
          address: tokenAddress,
          abi: erc20Abi,
          functionName: "decimals",
        }) as Promise<number>)
      : Promise.resolve(18),
    account
      ? (client.readContract({
          address: contracts.tokens,
          abi: jbTokensAbi,
          functionName: "totalBalanceOf",
          args: [account, projectId],
        }) as Promise<bigint>)
      : Promise.resolve(0n),
  ]);

  return {
    projectId,
    contracts,
    address: tokenAddress,
    symbol,
    decimals,
    balance,
  };
}

export const selectRevnetAccountingContext = selectPreferredAccountingContext;
export const selectRevnetLoanSource = selectPreferredLoanSource;

export async function getRevnetPaymentContext(
  client: RevnetReadClient,
  options?: {
    projectId?: bigint;
    token?: string;
    contracts?: Partial<RevnetContractAddresses>;
  }
): Promise<RevnetPaymentContext> {
  const projectId = options?.projectId ?? COBUILD_REVNET_PROJECT_ID;
  const contracts = resolveRevnetContractAddresses(options?.contracts);
  const paymentToken = options?.token
    ? normalizeEvmAddress(options.token, "token")
    : REVNET_NATIVE_TOKEN;

  const [rulesetResult, primaryTerminalRaw, terminalListRaw] = await Promise.all([
    client.readContract({
      address: contracts.controller,
      abi: jbControllerAbi,
      functionName: "currentRulesetOf",
      args: [projectId],
    }),
    client.readContract({
      address: contracts.directory,
      abi: jbDirectoryAbi,
      functionName: "primaryTerminalOf",
      args: [projectId, paymentToken],
    }),
    client.readContract({
      address: contracts.directory,
      abi: jbDirectoryAbi,
      functionName: "terminalsOf",
      args: [projectId],
    }),
  ]);

  const currentRuleset = normalizeCurrentRuleset(rulesetResult as CurrentRulesetReadResult);
  const primaryTerminal = resolveOptionalNonZeroAddress(primaryTerminalRaw as string);
  const terminals = (terminalListRaw as string[])
    .map((terminal) => resolveOptionalNonZeroAddress(terminal))
    .filter((terminal): terminal is EvmAddress => terminal !== null);
  const multiTerminal = terminals.find((terminal) => isSameEvmAddress(terminal, contracts.multiTerminal));
  const terminal = primaryTerminal ?? multiTerminal ?? terminals[0] ?? null;

  let accountingContexts: RevnetAccountingContext[] = [];
  let supportsToken = terminal !== null;
  if (terminal && isSameEvmAddress(terminal, contracts.multiTerminal)) {
    const contexts = (await client.readContract({
      address: contracts.multiTerminal,
      abi: jbMultiTerminalAbi,
      functionName: "accountingContextsOf",
      args: [projectId],
    })) as Array<{ token: string; decimals: bigint | number; currency: bigint | number }>;
    accountingContexts = contexts.map(normalizeAccountingContext);
    supportsToken = accountingContexts.some((context) => isSameEvmAddress(context.token, paymentToken));
  }

  return {
    chainId: REVNET_CHAIN_ID,
    projectId,
    token: paymentToken,
    contracts,
    ruleset: currentRuleset,
    terminal,
    terminalAddress: terminal,
    terminals,
    accountingContexts,
    supportsToken,
    supportsPayments: supportsToken,
    isPayPaused: currentRuleset.metadata.pausePay,
  };
}

export async function getRevnetPositionContext(
  client: RevnetReadClient,
  params: {
    projectId?: bigint;
    account?: string;
    preferredBaseToken?: string;
    preferredLoanToken?: string;
    contracts?: Partial<RevnetContractAddresses>;
  }
): Promise<RevnetPositionContext> {
  const projectId = params.projectId ?? COBUILD_REVNET_PROJECT_ID;
  const account = params.account ? normalizeEvmAddress(params.account, "account") : null;
  const contracts = resolveRevnetContractAddresses(params.contracts);
  const accountingContextsRaw = (await client.readContract({
    address: contracts.multiTerminal,
    abi: jbMultiTerminalAbi,
    functionName: "accountingContextsOf",
    args: [projectId],
  })) as Array<{ token: string; decimals: bigint | number; currency: bigint | number }>;
  const accountingContexts = accountingContextsRaw.map(normalizeAccountingContext);
  const selectedAccountingContext = selectPreferredAccountingContext(
    accountingContexts,
    params.preferredBaseToken ?? REVNET_PREFERRED_BASE_TOKEN
  );
  const terminal = selectedAccountingContext
    ? resolveOptionalNonZeroAddress(
        (await client.readContract({
          address: contracts.directory,
          abi: jbDirectoryAbi,
          functionName: "primaryTerminalOf",
          args: [projectId, selectedAccountingContext.token],
        })) as string
      )
    : null;
  const permissionsAddress =
    resolveOptionalNonZeroAddress(
      (await client.readContract({
        address: contracts.revDeployer,
        abi: revDeployerAbi,
        functionName: "PERMISSIONS",
      })) as string
    ) ?? contracts.permissions;
  const revLoansAddress =
    resolveOptionalNonZeroAddress(
      (await client.readContract({
        address: contracts.revDeployer,
        abi: revDeployerAbi,
        functionName: "loansOf",
        args: [projectId],
      })) as string
    ) ?? contracts.revLoans;
  const token = await readProjectTokenContext(client, projectId, account, contracts);
  const { loanSources, selectedLoanSource, selectedLoanAccountingContext } =
    await readOptionalLoanContext(client, {
      projectId,
      ...(params.preferredLoanToken !== undefined
        ? { preferredLoanToken: params.preferredLoanToken }
        : {}),
      selectedAccountingContext,
      revLoansAddress,
    });

  return {
    projectId,
    account,
    token,
    accountingContexts,
    selectedAccountingContext,
    terminal,
    permissionsAddress,
    revLoansAddress,
    loanSources,
    selectedLoanSource,
    selectedLoanAccountingContext,
  };
}

export async function quoteRevnetCashOut(
  client: RevnetReadClient,
  params: {
    projectId?: bigint;
    rawCashOutCount: bigint;
    terminal: EvmAddress;
    accountingContext: RevnetAccountingContext;
    contracts?: Partial<RevnetContractAddresses>;
  }
): Promise<RevnetCashOutQuote> {
  const projectId = params.projectId ?? COBUILD_REVNET_PROJECT_ID;
  const contracts = resolveRevnetContractAddresses(params.contracts);
  const quotedCashOutCount = applyRevnetCashOutFee(params.rawCashOutCount);
  const grossReclaimAmount = (await client.readContract({
    address: contracts.terminalStore,
    abi: jbTerminalStoreAbi,
    functionName: "currentReclaimableSurplusOf",
    args: [
      projectId,
      quotedCashOutCount,
      [params.terminal],
      [params.accountingContext],
      BigInt(params.accountingContext.decimals),
      BigInt(params.accountingContext.currency),
    ],
  })) as bigint;

  return {
    rawCashOutCount: params.rawCashOutCount,
    quotedCashOutCount,
    grossReclaimAmount,
    netReclaimAmount: applyJbDaoCashOutFee(grossReclaimAmount),
    terminal: params.terminal,
    accountingContext: params.accountingContext,
  };
}

export async function getRevnetCashOutContext(
  client: RevnetReadClient,
  params: {
    projectId?: bigint;
    account?: string;
    preferredBaseToken?: string;
    preferredLoanToken?: string;
    contracts?: Partial<RevnetContractAddresses>;
  }
): Promise<RevnetCashOutContext> {
  const position = await getRevnetPositionContext(client, {
    ...(params.projectId !== undefined ? { projectId: params.projectId } : {}),
    ...(params.account !== undefined ? { account: params.account } : {}),
    ...(params.preferredBaseToken !== undefined
      ? { preferredBaseToken: params.preferredBaseToken }
      : {}),
    ...(params.preferredLoanToken !== undefined
      ? { preferredLoanToken: params.preferredLoanToken }
      : {}),
    ...(params.contracts !== undefined ? { contracts: params.contracts } : {}),
  });
  return {
    ...position,
    quoteTerminal: position.terminal,
    quoteAccountingContext: position.selectedAccountingContext,
  };
}

export async function getRevnetBorrowContext(
  client: RevnetReadClient,
  params: {
    projectId?: bigint;
    account: string;
    collateralCount?: bigint;
    preferredBaseToken?: string;
    preferredLoanToken?: string;
    contracts?: Partial<RevnetContractAddresses>;
  }
): Promise<RevnetBorrowContext> {
  const collateralCount = params.collateralCount ?? 0n;
  const position = await getRevnetPositionContext(client, {
    ...(params.projectId !== undefined ? { projectId: params.projectId } : {}),
    account: params.account,
    ...(params.preferredBaseToken !== undefined
      ? { preferredBaseToken: params.preferredBaseToken }
      : {}),
    ...(params.preferredLoanToken !== undefined
      ? { preferredLoanToken: params.preferredLoanToken }
      : {}),
    ...(params.contracts !== undefined ? { contracts: params.contracts } : {}),
  });
  const [hasBorrowPermission, feeConfig, borrowableAmount, borrowableContext] = await Promise.all([
      client.readContract({
        address: position.permissionsAddress,
        abi: jbPermissionsAbi,
        functionName: "hasPermission",
        args: [
          position.revLoansAddress,
          normalizeEvmAddress(params.account, "account"),
          position.projectId,
          REVNET_LOAN_PERMISSION_ID,
          REVNET_INCLUDE_ROOT_PERMISSION,
          REVNET_INCLUDE_WILDCARD_PERMISSION,
        ],
      }) as Promise<boolean>,
      (async () => {
        const [revPrepaidFeePercent, minPrepaidFeePercent, maxPrepaidFeePercent, liquidationDurationSeconds] =
          await Promise.all([
            client.readContract({
              address: position.revLoansAddress,
              abi: revLoansAbi,
              functionName: "REV_PREPAID_FEE_PERCENT",
            }) as Promise<bigint>,
            client.readContract({
              address: position.revLoansAddress,
              abi: revLoansAbi,
              functionName: "MIN_PREPAID_FEE_PERCENT",
            }) as Promise<bigint>,
            client.readContract({
              address: position.revLoansAddress,
              abi: revLoansAbi,
              functionName: "MAX_PREPAID_FEE_PERCENT",
            }) as Promise<bigint>,
            client.readContract({
              address: position.revLoansAddress,
              abi: revLoansAbi,
              functionName: "LOAN_LIQUIDATION_DURATION",
            }) as Promise<bigint>,
          ]);
        return {
          revPrepaidFeePercent,
          minPrepaidFeePercent,
          maxPrepaidFeePercent,
          liquidationDurationSeconds,
        };
      })(),
      position.selectedLoanAccountingContext
        ? (client.readContract({
            address: position.revLoansAddress,
            abi: revLoansAbi,
            functionName: "borrowableAmountFrom",
            args: [
              position.projectId,
              collateralCount,
              BigInt(position.selectedLoanAccountingContext.decimals),
              BigInt(position.selectedLoanAccountingContext.currency),
            ],
          }) as Promise<bigint>)
        : Promise.resolve(null),
      Promise.resolve(position.selectedLoanAccountingContext),
    ]);

  return {
    ...position,
    collateralCount,
    feeConfig,
    hasBorrowPermission,
    needsBorrowPermission: hasBorrowPermission !== true,
    borrowableContext,
    borrowableAmount,
  };
}

export async function quoteRevnetBorrow(
  client: RevnetReadClient,
  params: {
    projectId?: bigint;
    collateralCount: bigint;
    borrowableContext: RevnetAccountingContext;
    revLoansAddress?: EvmAddress;
    prepaidFeePercent: bigint | number;
    revPrepaidFeePercent?: bigint | number;
    maxPrepaidFeePercent?: bigint | number;
  }
): Promise<RevnetLoanQuote> {
  const revLoansAddress = params.revLoansAddress ?? baseRevnetContracts.revLoans;
  const grossBorrowableAmount = (await client.readContract({
    address: revLoansAddress,
    abi: revLoansAbi,
    functionName: "borrowableAmountFrom",
    args: [
      params.projectId ?? COBUILD_REVNET_PROJECT_ID,
      params.collateralCount,
      BigInt(params.borrowableContext.decimals),
      BigInt(params.borrowableContext.currency),
    ],
  })) as bigint;

  return quoteRevnetLoan({
    borrowableAmount: grossBorrowableAmount,
    borrowableContext: params.borrowableContext,
    prepaidFeePercent: params.prepaidFeePercent,
    ...(params.revPrepaidFeePercent !== undefined
      ? { revPrepaidFeePercent: params.revPrepaidFeePercent }
      : {}),
    ...(params.maxPrepaidFeePercent !== undefined
      ? { maxPrepaidFeePercent: params.maxPrepaidFeePercent }
      : {}),
  });
}
