import { erc20Abi, isHex, type Abi, type PublicClient } from "viem";
import { BASE_CHAIN_ID } from "./chains.js";
import type { EvmAddress, HexBytes, HexBytes32 } from "./evm.js";
import {
  normalizeBytes32,
  normalizeEvmAddress,
  normalizeHexByteString,
} from "./evm.js";
import {
  allocationMechanismTcrAbi,
  budgetFlowRouterStrategyAbi,
  budgetStakeLedgerAbi,
  budgetTcrAbi,
  budgetTreasuryAbi,
  erc20VotesArbitratorAbi,
  flowAbi,
  goalFlowAllocationLedgerPipelineAbi,
  goalStakeVaultAbi,
  goalTreasuryAbi,
  premiumEscrowAbi,
  roundPrizeVaultAbi,
  roundSubmissionTcrAbi,
} from "./protocol-abis.js";
import {
  ARBITRABLE_PARTY,
  ARBITRATOR_DISPUTE_STATUS,
  TCR_ITEM_STATUS,
  TCR_REQUEST_PHASE,
  getTcrRequiredApprovalAmount,
  type ArbitratorDisputeStatus,
  type GeneralizedTcrTotalCosts,
  type TcrItemStatus,
  type TcrRequestPhase,
} from "./protocol-governance.js";
import {
  normalizeOptionalProtocolBigInt,
  normalizeProtocolBigInt,
  serializeProtocolBigInts,
  type BigintLike,
} from "./protocol-plans.js";

const generalizedTcrReadAbi = budgetTcrAbi as Abi;
const arbitratorReadAbi = erc20VotesArbitratorAbi as Abi;
const stakeStrategyReadAbi = goalStakeVaultAbi as Abi;
const flowReadAbi = flowAbi as Abi;
const flowPipelineReadAbi = goalFlowAllocationLedgerPipelineAbi as Abi;
const routerStrategyReadAbi = budgetFlowRouterStrategyAbi as Abi;

const zeroAddress = "0x0000000000000000000000000000000000000000" as const;
const zeroBytes32 =
  "0x0000000000000000000000000000000000000000000000000000000000000000" as const;
const flowAllocationPpmScale = 1_000_000n;

const superTokenReadAbi = [
  {
    type: "function",
    inputs: [],
    name: "getUnderlyingToken",
    outputs: [{ name: "", internalType: "address", type: "address" }],
    stateMutability: "view",
  },
] as const;

export type ProtocolParticipantReadClient = Pick<
  PublicClient,
  "getBlock" | "getLogs" | "readContract"
>;

export type ProtocolPreflightBase = {
  network: "base";
  chainId: typeof BASE_CHAIN_ID;
};

export const PROTOCOL_TCR_FLAVORS = [
  "budget",
  "allocation-mechanism",
  "round-submission",
] as const;

export type ProtocolTcrFlavor = (typeof PROTOCOL_TCR_FLAVORS)[number];

export const PROTOCOL_ARBITRATOR_ROUND_STATES = {
  pending: 0,
  active: 1,
  reveal: 2,
  solved: 3,
} as const;

export type ProtocolArbitratorRoundState =
  (typeof PROTOCOL_ARBITRATOR_ROUND_STATES)[keyof typeof PROTOCOL_ARBITRATOR_ROUND_STATES];

export const GOAL_STATE_LABELS = [
  "funding",
  "active",
  "succeeded",
  "expired",
] as const;

export type GoalStateLabel = (typeof GOAL_STATE_LABELS)[number];

export const BUDGET_STATE_LABELS = [
  "funding",
  "active",
  "succeeded",
  "failed",
  "expired",
] as const;

export type BudgetStateLabel = (typeof BUDGET_STATE_LABELS)[number];

export const PROTOCOL_ALLOCATION_STRATEGY_KINDS = [
  "common",
  "budget-flow-router",
] as const;

export type ProtocolAllocationStrategyKind =
  (typeof PROTOCOL_ALLOCATION_STRATEGY_KINDS)[number];

export type ProtocolTokenAllowanceHint = {
  tokenAddress: EvmAddress;
  spenderAddress: EvmAddress;
  ownerAddress: EvmAddress | null;
  requiredAmount: bigint | null;
  balance: bigint | null;
  allowance: bigint | null;
  requiresApproval: boolean | null;
  insufficientBalance: boolean | null;
  allowanceShortfall: bigint | null;
  balanceShortfall: bigint | null;
};

export type TcrSubmissionPreflight = ProtocolPreflightBase & {
  family: "tcr-submission";
  flavor: ProtocolTcrFlavor;
  registryAddress: EvmAddress;
  depositTokenAddress: EvmAddress;
  totalCosts: GeneralizedTcrTotalCosts;
  addItem: {
    requiredAmount: bigint;
    approval: ProtocolTokenAllowanceHint | null;
  };
  roundSubmissionContext: {
    startAt: bigint;
    endAt: bigint;
    prizeVaultAddress: EvmAddress;
    currentTimestamp: bigint;
    roundOpen: boolean;
  } | null;
};

export type TcrRequestRoundPreflight = {
  roundIndex: bigint;
  amountPaid: readonly [bigint, bigint, bigint];
  hasPaid: readonly [boolean, boolean, boolean];
  feeRewards: bigint;
  actorContributions: readonly [bigint, bigint, bigint] | null;
};

export type TcrRequestPreflight = ProtocolPreflightBase & {
  family: "tcr-request";
  flavor: ProtocolTcrFlavor;
  registryAddress: EvmAddress;
  itemId: HexBytes32;
  itemStatus: TcrItemStatus;
  itemStatusLabel: string | null;
  itemData: HexBytes;
  numberOfRequests: bigint;
  depositTokenAddress: EvmAddress;
  submissionDeposit: bigint;
  totalCosts: GeneralizedTcrTotalCosts;
  removeItem: {
    canRemove: boolean;
    requiredAmount: bigint;
    approval: ProtocolTokenAllowanceHint | null;
  };
  request: {
    requestIndex: bigint;
    requestType: TcrItemStatus;
    requestTypeLabel: string | null;
    phase: TcrRequestPhase;
    phaseLabel: string | null;
    arbitratorStatus: ArbitratorDisputeStatus;
    arbitratorStatusLabel: string | null;
    canChallenge: boolean;
    canExecuteRequest: boolean;
    canExecuteTimeout: boolean;
    canSubmitEvidence: boolean;
    canWithdrawFeesAndRewards: boolean | null;
    challengeDeadline: bigint;
    timeoutAt: bigint;
    disputed: boolean;
    resolved: boolean;
    submissionTime: bigint;
    disputeId: bigint;
    requesterAddress: EvmAddress | null;
    challengerAddress: EvmAddress | null;
    ruling: number;
    rulingLabel: string | null;
    arbitratorAddress: EvmAddress;
    arbitratorExtraData: HexBytes;
    metaEvidenceId: bigint;
    challengePeriodDuration: bigint;
    disputeTimeout: bigint;
    arbitrationCost: bigint;
    challengeBaseDeposit: bigint;
    challengeRequiredAmount: bigint;
    challengeApproval: ProtocolTokenAllowanceHint | null;
    currentRound: TcrRequestRoundPreflight | null;
  } | null;
  allocationMechanismContext: {
    activationQueued: boolean;
    removalQueued: boolean;
  } | null;
  roundSubmissionContext: {
    startAt: bigint;
    endAt: bigint;
    prizeVaultAddress: EvmAddress;
  } | null;
};

export type ArbitratorVotePreflight = ProtocolPreflightBase & {
  family: "arbitrator";
  arbitratorAddress: EvmAddress;
  disputeId: bigint;
  disputeStatus: ArbitratorDisputeStatus;
  disputeStatusLabel: string | null;
  currentRound: bigint;
  currentRoundState: ProtocolArbitratorRoundState;
  currentRoundStateLabel: string | null;
  currentRuling: number;
  currentRulingLabel: string | null;
  executed: boolean;
  votingTokenAddress: EvmAddress;
  stakeVaultAddress: EvmAddress;
  invalidRoundRewardsSinkAddress: EvmAddress;
  roundInfo: {
    votingStartTime: bigint;
    votingEndTime: bigint;
    revealPeriodStartTime: bigint;
    revealPeriodEndTime: bigint;
    creationBlock: bigint;
    cost: bigint;
    totalVotes: bigint;
    requesterVotes: bigint;
    challengerVotes: bigint;
    ruling: number;
    rulingLabel: string | null;
  };
  canExecuteRuling: boolean;
  voter: {
    accountAddress: EvmAddress;
    votingPower: bigint;
    canVoteInRound: boolean;
    hasCommitted: boolean;
    hasRevealed: boolean;
    commitHash: HexBytes32;
    choice: bigint;
    votes: bigint;
    rewardsClaimed: boolean;
    slashedOrProcessed: boolean;
    claimableReward: bigint;
    claimableGoalSlashReward: bigint;
    claimableCobuildSlashReward: bigint;
    canCommit: boolean;
    canReveal: boolean;
    canWithdrawReward: boolean;
    canWithdrawSlashRewards: boolean;
  } | null;
};

export type StakeVaultParticipantPreflight = ProtocolPreflightBase & {
  family: "stake-vault";
  stakeVaultAddress: EvmAddress;
  goalTreasuryAddress: EvmAddress;
  budgetStakeLedgerAddress: EvmAddress;
  goalTokenAddress: EvmAddress;
  cobuildTokenAddress: EvmAddress;
  accountAddress: EvmAddress;
  goalResolved: boolean;
  goalResolvedAt: bigint;
  jurorExitDelay: bigint;
  position: {
    stakedGoal: bigint;
    stakedCobuild: bigint;
    totalWeight: bigint;
    jurorWeight: bigint;
    jurorLockedGoal: bigint;
    delegateAddress: EvmAddress | null;
  };
  underwriterWithdrawal: {
    registeredBudgetCount: bigint;
    prepareCursor: bigint;
    preparedBudgetCount: bigint;
    preparedForResolvedAt: bigint;
    preparedComplete: boolean;
    withdrawalBlocked: boolean;
    blockedReason: string | null;
  };
  goalDeposit: {
    amount: bigint | null;
    approval: ProtocolTokenAllowanceHint | null;
    quotedWeightOut: bigint | null;
    snapshotGoalWeight: bigint | null;
    weightScale: bigint | null;
    canDeposit: boolean;
  };
  cobuildDeposit: {
    amount: bigint | null;
    approval: ProtocolTokenAllowanceHint | null;
    canDeposit: boolean;
  };
  goalWithdrawal: {
    amount: bigint | null;
    withdrawableAmount: bigint;
    canWithdraw: boolean;
    blockedReason: string | null;
  };
  cobuildWithdrawal: {
    amount: bigint | null;
    withdrawableAmount: bigint;
    canWithdraw: boolean;
    blockedReason: string | null;
  };
  juror: {
    lockAmount: bigint | null;
    exitAmount: bigint | null;
    canOptIn: boolean;
    canRequestExit: boolean;
    canFinalizeExit: boolean;
    delegateAddress: EvmAddress | null;
    delegateUpdateRequired: boolean | null;
    operatorAuthorized: boolean | null;
    exitRequest: {
      goalAmount: bigint;
      requestedAt: bigint;
      availableAt: bigint;
      ready: boolean;
    } | null;
  };
};

