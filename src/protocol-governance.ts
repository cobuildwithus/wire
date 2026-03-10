import {
  decodeAbiParameters,
  encodeAbiParameters,
  encodePacked,
  isHex,
  keccak256,
  parseEventLogs,
  type Abi,
} from "viem";
import { BASE_CHAIN_ID } from "./chains.js";
import type { EvmAddress, HexBytes, HexBytes32 } from "./evm.js";
import {
  normalizeBytes32,
  normalizeEvmAddress,
  normalizeHexBytes,
  normalizeUnsignedDecimal,
} from "./evm.js";
import {
  budgetTcrAbi,
  erc20VotesArbitratorAbi,
  roundSubmissionTcrAbi,
} from "./protocol-abis.js";
import {
  buildApprovalPlan,
  buildProtocolCallStep,
  resolveProtocolPlanNetwork,
  serializeProtocolBigInts,
  type ProtocolExecutionPlan,
} from "./protocol-plans.js";

const generalizedTcrActionAbi = budgetTcrAbi as Abi;
const arbitratorActionAbi = erc20VotesArbitratorAbi as Abi;
const tcrReceiptAbi = budgetTcrAbi as Abi;
const arbitratorReceiptAbi = erc20VotesArbitratorAbi as Abi;

const MAX_UINT8 = 255n;
const MAX_UINT64 = (1n << 64n) - 1n;

export const TCR_ITEM_STATUS = {
  absent: 0,
  registered: 1,
  registrationRequested: 2,
  clearingRequested: 3,
} as const;

export type TcrItemStatus = (typeof TCR_ITEM_STATUS)[keyof typeof TCR_ITEM_STATUS];
export type TcrRequestType =
  | typeof TCR_ITEM_STATUS.registrationRequested
  | typeof TCR_ITEM_STATUS.clearingRequested;

export const TCR_REQUEST_PHASE = {
  none: 0,
  challengePeriod: 1,
  unchallengedExecutable: 2,
  disputePending: 3,
  disputeSolvedAwaitingExecution: 4,
  resolved: 5,
} as const;

export type TcrRequestPhase = (typeof TCR_REQUEST_PHASE)[keyof typeof TCR_REQUEST_PHASE];

export const ARBITRABLE_PARTY = {
  none: 0,
  requester: 1,
  challenger: 2,
} as const;

export type ArbitrableParty = (typeof ARBITRABLE_PARTY)[keyof typeof ARBITRABLE_PARTY];

export const ARBITRATOR_DISPUTE_STATUS = {
  waiting: 0,
  solved: 1,
} as const;

export type ArbitratorDisputeStatus =
  (typeof ARBITRATOR_DISPUTE_STATUS)[keyof typeof ARBITRATOR_DISPUTE_STATUS];

export type ProtocolRecipientMetadataInput = {
  title: string;
  description: string;
  image: string;
  tagline?: string;
  url?: string;
};

export type ProtocolRecipientMetadata = {
  title: string;
  description: string;
  image: string;
  tagline: string;
  url: string;
};

export type BudgetTcrListingInput = {
  metadata: ProtocolRecipientMetadataInput;
  fundingDeadline: string | number | bigint;
  executionDuration: string | number | bigint;
  activationThreshold: string | number | bigint;
  runwayCap: string | number | bigint;
  oracleConfig: {
    oracleSpecHash: string;
    assertionPolicyHash: string;
  };
};

export type BudgetTcrListing = {
  metadata: ProtocolRecipientMetadata;
  fundingDeadline: bigint;
  executionDuration: bigint;
  activationThreshold: bigint;
  runwayCap: bigint;
  oracleConfig: {
    oracleSpecHash: HexBytes32;
    assertionPolicyHash: HexBytes32;
  };
};

export type AllocationMechanismListingInput = {
  metadata: ProtocolRecipientMetadataInput;
  duration: string | number | bigint;
  fundingDeadline: string | number | bigint;
  minBudgetFunding: string | number | bigint;
  maxBudgetFunding: string | number | bigint;
  deploymentConfig: {
    mechanismFactory: string;
    mechanismConfig?: string;
  };
};

export type AllocationMechanismListing = {
  metadata: ProtocolRecipientMetadata;
  duration: bigint;
  fundingDeadline: bigint;
  minBudgetFunding: bigint;
  maxBudgetFunding: bigint;
  deploymentConfig: {
    mechanismFactory: EvmAddress;
    mechanismConfig: HexBytes;
  };
};

export type RoundSubmissionInput = {
  source: string | number | bigint;
  postId: string;
  recipient: string;
};

export type RoundSubmission = {
  source: number;
  postId: HexBytes32;
  recipient: EvmAddress;
};

export type GeneralizedTcrTotalCostsInput = {
  addItemCost: string | number | bigint;
  removeItemCost: string | number | bigint;
  challengeSubmissionCost: string | number | bigint;
  challengeRemovalCost: string | number | bigint;
  arbitrationCost: string | number | bigint;
};

export type GeneralizedTcrTotalCosts = {
  addItemCost: bigint;
  removeItemCost: bigint;
  challengeSubmissionCost: bigint;
  challengeRemovalCost: bigint;
  arbitrationCost: bigint;
};

export const TCR_PLAN_ACTIONS = [
  "addItem",
  "removeItem",
  "challengeRequest",
  "executeRequest",
  "executeRequestTimeout",
  "submitEvidence",
  "withdrawFeesAndRewards",
] as const;

export type TcrPlanAction = (typeof TCR_PLAN_ACTIONS)[number];

export const ARBITRATOR_PLAN_ACTIONS = [
  "commitVote",
  "commitVoteFor",
  "revealVote",
  "executeRuling",
  "withdrawVoterRewards",
  "withdrawInvalidRoundRewards",
  "slashVoter",
  "slashVoters",
] as const;

export type ArbitratorPlanAction = (typeof ARBITRATOR_PLAN_ACTIONS)[number];

type GovernancePlanCore = Omit<ProtocolExecutionPlan, "action">;

export type TcrActionPlan = ProtocolExecutionPlan<TcrPlanAction> & {
  family: "tcr";
  action: TcrPlanAction;
  registryAddress: EvmAddress;
  depositTokenAddress?: EvmAddress;
  itemId?: HexBytes32;
  requestType?: TcrRequestType;
};

export type ArbitratorActionPlan = ProtocolExecutionPlan<ArbitratorPlanAction> & {
  family: "arbitrator";
  action: ArbitratorPlanAction;
  arbitratorAddress: EvmAddress;
  disputeId: bigint;
  round?: bigint;
  voter?: EvmAddress;
  commitHash?: HexBytes32;
};

type ReceiptEventBase = {
  contractAddress: EvmAddress;
  logIndex: number | null;
};

