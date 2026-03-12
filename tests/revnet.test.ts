import { describe, expect, it } from "vitest";
import { encodeFunctionData } from "viem";

import {
  REVNET_NATIVE_TOKEN,
  applyJbDaoCashOutFee,
  applyRevnetCashOutFee,
  baseRevnetContracts,
  buildRevnetBorrowPlan,
  buildRevnetBorrowPlanFromContext,
  buildRevnetIssuanceTerms,
  buildRevnetPayIntent,
  encodeWriteIntent,
  getRevnetPaymentAmountForTokens,
  getRevnetPrepaidFeePercent,
  jbMultiTerminalAbi,
  quoteRevnetLoan,
  quoteRevnetPurchase,
  type RevnetBorrowContext,
} from "../src/index.js";

const ACCOUNT = "0x1111111111111111111111111111111111111111";
const BENEFICIARY = "0x2222222222222222222222222222222222222222";
const TERMINAL = "0x3333333333333333333333333333333333333333";
const LOAN_TOKEN = "0x4444444444444444444444444444444444444444";
const PROJECT_TOKEN = "0x5555555555555555555555555555555555555555";

describe("revnet helpers", () => {
  it("quotes purchases and inverts the payer token amount back to a payment amount", () => {
    const weight = 2n * 10n ** 18n;
    const paymentAmount = 10n ** 18n;
    const quote = quoteRevnetPurchase({
      paymentAmount,
      weight,
      reservedPercent: 1000,
    });

    expect(quote).toEqual({
      payerTokens: 1800000000000000000n,
      reservedTokens: 200000000000000000n,
      totalTokens: 2000000000000000000n,
    });
    expect(
      getRevnetPaymentAmountForTokens({
        payerTokens: quote.payerTokens,
        weight,
        reservedPercent: 1000,
      })
    ).toBe(paymentAmount);
  });

  it("applies revnet and JB DAO cash-out fees and quotes loan fees", () => {
    expect(applyRevnetCashOutFee(1000n)).toBe(975n);
    expect(applyJbDaoCashOutFee(1000n)).toBe(975n);
    expect(
      getRevnetPrepaidFeePercent({
        repayYears: 20,
        minPrepaidFeePercent: 10n,
        maxPrepaidFeePercent: 100n,
        liquidationYears: 10,
      })
    ).toBe(100n);

    const quote = quoteRevnetLoan({
      borrowableAmount: 1000n,
      borrowableContext: {
        token: LOAN_TOKEN,
        decimals: 6,
        currency: 1,
      },
      prepaidFeePercent: 200n,
      revPrepaidFeePercent: 100n,
      maxPrepaidFeePercent: 1000n,
    });

    expect(quote.grossBorrowableAmount).toBe(1000n);
    expect(quote.netBorrowableAmount).toBe(700n);
    expect(quote.upfrontFeeAmount).toBe(300n);
    expect(quote.prepaidFeeAmount).toBe(200n);
    expect(quote.revPrepaidFeeAmount).toBe(100n);
    expect(quote.variableFeeAmount).toBe(800n);
    expect(quote.maxRepayAmount).toBe(1800n);
    expect(quote.totalFeeBps).toBe(300n);
  });

  it("builds issuance terms that distinguish in-stage cuts from stage transitions", () => {
    const rulesets = [
      {
        chainId: 8453,
        projectId: 138,
        rulesetId: 1n,
        start: 0,
        duration: 100,
        weight: 2n * 10n ** 18n,
        weightCutPercent: 100000000n,
        reservedPercent: 1000,
        cashOutTaxRate: 2500,
      },
      {
        chainId: 8453,
        projectId: 138,
        rulesetId: 2n,
        start: 500,
        duration: 0,
        weight: 10n ** 18n,
        weightCutPercent: 0n,
        reservedPercent: 1500,
        cashOutTaxRate: 3000,
      },
    ] as const;

    const cutTerms = buildRevnetIssuanceTerms({
      rawRulesets: rulesets,
      baseSymbol: "ETH",
      tokenSymbol: "REV",
      nowMs: 250_000,
    });
    expect(cutTerms.activeStageIndex).toBe(0);
    expect(cutTerms.summary.activeStage).toBe(1);
    expect(cutTerms.summary.currentIssuance).toBeCloseTo(1.62);
    expect(cutTerms.summary.nextChangeType).toBe("cut");
    expect(cutTerms.summary.nextChangeAt).toBe(300_000);
    expect(cutTerms.summary.nextIssuance).toBeCloseTo(1.458);
    expect(cutTerms.chartData.some((point) => point.timestamp === 300_000)).toBe(true);

    const stageTerms = buildRevnetIssuanceTerms({
      rawRulesets: rulesets,
      baseSymbol: "ETH",
      tokenSymbol: "REV",
      nowMs: 420_000,
    });
    expect(stageTerms.summary.currentIssuance).toBeCloseTo(1.3122);
    expect(stageTerms.summary.nextChangeType).toBe("stage");
    expect(stageTerms.summary.nextChangeAt).toBe(500_000);
    expect(stageTerms.summary.nextIssuance).toBe(1);
    expect(stageTerms.summary.nextStage).toBe(2);
  });

  it("encodes native pay intents and keeps borrow plan collateral counts stable", () => {
    const payIntent = buildRevnetPayIntent({
      terminalAddress: TERMINAL,
      paymentAmount: 123n,
      beneficiary: BENEFICIARY,
    });
    expect(encodeWriteIntent(payIntent)).toEqual({
      to: TERMINAL,
      data: encodeFunctionData({
        abi: jbMultiTerminalAbi,
        functionName: "pay",
        args: [138n, REVNET_NATIVE_TOKEN, 123n, BENEFICIARY, 0n, "", "0x"],
      }),
      value: 123n,
    });

    const context: RevnetBorrowContext = {
      projectId: 138n,
      account: ACCOUNT,
      token: {
        projectId: 138n,
        contracts: baseRevnetContracts,
        address: PROJECT_TOKEN,
        symbol: "REV",
        decimals: 18,
        balance: 12n,
      },
      accountingContexts: [
        {
          token: LOAN_TOKEN,
          decimals: 6,
          currency: 1,
        },
      ],
      selectedAccountingContext: {
        token: LOAN_TOKEN,
        decimals: 6,
        currency: 1,
      },
      terminal: TERMINAL,
      permissionsAddress: baseRevnetContracts.permissions,
      revLoansAddress: baseRevnetContracts.revLoans,
      loanSources: [
        {
          token: LOAN_TOKEN,
          terminal: TERMINAL,
        },
      ],
      selectedLoanSource: {
        token: LOAN_TOKEN,
        terminal: TERMINAL,
      },
      selectedLoanAccountingContext: {
        token: LOAN_TOKEN,
        decimals: 6,
        currency: 1,
      },
      collateralCount: 12n,
      feeConfig: {
        revPrepaidFeePercent: 25n,
        minPrepaidFeePercent: 10n,
        maxPrepaidFeePercent: 100n,
        liquidationDurationSeconds: 315360000n,
      },
      hasBorrowPermission: false,
      needsBorrowPermission: true,
      borrowableContext: {
        token: LOAN_TOKEN,
        decimals: 6,
        currency: 1,
      },
      borrowableAmount: 999n,
    };

    const planFromContext = buildRevnetBorrowPlanFromContext(context, {
      prepaidFeePercent: 50n,
    });
    expect(planFromContext.permissionRequired).toBe(true);
    expect(planFromContext.steps).toHaveLength(2);
    expect(planFromContext.steps[1]?.intent.functionName).toBe("borrowFrom");
    expect(planFromContext.steps[1]?.intent.args[3]).toBe(12n);

    const skippedPermissionPlan = buildRevnetBorrowPlan({
      account: ACCOUNT,
      source: {
        token: LOAN_TOKEN,
        terminal: TERMINAL,
      },
      collateralCount: 12n,
      prepaidFeePercent: 50n,
      needsPermission: true,
      permissionsAddress: baseRevnetContracts.permissions,
      revLoansAddress: baseRevnetContracts.revLoans,
      permissionMode: "skip",
    });
    expect(skippedPermissionPlan.steps).toHaveLength(1);
    expect(skippedPermissionPlan.preconditions[0]).toContain("Ensure");
    expect(() =>
      buildRevnetBorrowPlanFromContext(
        {
          ...context,
          account: null,
        },
        {
          prepaidFeePercent: 50n,
        }
      )
    ).toThrow("Borrow plan context requires an account.");
  });

  it("does not attach native value for ERC20 pay intents", () => {
    const payIntent = buildRevnetPayIntent({
      terminalAddress: TERMINAL,
      paymentAmount: 123n,
      paymentToken: LOAN_TOKEN,
      beneficiary: BENEFICIARY,
    });

    expect(payIntent).toMatchObject({
      functionName: "pay",
      args: [138n, LOAN_TOKEN, 123n, BENEFICIARY, 0n, "", "0x"],
    });
    expect(payIntent.value).toBeUndefined();
    expect(encodeWriteIntent(payIntent)).toEqual({
      to: TERMINAL,
      data: encodeFunctionData({
        abi: jbMultiTerminalAbi,
        functionName: "pay",
        args: [138n, LOAN_TOKEN, 123n, BENEFICIARY, 0n, "", "0x"],
      }),
      value: 0n,
    });
  });
});
