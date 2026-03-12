import {
  normalizeBytes32,
  normalizeEvmAddress,
  normalizeHexByteString,
  normalizeUnsignedDecimal,
} from "./evm.js";
import { BASE_CHAIN_ID } from "./chains.js";
import { asRecord, requireInteger, requireTrimmedString } from "./parse.js";
import { USDC_BASE_ADDRESS } from "./protocol-addresses.js";

export { BASE_CHAIN_ID } from "./chains.js";

export type HexString = `0x${string}`;

export const X402_VERSION = 1;
export const X402_SCHEME = "exact";
export const X402_NETWORK = "base";
export const X402_TOKEN_SYMBOL = "usdc";
export const X402_USDC_CONTRACT = USDC_BASE_ADDRESS;
export const X402_PAY_TO_ADDRESS = "0xa6a8736f18f383f1cc2d938576933e5ea7df01a1";
export const X402_VALUE_MICRO_USDC = "1000";
export const X402_VALUE_USDC_DISPLAY = "0.001";
export const X402_AUTH_VALID_AFTER = "0";
export const X402_AUTH_TTL_SECONDS = 300;

export const USDC_EIP712_DOMAIN_NAME = "USD Coin";
export const USDC_EIP712_DOMAIN_VERSION = "2";
export const X402_TRANSFER_PRIMARY_TYPE = "TransferWithAuthorization";

export type X402AuthorizationPayload = {
  from: string;
  to: string;
  value: string;
  validAfter: string;
  validBefore: string;
  nonce: HexString;
};

export type X402PaymentPayload = {
  x402Version: number;
  scheme: string;
  network: string;
  payload: {
    signature: string;
    authorization: X402AuthorizationPayload;
  };
};

export type X402TypedDataDomain = {
  name: string;
  version: string;
  chainId: number;
  verifyingContract: HexString;
};

export type X402TypedDataTypes = {
  EIP712Domain: Array<{ name: string; type: string }>;
  TransferWithAuthorization: Array<{ name: string; type: string }>;
};

export type X402ValidationPolicy = {
  requiredNetwork?: string;
  requiredPayTo?: string;
  requiredValue?: string;
  requireUnexpired?: boolean;
  nowSeconds?: number;
};

export type FarcasterX402Spec = {
  network: typeof X402_NETWORK;
  tokenSymbol: typeof X402_TOKEN_SYMBOL;
  token: X402TypedDataDomain["verifyingContract"];
  payTo: X402AuthorizationPayload["to"];
  amount: X402AuthorizationPayload["value"];
  amountDisplay: typeof X402_VALUE_USDC_DISPLAY;
  defaultValidAfter: typeof X402_AUTH_VALID_AFTER;
  authTtlSeconds: typeof X402_AUTH_TTL_SECONDS;
  domain: X402TypedDataDomain;
  types: X402TypedDataTypes;
  primaryType: typeof X402_TRANSFER_PRIMARY_TYPE;
};

export type FarcasterX402SigningRequest = FarcasterX402Spec & {
  authorization: X402AuthorizationPayload;
  validAfter: number;
  validBefore: number;
  encodePayment(signature: string): string;
};

const FARCASTER_X402_TYPED_DATA_DOMAIN = buildX402TypedDataDomain();
const FARCASTER_X402_TYPED_DATA_TYPES = buildX402TypedDataTypes();

function randomBytes(length: number): Uint8Array {
  const bytes = new Uint8Array(length);
  globalThis.crypto.getRandomValues(bytes);
  return bytes;
}

function toHex(bytes: Uint8Array): string {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(bytes).toString("hex");
  }

  let output = "";
  for (const byte of bytes) {
    output += byte.toString(16).padStart(2, "0");
  }
  return output;
}

function parseRequiredStringField(value: unknown, fieldPath: string): string {
  return requireTrimmedString(value, {
    fieldPath,
    requiredMessage: `x402 payment header is missing ${fieldPath}`,
    invalidTypeMessage: `x402 payment header is missing ${fieldPath}`,
  });
}

function parseAddressField(value: unknown, fieldPath: string): string {
  const raw = parseRequiredStringField(value, fieldPath);
  try {
    return normalizeEvmAddress(raw, fieldPath);
  } catch {
    throw new Error(`x402 payment header has invalid ${fieldPath}`);
  }
}

