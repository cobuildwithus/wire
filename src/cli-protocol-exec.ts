import { decodeFunctionData, erc20Abi, type Abi } from "viem";
import {
  budgetTcrAbi,
  budgetTreasuryAbi,
  erc20VotesArbitratorAbi,
  goalFactoryAbi,
  goalStakeVaultAbi,
  goalTreasuryAbi,
  premiumEscrowAbi,
  roundPrizeVaultAbi,
} from "./protocol-abis.js";
import { normalizeHex } from "./builder-codes.js";
import {
  normalizeEvmAddress,
  normalizeHexByteString,
  normalizeUnsignedDecimal,
  type EvmAddress,
  type HexBytes,
} from "./evm.js";
import { flowParticipantAbi } from "./protocol-flow.js";
import { ARBITRATOR_PLAN_ACTIONS, TCR_PLAN_ACTIONS } from "./protocol-governance.js";
import { normalizeProtocolNetwork, type ProtocolNetwork } from "./protocol-addresses.js";
import {
  buildProtocolApprovalStep,
  type ProtocolContractCallStep,
  type ProtocolErc20ApprovalStep,
  type ProtocolPlanStep,
  type ProtocolRiskClass,
} from "./protocol-plans.js";

export const CLI_PROTOCOL_STEP_KIND = "protocol-step" as const;

type SupportedProtocolActionStep =
  | { kind: "erc20-approval" }
  | {
      kind: "contract-call";
      contract: string;
      functionName: string;
    };

const APPROVAL_STEP = { kind: "erc20-approval" } as const;

