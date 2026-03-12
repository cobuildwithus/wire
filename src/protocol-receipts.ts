import { parseEventLogs, type Abi } from "viem";
import type { EvmAddress, HexBytes, HexBytes32 } from "./evm.js";
import {
  normalizeBytes32,
  normalizeEvmAddress,
  normalizeHexByteString,
} from "./evm.js";

type ReceiptRecord = Record<string, unknown>;
type DecodedReceiptLog = {
  address?: string;
  logIndex?: number;
  args?: unknown;
};

export type ReceiptEventBase = {
  contractAddress: EvmAddress;
  logIndex: number | null;
};

export function isReceiptRecord(value: unknown): value is ReceiptRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function requireReceiptRecord(value: unknown, message: string): ReceiptRecord {
  if (!isReceiptRecord(value)) {
    throw new Error(message);
  }
  return value;
}

export function requireReceiptAddress(
  value: ReceiptRecord,
  key: string,
  label: string
): EvmAddress {
  const rawValue = value[key];
  if (typeof rawValue !== "string") {
    throw new Error(`${label} field "${key}" is missing.`);
  }
  return normalizeEvmAddress(rawValue, `${label}.${key}`);
}

export function requireReceiptBytes(
  value: ReceiptRecord,
  key: string,
  label: string
): HexBytes {
  const rawValue = value[key];
  if (typeof rawValue !== "string") {
    throw new Error(`${label} field "${key}" is missing.`);
  }
  return normalizeHexByteString(rawValue, `${label}.${key}`);
}

export function requireReceiptBytes32(
  value: ReceiptRecord,
  key: string,
  label: string
): HexBytes32 {
  const rawValue = value[key];
  if (typeof rawValue !== "string") {
    throw new Error(`${label} field "${key}" is missing.`);
  }
  return normalizeBytes32(rawValue, `${label}.${key}`);
}

export function requireReceiptBigInt(
  value: ReceiptRecord,
  key: string,
  label: string
): bigint {
  const rawValue = value[key];
  if (typeof rawValue !== "bigint") {
    throw new Error(`${label} field "${key}" is missing.`);
  }
  return rawValue;
}

export function requireReceiptBoolean(
  value: ReceiptRecord,
  key: string,
  label: string
): boolean {
  const rawValue = value[key];
  if (typeof rawValue !== "boolean") {
    throw new Error(`${label} field "${key}" is missing.`);
  }
  return rawValue;
}

export function requireReceiptNumericBigInt(
  value: ReceiptRecord,
  key: string,
  label: string
): bigint {
  const rawValue = value[key];
  if (typeof rawValue === "bigint") {
    return rawValue;
  }
  if (typeof rawValue === "number" && Number.isInteger(rawValue) && rawValue >= 0) {
    return BigInt(rawValue);
  }
  throw new Error(`${label} field "${key}" is missing.`);
}

export function decodeLatestReceiptEvent(
  abi: Abi,
  logs: readonly unknown[],
  eventName: string
) {
  return parseEventLogs({
    abi,
    logs: logs as any[],
    eventName,
    strict: false,
  }).at(-1);
}

export function decodeReceiptEvents(
  abi: Abi,
  logs: readonly unknown[],
  eventName: string
) {
  return parseEventLogs({
    abi,
    logs: logs as any[],
    eventName,
    strict: false,
  });
}

export function mapLatestReceiptEvent<T>(
  abi: Abi,
  logs: readonly unknown[],
  eventName: string,
  mapper: (args: ReceiptRecord, log: DecodedReceiptLog) => T
): T | null {
  const latest = decodeLatestReceiptEvent(abi, logs, eventName) as DecodedReceiptLog | undefined;
  if (!latest) {
    return null;
  }

  return mapper(
    requireReceiptRecord(latest.args, `${eventName} event args are missing.`),
    latest
  );
}

export function mapReceiptEvents<T>(
  abi: Abi,
  logs: readonly unknown[],
  eventName: string,
  mapper: (args: ReceiptRecord, log: DecodedReceiptLog) => T
): T[] {
  return decodeReceiptEvents(abi, logs, eventName).map((log) =>
    mapper(
      requireReceiptRecord((log as DecodedReceiptLog).args, `${eventName} event args are missing.`),
      log as DecodedReceiptLog
    )
  );
}

export function buildReceiptEventBase(log: {
  address?: string;
  logIndex?: number;
}): ReceiptEventBase {
  if (typeof log.address !== "string") {
    throw new Error("receipt log address is missing.");
  }

  return {
    contractAddress: normalizeEvmAddress(log.address, "receiptLog.address"),
    logIndex:
      typeof log.logIndex === "number" && Number.isInteger(log.logIndex) ? log.logIndex : null,
  };
}

export function sortReceiptEventsByLogIndex<T extends { logIndex: number | null }>(
  events: readonly T[]
): T[] {
  return [...events].sort((left, right) => {
    const leftIndex = left.logIndex ?? Number.MAX_SAFE_INTEGER;
    const rightIndex = right.logIndex ?? Number.MAX_SAFE_INTEGER;
    return leftIndex - rightIndex;
  });
}
