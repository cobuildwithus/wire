import { BASE_CHAIN_ID } from "./chains.js";

/**
 * Canonical Base V1 core deployment addresses sourced from:
 * - v1-core/deploys/DeployGoalFactory.8453.txt
 * - v1-core/deploys/LATEST_IMPLEMENTATIONS.8453.txt
 * - v1-core/deploys/LATEST_IMPLEMENTATIONS.8453.toml
 */
export const baseEntrypoints = {
  goalFactory: "0x5E06B4AC7DC15e86791AE0fb580d538492659Dec",
  budgetTcrFactory: "0x4db0895547AE87a6B0f72F0F4D6D362F917d24bc",
  cobuildToken: "0x62F05b13239B24B8eEFF36696344dE0Db7D2efDD",
  cobuildSwap: "0x5d09ddd53feffc52f5139a59246ced560d8c45df",
  cobuildTerminal: "0xf70c200Ab4F06d781aAC8333582E63CdBedAe0DE",
  buybackHookDataHook: "0xB6133A222315f8E9d25E7C77BAC5DdEB3451D088",
  buybackHook: "0xB6133A222315f8E9d25E7C77BAC5DdEB3451D088",
  revDeployer: "0x2cA27BDe7e7D33E353b44c27aCfCf6c78ddE251d",
  superfluidHost: "0x4C073B3baB6d8826b8C5b229f3cfdC1eC6E47E74",
} as const;

export const baseImplementations = {
  goalTreasuryImpl: "0xE1ed6200916CFc1e7bC618bE03D1F3fbdBfC81cC",
  goalStakeVaultImpl: "0xfA5BE663080a2E24E8674bc21A2C943D0B232B1E",
  budgetStakeLedgerImpl: "0xbDFB8d1834f19CD1df9C35A3ACfD8687f9bBa95d",
  goalFlowAllocationLedgerPipelineImpl: "0x487684Dcbf108e296a0c3f9fd056198CE03a4F06",
  premiumEscrowImpl: "0x7BBBdDa86fea5751301D47a927125C57497F51aB",
  jurorSlasherRouterImpl: "0x5e3c0aAf4727fBcD452a5602f324FDf5b17c14d3",
  underwriterSlasherRouterImpl: "0x4005bcb3Ed7AF70E8ffC07E8921b2FB02297C032",
  customFlowImpl: "0x07d05092aaEb0517Eb14322930cb7e8856685A91",
  goalRevnetSplitHookImpl: "0xE2999ccB0d6710D56BD2ac58407B74BCB93DA27A",
  budgetTcrImpl: "0x2B3d185F96e3415888F2FC2DCF179e7cc3bE20D9",
  erc20VotesArbitratorImpl: "0x0a4453f9Df93ef01FE421bFd9F081641078144dD",
  budgetTcrDeployerImpl: "0x94fd12D12bE057381257A96e0a7CBDf459D6ec04",
  budgetTreasuryImpl: "0x3A07081E17FBBe69Aae26e5Cc90E8DAb0D31B61e",
  roundSubmissionTcrImpl: "0x2A80f0d0aD32EA0B67fC5407A7b0f9728eEe423C",
  roundPrizeVaultImpl: "0x88b88D4543F6BfdD6A210ba00021D239236faC4F",
  prizePoolSubmissionDepositStrategyImpl: "0xb3Ffd47aa9Fab87e1f38c480986150e461295F2a",
  roundFactoryImpl: "0x7E2e28E1b9dE1E8ae3F622F478E36bB81AB1f227",
  allocationMechanismTcrImpl: "0xA28E4E2fac3bd4E39956bf065e5A2D4966dD372c",
  budgetFlowRouterStrategyImpl: "0x0140891a99526F098719c25B440A5e5923129779",
  cobuildSwapImpl: "0x21a580054e7a5e833f38033f2d958e00e4c50f0f",
} as const;

export const baseDefaults = {
  defaultSubmissionDepositStrategy: "0xFBA46f3f8807F4D9Be2DFe618cF800c9646082D4",
  defaultAllocationMechanismAdmin: "0x289715fFBB2f4b482e2917D2f183FeAb564ec84F",
  defaultInvalidRoundRewardsSink: "0x000000000000000000000000000000000000dEaD",
} as const;

export const baseConfig = {
  cobuildRevnetId: 138,
  fakeUmaTreasurySuccessResolver: "0x379Da11bFD61A44c767b5b5FaC54c26B4f9aBD38",
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
