import {
  CASHOUT_FEE_DENOMINATOR,
  JBDAO_CASHOUT_FEE_BPS,
  MAX_RESERVED_PERCENT,
  NATIVE_TOKEN_DECIMALS,
  REVNET_CASHOUT_FEE_BPS,
  REVNET_DEFAULT_LOAN_LIQUIDATION_YEARS,
  REVNET_LOAN_FEE_DENOMINATOR,
  REVNET_SECONDS_PER_YEAR,
  REVNET_WEIGHT_SCALE,
} from "./config.js";
import type {
  RevnetAccountingContext,
  RevnetLoanAmounts,
  RevnetLoanQuote,
  RevnetLoanSource,
  RevnetPurchaseQuote,
} from "./types.js";

function toBigIntInteger(value: bigint | number, label: string): bigint {
  if (typeof value === "bigint") return value;
  if (!Number.isFinite(value) || !Number.isInteger(value)) {
    throw new Error(`${label} must be a finite integer.`);
  }
  return BigInt(value);
}

function divideCeil(numerator: bigint, denominator: bigint): bigint {
  if (numerator === 0n) return 0n;
  return (numerator - 1n) / denominator + 1n;
}

export function quoteRevnetPurchase(params: {
  paymentAmount?: bigint;
  amount?: bigint;
  weight: bigint;
  reservedPercent: bigint | number;
}): RevnetPurchaseQuote {
  const paymentAmount = params.paymentAmount ?? params.amount ?? 0n;
  if (paymentAmount === 0n || params.weight === 0n) {
    return { payerTokens: 0n, reservedTokens: 0n, totalTokens: 0n };
  }

  const reservedPercent = toBigIntInteger(params.reservedPercent, "reservedPercent");
  const weightRatio = 10n ** BigInt(NATIVE_TOKEN_DECIMALS);
  const totalTokens = (params.weight * paymentAmount) / weightRatio;
  const reservedTokens =
    (params.weight * reservedPercent * paymentAmount) / MAX_RESERVED_PERCENT / weightRatio;

  return {
    payerTokens: totalTokens - reservedTokens,
    reservedTokens,
    totalTokens,
  };
}

export function getRevnetPaymentAmountForTokens(params: {
  payerTokens: bigint;
  weight: bigint;
  reservedPercent: bigint | number;
}): bigint {
  if (params.payerTokens === 0n || params.weight === 0n) return 0n;

  const reservedPercent = toBigIntInteger(params.reservedPercent, "reservedPercent");
  const effectivePercent = MAX_RESERVED_PERCENT - reservedPercent;
  if (effectivePercent === 0n) return 0n;

  const weightRatio = 10n ** BigInt(NATIVE_TOKEN_DECIMALS);
  const totalTokens = divideCeil(params.payerTokens * MAX_RESERVED_PERCENT, effectivePercent);
  return divideCeil(totalTokens * weightRatio, params.weight);
}

export const quoteRevnetPaymentForTokens = getRevnetPaymentAmountForTokens;

export function applyRevnetCashOutFee(amount: bigint): bigint {
  return (amount * (CASHOUT_FEE_DENOMINATOR - REVNET_CASHOUT_FEE_BPS)) / CASHOUT_FEE_DENOMINATOR;
}

export function applyJbDaoCashOutFee(amount: bigint): bigint {
  return (amount * (CASHOUT_FEE_DENOMINATOR - JBDAO_CASHOUT_FEE_BPS)) / CASHOUT_FEE_DENOMINATOR;
}

export function getRevnetPrepaidFeePercent(params: {
  repayYears: number;
  minPrepaidFeePercent: bigint;
  maxPrepaidFeePercent: bigint;
  liquidationYears?: number;
}): bigint {
  const liquidationYears = params.liquidationYears ?? REVNET_DEFAULT_LOAN_LIQUIDATION_YEARS;
  if (!Number.isFinite(params.repayYears) || params.repayYears <= 0) {
    return params.minPrepaidFeePercent;
  }

  const raw = (params.repayYears / liquidationYears) * Number(params.maxPrepaidFeePercent);
  const rounded = Math.round(raw);
  if (!Number.isFinite(rounded) || rounded <= 0) {
    return params.minPrepaidFeePercent;
  }

  const next = BigInt(rounded);
  if (next < params.minPrepaidFeePercent) return params.minPrepaidFeePercent;
  if (next > params.maxPrepaidFeePercent) return params.maxPrepaidFeePercent;
  return next;
}

export const deriveRevnetPrepaidFeePercent = getRevnetPrepaidFeePercent;

