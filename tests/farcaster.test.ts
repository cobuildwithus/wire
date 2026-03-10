import { describe, expect, it } from "vitest";
import {
  FARCASTER_CONTRACTS,
  FARCASTER_KEY_METADATA_TYPE_SIGNED_KEY_REQUEST,
  FARCASTER_KEY_TYPE_ED25519,
  FARCASTER_SIGNUP_CHAIN_ID,
  FARCASTER_SIGNUP_GAS_BUFFER_WEI,
  FARCASTER_SIGNUP_NETWORK,
  buildFarcasterHostedX402PaymentResponse,
  buildFarcasterHostedX402PaymentResult,
  buildFarcasterSignupAlreadyRegisteredDetails,
  buildFarcasterSignupAlreadyRegisteredErrorResponse,
  buildFarcasterSignupCompletedResult,
  buildFarcasterSignupNeedsFundingResult,
  buildFarcasterSignupResponse,
  buildFarcasterSignedKeyRequestMetadata,
  buildFarcasterSignedKeyRequestTypedData,
  buildFarcasterSignupCallPlan,
  buildFarcasterSignupExecutableCalls,
  computeFarcasterSignedKeyRequestDeadline,
  encodeFarcasterSignedKeyRequestMetadata,
  evaluateFarcasterSignupPreflight,
  formatFarcasterSignupFundingAmounts,
  normalizeFarcasterSignerPublicKey,
  validateFarcasterHostedX402PaymentResponse,
  validateFarcasterSignupAlreadyRegisteredErrorResponse,
  validateFarcasterSignupResponse,
} from "../src/farcaster.js";
import {
  X402_PAY_TO_ADDRESS,
  X402_USDC_CONTRACT,
  X402_VALUE_MICRO_USDC,
} from "../src/x402.js";

const ADDRESS_A = "0x00000000000000000000000000000000000000aa";
const ADDRESS_B = "0x00000000000000000000000000000000000000bb";
const SIGNER_PUBLIC_KEY = `0x${"11".repeat(32)}`;
const SIGNATURE = `0x${"22".repeat(65)}`;

