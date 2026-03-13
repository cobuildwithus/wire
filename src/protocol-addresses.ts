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
  goalFactory: "0x0f27EE0Aa0F01A6BcAF64e662977337dA5D476ce",
  budgetTcrFactory: "0x2EA70b65C2d1243A967C0eac37d63a296A3E40cb",
  goalFactoryPairDeployer: "0x65F3c0B21bA6ea7C73fe588F581Cd30c694325C9",
  goalDeploymentRegistry: "0xa7E5161B7eb788217b7BB22549C531300273bb52",
  goalPaymentTerminal: "0x0000000000000000000000000000000000000000",
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
  goalTreasuryImpl: "0xbCa5ee495874992B362b39a4B91a61652b7400b4",
  goalStakeVaultImpl: "0xc9824f73b5EdB097c958AfdA6Dde2c582ef4a230",
  budgetStakeLedgerImpl: "0x3FBE4B5B74D91F72ab9b71da2814F81EB7a850F1",
  goalFlowAllocationLedgerPipelineImpl: "0x4BECF8A3db91214558D1Bc100A6feb67c06a53cc",
  premiumEscrowImpl: "0x3E434C10150BdD96c345ad6F35dB3310A9EDF339",
  jurorSlasherRouterImpl: "0x63F7164689A5533a89e189280F69cc096f708166",
  underwriterSlasherRouterImpl: "0xe8fE7344fC7dCE0a04A43731554bD68C9F3e0D42",
  customFlowImpl: "0xb491420ebE762C0503ef1819a267a721B1e63c63",
  goalRevnetSplitHookImpl: "0x2f0e749Ee7A459714Ac99485A45494c97e984536",
  budgetTcrImpl: "0xCb3ec1d7Ba528D3a676FDF92181Dc7b79DB31B78",
  erc20VotesArbitratorImpl: "0xF88E7FF73F43cbA31DFF5c2fd2bCAe7B710fB8A9",
  budgetTcrDeployerImpl: "0xDC5baB04c3513fD5453876214f29b6eF11f38CF1",
  budgetTreasuryImpl: "0x441a50fe02dB270A4f487583F17eFaA1c2005E2C",
  roundSubmissionTcrImpl: "0x72b11c5803976C72FFC39F871e631Ee7E3daB690",
  roundPrizeVaultImpl: "0xAac6BDAAF4153261860c5856fA1E9F7404274fD3",
  prizePoolSubmissionDepositStrategyImpl: "0x9e0F51DDcEa90A79D613c9D0211410C108386EE9",
  roundFactoryImpl: "0x1772c43D40E1E66fb0C73C27Aa5689053AaCF24a",
  allocationMechanismTcrImpl: "0xbDde78690EA0618F4521Ac193f410dc3eDE90c77",
  budgetFlowRouterStrategyImpl: "0x43BA11324bD75B90D7D87e849BBA80A809c0f378",
  linearSpendPolicyImpl: "0xcC8c047603a07DC71d02F5147718Ce0A0c1a20bF",
  cobuildSwapImpl: "0x21a580054e7a5e833f38033f2d958e00e4c50f0f",
} as const;

export const baseDefaults = {
  defaultSubmissionDepositStrategy: "0x0e46e93Fba439303AB347361d73C2Fdd48006d22",
  defaultOpenBudgetGatePolicy: "0x2E00c4bE6BBEDeea7a600f6B8c4ef21bDBBaf536",
  defaultGoalSpendPolicy: "0x46c08e7FBa9947Ae14e3C7Df3F82DBfF9e951c20",
  defaultBudgetSpendPolicy: "0x2CFB6B81C69BDF9c11cBeaafFcb657E4039e3536",
  defaultAllocationMechanismAdmin: "0x289715fFBB2f4b482e2917D2f183FeAb564ec84F",
  defaultInvalidRoundRewardsSink: "0x000000000000000000000000000000000000dEaD",
} as const;

export const COBUILD_PROJECT_ID = 138 as const;
export const COBUILD_PROJECT_ID_BIGINT = 138n as const;

export const baseConfig = {
  cobuildProjectId: COBUILD_PROJECT_ID,
  cobuildRevnetId: COBUILD_PROJECT_ID,
  fakeUmaTreasurySuccessResolver: "0xc9a16Da48BA31C12253Ea438a66247D5d70Df195",
  fakeUmaOwner: "0x289715fFBB2f4b482e2917D2f183FeAb564ec84F",
  fakeUmaEscalationManager: "0x289715fFBB2f4b482e2917D2f183FeAb564ec84F",
  fakeUmaDomainId: "0x0000000000000000000000000000000000000000000000000000000000000000",
} as const;

export const baseContracts = {
  GoalFactory: baseEntrypoints.goalFactory,
  BudgetTCRFactory: baseEntrypoints.budgetTcrFactory,
  GoalFactoryPairDeployer: baseEntrypoints.goalFactoryPairDeployer,
  GoalDeploymentRegistry: baseEntrypoints.goalDeploymentRegistry,
  GoalPaymentTerminal: baseEntrypoints.goalPaymentTerminal,
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
  LinearSpendPolicyImpl: baseImplementations.linearSpendPolicyImpl,
  DefaultSubmissionDepositStrategy: baseDefaults.defaultSubmissionDepositStrategy,
  DefaultOpenBudgetGatePolicy: baseDefaults.defaultOpenBudgetGatePolicy,
  DefaultGoalSpendPolicy: baseDefaults.defaultGoalSpendPolicy,
  DefaultBudgetSpendPolicy: baseDefaults.defaultBudgetSpendPolicy,
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
export const goalFactoryPairDeployerAddress = baseEntrypoints.goalFactoryPairDeployer;
export const goalDeploymentRegistryAddress = baseEntrypoints.goalDeploymentRegistry;
export const goalPaymentTerminalAddress = baseEntrypoints.goalPaymentTerminal;
export const cobuildTokenAddress = baseEntrypoints.cobuildToken;
export const cobuildSwapAddress = baseEntrypoints.cobuildSwap;
export const cobuildTerminalAddress = baseEntrypoints.cobuildTerminal;
export const buybackHookDataHookAddress = baseEntrypoints.buybackHookDataHook;
export const buybackHookAddress = baseEntrypoints.buybackHook;
export const COBUILD_TOKEN_ADDRESS = baseEntrypoints.cobuildToken;
export const WETH_ADDRESS = baseTokens.weth;
export const USDC_BASE_ADDRESS = baseTokens.usdc;
