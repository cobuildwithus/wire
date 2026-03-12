export const jbControllerAbi = [
  {
    type: "function",
    inputs: [{ name: "projectId", internalType: "uint256", type: "uint256" }],
    name: "currentRulesetOf",
    outputs: [
      {
        name: "ruleset",
        internalType: "tuple",
        type: "tuple",
        components: [
          { name: "cycleNumber", internalType: "uint48", type: "uint48" },
          { name: "id", internalType: "uint48", type: "uint48" },
          { name: "basedOnId", internalType: "uint48", type: "uint48" },
          { name: "start", internalType: "uint48", type: "uint48" },
          { name: "duration", internalType: "uint32", type: "uint32" },
          { name: "weight", internalType: "uint112", type: "uint112" },
          { name: "weightCutPercent", internalType: "uint32", type: "uint32" },
          { name: "approvalHook", internalType: "address", type: "address" },
          { name: "metadata", internalType: "uint256", type: "uint256" },
        ],
      },
      {
        name: "metadata",
        internalType: "tuple",
        type: "tuple",
        components: [
          { name: "reservedPercent", internalType: "uint16", type: "uint16" },
          { name: "cashOutTaxRate", internalType: "uint16", type: "uint16" },
          { name: "baseCurrency", internalType: "uint32", type: "uint32" },
          { name: "pausePay", internalType: "bool", type: "bool" },
        ],
      },
    ],
    stateMutability: "view",
  },
] as const;

