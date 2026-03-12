import { describe, expect, it } from "vitest";
import { encodeFunctionData } from "viem";
import {
  buildGoalTerminalPayPlan,
  buildGoalTerminalPayTransaction,
} from "../src/protocol-goal-terminal.js";
import { cobuildGoalTerminalPayAbi } from "../src/protocol-terminal-funding-shared.js";
import { REVNET_NATIVE_TOKEN } from "../src/revnet/config.js";

const GOAL_TERMINAL = "0x1111111111111111111111111111111111111111";
const PAYMENT_TOKEN = "0x2222222222222222222222222222222222222222";
const BENEFICIARY = "0x3333333333333333333333333333333333333333";

describe("goal terminal planner", () => {
  it("builds a native-token pay transaction and single-step plan defaults", () => {
    const transaction = buildGoalTerminalPayTransaction({
      terminal: GOAL_TERMINAL,
      projectId: 11,
      amount: "1000000000000000000",
      beneficiary: BENEFICIARY,
    });

    expect(transaction).toEqual({
      to: GOAL_TERMINAL,
      data: encodeFunctionData({
        abi: cobuildGoalTerminalPayAbi,
        functionName: "pay",
        args: [11n, REVNET_NATIVE_TOKEN, 1000000000000000000n, BENEFICIARY, 0n, "", "0x"],
      }),
      valueEth: "1",
    });

    expect(
      buildGoalTerminalPayPlan({
        terminal: GOAL_TERMINAL,
        projectId: 11,
        amount: "1000000000000000000",
        beneficiary: BENEFICIARY,
      })
    ).toEqual({
      network: "base",
      action: "goal.pay",
      riskClass: "economic",
      summary: `Pay goal 11 through terminal ${GOAL_TERMINAL}.`,
      terminalAddress: GOAL_TERMINAL,
      projectId: "11",
      tokenAddress: REVNET_NATIVE_TOKEN,
      amount: "1000000000000000000",
      beneficiary: BENEFICIARY,
      minReturnedTokens: "0",
      memo: "",
      metadata: "0x",
      approvalIncluded: false,
      preconditions: [],
      expectedEvents: ["Pay"],
      steps: [
        {
          kind: "contract-call",
          label: "Pay goal terminal",
          contract: "CobuildGoalTerminal",
          functionName: "pay",
          transaction,
        },
      ],
    });
  });

  it("builds an ERC-20 pay plan with an approval step before the terminal call", () => {
    const plan = buildGoalTerminalPayPlan({
      network: "base-mainnet",
      terminal: GOAL_TERMINAL,
      projectId: 12,
      token: PAYMENT_TOKEN,
      amount: "5000",
      beneficiary: BENEFICIARY,
      minReturnedTokens: "9",
      memo: "fund goal",
      metadata: "0x1234",
    });

    expect(plan).toMatchObject({
      network: "base",
      approvalIncluded: true,
      terminalAddress: GOAL_TERMINAL,
      projectId: "12",
      tokenAddress: PAYMENT_TOKEN,
      amount: "5000",
      beneficiary: BENEFICIARY,
      minReturnedTokens: "9",
      memo: "fund goal",
      metadata: "0x1234",
      preconditions: [],
      steps: [
        {
          kind: "erc20-approval",
          tokenAddress: PAYMENT_TOKEN,
          spenderAddress: GOAL_TERMINAL,
          amount: "5000",
          transaction: {
            to: PAYMENT_TOKEN,
            valueEth: "0",
          },
        },
        {
          kind: "contract-call",
          functionName: "pay",
          transaction: {
            to: GOAL_TERMINAL,
            valueEth: "0",
          },
        },
      ],
    });
    expect(plan.steps).toHaveLength(2);
    expect(plan.steps[1]?.transaction.data).toBe(
      encodeFunctionData({
        abi: cobuildGoalTerminalPayAbi,
        functionName: "pay",
        args: [12n, PAYMENT_TOKEN, 5000n, BENEFICIARY, 9n, "fund goal", "0x1234"],
      })
    );
  });

  it("accepts explicit empty metadata and rejects invalid metadata", () => {
    expect(
      buildGoalTerminalPayPlan({
        terminal: GOAL_TERMINAL,
        projectId: 1,
        amount: 1,
        beneficiary: BENEFICIARY,
        metadata: "0x",
      }).metadata
    ).toBe("0x");

    expect(() =>
      buildGoalTerminalPayPlan({
        terminal: GOAL_TERMINAL,
        projectId: 1,
        amount: 1,
        beneficiary: BENEFICIARY,
        metadata: "hello",
      })
    ).toThrow("metadata must be valid hex bytes with 0x prefix.");
  });

  it("rejects zero-amount native pays because they cannot carry nonzero value", () => {
    expect(() =>
      buildGoalTerminalPayTransaction({
        terminal: GOAL_TERMINAL,
        projectId: 1,
        amount: 0,
        beneficiary: BENEFICIARY,
      })
    ).toThrow("amount must be greater than 0 for native-token pays.");
  });
});