export function quoteRevnetLoanAmounts(params: {
  grossBorrowableAmount: bigint;
  prepaidFeePercent: bigint | number;
  revPrepaidFeePercent?: bigint | number;
  maxPrepaidFeePercent?: bigint | number;
  feeDenominator?: bigint;
}): RevnetLoanAmounts {
  const feeDenominator = params.feeDenominator ?? REVNET_LOAN_FEE_DENOMINATOR;
  const prepaidFeePercent = toBigIntInteger(params.prepaidFeePercent, "prepaidFeePercent");
  const revPrepaidFeePercent = toBigIntInteger(
    params.revPrepaidFeePercent ?? 0,
    "revPrepaidFeePercent"
  );
  const maxPrepaidFeePercent = toBigIntInteger(
    params.maxPrepaidFeePercent ?? feeDenominator,
    "maxPrepaidFeePercent"
  );
  const totalFeeBps = prepaidFeePercent + revPrepaidFeePercent;
  const netBorrowableAmount =
    totalFeeBps >= feeDenominator
      ? 0n
      : (params.grossBorrowableAmount * (feeDenominator - totalFeeBps)) / feeDenominator;
  const upfrontFeeAmount =
    params.grossBorrowableAmount > netBorrowableAmount
      ? params.grossBorrowableAmount - netBorrowableAmount
      : 0n;
  const prepaidFeeAmount = (params.grossBorrowableAmount * prepaidFeePercent) / feeDenominator;
  const revPrepaidFeeAmount =
    (params.grossBorrowableAmount * revPrepaidFeePercent) / feeDenominator;
  const prepaidCoverage =
    maxPrepaidFeePercent > 0n
      ? Number(prepaidFeePercent) / Number(maxPrepaidFeePercent)
      : 0;
  const hasFullPrepayCoverage = prepaidCoverage >= 1;
  const variableFeeAmount = hasFullPrepayCoverage ? 0n : params.grossBorrowableAmount - prepaidFeeAmount;

  return {
    grossBorrowableAmount: params.grossBorrowableAmount,
    netBorrowableAmount,
    upfrontFeeAmount,
    prepaidFeeAmount,
    revPrepaidFeeAmount,
    variableFeeAmount,
    maxRepayAmount: params.grossBorrowableAmount + variableFeeAmount,
    totalFeeBps,
    revPrepaidFeePercent,
    prepaidFeePercent,
    hasFullPrepayCoverage,
  };
}

export function quoteRevnetLoan(params: {
  borrowableAmount: bigint;
  borrowableContext?: RevnetAccountingContext;
  prepaidFeePercent: bigint | number;
  revPrepaidFeePercent?: bigint | number;
  maxPrepaidFeePercent?: bigint | number;
  liquidationDurationSeconds?: bigint;
}): RevnetLoanQuote {
  const amounts = quoteRevnetLoanAmounts({
    grossBorrowableAmount: params.borrowableAmount,
    prepaidFeePercent: params.prepaidFeePercent,
    ...(params.revPrepaidFeePercent !== undefined
      ? { revPrepaidFeePercent: params.revPrepaidFeePercent }
      : {}),
    ...(params.maxPrepaidFeePercent !== undefined
      ? { maxPrepaidFeePercent: params.maxPrepaidFeePercent }
      : {}),
  });

  return {
    ...amounts,
    borrowableContext:
      params.borrowableContext ?? {
        token: "0x0000000000000000000000000000000000000000",
        decimals: 18,
        currency: 0,
      },
  };
}

export function issuancePriceFromRevnetWeight(weight: number | null): number | null {
  if (weight === null || !Number.isFinite(weight) || weight <= 0) return null;
  const price = 1 / weight;
  return Number.isFinite(price) ? price : null;
}

export function revnetWeightFromScaled(weight: bigint): number {
  return Number(weight) / REVNET_WEIGHT_SCALE;
}

export function selectPreferredRevnetAccountingContext(
  contexts: readonly RevnetAccountingContext[],
  preferredToken?: string
): RevnetAccountingContext | null {
  if (contexts.length === 0) return null;
  if (!preferredToken) return contexts[0] ?? null;
  return (
    contexts.find((context) => context.token.toLowerCase() === preferredToken.toLowerCase()) ??
    contexts[0] ??
    null
  );
}

export function selectPreferredRevnetLoanSource(
  sources: readonly RevnetLoanSource[],
  preferredToken?: string
): RevnetLoanSource | null {
  if (sources.length === 0) return null;
  if (!preferredToken) return sources[0] ?? null;
  return (
    sources.find((source) => source.token.toLowerCase() === preferredToken.toLowerCase()) ??
    sources[0] ??
    null
  );
}

export const selectPreferredAccountingContext = selectPreferredRevnetAccountingContext;
export const selectPreferredLoanSource = selectPreferredRevnetLoanSource;
