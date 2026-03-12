import { describe, expect, it } from "vitest";
import { encodeAbiParameters, encodeEventTopics, parseAbi } from "viem";
import {
  buildReceiptEventBase,
  decodeLatestReceiptEvent,
  decodeReceiptEvents,
  isReceiptRecord,
  requireReceiptAddress,
  requireReceiptBigInt,
  requireReceiptBoolean,
  requireReceiptBytes,
  requireReceiptBytes32,
  requireReceiptNumericBigInt,
  requireReceiptRecord,
  sortReceiptEventsByLogIndex,
} from "../src/protocol-receipts.js";

const RECEIPT_ADDRESS = "0x1111111111111111111111111111111111111111";
const ALT_ADDRESS = "0x2222222222222222222222222222222222222222";
const SAMPLE_BYTES = "0x1234";
const SAMPLE_BYTES32 =
  "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
const receiptAbi = parseAbi([
  "event ValueRecorded(address indexed account, uint256 amount)",
]);

function buildReceiptLog(params: { account: string; amount: bigint; logIndex: number }) {
  return {
    address: RECEIPT_ADDRESS,
    blockHash: "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
    blockNumber: 1n,
    data: encodeAbiParameters([{ type: "uint256" }], [params.amount]),
    logIndex: params.logIndex,
    removed: false,
    topics: encodeEventTopics({
      abi: receiptAbi,
      eventName: "ValueRecorded",
      args: { account: params.account as `0x${string}` },
    }),
    transactionHash: "0xcccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc",
    transactionIndex: 0,
  } as const;
}

describe("protocol receipt helpers", () => {
  it("validates receipt records and field readers", () => {
    const record = {
      account: RECEIPT_ADDRESS,
      payload: SAMPLE_BYTES,
      hash: SAMPLE_BYTES32,
      amount: 5n,
      enabled: true,
      count: 7,
    };

    expect(isReceiptRecord(record)).toBe(true);
    expect(isReceiptRecord(null)).toBe(false);
    expect(isReceiptRecord([])).toBe(false);

    expect(requireReceiptRecord(record, "missing")).toBe(record);
    expect(() => requireReceiptRecord(null, "missing")).toThrow("missing");

    expect(requireReceiptAddress(record, "account", "Example")).toBe(RECEIPT_ADDRESS);
    expect(() => requireReceiptAddress({}, "account", "Example")).toThrow(
      'Example field "account" is missing.'
    );

    expect(requireReceiptBytes(record, "payload", "Example")).toBe(SAMPLE_BYTES);
    expect(() => requireReceiptBytes({}, "payload", "Example")).toThrow(
      'Example field "payload" is missing.'
    );

    expect(requireReceiptBytes32(record, "hash", "Example")).toBe(SAMPLE_BYTES32);
    expect(() => requireReceiptBytes32({}, "hash", "Example")).toThrow(
      'Example field "hash" is missing.'
    );

    expect(requireReceiptBigInt(record, "amount", "Example")).toBe(5n);
    expect(() => requireReceiptBigInt({}, "amount", "Example")).toThrow(
      'Example field "amount" is missing.'
    );

    expect(requireReceiptBoolean(record, "enabled", "Example")).toBe(true);
    expect(() => requireReceiptBoolean({}, "enabled", "Example")).toThrow(
      'Example field "enabled" is missing.'
    );

    expect(requireReceiptNumericBigInt(record, "amount", "Example")).toBe(5n);
    expect(requireReceiptNumericBigInt(record, "count", "Example")).toBe(7n);
    expect(() => requireReceiptNumericBigInt({ count: -1 }, "count", "Example")).toThrow(
      'Example field "count" is missing.'
    );
  });

  it("decodes receipt events and normalizes event metadata", () => {
    const firstLog = buildReceiptLog({ account: RECEIPT_ADDRESS, amount: 1n, logIndex: 5 });
    const secondLog = buildReceiptLog({ account: ALT_ADDRESS, amount: 2n, logIndex: 8 });

    const decoded = decodeReceiptEvents(receiptAbi, [firstLog, secondLog], "ValueRecorded");
    expect(decoded).toHaveLength(2);
    expect(decodeLatestReceiptEvent(receiptAbi, [firstLog, secondLog], "ValueRecorded")?.args).toMatchObject({
      account: ALT_ADDRESS,
      amount: 2n,
    });

    expect(
      buildReceiptEventBase({
        address: RECEIPT_ADDRESS,
        logIndex: 3,
      })
    ).toEqual({
      contractAddress: RECEIPT_ADDRESS,
      logIndex: 3,
    });

    expect(
      buildReceiptEventBase({
        address: RECEIPT_ADDRESS,
      })
    ).toEqual({
      contractAddress: RECEIPT_ADDRESS,
      logIndex: null,
    });

    expect(() => buildReceiptEventBase({})).toThrow("receipt log address is missing.");
  });

  it("sorts receipt events by log index with nulls last", () => {
    expect(
      sortReceiptEventsByLogIndex([
        { id: "late", logIndex: null },
        { id: "middle", logIndex: 4 },
        { id: "early", logIndex: 1 },
      ])
    ).toEqual([
      { id: "early", logIndex: 1 },
      { id: "middle", logIndex: 4 },
      { id: "late", logIndex: null },
    ]);
  });
});
