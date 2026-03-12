import { describe, expect, it } from "vitest";
import { encodeFunctionData } from "viem";
import { cobuildTerminalAddress } from "../src/protocol-addresses.js";
import { buildCommunityTerminalAddToBalancePlan } from "../src/protocol-community-terminal-balance.js";

const COMMUNITY_TERMINAL = cobuildTerminalAddress.toLowerCase();
const PAYMENT_TOKEN = "0x2222222222222222222222222222222222222222";
const NATIVE_TOKEN = "0x000000000000000000000000000000000000eeee";

const communityTerminalAddToBalanceAbi = [
  {
    type: "function",
    name: "addToBalanceOf",
    stateMutability: "payable",
    inputs: [
      { name: "projectId", type: "uint256" },
      { name: "token", type: "address" },
      { name: "amount", type: "uint256" },
      { name: "shouldReturnHeldFees", type: "bool" },
      { name: "memo", type: "string" },
      { name: "metadata", type: "bytes" },
    ],
    outputs: [],
  },
] as const;

describe("community terminal add-to-balance planner", () => {
  it("builds a native-token add-to-balance plan with payable value", () => {
    const plan = buildCommunityTerminalAddToBalancePlan({
      projectId: 19,
      amount: "1000000000000000",
      memo: "top up",
      metadata: "0x1234",
    });

    expect(plan).toMatchObject({
      terminalAddress: COMMUNITY_TERMINAL,
      projectId: "19",
      token: NATIVE_TOKEN,
      tokenAddress: NATIVE_TOKEN,
      amount: "1000000000000000",
      memo: "top up",
      metadata: "0x1234",
      approvalIncluded: false,
      transaction: {
        to: COMMUNITY_TERMINAL,
        valueEth: "0.001",
      },
      preconditions: ["Ensure the transaction sends exactly 1000000000000000 wei as msg.value."],
      steps: [
        {
          kind: "contract-call",
          contract: "CobuildCommunityTerminal",
          functionName: "addToBalanceOf",
          transaction: {
            to: COMMUNITY_TERMINAL,
            valueEth: "0.001",
          },
        },
      ],
    });

    expect(plan.transaction.data).toBe(
      encodeFunctionData({
        abi: communityTerminalAddToBalanceAbi,
        functionName: "addToBalanceOf",
        args: [19n, NATIVE_TOKEN, 1000000000000000n, false, "top up", "0x1234"],
      })
    );
    expect(plan.steps[0]?.transaction.data).toBe(plan.transaction.data);
  });

  it("builds a token add-to-balance plan with an approval step before the terminal call", () => {
    const plan = buildCommunityTerminalAddToBalancePlan({
      terminal: COMMUNITY_TERMINAL,
      projectId: 20,
      token: PAYMENT_TOKEN,
      amount: "88",
    });

    expect(plan).toMatchObject({
      terminalAddress: COMMUNITY_TERMINAL,
      projectId: "20",
      token: PAYMENT_TOKEN,
      tokenAddress: PAYMENT_TOKEN,
      amount: "88",
      approvalIncluded: true,
      transaction: {
        to: COMMUNITY_TERMINAL,
        valueEth: "0",
      },
      preconditions: [],
    });
    expect(plan.steps).toHaveLength(2);
    expect(plan.steps[0]).toMatchObject({
      kind: "erc20-approval",
      tokenAddress: PAYMENT_TOKEN,
      spenderAddress: COMMUNITY_TERMINAL,
      amount: "88",
      transaction: {
        to: PAYMENT_TOKEN,
        valueEth: "0",
      },
    });
    expect(plan.steps[1]).toMatchObject({
      kind: "contract-call",
      contract: "CobuildCommunityTerminal",
      functionName: "addToBalanceOf",
      transaction: {
        to: COMMUNITY_TERMINAL,
        valueEth: "0",
      },
    });
  });

  it("rejects zero amount", () => {
    expect(() =>
      buildCommunityTerminalAddToBalancePlan({
        projectId: 21,
        amount: "0",
      })
    ).toThrow("amount must be greater than 0.");
  });
});
