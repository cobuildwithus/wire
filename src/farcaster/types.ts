import {
  FARCASTER_CONTRACTS,
  FARCASTER_KEY_METADATA_TYPE_SIGNED_KEY_REQUEST,
  FARCASTER_KEY_TYPE_ED25519,
  FARCASTER_SIGNUP_NETWORK,
} from "./constants.js";

export type FarcasterHexString = `0x${string}`;
export type EvmAddress = `0x${string}`;

export type FarcasterSignedKeyRequestTypedDataDomain = {
  name: string;
  version: string;
  chainId: number;
  verifyingContract: EvmAddress;
};

export type FarcasterSignedKeyRequestTypedDataTypes = {
  EIP712Domain: Array<{ name: string; type: string }>;
  SignedKeyRequest: Array<{ name: string; type: string }>;
};

export type FarcasterSignedKeyRequestTypedDataMessage = {
  requestFid: bigint;
  key: FarcasterHexString;
  deadline: bigint;
};

export type FarcasterSignedKeyRequestTypedData = {
  domain: FarcasterSignedKeyRequestTypedDataDomain;
  types: FarcasterSignedKeyRequestTypedDataTypes;
  primaryType: "SignedKeyRequest";
  message: FarcasterSignedKeyRequestTypedDataMessage;
};

export type FarcasterSignedKeyRequestMetadata = {
  requestFid: bigint;
  requestSigner: EvmAddress;
  signature: FarcasterHexString;
  deadline: bigint;
};

export type FarcasterSignupRegisterCallIntent = {
  kind: "register";
  to: typeof FARCASTER_CONTRACTS.idGateway;
  functionName: "register";
  value: bigint;
  args: {
    recoveryAddress: EvmAddress;
    extraStorage: bigint;
  };
};

export type FarcasterSignupAddKeyCallIntent = {
  kind: "add-key";
  to: typeof FARCASTER_CONTRACTS.keyGateway;
  functionName: "add";
  value: 0n;
  args: {
    keyType: typeof FARCASTER_KEY_TYPE_ED25519;
    key: FarcasterHexString;
    metadataType: typeof FARCASTER_KEY_METADATA_TYPE_SIGNED_KEY_REQUEST;
    metadata: FarcasterSignedKeyRequestMetadata;
  };
};

export type FarcasterSignupCallIntent =
  | FarcasterSignupRegisterCallIntent
  | FarcasterSignupAddKeyCallIntent;

export type FarcasterSignupCallPlan = {
  network: typeof FARCASTER_SIGNUP_NETWORK;
  calls: [FarcasterSignupRegisterCallIntent, FarcasterSignupAddKeyCallIntent];
};

type FarcasterPreflightCommon = {
  custodyAddress: EvmAddress;
  idGatewayPriceWei: string;
  gasBufferWei: string;
  requiredWei: string;
  balanceWei: string;
};

export type FarcasterSignupPreflightAlreadyRegistered = FarcasterPreflightCommon & {
  status: "already_registered";
  existingFid: string;
};

export type FarcasterSignupPreflightNeedsFunding = FarcasterPreflightCommon & {
  status: "needs_funding";
  deficitWei: string;
};

export type FarcasterSignupPreflightReady = FarcasterPreflightCommon & {
  status: "ready";
  deficitWei: "0";
};

export type FarcasterSignupPreflightResult =
  | FarcasterSignupPreflightAlreadyRegistered
  | FarcasterSignupPreflightNeedsFunding
  | FarcasterSignupPreflightReady;
