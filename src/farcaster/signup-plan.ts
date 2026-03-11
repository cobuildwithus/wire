import {
  FARCASTER_CONTRACTS,
  FARCASTER_ID_GATEWAY_ABI,
  FARCASTER_KEY_METADATA_TYPE_SIGNED_KEY_REQUEST,
  FARCASTER_KEY_TYPE_ED25519,
  FARCASTER_KEY_GATEWAY_ABI,
  FARCASTER_SIGNUP_GAS_BUFFER_WEI,
  FARCASTER_SIGNUP_NETWORK,
} from "./constants.js";
import { encodeAbiParameters, encodeFunctionData } from "viem";
import {
  normalizeFarcasterAddress,
  normalizeFarcasterExtraStorage,
  normalizeFarcasterNonNegativeBigInt,
  normalizeFarcasterSignerPublicKey,
} from "./normalize.js";
import {
  buildFarcasterSignupCompletedResult,
  buildFarcasterSignupNeedsFundingResult,
} from "./contracts.js";
import {
  buildFarcasterSignedKeyRequestMetadata,
  buildFarcasterSignedKeyRequestTypedData,
  computeFarcasterSignedKeyRequestDeadline,
} from "./typed-data.js";
import type {
  FarcasterExecutableCall,
  FarcasterSignupExecutionBuilderParams,
  FarcasterSignupExecutionBundle,
  FarcasterSignupPlanResult,
  FarcasterSignedKeyRequestMetadata,
  FarcasterSignupCallPlan,
  FarcasterSignupExecutableCalls,
  FarcasterSignupPreflightResult,
} from "./types.js";

