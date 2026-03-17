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
  goalFactory: "0xA8a7d64D4bb1Fe9B73F69336a607979CB24B771E",
  budgetTcrFactory: "0x39E473250eD0cb7b8BF41faeea9f7BdDb97A1d57",
  goalFactoryPairDeployer: "0xee3Df653da8bD16ac15B715Aa7297BCa53cA7bCf",
  goalDeploymentRegistry: "0x5309E5D691d1D02b4776EAd1c4bac2152e9DC225",
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
  goalTreasuryImpl: "0xfDb643E1DEBb68943A1686e714cc6B772270c9bB",
  goalStakeVaultImpl: "0xAa555d4d4C72898107187Baba440Fd33F7468cd3",
  budgetStakeLedgerImpl: "0x15978d3809504abd24e069E667C83510eFDf2Fbf",
  goalFlowAllocationLedgerPipelineImpl: "0xb29224F5ec01d2b09475bE51Ee3a073e6247803d",
  premiumEscrowImpl: "0xBC308f7ecDb871B7EB56ceA6E3854528CFf5ecD3",
  jurorSlasherRouterImpl: "0xc585e777b0873eD243FFede09397140936ED527a",
  underwriterSlasherRouterImpl: "0xd9F3fB8D6655C38714A7daD69D4F753c12128997",
  managedBudgetControllerImpl: "0x3831FBB19BF7F35995b4d6DcD6CC99d022a9B491",
  managedGoalAllocatorStrategyImpl: "0x937B558C1a83f20f774e3C37084696B948c77C89",
  managedBudgetChildStrategyImpl: "0xf5c244149D04870F4535E2Ca88b1c003626AF20a",
  managedBudgetChildStrategyFactoryImpl: "0x998b366660469a1565C132189f9e6C072e5BAd8e",
  customFlowImpl: "0x13c3CD2Ed04E0c23Ec931e120Cee3b7805693595",
  goalRevnetSplitHookImpl: "0xcfb4506D686790015D1Ba9B8a11c99A3fE343edF",
  budgetTcrImpl: "0xAB228d64D06d7eC75f7a6Da0eaDd64A8c6cC7b97",
  erc20VotesArbitratorImpl: "0x942F9C35C0a2ED6821651bd25dcaAD970654877A",
  budgetTcrDeployerImpl: "0x530546830982cA50538c1C550b515b6a36Fa4915",
  budgetTreasuryImpl: "0x84A2b7b83cBfF9094DBD7e5FF31760e9C7edF546",
  roundSubmissionTcrImpl: "0xDEcFf9aA8281b80a7945AfB8c00c403a27173a6B",
  roundPrizeVaultImpl: "0xf9F4A844366cA440670cd4f72bdc0B4e846DB696",
  prizePoolSubmissionDepositStrategyImpl: "0xb17dE106Cf4BC01cE0152171414EA5e193cEdf16",
  roundFactoryImpl: "0xafFC41059955608b05830029caf45bB3A2029654",
  allocationMechanismTcrImpl: "0xef6bfa0A86923C35970D3F271EDA2A08Ccd6C1E3",
  budgetFlowRouterStrategyImpl: "0x1b237cc9f3752cBDA5ffAE55c8Ba617a9abf1C34",
  linearSpendPolicyImpl: "0xEA2aacbB3Ba9331c952439777c45D7DAe50DF47a",
  cobuildSwapImpl: "0x21a580054e7a5e833f38033f2d958e00e4c50f0f",
} as const;

export const baseDefaults = {
  defaultSubmissionDepositStrategy: "0x51f8038804F42E654759D39E6207884dB7259ae4",
  defaultOpenBudgetGatePolicy: "0x1789a58F923EfCb3266552CD4C7479976d54eDfF",
  defaultGoalSpendPolicy: "0xe8A9362ad891beEcfF0fF0df58FF44420726daD0",
  defaultBudgetSpendPolicy: "0xCD7290e0ae4CEcEB3ED03F24233f636FDda0eA88",
  defaultAllocationMechanismAdmin: "0x289715fFBB2f4b482e2917D2f183FeAb564ec84F",
  defaultInvalidRoundRewardsSink: "0x000000000000000000000000000000000000dEaD",
} as const;

export const COBUILD_PROJECT_ID = 138 as const;
export const COBUILD_PROJECT_ID_BIGINT = 138n as const;
export const BASE_SCAFFOLD_START_BLOCK = 43_315_703 as const;

export const baseConfig = {
  cobuildProjectId: COBUILD_PROJECT_ID,
  cobuildRevnetId: COBUILD_PROJECT_ID,
  scaffoldStartBlock: BASE_SCAFFOLD_START_BLOCK,
  fakeUmaTreasurySuccessResolver: "0x7A370FCB7bF250053b660601a3f50362C47310E9",
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
