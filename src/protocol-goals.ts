import {
  encodeFunctionData,
  getAddress,
  isHex,
  parseEventLogs,
  size,
  type Abi,
  type ContractFunctionArgs,
  type Hex,
} from "viem";
import { BASE_CHAIN_ID } from "./chains.js";
import type { EvmAddress, HexBytes } from "./evm.js";
import {
  normalizeBytes32,
  normalizeEvmAddress,
  normalizeUnsignedDecimal,
} from "./evm.js";
import { goalFactoryAbi } from "./protocol-abis.js";
import {
  buildProtocolCallStep,
  type ProtocolExecutionPlan,
} from "./protocol-plans.js";
import {
  normalizeProtocolNetwork,
  resolveProtocolAddresses,
  type ProtocolNetwork,
} from "./protocol-addresses.js";

export const GOAL_FACTORY_DEPLOY_REQUIRED_KEYS = [
  "revnet",
  "timing",
  "success",
  "flowMetadata",
  "underwriting",
  "budgetTCR",
  "goalSpendPolicy",
] as const;

const GOAL_FACTORY_DEPLOY_ROOT_ALIASES = ["deployParams", "params", "p"] as const;

const REVNET_PARAM_KEYS = [
  "name",
  "ticker",
  "uri",
  "initialIssuance",
  "cashOutTaxRate",
  "reservedPercent",
  "durationSeconds",
] as const;

const GOAL_TIMING_PARAM_KEYS = ["minRaise", "minRaiseDurationSeconds"] as const;

const SUCCESS_PARAM_KEYS = [
  "successResolver",
  "successAssertionLiveness",
  "successAssertionBond",
  "successOracleSpecHash",
  "successAssertionPolicyHash",
] as const;

const FLOW_METADATA_PARAM_KEYS = [
  "title",
  "description",
  "image",
  "tagline",
  "url",
] as const;

const UNDERWRITING_PARAM_KEYS = ["budgetPremiumPpm", "budgetSlashPpm"] as const;

const BUDGET_TCR_PARAM_KEYS = [
  "allocationMechanismAdmin",
  "invalidRoundRewardsSink",
  "submissionDepositStrategy",
  "submissionBaseDeposit",
  "removalBaseDeposit",
  "submissionChallengeBaseDeposit",
  "removalChallengeBaseDeposit",
  "registrationMetaEvidence",
  "clearingMetaEvidence",
  "challengePeriodDuration",
  "arbitratorExtraData",
  "budgetBounds",
  "oracleBounds",
  "budgetSuccessResolver",
  "budgetSpendPolicy",
  "arbitratorParams",
] as const;

const BUDGET_BOUNDS_KEYS = [
  "minFundingLeadTime",
  "maxFundingHorizon",
  "minExecutionDuration",
  "maxExecutionDuration",
  "minActivationThreshold",
  "maxActivationThreshold",
  "maxRunwayCap",
] as const;

const ORACLE_BOUNDS_KEYS = ["liveness", "bondAmount"] as const;

const ARBITRATOR_PARAM_KEYS = [
  "votingPeriod",
  "votingDelay",
  "revealPeriod",
  "arbitrationCost",
  "wrongOrMissedSlashBps",
  "slashCallerBountyBps",
] as const;

type GoalFactoryDeployParamsRecord = Record<string, unknown>;

export type GoalFactoryDeployParams = ContractFunctionArgs<
  typeof goalFactoryAbi,
  "nonpayable",
  "deployGoal"
>[0];

export type GoalFactoryDeployParamsInput =
  | GoalFactoryDeployParams
  | GoalFactoryDeployParamsRecord;

export type GoalCreateTransaction = {
  to: EvmAddress;
  data: Hex;
  valueEth: "0";
};

export type GoalCreateWriteContractRequest = {
  address: EvmAddress;
  abi: typeof goalFactoryAbi;
  functionName: "deployGoal";
  args: readonly [GoalFactoryDeployParams];
};

export type GoalCreatePlan = {
  chainId: typeof BASE_CHAIN_ID;
  network: ProtocolNetwork;
  goalFactory: EvmAddress;
  deployParams: GoalFactoryDeployParams;
  transaction: GoalCreateTransaction;
  writeContract: GoalCreateWriteContractRequest;
};

export type GoalCreateProtocolPlan = ProtocolExecutionPlan<"goal.create"> & {
  chainId: typeof BASE_CHAIN_ID;
  goalFactory: EvmAddress;
  deployParams: GoalFactoryDeployParams;
};

