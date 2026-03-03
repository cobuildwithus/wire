import { parseAbi } from "viem";
import * as generated from "./generated/abis.js";

const generatedMap = generated as unknown as Record<string, unknown>;

/**
 * Resolves ABI constants from Wagmi-generated Basescan output and
 * falls back to canonical static event ABIs for pre-deploy workflows.
 */
export function resolveGeneratedOrFallbackAbi<TAbi extends readonly unknown[]>(
  generatedExport: string,
  fallbackAbi: TAbi
): TAbi {
  const generatedAbi = generatedMap[generatedExport];
  return (Array.isArray(generatedAbi) ? generatedAbi : fallbackAbi) as TAbi;
}

export { cobuildSwapImplAbi, cobuildSwapImplAddress, cobuildSwapImplConfig } from "./generated/abis.js";

const fallbackFlowAbi = parseAbi([
  "event AllocationCommitted(address indexed strategy, uint256 indexed allocationKey, bytes32 commit, uint256 weight)",
  "event AllocationSnapshotUpdated(address indexed strategy, uint256 indexed allocationKey, bytes32 commit, uint256 weight, uint8 snapshotVersion, bytes packedSnapshot)",
  "event ChildFlowDeployed(bytes32 indexed recipientId, address indexed recipient, address indexed strategy, address recipientAdmin, address flowOperator, address sweeper, address managerRewardPool)",
  "event FlowInitialized(address indexed recipientAdmin, address indexed superToken, address indexed flowImplementation, address flowOperator, address sweeper, address managerRewardPool, address allocationPipeline, address parent, address distributionPool, uint32 managerRewardPoolFlowRatePpm, address strategy)",
  "event FlowRecipientCreated(bytes32 indexed recipientId, address indexed recipient, address distributionPool, uint32 managerRewardPoolFlowRatePpm)",
  "event Initialized(uint64 version)",
  "event MetadataSet((string title, string description, string image, string tagline, string url) metadata)",
  "event RecipientCreated(bytes32 indexed recipientId, (address recipient, uint32 recipientIndexPlusOne, bool isRemoved, uint8 recipientType, (string title, string description, string image, string tagline, string url) metadata) recipient, address indexed approvedBy)",
  "event RecipientRemoved(address indexed recipient, bytes32 indexed recipientId)",
  "event SuperTokenSwept(address indexed caller, address indexed to, uint256 amount)",
  "event TargetOutflowRateUpdated(address indexed caller, int96 oldRate, int96 newRate)",
  "event TargetOutflowRefreshFailed(int96 targetOutflowRate, bytes reason)",
] as const);

export const flowAbi = resolveGeneratedOrFallbackAbi("flowAbi", fallbackFlowAbi);

const fallbackGoalTreasuryAbi = parseAbi([
  "event DonationRecorded(address indexed donor, address indexed sourceToken, uint256 sourceAmount, uint256 superTokenAmount, uint256 totalRaised)",
  "event FlowRateSyncCallFailed(address indexed flow, bytes4 indexed selector, int96 attemptedRate, bytes reason)",
  "event FlowRateSyncManualInterventionRequired(address indexed flow, int96 targetRate, int96 fallbackRate, int96 currentRate)",
  "event FlowRateSynced(int96 targetRate, int96 appliedRate, uint256 treasuryBalance, uint256 timeRemaining)",
  "event FlowRateZeroingFailed(address indexed flow, bytes reason)",
  "event GoalConfigured(address indexed owner, address flow, address stakeVault, address budgetStakeLedger, address hook, address goalRulesets, uint256 goalRevnetId, uint64 minRaiseDeadline, uint64 deadline, uint256 minRaise)",
  "event GoalFinalized(uint8 finalState)",
  "event HookDeferredFundingSettled(uint8 indexed finalState, uint256 superTokenAmount, uint256 controllerBurnAmount)",
  "event HookFundingDeferred(address indexed sourceToken, uint256 sourceAmount, uint256 superTokenAmount, uint256 totalDeferredSuperTokenAmount)",
  "event HookFundingRecorded(uint256 amount, uint256 totalRaised)",
  "event Initialized(uint64 version)",
  "event JurorSlasherConfigured(address indexed authority, address indexed slasher)",
  "event ReassertGraceActivated(bytes32 indexed clearedAssertionId, uint64 indexed graceDeadline)",
  "event ResidualSettled(uint8 indexed finalState, uint256 totalSettled, uint256 controllerBurnAmount)",
  "event StateTransition(uint8 previousState, uint8 newState)",
  "event SuccessAssertionCleared(bytes32 indexed assertionId)",
  "event SuccessAssertionRegistered(bytes32 indexed assertionId, uint64 indexed assertedAt)",
  "event SuccessAssertionResolutionFailClosed(bytes32 indexed assertionId, uint8 indexed reason)",
  "event TerminalSideEffectFailed(uint8 indexed operation, bytes reason)",
  "event UnderwriterSlasherConfigured(address indexed authority, address indexed slasher)",
] as const);