export type PremiumEscrowPreflight = ProtocolPreflightBase & {
  family: "premium-escrow";
  premiumEscrowAddress: EvmAddress;
  accountAddress: EvmAddress;
  budgetTreasuryAddress: EvmAddress;
  goalFlowAddress: EvmAddress;
  premiumTokenAddress: EvmAddress;
  claimable: bigint;
  userCoverage: bigint;
  totalCoverage: bigint;
  exposureIntegral: bigint;
  premiumIndex: bigint;
  creditIndex: bigint;
  closed: boolean;
  finalState: number;
  finalStateLabel: BudgetStateLabel | null;
  isSlashable: boolean;
  canCheckpoint: boolean;
  canClaim: boolean;
};

export type RoundPrizeVaultPreflight = ProtocolPreflightBase & {
  family: "round-prize-vault";
  roundPrizeVaultAddress: EvmAddress;
  submissionId: HexBytes32;
  accountAddress: EvmAddress | null;
  payoutRecipientAddress: EvmAddress | null;
  submissionsTcrAddress: EvmAddress;
  operatorAddress: EvmAddress;
  superTokenAddress: EvmAddress;
  underlyingTokenAddress: EvmAddress;
  entitlement: bigint;
  claimed: bigint;
  claimable: bigint;
  canClaim: boolean;
};

export type GoalDonationPreflight = ProtocolPreflightBase & {
  family: "goal-donation";
  goalTreasuryAddress: EvmAddress;
  accountAddress: EvmAddress | null;
  state: number;
  stateLabel: GoalStateLabel | null;
  lifecycleStatus: {
    isResolved: boolean;
    canAcceptHookFunding: boolean;
    isMintingOpen: boolean;
    isMinRaiseReached: boolean;
    isMinRaiseWindowElapsed: boolean;
    isDeadlinePassed: boolean;
    hasPendingSuccessAssertion: boolean;
    treasuryBalance: bigint;
    minRaise: bigint;
    minRaiseDeadline: bigint;
    deadline: bigint;
    timeRemaining: bigint;
    targetFlowRate: bigint;
  };
  superTokenAddress: EvmAddress;
  underlyingTokenAddress: EvmAddress;
  amount: bigint | null;
  approval: ProtocolTokenAllowanceHint | null;
  canDonate: boolean;
  blockedReason: string | null;
};

export type BudgetDonationPreflight = ProtocolPreflightBase & {
  family: "budget-donation";
  budgetTreasuryAddress: EvmAddress;
  accountAddress: EvmAddress | null;
  state: number;
  stateLabel: BudgetStateLabel | null;
  lifecycleStatus: {
    isResolved: boolean;
    canAcceptFunding: boolean;
    isSuccessResolutionDisabled: boolean;
    isFundingWindowEnded: boolean;
    hasDeadline: boolean;
    isDeadlinePassed: boolean;
    hasPendingSuccessAssertion: boolean;
    treasuryBalance: bigint;
    activationThreshold: bigint;
    runwayCap: bigint;
    fundingDeadline: bigint;
    executionDuration: bigint;
    deadline: bigint;
    activatedAt: bigint;
    timeRemaining: bigint;
    targetFlowRate: bigint;
  };
  superTokenAddress: EvmAddress;
  underlyingTokenAddress: EvmAddress;
  amount: bigint | null;
  approval: ProtocolTokenAllowanceHint | null;
  canDonate: boolean;
  blockedReason: string | null;
};

export type FlowAllocationInput = {
  recipientId: string;
  allocationPpm: BigintLike;
};

export type FlowAllocation = {
  recipientId: HexBytes32;
  allocationPpm: number;
};

export type FlowChildSyncDebt = {
  budgetTreasuryAddress: EvmAddress;
  exists: boolean;
  childFlowAddress: EvmAddress | null;
  childStrategyAddress: EvmAddress | null;
  allocationKey: bigint;
  reason: HexBytes32;
  budgetInfo: {
    isTracked: boolean;
    removedAt: bigint;
    activatedAt: bigint;
    resolvedOrRemovedAt: bigint;
  } | null;
  budgetCheckpoint: {
    totalAllocatedStake: bigint;
    lastCheckpoint: bigint;
  } | null;
  userAllocatedStake: bigint | null;
};

export type FlowChildSyncRequirement = {
  budgetTreasuryAddress: EvmAddress;
  childFlowAddress: EvmAddress;
  childStrategyAddress: EvmAddress;
  allocationKey: bigint;
  expectedCommit: HexBytes32;
};

export type FlowAllocationPreflight = ProtocolPreflightBase & {
  family: "flow-allocation";
  flowAddress: EvmAddress;
  pipelineAddress: EvmAddress;
  strategyAddress: EvmAddress;
  strategyKind: ProtocolAllocationStrategyKind;
  accountAddress: EvmAddress;
  allocationKey: bigint;
  existingCommitment: HexBytes32;
  hasExistingCommitment: boolean;
  childFlowAddresses: readonly EvmAddress[];
  claimableBalance: bigint;
  canAccountAllocate: boolean;
  canAllocate: boolean;
  accountAllocationWeight: bigint;
  currentWeight: bigint;
  routerContext: {
    budgetStakeLedgerAddress: EvmAddress;
    canAccountAllocateForFlow: boolean;
    accountAllocationWeightForFlow: bigint;
    currentWeightForFlow: bigint;
    recipientId: HexBytes32;
    recipientRegistered: boolean;
  } | null;
  childSyncDebtCount: bigint;
  childSyncDebts: readonly FlowChildSyncDebt[];
  preview: {
    previousWeight: bigint;
    previousAllocations: readonly FlowAllocation[];
    nextAllocations: readonly FlowAllocation[];
    childSyncRequirements: readonly FlowChildSyncRequirement[];
  } | null;
};

type TcrCostsTuple = readonly [bigint, bigint, bigint, bigint, bigint];
type TcrItemInfoTuple = readonly [HexBytes, number, bigint];
type TcrLatestRequestTuple = readonly [boolean, bigint];
type TcrRequestInfoTuple = readonly [
  boolean,
  bigint,
  bigint,
  boolean,
  readonly [string, string, string],
  bigint,
  number,
  string,
  HexBytes,
  bigint,
];
type TcrRequestSnapshotTuple = readonly [number, bigint, bigint, bigint, bigint];
type TcrRequestStateTuple = readonly [number, bigint, bigint, number, boolean, boolean, boolean];
type TcrRoundInfoTuple = readonly [
  readonly [bigint, bigint, bigint],
  readonly [boolean, boolean, boolean],
  bigint,
];
type ArbitratorDisputeTuple = readonly [bigint, string, boolean, bigint, bigint, bigint];
type ArbitratorRoundInfoTuple = readonly [
  number,
  bigint,
  bigint,
  bigint,
  bigint,
  bigint,
  bigint,
  bigint,
  bigint,
  bigint,
  number,
];
type ArbitratorVoterStatusTuple = readonly [
  boolean,
  boolean,
  HexBytes32,
  bigint,
  bigint,
  boolean,
  boolean,
  bigint,
  bigint,
  bigint,
];
type VotingPowerTuple = readonly [bigint, boolean];
type GoalToCobuildQuoteTuple = readonly [bigint, bigint, bigint];
type GoalLifecycleStatusTuple = readonly [
  number,
  boolean,
  boolean,
  boolean,
  boolean,
  boolean,
  boolean,
  boolean,
  bigint,
  bigint,
  bigint,
  bigint,
  bigint,
  bigint,
];
type BudgetLifecycleStatusTuple = readonly [
  number,
  boolean,
  boolean,
  boolean,
  boolean,
  boolean,
  boolean,
  boolean,
  bigint,
  bigint,
  bigint,
  bigint,
  bigint,
  bigint,
  bigint,
  bigint,
  bigint,
];
type FlowChildSyncDebtTuple = readonly [boolean, string, string, bigint, HexBytes32];
type FlowChildSyncRequirementTuple = readonly [string, string, string, bigint, HexBytes32];
type BudgetInfoTuple = readonly [boolean, bigint, bigint, bigint];
type BudgetCheckpointTuple = readonly [bigint, bigint];
type TcrRegistryContext = {
  depositTokenAddress: EvmAddress;
  totalCosts: GeneralizedTcrTotalCosts;
};
type TcrRoundSubmissionContext = {
  startAt: bigint;
  endAt: bigint;
  prizeVaultAddress: EvmAddress;
  currentTimestamp?: bigint;
  roundOpen?: boolean;
};

function buildBase(): ProtocolPreflightBase {
  return {
    network: "base",
    chainId: BASE_CHAIN_ID,
  };
}

function goalStateLabel(state: number): GoalStateLabel | null {
  return state >= 0 && state < GOAL_STATE_LABELS.length
    ? GOAL_STATE_LABELS[state] ?? null
    : null;
}

function budgetStateLabel(state: number): BudgetStateLabel | null {
  return state >= 0 && state < BUDGET_STATE_LABELS.length
    ? BUDGET_STATE_LABELS[state] ?? null
    : null;
}

function tcrItemStatusLabel(status: number): string | null {
  switch (status) {
    case TCR_ITEM_STATUS.absent:
      return "absent";
    case TCR_ITEM_STATUS.registered:
      return "registered";
    case TCR_ITEM_STATUS.registrationRequested:
      return "registration-requested";
    case TCR_ITEM_STATUS.clearingRequested:
      return "clearing-requested";
    default:
      return null;
  }
}

function tcrRequestPhaseLabel(phase: number): string | null {
  switch (phase) {
    case TCR_REQUEST_PHASE.none:
      return "none";
    case TCR_REQUEST_PHASE.challengePeriod:
      return "challenge-period";
    case TCR_REQUEST_PHASE.unchallengedExecutable:
      return "unchallenged-executable";
    case TCR_REQUEST_PHASE.disputePending:
      return "dispute-pending";
    case TCR_REQUEST_PHASE.disputeSolvedAwaitingExecution:
      return "dispute-solved-awaiting-execution";
    case TCR_REQUEST_PHASE.resolved:
      return "resolved";
    default:
      return null;
  }
}