export type GoalDeployedStack = {
  goalRevnetId: bigint;
  goalToken: EvmAddress;
  goalSuperToken: EvmAddress;
  goalTreasury: EvmAddress;
  goalFlow: EvmAddress;
  goalFlowAllocationLedgerPipeline: EvmAddress;
  stakeVault: EvmAddress;
  budgetStakeLedger: EvmAddress;
  splitHook: EvmAddress;
  jurorSlasherRouter: EvmAddress;
  underwriterSlasherRouter: EvmAddress;
  successResolver: EvmAddress;
  budgetTCR: EvmAddress;
  arbitrator: EvmAddress;
};

export type GoalDeployedEvent = {
  caller: EvmAddress;
  goalRevnetId: bigint;
  stack: GoalDeployedStack;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasOwn(record: Record<string, unknown>, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(record, key);
}

function serializeBigInts(value: unknown): unknown {
  if (typeof value === "bigint") return value.toString(10);
  if (Array.isArray(value)) return value.map((entry) => serializeBigInts(entry));
  if (isRecord(value)) {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [key, serializeBigInts(entry)])
    );
  }
  return value;
}

function expectRecord(value: unknown, label: string): Record<string, unknown> {
  if (!isRecord(value)) {
    throw new Error(`${label} must be a JSON object.`);
  }
  return value;
}

function assertExactKeys(
  record: Record<string, unknown>,
  expectedKeys: readonly string[],
  label: string
): void {
  for (const key of expectedKeys) {
    if (!hasOwn(record, key)) {
      throw new Error(`${label}.${key} is required.`);
    }
  }

  for (const key of Object.keys(record)) {
    if (!expectedKeys.includes(key)) {
      throw new Error(
        `${label}.${key} is not supported. Expected keys: ${expectedKeys.join(", ")}.`
      );
    }
  }
}

function requireString(
  record: Record<string, unknown>,
  key: string,
  label: string
): string {
  const value = record[key];
  if (typeof value !== "string") {
    throw new Error(`${label}.${key} must be a string.`);
  }
  return value;
}

function normalizeUintBigInt(
  value: unknown,
  label: string,
  bits: number
): bigint {
  if (typeof value !== "string" && typeof value !== "number" && typeof value !== "bigint") {
    throw new Error(`${label} must be a non-negative integer.`);
  }

  const normalized = normalizeUnsignedDecimal(value, label);
  const parsed = BigInt(normalized);
  const max = (1n << BigInt(bits)) - 1n;
  if (parsed > max) {
    throw new Error(`${label} exceeds uint${bits}.`);
  }
  return parsed;
}

function normalizeUintNumber(
  value: unknown,
  label: string,
  bits: number
): number {
  return Number(normalizeUintBigInt(value, label, bits));
}

function normalizeHexBytesValue(
  value: unknown,
  label: string,
  options?: { allowEmpty?: boolean }
): HexBytes {
  if (typeof value !== "string") {
    throw new Error(`${label} must be hex bytes with a 0x prefix.`);
  }

  const normalized = value.trim().toLowerCase();
  if (!isHex(normalized)) {
    throw new Error(`${label} must be hex bytes with a 0x prefix.`);
  }

  if (options?.allowEmpty !== true && size(normalized) === 0) {
    throw new Error(`${label} must not be empty hex bytes.`);
  }

  return normalized as HexBytes;
}

