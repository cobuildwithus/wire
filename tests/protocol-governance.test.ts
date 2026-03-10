import { describe, expect, it } from "vitest";
import {
  encodeAbiParameters,
  encodeEventTopics,
  encodeFunctionData,
  encodePacked,
  keccak256,
} from "viem";
import {
  ARBITRABLE_PARTY,
  TCR_ITEM_STATUS,
  budgetTcrAbi,
  buildAllocationMechanismAddListingPlan,
  buildAllocationMechanismTcrAddListingPlan,
  buildArbitratorCommitVoteForPlan,
  buildArbitratorCommitVotePlan,
  buildArbitratorExecuteRulingPlan,
  buildArbitratorRevealVotePlan,
  buildArbitratorSlashVoterPlan,
  buildArbitratorSlashVotersPlan,
  buildArbitratorWithdrawInvalidRoundRewardsPlan,
  buildArbitratorWithdrawVoterRewardsPlan,
  buildTcrAddItemPlan,
  buildBudgetTcrAddListingPlan,
  buildRoundSubmissionAddItemPlan,
  buildRoundSubmissionTcrAddSubmissionPlan,
  buildTcrChallengeRequestPlan,
  buildTcrExecuteRequestPlan,
  buildTcrExecuteRequestTimeoutPlan,
  buildTcrRemoveItemPlan,
  buildTcrSubmitEvidencePlan,
  buildTcrWithdrawFeesAndRewardsPlan,
  computeArbitratorCommitHash,
  decodeArbitratorReceiptEvents,
  decodeTcrReceiptEvents,
  decodeAllocationMechanismListing,
  decodeBudgetTcrListing,
  decodeGovernanceReceiptEvents,
  decodeRoundSubmission,
  deriveAllocationMechanismItemId,
  deriveBudgetTcrItemId,
  deriveRoundSubmissionItemId,
  encodeAllocationMechanismListing,
  encodeBudgetTcrListing,
  encodeRoundSubmission,
  erc20VotesArbitratorAbi,
  getTcrRequiredApprovalAmount,
  normalizeAllocationMechanismListing,
  normalizeBudgetTcrListing,
  normalizeGeneralizedTcrTotalCosts,
  normalizeRoundSubmission,
  normalizeTcrRequestType,
  serializeGovernanceReceiptEvents,
} from "../src/index.js";

const REGISTRY = "0x1111111111111111111111111111111111111111";
const DEPOSIT_TOKEN = "0x2222222222222222222222222222222222222222";
const ARBITRATOR = "0x3333333333333333333333333333333333333333";
const VOTER = "0x4444444444444444444444444444444444444444";
const BENEFICIARY = "0x5555555555555555555555555555555555555555";
const CHALLENGER = "0x6666666666666666666666666666666666666666";
const RECIPIENT = "0x7777777777777777777777777777777777777777";
const MECHANISM_FACTORY = "0x8888888888888888888888888888888888888888";
const SALT = "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
const POST_ID = "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb";

const tcrCosts = {
  addItemCost: 100n,
  removeItemCost: 200n,
  challengeSubmissionCost: 300n,
  challengeRemovalCost: 400n,
  arbitrationCost: 50n,
} as const;

const budgetListing = {
  metadata: {
    title: "Budget A",
    description: "Core budget",
    image: "ipfs://budget-image",
    tagline: "Grow it",
    url: "https://example.com/budget",
  },
  fundingDeadline: 1_800_000_000n,
  executionDuration: 86_400n,
  activationThreshold: 1_000n,
  runwayCap: 5_000n,
  oracleConfig: {
    oracleSpecHash: "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    assertionPolicyHash:
      "0xcccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc",
  },
} as const;

const mechanismListing = {
  metadata: {
    title: "Round Router",
    description: "Mechanism listing",
    image: "ipfs://mechanism-image",
    tagline: "Ship rounds",
    url: "https://example.com/mechanism",
  },
  duration: 7_200n,
  fundingDeadline: 1_800_000_111n,
  minBudgetFunding: 100n,
  maxBudgetFunding: 500n,
  deploymentConfig: {
    mechanismFactory: MECHANISM_FACTORY,
    mechanismConfig: "0x1234",
  },
} as const;

const roundSubmission = {
  source: 1,
  postId: POST_ID,
  recipient: RECIPIENT,
} as const;

