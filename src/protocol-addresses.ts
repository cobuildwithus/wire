import { BASE_CHAIN_ID } from "./chains.js";

/**
 * Canonical Base V1 core deployment addresses sourced from:
 * - v1-core/deploys/DeployGoalFactory.8453.txt
 * - v1-core/deploys/LATEST_IMPLEMENTATIONS.8453.txt
 * - v1-core/deploys/LATEST_IMPLEMENTATIONS.8453.toml
 */
export const baseEntrypoints = {
  goalFactory: "0xe769c0b48D65f04ec9A5a5E0e7a602D76bB4d0f7",
  budgetTcrFactory: "0x9c8683E7ac02443fC1E49dC9EA5011A39eCca8d8",
  cobuildToken: "0x62F05b13239B24B8eEFF36696344dE0Db7D2efDD",
  cobuildSwap: "0x5d09ddd53feffc52f5139a59246ced560d8c45df",
  cobuildTerminal: "0xc482b88B632437f1C13c31ba6B9e4fB48a2F8AC8",
  buybackHookDataHook: "0xB6133A222315f8E9d25E7C77BAC5DdEB3451D088",
  buybackHook: "0xB6133A222315f8E9d25E7C77BAC5DdEB3451D088",
  revDeployer: "0x2cA27BDe7e7D33E353b44c27aCfCf6c78ddE251d",
  superfluidHost: "0x4C073B3baB6d8826b8C5b229f3cfdC1eC6E47E74",
} as const;

export const baseImplementations = {
  goalTreasuryImpl: "0x01623a49df74c52cCEBA891bde99626ACF2E7B94",
  goalStakeVaultImpl: "0x286a8b93a9da5347De360917348DDA5A130e776c",
  budgetStakeLedgerImpl: "0x8bbdDA193899C12301489D10B942eC66A708Fa0B",
  goalFlowAllocationLedgerPipelineImpl: "0x184F51545E82dfc19BdA926B8510e47eB97eB9DD",
  premiumEscrowImpl: "0x18BE5c7E76E846b90029d4f83CaC71935865C67e",
  jurorSlasherRouterImpl: "0xf4A0fcB780bB4129bB82827b2A09bE277FCc1f93",
  underwriterSlasherRouterImpl: "0xA55b0E11c964A404ad99928C26F38983aA55dfD0",
  customFlowImpl: "0xb894795753B76A90328598B485F69adDf6cd97DF",
  goalRevnetSplitHookImpl: "0xF6718483787DdB8A38362b5F7c850a627711d6f9",
  budgetTcrImpl: "0xc918e69135Aa2Ffb3F51fdA114Fe0044df45eA14",
  erc20VotesArbitratorImpl: "0x1B2BEcA84289bdfcad42b9CB8BcC44D8Eb0CFccd",
  budgetTcrDeployerImpl: "0xBa619BCFe094A3d82BF780E6e12112066A3Ee4F7",
  budgetTreasuryImpl: "0x2d683DC1Ca415ba102F18d88A619106C49a75901",
  roundSubmissionTcrImpl: "0x189229A94bBc08507D38D7fe8c34012fA30C93A8",
  roundPrizeVaultImpl: "0x93c382Da52Ce0a63068B8eC4c4C10d1AbC83b5a8",
  prizePoolSubmissionDepositStrategyImpl: "0xf131DAb8F8340daBC7D274B70dAba8CC0768da9A",
  roundFactoryImpl: "0x32E0Ba3E3a18f535A9B063B48a180C9BcBd82196",
  allocationMechanismTcrImpl: "0x44038ed3A978C0772C4d4Bfe1574a0C8434DD850",
  budgetFlowRouterStrategyImpl: "0x03c9313F994fb1D3d77E696775e40ef0E8f2Cc89",
  cobuildSwapImpl: "0x21a580054e7a5e833f38033f2d958e00e4c50f0f",
} as const;

export const baseDefaults = {
  defaultSubmissionDepositStrategy: "0x76aDBFF44a608db84755D0f3c42Ce2480BC2496c",
  defaultAllocationMechanismAdmin: "0x289715fFBB2f4b482e2917D2f183FeAb564ec84F",
  defaultInvalidRoundRewardsSink: "0x000000000000000000000000000000000000dEaD",
} as const;

export const baseConfig = {
  cobuildRevnetId: 138,
  fakeUmaTreasurySuccessResolver: "0x2c654D2fD4a1f2Ab76CB6C82e8D8D748C5A65a79",
  fakeUmaOwner: "0x289715fFBB2f4b482e2917D2f183FeAb564ec84F",
  fakeUmaEscalationManager: "0x289715fFBB2f4b482e2917D2f183FeAb564ec84F",
  fakeUmaDomainId: "0x0000000000000000000000000000000000000000000000000000000000000000",
} as const;

export const baseAddresses = {
  chainId: BASE_CHAIN_ID,
  entrypoints: baseEntrypoints,
  implementations: baseImplementations,
  defaults: baseDefaults,
  config: baseConfig,
} as const;

export const goalFactoryAddress = baseEntrypoints.goalFactory;
export const budgetTcrFactoryAddress = baseEntrypoints.budgetTcrFactory;
export const cobuildTokenAddress = baseEntrypoints.cobuildToken;
export const cobuildSwapAddress = baseEntrypoints.cobuildSwap;
export const cobuildTerminalAddress = baseEntrypoints.cobuildTerminal;
export const buybackHookDataHookAddress = baseEntrypoints.buybackHookDataHook;
export const buybackHookAddress = baseEntrypoints.buybackHook;
export const COBUILD_TOKEN = baseEntrypoints.cobuildToken;
export const COBUILD_REVNET_ID = baseConfig.cobuildRevnetId;
export const COBUILD_SWAP = baseEntrypoints.cobuildSwap;
export const COBUILD_TERMINAL = baseEntrypoints.cobuildTerminal;
export const BUYBACK_HOOK_DATA_HOOK = baseEntrypoints.buybackHookDataHook;
export const BUYBACK_HOOK = baseEntrypoints.buybackHook;
export const COBUILD_SWAP_IMPL = baseImplementations.cobuildSwapImpl;
