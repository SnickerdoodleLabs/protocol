export default {
  _format: "hh-sol-artifact-1",
  contractName: "Consent",
  sourceName: "contracts/consent/Consent.sol",
  abi: [
    {
      inputs: [],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      inputs: [],
      name: "AccessControlBadConfirmation",
      type: "error",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "account",
          type: "address",
        },
        {
          internalType: "bytes32",
          name: "neededRole",
          type: "bytes32",
        },
      ],
      name: "AccessControlUnauthorizedAccount",
      type: "error",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "target",
          type: "address",
        },
      ],
      name: "AddressEmptyCode",
      type: "error",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "account",
          type: "address",
        },
      ],
      name: "AddressInsufficientBalance",
      type: "error",
    },
    {
      inputs: [],
      name: "ECDSAInvalidSignature",
      type: "error",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "length",
          type: "uint256",
        },
      ],
      name: "ECDSAInvalidSignatureLength",
      type: "error",
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "s",
          type: "bytes32",
        },
      ],
      name: "ECDSAInvalidSignatureS",
      type: "error",
    },
    {
      inputs: [],
      name: "EnforcedPause",
      type: "error",
    },
    {
      inputs: [],
      name: "ExpectedPause",
      type: "error",
    },
    {
      inputs: [],
      name: "FailedInnerCall",
      type: "error",
    },
    {
      inputs: [],
      name: "InvalidInitialization",
      type: "error",
    },
    {
      inputs: [],
      name: "NotInitializing",
      type: "error",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "token",
          type: "address",
        },
      ],
      name: "SafeERC20FailedOperation",
      type: "error",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "string",
          name: "domain",
          type: "string",
        },
      ],
      name: "AddDomain",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "uint256",
          name: "index",
          type: "uint256",
        },
        {
          indexed: true,
          internalType: "bytes32",
          name: "commitment",
          type: "bytes32",
        },
      ],
      name: "Commitment",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "depositor",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "asset",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
      ],
      name: "Deposit",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint64",
          name: "version",
          type: "uint64",
        },
      ],
      name: "Initialized",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "address",
          name: "account",
          type: "address",
        },
      ],
      name: "Paused",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "string",
          name: "domain",
          type: "string",
        },
      ],
      name: "RemoveDomain",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "requester",
          type: "address",
        },
        {
          indexed: true,
          internalType: "string",
          name: "ipfsCIDIndexed",
          type: "string",
        },
        {
          indexed: false,
          internalType: "string",
          name: "ipfsCID",
          type: "string",
        },
      ],
      name: "RequestForData",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "bytes32",
          name: "role",
          type: "bytes32",
        },
        {
          indexed: true,
          internalType: "bytes32",
          name: "previousAdminRole",
          type: "bytes32",
        },
        {
          indexed: true,
          internalType: "bytes32",
          name: "newAdminRole",
          type: "bytes32",
        },
      ],
      name: "RoleAdminChanged",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "bytes32",
          name: "role",
          type: "bytes32",
        },
        {
          indexed: true,
          internalType: "address",
          name: "account",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "sender",
          type: "address",
        },
      ],
      name: "RoleGranted",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "bytes32",
          name: "role",
          type: "bytes32",
        },
        {
          indexed: true,
          internalType: "address",
          name: "account",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "sender",
          type: "address",
        },
      ],
      name: "RoleRevoked",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "address",
          name: "account",
          type: "address",
        },
      ],
      name: "Unpaused",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "depositor",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "asset",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
      ],
      name: "Withdraw",
      type: "event",
    },
    {
      inputs: [],
      name: "DEFAULT_ADMIN_ROLE",
      outputs: [
        {
          internalType: "bytes32",
          name: "",
          type: "bytes32",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "PAUSER_ROLE",
      outputs: [
        {
          internalType: "bytes32",
          name: "",
          type: "bytes32",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "REQUESTER_ROLE",
      outputs: [
        {
          internalType: "bytes32",
          name: "",
          type: "bytes32",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "SIGNER_ROLE",
      outputs: [
        {
          internalType: "bytes32",
          name: "",
          type: "bytes32",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "STAKER_ROLE",
      outputs: [
        {
          internalType: "bytes32",
          name: "",
          type: "bytes32",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "domain",
          type: "string",
        },
      ],
      name: "addDomain",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "baseURI",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes32[]",
          name: "commitmentBatch",
          type: "bytes32[]",
        },
      ],
      name: "batchOptIn",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes32[]",
          name: "commitsToCheck",
          type: "bytes32[]",
        },
      ],
      name: "checkCommitments",
      outputs: [
        {
          internalType: "uint256[]",
          name: "",
          type: "uint256[]",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "domain",
          type: "string",
        },
      ],
      name: "checkDomain",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256[]",
          name: "noncesToCheck",
          type: "uint256[]",
        },
      ],
      name: "checkNonces",
      outputs: [
        {
          internalType: "bool[]",
          name: "",
          type: "bool[]",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "depositToken",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
      ],
      name: "depositStake",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "disableOpenOptIn",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "enableOpenOptIn",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "start",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "stop",
          type: "uint256",
        },
      ],
      name: "fetchAnonymitySet",
      outputs: [
        {
          internalType: "bytes32[]",
          name: "",
          type: "bytes32[]",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getContentAddress",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "stakingToken",
          type: "address",
        },
      ],
      name: "getNumberOfStakedTags",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "role",
          type: "bytes32",
        },
      ],
      name: "getRoleAdmin",
      outputs: [
        {
          internalType: "bytes32",
          name: "",
          type: "bytes32",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "stakingToken",
          type: "address",
        },
      ],
      name: "getTagArray",
      outputs: [
        {
          components: [
            {
              internalType: "string",
              name: "tag",
              type: "string",
            },
            {
              internalType: "uint256",
              name: "slot",
              type: "uint256",
            },
          ],
          internalType: "struct IContentObject.Tag[]",
          name: "",
          type: "tuple[]",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "role",
          type: "bytes32",
        },
        {
          internalType: "address",
          name: "account",
          type: "address",
        },
      ],
      name: "grantRole",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "role",
          type: "bytes32",
        },
        {
          internalType: "address",
          name: "account",
          type: "address",
        },
      ],
      name: "hasRole",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_consentOwner",
          type: "address",
        },
        {
          internalType: "string",
          name: "baseURI_",
          type: "string",
        },
        {
          internalType: "address",
          name: "_contractFactoryAddress",
          type: "address",
        },
      ],
      name: "initialize",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "tag",
          type: "string",
        },
        {
          internalType: "address",
          name: "stakingToken",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "stake",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "_newSlot",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "_existingSlot",
          type: "uint256",
        },
      ],
      name: "moveExistingListingUpstream",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "tag",
          type: "string",
        },
        {
          internalType: "address",
          name: "stakingToken",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "stake",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "_newSlot",
          type: "uint256",
        },
      ],
      name: "newGlobalTag",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "tag",
          type: "string",
        },
        {
          internalType: "address",
          name: "stakingToken",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "stake",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "_existingSlot",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "_newSlot",
          type: "uint256",
        },
      ],
      name: "newLocalTagDownstream",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "tag",
          type: "string",
        },
        {
          internalType: "address",
          name: "stakingToken",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "stake",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "_newSlot",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "_existingSlot",
          type: "uint256",
        },
      ],
      name: "newLocalTagUpstream",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "openOptInDisabled",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "commitment",
          type: "bytes32",
        },
      ],
      name: "optIn",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "pause",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "paused",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "queryHorizon",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "domain",
          type: "string",
        },
      ],
      name: "removeDomain",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "tag",
          type: "string",
        },
        {
          internalType: "address",
          name: "stakingToken",
          type: "address",
        },
      ],
      name: "removeListing",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "depositToken",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
      ],
      name: "removeStake",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "role",
          type: "bytes32",
        },
        {
          internalType: "address",
          name: "callerConfirmation",
          type: "address",
        },
      ],
      name: "renounceRole",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "tag",
          type: "string",
        },
        {
          internalType: "address",
          name: "stakingToken",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "stake",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "_slot",
          type: "uint256",
        },
      ],
      name: "replaceExpiredListing",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "ipfsCID",
          type: "string",
        },
      ],
      name: "requestForData",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "tag",
          type: "string",
        },
        {
          internalType: "address",
          name: "stakingToken",
          type: "address",
        },
      ],
      name: "restakeExpiredListing",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "nonce",
          type: "uint256",
        },
        {
          internalType: "bytes32",
          name: "commitment",
          type: "bytes32",
        },
        {
          internalType: "bytes",
          name: "signature",
          type: "bytes",
        },
      ],
      name: "restrictedOptIn",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "role",
          type: "bytes32",
        },
        {
          internalType: "address",
          name: "account",
          type: "address",
        },
      ],
      name: "revokeRole",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "newURI",
          type: "string",
        },
      ],
      name: "setBaseURI",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "queryHorizon_",
          type: "uint256",
        },
      ],
      name: "setQueryHorizon",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes4",
          name: "interfaceId",
          type: "bytes4",
        },
      ],
      name: "supportsInterface",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "tag",
          type: "string",
        },
        {
          internalType: "address",
          name: "stakingToken",
          type: "address",
        },
      ],
      name: "tagIndices",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "totalSupply",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "unpause",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
  ],
  bytecode:
    "0x60806040523480156200001157600080fd5b506200001c62000022565b620000d6565b7ff0c57e16840df040f15088dc2f81fe391c3923bec73e23a9662efc9c229c6a00805468010000000000000000900460ff1615620000735760405163f92ee8a960e01b815260040160405180910390fd5b80546001600160401b0390811614620000d35780546001600160401b0319166001600160401b0390811782556040519081527fc7f505b2f371ae2175ee4913f4499e1f2633a7b5936321eed1cdaeb6115181d29060200160405180910390a15b50565b61416280620000e66000396000f3fe608060405234801561001057600080fd5b50600436106102ea5760003560e01c80637bb7c0d81161018c578063ae23c782116100ee578063d547741f11610097578063f2e7cdc311610071578063f2e7cdc314610711578063f7aafaae14610724578063fafc130b1461073757600080fd5b8063d547741f146106a1578063e63ab1e9146106b4578063f2413257146106db57600080fd5b8063cecc2eac116100c8578063cecc2eac14610666578063d28b4bfb1461066e578063d38ab5ff1461068157600080fd5b8063ae23c7821461062d578063cbe0ee3314610640578063ccbd34691461065357600080fd5b80639dc82bd111610150578063a217fddf1161012a578063a217fddf146105f2578063a451e041146105fa578063ac60218c1461060d57600080fd5b80639dc82bd11461059e578063a1260cdf146105be578063a1ebf35d146105cb57600080fd5b80637bb7c0d81461051757806382df298d1461052a5780638456cb591461053d57806390b9d3591461054557806391d148541461055857600080fd5b806343166d78116102505780635c975abb116101f95780636c0360eb116101d35780636c0360eb146104f45780636cf0dc30146104fc57806372be0f1f1461050f57600080fd5b80635c975abb1461047d57806368ce7d8a146104a75780636ad3f723146104ba57600080fd5b80634a938bae1161022a5780634a938bae146104445780635410f3651461045757806355f804b31461046a57600080fd5b806343166d78146103f75780634430db7e1461040a57806344e2e74c1461043157600080fd5b806328eda0b2116102b25780633780b3ed1161028c5780633780b3ed146103c75780633f4ba83a146103dc57806340018a25146103e457600080fd5b806328eda0b21461038e5780632f2ff15d146103a157806336568abe146103b457600080fd5b806301ffc9a7146102ef57806318160ddd146103175780632277892914610329578063248a9ca31461033e5780632537a8a51461036e575b600080fd5b6103026102fd3660046136b8565b610740565b60405190151581526020015b60405180910390f35b6004545b60405190815260200161030e565b61033c61033736600461372b565b610777565b005b61031b61034c36600461376d565b60009081526000805160206140a5833981519152602052604090206001015490565b61038161037c3660046137a2565b6107c6565b60405161030e9190613846565b61033c61039c366004613859565b61082a565b61033c6103af3660046138c9565b610890565b61033c6103c23660046138c9565b6108c8565b61031b6000805160206140ed83398151915281565b61033c6108fb565b61033c6103f23660046138f5565b610930565b61030261040536600461372b565b610b55565b61031b7f61a3517f153a09154844ed8be639dabc6e78dc22315c2d9a91f7eddf9398c00281565b61033c61043f36600461372b565b610bc2565b61033c61045236600461398d565b610c0c565b61033c6104653660046139c3565b610d7a565b61033c61047836600461372b565b610e26565b7fcd5ed15c6e187e77e9aee88184c21f4f2182ab5827cb3b7e07fbedcd63f033005460ff16610302565b61033c6104b53660046139c3565b610e3e565b7f1f22a6cf75eb7fcaad2fabbc6dbce35f91d9ea3ad7582b03d6421676b0930e03546040516001600160a01b03909116815260200161030e565b610381610f73565b61033c61050a36600461372b565b611001565b61033c61107e565b61033c610525366004613a30565b6110b5565b61033c610538366004613859565b6112a3565b61033c611300565b61033c61055336600461376d565b611332565b6103026105663660046138c9565b60009182526000805160206140a5833981519152602090815260408084206001600160a01b0393909316845291905290205460ff1690565b6105b16105ac366004613ae1565b61146a565b60405161030e9190613afc565b6001546103029060ff1681565b61031b7fe2f4eaae4a9751e85a3e4a7b9587827a877f29914755229b07a7b2da98285f7081565b61031b600081565b61033c610608366004613b74565b611593565b61062061061b366004613bda565b6115f7565b60405161030e9190613bfc565b61033c61063b36600461376d565b6116ae565b61031b61064e3660046137a2565b611736565b61033c6106613660046137a2565b61174d565b61033c6117a6565b61033c61067c366004613859565b6117df565b61069461068f36600461398d565b61183c565b60405161030e9190613c40565b61033c6106af3660046138c9565b6118f4565b61031b7f65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a81565b61031b6106e9366004613ae1565b6001600160a01b0316600090815260008051602061410d833981519152602052604090205490565b61033c61071f366004613b74565b611926565b61062061073236600461398d565b611982565b61031b60025481565b60006001600160e01b03198216637965db0b60e01b148061077157506301ffc9a760e01b6001600160e01b03198316145b92915050565b600061078281611a28565b6107c183838080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250611a3292505050565b505050565b60606000805160206140ed8339815191526107e081611a28565b61082185858080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250879250611b99915050565b95945050505050565b6000805160206140ed83398151915261084281611a28565b61088787878080601f0160208091040260200160405190810160405280939291908181526020018383808284376000920191909152508992508891508790508661204e565b50505050505050565b60008281526000805160206140a583398151915260205260409020600101546108b881611a28565b6108c283836121f0565b50505050565b6001600160a01b03811633146108f15760405163334bd91960e11b815260040160405180910390fd5b6107c182826122ad565b7f65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a61092581611a28565b61092d612341565b50565b6109386123b3565b60008481526005602052604090205460ff161561099c5760405162461bcd60e51b815260206004820152601b60248201527f436f6e73656e743a206e6f6e636520616c72656164792075736564000000000060448201526064015b60405180910390fd5b6040516bffffffffffffffffffffffff193060601b16602082015260348101859052600090610a1190605401604051602081830303815290604052805190602001207f19457468657265756d205369676e6564204d6573736167653a0a3332000000006000908152601c91909152603c902090565b9050610a538184848080601f0160208091040260200160405190810160405280939291908181526020018383808284376000920191909152506123f892505050565b610ac55760405162461bcd60e51b815260206004820152603160248201527f436f6e73656e743a20436f6e7472616374206f776e657220646964206e6f742060448201527f7369676e2074686973206d6573736167650000000000000000000000000000006064820152608401610993565b60048054600181810183557f8a35acfbc15ff81a39ae7d344fd709f28e8600b4aa8c65c6b64bfe7fe36bd19b909101869055815460008781526003602090815260408083209390935589825260059052818120805460ff1916909317909255915491518692917fae00c540259638f579ebd3eeca58b0ffa10b9b1ab00a7862cae8eb32e04c606891a35050505050565b6040516000907f29912872bb1868dd74efe86230a05098a24ae1f39d64ec2129d982442801ac009081908390610b919087908790602001613c7a565b60408051808303601f190181529181528151602092830120835290820192909252016000205460ff16949350505050565b6000610bcd81611a28565b6107c183838080601f0160208091040260200160405190810160405280939291908181526020018383808284376000920191909152506124aa92505050565b610c146123b3565b60015460ff1615610c7c5760405162461bcd60e51b815260206004820152602c60248201527f436f6e73656e743a204f70656e206f70742d696e73206172652063757272656e60448201526b1d1b1e48191a5cd8589b195960a21b6064820152608401610993565b8060005b818110156108c2576000848483818110610c9c57610c9c613c8a565b9050602002013590506003600082815260200190815260200160002054600014610d085760405162461bcd60e51b815260206004820152601960248201527f436f6d6d69746d656e742065786973747320616c7265616479000000000000006044820152606401610993565b600480546001810182557f8a35acfbc15ff81a39ae7d344fd709f28e8600b4aa8c65c6b64bfe7fe36bd19b0182905554600082815260036020526040808220839055518392917fae00c540259638f579ebd3eeca58b0ffa10b9b1ab00a7862cae8eb32e04c606891a350600101610c80565b6000805160206140ed833981519152610d9281611a28565b6001600160a01b038316600090815260066020908152604080832033845290915281208054849290610dc5908490613cb6565b90915550610de090506001600160a01b03841633308561254f565b6040518281526001600160a01b0384169033907f5548c837ab068cf56a2c2479df0882a4922fd203edb7517321831d95078c5f62906020015b60405180910390a3505050565b6000610e3181611a28565b60006108c2838583613d4b565b6001600160a01b0382166000908152600660209081526040808320338452909152902054811115610ee25760405162461bcd60e51b815260206004820152604260248201527f436f6e73656e7420436f6e74726163743a20616d6f756e74206c61726765722060448201527f7468616e206f75747374616e64696e67206465706f7369746f722062616c616e606482015261636560f01b608482015260a401610993565b6001600160a01b038216600090815260066020908152604080832033845290915281208054839290610f15908490613e0c565b90915550610f2f90506001600160a01b03831633836125cb565b6040518181526001600160a01b0383169033907f9b1bfa7fa9ee420a16e124f794c35ac9f90472acc99140eb2f6447c714cad8eb9060200160405180910390a35050565b60008054610f8090613cc9565b80601f0160208091040260200160405190810160405280929190818152602001828054610fac90613cc9565b8015610ff95780601f10610fce57610100808354040283529160200191610ff9565b820191906000526020600020905b815481529060010190602001808311610fdc57829003601f168201915b505050505081565b7f61a3517f153a09154844ed8be639dabc6e78dc22315c2d9a91f7eddf9398c00261102b81611a28565b828260405161103b929190613c7a565b6040518091039020336001600160a01b03167f31df2703b10660cea45214572e0616949f363a34b1c19dca24026609f46655708585604051610e19929190613e1f565b7f65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a6110a881611a28565b506001805460ff19169055565b7ff0c57e16840df040f15088dc2f81fe391c3923bec73e23a9662efc9c229c6a00805468010000000000000000810460ff16159067ffffffffffffffff166000811580156111005750825b905060008267ffffffffffffffff16600114801561111d5750303b155b90508115801561112b575080155b156111495760405163f92ee8a960e01b815260040160405180910390fd5b845467ffffffffffffffff19166001178555831561117d57845468ff00000000000000001916680100000000000000001785555b6111856125fc565b61118d61260c565b6111978630612614565b4360025560006111a78882613e4e565b506111b36000896121f0565b506111de7f65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a896121f0565b506112097fe2f4eaae4a9751e85a3e4a7b9587827a877f29914755229b07a7b2da98285f70896121f0565b506112347f61a3517f153a09154844ed8be639dabc6e78dc22315c2d9a91f7eddf9398c002896121f0565b5061124d6000805160206140ed833981519152896121f0565b50831561129957845468ff000000000000000019168555604051600181527fc7f505b2f371ae2175ee4913f4499e1f2633a7b5936321eed1cdaeb6115181d29060200160405180910390a15b5050505050505050565b6000805160206140ed8339815191526112bb81611a28565b61088787878080601f0160208091040260200160405190810160405280939291908181526020018383808284376000920191909152508992508891508790508661262a565b7f65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a61132a81611a28565b61092d612792565b61133a6123b3565b60015460ff16156113a25760405162461bcd60e51b815260206004820152602c60248201527f436f6e73656e743a204f70656e206f70742d696e73206172652063757272656e60448201526b1d1b1e48191a5cd8589b195960a21b6064820152608401610993565b600081815260036020526040902054156113fe5760405162461bcd60e51b815260206004820152601960248201527f436f6d6d69746d656e742065786973747320616c7265616479000000000000006044820152606401610993565b600480546001810182557f8a35acfbc15ff81a39ae7d344fd709f28e8600b4aa8c65c6b64bfe7fe36bd19b0182905554600082815260036020526040808220839055518392917fae00c540259638f579ebd3eeca58b0ffa10b9b1ab00a7862cae8eb32e04c606891a350565b6001600160a01b038116600090815260008051602061410d8339815191526020908152604080832080548251818502810185019093528083526060946000805160206140858339815191529484015b8282101561158757838290600052602060002090600202016040518060400160405290816000820180546114ec90613cc9565b80601f016020809104026020016040519081016040528092919081815260200182805461151890613cc9565b80156115655780601f1061153a57610100808354040283529160200191611565565b820191906000526020600020905b81548152906001019060200180831161154857829003601f168201915b50505050508152602001600182015481525050815260200190600101906114b9565b50505050915050919050565b6000805160206140ed8339815191526115ab81611a28565b6115ef86868080601f0160208091040260200160405190810160405280939291908181526020018383808284376000920191909152508892508791508690506127ed565b505050505050565b606060006116058484613e0c565b905060008167ffffffffffffffff811115611622576116226139ed565b60405190808252806020026020018201604052801561164b578160200160208202803683370190505b50905060005b828110156116a55760046116658783613cb6565b8154811061167557611675613c8a565b906000526020600020015482828151811061169257611692613c8a565b6020908102919091010152600101611651565b50949350505050565b60006116b981611a28565b60025482116117305760405162461bcd60e51b815260206004820152603860248201527f4e657720686f72697a6f6e206d757374206265207374726963746c79206c617460448201527f6572207468616e2063757272656e7420686f72697a6f6e2e00000000000000006064820152608401610993565b50600255565b600061174384848461298c565b90505b9392505050565b6000805160206140ed83398151915261176581611a28565b6108c284848080601f0160208091040260200160405190810160405280939291908181526020018383808284376000920191909152508692506129ff915050565b7f65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a6117d081611a28565b506001805460ff191681179055565b6000805160206140ed8339815191526117f781611a28565b61088787878080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525089925088915087905086612b97565b60608160008167ffffffffffffffff81111561185a5761185a6139ed565b604051908082528060200260200182016040528015611883578160200160208202803683370190505b50905060005b828110156116a557600560008787848181106118a7576118a7613c8a565b90506020020135815260200190815260200160002060009054906101000a900460ff168282815181106118dc576118dc613c8a565b91151560209283029190910190910152600101611889565b60008281526000805160206140a5833981519152602052604090206001015461191c81611a28565b6108c283836122ad565b6000805160206140ed83398151915261193e81611a28565b6115ef86868080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250889250879150869050612fde565b60608160008167ffffffffffffffff8111156119a0576119a06139ed565b6040519080825280602002602001820160405280156119c9578160200160208202803683370190505b50905060005b828110156116a557600360008787848181106119ed576119ed613c8a565b90506020020135815260200190815260200160002054828281518110611a1557611a15613c8a565b60209081029190910101526001016119cf565b61092d8133613144565b6040517f29912872bb1868dd74efe86230a05098a24ae1f39d64ec2129d982442801ac00908190600090611a6a908590602001613f0e565b60408051601f198184030181529181528151602092830120835290820192909252016000205460ff161515600114611b0a5760405162461bcd60e51b815260206004820152603b60248201527f455243373532393a2065544c442b312063757272656e746c79206e6f7420617360448201527f736f6369617465642077697468207468697320636f6e747261637400000000006064820152608401610993565b600081600001600084604051602001611b239190613f0e565b60405160208183030381529060405280519060200120815260200190815260200160002060006101000a81548160ff0219169083151502179055507f1a5c07d8ee1fce30d5e52fe9097bc41e0e7e43c9d74ef7bf98133120d3ea5dc282604051611b8d9190613846565b60405180910390a15050565b6001600160a01b03811660009081527f1f22a6cf75eb7fcaad2fabbc6dbce35f91d9ea3ad7582b03d6421676b0930e0260205260408082209051606092600080516020614085833981519152929091611bf3908790613f0e565b90815260200160405180910390205411611c645760405162461bcd60e51b815260206004820152602c60248201527f436f6e74656e74204f626a6563743a20546869732074616720686173206e6f7460448201526b081899595b881cdd185ad95960a21b6064820152608401610993565b6001600160a01b038316600090815260018281016020526040822054611c8a9190613e0c565b905060006001836002016000876001600160a01b03166001600160a01b0316815260200190815260200160002087604051611cc59190613f0e565b908152602001604051809103902054611cde9190613e0c565b6001600160a01b038616600090815260018501602052604081208054929350909184908110611d0f57611d0f613c8a565b9060005260206000209060020201604051806040016040529081600082018054611d3890613cc9565b80601f0160208091040260200160405190810160405280929190818152602001828054611d6490613cc9565b8015611db15780601f10611d8657610100808354040283529160200191611db1565b820191906000526020600020905b815481529060010190602001808311611d9457829003601f168201915b50505091835250506001918201546020918201526001600160a01b03891660009081529187019052604081208054929350909184908110611df457611df4613c8a565b906000526020600020906002020160010154905081856001016000896001600160a01b03166001600160a01b031681526020019081526020016000208481548110611e4157611e41613c8a565b600091825260209091208251600290920201908190611e609082613e4e565b5060209190910151600191820155611e79908490613cb6565b6001600160a01b038816600090815260028701602052604090819020845191519091611ea491613f0e565b9081526040805160209281900383018120939093556001600160a01b038a16600090815260028901909252902090611edd908a90613f0e565b908152602001604051809103902060009055846001016000886001600160a01b03166001600160a01b03168152602001908152602001600020805480611f2557611f25613f2a565b60008281526020812060001990920191600283020190611f45828261366a565b5060006001919091015590558454604051631582acf360e11b81526001600160a01b0390911690632b0559e690611f84908b908b908690600401613f40565b600060405180830381600087803b158015611f9e57600080fd5b505af1925050508015611faf575060015b61200c57611fbb613f6e565b806308c379a0036120005750611fcf613f8a565b80611fda5750612002565b6040518060600160405280602881526020016140c5602891399650505050505050610771565b505b3d6000803e3d6000fd5b6040518060400160405280600f81526020017f4c697374696e672072656d6f766564000000000000000000000000000000000081525095505050505050610771565b6001600160a01b038416600090815260008051602061410d833981519152602090815260408083208151808301909252888252818301869052805460018101825590845291909220825160008051602061408583398151915293926002029091019081906120bc9082613e4e565b506020918201516001918201556001600160a01b03871660009081529083018252604080822054600285019093529081902090516120fb908990613f0e565b90815260405190819003602001812091909155815463095ea7b360e01b82526001600160a01b0390811660048301526024820186905286169063095ea7b3906044016020604051808303816000875af115801561215c573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906121809190614014565b50805460405163376cc74d60e01b81526001600160a01b039091169063376cc74d906121b6908990899088908890600401614036565b600060405180830381600087803b1580156121d057600080fd5b505af11580156121e4573d6000803e3d6000fd5b50505050505050505050565b60008281526000805160206140a5833981519152602081815260408084206001600160a01b038616855290915282205460ff166122a3576000848152602082815260408083206001600160a01b03871684529091529020805460ff191660011790556122593390565b6001600160a01b0316836001600160a01b0316857f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a46001915050610771565b6000915050610771565b60008281526000805160206140a5833981519152602081815260408084206001600160a01b038616855290915282205460ff16156122a3576000848152602082815260408083206001600160a01b0387168085529252808320805460ff1916905551339287917ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b9190a46001915050610771565b6123496131a6565b7fcd5ed15c6e187e77e9aee88184c21f4f2182ab5827cb3b7e07fbedcd63f03300805460ff191681557f5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa335b6040516001600160a01b03909116815260200160405180910390a150565b7fcd5ed15c6e187e77e9aee88184c21f4f2182ab5827cb3b7e07fbedcd63f033005460ff16156123f65760405163d93c066560e01b815260040160405180910390fd5b565b60008061240584846131e8565b90506001600160a01b0381166124695760405162461bcd60e51b8152602060048201526024808201527f436f6e73656e743a205369676e65722063616e6e6f742062652030206164647260448201526332b9b99760e11b6064820152608401610993565b6001600160a01b031660009081527fed82e8858f919528fd86c81da277f0812ef4876fae8bc5251645af9640d3f49f602052604090205460ff169392505050565b6040517f29912872bb1868dd74efe86230a05098a24ae1f39d64ec2129d982442801ac009060019082906000906124e5908690602001613f0e565b60405160208183030381529060405280519060200120815260200190815260200160002060006101000a81548160ff0219169083151502179055507f1fc1bae1e5cc41896c1cdee7a380b003c14fea22313ef3fe9d0a965625dfd37682604051611b8d9190613846565b6040516001600160a01b0384811660248301528381166044830152606482018390526108c29186918216906323b872dd906084015b604051602081830303815290604052915060e01b6020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff8381831617835250505050613212565b6040516001600160a01b038381166024830152604482018390526107c191859182169063a9059cbb90606401612584565b612604613275565b6123f66132c3565b6123f6613275565b61261c613275565b61262682826132f6565b5050565b6001600160a01b038416600090815260008051602061410d833981519152602090815260408083208151808301909252888252818301859052805460018101825590845291909220825160008051602061408583398151915293926002029091019081906126989082613e4e565b506020918201516001918201556001600160a01b03871660009081529083018252604080822054600285019093529081902090516126d7908990613f0e565b90815260405190819003602001812091909155815463095ea7b360e01b82526001600160a01b0390811660048301526024820186905286169063095ea7b3906044016020604051808303816000875af1158015612738573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061275c9190614014565b508054604051633ebd874d60e11b81526001600160a01b0390911690637d7b0e9a906121b6908990899088908890600401614036565b61279a6123b3565b7fcd5ed15c6e187e77e9aee88184c21f4f2182ab5827cb3b7e07fbedcd63f03300805460ff191660011781557f62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a25833612395565b6001600160a01b038316600090815260008051602061410d8339815191526020908152604080832081518083019092528782528183018590528054600181018255908452919092208251600080516020614085833981519152939260020290910190819061285b9082613e4e565b506020918201516001918201556001600160a01b038616600090815290830182526040808220546002850190935290819020905161289a908890613f0e565b90815260405190819003602001812091909155815463095ea7b360e01b82526001600160a01b0390811660048301526024820185905285169063095ea7b3906044016020604051808303816000875af11580156128fb573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061291f9190614014565b50805460405163b3fae4a560e01b81526001600160a01b039091169063b3fae4a59061295390889088908790600401613f40565b600060405180830381600087803b15801561296d57600080fd5b505af1158015612981573d6000803e3d6000fd5b505050505050505050565b6001600160a01b03811660009081527f1f22a6cf75eb7fcaad2fabbc6dbce35f91d9ea3ad7582b03d6421676b0930e0260205260408082209051600080516020614085833981519152916001916129e69088908890613c7a565b9081526020016040518091039020546108219190613e0c565b6001600160a01b03811660009081527f1f22a6cf75eb7fcaad2fabbc6dbce35f91d9ea3ad7582b03d6421676b0930e0260205260408082209051600080516020614085833981519152929190612a56908690613f0e565b90815260200160405180910390205411612ac75760405162461bcd60e51b815260206004820152602c60248201527f436f6e74656e74204f626a6563743a20546869732074616720686173206e6f7460448201526b081899595b881cdd185ad95960a21b6064820152608401610993565b80546001600160a01b03838116600090815260018085016020908152604080842060028801909252928390209251939094169363eee9665e938893889391612b10908690613f0e565b908152602001604051809103902054612b299190613e0c565b81548110612b3957612b39613c8a565b9060005260206000209060020201600101546040518463ffffffff1660e01b8152600401612b6993929190613f40565b600060405180830381600087803b158015612b8357600080fd5b505af1158015610887573d6000803e3d6000fd5b6001600160a01b038416600090815260008051602061410d833981519152602090815260408083207f1f22a6cf75eb7fcaad2fabbc6dbce35f91d9ea3ad7582b03d6421676b0930e029092528083209051600080516020614085833981519152939291600191612c08908b90613f0e565b908152602001604051809103902054612c219190613e0c565b81548110612c3157612c31613c8a565b9060005260206000209060020201604051806040016040529081600082018054612c5a90613cc9565b80601f0160208091040260200160405190810160405280929190818152602001828054612c8690613cc9565b8015612cd35780601f10612ca857610100808354040283529160200191612cd3565b820191906000526020600020905b815481529060010190602001808311612cb657829003601f168201915b505050505081526020016001820154815250509050828411612d5d5760405162461bcd60e51b815260206004820152603a60248201527f436f6e74656e74204f626a6563743a204e657720736c6f74206d75737420626560448201527f2067726561746572207468616e2063757272656e7420736c6f740000000000006064820152608401610993565b6001600160a01b03861660009081526002830160205260408082209051612d85908a90613f0e565b90815260200160405180910390205411612df65760405162461bcd60e51b815260206004820152602c60248201527f436f6e74656e74204f626a6563743a20546869732074616720686173206e6f7460448201526b081899595b881cdd185ad95960a21b6064820152608401610993565b60208082018051908690526001600160a01b03881660009081526001808601845260408083206002880190955291829020915192938593909290612e3b908d90613f0e565b908152602001604051809103902054612e549190613e0c565b81548110612e6457612e64613c8a565b600091825260209091208251600290920201908190612e839082613e4e565b50602091909101516001909101558254604051631582acf360e11b81526001600160a01b0390911690632b0559e690612ec4908b908b908690600401613f40565b600060405180830381600087803b158015612ede57600080fd5b505af1158015612ef2573d6000803e3d6000fd5b5050845460405163095ea7b360e01b81526001600160a01b039182166004820152602481018a9052908a16925063095ea7b391506044016020604051808303816000875af1158015612f48573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190612f6c9190614014565b50825460405163376cc74d60e01b81526001600160a01b039091169063376cc74d90612fa2908b908b908a908a90600401614036565b600060405180830381600087803b158015612fbc57600080fd5b505af1158015612fd0573d6000803e3d6000fd5b505050505050505050505050565b6001600160a01b038316600090815260008051602061410d8339815191526020908152604080832081518083019092528782528183018590528054600181018255908452919092208251600080516020614085833981519152939260020290910190819061304c9082613e4e565b506020918201516001918201556001600160a01b038616600090815290830182526040808220546002850190935290819020905161308b908890613f0e565b90815260405190819003602001812091909155815463095ea7b360e01b82526001600160a01b0390811660048301526024820185905285169063095ea7b3906044016020604051808303816000875af11580156130ec573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906131109190614014565b508054604051637774b32f60e11b81526001600160a01b039091169063eee9665e9061295390889088908790600401613f40565b60008281526000805160206140a5833981519152602090815260408083206001600160a01b038516845290915290205460ff166126265760405163e2517d3f60e01b81526001600160a01b038216600482015260248101839052604401610993565b7fcd5ed15c6e187e77e9aee88184c21f4f2182ab5827cb3b7e07fbedcd63f033005460ff166123f657604051638dfc202b60e01b815260040160405180910390fd5b6000806000806131f88686613365565b92509250925061320882826133b2565b5090949350505050565b60006132276001600160a01b0384168361346b565b9050805160001415801561324c57508080602001905181019061324a9190614014565b155b156107c157604051635274afe760e01b81526001600160a01b0384166004820152602401610993565b7ff0c57e16840df040f15088dc2f81fe391c3923bec73e23a9662efc9c229c6a005468010000000000000000900460ff166123f657604051631afcd79f60e31b815260040160405180910390fd5b6132cb613275565b7fcd5ed15c6e187e77e9aee88184c21f4f2182ab5827cb3b7e07fbedcd63f03300805460ff19169055565b6132fe613275565b60008051602061408583398151915280546001600160a01b0393841673ffffffffffffffffffffffffffffffffffffffff19918216179091557f1f22a6cf75eb7fcaad2fabbc6dbce35f91d9ea3ad7582b03d6421676b0930e038054929093169116179055565b6000806000835160410361339f5760208401516040850151606086015160001a61339188828585613479565b9550955095505050506133ab565b50508151600091506002905b9250925092565b60008260038111156133c6576133c661406e565b036133cf575050565b60018260038111156133e3576133e361406e565b036134015760405163f645eedf60e01b815260040160405180910390fd5b60028260038111156134155761341561406e565b036134365760405163fce698f760e01b815260048101829052602401610993565b600382600381111561344a5761344a61406e565b03612626576040516335e2f38360e21b815260048101829052602401610993565b606061174683836000613548565b600080807f7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a08411156134b4575060009150600390508261353e565b604080516000808252602082018084528a905260ff891692820192909252606081018790526080810186905260019060a0016020604051602081039080840390855afa158015613508573d6000803e3d6000fd5b5050604051601f1901519150506001600160a01b0381166135345750600092506001915082905061353e565b9250600091508190505b9450945094915050565b60608147101561356d5760405163cd78605960e01b8152306004820152602401610993565b600080856001600160a01b031684866040516135899190613f0e565b60006040518083038185875af1925050503d80600081146135c6576040519150601f19603f3d011682016040523d82523d6000602084013e6135cb565b606091505b50915091506135db8683836135e5565b9695505050505050565b6060826135fa576135f582613641565b611746565b815115801561361157506001600160a01b0384163b155b1561363a57604051639996b31560e01b81526001600160a01b0385166004820152602401610993565b5080611746565b8051156136515780518082602001fd5b604051630a12f52160e11b815260040160405180910390fd5b50805461367690613cc9565b6000825580601f10613686575050565b601f01602090049060005260206000209081019061092d91905b808211156136b457600081556001016136a0565b5090565b6000602082840312156136ca57600080fd5b81356001600160e01b03198116811461174657600080fd5b60008083601f8401126136f457600080fd5b50813567ffffffffffffffff81111561370c57600080fd5b60208301915083602082850101111561372457600080fd5b9250929050565b6000806020838503121561373e57600080fd5b823567ffffffffffffffff81111561375557600080fd5b613761858286016136e2565b90969095509350505050565b60006020828403121561377f57600080fd5b5035919050565b80356001600160a01b038116811461379d57600080fd5b919050565b6000806000604084860312156137b757600080fd5b833567ffffffffffffffff8111156137ce57600080fd5b6137da868287016136e2565b90945092506137ed905060208501613786565b90509250925092565b60005b838110156138115781810151838201526020016137f9565b50506000910152565b600081518084526138328160208601602086016137f6565b601f01601f19169290920160200192915050565b602081526000611746602083018461381a565b60008060008060008060a0878903121561387257600080fd5b863567ffffffffffffffff81111561388957600080fd5b61389589828a016136e2565b90975095506138a8905060208801613786565b93506040870135925060608701359150608087013590509295509295509295565b600080604083850312156138dc57600080fd5b823591506138ec60208401613786565b90509250929050565b6000806000806060858703121561390b57600080fd5b8435935060208501359250604085013567ffffffffffffffff81111561393057600080fd5b61393c878288016136e2565b95989497509550505050565b60008083601f84011261395a57600080fd5b50813567ffffffffffffffff81111561397257600080fd5b6020830191508360208260051b850101111561372457600080fd5b600080602083850312156139a057600080fd5b823567ffffffffffffffff8111156139b757600080fd5b61376185828601613948565b600080604083850312156139d657600080fd5b6139df83613786565b946020939093013593505050565b634e487b7160e01b600052604160045260246000fd5b601f8201601f1916810167ffffffffffffffff81118282101715613a2957613a296139ed565b6040525050565b600080600060608486031215613a4557600080fd5b613a4e84613786565b925060208085013567ffffffffffffffff80821115613a6c57600080fd5b818701915087601f830112613a8057600080fd5b813581811115613a9257613a926139ed565b6040519150613aaa601f8201601f1916850183613a03565b8082528884828501011115613abe57600080fd5b80848401858401376000848284010152508094505050506137ed60408501613786565b600060208284031215613af357600080fd5b61174682613786565b600060208083018184528085518083526040925060408601915060408160051b87010184880160005b83811015613b6657888303603f1901855281518051878552613b498886018261381a565b918901519489019490945294870194925090860190600101613b25565b509098975050505050505050565b600080600080600060808688031215613b8c57600080fd5b853567ffffffffffffffff811115613ba357600080fd5b613baf888289016136e2565b9096509450613bc2905060208701613786565b94979396509394604081013594506060013592915050565b60008060408385031215613bed57600080fd5b50508035926020909101359150565b6020808252825182820181905260009190848201906040850190845b81811015613c3457835183529284019291840191600101613c18565b50909695505050505050565b6020808252825182820181905260009190848201906040850190845b81811015613c34578351151583529284019291840191600101613c5c565b8183823760009101908152919050565b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052601160045260246000fd5b8082018082111561077157610771613ca0565b600181811c90821680613cdd57607f821691505b602082108103613cfd57634e487b7160e01b600052602260045260246000fd5b50919050565b601f8211156107c1576000816000526020600020601f850160051c81016020861015613d2c5750805b601f850160051c820191505b818110156115ef57828155600101613d38565b67ffffffffffffffff831115613d6357613d636139ed565b613d7783613d718354613cc9565b83613d03565b6000601f841160018114613dab5760008515613d935750838201355b600019600387901b1c1916600186901b178355613e05565b600083815260209020601f19861690835b82811015613ddc5786850135825560209485019460019092019101613dbc565b5086821015613df95760001960f88860031b161c19848701351681555b505060018560011b0183555b5050505050565b8181038181111561077157610771613ca0565b60208152816020820152818360408301376000818301604090810191909152601f909201601f19160101919050565b815167ffffffffffffffff811115613e6857613e686139ed565b613e7c81613e768454613cc9565b84613d03565b602080601f831160018114613eb15760008415613e995750858301515b600019600386901b1c1916600185901b1785556115ef565b600085815260208120601f198616915b82811015613ee057888601518255948401946001909101908401613ec1565b5085821015613efe5787850151600019600388901b60f8161c191681555b5050505050600190811b01905550565b60008251613f208184602087016137f6565b9190910192915050565b634e487b7160e01b600052603160045260246000fd5b606081526000613f53606083018661381a565b6001600160a01b039490941660208301525060400152919050565b600060033d1115613f875760046000803e5060005160e01c5b90565b600060443d1015613f985790565b6040516003193d81016004833e81513d67ffffffffffffffff8160248401118184111715613fc857505050505090565b8285019150815181811115613fe05750505050505090565b843d8701016020828501011115613ffa5750505050505090565b61400960208286010187613a03565b509095945050505050565b60006020828403121561402657600080fd5b8151801515811461174657600080fd5b608081526000614049608083018761381a565b6001600160a01b03959095166020830152506040810192909252606090910152919050565b634e487b7160e01b600052602160045260246000fdfe1f22a6cf75eb7fcaad2fabbc6dbce35f91d9ea3ad7582b03d6421676b0930e0002dd7bc7dec4dceedda775e58dd541e08a116c6c53815c0bd028192f7b6268004c697374696e6720776173207265706c6163656420627920616e6f7468657220636f6e7472616374b9e206fa2af7ee1331b72ce58b6d938ac810ce9b5cdb65d35ab723fd67badf9e1f22a6cf75eb7fcaad2fabbc6dbce35f91d9ea3ad7582b03d6421676b0930e01a2646970667358221220386bf2dc95d0d526124071437fddcaa93301e30c9d64c053e2031fdd9bdc469b64736f6c63430008180033",
  deployedBytecode:
    "0x608060405234801561001057600080fd5b50600436106102ea5760003560e01c80637bb7c0d81161018c578063ae23c782116100ee578063d547741f11610097578063f2e7cdc311610071578063f2e7cdc314610711578063f7aafaae14610724578063fafc130b1461073757600080fd5b8063d547741f146106a1578063e63ab1e9146106b4578063f2413257146106db57600080fd5b8063cecc2eac116100c8578063cecc2eac14610666578063d28b4bfb1461066e578063d38ab5ff1461068157600080fd5b8063ae23c7821461062d578063cbe0ee3314610640578063ccbd34691461065357600080fd5b80639dc82bd111610150578063a217fddf1161012a578063a217fddf146105f2578063a451e041146105fa578063ac60218c1461060d57600080fd5b80639dc82bd11461059e578063a1260cdf146105be578063a1ebf35d146105cb57600080fd5b80637bb7c0d81461051757806382df298d1461052a5780638456cb591461053d57806390b9d3591461054557806391d148541461055857600080fd5b806343166d78116102505780635c975abb116101f95780636c0360eb116101d35780636c0360eb146104f45780636cf0dc30146104fc57806372be0f1f1461050f57600080fd5b80635c975abb1461047d57806368ce7d8a146104a75780636ad3f723146104ba57600080fd5b80634a938bae1161022a5780634a938bae146104445780635410f3651461045757806355f804b31461046a57600080fd5b806343166d78146103f75780634430db7e1461040a57806344e2e74c1461043157600080fd5b806328eda0b2116102b25780633780b3ed1161028c5780633780b3ed146103c75780633f4ba83a146103dc57806340018a25146103e457600080fd5b806328eda0b21461038e5780632f2ff15d146103a157806336568abe146103b457600080fd5b806301ffc9a7146102ef57806318160ddd146103175780632277892914610329578063248a9ca31461033e5780632537a8a51461036e575b600080fd5b6103026102fd3660046136b8565b610740565b60405190151581526020015b60405180910390f35b6004545b60405190815260200161030e565b61033c61033736600461372b565b610777565b005b61031b61034c36600461376d565b60009081526000805160206140a5833981519152602052604090206001015490565b61038161037c3660046137a2565b6107c6565b60405161030e9190613846565b61033c61039c366004613859565b61082a565b61033c6103af3660046138c9565b610890565b61033c6103c23660046138c9565b6108c8565b61031b6000805160206140ed83398151915281565b61033c6108fb565b61033c6103f23660046138f5565b610930565b61030261040536600461372b565b610b55565b61031b7f61a3517f153a09154844ed8be639dabc6e78dc22315c2d9a91f7eddf9398c00281565b61033c61043f36600461372b565b610bc2565b61033c61045236600461398d565b610c0c565b61033c6104653660046139c3565b610d7a565b61033c61047836600461372b565b610e26565b7fcd5ed15c6e187e77e9aee88184c21f4f2182ab5827cb3b7e07fbedcd63f033005460ff16610302565b61033c6104b53660046139c3565b610e3e565b7f1f22a6cf75eb7fcaad2fabbc6dbce35f91d9ea3ad7582b03d6421676b0930e03546040516001600160a01b03909116815260200161030e565b610381610f73565b61033c61050a36600461372b565b611001565b61033c61107e565b61033c610525366004613a30565b6110b5565b61033c610538366004613859565b6112a3565b61033c611300565b61033c61055336600461376d565b611332565b6103026105663660046138c9565b60009182526000805160206140a5833981519152602090815260408084206001600160a01b0393909316845291905290205460ff1690565b6105b16105ac366004613ae1565b61146a565b60405161030e9190613afc565b6001546103029060ff1681565b61031b7fe2f4eaae4a9751e85a3e4a7b9587827a877f29914755229b07a7b2da98285f7081565b61031b600081565b61033c610608366004613b74565b611593565b61062061061b366004613bda565b6115f7565b60405161030e9190613bfc565b61033c61063b36600461376d565b6116ae565b61031b61064e3660046137a2565b611736565b61033c6106613660046137a2565b61174d565b61033c6117a6565b61033c61067c366004613859565b6117df565b61069461068f36600461398d565b61183c565b60405161030e9190613c40565b61033c6106af3660046138c9565b6118f4565b61031b7f65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a81565b61031b6106e9366004613ae1565b6001600160a01b0316600090815260008051602061410d833981519152602052604090205490565b61033c61071f366004613b74565b611926565b61062061073236600461398d565b611982565b61031b60025481565b60006001600160e01b03198216637965db0b60e01b148061077157506301ffc9a760e01b6001600160e01b03198316145b92915050565b600061078281611a28565b6107c183838080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250611a3292505050565b505050565b60606000805160206140ed8339815191526107e081611a28565b61082185858080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250879250611b99915050565b95945050505050565b6000805160206140ed83398151915261084281611a28565b61088787878080601f0160208091040260200160405190810160405280939291908181526020018383808284376000920191909152508992508891508790508661204e565b50505050505050565b60008281526000805160206140a583398151915260205260409020600101546108b881611a28565b6108c283836121f0565b50505050565b6001600160a01b03811633146108f15760405163334bd91960e11b815260040160405180910390fd5b6107c182826122ad565b7f65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a61092581611a28565b61092d612341565b50565b6109386123b3565b60008481526005602052604090205460ff161561099c5760405162461bcd60e51b815260206004820152601b60248201527f436f6e73656e743a206e6f6e636520616c72656164792075736564000000000060448201526064015b60405180910390fd5b6040516bffffffffffffffffffffffff193060601b16602082015260348101859052600090610a1190605401604051602081830303815290604052805190602001207f19457468657265756d205369676e6564204d6573736167653a0a3332000000006000908152601c91909152603c902090565b9050610a538184848080601f0160208091040260200160405190810160405280939291908181526020018383808284376000920191909152506123f892505050565b610ac55760405162461bcd60e51b815260206004820152603160248201527f436f6e73656e743a20436f6e7472616374206f776e657220646964206e6f742060448201527f7369676e2074686973206d6573736167650000000000000000000000000000006064820152608401610993565b60048054600181810183557f8a35acfbc15ff81a39ae7d344fd709f28e8600b4aa8c65c6b64bfe7fe36bd19b909101869055815460008781526003602090815260408083209390935589825260059052818120805460ff1916909317909255915491518692917fae00c540259638f579ebd3eeca58b0ffa10b9b1ab00a7862cae8eb32e04c606891a35050505050565b6040516000907f29912872bb1868dd74efe86230a05098a24ae1f39d64ec2129d982442801ac009081908390610b919087908790602001613c7a565b60408051808303601f190181529181528151602092830120835290820192909252016000205460ff16949350505050565b6000610bcd81611a28565b6107c183838080601f0160208091040260200160405190810160405280939291908181526020018383808284376000920191909152506124aa92505050565b610c146123b3565b60015460ff1615610c7c5760405162461bcd60e51b815260206004820152602c60248201527f436f6e73656e743a204f70656e206f70742d696e73206172652063757272656e60448201526b1d1b1e48191a5cd8589b195960a21b6064820152608401610993565b8060005b818110156108c2576000848483818110610c9c57610c9c613c8a565b9050602002013590506003600082815260200190815260200160002054600014610d085760405162461bcd60e51b815260206004820152601960248201527f436f6d6d69746d656e742065786973747320616c7265616479000000000000006044820152606401610993565b600480546001810182557f8a35acfbc15ff81a39ae7d344fd709f28e8600b4aa8c65c6b64bfe7fe36bd19b0182905554600082815260036020526040808220839055518392917fae00c540259638f579ebd3eeca58b0ffa10b9b1ab00a7862cae8eb32e04c606891a350600101610c80565b6000805160206140ed833981519152610d9281611a28565b6001600160a01b038316600090815260066020908152604080832033845290915281208054849290610dc5908490613cb6565b90915550610de090506001600160a01b03841633308561254f565b6040518281526001600160a01b0384169033907f5548c837ab068cf56a2c2479df0882a4922fd203edb7517321831d95078c5f62906020015b60405180910390a3505050565b6000610e3181611a28565b60006108c2838583613d4b565b6001600160a01b0382166000908152600660209081526040808320338452909152902054811115610ee25760405162461bcd60e51b815260206004820152604260248201527f436f6e73656e7420436f6e74726163743a20616d6f756e74206c61726765722060448201527f7468616e206f75747374616e64696e67206465706f7369746f722062616c616e606482015261636560f01b608482015260a401610993565b6001600160a01b038216600090815260066020908152604080832033845290915281208054839290610f15908490613e0c565b90915550610f2f90506001600160a01b03831633836125cb565b6040518181526001600160a01b0383169033907f9b1bfa7fa9ee420a16e124f794c35ac9f90472acc99140eb2f6447c714cad8eb9060200160405180910390a35050565b60008054610f8090613cc9565b80601f0160208091040260200160405190810160405280929190818152602001828054610fac90613cc9565b8015610ff95780601f10610fce57610100808354040283529160200191610ff9565b820191906000526020600020905b815481529060010190602001808311610fdc57829003601f168201915b505050505081565b7f61a3517f153a09154844ed8be639dabc6e78dc22315c2d9a91f7eddf9398c00261102b81611a28565b828260405161103b929190613c7a565b6040518091039020336001600160a01b03167f31df2703b10660cea45214572e0616949f363a34b1c19dca24026609f46655708585604051610e19929190613e1f565b7f65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a6110a881611a28565b506001805460ff19169055565b7ff0c57e16840df040f15088dc2f81fe391c3923bec73e23a9662efc9c229c6a00805468010000000000000000810460ff16159067ffffffffffffffff166000811580156111005750825b905060008267ffffffffffffffff16600114801561111d5750303b155b90508115801561112b575080155b156111495760405163f92ee8a960e01b815260040160405180910390fd5b845467ffffffffffffffff19166001178555831561117d57845468ff00000000000000001916680100000000000000001785555b6111856125fc565b61118d61260c565b6111978630612614565b4360025560006111a78882613e4e565b506111b36000896121f0565b506111de7f65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a896121f0565b506112097fe2f4eaae4a9751e85a3e4a7b9587827a877f29914755229b07a7b2da98285f70896121f0565b506112347f61a3517f153a09154844ed8be639dabc6e78dc22315c2d9a91f7eddf9398c002896121f0565b5061124d6000805160206140ed833981519152896121f0565b50831561129957845468ff000000000000000019168555604051600181527fc7f505b2f371ae2175ee4913f4499e1f2633a7b5936321eed1cdaeb6115181d29060200160405180910390a15b5050505050505050565b6000805160206140ed8339815191526112bb81611a28565b61088787878080601f0160208091040260200160405190810160405280939291908181526020018383808284376000920191909152508992508891508790508661262a565b7f65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a61132a81611a28565b61092d612792565b61133a6123b3565b60015460ff16156113a25760405162461bcd60e51b815260206004820152602c60248201527f436f6e73656e743a204f70656e206f70742d696e73206172652063757272656e60448201526b1d1b1e48191a5cd8589b195960a21b6064820152608401610993565b600081815260036020526040902054156113fe5760405162461bcd60e51b815260206004820152601960248201527f436f6d6d69746d656e742065786973747320616c7265616479000000000000006044820152606401610993565b600480546001810182557f8a35acfbc15ff81a39ae7d344fd709f28e8600b4aa8c65c6b64bfe7fe36bd19b0182905554600082815260036020526040808220839055518392917fae00c540259638f579ebd3eeca58b0ffa10b9b1ab00a7862cae8eb32e04c606891a350565b6001600160a01b038116600090815260008051602061410d8339815191526020908152604080832080548251818502810185019093528083526060946000805160206140858339815191529484015b8282101561158757838290600052602060002090600202016040518060400160405290816000820180546114ec90613cc9565b80601f016020809104026020016040519081016040528092919081815260200182805461151890613cc9565b80156115655780601f1061153a57610100808354040283529160200191611565565b820191906000526020600020905b81548152906001019060200180831161154857829003601f168201915b50505050508152602001600182015481525050815260200190600101906114b9565b50505050915050919050565b6000805160206140ed8339815191526115ab81611a28565b6115ef86868080601f0160208091040260200160405190810160405280939291908181526020018383808284376000920191909152508892508791508690506127ed565b505050505050565b606060006116058484613e0c565b905060008167ffffffffffffffff811115611622576116226139ed565b60405190808252806020026020018201604052801561164b578160200160208202803683370190505b50905060005b828110156116a55760046116658783613cb6565b8154811061167557611675613c8a565b906000526020600020015482828151811061169257611692613c8a565b6020908102919091010152600101611651565b50949350505050565b60006116b981611a28565b60025482116117305760405162461bcd60e51b815260206004820152603860248201527f4e657720686f72697a6f6e206d757374206265207374726963746c79206c617460448201527f6572207468616e2063757272656e7420686f72697a6f6e2e00000000000000006064820152608401610993565b50600255565b600061174384848461298c565b90505b9392505050565b6000805160206140ed83398151915261176581611a28565b6108c284848080601f0160208091040260200160405190810160405280939291908181526020018383808284376000920191909152508692506129ff915050565b7f65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a6117d081611a28565b506001805460ff191681179055565b6000805160206140ed8339815191526117f781611a28565b61088787878080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525089925088915087905086612b97565b60608160008167ffffffffffffffff81111561185a5761185a6139ed565b604051908082528060200260200182016040528015611883578160200160208202803683370190505b50905060005b828110156116a557600560008787848181106118a7576118a7613c8a565b90506020020135815260200190815260200160002060009054906101000a900460ff168282815181106118dc576118dc613c8a565b91151560209283029190910190910152600101611889565b60008281526000805160206140a5833981519152602052604090206001015461191c81611a28565b6108c283836122ad565b6000805160206140ed83398151915261193e81611a28565b6115ef86868080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250889250879150869050612fde565b60608160008167ffffffffffffffff8111156119a0576119a06139ed565b6040519080825280602002602001820160405280156119c9578160200160208202803683370190505b50905060005b828110156116a557600360008787848181106119ed576119ed613c8a565b90506020020135815260200190815260200160002054828281518110611a1557611a15613c8a565b60209081029190910101526001016119cf565b61092d8133613144565b6040517f29912872bb1868dd74efe86230a05098a24ae1f39d64ec2129d982442801ac00908190600090611a6a908590602001613f0e565b60408051601f198184030181529181528151602092830120835290820192909252016000205460ff161515600114611b0a5760405162461bcd60e51b815260206004820152603b60248201527f455243373532393a2065544c442b312063757272656e746c79206e6f7420617360448201527f736f6369617465642077697468207468697320636f6e747261637400000000006064820152608401610993565b600081600001600084604051602001611b239190613f0e565b60405160208183030381529060405280519060200120815260200190815260200160002060006101000a81548160ff0219169083151502179055507f1a5c07d8ee1fce30d5e52fe9097bc41e0e7e43c9d74ef7bf98133120d3ea5dc282604051611b8d9190613846565b60405180910390a15050565b6001600160a01b03811660009081527f1f22a6cf75eb7fcaad2fabbc6dbce35f91d9ea3ad7582b03d6421676b0930e0260205260408082209051606092600080516020614085833981519152929091611bf3908790613f0e565b90815260200160405180910390205411611c645760405162461bcd60e51b815260206004820152602c60248201527f436f6e74656e74204f626a6563743a20546869732074616720686173206e6f7460448201526b081899595b881cdd185ad95960a21b6064820152608401610993565b6001600160a01b038316600090815260018281016020526040822054611c8a9190613e0c565b905060006001836002016000876001600160a01b03166001600160a01b0316815260200190815260200160002087604051611cc59190613f0e565b908152602001604051809103902054611cde9190613e0c565b6001600160a01b038616600090815260018501602052604081208054929350909184908110611d0f57611d0f613c8a565b9060005260206000209060020201604051806040016040529081600082018054611d3890613cc9565b80601f0160208091040260200160405190810160405280929190818152602001828054611d6490613cc9565b8015611db15780601f10611d8657610100808354040283529160200191611db1565b820191906000526020600020905b815481529060010190602001808311611d9457829003601f168201915b50505091835250506001918201546020918201526001600160a01b03891660009081529187019052604081208054929350909184908110611df457611df4613c8a565b906000526020600020906002020160010154905081856001016000896001600160a01b03166001600160a01b031681526020019081526020016000208481548110611e4157611e41613c8a565b600091825260209091208251600290920201908190611e609082613e4e565b5060209190910151600191820155611e79908490613cb6565b6001600160a01b038816600090815260028701602052604090819020845191519091611ea491613f0e565b9081526040805160209281900383018120939093556001600160a01b038a16600090815260028901909252902090611edd908a90613f0e565b908152602001604051809103902060009055846001016000886001600160a01b03166001600160a01b03168152602001908152602001600020805480611f2557611f25613f2a565b60008281526020812060001990920191600283020190611f45828261366a565b5060006001919091015590558454604051631582acf360e11b81526001600160a01b0390911690632b0559e690611f84908b908b908690600401613f40565b600060405180830381600087803b158015611f9e57600080fd5b505af1925050508015611faf575060015b61200c57611fbb613f6e565b806308c379a0036120005750611fcf613f8a565b80611fda5750612002565b6040518060600160405280602881526020016140c5602891399650505050505050610771565b505b3d6000803e3d6000fd5b6040518060400160405280600f81526020017f4c697374696e672072656d6f766564000000000000000000000000000000000081525095505050505050610771565b6001600160a01b038416600090815260008051602061410d833981519152602090815260408083208151808301909252888252818301869052805460018101825590845291909220825160008051602061408583398151915293926002029091019081906120bc9082613e4e565b506020918201516001918201556001600160a01b03871660009081529083018252604080822054600285019093529081902090516120fb908990613f0e565b90815260405190819003602001812091909155815463095ea7b360e01b82526001600160a01b0390811660048301526024820186905286169063095ea7b3906044016020604051808303816000875af115801561215c573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906121809190614014565b50805460405163376cc74d60e01b81526001600160a01b039091169063376cc74d906121b6908990899088908890600401614036565b600060405180830381600087803b1580156121d057600080fd5b505af11580156121e4573d6000803e3d6000fd5b50505050505050505050565b60008281526000805160206140a5833981519152602081815260408084206001600160a01b038616855290915282205460ff166122a3576000848152602082815260408083206001600160a01b03871684529091529020805460ff191660011790556122593390565b6001600160a01b0316836001600160a01b0316857f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a46001915050610771565b6000915050610771565b60008281526000805160206140a5833981519152602081815260408084206001600160a01b038616855290915282205460ff16156122a3576000848152602082815260408083206001600160a01b0387168085529252808320805460ff1916905551339287917ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b9190a46001915050610771565b6123496131a6565b7fcd5ed15c6e187e77e9aee88184c21f4f2182ab5827cb3b7e07fbedcd63f03300805460ff191681557f5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa335b6040516001600160a01b03909116815260200160405180910390a150565b7fcd5ed15c6e187e77e9aee88184c21f4f2182ab5827cb3b7e07fbedcd63f033005460ff16156123f65760405163d93c066560e01b815260040160405180910390fd5b565b60008061240584846131e8565b90506001600160a01b0381166124695760405162461bcd60e51b8152602060048201526024808201527f436f6e73656e743a205369676e65722063616e6e6f742062652030206164647260448201526332b9b99760e11b6064820152608401610993565b6001600160a01b031660009081527fed82e8858f919528fd86c81da277f0812ef4876fae8bc5251645af9640d3f49f602052604090205460ff169392505050565b6040517f29912872bb1868dd74efe86230a05098a24ae1f39d64ec2129d982442801ac009060019082906000906124e5908690602001613f0e565b60405160208183030381529060405280519060200120815260200190815260200160002060006101000a81548160ff0219169083151502179055507f1fc1bae1e5cc41896c1cdee7a380b003c14fea22313ef3fe9d0a965625dfd37682604051611b8d9190613846565b6040516001600160a01b0384811660248301528381166044830152606482018390526108c29186918216906323b872dd906084015b604051602081830303815290604052915060e01b6020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff8381831617835250505050613212565b6040516001600160a01b038381166024830152604482018390526107c191859182169063a9059cbb90606401612584565b612604613275565b6123f66132c3565b6123f6613275565b61261c613275565b61262682826132f6565b5050565b6001600160a01b038416600090815260008051602061410d833981519152602090815260408083208151808301909252888252818301859052805460018101825590845291909220825160008051602061408583398151915293926002029091019081906126989082613e4e565b506020918201516001918201556001600160a01b03871660009081529083018252604080822054600285019093529081902090516126d7908990613f0e565b90815260405190819003602001812091909155815463095ea7b360e01b82526001600160a01b0390811660048301526024820186905286169063095ea7b3906044016020604051808303816000875af1158015612738573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061275c9190614014565b508054604051633ebd874d60e11b81526001600160a01b0390911690637d7b0e9a906121b6908990899088908890600401614036565b61279a6123b3565b7fcd5ed15c6e187e77e9aee88184c21f4f2182ab5827cb3b7e07fbedcd63f03300805460ff191660011781557f62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a25833612395565b6001600160a01b038316600090815260008051602061410d8339815191526020908152604080832081518083019092528782528183018590528054600181018255908452919092208251600080516020614085833981519152939260020290910190819061285b9082613e4e565b506020918201516001918201556001600160a01b038616600090815290830182526040808220546002850190935290819020905161289a908890613f0e565b90815260405190819003602001812091909155815463095ea7b360e01b82526001600160a01b0390811660048301526024820185905285169063095ea7b3906044016020604051808303816000875af11580156128fb573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061291f9190614014565b50805460405163b3fae4a560e01b81526001600160a01b039091169063b3fae4a59061295390889088908790600401613f40565b600060405180830381600087803b15801561296d57600080fd5b505af1158015612981573d6000803e3d6000fd5b505050505050505050565b6001600160a01b03811660009081527f1f22a6cf75eb7fcaad2fabbc6dbce35f91d9ea3ad7582b03d6421676b0930e0260205260408082209051600080516020614085833981519152916001916129e69088908890613c7a565b9081526020016040518091039020546108219190613e0c565b6001600160a01b03811660009081527f1f22a6cf75eb7fcaad2fabbc6dbce35f91d9ea3ad7582b03d6421676b0930e0260205260408082209051600080516020614085833981519152929190612a56908690613f0e565b90815260200160405180910390205411612ac75760405162461bcd60e51b815260206004820152602c60248201527f436f6e74656e74204f626a6563743a20546869732074616720686173206e6f7460448201526b081899595b881cdd185ad95960a21b6064820152608401610993565b80546001600160a01b03838116600090815260018085016020908152604080842060028801909252928390209251939094169363eee9665e938893889391612b10908690613f0e565b908152602001604051809103902054612b299190613e0c565b81548110612b3957612b39613c8a565b9060005260206000209060020201600101546040518463ffffffff1660e01b8152600401612b6993929190613f40565b600060405180830381600087803b158015612b8357600080fd5b505af1158015610887573d6000803e3d6000fd5b6001600160a01b038416600090815260008051602061410d833981519152602090815260408083207f1f22a6cf75eb7fcaad2fabbc6dbce35f91d9ea3ad7582b03d6421676b0930e029092528083209051600080516020614085833981519152939291600191612c08908b90613f0e565b908152602001604051809103902054612c219190613e0c565b81548110612c3157612c31613c8a565b9060005260206000209060020201604051806040016040529081600082018054612c5a90613cc9565b80601f0160208091040260200160405190810160405280929190818152602001828054612c8690613cc9565b8015612cd35780601f10612ca857610100808354040283529160200191612cd3565b820191906000526020600020905b815481529060010190602001808311612cb657829003601f168201915b505050505081526020016001820154815250509050828411612d5d5760405162461bcd60e51b815260206004820152603a60248201527f436f6e74656e74204f626a6563743a204e657720736c6f74206d75737420626560448201527f2067726561746572207468616e2063757272656e7420736c6f740000000000006064820152608401610993565b6001600160a01b03861660009081526002830160205260408082209051612d85908a90613f0e565b90815260200160405180910390205411612df65760405162461bcd60e51b815260206004820152602c60248201527f436f6e74656e74204f626a6563743a20546869732074616720686173206e6f7460448201526b081899595b881cdd185ad95960a21b6064820152608401610993565b60208082018051908690526001600160a01b03881660009081526001808601845260408083206002880190955291829020915192938593909290612e3b908d90613f0e565b908152602001604051809103902054612e549190613e0c565b81548110612e6457612e64613c8a565b600091825260209091208251600290920201908190612e839082613e4e565b50602091909101516001909101558254604051631582acf360e11b81526001600160a01b0390911690632b0559e690612ec4908b908b908690600401613f40565b600060405180830381600087803b158015612ede57600080fd5b505af1158015612ef2573d6000803e3d6000fd5b5050845460405163095ea7b360e01b81526001600160a01b039182166004820152602481018a9052908a16925063095ea7b391506044016020604051808303816000875af1158015612f48573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190612f6c9190614014565b50825460405163376cc74d60e01b81526001600160a01b039091169063376cc74d90612fa2908b908b908a908a90600401614036565b600060405180830381600087803b158015612fbc57600080fd5b505af1158015612fd0573d6000803e3d6000fd5b505050505050505050505050565b6001600160a01b038316600090815260008051602061410d8339815191526020908152604080832081518083019092528782528183018590528054600181018255908452919092208251600080516020614085833981519152939260020290910190819061304c9082613e4e565b506020918201516001918201556001600160a01b038616600090815290830182526040808220546002850190935290819020905161308b908890613f0e565b90815260405190819003602001812091909155815463095ea7b360e01b82526001600160a01b0390811660048301526024820185905285169063095ea7b3906044016020604051808303816000875af11580156130ec573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906131109190614014565b508054604051637774b32f60e11b81526001600160a01b039091169063eee9665e9061295390889088908790600401613f40565b60008281526000805160206140a5833981519152602090815260408083206001600160a01b038516845290915290205460ff166126265760405163e2517d3f60e01b81526001600160a01b038216600482015260248101839052604401610993565b7fcd5ed15c6e187e77e9aee88184c21f4f2182ab5827cb3b7e07fbedcd63f033005460ff166123f657604051638dfc202b60e01b815260040160405180910390fd5b6000806000806131f88686613365565b92509250925061320882826133b2565b5090949350505050565b60006132276001600160a01b0384168361346b565b9050805160001415801561324c57508080602001905181019061324a9190614014565b155b156107c157604051635274afe760e01b81526001600160a01b0384166004820152602401610993565b7ff0c57e16840df040f15088dc2f81fe391c3923bec73e23a9662efc9c229c6a005468010000000000000000900460ff166123f657604051631afcd79f60e31b815260040160405180910390fd5b6132cb613275565b7fcd5ed15c6e187e77e9aee88184c21f4f2182ab5827cb3b7e07fbedcd63f03300805460ff19169055565b6132fe613275565b60008051602061408583398151915280546001600160a01b0393841673ffffffffffffffffffffffffffffffffffffffff19918216179091557f1f22a6cf75eb7fcaad2fabbc6dbce35f91d9ea3ad7582b03d6421676b0930e038054929093169116179055565b6000806000835160410361339f5760208401516040850151606086015160001a61339188828585613479565b9550955095505050506133ab565b50508151600091506002905b9250925092565b60008260038111156133c6576133c661406e565b036133cf575050565b60018260038111156133e3576133e361406e565b036134015760405163f645eedf60e01b815260040160405180910390fd5b60028260038111156134155761341561406e565b036134365760405163fce698f760e01b815260048101829052602401610993565b600382600381111561344a5761344a61406e565b03612626576040516335e2f38360e21b815260048101829052602401610993565b606061174683836000613548565b600080807f7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a08411156134b4575060009150600390508261353e565b604080516000808252602082018084528a905260ff891692820192909252606081018790526080810186905260019060a0016020604051602081039080840390855afa158015613508573d6000803e3d6000fd5b5050604051601f1901519150506001600160a01b0381166135345750600092506001915082905061353e565b9250600091508190505b9450945094915050565b60608147101561356d5760405163cd78605960e01b8152306004820152602401610993565b600080856001600160a01b031684866040516135899190613f0e565b60006040518083038185875af1925050503d80600081146135c6576040519150601f19603f3d011682016040523d82523d6000602084013e6135cb565b606091505b50915091506135db8683836135e5565b9695505050505050565b6060826135fa576135f582613641565b611746565b815115801561361157506001600160a01b0384163b155b1561363a57604051639996b31560e01b81526001600160a01b0385166004820152602401610993565b5080611746565b8051156136515780518082602001fd5b604051630a12f52160e11b815260040160405180910390fd5b50805461367690613cc9565b6000825580601f10613686575050565b601f01602090049060005260206000209081019061092d91905b808211156136b457600081556001016136a0565b5090565b6000602082840312156136ca57600080fd5b81356001600160e01b03198116811461174657600080fd5b60008083601f8401126136f457600080fd5b50813567ffffffffffffffff81111561370c57600080fd5b60208301915083602082850101111561372457600080fd5b9250929050565b6000806020838503121561373e57600080fd5b823567ffffffffffffffff81111561375557600080fd5b613761858286016136e2565b90969095509350505050565b60006020828403121561377f57600080fd5b5035919050565b80356001600160a01b038116811461379d57600080fd5b919050565b6000806000604084860312156137b757600080fd5b833567ffffffffffffffff8111156137ce57600080fd5b6137da868287016136e2565b90945092506137ed905060208501613786565b90509250925092565b60005b838110156138115781810151838201526020016137f9565b50506000910152565b600081518084526138328160208601602086016137f6565b601f01601f19169290920160200192915050565b602081526000611746602083018461381a565b60008060008060008060a0878903121561387257600080fd5b863567ffffffffffffffff81111561388957600080fd5b61389589828a016136e2565b90975095506138a8905060208801613786565b93506040870135925060608701359150608087013590509295509295509295565b600080604083850312156138dc57600080fd5b823591506138ec60208401613786565b90509250929050565b6000806000806060858703121561390b57600080fd5b8435935060208501359250604085013567ffffffffffffffff81111561393057600080fd5b61393c878288016136e2565b95989497509550505050565b60008083601f84011261395a57600080fd5b50813567ffffffffffffffff81111561397257600080fd5b6020830191508360208260051b850101111561372457600080fd5b600080602083850312156139a057600080fd5b823567ffffffffffffffff8111156139b757600080fd5b61376185828601613948565b600080604083850312156139d657600080fd5b6139df83613786565b946020939093013593505050565b634e487b7160e01b600052604160045260246000fd5b601f8201601f1916810167ffffffffffffffff81118282101715613a2957613a296139ed565b6040525050565b600080600060608486031215613a4557600080fd5b613a4e84613786565b925060208085013567ffffffffffffffff80821115613a6c57600080fd5b818701915087601f830112613a8057600080fd5b813581811115613a9257613a926139ed565b6040519150613aaa601f8201601f1916850183613a03565b8082528884828501011115613abe57600080fd5b80848401858401376000848284010152508094505050506137ed60408501613786565b600060208284031215613af357600080fd5b61174682613786565b600060208083018184528085518083526040925060408601915060408160051b87010184880160005b83811015613b6657888303603f1901855281518051878552613b498886018261381a565b918901519489019490945294870194925090860190600101613b25565b509098975050505050505050565b600080600080600060808688031215613b8c57600080fd5b853567ffffffffffffffff811115613ba357600080fd5b613baf888289016136e2565b9096509450613bc2905060208701613786565b94979396509394604081013594506060013592915050565b60008060408385031215613bed57600080fd5b50508035926020909101359150565b6020808252825182820181905260009190848201906040850190845b81811015613c3457835183529284019291840191600101613c18565b50909695505050505050565b6020808252825182820181905260009190848201906040850190845b81811015613c34578351151583529284019291840191600101613c5c565b8183823760009101908152919050565b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052601160045260246000fd5b8082018082111561077157610771613ca0565b600181811c90821680613cdd57607f821691505b602082108103613cfd57634e487b7160e01b600052602260045260246000fd5b50919050565b601f8211156107c1576000816000526020600020601f850160051c81016020861015613d2c5750805b601f850160051c820191505b818110156115ef57828155600101613d38565b67ffffffffffffffff831115613d6357613d636139ed565b613d7783613d718354613cc9565b83613d03565b6000601f841160018114613dab5760008515613d935750838201355b600019600387901b1c1916600186901b178355613e05565b600083815260209020601f19861690835b82811015613ddc5786850135825560209485019460019092019101613dbc565b5086821015613df95760001960f88860031b161c19848701351681555b505060018560011b0183555b5050505050565b8181038181111561077157610771613ca0565b60208152816020820152818360408301376000818301604090810191909152601f909201601f19160101919050565b815167ffffffffffffffff811115613e6857613e686139ed565b613e7c81613e768454613cc9565b84613d03565b602080601f831160018114613eb15760008415613e995750858301515b600019600386901b1c1916600185901b1785556115ef565b600085815260208120601f198616915b82811015613ee057888601518255948401946001909101908401613ec1565b5085821015613efe5787850151600019600388901b60f8161c191681555b5050505050600190811b01905550565b60008251613f208184602087016137f6565b9190910192915050565b634e487b7160e01b600052603160045260246000fd5b606081526000613f53606083018661381a565b6001600160a01b039490941660208301525060400152919050565b600060033d1115613f875760046000803e5060005160e01c5b90565b600060443d1015613f985790565b6040516003193d81016004833e81513d67ffffffffffffffff8160248401118184111715613fc857505050505090565b8285019150815181811115613fe05750505050505090565b843d8701016020828501011115613ffa5750505050505090565b61400960208286010187613a03565b509095945050505050565b60006020828403121561402657600080fd5b8151801515811461174657600080fd5b608081526000614049608083018761381a565b6001600160a01b03959095166020830152506040810192909252606090910152919050565b634e487b7160e01b600052602160045260246000fdfe1f22a6cf75eb7fcaad2fabbc6dbce35f91d9ea3ad7582b03d6421676b0930e0002dd7bc7dec4dceedda775e58dd541e08a116c6c53815c0bd028192f7b6268004c697374696e6720776173207265706c6163656420627920616e6f7468657220636f6e7472616374b9e206fa2af7ee1331b72ce58b6d938ac810ce9b5cdb65d35ab723fd67badf9e1f22a6cf75eb7fcaad2fabbc6dbce35f91d9ea3ad7582b03d6421676b0930e01a2646970667358221220386bf2dc95d0d526124071437fddcaa93301e30c9d64c053e2031fdd9bdc469b64736f6c63430008180033",
  linkReferences: {},
  deployedLinkReferences: {},
};