function normalizeGoalFactoryDeployParamsRecord(
  input: Record<string, unknown>
): GoalFactoryDeployParams {
  assertExactKeys(input, GOAL_FACTORY_DEPLOY_REQUIRED_KEYS, "deployParams");

  const revnet = expectRecord(input.revnet, "deployParams.revnet");
  assertExactKeys(revnet, REVNET_PARAM_KEYS, "deployParams.revnet");

  const timing = expectRecord(input.timing, "deployParams.timing");
  assertExactKeys(timing, GOAL_TIMING_PARAM_KEYS, "deployParams.timing");

  const success = expectRecord(input.success, "deployParams.success");
  assertExactKeys(success, SUCCESS_PARAM_KEYS, "deployParams.success");

  const flowMetadata = expectRecord(input.flowMetadata, "deployParams.flowMetadata");
  assertExactKeys(flowMetadata, FLOW_METADATA_PARAM_KEYS, "deployParams.flowMetadata");

  const underwriting = expectRecord(input.underwriting, "deployParams.underwriting");
  assertExactKeys(underwriting, UNDERWRITING_PARAM_KEYS, "deployParams.underwriting");

  const budgetTcr = expectRecord(input.budgetTCR, "deployParams.budgetTCR");
  assertExactKeys(budgetTcr, BUDGET_TCR_PARAM_KEYS, "deployParams.budgetTCR");

  const budgetBounds = expectRecord(
    budgetTcr.budgetBounds,
    "deployParams.budgetTCR.budgetBounds"
  );
  assertExactKeys(
    budgetBounds,
    BUDGET_BOUNDS_KEYS,
    "deployParams.budgetTCR.budgetBounds"
  );

  const oracleBounds = expectRecord(
    budgetTcr.oracleBounds,
    "deployParams.budgetTCR.oracleBounds"
  );
  assertExactKeys(
    oracleBounds,
    ORACLE_BOUNDS_KEYS,
    "deployParams.budgetTCR.oracleBounds"
  );

  const arbitratorParams = expectRecord(
    budgetTcr.arbitratorParams,
    "deployParams.budgetTCR.arbitratorParams"
  );
  assertExactKeys(
    arbitratorParams,
    ARBITRATOR_PARAM_KEYS,
    "deployParams.budgetTCR.arbitratorParams"
  );

  return {
    revnet: {
      name: requireString(revnet, "name", "deployParams.revnet"),
      ticker: requireString(revnet, "ticker", "deployParams.revnet"),
      uri: requireString(revnet, "uri", "deployParams.revnet"),
      initialIssuance: normalizeUintBigInt(
        revnet.initialIssuance,
        "deployParams.revnet.initialIssuance",
        112
      ),
      cashOutTaxRate: normalizeUintNumber(
        revnet.cashOutTaxRate,
        "deployParams.revnet.cashOutTaxRate",
        16
      ),
      reservedPercent: normalizeUintNumber(
        revnet.reservedPercent,
        "deployParams.revnet.reservedPercent",
        16
      ),
      durationSeconds: normalizeUintNumber(
        revnet.durationSeconds,
        "deployParams.revnet.durationSeconds",
        32
      ),
    },
    timing: {
      minRaise: normalizeUintBigInt(timing.minRaise, "deployParams.timing.minRaise", 256),
      minRaiseDurationSeconds: normalizeUintNumber(
        timing.minRaiseDurationSeconds,
        "deployParams.timing.minRaiseDurationSeconds",
        32
      ),
    },
    success: {
      successResolver: normalizeEvmAddress(
        requireString(success, "successResolver", "deployParams.success"),
        "deployParams.success.successResolver"
      ),
      successAssertionLiveness: normalizeUintBigInt(
        success.successAssertionLiveness,
        "deployParams.success.successAssertionLiveness",
        64
      ),
      successAssertionBond: normalizeUintBigInt(
        success.successAssertionBond,
        "deployParams.success.successAssertionBond",
        256
      ),
      successOracleSpecHash: normalizeBytes32(
        requireString(success, "successOracleSpecHash", "deployParams.success"),
        "deployParams.success.successOracleSpecHash"
      ),
      successAssertionPolicyHash: normalizeBytes32(
        requireString(success, "successAssertionPolicyHash", "deployParams.success"),
        "deployParams.success.successAssertionPolicyHash"
      ),
    },
    flowMetadata: {
      title: requireString(flowMetadata, "title", "deployParams.flowMetadata"),
      description: requireString(flowMetadata, "description", "deployParams.flowMetadata"),
      image: requireString(flowMetadata, "image", "deployParams.flowMetadata"),
      tagline: requireString(flowMetadata, "tagline", "deployParams.flowMetadata"),
      url: requireString(flowMetadata, "url", "deployParams.flowMetadata"),
    },
    underwriting: {
      budgetPremiumPpm: normalizeUintNumber(
        underwriting.budgetPremiumPpm,
        "deployParams.underwriting.budgetPremiumPpm",
        32
      ),
      budgetSlashPpm: normalizeUintNumber(
        underwriting.budgetSlashPpm,
        "deployParams.underwriting.budgetSlashPpm",
        32
      ),
    },
    budgetTCR: {
      allocationMechanismAdmin: normalizeEvmAddress(
        requireString(
          budgetTcr,
          "allocationMechanismAdmin",
          "deployParams.budgetTCR"
        ),
        "deployParams.budgetTCR.allocationMechanismAdmin"
      ),
      invalidRoundRewardsSink: normalizeEvmAddress(
        requireString(
          budgetTcr,
          "invalidRoundRewardsSink",
          "deployParams.budgetTCR"
        ),
        "deployParams.budgetTCR.invalidRoundRewardsSink"
      ),
      submissionDepositStrategy: normalizeEvmAddress(
        requireString(
          budgetTcr,
          "submissionDepositStrategy",
          "deployParams.budgetTCR"
        ),
        "deployParams.budgetTCR.submissionDepositStrategy"
      ),
      submissionBaseDeposit: normalizeUintBigInt(
        budgetTcr.submissionBaseDeposit,
        "deployParams.budgetTCR.submissionBaseDeposit",
        256
      ),
      removalBaseDeposit: normalizeUintBigInt(
        budgetTcr.removalBaseDeposit,
        "deployParams.budgetTCR.removalBaseDeposit",
        256
      ),
      submissionChallengeBaseDeposit: normalizeUintBigInt(
        budgetTcr.submissionChallengeBaseDeposit,
        "deployParams.budgetTCR.submissionChallengeBaseDeposit",
        256
      ),
      removalChallengeBaseDeposit: normalizeUintBigInt(
        budgetTcr.removalChallengeBaseDeposit,
        "deployParams.budgetTCR.removalChallengeBaseDeposit",
        256
      ),
      registrationMetaEvidence: requireString(
        budgetTcr,
        "registrationMetaEvidence",
        "deployParams.budgetTCR"
      ),
      clearingMetaEvidence: requireString(
        budgetTcr,
        "clearingMetaEvidence",
        "deployParams.budgetTCR"
      ),
      challengePeriodDuration: normalizeUintBigInt(
        budgetTcr.challengePeriodDuration,
        "deployParams.budgetTCR.challengePeriodDuration",
        256
      ),
      arbitratorExtraData: normalizeHexBytesValue(
        budgetTcr.arbitratorExtraData,
        "deployParams.budgetTCR.arbitratorExtraData",
        { allowEmpty: true }
      ),
      budgetBounds: {
        minFundingLeadTime: normalizeUintBigInt(
          budgetBounds.minFundingLeadTime,
          "deployParams.budgetTCR.budgetBounds.minFundingLeadTime",
          64
        ),
        maxFundingHorizon: normalizeUintBigInt(
          budgetBounds.maxFundingHorizon,
          "deployParams.budgetTCR.budgetBounds.maxFundingHorizon",
          64
        ),
        minExecutionDuration: normalizeUintBigInt(
          budgetBounds.minExecutionDuration,
          "deployParams.budgetTCR.budgetBounds.minExecutionDuration",
          64
        ),
        maxExecutionDuration: normalizeUintBigInt(
          budgetBounds.maxExecutionDuration,
          "deployParams.budgetTCR.budgetBounds.maxExecutionDuration",
          64
        ),
        minActivationThreshold: normalizeUintBigInt(
          budgetBounds.minActivationThreshold,
          "deployParams.budgetTCR.budgetBounds.minActivationThreshold",
          256
        ),
        maxActivationThreshold: normalizeUintBigInt(
          budgetBounds.maxActivationThreshold,
          "deployParams.budgetTCR.budgetBounds.maxActivationThreshold",
          256
        ),
        maxRunwayCap: normalizeUintBigInt(
          budgetBounds.maxRunwayCap,
          "deployParams.budgetTCR.budgetBounds.maxRunwayCap",
          256
        ),
      },
      oracleBounds: {
        liveness: normalizeUintBigInt(
          oracleBounds.liveness,
          "deployParams.budgetTCR.oracleBounds.liveness",
          64
        ),
        bondAmount: normalizeUintBigInt(
          oracleBounds.bondAmount,
          "deployParams.budgetTCR.oracleBounds.bondAmount",
          256
        ),
      },
      budgetSuccessResolver: normalizeEvmAddress(
        requireString(
          budgetTcr,
          "budgetSuccessResolver",
          "deployParams.budgetTCR"
        ),
        "deployParams.budgetTCR.budgetSuccessResolver"
      ),
      budgetSpendPolicy: normalizeEvmAddress(
        requireString(budgetTcr, "budgetSpendPolicy", "deployParams.budgetTCR"),
        "deployParams.budgetTCR.budgetSpendPolicy"
      ),
      arbitratorParams: {
        votingPeriod: normalizeUintBigInt(
          arbitratorParams.votingPeriod,
          "deployParams.budgetTCR.arbitratorParams.votingPeriod",
          256
        ),
        votingDelay: normalizeUintBigInt(
          arbitratorParams.votingDelay,
          "deployParams.budgetTCR.arbitratorParams.votingDelay",
          256
        ),
        revealPeriod: normalizeUintBigInt(
          arbitratorParams.revealPeriod,
          "deployParams.budgetTCR.arbitratorParams.revealPeriod",
          256
        ),
        arbitrationCost: normalizeUintBigInt(
          arbitratorParams.arbitrationCost,
          "deployParams.budgetTCR.arbitratorParams.arbitrationCost",
          256
        ),
        wrongOrMissedSlashBps: normalizeUintBigInt(
          arbitratorParams.wrongOrMissedSlashBps,
          "deployParams.budgetTCR.arbitratorParams.wrongOrMissedSlashBps",
          256
        ),
        slashCallerBountyBps: normalizeUintBigInt(
          arbitratorParams.slashCallerBountyBps,
          "deployParams.budgetTCR.arbitratorParams.slashCallerBountyBps",
          256
        ),
      },
    },
    goalSpendPolicy: normalizeEvmAddress(
      requireString(input, "goalSpendPolicy", "deployParams"),
      "deployParams.goalSpendPolicy"
    ),
  };
}