const SUPPORTED_PROTOCOL_ACTIONS = {
  "goal.create": {
    riskClass: "economic",
    allowedSteps: [{ kind: "contract-call", contract: "GoalFactory", functionName: "deployGoal" }],
  },
  "stake.deposit-goal": {
    riskClass: "stake",
    allowedSteps: [
      APPROVAL_STEP,
      { kind: "contract-call", contract: "GoalStakeVault", functionName: "depositGoal" },
    ],
  },
  "stake.deposit-cobuild": {
    riskClass: "stake",
    allowedSteps: [
      APPROVAL_STEP,
      { kind: "contract-call", contract: "GoalStakeVault", functionName: "depositCobuild" },
    ],
  },
  "stake.opt-in-juror": {
    riskClass: "stake",
    allowedSteps: [
      APPROVAL_STEP,
      { kind: "contract-call", contract: "GoalStakeVault", functionName: "optInAsJuror" },
    ],
  },
  "stake.request-juror-exit": {
    riskClass: "stake",
    allowedSteps: [
      { kind: "contract-call", contract: "GoalStakeVault", functionName: "requestJurorExit" },
    ],
  },
  "stake.finalize-juror-exit": {
    riskClass: "stake",
    allowedSteps: [
      { kind: "contract-call", contract: "GoalStakeVault", functionName: "finalizeJurorExit" },
    ],
  },
  "stake.set-juror-delegate": {
    riskClass: "stake",
    allowedSteps: [
      { kind: "contract-call", contract: "GoalStakeVault", functionName: "setJurorDelegate" },
    ],
  },
  "stake.prepare-underwriter-withdrawal": {
    riskClass: "stake",
    allowedSteps: [
      {
        kind: "contract-call",
        contract: "GoalStakeVault",
        functionName: "prepareUnderwriterWithdrawal",
      },
    ],
  },
  "stake.withdraw-goal": {
    riskClass: "stake",
    allowedSteps: [
      { kind: "contract-call", contract: "GoalStakeVault", functionName: "withdrawGoal" },
    ],
  },
  "stake.withdraw-cobuild": {
    riskClass: "stake",
    allowedSteps: [
      { kind: "contract-call", contract: "GoalStakeVault", functionName: "withdrawCobuild" },
    ],
  },
  "premium.checkpoint": {
    riskClass: "claim",
    allowedSteps: [
      { kind: "contract-call", contract: "PremiumEscrow", functionName: "checkpoint" },
    ],
  },
  "premium.claim": {
    riskClass: "claim",
    allowedSteps: [{ kind: "contract-call", contract: "PremiumEscrow", functionName: "claim" }],
  },
  "prize-vault.claim": {
    riskClass: "claim",
    allowedSteps: [
      { kind: "contract-call", contract: "RoundPrizeVault", functionName: "claim" },
    ],
  },
  "prize-vault.downgrade": {
    riskClass: "maintenance",
    allowedSteps: [
      { kind: "contract-call", contract: "RoundPrizeVault", functionName: "downgrade" },
    ],
  },
  "treasury.donate-goal": {
    riskClass: "economic",
    allowedSteps: [
      APPROVAL_STEP,
      {
        kind: "contract-call",
        contract: "GoalTreasury",
        functionName: "donateUnderlyingAndUpgrade",
      },
    ],
  },
  "treasury.donate-budget": {
    riskClass: "economic",
    allowedSteps: [
      APPROVAL_STEP,
      {
        kind: "contract-call",
        contract: "BudgetTreasury",
        functionName: "donateUnderlyingAndUpgrade",
      },
    ],
  },
  addItem: {
    riskClass: "governance",
    allowedSteps: [
      APPROVAL_STEP,
      { kind: "contract-call", contract: "GeneralizedTCR", functionName: "addItem" },
    ],
  },
  removeItem: {
    riskClass: "governance",
    allowedSteps: [
      APPROVAL_STEP,
      { kind: "contract-call", contract: "GeneralizedTCR", functionName: "removeItem" },
    ],
  },
  challengeRequest: {
    riskClass: "governance",
    allowedSteps: [
      APPROVAL_STEP,
      {
        kind: "contract-call",
        contract: "GeneralizedTCR",
        functionName: "challengeRequest",
      },
    ],
  },
  executeRequest: {
    riskClass: "governance",
    allowedSteps: [
      { kind: "contract-call", contract: "GeneralizedTCR", functionName: "executeRequest" },
    ],
  },
  executeRequestTimeout: {
    riskClass: "governance",
    allowedSteps: [
      {
        kind: "contract-call",
        contract: "GeneralizedTCR",
        functionName: "executeRequestTimeout",
      },
    ],
  },
  submitEvidence: {
    riskClass: "governance",
    allowedSteps: [
      { kind: "contract-call", contract: "GeneralizedTCR", functionName: "submitEvidence" },
    ],
  },
  withdrawFeesAndRewards: {
    riskClass: "governance",
    allowedSteps: [
      {
        kind: "contract-call",
        contract: "GeneralizedTCR",
        functionName: "withdrawFeesAndRewards",
      },
    ],
  },
  commitVote: {
    riskClass: "governance",
    allowedSteps: [
      { kind: "contract-call", contract: "ERC20VotesArbitrator", functionName: "commitVote" },
    ],
  },
  commitVoteFor: {
    riskClass: "governance",
    allowedSteps: [
      {
        kind: "contract-call",
        contract: "ERC20VotesArbitrator",
        functionName: "commitVoteFor",
      },
    ],
  },
  revealVote: {
    riskClass: "governance",
    allowedSteps: [
      { kind: "contract-call", contract: "ERC20VotesArbitrator", functionName: "revealVote" },
    ],
  },
  executeRuling: {
    riskClass: "governance",
    allowedSteps: [
      { kind: "contract-call", contract: "ERC20VotesArbitrator", functionName: "executeRuling" },
    ],
  },
  withdrawVoterRewards: {
    riskClass: "governance",
    allowedSteps: [
      {
        kind: "contract-call",
        contract: "ERC20VotesArbitrator",
        functionName: "withdrawVoterRewards",
      },
    ],
  },
  withdrawInvalidRoundRewards: {
    riskClass: "governance",
    allowedSteps: [
      {
        kind: "contract-call",
        contract: "ERC20VotesArbitrator",
        functionName: "withdrawInvalidRoundRewards",
      },
    ],
  },
  slashVoter: {
    riskClass: "governance",
    allowedSteps: [
      { kind: "contract-call", contract: "ERC20VotesArbitrator", functionName: "slashVoter" },
    ],
  },
  slashVoters: {
    riskClass: "governance",
    allowedSteps: [
      { kind: "contract-call", contract: "ERC20VotesArbitrator", functionName: "slashVoters" },
    ],
  },
  "flow.allocate": {
    riskClass: "economic",
    allowedSteps: [{ kind: "contract-call", contract: "Flow", functionName: "allocate" }],
  },
  "flow.sync-allocation-for-account": {
    riskClass: "maintenance",
    allowedSteps: [
      { kind: "contract-call", contract: "Flow", functionName: "syncAllocationForAccount" },
    ],
  },
  "flow.clear-stale-allocation": {
    riskClass: "maintenance",
    allowedSteps: [
      { kind: "contract-call", contract: "Flow", functionName: "clearStaleAllocation" },
    ],
  },
} as const satisfies Record<
  string,
  {
    riskClass: ProtocolRiskClass;
    allowedSteps: readonly SupportedProtocolActionStep[];
  }
