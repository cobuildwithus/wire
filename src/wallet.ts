import { type Address, parseEther, parseUnits } from "viem";
import { normalizeEvmAddress } from "./evm.js";

export const CLI_WALLET_MODES = ["hosted", "local"] as const;
export type CliWalletMode = (typeof CLI_WALLET_MODES)[number];

export const CLI_WALLET_INIT_MODES = ["hosted", "local-generate", "local-key"] as const;
export type CliWalletInitMode = (typeof CLI_WALLET_INIT_MODES)[number];

export const CLI_WALLET_NETWORKS = ["base"] as const;
export type CliWalletNetwork = (typeof CLI_WALLET_NETWORKS)[number];

export const DEFAULT_BASE_RPC_URL = "https://mainnet.base.org";

export const BASE_USDC_CONTRACT = "0x833589fCD6EDB6E08F4C7C32D4F71B54BDA02913" as Address;

export type CliWalletSendToken = "eth" | "usdc" | Address;

export function isCliWalletInitMode(value: string): value is CliWalletInitMode {
  return CLI_WALLET_INIT_MODES.includes(value as CliWalletInitMode);
}

export function normalizeCliWalletInitMode(value: string): CliWalletInitMode {
  const normalized = value.trim().toLowerCase();
  if (!isCliWalletInitMode(normalized)) {
    throw new Error("wallet mode must be one of: hosted, local-generate, local-key");
  }
  return normalized;
}

export function walletModeFromInitMode(mode: CliWalletInitMode): CliWalletMode {
  return mode === "hosted" ? "hosted" : "local";
}

export function isCliWalletNetwork(value: string): value is CliWalletNetwork {
  return CLI_WALLET_NETWORKS.includes(value as CliWalletNetwork);
}

export function normalizeCliWalletNetwork(value: string): CliWalletNetwork {
  const normalized = value.trim().toLowerCase();
  if (!isCliWalletNetwork(normalized)) {
    throw new Error(`unsupported wallet network: ${value}`);
  }
  return normalized;
}

export function defaultRpcUrlForNetwork(_network: CliWalletNetwork): string {
  return DEFAULT_BASE_RPC_URL;
}

export function usdcContractForNetwork(_network: CliWalletNetwork): Address {
  return BASE_USDC_CONTRACT;
}

export function normalizeCliWalletSendToken(token: string): CliWalletSendToken {
  const normalized = token.trim().toLowerCase();
  if (normalized === "eth" || normalized === "usdc") {
    return normalized;
  }
  return normalizeEvmAddress(normalized, "token") as Address;
}

export function parseCliWalletSendAmountAtomic(params: {
  token: CliWalletSendToken;
  amount: string;
  decimals?: number;
}): bigint {
  if (params.token === "eth") {
    return parseEther(params.amount);
  }
  if (params.token === "usdc") {
    return parseUnits(params.amount, 6);
  }
  if (typeof params.decimals !== "number" || params.decimals < 0 || params.decimals > 255) {
    throw new Error("decimals is required for ERC-20 token addresses");
  }
  return parseUnits(params.amount, params.decimals);
}
