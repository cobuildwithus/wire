import { describe, expect, it, vi } from "vitest";
import {
  readArbitratorVotePreflight,
  readBudgetDonationPreflight,
  readFlowAllocationPreflight,
  readGoalDonationPreflight,
  readPremiumEscrowPreflight,
  readRoundPrizeVaultPreflight,
  readStakeVaultParticipantPreflight,
  readTcrRequestPreflight,
  readTcrSubmissionPreflight,
  serializeProtocolParticipantPreflight,
  type ProtocolParticipantReadClient,
} from "../src/protocol-participant-preflights.js";

const REGISTRY = "0x1111111111111111111111111111111111111111";
const ALLOCATION_TCR = "0x1212121212121212121212121212121212121212";
const ARBITRATOR = "0x2222222222222222222222222222222222222222";
const DEPOSIT_TOKEN = "0x3333333333333333333333333333333333333333";
const USER = "0x4444444444444444444444444444444444444444";
const REQUESTER = "0x5555555555555555555555555555555555555555";
const CHALLENGER = "0x6666666666666666666666666666666666666666";
const STAKE_VAULT = "0x7777777777777777777777777777777777777777";
const GOAL_TREASURY = "0x8888888888888888888888888888888888888888";
const GOAL_TOKEN = "0x9999999999999999999999999999999999999999";
const COBUILD_TOKEN = "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
const LEDGER = "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb";
const PREMIUM_ESCROW = "0xcccccccccccccccccccccccccccccccccccccccc";
const PRIZE_VAULT = "0xdddddddddddddddddddddddddddddddddddddddd";
const SUPER_TOKEN = "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";
const UNDERLYING = "0xffffffffffffffffffffffffffffffffffffffff";
const BUDGET_TREASURY = "0x1111111111111111111111111111111111111112";
const FLOW = "0x2222222222222222222222222222222222222223";
const PIPELINE = "0x3333333333333333333333333333333333333334";
const STRATEGY = "0x4444444444444444444444444444444444444445";
const CHILD_FLOW = "0x5555555555555555555555555555555555555556";
const CHILD_STRATEGY = "0x6666666666666666666666666666666666666667";
const INVALID_REWARDS_SINK = "0x7777777777777777777777777777777777777778";

const ITEM_ID =
  "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
const COMMIT_HASH =
  "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb";
const COMMITMENT =
  "0xcccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc";
const CHILD_SYNC_REASON =
  "0xdddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd";
const EXPECTED_COMMIT =
  "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";

function stableValue(value: unknown): unknown {
  if (typeof value === "bigint") {
    return `${value.toString()}n`;
  }
  if (Array.isArray(value)) {
    return value.map((entry) => stableValue(entry));
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, entry]) => [key, stableValue(entry)])
    );
  }
  return value;
}

function readKey(address: string, functionName: string, args?: readonly unknown[]) {
  return `${address.toLowerCase()}:${functionName}:${JSON.stringify(stableValue(args ?? []))}`;
}

function logsKey(address: string, eventName: string, args?: Record<string, unknown>) {
  return `${address.toLowerCase()}:${eventName}:${JSON.stringify(stableValue(args ?? {}))}`;
}

function createClient(params: {
  reads: Record<string, unknown>;
  logs?: Record<string, readonly unknown[]>;
  timestamp?: bigint;
}): ProtocolParticipantReadClient {
  const logs = params.logs ?? {};
  const timestamp = params.timestamp ?? 0n;

  return {
    getBlock: vi.fn(async () => ({ timestamp })) as unknown as ProtocolParticipantReadClient["getBlock"],
    getLogs: vi.fn(async (request: any) => {
      const key = logsKey(
        request.address,
        request.event?.name ?? "unknown",
        request.args as Record<string, unknown>
      );
      if (!(key in logs)) {
        return [];
      }
      return [...(logs[key] as readonly any[])];
    }) as unknown as ProtocolParticipantReadClient["getLogs"],
    readContract: vi.fn(async (request: any) => {
      const key = readKey(request.address, request.functionName, request.args);
      if (!(key in params.reads)) {
        throw new Error(`Missing mock read for ${key}`);
      }
      return params.reads[key];
    }) as unknown as ProtocolParticipantReadClient["readContract"],
  };
}