function parseUnsignedDecimalField(value: unknown, fieldPath: string): string {
  if (value === undefined || value === null) {
    throw new Error(`x402 payment header is missing ${fieldPath}`);
  }
  if (typeof value !== "string" && typeof value !== "number" && typeof value !== "bigint") {
    throw new Error(`x402 payment header has invalid ${fieldPath}`);
  }
  try {
    return normalizeUnsignedDecimal(value, fieldPath);
  } catch {
    throw new Error(`x402 payment header has invalid ${fieldPath} (${String(value)}).`);
  }
}

function parseNonceField(value: unknown, fieldPath: string): HexString {
  const raw = parseRequiredStringField(value, fieldPath);
  try {
    return normalizeBytes32(raw, fieldPath) as HexString;
  } catch {
    throw new Error(`x402 payment header has invalid ${fieldPath}`);
  }
}

function parseSignatureField(value: unknown): string {
  const raw = parseRequiredStringField(value, "payload.signature");
  try {
    return normalizeHexByteString(raw, "payload.signature");
  } catch {
    throw new Error("x402 payment header has invalid payload.signature");
  }
}

function parseAuthorizationPayload(value: unknown): X402AuthorizationPayload {
  const authorization = asRecord(value);
  if (!authorization) {
    throw new Error("x402 payment payload is missing payload.authorization");
  }

  return {
    from: parseAddressField(authorization.from, "payload.authorization.from"),
    to: parseAddressField(authorization.to, "payload.authorization.to"),
    value: parseUnsignedDecimalField(authorization.value, "payload.authorization.value"),
    validAfter: parseUnsignedDecimalField(authorization.validAfter, "payload.authorization.validAfter"),
    validBefore: parseUnsignedDecimalField(
      authorization.validBefore,
      "payload.authorization.validBefore"
    ),
    nonce: parseNonceField(authorization.nonce, "payload.authorization.nonce"),
  };
}

function parseX402Version(value: unknown): number {
  return requireInteger(value, "x402Version", {
    allowZero: true,
    integerMessage: `x402 payment header has invalid x402Version (${String(value)}).`,
  });
}

function parseScheme(value: unknown): string {
  return parseRequiredStringField(value, "scheme");
}

function parseNetwork(value: unknown): string {
  return parseRequiredStringField(value, "network");
}

function normalizeValidationTimestamp(nowSeconds: number): bigint {
  if (!Number.isFinite(nowSeconds) || !Number.isInteger(nowSeconds) || nowSeconds < 0) {
    throw new Error(`x402 payment header has invalid nowSeconds (${String(nowSeconds)}).`);
  }
  return BigInt(nowSeconds);
}

function normalizeUnixSecondsNumber(value: number, fieldPath: string): number {
  if (!Number.isFinite(value) || !Number.isInteger(value) || value < 0) {
    throw new Error(`${fieldPath} must be a non-negative integer.`);
  }
  return value;
}

function normalizePositiveIntegerNumber(value: number, fieldPath: string): number {
  const normalized = normalizeUnixSecondsNumber(value, fieldPath);
  if (normalized <= 0) {
    throw new Error(`${fieldPath} must be greater than zero.`);
  }
  return normalized;
}

function toBase64Utf8(value: string): string {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(value, "utf8").toString("base64");
  }
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary);
}

function fromBase64Utf8(value: string): string {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(value, "base64").toString("utf8");
  }
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return new TextDecoder().decode(bytes);
}

export function createX402AuthorizationNonce(): HexString {
  return (`0x${toHex(randomBytes(32))}` as HexString);
}

export function buildX402AuthorizationPayload(params: {
  from: string;
  to?: string;
  value?: string | number | bigint;
  validAfter?: string | number | bigint;
  validBefore: string | number | bigint;
  nonce?: string;
}): X402AuthorizationPayload {
  return {
    from: normalizeEvmAddress(params.from, "from"),
    to: normalizeEvmAddress(params.to ?? X402_PAY_TO_ADDRESS, "to"),
    value: normalizeUnsignedDecimal(params.value ?? X402_VALUE_MICRO_USDC, "value"),
    validAfter: normalizeUnsignedDecimal(params.validAfter ?? X402_AUTH_VALID_AFTER, "validAfter"),
    validBefore: normalizeUnsignedDecimal(params.validBefore, "validBefore"),
    nonce: normalizeBytes32(params.nonce ?? createX402AuthorizationNonce(), "nonce") as HexString,
  };
}

