import { formatEther } from "viem";
import {
  normalizeBytes32,
  normalizeEvmAddress,
  normalizeUnsignedDecimal,
  type EvmAddress,
  type HexBytes32,
} from "../evm.js";
import {
  X402_NETWORK,
  X402_PAY_TO_ADDRESS,
  X402_USDC_CONTRACT,
  X402_VALUE_MICRO_USDC,
} from "../x402.js";
import { asRecord, requireInteger, requireTrimmedString } from "../parse.js";
import { FARCASTER_SIGNUP_NETWORK } from "./constants.js";
import type {
  FarcasterHostedX402PaymentResponse,
  FarcasterHostedX402PaymentResult,
  FarcasterSignupAlreadyRegisteredDetails,
  FarcasterSignupAlreadyRegisteredErrorResponse,
  FarcasterSignupCompletedResult,
  FarcasterSignupFundingAmounts,
  FarcasterSignupNeedsFundingResult,
  FarcasterSignupResponse,
  FarcasterSignupResult,
} from "./types.js";

function parseRequiredString(value: unknown, fieldPath: string): string {
  return requireTrimmedString(value, { fieldPath });
}

function parseAddress(value: unknown, fieldPath: string): EvmAddress {
  return normalizeEvmAddress(parseRequiredString(value, fieldPath), fieldPath);
}

function parseUnsignedDecimalString(value: unknown, fieldPath: string): string {
  if (
    value === undefined ||
    value === null ||
    (typeof value !== "string" && typeof value !== "number" && typeof value !== "bigint")
  ) {
    throw new Error(`${fieldPath} must be a non-negative integer.`);
  }
  return normalizeUnsignedDecimal(value, fieldPath);
}

function parsePositiveDecimalString(value: unknown, fieldPath: string): string {
  const normalized = parseUnsignedDecimalString(value, fieldPath);
  if (normalized === "0") {
    throw new Error(`${fieldPath} must be greater than zero.`);
  }
  return normalized;
}

function parseDisplayAmount(value: unknown, fieldPath: string): string {
  return parseRequiredString(value, fieldPath);
}

function parseUnixSeconds(value: unknown, fieldPath: string): number {
  return requireInteger(value, fieldPath, {
    allowZero: true,
    integerMessage: `${fieldPath} must be a non-negative integer.`,
  });
}

function parseFarcasterSignupNetwork(value: unknown, fieldPath: string): typeof FARCASTER_SIGNUP_NETWORK {
  const network = parseRequiredString(value, fieldPath);
  if (network !== FARCASTER_SIGNUP_NETWORK) {
    throw new Error(`${fieldPath} must be "${FARCASTER_SIGNUP_NETWORK}".`);
  }
  return FARCASTER_SIGNUP_NETWORK;
}

function parseBaseNetwork(value: unknown, fieldPath: string): typeof X402_NETWORK {
  const network = parseRequiredString(value, fieldPath);
  if (network !== X402_NETWORK) {
    throw new Error(`${fieldPath} must be "${X402_NETWORK}".`);
  }
  return X402_NETWORK;
}

function parseTxHash(value: unknown, fieldPath: string): HexBytes32 {
  return normalizeBytes32(parseRequiredString(value, fieldPath), fieldPath);
}

function normalizeBigIntValue(value: string | number | bigint, fieldPath: string): bigint {
  return BigInt(normalizeUnsignedDecimal(value, fieldPath));
}

function parseExpectedOk<T extends boolean>(value: unknown, expected: T, fieldPath: string): T {
  if (value !== expected) {
    throw new Error(`${fieldPath} must be ${expected}.`);
  }
  return expected;
}

export function formatFarcasterSignupFundingAmounts(params: {
  idGatewayPriceWei: string | number | bigint;
  balanceWei: string | number | bigint;
  requiredWei: string | number | bigint;
}): FarcasterSignupFundingAmounts {
  const idGatewayPriceWei = normalizeBigIntValue(params.idGatewayPriceWei, "idGatewayPriceWei");
  const balanceWei = normalizeBigIntValue(params.balanceWei, "balanceWei");
  const requiredWei = normalizeBigIntValue(params.requiredWei, "requiredWei");

  return {
    idGatewayPriceWei: idGatewayPriceWei.toString(),
    idGatewayPriceEth: formatEther(idGatewayPriceWei),
    balanceWei: balanceWei.toString(),
    balanceEth: formatEther(balanceWei),
    requiredWei: requiredWei.toString(),
    requiredEth: formatEther(requiredWei),
  };
}

