import {
  REVNET_ISSUANCE_MAX_HORIZON_YEARS,
  REVNET_SECONDS_PER_YEAR,
  REVNET_WEIGHT_CUT_SCALE,
  REVNET_WEIGHT_SCALE,
} from "./config.js";
import type {
  Numberish,
  RevnetIssuanceParsedRuleset,
  RevnetIssuanceRawRuleset,
  RevnetIssuanceBaseTerms,
  RevnetIssuancePoint,
  RevnetIssuanceStage,
  RevnetIssuanceSummary,
  RevnetIssuanceTerms,
} from "./types.js";

function toFiniteNumber(value: Numberish): number | null {
  const normalized = Number(value);
  return Number.isFinite(normalized) ? normalized : null;
}

export function clampRevnetIssuanceValue(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, value));
}

export function parseRevnetRuleset(rule: RevnetIssuanceRawRuleset): RevnetIssuanceParsedRuleset {
  return {
    chainId: rule.chainId,
    projectId: rule.projectId,
    rulesetId: BigInt(rule.rulesetId),
    start: Number(rule.start ?? 0),
    duration: Number(rule.duration ?? 0),
    weight: (toFiniteNumber(rule.weight) ?? 0) / REVNET_WEIGHT_SCALE,
    weightCutPercent: (toFiniteNumber(rule.weightCutPercent) ?? 0) / REVNET_WEIGHT_CUT_SCALE,
    reservedPercent: rule.reservedPercent,
    cashOutTaxRate: rule.cashOutTaxRate,
  };
}

export const parseRevnetIssuanceRuleset = parseRevnetRuleset;

export function findActiveRevnetStageIndex(
  stages: readonly RevnetIssuanceStage[],
  nowSec: number
): number | null {
  for (let index = stages.length - 1; index >= 0; index -= 1) {
    const stage = stages[index]!;
    const startSec = Math.floor(stage.start / 1000);
    const endSec = stage.end === null ? null : Math.floor(stage.end / 1000);
    if (nowSec >= startSec && (endSec === null || nowSec < endSec)) {
      return index;
    }
  }
  return null;
}

export const findActiveRevnetIssuanceStageIndex = findActiveRevnetStageIndex;

export function getRevnetIssuanceWeightAtTimestamp(
  stage: RevnetIssuanceStage,
  timestampSec: number
): number {
  const startSec = Math.floor(stage.start / 1000);
  if (timestampSec < startSec) return stage.weight;
  if (stage.duration <= 0 || stage.weightCutPercent <= 0) return stage.weight;

  const cycles = Math.max(0, Math.floor((timestampSec - startSec) / stage.duration));
  return stage.weight * Math.pow(1 - stage.weightCutPercent, cycles);
}

export const weightAtRevnetIssuanceTimestamp = getRevnetIssuanceWeightAtTimestamp;

export const weightAtRevnetTimestamp = getRevnetIssuanceWeightAtTimestamp;

function addPoint(data: RevnetIssuancePoint[], timestampSec: number, weight: number): void {
  if (!Number.isFinite(weight) || weight <= 0) return;
  const issuancePrice = 1 / weight;
  if (!Number.isFinite(issuancePrice)) return;
  const timestamp = timestampSec * 1000;
  const last = data[data.length - 1];
  if (last?.timestamp === timestamp) {
    last.issuancePrice = issuancePrice;
    return;
  }
  data.push({ timestamp, issuancePrice });
}

export function addRevnetIssuancePoint(
  data: RevnetIssuancePoint[],
  timestampSec: number,
  weight: number
): void {
  addPoint(data, timestampSec, weight);
}