export type TcrReceiptEvent =
  | (ReceiptEventBase & {
      family: "tcr";
      eventName: "Dispute";
      arbitrator: EvmAddress;
      disputeId: bigint;
      metaEvidenceId: bigint;
      evidenceGroupId: bigint;
      itemId: HexBytes32;
      requestIndex: bigint;
      challenger: EvmAddress;
    })
  | (ReceiptEventBase & {
      family: "tcr";
      eventName: "Evidence";
      arbitrator: EvmAddress;
      evidenceGroupId: bigint;
      party: EvmAddress;
      evidence: string;
    })
  | (ReceiptEventBase & {
      family: "tcr";
      eventName: "ItemStatusChange";
      itemId: HexBytes32;
      requestIndex: bigint;
      roundIndex: bigint;
      disputed: boolean;
      resolved: boolean;
      itemStatus: TcrItemStatus;
    })
  | (ReceiptEventBase & {
      family: "tcr";
      eventName: "ItemSubmitted";
      itemId: HexBytes32;
      submitter: EvmAddress;
      evidenceGroupId: bigint;
      data: HexBytes;
    })
  | (ReceiptEventBase & {
      family: "tcr";
      eventName: "RequestEvidenceGroupID";
      itemId: HexBytes32;
      requestIndex: bigint;
      evidenceGroupId: bigint;
    })
  | (ReceiptEventBase & {
      family: "tcr";
      eventName: "RequestSubmitted";
      itemId: HexBytes32;
      requestIndex: bigint;
      requestType: TcrRequestType;
      requester: EvmAddress;
    })
  | (ReceiptEventBase & {
      family: "tcr";
      eventName: "Ruling";
      arbitrator: EvmAddress;
      disputeId: bigint;
      ruling: ArbitrableParty;
    })
  | (ReceiptEventBase & {
      family: "tcr";
      eventName: "SubmissionDepositPaid";
      itemId: HexBytes32;
      payer: EvmAddress;
      amount: bigint;
    })
  | (ReceiptEventBase & {
      family: "tcr";
      eventName: "SubmissionDepositTransferred";
      itemId: HexBytes32;
      recipient: EvmAddress;
      amount: bigint;
      requestType: TcrItemStatus;
      ruling: ArbitrableParty;
    });

export type ArbitratorReceiptEvent =
  | (ReceiptEventBase & {
      family: "arbitrator";
      eventName: "DisputeCreated";
      disputeId: bigint;
      arbitrable: EvmAddress;
      votingStartTime: bigint;
      votingEndTime: bigint;
      revealPeriodEndTime: bigint;
      creationBlock: bigint;
      arbitrationCost: bigint;
      extraData: HexBytes;
      choices: bigint;
    })
  | (ReceiptEventBase & {
      family: "arbitrator";
      eventName: "DisputeCreation";
      disputeId: bigint;
      arbitrable: EvmAddress;
    })
  | (ReceiptEventBase & {
      family: "arbitrator";
      eventName: "DisputeExecuted";
      disputeId: bigint;
      ruling: ArbitrableParty;
    })
  | (ReceiptEventBase & {
      family: "arbitrator";
      eventName: "RewardWithdrawn";
      disputeId: bigint;
      round: bigint;
      voter: EvmAddress;
      amount: bigint;
    })
  | (ReceiptEventBase & {
      family: "arbitrator";
      eventName: "SlashRewardsWithdrawn";
      disputeId: bigint;
      round: bigint;
      voter: EvmAddress;
      goalAmount: bigint;
      cobuildAmount: bigint;
    })
  | (ReceiptEventBase & {
      family: "arbitrator";
      eventName: "VoteCommitted";
      voter: EvmAddress;
      disputeId: bigint;
      commitHash: HexBytes32;
    })
  | (ReceiptEventBase & {
      family: "arbitrator";
      eventName: "VoteRevealed";
      voter: EvmAddress;
      disputeId: bigint;
      commitHash: HexBytes32;
      choice: bigint;
      reason: string;
      votes: bigint;
    })
  | (ReceiptEventBase & {
      family: "arbitrator";
      eventName: "VoterSlashed";
      disputeId: bigint;
      round: bigint;
      voter: EvmAddress;
      snapshotVotes: bigint;
      slashWeight: bigint;
      missedReveal: boolean;
      recipient: EvmAddress;
    });

export type GovernanceReceiptEvent = TcrReceiptEvent | ArbitratorReceiptEvent;

const budgetListingParameters = [
  {
    name: "listing",
    type: "tuple",
    components: [
      {
        name: "metadata",
        type: "tuple",
        components: [
          { name: "title", type: "string" },
          { name: "description", type: "string" },
          { name: "image", type: "string" },
          { name: "tagline", type: "string" },
          { name: "url", type: "string" },
        ],
      },
      { name: "fundingDeadline", type: "uint64" },
      { name: "executionDuration", type: "uint64" },
      { name: "activationThreshold", type: "uint256" },
      { name: "runwayCap", type: "uint256" },
      {
        name: "oracleConfig",
        type: "tuple",
        components: [
          { name: "oracleSpecHash", type: "bytes32" },
          { name: "assertionPolicyHash", type: "bytes32" },
        ],
      },
    ],
  },
] as const;

const mechanismListingParameters = [
  {
    name: "listing",
    type: "tuple",
    components: [
      {
        name: "metadata",
        type: "tuple",
        components: [
          { name: "title", type: "string" },
          { name: "description", type: "string" },
          { name: "image", type: "string" },
          { name: "tagline", type: "string" },
          { name: "url", type: "string" },
        ],
      },
      { name: "duration", type: "uint64" },
      { name: "fundingDeadline", type: "uint64" },
      { name: "minBudgetFunding", type: "uint256" },
      { name: "maxBudgetFunding", type: "uint256" },
      {
        name: "deploymentConfig",
        type: "tuple",
        components: [
          { name: "mechanismFactory", type: "address" },
          { name: "mechanismConfig", type: "bytes" },
        ],
      },
    ],
  },
] as const;

const roundSubmissionParameters = [
  {
    name: "submission",
    type: "tuple",
    components: [
      { name: "source", type: "uint8" },
      { name: "postId", type: "bytes32" },
      { name: "recipient", type: "address" },
    ],
  },
] as const;

const commitHashParameters = [
  { name: "chainId", type: "uint256" },
  { name: "arbitrator", type: "address" },
  { name: "disputeId", type: "uint256" },
  { name: "round", type: "uint256" },
  { name: "voter", type: "address" },
  { name: "choice", type: "uint256" },
  { name: "reason", type: "string" },
  { name: "salt", type: "bytes32" },
] as const;

function normalizeUint(value: string | number | bigint, label: string, max?: bigint): bigint {
  const normalized = BigInt(normalizeUnsignedDecimal(value, label));
  if (max !== undefined && normalized > max) {
    throw new Error(`${label} exceeds the supported range.`);
  }
  return normalized;
}

function normalizeUint64(value: string | number | bigint, label: string): bigint {
  return normalizeUint(value, label, MAX_UINT64);
}

function normalizeUint8(value: string | number | bigint, label: string): number {
  return Number(normalizeUint(value, label, MAX_UINT8));
}

function normalizeText(value: unknown, label: string): string {
  if (typeof value !== "string") {
    throw new Error(`${label} must be a string.`);
  }
  return value;
}

function normalizeRequiredText(value: unknown, label: string): string {
  const normalized = normalizeText(value, label);
  if (normalized.trim().length === 0) {
    throw new Error(`${label} must be a non-empty string.`);
  }
  return normalized;
}

function normalizeHexData(value: string, label: string, allowEmpty = true): HexBytes {
  const normalized = value.trim().toLowerCase();
  if (!isHex(normalized)) {
    throw new Error(`${label} must be valid hex bytes with 0x prefix.`);
  }
  if (!allowEmpty && normalized === "0x") {
    throw new Error(`${label} must not be empty hex bytes.`);
  }
  return normalized as HexBytes;
}

function normalizeLogIndex(value: unknown): number | null {
  return typeof value === "number" && Number.isInteger(value) ? value : null;
}

function normalizeBigIntFromUnknown(value: unknown, label: string): bigint {
  if (typeof value === "bigint") return value;
  if (typeof value === "number" && Number.isInteger(value) && value >= 0) {
    return BigInt(value);
  }
  if (typeof value === "string" && /^\d+$/.test(value)) {
    return BigInt(value);
  }
  throw new Error(`${label} is missing.`);
}

function normalizeBool(value: unknown, label: string): boolean {
  if (typeof value !== "boolean") throw new Error(`${label} is missing.`);
  return value;
}

function normalizeRequestTypeFromUnknown(value: unknown, label: string): TcrRequestType {
  const numeric = Number(normalizeBigIntFromUnknown(value, label));
  return normalizeTcrRequestType(numeric, label);
}

