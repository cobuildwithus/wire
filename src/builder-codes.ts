import { concatHex, type Hex } from "viem";

export const BASE_BUILDER_CODE = "bc_ddyrslix" as const;
export const BASE_BUILDER_CODE_DATA_SUFFIX =
  "0x0b62635f64647972736c69780080218021802180218021802180218021" as const;

export const BASE_BUILDER_CODE_CHAIN_IDS = [8453, 84532] as const;
export type BaseBuilderCodeChainId = (typeof BASE_BUILDER_CODE_CHAIN_IDS)[number];

export const BASE_BUILDER_CODE_NETWORKS = ["base", "base-sepolia"] as const;
export type BaseBuilderCodeNetwork = (typeof BASE_BUILDER_CODE_NETWORKS)[number];

function normalizeNetwork(value: string): string {
  return value.trim().toLowerCase();
}

export function normalizeHex(value: Hex): Hex {
  return value.trim().toLowerCase() as Hex;
}

export function isBaseBuilderCodeChainId(chainId: number): chainId is BaseBuilderCodeChainId {
  return BASE_BUILDER_CODE_CHAIN_IDS.includes(chainId as BaseBuilderCodeChainId);
}

export function isBaseBuilderCodeNetwork(network: string): network is BaseBuilderCodeNetwork {
  const normalized = normalizeNetwork(network);
  return BASE_BUILDER_CODE_NETWORKS.includes(normalized as BaseBuilderCodeNetwork);
}

export function baseBuilderCodeDataSuffixForChainId(chainId: number): Hex | undefined {
  return isBaseBuilderCodeChainId(chainId) ? BASE_BUILDER_CODE_DATA_SUFFIX : undefined;
}

export function baseBuilderCodeDataSuffixForNetwork(network: string): Hex | undefined {
  return isBaseBuilderCodeNetwork(network) ? BASE_BUILDER_CODE_DATA_SUFFIX : undefined;
}

export function hasDataSuffix(data: Hex, suffix: Hex): boolean {
  const normalizedData = normalizeHex(data);
  const normalizedSuffix = normalizeHex(suffix);
  return normalizedData.endsWith(normalizedSuffix.slice(2));
}

export function stripDataSuffix(data: Hex, suffix: Hex): Hex {
  const normalizedData = normalizeHex(data);
  const normalizedSuffix = normalizeHex(suffix);
  if (!hasDataSuffix(normalizedData, normalizedSuffix)) {
    return normalizedData;
  }
  return `0x${normalizedData.slice(2, -normalizedSuffix.length + 2)}` as Hex;
}

export function appendDataSuffix(data: Hex, suffix: Hex): Hex {
  const normalizedData = normalizeHex(data);
  const normalizedSuffix = normalizeHex(suffix);
  if (hasDataSuffix(normalizedData, normalizedSuffix)) {
    return normalizedData;
  }
  return concatHex([normalizedData, normalizedSuffix]);
}

export function appendBaseBuilderCodeDataSuffix(data: Hex): Hex {
  return appendDataSuffix(data, BASE_BUILDER_CODE_DATA_SUFFIX);
}

export function stripBaseBuilderCodeDataSuffix(data: Hex): Hex {
  return stripDataSuffix(data, BASE_BUILDER_CODE_DATA_SUFFIX);
}

export function canonicalizeBaseBuilderCodeAttributedData(data: Hex): Hex {
  return stripBaseBuilderCodeDataSuffix(normalizeHex(data));
}

export function maybeAppendBaseBuilderCodeDataSuffix(params: {
  data: Hex;
  chainId?: number;
  network?: string;
  requireNonEmptyData?: boolean;
}): Hex {
  const normalizedData = normalizeHex(params.data);
  const requireNonEmptyData = params.requireNonEmptyData ?? true;
  if (requireNonEmptyData && normalizedData === "0x") {
    return normalizedData;
  }

  const suffix =
    (typeof params.chainId === "number"
      ? baseBuilderCodeDataSuffixForChainId(params.chainId)
      : undefined) ??
    (typeof params.network === "string"
      ? baseBuilderCodeDataSuffixForNetwork(params.network)
      : undefined);
  if (!suffix) {
    return normalizedData;
  }
  return appendDataSuffix(normalizedData, suffix);
}
