import type { Abi, Hex } from "viem";
import type { EvmAddress } from "../evm.js";
import type { RevnetContractAddresses } from "./config.js";

export type Numberish = string | number | bigint;
export type RevnetReadClient = {
  readContract(params: {
    address: EvmAddress;
    abi: Abi | readonly unknown[];
    functionName: string;
    args?: readonly unknown[];
  }): Promise<unknown>;
};

export type RevnetAccountingContext = {
  token: EvmAddress;
  decimals: number;
  currency: number;
};

export type RevnetLoanSource = {
  token: EvmAddress;
  terminal: EvmAddress;
};

export type RevnetRuleset = {
  cycleNumber: bigint;
  id: bigint;
  basedOnId: bigint;
  start: bigint;
  duration: bigint;
  weight: bigint;
  weightCutPercent: bigint;
  approvalHook: EvmAddress;
  metadata: bigint;
};

export type RevnetRulesetMetadata = {
  reservedPercent: number;
  cashOutTaxRate: number;
  baseCurrency: number;
  pausePay: boolean;
};

export type RevnetCurrentRuleset = {
  ruleset: RevnetRuleset;
  metadata: RevnetRulesetMetadata;
};

export type RevnetProjectTokenContext = {
  projectId: bigint;
  contracts: RevnetContractAddresses;
  address: EvmAddress | null;
  symbol: string | null;
  decimals: number;
  balance: bigint;
};

export type RevnetPositionContext = {
  projectId: bigint;
  account: EvmAddress | null;
  token: RevnetProjectTokenContext;
  accountingContexts: readonly RevnetAccountingContext[];
  selectedAccountingContext: RevnetAccountingContext | null;
  terminal: EvmAddress | null;
  permissionsAddress: EvmAddress;
  revLoansAddress: EvmAddress;
  loanSources: readonly RevnetLoanSource[];
  selectedLoanSource: RevnetLoanSource | null;
  selectedLoanAccountingContext: RevnetAccountingContext | null;
};

export type RevnetPaymentContext = {
  chainId: number;
  projectId: bigint;
  token: EvmAddress;
  contracts: RevnetContractAddresses;
  ruleset: RevnetCurrentRuleset;
  terminal: EvmAddress | null;
  terminalAddress: EvmAddress | null;
  terminals: readonly EvmAddress[];
  accountingContexts: readonly RevnetAccountingContext[];
  supportsToken: boolean;
  supportsPayments: boolean;
  isPayPaused: boolean;
};

export type RevnetCashOutQuote = {
  rawCashOutCount: bigint;
  quotedCashOutCount: bigint;
  grossReclaimAmount: bigint;
  netReclaimAmount: bigint;
  terminal: EvmAddress;
  accountingContext: RevnetAccountingContext;
};

export type RevnetCashOutContext = RevnetPositionContext & {
  quoteTerminal: EvmAddress | null;
  quoteAccountingContext: RevnetAccountingContext | null;
};

export type RevnetLoanFeeConfig = {
  revPrepaidFeePercent: bigint;
  minPrepaidFeePercent: bigint;
  maxPrepaidFeePercent: bigint;
  liquidationDurationSeconds: bigint;
};

export type RevnetLoanAmounts = {
  grossBorrowableAmount: bigint;
  netBorrowableAmount: bigint;
  upfrontFeeAmount: bigint;
  prepaidFeeAmount: bigint;
  revPrepaidFeeAmount: bigint;
  variableFeeAmount: bigint;
  maxRepayAmount: bigint;
  totalFeeBps: bigint;
  revPrepaidFeePercent: bigint;
  prepaidFeePercent: bigint;
  hasFullPrepayCoverage: boolean;
};

export type RevnetLoanQuote = RevnetLoanAmounts & {
  borrowableContext: RevnetAccountingContext;
};

export type RevnetPurchaseQuote = {
  payerTokens: bigint;
  reservedTokens: bigint;
  totalTokens: bigint;
};

export type RevnetBorrowContext = RevnetPositionContext & {
  collateralCount: bigint;
  feeConfig: RevnetLoanFeeConfig;
  hasBorrowPermission: boolean | null;
  needsBorrowPermission: boolean;
  borrowableContext: RevnetAccountingContext | null;
  borrowableAmount: bigint | null;
};

export type RevnetBorrowPermissionMode = "auto" | "force" | "skip";

export type RevnetIssuanceRawRuleset = {
  chainId: number;
  projectId: number;
  rulesetId: Numberish;
  start: Numberish;
  duration: Numberish;
  weight: Numberish;
  weightCutPercent: Numberish;
  reservedPercent: number;
  cashOutTaxRate: number;
};

export type RevnetIssuanceParsedRuleset = {
  chainId: number;
  projectId: number;
  rulesetId: bigint;
  start: number;
  duration: number;
  weight: number;
  weightCutPercent: number;
  reservedPercent: number;
  cashOutTaxRate: number;
};

export type RevnetIssuanceStage = {
  stage: number;
  start: number;
  end: number | null;
  duration: number;
  weight: number;
  weightCutPercent: number;
  reservedPercent: number;
  cashOutTaxRate: number;
};

export type RevnetIssuancePoint = {
  timestamp: number;
  issuancePrice: number;
};

export type RevnetIssuanceSummary = {
  currentIssuance: number | null;
  nextIssuance: number | null;
  nextChangeAt: number | null;
  nextChangeType: "cut" | "stage" | null;
  reservedPercent: number | null;
  cashOutTaxRate: number | null;
  activeStage: number | null;
  nextStage: number | null;
};

export type RevnetIssuanceBaseTerms = {
  baseSymbol: string;
  tokenSymbol: string;
  stages: RevnetIssuanceStage[];
  chartData: RevnetIssuancePoint[];
  chartStart: number;
  chartEnd: number;
};

export type RevnetIssuanceTerms = RevnetIssuanceBaseTerms & {
  now: number;
  activeStageIndex: number | null;
  summary: RevnetIssuanceSummary;
};

export type ContractWriteIntent<
  TAbi extends Abi = Abi,
  TFunctionName extends string = string,
  TArgs extends readonly unknown[] = readonly unknown[],
> = {
  address: EvmAddress;
  abi: TAbi;
  functionName: TFunctionName;
  args: TArgs;
  value?: bigint;
};

export type EncodedWriteIntent = {
  to: EvmAddress;
  data: Hex;
  value: bigint;
};

export type RevnetWritePlanStep<TIntent extends ContractWriteIntent = ContractWriteIntent> = {
  key: "permission" | "borrow";
  id: "permission" | "borrow";
  label: string;
  intent: TIntent;
};

export type RevnetBorrowPlan<TIntent extends ContractWriteIntent = ContractWriteIntent> = {
  chainId: number;
  projectId: bigint;
  account: EvmAddress;
  loanSource: RevnetLoanSource;
  collateralCount: bigint;
  borrowableContext: RevnetAccountingContext | null;
  borrowableAmount: bigint | null;
  quote: RevnetLoanQuote | null;
  permissionRequired: boolean;
  requiresPermission: boolean;
  preconditions: readonly string[];
  steps: readonly RevnetWritePlanStep<TIntent>[];
};
