import { describe, expect, it } from "vitest";
import { encodeAbiParameters, encodeEventTopics } from "viem";
import {
  buildBudgetTreasuryDonationPlan,
  buildGoalTreasuryDonationPlan,
  budgetTreasuryAbi,
  decodeBudgetTreasuryReceipt,
  decodeGoalTreasuryReceipt,
  goalTreasuryAbi,
  serializeBudgetTreasuryReceipt,
  serializeGoalTreasuryReceipt,
} from "../src/index.js";

const GOAL_TREASURY = "0x1111111111111111111111111111111111111111";
const BUDGET_TREASURY = "0x2222222222222222222222222222222222222222";
const UNDERLYING_TOKEN = "0x3333333333333333333333333333333333333333";
const DONOR = "0x4444444444444444444444444444444444444444";

function buildTreasuryEventLog(params: {
  abi: readonly unknown[];
  treasuryAddress: string;
  eventName: "DonationRecorded";
  args: Record<string, unknown>;
}) {
  const event = params.abi.find(
    (entry) =>
      typeof entry === "object" &&
      entry !== null &&
      (entry as any).type === "event" &&
      (entry as any).name === params.eventName
  );
  if (!event || (event as any).type !== "event") {
    throw new Error(`Missing event ${params.eventName}`);
  }

  return {
    address: params.treasuryAddress,
    blockHash: "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    blockNumber: 1n,
    data: encodeAbiParameters(
      (event as any).inputs.filter((input: any) => !input.indexed),
      (event as any).inputs
        .filter((input: any) => !input.indexed)
        .map((input: any) => params.args[input.name]) as readonly unknown[]
    ),
    logIndex: 0,
    removed: false,
    topics: encodeEventTopics({
      abi: [event],
      eventName: params.eventName,
      args: Object.fromEntries(
        (event as any).inputs
          .filter((input: any) => input.indexed)
          .map((input: any) => [input.name, params.args[input.name]])
      ),
    }),
    transactionHash: "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
    transactionIndex: 0,
  } as const;
}

describe("protocol treasury contract", () => {
  it("builds donation plans with approval support", () => {
    const goalPlan = buildGoalTreasuryDonationPlan({
      treasuryAddress: GOAL_TREASURY,
      underlyingTokenAddress: UNDERLYING_TOKEN,
      amount: 25n,
      currentAllowance: 10n,
    });

    expect(goalPlan.action).toBe("treasury.donate-goal");
    expect(goalPlan.approvalIncluded).toBe(true);
    expect(goalPlan.steps).toHaveLength(2);
    expect(goalPlan.steps[0]).toMatchObject({
      kind: "erc20-approval",
      spenderAddress: GOAL_TREASURY,
      amount: "25",
    });
    expect(goalPlan.steps[1]).toMatchObject({
      kind: "contract-call",
      functionName: "donateUnderlyingAndUpgrade",
    });

    const budgetPlan = buildBudgetTreasuryDonationPlan({
      treasuryAddress: BUDGET_TREASURY,
      underlyingTokenAddress: UNDERLYING_TOKEN,
      amount: 5n,
      approvalMode: "skip",
    });
    expect(budgetPlan.action).toBe("treasury.donate-budget");
    expect(budgetPlan.approvalIncluded).toBe(false);
    expect(budgetPlan.preconditions).toEqual([
      "Ensure underlying token allowance for budget treasury covers at least 5.",
    ]);
    expect(budgetPlan.steps[0]).toMatchObject({
      kind: "contract-call",
      functionName: "donateUnderlyingAndUpgrade",
    });
  });

  it("decodes treasury donation receipts and serializes bigint fields", () => {
    const goalSummary = decodeGoalTreasuryReceipt([
      buildTreasuryEventLog({
        abi: goalTreasuryAbi,
        treasuryAddress: GOAL_TREASURY,
        eventName: "DonationRecorded",
        args: {
          donor: DONOR,
          sourceToken: UNDERLYING_TOKEN,
          sourceAmount: 10n,
          superTokenAmount: 9n,
          totalRaised: 99n,
        },
      }),
    ]);

    expect(goalSummary.donationRecorded).toEqual({
      donor: DONOR,
      sourceToken: UNDERLYING_TOKEN,
      sourceAmount: 10n,
      superTokenAmount: 9n,
      totalRaised: 99n,
    });
    expect(serializeGoalTreasuryReceipt(goalSummary)).toMatchObject({
      donationRecorded: {
        sourceAmount: "10",
        superTokenAmount: "9",
        totalRaised: "99",
      },
    });

    const budgetSummary = decodeBudgetTreasuryReceipt([
      buildTreasuryEventLog({
        abi: budgetTreasuryAbi,
        treasuryAddress: BUDGET_TREASURY,
        eventName: "DonationRecorded",
        args: {
          donor: DONOR,
          sourceToken: UNDERLYING_TOKEN,
          sourceAmount: 12n,
          superTokenAmount: 11n,
        },
      }),
    ]);

    expect(budgetSummary.donationRecorded).toEqual({
      donor: DONOR,
      sourceToken: UNDERLYING_TOKEN,
      sourceAmount: 12n,
      superTokenAmount: 11n,
    });
    expect(serializeBudgetTreasuryReceipt(budgetSummary)).toMatchObject({
      donationRecorded: {
        superTokenAmount: "11",
      },
    });
  });
});
