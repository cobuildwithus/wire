export type HexString = `0x${string}`;

export const X402_VERSION = 1;
export const X402_SCHEME = "exact";
export const X402_NETWORK = "base";
export const X402_TOKEN_SYMBOL = "usdc";
export const X402_USDC_CONTRACT = "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913";
export const X402_PAY_TO_ADDRESS = "0xa6a8736f18f383f1cc2d938576933e5ea7df01a1";
export const X402_VALUE_MICRO_USDC = "1000";
export const X402_VALUE_USDC_DISPLAY = "0.001";
export const X402_AUTH_VALID_AFTER = "0";
export const X402_AUTH_TTL_SECONDS = 300;

export const BASE_CHAIN_ID = 8453;
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

function normalizeAddress(value: string): string {
  return value.trim().toLowerCase();
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

export function buildX402TypedDataDomain(overrides: Partial<X402TypedDataDomain> = {}): X402TypedDataDomain {
  return {
    name: overrides.name ?? USDC_EIP712_DOMAIN_NAME,
    version: overrides.version ?? USDC_EIP712_DOMAIN_VERSION,
    chainId: overrides.chainId ?? BASE_CHAIN_ID,
    verifyingContract: normalizeAddress(overrides.verifyingContract ?? X402_USDC_CONTRACT) as HexString,
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

export function encodeX402PaymentPayload(payload: X402PaymentPayload): string {
  return toBase64Utf8(JSON.stringify(payload));
}

export function decodeX402PaymentPayload(xPaymentBase64: string): X402PaymentPayload {
  let decoded: unknown;
  try {
    decoded = JSON.parse(fromBase64Utf8(xPaymentBase64));
  } catch {
    throw new Error("x402 payment header is not valid base64 JSON");
  }

  if (typeof decoded !== "object" || decoded === null) {
    throw new Error("x402 payment payload must be a JSON object");
  }

  const payload = decoded as Record<string, unknown>;
  const inner = payload.payload as Record<string, unknown> | undefined;
  const auth = inner?.authorization as Record<string, unknown> | undefined;

  if (!inner || !auth) {
    throw new Error("x402 payment payload is missing payload.authorization");
  }

  return {
    x402Version: Number(payload.x402Version),
    scheme: String(payload.scheme),
    network: String(payload.network),
    payload: {
      signature: String(inner.signature ?? ""),
      authorization: {
        from: String(auth.from ?? ""),
        to: String(auth.to ?? ""),
        value: String(auth.value ?? ""),
        validAfter: String(auth.validAfter ?? ""),
        validBefore: String(auth.validBefore ?? ""),
        nonce: String(auth.nonce ?? "") as HexString,
      },
    },
  };
}

export function validateX402PaymentPayload(
  payload: X402PaymentPayload,
  policy: X402ValidationPolicy = {}
): X402PaymentPayload {
  const requiredNetwork = policy.requiredNetwork ?? X402_NETWORK;
  const requiredPayTo = normalizeAddress(policy.requiredPayTo ?? X402_PAY_TO_ADDRESS);
  const requiredValue = String(policy.requiredValue ?? X402_VALUE_MICRO_USDC);
  const requireUnexpired = policy.requireUnexpired ?? true;

  if (payload.network !== requiredNetwork) {
    throw new Error(
      `x402 payment header network mismatch: expected "${requiredNetwork}", got "${String(payload.network)}".`
    );
  }

  const authorization = payload.payload.authorization;
  if (!authorization || typeof authorization !== "object") {
    throw new Error("x402 payment header is missing payload.authorization");
  }

  if (typeof authorization.to !== "string" || authorization.to.trim().length === 0) {
    throw new Error("x402 payment header is missing payload.authorization.to");
  }

  const normalizedTo = normalizeAddress(authorization.to);
  if (normalizedTo !== requiredPayTo) {
    throw new Error(
      `x402 payment \"to\" address mismatch: expected ${requiredPayTo}, got ${normalizedTo}.`
    );
  }

  const normalizedValue = String(authorization.value);
  if (normalizedValue !== requiredValue) {
    throw new Error(
      `x402 payment value mismatch: expected ${requiredValue}, got ${normalizedValue}.`
    );
  }

  if (typeof authorization.validBefore !== "string" && typeof authorization.validBefore !== "number") {
    throw new Error("x402 payment header is missing payload.authorization.validBefore");
  }

  const validBefore = Number(authorization.validBefore);
  if (!Number.isFinite(validBefore)) {
    throw new Error(
      `x402 payment header has invalid payload.authorization.validBefore (${String(
        authorization.validBefore
      )}).`
    );
  }

  if (requireUnexpired) {
    const nowSeconds = policy.nowSeconds ?? Math.floor(Date.now() / 1000);
    if (validBefore <= nowSeconds) {
      throw new Error(`x402 payment header has expired (validBefore=${validBefore})`);
    }
  }

  return payload;
}

export function decodeAndValidateX402PaymentPayload(
  xPaymentBase64: string,
  policy: X402ValidationPolicy = {}
): X402PaymentPayload {
  const decoded = decodeX402PaymentPayload(xPaymentBase64);
  return validateX402PaymentPayload(decoded, policy);
}