function arbitratorStatusLabel(status: number): string | null {
  switch (status) {
    case ARBITRATOR_DISPUTE_STATUS.waiting:
      return "waiting";
    case ARBITRATOR_DISPUTE_STATUS.solved:
      return "solved";
    default:
      return null;
  }
}

function arbitratorRoundStateLabel(state: number): string | null {
  switch (state) {
    case PROTOCOL_ARBITRATOR_ROUND_STATES.pending:
      return "pending";
    case PROTOCOL_ARBITRATOR_ROUND_STATES.active:
      return "active";
    case PROTOCOL_ARBITRATOR_ROUND_STATES.reveal:
      return "reveal";
    case PROTOCOL_ARBITRATOR_ROUND_STATES.solved:
      return "solved";
    default:
      return null;
  }
}

function arbitrablePartyLabel(value: number): string | null {
  switch (value) {
    case ARBITRABLE_PARTY.none:
      return "none";
    case ARBITRABLE_PARTY.requester:
      return "requester";
    case ARBITRABLE_PARTY.challenger:
      return "challenger";
    default:
      return null;
  }
}

function normalizeTcrFlavor(value?: string): ProtocolTcrFlavor {
  const normalized = (value ?? "budget").trim().toLowerCase();
  if (
    normalized !== "budget" &&
    normalized !== "allocation-mechanism" &&
    normalized !== "round-submission"
  ) {
    throw new Error(`unsupported TCR flavor: ${value}`);
  }
  return normalized;
}

function normalizeStrategyKind(value?: string): ProtocolAllocationStrategyKind {
  const normalized = (value ?? "common").trim().toLowerCase();
  if (normalized !== "common" && normalized !== "budget-flow-router") {
    throw new Error(`unsupported allocation strategy kind: ${value}`);
  }
  return normalized as ProtocolAllocationStrategyKind;
}

function normalizeOptionalAccountAddress(value?: string | null): EvmAddress | null {
  return value ? normalizeEvmAddress(value, "accountAddress") : null;
}

function normalizeNullableAmount(
  value: BigintLike | null | undefined,
  label: string
): bigint | null {
  return normalizeOptionalProtocolBigInt(value, label) ?? null;
}

function normalizeCallBytes(value: string | undefined, label: string): HexBytes {
  const normalized = (value ?? "0x").trim().toLowerCase();
  if (!isHex(normalized)) {
    throw new Error(`${label} must be valid hex bytes with 0x prefix.`);
  }
  return normalized as HexBytes;
}

function toTcrCosts(value: TcrCostsTuple): GeneralizedTcrTotalCosts {
  return {
    addItemCost: value[0],
    removeItemCost: value[1],
    challengeSubmissionCost: value[2],
    challengeRemovalCost: value[3],
    arbitrationCost: value[4],
  };
}

async function readTcrRegistryContext(params: {
  client: ProtocolParticipantReadClient;
  registryAddress: EvmAddress;
}): Promise<TcrRegistryContext> {
  const [depositTokenAddressRaw, totalCostsTuple] = await Promise.all([
    params.client.readContract({
      address: params.registryAddress,
      abi: generalizedTcrReadAbi,
      functionName: "erc20",
    }) as Promise<string>,
    params.client.readContract({
      address: params.registryAddress,
      abi: generalizedTcrReadAbi,
      functionName: "getTotalCosts",
    }) as Promise<TcrCostsTuple>,
  ]);

  return {
    depositTokenAddress: normalizeEvmAddress(depositTokenAddressRaw, "depositTokenAddress"),
    totalCosts: toTcrCosts(totalCostsTuple),
  };
}

async function readTcrRoundSubmissionContext(params: {
  client: ProtocolParticipantReadClient;
  registryAddress: EvmAddress;
  includeCurrentTimestamp?: boolean;
}): Promise<TcrRoundSubmissionContext> {
  const [startAt, endAt, prizeVaultAddressRaw, currentTimestamp] = await Promise.all([
    params.client.readContract({
      address: params.registryAddress,
      abi: roundSubmissionTcrAbi,
      functionName: "startAt",
    }) as Promise<bigint>,
    params.client.readContract({
      address: params.registryAddress,
      abi: roundSubmissionTcrAbi,
      functionName: "endAt",
    }) as Promise<bigint>,
    params.client.readContract({
      address: params.registryAddress,
      abi: roundSubmissionTcrAbi,
      functionName: "prizeVault",
    }) as Promise<string>,
    params.includeCurrentTimestamp
      ? readCurrentTimestamp(params.client)
      : Promise.resolve(undefined),
  ]);

  return {
    startAt,
    endAt,
    prizeVaultAddress: normalizeEvmAddress(prizeVaultAddressRaw, "prizeVaultAddress"),
    ...(currentTimestamp === undefined
      ? {}
      : {
          currentTimestamp,
          roundOpen: currentTimestamp >= startAt && currentTimestamp < endAt,
        }),
  };
}

async function readTcrRoundSubmissionStatusContext(params: {
  client: ProtocolParticipantReadClient;
  registryAddress: EvmAddress;
}): Promise<NonNullable<TcrSubmissionPreflight["roundSubmissionContext"]>> {
  const context = await readTcrRoundSubmissionContext({
    ...params,
    includeCurrentTimestamp: true,
  });
  const { currentTimestamp, roundOpen, ...baseContext } = context;
  if (currentTimestamp === undefined || roundOpen === undefined) {
    throw new Error("Round submission status context is incomplete.");
  }
  return {
    ...baseContext,
    currentTimestamp,
    roundOpen,
  };
}

function normalizeLogAddress(value: string | undefined): EvmAddress | null {
  if (!value || value === zeroAddress) {
    return null;
  }
  return normalizeEvmAddress(value, "logAddress");
}

async function readAllowanceHint(params: {
  client: ProtocolParticipantReadClient;
  tokenAddress: string;
  spenderAddress: string;
  ownerAddress?: string | null;
  requiredAmount?: bigint | null;
}): Promise<ProtocolTokenAllowanceHint | null> {
  if (!params.ownerAddress) {
    return null;
  }

  const tokenAddress = normalizeEvmAddress(params.tokenAddress, "tokenAddress");
  const spenderAddress = normalizeEvmAddress(params.spenderAddress, "spenderAddress");
  const ownerAddress = normalizeEvmAddress(params.ownerAddress, "ownerAddress");
  const requiredAmount = params.requiredAmount ?? null;

  const [balance, allowance] = await Promise.all([
    params.client.readContract({
      address: tokenAddress,
      abi: erc20Abi,
      functionName: "balanceOf",
      args: [ownerAddress],
    }) as Promise<bigint>,
    params.client.readContract({
      address: tokenAddress,
      abi: erc20Abi,
      functionName: "allowance",
      args: [ownerAddress, spenderAddress],
    }) as Promise<bigint>,
  ]);

  const requiresApproval =
    requiredAmount === null ? null : allowance < requiredAmount;
  const insufficientBalance =
    requiredAmount === null ? null : balance < requiredAmount;

  return {
    tokenAddress,
    spenderAddress,
    ownerAddress,
    requiredAmount,
    balance,
    allowance,
    requiresApproval,
    insufficientBalance,
    allowanceShortfall:
      requiredAmount === null
        ? null
        : allowance >= requiredAmount
          ? 0n
          : requiredAmount - allowance,
    balanceShortfall:
      requiredAmount === null
        ? null
        : balance >= requiredAmount
          ? 0n
          : requiredAmount - balance,
  };
}

async function readUnderlyingTokenAddress(
  client: ProtocolParticipantReadClient,
  superTokenAddress: string
): Promise<EvmAddress> {
  return normalizeEvmAddress(
    (await client.readContract({
      address: normalizeEvmAddress(superTokenAddress, "superTokenAddress"),
      abi: superTokenReadAbi,
      functionName: "getUnderlyingToken",
    })) as string,
    "underlyingTokenAddress"
  );
}

async function readDonationPreflightContext<TLifecycle extends readonly unknown[]>(params: {
  client: ProtocolParticipantReadClient;
  treasuryAddress: string;
  treasuryLabel: "goalTreasuryAddress" | "budgetTreasuryAddress";
  treasuryAbi: Abi;
  accountAddress?: string | null;
  amount?: BigintLike | null;
}): Promise<{
  treasuryAddress: EvmAddress;
  accountAddress: EvmAddress | null;
  amount: bigint | null;
  state: number;
  lifecycleStatus: TLifecycle;
  superTokenAddress: EvmAddress;
  underlyingTokenAddress: EvmAddress;
  approval: ProtocolTokenAllowanceHint | null;
}> {
  const treasuryAddress = normalizeEvmAddress(params.treasuryAddress, params.treasuryLabel);
  const accountAddress = normalizeOptionalAccountAddress(params.accountAddress);
  const amount = normalizeOptionalProtocolBigInt(params.amount, "amount");

  const [state, lifecycleStatus, superTokenAddressRaw] = await Promise.all([
    params.client.readContract({
      address: treasuryAddress,
      abi: params.treasuryAbi,
      functionName: "state",
    }) as Promise<number>,
    params.client.readContract({
      address: treasuryAddress,
      abi: params.treasuryAbi,
      functionName: "lifecycleStatus",
    }) as unknown as Promise<TLifecycle>,
    params.client.readContract({
      address: treasuryAddress,
      abi: params.treasuryAbi,
      functionName: "superToken",
    }) as Promise<string>,
  ]);

  const superTokenAddress = normalizeEvmAddress(superTokenAddressRaw, "superTokenAddress");
  const underlyingTokenAddress = await readUnderlyingTokenAddress(
    params.client,
    superTokenAddress
  );
  const approval = await readAllowanceHint({
    client: params.client,
    tokenAddress: underlyingTokenAddress,
    spenderAddress: treasuryAddress,
    ownerAddress: accountAddress,
    requiredAmount: amount,
  });

  return {
    treasuryAddress,
    accountAddress,
    amount,
    state,
    lifecycleStatus,
    superTokenAddress,
    underlyingTokenAddress,
    approval,
  };
}

function donationBlockedReason(params: {
  canDonate: boolean;
  isResolved: boolean;
  resolvedReason: string;
  unavailableReason: string;
}): string | null {
  if (params.canDonate) {
    return null;
  }
  return params.isResolved ? params.resolvedReason : params.unavailableReason;
}

async function readCurrentTimestamp(client: ProtocolParticipantReadClient): Promise<bigint> {
  const block = await client.getBlock();
  return BigInt(block.timestamp);
}

function latestLog<T>(logs: readonly T[]): T | null {
  return logs.length === 0 ? null : (logs[logs.length - 1] ?? null);
}

