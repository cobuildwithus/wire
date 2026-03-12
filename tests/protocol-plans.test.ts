import { describe, expect, it } from "vitest";
import { encodeFunctionData, erc20Abi } from "viem";
import {
  buildApprovalPlan,
  buildProtocolApprovalStep,
  buildProtocolCallStep,
  formatProtocolValueEthFromWei,
  normalizeOptionalProtocolBigInt,
  normalizeProtocolBigInt,
  normalizeProtocolValueEth,
  resolveProtocolPlanNetwork,
  serializeProtocolBigInts,
} from "../src/index.js";

const TOKEN = "0x1111111111111111111111111111111111111111";
const SPENDER = "0x2222222222222222222222222222222222222222";
const RECIPIENT = "0x3333333333333333333333333333333333333333";

describe("protocol plans helpers", () => {
  it("normalizes non-negative bigint-like values", () => {
    expect(normalizeProtocolBigInt(4n, "amount")).toBe(4n);
    expect(normalizeProtocolBigInt(5, "amount")).toBe(5n);
    expect(normalizeProtocolBigInt(" 6 ", "amount")).toBe(6n);
  });

  it("rejects invalid bigint-like values", () => {
    expect(() => normalizeProtocolBigInt(-1n, "amount")).toThrow(
      "amount must be a non-negative integer."
    );
    expect(() => normalizeProtocolBigInt(1.5, "amount")).toThrow(
      "amount must be a non-negative integer."
    );
    expect(() => normalizeProtocolBigInt("abc", "amount")).toThrow(
      "amount must be a non-negative integer."
    );
  });

  it("normalizes optional bigint-like values", () => {
    expect(normalizeOptionalProtocolBigInt(null, "amount")).toBeNull();
    expect(normalizeOptionalProtocolBigInt(undefined, "amount")).toBeNull();
    expect(normalizeOptionalProtocolBigInt("7", "amount")).toBe(7n);
  });

  it("builds a protocol call step with encoded calldata", () => {
    expect(
      buildProtocolCallStep({
        contract: "ERC20",
        functionName: "transfer",
        label: "Transfer tokens",
        to: TOKEN.toUpperCase(),
        abi: erc20Abi,
        args: [RECIPIENT, 8n],
      })
    ).toEqual({
      kind: "contract-call",
      label: "Transfer tokens",
      contract: "ERC20",
      functionName: "transfer",
      transaction: {
        to: TOKEN,
        data: encodeFunctionData({
          abi: erc20Abi,
          functionName: "transfer",
          args: [RECIPIENT, 8n],
        }),
        valueEth: "0",
      },
    });
  });

  it("normalizes payable protocol call values", () => {
    expect(normalizeProtocolValueEth(" 1.5000 ", "valueEth")).toBe("1.5");
    expect(formatProtocolValueEthFromWei("1000000000000000", "amount")).toBe("0.001");

    expect(
      buildProtocolCallStep({
        contract: "ERC20",
        functionName: "transfer",
        label: "Transfer tokens",
        to: TOKEN,
        abi: erc20Abi,
        args: [RECIPIENT, 8n],
        valueEth: "2.000",
      }).transaction.valueEth
    ).toBe("2");
  });

  it("rejects invalid payable protocol call values", () => {
    expect(() => normalizeProtocolValueEth("", "valueEth")).toThrow(
      "valueEth must be a non-negative ETH amount string."
    );
    expect(() => normalizeProtocolValueEth("-1", "valueEth")).toThrow(
      "valueEth must be a non-negative ETH amount string."
    );
  });

  it("builds an approval step with normalized addresses and amount", () => {
    expect(
      buildProtocolApprovalStep({
        label: "Approve token",
        tokenAddress: TOKEN.toUpperCase(),
        spenderAddress: SPENDER.toUpperCase(),
        amount: "9",
      })
    ).toEqual({
      kind: "erc20-approval",
      label: "Approve token",
      tokenAddress: TOKEN,
      spenderAddress: SPENDER,
      amount: "9",
      transaction: {
        to: TOKEN,
        data: encodeFunctionData({
          abi: erc20Abi,
          functionName: "approve",
          args: [SPENDER, 9n],
        }),
        valueEth: "0",
      },
    });
  });

  it("builds skip-mode approval plans with a precondition only", () => {
    expect(
      buildApprovalPlan({
        mode: "skip",
        tokenAddress: TOKEN,
        spenderAddress: SPENDER,
        requiredAmount: 10n,
        tokenLabel: "goal token",
        spenderLabel: "stake vault",
      })
    ).toEqual({
      approvalIncluded: false,
      preconditions: ["Ensure goal token allowance for stake vault covers at least 10."],
      steps: [],
    });
  });

  it("uses a precondition when allowance is unknown in auto mode", () => {
    expect(
      buildApprovalPlan({
        tokenAddress: TOKEN,
        spenderAddress: SPENDER,
        requiredAmount: 11n,
        currentAllowance: null,
        tokenLabel: "goal token",
        spenderLabel: "stake vault",
      })
    ).toEqual({
      approvalIncluded: false,
      preconditions: ["Ensure goal token allowance for stake vault covers at least 11."],
      steps: [],
    });
  });

  it("omits approval when current allowance is already sufficient", () => {
    expect(
      buildApprovalPlan({
        tokenAddress: TOKEN,
        spenderAddress: SPENDER,
        requiredAmount: 12n,
        currentAllowance: 15n,
        tokenLabel: "goal token",
        spenderLabel: "stake vault",
      })
    ).toEqual({
      approvalIncluded: false,
      preconditions: [],
      steps: [],
    });
  });

  it("adds approval steps when auto mode is insufficient or force mode is requested", () => {
    const autoPlan = buildApprovalPlan({
      tokenAddress: TOKEN,
      spenderAddress: SPENDER,
      requiredAmount: 13n,
      currentAllowance: 2n,
      tokenLabel: "goal token",
      spenderLabel: "stake vault",
    });
    expect(autoPlan.approvalIncluded).toBe(true);
    expect(autoPlan.preconditions).toEqual([]);
    expect(autoPlan.steps[0]).toMatchObject({
      kind: "erc20-approval",
      tokenAddress: TOKEN,
      spenderAddress: SPENDER,
      amount: "13",
    });

    const forcePlan = buildApprovalPlan({
      mode: "force",
      tokenAddress: TOKEN,
      spenderAddress: SPENDER,
      requiredAmount: 14n,
      currentAllowance: 99n,
      approvalAmount: 20n,
      tokenLabel: "goal token",
      spenderLabel: "stake vault",
    });
    expect(forcePlan.approvalIncluded).toBe(true);
    expect(forcePlan.steps[0]).toMatchObject({
      kind: "erc20-approval",
      amount: "20",
    });
  });

  it("resolves supported networks and rejects unsupported ones", () => {
    expect(resolveProtocolPlanNetwork()).toBe("base");
    expect(resolveProtocolPlanNetwork(" Base ")).toBe("base");
    expect(() => resolveProtocolPlanNetwork("optimism")).toThrow(
      "unsupported protocol network: optimism"
    );
  });

  it("serializes nested bigint payloads", () => {
    expect(
      serializeProtocolBigInts({
        amount: 1n,
        nested: {
          list: [2n, { count: 3n }],
        },
        label: "ok",
      })
    ).toEqual({
      amount: "1",
      nested: {
        list: ["2", { count: "3" }],
      },
      label: "ok",
    });
  });
});