>;

const SUPPORTED_PROTOCOL_CONTRACTS = {
  GoalFactory: {
    abi: goalFactoryAbi as Abi,
    functions: ["deployGoal"],
  },
  GoalStakeVault: {
    abi: goalStakeVaultAbi as Abi,
    functions: [
      "depositGoal",
      "depositCobuild",
      "optInAsJuror",
      "requestJurorExit",
      "finalizeJurorExit",
      "setJurorDelegate",
      "prepareUnderwriterWithdrawal",
      "withdrawGoal",
      "withdrawCobuild",
    ],
  },
  GoalTreasury: {
    abi: goalTreasuryAbi as Abi,
    functions: ["donateUnderlyingAndUpgrade"],
  },
  BudgetTreasury: {
    abi: budgetTreasuryAbi as Abi,
    functions: ["donateUnderlyingAndUpgrade"],
  },
  GeneralizedTCR: {
    abi: budgetTcrAbi as Abi,
    functions: [...TCR_PLAN_ACTIONS],
  },
  ERC20VotesArbitrator: {
    abi: erc20VotesArbitratorAbi as Abi,
    functions: [...ARBITRATOR_PLAN_ACTIONS],
  },
  PremiumEscrow: {
    abi: premiumEscrowAbi as Abi,
    functions: ["checkpoint", "claim"],
  },
  RoundPrizeVault: {
    abi: roundPrizeVaultAbi as Abi,
    functions: ["claim", "downgrade"],
  },
  Flow: {
    abi: flowParticipantAbi as Abi,
    functions: ["allocate", "syncAllocationForAccount", "clearStaleAllocation"],
  },
} as const satisfies Record<
  string,
  {
    abi: Abi;
    functions: readonly string[];
  }
>;

export type CliProtocolStepAction = keyof typeof SUPPORTED_PROTOCOL_ACTIONS;

export type CliProtocolStepRequest<TAction extends string = CliProtocolStepAction> = {
  kind: typeof CLI_PROTOCOL_STEP_KIND;
  network: ProtocolNetwork;
  action: TAction;
  riskClass: ProtocolRiskClass;
  step: ProtocolPlanStep;
};

export type CliProtocolStepLogKind = `protocol-step:${string}`;

function asRecord(value: unknown): Record<string, unknown> | null {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return null;
  }
  return value as Record<string, unknown>;
}