describe("protocol participant preflights", () => {
  it("reads round-submission TCR submission context and approval hints", async () => {
    const client = createClient({
      timestamp: 150n,
      reads: {
        [readKey(REGISTRY, "erc20")]: DEPOSIT_TOKEN,
        [readKey(REGISTRY, "getTotalCosts")]: [100n, 200n, 300n, 400n, 50n],
        [readKey(REGISTRY, "startAt")]: 100n,
        [readKey(REGISTRY, "endAt")]: 200n,
        [readKey(REGISTRY, "prizeVault")]: PRIZE_VAULT,
        [readKey(DEPOSIT_TOKEN, "balanceOf", [USER])]: 150n,
        [readKey(DEPOSIT_TOKEN, "allowance", [USER, REGISTRY])]: 60n,
      },
    });

    const result = await readTcrSubmissionPreflight({
      client,
      registryAddress: REGISTRY,
      flavor: "round-submission",
      actorAddress: USER,
    });

    expect(result.addItem.requiredAmount).toBe(100n);
    expect(result.addItem.approval).toMatchObject({
      requiresApproval: true,
      insufficientBalance: false,
      allowanceShortfall: 40n,
    });
    expect(result.roundSubmissionContext).toMatchObject({
      roundOpen: true,
      prizeVaultAddress: PRIZE_VAULT,
    });
  });

  it("reads TCR request lifecycle and allocation-mechanism variant flags", async () => {
    const client = createClient({
      reads: {
        [readKey(ALLOCATION_TCR, "erc20")]: DEPOSIT_TOKEN,
        [readKey(ALLOCATION_TCR, "getTotalCosts")]: [100n, 200n, 300n, 400n, 50n],
        [readKey(ALLOCATION_TCR, "getItemInfo", [ITEM_ID])]: ["0x1234", 2, 1n],
        [readKey(ALLOCATION_TCR, "getLatestRequestIndex", [ITEM_ID])]: [true, 0n],
        [readKey(ALLOCATION_TCR, "submissionDeposits", [ITEM_ID])]: 99n,
        [readKey(ALLOCATION_TCR, "getRequestInfo", [ITEM_ID, 0n])]: [
          false,
          9n,
          1_000n,
          false,
          ["0x0000000000000000000000000000000000000000", REQUESTER, CHALLENGER],
          1n,
          0,
          ARBITRATOR,
          "0x12",
          7n,
        ],
        [readKey(ALLOCATION_TCR, "getRequestSnapshot", [ITEM_ID, 0n])]: [2, 86_400n, 3_600n, 50n, 250n],
        [readKey(ALLOCATION_TCR, "getRequestState", [ITEM_ID, 0n])]: [1, 2_000n, 0n, 0, true, false, false],
        [readKey(ALLOCATION_TCR, "getRoundInfo", [ITEM_ID, 0n, 0n])]: [
          [0n, 0n, 0n],
          [false, false, false],
          0n,
        ],
        [readKey(ALLOCATION_TCR, "getContributions", [ITEM_ID, 0n, 0n, USER])]: [0n, 5n, 0n],
        [readKey(ALLOCATION_TCR, "activationQueued", [ITEM_ID])]: true,
        [readKey(ALLOCATION_TCR, "removalQueued", [ITEM_ID])]: false,
        [readKey(DEPOSIT_TOKEN, "balanceOf", [USER])]: 1_000n,
        [readKey(DEPOSIT_TOKEN, "allowance", [USER, ALLOCATION_TCR])]: 100n,
      },
    });

    const result = await readTcrRequestPreflight({
      client,
      registryAddress: ALLOCATION_TCR,
      itemId: ITEM_ID,
      flavor: "allocation-mechanism",
      actorAddress: USER,
    });

    expect(result.removeItem.canRemove).toBe(false);
    expect(result.request).toMatchObject({
      canChallenge: true,
      challengeRequiredAmount: 300n,
      requesterAddress: REQUESTER,
      challengerAddress: CHALLENGER,
      canWithdrawFeesAndRewards: false,
    });
    expect(result.request?.challengeApproval?.requiresApproval).toBe(true);
    expect(result.allocationMechanismContext).toEqual({
      activationQueued: true,
      removalQueued: false,
    });
  });

  it("reads arbitrator voting context and voter eligibility", async () => {
    const client = createClient({
      reads: {
        [readKey(ARBITRATOR, "disputes", [5n])]: [5n, REGISTRY, false, 0n, 2n, 1n],
        [readKey(ARBITRATOR, "disputeStatus", [5n])]: 0,
        [readKey(ARBITRATOR, "currentRuling", [5n])]: 0,
        [readKey(ARBITRATOR, "votingToken")]: DEPOSIT_TOKEN,
        [readKey(ARBITRATOR, "stakeVault")]: STAKE_VAULT,
        [readKey(ARBITRATOR, "invalidRoundRewardsSink")]: INVALID_REWARDS_SINK,
        [readKey(ARBITRATOR, "getVotingRoundInfo", [5n, 0n])]: [
          2,
          100n,
          200n,
          200n,
          250n,
          999n,
          50n,
          100n,
          60n,
          40n,
          1,
        ],
        [readKey(ARBITRATOR, "votingPowerInRound", [5n, 0n, USER])]: [80n, true],
        [readKey(ARBITRATOR, "getVoterRoundStatus", [5n, 0n, USER])]: [
          true,
          false,
          COMMIT_HASH,
          1n,
          80n,
          false,
          false,
          10n,
          2n,
          3n,
        ],
      },
    });

    const result = await readArbitratorVotePreflight({
      client,
      arbitratorAddress: ARBITRATOR,
      disputeId: 5n,
      voterAddress: USER,
    });

    expect(result.currentRoundStateLabel).toBe("reveal");
    expect(result.canExecuteRuling).toBe(false);
    expect(result.voter).toMatchObject({
      canCommit: false,
      canReveal: true,
      canWithdrawReward: false,
      claimableGoalSlashReward: 2n,
      claimableCobuildSlashReward: 3n,
    });
  });

  it("reads stake-vault participant readiness including juror exit logs", async () => {
    const client = createClient({
      timestamp: 1_200n,
      reads: {
        [readKey(STAKE_VAULT, "goalTreasury")]: GOAL_TREASURY,
        [readKey(STAKE_VAULT, "goalToken")]: GOAL_TOKEN,
        [readKey(STAKE_VAULT, "cobuildToken")]: COBUILD_TOKEN,
        [readKey(STAKE_VAULT, "goalResolved")]: true,
        [readKey(STAKE_VAULT, "goalResolvedAt")]: 1_000n,
        [readKey(STAKE_VAULT, "JUROR_EXIT_DELAY")]: 100n,
        [readKey(STAKE_VAULT, "stakedGoalOf", [USER])]: 500n,
        [readKey(STAKE_VAULT, "stakedCobuildOf", [USER])]: 200n,
        [readKey(STAKE_VAULT, "weightOf", [USER])]: 700n,
        [readKey(STAKE_VAULT, "jurorWeightOf", [USER])]: 50n,
        [readKey(STAKE_VAULT, "jurorLockedGoalOf", [USER])]: 100n,
        [readKey(STAKE_VAULT, "jurorDelegateOf", [USER])]:
          "0x0000000000000000000000000000000000000000",
        [readKey(STAKE_VAULT, "isAuthorizedJurorOperator", [USER, REQUESTER])]: true,
        [readKey(GOAL_TREASURY, "budgetStakeLedger")]: LEDGER,
        [readKey(STAKE_VAULT, "underwriterWithdrawalPrepareCursor", [USER])]: 2n,
        [readKey(STAKE_VAULT, "underwriterWithdrawalPreparedBudgetCount", [USER])]: 2n,
        [readKey(STAKE_VAULT, "underwriterWithdrawalPreparedForResolvedAt", [USER])]: 1_000n,
        [readKey(LEDGER, "registeredBudgetCount")]: 2n,
        [readKey(STAKE_VAULT, "quoteGoalToCobuildWeightRatio", [25n])]: [50n, 10n, 1_000n],
        [readKey(GOAL_TOKEN, "balanceOf", [USER])]: 100n,
        [readKey(GOAL_TOKEN, "allowance", [USER, STAKE_VAULT])]: 10n,
        [readKey(COBUILD_TOKEN, "balanceOf", [USER])]: 30n,
        [readKey(COBUILD_TOKEN, "allowance", [USER, STAKE_VAULT])]: 30n,
      },
      logs: {
        [logsKey(STAKE_VAULT, "JurorExitRequested", { juror: USER })]: [
          {
            blockNumber: 10n,
            logIndex: 1,
            args: {
              goalAmount: 60n,
              requestedAt: 1_050n,
            },
          },
        ],
        [logsKey(STAKE_VAULT, "JurorExitFinalized", { juror: USER })]: [],
      },
    });

    const result = await readStakeVaultParticipantPreflight({
      client,
      stakeVaultAddress: STAKE_VAULT,
      accountAddress: USER,
      goalDepositAmount: 25n,
      cobuildDepositAmount: 30n,
      goalWithdrawalAmount: 350n,
      cobuildWithdrawalAmount: 250n,
      jurorLockAmount: 50n,
      jurorExitAmount: 80n,
      delegateAddress: REQUESTER,
      operatorAddress: REQUESTER,
    });

    expect(result.underwriterWithdrawal.preparedComplete).toBe(true);
    expect(result.goalDeposit.approval?.requiresApproval).toBe(true);
    expect(result.goalWithdrawal.canWithdraw).toBe(true);
    expect(result.cobuildWithdrawal.blockedReason).toBe("insufficient-cobuild-stake");
    expect(result.juror).toMatchObject({
      canFinalizeExit: true,
      canOptIn: false,
      canRequestExit: true,
      delegateUpdateRequired: true,
      operatorAuthorized: true,
      exitRequest: {
        goalAmount: 60n,
        availableAt: 1_150n,
        ready: true,
      },
    });
  });

  it("reads premium and prize-vault claimability", async () => {
    const client = createClient({
      reads: {
        [readKey(PREMIUM_ESCROW, "budgetTreasury")]: BUDGET_TREASURY,
        [readKey(PREMIUM_ESCROW, "goalFlow")]: FLOW,
        [readKey(PREMIUM_ESCROW, "premiumToken")]: DEPOSIT_TOKEN,
        [readKey(PREMIUM_ESCROW, "claimable", [USER])]: 30n,
        [readKey(PREMIUM_ESCROW, "userCov", [USER])]: 100n,
        [readKey(PREMIUM_ESCROW, "totalCoverage")]: 1_000n,
        [readKey(PREMIUM_ESCROW, "exposureIntegral", [USER])]: 20n,
        [readKey(PREMIUM_ESCROW, "premiumIndex")]: 5n,
        [readKey(PREMIUM_ESCROW, "creditIndex")]: 6n,
        [readKey(PREMIUM_ESCROW, "closed")]: false,
        [readKey(PREMIUM_ESCROW, "finalState")]: 2,
        [readKey(PREMIUM_ESCROW, "isSlashable")]: false,
        [readKey(PRIZE_VAULT, "payoutRecipientOf", [ITEM_ID])]: USER,
        [readKey(PRIZE_VAULT, "submissionsTCR")]: REGISTRY,
        [readKey(PRIZE_VAULT, "operator")]: REQUESTER,
        [readKey(PRIZE_VAULT, "superToken")]: SUPER_TOKEN,
        [readKey(PRIZE_VAULT, "underlyingToken")]: UNDERLYING,
        [readKey(PRIZE_VAULT, "entitlementOf", [ITEM_ID])]: 100n,
        [readKey(PRIZE_VAULT, "claimedOf", [ITEM_ID])]: 40n,
      },
    });

    const premium = await readPremiumEscrowPreflight({
      client,
      premiumEscrowAddress: PREMIUM_ESCROW,
      accountAddress: USER,
    });
    const prize = await readRoundPrizeVaultPreflight({
      client,
      roundPrizeVaultAddress: PRIZE_VAULT,
      submissionId: ITEM_ID,
      accountAddress: USER,
    });

    expect(premium).toMatchObject({
      canCheckpoint: true,
      canClaim: true,
      finalStateLabel: "succeeded",
    });
    expect(prize).toMatchObject({
      claimable: 60n,
      canClaim: true,
      payoutRecipientAddress: USER,
    });
  });

  it("reads goal and budget donation readiness with underlying-token approvals", async () => {
    const client = createClient({
      reads: {
        [readKey(GOAL_TREASURY, "state")]: 1,
        [readKey(GOAL_TREASURY, "lifecycleStatus")]: [
          1,
          false,
          true,
          true,
          false,
          false,
          false,
          false,
          100n,
          200n,
          300n,
          400n,
          500n,
          600n,
        ],
        [readKey(GOAL_TREASURY, "superToken")]: SUPER_TOKEN,
        [readKey(SUPER_TOKEN, "getUnderlyingToken")]: UNDERLYING,
        [readKey(UNDERLYING, "balanceOf", [USER])]: 100n,
        [readKey(UNDERLYING, "allowance", [USER, GOAL_TREASURY])]: 10n,
        [readKey(BUDGET_TREASURY, "state")]: 0,
        [readKey(BUDGET_TREASURY, "lifecycleStatus")]: [
          0,
          false,
          false,
          false,
          true,
          true,
          false,
          false,
          50n,
          75n,
          125n,
          1_000n,
          86_400n,
          0n,
          0n,
          1_000n,
          12n,
        ],
        [readKey(BUDGET_TREASURY, "superToken")]: SUPER_TOKEN,
        [readKey(UNDERLYING, "allowance", [USER, BUDGET_TREASURY])]: 0n,
      },
    });

    const goal = await readGoalDonationPreflight({
      client,
      goalTreasuryAddress: GOAL_TREASURY,
      accountAddress: USER,
      amount: 45n,
    });
    const budget = await readBudgetDonationPreflight({
      client,
      budgetTreasuryAddress: BUDGET_TREASURY,
      accountAddress: USER,
      amount: 45n,
    });

    expect(goal).toMatchObject({
      canDonate: true,
      stateLabel: "active",
    });
    expect(goal.approval?.requiresApproval).toBe(true);
    expect(budget).toMatchObject({
      canDonate: false,
      blockedReason: "budget-not-accepting-funding",
      stateLabel: "funding",
    });
  });

  it("reads flow allocation preview, router context, and child-sync requirements", async () => {
    const client = createClient({
      reads: {
        [readKey(FLOW, "allocationPipeline")]: PIPELINE,
        [readKey(FLOW, "getChildFlows")]: [CHILD_FLOW],
        [readKey(FLOW, "getClaimableBalance", [USER])]: 12n,
        [readKey(STRATEGY, "allocationKey", [USER, "0x"])]: 77n,
        [readKey(STRATEGY, "canAccountAllocate", [USER])]: true,
        [readKey(STRATEGY, "accountAllocationWeight", [USER])]: 100n,
        [readKey(PIPELINE, "validateForFlow", [FLOW])]: undefined,
        [readKey(FLOW, "getAllocationCommitment", [STRATEGY, 77n])]: COMMITMENT,
        [readKey(STRATEGY, "canAllocate", [77n, USER])]: true,
        [readKey(STRATEGY, "currentWeight", [77n])]: 150n,
        [readKey(STRATEGY, "budgetStakeLedger")]: LEDGER,
        [readKey(STRATEGY, "canAccountAllocateForFlow", [FLOW, USER])]: true,
        [readKey(STRATEGY, "accountAllocationWeightForFlow", [FLOW, USER])]: 120n,
        [readKey(STRATEGY, "currentWeightForFlow", [FLOW, 77n])]: 140n,
        [readKey(STRATEGY, "recipientIdForFlow", [FLOW])]: [ITEM_ID, true],
        [readKey(PIPELINE, "childSyncDebtCount", [USER])]: 1n,
        [readKey(PIPELINE, "childSyncDebt", [USER, BUDGET_TREASURY])]: [
          true,
          CHILD_FLOW,
          CHILD_STRATEGY,
          55n,
          CHILD_SYNC_REASON,
        ],
        [readKey(LEDGER, "budgetInfo", [BUDGET_TREASURY])]: [true, 0n, 500n, 900n],
        [readKey(LEDGER, "budgetCheckpoint", [BUDGET_TREASURY])]: [1_000n, 700n],
        [readKey(LEDGER, "userAllocatedStakeOnBudget", [USER, BUDGET_TREASURY])]: 200n,
        [readKey(PIPELINE, "previewChildSyncRequirements", [
          STRATEGY,
          77n,
          150n,
          [ITEM_ID],
          [1_000_000],
          [ITEM_ID],
          [1_000_000],
        ])]: [[BUDGET_TREASURY, CHILD_FLOW, CHILD_STRATEGY, 55n, EXPECTED_COMMIT]],
      },
    });

    const result = await readFlowAllocationPreflight({
      client,
      flowAddress: FLOW,
      strategyAddress: STRATEGY,
      accountAddress: USER,
      strategyKind: "budget-flow-router",
      previousAllocations: [{ recipientId: ITEM_ID, allocationPpm: 1_000_000n }],
      nextAllocations: [{ recipientId: ITEM_ID, allocationPpm: 1_000_000n }],
      budgetTreasuryAddresses: [BUDGET_TREASURY],
    });

    expect(result).toMatchObject({
      allocationKey: 77n,
      hasExistingCommitment: true,
      canAllocate: true,
      childSyncDebtCount: 1n,
    });
    expect(result.routerContext).toMatchObject({
      recipientRegistered: true,
      budgetStakeLedgerAddress: LEDGER,
    });
    expect(result.childSyncDebts[0]).toMatchObject({
      exists: true,
      userAllocatedStake: 200n,
    });
    expect(result.preview?.childSyncRequirements[0]).toMatchObject({
      budgetTreasuryAddress: BUDGET_TREASURY,
      expectedCommit: EXPECTED_COMMIT,
    });
  });

  it("handles requestless TCR items and null approval paths", async () => {
    const client = createClient({
      reads: {
        [readKey(REGISTRY, "erc20")]: DEPOSIT_TOKEN,
        [readKey(REGISTRY, "getTotalCosts")]: [100n, 200n, 300n, 400n, 50n],
        [readKey(REGISTRY, "getItemInfo", [ITEM_ID])]: ["0x", 1, 0n],
        [readKey(REGISTRY, "getLatestRequestIndex", [ITEM_ID])]: [false, 0n],
        [readKey(REGISTRY, "submissionDeposits", [ITEM_ID])]: 0n,
        [readKey(REGISTRY, "startAt")]: 100n,
        [readKey(REGISTRY, "endAt")]: 200n,
        [readKey(REGISTRY, "prizeVault")]: PRIZE_VAULT,
      },
    });

    const result = await readTcrRequestPreflight({
      client,
      registryAddress: REGISTRY,
      itemId: ITEM_ID,
      flavor: "round-submission",
    });

    expect(result.request).toBeNull();
    expect(result.removeItem).toMatchObject({
      canRemove: true,
      approval: null,
    });
    expect(result.roundSubmissionContext?.prizeVaultAddress).toBe(PRIZE_VAULT);
  });

  it("handles unresolved stake state without an active exit request", async () => {
    const client = createClient({
      timestamp: 900n,
      reads: {
        [readKey(STAKE_VAULT, "goalTreasury")]: GOAL_TREASURY,
        [readKey(STAKE_VAULT, "goalToken")]: GOAL_TOKEN,
        [readKey(STAKE_VAULT, "cobuildToken")]: COBUILD_TOKEN,
        [readKey(STAKE_VAULT, "goalResolved")]: false,
        [readKey(STAKE_VAULT, "goalResolvedAt")]: 0n,
        [readKey(STAKE_VAULT, "JUROR_EXIT_DELAY")]: 100n,
        [readKey(STAKE_VAULT, "stakedGoalOf", [USER])]: 500n,
        [readKey(STAKE_VAULT, "stakedCobuildOf", [USER])]: 200n,
        [readKey(STAKE_VAULT, "weightOf", [USER])]: 700n,
        [readKey(STAKE_VAULT, "jurorWeightOf", [USER])]: 50n,
        [readKey(STAKE_VAULT, "jurorLockedGoalOf", [USER])]: 100n,
        [readKey(STAKE_VAULT, "jurorDelegateOf", [USER])]: REQUESTER,
        [readKey(GOAL_TREASURY, "budgetStakeLedger")]: LEDGER,
        [readKey(STAKE_VAULT, "underwriterWithdrawalPrepareCursor", [USER])]: 0n,
        [readKey(STAKE_VAULT, "underwriterWithdrawalPreparedBudgetCount", [USER])]: 0n,
        [readKey(STAKE_VAULT, "underwriterWithdrawalPreparedForResolvedAt", [USER])]: 0n,
        [readKey(LEDGER, "registeredBudgetCount")]: 2n,
        [readKey(GOAL_TOKEN, "balanceOf", [USER])]: 100n,
        [readKey(GOAL_TOKEN, "allowance", [USER, STAKE_VAULT])]: 100n,
        [readKey(COBUILD_TOKEN, "balanceOf", [USER])]: 100n,
        [readKey(COBUILD_TOKEN, "allowance", [USER, STAKE_VAULT])]: 100n,
      },
      logs: {
        [logsKey(STAKE_VAULT, "JurorExitRequested", { juror: USER })]: [],
        [logsKey(STAKE_VAULT, "JurorExitFinalized", { juror: USER })]: [],
      },
    });

    const result = await readStakeVaultParticipantPreflight({
      client,
      stakeVaultAddress: STAKE_VAULT,
      accountAddress: USER,
      jurorLockAmount: 50n,
      delegateAddress: REQUESTER,
    });

    expect(result.underwriterWithdrawal.blockedReason).toBe(
      "underwriter-withdrawal-not-prepared"
    );
    expect(result.juror).toMatchObject({
      canOptIn: true,
      canFinalizeExit: false,
      delegateUpdateRequired: false,
      exitRequest: null,
    });
  });

  it("handles common flow strategies without router context or preview", async () => {
    const client = createClient({
      reads: {
        [readKey(FLOW, "allocationPipeline")]: PIPELINE,
        [readKey(FLOW, "getChildFlows")]: [],
        [readKey(FLOW, "getClaimableBalance", [USER])]: 0n,
        [readKey(STRATEGY, "allocationKey", [USER, "0x"])]: 10n,
        [readKey(STRATEGY, "canAccountAllocate", [USER])]: false,
        [readKey(STRATEGY, "accountAllocationWeight", [USER])]: 0n,
        [readKey(PIPELINE, "validateForFlow", [FLOW])]: undefined,
        [readKey(FLOW, "getAllocationCommitment", [STRATEGY, 10n])]:
          "0x0000000000000000000000000000000000000000000000000000000000000000",
        [readKey(STRATEGY, "canAllocate", [10n, USER])]: false,
        [readKey(STRATEGY, "currentWeight", [10n])]: 0n,
        [readKey(PIPELINE, "childSyncDebtCount", [USER])]: 0n,
      },
    });

    const result = await readFlowAllocationPreflight({
      client,
      flowAddress: FLOW,
      strategyAddress: STRATEGY,
      accountAddress: USER,
    });

    expect(result).toMatchObject({
      hasExistingCommitment: false,
      canAccountAllocate: false,
      canAllocate: false,
      childSyncDebtCount: 0n,
    });
    expect(result.routerContext).toBeNull();
    expect(result.preview).toBeNull();
  });

  it("returns null labels for unknown treasury states and rejects unsupported flavors", async () => {
    const client = createClient({
      reads: {
        [readKey(GOAL_TREASURY, "state")]: 99,
        [readKey(GOAL_TREASURY, "lifecycleStatus")]: [
          99,
          true,
          false,
          false,
          false,
          false,
          false,
          false,
          0n,
          0n,
          0n,
          0n,
          0n,
          0n,
        ],
        [readKey(GOAL_TREASURY, "superToken")]: SUPER_TOKEN,
        [readKey(SUPER_TOKEN, "getUnderlyingToken")]: UNDERLYING,
        [readKey(BUDGET_TREASURY, "state")]: 99,
        [readKey(BUDGET_TREASURY, "lifecycleStatus")]: [
          99,
          true,
          false,
          false,
          false,
          false,
          false,
          false,
          0n,
          0n,
          0n,
          0n,
          0n,
          0n,
          0n,
          0n,
          0n,
        ],
        [readKey(BUDGET_TREASURY, "superToken")]: SUPER_TOKEN,
      },
    });

    const goal = await readGoalDonationPreflight({
      client,
      goalTreasuryAddress: GOAL_TREASURY,
    });
    const budget = await readBudgetDonationPreflight({
      client,
      budgetTreasuryAddress: BUDGET_TREASURY,
    });

    expect(goal.stateLabel).toBeNull();
    expect(goal.approval).toBeNull();
    expect(budget.stateLabel).toBeNull();

    await expect(
      readTcrSubmissionPreflight({
        client,
        registryAddress: REGISTRY,
        flavor: "bad-flavor",
      })
    ).rejects.toThrow("unsupported TCR flavor");
    await expect(
      readFlowAllocationPreflight({
        client,
        flowAddress: FLOW,
        strategyAddress: STRATEGY,
        accountAddress: USER,
        strategyKind: "bad-kind",
      })
    ).rejects.toThrow("unsupported allocation strategy kind");
  });

  it("serializes bigint-heavy preflight payloads", () => {
    expect(
      serializeProtocolParticipantPreflight({
        count: 1n,
        nested: {
          amount: 2n,
          list: [3n],
        },
      })
    ).toEqual({
      count: "1",
      nested: {
        amount: "2",
        list: ["3"],
      },
    });
  });
});
