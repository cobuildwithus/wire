import { describe, expect, it } from "vitest";
import { encodeAbiParameters, encodeEventTopics } from "viem";
import {
  buildPremiumCheckpointPlan,
  buildPremiumClaimPlan,
  decodePremiumEscrowReceipt,
  premiumEscrowAbi,
  serializePremiumEscrowReceipt,
} from "../src/index.js";

const PREMIUM_ESCROW = "0x6666666666666666666666666666666666666666";
const ACCOUNT = "0x7777777777777777777777777777777777777777";
const RECIPIENT = "0x8888888888888888888888888888888888888888";

function buildPremiumEventLog(params: {
  eventName: "AccountCheckpointed" | "Claimed";
  args: Record<string, unknown>;
}) {
  const event = premiumEscrowAbi.find(
    (entry) => entry.type === "event" && entry.name === params.eventName
  );
  if (!event || event.type !== "event") {
    throw new Error(`Missing event ${params.eventName}`);
  }

  return {
    address: PREMIUM_ESCROW,
    blockHash: "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    blockNumber: 1n,
    data: encodeAbiParameters(
      event.inputs.filter((input) => !input.indexed),
      event.inputs
        .filter((input) => !input.indexed)
        .map((input) => params.args[input.name]) as readonly unknown[]
    ),
    logIndex: 0,
    removed: false,
    topics: encodeEventTopics({
      abi: [event],
      eventName: params.eventName,
      args: Object.fromEntries(
        event.inputs
          .filter((input) => input.indexed)
          .map((input) => [input.name, params.args[input.name]])
      ),
    }),
    transactionHash: "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
    transactionIndex: 0,
  } as const;
}

describe("protocol premium contract", () => {
  it("builds checkpoint and claim plans", () => {
    const checkpointPlan = buildPremiumCheckpointPlan({
      premiumEscrowAddress: PREMIUM_ESCROW,
      account: ACCOUNT,
    });
    expect(checkpointPlan.steps[0]).toMatchObject({
      kind: "contract-call",
      functionName: "checkpoint",
    });

    const claimPlan = buildPremiumClaimPlan({
      premiumEscrowAddress: PREMIUM_ESCROW,
      recipient: RECIPIENT,
    });
    expect(claimPlan.steps[0]).toMatchObject({
      kind: "contract-call",
      functionName: "claim",
    });
  });

  it("decodes premium receipt events and serializes bigint fields", () => {
    const summary = decodePremiumEscrowReceipt([
      buildPremiumEventLog({
        eventName: "AccountCheckpointed",
        args: {
          account: ACCOUNT,
          previousCoverage: 10n,
          currentCoverage: 20n,
          claimableAmount: 30n,
          exposureIntegral: 40n,
          totalCoverage: 50n,
        },
      }),
      buildPremiumEventLog({
        eventName: "Claimed",
        args: {
          account: ACCOUNT,
          to: RECIPIENT,
          amount: 60n,
        },
      }),
    ]);

    expect(summary.checkpointed).toEqual({
      account: ACCOUNT,
      previousCoverage: 10n,
      currentCoverage: 20n,
      claimableAmount: 30n,
      exposureIntegral: 40n,
      totalCoverage: 50n,
    });
    expect(summary.claimed).toEqual({
      account: ACCOUNT,
      to: RECIPIENT,
      amount: 60n,
    });

    expect(serializePremiumEscrowReceipt(summary)).toMatchObject({
      checkpointed: {
        claimableAmount: "30",
      },
      claimed: {
        amount: "60",
      },
    });
  });

  it("returns null receipt fields when premium events are absent", () => {
    expect(decodePremiumEscrowReceipt([])).toEqual({
      checkpointed: null,
      claimed: null,
    });
  });
});