export const jbDirectoryAbi = [
  {
    type: "function",
    inputs: [
      { name: "projectId", internalType: "uint256", type: "uint256" },
      { name: "token", internalType: "address", type: "address" },
    ],
    name: "primaryTerminalOf",
    outputs: [{ name: "", internalType: "address", type: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [{ name: "projectId", internalType: "uint256", type: "uint256" }],
    name: "terminalsOf",
    outputs: [{ name: "", internalType: "address[]", type: "address[]" }],
    stateMutability: "view",
  },
] as const;

export const jbMultiTerminalAbi = [
  {
    type: "function",
    inputs: [{ name: "projectId", internalType: "uint256", type: "uint256" }],
    name: "accountingContextsOf",
    outputs: [
      {
        name: "",
        internalType: "tuple[]",
        type: "tuple[]",
        components: [
          { name: "token", internalType: "address", type: "address" },
          { name: "decimals", internalType: "uint8", type: "uint8" },
          { name: "currency", internalType: "uint32", type: "uint32" },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "projectId", internalType: "uint256", type: "uint256" },
      { name: "token", internalType: "address", type: "address" },
    ],
    name: "accountingContextForTokenOf",
    outputs: [
      {
        name: "",
        internalType: "tuple",
        type: "tuple",
        components: [
          { name: "token", internalType: "address", type: "address" },
          { name: "decimals", internalType: "uint8", type: "uint8" },
          { name: "currency", internalType: "uint32", type: "uint32" },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "projectId", internalType: "uint256", type: "uint256" },
      { name: "token", internalType: "address", type: "address" },
      { name: "amount", internalType: "uint256", type: "uint256" },
      { name: "beneficiary", internalType: "address", type: "address" },
      { name: "minReturnedTokens", internalType: "uint256", type: "uint256" },
      { name: "memo", internalType: "string", type: "string" },
      { name: "metadata", internalType: "bytes", type: "bytes" },
    ],
    name: "pay",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "payable",
  },
  {
    type: "function",
    inputs: [
      { name: "holder", internalType: "address", type: "address" },
      { name: "projectId", internalType: "uint256", type: "uint256" },
      { name: "cashOutCount", internalType: "uint256", type: "uint256" },
      { name: "tokenToReclaim", internalType: "address", type: "address" },
      { name: "minTokensReclaimed", internalType: "uint256", type: "uint256" },
      { name: "beneficiary", internalType: "address", type: "address" },
      { name: "metadata", internalType: "bytes", type: "bytes" },
    ],
    name: "cashOutTokensOf",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "nonpayable",
  },
] as const;

export const jbPermissionsAbi = [
  {
    type: "function",
    inputs: [
      { name: "operator", internalType: "address", type: "address" },
      { name: "account", internalType: "address", type: "address" },
      { name: "projectId", internalType: "uint256", type: "uint256" },
      { name: "permissionId", internalType: "uint256", type: "uint256" },
      { name: "includeRoot", internalType: "bool", type: "bool" },
      { name: "includeWildcardProjectId", internalType: "bool", type: "bool" },
    ],
    name: "hasPermission",
    outputs: [{ name: "", internalType: "bool", type: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "account", internalType: "address", type: "address" },
      {
        name: "permissionsData",
        internalType: "tuple",
        type: "tuple",
        components: [
          { name: "operator", internalType: "address", type: "address" },
          { name: "projectId", internalType: "uint64", type: "uint64" },
          { name: "permissionIds", internalType: "uint8[]", type: "uint8[]" },
        ],
      },
    ],
    name: "setPermissionsFor",
    outputs: [],
    stateMutability: "nonpayable",
  },
] as const;

export const jbTerminalStoreAbi = [
  {
    type: "function",
    inputs: [
      { name: "projectId", internalType: "uint256", type: "uint256" },
      { name: "cashOutCount", internalType: "uint256", type: "uint256" },
      { name: "terminals", internalType: "address[]", type: "address[]" },
      {
        name: "accountingContexts",
        internalType: "tuple[]",
        type: "tuple[]",
        components: [
          { name: "token", internalType: "address", type: "address" },
          { name: "decimals", internalType: "uint8", type: "uint8" },
          { name: "currency", internalType: "uint32", type: "uint32" },
        ],
      },
      { name: "decimals", internalType: "uint256", type: "uint256" },
      { name: "currency", internalType: "uint256", type: "uint256" },
    ],
    name: "currentReclaimableSurplusOf",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
] as const;

export const jbTokensAbi = [
  {
    type: "function",
    inputs: [{ name: "projectId", internalType: "uint256", type: "uint256" }],
    name: "tokenOf",
    outputs: [{ name: "", internalType: "address", type: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "holder", internalType: "address", type: "address" },
      { name: "projectId", internalType: "uint256", type: "uint256" },
    ],
    name: "totalBalanceOf",
    outputs: [{ name: "balance", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
] as const;

export const revDeployerAbi = [
  {
    type: "function",
    inputs: [],
    name: "PERMISSIONS",
    outputs: [{ name: "", internalType: "address", type: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [{ name: "revnetId", internalType: "uint256", type: "uint256" }],
    name: "loansOf",
    outputs: [{ name: "", internalType: "address", type: "address" }],
    stateMutability: "view",
  },
] as const;

export const revLoansAbi = [
  {
    type: "function",
    inputs: [{ name: "revnetId", internalType: "uint256", type: "uint256" }],
    name: "loanSourcesOf",
    outputs: [
      {
        name: "",
        internalType: "tuple[]",
        type: "tuple[]",
        components: [
          { name: "token", internalType: "address", type: "address" },
          { name: "terminal", internalType: "address", type: "address" },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "revnetId", internalType: "uint256", type: "uint256" },
      { name: "collateralCount", internalType: "uint256", type: "uint256" },
      { name: "decimals", internalType: "uint256", type: "uint256" },
      { name: "currency", internalType: "uint256", type: "uint256" },
    ],
    name: "borrowableAmountFrom",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "REV_PREPAID_FEE_PERCENT",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "MIN_PREPAID_FEE_PERCENT",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "MAX_PREPAID_FEE_PERCENT",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "LOAN_LIQUIDATION_DURATION",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "revnetId", internalType: "uint256", type: "uint256" },
      {
        name: "source",
        internalType: "tuple",
        type: "tuple",
        components: [
          { name: "token", internalType: "address", type: "address" },
          { name: "terminal", internalType: "address", type: "address" },
        ],
      },
      { name: "minBorrowAmount", internalType: "uint256", type: "uint256" },
      { name: "collateralCount", internalType: "uint256", type: "uint256" },
      { name: "beneficiary", internalType: "address", type: "address" },
      { name: "prepaidFeePercent", internalType: "uint256", type: "uint256" },
    ],
    name: "borrowFrom",
    outputs: [
      { name: "loanId", internalType: "uint256", type: "uint256" },
      {
        name: "",
        internalType: "tuple",
        type: "tuple",
        components: [
          { name: "amount", internalType: "uint112", type: "uint112" },
          { name: "collateral", internalType: "uint112", type: "uint112" },
          { name: "createdAt", internalType: "uint48", type: "uint48" },
          { name: "prepaidFeePercent", internalType: "uint16", type: "uint16" },
          { name: "prepaidDuration", internalType: "uint32", type: "uint32" },
          {
            name: "source",
            internalType: "tuple",
            type: "tuple",
            components: [
              { name: "token", internalType: "address", type: "address" },
              { name: "terminal", internalType: "address", type: "address" },
            ],
          },
        ],
      },
    ],
    stateMutability: "nonpayable",
  },
] as const;

export const jbMultiTerminalRevnetAbi = jbMultiTerminalAbi;
export const jbPermissionsRevnetAbi = jbPermissionsAbi;
export const revLoansRevnetAbi = revLoansAbi;
