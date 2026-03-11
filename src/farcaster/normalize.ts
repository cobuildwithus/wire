import { FARCASTER_MAX_EXTRA_STORAGE } from "./constants.js";
import type { EvmAddress, FarcasterHexString } from "./types.js";
import {
  normalizeEvmAddress,
  normalizeHexByteString,
  normalizeHexBytes,
} from "../evm.js";

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

export function normalizeFarcasterExtraStorage(
  value: bigint | number | string | undefined,
  label = "extraStorage"
): bigint {
  if (value === undefined) {
    return 0n;
  }

  let normalized: bigint;
  if (typeof value === "bigint") {
    normalized = value;
  } else if (typeof value === "number") {
    if (!Number.isInteger(value) || value < 0) {
      throw new Error(`${label} must be a non-negative integer`);
    }
    normalized = BigInt(value);
  } else {
    const trimmed = value.trim();
    if (!/^\d+$/.test(trimmed)) {
      throw new Error(`${label} must be a non-negative integer`);
    }
    normalized = BigInt(trimmed);
  }

  normalizeFarcasterNonNegativeBigInt(normalized, label);
  if (normalized > FARCASTER_MAX_EXTRA_STORAGE) {
    throw new Error(`${label} max is ${FARCASTER_MAX_EXTRA_STORAGE.toString()}`);
  }
  return normalized;
}

export function normalizeFarcasterAddress(value: string, label = "address"): EvmAddress {
  return normalizeEvmAddress(value, label);
}

export function normalizeFarcasterSignerPublicKey(value: string): FarcasterHexString {
  return normalizeHexBytes(value, 32, "signerPublicKey");
}

export function normalizeFarcasterSignature(value: string): FarcasterHexString {
  return normalizeHexByteString(value, "signature") as FarcasterHexString;
}