function parseRequiredString(value: unknown, fieldPath: string): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${fieldPath} must be a non-empty string.`);
  }
  return value.trim();
}

function parseCliProtocolStepAction(value: unknown, fieldPath: string): CliProtocolStepAction {
  const action = parseRequiredString(value, fieldPath);
  if (!Object.hasOwn(SUPPORTED_PROTOCOL_ACTIONS, action)) {
    throw new Error(
      `${fieldPath} must be one of: ${Object.keys(SUPPORTED_PROTOCOL_ACTIONS).join(", ")}.`
    );
  }
  return action as CliProtocolStepAction;
}

function parseProtocolTransaction(value: unknown, fieldPath: string): {
  to: EvmAddress;
  data: HexBytes;
  valueEth: "0";
} {
  const record = asRecord(value);
  if (!record) {
    throw new Error(`${fieldPath} must be an object.`);
  }

  const valueEth = normalizeUnsignedDecimal(
    parseRequiredString(record.valueEth, `${fieldPath}.valueEth`),
    `${fieldPath}.valueEth`
  );
  if (valueEth !== "0") {
    throw new Error(`${fieldPath}.valueEth must be "0" for protocol-step execution.`);
  }

  return {
    to: normalizeEvmAddress(parseRequiredString(record.to, `${fieldPath}.to`), `${fieldPath}.to`),
    data: normalizeHex(
      normalizeHexByteString(
        parseRequiredString(record.data, `${fieldPath}.data`),
        `${fieldPath}.data`
      )
    ) as HexBytes,
    valueEth: "0",
  };
}

function validateErc20ApprovalStep(value: unknown, fieldPath: string): ProtocolErc20ApprovalStep {
  const record = asRecord(value);
  if (!record) {
    throw new Error(`${fieldPath} must be an object.`);
  }

  const label = parseRequiredString(record.label, `${fieldPath}.label`);
  const tokenAddress = normalizeEvmAddress(
    parseRequiredString(record.tokenAddress, `${fieldPath}.tokenAddress`),
    `${fieldPath}.tokenAddress`
  );
  const spenderAddress = normalizeEvmAddress(
    parseRequiredString(record.spenderAddress, `${fieldPath}.spenderAddress`),
    `${fieldPath}.spenderAddress`
  );
  const amount = normalizeUnsignedDecimal(
    parseRequiredString(record.amount, `${fieldPath}.amount`),
    `${fieldPath}.amount`
  );
  const transaction = parseProtocolTransaction(record.transaction, `${fieldPath}.transaction`);
  const expected = buildProtocolApprovalStep({
    label,
    tokenAddress,
    spenderAddress,
    amount,
  });

  if (
    expected.transaction.to !== transaction.to ||
    expected.transaction.data !== transaction.data ||
    expected.transaction.valueEth !== transaction.valueEth
  ) {
    throw new Error(
      `${fieldPath}.transaction must match the canonical ERC-20 approval for the declared token, spender, and amount.`
    );
  }

  return {
    kind: "erc20-approval",
    label,
    tokenAddress,
    spenderAddress,
    amount,
    transaction,
  };
}

function validateContractCallStep(value: unknown, fieldPath: string): ProtocolContractCallStep {
  const record = asRecord(value);
  if (!record) {
    throw new Error(`${fieldPath} must be an object.`);
  }

  const label = parseRequiredString(record.label, `${fieldPath}.label`);
  const contract = parseRequiredString(record.contract, `${fieldPath}.contract`);
  const functionName = parseRequiredString(record.functionName, `${fieldPath}.functionName`);
  const transaction = parseProtocolTransaction(record.transaction, `${fieldPath}.transaction`);
  const contractConfig =
    SUPPORTED_PROTOCOL_CONTRACTS[contract as keyof typeof SUPPORTED_PROTOCOL_CONTRACTS];

  if (!contractConfig) {
    throw new Error(
      `${fieldPath}.contract must be one of: ${Object.keys(SUPPORTED_PROTOCOL_CONTRACTS).join(", ")}.`
    );
  }

  if (!contractConfig.functions.some((supportedFunctionName) => supportedFunctionName === functionName)) {
    throw new Error(`${fieldPath}.functionName is not supported for contract "${contract}".`);
  }

  let decodedFunctionName: string;
  try {
    decodedFunctionName = decodeFunctionData({
      abi: contractConfig.abi,
      data: transaction.data,
    }).functionName;
  } catch (error) {
    throw new Error(
      `${fieldPath}.transaction.data must decode as ${contract}.${functionName}: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }

  if (decodedFunctionName !== functionName) {
    throw new Error(
      `${fieldPath}.transaction.data decodes to ${contract}.${decodedFunctionName}, not ${contract}.${functionName}.`
    );
  }

  return {
    kind: "contract-call",
    label,
    contract,
    functionName,
    transaction,
  };
}

