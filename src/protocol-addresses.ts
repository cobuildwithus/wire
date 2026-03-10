import { BASE_CHAIN_ID } from "./chains.js";

export const PROTOCOL_NETWORKS = ["base"] as const;
export type ProtocolNetwork = (typeof PROTOCOL_NETWORKS)[number];

export function isProtocolNetwork(value: string): value is ProtocolNetwork {
  return PROTOCOL_NETWORKS.includes(value.trim().toLowerCase() as ProtocolNetwork);
}

export function normalizeProtocolNetwork(value: string): ProtocolNetwork {
  const normalized = value.trim().toLowerCase();
  if (!isProtocolNetwork(normalized)) {
    throw new Error(`unsupported protocol network: ${value}`);
  }
  return normalized;
}

/**
 * Canonical Base V1 core deployment addresses sourced from:
 * - v1-core/deploys/DeployGoalFactory.8453.txt
 * - v1-core/deploys/LATEST_IMPLEMENTATIONS.8453.txt
 * - v1-core/deploys/LATEST_IMPLEMENTATIONS.8453.toml
 */
export const baseEntrypoints = {
  goalFactory: "0x47e83655026b6cAAD68D32919f165CE9C3Bd8a8F",
  budgetTcrFactory: "0x6FDbE9f8330CA9B22d74E21a1e5aA29c7AE4E4fD",
  cobuildToken: "0x62F05b13239B24B8eEFF36696344dE0Db7D2efDD",
  cobuildSwap: "0x5d09ddd53feffc52f5139a59246ced560d8c45df",
  cobuildTerminal: "0x5f4eF83207FbaCe6f66f670865A8F2a0D4A689D7",
  buybackHookDataHook: "0xB6133A222315f8E9d25E7C77BAC5DdEB3451D088",
  buybackHook: "0xB6133A222315f8E9d25E7C77BAC5DdEB3451D088",
  revDeployer: "0x2cA27BDe7e7D33E353b44c27aCfCf6c78ddE251d",
  superfluidHost: "0x4C073B3baB6d8826b8C5b229f3cfdC1eC6E47E74",
} as const;

export const baseTokens = {
  weth: "0x4200000000000000000000000000000000000006",
  usdc: "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",
  zora: "0x1111111111166b7fe7bd91427724b487980afc69",
} as const;

export const baseEcosystemContracts = {
  zoraFactory: "0x777777751622c0d3258f214F9DF38E35BF45baF3",
  zoraFactoryImpl: "0x0e2ea62e5377d46fef114a60afbe3d5ea7490577",
  creatorCoinImpl: "0x88cc4e08c7608723f3e44e17ac669fb43b6a8313",
  uniswapStateView: "0xa3c0c9b65bad0b08107aa264b0f3db444b867a71",
  uniswapV3ZoraUsdcPool: "0xedc625b74537ee3a10874f53d170e9c17a906b9c",
  flowDeployerImpl: "0xd9725b54b5dc4d61a3e9dfe669955f0239f62e92",
  flowDeployer: "0x62953560766ac1be810e6ef13ab3736f8e2c8a41",
  usdcPermitAdmin: "0x9108f3c347d642b900602c543e061aee9e8e271f",
  cobuildFlowManager: "0xb9d58f3575bf264cf705c15fcfa06eb4afdcea64",
  cobuildFlowAllocator: "0x279adb5201ee14f717560cfaa560e4648f037dc3",
  jbDirectory: "0x0061e516886a0540f63157f112c0588ee0651dcf",
  jbMultiTerminal: "0x2db6d704058e552defe415753465df8df0361846",
  jbController: "0x27da30646502e2f642be5281322ae8c394f7668a",
  jbPermissions: "0x04fD6913d6c32D8C216e153a43C04b1857a7793d",
  jbTerminalStore: "0xfE33B439Ec53748C87DcEDACb83f05aDd5014744",
  revLoans: "0x1880D832aa283d05b8eAB68877717E25FbD550Bb",
  jbTokens: "0x4d0edd347fb1fa21589c1e109b3474924be87636",
} as const;

export const baseImplementations = {
  goalTreasuryImpl: "0xCB87F7dac555F907EA07A00127590479AC4558fb",
  goalStakeVaultImpl: "0x04F131525e66678e867cA12f56d4aC37839DE2ac",
  budgetStakeLedgerImpl: "0x2CDd4d48362d039cDA6Cf67d62C7cF96C2fb3871",
  goalFlowAllocationLedgerPipelineImpl: "0x0c449732D3Da563073B6B2126660A857C9dcE124",
  premiumEscrowImpl: "0x8b9aD109907E86ce2a8c491A97093cA076CC6Cd5",
  jurorSlasherRouterImpl: "0x728bb0B5BB2Ff87111Bf717CD4D2E00752d08b22",
  underwriterSlasherRouterImpl: "0xE991c419A59000C902c481a38C6BA329ad6b97FC",
  customFlowImpl: "0x6ff0Ff68b783dbBE1663BAedF858459C9D51C841",
  goalRevnetSplitHookImpl: "0x71f3A823650ed7b8D5d88e30551D0ed78071f20E",
  budgetTcrImpl: "0x8d427390e7A210eaC7d40903d90Ad2170517D332",
  erc20VotesArbitratorImpl: "0x94BF66E1d1E4C5532680f394C8B25C1070E80aFD",
  budgetTcrDeployerImpl: "0x760048823Dd1d754c9eaBcdeD9Cb5428Cc3CF863",
  budgetTreasuryImpl: "0xBc90bad4575bF7ADf9D096211f7AD40F24c8EFD1",
  roundSubmissionTcrImpl: "0xeC4217c061F84d1Ba97687C9a72B926B0382f747",
  roundPrizeVaultImpl: "0xf193305823BDE3043C8d2503cBCDFF62b8CC6b17",
  prizePoolSubmissionDepositStrategyImpl: "0xB3B6ece085C3d078e3752d271eD636c6B185f620",
  roundFactoryImpl: "0x3ea0A71d0bC5852da2184fe3b2aED8849b4D6e3b",
  allocationMechanismTcrImpl: "0x98DC19691bECEB21a8DAEc81055E05EDDCDD027e",
  budgetFlowRouterStrategyImpl: "0xeb20eA7a1f82c0fA568c4227F399b6555F360279",
  cobuildSwapImpl: "0x21a580054e7a5e833f38033f2d958e00e4c50f0f",
} as const;

