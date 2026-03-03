import { describe, expect, it } from "vitest";
import {
  BASE_SEPOLIA_USDC_CONTRACT,
  BASE_USDC_CONTRACT,
  CLI_WALLET_INIT_MODES,
  CLI_WALLET_NETWORKS,
  defaultRpcUrlForNetwork,
  normalizeCliWalletInitMode,
  normalizeCliWalletNetwork,
  normalizeCliWalletSendToken,
  parseCliWalletSendAmountAtomic,
  usdcContractForNetwork,
  walletModeFromInitMode,
} from "../src/wallet.js";

describe("wallet contract", () => {
  it("normalizes wallet init modes", () => {
    expect(CLI_WALLET_INIT_MODES).toEqual(["hosted", "local-generate", "local-key"]);
    expect(normalizeCliWalletInitMode(" local-generate ")).toBe("local-generate");
    expect(walletModeFromInitMode("hosted")).toBe("hosted");
    expect(walletModeFromInitMode("local-key")).toBe("local");
    expect(() => normalizeCliWalletInitMode("local")).toThrow(
      "wallet mode must be one of: hosted, local-generate, local-key"
    );
  });

  it("normalizes wallet networks and defaults", () => {
    expect(CLI_WALLET_NETWORKS).toEqual(["base", "base-sepolia"]);
    expect(normalizeCliWalletNetwork(" BASE ")).toBe("base");
    expect(normalizeCliWalletNetwork("base-sepolia")).toBe("base-sepolia");
    expect(() => normalizeCliWalletNetwork("ethereum")).toThrow("unsupported wallet network");
    expect(defaultRpcUrlForNetwork("base")).toBe("https://mainnet.base.org");
    expect(defaultRpcUrlForNetwork("base-sepolia")).toBe("https://sepolia.base.org");
    expect(usdcContractForNetwork("base")).toBe(BASE_USDC_CONTRACT);
    expect(usdcContractForNetwork("base-sepolia")).toBe(BASE_SEPOLIA_USDC_CONTRACT);
  });

  it("normalizes send token and amount parsing", () => {
    expect(normalizeCliWalletSendToken("eth")).toBe("eth");
    expect(normalizeCliWalletSendToken("USDC")).toBe("usdc");
    expect(normalizeCliWalletSendToken("0x1111111111111111111111111111111111111111")).toBe(
      "0x1111111111111111111111111111111111111111"
    );

    expect(parseCliWalletSendAmountAtomic({ token: "eth", amount: "0.01" })).toBe(10_000_000_000_000_000n);
    expect(parseCliWalletSendAmountAtomic({ token: "usdc", amount: "1.5" })).toBe(1_500_000n);
    expect(
      parseCliWalletSendAmountAtomic({
        token: "0x1111111111111111111111111111111111111111",
        amount: "7.25",
        decimals: 6,
      })
    ).toBe(7_250_000n);

    expect(() =>
      parseCliWalletSendAmountAtomic({
        token: "0x1111111111111111111111111111111111111111",
        amount: "1",
      })
    ).toThrow("decimals is required for ERC-20 token addresses");
  });
});

