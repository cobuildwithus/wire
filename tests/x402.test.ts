import { describe, expect, it } from "vitest";
import {
  X402_NETWORK,
  X402_PAY_TO_ADDRESS,
  X402_VALUE_MICRO_USDC,
  buildX402TypedDataDomain,
  buildX402TypedDataTypes,
  decodeAndValidateX402PaymentPayload,
  decodeX402PaymentPayload,
  encodeX402PaymentPayload,
  validateX402PaymentPayload,
} from "../src/x402.js";

describe("x402 contract", () => {
  it("builds canonical typed-data artifacts", () => {
    const domain = buildX402TypedDataDomain();
    expect(domain.chainId).toBe(8453);
    expect(
      buildX402TypedDataDomain({
        version: "3",
        verifyingContract: "0x833589FCD6EDB6E08F4C7C32D4F71B54BDA02913",
      }).version
    ).toBe("3");

    const types = buildX402TypedDataTypes();
    expect(types.TransferWithAuthorization).toHaveLength(6);
  });

  it("encodes + decodes payload", () => {
    const encoded = encodeX402PaymentPayload({
      x402Version: 1,
      scheme: "exact",
      network: X402_NETWORK,
      payload: {
        signature: "0xabc",
        authorization: {
          from: "0x1111111111111111111111111111111111111111",
          to: X402_PAY_TO_ADDRESS,
          value: X402_VALUE_MICRO_USDC,
          validAfter: "0",
          validBefore: String(Math.floor(Date.now() / 1000) + 300),
          nonce: `0x${"1".repeat(64)}` as `0x${string}`,
        },
      },
    });

    const decoded = decodeX402PaymentPayload(encoded);
    expect(decoded.network).toBe(X402_NETWORK);
    expect(decoded.payload.authorization.to).toBe(X402_PAY_TO_ADDRESS);
  });

  it("validates policy constraints", () => {
    const payload = {
      x402Version: 1,
      scheme: "exact",
      network: X402_NETWORK,
      payload: {
        signature: "0xabc",
        authorization: {
          from: "0x1111111111111111111111111111111111111111",
          to: X402_PAY_TO_ADDRESS,
          value: X402_VALUE_MICRO_USDC,
          validAfter: "0",
          validBefore: "2000000000",
          nonce: `0x${"1".repeat(64)}` as `0x${string}`,
        },
      },
    };

    expect(validateX402PaymentPayload(payload, { nowSeconds: 100 })).toEqual(payload);
    expect(() =>
      validateX402PaymentPayload(
        {
          ...payload,
          payload: {
            ...payload.payload,
            authorization: {
              ...payload.payload.authorization,
              to: "0x2222222222222222222222222222222222222222",
            },
          },
        },
        { nowSeconds: 100 }
      )
    ).toThrow("x402 payment \"to\" address mismatch");
  });

  it("decodes and validates in one pass", () => {
    const encoded = encodeX402PaymentPayload({
      x402Version: 1,
      scheme: "exact",
      network: X402_NETWORK,
      payload: {
        signature: "0xabc",
        authorization: {
          from: "0x1111111111111111111111111111111111111111",
          to: X402_PAY_TO_ADDRESS,
          value: X402_VALUE_MICRO_USDC,
          validAfter: "0",
          validBefore: "2000000000",
          nonce: `0x${"1".repeat(64)}` as `0x${string}`,
        },
      },
    });

    expect(decodeAndValidateX402PaymentPayload(encoded, { nowSeconds: 100 }).network).toBe(
      X402_NETWORK
    );
  });

  it("rejects missing/invalid/expired validBefore values", () => {
    const basePayload = {
      x402Version: 1,
      scheme: "exact",
      network: X402_NETWORK,
      payload: {
        signature: "0xabc",
        authorization: {
          from: "0x1111111111111111111111111111111111111111",
          to: X402_PAY_TO_ADDRESS,
          value: X402_VALUE_MICRO_USDC,
          validAfter: "0",
          validBefore: "2000000000",
          nonce: `0x${"1".repeat(64)}` as `0x${string}`,
        },
      },
    };

    expect(() =>
      validateX402PaymentPayload(
        {
          ...basePayload,
          payload: {
            ...basePayload.payload,
            authorization: {
              ...basePayload.payload.authorization,
              validBefore: undefined as unknown as string,
            },
          },
        },
        { nowSeconds: 100 }
      )
    ).toThrow("missing payload.authorization.validBefore");

    expect(() =>
      validateX402PaymentPayload(
        {
          ...basePayload,
          payload: {
            ...basePayload.payload,
            authorization: {
              ...basePayload.payload.authorization,
              validBefore: "not-a-number",
            },
          },
        },
        { nowSeconds: 100 }
      )
    ).toThrow("invalid payload.authorization.validBefore");

    expect(() =>
      validateX402PaymentPayload(basePayload, { nowSeconds: 2_000_000_000 })
    ).toThrow("x402 payment header has expired");
  });
});