function normalizeItemStatusFromUnknown(value: unknown, label: string): TcrItemStatus {
  const numeric = Number(normalizeBigIntFromUnknown(value, label));
  switch (numeric) {
    case TCR_ITEM_STATUS.absent:
    case TCR_ITEM_STATUS.registered:
    case TCR_ITEM_STATUS.registrationRequested:
    case TCR_ITEM_STATUS.clearingRequested:
      return numeric;
    default:
      throw new Error(`${label} is invalid.`);
  }
}

function normalizePartyFromUnknown(value: unknown, label: string): ArbitrableParty {
  const numeric = Number(normalizeBigIntFromUnknown(value, label));
  switch (numeric) {
    case ARBITRABLE_PARTY.none:
    case ARBITRABLE_PARTY.requester:
    case ARBITRABLE_PARTY.challenger:
      return numeric;
    default:
      throw new Error(`${label} is invalid.`);
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function toMetadata(
  input: ProtocolRecipientMetadataInput | ProtocolRecipientMetadata
): ProtocolRecipientMetadata {
  if (!isRecord(input)) {
    throw new Error("metadata must be an object.");
  }
  return {
    title: normalizeRequiredText(input.title, "metadata.title"),
    description: normalizeRequiredText(input.description, "metadata.description"),
    image: normalizeRequiredText(input.image, "metadata.image"),
    tagline: normalizeText(input.tagline ?? "", "metadata.tagline"),
    url: normalizeText(input.url ?? "", "metadata.url"),
  };
}

function normalizeCosts(costs: GeneralizedTcrTotalCostsInput | GeneralizedTcrTotalCosts) {
  if (!isRecord(costs)) {
    throw new Error("costs must be an object.");
  }
  return {
    addItemCost: normalizeUint(costs.addItemCost, "costs.addItemCost"),
    removeItemCost: normalizeUint(costs.removeItemCost, "costs.removeItemCost"),
    challengeSubmissionCost: normalizeUint(
      costs.challengeSubmissionCost,
      "costs.challengeSubmissionCost"
    ),
    challengeRemovalCost: normalizeUint(
      costs.challengeRemovalCost,
      "costs.challengeRemovalCost"
    ),
    arbitrationCost: normalizeUint(costs.arbitrationCost, "costs.arbitrationCost"),
  };
}

function withOptionalApproval(params: {
  summary: string;
  registryAddress: EvmAddress;
  depositTokenAddress?: EvmAddress;
  approvalAmount?: bigint;
  callLabel: string;
  functionName: string;
  args: readonly unknown[];
  expectedEvents: readonly string[];
}): GovernancePlanCore {
  const approvalPlan =
    params.depositTokenAddress && params.approvalAmount && params.approvalAmount > 0n
      ? buildApprovalPlan({
          mode: "force",
          tokenAddress: params.depositTokenAddress,
          spenderAddress: params.registryAddress,
          requiredAmount: params.approvalAmount,
          approvalAmount: params.approvalAmount,
          tokenLabel: "deposit token",
          spenderLabel: "registry",
        })
      : {
          approvalIncluded: false,
          preconditions: [],
          steps: [],
        };

  return {
    network: resolveProtocolPlanNetwork(),
    riskClass: "governance",
    summary: params.summary,
    preconditions: approvalPlan.preconditions,
    steps: [
      ...approvalPlan.steps,
      buildProtocolCallStep({
        contract: "GeneralizedTCR",
        functionName: params.functionName,
        label: params.callLabel,
        to: params.registryAddress,
        abi: generalizedTcrActionAbi,
        args: params.args,
      }),
    ],
    expectedEvents: params.expectedEvents,
  };
}

function buildArbitratorPlan(params: {
  summary: string;
  arbitratorAddress: EvmAddress;
  callLabel: string;
  functionName: string;
  args: readonly unknown[];
  expectedEvents: readonly string[];
}): GovernancePlanCore {
  return {
    network: resolveProtocolPlanNetwork(),
    riskClass: "governance",
    summary: params.summary,
    preconditions: [],
    steps: [
      buildProtocolCallStep({
        contract: "ERC20VotesArbitrator",
        functionName: params.functionName,
        label: params.callLabel,
        to: params.arbitratorAddress,
        abi: arbitratorActionAbi,
        args: params.args,
      }),
    ],
    expectedEvents: params.expectedEvents,
  };
}

function buildReceiptBase(log: { address?: string; logIndex?: number }): ReceiptEventBase {
  if (typeof log.address !== "string") {
    throw new Error("receipt log address is missing.");
  }
  return {
    contractAddress: normalizeEvmAddress(log.address, "receiptLog.address"),
    logIndex: normalizeLogIndex(log.logIndex),
  };
}

function sortReceiptEvents(events: GovernanceReceiptEvent[]): GovernanceReceiptEvent[] {
  return [...events].sort((left, right) => {
    const leftIndex = left.logIndex ?? Number.MAX_SAFE_INTEGER;
    const rightIndex = right.logIndex ?? Number.MAX_SAFE_INTEGER;
    return leftIndex - rightIndex;
  });
}

export function normalizeTcrRequestType(
  value: string | number | bigint,
  label = "requestType"
): TcrRequestType {
  if (typeof value === "string") {
    const normalized = value.trim();
    if (normalized === "registrationRequested") {
      return TCR_ITEM_STATUS.registrationRequested;
    }
    if (normalized === "clearingRequested") {
      return TCR_ITEM_STATUS.clearingRequested;
    }
    if (!/^\d+$/.test(normalized)) {
      throw new Error(
        `${label} must be registrationRequested (2) or clearingRequested (3).`
      );
    }
  }

  const numeric = Number(normalizeUint(value, label, MAX_UINT8));
  if (
    numeric !== TCR_ITEM_STATUS.registrationRequested &&
    numeric !== TCR_ITEM_STATUS.clearingRequested
  ) {
    throw new Error(
      `${label} must be registrationRequested (2) or clearingRequested (3).`
    );
  }
  return numeric;
}

export function normalizeGeneralizedTcrTotalCosts(
  costs: GeneralizedTcrTotalCostsInput | GeneralizedTcrTotalCosts
): GeneralizedTcrTotalCosts {
  return normalizeCosts(costs);
}

export function getTcrRequiredApprovalAmount(params: {
  action: "addItem" | "removeItem" | "challengeRequest";
  costs: GeneralizedTcrTotalCostsInput | GeneralizedTcrTotalCosts;
  requestType?: TcrRequestType | "registrationRequested" | "clearingRequested";
}): bigint {
  const costs = normalizeCosts(params.costs);
  switch (params.action) {
    case "addItem":
      return costs.addItemCost;
    case "removeItem":
      return costs.removeItemCost;
    case "challengeRequest": {
      const requestType = normalizeTcrRequestType(params.requestType ?? "", "requestType");
      return requestType === TCR_ITEM_STATUS.registrationRequested
        ? costs.challengeSubmissionCost
        : costs.challengeRemovalCost;
    }
  }
}

export function normalizeBudgetTcrListing(
  listing: BudgetTcrListingInput | BudgetTcrListing
): BudgetTcrListing {
  if (!isRecord(listing)) {
    throw new Error("budget listing must be an object.");
  }
  return {
    metadata: toMetadata(listing.metadata as ProtocolRecipientMetadataInput),
    fundingDeadline: normalizeUint64(listing.fundingDeadline, "listing.fundingDeadline"),
    executionDuration: normalizeUint64(listing.executionDuration, "listing.executionDuration"),
    activationThreshold: normalizeUint(
      listing.activationThreshold,
      "listing.activationThreshold"
    ),
    runwayCap: normalizeUint(listing.runwayCap, "listing.runwayCap"),
    oracleConfig: {
      oracleSpecHash: normalizeBytes32(
        String((listing.oracleConfig as Record<string, unknown>).oracleSpecHash),
        "listing.oracleConfig.oracleSpecHash"
      ),
      assertionPolicyHash: normalizeBytes32(
        String((listing.oracleConfig as Record<string, unknown>).assertionPolicyHash),
        "listing.oracleConfig.assertionPolicyHash"
      ),
    },
  };
}

export function encodeBudgetTcrListing(
  listing: BudgetTcrListingInput | BudgetTcrListing
): HexBytes {
  const normalized = normalizeBudgetTcrListing(listing);
  return encodeAbiParameters(budgetListingParameters, [
    {
      metadata: normalized.metadata,
      fundingDeadline: normalized.fundingDeadline,
      executionDuration: normalized.executionDuration,
      activationThreshold: normalized.activationThreshold,
      runwayCap: normalized.runwayCap,
      oracleConfig: normalized.oracleConfig,
    },
  ]) as HexBytes;
}

export function decodeBudgetTcrListing(itemData: string): BudgetTcrListing {
  const [decoded] = decodeAbiParameters(
    budgetListingParameters,
    normalizeHexData(itemData, "itemData", false)
  );

  return normalizeBudgetTcrListing(decoded as BudgetTcrListing);
}

export function deriveBudgetTcrItemId(
  listing: BudgetTcrListingInput | BudgetTcrListing
): HexBytes32 {
  return keccak256(encodeBudgetTcrListing(listing)) as HexBytes32;
}

export function normalizeAllocationMechanismListing(
  listing: AllocationMechanismListingInput | AllocationMechanismListing
): AllocationMechanismListing {
  if (!isRecord(listing)) {
    throw new Error("mechanism listing must be an object.");
  }

  const normalized = {
    metadata: toMetadata(listing.metadata as ProtocolRecipientMetadataInput),
    duration: normalizeUint64(listing.duration, "listing.duration"),
    fundingDeadline: normalizeUint64(listing.fundingDeadline, "listing.fundingDeadline"),
    minBudgetFunding: normalizeUint(listing.minBudgetFunding, "listing.minBudgetFunding"),
    maxBudgetFunding: normalizeUint(listing.maxBudgetFunding, "listing.maxBudgetFunding"),
    deploymentConfig: {
      mechanismFactory: normalizeEvmAddress(
        String((listing.deploymentConfig as Record<string, unknown>).mechanismFactory),
        "listing.deploymentConfig.mechanismFactory"
      ),
      mechanismConfig: normalizeHexData(
        String((listing.deploymentConfig as Record<string, unknown>).mechanismConfig ?? "0x"),
        "listing.deploymentConfig.mechanismConfig"
      ),
    },
  };

  if (
    normalized.maxBudgetFunding !== 0n &&
    normalized.minBudgetFunding !== 0n &&
    normalized.maxBudgetFunding < normalized.minBudgetFunding
  ) {
    throw new Error(
      "listing.maxBudgetFunding must be zero or greater than or equal to minBudgetFunding."
    );
  }
  if (
    (normalized.fundingDeadline === 0n && normalized.minBudgetFunding !== 0n) ||
    (normalized.fundingDeadline !== 0n && normalized.minBudgetFunding === 0n)
  ) {
    throw new Error(
      "listing.fundingDeadline and listing.minBudgetFunding must either both be zero or both be set."
    );
  }

  return normalized;
}

export function encodeAllocationMechanismListing(
  listing: AllocationMechanismListingInput | AllocationMechanismListing
): HexBytes {
  const normalized = normalizeAllocationMechanismListing(listing);
  return encodeAbiParameters(mechanismListingParameters, [
    {
      metadata: normalized.metadata,
      duration: normalized.duration,
      fundingDeadline: normalized.fundingDeadline,
      minBudgetFunding: normalized.minBudgetFunding,
      maxBudgetFunding: normalized.maxBudgetFunding,
      deploymentConfig: normalized.deploymentConfig,
    },
  ]) as HexBytes;
}

export function decodeAllocationMechanismListing(itemData: string): AllocationMechanismListing {
  const [decoded] = decodeAbiParameters(
    mechanismListingParameters,
    normalizeHexData(itemData, "itemData", false)
  );

  return normalizeAllocationMechanismListing(decoded as AllocationMechanismListing);
}

export function deriveAllocationMechanismItemId(
  listing: AllocationMechanismListingInput | AllocationMechanismListing
): HexBytes32 {
  return keccak256(encodeAllocationMechanismListing(listing)) as HexBytes32;
}

export function normalizeRoundSubmission(
  submission: RoundSubmissionInput | RoundSubmission
): RoundSubmission {
  if (!isRecord(submission)) {
    throw new Error("submission must be an object.");
  }
  return {
    source: normalizeUint8(submission.source, "submission.source"),
    postId: normalizeHexBytes(String(submission.postId), 32, "submission.postId") as HexBytes32,
    recipient: normalizeEvmAddress(String(submission.recipient), "submission.recipient"),
  };
}

export function encodeRoundSubmission(
  submission: RoundSubmissionInput | RoundSubmission
): HexBytes {
  const normalized = normalizeRoundSubmission(submission);
  return encodeAbiParameters(roundSubmissionParameters, [normalized]) as HexBytes;
}

export function decodeRoundSubmission(itemData: string): RoundSubmission {
  const [decoded] = decodeAbiParameters(
    roundSubmissionParameters,
    normalizeHexData(itemData, "itemData", false)
  );
  return normalizeRoundSubmission(decoded as RoundSubmission);
}

export function deriveRoundSubmissionItemId(
  submission: RoundSubmissionInput | RoundSubmission
): HexBytes32 {
  const normalized = normalizeRoundSubmission(submission);
  return keccak256(
    encodePacked(["uint8", "bytes32"], [normalized.source, normalized.postId])
  ) as HexBytes32;
}

export function buildTcrAddItemPlan(params: {
  registryAddress: string;
  depositTokenAddress: string;
  itemData: string;
  costs: GeneralizedTcrTotalCostsInput | GeneralizedTcrTotalCosts;
  expectedItemId?: string;
}): TcrActionPlan {
  const registryAddress = normalizeEvmAddress(params.registryAddress, "registryAddress");
  const depositTokenAddress = normalizeEvmAddress(
    params.depositTokenAddress,
    "depositTokenAddress"
  );
  const itemData = normalizeHexData(params.itemData, "itemData", false);
  const itemId = params.expectedItemId
    ? normalizeBytes32(params.expectedItemId, "expectedItemId")
    : undefined;
  const approvalAmount = getTcrRequiredApprovalAmount({
    action: "addItem",
    costs: params.costs,
  });

  return {
    family: "tcr",
    action: "addItem",
    registryAddress,
    depositTokenAddress,
    ...(itemId ? { itemId } : {}),
    ...withOptionalApproval({
      summary: "Approve the TCR deposit token and submit an item.",
      registryAddress,
      depositTokenAddress,
      approvalAmount,
      callLabel: "Submit TCR item",
      functionName: "addItem",
      args: [itemData],
      expectedEvents: [
        "ItemSubmitted",
        "RequestSubmitted",
        "RequestEvidenceGroupID",
        "ItemStatusChange",
        "SubmissionDepositPaid",
      ],
    }),
  };
}

export function buildBudgetTcrAddListingPlan(params: {
  registryAddress: string;
  depositTokenAddress: string;
  listing: BudgetTcrListingInput | BudgetTcrListing;
  costs: GeneralizedTcrTotalCostsInput | GeneralizedTcrTotalCosts;
}): TcrActionPlan {
  const listing = normalizeBudgetTcrListing(params.listing);
  return buildTcrAddItemPlan({
    registryAddress: params.registryAddress,
    depositTokenAddress: params.depositTokenAddress,
    itemData: encodeBudgetTcrListing(listing),
    costs: params.costs,
    expectedItemId: deriveBudgetTcrItemId(listing),
  });
}

export function buildAllocationMechanismAddListingPlan(params: {
  registryAddress: string;
  depositTokenAddress: string;
  listing: AllocationMechanismListingInput | AllocationMechanismListing;
  costs: GeneralizedTcrTotalCostsInput | GeneralizedTcrTotalCosts;
}): TcrActionPlan {
  const listing = normalizeAllocationMechanismListing(params.listing);
  return buildTcrAddItemPlan({
    registryAddress: params.registryAddress,
    depositTokenAddress: params.depositTokenAddress,
    itemData: encodeAllocationMechanismListing(listing),
    costs: params.costs,
    expectedItemId: deriveAllocationMechanismItemId(listing),
  });
}

export const buildAllocationMechanismTcrAddListingPlan =
  buildAllocationMechanismAddListingPlan;

export function buildRoundSubmissionAddItemPlan(params: {
  registryAddress: string;
  depositTokenAddress: string;
  submission: RoundSubmissionInput | RoundSubmission;
  costs: GeneralizedTcrTotalCostsInput | GeneralizedTcrTotalCosts;
}): TcrActionPlan {
  const submission = normalizeRoundSubmission(params.submission);
  return buildTcrAddItemPlan({
    registryAddress: params.registryAddress,
    depositTokenAddress: params.depositTokenAddress,
    itemData: encodeRoundSubmission(submission),
    costs: params.costs,
    expectedItemId: deriveRoundSubmissionItemId(submission),
  });
}

export const buildRoundSubmissionTcrAddSubmissionPlan = buildRoundSubmissionAddItemPlan;

export function buildTcrRemoveItemPlan(params: {
  registryAddress: string;
  depositTokenAddress: string;
  itemId: string;
  evidence?: string;
  costs: GeneralizedTcrTotalCostsInput | GeneralizedTcrTotalCosts;
}): TcrActionPlan {
  const registryAddress = normalizeEvmAddress(params.registryAddress, "registryAddress");
  const depositTokenAddress = normalizeEvmAddress(
    params.depositTokenAddress,
    "depositTokenAddress"
  );
  const itemId = normalizeBytes32(params.itemId, "itemId");
  const evidence = normalizeText(params.evidence ?? "", "evidence");
  const approvalAmount = getTcrRequiredApprovalAmount({
    action: "removeItem",
    costs: params.costs,
  });

  return {
    family: "tcr",
    action: "removeItem",
    registryAddress,
    depositTokenAddress,
    itemId,
    ...withOptionalApproval({
      summary: "Approve the TCR deposit token and request item removal.",
      registryAddress,
      depositTokenAddress,
      approvalAmount,
      callLabel: "Request TCR item removal",
      functionName: "removeItem",
      args: [itemId, evidence],
      expectedEvents:
        evidence.length > 0
          ? ["Evidence", "RequestSubmitted", "RequestEvidenceGroupID", "ItemStatusChange"]
          : ["RequestSubmitted", "RequestEvidenceGroupID", "ItemStatusChange"],
    }),
  };
}

export function buildTcrChallengeRequestPlan(params: {
  registryAddress: string;
  depositTokenAddress: string;
  itemId: string;
  evidence?: string;
  requestType: TcrRequestType | "registrationRequested" | "clearingRequested";
  costs: GeneralizedTcrTotalCostsInput | GeneralizedTcrTotalCosts;
}): TcrActionPlan {
  const registryAddress = normalizeEvmAddress(params.registryAddress, "registryAddress");
  const depositTokenAddress = normalizeEvmAddress(
    params.depositTokenAddress,
    "depositTokenAddress"
  );
  const itemId = normalizeBytes32(params.itemId, "itemId");
  const evidence = normalizeText(params.evidence ?? "", "evidence");
  const requestType = normalizeTcrRequestType(params.requestType, "requestType");
  const approvalAmount = getTcrRequiredApprovalAmount({
    action: "challengeRequest",
    requestType,
    costs: params.costs,
  });

  return {
    family: "tcr",
    action: "challengeRequest",
    registryAddress,
    depositTokenAddress,
    itemId,
    requestType,
    ...withOptionalApproval({
      summary: "Approve the TCR deposit token and challenge the pending request.",
      registryAddress,
      depositTokenAddress,
      approvalAmount,
      callLabel: "Challenge TCR request",
      functionName: "challengeRequest",
      args: [itemId, evidence],
      expectedEvents:
        evidence.length > 0
          ? [
              "ItemStatusChange",
              "Dispute",
              "Evidence",
              "DisputeCreation",
              "DisputeCreated",
            ]
          : ["ItemStatusChange", "Dispute", "DisputeCreation", "DisputeCreated"],
    }),
  };
}

export function buildTcrExecuteRequestPlan(params: {
  registryAddress: string;
  itemId: string;
}): TcrActionPlan {
  const registryAddress = normalizeEvmAddress(params.registryAddress, "registryAddress");
  const itemId = normalizeBytes32(params.itemId, "itemId");

  return {
    family: "tcr",
    action: "executeRequest",
    registryAddress,
    itemId,
    ...withOptionalApproval({
      summary: "Execute an unchallenged TCR request after the challenge window closes.",
      registryAddress,
      callLabel: "Execute TCR request",
      functionName: "executeRequest",
      args: [itemId],
      expectedEvents: ["ItemStatusChange", "SubmissionDepositTransferred"],
    }),
  };
}

export function buildTcrExecuteRequestTimeoutPlan(params: {
  registryAddress: string;
  itemId: string;
}): TcrActionPlan {
  const registryAddress = normalizeEvmAddress(params.registryAddress, "registryAddress");
  const itemId = normalizeBytes32(params.itemId, "itemId");

  return {
    family: "tcr",
    action: "executeRequestTimeout",
    registryAddress,
    itemId,
    ...withOptionalApproval({
      summary: "Execute a disputed TCR request after the dispute timeout path becomes available.",
      registryAddress,
      callLabel: "Execute timed-out TCR request",
      functionName: "executeRequestTimeout",
      args: [itemId],
      expectedEvents: ["Ruling", "ItemStatusChange", "SubmissionDepositTransferred"],
    }),
  };
}

export function buildTcrSubmitEvidencePlan(params: {
  registryAddress: string;
  itemId: string;
  evidence: string;
}): TcrActionPlan {
  const registryAddress = normalizeEvmAddress(params.registryAddress, "registryAddress");
  const itemId = normalizeBytes32(params.itemId, "itemId");
  const evidence = normalizeText(params.evidence, "evidence");

  return {
    family: "tcr",
    action: "submitEvidence",
    registryAddress,
    itemId,
    ...withOptionalApproval({
      summary: "Submit evidence for the latest TCR request cycle.",
      registryAddress,
      callLabel: "Submit TCR evidence",
      functionName: "submitEvidence",
      args: [itemId, evidence],
      expectedEvents: ["Evidence"],
    }),
  };
}

export function buildTcrWithdrawFeesAndRewardsPlan(params: {
  registryAddress: string;
  beneficiary: string;
  itemId: string;
  requestIndex: string | number | bigint;
  roundIndex: string | number | bigint;
}): TcrActionPlan {
  const registryAddress = normalizeEvmAddress(params.registryAddress, "registryAddress");
  const beneficiary = normalizeEvmAddress(params.beneficiary, "beneficiary");
  const itemId = normalizeBytes32(params.itemId, "itemId");
  const requestIndex = normalizeUint(params.requestIndex, "requestIndex");
  const roundIndex = normalizeUint(params.roundIndex, "roundIndex");

  return {
    family: "tcr",
    action: "withdrawFeesAndRewards",
    registryAddress,
    itemId,
    ...withOptionalApproval({
      summary: "Withdraw resolved TCR fees and rewards for a contributor.",
      registryAddress,
      callLabel: "Withdraw TCR fees and rewards",
      functionName: "withdrawFeesAndRewards",
      args: [beneficiary, itemId, requestIndex, roundIndex],
      expectedEvents: [],
    }),
  };
}

export function computeArbitratorCommitHash(params: {
  arbitratorAddress: string;
  disputeId: string | number | bigint;
  round: string | number | bigint;
  voterAddress: string;
  choice: string | number | bigint;
  reason?: string;
  salt: string;
  chainId?: string | number | bigint;
}): HexBytes32 {
  const arbitratorAddress = normalizeEvmAddress(params.arbitratorAddress, "arbitratorAddress");
  const disputeId = normalizeUint(params.disputeId, "disputeId");
  const round = normalizeUint(params.round, "round");
  const voterAddress = normalizeEvmAddress(params.voterAddress, "voterAddress");
  const choice = normalizeUint(params.choice, "choice");
  const reason = normalizeText(params.reason ?? "", "reason");
  const salt = normalizeBytes32(params.salt, "salt");
  const chainId = normalizeUint(params.chainId ?? BASE_CHAIN_ID, "chainId");

  return keccak256(
    encodeAbiParameters(commitHashParameters, [
      chainId,
      arbitratorAddress,
      disputeId,
      round,
      voterAddress,
      choice,
      reason,
      salt,
    ])
  ) as HexBytes32;
}

function resolveCommitHash(params: {
  arbitratorAddress: EvmAddress;
  disputeId: bigint;
  voterAddress?: EvmAddress;
  choice?: string | number | bigint;
  reason?: string;
  salt?: string;
  round?: string | number | bigint;
  chainId?: string | number | bigint;
  commitHash?: string;
}): HexBytes32 {
  if (params.commitHash) {
    return normalizeBytes32(params.commitHash, "commitHash");
  }

  if (!params.voterAddress) {
    throw new Error("voterAddress is required when commitHash is not provided.");
  }
  if (params.choice === undefined) {
    throw new Error("choice is required when commitHash is not provided.");
  }
  if (params.salt === undefined) {
    throw new Error("salt is required when commitHash is not provided.");
  }
  if (params.round === undefined) {
    throw new Error("round is required when commitHash is not provided.");
  }

  return computeArbitratorCommitHash({
    arbitratorAddress: params.arbitratorAddress,
    disputeId: params.disputeId,
    round: params.round,
    voterAddress: params.voterAddress,
    choice: params.choice,
    salt: params.salt,
    ...(params.reason !== undefined ? { reason: params.reason } : {}),
    ...(params.chainId !== undefined ? { chainId: params.chainId } : {}),
  });
}

export function buildArbitratorCommitVotePlan(params: {
  arbitratorAddress: string;
  disputeId: string | number | bigint;
  commitHash?: string;
  round?: string | number | bigint;
  voterAddress?: string;
  choice?: string | number | bigint;
  reason?: string;
  salt?: string;
  chainId?: string | number | bigint;
}): ArbitratorActionPlan {
  const arbitratorAddress = normalizeEvmAddress(params.arbitratorAddress, "arbitratorAddress");
  const disputeId = normalizeUint(params.disputeId, "disputeId");
  const voter = params.voterAddress
    ? normalizeEvmAddress(params.voterAddress, "voterAddress")
    : undefined;
  const commitHash = resolveCommitHash({
    arbitratorAddress,
    disputeId,
    ...(voter ? { voterAddress: voter } : {}),
    ...(params.choice !== undefined ? { choice: params.choice } : {}),
    ...(params.reason !== undefined ? { reason: params.reason } : {}),
    ...(params.salt !== undefined ? { salt: params.salt } : {}),
    ...(params.round !== undefined ? { round: params.round } : {}),
    ...(params.chainId !== undefined ? { chainId: params.chainId } : {}),
    ...(params.commitHash !== undefined ? { commitHash: params.commitHash } : {}),
  });

  return {
    family: "arbitrator",
    action: "commitVote",
    arbitratorAddress,
    disputeId,
    ...(voter ? { voter } : {}),
    commitHash,
    ...buildArbitratorPlan({
      summary: "Commit a vote hash for the current arbitrator round.",
      arbitratorAddress,
      callLabel: "Commit vote hash",
      functionName: "commitVote",
      args: [disputeId, commitHash],
      expectedEvents: ["VoteCommitted"],
    }),
  };
}

export function buildArbitratorCommitVoteForPlan(params: {
  arbitratorAddress: string;
  disputeId: string | number | bigint;
  voterAddress: string;
  commitHash?: string;
  round?: string | number | bigint;
  choice?: string | number | bigint;
  reason?: string;
  salt?: string;
  chainId?: string | number | bigint;
}): ArbitratorActionPlan {
  const arbitratorAddress = normalizeEvmAddress(params.arbitratorAddress, "arbitratorAddress");
  const disputeId = normalizeUint(params.disputeId, "disputeId");
  const voter = normalizeEvmAddress(params.voterAddress, "voterAddress");
  const commitHash = resolveCommitHash({
    arbitratorAddress,
    disputeId,
    voterAddress: voter,
    ...(params.choice !== undefined ? { choice: params.choice } : {}),
    ...(params.reason !== undefined ? { reason: params.reason } : {}),
    ...(params.salt !== undefined ? { salt: params.salt } : {}),
    ...(params.round !== undefined ? { round: params.round } : {}),
    ...(params.chainId !== undefined ? { chainId: params.chainId } : {}),
    ...(params.commitHash !== undefined ? { commitHash: params.commitHash } : {}),
  });

  return {
    family: "arbitrator",
    action: "commitVoteFor",
    arbitratorAddress,
    disputeId,
    voter,
    commitHash,
    ...buildArbitratorPlan({
      summary: "Commit a delegated vote hash for the current arbitrator round.",
      arbitratorAddress,
      callLabel: "Commit delegated vote hash",
      functionName: "commitVoteFor",
      args: [disputeId, voter, commitHash],
      expectedEvents: ["VoteCommitted"],
    }),
  };
}

export function buildArbitratorRevealVotePlan(params: {
  arbitratorAddress: string;
  disputeId: string | number | bigint;
  voterAddress: string;
  choice: string | number | bigint;
  reason?: string;
  salt: string;
}): ArbitratorActionPlan {
  const arbitratorAddress = normalizeEvmAddress(params.arbitratorAddress, "arbitratorAddress");
  const disputeId = normalizeUint(params.disputeId, "disputeId");
  const voter = normalizeEvmAddress(params.voterAddress, "voterAddress");
  const choice = normalizeUint(params.choice, "choice");
  const reason = normalizeText(params.reason ?? "", "reason");
  const salt = normalizeBytes32(params.salt, "salt");

  return {
    family: "arbitrator",
    action: "revealVote",
    arbitratorAddress,
    disputeId,
    voter,
    ...buildArbitratorPlan({
      summary: "Reveal a previously committed arbitrator vote.",
      arbitratorAddress,
      callLabel: "Reveal vote",
      functionName: "revealVote",
      args: [disputeId, voter, choice, reason, salt],
      expectedEvents: ["VoteRevealed"],
    }),
  };
}

export function buildArbitratorExecuteRulingPlan(params: {
  arbitratorAddress: string;
  disputeId: string | number | bigint;
}): ArbitratorActionPlan {
  const arbitratorAddress = normalizeEvmAddress(params.arbitratorAddress, "arbitratorAddress");
  const disputeId = normalizeUint(params.disputeId, "disputeId");

  return {
    family: "arbitrator",
    action: "executeRuling",
    arbitratorAddress,
    disputeId,
    ...buildArbitratorPlan({
      summary: "Execute the solved arbitrator ruling and call back into the arbitrable TCR.",
      arbitratorAddress,
      callLabel: "Execute ruling",
      functionName: "executeRuling",
      args: [disputeId],
      expectedEvents: [
        "DisputeExecuted",
        "Ruling",
        "ItemStatusChange",
        "SubmissionDepositTransferred",
      ],
    }),
  };
}

export function buildArbitratorWithdrawVoterRewardsPlan(params: {
  arbitratorAddress: string;
  disputeId: string | number | bigint;
  round: string | number | bigint;
  voterAddress: string;
}): ArbitratorActionPlan {
  const arbitratorAddress = normalizeEvmAddress(params.arbitratorAddress, "arbitratorAddress");
  const disputeId = normalizeUint(params.disputeId, "disputeId");
  const round = normalizeUint(params.round, "round");
  const voter = normalizeEvmAddress(params.voterAddress, "voterAddress");

  return {
    family: "arbitrator",
    action: "withdrawVoterRewards",
    arbitratorAddress,
    disputeId,
    round,
    voter,
    ...buildArbitratorPlan({
      summary: "Withdraw arbitrator round rewards for a voter.",
      arbitratorAddress,
      callLabel: "Withdraw voter rewards",
      functionName: "withdrawVoterRewards",
      args: [disputeId, round, voter],
      expectedEvents: ["RewardWithdrawn", "SlashRewardsWithdrawn"],
    }),
  };
}

export function buildArbitratorWithdrawInvalidRoundRewardsPlan(params: {
  arbitratorAddress: string;
  disputeId: string | number | bigint;
  round: string | number | bigint;
}): ArbitratorActionPlan {
  const arbitratorAddress = normalizeEvmAddress(params.arbitratorAddress, "arbitratorAddress");
  const disputeId = normalizeUint(params.disputeId, "disputeId");
  const round = normalizeUint(params.round, "round");

  return {
    family: "arbitrator",
    action: "withdrawInvalidRoundRewards",
    arbitratorAddress,
    disputeId,
    round,
    ...buildArbitratorPlan({
      summary: "Withdraw invalid-round rewards to the configured sink when no votes were cast.",
      arbitratorAddress,
      callLabel: "Withdraw invalid-round rewards",
      functionName: "withdrawInvalidRoundRewards",
      args: [disputeId, round],
      expectedEvents: [],
    }),
  };
}

export function buildArbitratorSlashVoterPlan(params: {
  arbitratorAddress: string;
  disputeId: string | number | bigint;
  round: string | number | bigint;
  voterAddress: string;
}): ArbitratorActionPlan {
  const arbitratorAddress = normalizeEvmAddress(params.arbitratorAddress, "arbitratorAddress");
  const disputeId = normalizeUint(params.disputeId, "disputeId");
  const round = normalizeUint(params.round, "round");
  const voter = normalizeEvmAddress(params.voterAddress, "voterAddress");

  return {
    family: "arbitrator",
    action: "slashVoter",
    arbitratorAddress,
    disputeId,
    round,
    voter,
    ...buildArbitratorPlan({
      summary: "Permissionlessly process slashing for a solved arbitrator round voter.",
      arbitratorAddress,
      callLabel: "Slash voter",
      functionName: "slashVoter",
      args: [disputeId, round, voter],
      expectedEvents: ["VoterSlashed"],
    }),
  };
}

export function buildArbitratorSlashVotersPlan(params: {
  arbitratorAddress: string;
  disputeId: string | number | bigint;
  round: string | number | bigint;
  voterAddresses: readonly string[];
}): ArbitratorActionPlan {
  const arbitratorAddress = normalizeEvmAddress(params.arbitratorAddress, "arbitratorAddress");
  const disputeId = normalizeUint(params.disputeId, "disputeId");
  const round = normalizeUint(params.round, "round");
  if (params.voterAddresses.length === 0) {
    throw new Error("voterAddresses must contain at least one address.");
  }
  const voters = params.voterAddresses.map((address, index) =>
    normalizeEvmAddress(address, `voterAddresses[${index}]`)
  );

  return {
    family: "arbitrator",
    action: "slashVoters",
    arbitratorAddress,
    disputeId,
    round,
    ...buildArbitratorPlan({
      summary: "Permissionlessly batch-process voter slashing for a solved arbitrator round.",
      arbitratorAddress,
      callLabel: "Slash voters",
      functionName: "slashVoters",
      args: [disputeId, round, voters],
      expectedEvents: ["VoterSlashed"],
    }),
  };
}

export function decodeTcrReceiptEvents(logs: readonly unknown[]): TcrReceiptEvent[] {
  const parsed = parseEventLogs({
    abi: tcrReceiptAbi,
    logs: logs as any[],
    strict: false,
  });

  const events: TcrReceiptEvent[] = [];

  for (const log of parsed) {
    const args = (log.args ?? {}) as Record<string, unknown>;
    const base = buildReceiptBase(log);

    switch (log.eventName) {
      case "Dispute":
        events.push({
          family: "tcr",
          eventName: "Dispute",
          ...base,
          arbitrator: normalizeEvmAddress(String(args._arbitrator), "args._arbitrator"),
          disputeId: normalizeBigIntFromUnknown(args._disputeID, "args._disputeID"),
          metaEvidenceId: normalizeBigIntFromUnknown(
            args._metaEvidenceID,
            "args._metaEvidenceID"
          ),
          evidenceGroupId: normalizeBigIntFromUnknown(
            args._evidenceGroupID,
            "args._evidenceGroupID"
          ),
          itemId: normalizeBytes32(String(args._itemID), "args._itemID"),
          requestIndex: normalizeBigIntFromUnknown(args._requestIndex, "args._requestIndex"),
          challenger: normalizeEvmAddress(String(args._challenger), "args._challenger"),
        });
        break;
      case "Evidence":
        events.push({
          family: "tcr",
          eventName: "Evidence",
          ...base,
          arbitrator: normalizeEvmAddress(String(args._arbitrator), "args._arbitrator"),
          evidenceGroupId: normalizeBigIntFromUnknown(
            args._evidenceGroupID,
            "args._evidenceGroupID"
          ),
          party: normalizeEvmAddress(String(args._party), "args._party"),
          evidence: normalizeText(args._evidence, "args._evidence"),
        });
        break;
      case "ItemStatusChange":
        events.push({
          family: "tcr",
          eventName: "ItemStatusChange",
          ...base,
          itemId: normalizeBytes32(String(args._itemID), "args._itemID"),
          requestIndex: normalizeBigIntFromUnknown(args._requestIndex, "args._requestIndex"),
          roundIndex: normalizeBigIntFromUnknown(args._roundIndex, "args._roundIndex"),
          disputed: normalizeBool(args._disputed, "args._disputed"),
          resolved: normalizeBool(args._resolved, "args._resolved"),
          itemStatus: normalizeItemStatusFromUnknown(args._itemStatus, "args._itemStatus"),
        });
        break;
      case "ItemSubmitted":
        events.push({
          family: "tcr",
          eventName: "ItemSubmitted",
          ...base,
          itemId: normalizeBytes32(String(args._itemID), "args._itemID"),
          submitter: normalizeEvmAddress(String(args._submitter), "args._submitter"),
          evidenceGroupId: normalizeBigIntFromUnknown(
            args._evidenceGroupID,
            "args._evidenceGroupID"
          ),
          data: normalizeHexData(String(args._data), "args._data", false),
        });
        break;
      case "RequestEvidenceGroupID":
        events.push({
          family: "tcr",
          eventName: "RequestEvidenceGroupID",
          ...base,
          itemId: normalizeBytes32(String(args._itemID), "args._itemID"),
          requestIndex: normalizeBigIntFromUnknown(args._requestIndex, "args._requestIndex"),
          evidenceGroupId: normalizeBigIntFromUnknown(
            args._evidenceGroupID,
            "args._evidenceGroupID"
          ),
        });
        break;
      case "RequestSubmitted":
        events.push({
          family: "tcr",
          eventName: "RequestSubmitted",
          ...base,
          itemId: normalizeBytes32(String(args._itemID), "args._itemID"),
          requestIndex: normalizeBigIntFromUnknown(args._requestIndex, "args._requestIndex"),
          requestType: normalizeRequestTypeFromUnknown(args._requestType, "args._requestType"),
          requester: normalizeEvmAddress(String(args._requester), "args._requester"),
        });
        break;
      case "Ruling":
        events.push({
          family: "tcr",
          eventName: "Ruling",
          ...base,
          arbitrator: normalizeEvmAddress(String(args._arbitrator), "args._arbitrator"),
          disputeId: normalizeBigIntFromUnknown(args._disputeID, "args._disputeID"),
          ruling: normalizePartyFromUnknown(args._ruling, "args._ruling"),
        });
        break;
      case "SubmissionDepositPaid":
        events.push({
          family: "tcr",
          eventName: "SubmissionDepositPaid",
          ...base,
          itemId: normalizeBytes32(String(args.itemID), "args.itemID"),
          payer: normalizeEvmAddress(String(args.payer), "args.payer"),
          amount: normalizeBigIntFromUnknown(args.amount, "args.amount"),
        });
        break;
      case "SubmissionDepositTransferred":
        events.push({
          family: "tcr",
          eventName: "SubmissionDepositTransferred",
          ...base,
          itemId: normalizeBytes32(String(args.itemID), "args.itemID"),
          recipient: normalizeEvmAddress(String(args.recipient), "args.recipient"),
          amount: normalizeBigIntFromUnknown(args.amount, "args.amount"),
          requestType: normalizeItemStatusFromUnknown(args.requestType, "args.requestType"),
          ruling: normalizePartyFromUnknown(args.ruling, "args.ruling"),
        });
        break;
    }
  }

  return events;
}

export function decodeArbitratorReceiptEvents(logs: readonly unknown[]): ArbitratorReceiptEvent[] {
  const parsed = parseEventLogs({
    abi: arbitratorReceiptAbi,
    logs: logs as any[],
    strict: false,
  });

  const events: ArbitratorReceiptEvent[] = [];

  for (const log of parsed) {
    const args = (log.args ?? {}) as Record<string, unknown>;
    const base = buildReceiptBase(log);

    switch (log.eventName) {
      case "DisputeCreated":
        events.push({
          family: "arbitrator",
          eventName: "DisputeCreated",
          ...base,
          disputeId: normalizeBigIntFromUnknown(args.id, "args.id"),
          arbitrable: normalizeEvmAddress(String(args.arbitrable), "args.arbitrable"),
          votingStartTime: normalizeBigIntFromUnknown(
            args.votingStartTime,
            "args.votingStartTime"
          ),
          votingEndTime: normalizeBigIntFromUnknown(args.votingEndTime, "args.votingEndTime"),
          revealPeriodEndTime: normalizeBigIntFromUnknown(
            args.revealPeriodEndTime,
            "args.revealPeriodEndTime"
          ),
          creationBlock: normalizeBigIntFromUnknown(args.creationBlock, "args.creationBlock"),
          arbitrationCost: normalizeBigIntFromUnknown(
            args.arbitrationCost,
            "args.arbitrationCost"
          ),
          extraData: normalizeHexData(String(args.extraData), "args.extraData"),
          choices: normalizeBigIntFromUnknown(args.choices, "args.choices"),
        });
        break;
      case "DisputeCreation":
        events.push({
          family: "arbitrator",
          eventName: "DisputeCreation",
          ...base,
          disputeId: normalizeBigIntFromUnknown(args._disputeID, "args._disputeID"),
          arbitrable: normalizeEvmAddress(String(args._arbitrable), "args._arbitrable"),
        });
        break;
      case "DisputeExecuted":
        events.push({
          family: "arbitrator",
          eventName: "DisputeExecuted",
          ...base,
          disputeId: normalizeBigIntFromUnknown(args.disputeId, "args.disputeId"),
          ruling: normalizePartyFromUnknown(args.ruling, "args.ruling"),
        });
        break;
      case "RewardWithdrawn":
        events.push({
          family: "arbitrator",
          eventName: "RewardWithdrawn",
          ...base,
          disputeId: normalizeBigIntFromUnknown(args.disputeId, "args.disputeId"),
          round: normalizeBigIntFromUnknown(args.round, "args.round"),
          voter: normalizeEvmAddress(String(args.voter), "args.voter"),
          amount: normalizeBigIntFromUnknown(args.amount, "args.amount"),
        });
        break;
      case "SlashRewardsWithdrawn":
        events.push({
          family: "arbitrator",
          eventName: "SlashRewardsWithdrawn",
          ...base,
          disputeId: normalizeBigIntFromUnknown(args.disputeId, "args.disputeId"),
          round: normalizeBigIntFromUnknown(args.round, "args.round"),
          voter: normalizeEvmAddress(String(args.voter), "args.voter"),
          goalAmount: normalizeBigIntFromUnknown(args.goalAmount, "args.goalAmount"),
          cobuildAmount: normalizeBigIntFromUnknown(args.cobuildAmount, "args.cobuildAmount"),
        });
        break;
      case "VoteCommitted":
        events.push({
          family: "arbitrator",
          eventName: "VoteCommitted",
          ...base,
          voter: normalizeEvmAddress(String(args.voter), "args.voter"),
          disputeId: normalizeBigIntFromUnknown(args.disputeId, "args.disputeId"),
          commitHash: normalizeBytes32(String(args.commitHash), "args.commitHash"),
        });
        break;
      case "VoteRevealed":
        events.push({
          family: "arbitrator",
          eventName: "VoteRevealed",
          ...base,
          voter: normalizeEvmAddress(String(args.voter), "args.voter"),
          disputeId: normalizeBigIntFromUnknown(args.disputeId, "args.disputeId"),
          commitHash: normalizeBytes32(String(args.commitHash), "args.commitHash"),
          choice: normalizeBigIntFromUnknown(args.choice, "args.choice"),
          reason: normalizeText(args.reason, "args.reason"),
          votes: normalizeBigIntFromUnknown(args.votes, "args.votes"),
        });
        break;
      case "VoterSlashed":
        events.push({
          family: "arbitrator",
          eventName: "VoterSlashed",
          ...base,
          disputeId: normalizeBigIntFromUnknown(args.disputeId, "args.disputeId"),
          round: normalizeBigIntFromUnknown(args.round, "args.round"),
          voter: normalizeEvmAddress(String(args.voter), "args.voter"),
          snapshotVotes: normalizeBigIntFromUnknown(args.snapshotVotes, "args.snapshotVotes"),
          slashWeight: normalizeBigIntFromUnknown(args.slashWeight, "args.slashWeight"),
          missedReveal: normalizeBool(args.missedReveal, "args.missedReveal"),
          recipient: normalizeEvmAddress(String(args.recipient), "args.recipient"),
        });
        break;
    }
  }

  return events;
}

export function decodeGovernanceReceiptEvents(logs: readonly unknown[]): GovernanceReceiptEvent[] {
  return sortReceiptEvents([
    ...decodeTcrReceiptEvents(logs),
    ...decodeArbitratorReceiptEvents(logs),
  ]);
}

export function serializeGovernanceReceiptEvents(
  events: readonly GovernanceReceiptEvent[]
): readonly Record<string, unknown>[] {
  return serializeProtocolBigInts(events) as readonly Record<string, unknown>[];
}

export { roundSubmissionTcrAbi };
