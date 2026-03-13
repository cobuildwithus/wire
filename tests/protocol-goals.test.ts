import { describe, expect, it } from "vitest";
import { encodeAbiParameters, encodeEventTopics, encodeFunctionData } from "viem";
import {
  COBUILD_PROJECT_ID_BIGINT,
  buildGoalCreatePlan,
  buildGoalCreateProtocolPlan,
  buildGoalCreateTransaction,
  buildGoalCreateWriteContractRequest,
  decodeGoalDeployedEvent,
  encodeGoalFactoryDeployGoalData,
  extractGoalFactoryDeployParams,
  goalFactoryAbi,
  goalFactoryAddress,
  isGoalFactoryDeployParamsInput,
  normalizeGoalFactoryDeployParams,
  serializeGoalDeployedEvent,
} from "../src/index.js";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000" as const;

const normalizedDeployParams = {
  preset: 0,
  managedSafe: ZERO_ADDRESS,
  funding: {
    paymentToken: "0x62f05b13239b24b8eeff36696344de0db7d2efdd",
    paymentRevnetId: COBUILD_PROJECT_ID_BIGINT,
  },
  revnet: {
    name: "Alpha Goal",
    ticker: "ALPHA",
    uri: "ipfs://goal",
    initialIssuance: 1n,
    cashOutTaxRate: 0,
    reservedPercent: 9900,
    durationSeconds: 86_400,
  },
  timing: {
    minRaise: 10n,
    minRaiseDurationSeconds: 3_600,
  },
  success: {
    successResolver: "0x2222222222222222222222222222222222222222",
    successAssertionLiveness: 86_400n,
    successAssertionBond: 0n,
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
    budgetPremiumPpm: 0,
    budgetSlashPpm: 0,
  },
  budgetTCR: {
    allocationMechanismAdmin: "0x3333333333333333333333333333333333333333",
    invalidRoundRewardsSink: "0x000000000000000000000000000000000000dead",
    submissionDepositStrategy: "0x0000000000000000000000000000000000000000",
    submissionBaseDeposit: 0n,
    removalBaseDeposit: 0n,
    submissionChallengeBaseDeposit: 0n,
    removalChallengeBaseDeposit: 0n,
    registrationMetaEvidence: "ipfs://reg",
    clearingMetaEvidence: "ipfs://clear",
    challengePeriodDuration: 7_200n,
    arbitratorExtraData: "0x",
    budgetBounds: {
      minFundingLeadTime: 0n,
      maxFundingHorizon: 86_400n,
      minExecutionDuration: 0n,
      maxExecutionDuration: 86_400n,
      minActivationThreshold: 0n,
      maxActivationThreshold: 1n,
      maxRunwayCap: 1n,
    },
    oracleBounds: {
      liveness: 1n,
      bondAmount: 1n,
    },
    budgetSuccessResolver: "0x4444444444444444444444444444444444444444",
    budgetSpendPolicy: "0x5555555555555555555555555555555555555555",
    arbitratorParams: {
      votingPeriod: 7_200n,
      votingDelay: 1n,
      revealPeriod: 1n,
      arbitrationCost: 1n,
      wrongOrMissedSlashBps: 50n,
      slashCallerBountyBps: 100n,
    },
  },
  goalSpendPolicy: "0x6666666666666666666666666666666666666666",
} as const;

