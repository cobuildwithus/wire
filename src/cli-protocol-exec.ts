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
import {
  ARBITRATOR_PLAN_ACTIONS,
  TCR_PLAN_ACTIONS,
} from "./protocol-governance.js";
import {
  normalizeProtocolNetwork,
  type ProtocolNetwork,
} from "./protocol-addresses.js";
import {
  buildProtocolApprovalStep,
  normalizeProtocolValueEth,
  type ProtocolContractCallStep,
  type ProtocolErc20ApprovalStep,
  type ProtocolPlanStep,
  type ProtocolRiskClass,
} from "./protocol-plans.js";
import { asJsonRecord, requireTrimmedString } from "./parse.js";

export const CLI_PROTOCOL_STEP_KIND = "protocol-step" as const;
export const CLI_PROTOCOL_PLAN_KIND = "protocol-plan" as const;

type SupportedProtocolActionStep =
  | { kind: "erc20-approval" }
  | {
      kind: "contract-call";
      contract: string;
      functionName: string;
    };

const APPROVAL_STEP = { kind: "erc20-approval" } as const;

const CLI_PROTOCOL_ACTION_DESCRIPTORS = {
  "goal.create": {
    riskClass: "economic",
    allowedSteps: [
      {
        kind: "contract-call",
        contract: "GoalFactory",
        functionName: "deployOpenGoal",
      },
      {
        kind: "contract-call",
        contract: "GoalFactory",
        functionName: "deployManagedGoal",
      },
    ],
  },
  "stake.deposit-goal": {
    riskClass: "stake",
    allowedSteps: [
      APPROVAL_STEP,
      {
        kind: "contract-call",
        contract: "GoalStakeVault",
        functionName: "depositGoal",
      },
    ],
  },
  "stake.deposit-cobuild": {
    riskClass: "stake",
    allowedSteps: [
      APPROVAL_STEP,
      {
        kind: "contract-call",
        contract: "GoalStakeVault",
        functionName: "depositCobuild",
      },
    ],
  },
  "stake.opt-in-juror": {
    riskClass: "stake",
    allowedSteps: [
      APPROVAL_STEP,
      {
        kind: "contract-call",
        contract: "GoalStakeVault",
        functionName: "optInAsJuror",
      },
    ],
  },
  "stake.request-juror-exit": {
    riskClass: "stake",
    allowedSteps: [
      {
        kind: "contract-call",
        contract: "GoalStakeVault",
        functionName: "requestJurorExit",
      },
    ],
  },
  "stake.finalize-juror-exit": {
    riskClass: "stake",
    allowedSteps: [
      {
        kind: "contract-call",
        contract: "GoalStakeVault",
        functionName: "finalizeJurorExit",
      },
    ],
  },
  "stake.set-juror-delegate": {
    riskClass: "stake",
    allowedSteps: [
      {
        kind: "contract-call",
        contract: "GoalStakeVault",
        functionName: "setJurorDelegate",
      },
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
      {
        kind: "contract-call",
        contract: "GoalStakeVault",
        functionName: "withdrawGoal",
      },
    ],
  },
  "stake.withdraw-cobuild": {
    riskClass: "stake",
    allowedSteps: [
      {
        kind: "contract-call",
        contract: "GoalStakeVault",
        functionName: "withdrawCobuild",
      },
    ],
  },
  "premium.checkpoint": {
    riskClass: "claim",
    allowedSteps: [
      {
        kind: "contract-call",
        contract: "PremiumEscrow",
        functionName: "checkpoint",
      },
    ],
  },
  "premium.claim": {
    riskClass: "claim",
    allowedSteps: [
      {
        kind: "contract-call",
        contract: "PremiumEscrow",
        functionName: "claim",
      },
    ],
  },
  "prize-vault.claim": {
    riskClass: "claim",
    allowedSteps: [
      {
        kind: "contract-call",
        contract: "RoundPrizeVault",
        functionName: "claim",
      },
    ],
  },
  "prize-vault.downgrade": {
    riskClass: "maintenance",
    allowedSteps: [
      {
        kind: "contract-call",
        contract: "RoundPrizeVault",
        functionName: "downgrade",
      },
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
      {
        kind: "contract-call",
        contract: "GeneralizedTCR",
        functionName: "addItem",
      },
    ],
  },
  removeItem: {
    riskClass: "governance",
    allowedSteps: [
      APPROVAL_STEP,
      {
        kind: "contract-call",
        contract: "GeneralizedTCR",
        functionName: "removeItem",
      },
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
      {
        kind: "contract-call",
        contract: "GeneralizedTCR",
        functionName: "executeRequest",
      },
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
      {
        kind: "contract-call",
        contract: "GeneralizedTCR",
        functionName: "submitEvidence",
      },
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
      {
        kind: "contract-call",
        contract: "ERC20VotesArbitrator",
        functionName: "commitVote",
      },
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
      {
        kind: "contract-call",
        contract: "ERC20VotesArbitrator",
        functionName: "revealVote",
      },
    ],
  },
  executeRuling: {
    riskClass: "governance",
    allowedSteps: [
      {
        kind: "contract-call",
        contract: "ERC20VotesArbitrator",
        functionName: "executeRuling",
      },
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
      {
        kind: "contract-call",
        contract: "ERC20VotesArbitrator",
        functionName: "slashVoter",
      },
    ],
  },
  slashVoters: {
    riskClass: "governance",
    allowedSteps: [
      {
        kind: "contract-call",
        contract: "ERC20VotesArbitrator",
        functionName: "slashVoters",
      },
    ],
  },
  "flow.allocate": {
    riskClass: "economic",
    allowedSteps: [
      { kind: "contract-call", contract: "Flow", functionName: "allocate" },
    ],
  },
  "flow.sync-allocation": {
    riskClass: "maintenance",
    allowedSteps: [
      {
        kind: "contract-call",
        contract: "Flow",
        functionName: "syncAllocation",
      },
    ],
  },
  "flow.sync-allocation-for-account": {
    riskClass: "maintenance",
    allowedSteps: [
      {
        kind: "contract-call",
        contract: "Flow",
        functionName: "syncAllocationForAccount",
      },
    ],
  },
  "flow.clear-stale-allocation": {
    riskClass: "maintenance",
    allowedSteps: [
      {
        kind: "contract-call",
        contract: "Flow",
        functionName: "clearStaleAllocation",
      },
    ],
  },
} as const satisfies Record<
  string,
  {
    riskClass: ProtocolRiskClass;
    allowedSteps: readonly SupportedProtocolActionStep[];
  }
