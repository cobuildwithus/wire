//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// AllocationMechanismTCR
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * [__View Contract on Base Basescan__](https://basescan.org/address/0x98DC19691bECEB21a8DAEc81055E05EDDCDD027e)
 */
export const allocationMechanismTcrAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: 'mechanismFundingEscrowImplementation_',
        internalType: 'address',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'MAX_ACTIVE_MECHANISM_RECIPIENTS',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'RULING_OPTIONS',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'itemID', internalType: 'bytes32', type: 'bytes32' }],
    name: 'activateMechanism',
    outputs: [
      {
        name: 'deployed',
        internalType: 'struct IAllocationMechanismFactory.DeployedMechanism',
        type: 'tuple',
        components: [
          { name: 'mechanism', internalType: 'address', type: 'address' },
          { name: 'payoutRecipient', internalType: 'address', type: 'address' },
          { name: 'arbitrator', internalType: 'address', type: 'address' },
          { name: 'auxiliary', internalType: 'address', type: 'address' },
        ],
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    name: 'activationQueued',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'activeMechanismRecipientCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_item', internalType: 'bytes', type: 'bytes' }],
    name: 'addItem',
    outputs: [{ name: 'itemID', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'arbitrator',
    outputs: [
      { name: '', internalType: 'contract IArbitrator', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'arbitratorDisputeIDToItem',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'arbitratorExtraData',
    outputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'budgetFlow',
    outputs: [
      { name: '', internalType: 'contract IManagedFlow', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'budgetTreasury',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'challengePeriodDuration',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_itemID', internalType: 'bytes32', type: 'bytes32' },
      { name: '_evidence', internalType: 'string', type: 'string' },
    ],
    name: 'challengeRequest',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'clearingMetaEvidence',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'itemData', internalType: 'bytes', type: 'bytes' }],
    name: 'decodeMechanismListing',
    outputs: [
      {
        name: 'listing',
        internalType: 'struct AllocationMechanismTCR.MechanismListing',
        type: 'tuple',
        components: [
          {
            name: 'metadata',
            internalType: 'struct FlowTypes.RecipientMetadata',
            type: 'tuple',
            components: [
              { name: 'title', internalType: 'string', type: 'string' },
              { name: 'description', internalType: 'string', type: 'string' },
              { name: 'image', internalType: 'string', type: 'string' },
              { name: 'tagline', internalType: 'string', type: 'string' },
              { name: 'url', internalType: 'string', type: 'string' },
            ],
          },
          { name: 'duration', internalType: 'uint64', type: 'uint64' },
          { name: 'fundingDeadline', internalType: 'uint64', type: 'uint64' },
          {
            name: 'minBudgetFunding',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'maxBudgetFunding',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'deploymentConfig',
            internalType:
              'struct AllocationMechanismTCR.MechanismDeploymentConfig',
            type: 'tuple',
            components: [
              {
                name: 'mechanismFactory',
                internalType: 'address',
                type: 'address',
              },
              { name: 'mechanismConfig', internalType: 'bytes', type: 'bytes' },
            ],
          },
        ],
      },
    ],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [],
    name: 'disputeTimeout',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'erc20',
    outputs: [{ name: '', internalType: 'contract IERC20', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_itemID', internalType: 'bytes32', type: 'bytes32' }],
    name: 'executeRequest',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_itemID', internalType: 'bytes32', type: 'bytes32' }],
    name: 'executeRequestTimeout',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'factoryManager',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'itemID', internalType: 'bytes32', type: 'bytes32' }],
    name: 'finalizeRemovedMechanism',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_itemID', internalType: 'bytes32', type: 'bytes32' },
      { name: '_request', internalType: 'uint256', type: 'uint256' },
      { name: '_round', internalType: 'uint256', type: 'uint256' },
      { name: '_contributor', internalType: 'address', type: 'address' },
    ],
    name: 'getContributions',
    outputs: [
      { name: 'contributions', internalType: 'uint256[3]', type: 'uint256[3]' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_itemID', internalType: 'bytes32', type: 'bytes32' }],
    name: 'getItemInfo',
    outputs: [
      { name: 'data', internalType: 'bytes', type: 'bytes' },
      {
        name: 'status',
        internalType: 'enum IGeneralizedTCR.Status',
        type: 'uint8',
      },
      { name: 'numberOfRequests', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_itemID', internalType: 'bytes32', type: 'bytes32' }],
    name: 'getLatestRequestIndex',
    outputs: [
      { name: 'exists', internalType: 'bool', type: 'bool' },
      { name: 'requestIndex', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_itemID', internalType: 'bytes32', type: 'bytes32' },
      { name: '_request', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getRequestInfo',
    outputs: [
      { name: 'disputed', internalType: 'bool', type: 'bool' },
      { name: 'disputeID', internalType: 'uint256', type: 'uint256' },
      { name: 'submissionTime', internalType: 'uint256', type: 'uint256' },
      { name: 'resolved', internalType: 'bool', type: 'bool' },
      { name: 'parties', internalType: 'address[3]', type: 'address[3]' },
      { name: 'numberOfRounds', internalType: 'uint256', type: 'uint256' },
      { name: 'ruling', internalType: 'enum IArbitrable.Party', type: 'uint8' },
      {
        name: 'arbitrator',
        internalType: 'contract IArbitrator',
        type: 'address',
      },
      { name: 'arbitratorExtraData', internalType: 'bytes', type: 'bytes' },
      { name: 'metaEvidenceID', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_itemID', internalType: 'bytes32', type: 'bytes32' },
      { name: '_request', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getRequestSnapshot',
    outputs: [
      {
        name: 'requestType',
        internalType: 'enum IGeneralizedTCR.Status',
        type: 'uint8',
      },
      {
        name: 'challengePeriodDuration_',
        internalType: 'uint256',
        type: 'uint256',
      },
      { name: 'disputeTimeout_', internalType: 'uint256', type: 'uint256' },
      { name: 'arbitrationCost_', internalType: 'uint256', type: 'uint256' },
      {
        name: 'challengeBaseDeposit_',
        internalType: 'uint256',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_itemID', internalType: 'bytes32', type: 'bytes32' },
      { name: '_request', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getRequestState',
    outputs: [
      {
        name: 'phase',
        internalType: 'enum IGeneralizedTCR.RequestPhase',
        type: 'uint8',
      },
      { name: 'challengeDeadline', internalType: 'uint256', type: 'uint256' },
      { name: 'timeoutAt', internalType: 'uint256', type: 'uint256' },
      {
        name: 'arbitratorStatus',
        internalType: 'enum IArbitrator.DisputeStatus',
        type: 'uint8',
      },
      { name: 'canChallenge', internalType: 'bool', type: 'bool' },
      { name: 'canExecuteRequest', internalType: 'bool', type: 'bool' },
      { name: 'canExecuteTimeout', internalType: 'bool', type: 'bool' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_itemID', internalType: 'bytes32', type: 'bytes32' },
      { name: '_request', internalType: 'uint256', type: 'uint256' },
      { name: '_round', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getRoundInfo',
    outputs: [
      { name: 'amountPaid', internalType: 'uint256[3]', type: 'uint256[3]' },
      { name: 'hasPaid', internalType: 'bool[3]', type: 'bool[3]' },
      { name: 'feeRewards', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getTotalCosts',
    outputs: [
      { name: 'addItemCost', internalType: 'uint256', type: 'uint256' },
      { name: 'removeItemCost', internalType: 'uint256', type: 'uint256' },
      {
        name: 'challengeSubmissionCost',
        internalType: 'uint256',
        type: 'uint256',
      },
      {
        name: 'challengeRemovalCost',
        internalType: 'uint256',
        type: 'uint256',
      },
      { name: 'arbitrationCost', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'budgetTreasury_', internalType: 'address', type: 'address' },
      {
        name: 'initialMechanismFactory_',
        internalType: 'address',
        type: 'address',
      },
      {
        name: 'initConfig',
        internalType: 'struct AllocationMechanismTCR.InitConfig',
        type: 'tuple',
        components: [
          {
            name: 'tcrConfig',
            internalType: 'struct IGeneralizedTCRConfig.RegistryConfig',
            type: 'tuple',
            components: [
              {
                name: 'arbitrator',
                internalType: 'contract IArbitrator',
                type: 'address',
              },
              {
                name: 'votingToken',
                internalType: 'contract IVotes',
                type: 'address',
              },
              {
                name: 'submissionDepositStrategy',
                internalType: 'contract ISubmissionDepositStrategy',
                type: 'address',
              },
              {
                name: 'registryPolicy',
                internalType: 'struct IGeneralizedTCRConfig.RegistryPolicy',
                type: 'tuple',
                components: [
                  {
                    name: 'arbitratorExtraData',
                    internalType: 'bytes',
                    type: 'bytes',
                  },
                  {
                    name: 'registrationMetaEvidence',
                    internalType: 'string',
                    type: 'string',
                  },
                  {
                    name: 'clearingMetaEvidence',
                    internalType: 'string',
                    type: 'string',
                  },
                  {
                    name: 'submissionBaseDeposit',
                    internalType: 'uint256',
                    type: 'uint256',
                  },
                  {
                    name: 'removalBaseDeposit',
                    internalType: 'uint256',
                    type: 'uint256',
                  },
                  {
                    name: 'submissionChallengeBaseDeposit',
                    internalType: 'uint256',
                    type: 'uint256',
                  },
                  {
                    name: 'removalChallengeBaseDeposit',
                    internalType: 'uint256',
                    type: 'uint256',
                  },
                  {
                    name: 'challengePeriodDuration',
                    internalType: 'uint256',
                    type: 'uint256',
                  },
                ],
              },
            ],
          },
          { name: 'factoryManager', internalType: 'address', type: 'address' },
        ],
      },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'itemCount',
    outputs: [{ name: 'count', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    name: 'itemIDtoIndex',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'itemList',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    name: 'items',
    outputs: [
      { name: 'data', internalType: 'bytes', type: 'bytes' },
      { name: 'manager', internalType: 'address', type: 'address' },
      {
        name: 'status',
        internalType: 'enum IGeneralizedTCR.Status',
        type: 'uint8',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'itemID', internalType: 'bytes32', type: 'bytes32' }],
    name: 'mechanismDeployment',
    outputs: [
      {
        name: 'dep',
        internalType: 'struct AllocationMechanismTCR.MechanismDeployment',
        type: 'tuple',
        components: [
          { name: 'mechanism', internalType: 'address', type: 'address' },
          { name: 'payoutRecipient', internalType: 'address', type: 'address' },
          { name: 'arbitrator', internalType: 'address', type: 'address' },
          { name: 'auxiliary', internalType: 'address', type: 'address' },
          { name: 'fundingEscrow', internalType: 'address', type: 'address' },
          { name: 'activatedAt', internalType: 'uint64', type: 'uint64' },
          {
            name: 'maxEffectiveFundingObserved',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'active', internalType: 'bool', type: 'bool' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'mechanismFactoryAllowed',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'mechanismFundingEscrowImplementation',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'registrationMetaEvidence',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'itemID', internalType: 'bytes32', type: 'bytes32' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'releaseMechanismFunds',
    outputs: [{ name: 'released', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'removalBaseDeposit',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'removalChallengeBaseDeposit',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    name: 'removalQueued',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_itemID', internalType: 'bytes32', type: 'bytes32' },
      { name: '_evidence', internalType: 'string', type: 'string' },
    ],
    name: 'removeItem',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_disputeID', internalType: 'uint256', type: 'uint256' },
      { name: '_ruling', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'rule',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'factory', internalType: 'address', type: 'address' },
      { name: 'allowed', internalType: 'bool', type: 'bool' },
    ],
    name: 'setMechanismFactoryAllowed',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'submissionBaseDeposit',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'submissionChallengeBaseDeposit',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'submissionDepositStrategy',
    outputs: [
      {
        name: '',
        internalType: 'contract ISubmissionDepositStrategy',
        type: 'address',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    name: 'submissionDeposits',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_itemID', internalType: 'bytes32', type: 'bytes32' },
      { name: '_evidence', internalType: 'string', type: 'string' },
    ],
    name: 'submitEvidence',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'itemID', internalType: 'bytes32', type: 'bytes32' }],
    name: 'syncMechanismFunding',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_beneficiary', internalType: 'address', type: 'address' },
      { name: '_itemID', internalType: 'bytes32', type: 'bytes32' },
      { name: '_request', internalType: 'uint256', type: 'uint256' },
      { name: '_round', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'withdrawFeesAndRewards',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: '_arbitrator',
        internalType: 'contract IArbitrator',
        type: 'address',
        indexed: true,
      },
      {
        name: '_disputeID',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: '_metaEvidenceID',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: '_evidenceGroupID',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: '_itemID',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: false,
      },
    ],
    name: 'Dispute',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: '_arbitrator',
        internalType: 'contract IArbitrator',
        type: 'address',
        indexed: true,
      },
      {
        name: '_evidenceGroupID',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: '_party',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: '_evidence',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
    ],
    name: 'Evidence',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'version',
        internalType: 'uint64',
        type: 'uint64',
        indexed: false,
      },
    ],
    name: 'Initialized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: '_itemID',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: '_requestIndex',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: '_roundIndex',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      { name: '_disputed', internalType: 'bool', type: 'bool', indexed: false },
      { name: '_resolved', internalType: 'bool', type: 'bool', indexed: false },
      {
        name: '_itemStatus',
        internalType: 'enum IGeneralizedTCR.Status',
        type: 'uint8',
        indexed: false,
      },
    ],
    name: 'ItemStatusChange',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: '_itemID',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: '_submitter',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: '_evidenceGroupID',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      { name: '_data', internalType: 'bytes', type: 'bytes', indexed: false },
    ],
    name: 'ItemSubmitted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'itemID',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'mechanism',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'fundingEscrow',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'payoutRecipient',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'arbitrator',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'auxiliary',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'MechanismActivated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'itemID',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
    ],
    name: 'MechanismActivationQueued',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'factory',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'allowed', internalType: 'bool', type: 'bool', indexed: false },
    ],
    name: 'MechanismFactoryAllowedSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'itemID',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'MechanismFundingRefunded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'itemID',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'MechanismFundingReleased',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'itemID',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'reason',
        internalType: 'enum AllocationMechanismTCR.FundingStopReason',
        type: 'uint8',
        indexed: true,
      },
      {
        name: 'totalReceived',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'MechanismFundingStopped',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'itemID',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
    ],
    name: 'MechanismRemovalQueued',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'itemID',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
    ],
    name: 'MechanismRemoved',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: '_metaEvidenceID',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: '_evidence',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
    ],
    name: 'MetaEvidence',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: '_itemID',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: '_requestIndex',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: '_evidenceGroupID',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
    ],
    name: 'RequestEvidenceGroupID',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: '_itemID',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: '_requestIndex',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: '_requestType',
        internalType: 'enum IGeneralizedTCR.Status',
        type: 'uint8',
        indexed: true,
      },
    ],
    name: 'RequestSubmitted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: '_arbitrator',
        internalType: 'contract IArbitrator',
        type: 'address',
        indexed: true,
      },
      {
        name: '_disputeID',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: '_ruling',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Ruling',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'itemID',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'payer',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'SubmissionDepositPaid',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'itemID',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'recipient',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'requestType',
        internalType: 'enum IGeneralizedTCR.Status',
        type: 'uint8',
        indexed: false,
      },
      {
        name: 'ruling',
        internalType: 'enum IArbitrable.Party',
        type: 'uint8',
        indexed: false,
      },
    ],
    name: 'SubmissionDepositTransferred',
  },
  {
    type: 'error',
    inputs: [
      { name: 'maxRecipients', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ACTIVE_MECHANISM_RECIPIENT_CAP_REACHED',
  },
  {
    type: 'error',
    inputs: [],
    name: 'ACTIVE_MECHANISM_RECIPIENT_COUNT_UNDERFLOW',
  },
  { type: 'error', inputs: [], name: 'ADDRESS_ZERO' },
  { type: 'error', inputs: [], name: 'ALREADY_DEPLOYED' },
  { type: 'error', inputs: [], name: 'ARBITRATOR_ARBITRABLE_MISMATCH' },
  { type: 'error', inputs: [], name: 'ARBITRATOR_TOKEN_MISMATCH' },
  {
    type: 'error',
    inputs: [
      { name: 'token', internalType: 'address', type: 'address' },
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'beforeBalance', internalType: 'uint256', type: 'uint256' },
      { name: 'afterBalance', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'BALANCE_DECREASED_UNEXPECTEDLY',
  },
  { type: 'error', inputs: [], name: 'BUDGET_FLOW_MISMATCH' },
  { type: 'error', inputs: [], name: 'CHALLENGE_MUST_BE_WITHIN_TIME_LIMIT' },
  { type: 'error', inputs: [], name: 'CHALLENGE_PERIOD_MUST_PASS' },
  { type: 'error', inputs: [], name: 'DISPUTE_MUST_NOT_BE_RESOLVED' },
  { type: 'error', inputs: [], name: 'DISPUTE_NOT_SOLVED' },
  { type: 'error', inputs: [], name: 'DISPUTE_TIMEOUT_DISABLED' },
  { type: 'error', inputs: [], name: 'DISPUTE_TIMEOUT_NOT_PASSED' },
  {
    type: 'error',
    inputs: [{ name: 'factory', internalType: 'address', type: 'address' }],
    name: 'FACTORY_NOT_ALLOWED',
  },
  { type: 'error', inputs: [], name: 'FailedDeployment' },
  {
    type: 'error',
    inputs: [
      { name: 'implementation', internalType: 'address', type: 'address' },
    ],
    name: 'IMPLEMENTATION_HAS_NO_CODE',
  },
  { type: 'error', inputs: [], name: 'INVALID_DISPUTE_ID' },
  {
    type: 'error',
    inputs: [{ name: 'factory', internalType: 'address', type: 'address' }],
    name: 'INVALID_FACTORY',
  },
  {
    type: 'error',
    inputs: [
      { name: 'fundingDeadline', internalType: 'uint64', type: 'uint64' },
      { name: 'minBudgetFunding', internalType: 'uint256', type: 'uint256' },
      { name: 'maxBudgetFunding', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'INVALID_FUNDING_POLICY',
  },
  { type: 'error', inputs: [], name: 'INVALID_ITEM_DATA' },
  { type: 'error', inputs: [], name: 'INVALID_MECHANISM_CONFIG' },
  { type: 'error', inputs: [], name: 'INVALID_RULING_OPTION' },
  { type: 'error', inputs: [], name: 'INVALID_SUBMISSION_DEPOSIT_ACTION' },
  { type: 'error', inputs: [], name: 'INVALID_SUBMISSION_DEPOSIT_RECIPIENT' },
  { type: 'error', inputs: [], name: 'INVALID_SUBMISSION_DEPOSIT_STRATEGY' },
  { type: 'error', inputs: [], name: 'INVALID_VOTING_TOKEN_COMPATIBILITY' },
  {
    type: 'error',
    inputs: [{ name: 'decimals', internalType: 'uint8', type: 'uint8' }],
    name: 'INVALID_VOTING_TOKEN_DECIMALS',
  },
  { type: 'error', inputs: [], name: 'ITEM_MUST_HAVE_PENDING_REQUEST' },
  {
    type: 'error',
    inputs: [
      { name: 'balance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'InsufficientBalance',
  },
  { type: 'error', inputs: [], name: 'InvalidInitialization' },
  {
    type: 'error',
    inputs: [
      { name: 'minRequired', internalType: 'uint256', type: 'uint256' },
      { name: 'totalReceived', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'MECHANISM_BELOW_MIN_FUNDING',
  },
  {
    type: 'error',
    inputs: [
      { name: 'fundingDeadline', internalType: 'uint64', type: 'uint64' },
      { name: 'minRequired', internalType: 'uint256', type: 'uint256' },
      { name: 'totalReceived', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'MECHANISM_EXPIRED_UNDERFUNDED',
  },
  { type: 'error', inputs: [], name: 'MUST_BE_ABSENT_TO_BE_ADDED' },
  { type: 'error', inputs: [], name: 'MUST_BE_A_REQUEST' },
  { type: 'error', inputs: [], name: 'MUST_BE_REGISTERED_TO_BE_REMOVED' },
  { type: 'error', inputs: [], name: 'MUST_FULLY_FUND_YOUR_SIDE' },
  { type: 'error', inputs: [], name: 'NOT_DEPLOYED' },
  { type: 'error', inputs: [], name: 'NOT_QUEUED' },
  { type: 'error', inputs: [], name: 'NOT_REGISTERED' },
  {
    type: 'error',
    inputs: [{ name: 'itemID', internalType: 'bytes32', type: 'bytes32' }],
    name: 'NO_REQUESTS_FOR_ITEM',
  },
  { type: 'error', inputs: [], name: 'NotInitializing' },
  { type: 'error', inputs: [], name: 'ONLY_ARBITRATOR_CAN_RULE' },
  { type: 'error', inputs: [], name: 'ONLY_FACTORY_MANAGER' },
  { type: 'error', inputs: [], name: 'REMOVAL_FINALIZATION_PENDING' },
  { type: 'error', inputs: [], name: 'REQUEST_ALREADY_DISPUTED' },
  { type: 'error', inputs: [], name: 'REQUEST_MUST_BE_DISPUTED' },
  { type: 'error', inputs: [], name: 'REQUEST_MUST_BE_RESOLVED' },
  { type: 'error', inputs: [], name: 'REQUEST_MUST_NOT_BE_DISPUTED' },
  { type: 'error', inputs: [], name: 'REQUEST_MUST_NOT_BE_RESOLVED' },
  { type: 'error', inputs: [], name: 'ReentrancyGuardReentrantCall' },
  { type: 'error', inputs: [], name: 'SUBMISSION_DEPOSIT_ALREADY_SET' },
  { type: 'error', inputs: [], name: 'SUBMISSION_DEPOSIT_TRANSFER_INCOMPLETE' },
  {
    type: 'error',
    inputs: [{ name: 'token', internalType: 'address', type: 'address' }],
    name: 'SafeERC20FailedOperation',
  },
] as const

/**
 * [__View Contract on Base Basescan__](https://basescan.org/address/0x98DC19691bECEB21a8DAEc81055E05EDDCDD027e)
 */
export const allocationMechanismTcrAddress = {
  8453: '0x98DC19691bECEB21a8DAEc81055E05EDDCDD027e',
} as const

/**
 * [__View Contract on Base Basescan__](https://basescan.org/address/0x98DC19691bECEB21a8DAEc81055E05EDDCDD027e)
 */
export const allocationMechanismTcrConfig = {
  address: allocationMechanismTcrAddress,
  abi: allocationMechanismTcrAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// BudgetFlowRouterStrategy
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * [__View Contract on Base Basescan__](https://basescan.org/address/0xeb20eA7a1f82c0fA568c4227F399b6555F360279)
 */
export const budgetFlowRouterStrategyAbi = [
  { type: 'constructor', inputs: [], stateMutability: 'nonpayable' },
  {
    type: 'function',
    inputs: [],
    name: 'STRATEGY_KEY',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'accountAllocationWeight',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'flow', internalType: 'address', type: 'address' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'accountAllocationWeightForFlow',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'key', internalType: 'uint256', type: 'uint256' }],
    name: 'accountForAllocationKey',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'caller', internalType: 'address', type: 'address' },
      { name: '', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'allocationKey',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [],
    name: 'budgetStakeLedger',
    outputs: [
      {
        name: '',
        internalType: 'contract IBudgetStakeLedger',
        type: 'address',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'canAccountAllocate',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'flow', internalType: 'address', type: 'address' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'canAccountAllocateForFlow',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'key', internalType: 'uint256', type: 'uint256' },
      { name: 'caller', internalType: 'address', type: 'address' },
    ],
    name: 'canAllocate',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'flow', internalType: 'address', type: 'address' },
      { name: 'key', internalType: 'uint256', type: 'uint256' },
      { name: 'caller', internalType: 'address', type: 'address' },
    ],
    name: 'canAllocateForFlow',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'key', internalType: 'uint256', type: 'uint256' }],
    name: 'currentWeight',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'flow', internalType: 'address', type: 'address' },
      { name: 'key', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'currentWeightForFlow',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'budgetStakeLedger_', internalType: 'address', type: 'address' },
      { name: 'registrar_', internalType: 'address', type: 'address' },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'flow', internalType: 'address', type: 'address' }],
    name: 'recipientIdForFlow',
    outputs: [
      { name: 'recipientId', internalType: 'bytes32', type: 'bytes32' },
      { name: 'registered', internalType: 'bool', type: 'bool' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'flow', internalType: 'address', type: 'address' },
      { name: 'recipientId', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'registerFlowRecipient',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'registrar',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'strategyKey',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'pure',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'flow', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'recipientId',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
    ],
    name: 'FlowRecipientRegistered',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'version',
        internalType: 'uint64',
        type: 'uint64',
        indexed: false,
      },
    ],
    name: 'Initialized',
  },
  { type: 'error', inputs: [], name: 'ADDRESS_ZERO' },
  {
    type: 'error',
    inputs: [{ name: 'flow', internalType: 'address', type: 'address' }],
    name: 'FLOW_ALREADY_REGISTERED',
  },
  {
    type: 'error',
    inputs: [{ name: 'key', internalType: 'uint256', type: 'uint256' }],
    name: 'INVALID_ALLOCATION_KEY',
  },
  {
    type: 'error',
    inputs: [{ name: 'flow', internalType: 'address', type: 'address' }],
    name: 'INVALID_FLOW',
  },
  {
    type: 'error',
    inputs: [
      { name: 'flow', internalType: 'address', type: 'address' },
      { name: 'expectedStrategy', internalType: 'address', type: 'address' },
      { name: 'configuredStrategy', internalType: 'address', type: 'address' },
    ],
    name: 'INVALID_FLOW_STRATEGY',
  },
  {
    type: 'error',
    inputs: [
      { name: 'flow', internalType: 'address', type: 'address' },
      { name: 'strategyCount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'INVALID_FLOW_STRATEGY_COUNT',
  },
  { type: 'error', inputs: [], name: 'InvalidInitialization' },
  { type: 'error', inputs: [], name: 'NotInitializing' },
  {
    type: 'error',
    inputs: [
      { name: 'caller', internalType: 'address', type: 'address' },
      { name: 'registrar', internalType: 'address', type: 'address' },
    ],
    name: 'ONLY_REGISTRAR',
  },
  {
    type: 'error',
    inputs: [
      { name: 'bits', internalType: 'uint8', type: 'uint8' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'SafeCastOverflowedUintDowncast',
  },
] as const

/**
 * [__View Contract on Base Basescan__](https://basescan.org/address/0xeb20eA7a1f82c0fA568c4227F399b6555F360279)
 */
export const budgetFlowRouterStrategyAddress = {
  8453: '0xeb20eA7a1f82c0fA568c4227F399b6555F360279',
} as const

/**
 * [__View Contract on Base Basescan__](https://basescan.org/address/0xeb20eA7a1f82c0fA568c4227F399b6555F360279)
 */
export const budgetFlowRouterStrategyConfig = {
  address: budgetFlowRouterStrategyAddress,
  abi: budgetFlowRouterStrategyAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// BudgetStakeLedger
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * [__View Contract on Base Basescan__](https://basescan.org/address/0x2CDd4d48362d039cDA6Cf67d62C7cF96C2fb3871)
 */
export const budgetStakeLedgerAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: 'goalTreasury_', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'allTrackedBudgetsResolved',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'budget', internalType: 'address', type: 'address' }],
    name: 'budgetCheckpoint',
    outputs: [
      {
        name: 'checkpoint',
        internalType: 'struct IBudgetStakeLedger.BudgetCheckpointView',
        type: 'tuple',
        components: [
          {
            name: 'totalAllocatedStake',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'lastCheckpoint', internalType: 'uint64', type: 'uint64' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'recipientId', internalType: 'bytes32', type: 'bytes32' }],
    name: 'budgetForRecipient',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'budget', internalType: 'address', type: 'address' }],
    name: 'budgetInfo',
    outputs: [
      {
        name: 'info',
        internalType: 'struct IBudgetStakeLedger.BudgetInfoView',
        type: 'tuple',
        components: [
          { name: 'isTracked', internalType: 'bool', type: 'bool' },
          { name: 'removedAt', internalType: 'uint64', type: 'uint64' },
          { name: 'activatedAt', internalType: 'uint64', type: 'uint64' },
          {
            name: 'resolvedOrRemovedAt',
            internalType: 'uint64',
            type: 'uint64',
          },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'budget', internalType: 'address', type: 'address' }],
    name: 'budgetTotalAllocatedStake',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'prevWeight', internalType: 'uint256', type: 'uint256' },
      {
        name: 'prevRecipientIds',
        internalType: 'bytes32[]',
        type: 'bytes32[]',
      },
      { name: 'prevAllocationPpm', internalType: 'uint32[]', type: 'uint32[]' },
      { name: 'newWeight', internalType: 'uint256', type: 'uint256' },
      { name: 'newRecipientIds', internalType: 'bytes32[]', type: 'bytes32[]' },
      { name: 'newAllocationPpm', internalType: 'uint32[]', type: 'uint32[]' },
    ],
    name: 'checkpointAllocation',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'budget', internalType: 'address', type: 'address' },
      { name: 'blockNumber', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getPastUserAllocatedStakeOnBudget',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'blockNumber', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getPastUserAllocationWeight',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'goalTreasury',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'goalTreasury_', internalType: 'address', type: 'address' },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'recipientId', internalType: 'bytes32', type: 'bytes32' },
      { name: 'budget', internalType: 'address', type: 'address' },
    ],
    name: 'registerBudget',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'index', internalType: 'uint256', type: 'uint256' }],
    name: 'registeredBudgetAt',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'registeredBudgetCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'recipientId', internalType: 'bytes32', type: 'bytes32' }],
    name: 'removeBudget',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'index', internalType: 'uint256', type: 'uint256' }],
    name: 'trackedBudgetAt',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'trackedBudgetCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'start', internalType: 'uint256', type: 'uint256' },
      { name: 'count', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'trackedBudgetSlice',
    outputs: [
      {
        name: 'summaries',
        internalType: 'struct IBudgetStakeLedger.TrackedBudgetSummary[]',
        type: 'tuple[]',
        components: [
          { name: 'budget', internalType: 'address', type: 'address' },
          {
            name: 'resolvedOrRemovedAt',
            internalType: 'uint64',
            type: 'uint64',
          },
          {
            name: 'totalAllocatedStake',
            internalType: 'uint256',
            type: 'uint256',
          },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'budget', internalType: 'address', type: 'address' },
    ],
    name: 'userAllocatedStakeOnBudget',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'budget', internalType: 'address', type: 'address' },
    ],
    name: 'userBudgetCheckpoint',
    outputs: [
      {
        name: 'checkpoint',
        internalType: 'struct IBudgetStakeLedger.UserBudgetCheckpointView',
        type: 'tuple',
        components: [
          { name: 'allocatedStake', internalType: 'uint256', type: 'uint256' },
          { name: 'lastCheckpoint', internalType: 'uint64', type: 'uint64' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'budget',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'allocatedStake',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'checkpointTime',
        internalType: 'uint64',
        type: 'uint64',
        indexed: false,
      },
    ],
    name: 'AllocationCheckpointed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'recipientId',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'budget',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'BudgetRegistered',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'recipientId',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'budget',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'BudgetRemoved',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'version',
        internalType: 'uint64',
        type: 'uint64',
        indexed: false,
      },
    ],
    name: 'Initialized',
  },
  { type: 'error', inputs: [], name: 'ADDRESS_ZERO' },
  {
    type: 'error',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'budget', internalType: 'address', type: 'address' },
      { name: 'storedAllocated', internalType: 'uint256', type: 'uint256' },
      { name: 'expectedAllocated', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ALLOCATION_DRIFT',
  },
  { type: 'error', inputs: [], name: 'BLOCK_NOT_YET_MINED' },
  { type: 'error', inputs: [], name: 'BUDGET_ALREADY_REGISTERED' },
  { type: 'error', inputs: [], name: 'CheckpointUnorderedInsertion' },
  { type: 'error', inputs: [], name: 'GOAL_TERMINAL' },
  {
    type: 'error',
    inputs: [{ name: 'budget', internalType: 'address', type: 'address' }],
    name: 'INVALID_BUDGET_ACTIVATED_AT',
  },
  {
    type: 'error',
    inputs: [{ name: 'budget', internalType: 'address', type: 'address' }],
    name: 'INVALID_BUDGET_EXECUTION_DURATION',
  },
  {
    type: 'error',
    inputs: [
      { name: 'budget', internalType: 'address', type: 'address' },
      { name: 'budgetFlow', internalType: 'address', type: 'address' },
    ],
    name: 'INVALID_BUDGET_FLOW',
  },
  {
    type: 'error',
    inputs: [{ name: 'budget', internalType: 'address', type: 'address' }],
    name: 'INVALID_BUDGET_FLOW_READ',
  },
  {
    type: 'error',
    inputs: [{ name: 'budget', internalType: 'address', type: 'address' }],
    name: 'INVALID_BUDGET_FUNDING_DEADLINE',
  },
  {
    type: 'error',
    inputs: [{ name: 'budget', internalType: 'address', type: 'address' }],
    name: 'INVALID_BUDGET_NOT_CONTRACT',
  },
  {
    type: 'error',
    inputs: [
      { name: 'budgetFlow', internalType: 'address', type: 'address' },
      { name: 'expectedParent', internalType: 'address', type: 'address' },
      { name: 'actualParent', internalType: 'address', type: 'address' },
    ],
    name: 'INVALID_BUDGET_PARENT_MISMATCH',
  },
  {
    type: 'error',
    inputs: [{ name: 'budgetFlow', internalType: 'address', type: 'address' }],
    name: 'INVALID_BUDGET_PARENT_READ',
  },
  {
    type: 'error',
    inputs: [{ name: 'budget', internalType: 'address', type: 'address' }],
    name: 'INVALID_BUDGET_RESOLVED_AT',
  },
  {
    type: 'error',
    inputs: [{ name: 'budget', internalType: 'address', type: 'address' }],
    name: 'INVALID_BUDGET_STATE',
  },
  {
    type: 'error',
    inputs: [{ name: 'budget', internalType: 'address', type: 'address' }],
    name: 'INVALID_BUDGET_TOPOLOGY',
  },
  { type: 'error', inputs: [], name: 'INVALID_CHECKPOINT_DATA' },
  {
    type: 'error',
    inputs: [{ name: 'goalFlow', internalType: 'address', type: 'address' }],
    name: 'INVALID_GOAL_FLOW',
  },
  { type: 'error', inputs: [], name: 'InvalidInitialization' },
  { type: 'error', inputs: [], name: 'NotInitializing' },
  { type: 'error', inputs: [], name: 'ONLY_BUDGET_REGISTRY_MANAGER' },
  { type: 'error', inputs: [], name: 'ONLY_GOAL_FLOW_OR_PIPELINE' },
  {
    type: 'error',
    inputs: [
      { name: 'bits', internalType: 'uint8', type: 'uint8' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'SafeCastOverflowedUintDowncast',
  },
  {
    type: 'error',
    inputs: [
      { name: 'budget', internalType: 'address', type: 'address' },
      { name: 'totalAllocated', internalType: 'uint256', type: 'uint256' },
      { name: 'attemptedDecrease', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'TOTAL_ALLOCATED_UNDERFLOW',
  },
] as const

/**
 * [__View Contract on Base Basescan__](https://basescan.org/address/0x2CDd4d48362d039cDA6Cf67d62C7cF96C2fb3871)
 */
export const budgetStakeLedgerAddress = {
  8453: '0x2CDd4d48362d039cDA6Cf67d62C7cF96C2fb3871',
} as const

/**
 * [__View Contract on Base Basescan__](https://basescan.org/address/0x2CDd4d48362d039cDA6Cf67d62C7cF96C2fb3871)
 */
export const budgetStakeLedgerConfig = {
  address: budgetStakeLedgerAddress,
  abi: budgetStakeLedgerAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// BudgetTCR
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * [__View Contract on Base Basescan__](https://basescan.org/address/0x8d427390e7A210eaC7d40903d90Ad2170517D332)
 */
export const budgetTcrAbi = [
  { type: 'constructor', inputs: [], stateMutability: 'nonpayable' },
  {
    type: 'function',
    inputs: [],
    name: 'RULING_OPTIONS',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'itemID', internalType: 'bytes32', type: 'bytes32' }],
    name: 'activateRegisteredBudget',
    outputs: [{ name: 'activated', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_item', internalType: 'bytes', type: 'bytes' }],
    name: 'addItem',
    outputs: [{ name: 'itemID', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'allocationMechanismAdmin',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'arbitrator',
    outputs: [
      { name: '', internalType: 'contract IArbitrator', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'arbitratorDisputeIDToItem',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'arbitratorExtraData',
    outputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'budgetPremiumPpm',
    outputs: [{ name: '', internalType: 'uint32', type: 'uint32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'budgetSlashPpm',
    outputs: [{ name: '', internalType: 'uint32', type: 'uint32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'itemID', internalType: 'bytes32', type: 'bytes32' }],
    name: 'budgetStackTopology',
    outputs: [
      {
        name: 'topology',
        internalType: 'struct IBudgetStackTopologyReader.BudgetStackTopology',
        type: 'tuple',
        components: [
          { name: 'childFlow', internalType: 'address', type: 'address' },
          { name: 'budgetTreasury', internalType: 'address', type: 'address' },
          { name: 'premiumEscrow', internalType: 'address', type: 'address' },
          { name: 'strategy', internalType: 'address', type: 'address' },
          {
            name: 'allocationMechanism',
            internalType: 'address',
            type: 'address',
          },
          {
            name: 'allocationMechanismArbitrator',
            internalType: 'address',
            type: 'address',
          },
        ],
      },
      { name: 'active', internalType: 'bool', type: 'bool' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'budgetTreasury', internalType: 'address', type: 'address' },
    ],
    name: 'budgetStackTopologyForBudgetTreasury',
    outputs: [
      {
        name: 'topology',
        internalType: 'struct IBudgetStackTopologyReader.BudgetStackTopology',
        type: 'tuple',
        components: [
          { name: 'childFlow', internalType: 'address', type: 'address' },
          { name: 'budgetTreasury', internalType: 'address', type: 'address' },
          { name: 'premiumEscrow', internalType: 'address', type: 'address' },
          { name: 'strategy', internalType: 'address', type: 'address' },
          {
            name: 'allocationMechanism',
            internalType: 'address',
            type: 'address',
          },
          {
            name: 'allocationMechanismArbitrator',
            internalType: 'address',
            type: 'address',
          },
        ],
      },
      { name: 'active', internalType: 'bool', type: 'bool' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'childFlow', internalType: 'address', type: 'address' }],
    name: 'budgetStackTopologyForChildFlow',
    outputs: [
      {
        name: 'topology',
        internalType: 'struct IBudgetStackTopologyReader.BudgetStackTopology',
        type: 'tuple',
        components: [
          { name: 'childFlow', internalType: 'address', type: 'address' },
          { name: 'budgetTreasury', internalType: 'address', type: 'address' },
          { name: 'premiumEscrow', internalType: 'address', type: 'address' },
          { name: 'strategy', internalType: 'address', type: 'address' },
          {
            name: 'allocationMechanism',
            internalType: 'address',
            type: 'address',
          },
          {
            name: 'allocationMechanismArbitrator',
            internalType: 'address',
            type: 'address',
          },
        ],
      },
      { name: 'active', internalType: 'bool', type: 'bool' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'budgetSuccessResolver',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'budgetValidationBounds',
    outputs: [
      { name: 'minFundingLeadTime', internalType: 'uint64', type: 'uint64' },
      { name: 'maxFundingHorizon', internalType: 'uint64', type: 'uint64' },
      { name: 'minExecutionDuration', internalType: 'uint64', type: 'uint64' },
      { name: 'maxExecutionDuration', internalType: 'uint64', type: 'uint64' },
      {
        name: 'minActivationThreshold',
        internalType: 'uint256',
        type: 'uint256',
      },
      {
        name: 'maxActivationThreshold',
        internalType: 'uint256',
        type: 'uint256',
      },
      { name: 'maxRunwayCap', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'challengePeriodDuration',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_itemID', internalType: 'bytes32', type: 'bytes32' },
      { name: '_evidence', internalType: 'string', type: 'string' },
    ],
    name: 'challengeRequest',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'clearingMetaEvidence',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'cobuildToken',
    outputs: [{ name: '', internalType: 'contract IERC20', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'disputeTimeout',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'erc20',
    outputs: [{ name: '', internalType: 'contract IERC20', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_itemID', internalType: 'bytes32', type: 'bytes32' }],
    name: 'executeRequest',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_itemID', internalType: 'bytes32', type: 'bytes32' }],
    name: 'executeRequestTimeout',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'itemID', internalType: 'bytes32', type: 'bytes32' }],
    name: 'finalizeRemovedBudget',
    outputs: [
      { name: 'terminallyResolved', internalType: 'bool', type: 'bool' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_itemID', internalType: 'bytes32', type: 'bytes32' },
      { name: '_request', internalType: 'uint256', type: 'uint256' },
      { name: '_round', internalType: 'uint256', type: 'uint256' },
      { name: '_contributor', internalType: 'address', type: 'address' },
    ],
    name: 'getContributions',
    outputs: [
      { name: 'contributions', internalType: 'uint256[3]', type: 'uint256[3]' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_itemID', internalType: 'bytes32', type: 'bytes32' }],
    name: 'getItemInfo',
    outputs: [
      { name: 'data', internalType: 'bytes', type: 'bytes' },
      {
        name: 'status',
        internalType: 'enum IGeneralizedTCR.Status',
        type: 'uint8',
      },
      { name: 'numberOfRequests', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_itemID', internalType: 'bytes32', type: 'bytes32' }],
    name: 'getLatestRequestIndex',
    outputs: [
      { name: 'exists', internalType: 'bool', type: 'bool' },
      { name: 'requestIndex', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_itemID', internalType: 'bytes32', type: 'bytes32' },
      { name: '_request', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getRequestInfo',
    outputs: [
      { name: 'disputed', internalType: 'bool', type: 'bool' },
      { name: 'disputeID', internalType: 'uint256', type: 'uint256' },
      { name: 'submissionTime', internalType: 'uint256', type: 'uint256' },
      { name: 'resolved', internalType: 'bool', type: 'bool' },
      { name: 'parties', internalType: 'address[3]', type: 'address[3]' },
      { name: 'numberOfRounds', internalType: 'uint256', type: 'uint256' },
      { name: 'ruling', internalType: 'enum IArbitrable.Party', type: 'uint8' },
      {
        name: 'arbitrator',
        internalType: 'contract IArbitrator',
        type: 'address',
      },
      { name: 'arbitratorExtraData', internalType: 'bytes', type: 'bytes' },
      { name: 'metaEvidenceID', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_itemID', internalType: 'bytes32', type: 'bytes32' },
      { name: '_request', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getRequestSnapshot',
    outputs: [
      {
        name: 'requestType',
        internalType: 'enum IGeneralizedTCR.Status',
        type: 'uint8',
      },
      {
        name: 'challengePeriodDuration_',
        internalType: 'uint256',
        type: 'uint256',
      },
      { name: 'disputeTimeout_', internalType: 'uint256', type: 'uint256' },
      { name: 'arbitrationCost_', internalType: 'uint256', type: 'uint256' },
      {
        name: 'challengeBaseDeposit_',
        internalType: 'uint256',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_itemID', internalType: 'bytes32', type: 'bytes32' },
      { name: '_request', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getRequestState',
    outputs: [
      {
        name: 'phase',
        internalType: 'enum IGeneralizedTCR.RequestPhase',
        type: 'uint8',
      },
      { name: 'challengeDeadline', internalType: 'uint256', type: 'uint256' },
      { name: 'timeoutAt', internalType: 'uint256', type: 'uint256' },
      {
        name: 'arbitratorStatus',
        internalType: 'enum IArbitrator.DisputeStatus',
        type: 'uint8',
      },
      { name: 'canChallenge', internalType: 'bool', type: 'bool' },
      { name: 'canExecuteRequest', internalType: 'bool', type: 'bool' },
      { name: 'canExecuteTimeout', internalType: 'bool', type: 'bool' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_itemID', internalType: 'bytes32', type: 'bytes32' },
      { name: '_request', internalType: 'uint256', type: 'uint256' },
      { name: '_round', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getRoundInfo',
    outputs: [
      { name: 'amountPaid', internalType: 'uint256[3]', type: 'uint256[3]' },
      { name: 'hasPaid', internalType: 'bool[3]', type: 'bool[3]' },
      { name: 'feeRewards', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getTotalCosts',
    outputs: [
      { name: 'addItemCost', internalType: 'uint256', type: 'uint256' },
      { name: 'removeItemCost', internalType: 'uint256', type: 'uint256' },
      {
        name: 'challengeSubmissionCost',
        internalType: 'uint256',
        type: 'uint256',
      },
      {
        name: 'challengeRemovalCost',
        internalType: 'uint256',
        type: 'uint256',
      },
      { name: 'arbitrationCost', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'goalFlow',
    outputs: [{ name: '', internalType: 'contract IFlow', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'goalRevnetId',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'goalRulesets',
    outputs: [
      { name: '', internalType: 'contract IJBRulesets', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'goalToken',
    outputs: [{ name: '', internalType: 'contract IERC20', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'goalTreasury',
    outputs: [
      { name: '', internalType: 'contract IGoalTreasury', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'initConfig',
        internalType: 'struct IBudgetTCR.InitConfig',
        type: 'tuple',
        components: [
          {
            name: 'allocationMechanismAdmin',
            internalType: 'address',
            type: 'address',
          },
          {
            name: 'tcrConfig',
            internalType: 'struct IGeneralizedTCRConfig.RegistryConfig',
            type: 'tuple',
            components: [
              {
                name: 'arbitrator',
                internalType: 'contract IArbitrator',
                type: 'address',
              },
              {
                name: 'votingToken',
                internalType: 'contract IVotes',
                type: 'address',
              },
              {
                name: 'submissionDepositStrategy',
                internalType: 'contract ISubmissionDepositStrategy',
                type: 'address',
              },
              {
                name: 'registryPolicy',
                internalType: 'struct IGeneralizedTCRConfig.RegistryPolicy',
                type: 'tuple',
                components: [
                  {
                    name: 'arbitratorExtraData',
                    internalType: 'bytes',
                    type: 'bytes',
                  },
                  {
                    name: 'registrationMetaEvidence',
                    internalType: 'string',
                    type: 'string',
                  },
                  {
                    name: 'clearingMetaEvidence',
                    internalType: 'string',
                    type: 'string',
                  },
                  {
                    name: 'submissionBaseDeposit',
                    internalType: 'uint256',
                    type: 'uint256',
                  },
                  {
                    name: 'removalBaseDeposit',
                    internalType: 'uint256',
                    type: 'uint256',
                  },
                  {
                    name: 'submissionChallengeBaseDeposit',
                    internalType: 'uint256',
                    type: 'uint256',
                  },
                  {
                    name: 'removalChallengeBaseDeposit',
                    internalType: 'uint256',
                    type: 'uint256',
                  },
                  {
                    name: 'challengePeriodDuration',
                    internalType: 'uint256',
                    type: 'uint256',
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        name: 'deploymentConfig',
        internalType: 'struct IBudgetTCR.DeploymentConfig',
        type: 'tuple',
        components: [
          { name: 'stackDeployer', internalType: 'address', type: 'address' },
          {
            name: 'budgetSuccessResolver',
            internalType: 'address',
            type: 'address',
          },
          { name: 'goalFlow', internalType: 'contract IFlow', type: 'address' },
          {
            name: 'goalTreasury',
            internalType: 'contract IGoalTreasury',
            type: 'address',
          },
          {
            name: 'goalToken',
            internalType: 'contract IERC20',
            type: 'address',
          },
          {
            name: 'cobuildToken',
            internalType: 'contract IERC20',
            type: 'address',
          },
          {
            name: 'goalRulesets',
            internalType: 'contract IJBRulesets',
            type: 'address',
          },
          { name: 'goalRevnetId', internalType: 'uint256', type: 'uint256' },
          {
            name: 'paymentTokenDecimals',
            internalType: 'uint8',
            type: 'uint8',
          },
          {
            name: 'premiumEscrowImplementation',
            internalType: 'address',
            type: 'address',
          },
          {
            name: 'underwriterSlasherRouter',
            internalType: 'address',
            type: 'address',
          },
          { name: 'budgetPremiumPpm', internalType: 'uint32', type: 'uint32' },
          { name: 'budgetSlashPpm', internalType: 'uint32', type: 'uint32' },
          {
            name: 'budgetValidationBounds',
            internalType: 'struct IBudgetTCR.BudgetValidationBounds',
            type: 'tuple',
            components: [
              {
                name: 'minFundingLeadTime',
                internalType: 'uint64',
                type: 'uint64',
              },
              {
                name: 'maxFundingHorizon',
                internalType: 'uint64',
                type: 'uint64',
              },
              {
                name: 'minExecutionDuration',
                internalType: 'uint64',
                type: 'uint64',
              },
              {
                name: 'maxExecutionDuration',
                internalType: 'uint64',
                type: 'uint64',
              },
              {
                name: 'minActivationThreshold',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'maxActivationThreshold',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'maxRunwayCap',
                internalType: 'uint256',
                type: 'uint256',
              },
            ],
          },
          {
            name: 'oracleValidationBounds',
            internalType: 'struct IBudgetTCR.OracleValidationBounds',
            type: 'tuple',
            components: [
              { name: 'liveness', internalType: 'uint64', type: 'uint64' },
              { name: 'bondAmount', internalType: 'uint256', type: 'uint256' },
            ],
          },
        ],
      },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'itemId', internalType: 'bytes32', type: 'bytes32' }],
    name: 'isRegistrationPending',
    outputs: [{ name: 'pending', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'itemId', internalType: 'bytes32', type: 'bytes32' }],
    name: 'isRemovalPending',
    outputs: [{ name: 'pending', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'itemCount',
    outputs: [{ name: 'count', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    name: 'itemIDtoIndex',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'budgetTreasury', internalType: 'address', type: 'address' },
    ],
    name: 'itemIdForBudgetTreasury',
    outputs: [{ name: 'itemID', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'childFlow', internalType: 'address', type: 'address' }],
    name: 'itemIdForChildFlow',
    outputs: [{ name: 'itemID', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'itemList',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    name: 'items',
    outputs: [
      { name: 'data', internalType: 'bytes', type: 'bytes' },
      { name: 'manager', internalType: 'address', type: 'address' },
      {
        name: 'status',
        internalType: 'enum IGeneralizedTCR.Status',
        type: 'uint8',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'oracleValidationBounds',
    outputs: [
      { name: 'liveness', internalType: 'uint64', type: 'uint64' },
      { name: 'bondAmount', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'paymentTokenDecimals',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'premiumEscrowImplementation',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'budgetTreasury', internalType: 'address', type: 'address' },
    ],
    name: 'pruneTerminalBudget',
    outputs: [
      { name: 'removedFromParent', internalType: 'bool', type: 'bool' },
      { name: 'goalSynced', internalType: 'bool', type: 'bool' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'registrationMetaEvidence',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'removalBaseDeposit',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'removalChallengeBaseDeposit',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_itemID', internalType: 'bytes32', type: 'bytes32' },
      { name: '_evidence', internalType: 'string', type: 'string' },
    ],
    name: 'removeItem',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'itemID', internalType: 'bytes32', type: 'bytes32' }],
    name: 'retryRemovedBudgetResolution',
    outputs: [
      { name: 'terminallyResolved', internalType: 'bool', type: 'bool' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_disputeID', internalType: 'uint256', type: 'uint256' },
      { name: '_ruling', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'rule',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'stackDeployer',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'submissionBaseDeposit',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'submissionChallengeBaseDeposit',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'submissionDepositStrategy',
    outputs: [
      {
        name: '',
        internalType: 'contract ISubmissionDepositStrategy',
        type: 'address',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    name: 'submissionDeposits',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_itemID', internalType: 'bytes32', type: 'bytes32' },
      { name: '_evidence', internalType: 'string', type: 'string' },
    ],
    name: 'submitEvidence',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'itemIDs', internalType: 'bytes32[]', type: 'bytes32[]' }],
    name: 'syncBudgetTreasuries',
    outputs: [
      { name: 'attempted', internalType: 'uint256', type: 'uint256' },
      { name: 'succeeded', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'underwriterSlasherRouter',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_beneficiary', internalType: 'address', type: 'address' },
      { name: '_itemID', internalType: 'bytes32', type: 'bytes32' },
      { name: '_request', internalType: 'uint256', type: 'uint256' },
      { name: '_round', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'withdrawFeesAndRewards',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'itemID',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'allocationMechanism',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'allocationMechanismArbitrator',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'roundFactory',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'BudgetAllocationMechanismDeployed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'itemID',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'budgetTreasury',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'callTarget',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'selector',
        internalType: 'bytes4',
        type: 'bytes4',
        indexed: true,
      },
      { name: 'reason', internalType: 'bytes', type: 'bytes', indexed: false },
    ],
    name: 'BudgetCreditCapEnforcementFailed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'itemID',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
    ],
    name: 'BudgetStackActivationQueued',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'itemID',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'childFlow',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'budgetTreasury',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'strategy',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'BudgetStackDeployed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'itemID',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'childFlow',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'budgetTreasury',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'removedFromParent',
        internalType: 'bool',
        type: 'bool',
        indexed: false,
      },
      {
        name: 'terminallyResolved',
        internalType: 'bool',
        type: 'bool',
        indexed: false,
      },
    ],
    name: 'BudgetStackRemovalHandled',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'itemID',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
    ],
    name: 'BudgetStackRemovalQueued',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'itemID',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'budgetTreasury',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'terminallyResolved',
        internalType: 'bool',
        type: 'bool',
        indexed: false,
      },
    ],
    name: 'BudgetStackTerminalizationRetried',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'itemID',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'childFlow',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'budgetTreasury',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'removedFromParent',
        internalType: 'bool',
        type: 'bool',
        indexed: false,
      },
      {
        name: 'goalSynced',
        internalType: 'bool',
        type: 'bool',
        indexed: false,
      },
    ],
    name: 'BudgetTerminalRecipientPruned',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'itemID',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'budgetTreasury',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'selector',
        internalType: 'bytes4',
        type: 'bytes4',
        indexed: true,
      },
      { name: 'reason', internalType: 'bytes', type: 'bytes', indexed: false },
    ],
    name: 'BudgetTerminalizationStepFailed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'itemID',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'budgetTreasury',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'success', internalType: 'bool', type: 'bool', indexed: false },
    ],
    name: 'BudgetTreasuryBatchSyncAttempted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'itemID',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'budgetTreasury',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'reason',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: false,
      },
    ],
    name: 'BudgetTreasuryBatchSyncSkipped',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'itemID',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'budgetTreasury',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'selector',
        internalType: 'bytes4',
        type: 'bytes4',
        indexed: true,
      },
      { name: 'reason', internalType: 'bytes', type: 'bytes', indexed: false },
    ],
    name: 'BudgetTreasuryCallFailed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: '_arbitrator',
        internalType: 'contract IArbitrator',
        type: 'address',
        indexed: true,
      },
      {
        name: '_disputeID',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: '_metaEvidenceID',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: '_evidenceGroupID',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: '_itemID',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: false,
      },
    ],
    name: 'Dispute',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: '_arbitrator',
        internalType: 'contract IArbitrator',
        type: 'address',
        indexed: true,
      },
      {
        name: '_evidenceGroupID',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: '_party',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: '_evidence',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
    ],
    name: 'Evidence',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'version',
        internalType: 'uint64',
        type: 'uint64',
        indexed: false,
      },
    ],
    name: 'Initialized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: '_itemID',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: '_requestIndex',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: '_roundIndex',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      { name: '_disputed', internalType: 'bool', type: 'bool', indexed: false },
      { name: '_resolved', internalType: 'bool', type: 'bool', indexed: false },
      {
        name: '_itemStatus',
        internalType: 'enum IGeneralizedTCR.Status',
        type: 'uint8',
        indexed: false,
      },
    ],
    name: 'ItemStatusChange',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: '_itemID',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: '_submitter',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: '_evidenceGroupID',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      { name: '_data', internalType: 'bytes', type: 'bytes', indexed: false },
    ],
    name: 'ItemSubmitted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: '_metaEvidenceID',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: '_evidence',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
    ],
    name: 'MetaEvidence',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: '_itemID',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: '_requestIndex',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: '_evidenceGroupID',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
    ],
    name: 'RequestEvidenceGroupID',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: '_itemID',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: '_requestIndex',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: '_requestType',
        internalType: 'enum IGeneralizedTCR.Status',
        type: 'uint8',
        indexed: true,
      },
    ],
    name: 'RequestSubmitted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: '_arbitrator',
        internalType: 'contract IArbitrator',
        type: 'address',
        indexed: true,
      },
      {
        name: '_disputeID',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: '_ruling',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Ruling',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'itemID',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'payer',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'SubmissionDepositPaid',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'itemID',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'recipient',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'requestType',
        internalType: 'enum IGeneralizedTCR.Status',
        type: 'uint8',
        indexed: false,
      },
      {
        name: 'ruling',
        internalType: 'enum IArbitrable.Party',
        type: 'uint8',
        indexed: false,
      },
    ],
    name: 'SubmissionDepositTransferred',
  },
  { type: 'error', inputs: [], name: 'ADDRESS_ZERO' },
  { type: 'error', inputs: [], name: 'ARBITRATOR_ARBITRABLE_MISMATCH' },
  { type: 'error', inputs: [], name: 'ARBITRATOR_TOKEN_MISMATCH' },
  {
    type: 'error',
    inputs: [
      { name: 'token', internalType: 'address', type: 'address' },
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'beforeBalance', internalType: 'uint256', type: 'uint256' },
      { name: 'afterBalance', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'BALANCE_DECREASED_UNEXPECTEDLY',
  },
  { type: 'error', inputs: [], name: 'BUDGET_STAKE_LEDGER_NOT_CONFIGURED' },
  { type: 'error', inputs: [], name: 'CHALLENGE_MUST_BE_WITHIN_TIME_LIMIT' },
  { type: 'error', inputs: [], name: 'CHALLENGE_PERIOD_MUST_PASS' },
  { type: 'error', inputs: [], name: 'DISPUTE_MUST_NOT_BE_RESOLVED' },
  { type: 'error', inputs: [], name: 'DISPUTE_NOT_SOLVED' },
  { type: 'error', inputs: [], name: 'DISPUTE_TIMEOUT_DISABLED' },
  { type: 'error', inputs: [], name: 'DISPUTE_TIMEOUT_NOT_PASSED' },
  { type: 'error', inputs: [], name: 'GOAL_TERMINAL' },
  { type: 'error', inputs: [], name: 'INVALID_BOUNDS' },
  { type: 'error', inputs: [], name: 'INVALID_DISPUTE_ID' },
  { type: 'error', inputs: [], name: 'INVALID_ITEM_DATA' },
  {
    type: 'error',
    inputs: [{ name: 'ppmValue', internalType: 'uint32', type: 'uint32' }],
    name: 'INVALID_PPM',
  },
  {
    type: 'error',
    inputs: [
      { name: 'implementation', internalType: 'address', type: 'address' },
    ],
    name: 'INVALID_PREMIUM_ESCROW_IMPLEMENTATION',
  },
  { type: 'error', inputs: [], name: 'INVALID_RULING_OPTION' },
  { type: 'error', inputs: [], name: 'INVALID_SUBMISSION_DEPOSIT_ACTION' },
  { type: 'error', inputs: [], name: 'INVALID_SUBMISSION_DEPOSIT_RECIPIENT' },
  { type: 'error', inputs: [], name: 'INVALID_SUBMISSION_DEPOSIT_STRATEGY' },
  { type: 'error', inputs: [], name: 'INVALID_VOTING_TOKEN_COMPATIBILITY' },
  {
    type: 'error',
    inputs: [{ name: 'decimals', internalType: 'uint8', type: 'uint8' }],
    name: 'INVALID_VOTING_TOKEN_DECIMALS',
  },
  { type: 'error', inputs: [], name: 'ITEM_MUST_HAVE_PENDING_REQUEST' },
  { type: 'error', inputs: [], name: 'ITEM_NOT_DEPLOYED' },
  { type: 'error', inputs: [], name: 'ITEM_NOT_REGISTERED' },
  { type: 'error', inputs: [], name: 'ITEM_NOT_TERMINAL' },
  {
    type: 'error',
    inputs: [{ name: 'itemID', internalType: 'bytes32', type: 'bytes32' }],
    name: 'ITEM_RELIST_NOT_ALLOWED',
  },
  { type: 'error', inputs: [], name: 'InvalidInitialization' },
  {
    type: 'error',
    inputs: [],
    name: 'MANAGER_REWARD_DISTRIBUTION_POOL_NOT_CONFIGURED',
  },
  { type: 'error', inputs: [], name: 'MUST_BE_ABSENT_TO_BE_ADDED' },
  { type: 'error', inputs: [], name: 'MUST_BE_A_REQUEST' },
  { type: 'error', inputs: [], name: 'MUST_BE_REGISTERED_TO_BE_REMOVED' },
  { type: 'error', inputs: [], name: 'MUST_FULLY_FUND_YOUR_SIDE' },
  {
    type: 'error',
    inputs: [{ name: 'itemID', internalType: 'bytes32', type: 'bytes32' }],
    name: 'NO_REQUESTS_FOR_ITEM',
  },
  { type: 'error', inputs: [], name: 'NotInitializing' },
  { type: 'error', inputs: [], name: 'ONLY_ARBITRATOR_CAN_RULE' },
  { type: 'error', inputs: [], name: 'REGISTRATION_NOT_PENDING' },
  { type: 'error', inputs: [], name: 'REMOVAL_FINALIZATION_PENDING' },
  { type: 'error', inputs: [], name: 'REMOVAL_NOT_PENDING' },
  { type: 'error', inputs: [], name: 'REQUEST_ALREADY_DISPUTED' },
  { type: 'error', inputs: [], name: 'REQUEST_MUST_BE_DISPUTED' },
  { type: 'error', inputs: [], name: 'REQUEST_MUST_BE_RESOLVED' },
  { type: 'error', inputs: [], name: 'REQUEST_MUST_NOT_BE_DISPUTED' },
  { type: 'error', inputs: [], name: 'REQUEST_MUST_NOT_BE_RESOLVED' },
  { type: 'error', inputs: [], name: 'ReentrancyGuardReentrantCall' },
  { type: 'error', inputs: [], name: 'STACK_ALREADY_ACTIVE' },
  { type: 'error', inputs: [], name: 'STACK_STILL_ACTIVE' },
  { type: 'error', inputs: [], name: 'SUBMISSION_DEPOSIT_ALREADY_SET' },
  { type: 'error', inputs: [], name: 'SUBMISSION_DEPOSIT_TRANSFER_INCOMPLETE' },
  {
    type: 'error',
    inputs: [{ name: 'token', internalType: 'address', type: 'address' }],
    name: 'SafeERC20FailedOperation',
  },
  { type: 'error', inputs: [], name: 'TERMINAL_RESOLUTION_FAILED' },
  { type: 'error', inputs: [], name: 'UNDERWRITER_SLASHER_NOT_CONFIGURED' },
] as const

/**
 * [__View Contract on Base Basescan__](https://basescan.org/address/0x8d427390e7A210eaC7d40903d90Ad2170517D332)
 */
export const budgetTcrAddress = {
  8453: '0x8d427390e7A210eaC7d40903d90Ad2170517D332',
} as const

/**
 * [__View Contract on Base Basescan__](https://basescan.org/address/0x8d427390e7A210eaC7d40903d90Ad2170517D332)
 */
export const budgetTcrConfig = {
  address: budgetTcrAddress,
  abi: budgetTcrAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// BudgetTCRDeployer
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * [__View Contract on Base Basescan__](https://basescan.org/address/0x760048823Dd1d754c9eaBcdeD9Cb5428Cc3CF863)
 */
export const budgetTcrDeployerAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: 'budgetTreasuryImplementation_',
        internalType: 'address',
        type: 'address',
      },
      { name: 'roundFactory_', internalType: 'address', type: 'address' },
      {
        name: 'allocationMechanismTcrImplementation_',
        internalType: 'address',
        type: 'address',
      },
      {
        name: 'allocationMechanismArbitratorImplementation_',
        internalType: 'address',
        type: 'address',
      },
      {
        name: 'budgetFlowRouterStrategyImplementation_',
        internalType: 'address',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'allocationMechanismArbitratorImplementation',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'allocationMechanismTcrImplementation',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'budgetFlowRouterStrategyImplementation',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'budgetTCR',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'budgetTreasuryImplementation',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'budgetTreasury', internalType: 'address', type: 'address' },
      { name: 'premiumEscrow', internalType: 'address', type: 'address' },
      { name: 'childFlow', internalType: 'address', type: 'address' },
      { name: 'budgetStakeLedger', internalType: 'address', type: 'address' },
      { name: 'goalFlow', internalType: 'address', type: 'address' },
      {
        name: 'underwriterSlasherRouter',
        internalType: 'address',
        type: 'address',
      },
      { name: 'budgetSlashPpm', internalType: 'uint32', type: 'uint32' },
      {
        name: 'listing',
        internalType: 'struct IBudgetTCR.BudgetListing',
        type: 'tuple',
        components: [
          {
            name: 'metadata',
            internalType: 'struct FlowTypes.RecipientMetadata',
            type: 'tuple',
            components: [
              { name: 'title', internalType: 'string', type: 'string' },
              { name: 'description', internalType: 'string', type: 'string' },
              { name: 'image', internalType: 'string', type: 'string' },
              { name: 'tagline', internalType: 'string', type: 'string' },
              { name: 'url', internalType: 'string', type: 'string' },
            ],
          },
          { name: 'fundingDeadline', internalType: 'uint64', type: 'uint64' },
          { name: 'executionDuration', internalType: 'uint64', type: 'uint64' },
          {
            name: 'activationThreshold',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'runwayCap', internalType: 'uint256', type: 'uint256' },
          {
            name: 'oracleConfig',
            internalType: 'struct IBudgetTCR.OracleConfig',
            type: 'tuple',
            components: [
              {
                name: 'oracleSpecHash',
                internalType: 'bytes32',
                type: 'bytes32',
              },
              {
                name: 'assertionPolicyHash',
                internalType: 'bytes32',
                type: 'bytes32',
              },
            ],
          },
        ],
      },
      { name: 'successResolver', internalType: 'address', type: 'address' },
      {
        name: 'successAssertionLiveness',
        internalType: 'uint64',
        type: 'uint64',
      },
      {
        name: 'successAssertionBond',
        internalType: 'uint256',
        type: 'uint256',
      },
    ],
    name: 'deployBudgetTreasury',
    outputs: [
      {
        name: 'deployedBudgetTreasury',
        internalType: 'address',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'discoveryEmitter',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'itemID', internalType: 'bytes32', type: 'bytes32' },
      { name: 'allocationMechanism', internalType: 'address', type: 'address' },
      {
        name: 'allocationMechanismArbitrator',
        internalType: 'address',
        type: 'address',
      },
      { name: 'roundFactory_', internalType: 'address', type: 'address' },
    ],
    name: 'emitBudgetAllocationMechanismDeployed',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'itemID', internalType: 'bytes32', type: 'bytes32' },
      { name: 'childFlow', internalType: 'address', type: 'address' },
      { name: 'budgetTreasury', internalType: 'address', type: 'address' },
      { name: 'premiumEscrow', internalType: 'address', type: 'address' },
      { name: 'strategy', internalType: 'address', type: 'address' },
    ],
    name: 'emitBudgetStackDeployed',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'budgetTCR_', internalType: 'address', type: 'address' },
      {
        name: 'premiumEscrowImplementation_',
        internalType: 'address',
        type: 'address',
      },
      { name: 'discoveryEmitter_', internalType: 'address', type: 'address' },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'premiumEscrowImplementation',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'goalToken', internalType: 'contract IERC20', type: 'address' },
      {
        name: 'cobuildToken',
        internalType: 'contract IERC20',
        type: 'address',
      },
      {
        name: 'goalRulesets',
        internalType: 'contract IJBRulesets',
        type: 'address',
      },
      { name: 'goalRevnetId', internalType: 'uint256', type: 'uint256' },
      { name: 'paymentTokenDecimals', internalType: 'uint8', type: 'uint8' },
      { name: 'budgetStakeLedger', internalType: 'address', type: 'address' },
      { name: 'goalFlow', internalType: 'address', type: 'address' },
      {
        name: 'underwriterSlasherRouter',
        internalType: 'address',
        type: 'address',
      },
      { name: 'budgetSlashPpm', internalType: 'uint32', type: 'uint32' },
      { name: '', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'prepareBudgetStack',
    outputs: [
      {
        name: 'result',
        internalType: 'struct IBudgetTCRStackDeployer.PreparationResult',
        type: 'tuple',
        components: [
          { name: 'strategy', internalType: 'address', type: 'address' },
          { name: 'budgetTreasury', internalType: 'address', type: 'address' },
          { name: 'premiumEscrow', internalType: 'address', type: 'address' },
        ],
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'recipientId', internalType: 'bytes32', type: 'bytes32' },
      { name: 'childFlow', internalType: 'address', type: 'address' },
    ],
    name: 'registerChildFlowRecipient',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'roundFactory',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'sharedBudgetFlowStrategy',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'sharedBudgetFlowStrategyLedger',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'version',
        internalType: 'uint64',
        type: 'uint64',
        indexed: false,
      },
    ],
    name: 'Initialized',
  },
  { type: 'error', inputs: [], name: 'ADDRESS_ZERO' },
  { type: 'error', inputs: [], name: 'ADDRESS_ZERO' },
  {
    type: 'error',
    inputs: [
      { name: 'expectedLedger', internalType: 'address', type: 'address' },
      { name: 'providedLedger', internalType: 'address', type: 'address' },
    ],
    name: 'BUDGET_STAKE_LEDGER_MISMATCH',
  },
  { type: 'error', inputs: [], name: 'FailedDeployment' },
  {
    type: 'error',
    inputs: [
      { name: 'implementation', internalType: 'address', type: 'address' },
    ],
    name: 'IMPLEMENTATION_HAS_NO_CODE',
  },
  {
    type: 'error',
    inputs: [
      { name: 'premiumEscrow', internalType: 'address', type: 'address' },
    ],
    name: 'INVALID_PREMIUM_ESCROW',
  },
  {
    type: 'error',
    inputs: [{ name: 'strategy', internalType: 'address', type: 'address' }],
    name: 'INVALID_STRATEGY',
  },
  {
    type: 'error',
    inputs: [{ name: 'treasury', internalType: 'address', type: 'address' }],
    name: 'INVALID_TREASURY',
  },
  {
    type: 'error',
    inputs: [{ name: 'treasury', internalType: 'address', type: 'address' }],
    name: 'INVALID_TREASURY_CONFIGURATION',
  },
  {
    type: 'error',
    inputs: [
      { name: 'balance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'InsufficientBalance',
  },
  { type: 'error', inputs: [], name: 'InvalidInitialization' },
  { type: 'error', inputs: [], name: 'NotInitializing' },
  { type: 'error', inputs: [], name: 'ONLY_BUDGET_TCR' },
  { type: 'error', inputs: [], name: 'SHARED_BUDGET_STRATEGY_NOT_DEPLOYED' },
] as const

/**
 * [__View Contract on Base Basescan__](https://basescan.org/address/0x760048823Dd1d754c9eaBcdeD9Cb5428Cc3CF863)
 */
export const budgetTcrDeployerAddress = {
  8453: '0x760048823Dd1d754c9eaBcdeD9Cb5428Cc3CF863',
} as const

/**
 * [__View Contract on Base Basescan__](https://basescan.org/address/0x760048823Dd1d754c9eaBcdeD9Cb5428Cc3CF863)
 */
export const budgetTcrDeployerConfig = {
  address: budgetTcrDeployerAddress,
  abi: budgetTcrDeployerAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// BudgetTCRFactory
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * [__View Contract on Base Basescan__](https://basescan.org/address/0x6FDbE9f8330CA9B22d74E21a1e5aA29c7AE4E4fD)
 */
export const budgetTcrFactoryAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: 'budgetTCRImplementation_',
        internalType: 'address',
        type: 'address',
      },
      {
        name: 'arbitratorImplementation_',
        internalType: 'address',
        type: 'address',
      },
      {
        name: 'stackDeployerImplementation_',
        internalType: 'address',
        type: 'address',
      },
      { name: 'authorizedCaller_', internalType: 'address', type: 'address' },
      { name: 'escrowBondBps_', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'arbitratorImplementation',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'authorizedCaller',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'stackDeployer', internalType: 'address', type: 'address' },
    ],
    name: 'budgetTCRByStackDeployer',
    outputs: [{ name: 'budgetTCR', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'budgetTCRImplementation',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'registryConfig',
        internalType: 'struct BudgetTCRFactory.RegistryConfigInput',
        type: 'tuple',
        components: [
          {
            name: 'allocationMechanismAdmin',
            internalType: 'address',
            type: 'address',
          },
          {
            name: 'invalidRoundRewardsSink',
            internalType: 'address',
            type: 'address',
          },
          {
            name: 'votingToken',
            internalType: 'contract IVotes',
            type: 'address',
          },
          {
            name: 'submissionDepositStrategy',
            internalType: 'contract ISubmissionDepositStrategy',
            type: 'address',
          },
          {
            name: 'registryPolicy',
            internalType: 'struct IGeneralizedTCRConfig.RegistryPolicy',
            type: 'tuple',
            components: [
              {
                name: 'arbitratorExtraData',
                internalType: 'bytes',
                type: 'bytes',
              },
              {
                name: 'registrationMetaEvidence',
                internalType: 'string',
                type: 'string',
              },
              {
                name: 'clearingMetaEvidence',
                internalType: 'string',
                type: 'string',
              },
              {
                name: 'submissionBaseDeposit',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'removalBaseDeposit',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'submissionChallengeBaseDeposit',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'removalChallengeBaseDeposit',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'challengePeriodDuration',
                internalType: 'uint256',
                type: 'uint256',
              },
            ],
          },
        ],
      },
      {
        name: 'deploymentConfig',
        internalType: 'struct IBudgetTCR.DeploymentConfig',
        type: 'tuple',
        components: [
          { name: 'stackDeployer', internalType: 'address', type: 'address' },
          {
            name: 'budgetSuccessResolver',
            internalType: 'address',
            type: 'address',
          },
          { name: 'goalFlow', internalType: 'contract IFlow', type: 'address' },
          {
            name: 'goalTreasury',
            internalType: 'contract IGoalTreasury',
            type: 'address',
          },
          {
            name: 'goalToken',
            internalType: 'contract IERC20',
            type: 'address',
          },
          {
            name: 'cobuildToken',
            internalType: 'contract IERC20',
            type: 'address',
          },
          {
            name: 'goalRulesets',
            internalType: 'contract IJBRulesets',
            type: 'address',
          },
          { name: 'goalRevnetId', internalType: 'uint256', type: 'uint256' },
          {
            name: 'paymentTokenDecimals',
            internalType: 'uint8',
            type: 'uint8',
          },
          {
            name: 'premiumEscrowImplementation',
            internalType: 'address',
            type: 'address',
          },
          {
            name: 'underwriterSlasherRouter',
            internalType: 'address',
            type: 'address',
          },
          { name: 'budgetPremiumPpm', internalType: 'uint32', type: 'uint32' },
          { name: 'budgetSlashPpm', internalType: 'uint32', type: 'uint32' },
          {
            name: 'budgetValidationBounds',
            internalType: 'struct IBudgetTCR.BudgetValidationBounds',
            type: 'tuple',
            components: [
              {
                name: 'minFundingLeadTime',
                internalType: 'uint64',
                type: 'uint64',
              },
              {
                name: 'maxFundingHorizon',
                internalType: 'uint64',
                type: 'uint64',
              },
              {
                name: 'minExecutionDuration',
                internalType: 'uint64',
                type: 'uint64',
              },
              {
                name: 'maxExecutionDuration',
                internalType: 'uint64',
                type: 'uint64',
              },
              {
                name: 'minActivationThreshold',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'maxActivationThreshold',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'maxRunwayCap',
                internalType: 'uint256',
                type: 'uint256',
              },
            ],
          },
          {
            name: 'oracleValidationBounds',
            internalType: 'struct IBudgetTCR.OracleValidationBounds',
            type: 'tuple',
            components: [
              { name: 'liveness', internalType: 'uint64', type: 'uint64' },
              { name: 'bondAmount', internalType: 'uint256', type: 'uint256' },
            ],
          },
        ],
      },
      {
        name: 'arbitratorParams',
        internalType: 'struct IArbitrator.ArbitratorParams',
        type: 'tuple',
        components: [
          { name: 'votingPeriod', internalType: 'uint256', type: 'uint256' },
          { name: 'votingDelay', internalType: 'uint256', type: 'uint256' },
          { name: 'revealPeriod', internalType: 'uint256', type: 'uint256' },
          { name: 'arbitrationCost', internalType: 'uint256', type: 'uint256' },
          {
            name: 'wrongOrMissedSlashBps',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'slashCallerBountyBps',
            internalType: 'uint256',
            type: 'uint256',
          },
        ],
      },
    ],
    name: 'deployBudgetTCRStackForGoal',
    outputs: [
      {
        name: 'deployed',
        internalType: 'struct BudgetTCRFactory.DeployedBudgetTCRStack',
        type: 'tuple',
        components: [
          { name: 'budgetTCR', internalType: 'address', type: 'address' },
          { name: 'arbitrator', internalType: 'address', type: 'address' },
          { name: 'token', internalType: 'address', type: 'address' },
        ],
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'goalFlow', internalType: 'address', type: 'address' },
      { name: 'goalTreasury', internalType: 'address', type: 'address' },
      { name: 'goalRevnetId', internalType: 'uint256', type: 'uint256' },
      { name: 'votingToken', internalType: 'address', type: 'address' },
    ],
    name: 'deriveBudgetTCRSalt',
    outputs: [{ name: 'salt', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [],
    name: 'escrowBondBps',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'budgetTCR', internalType: 'address', type: 'address' }],
    name: 'jurorSlasherRouterByBudgetTCR',
    outputs: [
      { name: 'jurorSlasherRouter', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'itemID', internalType: 'bytes32', type: 'bytes32' },
      { name: 'allocationMechanism', internalType: 'address', type: 'address' },
      {
        name: 'allocationMechanismArbitrator',
        internalType: 'address',
        type: 'address',
      },
      { name: 'roundFactory', internalType: 'address', type: 'address' },
    ],
    name: 'onBudgetAllocationMechanismDeployed',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'itemID', internalType: 'bytes32', type: 'bytes32' },
      { name: 'childFlow', internalType: 'address', type: 'address' },
      { name: 'budgetTreasury', internalType: 'address', type: 'address' },
      { name: 'premiumEscrow', internalType: 'address', type: 'address' },
      { name: 'strategy', internalType: 'address', type: 'address' },
    ],
    name: 'onBudgetStackDeployed',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'goalFlow', internalType: 'address', type: 'address' },
      { name: 'goalTreasury', internalType: 'address', type: 'address' },
      { name: 'goalRevnetId', internalType: 'uint256', type: 'uint256' },
      { name: 'votingToken', internalType: 'address', type: 'address' },
    ],
    name: 'predictBudgetTCRAddress',
    outputs: [{ name: 'predicted', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'budgetTCR', internalType: 'address', type: 'address' }],
    name: 'stackDeployerByBudgetTCR',
    outputs: [
      { name: 'stackDeployer', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'stackDeployerImplementation',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'budgetTCR',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'itemID',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'allocationMechanism',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'allocationMechanismArbitrator',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'roundFactory',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'BudgetAllocationMechanismDeployed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'budgetTCR',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'itemID',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'childFlow',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'budgetTreasury',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'premiumEscrow',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'strategy',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'BudgetStackDeployed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'budgetTCR',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'arbitrator',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'token',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'goalFlow',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'goalTreasury',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'BudgetTCRStackDeployedForGoal',
  },
  { type: 'error', inputs: [], name: 'ADDRESS_ZERO' },
  { type: 'error', inputs: [], name: 'FailedDeployment' },
  {
    type: 'error',
    inputs: [
      { name: 'implementation', internalType: 'address', type: 'address' },
    ],
    name: 'IMPLEMENTATION_HAS_NO_CODE',
  },
  {
    type: 'error',
    inputs: [
      { name: 'escrowBondBps', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'INVALID_ESCROW_BOND_BPS',
  },
  {
    type: 'error',
    inputs: [
      { name: 'expected', internalType: 'address', type: 'address' },
      { name: 'actual', internalType: 'address', type: 'address' },
    ],
    name: 'INVALID_SLASHER_AUTHORITY',
  },
  {
    type: 'error',
    inputs: [
      { name: 'expected', internalType: 'address', type: 'address' },
      { name: 'actual', internalType: 'address', type: 'address' },
    ],
    name: 'INVALID_SLASHER_STAKE_VAULT',
  },
  {
    type: 'error',
    inputs: [
      { name: 'expected', internalType: 'address', type: 'address' },
      { name: 'actual', internalType: 'address', type: 'address' },
    ],
    name: 'INVALID_UNDERWRITER_SLASHER_AUTHORITY',
  },
  {
    type: 'error',
    inputs: [
      { name: 'expected', internalType: 'address', type: 'address' },
      { name: 'actual', internalType: 'address', type: 'address' },
    ],
    name: 'INVALID_UNDERWRITER_SLASHER_STAKE_VAULT',
  },
  {
    type: 'error',
    inputs: [
      { name: 'balance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'InsufficientBalance',
  },
  { type: 'error', inputs: [], name: 'JUROR_SLASHER_NOT_CONFIGURED' },
  {
    type: 'error',
    inputs: [{ name: 'caller', internalType: 'address', type: 'address' }],
    name: 'UNAUTHORIZED_CALLER',
  },
  {
    type: 'error',
    inputs: [{ name: 'caller', internalType: 'address', type: 'address' }],
    name: 'UNAUTHORIZED_STACK_DEPLOYER',
  },
  {
    type: 'error',
    inputs: [
      { name: 'expected', internalType: 'address', type: 'address' },
      { name: 'actual', internalType: 'address', type: 'address' },
    ],
    name: 'UNDERWRITER_SLASHER_MISMATCH',
  },
  { type: 'error', inputs: [], name: 'UNDERWRITER_SLASHER_NOT_CONFIGURED' },
  {
    type: 'error',
    inputs: [
      { name: 'configuredSlasher', internalType: 'address', type: 'address' },
    ],
    name: 'UNSUPPORTED_JUROR_SLASHER',
  },
  {
    type: 'error',
    inputs: [
      { name: 'configuredSlasher', internalType: 'address', type: 'address' },
    ],
    name: 'UNSUPPORTED_UNDERWRITER_SLASHER',
  },
] as const

/**
 * [__View Contract on Base Basescan__](https://basescan.org/address/0x6FDbE9f8330CA9B22d74E21a1e5aA29c7AE4E4fD)
 */
export const budgetTcrFactoryAddress = {
  8453: '0x6FDbE9f8330CA9B22d74E21a1e5aA29c7AE4E4fD',
} as const

/**
 * [__View Contract on Base Basescan__](https://basescan.org/address/0x6FDbE9f8330CA9B22d74E21a1e5aA29c7AE4E4fD)
 */
export const budgetTcrFactoryConfig = {
  address: budgetTcrFactoryAddress,
  abi: budgetTcrFactoryAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// BudgetTreasury
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * [__View Contract on Base Basescan__](https://basescan.org/address/0xBc90bad4575bF7ADf9D096211f7AD40F24c8EFD1)
 */
export const budgetTreasuryAbi = [
  { type: 'constructor', inputs: [], stateMutability: 'nonpayable' },
  {
    type: 'function',
    inputs: [],
    name: 'activatedAt',
    outputs: [{ name: '', internalType: 'uint64', type: 'uint64' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'activationThreshold',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'authority',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'canAcceptFunding',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'assertionId', internalType: 'bytes32', type: 'bytes32' }],
    name: 'clearSuccessAssertion',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'controller',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'deadline',
    outputs: [{ name: '', internalType: 'uint64', type: 'uint64' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'disableSuccessResolution',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'amount', internalType: 'uint256', type: 'uint256' }],
    name: 'donateUnderlyingAndUpgrade',
    outputs: [{ name: 'received', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'executionDuration',
    outputs: [{ name: '', internalType: 'uint64', type: 'uint64' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'flow',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'forceFlowRateToZero',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'fundingDeadline',
    outputs: [{ name: '', internalType: 'uint64', type: 'uint64' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'initialController', internalType: 'address', type: 'address' },
      {
        name: 'config',
        internalType: 'struct IBudgetTreasury.BudgetConfig',
        type: 'tuple',
        components: [
          { name: 'flow', internalType: 'address', type: 'address' },
          { name: 'premiumEscrow', internalType: 'address', type: 'address' },
          { name: 'fundingDeadline', internalType: 'uint64', type: 'uint64' },
          { name: 'executionDuration', internalType: 'uint64', type: 'uint64' },
          {
            name: 'activationThreshold',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'runwayCap', internalType: 'uint256', type: 'uint256' },
          { name: 'successResolver', internalType: 'address', type: 'address' },
          {
            name: 'successAssertionLiveness',
            internalType: 'uint64',
            type: 'uint64',
          },
          {
            name: 'successAssertionBond',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'successOracleSpecHash',
            internalType: 'bytes32',
            type: 'bytes32',
          },
          {
            name: 'successAssertionPolicyHash',
            internalType: 'bytes32',
            type: 'bytes32',
          },
        ],
      },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'isReassertGraceActive',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'lifecycleStatus',
    outputs: [
      {
        name: 'status',
        internalType: 'struct IBudgetTreasury.BudgetLifecycleStatus',
        type: 'tuple',
        components: [
          {
            name: 'currentState',
            internalType: 'enum IBudgetTreasury.BudgetState',
            type: 'uint8',
          },
          { name: 'isResolved', internalType: 'bool', type: 'bool' },
          { name: 'canAcceptFunding', internalType: 'bool', type: 'bool' },
          {
            name: 'isSuccessResolutionDisabled',
            internalType: 'bool',
            type: 'bool',
          },
          { name: 'isFundingWindowEnded', internalType: 'bool', type: 'bool' },
          { name: 'hasDeadline', internalType: 'bool', type: 'bool' },
          { name: 'isDeadlinePassed', internalType: 'bool', type: 'bool' },
          {
            name: 'hasPendingSuccessAssertion',
            internalType: 'bool',
            type: 'bool',
          },
          { name: 'treasuryBalance', internalType: 'uint256', type: 'uint256' },
          {
            name: 'activationThreshold',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'runwayCap', internalType: 'uint256', type: 'uint256' },
          { name: 'fundingDeadline', internalType: 'uint64', type: 'uint64' },
          { name: 'executionDuration', internalType: 'uint64', type: 'uint64' },
          { name: 'deadline', internalType: 'uint64', type: 'uint64' },
          { name: 'activatedAt', internalType: 'uint64', type: 'uint64' },
          { name: 'timeRemaining', internalType: 'uint256', type: 'uint256' },
          { name: 'targetFlowRate', internalType: 'int96', type: 'int96' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'pendingSuccessAssertionAt',
    outputs: [{ name: '', internalType: 'uint64', type: 'uint64' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'pendingSuccessAssertionId',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'premiumEscrow',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'reassertGraceDeadline',
    outputs: [{ name: '', internalType: 'uint64', type: 'uint64' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'reassertGraceUsed',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'assertionId', internalType: 'bytes32', type: 'bytes32' }],
    name: 'registerSuccessAssertion',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'resolveFailure',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'resolveSuccess',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'resolved',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'resolvedAt',
    outputs: [{ name: '', internalType: 'uint64', type: 'uint64' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'retryTerminalSideEffects',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'runwayCap',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'settleLateResidualToParent',
    outputs: [{ name: 'amount', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'settleResidualToParentForFinalize',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'state',
    outputs: [
      {
        name: '',
        internalType: 'enum IBudgetTreasury.BudgetState',
        type: 'uint8',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'successAssertionBond',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'successAssertionLiveness',
    outputs: [{ name: '', internalType: 'uint64', type: 'uint64' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'successAssertionPolicyHash',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'successOracleSpecHash',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'successResolutionDisabled',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'successResolver',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'superToken',
    outputs: [
      { name: '', internalType: 'contract ISuperToken', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'sync',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'targetFlowRate',
    outputs: [{ name: '', internalType: 'int96', type: 'int96' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'timeRemaining',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'treasuryBalance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'treasuryKind',
    outputs: [
      {
        name: '',
        internalType: 'enum ISuccessAssertionTreasury.TreasuryKind',
        type: 'uint8',
      },
    ],
    stateMutability: 'pure',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'controller',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'flow',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'fundingDeadline',
        internalType: 'uint64',
        type: 'uint64',
        indexed: false,
      },
      {
        name: 'executionDuration',
        internalType: 'uint64',
        type: 'uint64',
        indexed: false,
      },
      {
        name: 'activationThreshold',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'runwayCap',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'BudgetConfigured',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'finalState',
        internalType: 'enum IBudgetTreasury.BudgetState',
        type: 'uint8',
        indexed: false,
      },
    ],
    name: 'BudgetFinalized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'donor',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'sourceToken',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'sourceAmount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'superTokenAmount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'DonationRecorded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'flow', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'selector',
        internalType: 'bytes4',
        type: 'bytes4',
        indexed: true,
      },
      {
        name: 'attemptedRate',
        internalType: 'int96',
        type: 'int96',
        indexed: false,
      },
      { name: 'reason', internalType: 'bytes', type: 'bytes', indexed: false },
    ],
    name: 'FlowRateSyncCallFailed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'flow', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'targetRate',
        internalType: 'int96',
        type: 'int96',
        indexed: false,
      },
      {
        name: 'fallbackRate',
        internalType: 'int96',
        type: 'int96',
        indexed: false,
      },
      {
        name: 'currentRate',
        internalType: 'int96',
        type: 'int96',
        indexed: false,
      },
    ],
    name: 'FlowRateSyncManualInterventionRequired',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'targetRate',
        internalType: 'int96',
        type: 'int96',
        indexed: false,
      },
      {
        name: 'appliedRate',
        internalType: 'int96',
        type: 'int96',
        indexed: false,
      },
      {
        name: 'treasuryBalance',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'timeRemaining',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'FlowRateSynced',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'flow', internalType: 'address', type: 'address', indexed: true },
      { name: 'reason', internalType: 'bytes', type: 'bytes', indexed: false },
    ],
    name: 'FlowRateZeroingFailed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'version',
        internalType: 'uint64',
        type: 'uint64',
        indexed: false,
      },
    ],
    name: 'Initialized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'clearedAssertionId',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'graceDeadline',
        internalType: 'uint64',
        type: 'uint64',
        indexed: true,
      },
    ],
    name: 'ReassertGraceActivated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'destination',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ResidualSettled',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousState',
        internalType: 'enum IBudgetTreasury.BudgetState',
        type: 'uint8',
        indexed: false,
      },
      {
        name: 'newState',
        internalType: 'enum IBudgetTreasury.BudgetState',
        type: 'uint8',
        indexed: false,
      },
    ],
    name: 'StateTransition',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'assertionId',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
    ],
    name: 'SuccessAssertionCleared',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'assertionId',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'revertData',
        internalType: 'bytes',
        type: 'bytes',
        indexed: false,
      },
    ],
    name: 'SuccessAssertionFinalizeFailed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'assertionId',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'assertedAt',
        internalType: 'uint64',
        type: 'uint64',
        indexed: true,
      },
    ],
    name: 'SuccessAssertionRegistered',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'assertionId',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'reason',
        internalType: 'enum TreasurySuccessAssertions.FailClosedReason',
        type: 'uint8',
        indexed: true,
      },
    ],
    name: 'SuccessAssertionResolutionFailClosed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [],
    name: 'SuccessResolutionDisabled',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'revertData',
        internalType: 'bytes',
        type: 'bytes',
        indexed: false,
      },
    ],
    name: 'TerminalFlowStopFailed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'removedFromParent',
        internalType: 'bool',
        type: 'bool',
        indexed: false,
      },
    ],
    name: 'TerminalParentGoalSyncNotApplied',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'revertData',
        internalType: 'bytes',
        type: 'bytes',
        indexed: false,
      },
    ],
    name: 'TerminalParentPruneFailed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'revertData',
        internalType: 'bytes',
        type: 'bytes',
        indexed: false,
      },
    ],
    name: 'TerminalPremiumEscrowCloseFailed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'revertData',
        internalType: 'bytes',
        type: 'bytes',
        indexed: false,
      },
    ],
    name: 'TerminalResidualSettlementToParentFailed',
  },
  {
    type: 'error',
    inputs: [
      { name: 'treasuryBalance', internalType: 'uint256', type: 'uint256' },
      { name: 'activationThreshold', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ACTIVATION_THRESHOLD_NOT_REACHED',
  },
  { type: 'error', inputs: [], name: 'ADDRESS_ZERO' },
  { type: 'error', inputs: [], name: 'BUDGET_DEADLINE_PASSED' },
  { type: 'error', inputs: [], name: 'DEADLINE_NOT_REACHED' },
  {
    type: 'error',
    inputs: [
      { name: 'expected', internalType: 'address', type: 'address' },
      { name: 'flowOperator', internalType: 'address', type: 'address' },
      { name: 'sweeper', internalType: 'address', type: 'address' },
    ],
    name: 'FLOW_AUTHORITY_MISMATCH',
  },
  { type: 'error', inputs: [], name: 'FUNDING_WINDOW_NOT_ENDED' },
  { type: 'error', inputs: [], name: 'INVALID_ASSERTION_CONFIG' },
  { type: 'error', inputs: [], name: 'INVALID_ASSERTION_ID' },
  { type: 'error', inputs: [], name: 'INVALID_ASSERTION_ID' },
  { type: 'error', inputs: [], name: 'INVALID_DEADLINES' },
  { type: 'error', inputs: [], name: 'INVALID_EXECUTION_DURATION' },
  { type: 'error', inputs: [], name: 'INVALID_REASSERT_GRACE_DURATION' },
  { type: 'error', inputs: [], name: 'INVALID_STATE' },
  {
    type: 'error',
    inputs: [
      { name: 'activationThreshold', internalType: 'uint256', type: 'uint256' },
      { name: 'runwayCap', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'INVALID_THRESHOLDS',
  },
  { type: 'error', inputs: [], name: 'InvalidInitialization' },
  {
    type: 'error',
    inputs: [
      { name: 'incomingRate', internalType: 'int96', type: 'int96' },
      { name: 'spenddownRate', internalType: 'int96', type: 'int96' },
    ],
    name: 'NEGATIVE_FLOW_COMPONENT',
  },
  {
    type: 'error',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'NOT_A_CONTRACT',
  },
  { type: 'error', inputs: [], name: 'NotInitializing' },
  { type: 'error', inputs: [], name: 'ONLY_CONTROLLER' },
  { type: 'error', inputs: [], name: 'ONLY_SELF' },
  { type: 'error', inputs: [], name: 'ONLY_SUCCESS_RESOLVER' },
  { type: 'error', inputs: [], name: 'PARENT_FLOW_NOT_CONFIGURED' },
  { type: 'error', inputs: [], name: 'ReentrancyGuardReentrantCall' },
  {
    type: 'error',
    inputs: [{ name: 'assertionId', internalType: 'bytes32', type: 'bytes32' }],
    name: 'SUCCESS_ASSERTION_ALREADY_PENDING',
  },
  {
    type: 'error',
    inputs: [{ name: 'assertionId', internalType: 'bytes32', type: 'bytes32' }],
    name: 'SUCCESS_ASSERTION_ALREADY_PENDING',
  },
  {
    type: 'error',
    inputs: [
      { name: 'expected', internalType: 'bytes32', type: 'bytes32' },
      { name: 'actual', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'SUCCESS_ASSERTION_ID_MISMATCH',
  },
  {
    type: 'error',
    inputs: [
      { name: 'expected', internalType: 'bytes32', type: 'bytes32' },
      { name: 'actual', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'SUCCESS_ASSERTION_ID_MISMATCH',
  },
  { type: 'error', inputs: [], name: 'SUCCESS_ASSERTION_NOT_PENDING' },
  { type: 'error', inputs: [], name: 'SUCCESS_ASSERTION_NOT_PENDING' },
  { type: 'error', inputs: [], name: 'SUCCESS_ASSERTION_NOT_VERIFIED' },
  { type: 'error', inputs: [], name: 'SUCCESS_ASSERTION_NOT_VERIFIED' },
  { type: 'error', inputs: [], name: 'SUCCESS_ASSERTION_PENDING' },
  { type: 'error', inputs: [], name: 'SUCCESS_RESOLUTION_DISABLED' },
  {
    type: 'error',
    inputs: [
      { name: 'bits', internalType: 'uint8', type: 'uint8' },
      { name: 'value', internalType: 'int256', type: 'int256' },
    ],
    name: 'SafeCastOverflowedIntDowncast',
  },
  {
    type: 'error',
    inputs: [{ name: 'value', internalType: 'int256', type: 'int256' }],
    name: 'SafeCastOverflowedIntToUint',
  },
  {
    type: 'error',
    inputs: [
      { name: 'bits', internalType: 'uint8', type: 'uint8' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'SafeCastOverflowedUintDowncast',
  },
  {
    type: 'error',
    inputs: [{ name: 'value', internalType: 'uint256', type: 'uint256' }],
    name: 'SafeCastOverflowedUintToInt',
  },
  {
    type: 'error',
    inputs: [{ name: 'token', internalType: 'address', type: 'address' }],
    name: 'SafeERC20FailedOperation',
  },
] as const

/**
 * [__View Contract on Base Basescan__](https://basescan.org/address/0xBc90bad4575bF7ADf9D096211f7AD40F24c8EFD1)
 */
export const budgetTreasuryAddress = {
  8453: '0xBc90bad4575bF7ADf9D096211f7AD40F24c8EFD1',
} as const

/**
 * [__View Contract on Base Basescan__](https://basescan.org/address/0xBc90bad4575bF7ADf9D096211f7AD40F24c8EFD1)
 */
export const budgetTreasuryConfig = {
  address: budgetTreasuryAddress,
  abi: budgetTreasuryAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// CobuildSwapImpl
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * [__View Contract on Base Basescan__](https://basescan.org/address/0x21a580054e7a5e833f38033f2d958e00e4c50f0f)
 */
export const cobuildSwapImplAbi = [
  { type: 'constructor', inputs: [], stateMutability: 'nonpayable' },
  { type: 'receive', stateMutability: 'payable' },
  {
    type: 'function',
    inputs: [],
    name: 'JB_DIRECTORY',
    outputs: [
      { name: '', internalType: 'contract IJBDirectory', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'JB_TOKENS',
    outputs: [
      { name: '', internalType: 'contract IJBTokens', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'PERMIT2',
    outputs: [
      {
        name: '',
        internalType: 'contract IAllowanceTransfer',
        type: 'address',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'UPGRADE_INTERFACE_VERSION',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'USDC',
    outputs: [{ name: '', internalType: 'contract IERC20', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'WETH9',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'ZORA',
    outputs: [{ name: '', internalType: 'contract IERC20', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'acceptOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'allowedRouters',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'allowedSpenders',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'amountIn', internalType: 'uint256', type: 'uint256' }],
    name: 'computeFeeAndNet',
    outputs: [
      { name: 'fee', internalType: 'uint256', type: 'uint256' },
      { name: 'net', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'expectedRouter', internalType: 'address', type: 'address' },
      {
        name: 's',
        internalType: 'struct ICobuildSwap.OxOneToMany',
        type: 'tuple',
        components: [
          { name: 'tokenOut', internalType: 'address', type: 'address' },
          { name: 'minAmountOut', internalType: 'uint256', type: 'uint256' },
          { name: 'spender', internalType: 'address', type: 'address' },
          { name: 'callTarget', internalType: 'address', type: 'address' },
          { name: 'callData', internalType: 'bytes', type: 'bytes' },
          { name: 'value', internalType: 'uint256', type: 'uint256' },
          { name: 'deadline', internalType: 'uint256', type: 'uint256' },
          {
            name: 'payees',
            internalType: 'struct ICobuildSwap.Payee[]',
            type: 'tuple[]',
            components: [
              { name: 'user', internalType: 'address', type: 'address' },
              { name: 'recipient', internalType: 'address', type: 'address' },
              { name: 'amountIn', internalType: 'uint256', type: 'uint256' },
            ],
          },
        ],
      },
    ],
    name: 'executeBatch0x',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 's',
        internalType: 'struct ICobuildSwap.JuiceboxPayMany',
        type: 'tuple',
        components: [
          { name: 'universalRouter', internalType: 'address', type: 'address' },
          { name: 'v3Fee', internalType: 'uint24', type: 'uint24' },
          { name: 'deadline', internalType: 'uint256', type: 'uint256' },
          { name: 'projectToken', internalType: 'address', type: 'address' },
          { name: 'minEthOut', internalType: 'uint256', type: 'uint256' },
          { name: 'memo', internalType: 'string', type: 'string' },
          { name: 'metadata', internalType: 'bytes', type: 'bytes' },
          {
            name: 'payees',
            internalType: 'struct ICobuildSwap.Payee[]',
            type: 'tuple[]',
            components: [
              { name: 'user', internalType: 'address', type: 'address' },
              { name: 'recipient', internalType: 'address', type: 'address' },
              { name: 'amountIn', internalType: 'uint256', type: 'uint256' },
            ],
          },
        ],
      },
    ],
    name: 'executeJuiceboxPayMany',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'universalRouter', internalType: 'address', type: 'address' },
      {
        name: 's',
        internalType: 'struct ICobuildSwap.ZoraCreatorCoinOneToMany',
        type: 'tuple',
        components: [
          {
            name: 'key',
            internalType: 'struct PoolKey',
            type: 'tuple',
            components: [
              { name: 'currency0', internalType: 'Currency', type: 'address' },
              { name: 'currency1', internalType: 'Currency', type: 'address' },
              { name: 'fee', internalType: 'uint24', type: 'uint24' },
              { name: 'tickSpacing', internalType: 'int24', type: 'int24' },
              {
                name: 'hooks',
                internalType: 'contract IHooks',
                type: 'address',
              },
            ],
          },
          { name: 'v3Fee', internalType: 'uint24', type: 'uint24' },
          { name: 'deadline', internalType: 'uint256', type: 'uint256' },
          { name: 'minZoraOut', internalType: 'uint256', type: 'uint256' },
          { name: 'minCreatorOut', internalType: 'uint128', type: 'uint128' },
          {
            name: 'payees',
            internalType: 'struct ICobuildSwap.Payee[]',
            type: 'tuple[]',
            components: [
              { name: 'user', internalType: 'address', type: 'address' },
              { name: 'recipient', internalType: 'address', type: 'address' },
              { name: 'amountIn', internalType: 'uint256', type: 'uint256' },
            ],
          },
        ],
      },
    ],
    name: 'executeZoraCreatorCoinOneToMany',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'executor',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'feeBps',
    outputs: [{ name: '', internalType: 'uint16', type: 'uint16' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'feeCollector',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_usdc', internalType: 'address', type: 'address' },
      { name: '_zora', internalType: 'address', type: 'address' },
      { name: '_universalRouter', internalType: 'address', type: 'address' },
      { name: '_jbDirectory', internalType: 'address', type: 'address' },
      { name: '_jbTokens', internalType: 'address', type: 'address' },
      { name: '_weth9', internalType: 'address', type: 'address' },
      { name: '_executor', internalType: 'address', type: 'address' },
      { name: '_feeCollector', internalType: 'address', type: 'address' },
      { name: '_feeBps', internalType: 'uint16', type: 'uint16' },
      { name: '_minFeeAbsolute', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'minFeeAbsolute',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'pendingOwner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'proxiableUUID',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address payable', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'rescueETH',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'token', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'rescueTokens',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'e', internalType: 'address', type: 'address' }],
    name: 'setExecutor',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'bps', internalType: 'uint16', type: 'uint16' }],
    name: 'setFeeBps',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'c', internalType: 'address', type: 'address' }],
    name: 'setFeeCollector',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'directory', internalType: 'address', type: 'address' },
      { name: 'tokens', internalType: 'address', type: 'address' },
    ],
    name: 'setJuiceboxAddresses',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'minAbs', internalType: 'uint256', type: 'uint256' }],
    name: 'setMinFeeAbsolute',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'r', internalType: 'address', type: 'address' },
      { name: 'allowed', internalType: 'bool', type: 'bool' },
    ],
    name: 'setRouterAllowed',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 's', internalType: 'address', type: 'address' },
      { name: 'allowed', internalType: 'bool', type: 'bool' },
    ],
    name: 'setSpenderAllowed',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'newImplementation', internalType: 'address', type: 'address' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'upgradeToAndCall',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'tokenIn',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'tokenOut',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amountIn',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'amountOut',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      { name: 'fee', internalType: 'uint256', type: 'uint256', indexed: false },
      {
        name: 'router',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'BatchReactionSwap',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'oldExec',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newExec',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'ExecutorChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'feeBps',
        internalType: 'uint16',
        type: 'uint16',
        indexed: false,
      },
      {
        name: 'feeCollector',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'FeeParamsChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'version',
        internalType: 'uint64',
        type: 'uint64',
        indexed: false,
      },
    ],
    name: 'Initialized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'directory',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'tokens',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'JuiceboxAddressesUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'minFeeAbsolute',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'MinFeeAbsoluteChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferStarted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'router',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      { name: 'allowed', internalType: 'bool', type: 'bool', indexed: false },
    ],
    name: 'RouterAllowed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'spender',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      { name: 'allowed', internalType: 'bool', type: 'bool', indexed: false },
    ],
    name: 'SpenderAllowed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'implementation',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'Upgraded',
  },
  { type: 'error', inputs: [], name: 'AMOUNT_LT_MIN_FEE' },
  {
    type: 'error',
    inputs: [{ name: 'target', internalType: 'address', type: 'address' }],
    name: 'AddressEmptyCode',
  },
  { type: 'error', inputs: [], name: 'BAD_BATCH_SIZE' },
  {
    type: 'error',
    inputs: [
      { name: 'implementation', internalType: 'address', type: 'address' },
    ],
    name: 'ERC1967InvalidImplementation',
  },
  { type: 'error', inputs: [], name: 'ERC1967NonPayable' },
  { type: 'error', inputs: [], name: 'ETH_TRANSFER_FAIL' },
  { type: 'error', inputs: [], name: 'EXPIRED_DEADLINE' },
  { type: 'error', inputs: [], name: 'FEE_TOO_HIGH' },
  { type: 'error', inputs: [], name: 'FailedCall' },
  { type: 'error', inputs: [], name: 'INVALID_ADDRESS' },
  { type: 'error', inputs: [], name: 'INVALID_AMOUNTS' },
  { type: 'error', inputs: [], name: 'INVALID_MIN_OUT' },
  { type: 'error', inputs: [], name: 'INVALID_TOKEN_OUT' },
  { type: 'error', inputs: [], name: 'INVALID_V3_FEE' },
  { type: 'error', inputs: [], name: 'InvalidInitialization' },
  { type: 'error', inputs: [], name: 'JB_TOKEN_UNAVAILABLE' },
  { type: 'error', inputs: [], name: 'NET_AMOUNT_ZERO' },
  { type: 'error', inputs: [], name: 'NOT_EXECUTOR' },
  { type: 'error', inputs: [], name: 'NO_ETH_TERMINAL' },
  { type: 'error', inputs: [], name: 'NotInitializing' },
  {
    type: 'error',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'OwnableInvalidOwner',
  },
  {
    type: 'error',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'OwnableUnauthorizedAccount',
  },
  { type: 'error', inputs: [], name: 'PATH_IN_MISMATCH' },
  { type: 'error', inputs: [], name: 'ROUTER_NOT_ALLOWED' },
  { type: 'error', inputs: [], name: 'ReentrancyGuardReentrantCall' },
  { type: 'error', inputs: [], name: 'SLIPPAGE' },
  { type: 'error', inputs: [], name: 'SPENDER_NOT_ALLOWED' },
  {
    type: 'error',
    inputs: [{ name: 'token', internalType: 'address', type: 'address' }],
    name: 'SafeERC20FailedOperation',
  },
  { type: 'error', inputs: [], name: 'UUPSUnauthorizedCallContext' },
  {
    type: 'error',
    inputs: [{ name: 'slot', internalType: 'bytes32', type: 'bytes32' }],
    name: 'UUPSUnsupportedProxiableUUID',
  },
  { type: 'error', inputs: [], name: 'ZERO_ADDR' },
  { type: 'error', inputs: [], name: 'ZERO_MINT_TO_BENEFICIARY' },
] as const

/**
 * [__View Contract on Base Basescan__](https://basescan.org/address/0x21a580054e7a5e833f38033f2d958e00e4c50f0f)
 */
export const cobuildSwapImplAddress = {
  8453: '0x21a580054e7A5E833F38033F2d958E00E4C50F0f',
} as const

/**
 * [__View Contract on Base Basescan__](https://basescan.org/address/0x21a580054e7a5e833f38033f2d958e00e4c50f0f)
 */
export const cobuildSwapImplConfig = {
  address: cobuildSwapImplAddress,
  abi: cobuildSwapImplAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// CobuildTerminal
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * [__View Contract on Base Basescan__](https://basescan.org/address/0x5f4eF83207FbaCe6f66f670865A8F2a0D4A689D7)
 */
export const cobuildTerminalAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: 'directory',
        internalType: 'contract IJBDirectory',
        type: 'address',
      },
      { name: 'cobuildToken', internalType: 'address', type: 'address' },
      { name: 'cobuildRevnetId', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'COBUILD_REVNET_ID',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'COBUILD_TOKEN',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'DIRECTORY',
    outputs: [
      { name: '', internalType: 'contract IJBDirectory', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'uint256', type: 'uint256' },
      { name: 'token', internalType: 'address', type: 'address' },
    ],
    name: 'accountingContextForTokenOf',
    outputs: [
      {
        name: '',
        internalType: 'struct JBAccountingContext',
        type: 'tuple',
        components: [
          { name: 'token', internalType: 'address', type: 'address' },
          { name: 'decimals', internalType: 'uint8', type: 'uint8' },
          { name: 'currency', internalType: 'uint32', type: 'uint32' },
        ],
      },
    ],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'accountingContextsOf',
    outputs: [
      {
        name: 'contexts',
        internalType: 'struct JBAccountingContext[]',
        type: 'tuple[]',
        components: [
          { name: 'token', internalType: 'address', type: 'address' },
          { name: 'decimals', internalType: 'uint8', type: 'uint8' },
          { name: 'currency', internalType: 'uint32', type: 'uint32' },
        ],
      },
    ],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'uint256', type: 'uint256' },
      {
        name: '',
        internalType: 'struct JBAccountingContext[]',
        type: 'tuple[]',
        components: [
          { name: 'token', internalType: 'address', type: 'address' },
          { name: 'decimals', internalType: 'uint8', type: 'uint8' },
          { name: 'currency', internalType: 'uint32', type: 'uint32' },
        ],
      },
    ],
    name: 'addAccountingContextsFor',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'uint256', type: 'uint256' },
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'uint256', type: 'uint256' },
      { name: '', internalType: 'bool', type: 'bool' },
      { name: '', internalType: 'string', type: 'string' },
      { name: '', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'addToBalanceOf',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'uint256', type: 'uint256' },
      {
        name: '',
        internalType: 'struct JBAccountingContext[]',
        type: 'tuple[]',
        components: [
          { name: 'token', internalType: 'address', type: 'address' },
          { name: 'decimals', internalType: 'uint8', type: 'uint8' },
          { name: 'currency', internalType: 'uint32', type: 'uint32' },
        ],
      },
      { name: '', internalType: 'uint256', type: 'uint256' },
      { name: '', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'currentSurplusOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'uint256', type: 'uint256' },
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'contract IJBTerminal', type: 'address' },
    ],
    name: 'migrateBalanceOf',
    outputs: [{ name: 'balance', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'projectId', internalType: 'uint256', type: 'uint256' },
      { name: 'token', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
      { name: 'beneficiary', internalType: 'address', type: 'address' },
      { name: 'minReturnedTokens', internalType: 'uint256', type: 'uint256' },
      { name: 'memo', internalType: 'string', type: 'string' },
      { name: 'metadata', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'pay',
    outputs: [
      {
        name: 'beneficiaryTokenCount',
        internalType: 'uint256',
        type: 'uint256',
      },
    ],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'pure',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'projectId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'returnedFees',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      { name: 'memo', internalType: 'string', type: 'string', indexed: false },
      {
        name: 'metadata',
        internalType: 'bytes',
        type: 'bytes',
        indexed: false,
      },
      {
        name: 'caller',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'AddToBalance',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'hook',
        internalType: 'contract IJBPayHook',
        type: 'address',
        indexed: true,
      },
      {
        name: 'context',
        internalType: 'struct JBAfterPayRecordedContext',
        type: 'tuple',
        components: [
          { name: 'payer', internalType: 'address', type: 'address' },
          { name: 'projectId', internalType: 'uint256', type: 'uint256' },
          { name: 'rulesetId', internalType: 'uint256', type: 'uint256' },
          {
            name: 'amount',
            internalType: 'struct JBTokenAmount',
            type: 'tuple',
            components: [
              { name: 'token', internalType: 'address', type: 'address' },
              { name: 'decimals', internalType: 'uint8', type: 'uint8' },
              { name: 'currency', internalType: 'uint32', type: 'uint32' },
              { name: 'value', internalType: 'uint256', type: 'uint256' },
            ],
          },
          {
            name: 'forwardedAmount',
            internalType: 'struct JBTokenAmount',
            type: 'tuple',
            components: [
              { name: 'token', internalType: 'address', type: 'address' },
              { name: 'decimals', internalType: 'uint8', type: 'uint8' },
              { name: 'currency', internalType: 'uint32', type: 'uint32' },
              { name: 'value', internalType: 'uint256', type: 'uint256' },
            ],
          },
          { name: 'weight', internalType: 'uint256', type: 'uint256' },
          {
            name: 'newlyIssuedTokenCount',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'beneficiary', internalType: 'address', type: 'address' },
          { name: 'hookMetadata', internalType: 'bytes', type: 'bytes' },
          { name: 'payerMetadata', internalType: 'bytes', type: 'bytes' },
        ],
        indexed: false,
      },
      {
        name: 'specificationAmount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'caller',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'HookAfterRecordPay',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'projectId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'token',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'to',
        internalType: 'contract IJBTerminal',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'caller',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'MigrateTerminal',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'rulesetId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'rulesetCycleNumber',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'projectId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'payer',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'beneficiary',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'newlyIssuedTokenCount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      { name: 'memo', internalType: 'string', type: 'string', indexed: false },
      {
        name: 'metadata',
        internalType: 'bytes',
        type: 'bytes',
        indexed: false,
      },
      {
        name: 'caller',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'Pay',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'projectId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'context',
        internalType: 'struct JBAccountingContext',
        type: 'tuple',
        components: [
          { name: 'token', internalType: 'address', type: 'address' },
          { name: 'decimals', internalType: 'uint8', type: 'uint8' },
          { name: 'currency', internalType: 'uint32', type: 'uint32' },
        ],
        indexed: false,
      },
      {
        name: 'caller',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'SetAccountingContext',
  },
  { type: 'error', inputs: [], name: 'ADDRESS_ZERO' },
  { type: 'error', inputs: [], name: 'DEST_TERMINAL_IS_SELF' },
  { type: 'error', inputs: [], name: 'INCORRECT_VALUE' },
  { type: 'error', inputs: [], name: 'NO_COBUILD_ETH_TERMINAL' },
  { type: 'error', inputs: [], name: 'NO_DEST_TERMINAL' },
  { type: 'error', inputs: [], name: 'NO_VALUE' },
  { type: 'error', inputs: [], name: 'ReentrancyGuardReentrantCall' },
  {
    type: 'error',
    inputs: [{ name: 'token', internalType: 'address', type: 'address' }],
    name: 'SafeERC20FailedOperation',
  },
  { type: 'error', inputs: [], name: 'UNSUPPORTED_CALL' },
  {
    type: 'error',
    inputs: [{ name: 'token', internalType: 'address', type: 'address' }],
    name: 'UNSUPPORTED_TOKEN',
  },
  { type: 'error', inputs: [], name: 'ZERO_COBUILD_OUT' },
] as const

/**
 * [__View Contract on Base Basescan__](https://basescan.org/address/0x5f4eF83207FbaCe6f66f670865A8F2a0D4A689D7)
 */
export const cobuildTerminalAddress = {
  8453: '0x5f4eF83207FbaCe6f66f670865A8F2a0D4A689D7',
} as const

/**
 * [__View Contract on Base Basescan__](https://basescan.org/address/0x5f4eF83207FbaCe6f66f670865A8F2a0D4A689D7)
 */
export const cobuildTerminalConfig = {
  address: cobuildTerminalAddress,
  abi: cobuildTerminalAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ERC20VotesArbitrator
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * [__View Contract on Base Basescan__](https://basescan.org/address/0x94BF66E1d1E4C5532680f394C8B25C1070E80aFD)
 */
export const erc20VotesArbitratorAbi = [
  { type: 'constructor', inputs: [], stateMutability: 'nonpayable' },
  {
    type: 'function',
    inputs: [],
    name: 'DEFAULT_SLASH_CALLER_BOUNTY_BPS',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'DEFAULT_WRONG_OR_MISSED_SLASH_BPS',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'MAX_ARBITRATION_COST',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'MAX_REVEAL_PERIOD',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'MAX_SLASH_CALLER_BOUNTY_BPS',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'MAX_VOTING_DELAY',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'MAX_VOTING_PERIOD',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'MIN_ARBITRATION_COST',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'MIN_REVEAL_PERIOD',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'MIN_VOTING_DELAY',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'MIN_VOTING_PERIOD',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: '_arbitrationCost',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: '_revealPeriod',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: '_votingDelay',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: '_votingPeriod',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'arbitrable',
    outputs: [
      { name: '', internalType: 'contract IArbitrable', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_extraData', internalType: 'bytes', type: 'bytes' }],
    name: 'arbitrationCost',
    outputs: [{ name: 'cost', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'disputeId', internalType: 'uint256', type: 'uint256' },
      { name: 'commitHash', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'commitVote',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'disputeId', internalType: 'uint256', type: 'uint256' },
      { name: 'voter', internalType: 'address', type: 'address' },
      { name: 'commitHash', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'commitVoteFor',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'disputeId', internalType: 'uint256', type: 'uint256' },
      { name: 'round', internalType: 'uint256', type: 'uint256' },
      { name: 'voter', internalType: 'address', type: 'address' },
      { name: 'choice', internalType: 'uint256', type: 'uint256' },
      { name: 'reason', internalType: 'string', type: 'string' },
      { name: 'salt', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'computeCommitHash',
    outputs: [{ name: 'commitHash', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_choices', internalType: 'uint256', type: 'uint256' },
      { name: '_extraData', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'createDispute',
    outputs: [{ name: 'disputeID', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'disputeId', internalType: 'uint256', type: 'uint256' }],
    name: 'currentRoundState',
    outputs: [
      {
        name: '',
        internalType: 'enum ArbitratorStorageV1.DisputeState',
        type: 'uint8',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'disputeId', internalType: 'uint256', type: 'uint256' }],
    name: 'currentRuling',
    outputs: [
      { name: '', internalType: 'enum IArbitrable.Party', type: 'uint8' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'disputeCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'disputeId', internalType: 'uint256', type: 'uint256' }],
    name: 'disputeStatus',
    outputs: [
      {
        name: '',
        internalType: 'enum IArbitrator.DisputeStatus',
        type: 'uint8',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'disputes',
    outputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'arbitrable', internalType: 'address', type: 'address' },
      { name: 'executed', internalType: 'bool', type: 'bool' },
      { name: 'currentRound', internalType: 'uint256', type: 'uint256' },
      { name: 'choices', internalType: 'uint256', type: 'uint256' },
      { name: 'winningChoice', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'disputeId', internalType: 'uint256', type: 'uint256' }],
    name: 'executeRuling',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'fixedBudgetTreasury',
    outputs: [
      { name: 'budgetTreasury', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getArbitratorParamsForFactory',
    outputs: [
      {
        name: '',
        internalType: 'struct IArbitrator.ArbitratorParams',
        type: 'tuple',
        components: [
          { name: 'votingPeriod', internalType: 'uint256', type: 'uint256' },
          { name: 'votingDelay', internalType: 'uint256', type: 'uint256' },
          { name: 'revealPeriod', internalType: 'uint256', type: 'uint256' },
          { name: 'arbitrationCost', internalType: 'uint256', type: 'uint256' },
          {
            name: 'wrongOrMissedSlashBps',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'slashCallerBountyBps',
            internalType: 'uint256',
            type: 'uint256',
          },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'disputeId', internalType: 'uint256', type: 'uint256' },
      { name: 'voter', internalType: 'address', type: 'address' },
    ],
    name: 'getReceipt',
    outputs: [
      {
        name: '',
        internalType: 'struct ArbitratorStorageV1.Receipt',
        type: 'tuple',
        components: [
          { name: 'hasCommitted', internalType: 'bool', type: 'bool' },
          { name: 'hasRevealed', internalType: 'bool', type: 'bool' },
          { name: 'commitHash', internalType: 'bytes32', type: 'bytes32' },
          { name: 'choice', internalType: 'uint256', type: 'uint256' },
          { name: 'votes', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'disputeId', internalType: 'uint256', type: 'uint256' },
      { name: 'round', internalType: 'uint256', type: 'uint256' },
      { name: 'voter', internalType: 'address', type: 'address' },
    ],
    name: 'getReceiptByRound',
    outputs: [
      {
        name: '',
        internalType: 'struct ArbitratorStorageV1.Receipt',
        type: 'tuple',
        components: [
          { name: 'hasCommitted', internalType: 'bool', type: 'bool' },
          { name: 'hasRevealed', internalType: 'bool', type: 'bool' },
          { name: 'commitHash', internalType: 'bytes32', type: 'bytes32' },
          { name: 'choice', internalType: 'uint256', type: 'uint256' },
          { name: 'votes', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'disputeId', internalType: 'uint256', type: 'uint256' },
      { name: 'round', internalType: 'uint256', type: 'uint256' },
      { name: 'voter', internalType: 'address', type: 'address' },
    ],
    name: 'getRewardsForRound',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'disputeId', internalType: 'uint256', type: 'uint256' },
      { name: 'round', internalType: 'uint256', type: 'uint256' },
      { name: 'voter', internalType: 'address', type: 'address' },
    ],
    name: 'getSlashRewardsForRound',
    outputs: [
      { name: 'goalAmount', internalType: 'uint256', type: 'uint256' },
      { name: 'cobuildAmount', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'disputeId', internalType: 'uint256', type: 'uint256' },
      { name: 'round', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getTotalVotesByRound',
    outputs: [{ name: 'totalVotes', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'disputeId', internalType: 'uint256', type: 'uint256' },
      { name: 'round', internalType: 'uint256', type: 'uint256' },
      { name: 'voter', internalType: 'address', type: 'address' },
    ],
    name: 'getVoterRoundStatus',
    outputs: [
      {
        name: 'status',
        internalType: 'struct IERC20VotesArbitrator.VoterRoundStatus',
        type: 'tuple',
        components: [
          { name: 'hasCommitted', internalType: 'bool', type: 'bool' },
          { name: 'hasRevealed', internalType: 'bool', type: 'bool' },
          { name: 'commitHash', internalType: 'bytes32', type: 'bytes32' },
          { name: 'choice', internalType: 'uint256', type: 'uint256' },
          { name: 'votes', internalType: 'uint256', type: 'uint256' },
          { name: 'rewardsClaimed', internalType: 'bool', type: 'bool' },
          { name: 'slashedOrProcessed', internalType: 'bool', type: 'bool' },
          { name: 'claimableReward', internalType: 'uint256', type: 'uint256' },
          {
            name: 'claimableGoalSlashReward',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'claimableCobuildSlashReward',
            internalType: 'uint256',
            type: 'uint256',
          },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'disputeId', internalType: 'uint256', type: 'uint256' },
      { name: 'round', internalType: 'uint256', type: 'uint256' },
      { name: 'choice', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getVotesByRound',
    outputs: [
      { name: 'choiceVotes', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'disputeId', internalType: 'uint256', type: 'uint256' },
      { name: 'round', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getVotingRoundInfo',
    outputs: [
      {
        name: 'info',
        internalType: 'struct IERC20VotesArbitrator.VotingRoundInfo',
        type: 'tuple',
        components: [
          { name: 'state', internalType: 'uint8', type: 'uint8' },
          { name: 'votingStartTime', internalType: 'uint256', type: 'uint256' },
          { name: 'votingEndTime', internalType: 'uint256', type: 'uint256' },
          {
            name: 'revealPeriodStartTime',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'revealPeriodEndTime',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'creationBlock', internalType: 'uint256', type: 'uint256' },
          { name: 'cost', internalType: 'uint256', type: 'uint256' },
          { name: 'totalVotes', internalType: 'uint256', type: 'uint256' },
          { name: 'requesterVotes', internalType: 'uint256', type: 'uint256' },
          { name: 'challengerVotes', internalType: 'uint256', type: 'uint256' },
          {
            name: 'ruling',
            internalType: 'enum IArbitrable.Party',
            type: 'uint8',
          },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'config',
        internalType: 'struct IERC20VotesArbitrator.InitConfig',
        type: 'tuple',
        components: [
          {
            name: 'invalidRoundRewardsSink',
            internalType: 'address',
            type: 'address',
          },
          { name: 'votingToken', internalType: 'address', type: 'address' },
          { name: 'arbitrable', internalType: 'address', type: 'address' },
          { name: 'votingPeriod', internalType: 'uint256', type: 'uint256' },
          { name: 'votingDelay', internalType: 'uint256', type: 'uint256' },
          { name: 'revealPeriod', internalType: 'uint256', type: 'uint256' },
          { name: 'arbitrationCost', internalType: 'uint256', type: 'uint256' },
          { name: 'stakeVault', internalType: 'address', type: 'address' },
          {
            name: 'fixedBudgetTreasury',
            internalType: 'address',
            type: 'address',
          },
          {
            name: 'wrongOrMissedSlashBps',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'slashCallerBountyBps',
            internalType: 'uint256',
            type: 'uint256',
          },
        ],
      },
    ],
    name: 'initializeWithConfig',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'invalidRoundRewardsSink',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'disputeId', internalType: 'uint256', type: 'uint256' },
      { name: 'round', internalType: 'uint256', type: 'uint256' },
      { name: 'voter', internalType: 'address', type: 'address' },
    ],
    name: 'isVoterSlashedOrProcessed',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'disputeId', internalType: 'uint256', type: 'uint256' },
      { name: 'voter', internalType: 'address', type: 'address' },
      { name: 'choice', internalType: 'uint256', type: 'uint256' },
      { name: 'reason', internalType: 'string', type: 'string' },
      { name: 'salt', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'revealVote',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'slashCallerBountyBps',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'disputeId', internalType: 'uint256', type: 'uint256' },
      { name: 'round', internalType: 'uint256', type: 'uint256' },
      { name: 'voter', internalType: 'address', type: 'address' },
    ],
    name: 'slashVoter',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'disputeId', internalType: 'uint256', type: 'uint256' },
      { name: 'round', internalType: 'uint256', type: 'uint256' },
      { name: 'voters', internalType: 'address[]', type: 'address[]' },
    ],
    name: 'slashVoters',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'stakeVault',
    outputs: [{ name: 'vault', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'disputeId', internalType: 'uint256', type: 'uint256' },
      { name: 'voter', internalType: 'address', type: 'address' },
    ],
    name: 'votingPowerInCurrentRound',
    outputs: [
      { name: '', internalType: 'uint256', type: 'uint256' },
      { name: '', internalType: 'bool', type: 'bool' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'disputeId', internalType: 'uint256', type: 'uint256' },
      { name: 'round', internalType: 'uint256', type: 'uint256' },
      { name: 'voter', internalType: 'address', type: 'address' },
    ],
    name: 'votingPowerInRound',
    outputs: [
      { name: '', internalType: 'uint256', type: 'uint256' },
      { name: '', internalType: 'bool', type: 'bool' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'votingToken',
    outputs: [
      { name: 'token', internalType: 'contract IVotes', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'disputeId', internalType: 'uint256', type: 'uint256' },
      { name: 'round', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'withdrawInvalidRoundRewards',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'disputeId', internalType: 'uint256', type: 'uint256' },
      { name: 'round', internalType: 'uint256', type: 'uint256' },
      { name: 'voter', internalType: 'address', type: 'address' },
    ],
    name: 'withdrawVoterRewards',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'wrongOrMissedSlashBps',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: false },
      {
        name: 'arbitrable',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'votingStartTime',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'votingEndTime',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'revealPeriodEndTime',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'creationBlock',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'arbitrationCost',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'extraData',
        internalType: 'bytes',
        type: 'bytes',
        indexed: false,
      },
      {
        name: 'choices',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'DisputeCreated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: '_disputeID',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: '_arbitrable',
        internalType: 'contract IArbitrable',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'DisputeCreation',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'disputeId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'ruling',
        internalType: 'enum IArbitrable.Party',
        type: 'uint8',
        indexed: false,
      },
    ],
    name: 'DisputeExecuted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'version',
        internalType: 'uint64',
        type: 'uint64',
        indexed: false,
      },
    ],
    name: 'Initialized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'disputeId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'round',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'voter',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'RewardWithdrawn',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'oldSlashCallerBountyBps',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'newSlashCallerBountyBps',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'SlashCallerBountyBpsSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'disputeId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'round',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'voter',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'goalAmount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'cobuildAmount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'SlashRewardsWithdrawn',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'voter',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'disputeId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'commitHash',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: false,
      },
    ],
    name: 'VoteCommitted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'voter',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'disputeId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'commitHash',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: false,
      },
      {
        name: 'choice',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'reason',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
      {
        name: 'votes',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'VoteRevealed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'disputeId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'round',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'voter',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'snapshotVotes',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'slashWeight',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'missedReveal',
        internalType: 'bool',
        type: 'bool',
        indexed: false,
      },
      {
        name: 'recipient',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'VoterSlashed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'oldWrongOrMissedSlashBps',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'newWrongOrMissedSlashBps',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'WrongOrMissedSlashBpsSet',
  },
  { type: 'error', inputs: [], name: 'ALREADY_REVEALED_VOTE' },
  { type: 'error', inputs: [], name: 'DISPUTE_ALREADY_EXECUTED' },
  { type: 'error', inputs: [], name: 'DISPUTE_NOT_SOLVED' },
  { type: 'error', inputs: [], name: 'HASHES_DO_NOT_MATCH' },
  { type: 'error', inputs: [], name: 'INVALID_ARBITRABLE_ADDRESS' },
  { type: 'error', inputs: [], name: 'INVALID_ARBITRATION_COST' },
  { type: 'error', inputs: [], name: 'INVALID_DISPUTE_CHOICES' },
  { type: 'error', inputs: [], name: 'INVALID_DISPUTE_ID' },
  { type: 'error', inputs: [], name: 'INVALID_FIXED_BUDGET_CONTEXT' },
  { type: 'error', inputs: [], name: 'INVALID_INVALID_ROUND_REWARD_SINK' },
  { type: 'error', inputs: [], name: 'INVALID_REVEAL_PERIOD' },
  { type: 'error', inputs: [], name: 'INVALID_ROUND' },
  { type: 'error', inputs: [], name: 'INVALID_SLASH_CALLER_BOUNTY_BPS' },
  { type: 'error', inputs: [], name: 'INVALID_STAKE_VAULT_ADDRESS' },
  {
    type: 'error',
    inputs: [],
    name: 'INVALID_STAKE_VAULT_BUDGET_STAKE_LEDGER',
  },
  { type: 'error', inputs: [], name: 'INVALID_STAKE_VAULT_GOAL_TREASURY' },
  { type: 'error', inputs: [], name: 'INVALID_VOTE_CHOICE' },
  { type: 'error', inputs: [], name: 'INVALID_VOTING_DELAY' },
  { type: 'error', inputs: [], name: 'INVALID_VOTING_PERIOD' },
  { type: 'error', inputs: [], name: 'INVALID_VOTING_TOKEN_ADDRESS' },
  { type: 'error', inputs: [], name: 'INVALID_VOTING_TOKEN_COMPATIBILITY' },
  {
    type: 'error',
    inputs: [{ name: 'decimals', internalType: 'uint8', type: 'uint8' }],
    name: 'INVALID_VOTING_TOKEN_DECIMALS',
  },
  { type: 'error', inputs: [], name: 'INVALID_WRONG_OR_MISSED_SLASH_BPS' },
  { type: 'error', inputs: [], name: 'InvalidInitialization' },
  { type: 'error', inputs: [], name: 'NO_COMMITTED_VOTE' },
  { type: 'error', inputs: [], name: 'NO_VOTES' },
  { type: 'error', inputs: [], name: 'NotInitializing' },
  { type: 'error', inputs: [], name: 'ONLY_ARBITRABLE' },
  { type: 'error', inputs: [], name: 'REWARD_ALREADY_CLAIMED' },
  { type: 'error', inputs: [], name: 'ReentrancyGuardReentrantCall' },
  { type: 'error', inputs: [], name: 'STAKE_VAULT_ALREADY_SET' },
  { type: 'error', inputs: [], name: 'STAKE_VAULT_NOT_SET' },
  {
    type: 'error',
    inputs: [{ name: 'token', internalType: 'address', type: 'address' }],
    name: 'SafeERC20FailedOperation',
  },
  { type: 'error', inputs: [], name: 'UNAUTHORIZED_DELEGATE' },
  { type: 'error', inputs: [], name: 'VOTER_ALREADY_VOTED' },
  { type: 'error', inputs: [], name: 'VOTER_HAS_NOT_VOTED' },
  { type: 'error', inputs: [], name: 'VOTER_HAS_NO_VOTES' },
  { type: 'error', inputs: [], name: 'VOTER_ON_LOSING_SIDE' },
  { type: 'error', inputs: [], name: 'VOTES_WERE_CAST' },
  { type: 'error', inputs: [], name: 'VOTING_CLOSED' },
] as const

/**
 * [__View Contract on Base Basescan__](https://basescan.org/address/0x94BF66E1d1E4C5532680f394C8B25C1070E80aFD)
 */
export const erc20VotesArbitratorAddress = {
  8453: '0x94BF66E1d1E4C5532680f394C8B25C1070E80aFD',
} as const

/**
 * [__View Contract on Base Basescan__](https://basescan.org/address/0x94BF66E1d1E4C5532680f394C8B25C1070E80aFD)
 */
export const erc20VotesArbitratorConfig = {
  address: erc20VotesArbitratorAddress,
  abi: erc20VotesArbitratorAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Flow
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * [__View Contract on Base Basescan__](https://basescan.org/address/0x6ff0Ff68b783dbBE1663BAedF858459C9D51C841)
 */
export const flowAbi = [
  {
    type: 'function',
    inputs: [
      {
        name: 'expectedTargetOutflowRate',
        internalType: 'int96',
        type: 'int96',
      },
    ],
    name: '_refreshOutflowFromCachedTarget',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_recipientId', internalType: 'bytes32', type: 'bytes32' },
      {
        name: '_metadata',
        internalType: 'struct FlowTypes.RecipientMetadata',
        type: 'tuple',
        components: [
          { name: 'title', internalType: 'string', type: 'string' },
          { name: 'description', internalType: 'string', type: 'string' },
          { name: 'image', internalType: 'string', type: 'string' },
          { name: 'tagline', internalType: 'string', type: 'string' },
          { name: 'url', internalType: 'string', type: 'string' },
        ],
      },
      { name: '_recipientAdmin', internalType: 'address', type: 'address' },
      { name: '_flowOperator', internalType: 'address', type: 'address' },
      { name: '_sweeper', internalType: 'address', type: 'address' },
      { name: '_managerRewardPool', internalType: 'address', type: 'address' },
      {
        name: '_managerRewardPoolFlowRatePpm',
        internalType: 'uint32',
        type: 'uint32',
      },
      {
        name: '_strategies',
        internalType: 'contract IAllocationStrategy[]',
        type: 'address[]',
      },
    ],
    name: 'addFlowRecipient',
    outputs: [
      { name: '', internalType: 'bytes32', type: 'bytes32' },
      { name: '', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_recipientId', internalType: 'bytes32', type: 'bytes32' },
      { name: '_recipient', internalType: 'address', type: 'address' },
      {
        name: '_metadata',
        internalType: 'struct FlowTypes.RecipientMetadata',
        type: 'tuple',
        components: [
          { name: 'title', internalType: 'string', type: 'string' },
          { name: 'description', internalType: 'string', type: 'string' },
          { name: 'image', internalType: 'string', type: 'string' },
          { name: 'tagline', internalType: 'string', type: 'string' },
          { name: 'url', internalType: 'string', type: 'string' },
        ],
      },
    ],
    name: 'addRecipient',
    outputs: [
      { name: '', internalType: 'bytes32', type: 'bytes32' },
      { name: '', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'allocationPipeline',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'poolAddress',
        internalType: 'contract ISuperfluidPool',
        type: 'address',
      },
    ],
    name: 'connectPool',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'distributionPool',
    outputs: [
      { name: '', internalType: 'contract ISuperfluidPool', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'flowImplementation',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'flowMetadata',
    outputs: [
      {
        name: '',
        internalType: 'struct FlowTypes.RecipientMetadata',
        type: 'tuple',
        components: [
          { name: 'title', internalType: 'string', type: 'string' },
          { name: 'description', internalType: 'string', type: 'string' },
          { name: 'image', internalType: 'string', type: 'string' },
          { name: 'tagline', internalType: 'string', type: 'string' },
          { name: 'url', internalType: 'string', type: 'string' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'flowOperator',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getActualFlowRate',
    outputs: [{ name: '', internalType: 'int96', type: 'int96' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'strategy', internalType: 'address', type: 'address' },
      { name: 'allocationKey', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getAllocationCommitment',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getChildFlows',
    outputs: [{ name: '', internalType: 'address[]', type: 'address[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'member', internalType: 'address', type: 'address' }],
    name: 'getClaimableBalance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getManagerRewardPoolFlowRate',
    outputs: [{ name: '', internalType: 'int96', type: 'int96' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'memberAddr', internalType: 'address', type: 'address' }],
    name: 'getMemberFlowRate',
    outputs: [{ name: '', internalType: 'int96', type: 'int96' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'memberAddr', internalType: 'address', type: 'address' }],
    name: 'getMemberUnits',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getNetFlowRate',
    outputs: [{ name: '', internalType: 'int96', type: 'int96' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'recipientId', internalType: 'bytes32', type: 'bytes32' }],
    name: 'getRecipientById',
    outputs: [
      {
        name: 'recipient',
        internalType: 'struct FlowTypes.FlowRecipient',
        type: 'tuple',
        components: [
          { name: 'recipient', internalType: 'address', type: 'address' },
          {
            name: 'recipientIndexPlusOne',
            internalType: 'uint32',
            type: 'uint32',
          },
          { name: 'isRemoved', internalType: 'bool', type: 'bool' },
          {
            name: 'recipientType',
            internalType: 'enum FlowTypes.RecipientType',
            type: 'uint8',
          },
          {
            name: 'metadata',
            internalType: 'struct FlowTypes.RecipientMetadata',
            type: 'tuple',
            components: [
              { name: 'title', internalType: 'string', type: 'string' },
              { name: 'description', internalType: 'string', type: 'string' },
              { name: 'image', internalType: 'string', type: 'string' },
              { name: 'tagline', internalType: 'string', type: 'string' },
              { name: 'url', internalType: 'string', type: 'string' },
            ],
          },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'memberAddr', internalType: 'address', type: 'address' }],
    name: 'getTotalReceivedByMember',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'recipientId', internalType: 'bytes32', type: 'bytes32' }],
    name: 'isRecipientEnabled',
    outputs: [{ name: 'enabled', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'managerRewardDistributionPool',
    outputs: [
      { name: '', internalType: 'contract ISuperfluidPool', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'managerRewardPool',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'managerRewardPoolFlowRatePpm',
    outputs: [{ name: '', internalType: 'uint32', type: 'uint32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'parent',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'recipientAdmin',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'recipientCount',
    outputs: [{ name: 'count', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'recipient', internalType: 'address', type: 'address' }],
    name: 'recipientExists',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'recipientIndex', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'recipientIdAtIndex',
    outputs: [
      { name: 'recipientId', internalType: 'bytes32', type: 'bytes32' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'refreshTargetOutflowRate',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'recipientId', internalType: 'bytes32', type: 'bytes32' }],
    name: 'removeRecipient',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'description', internalType: 'string', type: 'string' }],
    name: 'setDescription',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'metadata',
        internalType: 'struct FlowTypes.RecipientMetadata',
        type: 'tuple',
        components: [
          { name: 'title', internalType: 'string', type: 'string' },
          { name: 'description', internalType: 'string', type: 'string' },
          { name: 'image', internalType: 'string', type: 'string' },
          { name: 'tagline', internalType: 'string', type: 'string' },
          { name: 'url', internalType: 'string', type: 'string' },
        ],
      },
    ],
    name: 'setMetadata',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'recipientId', internalType: 'bytes32', type: 'bytes32' },
      { name: 'enabled', internalType: 'bool', type: 'bool' },
    ],
    name: 'setRecipientEnabled',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'newTargetOutflowRate', internalType: 'int96', type: 'int96' },
    ],
    name: 'setTargetOutflowRate',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'strategies',
    outputs: [
      {
        name: '',
        internalType: 'contract IAllocationStrategy[]',
        type: 'address[]',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'superToken',
    outputs: [
      { name: '', internalType: 'contract ISuperToken', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'sweepSuperToken',
    outputs: [{ name: 'swept', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'sweeper',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'targetOutflowRate',
    outputs: [{ name: '', internalType: 'int96', type: 'int96' }],
    stateMutability: 'view',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'strategy',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'allocationKey',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'commit',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: false,
      },
      {
        name: 'weight',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'AllocationCommitted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'strategy',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'allocationKey',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'commit',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: false,
      },
      {
        name: 'weight',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'snapshotVersion',
        internalType: 'uint8',
        type: 'uint8',
        indexed: false,
      },
      {
        name: 'packedSnapshot',
        internalType: 'bytes',
        type: 'bytes',
        indexed: false,
      },
    ],
    name: 'AllocationSnapshotUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'recipientId',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'recipient',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'strategy',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'recipientAdmin',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'flowOperator',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'sweeper',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'managerRewardPool',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'ChildFlowDeployed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'recipientAdmin',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'superToken',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'flowImplementation',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'flowOperator',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'sweeper',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'managerRewardPool',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'allocationPipeline',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'parent',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'distributionPool',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'managerRewardPoolFlowRatePpm',
        internalType: 'uint32',
        type: 'uint32',
        indexed: false,
      },
      {
        name: 'strategy',
        internalType: 'contract IAllocationStrategy',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'FlowInitialized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'recipientId',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'recipient',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'distributionPool',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'managerRewardPoolFlowRatePpm',
        internalType: 'uint32',
        type: 'uint32',
        indexed: false,
      },
    ],
    name: 'FlowRecipientCreated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'version',
        internalType: 'uint64',
        type: 'uint64',
        indexed: false,
      },
    ],
    name: 'Initialized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'metadata',
        internalType: 'struct FlowTypes.RecipientMetadata',
        type: 'tuple',
        components: [
          { name: 'title', internalType: 'string', type: 'string' },
          { name: 'description', internalType: 'string', type: 'string' },
          { name: 'image', internalType: 'string', type: 'string' },
          { name: 'tagline', internalType: 'string', type: 'string' },
          { name: 'url', internalType: 'string', type: 'string' },
        ],
        indexed: false,
      },
    ],
    name: 'MetadataSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'recipientId',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'recipient',
        internalType: 'struct FlowTypes.FlowRecipient',
        type: 'tuple',
        components: [
          { name: 'recipient', internalType: 'address', type: 'address' },
          {
            name: 'recipientIndexPlusOne',
            internalType: 'uint32',
            type: 'uint32',
          },
          { name: 'isRemoved', internalType: 'bool', type: 'bool' },
          {
            name: 'recipientType',
            internalType: 'enum FlowTypes.RecipientType',
            type: 'uint8',
          },
          {
            name: 'metadata',
            internalType: 'struct FlowTypes.RecipientMetadata',
            type: 'tuple',
            components: [
              { name: 'title', internalType: 'string', type: 'string' },
              { name: 'description', internalType: 'string', type: 'string' },
              { name: 'image', internalType: 'string', type: 'string' },
              { name: 'tagline', internalType: 'string', type: 'string' },
              { name: 'url', internalType: 'string', type: 'string' },
            ],
          },
        ],
        indexed: false,
      },
      {
        name: 'approvedBy',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'RecipientCreated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'recipient',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'recipientId',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
    ],
    name: 'RecipientRemoved',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'caller',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'SuperTokenSwept',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'caller',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'oldRate', internalType: 'int96', type: 'int96', indexed: false },
      { name: 'newRate', internalType: 'int96', type: 'int96', indexed: false },
    ],
    name: 'TargetOutflowRateUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'targetOutflowRate',
        internalType: 'int96',
        type: 'int96',
        indexed: false,
      },
      { name: 'reason', internalType: 'bytes', type: 'bytes', indexed: false },
    ],
    name: 'TargetOutflowRefreshFailed',
  },
  { type: 'error', inputs: [], name: 'ADDRESS_ZERO' },
  {
    type: 'error',
    inputs: [
      { name: 'strategyCount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ALLOCATION_LEDGER_REQUIRES_SINGLE_STRATEGY',
  },
  { type: 'error', inputs: [], name: 'ALLOCATION_MUST_BE_POSITIVE' },
  { type: 'error', inputs: [], name: 'ARRAY_LENGTH_MISMATCH' },
  { type: 'error', inputs: [], name: 'FLOW_RATE_NEGATIVE' },
  { type: 'error', inputs: [], name: 'FLOW_RATE_TOO_HIGH' },
  {
    type: 'error',
    inputs: [
      { name: 'strategyCount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'FLOW_REQUIRES_SINGLE_STRATEGY',
  },
  {
    type: 'error',
    inputs: [
      { name: 'allocationLedger', internalType: 'address', type: 'address' },
    ],
    name: 'INVALID_ALLOCATION_LEDGER',
  },
  {
    type: 'error',
    inputs: [
      { name: 'expectedFlow', internalType: 'address', type: 'address' },
      { name: 'configuredFlow', internalType: 'address', type: 'address' },
    ],
    name: 'INVALID_ALLOCATION_LEDGER_FLOW',
  },
  {
    type: 'error',
    inputs: [
      { name: 'allocationLedger', internalType: 'address', type: 'address' },
      { name: 'goalTreasury', internalType: 'address', type: 'address' },
    ],
    name: 'INVALID_ALLOCATION_LEDGER_GOAL_TREASURY',
  },
  {
    type: 'error',
    inputs: [
      { name: 'goalTreasury', internalType: 'address', type: 'address' },
      { name: 'stakeVault', internalType: 'address', type: 'address' },
    ],
    name: 'INVALID_ALLOCATION_LEDGER_STAKE_VAULT',
  },
  {
    type: 'error',
    inputs: [
      { name: 'allocationPipeline', internalType: 'address', type: 'address' },
    ],
    name: 'INVALID_ALLOCATION_PIPELINE',
  },
  { type: 'error', inputs: [], name: 'INVALID_METADATA' },
  { type: 'error', inputs: [], name: 'INVALID_PREV_ALLOCATION' },
  { type: 'error', inputs: [], name: 'INVALID_RATE_PPM' },
  { type: 'error', inputs: [], name: 'INVALID_RECIPIENT_ID' },
  { type: 'error', inputs: [], name: 'INVALID_SCALED_SUM' },
  { type: 'error', inputs: [], name: 'InvalidInitialization' },
  {
    type: 'error',
    inputs: [],
    name: 'MANAGER_REWARD_POOL_RECIPIENT_NOT_ALLOWED',
  },
  { type: 'error', inputs: [], name: 'NESTED_FLOW_RECIPIENTS_DISABLED' },
  { type: 'error', inputs: [], name: 'NOT_ABLE_TO_ALLOCATE' },
  { type: 'error', inputs: [], name: 'NOT_ALLOWED_TO_CONNECT_POOL' },
  { type: 'error', inputs: [], name: 'NOT_APPROVED_RECIPIENT' },
  {
    type: 'error',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'NOT_A_CONTRACT',
  },
  { type: 'error', inputs: [], name: 'NOT_FLOW_OPERATOR_OR_PARENT' },
  { type: 'error', inputs: [], name: 'NOT_RECIPIENT_ADMIN' },
  { type: 'error', inputs: [], name: 'NOT_SORTED_OR_DUPLICATE' },
  { type: 'error', inputs: [], name: 'NOT_SWEEPER' },
  { type: 'error', inputs: [], name: 'NotInitializing' },
  {
    type: 'error',
    inputs: [{ name: 'strategy', internalType: 'address', type: 'address' }],
    name: 'ONLY_DEFAULT_STRATEGY_ALLOWED',
  },
  { type: 'error', inputs: [], name: 'ONLY_SELF_OUTFLOW_REFRESH' },
  { type: 'error', inputs: [], name: 'OVERFLOW' },
  { type: 'error', inputs: [], name: 'POOL_CONNECTION_FAILED' },
  {
    type: 'error',
    inputs: [
      { name: 'recipientsLength', internalType: 'uint256', type: 'uint256' },
      { name: 'allocationsLength', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'RECIPIENTS_ALLOCATIONS_MISMATCH',
  },
  { type: 'error', inputs: [], name: 'RECIPIENT_ALREADY_EXISTS' },
  { type: 'error', inputs: [], name: 'RECIPIENT_ALREADY_REMOVED' },
  { type: 'error', inputs: [], name: 'RECIPIENT_NOT_FOUND' },
  { type: 'error', inputs: [], name: 'ReentrancyGuardReentrantCall' },
  { type: 'error', inputs: [], name: 'SELF_RECIPIENT_NOT_ALLOWED' },
  { type: 'error', inputs: [], name: 'TOO_FEW_RECIPIENTS' },
  { type: 'error', inputs: [], name: 'TRANSFER_FAILED' },
  { type: 'error', inputs: [], name: 'UNITS_UPDATE_FAILED' },
] as const

/**
 * [__View Contract on Base Basescan__](https://basescan.org/address/0x6ff0Ff68b783dbBE1663BAedF858459C9D51C841)
 */
export const flowAddress = {
  8453: '0x6ff0Ff68b783dbBE1663BAedF858459C9D51C841',
} as const

/**
 * [__View Contract on Base Basescan__](https://basescan.org/address/0x6ff0Ff68b783dbBE1663BAedF858459C9D51C841)
 */
export const flowConfig = { address: flowAddress, abi: flowAbi } as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// GoalFactory
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * [__View Contract on Base Basescan__](https://basescan.org/address/0x47e83655026b6cAAD68D32919f165CE9C3Bd8a8F)
 */
export const goalFactoryAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: 'revDeployer',
        internalType: 'contract IREVDeployer',
        type: 'address',
      },
      {
        name: 'superfluidHost',
        internalType: 'contract ISuperfluid',
        type: 'address',
      },
      {
        name: 'budgetTcrFactory',
        internalType: 'contract BudgetTCRFactory',
        type: 'address',
      },
      { name: 'cobuildToken', internalType: 'address', type: 'address' },
      { name: 'cobuildRevnetId', internalType: 'uint256', type: 'uint256' },
      { name: 'cobuildTerminal', internalType: 'address', type: 'address' },
      { name: 'jbMultiTerminal', internalType: 'address', type: 'address' },
      { name: 'buybackHookDataHook', internalType: 'address', type: 'address' },
      { name: 'buybackHook', internalType: 'address', type: 'address' },
      { name: 'goalTreasuryImpl', internalType: 'address', type: 'address' },
      { name: 'stakeVaultImpl', internalType: 'address', type: 'address' },
      { name: 'flowImpl', internalType: 'address', type: 'address' },
      { name: 'splitHookImpl', internalType: 'address', type: 'address' },
      {
        name: 'budgetStakeLedgerImpl',
        internalType: 'address',
        type: 'address',
      },
      {
        name: 'goalFlowAllocationLedgerPipelineImpl',
        internalType: 'address',
        type: 'address',
      },
      { name: 'premiumEscrowImpl', internalType: 'address', type: 'address' },
      {
        name: 'jurorSlasherRouterImpl',
        internalType: 'address',
        type: 'address',
      },
      {
        name: 'underwriterSlasherRouterImpl',
        internalType: 'address',
        type: 'address',
      },
      {
        name: 'defaultSubmissionDepositStrategy',
        internalType: 'address',
        type: 'address',
      },
      {
        name: 'defaultAllocationMechanismAdmin',
        internalType: 'address',
        type: 'address',
      },
      {
        name: 'defaultInvalidRoundRewardsSink',
        internalType: 'address',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'BUDGET_STAKE_LEDGER_IMPL',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'BUDGET_TCR_FACTORY',
    outputs: [
      { name: '', internalType: 'contract BudgetTCRFactory', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'BUYBACK_HOOK',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'BUYBACK_HOOK_DATA_HOOK',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'COBUILD_DECIMALS',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'COBUILD_REVNET_ID',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'COBUILD_TERMINAL',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'COBUILD_TOKEN',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'DEFAULT_ALLOCATION_MECHANISM_ADMIN',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'DEFAULT_INVALID_ROUND_REWARDS_SINK',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'DEFAULT_SUBMISSION_DEPOSIT_STRATEGY',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'FLOW_IMPL',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'GOAL_FLOW_ALLOCATION_LEDGER_PIPELINE_IMPL',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'GOAL_TREASURY_IMPL',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'JB_MULTI_TERMINAL',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'JUROR_SLASHER_ROUTER_IMPL',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'PREMIUM_ESCROW_IMPL',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'REV_DEPLOYER',
    outputs: [
      { name: '', internalType: 'contract IREVDeployer', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'SPLIT_HOOK_IMPL',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'STAKE_VAULT_IMPL',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'SUPERFLUID_HOST',
    outputs: [
      { name: '', internalType: 'contract ISuperfluid', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'UNDERWRITER_SLASHER_ROUTER_IMPL',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'p',
        internalType: 'struct GoalFactory.DeployParams',
        type: 'tuple',
        components: [
          {
            name: 'revnet',
            internalType: 'struct GoalFactory.RevnetParams',
            type: 'tuple',
            components: [
              { name: 'name', internalType: 'string', type: 'string' },
              { name: 'ticker', internalType: 'string', type: 'string' },
              { name: 'uri', internalType: 'string', type: 'string' },
              {
                name: 'initialIssuance',
                internalType: 'uint112',
                type: 'uint112',
              },
              {
                name: 'cashOutTaxRate',
                internalType: 'uint16',
                type: 'uint16',
              },
              {
                name: 'reservedPercent',
                internalType: 'uint16',
                type: 'uint16',
              },
              {
                name: 'durationSeconds',
                internalType: 'uint32',
                type: 'uint32',
              },
            ],
          },
          {
            name: 'timing',
            internalType: 'struct GoalFactory.GoalTimingParams',
            type: 'tuple',
            components: [
              { name: 'minRaise', internalType: 'uint256', type: 'uint256' },
              {
                name: 'minRaiseDurationSeconds',
                internalType: 'uint32',
                type: 'uint32',
              },
            ],
          },
          {
            name: 'success',
            internalType: 'struct GoalFactory.SuccessParams',
            type: 'tuple',
            components: [
              {
                name: 'successResolver',
                internalType: 'address',
                type: 'address',
              },
              {
                name: 'successAssertionLiveness',
                internalType: 'uint64',
                type: 'uint64',
              },
              {
                name: 'successAssertionBond',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'successOracleSpecHash',
                internalType: 'bytes32',
                type: 'bytes32',
              },
              {
                name: 'successAssertionPolicyHash',
                internalType: 'bytes32',
                type: 'bytes32',
              },
            ],
          },
          {
            name: 'flowMetadata',
            internalType: 'struct GoalFactory.FlowMetadataParams',
            type: 'tuple',
            components: [
              { name: 'title', internalType: 'string', type: 'string' },
              { name: 'description', internalType: 'string', type: 'string' },
              { name: 'image', internalType: 'string', type: 'string' },
              { name: 'tagline', internalType: 'string', type: 'string' },
              { name: 'url', internalType: 'string', type: 'string' },
            ],
          },
          {
            name: 'underwriting',
            internalType: 'struct GoalFactory.UnderwritingParams',
            type: 'tuple',
            components: [
              {
                name: 'budgetPremiumPpm',
                internalType: 'uint32',
                type: 'uint32',
              },
              {
                name: 'budgetSlashPpm',
                internalType: 'uint32',
                type: 'uint32',
              },
            ],
          },
          {
            name: 'budgetTCR',
            internalType: 'struct GoalFactory.BudgetTCRParams',
            type: 'tuple',
            components: [
              {
                name: 'allocationMechanismAdmin',
                internalType: 'address',
                type: 'address',
              },
              {
                name: 'invalidRoundRewardsSink',
                internalType: 'address',
                type: 'address',
              },
              {
                name: 'submissionDepositStrategy',
                internalType: 'address',
                type: 'address',
              },
              {
                name: 'submissionBaseDeposit',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'removalBaseDeposit',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'submissionChallengeBaseDeposit',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'removalChallengeBaseDeposit',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'registrationMetaEvidence',
                internalType: 'string',
                type: 'string',
              },
              {
                name: 'clearingMetaEvidence',
                internalType: 'string',
                type: 'string',
              },
              {
                name: 'challengePeriodDuration',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'arbitratorExtraData',
                internalType: 'bytes',
                type: 'bytes',
              },
              {
                name: 'budgetBounds',
                internalType: 'struct IBudgetTCR.BudgetValidationBounds',
                type: 'tuple',
                components: [
                  {
                    name: 'minFundingLeadTime',
                    internalType: 'uint64',
                    type: 'uint64',
                  },
                  {
                    name: 'maxFundingHorizon',
                    internalType: 'uint64',
                    type: 'uint64',
                  },
                  {
                    name: 'minExecutionDuration',
                    internalType: 'uint64',
                    type: 'uint64',
                  },
                  {
                    name: 'maxExecutionDuration',
                    internalType: 'uint64',
                    type: 'uint64',
                  },
                  {
                    name: 'minActivationThreshold',
                    internalType: 'uint256',
                    type: 'uint256',
                  },
                  {
                    name: 'maxActivationThreshold',
                    internalType: 'uint256',
                    type: 'uint256',
                  },
                  {
                    name: 'maxRunwayCap',
                    internalType: 'uint256',
                    type: 'uint256',
                  },
                ],
              },
              {
                name: 'oracleBounds',
                internalType: 'struct IBudgetTCR.OracleValidationBounds',
                type: 'tuple',
                components: [
                  { name: 'liveness', internalType: 'uint64', type: 'uint64' },
                  {
                    name: 'bondAmount',
                    internalType: 'uint256',
                    type: 'uint256',
                  },
                ],
              },
              {
                name: 'budgetSuccessResolver',
                internalType: 'address',
                type: 'address',
              },
              {
                name: 'arbitratorParams',
                internalType: 'struct IArbitrator.ArbitratorParams',
                type: 'tuple',
                components: [
                  {
                    name: 'votingPeriod',
                    internalType: 'uint256',
                    type: 'uint256',
                  },
                  {
                    name: 'votingDelay',
                    internalType: 'uint256',
                    type: 'uint256',
                  },
                  {
                    name: 'revealPeriod',
                    internalType: 'uint256',
                    type: 'uint256',
                  },
                  {
                    name: 'arbitrationCost',
                    internalType: 'uint256',
                    type: 'uint256',
                  },
                  {
                    name: 'wrongOrMissedSlashBps',
                    internalType: 'uint256',
                    type: 'uint256',
                  },
                  {
                    name: 'slashCallerBountyBps',
                    internalType: 'uint256',
                    type: 'uint256',
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
    name: 'deployGoal',
    outputs: [
      {
        name: 'out',
        internalType: 'struct GoalFactory.DeployedGoalStack',
        type: 'tuple',
        components: [
          { name: 'goalRevnetId', internalType: 'uint256', type: 'uint256' },
          { name: 'goalToken', internalType: 'address', type: 'address' },
          { name: 'goalSuperToken', internalType: 'address', type: 'address' },
          { name: 'goalTreasury', internalType: 'address', type: 'address' },
          { name: 'goalFlow', internalType: 'address', type: 'address' },
          {
            name: 'goalFlowAllocationLedgerPipeline',
            internalType: 'address',
            type: 'address',
          },
          { name: 'stakeVault', internalType: 'address', type: 'address' },
          {
            name: 'budgetStakeLedger',
            internalType: 'address',
            type: 'address',
          },
          { name: 'splitHook', internalType: 'address', type: 'address' },
          {
            name: 'jurorSlasherRouter',
            internalType: 'address',
            type: 'address',
          },
          {
            name: 'underwriterSlasherRouter',
            internalType: 'address',
            type: 'address',
          },
          { name: 'successResolver', internalType: 'address', type: 'address' },
          { name: 'budgetTCR', internalType: 'address', type: 'address' },
          { name: 'arbitrator', internalType: 'address', type: 'address' },
        ],
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'caller',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'goalRevnetId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'stack',
        internalType: 'struct GoalFactory.DeployedGoalStack',
        type: 'tuple',
        components: [
          { name: 'goalRevnetId', internalType: 'uint256', type: 'uint256' },
          { name: 'goalToken', internalType: 'address', type: 'address' },
          { name: 'goalSuperToken', internalType: 'address', type: 'address' },
          { name: 'goalTreasury', internalType: 'address', type: 'address' },
          { name: 'goalFlow', internalType: 'address', type: 'address' },
          {
            name: 'goalFlowAllocationLedgerPipeline',
            internalType: 'address',
            type: 'address',
          },
          { name: 'stakeVault', internalType: 'address', type: 'address' },
          {
            name: 'budgetStakeLedger',
            internalType: 'address',
            type: 'address',
          },
          { name: 'splitHook', internalType: 'address', type: 'address' },
          {
            name: 'jurorSlasherRouter',
            internalType: 'address',
            type: 'address',
          },
          {
            name: 'underwriterSlasherRouter',
            internalType: 'address',
            type: 'address',
          },
          { name: 'successResolver', internalType: 'address', type: 'address' },
          { name: 'budgetTCR', internalType: 'address', type: 'address' },
          { name: 'arbitrator', internalType: 'address', type: 'address' },
        ],
        indexed: false,
      },
    ],
    name: 'GoalDeployed',
  },
  { type: 'error', inputs: [], name: 'ADDRESS_ZERO' },
  {
    type: 'error',
    inputs: [
      { name: 'predicted', internalType: 'address', type: 'address' },
      { name: 'deployed', internalType: 'address', type: 'address' },
    ],
    name: 'BUDGET_TCR_ADDRESS_MISMATCH',
  },
  { type: 'error', inputs: [], name: 'FailedDeployment' },
  { type: 'error', inputs: [], name: 'INVALID_ASSERTION_CONFIG' },
  {
    type: 'error',
    inputs: [{ name: 'terminal', internalType: 'address', type: 'address' }],
    name: 'INVALID_COBUILD_NATIVE_TERMINAL',
  },
  {
    type: 'error',
    inputs: [
      { name: 'expected', internalType: 'address', type: 'address' },
      { name: 'actual', internalType: 'address', type: 'address' },
      { name: 'revnetId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'INVALID_COBUILD_REVNET_TOKEN',
  },
  {
    type: 'error',
    inputs: [
      { name: 'expected', internalType: 'address', type: 'address' },
      { name: 'actual', internalType: 'address', type: 'address' },
    ],
    name: 'INVALID_COBUILD_TERMINAL_DIRECTORY',
  },
  {
    type: 'error',
    inputs: [
      { name: 'expected', internalType: 'uint256', type: 'uint256' },
      { name: 'actual', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'INVALID_COBUILD_TERMINAL_REVNET_ID',
  },
  {
    type: 'error',
    inputs: [
      { name: 'expected', internalType: 'address', type: 'address' },
      { name: 'actual', internalType: 'address', type: 'address' },
    ],
    name: 'INVALID_COBUILD_TERMINAL_TOKEN',
  },
  { type: 'error', inputs: [], name: 'INVALID_DURATION' },
  {
    type: 'error',
    inputs: [
      {
        name: 'minRaiseDurationSeconds',
        internalType: 'uint32',
        type: 'uint32',
      },
      { name: 'goalDurationSeconds', internalType: 'uint32', type: 'uint32' },
    ],
    name: 'INVALID_MIN_RAISE_WINDOW',
  },
  { type: 'error', inputs: [], name: 'INVALID_RESERVED_PERCENT' },
  { type: 'error', inputs: [], name: 'INVALID_SCALE' },
  { type: 'error', inputs: [], name: 'INVALID_TAX_RATE' },
  {
    type: 'error',
    inputs: [
      { name: 'budgetPremiumPpm', internalType: 'uint32', type: 'uint32' },
      { name: 'budgetSlashPpm', internalType: 'uint32', type: 'uint32' },
    ],
    name: 'INVALID_UNDERWRITING_SLASH_CONFIG',
  },
  {
    type: 'error',
    inputs: [
      { name: 'balance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'InsufficientBalance',
  },
  {
    type: 'error',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'NOT_A_CONTRACT',
  },
] as const

/**
 * [__View Contract on Base Basescan__](https://basescan.org/address/0x47e83655026b6cAAD68D32919f165CE9C3Bd8a8F)
 */
export const goalFactoryAddress = {
  8453: '0x47e83655026b6cAAD68D32919f165CE9C3Bd8a8F',
} as const

/**
 * [__View Contract on Base Basescan__](https://basescan.org/address/0x47e83655026b6cAAD68D32919f165CE9C3Bd8a8F)
 */
export const goalFactoryConfig = {
  address: goalFactoryAddress,
  abi: goalFactoryAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// GoalFlowAllocationLedgerPipeline
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * [__View Contract on Base Basescan__](https://basescan.org/address/0x0c449732D3Da563073B6B2126660A857C9dcE124)
 */
export const goalFlowAllocationLedgerPipelineAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: 'allocationLedger_', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'allocationLedger',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'budgetTreasury', internalType: 'address', type: 'address' },
    ],
    name: 'childSyncDebt',
    outputs: [
      {
        name: 'debt',
        internalType:
          'struct GoalFlowAllocationLedgerPipeline.ChildSyncDebtView',
        type: 'tuple',
        components: [
          { name: 'exists', internalType: 'bool', type: 'bool' },
          { name: 'childFlow', internalType: 'address', type: 'address' },
          { name: 'childStrategy', internalType: 'address', type: 'address' },
          { name: 'allocationKey', internalType: 'uint256', type: 'uint256' },
          { name: 'reason', internalType: 'bytes32', type: 'bytes32' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'childSyncDebtCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'allocationLedger_', internalType: 'address', type: 'address' },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'strategy', internalType: 'address', type: 'address' },
      { name: 'allocationKey', internalType: 'uint256', type: 'uint256' },
      { name: 'prevWeight', internalType: 'uint256', type: 'uint256' },
      {
        name: 'prevRecipientIds',
        internalType: 'bytes32[]',
        type: 'bytes32[]',
      },
      {
        name: 'prevAllocationsPpm',
        internalType: 'uint32[]',
        type: 'uint32[]',
      },
      { name: 'newWeight', internalType: 'uint256', type: 'uint256' },
      { name: 'newRecipientIds', internalType: 'bytes32[]', type: 'bytes32[]' },
      { name: 'newAllocationsPpm', internalType: 'uint32[]', type: 'uint32[]' },
      {
        name: 'commitKind',
        internalType: 'enum IAllocationPipeline.CommitKind',
        type: 'uint8',
      },
    ],
    name: 'onAllocationCommitted',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'strategy', internalType: 'address', type: 'address' },
      { name: 'allocationKey', internalType: 'uint256', type: 'uint256' },
      { name: 'prevWeight', internalType: 'uint256', type: 'uint256' },
      {
        name: 'prevRecipientIds',
        internalType: 'bytes32[]',
        type: 'bytes32[]',
      },
      {
        name: 'prevAllocationsPpm',
        internalType: 'uint32[]',
        type: 'uint32[]',
      },
      { name: 'newRecipientIds', internalType: 'bytes32[]', type: 'bytes32[]' },
      { name: 'newAllocationsPpm', internalType: 'uint32[]', type: 'uint32[]' },
    ],
    name: 'previewChildSyncRequirements',
    outputs: [
      {
        name: 'reqs',
        internalType: 'struct ICustomFlow.ChildSyncRequirement[]',
        type: 'tuple[]',
        components: [
          { name: 'budgetTreasury', internalType: 'address', type: 'address' },
          { name: 'childFlow', internalType: 'address', type: 'address' },
          { name: 'childStrategy', internalType: 'address', type: 'address' },
          { name: 'allocationKey', internalType: 'uint256', type: 'uint256' },
          { name: 'expectedCommit', internalType: 'bytes32', type: 'bytes32' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'budgetTreasury', internalType: 'address', type: 'address' },
    ],
    name: 'repairChildSyncDebt',
    outputs: [{ name: 'cleared', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'flow', internalType: 'address', type: 'address' }],
    name: 'validateForFlow',
    outputs: [],
    stateMutability: 'view',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'budgetTreasury',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'childFlow',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'strategy',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'allocationKey',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'parentFlow',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'parentStrategy',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'parentAllocationKey',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      { name: 'success', internalType: 'bool', type: 'bool', indexed: false },
    ],
    name: 'ChildAllocationSyncAttempted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'budgetTreasury',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'childFlow',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'strategy',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'allocationKey',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'parentFlow',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'parentStrategy',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'parentAllocationKey',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      { name: 'reason', internalType: 'bytes', type: 'bytes', indexed: false },
    ],
    name: 'ChildAllocationSyncFailed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'budgetTreasury',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'childFlow',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'parentFlow',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'parentStrategy',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'parentAllocationKey',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'reason',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: false,
      },
    ],
    name: 'ChildAllocationSyncSkipped',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'budgetTreasury',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'childFlow',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'reason',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: false,
      },
    ],
    name: 'ChildSyncDebtCleared',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'budgetTreasury',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'childFlow',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'childStrategy',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'allocationKey',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'reason',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: false,
      },
    ],
    name: 'ChildSyncDebtOpened',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'version',
        internalType: 'uint64',
        type: 'uint64',
        indexed: false,
      },
    ],
    name: 'Initialized',
  },
  {
    type: 'error',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'debtCount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ACCOUNT_HAS_CHILD_SYNC_DEBT',
  },
  {
    type: 'error',
    inputs: [
      { name: 'strategyCount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ALLOCATION_LEDGER_REQUIRES_SINGLE_STRATEGY',
  },
  {
    type: 'error',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'budgetTreasury', internalType: 'address', type: 'address' },
    ],
    name: 'CHILD_SYNC_DEBT_NOT_FOUND',
  },
  {
    type: 'error',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'budgetTreasury', internalType: 'address', type: 'address' },
      { name: 'reason', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'CHILD_SYNC_DEBT_REPAIR_FAILED',
  },
  {
    type: 'error',
    inputs: [
      { name: 'budgetTreasury', internalType: 'address', type: 'address' },
    ],
    name: 'CHILD_SYNC_TARGET_UNAVAILABLE',
  },
  {
    type: 'error',
    inputs: [
      { name: 'allocationLedger', internalType: 'address', type: 'address' },
    ],
    name: 'INVALID_ALLOCATION_LEDGER',
  },
  {
    type: 'error',
    inputs: [{ name: 'strategy', internalType: 'address', type: 'address' }],
    name: 'INVALID_ALLOCATION_LEDGER_ACCOUNT_RESOLVER',
  },
  {
    type: 'error',
    inputs: [
      { name: 'expectedFlow', internalType: 'address', type: 'address' },
      { name: 'configuredFlow', internalType: 'address', type: 'address' },
    ],
    name: 'INVALID_ALLOCATION_LEDGER_FLOW',
  },
  {
    type: 'error',
    inputs: [
      { name: 'allocationLedger', internalType: 'address', type: 'address' },
      { name: 'goalTreasury', internalType: 'address', type: 'address' },
    ],
    name: 'INVALID_ALLOCATION_LEDGER_GOAL_TREASURY',
  },
  {
    type: 'error',
    inputs: [
      { name: 'goalTreasury', internalType: 'address', type: 'address' },
      { name: 'stakeVault', internalType: 'address', type: 'address' },
    ],
    name: 'INVALID_ALLOCATION_LEDGER_STAKE_VAULT',
  },
  {
    type: 'error',
    inputs: [
      { name: 'strategy', internalType: 'address', type: 'address' },
      { name: 'expectedStakeVault', internalType: 'address', type: 'address' },
      {
        name: 'configuredStakeVault',
        internalType: 'address',
        type: 'address',
      },
    ],
    name: 'INVALID_ALLOCATION_LEDGER_STRATEGY',
  },
  {
    type: 'error',
    inputs: [
      { name: 'strategy', internalType: 'address', type: 'address' },
      { name: 'allocationKey', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'INVALID_ALLOCATION_PIPELINE_KEY_ACCOUNT',
  },
  {
    type: 'error',
    inputs: [
      { name: 'budgetTreasury', internalType: 'address', type: 'address' },
      { name: 'premiumEscrow', internalType: 'address', type: 'address' },
    ],
    name: 'INVALID_BUDGET_PREMIUM_ESCROW',
  },
  { type: 'error', inputs: [], name: 'InvalidInitialization' },
  { type: 'error', inputs: [], name: 'NotInitializing' },
] as const

/**
 * [__View Contract on Base Basescan__](https://basescan.org/address/0x0c449732D3Da563073B6B2126660A857C9dcE124)
 */
export const goalFlowAllocationLedgerPipelineAddress = {
  8453: '0x0c449732D3Da563073B6B2126660A857C9dcE124',
} as const

/**
 * [__View Contract on Base Basescan__](https://basescan.org/address/0x0c449732D3Da563073B6B2126660A857C9dcE124)
 */
export const goalFlowAllocationLedgerPipelineConfig = {
  address: goalFlowAllocationLedgerPipelineAddress,
  abi: goalFlowAllocationLedgerPipelineAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// GoalRevnetSplitHook
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * [__View Contract on Base Basescan__](https://basescan.org/address/0x71f3A823650ed7b8D5d88e30551D0ed78071f20E)
 */
export const goalRevnetSplitHookAbi = [
  { type: 'constructor', inputs: [], stateMutability: 'nonpayable' },
  {
    type: 'function',
    inputs: [],
    name: 'directory',
    outputs: [
      { name: '', internalType: 'contract IJBDirectory', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'flow',
    outputs: [
      { name: 'flow_', internalType: 'contract IFlow', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'goalRevnetId',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'goalTreasury',
    outputs: [
      { name: '', internalType: 'contract IGoalTreasury', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'directory_',
        internalType: 'contract IJBDirectory',
        type: 'address',
      },
      {
        name: 'goalTreasury_',
        internalType: 'contract IGoalTreasury',
        type: 'address',
      },
      { name: 'flow_', internalType: 'contract IFlow', type: 'address' },
      { name: 'goalRevnetId_', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'context',
        internalType: 'struct JBSplitHookContext',
        type: 'tuple',
        components: [
          { name: 'token', internalType: 'address', type: 'address' },
          { name: 'amount', internalType: 'uint256', type: 'uint256' },
          { name: 'decimals', internalType: 'uint256', type: 'uint256' },
          { name: 'projectId', internalType: 'uint256', type: 'uint256' },
          { name: 'groupId', internalType: 'uint256', type: 'uint256' },
          {
            name: 'split',
            internalType: 'struct JBSplit',
            type: 'tuple',
            components: [
              { name: 'percent', internalType: 'uint32', type: 'uint32' },
              { name: 'projectId', internalType: 'uint64', type: 'uint64' },
              {
                name: 'beneficiary',
                internalType: 'address payable',
                type: 'address',
              },
              {
                name: 'preferAddToBalance',
                internalType: 'bool',
                type: 'bool',
              },
              { name: 'lockedUntil', internalType: 'uint48', type: 'uint48' },
              {
                name: 'hook',
                internalType: 'contract IJBSplitHook',
                type: 'address',
              },
            ],
          },
        ],
      },
    ],
    name: 'processSplitWith',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'superToken',
    outputs: [
      {
        name: 'superToken_',
        internalType: 'contract ISuperToken',
        type: 'address',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [],
    name: 'underlyingToken',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'projectId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'sourceToken',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'sourceAmount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'superTokenAmount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      { name: 'accepted', internalType: 'bool', type: 'bool', indexed: false },
      {
        name: 'action',
        internalType: 'enum IGoalTreasury.HookSplitAction',
        type: 'uint8',
        indexed: false,
      },
    ],
    name: 'GoalFundingProcessed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'projectId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'sourceToken',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'sourceAmount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'burnAmount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'GoalSuccessSettlementProcessed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'version',
        internalType: 'uint64',
        type: 'uint64',
        indexed: false,
      },
    ],
    name: 'Initialized',
  },
  { type: 'error', inputs: [], name: 'ADDRESS_ZERO' },
  {
    type: 'error',
    inputs: [
      { name: 'token', internalType: 'address', type: 'address' },
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'beforeBalance', internalType: 'uint256', type: 'uint256' },
      { name: 'afterBalance', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'BALANCE_DECREASED_UNEXPECTEDLY',
  },
  {
    type: 'error',
    inputs: [
      { name: 'token', internalType: 'address', type: 'address' },
      { name: 'expected', internalType: 'uint256', type: 'uint256' },
      { name: 'available', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'INSUFFICIENT_HOOK_BALANCE',
  },
  { type: 'error', inputs: [], name: 'INVALID_GOAL_REVNET_ID' },
  {
    type: 'error',
    inputs: [
      { name: 'expectedProjectId', internalType: 'uint256', type: 'uint256' },
      { name: 'actualProjectId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'INVALID_PROJECT',
  },
  {
    type: 'error',
    inputs: [
      { name: 'expectedToken', internalType: 'address', type: 'address' },
      { name: 'actualToken', internalType: 'address', type: 'address' },
    ],
    name: 'INVALID_SOURCE_TOKEN',
  },
  {
    type: 'error',
    inputs: [
      { name: 'expectedGroupId', internalType: 'uint256', type: 'uint256' },
      { name: 'actualGroupId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'INVALID_SPLIT_GROUP',
  },
  { type: 'error', inputs: [], name: 'InvalidInitialization' },
  {
    type: 'error',
    inputs: [
      { name: 'expected', internalType: 'uint256', type: 'uint256' },
      { name: 'actual', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'NATIVE_VALUE_MISMATCH',
  },
  {
    type: 'error',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'NOT_A_CONTRACT',
  },
  { type: 'error', inputs: [], name: 'NotInitializing' },
  { type: 'error', inputs: [], name: 'ReentrancyGuardReentrantCall' },
  {
    type: 'error',
    inputs: [
      { name: 'expected', internalType: 'uint256', type: 'uint256' },
      { name: 'actual', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'SOURCE_TOKEN_AMOUNT_MISMATCH',
  },
  {
    type: 'error',
    inputs: [{ name: 'token', internalType: 'address', type: 'address' }],
    name: 'SafeERC20FailedOperation',
  },
  { type: 'error', inputs: [], name: 'UNAUTHORIZED_CALLER' },
] as const

/**
 * [__View Contract on Base Basescan__](https://basescan.org/address/0x71f3A823650ed7b8D5d88e30551D0ed78071f20E)
 */
export const goalRevnetSplitHookAddress = {
  8453: '0x71f3A823650ed7b8D5d88e30551D0ed78071f20E',
} as const

/**
 * [__View Contract on Base Basescan__](https://basescan.org/address/0x71f3A823650ed7b8D5d88e30551D0ed78071f20E)
 */
export const goalRevnetSplitHookConfig = {
  address: goalRevnetSplitHookAddress,
  abi: goalRevnetSplitHookAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// GoalStakeVault
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * [__View Contract on Base Basescan__](https://basescan.org/address/0x04F131525e66678e867cA12f56d4aC37839DE2ac)
 */
export const goalStakeVaultAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: 'goalTreasury_', internalType: 'address', type: 'address' },
      { name: 'goalToken_', internalType: 'contract IERC20', type: 'address' },
      {
        name: 'cobuildToken_',
        internalType: 'contract IERC20',
        type: 'address',
      },
      {
        name: 'goalRulesets_',
        internalType: 'contract IJBRulesets',
        type: 'address',
      },
      { name: 'goalRevnetId_', internalType: 'uint256', type: 'uint256' },
      { name: 'paymentTokenDecimals_', internalType: 'uint8', type: 'uint8' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'JUROR_EXIT_DELAY',
    outputs: [{ name: '', internalType: 'uint64', type: 'uint64' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'STRATEGY_KEY',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'accountAllocationWeight',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'allocationKey', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'accountForAllocationKey',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'caller', internalType: 'address', type: 'address' },
      { name: '', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'allocationKey',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'canAccountAllocate',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'key', internalType: 'uint256', type: 'uint256' },
      { name: 'caller', internalType: 'address', type: 'address' },
    ],
    name: 'canAllocate',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'cobuildToken',
    outputs: [{ name: '', internalType: 'contract IERC20', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'key', internalType: 'uint256', type: 'uint256' }],
    name: 'currentWeight',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'amount', internalType: 'uint256', type: 'uint256' }],
    name: 'depositCobuild',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'amount', internalType: 'uint256', type: 'uint256' }],
    name: 'depositGoal',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'finalizeJurorExit',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'user', internalType: 'address', type: 'address' },
      { name: 'blockNumber', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getPastJurorWeight',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'blockNumber', internalType: 'uint256', type: 'uint256' }],
    name: 'getPastTotalJurorWeight',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'goalResolved',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'goalResolvedAt',
    outputs: [{ name: '', internalType: 'uint64', type: 'uint64' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'goalRevnetId',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'goalRulesets',
    outputs: [
      { name: '', internalType: 'contract IJBRulesets', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'goalToken',
    outputs: [{ name: '', internalType: 'contract IERC20', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'goalTreasury',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'goalWeightSnapshot',
    outputs: [{ name: '', internalType: 'uint112', type: 'uint112' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'goalTreasury_', internalType: 'address', type: 'address' },
      { name: 'goalToken_', internalType: 'contract IERC20', type: 'address' },
      {
        name: 'cobuildToken_',
        internalType: 'contract IERC20',
        type: 'address',
      },
      {
        name: 'goalRulesets_',
        internalType: 'contract IJBRulesets',
        type: 'address',
      },
      { name: 'goalRevnetId_', internalType: 'uint256', type: 'uint256' },
      { name: 'paymentTokenDecimals_', internalType: 'uint8', type: 'uint8' },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'juror', internalType: 'address', type: 'address' },
      { name: 'operator', internalType: 'address', type: 'address' },
    ],
    name: 'isAuthorizedJurorOperator',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'user', internalType: 'address', type: 'address' }],
    name: 'jurorDelegateOf',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'user', internalType: 'address', type: 'address' }],
    name: 'jurorLockedGoalOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'jurorSlasher',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'user', internalType: 'address', type: 'address' }],
    name: 'jurorWeightOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'markGoalResolved',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'goalAmount', internalType: 'uint256', type: 'uint256' },
      { name: 'delegate', internalType: 'address', type: 'address' },
    ],
    name: 'optInAsJuror',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'paymentTokenDecimals',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'maxBudgets', internalType: 'uint256', type: 'uint256' }],
    name: 'prepareUnderwriterWithdrawal',
    outputs: [
      { name: 'nextBudgetIndex', internalType: 'uint256', type: 'uint256' },
      { name: 'budgetCount', internalType: 'uint256', type: 'uint256' },
      { name: 'complete', internalType: 'bool', type: 'bool' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'goalAmount', internalType: 'uint256', type: 'uint256' }],
    name: 'quoteGoalToCobuildWeightRatio',
    outputs: [
      { name: 'weightOut', internalType: 'uint256', type: 'uint256' },
      { name: 'snapshotGoalWeight', internalType: 'uint112', type: 'uint112' },
      { name: 'weightScale', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'goalAmount', internalType: 'uint256', type: 'uint256' }],
    name: 'requestJurorExit',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'reservedPercentSnapshot',
    outputs: [{ name: '', internalType: 'uint16', type: 'uint16' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'delegate', internalType: 'address', type: 'address' }],
    name: 'setJurorDelegate',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'slasher', internalType: 'address', type: 'address' }],
    name: 'setJurorSlasher',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'slasher', internalType: 'address', type: 'address' }],
    name: 'setUnderwriterSlasher',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'juror', internalType: 'address', type: 'address' },
      { name: 'weightAmount', internalType: 'uint256', type: 'uint256' },
      { name: 'recipient', internalType: 'address', type: 'address' },
    ],
    name: 'slashJurorStake',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'underwriter', internalType: 'address', type: 'address' },
      { name: 'weightAmount', internalType: 'uint256', type: 'uint256' },
      { name: 'recipient', internalType: 'address', type: 'address' },
    ],
    name: 'slashUnderwriterStake',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'stakeVault',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'user', internalType: 'address', type: 'address' }],
    name: 'stakedCobuildOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'user', internalType: 'address', type: 'address' }],
    name: 'stakedGoalOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'strategyKey',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalJurorWeight',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalStakedCobuild',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalStakedGoal',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalWeight',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'underwriterSlasher',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'underwriter', internalType: 'address', type: 'address' }],
    name: 'underwriterWithdrawalPrepareCursor',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'underwriter', internalType: 'address', type: 'address' }],
    name: 'underwriterWithdrawalPreparedBudgetCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'underwriter', internalType: 'address', type: 'address' }],
    name: 'underwriterWithdrawalPreparedForResolvedAt',
    outputs: [{ name: '', internalType: 'uint64', type: 'uint64' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'user', internalType: 'address', type: 'address' }],
    name: 'weightOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
      { name: 'to', internalType: 'address', type: 'address' },
    ],
    name: 'withdrawCobuild',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
      { name: 'to', internalType: 'address', type: 'address' },
    ],
    name: 'withdrawGoal',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'target',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'selector',
        internalType: 'bytes4',
        type: 'bytes4',
        indexed: true,
      },
      { name: 'reason', internalType: 'bytes', type: 'bytes', indexed: false },
    ],
    name: 'AllocationSyncFailed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'user', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'weightDelta',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'CobuildStaked',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'user', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'CobuildWithdrawn',
  },
  { type: 'event', anonymous: false, inputs: [], name: 'GoalResolved' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'user', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'weightDelta',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'GoalStaked',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'user', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'GoalWithdrawn',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'version',
        internalType: 'uint64',
        type: 'uint64',
        indexed: false,
      },
    ],
    name: 'Initialized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'juror',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'delegate',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'JurorDelegateSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'juror',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'goalAmount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'weightDelta',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'JurorExitFinalized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'juror',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'goalAmount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'requestedAt',
        internalType: 'uint64',
        type: 'uint64',
        indexed: false,
      },
      {
        name: 'availableAt',
        internalType: 'uint64',
        type: 'uint64',
        indexed: false,
      },
    ],
    name: 'JurorExitRequested',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'juror',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'goalAmount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'weightDelta',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'delegate',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'JurorOptedIn',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'juror',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'requestedWeight',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'appliedWeight',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'goalAmount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'recipient',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'JurorSlashed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'slasher',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'JurorSlasherSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'underwriter',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'requestedWeight',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'appliedWeight',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'goalAmount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'cobuildAmount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'recipient',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'UnderwriterSlashed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'slasher',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'UnderwriterSlasherSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'underwriter',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'nextBudgetIndex',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'budgetCount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      { name: 'complete', internalType: 'bool', type: 'bool', indexed: false },
    ],
    name: 'UnderwriterWithdrawalPrepared',
  },
  { type: 'error', inputs: [], name: 'ADDRESS_ZERO' },
  {
    type: 'error',
    inputs: [
      { name: 'token', internalType: 'address', type: 'address' },
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'beforeBalance', internalType: 'uint256', type: 'uint256' },
      { name: 'afterBalance', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'BALANCE_DECREASED_UNEXPECTEDLY',
  },
  {
    type: 'error',
    inputs: [
      { name: 'token', internalType: 'address', type: 'address' },
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'beforeBalance', internalType: 'uint256', type: 'uint256' },
      { name: 'afterBalance', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'BALANCE_INCREASED_UNEXPECTEDLY',
  },
  { type: 'error', inputs: [], name: 'BLOCK_NOT_YET_MINED' },
  { type: 'error', inputs: [], name: 'CheckpointUnorderedInsertion' },
  {
    type: 'error',
    inputs: [
      { name: 'goalDecimals', internalType: 'uint8', type: 'uint8' },
      { name: 'cobuildDecimals', internalType: 'uint8', type: 'uint8' },
    ],
    name: 'DECIMALS_MISMATCH',
  },
  { type: 'error', inputs: [], name: 'EXIT_NOT_READY' },
  { type: 'error', inputs: [], name: 'GOAL_ALREADY_RESOLVED' },
  { type: 'error', inputs: [], name: 'GOAL_NOT_RESOLVED' },
  { type: 'error', inputs: [], name: 'GOAL_STAKING_CLOSED' },
  {
    type: 'error',
    inputs: [{ name: 'goalToken', internalType: 'address', type: 'address' }],
    name: 'GOAL_TOKEN_REVNET_ID_NOT_DERIVABLE',
  },
  {
    type: 'error',
    inputs: [
      { name: 'goalToken', internalType: 'address', type: 'address' },
      { name: 'expectedRevnetId', internalType: 'uint256', type: 'uint256' },
      { name: 'actualRevnetId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'GOAL_TOKEN_REVNET_MISMATCH',
  },
  {
    type: 'error',
    inputs: [],
    name: 'GOAL_TREASURY_WEIGHT_METADATA_UNAVAILABLE',
  },
  { type: 'error', inputs: [], name: 'INSUFFICIENT_STAKED_BALANCE' },
  {
    type: 'error',
    inputs: [{ name: 'key', internalType: 'uint256', type: 'uint256' }],
    name: 'INVALID_ALLOCATION_KEY',
  },
  { type: 'error', inputs: [], name: 'INVALID_AMOUNT' },
  { type: 'error', inputs: [], name: 'INVALID_JUROR_LOCK' },
  { type: 'error', inputs: [], name: 'INVALID_JUROR_SLASHER' },
  {
    type: 'error',
    inputs: [{ name: 'decimals', internalType: 'uint8', type: 'uint8' }],
    name: 'INVALID_PAYMENT_TOKEN_DECIMALS',
  },
  {
    type: 'error',
    inputs: [
      { name: 'reservedPercent', internalType: 'uint16', type: 'uint16' },
    ],
    name: 'INVALID_RESERVED_PERCENT',
  },
  {
    type: 'error',
    inputs: [{ name: 'controller', internalType: 'address', type: 'address' }],
    name: 'INVALID_REVNET_CONTROLLER',
  },
  { type: 'error', inputs: [], name: 'INVALID_UNDERWRITER_SLASHER' },
  { type: 'error', inputs: [], name: 'InvalidInitialization' },
  { type: 'error', inputs: [], name: 'JUROR_SLASHER_ALREADY_SET' },
  { type: 'error', inputs: [], name: 'JUROR_WITHDRAWAL_LOCKED' },
  {
    type: 'error',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'NOT_A_CONTRACT',
  },
  { type: 'error', inputs: [], name: 'NotInitializing' },
  { type: 'error', inputs: [], name: 'ONLY_JUROR_SLASHER' },
  { type: 'error', inputs: [], name: 'ONLY_UNDERWRITER_SLASHER' },
  {
    type: 'error',
    inputs: [
      { name: 'tokenDecimals', internalType: 'uint8', type: 'uint8' },
      { name: 'paymentTokenDecimals', internalType: 'uint8', type: 'uint8' },
    ],
    name: 'PAYMENT_TOKEN_DECIMALS_MISMATCH',
  },
  { type: 'error', inputs: [], name: 'ReentrancyGuardReentrantCall' },
  {
    type: 'error',
    inputs: [
      { name: 'bits', internalType: 'uint8', type: 'uint8' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'SafeCastOverflowedUintDowncast',
  },
  {
    type: 'error',
    inputs: [{ name: 'token', internalType: 'address', type: 'address' }],
    name: 'SafeERC20FailedOperation',
  },
  { type: 'error', inputs: [], name: 'TRANSFER_AMOUNT_MISMATCH' },
  { type: 'error', inputs: [], name: 'UNAUTHORIZED' },
  { type: 'error', inputs: [], name: 'UNDERWRITER_SLASHER_ALREADY_SET' },
  { type: 'error', inputs: [], name: 'UNDERWRITER_WITHDRAWAL_NOT_PREPARED' },
  { type: 'error', inputs: [], name: 'ZERO_WEIGHT_DELTA' },
] as const

/**
 * [__View Contract on Base Basescan__](https://basescan.org/address/0x04F131525e66678e867cA12f56d4aC37839DE2ac)
 */
export const goalStakeVaultAddress = {
  8453: '0x04F131525e66678e867cA12f56d4aC37839DE2ac',
} as const

/**
 * [__View Contract on Base Basescan__](https://basescan.org/address/0x04F131525e66678e867cA12f56d4aC37839DE2ac)
 */
export const goalStakeVaultConfig = {
  address: goalStakeVaultAddress,
  abi: goalStakeVaultAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// GoalTreasury
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * [__View Contract on Base Basescan__](https://basescan.org/address/0xCB87F7dac555F907EA07A00127590479AC4558fb)
 */
export const goalTreasuryAbi = [
  { type: 'constructor', inputs: [], stateMutability: 'nonpayable' },
  {
    type: 'function',
    inputs: [],
    name: 'activatedAt',
    outputs: [{ name: '', internalType: 'uint64', type: 'uint64' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'budgetPremiumPpm',
    outputs: [{ name: '', internalType: 'uint32', type: 'uint32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'budgetSlashPpm',
    outputs: [{ name: '', internalType: 'uint32', type: 'uint32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'budgetStakeLedger',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'canAcceptHookFunding',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'assertionId', internalType: 'bytes32', type: 'bytes32' }],
    name: 'clearSuccessAssertion',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'cobuildRevnetId',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'deadline',
    outputs: [{ name: '', internalType: 'uint64', type: 'uint64' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'deferredHookSuperTokenAmount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'amount', internalType: 'uint256', type: 'uint256' }],
    name: 'donateUnderlyingAndUpgrade',
    outputs: [{ name: 'received', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'flow',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'goalRevnetId',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'goalRulesets',
    outputs: [
      { name: '', internalType: 'contract IJBRulesets', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'hook',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'initialOwner', internalType: 'address', type: 'address' },
      {
        name: 'config',
        internalType: 'struct IGoalTreasury.GoalConfig',
        type: 'tuple',
        components: [
          { name: 'flow', internalType: 'address', type: 'address' },
          { name: 'stakeVault', internalType: 'address', type: 'address' },
          { name: 'jurorSlasher', internalType: 'address', type: 'address' },
          {
            name: 'underwriterSlasher',
            internalType: 'address',
            type: 'address',
          },
          {
            name: 'budgetStakeLedger',
            internalType: 'address',
            type: 'address',
          },
          { name: 'hook', internalType: 'address', type: 'address' },
          { name: 'goalRulesets', internalType: 'address', type: 'address' },
          { name: 'goalRevnetId', internalType: 'uint256', type: 'uint256' },
          { name: 'minRaiseDeadline', internalType: 'uint64', type: 'uint64' },
          { name: 'minRaise', internalType: 'uint256', type: 'uint256' },
          { name: 'budgetPremiumPpm', internalType: 'uint32', type: 'uint32' },
          { name: 'budgetSlashPpm', internalType: 'uint32', type: 'uint32' },
          { name: 'successResolver', internalType: 'address', type: 'address' },
          {
            name: 'successAssertionLiveness',
            internalType: 'uint64',
            type: 'uint64',
          },
          {
            name: 'successAssertionBond',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'successOracleSpecHash',
            internalType: 'bytes32',
            type: 'bytes32',
          },
          {
            name: 'successAssertionPolicyHash',
            internalType: 'bytes32',
            type: 'bytes32',
          },
        ],
      },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'isMintingOpen',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'isReassertGraceActive',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'lifecycleStatus',
    outputs: [
      {
        name: 'status',
        internalType: 'struct IGoalTreasury.GoalLifecycleStatus',
        type: 'tuple',
        components: [
          {
            name: 'currentState',
            internalType: 'enum IGoalTreasury.GoalState',
            type: 'uint8',
          },
          { name: 'isResolved', internalType: 'bool', type: 'bool' },
          { name: 'canAcceptHookFunding', internalType: 'bool', type: 'bool' },
          { name: 'isMintingOpen', internalType: 'bool', type: 'bool' },
          { name: 'isMinRaiseReached', internalType: 'bool', type: 'bool' },
          {
            name: 'isMinRaiseWindowElapsed',
            internalType: 'bool',
            type: 'bool',
          },
          { name: 'isDeadlinePassed', internalType: 'bool', type: 'bool' },
          {
            name: 'hasPendingSuccessAssertion',
            internalType: 'bool',
            type: 'bool',
          },
          { name: 'treasuryBalance', internalType: 'uint256', type: 'uint256' },
          { name: 'minRaise', internalType: 'uint256', type: 'uint256' },
          { name: 'minRaiseDeadline', internalType: 'uint64', type: 'uint64' },
          { name: 'deadline', internalType: 'uint64', type: 'uint64' },
          { name: 'timeRemaining', internalType: 'uint256', type: 'uint256' },
          { name: 'targetFlowRate', internalType: 'int96', type: 'int96' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'minRaise',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'minRaiseDeadline',
    outputs: [{ name: '', internalType: 'uint64', type: 'uint64' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'pendingSuccessAssertionAt',
    outputs: [{ name: '', internalType: 'uint64', type: 'uint64' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'pendingSuccessAssertionId',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'sourceToken', internalType: 'address', type: 'address' },
      { name: 'sourceAmount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'processHookSplit',
    outputs: [
      {
        name: 'action',
        internalType: 'enum IGoalTreasury.HookSplitAction',
        type: 'uint8',
      },
      { name: 'superTokenAmount', internalType: 'uint256', type: 'uint256' },
      { name: 'burnAmount', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'reassertGraceDeadline',
    outputs: [{ name: '', internalType: 'uint64', type: 'uint64' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'reassertGraceUsed',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'amount', internalType: 'uint256', type: 'uint256' }],
    name: 'recordHookFunding',
    outputs: [{ name: 'accepted', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'assertionId', internalType: 'bytes32', type: 'bytes32' }],
    name: 'registerSuccessAssertion',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'resolveSuccess',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'resolved',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'resolvedAt',
    outputs: [{ name: '', internalType: 'uint64', type: 'uint64' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'retryTerminalSideEffects',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'finalState',
        internalType: 'enum IGoalTreasury.GoalState',
        type: 'uint8',
      },
    ],
    name: 'settleDeferredHookFundingForFinalize',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'settleLateResidual',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'finalState',
        internalType: 'enum IGoalTreasury.GoalState',
        type: 'uint8',
      },
    ],
    name: 'settleResidualForFinalize',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'stakeVault',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'state',
    outputs: [
      { name: '', internalType: 'enum IGoalTreasury.GoalState', type: 'uint8' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'successAssertionBond',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'successAssertionLiveness',
    outputs: [{ name: '', internalType: 'uint64', type: 'uint64' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'successAssertionPolicyHash',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'successAt',
    outputs: [{ name: '', internalType: 'uint64', type: 'uint64' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'successOracleSpecHash',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'successResolver',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'superToken',
    outputs: [
      { name: '', internalType: 'contract ISuperToken', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'sync',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'targetFlowRate',
    outputs: [{ name: '', internalType: 'int96', type: 'int96' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'timeRemaining',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalRaised',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'treasuryBalance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'treasuryKind',
    outputs: [
      {
        name: '',
        internalType: 'enum ISuccessAssertionTreasury.TreasuryKind',
        type: 'uint8',
      },
    ],
    stateMutability: 'pure',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'donor',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'sourceToken',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'sourceAmount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'superTokenAmount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'totalRaised',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'DonationRecorded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'flow', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'selector',
        internalType: 'bytes4',
        type: 'bytes4',
        indexed: true,
      },
      {
        name: 'attemptedRate',
        internalType: 'int96',
        type: 'int96',
        indexed: false,
      },
      { name: 'reason', internalType: 'bytes', type: 'bytes', indexed: false },
    ],
    name: 'FlowRateSyncCallFailed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'flow', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'targetRate',
        internalType: 'int96',
        type: 'int96',
        indexed: false,
      },
      {
        name: 'fallbackRate',
        internalType: 'int96',
        type: 'int96',
        indexed: false,
      },
      {
        name: 'currentRate',
        internalType: 'int96',
        type: 'int96',
        indexed: false,
      },
    ],
    name: 'FlowRateSyncManualInterventionRequired',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'targetRate',
        internalType: 'int96',
        type: 'int96',
        indexed: false,
      },
      {
        name: 'appliedRate',
        internalType: 'int96',
        type: 'int96',
        indexed: false,
      },
      {
        name: 'treasuryBalance',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'timeRemaining',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'FlowRateSynced',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'flow', internalType: 'address', type: 'address', indexed: true },
      { name: 'reason', internalType: 'bytes', type: 'bytes', indexed: false },
    ],
    name: 'FlowRateZeroingFailed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'flow',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'stakeVault',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'budgetStakeLedger',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'hook',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'goalRulesets',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'goalRevnetId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'minRaiseDeadline',
        internalType: 'uint64',
        type: 'uint64',
        indexed: false,
      },
      {
        name: 'deadline',
        internalType: 'uint64',
        type: 'uint64',
        indexed: false,
      },
      {
        name: 'minRaise',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'jurorSlasher',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'underwriterSlasher',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'successResolver',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'goalToken',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'cobuildToken',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'GoalConfigured',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'finalState',
        internalType: 'enum IGoalTreasury.GoalState',
        type: 'uint8',
        indexed: false,
      },
    ],
    name: 'GoalFinalized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'finalState',
        internalType: 'enum IGoalTreasury.GoalState',
        type: 'uint8',
        indexed: true,
      },
      {
        name: 'superTokenAmount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'controllerBurnAmount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'HookDeferredFundingSettled',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'sourceToken',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'sourceAmount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'superTokenAmount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'totalDeferredSuperTokenAmount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'HookFundingDeferred',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'totalRaised',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'HookFundingRecorded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'version',
        internalType: 'uint64',
        type: 'uint64',
        indexed: false,
      },
    ],
    name: 'Initialized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'clearedAssertionId',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'graceDeadline',
        internalType: 'uint64',
        type: 'uint64',
        indexed: true,
      },
    ],
    name: 'ReassertGraceActivated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'finalState',
        internalType: 'enum IGoalTreasury.GoalState',
        type: 'uint8',
        indexed: true,
      },
      {
        name: 'totalSettled',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'controllerBurnAmount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ResidualSettled',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousState',
        internalType: 'enum IGoalTreasury.GoalState',
        type: 'uint8',
        indexed: false,
      },
      {
        name: 'newState',
        internalType: 'enum IGoalTreasury.GoalState',
        type: 'uint8',
        indexed: false,
      },
    ],
    name: 'StateTransition',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'assertionId',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
    ],
    name: 'SuccessAssertionCleared',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'assertionId',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'revertData',
        internalType: 'bytes',
        type: 'bytes',
        indexed: false,
      },
    ],
    name: 'SuccessAssertionFinalizeFailed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'assertionId',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'assertedAt',
        internalType: 'uint64',
        type: 'uint64',
        indexed: true,
      },
    ],
    name: 'SuccessAssertionRegistered',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'assertionId',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'reason',
        internalType: 'enum TreasurySuccessAssertions.FailClosedReason',
        type: 'uint8',
        indexed: true,
      },
    ],
    name: 'SuccessAssertionResolutionFailClosed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'revertData',
        internalType: 'bytes',
        type: 'bytes',
        indexed: false,
      },
    ],
    name: 'TerminalDeferredHookFundingSettlementFailed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'revertData',
        internalType: 'bytes',
        type: 'bytes',
        indexed: false,
      },
    ],
    name: 'TerminalFlowStopFailed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'revertData',
        internalType: 'bytes',
        type: 'bytes',
        indexed: false,
      },
    ],
    name: 'TerminalResidualSettlementFailed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'revertData',
        internalType: 'bytes',
        type: 'bytes',
        indexed: false,
      },
    ],
    name: 'TerminalStakeVaultResolutionFailed',
  },
  { type: 'error', inputs: [], name: 'ADDRESS_ZERO' },
  {
    type: 'error',
    inputs: [
      { name: 'expected', internalType: 'address', type: 'address' },
      { name: 'actual', internalType: 'address', type: 'address' },
    ],
    name: 'BUDGET_STAKE_LEDGER_GOAL_MISMATCH',
  },
  {
    type: 'error',
    inputs: [
      { name: 'cobuildToken', internalType: 'address', type: 'address' },
    ],
    name: 'COBUILD_REVNET_ID_NOT_DERIVABLE',
  },
  {
    type: 'error',
    inputs: [
      { name: 'cobuildToken', internalType: 'address', type: 'address' },
      { name: 'reason', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'COBUILD_REVNET_ID_NOT_DERIVABLE_WITH_REASON',
  },
  { type: 'error', inputs: [], name: 'DEADLINE_NOT_DERIVABLE' },
  {
    type: 'error',
    inputs: [
      { name: 'expected', internalType: 'address', type: 'address' },
      { name: 'flowOperator', internalType: 'address', type: 'address' },
      { name: 'sweeper', internalType: 'address', type: 'address' },
    ],
    name: 'FLOW_AUTHORITY_MISMATCH',
  },
  { type: 'error', inputs: [], name: 'GOAL_DEADLINE_PASSED' },
  {
    type: 'error',
    inputs: [{ name: 'goalToken', internalType: 'address', type: 'address' }],
    name: 'GOAL_TOKEN_REVNET_ID_NOT_DERIVABLE',
  },
  {
    type: 'error',
    inputs: [
      { name: 'goalToken', internalType: 'address', type: 'address' },
      { name: 'reason', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'GOAL_TOKEN_REVNET_ID_NOT_DERIVABLE_WITH_REASON',
  },
  {
    type: 'error',
    inputs: [
      { name: 'goalToken', internalType: 'address', type: 'address' },
      { name: 'expectedRevnetId', internalType: 'uint256', type: 'uint256' },
      { name: 'actualRevnetId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'GOAL_TOKEN_REVNET_MISMATCH',
  },
  {
    type: 'error',
    inputs: [
      { name: 'expected', internalType: 'address', type: 'address' },
      { name: 'actual', internalType: 'address', type: 'address' },
    ],
    name: 'GOAL_TOKEN_SUPER_TOKEN_UNDERLYING_MISMATCH',
  },
  {
    type: 'error',
    inputs: [
      { name: 'expected', internalType: 'uint256', type: 'uint256' },
      { name: 'actual', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'HOOK_SUPER_TOKEN_AMOUNT_MISMATCH',
  },
  {
    type: 'error',
    inputs: [
      { name: 'token', internalType: 'address', type: 'address' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
      { name: 'have', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'INSUFFICIENT_TREASURY_BALANCE',
  },
  { type: 'error', inputs: [], name: 'INVALID_ASSERTION_CONFIG' },
  { type: 'error', inputs: [], name: 'INVALID_ASSERTION_ID' },
  { type: 'error', inputs: [], name: 'INVALID_ASSERTION_ID' },
  {
    type: 'error',
    inputs: [{ name: 'ppm', internalType: 'uint256', type: 'uint256' }],
    name: 'INVALID_BUDGET_PREMIUM_PPM',
  },
  {
    type: 'error',
    inputs: [{ name: 'ppm', internalType: 'uint256', type: 'uint256' }],
    name: 'INVALID_BUDGET_SLASH_PPM',
  },
  { type: 'error', inputs: [], name: 'INVALID_DEADLINES' },
  {
    type: 'error',
    inputs: [{ name: 'token', internalType: 'address', type: 'address' }],
    name: 'INVALID_HOOK_SOURCE_TOKEN',
  },
  { type: 'error', inputs: [], name: 'INVALID_REASSERT_GRACE_DURATION' },
  {
    type: 'error',
    inputs: [{ name: 'controller', internalType: 'address', type: 'address' }],
    name: 'INVALID_REVNET_CONTROLLER',
  },
  { type: 'error', inputs: [], name: 'INVALID_STATE' },
  {
    type: 'error',
    inputs: [
      { name: 'budgetPremiumPpm', internalType: 'uint32', type: 'uint32' },
      { name: 'budgetSlashPpm', internalType: 'uint32', type: 'uint32' },
    ],
    name: 'INVALID_UNDERWRITING_SLASH_CONFIG',
  },
  { type: 'error', inputs: [], name: 'InvalidInitialization' },
  {
    type: 'error',
    inputs: [
      { name: 'raised', internalType: 'uint256', type: 'uint256' },
      { name: 'minRaise', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'MIN_RAISE_NOT_REACHED',
  },
  {
    type: 'error',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'NOT_A_CONTRACT',
  },
  { type: 'error', inputs: [], name: 'NotInitializing' },
  { type: 'error', inputs: [], name: 'ONLY_HOOK' },
  { type: 'error', inputs: [], name: 'ONLY_SELF' },
  { type: 'error', inputs: [], name: 'ONLY_SUCCESS_RESOLVER' },
  { type: 'error', inputs: [], name: 'ReentrancyGuardReentrantCall' },
  {
    type: 'error',
    inputs: [
      { name: 'expected', internalType: 'address', type: 'address' },
      { name: 'actual', internalType: 'address', type: 'address' },
    ],
    name: 'STAKE_VAULT_GOAL_MISMATCH',
  },
  {
    type: 'error',
    inputs: [{ name: 'assertionId', internalType: 'bytes32', type: 'bytes32' }],
    name: 'SUCCESS_ASSERTION_ALREADY_PENDING',
  },
  {
    type: 'error',
    inputs: [{ name: 'assertionId', internalType: 'bytes32', type: 'bytes32' }],
    name: 'SUCCESS_ASSERTION_ALREADY_PENDING',
  },
  {
    type: 'error',
    inputs: [
      { name: 'expected', internalType: 'bytes32', type: 'bytes32' },
      { name: 'actual', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'SUCCESS_ASSERTION_ID_MISMATCH',
  },
  {
    type: 'error',
    inputs: [
      { name: 'expected', internalType: 'bytes32', type: 'bytes32' },
      { name: 'actual', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'SUCCESS_ASSERTION_ID_MISMATCH',
  },
  { type: 'error', inputs: [], name: 'SUCCESS_ASSERTION_NOT_PENDING' },
  { type: 'error', inputs: [], name: 'SUCCESS_ASSERTION_NOT_PENDING' },
  { type: 'error', inputs: [], name: 'SUCCESS_ASSERTION_NOT_VERIFIED' },
  { type: 'error', inputs: [], name: 'SUCCESS_ASSERTION_NOT_VERIFIED' },
  {
    type: 'error',
    inputs: [
      { name: 'bits', internalType: 'uint8', type: 'uint8' },
      { name: 'value', internalType: 'int256', type: 'int256' },
    ],
    name: 'SafeCastOverflowedIntDowncast',
  },
  {
    type: 'error',
    inputs: [{ name: 'value', internalType: 'int256', type: 'int256' }],
    name: 'SafeCastOverflowedIntToUint',
  },
  {
    type: 'error',
    inputs: [
      { name: 'bits', internalType: 'uint8', type: 'uint8' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'SafeCastOverflowedUintDowncast',
  },
  {
    type: 'error',
    inputs: [{ name: 'value', internalType: 'uint256', type: 'uint256' }],
    name: 'SafeCastOverflowedUintToInt',
  },
  {
    type: 'error',
    inputs: [{ name: 'token', internalType: 'address', type: 'address' }],
    name: 'SafeERC20FailedOperation',
  },
] as const

/**
 * [__View Contract on Base Basescan__](https://basescan.org/address/0xCB87F7dac555F907EA07A00127590479AC4558fb)
 */
export const goalTreasuryAddress = {
  8453: '0xCB87F7dac555F907EA07A00127590479AC4558fb',
} as const

/**
 * [__View Contract on Base Basescan__](https://basescan.org/address/0xCB87F7dac555F907EA07A00127590479AC4558fb)
 */
export const goalTreasuryConfig = {
  address: goalTreasuryAddress,
  abi: goalTreasuryAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// JurorSlasherRouter
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * [__View Contract on Base Basescan__](https://basescan.org/address/0x728bb0B5BB2Ff87111Bf717CD4D2E00752d08b22)
 */
export const jurorSlasherRouterAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: 'stakeVault_',
        internalType: 'contract IStakeVault',
        type: 'address',
      },
      { name: 'authority_', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'authority',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'stakeVault_',
        internalType: 'contract IStakeVault',
        type: 'address',
      },
      { name: 'authority_', internalType: 'address', type: 'address' },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'isAuthorizedSlasher',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'slasher', internalType: 'address', type: 'address' },
      { name: 'authorized', internalType: 'bool', type: 'bool' },
    ],
    name: 'setAuthorizedSlasher',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'juror', internalType: 'address', type: 'address' },
      { name: 'weightAmount', internalType: 'uint256', type: 'uint256' },
      { name: 'recipient', internalType: 'address', type: 'address' },
    ],
    name: 'slashJurorStake',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'stakeVault',
    outputs: [
      { name: '', internalType: 'contract IStakeVault', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'version',
        internalType: 'uint64',
        type: 'uint64',
        indexed: false,
      },
    ],
    name: 'Initialized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'slasher',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'authorized',
        internalType: 'bool',
        type: 'bool',
        indexed: false,
      },
    ],
    name: 'SlasherAuthorizationSet',
  },
  { type: 'error', inputs: [], name: 'ADDRESS_ZERO' },
  { type: 'error', inputs: [], name: 'InvalidInitialization' },
  { type: 'error', inputs: [], name: 'NotInitializing' },
  { type: 'error', inputs: [], name: 'ONLY_AUTHORITY' },
  { type: 'error', inputs: [], name: 'ONLY_AUTHORIZED_SLASHER' },
] as const

/**
 * [__View Contract on Base Basescan__](https://basescan.org/address/0x728bb0B5BB2Ff87111Bf717CD4D2E00752d08b22)
 */
export const jurorSlasherRouterAddress = {
  8453: '0x728bb0B5BB2Ff87111Bf717CD4D2E00752d08b22',
} as const

/**
 * [__View Contract on Base Basescan__](https://basescan.org/address/0x728bb0B5BB2Ff87111Bf717CD4D2E00752d08b22)
 */
export const jurorSlasherRouterConfig = {
  address: jurorSlasherRouterAddress,
  abi: jurorSlasherRouterAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// PremiumEscrow
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * [__View Contract on Base Basescan__](https://basescan.org/address/0x8b9aD109907E86ce2a8c491A97093cA076CC6Cd5)
 */
export const premiumEscrowAbi = [
  { type: 'constructor', inputs: [], stateMutability: 'nonpayable' },
  {
    type: 'function',
    inputs: [],
    name: 'accountedGoalReceived',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'accountedManagerRewardReceived',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'activatedAt',
    outputs: [{ name: '', internalType: 'uint64', type: 'uint64' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'budgetFlow',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'budgetSlashPpm',
    outputs: [{ name: '', internalType: 'uint32', type: 'uint32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'budgetStakeLedger',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'budgetTreasury',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'burnOnGoalFailure',
    outputs: [{ name: 'amount', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'checkpoint',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'to', internalType: 'address', type: 'address' }],
    name: 'claim',
    outputs: [{ name: 'amount', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'claimable',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'state_',
        internalType: 'enum IBudgetTreasury.BudgetState',
        type: 'uint8',
      },
      { name: 'activatedAt_', internalType: 'uint64', type: 'uint64' },
      { name: 'closedAt_', internalType: 'uint64', type: 'uint64' },
    ],
    name: 'close',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'closed',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'closedAt',
    outputs: [{ name: '', internalType: 'uint64', type: 'uint64' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'managerRewardPool_', internalType: 'address', type: 'address' },
    ],
    name: 'connectManagerRewardPool',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'creditDrawn',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'creditIndex',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'exposureIntegral',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'finalState',
    outputs: [
      {
        name: '',
        internalType: 'enum IBudgetTreasury.BudgetState',
        type: 'uint8',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'goalFlow',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'budgetTreasury_', internalType: 'address', type: 'address' },
      { name: 'budgetStakeLedger_', internalType: 'address', type: 'address' },
      { name: 'goalFlow_', internalType: 'address', type: 'address' },
      {
        name: 'underwriterSlasherRouter_',
        internalType: 'address',
        type: 'address',
      },
      { name: 'budgetSlashPpm_', internalType: 'uint32', type: 'uint32' },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'isSlashable',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'lastExposureTs',
    outputs: [{ name: '', internalType: 'uint64', type: 'uint64' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'managerRewardPool',
    outputs: [
      { name: '', internalType: 'contract ISuperfluidPool', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'peakCov',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'premiumEarned',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'premiumIndex',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'premiumToken',
    outputs: [{ name: '', internalType: 'contract IERC20', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'underwriter', internalType: 'address', type: 'address' }],
    name: 'slash',
    outputs: [
      { name: 'slashWeight', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'slashed',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalCoverage',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'underwriterSlasherRouter',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'userCov',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'userIndex',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'previousCoverage',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'currentCoverage',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'claimableAmount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'exposureIntegral',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'totalCoverage',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'AccountCheckpointed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Claimed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'finalState',
        internalType: 'enum IBudgetTreasury.BudgetState',
        type: 'uint8',
        indexed: true,
      },
      {
        name: 'activatedAt',
        internalType: 'uint64',
        type: 'uint64',
        indexed: false,
      },
      {
        name: 'closedAt',
        internalType: 'uint64',
        type: 'uint64',
        indexed: false,
      },
    ],
    name: 'Closed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'distributedCredit',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'totalCoverage',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'indexDelta',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'newCreditIndex',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'CreditIndexed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'version',
        internalType: 'uint64',
        type: 'uint64',
        indexed: false,
      },
    ],
    name: 'Initialized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'goalTreasury',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'reason', internalType: 'bytes', type: 'bytes', indexed: false },
    ],
    name: 'LateResidualSettlementFailed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'pool', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'baselineReceived',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ManagerRewardPoolConnected',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'destination',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'OrphanPremiumRecycled',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'distributedPremium',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'totalCoverage',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'indexDelta',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'newPremiumIndex',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'PremiumIndexed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'goalFlow',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'UnclaimablePremiumSwept',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'underwriter',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'usedCreditFormula',
        internalType: 'bool',
        type: 'bool',
        indexed: false,
      },
      {
        name: 'creditDrawn',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'premiumEarned',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'duration',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'rawSlashWeight',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'capWeight',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'finalSlashWeight',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'UnderwriterSlashCalculated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'underwriter',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'exposureIntegral',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'slashWeight',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'duration',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'UnderwriterSlashed',
  },
  { type: 'error', inputs: [], name: 'ADDRESS_ZERO' },
  { type: 'error', inputs: [], name: 'ALREADY_CLOSED' },
  {
    type: 'error',
    inputs: [
      {
        name: 'state',
        internalType: 'enum IBudgetTreasury.BudgetState',
        type: 'uint8',
      },
    ],
    name: 'BUDGET_NOT_SUCCEEDED',
  },
  {
    type: 'error',
    inputs: [
      {
        name: 'state',
        internalType: 'enum IGoalTreasury.GoalState',
        type: 'uint8',
      },
    ],
    name: 'GOAL_NOT_EXPIRED',
  },
  {
    type: 'error',
    inputs: [
      {
        name: 'state',
        internalType: 'enum IGoalTreasury.GoalState',
        type: 'uint8',
      },
    ],
    name: 'GOAL_NOT_SUCCEEDED',
  },
  { type: 'error', inputs: [], name: 'GOAL_TREASURY_UNAVAILABLE' },
  {
    type: 'error',
    inputs: [
      {
        name: 'state',
        internalType: 'enum IBudgetTreasury.BudgetState',
        type: 'uint8',
      },
    ],
    name: 'INVALID_CLOSE_STATE',
  },
  {
    type: 'error',
    inputs: [{ name: 'closedAt', internalType: 'uint64', type: 'uint64' }],
    name: 'INVALID_CLOSE_TIMESTAMP',
  },
  {
    type: 'error',
    inputs: [
      { name: 'activatedAt', internalType: 'uint64', type: 'uint64' },
      { name: 'closedAt', internalType: 'uint64', type: 'uint64' },
    ],
    name: 'INVALID_CLOSE_WINDOW',
  },
  {
    type: 'error',
    inputs: [{ name: 'pool', internalType: 'address', type: 'address' }],
    name: 'INVALID_MANAGER_REWARD_POOL',
  },
  {
    type: 'error',
    inputs: [{ name: 'value', internalType: 'uint32', type: 'uint32' }],
    name: 'INVALID_SLASH_PPM',
  },
  { type: 'error', inputs: [], name: 'InvalidInitialization' },
  {
    type: 'error',
    inputs: [{ name: 'currentPool', internalType: 'address', type: 'address' }],
    name: 'MANAGER_REWARD_POOL_ALREADY_SET',
  },
  { type: 'error', inputs: [], name: 'MANAGER_REWARD_POOL_NOT_CONNECTED' },
  { type: 'error', inputs: [], name: 'NOT_CLOSED' },
  { type: 'error', inputs: [], name: 'NOT_SLASHABLE' },
  { type: 'error', inputs: [], name: 'NotInitializing' },
  { type: 'error', inputs: [], name: 'ONLY_BUDGET_CONTROL' },
  { type: 'error', inputs: [], name: 'ONLY_BUDGET_TREASURY' },
  { type: 'error', inputs: [], name: 'POOL_CONNECT_FAILED' },
  { type: 'error', inputs: [], name: 'ReentrancyGuardReentrantCall' },
  {
    type: 'error',
    inputs: [
      { name: 'goalFlowSuperToken', internalType: 'address', type: 'address' },
      {
        name: 'budgetTreasurySuperToken',
        internalType: 'address',
        type: 'address',
      },
    ],
    name: 'SUPER_TOKEN_MISMATCH',
  },
  {
    type: 'error',
    inputs: [{ name: 'token', internalType: 'address', type: 'address' }],
    name: 'SafeERC20FailedOperation',
  },
] as const

/**
 * [__View Contract on Base Basescan__](https://basescan.org/address/0x8b9aD109907E86ce2a8c491A97093cA076CC6Cd5)
 */
export const premiumEscrowAddress = {
  8453: '0x8b9aD109907E86ce2a8c491A97093cA076CC6Cd5',
} as const

/**
 * [__View Contract on Base Basescan__](https://basescan.org/address/0x8b9aD109907E86ce2a8c491A97093cA076CC6Cd5)
 */
export const premiumEscrowConfig = {
  address: premiumEscrowAddress,
  abi: premiumEscrowAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// PrizePoolSubmissionDepositStrategy
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * [__View Contract on Base Basescan__](https://basescan.org/address/0xB3B6ece085C3d078e3752d271eD636c6B185f620)
 */
export const prizePoolSubmissionDepositStrategyAbi = [
  { type: 'constructor', inputs: [], stateMutability: 'nonpayable' },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'bytes32', type: 'bytes32' },
      {
        name: 'requestType',
        internalType: 'enum IGeneralizedTCR.Status',
        type: 'uint8',
      },
      { name: 'ruling', internalType: 'enum IArbitrable.Party', type: 'uint8' },
      { name: '', internalType: 'address', type: 'address' },
      { name: 'requester', internalType: 'address', type: 'address' },
      { name: 'challenger', internalType: 'address', type: 'address' },
      { name: '', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getSubmissionDepositAction',
    outputs: [
      {
        name: 'action',
        internalType: 'enum ISubmissionDepositStrategy.DepositAction',
        type: 'uint8',
      },
      { name: 'recipient', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'token_', internalType: 'contract IERC20', type: 'address' },
      { name: 'prizePool_', internalType: 'address', type: 'address' },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'prizePool',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'supportsEscrowBonding',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [],
    name: 'token',
    outputs: [{ name: '', internalType: 'contract IERC20', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'version',
        internalType: 'uint64',
        type: 'uint64',
        indexed: false,
      },
    ],
    name: 'Initialized',
  },
  { type: 'error', inputs: [], name: 'InvalidInitialization' },
  { type: 'error', inputs: [], name: 'NotInitializing' },
  { type: 'error', inputs: [], name: 'PRIZE_POOL_ZERO' },
] as const

/**
 * [__View Contract on Base Basescan__](https://basescan.org/address/0xB3B6ece085C3d078e3752d271eD636c6B185f620)
 */
export const prizePoolSubmissionDepositStrategyAddress = {
  8453: '0xB3B6ece085C3d078e3752d271eD636c6B185f620',
} as const

/**
 * [__View Contract on Base Basescan__](https://basescan.org/address/0xB3B6ece085C3d078e3752d271eD636c6B185f620)
 */
export const prizePoolSubmissionDepositStrategyConfig = {
  address: prizePoolSubmissionDepositStrategyAddress,
  abi: prizePoolSubmissionDepositStrategyAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RoundFactory
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * [__View Contract on Base Basescan__](https://basescan.org/address/0x3ea0A71d0bC5852da2184fe3b2aED8849b4D6e3b)
 */
export const roundFactoryAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: 'roundSubmissionTcrImplementation_',
        internalType: 'address',
        type: 'address',
      },
      {
        name: 'roundPrizeVaultImplementation_',
        internalType: 'address',
        type: 'address',
      },
      {
        name: 'prizePoolSubmissionDepositStrategyImplementation_',
        internalType: 'address',
        type: 'address',
      },
      {
        name: 'arbitratorImplementation_',
        internalType: 'address',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'arbitratorImplementation',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'roundId', internalType: 'bytes32', type: 'bytes32' },
      { name: 'budgetTreasury', internalType: 'address', type: 'address' },
      {
        name: 'timing',
        internalType: 'struct RoundFactory.RoundTiming',
        type: 'tuple',
        components: [
          { name: 'startAt', internalType: 'uint64', type: 'uint64' },
          { name: 'endAt', internalType: 'uint64', type: 'uint64' },
        ],
      },
      { name: 'roundOperator', internalType: 'address', type: 'address' },
      {
        name: 'tcrPolicy',
        internalType: 'struct IGeneralizedTCRConfig.RegistryPolicy',
        type: 'tuple',
        components: [
          { name: 'arbitratorExtraData', internalType: 'bytes', type: 'bytes' },
          {
            name: 'registrationMetaEvidence',
            internalType: 'string',
            type: 'string',
          },
          {
            name: 'clearingMetaEvidence',
            internalType: 'string',
            type: 'string',
          },
          {
            name: 'submissionBaseDeposit',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'removalBaseDeposit',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'submissionChallengeBaseDeposit',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'removalChallengeBaseDeposit',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'challengePeriodDuration',
            internalType: 'uint256',
            type: 'uint256',
          },
        ],
      },
      {
        name: 'arbConfig',
        internalType: 'struct RoundFactory.ArbitratorConfig',
        type: 'tuple',
        components: [
          { name: 'votingPeriod', internalType: 'uint256', type: 'uint256' },
          { name: 'votingDelay', internalType: 'uint256', type: 'uint256' },
          { name: 'revealPeriod', internalType: 'uint256', type: 'uint256' },
          { name: 'arbitrationCost', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    name: 'createRoundForBudget',
    outputs: [
      {
        name: 'out',
        internalType: 'struct RoundFactory.DeployedRound',
        type: 'tuple',
        components: [
          { name: 'prizeVault', internalType: 'address', type: 'address' },
          { name: 'submissionTCR', internalType: 'address', type: 'address' },
          { name: 'arbitrator', internalType: 'address', type: 'address' },
          { name: 'depositStrategy', internalType: 'address', type: 'address' },
          { name: 'underlyingToken', internalType: 'address', type: 'address' },
          { name: 'superToken', internalType: 'address', type: 'address' },
          { name: 'stakeVault', internalType: 'address', type: 'address' },
          { name: 'goalTreasury', internalType: 'address', type: 'address' },
          { name: 'goalFlow', internalType: 'address', type: 'address' },
          { name: 'budgetFlow', internalType: 'address', type: 'address' },
        ],
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'mechanismId', internalType: 'bytes32', type: 'bytes32' },
      { name: 'budgetTreasury', internalType: 'address', type: 'address' },
      { name: 'mechanismConfig', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'deployForBudget',
    outputs: [
      {
        name: 'out',
        internalType: 'struct IAllocationMechanismFactory.DeployedMechanism',
        type: 'tuple',
        components: [
          { name: 'mechanism', internalType: 'address', type: 'address' },
          { name: 'payoutRecipient', internalType: 'address', type: 'address' },
          { name: 'arbitrator', internalType: 'address', type: 'address' },
          { name: 'auxiliary', internalType: 'address', type: 'address' },
        ],
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'prizePoolSubmissionDepositStrategyImplementation',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'roundPrizeVaultImplementation',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'roundSubmissionTcrImplementation',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'roundId',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'budgetTreasury',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'prizeVault',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'submissionTCR',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'arbitrator',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'depositStrategy',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'underlyingToken',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'superToken',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'RoundDeployed',
  },
  { type: 'error', inputs: [], name: 'ADDRESS_ZERO' },
  { type: 'error', inputs: [], name: 'FailedDeployment' },
  { type: 'error', inputs: [], name: 'INVALID_BUDGET_CONTEXT' },
  {
    type: 'error',
    inputs: [
      { name: 'balance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'InsufficientBalance',
  },
  {
    type: 'error',
    inputs: [
      { name: 'expectedUnderlying', internalType: 'address', type: 'address' },
      { name: 'actualUnderlying', internalType: 'address', type: 'address' },
    ],
    name: 'SUPER_TOKEN_UNDERLYING_MISMATCH',
  },
] as const

/**
 * [__View Contract on Base Basescan__](https://basescan.org/address/0x3ea0A71d0bC5852da2184fe3b2aED8849b4D6e3b)
 */
export const roundFactoryAddress = {
  8453: '0x3ea0A71d0bC5852da2184fe3b2aED8849b4D6e3b',
} as const

/**
 * [__View Contract on Base Basescan__](https://basescan.org/address/0x3ea0A71d0bC5852da2184fe3b2aED8849b4D6e3b)
 */
export const roundFactoryConfig = {
  address: roundFactoryAddress,
  abi: roundFactoryAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RoundPrizeVault
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * [__View Contract on Base Basescan__](https://basescan.org/address/0xf193305823BDE3043C8d2503cBCDFF62b8CC6b17)
 */
export const roundPrizeVaultAbi = [
  { type: 'constructor', inputs: [], stateMutability: 'nonpayable' },
  {
    type: 'function',
    inputs: [
      { name: 'submissionId', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'claim',
    outputs: [{ name: 'amount', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    name: 'claimedOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'amount', internalType: 'uint256', type: 'uint256' }],
    name: 'downgrade',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    name: 'entitlementOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'underlyingToken_',
        internalType: 'contract IERC20',
        type: 'address',
      },
      {
        name: 'superToken_',
        internalType: 'contract ISuperToken',
        type: 'address',
      },
      {
        name: 'submissionsTCR_',
        internalType: 'contract RoundSubmissionTCR',
        type: 'address',
      },
      { name: 'operator_', internalType: 'address', type: 'address' },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'operator',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    name: 'payoutRecipientOf',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'submissionId', internalType: 'bytes32', type: 'bytes32' },
      { name: 'entitlement', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'setEntitlement',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'submissionIds', internalType: 'bytes32[]', type: 'bytes32[]' },
      { name: 'entitlements', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    name: 'setEntitlements',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOperator', internalType: 'address', type: 'address' }],
    name: 'setOperator',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'submissionsTCR',
    outputs: [
      {
        name: '',
        internalType: 'contract RoundSubmissionTCR',
        type: 'address',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'superToken',
    outputs: [
      { name: '', internalType: 'contract ISuperToken', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'underlyingToken',
    outputs: [{ name: '', internalType: 'contract IERC20', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'submissionId',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'recipient',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Claimed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Downgraded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'submissionId',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'recipient',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'EntitlementRecipientSnapshotted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'submissionId',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'entitlement',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'EntitlementSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'version',
        internalType: 'uint64',
        type: 'uint64',
        indexed: false,
      },
    ],
    name: 'Initialized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousOperator',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOperator',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OperatorSet',
  },
  { type: 'error', inputs: [], name: 'ADDRESS_ZERO' },
  {
    type: 'error',
    inputs: [
      { name: 'entitlement', internalType: 'uint256', type: 'uint256' },
      { name: 'claimed', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ENTITLEMENT_LT_CLAIMED',
  },
  {
    type: 'error',
    inputs: [
      { name: 'required', internalType: 'uint256', type: 'uint256' },
      { name: 'available', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'INSUFFICIENT_UNDERLYING',
  },
  { type: 'error', inputs: [], name: 'InvalidInitialization' },
  { type: 'error', inputs: [], name: 'LENGTH_MISMATCH' },
  { type: 'error', inputs: [], name: 'NOTHING_TO_CLAIM' },
  { type: 'error', inputs: [], name: 'NotInitializing' },
  { type: 'error', inputs: [], name: 'ONLY_OPERATOR' },
  { type: 'error', inputs: [], name: 'ONLY_SUBMITTER' },
  { type: 'error', inputs: [], name: 'ReentrancyGuardReentrantCall' },
  { type: 'error', inputs: [], name: 'SUBMISSION_NOT_REGISTERED' },
  { type: 'error', inputs: [], name: 'SUPER_TOKEN_NOT_CONFIGURED' },
  {
    type: 'error',
    inputs: [{ name: 'token', internalType: 'address', type: 'address' }],
    name: 'SafeERC20FailedOperation',
  },
] as const

/**
 * [__View Contract on Base Basescan__](https://basescan.org/address/0xf193305823BDE3043C8d2503cBCDFF62b8CC6b17)
 */
export const roundPrizeVaultAddress = {
  8453: '0xf193305823BDE3043C8d2503cBCDFF62b8CC6b17',
} as const

/**
 * [__View Contract on Base Basescan__](https://basescan.org/address/0xf193305823BDE3043C8d2503cBCDFF62b8CC6b17)
 */
export const roundPrizeVaultConfig = {
  address: roundPrizeVaultAddress,
  abi: roundPrizeVaultAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RoundSubmissionTCR
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * [__View Contract on Base Basescan__](https://basescan.org/address/0xeC4217c061F84d1Ba97687C9a72B926B0382f747)
 */
export const roundSubmissionTcrAbi = [
  { type: 'constructor', inputs: [], stateMutability: 'nonpayable' },
  {
    type: 'function',
    inputs: [],
    name: 'RULING_OPTIONS',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_item', internalType: 'bytes', type: 'bytes' }],
    name: 'addItem',
    outputs: [{ name: 'itemID', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'arbitrator',
    outputs: [
      { name: '', internalType: 'contract IArbitrator', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'arbitratorDisputeIDToItem',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'arbitratorExtraData',
    outputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'challengePeriodDuration',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_itemID', internalType: 'bytes32', type: 'bytes32' },
      { name: '_evidence', internalType: 'string', type: 'string' },
    ],
    name: 'challengeRequest',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'clearingMetaEvidence',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'itemData', internalType: 'bytes', type: 'bytes' }],
    name: 'decodeSubmission',
    outputs: [
      {
        name: 'submission',
        internalType: 'struct RoundSubmissionTCR.Submission',
        type: 'tuple',
        components: [
          { name: 'source', internalType: 'uint8', type: 'uint8' },
          { name: 'postId', internalType: 'bytes32', type: 'bytes32' },
          { name: 'recipient', internalType: 'address', type: 'address' },
        ],
      },
    ],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [],
    name: 'disputeTimeout',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'submission',
        internalType: 'struct RoundSubmissionTCR.Submission',
        type: 'tuple',
        components: [
          { name: 'source', internalType: 'uint8', type: 'uint8' },
          { name: 'postId', internalType: 'bytes32', type: 'bytes32' },
          { name: 'recipient', internalType: 'address', type: 'address' },
        ],
      },
    ],
    name: 'encodeSubmission',
    outputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [],
    name: 'endAt',
    outputs: [{ name: '', internalType: 'uint64', type: 'uint64' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'erc20',
    outputs: [{ name: '', internalType: 'contract IERC20', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_itemID', internalType: 'bytes32', type: 'bytes32' }],
    name: 'executeRequest',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_itemID', internalType: 'bytes32', type: 'bytes32' }],
    name: 'executeRequestTimeout',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_itemID', internalType: 'bytes32', type: 'bytes32' },
      { name: '_request', internalType: 'uint256', type: 'uint256' },
      { name: '_round', internalType: 'uint256', type: 'uint256' },
      { name: '_contributor', internalType: 'address', type: 'address' },
    ],
    name: 'getContributions',
    outputs: [
      { name: 'contributions', internalType: 'uint256[3]', type: 'uint256[3]' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_itemID', internalType: 'bytes32', type: 'bytes32' }],
    name: 'getItemInfo',
    outputs: [
      { name: 'data', internalType: 'bytes', type: 'bytes' },
      {
        name: 'status',
        internalType: 'enum IGeneralizedTCR.Status',
        type: 'uint8',
      },
      { name: 'numberOfRequests', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_itemID', internalType: 'bytes32', type: 'bytes32' }],
    name: 'getLatestRequestIndex',
    outputs: [
      { name: 'exists', internalType: 'bool', type: 'bool' },
      { name: 'requestIndex', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_itemID', internalType: 'bytes32', type: 'bytes32' },
      { name: '_request', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getRequestInfo',
    outputs: [
      { name: 'disputed', internalType: 'bool', type: 'bool' },
      { name: 'disputeID', internalType: 'uint256', type: 'uint256' },
      { name: 'submissionTime', internalType: 'uint256', type: 'uint256' },
      { name: 'resolved', internalType: 'bool', type: 'bool' },
      { name: 'parties', internalType: 'address[3]', type: 'address[3]' },
      { name: 'numberOfRounds', internalType: 'uint256', type: 'uint256' },
      { name: 'ruling', internalType: 'enum IArbitrable.Party', type: 'uint8' },
      {
        name: 'arbitrator',
        internalType: 'contract IArbitrator',
        type: 'address',
      },
      { name: 'arbitratorExtraData', internalType: 'bytes', type: 'bytes' },
      { name: 'metaEvidenceID', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_itemID', internalType: 'bytes32', type: 'bytes32' },
      { name: '_request', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getRequestSnapshot',
    outputs: [
      {
        name: 'requestType',
        internalType: 'enum IGeneralizedTCR.Status',
        type: 'uint8',
      },
      {
        name: 'challengePeriodDuration_',
        internalType: 'uint256',
        type: 'uint256',
      },
      { name: 'disputeTimeout_', internalType: 'uint256', type: 'uint256' },
      { name: 'arbitrationCost_', internalType: 'uint256', type: 'uint256' },
      {
        name: 'challengeBaseDeposit_',
        internalType: 'uint256',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_itemID', internalType: 'bytes32', type: 'bytes32' },
      { name: '_request', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getRequestState',
    outputs: [
      {
        name: 'phase',
        internalType: 'enum IGeneralizedTCR.RequestPhase',
        type: 'uint8',
      },
      { name: 'challengeDeadline', internalType: 'uint256', type: 'uint256' },
      { name: 'timeoutAt', internalType: 'uint256', type: 'uint256' },
      {
        name: 'arbitratorStatus',
        internalType: 'enum IArbitrator.DisputeStatus',
        type: 'uint8',
      },
      { name: 'canChallenge', internalType: 'bool', type: 'bool' },
      { name: 'canExecuteRequest', internalType: 'bool', type: 'bool' },
      { name: 'canExecuteTimeout', internalType: 'bool', type: 'bool' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_itemID', internalType: 'bytes32', type: 'bytes32' },
      { name: '_request', internalType: 'uint256', type: 'uint256' },
      { name: '_round', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getRoundInfo',
    outputs: [
      { name: 'amountPaid', internalType: 'uint256[3]', type: 'uint256[3]' },
      { name: 'hasPaid', internalType: 'bool[3]', type: 'bool[3]' },
      { name: 'feeRewards', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getTotalCosts',
    outputs: [
      { name: 'addItemCost', internalType: 'uint256', type: 'uint256' },
      { name: 'removeItemCost', internalType: 'uint256', type: 'uint256' },
      {
        name: 'challengeSubmissionCost',
        internalType: 'uint256',
        type: 'uint256',
      },
      {
        name: 'challengeRemovalCost',
        internalType: 'uint256',
        type: 'uint256',
      },
      { name: 'arbitrationCost', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'roundConfig',
        internalType: 'struct RoundSubmissionTCR.RoundConfig',
        type: 'tuple',
        components: [
          { name: 'roundId', internalType: 'bytes32', type: 'bytes32' },
          { name: 'startAt', internalType: 'uint64', type: 'uint64' },
          { name: 'endAt', internalType: 'uint64', type: 'uint64' },
          { name: 'prizeVault', internalType: 'address', type: 'address' },
        ],
      },
      {
        name: 'registryConfig',
        internalType: 'struct IGeneralizedTCRConfig.RegistryConfig',
        type: 'tuple',
        components: [
          {
            name: 'arbitrator',
            internalType: 'contract IArbitrator',
            type: 'address',
          },
          {
            name: 'votingToken',
            internalType: 'contract IVotes',
            type: 'address',
          },
          {
            name: 'submissionDepositStrategy',
            internalType: 'contract ISubmissionDepositStrategy',
            type: 'address',
          },
          {
            name: 'registryPolicy',
            internalType: 'struct IGeneralizedTCRConfig.RegistryPolicy',
            type: 'tuple',
            components: [
              {
                name: 'arbitratorExtraData',
                internalType: 'bytes',
                type: 'bytes',
              },
              {
                name: 'registrationMetaEvidence',
                internalType: 'string',
                type: 'string',
              },
              {
                name: 'clearingMetaEvidence',
                internalType: 'string',
                type: 'string',
              },
              {
                name: 'submissionBaseDeposit',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'removalBaseDeposit',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'submissionChallengeBaseDeposit',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'removalChallengeBaseDeposit',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'challengePeriodDuration',
                internalType: 'uint256',
                type: 'uint256',
              },
            ],
          },
        ],
      },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'itemCount',
    outputs: [{ name: 'count', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    name: 'itemIDtoIndex',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'itemList',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'itemID', internalType: 'bytes32', type: 'bytes32' }],
    name: 'itemManagerAndStatus',
    outputs: [
      { name: 'manager', internalType: 'address', type: 'address' },
      {
        name: 'status',
        internalType: 'enum IGeneralizedTCR.Status',
        type: 'uint8',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    name: 'items',
    outputs: [
      { name: 'data', internalType: 'bytes', type: 'bytes' },
      { name: 'manager', internalType: 'address', type: 'address' },
      {
        name: 'status',
        internalType: 'enum IGeneralizedTCR.Status',
        type: 'uint8',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'prizeVault',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'registrationMetaEvidence',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'removalBaseDeposit',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'removalChallengeBaseDeposit',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_itemID', internalType: 'bytes32', type: 'bytes32' },
      { name: '_evidence', internalType: 'string', type: 'string' },
    ],
    name: 'removeItem',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'roundId',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_disputeID', internalType: 'uint256', type: 'uint256' },
      { name: '_ruling', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'rule',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'startAt',
    outputs: [{ name: '', internalType: 'uint64', type: 'uint64' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'submissionBaseDeposit',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'submissionChallengeBaseDeposit',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'submissionDepositStrategy',
    outputs: [
      {
        name: '',
        internalType: 'contract ISubmissionDepositStrategy',
        type: 'address',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    name: 'submissionDeposits',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_itemID', internalType: 'bytes32', type: 'bytes32' },
      { name: '_evidence', internalType: 'string', type: 'string' },
    ],
    name: 'submitEvidence',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_beneficiary', internalType: 'address', type: 'address' },
      { name: '_itemID', internalType: 'bytes32', type: 'bytes32' },
      { name: '_request', internalType: 'uint256', type: 'uint256' },
      { name: '_round', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'withdrawFeesAndRewards',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: '_arbitrator',
        internalType: 'contract IArbitrator',
        type: 'address',
        indexed: true,
      },
      {
        name: '_disputeID',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: '_metaEvidenceID',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: '_evidenceGroupID',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: '_itemID',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: false,
      },
    ],
    name: 'Dispute',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: '_arbitrator',
        internalType: 'contract IArbitrator',
        type: 'address',
        indexed: true,
      },
      {
        name: '_evidenceGroupID',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: '_party',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: '_evidence',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
    ],
    name: 'Evidence',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'version',
        internalType: 'uint64',
        type: 'uint64',
        indexed: false,
      },
    ],
    name: 'Initialized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: '_itemID',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: '_requestIndex',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: '_roundIndex',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      { name: '_disputed', internalType: 'bool', type: 'bool', indexed: false },
      { name: '_resolved', internalType: 'bool', type: 'bool', indexed: false },
      {
        name: '_itemStatus',
        internalType: 'enum IGeneralizedTCR.Status',
        type: 'uint8',
        indexed: false,
      },
    ],
    name: 'ItemStatusChange',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: '_itemID',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: '_submitter',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: '_evidenceGroupID',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      { name: '_data', internalType: 'bytes', type: 'bytes', indexed: false },
    ],
    name: 'ItemSubmitted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: '_metaEvidenceID',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: '_evidence',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
    ],
    name: 'MetaEvidence',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: '_itemID',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: '_requestIndex',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: '_evidenceGroupID',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
    ],
    name: 'RequestEvidenceGroupID',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: '_itemID',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: '_requestIndex',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: '_requestType',
        internalType: 'enum IGeneralizedTCR.Status',
        type: 'uint8',
        indexed: true,
      },
    ],
    name: 'RequestSubmitted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: '_arbitrator',
        internalType: 'contract IArbitrator',
        type: 'address',
        indexed: true,
      },
      {
        name: '_disputeID',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: '_ruling',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Ruling',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'itemID',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'payer',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'SubmissionDepositPaid',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'itemID',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'recipient',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'requestType',
        internalType: 'enum IGeneralizedTCR.Status',
        type: 'uint8',
        indexed: false,
      },
      {
        name: 'ruling',
        internalType: 'enum IArbitrable.Party',
        type: 'uint8',
        indexed: false,
      },
    ],
    name: 'SubmissionDepositTransferred',
  },
  { type: 'error', inputs: [], name: 'ADDRESS_ZERO' },
  { type: 'error', inputs: [], name: 'ARBITRATOR_ARBITRABLE_MISMATCH' },
  { type: 'error', inputs: [], name: 'ARBITRATOR_TOKEN_MISMATCH' },
  {
    type: 'error',
    inputs: [
      { name: 'token', internalType: 'address', type: 'address' },
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'beforeBalance', internalType: 'uint256', type: 'uint256' },
      { name: 'afterBalance', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'BALANCE_DECREASED_UNEXPECTEDLY',
  },
  { type: 'error', inputs: [], name: 'CHALLENGE_MUST_BE_WITHIN_TIME_LIMIT' },
  { type: 'error', inputs: [], name: 'CHALLENGE_PERIOD_MUST_PASS' },
  { type: 'error', inputs: [], name: 'DISPUTE_MUST_NOT_BE_RESOLVED' },
  { type: 'error', inputs: [], name: 'DISPUTE_NOT_SOLVED' },
  { type: 'error', inputs: [], name: 'DISPUTE_TIMEOUT_DISABLED' },
  { type: 'error', inputs: [], name: 'DISPUTE_TIMEOUT_NOT_PASSED' },
  { type: 'error', inputs: [], name: 'INVALID_DISPUTE_ID' },
  { type: 'error', inputs: [], name: 'INVALID_ITEM_DATA' },
  { type: 'error', inputs: [], name: 'INVALID_RULING_OPTION' },
  { type: 'error', inputs: [], name: 'INVALID_SUBMISSION_DEPOSIT_ACTION' },
  { type: 'error', inputs: [], name: 'INVALID_SUBMISSION_DEPOSIT_RECIPIENT' },
  { type: 'error', inputs: [], name: 'INVALID_SUBMISSION_DEPOSIT_STRATEGY' },
  {
    type: 'error',
    inputs: [
      { name: 'startAt', internalType: 'uint64', type: 'uint64' },
      { name: 'endAt', internalType: 'uint64', type: 'uint64' },
    ],
    name: 'INVALID_TIME_WINDOW',
  },
  { type: 'error', inputs: [], name: 'INVALID_VOTING_TOKEN_COMPATIBILITY' },
  {
    type: 'error',
    inputs: [{ name: 'decimals', internalType: 'uint8', type: 'uint8' }],
    name: 'INVALID_VOTING_TOKEN_DECIMALS',
  },
  { type: 'error', inputs: [], name: 'ITEM_MUST_HAVE_PENDING_REQUEST' },
  { type: 'error', inputs: [], name: 'InvalidInitialization' },
  { type: 'error', inputs: [], name: 'MUST_BE_ABSENT_TO_BE_ADDED' },
  { type: 'error', inputs: [], name: 'MUST_BE_A_REQUEST' },
  { type: 'error', inputs: [], name: 'MUST_BE_REGISTERED_TO_BE_REMOVED' },
  { type: 'error', inputs: [], name: 'MUST_FULLY_FUND_YOUR_SIDE' },
  {
    type: 'error',
    inputs: [{ name: 'itemID', internalType: 'bytes32', type: 'bytes32' }],
    name: 'NO_REQUESTS_FOR_ITEM',
  },
  { type: 'error', inputs: [], name: 'NotInitializing' },
  { type: 'error', inputs: [], name: 'ONLY_ARBITRATOR_CAN_RULE' },
  { type: 'error', inputs: [], name: 'REQUEST_ALREADY_DISPUTED' },
  { type: 'error', inputs: [], name: 'REQUEST_MUST_BE_DISPUTED' },
  { type: 'error', inputs: [], name: 'REQUEST_MUST_BE_RESOLVED' },
  { type: 'error', inputs: [], name: 'REQUEST_MUST_NOT_BE_DISPUTED' },
  { type: 'error', inputs: [], name: 'REQUEST_MUST_NOT_BE_RESOLVED' },
  { type: 'error', inputs: [], name: 'ReentrancyGuardReentrantCall' },
  { type: 'error', inputs: [], name: 'SUBMISSION_DEPOSIT_ALREADY_SET' },
  { type: 'error', inputs: [], name: 'SUBMISSION_DEPOSIT_TRANSFER_INCOMPLETE' },
  {
    type: 'error',
    inputs: [{ name: 'token', internalType: 'address', type: 'address' }],
    name: 'SafeERC20FailedOperation',
  },
] as const

/**
 * [__View Contract on Base Basescan__](https://basescan.org/address/0xeC4217c061F84d1Ba97687C9a72B926B0382f747)
 */
export const roundSubmissionTcrAddress = {
  8453: '0xeC4217c061F84d1Ba97687C9a72B926B0382f747',
} as const

/**
 * [__View Contract on Base Basescan__](https://basescan.org/address/0xeC4217c061F84d1Ba97687C9a72B926B0382f747)
 */
export const roundSubmissionTcrConfig = {
  address: roundSubmissionTcrAddress,
  abi: roundSubmissionTcrAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// UMATreasurySuccessResolver
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * [__View Contract on Base Basescan__](https://basescan.org/address/0xB6737Fee8A0c49D1A3f23664Df94dcE2EbBE7a12)
 */
export const umaTreasurySuccessResolverAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: 'assertionCurrency_',
        internalType: 'contract IERC20',
        type: 'address',
      },
      { name: 'escalationManager_', internalType: 'address', type: 'address' },
      { name: 'domainId_', internalType: 'bytes32', type: 'bytes32' },
      { name: 'initialOwner', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'bytes', type: 'bytes' },
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'uint64', type: 'uint64' },
      { name: '', internalType: 'contract IERC20', type: 'address' },
      { name: '', internalType: 'uint256', type: 'uint256' },
      { name: '', internalType: 'bytes32', type: 'bytes32' },
      { name: '', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'assertTruth',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'bytes', type: 'bytes' },
      { name: '', internalType: 'address', type: 'address' },
    ],
    name: 'assertTruthWithDefaults',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [],
    name: 'assertionCurrency',
    outputs: [{ name: '', internalType: 'contract IERC20', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'defaultIdentifier',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'bytes32', type: 'bytes32' },
      { name: '', internalType: 'address', type: 'address' },
    ],
    name: 'disputeAssertion',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [],
    name: 'domainId',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'escalationManager',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'assertionId', internalType: 'bytes32', type: 'bytes32' }],
    name: 'getAssertion',
    outputs: [
      {
        name: '',
        internalType: 'struct OptimisticOracleV3Interface.Assertion',
        type: 'tuple',
        components: [
          {
            name: 'escalationManagerSettings',
            internalType:
              'struct OptimisticOracleV3Interface.EscalationManagerSettings',
            type: 'tuple',
            components: [
              {
                name: 'arbitrateViaEscalationManager',
                internalType: 'bool',
                type: 'bool',
              },
              { name: 'discardOracle', internalType: 'bool', type: 'bool' },
              { name: 'validateDisputers', internalType: 'bool', type: 'bool' },
              {
                name: 'assertingCaller',
                internalType: 'address',
                type: 'address',
              },
              {
                name: 'escalationManager',
                internalType: 'address',
                type: 'address',
              },
            ],
          },
          { name: 'asserter', internalType: 'address', type: 'address' },
          { name: 'assertionTime', internalType: 'uint64', type: 'uint64' },
          { name: 'settled', internalType: 'bool', type: 'bool' },
          {
            name: 'currency',
            internalType: 'contract IERC20',
            type: 'address',
          },
          { name: 'expirationTime', internalType: 'uint64', type: 'uint64' },
          { name: 'settlementResolution', internalType: 'bool', type: 'bool' },
          { name: 'domainId', internalType: 'bytes32', type: 'bytes32' },
          { name: 'identifier', internalType: 'bytes32', type: 'bytes32' },
          { name: 'bond', internalType: 'uint256', type: 'uint256' },
          {
            name: 'callbackRecipient',
            internalType: 'address',
            type: 'address',
          },
          { name: 'disputer', internalType: 'address', type: 'address' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'assertionId', internalType: 'bytes32', type: 'bytes32' }],
    name: 'getAssertionResult',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'getMinimumBond',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [],
    name: 'optimisticOracle',
    outputs: [
      {
        name: '',
        internalType: 'contract OptimisticOracleV3Interface',
        type: 'address',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'treasury', internalType: 'address', type: 'address' },
      { name: 'truthful', internalType: 'bool', type: 'bool' },
    ],
    name: 'prepareAssertionForTreasury',
    outputs: [
      { name: 'assertionId', internalType: 'bytes32', type: 'bytes32' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'treasury', internalType: 'address', type: 'address' }],
    name: 'prepareTruthfulAssertionForTreasury',
    outputs: [
      { name: 'assertionId', internalType: 'bytes32', type: 'bytes32' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'treasury', internalType: 'address', type: 'address' }],
    name: 'resolveTreasurySuccess',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'assertionId', internalType: 'bytes32', type: 'bytes32' },
      { name: 'assertedAt', internalType: 'uint64', type: 'uint64' },
      { name: 'liveness', internalType: 'uint64', type: 'uint64' },
      { name: 'bond', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'setAssertionTail',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'assertionId', internalType: 'bytes32', type: 'bytes32' },
      { name: 'truthful', internalType: 'bool', type: 'bool' },
    ],
    name: 'setSettlementResolution',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'assertionId', internalType: 'bytes32', type: 'bytes32' }],
    name: 'settleAndGetAssertionResult',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'assertionId', internalType: 'bytes32', type: 'bytes32' }],
    name: 'settleAssertion',
    outputs: [],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'bytes32', type: 'bytes32' },
      { name: '', internalType: 'address', type: 'address' },
    ],
    name: 'syncUmaParams',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'defaultCurrency',
        internalType: 'contract IERC20',
        type: 'address',
        indexed: false,
      },
      {
        name: 'defaultLiveness',
        internalType: 'uint64',
        type: 'uint64',
        indexed: false,
      },
      {
        name: 'burnedBondPercentage',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'AdminPropertiesSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'assertionId',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'caller',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'disputer',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'AssertionDisputed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'assertionId',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'domainId',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: false,
      },
      { name: 'claim', internalType: 'bytes', type: 'bytes', indexed: false },
      {
        name: 'asserter',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'callbackRecipient',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'escalationManager',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'caller',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'expirationTime',
        internalType: 'uint64',
        type: 'uint64',
        indexed: false,
      },
      {
        name: 'currency',
        internalType: 'contract IERC20',
        type: 'address',
        indexed: false,
      },
      {
        name: 'bond',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'identifier',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
    ],
    name: 'AssertionMade',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'treasury',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'assertionId',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'settlementResolution',
        internalType: 'bool',
        type: 'bool',
        indexed: false,
      },
    ],
    name: 'AssertionPrepared',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'assertionId',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'bondRecipient',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'disputed', internalType: 'bool', type: 'bool', indexed: false },
      {
        name: 'settlementResolution',
        internalType: 'bool',
        type: 'bool',
        indexed: false,
      },
      {
        name: 'settleCaller',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'AssertionSettled',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'treasury',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'TreasurySuccessResolved',
  },
  { type: 'error', inputs: [], name: 'ADDRESS_ZERO' },
  {
    type: 'error',
    inputs: [{ name: 'assertionId', internalType: 'bytes32', type: 'bytes32' }],
    name: 'ASSERTION_NOT_FOUND',
  },
  {
    type: 'error',
    inputs: [{ name: 'assertionId', internalType: 'bytes32', type: 'bytes32' }],
    name: 'ASSERTION_NOT_SETTLED',
  },
  {
    type: 'error',
    inputs: [{ name: 'target', internalType: 'address', type: 'address' }],
    name: 'NOT_A_CONTRACT',
  },
  {
    type: 'error',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'OwnableInvalidOwner',
  },
  {
    type: 'error',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'OwnableUnauthorizedAccount',
  },
  { type: 'error', inputs: [], name: 'UNSUPPORTED' },
] as const

/**
 * [__View Contract on Base Basescan__](https://basescan.org/address/0xB6737Fee8A0c49D1A3f23664Df94dcE2EbBE7a12)
 */
export const umaTreasurySuccessResolverAddress = {
  8453: '0xB6737Fee8A0c49D1A3f23664Df94dcE2EbBE7a12',
} as const

/**
 * [__View Contract on Base Basescan__](https://basescan.org/address/0xB6737Fee8A0c49D1A3f23664Df94dcE2EbBE7a12)
 */
export const umaTreasurySuccessResolverConfig = {
  address: umaTreasurySuccessResolverAddress,
  abi: umaTreasurySuccessResolverAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// UnderwriterSlasherRouter
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * [__View Contract on Base Basescan__](https://basescan.org/address/0xE991c419A59000C902c481a38C6BA329ad6b97FC)
 */
export const underwriterSlasherRouterAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: 'stakeVault_',
        internalType: 'contract IStakeVault',
        type: 'address',
      },
      { name: 'authority_', internalType: 'address', type: 'address' },
      {
        name: 'directory_',
        internalType: 'contract IJBDirectory',
        type: 'address',
      },
      { name: 'goalRevnetId_', internalType: 'uint256', type: 'uint256' },
      { name: 'goalToken_', internalType: 'contract IERC20', type: 'address' },
      {
        name: 'cobuildToken_',
        internalType: 'contract IERC20',
        type: 'address',
      },
      {
        name: 'goalSuperToken_',
        internalType: 'contract ISuperToken',
        type: 'address',
      },
      { name: 'goalFundingTarget_', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'authority',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'cobuildToken',
    outputs: [{ name: '', internalType: 'contract IERC20', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'directory',
    outputs: [
      { name: '', internalType: 'contract IJBDirectory', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'goalFundingTarget',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'goalRevnetId',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'goalSuperToken',
    outputs: [
      { name: '', internalType: 'contract ISuperToken', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'goalToken',
    outputs: [{ name: '', internalType: 'contract IERC20', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'stakeVault_',
        internalType: 'contract IStakeVault',
        type: 'address',
      },
      { name: 'authority_', internalType: 'address', type: 'address' },
      {
        name: 'directory_',
        internalType: 'contract IJBDirectory',
        type: 'address',
      },
      { name: 'goalRevnetId_', internalType: 'uint256', type: 'uint256' },
      { name: 'goalToken_', internalType: 'contract IERC20', type: 'address' },
      {
        name: 'cobuildToken_',
        internalType: 'contract IERC20',
        type: 'address',
      },
      {
        name: 'goalSuperToken_',
        internalType: 'contract ISuperToken',
        type: 'address',
      },
      { name: 'goalFundingTarget_', internalType: 'address', type: 'address' },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'isAuthorizedPremiumEscrow',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'retryConversionAndForward',
    outputs: [
      { name: 'convertedGoalAmount', internalType: 'uint256', type: 'uint256' },
      {
        name: 'forwardedSuperTokenAmount',
        internalType: 'uint256',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'retryForwarding',
    outputs: [
      {
        name: 'forwardedSuperTokenAmount',
        internalType: 'uint256',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'premiumEscrow', internalType: 'address', type: 'address' },
      { name: 'authorized', internalType: 'bool', type: 'bool' },
    ],
    name: 'setAuthorizedPremiumEscrow',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'underwriter', internalType: 'address', type: 'address' },
      { name: 'weightAmount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'slashUnderwriter',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'stakeVault',
    outputs: [
      { name: '', internalType: 'contract IStakeVault', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'premiumEscrow',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'underwriter',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'cobuildAmount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      { name: 'reason', internalType: 'bytes', type: 'bytes', indexed: false },
    ],
    name: 'CobuildConversionFailed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'premiumEscrow',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'underwriter',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'superTokenAmount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      { name: 'reason', internalType: 'bytes', type: 'bytes', indexed: false },
    ],
    name: 'GoalSuperTokenForwardingFailed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'caller',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'goalBalanceBefore',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'superTokenBalanceBefore',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'forwardedSuperTokenAmount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'GoalSuperTokenForwardingRetried',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'premiumEscrow',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'underwriter',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'goalAmount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      { name: 'reason', internalType: 'bytes', type: 'bytes', indexed: false },
    ],
    name: 'GoalSuperTokenUpgradeFailed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'version',
        internalType: 'uint64',
        type: 'uint64',
        indexed: false,
      },
    ],
    name: 'Initialized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'premiumEscrow',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'authorized',
        internalType: 'bool',
        type: 'bool',
        indexed: false,
      },
    ],
    name: 'PremiumEscrowAuthorizationSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'premiumEscrow',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'underwriter',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'requestedWeight',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'goalSlashedAmount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'cobuildSlashedAmount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'convertedGoalAmount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'forwardedSuperTokenAmount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'UnderwriterSlashRouted',
  },
  { type: 'error', inputs: [], name: 'ADDRESS_ZERO' },
  {
    type: 'error',
    inputs: [
      { name: 'expected', internalType: 'address', type: 'address' },
      { name: 'actual', internalType: 'address', type: 'address' },
    ],
    name: 'GOAL_TOKEN_SUPER_TOKEN_UNDERLYING_MISMATCH',
  },
  {
    type: 'error',
    inputs: [
      { name: 'expected', internalType: 'address', type: 'address' },
      { name: 'actual', internalType: 'address', type: 'address' },
    ],
    name: 'INVALID_COBUILD_TOKEN',
  },
  {
    type: 'error',
    inputs: [{ name: 'terminal', internalType: 'address', type: 'address' }],
    name: 'INVALID_GOAL_TERMINAL',
  },
  {
    type: 'error',
    inputs: [
      { name: 'expected', internalType: 'address', type: 'address' },
      { name: 'actual', internalType: 'address', type: 'address' },
    ],
    name: 'INVALID_GOAL_TOKEN',
  },
  {
    type: 'error',
    inputs: [
      { name: 'premiumEscrow', internalType: 'address', type: 'address' },
    ],
    name: 'INVALID_PREMIUM_ESCROW',
  },
  { type: 'error', inputs: [], name: 'InvalidInitialization' },
  { type: 'error', inputs: [], name: 'NotInitializing' },
  { type: 'error', inputs: [], name: 'ONLY_AUTHORITY' },
  { type: 'error', inputs: [], name: 'ONLY_AUTHORIZED_PREMIUM_ESCROW' },
  { type: 'error', inputs: [], name: 'ReentrancyGuardReentrantCall' },
  {
    type: 'error',
    inputs: [
      { name: 'target', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'SUPER_TOKEN_TRANSFER_RETURNED_FALSE',
  },
  {
    type: 'error',
    inputs: [{ name: 'token', internalType: 'address', type: 'address' }],
    name: 'SafeERC20FailedOperation',
  },
] as const

/**
 * [__View Contract on Base Basescan__](https://basescan.org/address/0xE991c419A59000C902c481a38C6BA329ad6b97FC)
 */
export const underwriterSlasherRouterAddress = {
  8453: '0xE991c419A59000C902c481a38C6BA329ad6b97FC',
} as const

/**
 * [__View Contract on Base Basescan__](https://basescan.org/address/0xE991c419A59000C902c481a38C6BA329ad6b97FC)
 */
export const underwriterSlasherRouterConfig = {
  address: underwriterSlasherRouterAddress,
  abi: underwriterSlasherRouterAbi,
} as const
