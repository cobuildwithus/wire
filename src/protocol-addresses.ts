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
  cobuildToken: "0x62f05B1aD94c5d7B9f989A294d2A0f36a1AE10Fb",
  cobuildSwap: "0x5d09ddd53feffc52f5139a59246ced560d8c45df",
  cobuildTerminal: "0xA0BF03DE899D98411cC38Eb140Be8Ee225F62D40",
  buybackHookDataHook: "0xB6133A222315f8E9d25E7C77BAC5DdEB3451D088",
  buybackHook: "0xB6133A222315f8E9d25E7C77BAC5DdEB3451D088",
  revDeployer: "0x2cA27BDe7e7D33E353b44c27aCfCf6c78ddE251d",
  superfluidHost: "0x4C073B3baB6d8826b8C5b229f3cfdC1eC6E47E74",
} as const;

export const baseImplementations = {
  goalTreasuryImpl: "0xfCF83D34251547Cb4B03D506312426127571a0B2",
  goalStakeVaultImpl: "0x72FB7a8100F8148844BCB8A7c554FF61FdB698d0",
  budgetStakeLedgerImpl: "0x1DC3072Af15271C6ff4148c6571793f2a487A851",
  goalFlowAllocationLedgerPipelineImpl: "0x924D35c90240828Af03F38f4B09471AD86fCA8cc",
  premiumEscrowImpl: "0x696514118FcC325727FA279E91239f7897d1EfD1",
  jurorSlasherRouterImpl: "0x21Ac1d626c29D19713455040ed151e2237D1E877",
  underwriterSlasherRouterImpl: "0xA9Add2bB486F60689422e9FA48cD6AcF45151e3b",
  customFlowImpl: "0x928001db4164b2FFea3C77EB748a80fd311903D8",
  goalRevnetSplitHookImpl: "0xf4438eAc03926A62b8f73eCBa9e1156C2C782515",
  budgetTcrImpl: "0x02B75a3cb923960C974bE18F42f02D73ff2A3D75",
  erc20VotesArbitratorImpl: "0x5178788D73006Fb861608Afb9D12b8efC7542164",
  budgetTcrDeployerImpl: "0xd3036fE573955973b2f4074855D13d5F4Fa30d55",
  budgetTreasuryImpl: "0xEAF47c17307d05196bdF9C6bb0F4f89D5bf5E1B5",
  roundSubmissionTcrImpl: "0x4263D59CBb39E498Ae84Da9DBbDFF0429E81eeC7",
  roundPrizeVaultImpl: "0xbD1a0718fE5f7C10D1B71D35471A78347c34dF77",
  prizePoolSubmissionDepositStrategyImpl: "0xd19eabe5112dFE54ce075DC9003C0529B1c3Fa7E",
  roundFactoryImpl: "0xE5d9ea2626f94C90c650c7F0b6A2e87Dcd80D198",
  allocationMechanismTcrImpl: "0x1bdd436e26361776B06220CB9FD033ffa8C776dF",
  budgetFlowRouterStrategyImpl: "0xc041A4ABAeF45732de5889B97Aa86B37C8E2a4b2",
  cobuildSwapImpl: "0x21a580054e7a5e833f38033f2d958e00e4c50f0f",
} as const;

export const baseDefaults = {
  defaultSubmissionDepositStrategy: "0xe225237e5b093b2cf536571775D2068B549587B2",
  defaultAllocationMechanismAdmin: "0x289715fFBB2f4b482e2917D2f183FeAb564ec84F",
  defaultInvalidRoundRewardsSink: "0x000000000000000000000000000000000000dEaD",
} as const;

export const baseConfig = {
  cobuildRevnetId: 138,
  fakeUmaTreasurySuccessResolver: "0x40CA84dB7375Dc0939582108921eeB051031Ef0C",
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