function compareLogPosition(
  left: { blockNumber?: bigint | null; logIndex?: number | null },
  right: { blockNumber?: bigint | null; logIndex?: number | null }
): number {
  const leftBlock = left.blockNumber ?? 0n;
  const rightBlock = right.blockNumber ?? 0n;
  if (leftBlock < rightBlock) {
    return -1;
  }
  if (leftBlock > rightBlock) {
    return 1;
  }

  const leftIndex = left.logIndex ?? -1;
  const rightIndex = right.logIndex ?? -1;
  if (leftIndex < rightIndex) {
    return -1;
  }
  if (leftIndex > rightIndex) {
    return 1;
  }
  return 0;
}

function normalizeFlowAllocations(
  values: readonly FlowAllocationInput[],
  label: string
): FlowAllocation[] {
  let sum = 0n;
  const normalized = values.map((value, index) => {
    const allocationPpm = normalizeProtocolBigInt(
      value.allocationPpm,
      `${label}[${index}].allocationPpm`
    );
    if (allocationPpm <= 0n) {
      throw new Error(`${label}[${index}].allocationPpm must be greater than zero.`);
    }
    if (allocationPpm > flowAllocationPpmScale) {
      throw new Error(
        `${label}[${index}].allocationPpm must not exceed ${flowAllocationPpmScale.toString()}.`
      );
    }
    sum += allocationPpm;
    return {
      recipientId: normalizeBytes32(value.recipientId, `${label}[${index}].recipientId`),
      allocationPpm: Number(allocationPpm),
    };
  });

  if (normalized.length > 0 && sum !== flowAllocationPpmScale) {
    throw new Error(
      `${label} must sum to ${flowAllocationPpmScale.toString()} allocation ppm.`
    );
  }

  return normalized;
}

function normalizeBudgetTreasuryAddresses(
  values: readonly string[] | undefined
): readonly EvmAddress[] {
  return (values ?? []).map((value, index) =>
    normalizeEvmAddress(value, `budgetTreasuryAddresses[${index}]`)
  );
}

function computeActiveExitRequest(params: {
  requestedLog:
    | {
        blockNumber?: bigint | null;
        logIndex?: number | null;
        args?: { goalAmount?: bigint; requestedAt?: bigint };
      }
    | null;
  finalizedLog:
    | {
        blockNumber?: bigint | null;
        logIndex?: number | null;
      }
    | null;
  goalResolvedAt: bigint;
  currentTimestamp: bigint;
  jurorExitDelay: bigint;
}) {
  const requestLog = params.requestedLog;
  if (!requestLog) {
    return null;
  }

  if (
    params.finalizedLog &&
    compareLogPosition(requestLog, params.finalizedLog) <= 0
  ) {
    return null;
  }

  const requestedAt = requestLog.args?.requestedAt ?? 0n;
  if (requestedAt === 0n) {
    return null;
  }

  const goalAmount = requestLog.args?.goalAmount ?? 0n;
  const delayAnchor =
    params.goalResolvedAt > requestedAt ? params.goalResolvedAt : requestedAt;
  const availableAt = delayAnchor + params.jurorExitDelay;

  return {
    goalAmount,
    requestedAt,
    availableAt,
    ready: params.currentTimestamp >= availableAt,
  };
}

export async function readTcrSubmissionPreflight(params: {
  client: ProtocolParticipantReadClient;
  registryAddress: string;
  flavor?: ProtocolTcrFlavor | string;
  actorAddress?: string | null;
}): Promise<TcrSubmissionPreflight> {
  const flavor = normalizeTcrFlavor(params.flavor);
  const registryAddress = normalizeEvmAddress(params.registryAddress, "registryAddress");
  const actorAddress = params.actorAddress
    ? normalizeEvmAddress(params.actorAddress, "actorAddress")
    : null;

  const registryContextPromise = readTcrRegistryContext({
    client: params.client,
    registryAddress,
  });
  const roundSubmissionContextPromise =
    flavor === "round-submission"
      ? readTcrRoundSubmissionStatusContext({
          client: params.client,
          registryAddress,
        })
      : Promise.resolve(null);
  const { depositTokenAddress, totalCosts } = await registryContextPromise;

  const requiredAmount = getTcrRequiredApprovalAmount({
    action: "addItem",
    costs: totalCosts,
  });
  const [addItemApproval, roundSubmissionContext] = await Promise.all([
    readAllowanceHint({
      client: params.client,
      tokenAddress: depositTokenAddress,
      spenderAddress: registryAddress,
      ownerAddress: actorAddress,
      requiredAmount,
    }),
    roundSubmissionContextPromise,
  ]);

  return {
    ...buildBase(),
    family: "tcr-submission",
    flavor,
    registryAddress,
    depositTokenAddress,
    totalCosts,
    addItem: {
      requiredAmount,
      approval: addItemApproval,
    },
    roundSubmissionContext,
  };
}

export async function readTcrRequestPreflight(params: {
  client: ProtocolParticipantReadClient;
  registryAddress: string;
  itemId: string;
  flavor?: ProtocolTcrFlavor | string;
  actorAddress?: string | null;
}): Promise<TcrRequestPreflight> {
  const flavor = normalizeTcrFlavor(params.flavor);
  const registryAddress = normalizeEvmAddress(params.registryAddress, "registryAddress");
  const itemId = normalizeBytes32(params.itemId, "itemId");
  const actorAddress = params.actorAddress
    ? normalizeEvmAddress(params.actorAddress, "actorAddress")
    : null;

  const [{ depositTokenAddress, totalCosts }, itemInfo, latestRequest, submissionDeposit] =
    await Promise.all([
      readTcrRegistryContext({
        client: params.client,
        registryAddress,
      }),
      params.client.readContract({
        address: registryAddress,
        abi: generalizedTcrReadAbi,
        functionName: "getItemInfo",
        args: [itemId],
      }) as Promise<TcrItemInfoTuple>,
      params.client.readContract({
        address: registryAddress,
        abi: generalizedTcrReadAbi,
        functionName: "getLatestRequestIndex",
        args: [itemId],
      }) as Promise<TcrLatestRequestTuple>,
      params.client.readContract({
        address: registryAddress,
        abi: generalizedTcrReadAbi,
        functionName: "submissionDeposits",
        args: [itemId],
      }) as Promise<bigint>,
    ]);

  const itemStatus = itemInfo[1] as TcrItemStatus;
  const removeRequiredAmount = getTcrRequiredApprovalAmount({
    action: "removeItem",
    costs: totalCosts,
  });

  const requestPreflight = latestRequest[0]
    ? await (async () => {
        const requestIndex = latestRequest[1];
        const [requestInfo, requestSnapshot, requestState] = await Promise.all([
          params.client.readContract({
            address: registryAddress,
            abi: generalizedTcrReadAbi,
            functionName: "getRequestInfo",
            args: [itemId, requestIndex],
          }) as Promise<TcrRequestInfoTuple>,
          params.client.readContract({
            address: registryAddress,
            abi: generalizedTcrReadAbi,
            functionName: "getRequestSnapshot",
            args: [itemId, requestIndex],
          }) as Promise<TcrRequestSnapshotTuple>,
          params.client.readContract({
            address: registryAddress,
            abi: generalizedTcrReadAbi,
            functionName: "getRequestState",
            args: [itemId, requestIndex],
          }) as Promise<TcrRequestStateTuple>,
        ]);

        const currentRoundIndex =
          requestInfo[5] === 0n ? null : requestInfo[5] - 1n;
        const currentRound =
          currentRoundIndex === null
            ? null
            : await Promise.all([
                params.client.readContract({
                  address: registryAddress,
                  abi: generalizedTcrReadAbi,
                  functionName: "getRoundInfo",
                  args: [itemId, requestIndex, currentRoundIndex],
                }) as Promise<TcrRoundInfoTuple>,
                actorAddress
                  ? (params.client.readContract({
                      address: registryAddress,
                      abi: generalizedTcrReadAbi,
                      functionName: "getContributions",
                      args: [itemId, requestIndex, currentRoundIndex, actorAddress],
                    }) as Promise<readonly [bigint, bigint, bigint]>)
                  : Promise.resolve(null),
              ]);

        const challengeRequiredAmount = getTcrRequiredApprovalAmount({
          action: "challengeRequest",
          costs: totalCosts,
          requestType: requestSnapshot[0] as 2 | 3,
        });

        return {
          requestIndex,
          requestType: requestSnapshot[0] as TcrItemStatus,
          requestTypeLabel: tcrItemStatusLabel(requestSnapshot[0]),
          phase: requestState[0] as TcrRequestPhase,
          phaseLabel: tcrRequestPhaseLabel(requestState[0]),
          arbitratorStatus: requestState[3] as ArbitratorDisputeStatus,
          arbitratorStatusLabel: arbitratorStatusLabel(requestState[3]),
          canChallenge: requestState[4],
          canExecuteRequest: requestState[5],
          canExecuteTimeout: requestState[6],
          canSubmitEvidence: !requestInfo[3],
          canWithdrawFeesAndRewards:
            actorAddress && currentRound !== null
              ? requestInfo[3] &&
                currentRound[1] !== null &&
                (currentRound[1][0] > 0n ||
                  currentRound[1][1] > 0n ||
                  currentRound[1][2] > 0n)
              : null,
          challengeDeadline: requestState[1],
          timeoutAt: requestState[2],
          disputed: requestInfo[0],
          resolved: requestInfo[3],
          submissionTime: requestInfo[2],
          disputeId: requestInfo[1],
          requesterAddress: normalizeLogAddress(
            requestInfo[4][ARBITRABLE_PARTY.requester]
          ),
          challengerAddress: normalizeLogAddress(
            requestInfo[4][ARBITRABLE_PARTY.challenger]
          ),
          ruling: requestInfo[6],
          rulingLabel: arbitrablePartyLabel(requestInfo[6]),
          arbitratorAddress: normalizeEvmAddress(
            requestInfo[7],
            "request.arbitratorAddress"
          ),
          arbitratorExtraData: normalizeHexByteString(
            requestInfo[8],
            "request.arbitratorExtraData"
          ),
          metaEvidenceId: requestInfo[9],
          challengePeriodDuration: requestSnapshot[1],
          disputeTimeout: requestSnapshot[2],
          arbitrationCost: requestSnapshot[3],
          challengeBaseDeposit: requestSnapshot[4],
          challengeRequiredAmount,
          challengeApproval: await readAllowanceHint({
            client: params.client,
            tokenAddress: depositTokenAddress,
            spenderAddress: registryAddress,
            ownerAddress: actorAddress,
            requiredAmount: challengeRequiredAmount,
          }),
          currentRound:
            currentRound === null
              ? null
              : {
                  roundIndex: currentRoundIndex!,
                  amountPaid: currentRound[0][0],
                  hasPaid: currentRound[0][1],
                  feeRewards: currentRound[0][2],
                  actorContributions: currentRound[1],
                },
        } satisfies TcrRequestPreflight["request"];
      })()
    : null;

  const [removeApproval, allocationMechanismContext, roundSubmissionContext] = await Promise.all([
    readAllowanceHint({
      client: params.client,
      tokenAddress: depositTokenAddress,
      spenderAddress: registryAddress,
      ownerAddress: actorAddress,
      requiredAmount: removeRequiredAmount,
    }),
    flavor === "allocation-mechanism"
      ? Promise.all([
          params.client.readContract({
            address: registryAddress,
            abi: allocationMechanismTcrAbi,
            functionName: "activationQueued",
            args: [itemId],
          }) as Promise<boolean>,
          params.client.readContract({
            address: registryAddress,
            abi: allocationMechanismTcrAbi,
            functionName: "removalQueued",
            args: [itemId],
          }) as Promise<boolean>,
        ]).then(([activationQueued, removalQueued]) => ({
          activationQueued,
          removalQueued,
        }))
      : Promise.resolve(null),
    flavor === "round-submission"
      ? readTcrRoundSubmissionContext({
          client: params.client,
          registryAddress,
        })
      : Promise.resolve(null),
  ]);

  return {
    ...buildBase(),
    family: "tcr-request",
    flavor,
    registryAddress,
    itemId,
    itemStatus,
    itemStatusLabel: tcrItemStatusLabel(itemStatus),
    itemData: itemInfo[0],
    numberOfRequests: itemInfo[2],
    depositTokenAddress,
    submissionDeposit,
    totalCosts,
    removeItem: {
      canRemove: itemStatus === TCR_ITEM_STATUS.registered,
      requiredAmount: removeRequiredAmount,
      approval: removeApproval,
    },
    request: requestPreflight,
    allocationMechanismContext,
    roundSubmissionContext,
  };
}