export const goalTreasuryAbi = resolveGeneratedOrFallbackAbi("goalTreasuryAbi", fallbackGoalTreasuryAbi);

const fallbackBudgetTreasuryAbi = parseAbi([
  "event BudgetConfigured(address indexed controller, address flow, uint64 fundingDeadline, uint64 executionDuration, uint256 activationThreshold, uint256 runwayCap)",
  "event BudgetFinalized(uint8 finalState)",
  "event DonationRecorded(address indexed donor, address indexed sourceToken, uint256 sourceAmount, uint256 superTokenAmount)",
  "event FlowRateSyncCallFailed(address indexed flow, bytes4 indexed selector, int96 attemptedRate, bytes reason)",
  "event FlowRateSyncManualInterventionRequired(address indexed flow, int96 targetRate, int96 fallbackRate, int96 currentRate)",
  "event FlowRateSynced(int96 targetRate, int96 appliedRate, uint256 treasuryBalance, uint256 timeRemaining)",
  "event FlowRateZeroingFailed(address indexed flow, bytes reason)",
  "event Initialized(uint64 version)",
  "event ReassertGraceActivated(bytes32 indexed clearedAssertionId, uint64 indexed graceDeadline)",
  "event ResidualSettled(address indexed destination, uint256 amount)",
  "event StateTransition(uint8 previousState, uint8 newState)",
  "event SuccessAssertionCleared(bytes32 indexed assertionId)",
  "event SuccessAssertionRegistered(bytes32 indexed assertionId, uint64 indexed assertedAt)",
  "event SuccessAssertionResolutionFailClosed(bytes32 indexed assertionId, uint8 indexed reason)",
  "event SuccessResolutionDisabled()",
  "event TerminalSideEffectFailed(uint8 indexed operation, bytes reason)",
] as const);

export const budgetTreasuryAbi = resolveGeneratedOrFallbackAbi("budgetTreasuryAbi", fallbackBudgetTreasuryAbi);

const fallbackPremiumEscrowAbi = parseAbi([
  "event AccountCheckpointed(address indexed account, uint256 previousCoverage, uint256 currentCoverage, uint256 claimableAmount, uint256 exposureIntegral, uint256 totalCoverage)",
  "event Claimed(address indexed account, address indexed to, uint256 amount)",
  "event Closed(uint8 indexed finalState, uint64 activatedAt, uint64 closedAt)",
  "event CreditIndexed(uint256 indexed distributedCredit, uint256 indexed totalCoverage, uint256 indexDelta, uint256 newCreditIndex)",
  "event Initialized(uint64 version)",
  "event LateResidualSettlementFailed(address indexed goalTreasury, bytes reason)",
  "event ManagerRewardPoolConnected(address indexed pool, uint256 baselineReceived)",
  "event OrphanPremiumRecycled(address indexed destination, uint256 amount)",
  "event PremiumIndexed(uint256 indexed distributedPremium, uint256 indexed totalCoverage, uint256 indexDelta, uint256 newPremiumIndex)",
  "event UnclaimablePremiumSwept(address indexed goalFlow, uint256 amount)",
  "event UnderwriterSlashCalculated(address indexed underwriter, bool usedCreditFormula, uint256 creditDrawn, uint256 premiumEarned, uint256 coverageLambda, uint256 duration, uint256 rawSlashWeight, uint256 capWeight, uint256 finalSlashWeight)",
  "event UnderwriterSlashed(address indexed underwriter, uint256 exposureIntegral, uint256 slashWeight, uint256 duration)",
] as const);