>;

const CLI_PROTOCOL_CONTRACT_ABIS = {
  GoalFactory: goalFactoryAbi as Abi,
  GoalStakeVault: goalStakeVaultAbi as Abi,
  GoalTreasury: goalTreasuryAbi as Abi,
  BudgetTreasury: budgetTreasuryAbi as Abi,
  GeneralizedTCR: budgetTcrAbi as Abi,
  ERC20VotesArbitrator: erc20VotesArbitratorAbi as Abi,
  PremiumEscrow: premiumEscrowAbi as Abi,
  RoundPrizeVault: roundPrizeVaultAbi as Abi,
  Flow: flowParticipantAbi as Abi,
} as const satisfies Record<string, Abi>;

type SupportedProtocolContract = keyof typeof CLI_PROTOCOL_CONTRACT_ABIS;

const CLI_PROTOCOL_CONTRACT_FUNCTIONS = Object.entries(
  CLI_PROTOCOL_ACTION_DESCRIPTORS,
).reduce(
  (registry, [, descriptor]) => {
    for (const step of descriptor.allowedSteps) {
      if (step.kind !== "contract-call") {
        continue;
      }
      const functions =
        registry[step.contract as SupportedProtocolContract] ??
        new Set<string>();
      functions.add(step.functionName);
      registry[step.contract as SupportedProtocolContract] = functions;
    }
    return registry;
  },
  {} as Partial<Record<SupportedProtocolContract, Set<string>>>,
);

export type CliProtocolAction = keyof typeof CLI_PROTOCOL_ACTION_DESCRIPTORS;
export type CliProtocolStepAction = CliProtocolAction;
export type CliProtocolPlanAction = CliProtocolAction;

export type CliProtocolStepRequest<
  TAction extends string = CliProtocolStepAction,
> = {
  kind: typeof CLI_PROTOCOL_STEP_KIND;
  network: ProtocolNetwork;
  action: TAction;
  riskClass: ProtocolRiskClass;
  step: ProtocolPlanStep;
};