function buildEventLog(params: {
  abi: readonly unknown[];
  address: string;
  eventName: string;
  args: Record<string, unknown>;
  logIndex: number;
}) {
  const event = params.abi.find(
    (entry) => typeof entry === "object" && entry !== null && (entry as any).type === "event" && (entry as any).name === params.eventName
  );
  if (!event || (event as any).type !== "event") {
    throw new Error(`Missing event ${params.eventName}`);
  }

  return {
    address: params.address,
    blockHash: "0xdddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd",
    blockNumber: 1n,
    data: encodeAbiParameters(
      (event as any).inputs.filter((input: any) => !input.indexed),
      (event as any).inputs
        .filter((input: any) => !input.indexed)
        .map((input: any) => params.args[input.name]) as readonly unknown[]
    ),
    logIndex: params.logIndex,
    removed: false,
    topics: encodeEventTopics({
      abi: [event as any],
      eventName: params.eventName as any,
      args: Object.fromEntries(
        (event as any).inputs
          .filter((input: any) => input.indexed)
          .map((input: any) => [input.name, params.args[input.name]])
      ),
    }),
    transactionHash: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    transactionIndex: 0,
  } as const;
}

describe("protocol governance contract", () => {
  it("encodes, decodes, and derives item IDs for the listing payloads", () => {
    const encodedBudgetListing = encodeBudgetTcrListing(budgetListing);
    expect(decodeBudgetTcrListing(encodedBudgetListing)).toEqual(budgetListing);
    expect(deriveBudgetTcrItemId(budgetListing)).toBe(keccak256(encodedBudgetListing));

    const encodedMechanismListing = encodeAllocationMechanismListing(mechanismListing);
    expect(decodeAllocationMechanismListing(encodedMechanismListing)).toEqual(mechanismListing);
    expect(deriveAllocationMechanismItemId(mechanismListing)).toBe(
      keccak256(encodedMechanismListing)
    );

    const encodedSubmission = encodeRoundSubmission(roundSubmission);
    expect(decodeRoundSubmission(encodedSubmission)).toEqual(roundSubmission);
    expect(deriveRoundSubmissionItemId(roundSubmission)).toBe(
      keccak256(encodePacked(["uint8", "bytes32"], [roundSubmission.source, POST_ID]))
    );
  });

  it("builds typed TCR plans for submission and lifecycle writes", () => {
    const addPlan = buildBudgetTcrAddListingPlan({
      registryAddress: REGISTRY,
      depositTokenAddress: DEPOSIT_TOKEN,
      listing: budgetListing,
      costs: tcrCosts,
    });

    expect(addPlan.family).toBe("tcr");
    expect(addPlan.action).toBe("addItem");
    expect(addPlan.itemId).toBe(deriveBudgetTcrItemId(budgetListing));
    expect(addPlan.expectedEvents).toEqual([
      "ItemSubmitted",
      "RequestSubmitted",
      "RequestEvidenceGroupID",
      "ItemStatusChange",
      "SubmissionDepositPaid",
    ]);
    expect(addPlan.steps[0]).toMatchObject({
      kind: "erc20-approval",
      tokenAddress: DEPOSIT_TOKEN,
      spenderAddress: REGISTRY,
      amount: "100",
    });
    expect(addPlan.steps[1]).toMatchObject({
      kind: "contract-call",
      functionName: "addItem",
    });
    const submitStep = addPlan.steps[1];
    if (!submitStep) {
      throw new Error("missing submit step");
    }
    expect(submitStep.transaction.data).toBe(
      encodeFunctionData({
        abi: budgetTcrAbi,
        functionName: "addItem",
        args: [encodeBudgetTcrListing(budgetListing)],
      })
    );

    const mechanismPlan = buildAllocationMechanismAddListingPlan({
      registryAddress: REGISTRY,
      depositTokenAddress: DEPOSIT_TOKEN,
      listing: mechanismListing,
      costs: tcrCosts,
    });
    expect(mechanismPlan.itemId).toBe(deriveAllocationMechanismItemId(mechanismListing));

    const roundPlan = buildRoundSubmissionAddItemPlan({
      registryAddress: REGISTRY,
      depositTokenAddress: DEPOSIT_TOKEN,
      submission: roundSubmission,
      costs: tcrCosts,
    });
    expect(roundPlan.itemId).toBe(deriveRoundSubmissionItemId(roundSubmission));
    expect(
      buildRoundSubmissionTcrAddSubmissionPlan({
        registryAddress: REGISTRY,
        depositTokenAddress: DEPOSIT_TOKEN,
        submission: roundSubmission,
        costs: tcrCosts,
      }).itemId
    ).toBe(roundPlan.itemId);

    expect(
      buildTcrAddItemPlan({
        registryAddress: REGISTRY,
        depositTokenAddress: DEPOSIT_TOKEN,
        itemData: "0x1234",
        costs: tcrCosts,
      }).itemId
    ).toBeUndefined();

    const removePlan = buildTcrRemoveItemPlan({
      registryAddress: REGISTRY,
      depositTokenAddress: DEPOSIT_TOKEN,
      itemId: addPlan.itemId!,
      evidence: "ipfs://remove",
      costs: tcrCosts,
    });
    expect(removePlan.steps[0]).toMatchObject({
      kind: "erc20-approval",
      amount: "200",
    });
    expect(removePlan.expectedEvents).toContain("Evidence");

    const challengePlan = buildTcrChallengeRequestPlan({
      registryAddress: REGISTRY,
      depositTokenAddress: DEPOSIT_TOKEN,
      itemId: addPlan.itemId!,
      requestType: "clearingRequested",
      evidence: "ipfs://challenge",
      costs: tcrCosts,
    });
    expect(challengePlan.requestType).toBe(TCR_ITEM_STATUS.clearingRequested);
    expect(challengePlan.steps[0]).toMatchObject({
      kind: "erc20-approval",
      amount: "400",
    });
    expect(challengePlan.expectedEvents).toEqual([
      "ItemStatusChange",
      "Dispute",
      "Evidence",
      "DisputeCreation",
      "DisputeCreated",
    ]);

    expect(
      buildTcrExecuteRequestPlan({
        registryAddress: REGISTRY,
        itemId: addPlan.itemId!,
      }).steps[0]
    ).toMatchObject({
      kind: "contract-call",
      functionName: "executeRequest",
    });

    expect(
      buildTcrExecuteRequestTimeoutPlan({
        registryAddress: REGISTRY,
        itemId: addPlan.itemId!,
      }).steps[0]
    ).toMatchObject({
      kind: "contract-call",
      functionName: "executeRequestTimeout",
    });

    expect(
      buildTcrSubmitEvidencePlan({
        registryAddress: REGISTRY,
        itemId: addPlan.itemId!,
        evidence: "ipfs://evidence",
      }).steps[0]
    ).toMatchObject({
      kind: "contract-call",
      functionName: "submitEvidence",
    });

    expect(
      buildTcrWithdrawFeesAndRewardsPlan({
        registryAddress: REGISTRY,
        beneficiary: BENEFICIARY,
        itemId: addPlan.itemId!,
        requestIndex: 0n,
        roundIndex: 1n,
      }).steps[0]
    ).toMatchObject({
      kind: "contract-call",
      functionName: "withdrawFeesAndRewards",
    });
  });

  it("computes commit hashes and builds arbitrator plans", () => {
    const expectedCommitHash = keccak256(
      encodeAbiParameters(
        [
          { name: "chainId", type: "uint256" },
          { name: "arbitrator", type: "address" },
          { name: "disputeId", type: "uint256" },
          { name: "round", type: "uint256" },
          { name: "voter", type: "address" },
          { name: "choice", type: "uint256" },
          { name: "reason", type: "string" },
          { name: "salt", type: "bytes32" },
        ],
        [8453n, ARBITRATOR, 9n, 0n, VOTER, 2n, "because", SALT]
      )
    );

    expect(
      computeArbitratorCommitHash({
        arbitratorAddress: ARBITRATOR,
        disputeId: 9n,
        round: 0n,
        voterAddress: VOTER,
        choice: 2n,
        reason: "because",
        salt: SALT,
      })
    ).toBe(expectedCommitHash);

    const commitPlan = buildArbitratorCommitVotePlan({
      arbitratorAddress: ARBITRATOR,
      disputeId: 9n,
      round: 0n,
      voterAddress: VOTER,
      choice: 2n,
      reason: "because",
      salt: SALT,
    });
    expect(commitPlan.commitHash).toBe(expectedCommitHash);
    expect(commitPlan.steps[0]).toMatchObject({
      kind: "contract-call",
      functionName: "commitVote",
    });

    expect(
      buildArbitratorCommitVoteForPlan({
        arbitratorAddress: ARBITRATOR,
        disputeId: 9n,
        voterAddress: VOTER,
        commitHash: expectedCommitHash,
      }).steps[0]
    ).toMatchObject({
      kind: "contract-call",
      functionName: "commitVoteFor",
    });

    expect(
      buildArbitratorRevealVotePlan({
        arbitratorAddress: ARBITRATOR,
        disputeId: 9n,
        voterAddress: VOTER,
        choice: 2n,
        reason: "because",
        salt: SALT,
      }).steps[0]
    ).toMatchObject({
      kind: "contract-call",
      functionName: "revealVote",
    });

    expect(
      buildArbitratorWithdrawVoterRewardsPlan({
        arbitratorAddress: ARBITRATOR,
        disputeId: 9n,
        round: 0n,
        voterAddress: VOTER,
      }).steps[0]
    ).toMatchObject({
      kind: "contract-call",
      functionName: "withdrawVoterRewards",
    });

    expect(
      buildArbitratorWithdrawInvalidRoundRewardsPlan({
        arbitratorAddress: ARBITRATOR,
        disputeId: 9n,
        round: 0n,
      }).steps[0]
    ).toMatchObject({
      kind: "contract-call",
      functionName: "withdrawInvalidRoundRewards",
    });

    expect(
      buildArbitratorSlashVoterPlan({
        arbitratorAddress: ARBITRATOR,
        disputeId: 9n,
        round: 0n,
        voterAddress: VOTER,
      }).steps[0]
    ).toMatchObject({
      kind: "contract-call",
      functionName: "slashVoter",
    });

    expect(
      buildArbitratorSlashVotersPlan({
        arbitratorAddress: ARBITRATOR,
        disputeId: 9n,
        round: 0n,
        voterAddresses: [VOTER, BENEFICIARY],
      }).steps[0]
    ).toMatchObject({
      kind: "contract-call",
      functionName: "slashVoters",
    });

    expect(
      buildArbitratorExecuteRulingPlan({
        arbitratorAddress: ARBITRATOR,
        disputeId: 9n,
      }).expectedEvents
    ).toEqual([
      "DisputeExecuted",
      "Ruling",
      "ItemStatusChange",
      "SubmissionDepositTransferred",
      ]);
  });

  it("covers normalization helpers and validation branches", () => {
    expect(normalizeGeneralizedTcrTotalCosts(tcrCosts)).toEqual(tcrCosts);
    expect(normalizeTcrRequestType("registrationRequested")).toBe(
      TCR_ITEM_STATUS.registrationRequested
    );
    expect(
      getTcrRequiredApprovalAmount({
        action: "challengeRequest",
        requestType: "registrationRequested",
        costs: tcrCosts,
      })
    ).toBe(300n);
    expect(normalizeBudgetTcrListing(budgetListing)).toEqual(budgetListing);
    expect(normalizeAllocationMechanismListing(mechanismListing)).toEqual(mechanismListing);
    expect(normalizeRoundSubmission(roundSubmission)).toEqual(roundSubmission);

    expect(
      buildAllocationMechanismTcrAddListingPlan({
        registryAddress: REGISTRY,
        depositTokenAddress: DEPOSIT_TOKEN,
        listing: mechanismListing,
        costs: tcrCosts,
      }).itemId
    ).toBe(deriveAllocationMechanismItemId(mechanismListing));

    expect(() =>
      normalizeAllocationMechanismListing({
        ...mechanismListing,
        fundingDeadline: 0n,
        minBudgetFunding: 1n,
      })
    ).toThrow("must either both be zero or both be set");
    expect(() =>
      normalizeAllocationMechanismListing({
        ...mechanismListing,
        maxBudgetFunding: 50n,
      })
    ).toThrow("must be zero or greater than or equal to minBudgetFunding");
    expect(() =>
      buildArbitratorSlashVotersPlan({
        arbitratorAddress: ARBITRATOR,
        disputeId: 9n,
        round: 0n,
        voterAddresses: [],
      })
    ).toThrow("must contain at least one address");
    expect(() =>
      buildArbitratorCommitVotePlan({
        arbitratorAddress: ARBITRATOR,
        disputeId: 9n,
        voterAddress: VOTER,
        choice: 1n,
        salt: SALT,
      })
    ).toThrow("round is required");
    expect(() => normalizeTcrRequestType("not-a-request-type")).toThrow(
      "requestType must be registrationRequested (2) or clearingRequested (3)."
    );
  });

  it("decodes mixed governance receipt events and serializes bigint fields", () => {
    const itemId = deriveBudgetTcrItemId(budgetListing);
    const commitHash = computeArbitratorCommitHash({
      arbitratorAddress: ARBITRATOR,
      disputeId: 9n,
      round: 0n,
      voterAddress: VOTER,
      choice: 1n,
      salt: SALT,
    });

    const events = decodeGovernanceReceiptEvents([
      buildEventLog({
        abi: budgetTcrAbi,
        address: REGISTRY,
        eventName: "RequestSubmitted",
        logIndex: 2,
        args: {
          _itemID: itemId,
          _requestIndex: 0n,
          _requestType: TCR_ITEM_STATUS.registrationRequested,
          _requester: BENEFICIARY,
        },
      }),
      buildEventLog({
        abi: budgetTcrAbi,
        address: REGISTRY,
        eventName: "Dispute",
        logIndex: 3,
        args: {
          _arbitrator: ARBITRATOR,
          _disputeID: 9n,
          _metaEvidenceID: 0n,
          _evidenceGroupID: 12n,
          _itemID: itemId,
          _requestIndex: 0n,
          _challenger: CHALLENGER,
        },
      }),
      buildEventLog({
        abi: erc20VotesArbitratorAbi,
        address: ARBITRATOR,
        eventName: "DisputeCreated",
        logIndex: 4,
        args: {
          id: 9n,
          arbitrable: REGISTRY,
          votingStartTime: 100n,
          votingEndTime: 200n,
          revealPeriodEndTime: 300n,
          creationBlock: 400n,
          arbitrationCost: 50n,
          extraData: "0x1234",
          choices: 2n,
        },
      }),
      buildEventLog({
        abi: erc20VotesArbitratorAbi,
        address: ARBITRATOR,
        eventName: "VoteCommitted",
        logIndex: 5,
        args: {
          voter: VOTER,
          disputeId: 9n,
          commitHash,
        },
      }),
      buildEventLog({
        abi: erc20VotesArbitratorAbi,
        address: ARBITRATOR,
        eventName: "RewardWithdrawn",
        logIndex: 6,
        args: {
          disputeId: 9n,
          round: 0n,
          voter: VOTER,
          amount: 17n,
        },
      }),
    ]);

    expect(events.map((event) => event.eventName)).toEqual([
      "RequestSubmitted",
      "Dispute",
      "DisputeCreated",
      "VoteCommitted",
      "RewardWithdrawn",
    ]);

    expect(events[0]).toMatchObject({
      family: "tcr",
      eventName: "RequestSubmitted",
      itemId,
      requestType: TCR_ITEM_STATUS.registrationRequested,
      requester: BENEFICIARY,
    });
    expect(events[1]).toMatchObject({
      family: "tcr",
      eventName: "Dispute",
      disputeId: 9n,
      challenger: CHALLENGER,
    });
    expect(events[2]).toMatchObject({
      family: "arbitrator",
      eventName: "DisputeCreated",
      arbitrable: REGISTRY,
      arbitrationCost: 50n,
    });
    expect(events[3]).toMatchObject({
      family: "arbitrator",
      eventName: "VoteCommitted",
      commitHash,
    });
    expect(events[4]).toMatchObject({
      family: "arbitrator",
      eventName: "RewardWithdrawn",
      amount: 17n,
    });

    expect(serializeGovernanceReceiptEvents(events)).toMatchObject([
      {
        requestIndex: "0",
        requestType: 2,
      },
      {
        evidenceGroupId: "12",
      },
      {
        arbitrationCost: "50",
      },
      {
        commitHash,
      },
      {
        amount: "17",
      },
    ]);
  });

  it("decodes the remaining TCR and arbitrator event families", () => {
    const itemId = deriveBudgetTcrItemId(budgetListing);

    expect(
      decodeTcrReceiptEvents([
        buildEventLog({
          abi: budgetTcrAbi,
          address: REGISTRY,
          eventName: "ItemSubmitted",
          logIndex: 1,
          args: {
            _itemID: itemId,
            _submitter: BENEFICIARY,
            _evidenceGroupID: 1n,
            _data: encodeBudgetTcrListing(budgetListing),
          },
        }),
        buildEventLog({
          abi: budgetTcrAbi,
          address: REGISTRY,
          eventName: "RequestEvidenceGroupID",
          logIndex: 2,
          args: {
            _itemID: itemId,
            _requestIndex: 0n,
            _evidenceGroupID: 1n,
          },
        }),
        buildEventLog({
          abi: budgetTcrAbi,
          address: REGISTRY,
          eventName: "Evidence",
          logIndex: 3,
          args: {
            _arbitrator: ARBITRATOR,
            _evidenceGroupID: 1n,
            _party: BENEFICIARY,
            _evidence: "ipfs://evidence",
          },
        }),
        buildEventLog({
          abi: budgetTcrAbi,
          address: REGISTRY,
          eventName: "Ruling",
          logIndex: 4,
          args: {
            _arbitrator: ARBITRATOR,
            _disputeID: 9n,
            _ruling: ARBITRABLE_PARTY.requester,
          },
        }),
        buildEventLog({
          abi: budgetTcrAbi,
          address: REGISTRY,
          eventName: "SubmissionDepositPaid",
          logIndex: 5,
          args: {
            itemID: itemId,
            payer: BENEFICIARY,
            amount: 100n,
          },
        }),
        buildEventLog({
          abi: budgetTcrAbi,
          address: REGISTRY,
          eventName: "SubmissionDepositTransferred",
          logIndex: 6,
          args: {
            itemID: itemId,
            recipient: BENEFICIARY,
            amount: 100n,
            requestType: TCR_ITEM_STATUS.registrationRequested,
            ruling: ARBITRABLE_PARTY.requester,
          },
        }),
      ]).map((event) => event.eventName)
    ).toEqual([
      "ItemSubmitted",
      "RequestEvidenceGroupID",
      "Evidence",
      "Ruling",
      "SubmissionDepositPaid",
      "SubmissionDepositTransferred",
    ]);

    expect(
      decodeArbitratorReceiptEvents([
        buildEventLog({
          abi: erc20VotesArbitratorAbi,
          address: ARBITRATOR,
          eventName: "DisputeCreation",
          logIndex: 1,
          args: {
            _disputeID: 9n,
            _arbitrable: REGISTRY,
          },
        }),
        buildEventLog({
          abi: erc20VotesArbitratorAbi,
          address: ARBITRATOR,
          eventName: "DisputeExecuted",
          logIndex: 2,
          args: {
            disputeId: 9n,
            ruling: ARBITRABLE_PARTY.requester,
          },
        }),
        buildEventLog({
          abi: erc20VotesArbitratorAbi,
          address: ARBITRATOR,
          eventName: "SlashRewardsWithdrawn",
          logIndex: 3,
          args: {
            disputeId: 9n,
            round: 0n,
            voter: VOTER,
            goalAmount: 2n,
            cobuildAmount: 3n,
          },
        }),
        buildEventLog({
          abi: erc20VotesArbitratorAbi,
          address: ARBITRATOR,
          eventName: "VoteRevealed",
          logIndex: 4,
          args: {
            voter: VOTER,
            disputeId: 9n,
            commitHash: computeArbitratorCommitHash({
              arbitratorAddress: ARBITRATOR,
              disputeId: 9n,
              round: 0n,
              voterAddress: VOTER,
              choice: 1n,
              salt: SALT,
            }),
            choice: 1n,
            reason: "revealed",
            votes: 11n,
          },
        }),
        buildEventLog({
          abi: erc20VotesArbitratorAbi,
          address: ARBITRATOR,
          eventName: "VoterSlashed",
          logIndex: 5,
          args: {
            disputeId: 9n,
            round: 0n,
            voter: VOTER,
            snapshotVotes: 11n,
            slashWeight: 2n,
            missedReveal: false,
            recipient: BENEFICIARY,
          },
        }),
      ]).map((event) => event.eventName)
    ).toEqual([
      "DisputeCreation",
      "DisputeExecuted",
      "SlashRewardsWithdrawn",
      "VoteRevealed",
      "VoterSlashed",
    ]);
  });
});
