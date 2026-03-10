import {
  encodeFunctionData,
  getAddress,
  parseEventLogs,
  type Abi,
  type Hex,
} from "viem";
import type { EvmAddress } from "./evm.js";
import { normalizeEvmAddress } from "./evm.js";
import { goalFactoryAbi } from "./protocol-abis.js";
import { goalFactoryAddress } from "./protocol-addresses.js";

export const GOAL_FACTORY_DEPLOY_REQUIRED_KEYS = [
  "revnet",
  "timing",
  "success",
  "flowMetadata",
  "underwriting",
  "budgetTCR",
  "goalSpendPolicy",
] as const;

export type GoalFactoryDeployParamsInput = Record<string, unknown>;

export type GoalCreateTransaction = {
  to: EvmAddress;
  data: Hex;
  valueEth: "0";
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

export function isGoalFactoryDeployParamsInput(
  value: unknown
): value is GoalFactoryDeployParamsInput {
  if (!isRecord(value)) return false;
  return GOAL_FACTORY_DEPLOY_REQUIRED_KEYS.every((key) => hasOwn(value, key));
}

export function extractGoalFactoryDeployParams(raw: unknown): GoalFactoryDeployParamsInput {
  if (isGoalFactoryDeployParamsInput(raw)) return raw;
  if (!isRecord(raw)) {
    throw new Error(
      "Goal deploy params must be a JSON object with keys: revnet, timing, success, flowMetadata, underwriting, budgetTCR, goalSpendPolicy."
    );
  }

  for (const key of ["deployParams", "params", "p"]) {
    const nested = raw[key];
    if (isGoalFactoryDeployParamsInput(nested)) {
      return nested;
    }
  }

  throw new Error(
    "Goal deploy params must include keys: revnet, timing, success, flowMetadata, underwriting, budgetTCR, goalSpendPolicy."
  );
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

export function buildGoalCreateTransaction(params: {
  deployParams: unknown;
  factoryAddress?: string;
}): GoalCreateTransaction {
  return {
    to: normalizeEvmAddress(params.factoryAddress ?? goalFactoryAddress, "factoryAddress"),
    data: encodeGoalFactoryDeployGoalData(params.deployParams),
    valueEth: "0",
  };
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
