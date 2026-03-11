import { describe, expect, it } from "vitest";
import {
  buildCliProtocolStepLogKind,
  buildCliProtocolStepRequest,
  buildGoalCreateProtocolPlan,
  buildGoalCreateTransaction,
  validateCliProtocolStepRequest,
} from "../src/index.js";

const deployParams = {
  revnet: {
    name: "Alpha Goal",
    ticker: "ALPHA",
    uri: "ipfs://goal",
    initialIssuance: "1",
    cashOutTaxRate: "0",
    reservedPercent: "9900",
    durationSeconds: "86400",
  },
  timing: {
    minRaise: "10",
    minRaiseDurationSeconds: "3600",
  },
  success: {
    successResolver: "0x2222222222222222222222222222222222222222",
    successAssertionLiveness: "86400",
    successAssertionBond: "0",
    successOracleSpecHash:
      "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    successAssertionPolicyHash:
      "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
  },
  flowMetadata: {
    title: "Alpha Goal",
    description: "Build phase one",
    image: "ipfs://image",
    tagline: "Ship it",
    url: "https://example.com",
  },
  underwriting: {
    budgetPremiumPpm: "0",
    budgetSlashPpm: "0",
  },
  budgetTCR: {
    allocationMechanismAdmin: "0x3333333333333333333333333333333333333333",
    invalidRoundRewardsSink: "0x000000000000000000000000000000000000dead",
    submissionDepositStrategy: "0x0000000000000000000000000000000000000000",
    submissionBaseDeposit: "0",
    removalBaseDeposit: "0",
    submissionChallengeBaseDeposit: "0",
    removalChallengeBaseDeposit: "0",
    registrationMetaEvidence: "ipfs://reg",
    clearingMetaEvidence: "ipfs://clear",
    challengePeriodDuration: "7200",
    arbitratorExtraData: "0x",
    budgetBounds: {
      minFundingLeadTime: "0",
      maxFundingHorizon: "86400",
      minExecutionDuration: "0",
      maxExecutionDuration: "86400",
      minActivationThreshold: "0",
      maxActivationThreshold: "1",
      maxRunwayCap: "1",
    },
    oracleBounds: {
      liveness: "1",
      bondAmount: "1",
    },
    budgetSuccessResolver: "0x4444444444444444444444444444444444444444",
    budgetSpendPolicy: "0x5555555555555555555555555555555555555555",
    arbitratorParams: {
      votingPeriod: "7200",
      votingDelay: "1",
      revealPeriod: "1",
      arbitrationCost: "1",
      wrongOrMissedSlashBps: "50",
      slashCallerBountyBps: "100",
    },
  },
  goalSpendPolicy: "0x6666666666666666666666666666666666666666",
} as const;

describe("cli protocol-step contract", () => {
  it("builds and validates a goal-create hosted protocol-step request", () => {
    const goalCreatePlan = buildGoalCreateProtocolPlan({
      deployParams,
    });
    const request = buildCliProtocolStepRequest({
      network: goalCreatePlan.network,
      action: goalCreatePlan.action,
      riskClass: goalCreatePlan.riskClass,
      step: goalCreatePlan.steps[0]!,
    });

    expect(request).toEqual(
      validateCliProtocolStepRequest({
        kind: "protocol-step",
        network: "base",
        action: "goal.create",
        riskClass: "economic",
        step: goalCreatePlan.steps[0],
      })
    );
    expect(request.step.transaction).toEqual(buildGoalCreateTransaction({ deployParams }));
  });

  it("validates canonical approval transactions for approval-bearing actions", () => {
    const request = validateCliProtocolStepRequest({
      kind: "protocol-step",
      network: "base",
      action: "stake.deposit-goal",
      riskClass: "stake",
      step: {
        kind: "erc20-approval",
        label: "Approve goal token",
        tokenAddress: "0x0000000000000000000000000000000000000011",
        spenderAddress: "0x0000000000000000000000000000000000000022",
        amount: "5",
        transaction: {
          to: "0x0000000000000000000000000000000000000011",
          data: "0x095ea7b300000000000000000000000000000000000000000000000000000000000000220000000000000000000000000000000000000000000000000000000000000005",
          valueEth: "0",
        },
      },
    });

    expect(request.action).toBe("stake.deposit-goal");
    expect(buildCliProtocolStepLogKind(request.action)).toBe("protocol-step:stake.deposit-goal");
  });

  it("rejects requests whose risk class does not match the supported action", () => {
    expect(() =>
      validateCliProtocolStepRequest({
        kind: "protocol-step",
        network: "base",
        action: "goal.create",
        riskClass: "stake",
        step: buildGoalCreateProtocolPlan({ deployParams }).steps[0],
      })
    ).toThrow('riskClass must be "economic" for action "goal.create"');
  });

  it("rejects contract-call payloads that do not decode to the declared function", () => {
    expect(() =>
      validateCliProtocolStepRequest({
        kind: "protocol-step",
        network: "base",
        action: "goal.create",
        riskClass: "economic",
        step: {
          kind: "contract-call",
          label: "Deploy goal",
          contract: "GoalFactory",
          functionName: "deployGoal",
          transaction: {
            to: "0x47e83655026b6caad68d32919f165ce9c3bd8a8f",
            data: "0x095ea7b3",
            valueEth: "0",
          },
        },
      })
    ).toThrow("step.transaction.data must decode as GoalFactory.deployGoal");
  });

  it("rejects steps that are not allowed for the declared action", () => {
    const goalCreatePlan = buildGoalCreateProtocolPlan({ deployParams });
    expect(() =>
      validateCliProtocolStepRequest({
        kind: "protocol-step",
        network: "base",
        action: "premium.claim",
        riskClass: "claim",
        step: goalCreatePlan.steps[0],
      })
    ).toThrow('step is not supported for action "premium.claim"');
  });
});
