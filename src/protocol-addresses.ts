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
  goalFactory: "0x88c3E04bE35b16A248d66c48C78aEf4e864eb1B3",
  budgetTcrFactory: "0x764c0207a6fc6a4c740649B1e3Cc3c913adfb95D",
  goalFactoryPairDeployer: "0xDE0c5C6fCe39Ce79e290544E4115d99d0dD9589A",
  goalDeploymentRegistry: "0x9bCD0b62903Fc20a91BDC43ECfa78a3EFCA77D67",
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
  goalTreasuryImpl: "0x4EE7167e173b83B0EB3F7DaB7FCA4367cC6907eC",
  goalStakeVaultImpl: "0x8355dF264778dbc0e55fd4aC0dbb1f600c8D1346",
  budgetStakeLedgerImpl: "0x6700Da310Ba1b24a6629dBb3370dBcEf54038151",
  goalFlowAllocationLedgerPipelineImpl: "0xF6f9BebD7450cd7E026344fB3c2a35B304D4bc45",
  premiumEscrowImpl: "0x100d0728d35ae46b37c4f3152E120D0fefa562fC",
  jurorSlasherRouterImpl: "0x665423695D1E5B254e568822B488193c13AF9A48",
  underwriterSlasherRouterImpl: "0xE7400FF8295Ff863D0EE71DBd84A69Cc8c1Df7A1",
  managedBudgetControllerImpl: "0x7Bd18aE34030646B2F209b4b1F64506a7ADEd1f3",
  managedGoalAllocatorStrategyImpl: "0x643572dA72826d7F1F1151D2d058Ea48DcD43Cb6",
  managedBudgetChildStrategyImpl: "0xBF102f4a9A98490c3463ca015Ea19839Ec88C7Ac",
  managedBudgetChildStrategyFactoryImpl: "0x9d238C4414ffCc79Fb81aE28142FfDD861E6CEfC",
  customFlowImpl: "0x29a8e4A2640D07C9C1b055119a7b3923Bbb6C7ad",
  goalRevnetSplitHookImpl: "0x77F0FDBb48350b16809a9A5ee10AE1Ee70a289Ec",
  budgetTcrImpl: "0x5C54201DaD0eFBc66398395562B3d49d27B92361",
  erc20VotesArbitratorImpl: "0x96B5535c2F6a6dD5464Ec82Cb974c4a727033cBC",
  budgetTcrDeployerImpl: "0x4D1bA668a55a842C593aBcbaeE795ce5A245B71d",
  budgetTreasuryImpl: "0x6F57C337A2B4B5f1eF39A8aE8c197AfE3e9CebBd",
  roundSubmissionTcrImpl: "0xA84b1e9004667f436A08a3238D2692A2b313CF3C",
  roundPrizeVaultImpl: "0xcA85ecb180536598F0A8F64CB631FB6E9dD7251d",
  prizePoolSubmissionDepositStrategyImpl: "0xC6fDe3f1820fFbc1F5A427BcbBbc2636D4770d3a",
  roundFactoryImpl: "0x62c2dda0407C8369cd900a75A565Eb2F038eDf71",
  allocationMechanismTcrImpl: "0x40F2E2be9ddA7BAeA903A67A54D65102f5492876",
  budgetFlowRouterStrategyImpl: "0x4d5D1C0305ceeb54eFd718BF7AC5dF62A09e1633",
  linearSpendPolicyImpl: "0xB640EC57e35088e7D864c2E7727fBB85331615B1",
  cobuildSwapImpl: "0x21a580054e7a5e833f38033f2d958e00e4c50f0f",
} as const;

export const baseDefaults = {
  defaultSubmissionDepositStrategy: "0x2a3dbF811EdE9173B17D7131620287F97d73c935",
  defaultOpenBudgetGatePolicy: "0x899f2fFF3c00FE44A97abA858136344C653a1907",
  defaultGoalSpendPolicy: "0xfA6bd66309F2890971558E3C01b77071e94Dbcd9",
  defaultBudgetSpendPolicy: "0xDBFbC5e092b15d6F1d1A2d2Eea7654a8050E0d2a",
  defaultAllocationMechanismAdmin: "0x289715fFBB2f4b482e2917D2f183FeAb564ec84F",
  defaultInvalidRoundRewardsSink: "0x000000000000000000000000000000000000dEaD",
} as const;

export const COBUILD_PROJECT_ID = 138 as const;
export const COBUILD_PROJECT_ID_BIGINT = 138n as const;
export const BASE_SCAFFOLD_START_BLOCK = 43_290_000 as const;

export const baseConfig = {
  cobuildProjectId: COBUILD_PROJECT_ID,
  cobuildRevnetId: COBUILD_PROJECT_ID,
  scaffoldStartBlock: BASE_SCAFFOLD_START_BLOCK,
  fakeUmaTreasurySuccessResolver: "0x492f39cBB8B5A444A684DEfB502C8C41a8Ee5F49",
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
  ManagedBudgetControllerImpl: baseImplementations.managedBudgetControllerImpl,
  ManagedGoalAllocatorStrategyImpl: baseImplementations.managedGoalAllocatorStrategyImpl,
  ManagedBudgetChildStrategyImpl: baseImplementations.managedBudgetChildStrategyImpl,
  ManagedBudgetChildStrategyFactoryImpl: baseImplementations.managedBudgetChildStrategyFactoryImpl,
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
