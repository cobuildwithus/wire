import {
  FARCASTER_CONTRACTS,
  FARCASTER_KEY_METADATA_TYPE_SIGNED_KEY_REQUEST,
  FARCASTER_KEY_TYPE_ED25519,
  FARCASTER_SIGNUP_NETWORK,
} from "./constants.js";
import type { EvmAddress, HexBytes32 } from "../evm.js";

export type FarcasterHexString = `0x${string}`;
export type { EvmAddress };

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

export type FarcasterExecutableCall = {
  to: EvmAddress;
  value: bigint;
  data: FarcasterHexString;
};

export type FarcasterSignupExecutableCalls = [FarcasterExecutableCall, FarcasterExecutableCall];

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

export type FarcasterSignupFundingAmounts = {
  idGatewayPriceWei: string;
  idGatewayPriceEth: string;
  balanceWei: string;
  balanceEth: string;
  requiredWei: string;
  requiredEth: string;
};

export type FarcasterSignupNeedsFundingResult = FarcasterSignupFundingAmounts & {
  status: "needs_funding";
  network: typeof FARCASTER_SIGNUP_NETWORK;
  ownerAddress: EvmAddress;
  custodyAddress: EvmAddress;
  recoveryAddress: EvmAddress;
};

export type FarcasterSignupCompletedResult = {
  status: "complete";
  network: typeof FARCASTER_SIGNUP_NETWORK;
  ownerAddress: EvmAddress;
  custodyAddress: EvmAddress;
  recoveryAddress: EvmAddress;
  fid: string;
  idGatewayPriceWei: string;
  txHash: HexBytes32;
};

export type FarcasterSignupResult =
  | FarcasterSignupNeedsFundingResult
  | FarcasterSignupCompletedResult;

export type FarcasterSignupResponse = {
  ok: true;
  result: FarcasterSignupResult;
};

export type FarcasterSignupAlreadyRegisteredDetails = {
  fid: string;
  custodyAddress: EvmAddress;
};

export type FarcasterSignupAlreadyRegisteredErrorResponse = {
  ok: false;
  error: string;
  details: FarcasterSignupAlreadyRegisteredDetails;
};

export type FarcasterHostedX402PaymentResult = {
  xPayment: string;
  payerAddress: EvmAddress;
  payTo: EvmAddress;
  token: EvmAddress;
  amount: string;
  network: "base";
  validAfter: number;
  validBefore: number;
  agentKey: string;
};

export type FarcasterHostedX402PaymentResponse = {
  ok: true;
  result: FarcasterHostedX402PaymentResult;
};