export function buildX402PaymentPayload(params: {
  signature: string;
  authorization: X402AuthorizationPayload;
  x402Version?: number;
  scheme?: string;
  network?: string;
}): X402PaymentPayload {
  const x402Version = params.x402Version ?? X402_VERSION;
  if (!Number.isInteger(x402Version)) {
    throw new Error(`x402 payment header has invalid x402Version (${String(x402Version)}).`);
  }

  return {
    x402Version,
    scheme: parseScheme(params.scheme ?? X402_SCHEME),
    network: parseNetwork(params.network ?? X402_NETWORK),
    payload: {
      signature: parseSignatureField(params.signature),
      authorization: parseAuthorizationPayload(params.authorization),
    },
  };
}

export function buildX402TypedDataDomain(overrides: Partial<X402TypedDataDomain> = {}): X402TypedDataDomain {
  return {
    name: overrides.name ?? USDC_EIP712_DOMAIN_NAME,
    version: overrides.version ?? USDC_EIP712_DOMAIN_VERSION,
    chainId: overrides.chainId ?? BASE_CHAIN_ID,
    verifyingContract: normalizeEvmAddress(
      overrides.verifyingContract ?? X402_USDC_CONTRACT,
      "verifyingContract"
    ) as HexString,
  };
}

export function buildX402TypedDataTypes(): X402TypedDataTypes {
  return {
    EIP712Domain: [
      { name: "name", type: "string" },
      { name: "version", type: "string" },
      { name: "chainId", type: "uint256" },
      { name: "verifyingContract", type: "address" },
    ],
    TransferWithAuthorization: [
      { name: "from", type: "address" },
      { name: "to", type: "address" },
      { name: "value", type: "uint256" },
      { name: "validAfter", type: "uint256" },
      { name: "validBefore", type: "uint256" },
      { name: "nonce", type: "bytes32" },
    ],
  };
}

export function buildFarcasterX402Spec(): FarcasterX402Spec {
  return {
    network: X402_NETWORK,
    tokenSymbol: X402_TOKEN_SYMBOL,
    token: X402_USDC_CONTRACT,
    payTo: X402_PAY_TO_ADDRESS,
    amount: X402_VALUE_MICRO_USDC,
    amountDisplay: X402_VALUE_USDC_DISPLAY,
    defaultValidAfter: X402_AUTH_VALID_AFTER,
    authTtlSeconds: X402_AUTH_TTL_SECONDS,
    domain: FARCASTER_X402_TYPED_DATA_DOMAIN,
    types: FARCASTER_X402_TYPED_DATA_TYPES,
    primaryType: X402_TRANSFER_PRIMARY_TYPE,
  };
}

export function buildFarcasterX402SigningRequest(params: {
  payerAddress: string;
  nowSeconds?: number;
  validAfter?: number;
  validBefore?: number;
  ttlSeconds?: number;
  nonce?: string;
}): FarcasterX402SigningRequest {
  const spec = buildFarcasterX402Spec();
  const validAfter = normalizeUnixSecondsNumber(
    params.validAfter ?? Number(spec.defaultValidAfter),
    "validAfter"
  );

  const validBefore =
    params.validBefore !== undefined
      ? normalizeUnixSecondsNumber(params.validBefore, "validBefore")
      : normalizeUnixSecondsNumber(
          (params.nowSeconds !== undefined
            ? normalizeUnixSecondsNumber(params.nowSeconds, "nowSeconds")
            : Math.floor(Date.now() / 1000)) +
            normalizePositiveIntegerNumber(params.ttlSeconds ?? spec.authTtlSeconds, "ttlSeconds"),
          "validBefore"
        );

  if (validBefore < validAfter) {
    throw new Error("validBefore must be greater than or equal to validAfter.");
  }

  const authorization = buildX402AuthorizationPayload({
    from: params.payerAddress,
    to: spec.payTo,
    value: spec.amount,
    validAfter,
    validBefore,
    ...(params.nonce !== undefined ? { nonce: params.nonce } : {}),
  });

  return {
    ...spec,
    authorization,
    validAfter,
    validBefore,
    encodePayment(signature: string): string {
      return encodeX402PaymentPayload(
        buildX402PaymentPayload({
          signature,
          authorization,
          network: spec.network,
        })
      );
    },
  };
}

