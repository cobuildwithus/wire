import { parseEther } from "viem";
import { BASE_CHAIN_ID } from "../chains.js";
import { normalizeEvmAddress, type EvmAddress } from "../evm.js";
import { baseContracts, COBUILD_PROJECT_ID_BIGINT, USDC_BASE_ADDRESS } from "../protocol-addresses.js";

export const REVNET_CHAIN_ID = BASE_CHAIN_ID;
export const COBUILD_REVNET_PROJECT_ID = COBUILD_PROJECT_ID_BIGINT;
export const REVNET_NATIVE_TOKEN = "0x000000000000000000000000000000000000eeee" as EvmAddress;
export const REVNET_PREFERRED_BASE_TOKEN = normalizeEvmAddress(
  USDC_BASE_ADDRESS,
  "USDC_BASE_ADDRESS"
);
export const NATIVE_TOKEN_DECIMALS = 18 as const;
export const JB_TOKEN_DECIMALS = 18 as const;
export const REVNET_NATIVE_TOKEN_DECIMALS = NATIVE_TOKEN_DECIMALS;
export const REVNET_TOKEN_DECIMALS = JB_TOKEN_DECIMALS;
export const REVNET_DEFAULT_GAS_BUFFER = parseEther("0.0001");

export const REVNET_RESERVED_PERCENT_DENOMINATOR = 10000n;
export const MAX_RESERVED_PERCENT = REVNET_RESERVED_PERCENT_DENOMINATOR;
export const REVNET_FEE_BPS_DENOMINATOR = 1000n;
export const CASHOUT_FEE_DENOMINATOR = REVNET_FEE_BPS_DENOMINATOR;
export const REVNET_LOAN_FEE_DENOMINATOR = REVNET_FEE_BPS_DENOMINATOR;
export const REVNET_CASHOUT_FEE_BPS = 25n;
export const JBDAO_CASHOUT_FEE_BPS = 25n;
export const REVNET_CASH_OUT_FEE_BPS = REVNET_CASHOUT_FEE_BPS;
export const JBDAO_CASH_OUT_FEE_BPS = JBDAO_CASHOUT_FEE_BPS;
export const JB_DAO_CASH_OUT_FEE_BPS = JBDAO_CASHOUT_FEE_BPS;
export const REVNET_LOAN_PERMISSION_ID = 1n;
export const REVNET_INCLUDE_ROOT_PERMISSION = true as const;
export const REVNET_INCLUDE_WILDCARD_PERMISSION = true as const;
export const REVNET_SECONDS_PER_DAY = 24 * 60 * 60;
export const REVNET_SECONDS_PER_YEAR = 365 * REVNET_SECONDS_PER_DAY;
export const REVNET_DEFAULT_LOAN_LIQUIDATION_YEARS = 10 as const;
export const REVNET_LOAN_LIQUIDATION_YEARS = REVNET_DEFAULT_LOAN_LIQUIDATION_YEARS;
export const REVNET_ISSUANCE_MAX_HORIZON_YEARS = 30 as const;
export const REVNET_WEIGHT_SCALE = 1e18;
export const REVNET_WEIGHT_CUT_SCALE = 1e9;

export const baseRevnetContracts = {
  controller: normalizeEvmAddress(baseContracts.JBController, "baseContracts.JBController"),
  directory: normalizeEvmAddress(baseContracts.JBDirectory, "baseContracts.JBDirectory"),
  multiTerminal: normalizeEvmAddress(
    baseContracts.JBMultiTerminal,
    "baseContracts.JBMultiTerminal"
  ),
  permissions: normalizeEvmAddress(baseContracts.JBPermissions, "baseContracts.JBPermissions"),
  terminalStore: normalizeEvmAddress(
    baseContracts.JBTerminalStore,
    "baseContracts.JBTerminalStore"
  ),
  revDeployer: normalizeEvmAddress(baseContracts.REVDeployer, "baseContracts.REVDeployer"),
  revLoans: normalizeEvmAddress(baseContracts.REVLoans, "baseContracts.REVLoans"),
  tokens: normalizeEvmAddress(baseContracts.JBTokens, "baseContracts.JBTokens"),
} as const;

export type RevnetContractAddresses = typeof baseRevnetContracts;

export function resolveRevnetContractAddresses(
  overrides?: Partial<RevnetContractAddresses>
): RevnetContractAddresses {
  return {
    ...baseRevnetContracts,
    ...overrides,
  };
}
