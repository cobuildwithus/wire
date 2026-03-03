export const FARCASTER_SIGNUP_NETWORK = "optimism";
export const FARCASTER_SIGNUP_CHAIN_ID = 10;

export const FARCASTER_CONTRACTS = {
  idGateway: "0x00000000fc25870c6ed6b6c7e41fb078b7656f69",
  keyGateway: "0x00000000fc56947c7e7183f8ca4b62398caadf0b",
  idRegistry: "0x00000000fc6c5f01fc30151999387bb99a9f489b",
  signedKeyRequestValidator: "0x00000000fc700472606ed4fa22623acf62c60553",
} as const;

export const FARCASTER_SIGNED_KEY_REQUEST_DOMAIN_NAME = "Farcaster SignedKeyRequestValidator";
export const FARCASTER_SIGNED_KEY_REQUEST_DOMAIN_VERSION = "1";
export const FARCASTER_SIGNED_KEY_REQUEST_PRIMARY_TYPE = "SignedKeyRequest";
export const FARCASTER_SIGNED_KEY_REQUEST_DEFAULT_TTL_SECONDS = 60 * 60;

export const FARCASTER_SIGNUP_GAS_BUFFER_WEI = 200_000_000_000_000n;
export const FARCASTER_KEY_TYPE_ED25519 = 1;
export const FARCASTER_KEY_METADATA_TYPE_SIGNED_KEY_REQUEST = 1;

export const FARCASTER_ID_GATEWAY_ABI = [
  {
    type: "function",
    name: "price",
    stateMutability: "view",
    inputs: [{ name: "extraStorage", type: "uint256" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "register",
    stateMutability: "payable",
    inputs: [
      { name: "recovery", type: "address" },
      { name: "extraStorage", type: "uint256" },
    ],
    outputs: [{ name: "fid", type: "uint256" }],
  },
] as const;

export const FARCASTER_KEY_GATEWAY_ABI = [
  {
    type: "function",
    name: "add",
    stateMutability: "nonpayable",
    inputs: [
      { name: "keyType", type: "uint32" },
      { name: "key", type: "bytes" },
      { name: "metadataType", type: "uint8" },
      { name: "metadata", type: "bytes" },
    ],
    outputs: [],
  },
] as const;

export const FARCASTER_ID_REGISTRY_ABI = [
  {
    type: "function",
    name: "idOf",
    stateMutability: "view",
    inputs: [{ name: "owner", type: "address" }],
    outputs: [{ name: "fid", type: "uint256" }],
  },
] as const;
