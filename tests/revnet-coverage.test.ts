import { describe, expect, it } from "vitest";
import { zeroAddress } from "viem";

import {
  REVNET_NATIVE_TOKEN,
  REVNET_PREFERRED_BASE_TOKEN,
  addRevnetIssuancePoint,
  applyJbDaoCashOutFee,
  baseRevnetContracts,
  buildRevnetIssuanceSummary,
  buildRevnetBorrowIntent,
  buildRevnetBorrowPlanFromClient,
  buildRevnetCashOutIntent,
  buildRevnetGrantLoanPermissionIntent,
  buildRevnetIssuanceBaseTerms,
  clampRevnetIssuanceValue,
  findActiveRevnetStageIndex,
  getRevnetBorrowContext,
  getRevnetCashOutContext,
  getRevnetPaymentContext,
  getRevnetPrepaidFeePercent,
  getRevnetPositionContext,
  getRevnetPaymentAmountForTokens,
  parseRevnetRuleset,
  quoteRevnetBorrow,
  quoteRevnetCashOut,
  quoteRevnetPurchase,
  resolveRevnetContractAddresses,
  REVNET_LOAN_PERMISSION_ID,
  revnetWeightFromScaled,
  selectPreferredRevnetAccountingContext,
  selectPreferredRevnetLoanSource,
  issuancePriceFromRevnetWeight,
  weightAtRevnetTimestamp,
  type RevnetAccountingContext,
  type RevnetReadClient,
} from "../src/index.js";

const ACCOUNT = "0x1111111111111111111111111111111111111111";
const PROJECT_TOKEN = "0x2222222222222222222222222222222222222222";
const ALT_TOKEN = "0x3333333333333333333333333333333333333333";
const PROJECT_ID = 138n;

const baseContext: RevnetAccountingContext = {
  token: REVNET_PREFERRED_BASE_TOKEN,
  decimals: 6,
  currency: 1,
};

function createReadClient(): RevnetReadClient {
  return {
    async readContract(params) {
      switch (params.functionName) {
        case "currentRulesetOf":
          return [
            {
              cycleNumber: 1n,
              id: 11n,
              basedOnId: 0n,
              start: 100n,
              duration: 3600n,
              weight: 2n * 10n ** 18n,
              weightCutPercent: 100000000n,
              approvalHook: zeroAddress,
              metadata: 1n,
            },
            {
              reservedPercent: 5000,
              cashOutTaxRate: 2500,
              baseCurrency: 1,
              pausePay: false,
            },
          ] as const;
        case "primaryTerminalOf":
          return baseRevnetContracts.multiTerminal;
        case "terminalsOf":
          return [baseRevnetContracts.multiTerminal];
        case "accountingContextsOf":
          return [
            baseContext,
            {
              token: REVNET_NATIVE_TOKEN,
              decimals: 18,
              currency: 0,
            },
          ];
        case "tokenOf":
          return PROJECT_TOKEN;
        case "symbol":
          if (params.address === PROJECT_TOKEN) return "REV";
          return "USDC";
        case "decimals":
          return 18;
        case "totalBalanceOf":
          return 12n * 10n ** 18n;
        case "PERMISSIONS":
          return baseRevnetContracts.permissions;
        case "loansOf":
          return baseRevnetContracts.revLoans;
        case "loanSourcesOf":
          return [
            {
              token: REVNET_PREFERRED_BASE_TOKEN,
              terminal: baseRevnetContracts.multiTerminal,
            },
            {
              token: ALT_TOKEN,
              terminal: baseRevnetContracts.multiTerminal,
            },
          ];
        case "accountingContextForTokenOf":
          return baseContext;
        case "currentReclaimableSurplusOf":
          return 5000000n;
        case "hasPermission":
          return false;
        case "REV_PREPAID_FEE_PERCENT":
          return 25n;
        case "MIN_PREPAID_FEE_PERCENT":
          return 10n;
        case "MAX_PREPAID_FEE_PERCENT":
          return 100n;
        case "LOAN_LIQUIDATION_DURATION":
          return 315360000n;
        case "borrowableAmountFrom":
          return 1000000n;
        default:
          throw new Error(`Unexpected contract read: ${params.functionName}`);
      }
    },
  };
}

