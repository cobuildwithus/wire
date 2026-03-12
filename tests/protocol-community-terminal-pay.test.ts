import { describe, expect, it } from "vitest";
import { encodeAbiParameters, encodeFunctionData } from "viem";
import {
  buildCommunityTerminalPayPlan,
  buildCommunityTerminalPayTransaction,
  buildCommunityTerminalPayWriteContractRequest,
} from "../src/protocol-community-terminal-pay.js";
import { cobuildTerminalAddress } from "../src/protocol-addresses.js";
import {
  buildTerminalFundingApprovalPlan,
  cobuildCommunityTerminalPayAbi,
  encodeCommunityTerminalPayMetadata,
  resolveTerminalFundingToken,
  resolveTerminalFundingValueEth,
} from "../src/protocol-terminal-funding-shared.js";
import { REVNET_NATIVE_TOKEN } from "../src/revnet/config.js";

const CANONICAL_TERMINAL = cobuildTerminalAddress.toLowerCase();
const TERMINAL = "0x1111111111111111111111111111111111111111";
const TOKEN = "0x2222222222222222222222222222222222222222";
const BENEFICIARY = "0x3333333333333333333333333333333333333333";

const COMMUNITY_PAY_METADATA_PARAMETERS = [
  {
    name: "goalIds",
    type: "uint256[]",
  },
  {
    name: "weights",
    type: "uint32[]",
  },
  {
    name: "jbMetadata",
    type: "bytes",
  },
] as const;