function validateProtocolStep(value: unknown, fieldPath: string): ProtocolPlanStep {
  const record = asRecord(value);
  if (!record) {
    throw new Error(`${fieldPath} must be an object.`);
  }

  const kind = parseRequiredString(record.kind, `${fieldPath}.kind`);
  if (kind === "erc20-approval") {
    return validateErc20ApprovalStep(record, fieldPath);
  }
  if (kind === "contract-call") {
    return validateContractCallStep(record, fieldPath);
  }
  throw new Error(`${fieldPath}.kind must be "erc20-approval" or "contract-call".`);
}

function actionSupportsStep(params: {
  action: CliProtocolStepAction;
  step: ProtocolPlanStep;
}): boolean {
  const allowedSteps = SUPPORTED_PROTOCOL_ACTIONS[params.action].allowedSteps;
  return allowedSteps.some((allowedStep) => {
    if (allowedStep.kind !== params.step.kind) {
      return false;
    }
    if (allowedStep.kind === "erc20-approval") {
      return true;
    }
    return (
      params.step.kind === "contract-call" &&
      params.step.contract === allowedStep.contract &&
      params.step.functionName === allowedStep.functionName
    );
  });
}

function assertActionRiskAndStep(params: {
  action: string;
  riskClass: ProtocolRiskClass;
  step: ProtocolPlanStep;
}): asserts params is {
  action: CliProtocolStepAction;
  riskClass: ProtocolRiskClass;
  step: ProtocolPlanStep;
} {
  const actionConfig =
    SUPPORTED_PROTOCOL_ACTIONS[params.action as keyof typeof SUPPORTED_PROTOCOL_ACTIONS];
  if (!actionConfig) {
    throw new Error(
      `action must be one of: ${Object.keys(SUPPORTED_PROTOCOL_ACTIONS).join(", ")}.`
    );
  }

  if (params.riskClass !== actionConfig.riskClass) {
    throw new Error(
      `riskClass must be "${actionConfig.riskClass}" for action "${params.action}".`
    );
  }

  if (!actionSupportsStep({ action: params.action as CliProtocolStepAction, step: params.step })) {
    throw new Error(
      `step is not supported for action "${params.action}".`
    );
  }
}

export function buildCliProtocolStepRequest(params: {
  network?: string;
  action: CliProtocolStepAction;
  riskClass?: ProtocolRiskClass;
  step: ProtocolPlanStep;
}): CliProtocolStepRequest<CliProtocolStepAction> {
  const request = {
    kind: CLI_PROTOCOL_STEP_KIND,
    network: normalizeProtocolNetwork(params.network ?? "base"),
    action: params.action,
    riskClass: params.riskClass ?? SUPPORTED_PROTOCOL_ACTIONS[params.action].riskClass,
    step: params.step,
  } satisfies CliProtocolStepRequest<CliProtocolStepAction>;

  assertActionRiskAndStep({
    action: request.action,
    riskClass: request.riskClass,
    step: request.step,
  });

  return request;
}

export function validateCliProtocolStepRequest(
  value: unknown
): CliProtocolStepRequest<CliProtocolStepAction> {
  const record = asRecord(value);
  if (!record) {
    throw new Error("protocol-step request must be an object.");
  }

  const kind = parseRequiredString(record.kind, "kind");
  if (kind !== CLI_PROTOCOL_STEP_KIND) {
    throw new Error(`kind must be "${CLI_PROTOCOL_STEP_KIND}".`);
  }

  const action = parseCliProtocolStepAction(record.action, "action");
  const riskClass = parseRequiredString(record.riskClass, "riskClass") as ProtocolRiskClass;
  const step = validateProtocolStep(record.step, "step");

  assertActionRiskAndStep({
    action,
    riskClass,
    step,
  });

  return {
    kind: CLI_PROTOCOL_STEP_KIND,
    network: normalizeProtocolNetwork(parseRequiredString(record.network, "network")),
    action,
    riskClass,
    step,
  };
}

export function buildCliProtocolStepLogKind(action: string): CliProtocolStepLogKind {
  return `protocol-step:${action}`;
}