function createFallbackReadClient(): RevnetReadClient {
  return {
    async readContract(params) {
      switch (params.functionName) {
        case "currentRulesetOf":
          return [
            {
              cycleNumber: 1n,
              id: 1n,
              basedOnId: 0n,
              start: 0n,
              duration: 0n,
              weight: 10n ** 18n,
              weightCutPercent: 0n,
              approvalHook: zeroAddress,
              metadata: 0n,
            },
            {
              reservedPercent: 0,
              cashOutTaxRate: 0,
              baseCurrency: 1,
              pausePay: true,
            },
          ] as const;
        case "primaryTerminalOf":
          return zeroAddress;
        case "terminalsOf":
          return [baseRevnetContracts.multiTerminal];
        case "accountingContextsOf":
          return [
            {
              token: ALT_TOKEN,
              decimals: 6,
              currency: 1,
            },
          ];
        case "tokenOf":
          return zeroAddress;
        case "PERMISSIONS":
          return zeroAddress;
        case "loansOf":
          return zeroAddress;
        case "loanSourcesOf":
          return [];
        case "accountingContextForTokenOf":
          return {
            token: ALT_TOKEN,
            decimals: 6,
            currency: 1,
          };
        default:
          if (params.functionName === "borrowableAmountFrom") return 0n;
          throw new Error(`Unexpected fallback read: ${params.functionName}`);
      }
    },
  };
}

function createPositionFallbackReadClient(): RevnetReadClient {
  const fallback = createFallbackReadClient();
  return {
    async readContract(params) {
      if (params.functionName === "primaryTerminalOf") {
        return baseRevnetContracts.multiTerminal;
      }
      return fallback.readContract(params);
    },
  };
}

