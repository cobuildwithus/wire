import type { EvmAddress, FarcasterHexString } from "./types.js";

function normalizeAddress(value: string, label: string): EvmAddress {
  const normalized = value.trim().toLowerCase();
  if (!/^0x[0-9a-f]{40}$/.test(normalized)) {
    throw new Error(`${label} must be a valid 20-byte hex address (0x + 40 hex chars).`);
  }
  return normalized as EvmAddress;
}

function normalizeHexBytes(
  value: string,
  bytesLength: number,
  label: string
): FarcasterHexString {
  const normalized = value.trim().toLowerCase();
  const expectedHexLength = bytesLength * 2;
  const pattern = new RegExp(`^0x[0-9a-f]{${expectedHexLength}}$`);
  if (!pattern.test(normalized)) {
    throw new Error(
      `${label} must be a ${bytesLength}-byte hex value (0x + ${expectedHexLength} hex chars).`
    );
  }
  return normalized as FarcasterHexString;
}

export function normalizeFarcasterNonNegativeBigInt(value: bigint, label: string): bigint {
  if (value < 0n) {
    throw new Error(`${label} must be non-negative.`);
  }
  return value;
}

export function normalizeFarcasterPositiveBigInt(value: bigint, label: string): bigint {
  if (value <= 0n) {
    throw new Error(`${label} must be greater than zero.`);
  }
  return value;
}

export function normalizeFarcasterAddress(value: string, label = "address"): EvmAddress {
  return normalizeAddress(value, label);
}

export function normalizeFarcasterSignerPublicKey(value: string): FarcasterHexString {
  return normalizeHexBytes(value, 32, "signerPublicKey");
}

export function normalizeFarcasterSignature(value: string): FarcasterHexString {
  const normalized = value.trim().toLowerCase();
  if (!/^0x[0-9a-f]+$/.test(normalized) || normalized.length <= 4 || normalized.length % 2 !== 0) {
    throw new Error("signature must be valid hex bytes with 0x prefix.");
  }
  return normalized as FarcasterHexString;
}