export type CliProtocolStepLogKind = `protocol-step:${string}`;
export type CliProtocolPlanRequest<
  TAction extends string = CliProtocolPlanAction,
> = {
  kind: typeof CLI_PROTOCOL_PLAN_KIND;
  network: ProtocolNetwork;
  action: TAction;
  riskClass: ProtocolRiskClass;
  steps: readonly ProtocolPlanStep[];
};

export type CliProtocolPlanLogKind = `protocol-plan:${string}`;

function parseCliProtocolAction(
  value: unknown,
  fieldPath: string,
): CliProtocolAction {
  const action = requireTrimmedString(value, { fieldPath });
  if (!Object.hasOwn(CLI_PROTOCOL_ACTION_DESCRIPTORS, action)) {
    throw new Error(
      `${fieldPath} must be one of: ${Object.keys(CLI_PROTOCOL_ACTION_DESCRIPTORS).join(", ")}.`,
    );
  }
  return action as CliProtocolAction;
}

function parseProtocolTransaction(
  value: unknown,
  fieldPath: string,
  options?: { allowValueEth?: boolean },
): {
  to: EvmAddress;
  data: HexBytes;
  valueEth: string;
} {
  const record = asJsonRecord(value, `${fieldPath} must be an object.`);

  const valueEth = normalizeProtocolValueEth(
    requireTrimmedString(record.valueEth, {
      fieldPath: `${fieldPath}.valueEth`,
    }),
    `${fieldPath}.valueEth`,
  );
  if (options?.allowValueEth !== true && valueEth !== "0") {
    throw new Error(
      `${fieldPath}.valueEth must be "0" for protocol-step execution.`,
    );
  }

  return {
    to: normalizeEvmAddress(
      requireTrimmedString(record.to, { fieldPath: `${fieldPath}.to` }),
      `${fieldPath}.to`,
    ),
    data: normalizeHex(
      normalizeHexByteString(
        requireTrimmedString(record.data, { fieldPath: `${fieldPath}.data` }),
        `${fieldPath}.data`,
      ),
    ) as HexBytes,
    valueEth,
  };
}

