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

export function normalizeFarcasterAddress(value: string, label = "address"): EvmAddress {
  return normalizeEvmAddress(value, label);
}

export function normalizeFarcasterSignerPublicKey(value: string): FarcasterHexString {
  return normalizeHexBytes(value, 32, "signerPublicKey");
}

export function normalizeFarcasterSignature(value: string): FarcasterHexString {
  return normalizeHexByteString(value, "signature") as FarcasterHexString;
}