describe("community terminal pay planner", () => {
  it("builds a native-token pay plan with the canonical metadata envelope", () => {
    const plan = buildCommunityTerminalPayPlan({
      projectId: 42n,
      amount: "1500000000000000000",
      beneficiary: BENEFICIARY.toUpperCase(),
      route: {
        goalIds: [7n, "8"],
        weights: [750_000, "250000"],
      },
      jbMetadata: "0x1234",
    });

    const metadata = encodeAbiParameters(COMMUNITY_PAY_METADATA_PARAMETERS, [
      [7n, 8n],
      [750_000, 250_000],
      "0x1234",
    ]);

    expect(plan).toMatchObject({
      chainId: 8453,
      network: "base",
      action: "community.pay",
      riskClass: "economic",
      summary: `Pay community 42 through terminal ${CANONICAL_TERMINAL}.`,
      terminal: CANONICAL_TERMINAL,
      projectId: 42n,
      token: REVNET_NATIVE_TOKEN,
      amount: 1_500_000_000_000_000_000n,
      beneficiary: BENEFICIARY,
      minReturnedTokens: 0n,
      memo: "",
      route: {
        goalIds: [7n, 8n],
        weights: [750_000, 250_000],
      },
      jbMetadata: "0x1234",
      metadata,
      approvalIncluded: false,
      preconditions: [],
      expectedEvents: ["Pay"],
      transaction: {
        to: CANONICAL_TERMINAL,
        valueEth: "1.5",
      },
      steps: [
        {
          kind: "contract-call",
          label: "Pay community terminal",
          contract: "CobuildCommunityTerminal",
          functionName: "pay",
          transaction: {
            to: CANONICAL_TERMINAL,
            valueEth: "1.5",
          },
        },
      ],
      writeContract: {
        address: CANONICAL_TERMINAL,
        functionName: "pay",
        args: [42n, REVNET_NATIVE_TOKEN, 1_500_000_000_000_000_000n, BENEFICIARY, 0n, "", metadata],
        value: 1_500_000_000_000_000_000n,
      },
    });
    expect(plan.transaction.data).toBe(
      encodeFunctionData({
        abi: cobuildCommunityTerminalPayAbi,
        functionName: "pay",
        args: [42n, REVNET_NATIVE_TOKEN, 1_500_000_000_000_000_000n, BENEFICIARY, 0n, "", metadata],
      })
    );
  });

  it("builds a token pay plan with an approval step and empty-route metadata defaults", () => {
    const plan = buildCommunityTerminalPayPlan({
      terminal: TERMINAL.toUpperCase(),
      projectId: "17",
      token: TOKEN.toUpperCase(),
      amount: 2500n,
      beneficiary: BENEFICIARY,
      minReturnedTokens: 99,
      memo: "fund community",
    });

    const metadata = encodeAbiParameters(COMMUNITY_PAY_METADATA_PARAMETERS, [
      [],
      [],
      "0x",
    ]);

    expect(plan).toMatchObject({
      terminal: TERMINAL,
      projectId: 17n,
      token: TOKEN,
      amount: 2500n,
      beneficiary: BENEFICIARY,
      minReturnedTokens: 99n,
      memo: "fund community",
      route: {
        goalIds: [],
        weights: [],
      },
      jbMetadata: "0x",
      metadata,
      approvalIncluded: true,
      preconditions: [],
      expectedEvents: ["Pay"],
      transaction: {
        to: TERMINAL,
        valueEth: "0",
      },
      writeContract: {
        address: TERMINAL,
        functionName: "pay",
        args: [17n, TOKEN, 2500n, BENEFICIARY, 99n, "fund community", metadata],
      },
    });
    expect(plan.writeContract.value).toBeUndefined();
    expect(plan.steps).toHaveLength(2);
    expect(plan.steps[0]).toMatchObject({
      kind: "erc20-approval",
      tokenAddress: TOKEN,
      spenderAddress: TERMINAL,
      amount: "2500",
      transaction: {
        to: TOKEN,
        valueEth: "0",
      },
    });
    expect(plan.steps[1]).toMatchObject({
      kind: "contract-call",
      functionName: "pay",
      transaction: {
        to: TERMINAL,
        valueEth: "0",
      },
    });

    expect(
      buildCommunityTerminalPayTransaction({
        terminal: TERMINAL,
        projectId: 17n,
        token: TOKEN,
        amount: 2500n,
        beneficiary: BENEFICIARY,
        minReturnedTokens: 99n,
        memo: "fund community",
      })
    ).toEqual(plan.transaction);

    expect(
      buildCommunityTerminalPayWriteContractRequest({
        terminal: TERMINAL,
        projectId: 17n,
        token: TOKEN,
        amount: 2500n,
        beneficiary: BENEFICIARY,
        minReturnedTokens: 99n,
        memo: "fund community",
      })
    ).toEqual(plan.writeContract);
  });

  it("rejects invalid route shapes and invalid jb metadata", () => {
    expect(() =>
      buildCommunityTerminalPayPlan({
        projectId: 1n,
        amount: 1n,
        beneficiary: BENEFICIARY,
        route: {
          goalIds: [1n],
          weights: [],
        },
      })
    ).toThrow("route.goalIds and route.weights must have the same length.");

    expect(() =>
      buildCommunityTerminalPayPlan({
        projectId: 1n,
        amount: 1n,
        beneficiary: BENEFICIARY,
        route: {
          goalIds: [1n],
          weights: [4_294_967_296n],
        },
      })
    ).toThrow("route.weights[0] exceeds uint32.");

    expect(() =>
      buildCommunityTerminalPayPlan({
        projectId: 1n,
        amount: 1n,
        beneficiary: BENEFICIARY,
        jbMetadata: "xyz",
      })
    ).toThrow("jbMetadata must be valid hex bytes with 0x prefix.");
  });

  it("covers shared terminal funding metadata and approval helpers", () => {
    expect(resolveTerminalFundingToken()).toBe(REVNET_NATIVE_TOKEN);
    expect(resolveTerminalFundingValueEth(REVNET_NATIVE_TOKEN, "1000000000000000000", "amount")).toBe(
      "1"
    );
    expect(resolveTerminalFundingValueEth(TOKEN, 25, "amount")).toBe("0");

    expect(
      encodeCommunityTerminalPayMetadata({
        goalIds: [1n, "2"],
        weights: [3, "4"],
      })
    ).toEqual({
      metadata: encodeAbiParameters(COMMUNITY_PAY_METADATA_PARAMETERS, [[1n, 2n], [3, 4], "0x"]),
      goalIds: [1n, 2n],
      weights: [3, 4],
      jbMetadata: "0x",
    });

    expect(
      buildTerminalFundingApprovalPlan({
        tokenAddress: TOKEN,
        terminalAddress: TERMINAL,
        amount: 25,
        terminalLabel: "community terminal",
      })
    ).toMatchObject({
      approvalIncluded: true,
      preconditions: [],
      steps: [
        {
          kind: "erc20-approval",
          tokenAddress: TOKEN,
          spenderAddress: TERMINAL,
          amount: "25",
        },
      ],
    });
    expect(
      buildTerminalFundingApprovalPlan({
        tokenAddress: REVNET_NATIVE_TOKEN,
        terminalAddress: TERMINAL,
        amount: 25,
        terminalLabel: "community terminal",
      })
    ).toEqual({
      approvalIncluded: false,
      preconditions: [],
      steps: [],
    });
  });

  it("rejects invalid shared terminal funding helper inputs", () => {
    expect(() =>
      encodeCommunityTerminalPayMetadata({
        goalIds: [1n],
        weights: [],
      })
    ).toThrow("route.goalIds and route.weights must have the same length.");

    expect(() =>
      encodeCommunityTerminalPayMetadata({
        goalIds: [1n],
        weights: [4_294_967_296n],
      })
    ).toThrow("route.weights[0] must fit in uint32.");

    expect(() =>
      encodeCommunityTerminalPayMetadata({
        jbMetadata: "xyz",
      })
    ).toThrow("jbMetadata must be valid hex bytes with 0x prefix.");
  });
});
