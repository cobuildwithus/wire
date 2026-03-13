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
  goalFactory: "0x8Aa7d640C7997b45adB53AB1D703681e8FB449A4",
  budgetTcrFactory: "0xFf9d8986328841De5e9593f72A18982263291593",
  goalFactoryPairDeployer: "0xD366d0534ADF7597d59d5f0538D4161049A8f8Fa",
  goalDeploymentRegistry: "0x5702a03784925Fb0E0dcc2a817B709cF42A3cd4C",
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
  goalTreasuryImpl: "0x40d294D92F158783092D7fE85D9b23d13cE148cb",
  goalStakeVaultImpl: "0x3404C30fb873a286899f6Baf78742A78153Ef9F8",
  budgetStakeLedgerImpl: "0x51B6808Ba6d9855e8247C8F4BB93D71cD3b10d39",
  goalFlowAllocationLedgerPipelineImpl: "0x6b182c20351806678760aCeECd56872e02a8160B",
  premiumEscrowImpl: "0xCb1F67a079Ea7676266BeD23Ad1F07a697e51435",
  jurorSlasherRouterImpl: "0xB9b6aC31841c0394c03512482fB4ae3De4259018",
  underwriterSlasherRouterImpl: "0x21BC9e0C8a996Cdf463b919D75214a3F00b52357",
  managedBudgetControllerImpl: "0xDC00b4b3f7fAbf27F737Cd3B53Ed7241420EE510",
  managedGoalAllocatorStrategyImpl: "0x7Af9f93691C70615dc824098D94B836ec9e5a5e3",
  managedBudgetChildStrategyImpl: "0x688d62033FC84be90CdeB92f6D1F158B4C0e9c58",
  managedBudgetChildStrategyFactoryImpl: "0x4F72D656e864C0ED5826F11eCA3eC8F39Ec793A0",
  customFlowImpl: "0x59E9cD3f0ee1Ffb5C6e39EA104878184f5A853D9",
  goalRevnetSplitHookImpl: "0xde6b307BAde08ca436E45D0c1407C5E0518f7FC6",
  budgetTcrImpl: "0x0fc6A845c8Cc3be6DDF7a3Edb4f5d820B590000F",
  erc20VotesArbitratorImpl: "0x8B29c07b3bb02BFd3be69b4602F86101bC2ec082",
  budgetTcrDeployerImpl: "0xD9671A34E5dD840337aa933A555CD7B0FC94Cc6c",
  budgetTreasuryImpl: "0xE63Cb1Ed7a750e541bEBaE710077ab47641627f4",
  roundSubmissionTcrImpl: "0xE42dE53c420e62fdB787201Cb629c4E066c67179",
  roundPrizeVaultImpl: "0xef2BBE0885B4E37083fC396d3c15569a08b2c677",
  prizePoolSubmissionDepositStrategyImpl: "0x4B4E776E9687db8BbE1ed82925AD1A26d9A6E898",
  roundFactoryImpl: "0xccd9c1060eF9c3E14aA57E5144eCb0C8329DB5cb",
  allocationMechanismTcrImpl: "0xeD65dd552901D4997d233c9645e5495345c05C64",
  budgetFlowRouterStrategyImpl: "0x655ED37e9e668327b9866150D102886Eb88a08D0",
  linearSpendPolicyImpl: "0x18cfd054E0Ba3a94080F8c60E903Fa76E4940d6f",
  cobuildSwapImpl: "0x21a580054e7a5e833f38033f2d958e00e4c50f0f",
} as const;

export const baseDefaults = {
  defaultSubmissionDepositStrategy: "0x6C4d9a68347399ff98518C06D58110Ac1A277b2A",
  defaultOpenBudgetGatePolicy: "0x32f24905da8c1D4f4B1983192e50D26763588090",
  defaultGoalSpendPolicy: "0xB5d6E942d2dE2622A9ea7Ef67E68C0E11b2a273e",
  defaultBudgetSpendPolicy: "0x0d637406708Ea66A3bD1cf5691d8Eb6d8E779506",
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
  fakeUmaTreasurySuccessResolver: "0x93685e9101360172669CD305C46248D773a47474",
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