export const baseDefaults = {
  defaultSubmissionDepositStrategy: "0x9873Cf79c16884e2295039DdDc02dF9E1D92355a",
  defaultAllocationMechanismAdmin: "0x289715fFBB2f4b482e2917D2f183FeAb564ec84F",
  defaultInvalidRoundRewardsSink: "0x000000000000000000000000000000000000dEaD",
} as const;

export const baseConfig = {
  cobuildRevnetId: 138,
  fakeUmaTreasurySuccessResolver: "0xB6737Fee8A0c49D1A3f23664Df94dcE2EbBE7a12",
  fakeUmaOwner: "0x289715fFBB2f4b482e2917D2f183FeAb564ec84F",
  fakeUmaEscalationManager: "0x289715fFBB2f4b482e2917D2f183FeAb564ec84F",
  fakeUmaDomainId: "0x0000000000000000000000000000000000000000000000000000000000000000",
} as const;

export const baseContracts = {
  CobuildSwap: baseEntrypoints.cobuildSwap,
  CobuildSwapImpl: baseImplementations.cobuildSwapImpl,
  CobuildToken: baseEntrypoints.cobuildToken,
  USDCBase: baseTokens.usdc,
  ZoraFactory: baseEcosystemContracts.zoraFactory,
  ZoraFactoryImpl: baseEcosystemContracts.zoraFactoryImpl,
  CreatorCoinImpl: baseEcosystemContracts.creatorCoinImpl,
  UniswapStateView: baseEcosystemContracts.uniswapStateView,
  ZoraToken: baseTokens.zora,
  UniswapV3ZoraUsdcPool: baseEcosystemContracts.uniswapV3ZoraUsdcPool,
  FlowDeployerImpl: baseEcosystemContracts.flowDeployerImpl,
  FlowDeployer: baseEcosystemContracts.flowDeployer,
  USDCPermitAdmin: baseEcosystemContracts.usdcPermitAdmin,
  CobuildFlowManager: baseEcosystemContracts.cobuildFlowManager,
  CobuildFlowAllocator: baseEcosystemContracts.cobuildFlowAllocator,
  CustomFlowImpl: baseImplementations.customFlowImpl,
  JBDirectory: baseEcosystemContracts.jbDirectory,
  JBMultiTerminal: baseEcosystemContracts.jbMultiTerminal,
  JBController: baseEcosystemContracts.jbController,
  JBPermissions: baseEcosystemContracts.jbPermissions,
  JBTerminalStore: baseEcosystemContracts.jbTerminalStore,
  REVDeployer: baseEntrypoints.revDeployer,
  REVLoans: baseEcosystemContracts.revLoans,
  JBTokens: baseEcosystemContracts.jbTokens,
} as const;

export const baseAddresses = {
  chainId: BASE_CHAIN_ID,
  tokens: baseTokens,
  entrypoints: baseEntrypoints,
  ecosystemContracts: baseEcosystemContracts,
  contracts: baseContracts,
  implementations: baseImplementations,
  defaults: baseDefaults,
  config: baseConfig,
} as const;

export function resolveProtocolAddresses(network: ProtocolNetwork | string = "base") {
  normalizeProtocolNetwork(network);
  return baseAddresses;
}

export const goalFactoryAddress = baseEntrypoints.goalFactory;
export const budgetTcrFactoryAddress = baseEntrypoints.budgetTcrFactory;
export const cobuildTokenAddress = baseEntrypoints.cobuildToken;
export const cobuildSwapAddress = baseEntrypoints.cobuildSwap;
export const cobuildTerminalAddress = baseEntrypoints.cobuildTerminal;
export const buybackHookDataHookAddress = baseEntrypoints.buybackHookDataHook;
export const buybackHookAddress = baseEntrypoints.buybackHook;
export const WETH_ADDRESS = baseTokens.weth;
export const USDC_BASE_ADDRESS = baseTokens.usdc;
export const COBUILD_TOKEN = baseEntrypoints.cobuildToken;
export const COBUILD_REVNET_ID = baseConfig.cobuildRevnetId;
export const COBUILD_SWAP = baseEntrypoints.cobuildSwap;
export const COBUILD_TERMINAL = baseEntrypoints.cobuildTerminal;
export const BUYBACK_HOOK_DATA_HOOK = baseEntrypoints.buybackHookDataHook;
export const BUYBACK_HOOK = baseEntrypoints.buybackHook;
export const COBUILD_SWAP_IMPL = baseImplementations.cobuildSwapImpl;
