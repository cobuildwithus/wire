import { describe, expect, it } from "vitest";

import { getRevnetPaymentAmountForTokens, quoteRevnetPurchase } from "../src/index.js";

describe("revnet reverse quote rounding", () => {
  it("rounds reverse purchase quotes up so requested payer tokens are not underfunded", () => {
    const weight = 1_000_000n * 10n ** 18n;
    const reservedPercent = 1000;
    const exactPaymentAmount = 10n ** 18n;
    const exactQuote = quoteRevnetPurchase({
      paymentAmount: exactPaymentAmount,
      weight,
      reservedPercent,
    });
    const desiredPayerTokens = exactQuote.payerTokens + 1n;

    const roundedPaymentAmount = getRevnetPaymentAmountForTokens({
      payerTokens: desiredPayerTokens,
      weight,
      reservedPercent,
    });

    expect(roundedPaymentAmount).toBe(exactPaymentAmount + 1n);
    expect(exactQuote.payerTokens).toBeLessThan(desiredPayerTokens);
    expect(
      quoteRevnetPurchase({
        paymentAmount: roundedPaymentAmount,
        weight,
        reservedPercent,
      }).payerTokens,
    ).toBeGreaterThanOrEqual(desiredPayerTokens);
  });
});