const rawDeployParams = {
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
      "0xAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    successAssertionPolicyHash:
      "0xBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB",
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
    invalidRoundRewardsSink: "0x000000000000000000000000000000000000dEaD",
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

const managedDeployParams = {
  ...rawDeployParams,
  preset: "managed",
  managedSafe: "0x7777777777777777777777777777777777777777",
  funding: {
    paymentToken: "0x8888888888888888888888888888888888888888",
    paymentRevnetId: "139",
  },
} as const;

const goalDeployedLog = (() => {
  const goalDeployedEvent = goalFactoryAbi.find(
    (entry) => entry.type === "event" && entry.name === "GoalDeployed"
  );
  if (!goalDeployedEvent || goalDeployedEvent.type !== "event") {
    throw new Error("GoalDeployed ABI is missing.");
  }

  const stack = {
    goalRevnetId: 137n,
    goalToken: "0x1111111111111111111111111111111111111111",
    goalSuperToken: "0x1212121212121212121212121212121212121212",
    goalTreasury: "0x1414141414141414141414141414141414141414",
    goalFlow: "0x1515151515151515151515151515151515151515",
    goalAllocatorStrategy: "0x1525252525252525252525252525252525252525",
    goalFlowAllocationLedgerPipeline: "0x1616161616161616161616161616161616161616",
    stakeVault: "0x1717171717171717171717171717171717171717",
    budgetStakeLedger: "0x1818181818181818181818181818181818181818",
    splitHook: "0x1919191919191919191919191919191919191919",
    jurorSlasherRouter: "0x1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a",
    underwriterSlasherRouter: "0x1b1b1b1b1b1b1b1b1b1b1b1b1b1b1b1b1b1b1b1b",
    successResolver: "0x1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c",
    budgetController: "0x1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d",
    arbitrator: "0x1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e",
  } as const;

  return {
    address: goalFactoryAddress,
    blockHash: "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    blockNumber: 1n,
    data: encodeAbiParameters(
      goalDeployedEvent.inputs.filter((input) => !input.indexed),
      [stack]
    ),
    logIndex: 0,
    removed: false,
    topics: encodeEventTopics({
      abi: [goalDeployedEvent],
      eventName: "GoalDeployed",
      args: {
        caller: "0x1111111111111111111111111111111111111111",
        goalRevnetId: 137n,
      },
    }),
    transactionHash: "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
    transactionIndex: 0,
  } as const;
})();

describe("protocol goals contract", () => {
  it("extracts and normalizes deploy params from raw input aliases", () => {
    expect(isGoalFactoryDeployParamsInput(rawDeployParams)).toBe(true);
    expect(normalizeGoalFactoryDeployParams(rawDeployParams)).toEqual(normalizedDeployParams);
    expect(extractGoalFactoryDeployParams({ deployParams: rawDeployParams })).toEqual(
      normalizedDeployParams
    );
    expect(extractGoalFactoryDeployParams({ params: rawDeployParams })).toEqual(
      normalizedDeployParams
    );
    expect(extractGoalFactoryDeployParams({ p: rawDeployParams })).toEqual(normalizedDeployParams);
    expect(() => extractGoalFactoryDeployParams({ nope: true })).toThrow(
      "Goal deploy params must include keys"
    );
  });

  it("supports explicit preset, managed-safe, and funding overrides", () => {
    expect(normalizeGoalFactoryDeployParams(managedDeployParams)).toMatchObject({
      preset: 1,
      managedSafe: "0x7777777777777777777777777777777777777777",
      funding: {
        paymentToken: "0x8888888888888888888888888888888888888888",
        paymentRevnetId: 139n,
      },
    });
  });

  it("accepts numeric preset values when managed-safe context is explicit", () => {
    expect(
      normalizeGoalFactoryDeployParams({
        ...rawDeployParams,
        preset: 1,
        managedSafe: "0x7777777777777777777777777777777777777777",
      })
    ).toMatchObject({
      preset: 1,
      managedSafe: "0x7777777777777777777777777777777777777777",
    });
  });

  it("rejects managed presets without an explicit managedSafe", () => {
    expect(() =>
      normalizeGoalFactoryDeployParams({
        ...rawDeployParams,
        preset: "managed",
      })
    ).toThrow("deployParams.managedSafe is required");
  });

  it("rejects non-string managedSafe values", () => {
    expect(() =>
      normalizeGoalFactoryDeployParams({
        ...rawDeployParams,
        managedSafe: 1,
      })
    ).toThrow("deployParams.managedSafe must be a string.");
  });

  it("rejects stale goal deploy fields that no longer exist on GoalFactory", () => {
    expect(() =>
      extractGoalFactoryDeployParams({
        ...rawDeployParams,
        revnet: {
          owner: "0x1111111111111111111111111111111111111111",
          ...rawDeployParams.revnet,
        },
      })
    ).toThrow("deployParams.revnet.owner is not supported");

    expect(() =>
      extractGoalFactoryDeployParams({
        ...rawDeployParams,
        underwriting: {
          coverageLambda: "0",
          ...rawDeployParams.underwriting,
        },
      })
    ).toThrow("deployParams.underwriting.coverageLambda is not supported");
  });

  it("encodes goal deploy calldata and builds plan/transaction envelopes", () => {
    const data = encodeGoalFactoryDeployGoalData(rawDeployParams);
    expect(data).toBe(
      encodeFunctionData({
        abi: goalFactoryAbi,
        functionName: "deployGoal",
        args: [normalizedDeployParams],
      })
    );

    expect(buildGoalCreateTransaction({ deployParams: rawDeployParams })).toEqual({
      to: goalFactoryAddress.toLowerCase(),
      data,
      valueEth: "0",
    });

    expect(buildGoalCreatePlan({ deployParams: rawDeployParams })).toMatchObject({
      chainId: 8453,
      network: "base",
      goalFactory: goalFactoryAddress.toLowerCase(),
      deployParams: normalizedDeployParams,
      transaction: {
        to: goalFactoryAddress.toLowerCase(),
        data,
        valueEth: "0",
      },
      writeContract: {
        address: goalFactoryAddress.toLowerCase(),
        functionName: "deployGoal",
        args: [normalizedDeployParams],
      },
    });

    expect(buildGoalCreateWriteContractRequest({ deployParams: rawDeployParams })).toEqual({
      address: goalFactoryAddress.toLowerCase(),
      abi: goalFactoryAbi,
      functionName: "deployGoal",
      args: [normalizedDeployParams],
    });

    expect(buildGoalCreateProtocolPlan({ deployParams: rawDeployParams })).toMatchObject({
      chainId: 8453,
      network: "base",
      action: "goal.create",
      riskClass: "economic",
      goalFactory: goalFactoryAddress.toLowerCase(),
      deployParams: normalizedDeployParams,
      expectedEvents: ["GoalDeployed"],
      steps: [
        {
          kind: "contract-call",
          contract: "GoalFactory",
          functionName: "deployGoal",
          transaction: {
            to: goalFactoryAddress.toLowerCase(),
            data,
            valueEth: "0",
          },
        },
      ],
    });
  });

  it("decodes GoalDeployed logs and serializes bigint fields", () => {
    expect(decodeGoalDeployedEvent([])).toBeNull();
    const decoded = decodeGoalDeployedEvent([goalDeployedLog]);
    expect(decoded).not.toBeNull();
    expect(decoded?.caller).toBe("0x1111111111111111111111111111111111111111");
    expect(decoded?.goalRevnetId).toBe(137n);
    expect(decoded?.stack.goalTreasury).toBe("0x1414141414141414141414141414141414141414");
    expect(decoded?.stack.goalAllocatorStrategy).toBe(
      "0x1525252525252525252525252525252525252525"
    );
    expect(decoded?.stack.budgetController).toBe("0x1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d");
    expect(decoded?.stack.budgetTCR).toBe("0x1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d");

    expect(serializeGoalDeployedEvent(decoded!)).toMatchObject({
      caller: "0x1111111111111111111111111111111111111111",
      goalRevnetId: "137",
      stack: {
        goalRevnetId: "137",
        goalFlow: "0x1515151515151515151515151515151515151515",
      },
    });
  });
});