function resolveGoalFactoryDeployParamsRecord(raw: unknown): GoalFactoryDeployParamsRecord {
  if (!isRecord(raw)) {
    throw new Error(
      "Goal deploy params must be a JSON object with keys: revnet, timing, success, flowMetadata, underwriting, budgetTCR, goalSpendPolicy."
    );
  }

  if (GOAL_FACTORY_DEPLOY_REQUIRED_KEYS.every((key) => hasOwn(raw, key))) {
    return raw;
  }

  for (const key of GOAL_FACTORY_DEPLOY_ROOT_ALIASES) {
    const nested = raw[key];
    if (
      isRecord(nested) &&
      GOAL_FACTORY_DEPLOY_REQUIRED_KEYS.every((requiredKey) => hasOwn(nested, requiredKey))
    ) {
      return nested;
    }
  }

  throw new Error(
    "Goal deploy params must include keys: revnet, timing, success, flowMetadata, underwriting, budgetTCR, goalSpendPolicy."
  );
}

export function isGoalFactoryDeployParamsInput(
  value: unknown
): value is GoalFactoryDeployParamsInput {
  if (!isRecord(value)) return false;
  return GOAL_FACTORY_DEPLOY_REQUIRED_KEYS.every((key) => hasOwn(value, key));
}

export function normalizeGoalFactoryDeployParams(raw: unknown): GoalFactoryDeployParams {
  return normalizeGoalFactoryDeployParamsRecord(resolveGoalFactoryDeployParamsRecord(raw));
}

