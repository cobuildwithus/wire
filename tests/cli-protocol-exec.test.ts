import { describe, expect, it } from "vitest";
import {
  buildCliProtocolPlanLogKind,
  buildCliProtocolPlanRequest,
  buildCliProtocolStepLogKind,
  buildCliProtocolStepRequest,
  buildFlowClearStaleAllocationPlan,
  buildFlowSyncAllocationPlan,
  buildGoalCreateProtocolPlan,
  buildGoalStakeDepositPlan,
  buildGoalCreateTransaction,
  buildProtocolApprovalStep,
  validateCliProtocolStepRequest,
  validateCliProtocolPlanRequest,
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

  it("builds and validates flow maintenance protocol-step requests", () => {
    const syncPlan = buildFlowSyncAllocationPlan({
      flowAddress: "0x00000000000000000000000000000000000000aa",
      allocationKey: 12n,
    });
    const syncRequest = buildCliProtocolStepRequest({
      network: syncPlan.network,
      action: syncPlan.action,
      riskClass: syncPlan.riskClass,
      step: syncPlan.steps[0]!,
    });

    expect(syncRequest).toEqual(
      validateCliProtocolStepRequest({
        kind: "protocol-step",
        network: "base",
        action: "flow.sync-allocation",
        riskClass: "maintenance",
        step: syncPlan.steps[0],
      })
    );
    expect(buildCliProtocolStepLogKind(syncRequest.action)).toBe(
      "protocol-step:flow.sync-allocation"
    );

    const clearPlan = buildFlowClearStaleAllocationPlan({
      flowAddress: "0x00000000000000000000000000000000000000bb",
      allocationKey: 18n,
    });

    expect(
      validateCliProtocolStepRequest({
        kind: "protocol-step",
        network: "base",
        action: "flow.clear-stale-allocation",
        riskClass: "maintenance",
        step: clearPlan.steps[0]!,
      })
    ).toMatchObject({
      action: "flow.clear-stale-allocation",
      riskClass: "maintenance",
    });
  });

  it("builds and validates hosted protocol-plan requests", () => {
    const plan = buildGoalCreateProtocolPlan({
      deployParams,
    });
    const request = buildCliProtocolPlanRequest({
      network: plan.network,
      action: plan.action,
      riskClass: plan.riskClass,
      steps: plan.steps,
    });

    expect(request).toEqual(
      validateCliProtocolPlanRequest({
        kind: "protocol-plan",
        network: "base",
        action: "goal.create",
        riskClass: "economic",
        steps: plan.steps,
      })
    );
    expect(buildCliProtocolPlanLogKind(request.action)).toBe("protocol-plan:goal.create");
  });

  it("preserves nonzero valueEth when validating protocol-plan contract calls", () => {
    const plan = buildGoalCreateProtocolPlan({
      deployParams,
    });
    const contractCallStep = plan.steps[0];
    if (!contractCallStep || contractCallStep.kind !== "contract-call") {
      throw new Error("missing goal-create contract-call step");
    }

    const request = validateCliProtocolPlanRequest({
      kind: "protocol-plan",
      network: "base",
      action: "goal.create",
      riskClass: "economic",
      steps: [
        {
          ...contractCallStep,
          transaction: {
            ...contractCallStep.transaction,
            valueEth: "1.25",
          },
        },
      ],
    });

    const validatedStep = request.steps[0];
    if (!validatedStep || validatedStep.kind !== "contract-call") {
      throw new Error("missing validated contract-call step");
    }

    expect(validatedStep.transaction.valueEth).toBe("1.25");
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

  it("rejects nonzero valueEth for protocol-step execution requests", () => {
    const plan = buildGoalCreateProtocolPlan({
      deployParams,
    });
    const contractCallStep = plan.steps[0];
    if (!contractCallStep || contractCallStep.kind !== "contract-call") {
      throw new Error("missing goal-create contract-call step");
    }

    expect(() =>
      validateCliProtocolStepRequest({
        kind: "protocol-step",
        network: "base",
        action: "goal.create",
        riskClass: "economic",
        step: {
          ...contractCallStep,
          transaction: {
            ...contractCallStep.transaction,
            valueEth: "1",
          },
        },
      })
    ).toThrow('step.transaction.valueEth must be "0" for protocol-step execution.');
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

  it("rejects protocol-plan requests whose steps are not ordered as approvals then one call", () => {
    const plan = buildGoalCreateProtocolPlan({ deployParams });

    expect(() =>
      validateCliProtocolPlanRequest({
        kind: "protocol-plan",
        network: "base",
        action: "goal.create",
        riskClass: "economic",
        steps: [
          plan.steps[0],
          {
            kind: "erc20-approval",
            label: "Approve token late",
            tokenAddress: "0x0000000000000000000000000000000000000011",
            spenderAddress: "0x0000000000000000000000000000000000000022",
            amount: "5",
            transaction: {
              to: "0x0000000000000000000000000000000000000011",
              data: "0x095ea7b300000000000000000000000000000000000000000000000000000000000000220000000000000000000000000000000000000000000000000000000000000005",
              valueEth: "0",
            },
          },
        ],
      })
    ).toThrow('steps must end with exactly one "contract-call" step.');
  });

  it("rejects protocol-plan requests whose steps are not supported for the declared action", () => {
    const plan = buildFlowSyncAllocationPlan({
      flowAddress: "0x00000000000000000000000000000000000000aa",
      allocationKey: 12n,
    });

    expect(() =>
      validateCliProtocolPlanRequest({
        kind: "protocol-plan",
        network: "base",
        action: "premium.claim",
        riskClass: "claim",
        steps: plan.steps,
      })
    ).toThrow('steps[0] is not supported for action "premium.claim".');
  });

  it("rejects protocol-plan approvals whose spender does not match the final call target", () => {
    const plan = buildGoalStakeDepositPlan({
      network: "base",
      stakeVaultAddress: "0x0000000000000000000000000000000000000022",
      goalTokenAddress: "0x0000000000000000000000000000000000000011",
      amount: "100",
      approvalMode: "force",
    });
    const badApproval = buildProtocolApprovalStep({
      label: plan.steps[0]!.kind === "erc20-approval" ? plan.steps[0]!.label : "Approve goal token",
      tokenAddress:
        plan.steps[0]!.kind === "erc20-approval"
          ? plan.steps[0]!.tokenAddress
          : "0x0000000000000000000000000000000000000011",
      spenderAddress: "0x00000000000000000000000000000000000000ff",
      amount: plan.steps[0]!.kind === "erc20-approval" ? plan.steps[0]!.amount : "100",
    });

    expect(() =>
      validateCliProtocolPlanRequest({
        kind: "protocol-plan",
        network: "base",
        action: plan.action,
        riskClass: plan.riskClass,
        steps: [badApproval, plan.steps[1]!],
      })
    ).toThrow("steps[0].spenderAddress must match the final contract-call target address.");
  });
});
