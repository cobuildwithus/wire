import { describe, expect, it } from "vitest";
import { encodeAbiParameters, encodeEventTopics, encodeFunctionData } from "viem";
import {
  buildGoalCreateTransaction,
  decodeGoalDeployedEvent,
  encodeGoalFactoryDeployGoalData,
  extractGoalFactoryDeployParams,
  goalFactoryAbi,
  goalFactoryAddress,
  serializeGoalDeployedEvent,
} from "../src/index.js";

const deployParams = {
  revnet: {
    owner: "0x1111111111111111111111111111111111111111",
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
    coverageLambda: 0n,
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
    arbitratorParams: {
      votingPeriod: 7_200n,
      votingDelay: 1n,
      revealPeriod: 1n,
      arbitrationCost: 1n,
      wrongOrMissedSlashBps: 50n,
      slashCallerBountyBps: 100n,
    },
  },
  goalSpendPolicy: "0x0000000000000000000000000000000000000000",
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
    goalFlowAllocationLedgerPipeline: "0x1616161616161616161616161616161616161616",
    stakeVault: "0x1717171717171717171717171717171717171717",
    budgetStakeLedger: "0x1818181818181818181818181818181818181818",
    splitHook: "0x1919191919191919191919191919191919191919",
    jurorSlasherRouter: "0x1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a",
    underwriterSlasherRouter: "0x1b1b1b1b1b1b1b1b1b1b1b1b1b1b1b1b1b1b1b1b",
    successResolver: "0x1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c",
    budgetTCR: "0x1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d",
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
  it("extracts deploy params from raw input aliases", () => {
    expect(extractGoalFactoryDeployParams({ deployParams })).toBe(deployParams);
    expect(extractGoalFactoryDeployParams({ params: deployParams })).toBe(deployParams);
    expect(extractGoalFactoryDeployParams({ p: deployParams })).toBe(deployParams);
    expect(() => extractGoalFactoryDeployParams({ nope: true })).toThrow(
      "Goal deploy params must include keys"
    );
  });

  it("encodes goal deploy calldata and builds a transaction envelope", () => {
    const data = encodeGoalFactoryDeployGoalData(deployParams);
    expect(data).toBe(
      encodeFunctionData({
        abi: goalFactoryAbi,
        functionName: "deployGoal",
        args: [deployParams],
      })
    );

    expect(buildGoalCreateTransaction({ deployParams })).toEqual({
      to: goalFactoryAddress.toLowerCase(),
      data,
      valueEth: "0",
    });
  });

  it("decodes GoalDeployed logs and serializes bigint fields", () => {
    const decoded = decodeGoalDeployedEvent([goalDeployedLog]);
    expect(decoded).not.toBeNull();
    expect(decoded?.caller).toBe("0x1111111111111111111111111111111111111111");
    expect(decoded?.goalRevnetId).toBe(137n);
    expect(decoded?.stack.goalTreasury).toBe("0x1414141414141414141414141414141414141414");
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