describe("farcaster wire contract", () => {
  it("normalizes signer public keys", () => {
    expect(normalizeFarcasterSignerPublicKey(SIGNER_PUBLIC_KEY.toUpperCase())).toBe(
      SIGNER_PUBLIC_KEY
    );
    expect(() => normalizeFarcasterSignerPublicKey("0x1234")).toThrow(
      "signerPublicKey must be a 32-byte hex value"
    );
  });

  it("builds signed-key-request typed data with canonical defaults", () => {
    const typedData = buildFarcasterSignedKeyRequestTypedData({
      requestFid: 0n,
      signerPublicKey: SIGNER_PUBLIC_KEY,
      deadline: 123n,
    });

    expect(typedData.domain.chainId).toBe(FARCASTER_SIGNUP_CHAIN_ID);
    expect(typedData.domain.verifyingContract).toBe(FARCASTER_CONTRACTS.signedKeyRequestValidator);
    expect(typedData.primaryType).toBe("SignedKeyRequest");
    expect(typedData.message).toEqual({
      requestFid: 0n,
      key: SIGNER_PUBLIC_KEY,
      deadline: 123n,
    });
  });

  it("computes signed-key-request deadlines", () => {
    expect(
      computeFarcasterSignedKeyRequestDeadline({
        nowSeconds: 1_700_000_000,
        ttlSeconds: 600,
      })
    ).toBe(1_700_000_600n);

    expect(() => computeFarcasterSignedKeyRequestDeadline({ ttlSeconds: 0 })).toThrow(
      "ttlSeconds must be greater than zero."
    );
  });

  it("builds metadata and signup call plans", () => {
    const metadata = buildFarcasterSignedKeyRequestMetadata({
      requestFid: 0n,
      requestSigner: ADDRESS_A.toUpperCase(),
      signature: SIGNATURE.toUpperCase(),
      deadline: 900n,
    });

    const plan = buildFarcasterSignupCallPlan({
      recoveryAddress: ADDRESS_B,
      extraStorage: 2n,
      idGatewayPriceWei: 700n,
      signerPublicKey: SIGNER_PUBLIC_KEY,
      signedKeyRequestMetadata: metadata,
    });

    expect(plan.network).toBe(FARCASTER_SIGNUP_NETWORK);
    expect(plan.calls).toHaveLength(2);
    expect(plan.calls[0]).toEqual({
      kind: "register",
      to: FARCASTER_CONTRACTS.idGateway,
      functionName: "register",
      value: 700n,
      args: {
        recoveryAddress: ADDRESS_B,
        extraStorage: 2n,
      },
    });
    expect(plan.calls[1]).toEqual({
      kind: "add-key",
      to: FARCASTER_CONTRACTS.keyGateway,
      functionName: "add",
      value: 0n,
      args: {
        keyType: FARCASTER_KEY_TYPE_ED25519,
        key: SIGNER_PUBLIC_KEY,
        metadataType: FARCASTER_KEY_METADATA_TYPE_SIGNED_KEY_REQUEST,
        metadata: {
          requestFid: 0n,
          requestSigner: ADDRESS_A,
          signature: SIGNATURE,
          deadline: 900n,
        },
      },
    });

    const encodedMetadata = encodeFarcasterSignedKeyRequestMetadata(metadata);
    expect(encodedMetadata.startsWith("0x")).toBe(true);

    const executableCalls = buildFarcasterSignupExecutableCalls(plan);
    expect(executableCalls).toHaveLength(2);
    expect(executableCalls[0].to).toBe(FARCASTER_CONTRACTS.idGateway);
    expect(executableCalls[0].value).toBe(700n);
    expect(executableCalls[0].data.startsWith("0x")).toBe(true);
    expect(executableCalls[1].to).toBe(FARCASTER_CONTRACTS.keyGateway);
    expect(executableCalls[1].value).toBe(0n);
    expect(executableCalls[1].data.startsWith("0x")).toBe(true);
  });

  it("evaluates preflight status transitions", () => {
    const alreadyRegistered = evaluateFarcasterSignupPreflight({
      custodyAddress: ADDRESS_A,
      existingFid: 77n,
      idGatewayPriceWei: 100n,
      balanceWei: 1n,
      gasBufferWei: 2n,
    });
    expect(alreadyRegistered).toEqual({
      status: "already_registered",
      custodyAddress: ADDRESS_A,
      existingFid: "77",
      idGatewayPriceWei: "100",
      gasBufferWei: "2",
      requiredWei: "102",
      balanceWei: "1",
    });

    const needsFunding = evaluateFarcasterSignupPreflight({
      custodyAddress: ADDRESS_A,
      existingFid: 0n,
      idGatewayPriceWei: 100n,
      balanceWei: 50n,
      gasBufferWei: 20n,
    });
    expect(needsFunding).toEqual({
      status: "needs_funding",
      custodyAddress: ADDRESS_A,
      idGatewayPriceWei: "100",
      gasBufferWei: "20",
      requiredWei: "120",
      balanceWei: "50",
      deficitWei: "70",
    });

    const ready = evaluateFarcasterSignupPreflight({
      custodyAddress: ADDRESS_A,
      existingFid: 0n,
      idGatewayPriceWei: 100n,
      balanceWei: 120n,
      gasBufferWei: 20n,
    });
    expect(ready).toEqual({
      status: "ready",
      custodyAddress: ADDRESS_A,
      idGatewayPriceWei: "100",
      gasBufferWei: "20",
      requiredWei: "120",
      balanceWei: "120",
      deficitWei: "0",
    });
  });

  it("uses default gas buffer in preflight", () => {
    const ready = evaluateFarcasterSignupPreflight({
      custodyAddress: ADDRESS_A,
      existingFid: 0n,
      idGatewayPriceWei: 100n,
      balanceWei: FARCASTER_SIGNUP_GAS_BUFFER_WEI + 100n,
    });
    expect(ready.status).toBe("ready");
  });

  it("formats and builds canonical Farcaster signup result contracts", () => {
    expect(
      formatFarcasterSignupFundingAmounts({
        idGatewayPriceWei: 7_000_000_000_000_000n,
        balanceWei: 0n,
        requiredWei: 7_200_000_000_000_000n,
      })
    ).toEqual({
      idGatewayPriceWei: "7000000000000000",
      idGatewayPriceEth: "0.007",
      balanceWei: "0",
      balanceEth: "0",
      requiredWei: "7200000000000000",
      requiredEth: "0.0072",
    });

    const needsFunding = buildFarcasterSignupNeedsFundingResult({
      ownerAddress: ADDRESS_A.toUpperCase(),
      custodyAddress: ADDRESS_B,
      recoveryAddress: ADDRESS_A,
      idGatewayPriceWei: 7_000_000_000_000_000n,
      balanceWei: 0n,
      requiredWei: 7_200_000_000_000_000n,
    });
    expect(needsFunding).toEqual({
      status: "needs_funding",
      network: FARCASTER_SIGNUP_NETWORK,
      ownerAddress: ADDRESS_A,
      custodyAddress: ADDRESS_B,
      recoveryAddress: ADDRESS_A,
      idGatewayPriceWei: "7000000000000000",
      idGatewayPriceEth: "0.007",
      balanceWei: "0",
      balanceEth: "0",
      requiredWei: "7200000000000000",
      requiredEth: "0.0072",
    });

    const completed = buildFarcasterSignupCompletedResult({
      ownerAddress: ADDRESS_A,
      custodyAddress: ADDRESS_B.toUpperCase(),
      recoveryAddress: ADDRESS_A,
      fid: 55n,
      idGatewayPriceWei: 7_000_000_000_000_000n,
      txHash: `0x${"33".repeat(32)}`,
    });
    expect(completed).toEqual({
      status: "complete",
      network: FARCASTER_SIGNUP_NETWORK,
      ownerAddress: ADDRESS_A,
      custodyAddress: ADDRESS_B,
      recoveryAddress: ADDRESS_A,
      fid: "55",
      idGatewayPriceWei: "7000000000000000",
      txHash: `0x${"33".repeat(32)}`,
    });

    expect(validateFarcasterSignupResponse(buildFarcasterSignupResponse(completed))).toEqual({
      ok: true,
      result: completed,
    });
  });

  it("builds and validates already-registered signup error details", () => {
    const details = buildFarcasterSignupAlreadyRegisteredDetails({
      fid: 77n,
      custodyAddress: ADDRESS_A.toUpperCase(),
    });
    expect(details).toEqual({
      fid: "77",
      custodyAddress: ADDRESS_A,
    });

    const response = buildFarcasterSignupAlreadyRegisteredErrorResponse({
      error: "already registered",
      fid: 77n,
      custodyAddress: ADDRESS_A,
    });
    expect(validateFarcasterSignupAlreadyRegisteredErrorResponse(response)).toEqual(response);
  });

  it("rejects malformed signup response envelopes", () => {
    expect(() =>
      validateFarcasterSignupResponse({
        ok: true,
        result: {
          status: "complete",
          network: FARCASTER_SIGNUP_NETWORK,
          ownerAddress: ADDRESS_A,
          custodyAddress: ADDRESS_B,
          recoveryAddress: ADDRESS_A,
          fid: "55",
          idGatewayPriceWei: "7000000000000000",
          txHash: "0x1234",
        },
      })
    ).toThrow("result.txHash must be a 32-byte hex value");

    expect(() =>
      validateFarcasterSignupAlreadyRegisteredErrorResponse({
        ok: false,
        error: "already registered",
        details: {
          fid: "0",
          custodyAddress: ADDRESS_A,
        },
      })
    ).toThrow("details.fid must be greater than zero.");
  });

  it("builds and validates hosted x402 response contracts", () => {
    const result = buildFarcasterHostedX402PaymentResult({
      xPayment: "base64-payload",
      payerAddress: ADDRESS_A,
      agentKey: "default",
      validAfter: 0,
      validBefore: 1_700_000_300,
    });
    expect(result).toEqual({
      xPayment: "base64-payload",
      payerAddress: ADDRESS_A,
      payTo: X402_PAY_TO_ADDRESS,
      token: X402_USDC_CONTRACT,
      amount: X402_VALUE_MICRO_USDC,
      network: "base",
      validAfter: 0,
      validBefore: 1_700_000_300,
      agentKey: "default",
    });

    expect(
      validateFarcasterHostedX402PaymentResponse(buildFarcasterHostedX402PaymentResponse(result))
    ).toEqual({
      ok: true,
      result,
    });
  });

  it("rejects invalid hosted x402 metadata drift", () => {
    expect(() =>
      validateFarcasterHostedX402PaymentResponse({
        ok: true,
        result: {
          xPayment: "base64-payload",
          payerAddress: ADDRESS_A,
          payTo: ADDRESS_B,
          token: X402_USDC_CONTRACT,
          amount: X402_VALUE_MICRO_USDC,
          network: "base",
          validAfter: 0,
          validBefore: 1,
          agentKey: "default",
        },
      })
    ).toThrow(`payTo must be "${X402_PAY_TO_ADDRESS}".`);

    expect(() =>
      validateFarcasterHostedX402PaymentResponse({
        ok: true,
        result: {
          xPayment: "base64-payload",
          payerAddress: ADDRESS_A,
          payTo: X402_PAY_TO_ADDRESS,
          token: ADDRESS_B,
          amount: X402_VALUE_MICRO_USDC,
          network: "base",
          validAfter: 0,
          validBefore: 1,
          agentKey: "default",
        },
      })
    ).toThrow(`token must be "${X402_USDC_CONTRACT}".`);

    expect(() =>
      validateFarcasterHostedX402PaymentResponse({
        ok: true,
        result: {
          xPayment: "base64-payload",
          payerAddress: ADDRESS_A,
          payTo: X402_PAY_TO_ADDRESS,
          token: X402_USDC_CONTRACT,
          amount: X402_VALUE_MICRO_USDC,
          network: "base",
          validAfter: 2,
          validBefore: 1,
          agentKey: "default",
        },
      })
    ).toThrow("validBefore must be greater than or equal to validAfter.");
  });
});
