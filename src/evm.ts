import { isAddress, isHex, size } from "viem";

export type EvmAddress = `0x${string}`;
export type HexBytes = `0x${string}`;
export type HexBytes32 = `0x${string}`;

export function normalizeEvmAddress(value: string, label: string): EvmAddress {
  const normalized = value.trim().toLowerCase();
  if (!isAddress(normalized, { strict: false })) {
    throw new Error(`${label} must be a valid 20-byte hex address (0x + 40 hex chars).`);
  }
  return normalized as EvmAddress;
}

export function parseEvmAddress(value: unknown): EvmAddress | null {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  try {
    return normalizeEvmAddress(trimmed, "address");
  } catch {
    return null;
  }
}

export function isSameEvmAddress(left: unknown, right: unknown): boolean {
  const normalizedLeft = parseEvmAddress(left);
  const normalizedRight = parseEvmAddress(right);

  if (!normalizedLeft || !normalizedRight) {
    return false;
  }

  return normalizedLeft === normalizedRight;
}

export function normalizeHexBytes(value: string, bytesLength: number, label: string): HexBytes {
  const normalized = value.trim().toLowerCase();
  if (!isHex(normalized) || size(normalized) !== bytesLength) {
    const expectedHexLength = bytesLength * 2;
    throw new Error(
      `${label} must be a ${bytesLength}-byte hex value (0x + ${expectedHexLength} hex chars).`
    );
  }
  return normalized as HexBytes;
}

export function normalizeBytes32(value: string, label: string): HexBytes32 {
  return normalizeHexBytes(value, 32, label) as HexBytes32;
}

export function normalizeHexByteString(value: string, label: string): HexBytes {
  const normalized = value.trim().toLowerCase();
  if (!isHex(normalized) || size(normalized) === 0) {
    throw new Error(`${label} must be valid hex bytes with 0x prefix.`);
  }
  return normalized as HexBytes;
}

export function normalizeUnsignedDecimal(
  value: string | number | bigint,
  label: string
): string {
  if (typeof value === "bigint") {
    if (value < 0n) {
      throw new Error(`${label} must be a non-negative integer.`);
    }
    return value.toString(10);
  }

  if (typeof value === "number") {
    if (!Number.isFinite(value) || !Number.isInteger(value) || value < 0) {
      throw new Error(`${label} must be a non-negative integer.`);
    }
    return String(value);
  }

  const normalized = value.trim();
  if (!/^\d+$/.test(normalized)) {
    throw new Error(`${label} must be a non-negative integer.`);
  }
  return normalized;
}