export function buildFarcasterSignupNeedsFundingResult(params: {
  ownerAddress: string;
  custodyAddress: string;
  recoveryAddress: string;
  idGatewayPriceWei: string | number | bigint;
  balanceWei: string | number | bigint;
  requiredWei: string | number | bigint;
  network?: string;
}): FarcasterSignupNeedsFundingResult {
  return {
    status: "needs_funding",
    network: parseFarcasterSignupNetwork(params.network ?? FARCASTER_SIGNUP_NETWORK, "network"),
    ownerAddress: normalizeEvmAddress(params.ownerAddress, "ownerAddress"),
    custodyAddress: normalizeEvmAddress(params.custodyAddress, "custodyAddress"),
    recoveryAddress: normalizeEvmAddress(params.recoveryAddress, "recoveryAddress"),
    ...formatFarcasterSignupFundingAmounts({
      idGatewayPriceWei: params.idGatewayPriceWei,
      balanceWei: params.balanceWei,
      requiredWei: params.requiredWei,
    }),
  };
}

export function buildFarcasterSignupCompletedResult(params: {
  ownerAddress: string;
  custodyAddress: string;
  recoveryAddress: string;
  fid: string | number | bigint;
  idGatewayPriceWei: string | number | bigint;
  txHash: string;
  network?: string;
}): FarcasterSignupCompletedResult {
  return {
    status: "complete",
    network: parseFarcasterSignupNetwork(params.network ?? FARCASTER_SIGNUP_NETWORK, "network"),
    ownerAddress: normalizeEvmAddress(params.ownerAddress, "ownerAddress"),
    custodyAddress: normalizeEvmAddress(params.custodyAddress, "custodyAddress"),
    recoveryAddress: normalizeEvmAddress(params.recoveryAddress, "recoveryAddress"),
    fid: parsePositiveDecimalString(params.fid, "fid"),
    idGatewayPriceWei: parseUnsignedDecimalString(params.idGatewayPriceWei, "idGatewayPriceWei"),
    txHash: normalizeBytes32(params.txHash, "txHash"),
  };
}

export function buildFarcasterSignupResponse(result: FarcasterSignupResult): FarcasterSignupResponse {
  return {
    ok: true,
    result,
  };
}

export function buildFarcasterSignupAlreadyRegisteredDetails(params: {
  fid: string | number | bigint;
  custodyAddress: string;
}): FarcasterSignupAlreadyRegisteredDetails {
  return {
    fid: parsePositiveDecimalString(params.fid, "details.fid"),
    custodyAddress: normalizeEvmAddress(params.custodyAddress, "details.custodyAddress"),
  };
}

export function buildFarcasterSignupAlreadyRegisteredErrorResponse(params: {
  error: string;
  fid: string | number | bigint;
  custodyAddress: string;
}): FarcasterSignupAlreadyRegisteredErrorResponse {
  return {
    ok: false,
    error: parseRequiredString(params.error, "error"),
    details: buildFarcasterSignupAlreadyRegisteredDetails({
      fid: params.fid,
      custodyAddress: params.custodyAddress,
    }),
  };
}

export function validateFarcasterSignupAlreadyRegisteredDetails(
  value: unknown
): FarcasterSignupAlreadyRegisteredDetails {
  const record = asRecord(value);
  if (!record) {
    throw new Error("details must be an object.");
  }

  return {
    fid: parsePositiveDecimalString(record.fid, "details.fid"),
    custodyAddress: parseAddress(record.custodyAddress, "details.custodyAddress"),
  };
}

export function validateFarcasterSignupAlreadyRegisteredErrorResponse(
  value: unknown
): FarcasterSignupAlreadyRegisteredErrorResponse {
  const record = asRecord(value);
  if (!record) {
    throw new Error("farcaster signup error response must be an object.");
  }

  return {
    ok: parseExpectedOk(record.ok, false, "ok"),
    error: parseRequiredString(record.error, "error"),
    details: validateFarcasterSignupAlreadyRegisteredDetails(record.details),
  };
}

export function validateFarcasterSignupResult(value: unknown): FarcasterSignupResult {
  const record = asRecord(value);
  if (!record) {
    throw new Error("farcaster signup result must be an object.");
  }

  const status = parseRequiredString(record.status, "result.status");
  if (status === "needs_funding") {
    return {
      status: "needs_funding",
      network: parseFarcasterSignupNetwork(record.network, "result.network"),
      ownerAddress: parseAddress(record.ownerAddress, "result.ownerAddress"),
      custodyAddress: parseAddress(record.custodyAddress, "result.custodyAddress"),
      recoveryAddress: parseAddress(record.recoveryAddress, "result.recoveryAddress"),
      idGatewayPriceWei: parseUnsignedDecimalString(
        record.idGatewayPriceWei,
        "result.idGatewayPriceWei"
      ),
      idGatewayPriceEth: parseDisplayAmount(record.idGatewayPriceEth, "result.idGatewayPriceEth"),
      balanceWei: parseUnsignedDecimalString(record.balanceWei, "result.balanceWei"),
      balanceEth: parseDisplayAmount(record.balanceEth, "result.balanceEth"),
      requiredWei: parseUnsignedDecimalString(record.requiredWei, "result.requiredWei"),
      requiredEth: parseDisplayAmount(record.requiredEth, "result.requiredEth"),
    };
  }

  if (status === "complete") {
    return {
      status: "complete",
      network: parseFarcasterSignupNetwork(record.network, "result.network"),
      ownerAddress: parseAddress(record.ownerAddress, "result.ownerAddress"),
      custodyAddress: parseAddress(record.custodyAddress, "result.custodyAddress"),
      recoveryAddress: parseAddress(record.recoveryAddress, "result.recoveryAddress"),
      fid: parsePositiveDecimalString(record.fid, "result.fid"),
      idGatewayPriceWei: parseUnsignedDecimalString(
        record.idGatewayPriceWei,
        "result.idGatewayPriceWei"
      ),
      txHash: parseTxHash(record.txHash, "result.txHash"),
    };
  }

  throw new Error(`result.status must be "needs_funding" or "complete" (got "${status}").`);
}