export function extractGoalFactoryDeployParams(raw: unknown): GoalFactoryDeployParams {
  return normalizeGoalFactoryDeployParams(raw);
}

export function encodeGoalFactoryDeployGoalData(deployParams: unknown): Hex {
  const resolvedDeployParams = extractGoalFactoryDeployParams(deployParams);

  try {
    return encodeFunctionData({
      abi: goalFactoryAbi as Abi,
      functionName: "deployGoal",
      args: [resolvedDeployParams],
    });
  } catch (error) {
    throw new Error(
      `Goal deploy params are invalid for GoalFactory.deployGoal: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}

export function buildGoalCreatePlan(params: {
  deployParams: unknown;
  factoryAddress?: string;
  network?: ProtocolNetwork | string;
}): GoalCreatePlan {
  const network = normalizeProtocolNetwork(params.network ?? "base");
  const protocolAddresses = resolveProtocolAddresses(network);
  const deployParams = extractGoalFactoryDeployParams(params.deployParams);
  const goalFactory = normalizeEvmAddress(
    params.factoryAddress ?? protocolAddresses.entrypoints.goalFactory,
    "factoryAddress"
  );

  const writeContract: GoalCreateWriteContractRequest = {
    address: goalFactory,
    abi: goalFactoryAbi,
    functionName: "deployGoal",
    args: [deployParams] as const,
  };

  return {
    chainId: protocolAddresses.chainId,
    network,
    goalFactory,
    deployParams,
    transaction: {
      to: goalFactory,
      data: encodeGoalFactoryDeployGoalData(deployParams),
      valueEth: "0",
    },
    writeContract,
  };
}

export function buildGoalCreateProtocolPlan(params: {
  deployParams: unknown;
  factoryAddress?: string;
  network?: ProtocolNetwork | string;
}): GoalCreateProtocolPlan {
  const basePlan = buildGoalCreatePlan(params);

  return {
    chainId: basePlan.chainId,
    network: basePlan.network,
    action: "goal.create",
    riskClass: "economic",
    summary: `Deploy a goal through GoalFactory ${basePlan.goalFactory}.`,
    goalFactory: basePlan.goalFactory,
    deployParams: basePlan.deployParams,
    preconditions: [],
    expectedEvents: ["GoalDeployed"],
    steps: [
      buildProtocolCallStep({
        contract: "GoalFactory",
        functionName: "deployGoal",
        label: "Deploy goal",
        to: basePlan.goalFactory,
        abi: goalFactoryAbi as Abi,
        args: [basePlan.deployParams],
      }),
    ],
  };
}

export function buildGoalCreateWriteContractRequest(params: {
  deployParams: unknown;
  factoryAddress?: string;
  network?: ProtocolNetwork | string;
}): GoalCreateWriteContractRequest {
  return buildGoalCreatePlan(params).writeContract;
}

export function buildGoalCreateTransaction(params: {
  deployParams: unknown;
  factoryAddress?: string;
  network?: ProtocolNetwork | string;
}): GoalCreateTransaction {
  return buildGoalCreatePlan(params).transaction;
}

function normalizeGoalDeployedStack(value: unknown): GoalDeployedStack {
  if (!isRecord(value)) {
    throw new Error("GoalDeployed stack payload is missing.");
  }

  const requireAddress = (key: keyof Omit<GoalDeployedStack, "goalRevnetId">): EvmAddress => {
    const rawValue = value[key];
    if (typeof rawValue !== "string") {
      throw new Error(`GoalDeployed stack field "${String(key)}" is missing.`);
    }
    return normalizeEvmAddress(rawValue, `stack.${String(key)}`);
  };

  const goalRevnetId = value.goalRevnetId;
  if (typeof goalRevnetId !== "bigint") {
    throw new Error('GoalDeployed stack field "goalRevnetId" is missing.');
  }

  return {
    goalRevnetId,
    goalToken: requireAddress("goalToken"),
    goalSuperToken: requireAddress("goalSuperToken"),
    goalTreasury: requireAddress("goalTreasury"),
    goalFlow: requireAddress("goalFlow"),
    goalFlowAllocationLedgerPipeline: requireAddress("goalFlowAllocationLedgerPipeline"),
    stakeVault: requireAddress("stakeVault"),
    budgetStakeLedger: requireAddress("budgetStakeLedger"),
    splitHook: requireAddress("splitHook"),
    jurorSlasherRouter: requireAddress("jurorSlasherRouter"),
    underwriterSlasherRouter: requireAddress("underwriterSlasherRouter"),
    successResolver: requireAddress("successResolver"),
    budgetTCR: requireAddress("budgetTCR"),
    arbitrator: requireAddress("arbitrator"),
  };
}

export function decodeGoalDeployedEvent(logs: readonly unknown[]): GoalDeployedEvent | null {
  const parsed = parseEventLogs({
    abi: goalFactoryAbi as Abi,
    logs: logs as any[],
    eventName: "GoalDeployed",
    strict: false,
  });
  const latest = parsed.at(-1);
  if (!latest) return null;

  const args = latest.args as unknown;
  if (!isRecord(args)) {
    throw new Error("GoalDeployed event args are missing.");
  }

  const caller = args.caller;
  const goalRevnetId = args.goalRevnetId;
  if (typeof caller !== "string") {
    throw new Error('GoalDeployed event field "caller" is missing.');
  }
  if (typeof goalRevnetId !== "bigint") {
    throw new Error('GoalDeployed event field "goalRevnetId" is missing.');
  }

  return {
    caller: getAddress(caller).toLowerCase() as EvmAddress,
    goalRevnetId,
    stack: normalizeGoalDeployedStack(args.stack),
  };
}

export function serializeGoalDeployedEvent(event: GoalDeployedEvent): Record<string, unknown> {
  return serializeBigInts(event) as Record<string, unknown>;
}