export async function readArbitratorVotePreflight(params: {
  client: ProtocolParticipantReadClient;
  arbitratorAddress: string;
  disputeId: BigintLike;
  voterAddress?: string | null;
}): Promise<ArbitratorVotePreflight> {
  const arbitratorAddress = normalizeEvmAddress(
    params.arbitratorAddress,
    "arbitratorAddress"
  );
  const disputeId = normalizeProtocolBigInt(params.disputeId, "disputeId");
  const voterAddress = params.voterAddress
    ? normalizeEvmAddress(params.voterAddress, "voterAddress")
    : null;

  const [dispute, disputeStatusRaw, currentRuling, votingTokenAddressRaw, stakeVaultAddressRaw, invalidRoundRewardsSinkRaw] =
    await Promise.all([
      params.client.readContract({
        address: arbitratorAddress,
        abi: arbitratorReadAbi,
        functionName: "disputes",
        args: [disputeId],
      }) as Promise<ArbitratorDisputeTuple>,
      params.client.readContract({
        address: arbitratorAddress,
        abi: arbitratorReadAbi,
        functionName: "disputeStatus",
        args: [disputeId],
      }) as Promise<number>,
      params.client.readContract({
        address: arbitratorAddress,
        abi: arbitratorReadAbi,
        functionName: "currentRuling",
        args: [disputeId],
      }) as Promise<number>,
      params.client.readContract({
        address: arbitratorAddress,
        abi: arbitratorReadAbi,
        functionName: "votingToken",
      }) as Promise<string>,
      params.client.readContract({
        address: arbitratorAddress,
        abi: arbitratorReadAbi,
        functionName: "stakeVault",
      }) as Promise<string>,
      params.client.readContract({
        address: arbitratorAddress,
        abi: arbitratorReadAbi,
        functionName: "invalidRoundRewardsSink",
      }) as Promise<string>,
    ]);

  const currentRound = dispute[3];
  const roundInfo = (await params.client.readContract({
    address: arbitratorAddress,
    abi: arbitratorReadAbi,
    functionName: "getVotingRoundInfo",
    args: [disputeId, currentRound],
  })) as ArbitratorRoundInfoTuple;

  const voter =
    voterAddress === null
      ? null
      : await (async () => {
          const [votingPower, voterStatus] = await Promise.all([
            params.client.readContract({
              address: arbitratorAddress,
              abi: arbitratorReadAbi,
              functionName: "votingPowerInRound",
              args: [disputeId, currentRound, voterAddress],
            }) as Promise<VotingPowerTuple>,
            params.client.readContract({
              address: arbitratorAddress,
              abi: arbitratorReadAbi,
              functionName: "getVoterRoundStatus",
              args: [disputeId, currentRound, voterAddress],
            }) as Promise<ArbitratorVoterStatusTuple>,
          ]);

          const currentRoundState =
            roundInfo[0] as ProtocolArbitratorRoundState;

          return {
            accountAddress: voterAddress,
            votingPower: votingPower[0],
            canVoteInRound: votingPower[1],
            hasCommitted: voterStatus[0],
            hasRevealed: voterStatus[1],
            commitHash: normalizeBytes32(voterStatus[2], "voter.commitHash"),
            choice: voterStatus[3],
            votes: voterStatus[4],
            rewardsClaimed: voterStatus[5],
            slashedOrProcessed: voterStatus[6],
            claimableReward: voterStatus[7],
            claimableGoalSlashReward: voterStatus[8],
            claimableCobuildSlashReward: voterStatus[9],
            canCommit:
              currentRoundState === PROTOCOL_ARBITRATOR_ROUND_STATES.active &&
              votingPower[1] &&
              !voterStatus[0],
            canReveal:
              currentRoundState === PROTOCOL_ARBITRATOR_ROUND_STATES.reveal &&
              voterStatus[0] &&
              !voterStatus[1],
            canWithdrawReward:
              currentRoundState === PROTOCOL_ARBITRATOR_ROUND_STATES.solved &&
              !voterStatus[5] &&
              voterStatus[7] > 0n,
            canWithdrawSlashRewards:
              currentRoundState === PROTOCOL_ARBITRATOR_ROUND_STATES.solved &&
              !voterStatus[6] &&
              (voterStatus[8] > 0n || voterStatus[9] > 0n),
          };
        })();

  return {
    ...buildBase(),
    family: "arbitrator",
    arbitratorAddress,
    disputeId,
    disputeStatus: disputeStatusRaw as ArbitratorDisputeStatus,
    disputeStatusLabel: arbitratorStatusLabel(disputeStatusRaw),
    currentRound,
    currentRoundState: roundInfo[0] as ProtocolArbitratorRoundState,
    currentRoundStateLabel: arbitratorRoundStateLabel(roundInfo[0]),
    currentRuling,
    currentRulingLabel: arbitrablePartyLabel(currentRuling),
    executed: dispute[2],
    votingTokenAddress: normalizeEvmAddress(votingTokenAddressRaw, "votingTokenAddress"),
    stakeVaultAddress: normalizeEvmAddress(stakeVaultAddressRaw, "stakeVaultAddress"),
    invalidRoundRewardsSinkAddress: normalizeEvmAddress(
      invalidRoundRewardsSinkRaw,
      "invalidRoundRewardsSinkAddress"
    ),
    roundInfo: {
      votingStartTime: roundInfo[1],
      votingEndTime: roundInfo[2],
      revealPeriodStartTime: roundInfo[3],
      revealPeriodEndTime: roundInfo[4],
      creationBlock: roundInfo[5],
      cost: roundInfo[6],
      totalVotes: roundInfo[7],
      requesterVotes: roundInfo[8],
      challengerVotes: roundInfo[9],
      ruling: roundInfo[10],
      rulingLabel: arbitrablePartyLabel(roundInfo[10]),
    },
    canExecuteRuling:
      disputeStatusRaw === ARBITRATOR_DISPUTE_STATUS.solved && !dispute[2],
    voter,
  };
}

