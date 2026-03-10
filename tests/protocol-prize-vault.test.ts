import { describe, expect, it } from "vitest";
import { encodeAbiParameters, encodeEventTopics } from "viem";
import {
  buildRoundPrizeVaultClaimPlan,
  buildRoundPrizeVaultDowngradePlan,
  decodeRoundPrizeVaultReceipt,
  roundPrizeVaultAbi,
  serializeRoundPrizeVaultReceipt,
} from "../src/index.js";

const PRIZE_VAULT = "0x1111111111111111111111111111111111111111";
const RECIPIENT = "0x2222222222222222222222222222222222222222";
const SUBMISSION_ID = "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";

function buildPrizeVaultEventLog(params: {
  eventName: "Claimed" | "Downgraded";
  args: Record<string, unknown>;
}) {
  const event = roundPrizeVaultAbi.find(
    (entry) => entry.type === "event" && entry.name === params.eventName
  );
  if (!event || event.type !== "event") {
    throw new Error(`Missing event ${params.eventName}`);
  }

  return {
    address: PRIZE_VAULT,
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

describe("protocol prize vault contract", () => {
  it("builds claim and downgrade plans", () => {
    expect(
      buildRoundPrizeVaultClaimPlan({
        prizeVaultAddress: PRIZE_VAULT,
        submissionId: SUBMISSION_ID,
      }).steps[0]
    ).toMatchObject({
      kind: "contract-call",
      functionName: "claim",
    });

    expect(
      buildRoundPrizeVaultDowngradePlan({
        prizeVaultAddress: PRIZE_VAULT,
        amount: 12n,
      }).steps[0]
    ).toMatchObject({
      kind: "contract-call",
      functionName: "downgrade",
    });
  });

  it("decodes prize-vault receipt events and serializes bigint fields", () => {
    expect(decodeRoundPrizeVaultReceipt([])).toEqual({
      claimed: null,
      downgraded: null,
    });

    const summary = decodeRoundPrizeVaultReceipt([
      buildPrizeVaultEventLog({
        eventName: "Claimed",
        args: {
          submissionId: SUBMISSION_ID,
          recipient: RECIPIENT,
          amount: 15n,
        },
      }),
      buildPrizeVaultEventLog({
        eventName: "Downgraded",
        args: {
          amount: 20n,
        },
      }),
    ]);

    expect(summary.claimed).toEqual({
      submissionId: SUBMISSION_ID,
      recipient: RECIPIENT,
      amount: 15n,
    });
    expect(summary.downgraded).toEqual({
      amount: 20n,
    });

    expect(serializeRoundPrizeVaultReceipt(summary)).toMatchObject({
      claimed: {
        amount: "15",
      },
      downgraded: {
        amount: "20",
      },
    });
  });
});
