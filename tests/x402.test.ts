import { describe, expect, it } from "vitest";
import {
  X402_NETWORK,
  X402_PAY_TO_ADDRESS,
  X402_VALUE_MICRO_USDC,
  buildFarcasterX402SigningRequest,
  buildFarcasterX402Spec,
  buildX402AuthorizationPayload,
  buildX402PaymentPayload,
  buildX402TypedDataDomain,
  buildX402TypedDataTypes,
  createX402AuthorizationNonce,
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
    expect(() =>
      buildX402TypedDataDomain({
        verifyingContract: "not-an-address" as `0x${string}`,
      })
    ).toThrow("verifyingContract must be a valid 20-byte hex address");

    const types = buildX402TypedDataTypes();
    expect(types.TransferWithAuthorization).toHaveLength(6);
  });

  it("encodes + decodes payload", () => {
    const encoded = encodeX402PaymentPayload({
      x402Version: 1,
      scheme: "exact",
      network: X402_NETWORK,
      payload: {
        signature: "0xabcd",
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
        signature: "0xabcd",
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
        signature: "0xabcd",
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

  it("builds shared authorization and payment payload shapes", () => {
    const nonce = createX402AuthorizationNonce();
    expect(nonce).toMatch(/^0x[0-9a-f]{64}$/);

    const authorization = buildX402AuthorizationPayload({
      from: "0x1111111111111111111111111111111111111111",
      validBefore: 2_000_000_000,
      nonce,
    });
    expect(authorization).toEqual({
      from: "0x1111111111111111111111111111111111111111",
      to: X402_PAY_TO_ADDRESS,
      value: X402_VALUE_MICRO_USDC,
      validAfter: "0",
      validBefore: "2000000000",
      nonce,
    });

    const payload = buildX402PaymentPayload({
      signature: "0xabcd",
      authorization,
    });
    expect(payload).toEqual({
      x402Version: 1,
      scheme: "exact",
      network: X402_NETWORK,
      payload: {
        signature: "0xabcd",
        authorization,
      },
    });
  });

  it("builds the canonical Farcaster x402 signing request", () => {
    const spec = buildFarcasterX402Spec();
    expect(spec.network).toBe(X402_NETWORK);
    expect(spec.payTo).toBe(X402_PAY_TO_ADDRESS);
    expect(spec.amount).toBe(X402_VALUE_MICRO_USDC);
    expect(spec.primaryType).toBe("TransferWithAuthorization");
    expect(spec.domain.chainId).toBe(8453);

    const signingRequest = buildFarcasterX402SigningRequest({
      payerAddress: "0x1111111111111111111111111111111111111111",
      nowSeconds: 1_700_000_000,
      nonce: `0x${"2".repeat(64)}`,
    });

    expect(signingRequest.validAfter).toBe(0);
    expect(signingRequest.validBefore).toBe(1_700_000_300);
    expect(signingRequest.authorization).toEqual({
      from: "0x1111111111111111111111111111111111111111",
      to: X402_PAY_TO_ADDRESS,
      value: X402_VALUE_MICRO_USDC,
      validAfter: "0",
      validBefore: "1700000300",
      nonce: `0x${"2".repeat(64)}`,
    });
    expect(decodeX402PaymentPayload(signingRequest.encodePayment("0xabcd"))).toEqual({
      x402Version: 1,
      scheme: "exact",
      network: X402_NETWORK,
      payload: {
        signature: "0xabcd",
        authorization: signingRequest.authorization,
      },
    });
  });

  it("rejects invalid builder nonce values", () => {
    expect(() =>
      buildX402AuthorizationPayload({
        from: "0x1111111111111111111111111111111111111111",
        validBefore: 2_000_000_000,
        nonce: "0x1234",
      })
    ).toThrow("nonce must be a 32-byte hex value");
  });

  it("rejects missing/invalid/expired validBefore values", () => {
    const basePayload = {
      x402Version: 1,
      scheme: "exact",
      network: X402_NETWORK,
      payload: {
        signature: "0xabcd",
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

  it("rejects unsupported x402 version and scheme", () => {
    const payload = {
      x402Version: 2,
      scheme: "other",
      network: X402_NETWORK,
      payload: {
        signature: "0xabcd",
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

    expect(() => validateX402PaymentPayload(payload, { nowSeconds: 100 })).toThrow(
      "x402 payment header version mismatch"
    );

    expect(() =>
      validateX402PaymentPayload(
        {
          ...payload,
          x402Version: 1,
        },
        { nowSeconds: 100 }
      )
    ).toThrow("x402 payment header scheme mismatch");
  });

  it("rejects invalid Farcaster signing-request windows", () => {
    expect(() =>
      buildFarcasterX402SigningRequest({
        payerAddress: "0x1111111111111111111111111111111111111111",
        ttlSeconds: 0,
      })
    ).toThrow("ttlSeconds must be greater than zero.");

    expect(() =>
      buildFarcasterX402SigningRequest({
        payerAddress: "0x1111111111111111111111111111111111111111",
        validAfter: 20,
        validBefore: 10,
      })
    ).toThrow("validBefore must be greater than or equal to validAfter.");
  });

  it("rejects invalid signature and address fields on decode", () => {
    const encoded = encodeX402PaymentPayload({
      x402Version: 1,
      scheme: "exact",
      network: X402_NETWORK,
      payload: {
        signature: "0xabcd",
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
    const decoded = decodeX402PaymentPayload(encoded);
    expect(decoded.payload.signature).toBe("0xabcd");

    const badSignature = encodeX402PaymentPayload({
      ...decoded,
      payload: {
        ...decoded.payload,
        signature: "not-hex",
      },
    });
    expect(() => decodeX402PaymentPayload(badSignature)).toThrow(
      "x402 payment header has invalid payload.signature"
    );

    const badFrom = encodeX402PaymentPayload({
      ...decoded,
      payload: {
        ...decoded.payload,
        authorization: {
          ...decoded.payload.authorization,
          from: "0x1234",
        },
      },
    });
    expect(() => decodeX402PaymentPayload(badFrom)).toThrow(
      "x402 payment header has invalid payload.authorization.from"
    );
  });
});