export const premiumEscrowAbi = resolveGeneratedOrFallbackAbi("premiumEscrowAbi", fallbackPremiumEscrowAbi);

const fallbackGoalStakeVaultAbi = parseAbi([
  "event AllocationSyncFailed(address indexed account, address indexed target, bytes4 indexed selector, bytes reason)",
  "event CobuildStaked(address indexed user, uint256 amount, uint256 weightDelta)",
  "event CobuildWithdrawn(address indexed user, address indexed to, uint256 amount)",
  "event GoalResolved()",
  "event GoalStaked(address indexed user, uint256 amount, uint256 weightDelta)",
  "event GoalWithdrawn(address indexed user, address indexed to, uint256 amount)",
  "event JurorDelegateSet(address indexed juror, address indexed delegate)",
  "event JurorExitFinalized(address indexed juror, uint256 goalAmount, uint256 weightDelta)",
  "event JurorExitRequested(address indexed juror, uint256 goalAmount, uint64 requestedAt, uint64 availableAt)",
  "event JurorOptedIn(address indexed juror, uint256 goalAmount, uint256 weightDelta, address indexed delegate)",
  "event JurorSlashed(address indexed juror, uint256 requestedWeight, uint256 appliedWeight, uint256 goalAmount, address indexed recipient)",
  "event JurorSlasherSet(address indexed slasher)",
  "event UnderwriterSlashed(address indexed underwriter, uint256 requestedWeight, uint256 appliedWeight, uint256 goalAmount, uint256 cobuildAmount, address indexed recipient)",
  "event UnderwriterSlasherSet(address indexed slasher)",
  "event UnderwriterWithdrawalPrepared(address indexed underwriter, uint256 nextBudgetIndex, uint256 budgetCount, bool complete)",
] as const);

export const goalStakeVaultAbi = resolveGeneratedOrFallbackAbi("goalStakeVaultAbi", fallbackGoalStakeVaultAbi);

const fallbackBudgetStakeLedgerAbi = parseAbi([
  "event AllocationCheckpointed(address indexed account, address indexed budget, uint256 allocatedStake, uint64 checkpointTime)",
  "event BudgetRegistered(bytes32 indexed recipientId, address indexed budget)",
  "event BudgetRemoved(bytes32 indexed recipientId, address indexed budget)",
] as const);

export const budgetStakeLedgerAbi = resolveGeneratedOrFallbackAbi("budgetStakeLedgerAbi", fallbackBudgetStakeLedgerAbi);