export function buildRevnetIssuanceChartData(
  stages: readonly RevnetIssuanceStage[],
  horizonSec: number
): RevnetIssuancePoint[] {
  const chartData: RevnetIssuancePoint[] = [];
  const boundedHorizon = Math.max(0, horizonSec);

  for (const stage of stages) {
    const startSec = Math.floor(stage.start / 1000);
    if (startSec > boundedHorizon) break;

    const endSec =
      stage.end === null
        ? boundedHorizon
        : Math.min(Math.floor(stage.end / 1000), boundedHorizon);
    if (endSec < startSec) continue;

    let currentWeight = stage.weight;
    addPoint(chartData, startSec, currentWeight);

    if (stage.duration > 0 && stage.weightCutPercent > 0) {
      const factor = 1 - stage.weightCutPercent;
      for (let cutTime = startSec + stage.duration; cutTime <= endSec; cutTime += stage.duration) {
        currentWeight *= factor;
        addPoint(chartData, cutTime, currentWeight);
      }
    }

    const lastPoint = chartData[chartData.length - 1];
    const lastSec = lastPoint ? Math.floor(lastPoint.timestamp / 1000) : startSec;
    if (lastSec < endSec) {
      addPoint(chartData, endSec, currentWeight);
    }
  }

  return chartData;
}

export function buildRevnetIssuanceSummary(
  stages: readonly RevnetIssuanceStage[],
  activeStageIndex: number | null,
  nowSec: number
): RevnetIssuanceSummary {
  if (stages.length === 0) {
    return {
      currentIssuance: null,
      nextIssuance: null,
      nextChangeAt: null,
      nextChangeType: null,
      reservedPercent: null,
      cashOutTaxRate: null,
      activeStage: null,
      nextStage: null,
    };
  }

  if (activeStageIndex === null) {
    const upcomingStage = stages.find((stage) => Math.floor(stage.start / 1000) > nowSec) ?? null;
    return {
      currentIssuance: null,
      nextIssuance: upcomingStage?.weight ?? null,
      nextChangeAt: upcomingStage?.start ?? null,
      nextChangeType: upcomingStage ? "stage" : null,
      reservedPercent: null,
      cashOutTaxRate: null,
      activeStage: null,
      nextStage: upcomingStage?.stage ?? null,
    };
  }

  const activeStage = stages[activeStageIndex]!;
  const currentIssuance = getRevnetIssuanceWeightAtTimestamp(activeStage, nowSec);
  let nextIssuance: number | null = null;
  let nextChangeAt: number | null = null;
  let nextChangeType: "cut" | "stage" | null = null;
  let nextStage: number | null = null;

  if (activeStage.duration > 0 && activeStage.weightCutPercent > 0) {
    const startSec = Math.floor(activeStage.start / 1000);
    const cycles = Math.max(0, Math.floor((nowSec - startSec) / activeStage.duration));
    const nextCutSec = startSec + (cycles + 1) * activeStage.duration;
    const endSec = activeStage.end === null ? null : Math.floor(activeStage.end / 1000);
    if (endSec === null || nextCutSec < endSec) {
      nextChangeAt = nextCutSec * 1000;
      nextChangeType = "cut";
      nextIssuance = getRevnetIssuanceWeightAtTimestamp(activeStage, nextCutSec);
    }
  }

  if (nextChangeAt === null) {
    const nextStageEntry = stages[activeStageIndex + 1];
    if (nextStageEntry) {
      nextChangeAt = nextStageEntry.start;
      nextChangeType = "stage";
      nextIssuance = nextStageEntry.weight;
      nextStage = nextStageEntry.stage;
    }
  }

  return {
    currentIssuance,
    nextIssuance,
    nextChangeAt,
    nextChangeType,
    reservedPercent: activeStage.reservedPercent,
    cashOutTaxRate: activeStage.cashOutTaxRate,
    activeStage: activeStage.stage,
    nextStage,
  };
}

