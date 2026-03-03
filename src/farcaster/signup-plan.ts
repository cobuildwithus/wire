import {
  FARCASTER_CONTRACTS,
  FARCASTER_KEY_METADATA_TYPE_SIGNED_KEY_REQUEST,
  FARCASTER_KEY_TYPE_ED25519,
  FARCASTER_SIGNUP_GAS_BUFFER_WEI,
  FARCASTER_SIGNUP_NETWORK,
} from "./constants.js";
import {
  normalizeFarcasterAddress,
  normalizeFarcasterNonNegativeBigInt,
  normalizeFarcasterSignerPublicKey,
} from "./normalize.js";
import type {
  FarcasterSignedKeyRequestMetadata,
  FarcasterSignupCallPlan,
  FarcasterSignupPreflightResult,
} from "./types.js";

export function buildFarcasterSignupCallPlan(params: {
  recoveryAddress: string;
  extraStorage: bigint;
  idGatewayPriceWei: bigint;
  signerPublicKey: string;
  signedKeyRequestMetadata: FarcasterSignedKeyRequestMetadata;
}): FarcasterSignupCallPlan {
  const recoveryAddress = normalizeFarcasterAddress(params.recoveryAddress, "recoveryAddress");
  const extraStorage = normalizeFarcasterNonNegativeBigInt(params.extraStorage, "extraStorage");
  const idGatewayPriceWei = normalizeFarcasterNonNegativeBigInt(
    params.idGatewayPriceWei,
    "idGatewayPriceWei"
  );

  return {
    network: FARCASTER_SIGNUP_NETWORK,
    calls: [
      {
        kind: "register",
        to: FARCASTER_CONTRACTS.idGateway,
        functionName: "register",
        value: idGatewayPriceWei,
        args: {
          recoveryAddress,
          extraStorage,
        },
      },
      {
        kind: "add-key",
        to: FARCASTER_CONTRACTS.keyGateway,
        functionName: "add",
        value: 0n,
        args: {
          keyType: FARCASTER_KEY_TYPE_ED25519,
          key: normalizeFarcasterSignerPublicKey(params.signerPublicKey),
          metadataType: FARCASTER_KEY_METADATA_TYPE_SIGNED_KEY_REQUEST,
          metadata: params.signedKeyRequestMetadata,
        },
      },
    ],
  };
}

export function evaluateFarcasterSignupPreflight(params: {
  custodyAddress: string;
  existingFid: bigint;
  idGatewayPriceWei: bigint;
  balanceWei: bigint;
  gasBufferWei?: bigint;
}): FarcasterSignupPreflightResult {
  const custodyAddress = normalizeFarcasterAddress(params.custodyAddress, "custodyAddress");
  const existingFid = normalizeFarcasterNonNegativeBigInt(params.existingFid, "existingFid");
  const idGatewayPriceWei = normalizeFarcasterNonNegativeBigInt(
    params.idGatewayPriceWei,
    "idGatewayPriceWei"
  );
  const balanceWei = normalizeFarcasterNonNegativeBigInt(params.balanceWei, "balanceWei");
  const gasBufferWei = normalizeFarcasterNonNegativeBigInt(
    params.gasBufferWei ?? FARCASTER_SIGNUP_GAS_BUFFER_WEI,
    "gasBufferWei"
  );

  const requiredWei = idGatewayPriceWei + gasBufferWei;
  const common = {
    custodyAddress,
    idGatewayPriceWei: idGatewayPriceWei.toString(),
    gasBufferWei: gasBufferWei.toString(),
    requiredWei: requiredWei.toString(),
    balanceWei: balanceWei.toString(),
  };

  if (existingFid > 0n) {
    return {
      status: "already_registered",
      ...common,
      existingFid: existingFid.toString(),
    };
  }

  if (balanceWei < requiredWei) {
    return {
      status: "needs_funding",
      ...common,
      deficitWei: (requiredWei - balanceWei).toString(),
    };
  }

  return {
    status: "ready",
    ...common,
    deficitWei: "0",
  };
}