export function encodeX402PaymentPayload(payload: X402PaymentPayload): string {
  return toBase64Utf8(JSON.stringify(payload));
}

export function assertX402PaymentPayload(value: unknown): X402PaymentPayload {
  const payload = asRecord(value);
  if (!payload) {
    throw new Error("x402 payment payload must be a JSON object");
  }

  const inner = asRecord(payload.payload);
  const authorization = inner ? inner.authorization : undefined;

  if (!inner || authorization === undefined) {
    throw new Error("x402 payment payload is missing payload.authorization");
  }

  return {
    x402Version: parseX402Version(payload.x402Version),
    scheme: parseScheme(payload.scheme),
    network: parseNetwork(payload.network),
    payload: {
      signature: parseSignatureField(inner.signature),
      authorization: parseAuthorizationPayload(authorization),
    },
  };
}

export function isX402PaymentPayload(value: unknown): value is X402PaymentPayload {
  try {
    assertX402PaymentPayload(value);
    return true;
  } catch {
    return false;
  }
}

export function decodeX402PaymentPayload(xPaymentBase64: string): X402PaymentPayload {
  let decoded: unknown;
  try {
    decoded = JSON.parse(fromBase64Utf8(xPaymentBase64));
  } catch {
    throw new Error("x402 payment header is not valid base64 JSON");
  }

  return assertX402PaymentPayload(decoded);
}

export function validateX402PaymentPayload(
  payload: X402PaymentPayload,
  policy: X402ValidationPolicy = {}
): X402PaymentPayload {
  const normalizedPayload = assertX402PaymentPayload(payload);

  const requiredNetwork = parseNetwork(policy.requiredNetwork ?? X402_NETWORK);
  const requiredPayTo = normalizeEvmAddress(policy.requiredPayTo ?? X402_PAY_TO_ADDRESS, "requiredPayTo");
  const requiredValue = normalizeUnsignedDecimal(policy.requiredValue ?? X402_VALUE_MICRO_USDC, "requiredValue");
  const requireUnexpired = policy.requireUnexpired ?? true;

  if (normalizedPayload.x402Version !== X402_VERSION) {
    throw new Error(
      `x402 payment header version mismatch: expected ${X402_VERSION}, got ${String(
        normalizedPayload.x402Version
      )}.`
    );
  }

  if (normalizedPayload.scheme !== X402_SCHEME) {
    throw new Error(
      `x402 payment header scheme mismatch: expected "${X402_SCHEME}", got "${normalizedPayload.scheme}".`
    );
  }

  if (normalizedPayload.network !== requiredNetwork) {
    throw new Error(
      `x402 payment header network mismatch: expected "${requiredNetwork}", got "${String(
        normalizedPayload.network
      )}".`
    );
  }

  const authorization = normalizedPayload.payload.authorization;
  if (authorization.to !== requiredPayTo) {
    throw new Error(
      `x402 payment "to" address mismatch: expected ${requiredPayTo}, got ${authorization.to}.`
    );
  }

  if (authorization.value !== requiredValue) {
    throw new Error(
      `x402 payment value mismatch: expected ${requiredValue}, got ${authorization.value}.`
    );
  }

  const validAfter = BigInt(authorization.validAfter);
  const validBefore = BigInt(authorization.validBefore);
  if (validBefore < validAfter) {
    throw new Error(
      `x402 payment header has invalid validity window: validBefore (${authorization.validBefore}) is earlier than validAfter (${authorization.validAfter}).`
    );
  }

  if (requireUnexpired) {
    const nowSeconds = normalizeValidationTimestamp(policy.nowSeconds ?? Math.floor(Date.now() / 1000));
    if (validBefore <= nowSeconds) {
      throw new Error(`x402 payment header has expired (validBefore=${authorization.validBefore})`);
    }
  }

  return normalizedPayload;
}

export function decodeAndValidateX402PaymentPayload(
  xPaymentBase64: string,
  policy: X402ValidationPolicy = {}
): X402PaymentPayload {
  const decoded = decodeX402PaymentPayload(xPaymentBase64);
  return validateX402PaymentPayload(decoded, policy);
}