describe("revnet coverage helpers", () => {
  it("covers config aliases, selection helpers, and zero-value math branches", () => {
    expect(
      resolveRevnetContractAddresses({
        revLoans: ALT_TOKEN,
      }).revLoans,
    ).toBe(ALT_TOKEN);
    expect(
      selectPreferredRevnetAccountingContext([baseContext], ALT_TOKEN)?.token,
    ).toBe(baseContext.token);
    expect(
      selectPreferredRevnetLoanSource(
        [{ token: REVNET_PREFERRED_BASE_TOKEN, terminal: baseRevnetContracts.multiTerminal }],
        ALT_TOKEN,
      )?.token,
    ).toBe(REVNET_PREFERRED_BASE_TOKEN);
    expect(quoteRevnetPurchase({ amount: 0n, weight: 0n, reservedPercent: 0 })).toEqual({
      payerTokens: 0n,
      reservedTokens: 0n,
      totalTokens: 0n,
    });
    expect(getRevnetPaymentAmountForTokens({ payerTokens: 1n, weight: 0n, reservedPercent: 0 })).toBe(0n);
    expect(
      getRevnetPaymentAmountForTokens({
        payerTokens: 10n,
        weight: 10n,
        reservedPercent: 10000,
      }),
    ).toBe(0n);
    expect(
      getRevnetPrepaidFeePercent({
        repayYears: -1,
        minPrepaidFeePercent: 5n,
        maxPrepaidFeePercent: 20n,
      }),
    ).toBe(5n);
    expect(issuancePriceFromRevnetWeight(2)).toBe(0.5);
    expect(revnetWeightFromScaled(2n * 10n ** 18n)).toBe(2);
  });

  it("covers issuance helpers for empty timelines, upcoming stages, and utility aliases", () => {
    expect(clampRevnetIssuanceValue(Number.NaN, 0, 1)).toBe(0);
    expect(findActiveRevnetStageIndex([], 100)).toBeNull();
    expect(
      buildRevnetIssuanceBaseTerms({
        rulesets: [],
        baseSymbol: "ETH",
        tokenSymbol: "REV",
      }),
    ).toEqual({
      baseSymbol: "ETH",
      tokenSymbol: "REV",
      stages: [],
      chartData: [],
      chartStart: 0,
      chartEnd: 0,
    });

    const parsed = parseRevnetRuleset({
      chainId: 8453,
      projectId: 138,
      rulesetId: 1n,
      start: 100,
      duration: 50,
      weight: 2n * 10n ** 18n,
      weightCutPercent: 100000000,
      reservedPercent: 5000,
      cashOutTaxRate: 2500,
    });
    expect(parsed.weight).toBe(2);

    const terms = buildRevnetIssuanceBaseTerms({
      rulesets: [
        {
          chainId: 8453,
          projectId: 138,
          rulesetId: 1n,
          start: 100,
          duration: 50,
          weight: 2n * 10n ** 18n,
          weightCutPercent: 100000000,
          reservedPercent: 5000,
          cashOutTaxRate: 2500,
        },
      ],
      baseSymbol: "ETH",
      tokenSymbol: "REV",
      horizonYears: 1,
    });
    expect(terms.stages).toHaveLength(1);
    expect(weightAtRevnetTimestamp(terms.stages[0]!, 150)).toBeCloseTo(1.8);

    const points = [...terms.chartData];
    addRevnetIssuancePoint(points, 200, 1.5);
    expect(points.some((point) => point.timestamp === 200000)).toBe(true);
    expect(buildRevnetIssuanceSummary([], null, 100)).toMatchObject({
      currentIssuance: null,
      nextChangeType: null,
    });
    expect(
      buildRevnetIssuanceSummary(
        [
          {
            stage: 1,
            start: 500000,
            end: null,
            duration: 0,
            weight: 2,
            weightCutPercent: 0,
            reservedPercent: 5000,
            cashOutTaxRate: 2500,
          },
        ],
        null,
        100,
      ),
    ).toMatchObject({
      currentIssuance: 2,
      nextChangeType: "stage",
      nextStage: 1,
    });
    expect(
      buildRevnetIssuanceBaseTerms({
        rulesets: [
          {
            chainId: 1,
            projectId: 1,
            rulesetId: 1n,
            start: 0,
            duration: 0,
            weight: 10n ** 18n,
            weightCutPercent: 0,
            reservedPercent: 0,
            cashOutTaxRate: 0,
          },
          {
            chainId: 8453,
            projectId: 138,
            rulesetId: 2n,
            start: 10,
            duration: 0,
            weight: 2n * 10n ** 18n,
            weightCutPercent: 0,
            reservedPercent: 1000,
            cashOutTaxRate: 2500,
          },
        ],
        baseSymbol: "ETH",
        tokenSymbol: "REV",
        primaryProject: { chainId: 8453, projectId: 138 },
      }).stages[0]?.weight,
    ).toBe(2);
  });

  it("covers the read layer for payment, position, cash-out, and borrow contexts", async () => {
    const client = createReadClient();

    const payment = await getRevnetPaymentContext(client, {
      projectId: PROJECT_ID,
      token: REVNET_NATIVE_TOKEN,
    });
    expect(payment.supportsPayments).toBe(true);
    expect(payment.ruleset.metadata.reservedPercent).toBe(5000);
    expect(payment.terminalAddress).toBe(baseRevnetContracts.multiTerminal);

    const position = await getRevnetPositionContext(client, {
      projectId: PROJECT_ID,
      account: ACCOUNT,
      preferredBaseToken: REVNET_PREFERRED_BASE_TOKEN,
    });
    expect(position.token.address).toBe(PROJECT_TOKEN);
    expect(position.selectedAccountingContext?.token).toBe(REVNET_PREFERRED_BASE_TOKEN);
    expect(position.selectedLoanSource?.token).toBe(REVNET_PREFERRED_BASE_TOKEN);

    const quote = await quoteRevnetCashOut(client, {
      projectId: PROJECT_ID,
      rawCashOutCount: 1000n,
      terminal: baseRevnetContracts.multiTerminal,
      accountingContext: baseContext,
    });
    expect(quote.quotedCashOutCount).toBe(975n);
    expect(quote.netReclaimAmount).toBe(applyJbDaoCashOutFee(5000000n));

    const cashOutContext = await getRevnetCashOutContext(client, {
      projectId: PROJECT_ID,
      account: ACCOUNT,
      preferredBaseToken: REVNET_PREFERRED_BASE_TOKEN,
    });
    expect(cashOutContext.quoteTerminal).toBe(baseRevnetContracts.multiTerminal);
    expect(cashOutContext.quoteAccountingContext?.token).toBe(REVNET_PREFERRED_BASE_TOKEN);

    const borrowContext = await getRevnetBorrowContext(client, {
      projectId: PROJECT_ID,
      account: ACCOUNT,
      collateralCount: 12n,
      preferredBaseToken: REVNET_PREFERRED_BASE_TOKEN,
    });
    expect(borrowContext.collateralCount).toBe(12n);
    expect(borrowContext.hasBorrowPermission).toBe(false);
    expect(borrowContext.needsBorrowPermission).toBe(true);
    expect(borrowContext.borrowableAmount).toBe(1000000n);
    expect(borrowContext.borrowableContext?.token).toBe(REVNET_PREFERRED_BASE_TOKEN);

    const borrowQuote = await quoteRevnetBorrow(client, {
      projectId: PROJECT_ID,
      collateralCount: 12n,
      borrowableContext: baseContext,
      prepaidFeePercent: 50n,
      revPrepaidFeePercent: 25n,
      maxPrepaidFeePercent: 100n,
    });
    expect(borrowQuote.grossBorrowableAmount).toBe(1000000n);
    expect(borrowQuote.netBorrowableAmount).toBe(925000n);

    const fallbackPayment = await getRevnetPaymentContext(createFallbackReadClient(), {
      projectId: PROJECT_ID,
      token: REVNET_NATIVE_TOKEN,
    });
    expect(fallbackPayment.supportsPayments).toBe(false);
    expect(fallbackPayment.terminalAddress).toBe(baseRevnetContracts.multiTerminal);
    expect(fallbackPayment.isPayPaused).toBe(true);

    const fallbackPosition = await getRevnetPositionContext(createPositionFallbackReadClient(), {
      projectId: PROJECT_ID,
      preferredBaseToken: ALT_TOKEN,
    });
    expect(fallbackPosition.token.address).toBeNull();
    expect(fallbackPosition.permissionsAddress).toBe(baseRevnetContracts.permissions);
    expect(fallbackPosition.revLoansAddress).toBe(baseRevnetContracts.revLoans);
    expect(fallbackPosition.selectedLoanSource?.token).toBe(ALT_TOKEN);
  });

  it("covers write intents and borrow-plan helpers, including client-derived plans", async () => {
    const permissionIntent = buildRevnetGrantLoanPermissionIntent({
      permissionsAddress: baseRevnetContracts.permissions,
      account: ACCOUNT,
      operator: baseRevnetContracts.revLoans,
    });
    expect(permissionIntent.functionName).toBe("setPermissionsFor");
    expect(permissionIntent.args[1]).toEqual({
      operator: baseRevnetContracts.revLoans,
      projectId: PROJECT_ID,
      permissionIds: [Number(REVNET_LOAN_PERMISSION_ID)],
    });

    const cashOutIntent = buildRevnetCashOutIntent({
      terminalAddress: baseRevnetContracts.multiTerminal,
      holder: ACCOUNT,
      cashOutCount: 10n,
      tokenToReclaim: REVNET_PREFERRED_BASE_TOKEN,
    });
    expect(cashOutIntent.functionName).toBe("cashOutTokensOf");

    const borrowIntent = buildRevnetBorrowIntent({
      revLoansAddress: baseRevnetContracts.revLoans,
      source: {
        token: REVNET_PREFERRED_BASE_TOKEN,
        terminal: baseRevnetContracts.multiTerminal,
      },
      collateralCount: 10n,
      beneficiary: ACCOUNT,
      prepaidFeePercent: 50n,
    });
    expect(borrowIntent.functionName).toBe("borrowFrom");

    const plan = await buildRevnetBorrowPlanFromClient(createReadClient(), {
      account: ACCOUNT,
      collateralCount: 12n,
      prepaidFeePercent: 50n,
      preferredBaseToken: REVNET_PREFERRED_BASE_TOKEN,
    });
    expect(plan.permissionRequired).toBe(true);
    expect(plan.steps).toHaveLength(2);
    expect(plan.steps[0]?.key).toBe("permission");
    expect(plan.steps[1]?.key).toBe("borrow");
    expect(plan.quote?.netBorrowableAmount).toBe(925000n);
  });
});