export async function readStakeVaultParticipantPreflight(params: {
  client: ProtocolParticipantReadClient;
  stakeVaultAddress: string;
  accountAddress: string;
  goalDepositAmount?: BigintLike | null;
  cobuildDepositAmount?: BigintLike | null;
  goalWithdrawalAmount?: BigintLike | null;
  cobuildWithdrawalAmount?: BigintLike | null;
  jurorLockAmount?: BigintLike | null;
  jurorExitAmount?: BigintLike | null;
  delegateAddress?: string | null;
  operatorAddress?: string | null;
}): Promise<StakeVaultParticipantPreflight> {
  const stakeVaultAddress = normalizeEvmAddress(params.stakeVaultAddress, "stakeVaultAddress");
  const accountAddress = normalizeEvmAddress(params.accountAddress, "accountAddress");
  const goalDepositAmount = normalizeNullableAmount(
    params.goalDepositAmount,
    "goalDepositAmount"
  );
  const cobuildDepositAmount = normalizeNullableAmount(
    params.cobuildDepositAmount,
    "cobuildDepositAmount"
  );
  const goalWithdrawalAmount = normalizeNullableAmount(
    params.goalWithdrawalAmount,
    "goalWithdrawalAmount"
  );
  const cobuildWithdrawalAmount = normalizeNullableAmount(
    params.cobuildWithdrawalAmount,
    "cobuildWithdrawalAmount"
  );
  const jurorLockAmount = normalizeNullableAmount(
    params.jurorLockAmount,
    "jurorLockAmount"
  );
  const jurorExitAmount = normalizeNullableAmount(
    params.jurorExitAmount,
    "jurorExitAmount"
  );
  const delegateAddress = params.delegateAddress
    ? normalizeEvmAddress(params.delegateAddress, "delegateAddress")
    : null;
  const operatorAddress = params.operatorAddress
    ? normalizeEvmAddress(params.operatorAddress, "operatorAddress")
    : null;

  const [
    goalTreasuryAddressRaw,
    goalTokenAddressRaw,
    cobuildTokenAddressRaw,
    goalResolved,
    goalResolvedAt,
    jurorExitDelay,
    stakedGoal,
    stakedCobuild,
    weight,
    jurorWeight,
    jurorLockedGoal,
    jurorDelegateRaw,
    operatorAuthorized,
  ] = await Promise.all([
    params.client.readContract({
      address: stakeVaultAddress,
      abi: goalStakeVaultAbi,
      functionName: "goalTreasury",
    }) as Promise<string>,
    params.client.readContract({
      address: stakeVaultAddress,
      abi: goalStakeVaultAbi,
      functionName: "goalToken",
    }) as Promise<string>,
    params.client.readContract({
      address: stakeVaultAddress,
      abi: goalStakeVaultAbi,
      functionName: "cobuildToken",
    }) as Promise<string>,
    params.client.readContract({
      address: stakeVaultAddress,
      abi: goalStakeVaultAbi,
      functionName: "goalResolved",
    }) as Promise<boolean>,
    params.client.readContract({
      address: stakeVaultAddress,
      abi: goalStakeVaultAbi,
      functionName: "goalResolvedAt",
    }) as Promise<bigint>,
    params.client.readContract({
      address: stakeVaultAddress,
      abi: goalStakeVaultAbi,
      functionName: "JUROR_EXIT_DELAY",
    }) as Promise<bigint>,
    params.client.readContract({
      address: stakeVaultAddress,
      abi: goalStakeVaultAbi,
      functionName: "stakedGoalOf",
      args: [accountAddress],
    }) as Promise<bigint>,
    params.client.readContract({
      address: stakeVaultAddress,
      abi: goalStakeVaultAbi,
      functionName: "stakedCobuildOf",
      args: [accountAddress],
    }) as Promise<bigint>,
    params.client.readContract({
      address: stakeVaultAddress,
      abi: goalStakeVaultAbi,
      functionName: "weightOf",
      args: [accountAddress],
    }) as Promise<bigint>,
    params.client.readContract({
      address: stakeVaultAddress,
      abi: goalStakeVaultAbi,
      functionName: "jurorWeightOf",
      args: [accountAddress],
    }) as Promise<bigint>,
    params.client.readContract({
      address: stakeVaultAddress,
      abi: goalStakeVaultAbi,
      functionName: "jurorLockedGoalOf",
      args: [accountAddress],
    }) as Promise<bigint>,
    params.client.readContract({
      address: stakeVaultAddress,
      abi: goalStakeVaultAbi,
      functionName: "jurorDelegateOf",
      args: [accountAddress],
    }) as Promise<string>,
    operatorAddress
      ? (params.client.readContract({
          address: stakeVaultAddress,
          abi: goalStakeVaultAbi,
          functionName: "isAuthorizedJurorOperator",
          args: [accountAddress, operatorAddress],
        }) as Promise<boolean>)
      : Promise.resolve(null),
  ]);

  const goalTreasuryAddress = normalizeEvmAddress(
    goalTreasuryAddressRaw,
    "goalTreasuryAddress"
  );
  const goalTokenAddress = normalizeEvmAddress(goalTokenAddressRaw, "goalTokenAddress");
  const cobuildTokenAddress = normalizeEvmAddress(
    cobuildTokenAddressRaw,
    "cobuildTokenAddress"
  );
  const delegateValue = normalizeLogAddress(jurorDelegateRaw);
  const budgetStakeLedgerAddressRaw = (await params.client.readContract({
    address: goalTreasuryAddress,
    abi: goalTreasuryAbi,
    functionName: "budgetStakeLedger",
  })) as string;
  const budgetStakeLedgerAddress = normalizeEvmAddress(
    budgetStakeLedgerAddressRaw,
    "budgetStakeLedgerAddress"
  );

  const [
    prepareCursor,
    preparedBudgetCount,
    preparedForResolvedAt,
    registeredBudgetCount,
    goalQuote,
    goalApproval,
    cobuildApproval,
    currentTimestamp,
    exitRequestLogs,
    exitFinalizeLogs,
  ] = await Promise.all([
    params.client.readContract({
      address: stakeVaultAddress,
      abi: goalStakeVaultAbi,
      functionName: "underwriterWithdrawalPrepareCursor",
      args: [accountAddress],
    }) as Promise<bigint>,
    params.client.readContract({
      address: stakeVaultAddress,
      abi: goalStakeVaultAbi,
      functionName: "underwriterWithdrawalPreparedBudgetCount",
      args: [accountAddress],
    }) as Promise<bigint>,
    params.client.readContract({
      address: stakeVaultAddress,
      abi: goalStakeVaultAbi,
      functionName: "underwriterWithdrawalPreparedForResolvedAt",
      args: [accountAddress],
    }) as Promise<bigint>,
    params.client.readContract({
      address: budgetStakeLedgerAddress,
      abi: budgetStakeLedgerAbi,
      functionName: "registeredBudgetCount",
    }) as Promise<bigint>,
    goalDepositAmount === null
      ? Promise.resolve(null)
      : (params.client.readContract({
          address: stakeVaultAddress,
          abi: goalStakeVaultAbi,
          functionName: "quoteGoalToCobuildWeightRatio",
          args: [goalDepositAmount],
        }) as Promise<GoalToCobuildQuoteTuple>),
    readAllowanceHint({
      client: params.client,
      tokenAddress: goalTokenAddress,
      spenderAddress: stakeVaultAddress,
      ownerAddress: accountAddress,
      requiredAmount: goalDepositAmount,
    }),
    readAllowanceHint({
      client: params.client,
      tokenAddress: cobuildTokenAddress,
      spenderAddress: stakeVaultAddress,
      ownerAddress: accountAddress,
      requiredAmount: cobuildDepositAmount,
    }),
    readCurrentTimestamp(params.client),
    params.client.getLogs({
      address: stakeVaultAddress,
      event: goalStakeVaultAbi.find(
        (entry) => entry.type === "event" && entry.name === "JurorExitRequested"
      ) as any,
      args: {
        juror: accountAddress,
      },
      fromBlock: 0n,
    }) as Promise<
      readonly {
        blockNumber?: bigint | null;
        logIndex?: number | null;
        args?: { goalAmount?: bigint; requestedAt?: bigint };
      }[]
    >,
    params.client.getLogs({
      address: stakeVaultAddress,
      event: goalStakeVaultAbi.find(
        (entry) => entry.type === "event" && entry.name === "JurorExitFinalized"
      ) as any,
      args: {
        juror: accountAddress,
      },
      fromBlock: 0n,
    }) as Promise<
      readonly {
        blockNumber?: bigint | null;
        logIndex?: number | null;
      }[]
    >,
  ]);
  const preparedComplete =
    goalResolved &&
    preparedForResolvedAt === goalResolvedAt &&
    prepareCursor === registeredBudgetCount &&
    preparedBudgetCount === registeredBudgetCount;
  const availableGoalWithdrawal =
    stakedGoal > jurorLockedGoal ? stakedGoal - jurorLockedGoal : 0n;

  const goalWithdrawalBlockedReason = !goalResolved
    ? "goal-not-resolved"
    : !preparedComplete
      ? "underwriter-withdrawal-not-prepared"
      : availableGoalWithdrawal === 0n
        ? "no-unlocked-goal"
        : goalWithdrawalAmount !== null && goalWithdrawalAmount > availableGoalWithdrawal
          ? "insufficient-unlocked-goal"
          : null;

  const cobuildWithdrawalBlockedReason = !goalResolved
    ? "goal-not-resolved"
    : !preparedComplete
      ? "underwriter-withdrawal-not-prepared"
      : stakedCobuild === 0n
        ? "no-cobuild-stake"
        : cobuildWithdrawalAmount !== null && cobuildWithdrawalAmount > stakedCobuild
          ? "insufficient-cobuild-stake"
          : null;

  const exitRequest = computeActiveExitRequest({
    requestedLog: latestLog(exitRequestLogs),
    finalizedLog: latestLog(exitFinalizeLogs),
    goalResolvedAt,
    currentTimestamp,
    jurorExitDelay,
  });

  return {
    ...buildBase(),
    family: "stake-vault",
    stakeVaultAddress,
    goalTreasuryAddress,
    budgetStakeLedgerAddress,
    goalTokenAddress,
    cobuildTokenAddress,
    accountAddress,
    goalResolved,
    goalResolvedAt,
    jurorExitDelay,
    position: {
      stakedGoal,
      stakedCobuild,
      totalWeight: weight,
      jurorWeight,
      jurorLockedGoal,
      delegateAddress: delegateValue,
    },
    underwriterWithdrawal: {
      registeredBudgetCount,
      prepareCursor,
      preparedBudgetCount,
      preparedForResolvedAt,
      preparedComplete,
      withdrawalBlocked: !preparedComplete,
      blockedReason: preparedComplete ? null : "underwriter-withdrawal-not-prepared",
    },
    goalDeposit: {
      amount: goalDepositAmount,
      approval: goalApproval,
      quotedWeightOut: goalQuote?.[0] ?? null,
      snapshotGoalWeight: goalQuote?.[1] ?? null,
      weightScale: goalQuote?.[2] ?? null,
      canDeposit: !goalResolved && (goalDepositAmount === null || goalDepositAmount > 0n),
    },
    cobuildDeposit: {
      amount: cobuildDepositAmount,
      approval: cobuildApproval,
      canDeposit: !goalResolved && (cobuildDepositAmount === null || cobuildDepositAmount > 0n),
    },
    goalWithdrawal: {
      amount: goalWithdrawalAmount,
      withdrawableAmount: availableGoalWithdrawal,
      canWithdraw: goalWithdrawalBlockedReason === null,
      blockedReason: goalWithdrawalBlockedReason,
    },
    cobuildWithdrawal: {
      amount: cobuildWithdrawalAmount,
      withdrawableAmount: stakedCobuild,
      canWithdraw: cobuildWithdrawalBlockedReason === null,
      blockedReason: cobuildWithdrawalBlockedReason,
    },
    juror: {
      lockAmount: jurorLockAmount,
      exitAmount: jurorExitAmount,
      canOptIn:
        !goalResolved &&
        stakedGoal > jurorLockedGoal &&
        (jurorLockAmount === null || jurorLockAmount <= stakedGoal - jurorLockedGoal),
      canRequestExit:
        jurorLockedGoal > 0n &&
        (jurorExitAmount === null || jurorExitAmount <= jurorLockedGoal),
      canFinalizeExit: exitRequest?.ready ?? false,
      delegateAddress: delegateValue,
      delegateUpdateRequired:
        delegateAddress === null ? null : delegateAddress !== delegateValue,
      operatorAuthorized,
      exitRequest,
    },
  };
}

