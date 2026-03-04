import { BASE_CHAIN_ID } from "./chains.js";

/**
 * Canonical Base V1 core deployment addresses sourced from:
 * - v1-core/deploys/DeployGoalFactory.8453.txt
 * - v1-core/deploys/DeployGoalFactoryImplementations.8453.txt
 */
export const baseEntrypoints = {
  goalFactory: "0x5E06B4AC7DC15e86791AE0fb580d538492659Dec",
  budgetTcrFactory: "0x4db0895547AE87a6B0f72F0F4D6D362F917d24bc",
  cobuildToken: "0x62F05b13239B24B8eEFF36696344dE0Db7D2efDD",
  cobuildSwap: "0x5d09ddd53feffc52f5139a59246ced560d8c45df",
  revDeployer: "0x2cA27BDe7e7D33E353b44c27aCfCf6c78ddE251d",
  superfluidHost: "0x4C073B3baB6d8826b8C5b229f3cfdC1eC6E47E74",
} as const;

export const baseImplementations = {
  goalTreasuryImpl: "0x24DE03d744E6ee30420E9c2fe2DFe8711b524090",
  goalStakeVaultImpl: "0x64A61c57A1b10ac4bF68A5776Be6F17d2c89AB44",
  budgetStakeLedgerImpl: "0x46aFa73DcD27e08a68c639BCD885469B19f64AbB",
  goalFlowAllocationLedgerPipelineImpl: "0x61BfB8F7d4529Ba7AD97339399e8bcc7677a948D",
  premiumEscrowImpl: "0x4514B464aE4f525309B790D320ad08D757C0729f",
  jurorSlasherRouterImpl: "0x92fff79bD77773eeC923122233A59984E4fD6d74",
  underwriterSlasherRouterImpl: "0x8e4aAE8832a7670E3Da55e72aE7710BF886ccc1a",
  customFlowImpl: "0xC9Fe3F402E4E9Bf37f138D6fc2FF2F34EC9599cf",
  goalRevnetSplitHookImpl: "0xB159346eC8695CeaC5639beBbf389d04a740396B",
  budgetTcrImpl: "0xB7dE8c3D18DdaB6f39C30493b7F41138E1e5cbA0",
  erc20VotesArbitratorImpl: "0x626997BFF31dC6b4574E958Ead547418CD140584",
  budgetTcrDeployerImpl: "0x020C9c4e99bf5A82A050834bC89A6C8881462974",
  budgetTreasuryImpl: "0xa2d24065e93cefBC3D51eCeBDbE650Fa1bCd40F9",
  roundSubmissionTcrImpl: "0x211e5e7D5506dC81562E3845DBd2c35A6Bd76956",
  roundPrizeVaultImpl: "0x2cd53311a8E4d5e10428e8693b859Cb2C0d51b37",
  prizePoolSubmissionDepositStrategyImpl: "0x5197D5DF8277b3A37b805F80f9cC005A1A6fcDD2",
  roundFactoryImpl: "0x6a2CB48d9Cab0029CB9B2447a6aAA0D22aD62623",
  allocationMechanismTcrImpl: "0xcD6F85362A3eE220Cd6Bce74e0C077B4820f357f",
  budgetFlowRouterStrategyImpl: "0x361B8A96fA380eA94A1E3c585027F76207c6DA3e",
  cobuildSwapImpl: "0x21a580054e7a5e833f38033f2d958e00e4c50f0f",
} as const;

export const baseDefaults = {
  defaultSubmissionDepositStrategy: "0x4a34D99E54D2284Ed9cBca40a55232748482A7e3",
  defaultAllocationMechanismAdmin: "0x289715fFBB2f4b482e2917D2f183FeAb564ec84F",
  defaultInvalidRoundRewardsSink: "0x000000000000000000000000000000000000dEaD",
} as const;

export const baseConfig = {
  cobuildRevnetId: 138,
  fakeUmaTreasurySuccessResolver: "0xA78b6CB40a4B423173b8ded494dd8B2b4f413A76",
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
export const cobuild_token = baseEntrypoints.cobuildToken;
export const cobuild_revnet_id = baseConfig.cobuildRevnetId;
export const cobuild_swap = baseEntrypoints.cobuildSwap;
export const cobuild_swap_impl = baseImplementations.cobuildSwapImpl;
export const COBUILD_TOKEN = baseEntrypoints.cobuildToken;
export const COBUILD_REVNET_ID = baseConfig.cobuildRevnetId;
export const COBUILD_SWAP = baseEntrypoints.cobuildSwap;
export const COBUILD_SWAP_IMPL = baseImplementations.cobuildSwapImpl;