const fallbackBudgetTcrAbi = parseAbi([
  "event BudgetAllocationMechanismDeployed(bytes32 indexed itemID, address indexed allocationMechanism, address indexed allocationMechanismArbitrator, address roundFactory)",
  "event BudgetCreditCapEnforcementFailed(bytes32 indexed itemID, address indexed budgetTreasury, address callTarget, bytes4 indexed selector, bytes reason)",
  "event BudgetStackActivationQueued(bytes32 indexed itemID)",
  "event BudgetStackDeployed(bytes32 indexed itemID, address indexed childFlow, address indexed budgetTreasury, address strategy)",
  "event BudgetStackRemovalHandled(bytes32 indexed itemID, address indexed childFlow, address indexed budgetTreasury, bool removedFromParent, bool terminallyResolved)",
  "event BudgetStackRemovalQueued(bytes32 indexed itemID)",
  "event BudgetStackTerminalizationRetried(bytes32 indexed itemID, address indexed budgetTreasury, bool terminallyResolved)",
  "event BudgetTerminalRecipientPruned(bytes32 indexed itemID, address indexed childFlow, address indexed budgetTreasury, bool removedFromParent, bool goalSynced)",
  "event BudgetTerminalizationStepFailed(bytes32 indexed itemID, address indexed budgetTreasury, bytes4 indexed selector, bytes reason)",
  "event BudgetTreasuryBatchSyncAttempted(bytes32 indexed itemID, address indexed budgetTreasury, bool success)",
  "event BudgetTreasuryBatchSyncSkipped(bytes32 indexed itemID, address indexed budgetTreasury, bytes32 reason)",
  "event BudgetTreasuryCallFailed(bytes32 indexed itemID, address indexed budgetTreasury, bytes4 indexed selector, bytes reason)",
  "event Dispute(address indexed _arbitrator, uint256 indexed _disputeID, uint256 _metaEvidenceID, uint256 _evidenceGroupID, bytes32 _itemID)",
  "event Evidence(address indexed _arbitrator, uint256 indexed _evidenceGroupID, address indexed _party, string _evidence)",
  "event Initialized(uint64 version)",
  "event ItemStatusChange(bytes32 indexed _itemID, uint256 indexed _requestIndex, uint256 indexed _roundIndex, bool _disputed, bool _resolved, uint8 _itemStatus)",
  "event ItemSubmitted(bytes32 indexed _itemID, address indexed _submitter, uint256 indexed _evidenceGroupID, bytes _data)",
  "event MetaEvidence(uint256 indexed _metaEvidenceID, string _evidence)",
  "event RequestEvidenceGroupID(bytes32 indexed _itemID, uint256 indexed _requestIndex, uint256 indexed _evidenceGroupID)",
  "event RequestSubmitted(bytes32 indexed _itemID, uint256 indexed _requestIndex, uint8 indexed _requestType)",
  "event Ruling(address indexed _arbitrator, uint256 indexed _disputeID, uint256 _ruling)",
  "event SubmissionDepositPaid(bytes32 indexed itemID, address indexed payer, uint256 amount)",
  "event SubmissionDepositTransferred(bytes32 indexed itemID, address indexed recipient, uint256 amount, uint8 requestType, uint8 ruling)",
] as const);

export const budgetTcrAbi = resolveGeneratedOrFallbackAbi("budgetTcrAbi", fallbackBudgetTcrAbi);

const fallbackBudgetTcrFactoryAbi = parseAbi([
  "event BudgetTCRStackDeployedForGoal(address indexed sender, address indexed budgetTCR, address indexed arbitrator, address token, address goalFlow, address goalTreasury)",
] as const);

export const budgetTcrFactoryAbi = resolveGeneratedOrFallbackAbi("budgetTcrFactoryAbi", fallbackBudgetTcrFactoryAbi);

const fallbackGoalFlowAllocationLedgerPipelineAbi = parseAbi([
  "event ChildAllocationSyncAttempted(address indexed budgetTreasury, address indexed childFlow, address indexed strategy, uint256 allocationKey, address parentFlow, address parentStrategy, uint256 parentAllocationKey, bool success)",
  "event ChildAllocationSyncSkipped(address indexed budgetTreasury, address indexed childFlow, address parentFlow, address parentStrategy, uint256 parentAllocationKey, bytes32 reason)",
] as const);

export const goalFlowAllocationLedgerPipelineAbi = resolveGeneratedOrFallbackAbi("goalFlowAllocationLedgerPipelineAbi", fallbackGoalFlowAllocationLedgerPipelineAbi);

const fallbackGoalRevnetSplitHookAbi = parseAbi([
  "event GoalFundingProcessed(uint256 indexed projectId, address indexed sourceToken, uint256 sourceAmount, uint256 superTokenAmount, bool accepted, uint8 action)",
  "event GoalSuccessSettlementProcessed(uint256 indexed projectId, address indexed sourceToken, uint256 sourceAmount, uint256 burnAmount)",
  "event Initialized(uint64 version)",
] as const);

export const goalRevnetSplitHookAbi = resolveGeneratedOrFallbackAbi("goalRevnetSplitHookAbi", fallbackGoalRevnetSplitHookAbi);