export async function readPremiumEscrowPreflight(params: {
  client: ProtocolParticipantReadClient;
  premiumEscrowAddress: string;
  accountAddress: string;
}): Promise<PremiumEscrowPreflight> {
  const premiumEscrowAddress = normalizeEvmAddress(
    params.premiumEscrowAddress,
    "premiumEscrowAddress"
  );
  const accountAddress = normalizeEvmAddress(params.accountAddress, "accountAddress");

  const [
    budgetTreasuryAddressRaw,
    goalFlowAddressRaw,
    premiumTokenAddressRaw,
    claimable,
    userCoverage,
    totalCoverage,
    exposureIntegral,
    premiumIndex,
    creditIndex,
    closed,
    finalState,
    isSlashable,
  ] = await Promise.all([
    params.client.readContract({
      address: premiumEscrowAddress,
      abi: premiumEscrowAbi,
      functionName: "budgetTreasury",
    }) as Promise<string>,
    params.client.readContract({
      address: premiumEscrowAddress,
      abi: premiumEscrowAbi,
      functionName: "goalFlow",
    }) as Promise<string>,
    params.client.readContract({
      address: premiumEscrowAddress,
      abi: premiumEscrowAbi,
      functionName: "premiumToken",
    }) as Promise<string>,
    params.client.readContract({
      address: premiumEscrowAddress,
      abi: premiumEscrowAbi,
      functionName: "claimable",
      args: [accountAddress],
    }) as Promise<bigint>,
    params.client.readContract({
      address: premiumEscrowAddress,
      abi: premiumEscrowAbi,
      functionName: "userCov",
      args: [accountAddress],
    }) as Promise<bigint>,
    params.client.readContract({
      address: premiumEscrowAddress,
      abi: premiumEscrowAbi,
      functionName: "totalCoverage",
    }) as Promise<bigint>,
    params.client.readContract({
      address: premiumEscrowAddress,
      abi: premiumEscrowAbi,
      functionName: "exposureIntegral",
      args: [accountAddress],
    }) as Promise<bigint>,
    params.client.readContract({
      address: premiumEscrowAddress,
      abi: premiumEscrowAbi,
      functionName: "premiumIndex",
    }) as Promise<bigint>,
    params.client.readContract({
      address: premiumEscrowAddress,
      abi: premiumEscrowAbi,
      functionName: "creditIndex",
    }) as Promise<bigint>,
    params.client.readContract({
      address: premiumEscrowAddress,
      abi: premiumEscrowAbi,
      functionName: "closed",
    }) as Promise<boolean>,
    params.client.readContract({
      address: premiumEscrowAddress,
      abi: premiumEscrowAbi,
      functionName: "finalState",
    }) as Promise<number>,
    params.client.readContract({
      address: premiumEscrowAddress,
      abi: premiumEscrowAbi,
      functionName: "isSlashable",
    }) as Promise<boolean>,
  ]);

  return {
    ...buildBase(),
    family: "premium-escrow",
    premiumEscrowAddress,
    accountAddress,
    budgetTreasuryAddress: normalizeEvmAddress(
      budgetTreasuryAddressRaw,
      "budgetTreasuryAddress"
    ),
    goalFlowAddress: normalizeEvmAddress(goalFlowAddressRaw, "goalFlowAddress"),
    premiumTokenAddress: normalizeEvmAddress(
      premiumTokenAddressRaw,
      "premiumTokenAddress"
    ),
    claimable,
    userCoverage,
    totalCoverage,
    exposureIntegral,
    premiumIndex,
    creditIndex,
    closed,
    finalState,
    finalStateLabel: budgetStateLabel(finalState),
    isSlashable,
    canCheckpoint: !closed,
    canClaim: claimable > 0n,
  };
}

export async function readRoundPrizeVaultPreflight(params: {
  client: ProtocolParticipantReadClient;
  roundPrizeVaultAddress: string;
  submissionId: string;
  accountAddress?: string | null;
}): Promise<RoundPrizeVaultPreflight> {
  const roundPrizeVaultAddress = normalizeEvmAddress(
    params.roundPrizeVaultAddress,
    "roundPrizeVaultAddress"
  );
  const submissionId = normalizeBytes32(params.submissionId, "submissionId");
  const accountAddress = params.accountAddress
    ? normalizeEvmAddress(params.accountAddress, "accountAddress")
    : null;

  const [
    payoutRecipientRaw,
    submissionsTcrAddressRaw,
    operatorAddressRaw,
    superTokenAddressRaw,
    underlyingTokenAddressRaw,
    entitlement,
    claimed,
  ] = await Promise.all([
    params.client.readContract({
      address: roundPrizeVaultAddress,
      abi: roundPrizeVaultAbi,
      functionName: "payoutRecipientOf",
      args: [submissionId],
    }) as Promise<string>,
    params.client.readContract({
      address: roundPrizeVaultAddress,
      abi: roundPrizeVaultAbi,
      functionName: "submissionsTCR",
    }) as Promise<string>,
    params.client.readContract({
      address: roundPrizeVaultAddress,
      abi: roundPrizeVaultAbi,
      functionName: "operator",
    }) as Promise<string>,
    params.client.readContract({
      address: roundPrizeVaultAddress,
      abi: roundPrizeVaultAbi,
      functionName: "superToken",
    }) as Promise<string>,
    params.client.readContract({
      address: roundPrizeVaultAddress,
      abi: roundPrizeVaultAbi,
      functionName: "underlyingToken",
    }) as Promise<string>,
    params.client.readContract({
      address: roundPrizeVaultAddress,
      abi: roundPrizeVaultAbi,
      functionName: "entitlementOf",
      args: [submissionId],
    }) as Promise<bigint>,
    params.client.readContract({
      address: roundPrizeVaultAddress,
      abi: roundPrizeVaultAbi,
      functionName: "claimedOf",
      args: [submissionId],
    }) as Promise<bigint>,
  ]);

  const payoutRecipientAddress = normalizeLogAddress(payoutRecipientRaw);
  const claimable = entitlement > claimed ? entitlement - claimed : 0n;

  return {
    ...buildBase(),
    family: "round-prize-vault",
    roundPrizeVaultAddress,
    submissionId,
    accountAddress,
    payoutRecipientAddress,
    submissionsTcrAddress: normalizeEvmAddress(
      submissionsTcrAddressRaw,
      "submissionsTcrAddress"
    ),
    operatorAddress: normalizeEvmAddress(operatorAddressRaw, "operatorAddress"),
    superTokenAddress: normalizeEvmAddress(superTokenAddressRaw, "superTokenAddress"),
    underlyingTokenAddress: normalizeEvmAddress(
      underlyingTokenAddressRaw,
      "underlyingTokenAddress"
    ),
    entitlement,
    claimed,
    claimable,
    canClaim:
      claimable > 0n &&
      accountAddress !== null &&
      payoutRecipientAddress !== null &&
      payoutRecipientAddress === accountAddress,
  };
}

export async function readGoalDonationPreflight(params: {
  client: ProtocolParticipantReadClient;
  goalTreasuryAddress: string;
  accountAddress?: string | null;
  amount?: BigintLike | null;
}): Promise<GoalDonationPreflight> {
  const {
    treasuryAddress: goalTreasuryAddress,
    accountAddress,
    amount,
    state,
    lifecycleStatus,
    superTokenAddress,
    underlyingTokenAddress,
    approval,
  } = await readDonationPreflightContext<GoalLifecycleStatusTuple>({
    client: params.client,
    treasuryAddress: params.goalTreasuryAddress,
    treasuryLabel: "goalTreasuryAddress",
    treasuryAbi: goalTreasuryAbi,
    ...(params.accountAddress !== undefined ? { accountAddress: params.accountAddress } : {}),
    ...(params.amount !== undefined ? { amount: params.amount } : {}),
  });

  return {
    ...buildBase(),
    family: "goal-donation",
    goalTreasuryAddress,
    accountAddress,
    state,
    stateLabel: goalStateLabel(state),
    lifecycleStatus: {
      isResolved: lifecycleStatus[1],
      canAcceptHookFunding: lifecycleStatus[2],
      isMintingOpen: lifecycleStatus[3],
      isMinRaiseReached: lifecycleStatus[4],
      isMinRaiseWindowElapsed: lifecycleStatus[5],
      isDeadlinePassed: lifecycleStatus[6],
      hasPendingSuccessAssertion: lifecycleStatus[7],
      treasuryBalance: lifecycleStatus[8],
      minRaise: lifecycleStatus[9],
      minRaiseDeadline: lifecycleStatus[10],
      deadline: lifecycleStatus[11],
      timeRemaining: lifecycleStatus[12],
      targetFlowRate: lifecycleStatus[13],
    },
    superTokenAddress,
    underlyingTokenAddress,
    amount,
    approval,
    canDonate: lifecycleStatus[2],
    blockedReason: donationBlockedReason({
      canDonate: lifecycleStatus[2],
      isResolved: lifecycleStatus[1],
      resolvedReason: "goal-resolved",
      unavailableReason: "goal-not-accepting-hook-funding",
    }),
  };
}

export async function readBudgetDonationPreflight(params: {
  client: ProtocolParticipantReadClient;
  budgetTreasuryAddress: string;
  accountAddress?: string | null;
  amount?: BigintLike | null;
}): Promise<BudgetDonationPreflight> {
  const {
    treasuryAddress: budgetTreasuryAddress,
    accountAddress,
    amount,
    state,
    lifecycleStatus,
    superTokenAddress,
    underlyingTokenAddress,
    approval,
  } = await readDonationPreflightContext<BudgetLifecycleStatusTuple>({
    client: params.client,
    treasuryAddress: params.budgetTreasuryAddress,
    treasuryLabel: "budgetTreasuryAddress",
    treasuryAbi: budgetTreasuryAbi,
    ...(params.accountAddress !== undefined ? { accountAddress: params.accountAddress } : {}),
    ...(params.amount !== undefined ? { amount: params.amount } : {}),
  });

  return {
    ...buildBase(),
    family: "budget-donation",
    budgetTreasuryAddress,
    accountAddress,
    state,
    stateLabel: budgetStateLabel(state),
    lifecycleStatus: {
      isResolved: lifecycleStatus[1],
      canAcceptFunding: lifecycleStatus[2],
      isSuccessResolutionDisabled: lifecycleStatus[3],
      isFundingWindowEnded: lifecycleStatus[4],
      hasDeadline: lifecycleStatus[5],
      isDeadlinePassed: lifecycleStatus[6],
      hasPendingSuccessAssertion: lifecycleStatus[7],
      treasuryBalance: lifecycleStatus[8],
      activationThreshold: lifecycleStatus[9],
      runwayCap: lifecycleStatus[10],
      fundingDeadline: lifecycleStatus[11],
      executionDuration: lifecycleStatus[12],
      deadline: lifecycleStatus[13],
      activatedAt: lifecycleStatus[14],
      timeRemaining: lifecycleStatus[15],
      targetFlowRate: lifecycleStatus[16],
    },
    superTokenAddress,
    underlyingTokenAddress,
    amount,
    approval,
    canDonate: lifecycleStatus[2],
    blockedReason: donationBlockedReason({
      canDonate: lifecycleStatus[2],
      isResolved: lifecycleStatus[1],
      resolvedReason: "budget-resolved",
      unavailableReason: "budget-not-accepting-funding",
    }),
  };
}