export function buildFarcasterSignupCallPlan(params: {
  recoveryAddress: string;
  extraStorage: bigint | number | string | undefined;
  idGatewayPriceWei: bigint;
  signerPublicKey: string;
  signedKeyRequestMetadata: FarcasterSignedKeyRequestMetadata;
}): FarcasterSignupCallPlan {
  const recoveryAddress = normalizeFarcasterAddress(params.recoveryAddress, "recoveryAddress");
  const extraStorage = normalizeFarcasterExtraStorage(params.extraStorage, "extraStorage");
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

export function encodeFarcasterSignedKeyRequestMetadata(
  metadata: FarcasterSignedKeyRequestMetadata
): `0x${string}` {
  return encodeAbiParameters(
    [
      {
        type: "tuple",
        components: [
          { name: "requestFid", type: "uint256" },
          { name: "requestSigner", type: "address" },
          { name: "signature", type: "bytes" },
          { name: "deadline", type: "uint256" },
        ],
      },
    ],
    [metadata]
  );
}

function buildExecutableCall(params: { to: string; value: bigint; data: `0x${string}` }): FarcasterExecutableCall {
  return {
    to: normalizeFarcasterAddress(params.to, "to"),
    value: normalizeFarcasterNonNegativeBigInt(params.value, "value"),
    data: params.data,
  };
}

export function buildFarcasterSignupExecutableCalls(
  plan: FarcasterSignupCallPlan
): FarcasterSignupExecutableCalls {
  const registerCall = plan.calls[0];
  const addKeyCall = plan.calls[1];

  const registerData = encodeFunctionData({
    abi: FARCASTER_ID_GATEWAY_ABI,
    functionName: registerCall.functionName,
    args: [registerCall.args.recoveryAddress, registerCall.args.extraStorage],
  });
  const addKeyData = encodeFunctionData({
    abi: FARCASTER_KEY_GATEWAY_ABI,
    functionName: addKeyCall.functionName,
    args: [
      addKeyCall.args.keyType,
      addKeyCall.args.key,
      addKeyCall.args.metadataType,
      encodeFarcasterSignedKeyRequestMetadata(addKeyCall.args.metadata),
    ],
  });

  return [
    buildExecutableCall({
      to: registerCall.to,
      value: registerCall.value,
      data: registerData,
    }),
    buildExecutableCall({
      to: addKeyCall.to,
      value: addKeyCall.value,
      data: addKeyData,
    }),
  ];
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

function buildFarcasterSignupExecution(params: {
  recoveryAddress: string;
  extraStorage: bigint;
  idGatewayPriceWei: bigint;
  signerPublicKey: string;
  requestSigner: string;
  signature: string;
  deadline: bigint;
}): FarcasterSignupExecutionBundle {
  const signedKeyRequestMetadata = buildFarcasterSignedKeyRequestMetadata({
    requestFid: 0n,
    requestSigner: params.requestSigner,
    signature: params.signature,
    deadline: params.deadline,
  });
  const signupCallPlan = buildFarcasterSignupCallPlan({
    recoveryAddress: params.recoveryAddress,
    extraStorage: params.extraStorage,
    idGatewayPriceWei: params.idGatewayPriceWei,
    signerPublicKey: params.signerPublicKey,
    signedKeyRequestMetadata,
  });

  return {
    signedKeyRequestMetadata,
    signupCallPlan,
    executableCalls: buildFarcasterSignupExecutableCalls(signupCallPlan),
  };
}

export function planFarcasterSignup(params: {
  ownerAddress: string;
  custodyAddress: string;
  recoveryAddress: string;
  signerPublicKey: string;
  existingFid: bigint;
  idGatewayPriceWei: bigint;
  balanceWei: bigint;
  extraStorage?: bigint | number | string;
  signedKeyRequestDeadline?: bigint;
}): FarcasterSignupPlanResult {
  const ownerAddress = normalizeFarcasterAddress(params.ownerAddress, "ownerAddress");
  const custodyAddress = normalizeFarcasterAddress(params.custodyAddress, "custodyAddress");
  const recoveryAddress = normalizeFarcasterAddress(params.recoveryAddress, "recoveryAddress");
  const signerPublicKey = normalizeFarcasterSignerPublicKey(params.signerPublicKey);
  const extraStorage = normalizeFarcasterExtraStorage(params.extraStorage, "extraStorage");
  const existingFid = normalizeFarcasterNonNegativeBigInt(params.existingFid, "existingFid");
  const idGatewayPriceWei = normalizeFarcasterNonNegativeBigInt(
    params.idGatewayPriceWei,
    "idGatewayPriceWei"
  );
  const balanceWei = normalizeFarcasterNonNegativeBigInt(params.balanceWei, "balanceWei");
  const preflight = evaluateFarcasterSignupPreflight({
    custodyAddress,
    existingFid,
    idGatewayPriceWei,
    balanceWei,
  });

  if (preflight.status === "already_registered") {
    return {
      status: "already_registered",
      ownerAddress,
      custodyAddress,
      recoveryAddress,
      existingFid: preflight.existingFid,
    };
  }

  if (preflight.status === "needs_funding") {
    return buildFarcasterSignupNeedsFundingResult({
      ownerAddress,
      custodyAddress,
      recoveryAddress,
      idGatewayPriceWei,
      balanceWei,
      requiredWei: preflight.requiredWei,
    });
  }

  const deadline =
    params.signedKeyRequestDeadline ??
    computeFarcasterSignedKeyRequestDeadline();
  const typedData = buildFarcasterSignedKeyRequestTypedData({
    requestFid: 0n,
    signerPublicKey,
    deadline,
  });

  const buildExecution = (buildParams: FarcasterSignupExecutionBuilderParams) =>
    buildFarcasterSignupExecution({
      recoveryAddress,
      extraStorage,
      idGatewayPriceWei,
      signerPublicKey,
      requestSigner: buildParams.requestSigner,
      signature: buildParams.signature,
      deadline: typedData.message.deadline,
    });

  return {
    status: "ready",
    network: FARCASTER_SIGNUP_NETWORK,
    ownerAddress,
    custodyAddress,
    recoveryAddress,
    extraStorage: extraStorage.toString(),
    idGatewayPriceWei: idGatewayPriceWei.toString(),
    typedData,
    buildExecution,
    buildExecutableCalls: (buildParams) => buildExecution(buildParams).executableCalls,
    buildCompletedResult: ({ fid, txHash }) =>
      buildFarcasterSignupCompletedResult({
        ownerAddress,
        custodyAddress,
        recoveryAddress,
        fid,
        idGatewayPriceWei,
        txHash,
      }),
  };
}