function validateErc20ApprovalStep(
  value: unknown,
  fieldPath: string,
  options?: { allowValueEth?: boolean },
): ProtocolErc20ApprovalStep {
  const record = asJsonRecord(value, `${fieldPath} must be an object.`);

  const label = requireTrimmedString(record.label, {
    fieldPath: `${fieldPath}.label`,
  });
  const tokenAddress = normalizeEvmAddress(
    requireTrimmedString(record.tokenAddress, {
      fieldPath: `${fieldPath}.tokenAddress`,
    }),
    `${fieldPath}.tokenAddress`,
  );
  const spenderAddress = normalizeEvmAddress(
    requireTrimmedString(record.spenderAddress, {
      fieldPath: `${fieldPath}.spenderAddress`,
    }),
    `${fieldPath}.spenderAddress`,
  );
  const amount = normalizeUnsignedDecimal(
    requireTrimmedString(record.amount, { fieldPath: `${fieldPath}.amount` }),
    `${fieldPath}.amount`,
  );
  const transaction = parseProtocolTransaction(
    record.transaction,
    `${fieldPath}.transaction`,
    options,
  );
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
      `${fieldPath}.transaction must match the canonical ERC-20 approval for the declared token, spender, and amount.`,
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

function validateContractCallStep(
  value: unknown,
  fieldPath: string,
  options?: { allowValueEth?: boolean },
): ProtocolContractCallStep {
  const record = asJsonRecord(value, `${fieldPath} must be an object.`);

  const label = requireTrimmedString(record.label, {
    fieldPath: `${fieldPath}.label`,
  });
  const contract = requireTrimmedString(record.contract, {
    fieldPath: `${fieldPath}.contract`,
  });
  const functionName = requireTrimmedString(record.functionName, {
    fieldPath: `${fieldPath}.functionName`,
  });
  const transaction = parseProtocolTransaction(
    record.transaction,
    `${fieldPath}.transaction`,
    options,
  );
  const contractAbi =
    CLI_PROTOCOL_CONTRACT_ABIS[contract as SupportedProtocolContract];
  const supportedFunctions =
    CLI_PROTOCOL_CONTRACT_FUNCTIONS[contract as SupportedProtocolContract];

  if (!contractAbi || !supportedFunctions) {
    throw new Error(
      `${fieldPath}.contract must be one of: ${Object.keys(CLI_PROTOCOL_CONTRACT_FUNCTIONS).join(", ")}.`,
    );
  }

  if (!supportedFunctions.has(functionName)) {
    throw new Error(
      `${fieldPath}.functionName is not supported for contract "${contract}".`,
    );
  }

  let decodedFunctionName: string;
  try {
    decodedFunctionName = decodeFunctionData({
      abi: contractAbi,
      data: transaction.data,
    }).functionName;
  } catch (error) {
    throw new Error(
      `${fieldPath}.transaction.data must decode as ${contract}.${functionName}: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }

  if (decodedFunctionName !== functionName) {
    throw new Error(
      `${fieldPath}.transaction.data decodes to ${contract}.${decodedFunctionName}, not ${contract}.${functionName}.`,
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

function validateProtocolStep(
  value: unknown,
  fieldPath: string,
  options?: { allowValueEth?: boolean },
): ProtocolPlanStep {
  const record = asJsonRecord(value, `${fieldPath} must be an object.`);

  const kind = requireTrimmedString(record.kind, {
    fieldPath: `${fieldPath}.kind`,
  });
  if (kind === "erc20-approval") {
    return validateErc20ApprovalStep(record, fieldPath, options);
  }
  if (kind === "contract-call") {
    return validateContractCallStep(record, fieldPath, options);
  }
  throw new Error(
    `${fieldPath}.kind must be "erc20-approval" or "contract-call".`,
  );
}

function actionSupportsStep(params: {
  action: CliProtocolAction;
  step: ProtocolPlanStep;
}): boolean {
  const allowedSteps =
    CLI_PROTOCOL_ACTION_DESCRIPTORS[params.action].allowedSteps;
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

function getCliProtocolActionDescriptor(action: string) {
  const descriptor =
    CLI_PROTOCOL_ACTION_DESCRIPTORS[
      action as keyof typeof CLI_PROTOCOL_ACTION_DESCRIPTORS
    ];
  if (!descriptor) {
    throw new Error(
      `action must be one of: ${Object.keys(CLI_PROTOCOL_ACTION_DESCRIPTORS).join(", ")}.`,
    );
  }
  return descriptor;
}

function assertCliProtocolActionRisk(
  action: string,
  riskClass: ProtocolRiskClass,
): asserts action is CliProtocolAction {
  const descriptor = getCliProtocolActionDescriptor(action);
  if (riskClass !== descriptor.riskClass) {
    throw new Error(
      `riskClass must be "${descriptor.riskClass}" for action "${action}".`,
    );
  }
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
  assertCliProtocolActionRisk(params.action, params.riskClass);
  const action = params.action;

  if (!actionSupportsStep({ action, step: params.step })) {
    throw new Error(`step is not supported for action "${params.action}".`);
  }
}

function parseProtocolPlanSteps(
  value: unknown,
  fieldPath: string,
): readonly ProtocolPlanStep[] {
  if (!Array.isArray(value)) {
    throw new Error(`${fieldPath} must be an array.`);
  }
  if (value.length === 0) {
    throw new Error(`${fieldPath} must contain at least one step.`);
  }

  return value.map((step, index) =>
    validateProtocolStep(step, `${fieldPath}[${index}]`, {
      allowValueEth: true,
    }),
  );
}

function assertProtocolPlanShape(steps: readonly ProtocolPlanStep[]): void {
  const lastStep = steps.at(-1);
  const contractCallCount = steps.filter(
    (step) => step.kind === "contract-call",
  ).length;

  if (
    !lastStep ||
    lastStep.kind !== "contract-call" ||
    contractCallCount !== 1
  ) {
    throw new Error('steps must end with exactly one "contract-call" step.');
  }

  if (steps.slice(0, -1).some((step) => step.kind !== "erc20-approval")) {
    throw new Error(
      'steps before the final "contract-call" step must all be "erc20-approval".',
    );
  }

  const finalTarget = lastStep.transaction.to;
  steps.slice(0, -1).forEach((step, index) => {
    if (step.kind !== "erc20-approval") {
      return;
    }
    if (step.spenderAddress !== finalTarget) {
      throw new Error(
        `steps[${index}].spenderAddress must match the final contract-call target address.`,
      );
    }
  });
}

function assertActionRiskAndPlan(params: {
  action: string;
  riskClass: ProtocolRiskClass;
  steps: readonly ProtocolPlanStep[];
}): asserts params is {
  action: CliProtocolPlanAction;
  riskClass: ProtocolRiskClass;
  steps: readonly ProtocolPlanStep[];
} {
  assertCliProtocolActionRisk(params.action, params.riskClass);
  const action = params.action;
  assertProtocolPlanShape(params.steps);

  params.steps.forEach((step, index) => {
    if (!actionSupportsStep({ action, step })) {
      throw new Error(
        `steps[${index}] is not supported for action "${params.action}".`,
      );
    }
  });
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
    riskClass:
      params.riskClass ??
      CLI_PROTOCOL_ACTION_DESCRIPTORS[params.action].riskClass,
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
  value: unknown,
): CliProtocolStepRequest<CliProtocolStepAction> {
  const record = asJsonRecord(
    value,
    "protocol-step request must be an object.",
  );

  const kind = requireTrimmedString(record.kind, { fieldPath: "kind" });
  if (kind !== CLI_PROTOCOL_STEP_KIND) {
    throw new Error(`kind must be "${CLI_PROTOCOL_STEP_KIND}".`);
  }

  const action = parseCliProtocolAction(record.action, "action");
  const riskClass = requireTrimmedString(record.riskClass, {
    fieldPath: "riskClass",
  }) as ProtocolRiskClass;
  const step = validateProtocolStep(record.step, "step");

  assertActionRiskAndStep({
    action,
    riskClass,
    step,
  });

  return {
    kind: CLI_PROTOCOL_STEP_KIND,
    network: normalizeProtocolNetwork(
      requireTrimmedString(record.network, { fieldPath: "network" }),
    ),
    action,
    riskClass,
    step,
  };
}

export function buildCliProtocolPlanRequest(params: {
  network?: string;
  action: CliProtocolPlanAction;
  riskClass?: ProtocolRiskClass;
  steps: readonly ProtocolPlanStep[];
}): CliProtocolPlanRequest<CliProtocolPlanAction> {
  const request = {
    kind: CLI_PROTOCOL_PLAN_KIND,
    network: normalizeProtocolNetwork(params.network ?? "base"),
    action: params.action,
    riskClass:
      params.riskClass ??
      CLI_PROTOCOL_ACTION_DESCRIPTORS[params.action].riskClass,
    steps: [...params.steps],
  } satisfies CliProtocolPlanRequest<CliProtocolPlanAction>;

  assertActionRiskAndPlan({
    action: request.action,
    riskClass: request.riskClass,
    steps: request.steps,
  });

  return request;
}

export function validateCliProtocolPlanRequest(
  value: unknown,
): CliProtocolPlanRequest<CliProtocolPlanAction> {
  const record = asJsonRecord(
    value,
    "protocol-plan request must be an object.",
  );

  const kind = requireTrimmedString(record.kind, { fieldPath: "kind" });
  if (kind !== CLI_PROTOCOL_PLAN_KIND) {
    throw new Error(`kind must be "${CLI_PROTOCOL_PLAN_KIND}".`);
  }

  const action = parseCliProtocolAction(record.action, "action");
  const riskClass = requireTrimmedString(record.riskClass, {
    fieldPath: "riskClass",
  }) as ProtocolRiskClass;
  const steps = parseProtocolPlanSteps(record.steps, "steps");

  assertActionRiskAndPlan({
    action,
    riskClass,
    steps,
  });

  return {
    kind: CLI_PROTOCOL_PLAN_KIND,
    network: normalizeProtocolNetwork(
      requireTrimmedString(record.network, { fieldPath: "network" }),
    ),
    action,
    riskClass,
    steps,
  };
}

export function buildCliProtocolStepLogKind(
  action: string,
): CliProtocolStepLogKind {
  return `protocol-step:${action}`;
}

export function buildCliProtocolPlanLogKind(
  action: string,
): CliProtocolPlanLogKind {
  return `protocol-plan:${action}`;
}