export async function readFlowAllocationPreflight(params: {
  client: ProtocolParticipantReadClient;
  flowAddress: string;
  strategyAddress: string;
  accountAddress: string;
  strategyKind?: ProtocolAllocationStrategyKind | string;
  strategyContextBytes?: string;
  previousWeight?: BigintLike | null;
  previousAllocations?: readonly FlowAllocationInput[];
  nextAllocations?: readonly FlowAllocationInput[];
  budgetTreasuryAddresses?: readonly string[];
}): Promise<FlowAllocationPreflight> {
  const flowAddress = normalizeEvmAddress(params.flowAddress, "flowAddress");
  const strategyAddress = normalizeEvmAddress(params.strategyAddress, "strategyAddress");
  const accountAddress = normalizeEvmAddress(params.accountAddress, "accountAddress");
  const strategyKind = normalizeStrategyKind(params.strategyKind);
  const strategyContextBytes = normalizeCallBytes(
    params.strategyContextBytes,
    "strategyContextBytes"
  );
  const previousWeight = normalizeNullableAmount(params.previousWeight, "previousWeight");
  const previousAllocations = params.previousAllocations
    ? normalizeFlowAllocations(params.previousAllocations, "previousAllocations")
    : null;
  const nextAllocations = params.nextAllocations
    ? normalizeFlowAllocations(params.nextAllocations, "nextAllocations")
    : null;
  const budgetTreasuryAddresses = normalizeBudgetTreasuryAddresses(
    params.budgetTreasuryAddresses
  );

  const [
    pipelineAddressRaw,
    childFlowsRaw,
    claimableBalance,
    allocationKey,
    canAccountAllocate,
    accountAllocationWeight,
  ] = await Promise.all([
    params.client.readContract({
      address: flowAddress,
      abi: flowReadAbi,
      functionName: "allocationPipeline",
    }) as Promise<string>,
    params.client.readContract({
      address: flowAddress,
      abi: flowReadAbi,
      functionName: "getChildFlows",
    }) as Promise<readonly string[]>,
    params.client.readContract({
      address: flowAddress,
      abi: flowReadAbi,
      functionName: "getClaimableBalance",
      args: [accountAddress],
    }) as Promise<bigint>,
    params.client.readContract({
      address: strategyAddress,
      abi: stakeStrategyReadAbi,
      functionName: "allocationKey",
      args: [accountAddress, strategyContextBytes],
    }) as Promise<bigint>,
    params.client.readContract({
      address: strategyAddress,
      abi: stakeStrategyReadAbi,
      functionName: "canAccountAllocate",
      args: [accountAddress],
    }) as Promise<boolean>,
    params.client.readContract({
      address: strategyAddress,
      abi: stakeStrategyReadAbi,
      functionName: "accountAllocationWeight",
      args: [accountAddress],
    }) as Promise<bigint>,
  ]);

  const pipelineAddress = normalizeEvmAddress(pipelineAddressRaw, "pipelineAddress");
  const normalizedChildFlows = childFlowsRaw.map((value, index) =>
    normalizeEvmAddress(value, `childFlows[${index}]`)
  );

  await params.client.readContract({
    address: pipelineAddress,
    abi: flowPipelineReadAbi,
    functionName: "validateForFlow",
    args: [flowAddress],
  });

  const [existingCommitmentRaw, canAllocateResult, currentWeightResult, childSyncDebtCount] =
    await Promise.all([
      params.client.readContract({
        address: flowAddress,
        abi: flowReadAbi,
        functionName: "getAllocationCommitment",
        args: [strategyAddress, allocationKey],
      }) as Promise<HexBytes32>,
      params.client.readContract({
        address: strategyAddress,
        abi: stakeStrategyReadAbi,
        functionName: "canAllocate",
        args: [allocationKey, accountAddress],
      }) as Promise<boolean>,
      params.client.readContract({
        address: strategyAddress,
        abi: stakeStrategyReadAbi,
        functionName: "currentWeight",
        args: [allocationKey],
      }) as Promise<bigint>,
      params.client.readContract({
        address: pipelineAddress,
        abi: flowPipelineReadAbi,
        functionName: "childSyncDebtCount",
        args: [accountAddress],
      }) as Promise<bigint>,
    ]);

  const routerContext =
    strategyKind === "budget-flow-router"
      ? await (async () => {
          const [
            budgetStakeLedgerAddressRaw,
            canAccountAllocateForFlow,
            accountAllocationWeightForFlow,
            currentWeightForFlow,
            recipientInfo,
          ] = await Promise.all([
            params.client.readContract({
              address: strategyAddress,
              abi: routerStrategyReadAbi,
              functionName: "budgetStakeLedger",
            }) as Promise<string>,
            params.client.readContract({
              address: strategyAddress,
              abi: routerStrategyReadAbi,
              functionName: "canAccountAllocateForFlow",
              args: [flowAddress, accountAddress],
            }) as Promise<boolean>,
            params.client.readContract({
              address: strategyAddress,
              abi: routerStrategyReadAbi,
              functionName: "accountAllocationWeightForFlow",
              args: [flowAddress, accountAddress],
            }) as Promise<bigint>,
            params.client.readContract({
              address: strategyAddress,
              abi: routerStrategyReadAbi,
              functionName: "currentWeightForFlow",
              args: [flowAddress, allocationKey],
            }) as Promise<bigint>,
            params.client.readContract({
              address: strategyAddress,
              abi: routerStrategyReadAbi,
              functionName: "recipientIdForFlow",
              args: [flowAddress],
            }) as Promise<readonly [HexBytes32, boolean]>,
          ]);

          return {
            budgetStakeLedgerAddress: normalizeEvmAddress(
              budgetStakeLedgerAddressRaw,
              "budgetStakeLedgerAddress"
            ),
            canAccountAllocateForFlow,
            accountAllocationWeightForFlow,
            currentWeightForFlow,
            recipientId: normalizeBytes32(recipientInfo[0], "recipientId"),
            recipientRegistered: recipientInfo[1],
          };
        })()
      : null;

  const childSyncDebts = await Promise.all(
    budgetTreasuryAddresses.map(async (budgetTreasuryAddress) => {
      const debt = (await params.client.readContract({
        address: pipelineAddress,
        abi: flowPipelineReadAbi,
        functionName: "childSyncDebt",
        args: [accountAddress, budgetTreasuryAddress],
      })) as FlowChildSyncDebtTuple;

      if (routerContext === null) {
        return {
          budgetTreasuryAddress,
          exists: debt[0],
          childFlowAddress: debt[0]
            ? normalizeEvmAddress(debt[1], "childFlowAddress")
            : null,
          childStrategyAddress: debt[0]
            ? normalizeEvmAddress(debt[2], "childStrategyAddress")
            : null,
          allocationKey: debt[3],
          reason: normalizeBytes32(debt[4], "childSyncDebt.reason"),
          budgetInfo: null,
          budgetCheckpoint: null,
          userAllocatedStake: null,
        } satisfies FlowChildSyncDebt;
      }

      const [budgetInfo, budgetCheckpoint, userAllocatedStake] = await Promise.all([
        params.client.readContract({
          address: routerContext.budgetStakeLedgerAddress,
          abi: budgetStakeLedgerAbi,
          functionName: "budgetInfo",
          args: [budgetTreasuryAddress],
        }) as unknown as Promise<BudgetInfoTuple>,
        params.client.readContract({
          address: routerContext.budgetStakeLedgerAddress,
          abi: budgetStakeLedgerAbi,
          functionName: "budgetCheckpoint",
          args: [budgetTreasuryAddress],
        }) as unknown as Promise<BudgetCheckpointTuple>,
        params.client.readContract({
          address: routerContext.budgetStakeLedgerAddress,
          abi: budgetStakeLedgerAbi,
          functionName: "userAllocatedStakeOnBudget",
          args: [accountAddress, budgetTreasuryAddress],
        }) as Promise<bigint>,
      ]);

      return {
        budgetTreasuryAddress,
        exists: debt[0],
        childFlowAddress: debt[0]
          ? normalizeEvmAddress(debt[1], "childFlowAddress")
          : null,
        childStrategyAddress: debt[0]
          ? normalizeEvmAddress(debt[2], "childStrategyAddress")
          : null,
        allocationKey: debt[3],
        reason: normalizeBytes32(debt[4], "childSyncDebt.reason"),
        budgetInfo: {
          isTracked: budgetInfo[0],
          removedAt: budgetInfo[1],
          activatedAt: budgetInfo[2],
          resolvedOrRemovedAt: budgetInfo[3],
        },
        budgetCheckpoint: {
          totalAllocatedStake: budgetCheckpoint[0],
          lastCheckpoint: budgetCheckpoint[1],
        },
        userAllocatedStake,
      } satisfies FlowChildSyncDebt;
    })
  );

  const preview =
    previousAllocations !== null && nextAllocations !== null
      ? {
          previousWeight: previousWeight ?? currentWeightResult,
          previousAllocations,
          nextAllocations,
          childSyncRequirements: (
            (await params.client.readContract({
              address: pipelineAddress,
              abi: flowPipelineReadAbi,
              functionName: "previewChildSyncRequirements",
              args: [
                strategyAddress,
                allocationKey,
                previousWeight ?? currentWeightResult,
                previousAllocations.map((entry) => entry.recipientId),
                previousAllocations.map((entry) => entry.allocationPpm),
                nextAllocations.map((entry) => entry.recipientId),
                nextAllocations.map((entry) => entry.allocationPpm),
              ],
            })) as FlowChildSyncRequirementTuple[]
          ).map((entry) => ({
            budgetTreasuryAddress: normalizeEvmAddress(
              entry[0],
              "childSyncRequirement.budgetTreasuryAddress"
            ),
            childFlowAddress: normalizeEvmAddress(
              entry[1],
              "childSyncRequirement.childFlowAddress"
            ),
            childStrategyAddress: normalizeEvmAddress(
              entry[2],
              "childSyncRequirement.childStrategyAddress"
            ),
            allocationKey: entry[3],
            expectedCommit: normalizeBytes32(
              entry[4],
              "childSyncRequirement.expectedCommit"
            ),
          })),
        }
      : null;

  return {
    ...buildBase(),
    family: "flow-allocation",
    flowAddress,
    pipelineAddress,
    strategyAddress,
    strategyKind,
    accountAddress,
    allocationKey,
    existingCommitment: normalizeBytes32(
      existingCommitmentRaw,
      "existingCommitment"
    ),
    hasExistingCommitment: existingCommitmentRaw !== zeroBytes32,
    childFlowAddresses: normalizedChildFlows,
    claimableBalance,
    canAccountAllocate,
    canAllocate: canAllocateResult,
    accountAllocationWeight,
    currentWeight: currentWeightResult,
    routerContext,
    childSyncDebtCount,
    childSyncDebts,
    preview,
  };
}

export function serializeProtocolParticipantPreflight(value: unknown): unknown {
  return serializeProtocolBigInts(value);
}
