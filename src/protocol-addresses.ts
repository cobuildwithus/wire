import { BASE_CHAIN_ID } from "./chains.js";

/**
 * Canonical Base V1 core deployment addresses sourced from:
 * - v1-core/deploys/DeployGoalFactoryImplementations.8453.txt
 */
export const baseEntrypoints = {
  goalFactory: "0xdbEc67be21fd619aC1feaC8148e1bb41410C8917",
  budgetTcrFactory: "0x3509CedDbD49707e95decBd966E75315ebdB2ad2",
  cobuildToken: "0x62F05b13239B24B8eEFF36696344dE0Db7D2efDD",
  revDeployer: "0x2cA27BDe7e7D33E353b44c27aCfCf6c78ddE251d",
  superfluidHost: "0x4C073B3baB6d8826b8C5b229f3cfdC1eC6E47E74",
} as const;

export const baseImplementations = {
  goalTreasuryImpl: "0xc5705CD19420654627e6744A1ab7EFb8cF9F1107",
  goalStakeVaultImpl: "0x5CD41486d1833DE0D95D5Ba7eAa230FeFbB71200",
  budgetStakeLedgerImpl: "0x59144fF97b7D654d3B255fB924D270f91Fd53c17",
  goalFlowAllocationLedgerPipelineImpl: "0x3b107793151f8f0eD2824e137A771CA2Da62bF6E",
  premiumEscrowImpl: "0x08C2a8963eACE7107F9A5f0D04367e1FCAd61ab2",
  jurorSlasherRouterImpl: "0xe39dA7512D7a50d0441612A21f6fe5FCd539CA33",
  underwriterSlasherRouterImpl: "0xCd6D2A612033703809754C5e13f665B7fE7Db1Fc",
  customFlowImpl: "0x96962f44b31e96F6C956EcA05Eb569a269e869F3",
  goalRevnetSplitHookImpl: "0x452De9B784FE3E79a95ce2Ce2F01FF1ec2b314af",
  budgetTcrImpl: "0x3509CedDbD49707e95decBd966E75315ebdB2ad2",
  erc20VotesArbitratorImpl: "0x28300Fc7BE6b9dbCA8f0fFE112F031410f1320F0",
  budgetTcrDeployerImpl: "0x214B01428F58096F0C3801DC574Cc26ad7598aAF",
  budgetTreasuryImpl: "0x3EA8BabEfAF3c351F92771a4f74DAa2879AA94CF",
  roundSubmissionTcrImpl: "0xdbEc67be21fd619aC1feaC8148e1bb41410C8917",
  roundPrizeVaultImpl: "0xc08505Ad2F1B660F8b797F1eb8e1cD91967793DB",
  prizePoolSubmissionDepositStrategyImpl: "0x77Ca19c3D4412DB8A6674cC63Bfc265401F0fEB7",
  roundFactoryImpl: "0xbDBbDb138bc78861e05334c7369b37ce73154Dc2",
  allocationMechanismTcrImpl: "0x6B3743A5CFd7fCb45ACd36845B59cc0c62548dC6",
  budgetFlowRouterStrategyImpl: "0xA7DbccAB48F86c2bEB74371A9556639cDC021EeF",
} as const;

export const baseDefaults = {
  defaultSubmissionDepositStrategy: "0xd195a6E18B8e8c74127179ac869b4ad0cBb55375",
  defaultAllocationMechanismAdmin: "0x289715fFBB2f4b482e2917D2f183FeAb564ec84F",
  defaultInvalidRoundRewardsSink: "0x000000000000000000000000000000000000dEaD",
} as const;

export const baseConfig = {
  cobuildRevnetId: 138,
  fakeUmaTreasurySuccessResolver: "0x207E0CfFCAc3d340f9ec5A077E04bA8f3f75Cd95",
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
