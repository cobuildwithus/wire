import { describe, expect, it } from "vitest";
import {
  FARCASTER_CONTRACTS,
  FARCASTER_KEY_METADATA_TYPE_SIGNED_KEY_REQUEST,
  FARCASTER_KEY_TYPE_ED25519,
  FARCASTER_SIGNUP_CHAIN_ID,
  FARCASTER_SIGNUP_GAS_BUFFER_WEI,
  FARCASTER_SIGNUP_NETWORK,
  buildFarcasterSignedKeyRequestMetadata,
  buildFarcasterSignedKeyRequestTypedData,
  buildFarcasterSignupCallPlan,
  computeFarcasterSignedKeyRequestDeadline,
  evaluateFarcasterSignupPreflight,
  normalizeFarcasterSignerPublicKey,
} from "../src/farcaster.js";

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
});