export function validateFarcasterSignupResponse(value: unknown): FarcasterSignupResponse {
  const record = asRecord(value);
  if (!record) {
    throw new Error("farcaster signup response must be an object.");
  }

  return {
    ok: parseExpectedOk(record.ok, true, "ok"),
    result: validateFarcasterSignupResult(record.result),
  };
}

export function buildFarcasterHostedX402PaymentResult(params: {
  xPayment: string;
  payerAddress: string;
  agentKey: string;
  payTo?: string;
  token?: string;
  amount?: string | number | bigint;
  network?: string;
  validAfter: number;
  validBefore: number;
}): FarcasterHostedX402PaymentResult {
  const validAfter = parseUnixSeconds(params.validAfter, "validAfter");
  const validBefore = parseUnixSeconds(params.validBefore, "validBefore");
  if (validBefore < validAfter) {
    throw new Error("validBefore must be greater than or equal to validAfter.");
  }

  const payTo = normalizeEvmAddress(params.payTo ?? X402_PAY_TO_ADDRESS, "payTo");
  if (payTo !== X402_PAY_TO_ADDRESS) {
    throw new Error(`payTo must be "${X402_PAY_TO_ADDRESS}".`);
  }

  const token = normalizeEvmAddress(params.token ?? X402_USDC_CONTRACT, "token");
  if (token !== X402_USDC_CONTRACT) {
    throw new Error(`token must be "${X402_USDC_CONTRACT}".`);
  }

  const amount = parseUnsignedDecimalString(params.amount ?? X402_VALUE_MICRO_USDC, "amount");
  if (amount !== X402_VALUE_MICRO_USDC) {
    throw new Error(`amount must be "${X402_VALUE_MICRO_USDC}".`);
  }

  return {
    xPayment: parseRequiredString(params.xPayment, "xPayment"),
    payerAddress: normalizeEvmAddress(params.payerAddress, "payerAddress"),
    payTo,
    token,
    amount,
    network: parseBaseNetwork(params.network ?? X402_NETWORK, "network"),
    validAfter,
    validBefore,
    agentKey: parseRequiredString(params.agentKey, "agentKey"),
  };
}

export function buildFarcasterHostedX402PaymentResponse(
  result: FarcasterHostedX402PaymentResult
): FarcasterHostedX402PaymentResponse {
  return {
    ok: true,
    result,
  };
}

export function validateFarcasterHostedX402PaymentResult(
  value: unknown
): FarcasterHostedX402PaymentResult {
  const record = asRecord(value);
  if (!record) {
    throw new Error("farcaster hosted x402 payment result must be an object.");
  }

  const result = buildFarcasterHostedX402PaymentResult({
    xPayment: parseRequiredString(record.xPayment, "result.xPayment"),
    payerAddress: parseAddress(record.payerAddress, "result.payerAddress"),
    agentKey: parseRequiredString(record.agentKey, "result.agentKey"),
    payTo: parseAddress(record.payTo, "result.payTo"),
    token: parseAddress(record.token, "result.token"),
    amount: parseUnsignedDecimalString(record.amount, "result.amount"),
    network: parseBaseNetwork(record.network, "result.network"),
    validAfter: parseUnixSeconds(record.validAfter, "result.validAfter"),
    validBefore: parseUnixSeconds(record.validBefore, "result.validBefore"),
  });

  if (result.payTo !== X402_PAY_TO_ADDRESS) {
    throw new Error(`result.payTo must be "${X402_PAY_TO_ADDRESS}".`);
  }
  if (result.token !== X402_USDC_CONTRACT) {
    throw new Error(`result.token must be "${X402_USDC_CONTRACT}".`);
  }
  if (result.amount !== X402_VALUE_MICRO_USDC) {
    throw new Error(`result.amount must be "${X402_VALUE_MICRO_USDC}".`);
  }

  return result;
}

export function validateFarcasterHostedX402PaymentResponse(
  value: unknown
): FarcasterHostedX402PaymentResponse {
  const record = asRecord(value);
  if (!record) {
    throw new Error("farcaster hosted x402 payment response must be an object.");
  }

  return {
    ok: parseExpectedOk(record.ok, true, "ok"),
    result: validateFarcasterHostedX402PaymentResult(record.result),
  };
}
