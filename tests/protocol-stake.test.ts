import { describe, expect, it } from "vitest";
import { encodeAbiParameters, encodeEventTopics } from "viem";
import {
  buildCobuildStakeDepositPlan,
  buildCobuildStakeWithdrawalPlan,
  buildGoalStakeDepositPlan,
  buildGoalStakeWithdrawalPlan,
  buildJurorDelegateUpdatePlan,
  buildJurorExitFinalizationPlan,
  buildJurorExitRequestPlan,
  buildJurorOptInPlan,
  buildUnderwriterWithdrawalPreparationPlan,
  decodeStakeVaultReceipt,
  goalStakeVaultAbi,
  serializeStakeVaultReceipt,
} from "../src/index.js";

const STAKE_VAULT = "0x1111111111111111111111111111111111111111";
const GOAL_TOKEN = "0x2222222222222222222222222222222222222222";
const COBUILD_TOKEN = "0x3333333333333333333333333333333333333333";
const USER = "0x4444444444444444444444444444444444444444";
const RECIPIENT = "0x5555555555555555555555555555555555555555";

function buildStakeEventLog(params: {
  eventName:
    | "GoalStaked"
    | "CobuildStaked"
    | "GoalWithdrawn"
    | "CobuildWithdrawn"
    | "UnderwriterWithdrawalPrepared"
    | "JurorOptedIn"
    | "JurorExitRequested"
    | "JurorExitFinalized"
    | "JurorDelegateSet";
  args: Record<string, unknown>;
}) {
  const event = goalStakeVaultAbi.find(
    (entry) => entry.type === "event" && entry.name === params.eventName
  );
  if (!event || event.type !== "event") {
    throw new Error(`Missing event ${params.eventName}`);
  }

  return {
    address: STAKE_VAULT,
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

describe("protocol stake contract", () => {
  it("adds approval step automatically when current allowance is insufficient", () => {
    const plan = buildGoalStakeDepositPlan({
      stakeVaultAddress: STAKE_VAULT,
      goalTokenAddress: GOAL_TOKEN,
      amount: 25n,
      currentAllowance: 10n,
    });

    expect(plan.action).toBe("stake.deposit-goal");
    expect(plan.approvalIncluded).toBe(true);
    expect(plan.steps).toHaveLength(2);
    expect(plan.steps[0]).toMatchObject({
      kind: "erc20-approval",
      tokenAddress: GOAL_TOKEN,
      spenderAddress: STAKE_VAULT,
      amount: "25",
    });
    expect(plan.steps[1]).toMatchObject({
      kind: "contract-call",
      functionName: "depositGoal",
    });
  });

  it("uses a precondition instead of an approval step when allowance is unknown", () => {
    const plan = buildCobuildStakeDepositPlan({
      stakeVaultAddress: STAKE_VAULT,
      cobuildTokenAddress: COBUILD_TOKEN,
      amount: 9n,
    });

    expect(plan.approvalIncluded).toBe(false);
    expect(plan.preconditions).toEqual([
      "Ensure cobuild token allowance for stake vault covers at least 9.",
    ]);
    expect(plan.steps).toHaveLength(1);
    expect(plan.steps[0]).toMatchObject({
      kind: "contract-call",
      functionName: "depositCobuild",
    });
  });

  it("supports explicit skip and force approval modes", () => {
    const skipPlan = buildGoalStakeDepositPlan({
      stakeVaultAddress: STAKE_VAULT,
      goalTokenAddress: GOAL_TOKEN,
      amount: 7n,
      approvalMode: "skip",
    });
    expect(skipPlan.approvalIncluded).toBe(false);
    expect(skipPlan.preconditions).toEqual([
      "Ensure goal token allowance for stake vault covers at least 7.",
    ]);

    const forcePlan = buildCobuildStakeDepositPlan({
      stakeVaultAddress: STAKE_VAULT,
      cobuildTokenAddress: COBUILD_TOKEN,
      amount: 7n,
      approvalMode: "force",
      approvalAmount: 20n,
    });
    expect(forcePlan.approvalIncluded).toBe(true);
    expect(forcePlan.steps[0]).toMatchObject({
      kind: "erc20-approval",
      amount: "20",
    });
  });

  it("builds withdrawal and underwriter preparation plans", () => {
    expect(
      buildGoalStakeWithdrawalPlan({
        stakeVaultAddress: STAKE_VAULT,
        amount: 11n,
        recipient: RECIPIENT,
      }).steps[0]
    ).toMatchObject({
      kind: "contract-call",
      functionName: "withdrawGoal",
    });

    expect(
      buildCobuildStakeWithdrawalPlan({
        stakeVaultAddress: STAKE_VAULT,
        amount: 12n,
        recipient: RECIPIENT,
      }).steps[0]
    ).toMatchObject({
      kind: "contract-call",
      functionName: "withdrawCobuild",
    });

    expect(
      buildUnderwriterWithdrawalPreparationPlan({
        stakeVaultAddress: STAKE_VAULT,
        maxBudgets: 4n,
      }).steps[0]
    ).toMatchObject({
      kind: "contract-call",
      functionName: "prepareUnderwriterWithdrawal",
    });
  });

  it("builds juror lifecycle plans", () => {
    const jurorOptInPlan = buildJurorOptInPlan({
      stakeVaultAddress: STAKE_VAULT,
      goalTokenAddress: GOAL_TOKEN,
      goalAmount: 13n,
      delegate: RECIPIENT,
      currentAllowance: 13n,
    });
    expect(jurorOptInPlan.goalTokenAddress).toBe(GOAL_TOKEN);
    expect(jurorOptInPlan.approvalIncluded).toBe(false);
    expect(jurorOptInPlan.steps[0]).toMatchObject({
      kind: "contract-call",
      functionName: "optInAsJuror",
    });

    expect(
      buildJurorExitRequestPlan({
        stakeVaultAddress: STAKE_VAULT,
        goalAmount: 6n,
      }).steps[0]
    ).toMatchObject({
      kind: "contract-call",
      functionName: "requestJurorExit",
    });

    expect(
      buildJurorExitFinalizationPlan({
        stakeVaultAddress: STAKE_VAULT,
      }).steps[0]
    ).toMatchObject({
      kind: "contract-call",
      functionName: "finalizeJurorExit",
    });

    expect(
      buildJurorDelegateUpdatePlan({
        stakeVaultAddress: STAKE_VAULT,
        delegate: RECIPIENT,
      }).steps[0]
    ).toMatchObject({
      kind: "contract-call",
      functionName: "setJurorDelegate",
    });
  });

  it("adds an approval step for juror opt-in when allowance is insufficient", () => {
    const plan = buildJurorOptInPlan({
      stakeVaultAddress: STAKE_VAULT,
      goalTokenAddress: GOAL_TOKEN,
      goalAmount: 13n,
      delegate: RECIPIENT,
      currentAllowance: 12n,
    });

    expect(plan.approvalIncluded).toBe(true);
    expect(plan.steps).toHaveLength(2);
    expect(plan.steps[0]).toMatchObject({
      kind: "erc20-approval",
      tokenAddress: GOAL_TOKEN,
      spenderAddress: STAKE_VAULT,
      amount: "13",
    });
    expect(plan.steps[1]).toMatchObject({
      kind: "contract-call",
      functionName: "optInAsJuror",
    });
  });

  it("decodes stake-vault receipt events and serializes bigint fields", () => {
    const summary = decodeStakeVaultReceipt([
      buildStakeEventLog({
        eventName: "GoalStaked",
        args: {
          user: USER,
          amount: 25n,
          weightDelta: 50n,
        },
      }),
      buildStakeEventLog({
        eventName: "GoalWithdrawn",
        args: {
          user: USER,
          to: RECIPIENT,
          amount: 10n,
        },
      }),
      buildStakeEventLog({
        eventName: "UnderwriterWithdrawalPrepared",
        args: {
          underwriter: USER,
          nextBudgetIndex: 3n,
          budgetCount: 7n,
          complete: true,
        },
      }),
      buildStakeEventLog({
        eventName: "JurorOptedIn",
        args: {
          juror: USER,
          goalAmount: 9n,
          weightDelta: 18n,
          delegate: RECIPIENT,
        },
      }),
      buildStakeEventLog({
        eventName: "JurorExitRequested",
        args: {
          juror: USER,
          goalAmount: 4n,
          requestedAt: 10n,
          availableAt: 20n,
        },
      }),
      buildStakeEventLog({
        eventName: "JurorExitFinalized",
        args: {
          juror: USER,
          goalAmount: 4n,
          weightDelta: 8n,
        },
      }),
      buildStakeEventLog({
        eventName: "JurorDelegateSet",
        args: {
          juror: USER,
          delegate: RECIPIENT,
        },
      }),
    ]);

    expect(summary.goalStaked).toEqual({
      user: USER,
      amount: 25n,
      weightDelta: 50n,
    });
    expect(summary.goalWithdrawn).toEqual({
      user: USER,
      to: RECIPIENT,
      amount: 10n,
    });
    expect(summary.underwriterWithdrawalPrepared).toEqual({
      underwriter: USER,
      nextBudgetIndex: 3n,
      budgetCount: 7n,
      complete: true,
    });
    expect(summary.jurorOptedIn).toEqual({
      juror: USER,
      goalAmount: 9n,
      weightDelta: 18n,
      delegate: RECIPIENT,
    });
    expect(summary.jurorExitRequested).toEqual({
      juror: USER,
      goalAmount: 4n,
      requestedAt: 10n,
      availableAt: 20n,
    });
    expect(summary.jurorExitFinalized).toEqual({
      juror: USER,
      goalAmount: 4n,
      weightDelta: 8n,
    });
    expect(summary.jurorDelegateSet).toEqual({
      juror: USER,
      delegate: RECIPIENT,
    });

    expect(serializeStakeVaultReceipt(summary)).toMatchObject({
      goalStaked: {
        amount: "25",
      },
      underwriterWithdrawalPrepared: {
        nextBudgetIndex: "3",
        budgetCount: "7",
      },
      jurorOptedIn: {
        goalAmount: "9",
        weightDelta: "18",
      },
    });
  });
});
