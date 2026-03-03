import {
  FARCASTER_CONTRACTS,
  FARCASTER_SIGNED_KEY_REQUEST_DEFAULT_TTL_SECONDS,
  FARCASTER_SIGNED_KEY_REQUEST_DOMAIN_NAME,
  FARCASTER_SIGNED_KEY_REQUEST_DOMAIN_VERSION,
  FARCASTER_SIGNED_KEY_REQUEST_PRIMARY_TYPE,
  FARCASTER_SIGNUP_CHAIN_ID,
} from "./constants.js";
import {
  normalizeFarcasterAddress,
  normalizeFarcasterNonNegativeBigInt,
  normalizeFarcasterPositiveBigInt,
  normalizeFarcasterSignature,
  normalizeFarcasterSignerPublicKey,
} from "./normalize.js";
import type {
  FarcasterSignedKeyRequestMetadata,
  FarcasterSignedKeyRequestTypedData,
  FarcasterSignedKeyRequestTypedDataDomain,
} from "./types.js";

export function buildFarcasterSignedKeyRequestTypedData(
  params: {
    requestFid: bigint;
    signerPublicKey: string;
    deadline: bigint;
  } & Partial<
    Pick<FarcasterSignedKeyRequestTypedDataDomain, "chainId" | "verifyingContract">
  >
): FarcasterSignedKeyRequestTypedData {
  return {
    domain: {
      name: FARCASTER_SIGNED_KEY_REQUEST_DOMAIN_NAME,
      version: FARCASTER_SIGNED_KEY_REQUEST_DOMAIN_VERSION,
      chainId: params.chainId ?? FARCASTER_SIGNUP_CHAIN_ID,
      verifyingContract: normalizeFarcasterAddress(
        params.verifyingContract ?? FARCASTER_CONTRACTS.signedKeyRequestValidator,
        "signedKeyRequestValidator"
      ),
    },
    types: {
      EIP712Domain: [
        { name: "name", type: "string" },
        { name: "version", type: "string" },
        { name: "chainId", type: "uint256" },
        { name: "verifyingContract", type: "address" },
      ],
      SignedKeyRequest: [
        { name: "requestFid", type: "uint256" },
        { name: "key", type: "bytes" },
        { name: "deadline", type: "uint256" },
      ],
    },
    primaryType: FARCASTER_SIGNED_KEY_REQUEST_PRIMARY_TYPE,
    message: {
      requestFid: normalizeFarcasterNonNegativeBigInt(params.requestFid, "requestFid"),
      key: normalizeFarcasterSignerPublicKey(params.signerPublicKey),
      deadline: normalizeFarcasterPositiveBigInt(params.deadline, "deadline"),
    },
  };
}

export function computeFarcasterSignedKeyRequestDeadline(params?: {
  nowSeconds?: number;
  ttlSeconds?: number;
}): bigint {
  const nowSeconds = Math.floor(params?.nowSeconds ?? Date.now() / 1000);
  const ttlSeconds = Math.floor(params?.ttlSeconds ?? FARCASTER_SIGNED_KEY_REQUEST_DEFAULT_TTL_SECONDS);
  if (ttlSeconds <= 0) {
    throw new Error("ttlSeconds must be greater than zero.");
  }
  if (!Number.isFinite(nowSeconds) || nowSeconds < 0) {
    throw new Error("nowSeconds must be a non-negative finite number.");
  }
  return BigInt(nowSeconds + ttlSeconds);
}

export function buildFarcasterSignedKeyRequestMetadata(params: {
  requestFid: bigint;
  requestSigner: string;
  signature: string;
  deadline: bigint;
}): FarcasterSignedKeyRequestMetadata {
  return {
    requestFid: normalizeFarcasterNonNegativeBigInt(params.requestFid, "requestFid"),
    requestSigner: normalizeFarcasterAddress(params.requestSigner, "requestSigner"),
    signature: normalizeFarcasterSignature(params.signature),
    deadline: normalizeFarcasterPositiveBigInt(params.deadline, "deadline"),
  };
}
