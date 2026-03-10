export const BASE_ONLY_NETWORKS = ["base"] as const;
export type BaseOnlyNetwork = (typeof BASE_ONLY_NETWORKS)[number];

export const BASE_EXPLORER_ROOT = "https://basescan.org";

const BASE_ONLY_RUNTIME_ALIASES = new Map<string, BaseOnlyNetwork>([
  ["base", "base"],
  ["base-mainnet", "base"],
]);

const BASE_ONLY_CONFIGURED_ALIASES = new Map<string, BaseOnlyNetwork>([
  ...BASE_ONLY_RUNTIME_ALIASES,
]);

function canonicalizeBaseNetwork(
  value: string | null | undefined,
  aliases: ReadonlyMap<string, BaseOnlyNetwork>
): BaseOnlyNetwork | null {
  const normalized = value?.trim().toLowerCase();
  if (!normalized) {
    return null;
  }

  return aliases.get(normalized) ?? null;
}

export function parseBaseOnlyNetwork(value: string | null | undefined): BaseOnlyNetwork | null {
  return canonicalizeBaseNetwork(value, BASE_ONLY_RUNTIME_ALIASES);
}

export function canonicalizeBaseOnlyConfiguredNetwork(
  value: string | null | undefined
): BaseOnlyNetwork | null {
  return canonicalizeBaseNetwork(value, BASE_ONLY_CONFIGURED_ALIASES);
}

export function getBaseExplorerRoot(network: string | null | undefined): string | null {
  return parseBaseOnlyNetwork(network) ? BASE_EXPLORER_ROOT : null;
}

export function getBaseExplorerTxUrl(
  network: string | null | undefined,
  transactionHash: string | null | undefined
): string | null {
  if (typeof transactionHash !== "string" || transactionHash.length === 0) {
    return null;
  }

  const explorerRoot = getBaseExplorerRoot(network);
  if (!explorerRoot) {
    return null;
  }

  return `${explorerRoot}/tx/${transactionHash}`;
}