export function buildRevnetIssuanceBaseTerms(params: {
  rawRulesets?: readonly RevnetIssuanceRawRuleset[];
  rulesets?: readonly RevnetIssuanceRawRuleset[];
  baseSymbol: string;
  tokenSymbol: string;
  chartHorizonYears?: number;
  horizonYears?: number;
  primaryProject?: { chainId: number; projectId: number };
  primaryChainId?: number;
  primaryProjectId?: number;
  chainId?: number;
  projectId?: number;
}): RevnetIssuanceBaseTerms {
  const rawRulesets = params.rawRulesets ?? params.rulesets ?? [];
  const parsedRulesets = rawRulesets.map(parseRevnetRuleset);
  if (parsedRulesets.length === 0) {
    return {
      baseSymbol: params.baseSymbol,
      tokenSymbol: params.tokenSymbol,
      stages: [],
      chartData: [],
      chartStart: 0,
      chartEnd: 0,
    };
  }

  const primaryProject =
    params.primaryProject ??
    (params.primaryChainId !== undefined && params.primaryProjectId !== undefined
      ? { chainId: params.primaryChainId, projectId: params.primaryProjectId }
      : params.chainId !== undefined && params.projectId !== undefined
        ? { chainId: params.chainId, projectId: params.projectId }
        : undefined);
  const timelineRulesets = primaryProject
    ? parsedRulesets.filter(
        (rule) =>
          rule.chainId === primaryProject.chainId && rule.projectId === primaryProject.projectId
      )
    : parsedRulesets;
  const selectedRulesets = primaryProject ? timelineRulesets : parsedRulesets;
  if (selectedRulesets.length === 0) {
    return {
      baseSymbol: params.baseSymbol,
      tokenSymbol: params.tokenSymbol,
      stages: [],
      chartData: [],
      chartStart: 0,
      chartEnd: 0,
    };
  }
  const stages: RevnetIssuanceStage[] = selectedRulesets.map((rule, index) => {
    const next = selectedRulesets[index + 1];
    return {
      stage: index + 1,
      start: rule.start * 1000,
      end: next ? next.start * 1000 : null,
      duration: rule.duration,
      weight: rule.weight,
      weightCutPercent: clampRevnetIssuanceValue(rule.weightCutPercent, 0, 1),
      reservedPercent: rule.reservedPercent,
      cashOutTaxRate: rule.cashOutTaxRate,
    };
  });

  const lastStage = stages[stages.length - 1]!;
  const lastEndSec = lastStage.end ? Math.floor(lastStage.end / 1000) : null;
  const horizonSec =
    lastEndSec ??
    Math.floor(lastStage.start / 1000) +
      (params.chartHorizonYears ??
        params.horizonYears ??
        REVNET_ISSUANCE_MAX_HORIZON_YEARS) *
        REVNET_SECONDS_PER_YEAR;

  return {
    baseSymbol: params.baseSymbol,
    tokenSymbol: params.tokenSymbol,
    stages,
    chartData: buildRevnetIssuanceChartData(stages, horizonSec),
    chartStart: stages[0]!.start,
    chartEnd: horizonSec * 1000,
  };
}

export function buildRevnetIssuanceTerms(params: {
  rawRulesets?: readonly RevnetIssuanceRawRuleset[];
  rulesets?: readonly RevnetIssuanceRawRuleset[];
  baseSymbol: string;
  tokenSymbol: string;
  now?: number;
  nowMs?: number;
  chartHorizonYears?: number;
  horizonYears?: number;
  primaryProject?: { chainId: number; projectId: number };
  primaryChainId?: number;
  primaryProjectId?: number;
  chainId?: number;
  projectId?: number;
}): RevnetIssuanceTerms {
  const baseTerms = buildRevnetIssuanceBaseTerms(params);
  const now = params.now ?? params.nowMs ?? Date.now();
  const nowSec = Math.floor(now / 1000);
  const activeStageIndex = findActiveRevnetStageIndex(baseTerms.stages, nowSec);
  return {
    ...baseTerms,
    now,
    activeStageIndex,
    summary: buildRevnetIssuanceSummary(baseTerms.stages, activeStageIndex, nowSec),
  };
}

export type RevnetRawRuleset = RevnetIssuanceRawRuleset;
export type RevnetParsedRuleset = RevnetIssuanceParsedRuleset;
