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
          internalType: "string",
          name: "domain",
          type: "string",
        },
      ],
      name: "LogAddDomain",
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
      name: "LogRemoveDomain",
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
          internalType: "uint256",
          name: "_slot",
          type: "uint256",
        },
      ],
      name: "computeFee",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "pure",
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
      inputs: [
        {
          internalType: "string",
          name: "domain",
          type: "string",
        },
      ],
      name: "getDomain",
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
      inputs: [],
      name: "getStakingToken",
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
      inputs: [],
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
            {
              internalType: "address",
              name: "staker",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "stake",
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
        {
          internalType: "address",
          name: "_stakingToken",
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
    {
      inputs: [],
      name: "updateMaxTagsLimit",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
  ],
  bytecode:
    "0x60806040523480156200001157600080fd5b506200001c62000022565b620000d6565b7ff0c57e16840df040f15088dc2f81fe391c3923bec73e23a9662efc9c229c6a00805468010000000000000000900460ff1615620000735760405163f92ee8a960e01b815260040160405180910390fd5b80546001600160401b0390811614620000d35780546001600160401b0319166001600160401b0390811782556040519081527fc7f505b2f371ae2175ee4913f4499e1f2633a7b5936321eed1cdaeb6115181d29060200160405180910390a15b50565b61401180620000e66000396000f3fe608060405234801561001057600080fd5b50600436106102ea5760003560e01c80638456cb591161018c578063cecc2eac116100ee578063ecdd04da11610097578063f7aafaae11610071578063f7aafaae146106ec578063fafc130b146106ff578063fefb650e1461070857600080fd5b8063ecdd04da146106b3578063ed74d94a146106c6578063f5c7455c146106d957600080fd5b8063e1bf9c08116100c8578063e1bf9c0814610666578063e63ab1e914610679578063e682da7c146106a057600080fd5b8063cecc2eac1461062b578063d38ab5ff14610633578063d547741f1461065357600080fd5b8063a1ebf35d11610150578063ac60218c1161012a578063ac60218c146105e5578063ae23c78214610605578063b8f88d641461061857600080fd5b8063a1ebf35d146105a1578063a217fddf146105c8578063a428b07f146105d057600080fd5b80638456cb59146104f957806390b9d3591461050157806391d14854146105145780639f9106d11461055a578063a1260cdf1461059457600080fd5b80633f4ba83a1161025057806355f804b3116101f95780636cf0dc30116101d35780636cf0dc30146104cb57806372be0f1f146104de578063827b8e14146104e657600080fd5b806355f804b3146104865780635c975abb146104995780636c0360eb146104c357600080fd5b806344e2e74c1161022a57806344e2e74c146104405780634a938bae146104535780635149606e1461046657600080fd5b80633f4ba83a146103fe57806340018a25146104065780634430db7e1461041957600080fd5b806322778929116102b25780632f2ff15d1161028c5780632f2ff15d146103c357806336568abe146103d65780633780b3ed146103e957600080fd5b8063227789291461036d578063248a9ca3146103805780632684c925146103b057600080fd5b806301ffc9a7146102ef578063078908e814610317578063081f5de31461034857806318160ddd14610352578063211b98bd1461035a575b600080fd5b6103026102fd3660046135d3565b61071b565b60405190151581526020015b60405180910390f35b7f1f22a6cf75eb7fcaad2fabbc6dbce35f91d9ea3ad7582b03d6421676b0930e01545b60405190815260200161030e565b610350610752565b005b60045461033a565b610350610368366004613646565b6107d6565b61035061037b366004613692565b610835565b61033a61038e3660046136d4565b6000908152600080516020613f74833981519152602052604090206001015490565b6103506103be366004613646565b610891565b6103506103d1366004613709565b6108ea565b6103506103e4366004613709565b61091c565b61033a600080516020613fbc83398151915281565b61035061094f565b610350610414366004613735565b610984565b61033a7f61a3517f153a09154844ed8be639dabc6e78dc22315c2d9a91f7eddf9398c00281565b61035061044e366004613692565b610b7f565b6103506104613660046137cd565b610bd6565b610479610474366004613692565b610d1f565b60405161030e9190613853565b610350610494366004613692565b610d80565b7fcd5ed15c6e187e77e9aee88184c21f4f2182ab5827cb3b7e07fbedcd63f033005460ff16610302565b610479610d98565b6103506104d9366004613692565b610e26565b610350610eb0565b6103506104f4366004613866565b610ee7565b610350610f49565b61035061050f3660046136d4565b610f7b565b610302610522366004613709565b6000918252600080516020613f74833981519152602090815260408084206001600160a01b0393909316845291905290205460ff1690565b7f1f22a6cf75eb7fcaad2fabbc6dbce35f91d9ea3ad7582b03d6421676b0930e04546040516001600160a01b03909116815260200161030e565b6001546103029060ff1681565b61033a7fe2f4eaae4a9751e85a3e4a7b9587827a877f29914755229b07a7b2da98285f7081565b61033a600081565b6105d8611089565b60405161030e91906138b7565b6105f86105f336600461394d565b6111b9565b60405161030e919061396f565b6103506106133660046136d4565b611270565b6103506106263660046139f6565b6112f8565b6103506114e7565b6106466106413660046137cd565b611520565b60405161030e9190613ac1565b610350610661366004613709565b6115d8565b61033a6106743660046136d4565b61160a565b61033a7f65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a81565b6103506106ae366004613866565b61168b565b6103026106c1366004613692565b6116e6565b6103506106d4366004613866565b611753565b61033a6106e7366004613692565b6117ae565b6105f86106fa3660046137cd565b61180b565b61033a60025481565b610350610716366004613692565b6118b1565b60006001600160e01b03198216637965db0b60e01b148061074c57506301ffc9a760e01b6001600160e01b03198316145b92915050565b600080516020613f5483398151915280546040805163143a99b560e21b815290516001600160a01b03909216916350ea66d4916004808201926020929091908290030181865afa1580156107aa573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906107ce9190613afb565b600390910155565b600080516020613fbc8339815191526107ee81611908565b61082f84848080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250869250611912915050565b50505050565b600080516020613fbc83398151915261084d81611908565b61088c83838080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250611bb592505050565b505050565b600080516020613fbc8339815191526108a981611908565b61082f84848080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250869250611c65915050565b6000828152600080516020613f74833981519152602052604090206001015461091281611908565b61082f8383611ea5565b6001600160a01b03811633146109455760405163334bd91960e11b815260040160405180910390fd5b61088c8282611f62565b7f65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a61097981611908565b610981611ff6565b50565b61098c612068565b60008481526005602052604090205460ff16156109f05760405162461bcd60e51b815260206004820152601b60248201527f436f6e73656e743a206e6f6e636520616c72656164792075736564000000000060448201526064015b60405180910390fd5b6040516bffffffffffffffffffffffff193060601b16602082015260348101859052600090610a6590605401604051602081830303815290604052805190602001207f19457468657265756d205369676e6564204d6573736167653a0a3332000000006000908152601c91909152603c902090565b9050610aa78184848080601f0160208091040260200160405190810160405280939291908181526020018383808284376000920191909152506120ad92505050565b610b195760405162461bcd60e51b815260206004820152603160248201527f436f6e73656e743a20436f6e7472616374206f776e657220646964206e6f742060448201527f7369676e2074686973206d65737361676500000000000000000000000000000060648201526084016109e7565b505060048054600181810183557f8a35acfbc15ff81a39ae7d344fd709f28e8600b4aa8c65c6b64bfe7fe36bd19b9091018490559054600093845260036020908152604080862092909255948452600590945292909120805460ff191690921790915550565b600080516020613fbc833981519152610b9781611908565b61088c83838080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525061215e92505050565b610bde612068565b60015460ff1615610c465760405162461bcd60e51b815260206004820152602c60248201527f436f6e73656e743a204f70656e206f70742d696e73206172652063757272656e60448201526b1d1b1e48191a5cd8589b195960a21b60648201526084016109e7565b8060005b8181101561082f576000848483818110610c6657610c66613b14565b9050602002013590506003600082815260200190815260200160002054600014610cd25760405162461bcd60e51b815260206004820152601960248201527f436f6d6d69746d656e742065786973747320616c72656164790000000000000060448201526064016109e7565b60048054600181810183557f8a35acfbc15ff81a39ae7d344fd709f28e8600b4aa8c65c6b64bfe7fe36bd19b90910183905590546000928352600360205260409092209190915501610c4a565b6060600080516020613fbc833981519152610d3981611908565b610d7884848080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525061220392505050565b949350505050565b6000610d8b81611908565b600061082f838583613bac565b60008054610da590613b2a565b80601f0160208091040260200160405190810160405280929190818152602001828054610dd190613b2a565b8015610e1e5780601f10610df357610100808354040283529160200191610e1e565b820191906000526020600020905b815481529060010190602001808311610e0157829003601f168201915b505050505081565b7f61a3517f153a09154844ed8be639dabc6e78dc22315c2d9a91f7eddf9398c002610e5081611908565b8282604051610e60929190613c6c565b6040518091039020336001600160a01b03167f31df2703b10660cea45214572e0616949f363a34b1c19dca24026609f46655708585604051610ea3929190613c7c565b60405180910390a3505050565b7f65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a610eda81611908565b506001805460ff19169055565b600080516020613fbc833981519152610eff81611908565b610f4285858080601f0160208091040260200160405190810160405280939291908181526020018383808284376000920191909152508792508691506126599050565b5050505050565b7f65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a610f7381611908565b6109816128de565b610f83612068565b60015460ff1615610feb5760405162461bcd60e51b815260206004820152602c60248201527f436f6e73656e743a204f70656e206f70742d696e73206172652063757272656e60448201526b1d1b1e48191a5cd8589b195960a21b60648201526084016109e7565b600081815260036020526040902054156110475760405162461bcd60e51b815260206004820152601960248201527f436f6d6d69746d656e742065786973747320616c72656164790000000000000060448201526064016109e7565b600480546001810182557f8a35acfbc15ff81a39ae7d344fd709f28e8600b4aa8c65c6b64bfe7fe36bd19b018290555460009182526003602052604090912055565b60606000600080516020613f548339815191526001810180546040805160208084028201810190925282815293945060009084015b828210156111af57838290600052602060002090600402016040518060800160405290816000820180546110f190613b2a565b80601f016020809104026020016040519081016040528092919081815260200182805461111d90613b2a565b801561116a5780601f1061113f5761010080835404028352916020019161116a565b820191906000526020600020905b81548152906001019060200180831161114d57829003601f168201915b505050918352505060018281015460208084019190915260028401546001600160a01b03166040840152600390930154606090920191909152918352920191016110be565b5050505091505090565b606060006111c78484613cc1565b905060008167ffffffffffffffff8111156111e4576111e46139b3565b60405190808252806020026020018201604052801561120d578160200160208202803683370190505b50905060005b828110156112675760046112278783613cd4565b8154811061123757611237613b14565b906000526020600020015482828151811061125457611254613b14565b6020908102919091010152600101611213565b50949350505050565b600061127b81611908565b60025482116112f25760405162461bcd60e51b815260206004820152603860248201527f4e657720686f72697a6f6e206d757374206265207374726963746c79206c617460448201527f6572207468616e2063757272656e7420686f72697a6f6e2e000000000000000060648201526084016109e7565b50600255565b7ff0c57e16840df040f15088dc2f81fe391c3923bec73e23a9662efc9c229c6a00805468010000000000000000810460ff16159067ffffffffffffffff166000811580156113435750825b905060008267ffffffffffffffff1660011480156113605750303b155b90508115801561136e575080155b1561138c5760405163f92ee8a960e01b815260040160405180910390fd5b845467ffffffffffffffff1916600117855583156113c057845468ff00000000000000001916680100000000000000001785555b6113c8612939565b6113d0612949565b6113da8787612951565b4360025560006113ea8982613ce7565b506113f660008a611ea5565b506114217f65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a8a611ea5565b5061144c7fe2f4eaae4a9751e85a3e4a7b9587827a877f29914755229b07a7b2da98285f708a611ea5565b506114777f61a3517f153a09154844ed8be639dabc6e78dc22315c2d9a91f7eddf9398c0028a611ea5565b50611490600080516020613fbc8339815191528a611ea5565b5083156114dc57845468ff000000000000000019168555604051600181527fc7f505b2f371ae2175ee4913f4499e1f2633a7b5936321eed1cdaeb6115181d29060200160405180910390a15b505050505050505050565b7f65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a61151181611908565b506001805460ff191681179055565b60608160008167ffffffffffffffff81111561153e5761153e6139b3565b604051908082528060200260200182016040528015611567578160200160208202803683370190505b50905060005b82811015611267576005600087878481811061158b5761158b613b14565b90506020020135815260200190815260200160002060009054906101000a900460ff168282815181106115c0576115c0613b14565b9115156020928302919091019091015260010161156d565b6000828152600080516020613f74833981519152602052604090206001015461160081611908565b61082f8383611f62565b6000670de0b6b3a764000080670de111a6b7de40005b841561168357611631600286613dbd565b60010361165057826116438284613dd1565b61164d9190613de8565b91505b8460010361166057509392505050565b8261166b8280613dd1565b6116759190613de8565b9050600185901c9450611620565b509392505050565b600080516020613fbc8339815191526116a381611908565b610f4285858080601f0160208091040260200160405190810160405280939291908181526020018383808284376000920191909152508792508691506129679050565b6040516000907f29912872bb1868dd74efe86230a05098a24ae1f39d64ec2129d982442801ac0090819083906117229087908790602001613c6c565b60408051808303601f190181529181528151602092830120835290820192909252016000205460ff16949350505050565b600080516020613fbc83398151915261176b81611908565b610f4285858080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250879250869150612bbe9050565b604051600090600080516020613f54833981519152907f1f22a6cf75eb7fcaad2fabbc6dbce35f91d9ea3ad7582b03d6421676b0930e02906117f39086908690613c6c565b90815260200160405180910390205491505092915050565b60608160008167ffffffffffffffff811115611829576118296139b3565b604051908082528060200260200182016040528015611852578160200160208202803683370190505b50905060005b82811015611267576003600087878481811061187657611876613b14565b9050602002013581526020019081526020016000205482828151811061189e5761189e613b14565b6020908102919091010152600101611858565b600080516020613fbc8339815191526118c981611908565b61088c83838080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250612e8392505050565b6109818133612ff6565b7f1f22a6cf75eb7fcaad2fabbc6dbce35f91d9ea3ad7582b03d6421676b0930e03547f1f22a6cf75eb7fcaad2fabbc6dbce35f91d9ea3ad7582b03d6421676b0930e0154600080516020613f5483398151915291116119c25760405162461bcd60e51b815260206004820152602660248201527f436f6e73656e7420436f6e74726163743a205461672062756467657420657868604482015265185d5cdd195960d21b60648201526084016109e7565b80600201836040516119d49190613dfc565b908152602001604051809103902054600014611a585760405162461bcd60e51b815260206004820152603d60248201527f436f6e73656e7420436f6e74726163743a20546869732074616720697320616c60448201527f7265616479207374616b6564206279207468697320636f6e747261637400000060648201526084016109e7565b6000611a638361160a565b9050816001016040518060800160405280868152602001858152602001611a873390565b6001600160a01b0316815260209081018490528254600181018455600093845292208151919260040201908190611abe9082613ce7565b506020820151816001015560408201518160020160006101000a8154816001600160a01b0302191690836001600160a01b0316021790555060608201518160030155505081600101805490508260020185604051611b1c9190613dfc565b90815260405190819003602001902055611b4c611b363390565b60048401546001600160a01b0316903084613058565b815460405163211b98bd60e01b81526001600160a01b039091169063211b98bd90611b7d9087908790600401613e18565b600060405180830381600087803b158015611b9757600080fd5b505af1158015611bab573d6000803e3d6000fd5b5050505050505050565b6040517f29912872bb1868dd74efe86230a05098a24ae1f39d64ec2129d982442801ac009060009082908290611bef908690602001613dfc565b60405160208183030381529060405280519060200120815260200190815260200160002060006101000a81548160ff0219169083151502179055507f549cfb509d34ba3a18b302f759af92977d405b9a59d1ad5eaf676b1b26fdd02782604051611c599190613853565b60405180910390a15050565b7f1f22a6cf75eb7fcaad2fabbc6dbce35f91d9ea3ad7582b03d6421676b0930e03547f1f22a6cf75eb7fcaad2fabbc6dbce35f91d9ea3ad7582b03d6421676b0930e0154600080516020613f548339815191529111611d125760405162461bcd60e51b8152602060048201526024808201527f436f6e74656e74204f626a6563743a20546167206275646765742065786861756044820152631cdd195960e21b60648201526084016109e7565b8060020183604051611d249190613dfc565b908152602001604051809103902054600014611d965760405162461bcd60e51b815260206004820152602b60248201527f436f6e74656e74204f626a6563743a20546869732074616720697320616c726560448201526a30b23c9039ba30b5b2b21760a91b60648201526084016109e7565b6000611da18361160a565b9050816001016040518060800160405280868152602001858152602001611dc53390565b6001600160a01b0316815260209081018490528254600181018455600093845292208151919260040201908190611dfc9082613ce7565b506020820151816001015560408201518160020160006101000a8154816001600160a01b0302191690836001600160a01b0316021790555060608201518160030155505081600101805490508260020185604051611e5a9190613dfc565b90815260405190819003602001902055611e74611b363390565b8154604051636f88c56160e11b81526001600160a01b039091169063df118ac290611b7d9087908790600401613e18565b6000828152600080516020613f74833981519152602081815260408084206001600160a01b038616855290915282205460ff16611f58576000848152602082815260408083206001600160a01b03871684529091529020805460ff19166001179055611f0e3390565b6001600160a01b0316836001600160a01b0316857f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a4600191505061074c565b600091505061074c565b6000828152600080516020613f74833981519152602081815260408084206001600160a01b038616855290915282205460ff1615611f58576000848152602082815260408083206001600160a01b0387168085529252808320805460ff1916905551339287917ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b9190a4600191505061074c565b611ffe6130c7565b7fcd5ed15c6e187e77e9aee88184c21f4f2182ab5827cb3b7e07fbedcd63f03300805460ff191681557f5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa335b6040516001600160a01b03909116815260200160405180910390a150565b7fcd5ed15c6e187e77e9aee88184c21f4f2182ab5827cb3b7e07fbedcd63f033005460ff16156120ab5760405163d93c066560e01b815260040160405180910390fd5b565b6000806120ba8484613109565b90506001600160a01b03811661211e5760405162461bcd60e51b8152602060048201526024808201527f436f6e73656e743a205369676e65722063616e6e6f742062652030206164647260448201526332b9b99760e11b60648201526084016109e7565b6001600160a01b03811660009081527fed82e8858f919528fd86c81da277f0812ef4876fae8bc5251645af9640d3f49f602052604090205460ff16610d78565b6040517f29912872bb1868dd74efe86230a05098a24ae1f39d64ec2129d982442801ac00906001908290600090612199908690602001613dfc565b60405160208183030381529060405280519060200120815260200190815260200160002060006101000a81548160ff0219169083151502179055507f518f4dd9e1ba750adb395696c0d4f5417dd0d7686a59f0ba155189e55042153382604051611c599190613853565b604051606090600080516020613f54833981519152906000907f1f22a6cf75eb7fcaad2fabbc6dbce35f91d9ea3ad7582b03d6421676b0930e0290612249908690613dfc565b908152602001604051809103902054116122bc5760405162461bcd60e51b815260206004820152602e60248201527f436f6e73656e7420436f6e74726163743a20546869732074616720686173206e60448201526d1bdd081899595b881cdd185ad95960921b60648201526084016109e7565b6001818101546000916122ce91613cc1565b90506000600183600201866040516122e69190613dfc565b9081526020016040518091039020546122ff9190613cc1565b9050600083600101838154811061231857612318613b14565b906000526020600020906004020160405180608001604052908160008201805461234190613b2a565b80601f016020809104026020016040519081016040528092919081815260200182805461236d90613b2a565b80156123ba5780601f1061238f576101008083540402835291602001916123ba565b820191906000526020600020905b81548152906001019060200180831161239d57829003601f168201915b5050509183525050600182810154602083015260028301546001600160a01b03166040830152600390920154606090910152850180549192506000918490811061240657612406613b14565b90600052602060002090600402016001015490508185600101848154811061243057612430613b14565b60009182526020909120825160049092020190819061244f9082613ce7565b50602082015160018281019190915560408301516002830180546001600160a01b0319166001600160a01b0390921691909117905560609092015160039091015561249b908490613cd4565b825160405160028801916124ae91613dfc565b90815260200160405180910390208190555084600201876040516124d29190613dfc565b908152602001604051809103902060009055846001018054806124f7576124f7613e3a565b600082815260208120600019909201916004830201906125178282613585565b506000600182018190556002820180546001600160a01b03191690556003909101559055604082015160608301516004870154612562926001600160a01b0390911691309190613058565b8454604051639d38c87b60e01b81526001600160a01b0390911690639d38c87b90612593908a908590600401613e18565b600060405180830381600087803b1580156125ad57600080fd5b505af19250505080156125be575060015b61261a576125ca613e50565b806308c379a00361260e57506125de613e6c565b806125e95750612610565b604051806060016040528060288152602001613f946028913998975050505050505050565b505b3d6000803e3d6000fd5b505060408051808201909152600f81527f4c697374696e672072656d6f7665640000000000000000000000000000000000602082015295945050505050565b7f1f22a6cf75eb7fcaad2fabbc6dbce35f91d9ea3ad7582b03d6421676b0930e03547f1f22a6cf75eb7fcaad2fabbc6dbce35f91d9ea3ad7582b03d6421676b0930e0154600080516020613f5483398151915291116127095760405162461bcd60e51b815260206004820152602660248201527f436f6e73656e7420436f6e74726163743a205461672062756467657420657868604482015265185d5cdd195960d21b60648201526084016109e7565b806002018460405161271b9190613dfc565b90815260200160405180910390205460001461279f5760405162461bcd60e51b815260206004820152603d60248201527f436f6e73656e7420436f6e74726163743a20546869732074616720697320616c60448201527f7265616479207374616b6564206279207468697320636f6e747261637400000060648201526084016109e7565b60006127aa8361160a565b90508160010160405180608001604052808781526020018581526020016127ce3390565b6001600160a01b03168152602090810184905282546001810184556000938452922081519192600402019081906128059082613ce7565b506020820151816001015560408201518160020160006101000a8154816001600160a01b0302191690836001600160a01b03160217905550606082015181600301555050816001018054905082600201866040516128639190613dfc565b9081526040519081900360200190205561287d611b363390565b8154604051636887f58f60e01b81526001600160a01b0390911690636887f58f906128b090889088908890600401613ef6565b600060405180830381600087803b1580156128ca57600080fd5b505af11580156114dc573d6000803e3d6000fd5b6128e6612068565b7fcd5ed15c6e187e77e9aee88184c21f4f2182ab5827cb3b7e07fbedcd63f03300805460ff191660011781557f62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a2583361204a565b612941613133565b6120ab613181565b6120ab613133565b612959613133565b61296382826131b4565b5050565b7f1f22a6cf75eb7fcaad2fabbc6dbce35f91d9ea3ad7582b03d6421676b0930e03547f1f22a6cf75eb7fcaad2fabbc6dbce35f91d9ea3ad7582b03d6421676b0930e0154600080516020613f548339815191529111612a175760405162461bcd60e51b815260206004820152602660248201527f436f6e73656e7420436f6e74726163743a205461672062756467657420657868604482015265185d5cdd195960d21b60648201526084016109e7565b8060020184604051612a299190613dfc565b908152602001604051809103902054600014612aad5760405162461bcd60e51b815260206004820152603d60248201527f436f6e73656e7420436f6e74726163743a20546869732074616720697320616c60448201527f7265616479207374616b6564206279207468697320636f6e747261637400000060648201526084016109e7565b6000612ab88461160a565b9050816001016040518060800160405280878152602001868152602001612adc3390565b6001600160a01b0316815260209081018490528254600181018455600093845292208151919260040201908190612b139082613ce7565b506020820151816001015560408201518160020160006101000a8154816001600160a01b0302191690836001600160a01b0316021790555060608201518160030155505081600101805490508260020186604051612b719190613dfc565b90815260405190819003602001902055612b8b611b363390565b81546040516371731b8360e01b81526001600160a01b03909116906371731b83906128b090889088908890600401613ef6565b604051600080516020613f54833981519152906000907f1f22a6cf75eb7fcaad2fabbc6dbce35f91d9ea3ad7582b03d6421676b0930e0290612c01908790613dfc565b90815260200160405180910390205411612c745760405162461bcd60e51b815260206004820152602e60248201527f436f6e73656e7420436f6e74726163743a20546869732074616720686173206e60448201526d1bdd081899595b881cdd185ad95960921b60648201526084016109e7565b60008160010160018360020187604051612c8e9190613dfc565b908152602001604051809103902054612ca79190613cc1565b81548110612cb757612cb7613b14565b9060005260206000209060040201600101549050838260010160018460020188604051612ce49190613dfc565b908152602001604051809103902054612cfd9190613cc1565b81548110612d0d57612d0d613b14565b60009182526020822060016004909202010191909155612d306106748387613cc1565b9050808360010160018560020189604051612d4b9190613dfc565b908152602001604051809103902054612d649190613cc1565b81548110612d7457612d74613b14565b90600052602060002090600402016003016000828254612d949190613cd4565b90915550506004830154612db3906001600160a01b0316333084613058565b8254604051639d38c87b60e01b81526001600160a01b0390911690639d38c87b90612de49089908690600401613e18565b600060405180830381600087803b158015612dfe57600080fd5b505af1158015612e12573d6000803e3d6000fd5b505084546040516371731b8360e01b81526001600160a01b0390911692506371731b839150612e4990899089908990600401613ef6565b600060405180830381600087803b158015612e6357600080fd5b505af1158015612e77573d6000803e3d6000fd5b50505050505050505050565b604051600080516020613f54833981519152906000907f1f22a6cf75eb7fcaad2fabbc6dbce35f91d9ea3ad7582b03d6421676b0930e0290612ec6908590613dfc565b90815260200160405180910390205411612f395760405162461bcd60e51b815260206004820152602e60248201527f436f6e73656e7420436f6e74726163743a20546869732074616720686173206e60448201526d1bdd081899595b881cdd185ad95960921b60648201526084016109e7565b80546040516001600160a01b039091169063211b98bd9084906001808601916002870190612f68908590613dfc565b908152602001604051809103902054612f819190613cc1565b81548110612f9157612f91613b14565b9060005260206000209060040201600101546040518363ffffffff1660e01b8152600401612fc0929190613e18565b600060405180830381600087803b158015612fda57600080fd5b505af1158015612fee573d6000803e3d6000fd5b505050505050565b6000828152600080516020613f74833981519152602090815260408083206001600160a01b038516845290915290205460ff166129635760405163e2517d3f60e01b81526001600160a01b0382166004820152602481018390526044016109e7565b604080516001600160a01b0385811660248301528416604482015260648082018490528251808303909101815260849091019091526020810180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff166323b872dd60e01b17905261082f908590613216565b7fcd5ed15c6e187e77e9aee88184c21f4f2182ab5827cb3b7e07fbedcd63f033005460ff166120ab57604051638dfc202b60e01b815260040160405180910390fd5b6000806000806131198686613279565b92509250925061312982826132c6565b5090949350505050565b7ff0c57e16840df040f15088dc2f81fe391c3923bec73e23a9662efc9c229c6a005468010000000000000000900460ff166120ab57604051631afcd79f60e31b815260040160405180910390fd5b613189613133565b7fcd5ed15c6e187e77e9aee88184c21f4f2182ab5827cb3b7e07fbedcd63f03300805460ff19169055565b6131bc613133565b600080516020613f5483398151915280546001600160a01b039384166001600160a01b0319918216179091557f1f22a6cf75eb7fcaad2fabbc6dbce35f91d9ea3ad7582b03d6421676b0930e048054929093169116179055565b600061322b6001600160a01b0384168361337f565b9050805160001415801561325057508080602001905181019061324e9190613f1b565b155b1561088c57604051635274afe760e01b81526001600160a01b03841660048201526024016109e7565b600080600083516041036132b35760208401516040850151606086015160001a6132a588828585613394565b9550955095505050506132bf565b50508151600091506002905b9250925092565b60008260038111156132da576132da613f3d565b036132e3575050565b60018260038111156132f7576132f7613f3d565b036133155760405163f645eedf60e01b815260040160405180910390fd5b600282600381111561332957613329613f3d565b0361334a5760405163fce698f760e01b8152600481018290526024016109e7565b600382600381111561335e5761335e613f3d565b03612963576040516335e2f38360e21b8152600481018290526024016109e7565b606061338d83836000613463565b9392505050565b600080807f7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a08411156133cf5750600091506003905082613459565b604080516000808252602082018084528a905260ff891692820192909252606081018790526080810186905260019060a0016020604051602081039080840390855afa158015613423573d6000803e3d6000fd5b5050604051601f1901519150506001600160a01b03811661344f57506000925060019150829050613459565b9250600091508190505b9450945094915050565b6060814710156134885760405163cd78605960e01b81523060048201526024016109e7565b600080856001600160a01b031684866040516134a49190613dfc565b60006040518083038185875af1925050503d80600081146134e1576040519150601f19603f3d011682016040523d82523d6000602084013e6134e6565b606091505b50915091506134f6868383613500565b9695505050505050565b606082613515576135108261355c565b61338d565b815115801561352c57506001600160a01b0384163b155b1561355557604051639996b31560e01b81526001600160a01b03851660048201526024016109e7565b508061338d565b80511561356c5780518082602001fd5b604051630a12f52160e11b815260040160405180910390fd5b50805461359190613b2a565b6000825580601f106135a1575050565b601f01602090049060005260206000209081019061098191905b808211156135cf57600081556001016135bb565b5090565b6000602082840312156135e557600080fd5b81356001600160e01b03198116811461338d57600080fd5b60008083601f84011261360f57600080fd5b50813567ffffffffffffffff81111561362757600080fd5b60208301915083602082850101111561363f57600080fd5b9250929050565b60008060006040848603121561365b57600080fd5b833567ffffffffffffffff81111561367257600080fd5b61367e868287016135fd565b909790965060209590950135949350505050565b600080602083850312156136a557600080fd5b823567ffffffffffffffff8111156136bc57600080fd5b6136c8858286016135fd565b90969095509350505050565b6000602082840312156136e657600080fd5b5035919050565b80356001600160a01b038116811461370457600080fd5b919050565b6000806040838503121561371c57600080fd5b8235915061372c602084016136ed565b90509250929050565b6000806000806060858703121561374b57600080fd5b8435935060208501359250604085013567ffffffffffffffff81111561377057600080fd5b61377c878288016135fd565b95989497509550505050565b60008083601f84011261379a57600080fd5b50813567ffffffffffffffff8111156137b257600080fd5b6020830191508360208260051b850101111561363f57600080fd5b600080602083850312156137e057600080fd5b823567ffffffffffffffff8111156137f757600080fd5b6136c885828601613788565b60005b8381101561381e578181015183820152602001613806565b50506000910152565b6000815180845261383f816020860160208601613803565b601f01601f19169290920160200192915050565b60208152600061338d6020830184613827565b6000806000806060858703121561387c57600080fd5b843567ffffffffffffffff81111561389357600080fd5b61389f878288016135fd565b90989097506020870135966040013595509350505050565b600060208083018184528085518083526040925060408601915060408160051b87010184880160005b8381101561393f57603f1989840301855281516080815181865261390682870182613827565b838b0151878c0152898401516001600160a01b03168a8801526060938401519390960192909252505093860193908601906001016138e0565b509098975050505050505050565b6000806040838503121561396057600080fd5b50508035926020909101359150565b6020808252825182820181905260009190848201906040850190845b818110156139a75783518352928401929184019160010161398b565b50909695505050505050565b634e487b7160e01b600052604160045260246000fd5b601f8201601f1916810167ffffffffffffffff811182821017156139ef576139ef6139b3565b6040525050565b60008060008060808587031215613a0c57600080fd5b613a15856136ed565b935060208086013567ffffffffffffffff80821115613a3357600080fd5b818801915088601f830112613a4757600080fd5b813581811115613a5957613a596139b3565b6040519150613a71601f8201601f19168501836139c9565b8082528984828501011115613a8557600080fd5b8084840185840137600084828401015250809550505050613aa8604086016136ed565b9150613ab6606086016136ed565b905092959194509250565b6020808252825182820181905260009190848201906040850190845b818110156139a7578351151583529284019291840191600101613add565b600060208284031215613b0d57600080fd5b5051919050565b634e487b7160e01b600052603260045260246000fd5b600181811c90821680613b3e57607f821691505b602082108103613b5e57634e487b7160e01b600052602260045260246000fd5b50919050565b601f82111561088c576000816000526020600020601f850160051c81016020861015613b8d5750805b601f850160051c820191505b81811015612fee57828155600101613b99565b67ffffffffffffffff831115613bc457613bc46139b3565b613bd883613bd28354613b2a565b83613b64565b6000601f841160018114613c0c5760008515613bf45750838201355b600019600387901b1c1916600186901b178355610f42565b600083815260209020601f19861690835b82811015613c3d5786850135825560209485019460019092019101613c1d565b5086821015613c5a5760001960f88860031b161c19848701351681555b505060018560011b0183555050505050565b8183823760009101908152919050565b60208152816020820152818360408301376000818301604090810191909152601f909201601f19160101919050565b634e487b7160e01b600052601160045260246000fd5b8181038181111561074c5761074c613cab565b8082018082111561074c5761074c613cab565b815167ffffffffffffffff811115613d0157613d016139b3565b613d1581613d0f8454613b2a565b84613b64565b602080601f831160018114613d4a5760008415613d325750858301515b600019600386901b1c1916600185901b178555612fee565b600085815260208120601f198616915b82811015613d7957888601518255948401946001909101908401613d5a565b5085821015613d975787850151600019600388901b60f8161c191681555b5050505050600190811b01905550565b634e487b7160e01b600052601260045260246000fd5b600082613dcc57613dcc613da7565b500690565b808202811582820484141761074c5761074c613cab565b600082613df757613df7613da7565b500490565b60008251613e0e818460208701613803565b9190910192915050565b604081526000613e2b6040830185613827565b90508260208301529392505050565b634e487b7160e01b600052603160045260246000fd5b600060033d1115613e695760046000803e5060005160e01c5b90565b600060443d1015613e7a5790565b6040516003193d81016004833e81513d67ffffffffffffffff8160248401118184111715613eaa57505050505090565b8285019150815181811115613ec25750505050505090565b843d8701016020828501011115613edc5750505050505090565b613eeb602082860101876139c9565b509095945050505050565b606081526000613f096060830186613827565b60208301949094525060400152919050565b600060208284031215613f2d57600080fd5b8151801515811461338d57600080fd5b634e487b7160e01b600052602160045260246000fdfe1f22a6cf75eb7fcaad2fabbc6dbce35f91d9ea3ad7582b03d6421676b0930e0002dd7bc7dec4dceedda775e58dd541e08a116c6c53815c0bd028192f7b6268004c697374696e6720776173207265706c6163656420627920616e6f7468657220636f6e7472616374b9e206fa2af7ee1331b72ce58b6d938ac810ce9b5cdb65d35ab723fd67badf9ea26469706673582212207cbcf1be467c6c155555ecd4bcfffa3ead8e27fac1552ae087b7fca82dbb471e64736f6c63430008180033",
  deployedBytecode:
    "0x608060405234801561001057600080fd5b50600436106102ea5760003560e01c80638456cb591161018c578063cecc2eac116100ee578063ecdd04da11610097578063f7aafaae11610071578063f7aafaae146106ec578063fafc130b146106ff578063fefb650e1461070857600080fd5b8063ecdd04da146106b3578063ed74d94a146106c6578063f5c7455c146106d957600080fd5b8063e1bf9c08116100c8578063e1bf9c0814610666578063e63ab1e914610679578063e682da7c146106a057600080fd5b8063cecc2eac1461062b578063d38ab5ff14610633578063d547741f1461065357600080fd5b8063a1ebf35d11610150578063ac60218c1161012a578063ac60218c146105e5578063ae23c78214610605578063b8f88d641461061857600080fd5b8063a1ebf35d146105a1578063a217fddf146105c8578063a428b07f146105d057600080fd5b80638456cb59146104f957806390b9d3591461050157806391d14854146105145780639f9106d11461055a578063a1260cdf1461059457600080fd5b80633f4ba83a1161025057806355f804b3116101f95780636cf0dc30116101d35780636cf0dc30146104cb57806372be0f1f146104de578063827b8e14146104e657600080fd5b806355f804b3146104865780635c975abb146104995780636c0360eb146104c357600080fd5b806344e2e74c1161022a57806344e2e74c146104405780634a938bae146104535780635149606e1461046657600080fd5b80633f4ba83a146103fe57806340018a25146104065780634430db7e1461041957600080fd5b806322778929116102b25780632f2ff15d1161028c5780632f2ff15d146103c357806336568abe146103d65780633780b3ed146103e957600080fd5b8063227789291461036d578063248a9ca3146103805780632684c925146103b057600080fd5b806301ffc9a7146102ef578063078908e814610317578063081f5de31461034857806318160ddd14610352578063211b98bd1461035a575b600080fd5b6103026102fd3660046135d3565b61071b565b60405190151581526020015b60405180910390f35b7f1f22a6cf75eb7fcaad2fabbc6dbce35f91d9ea3ad7582b03d6421676b0930e01545b60405190815260200161030e565b610350610752565b005b60045461033a565b610350610368366004613646565b6107d6565b61035061037b366004613692565b610835565b61033a61038e3660046136d4565b6000908152600080516020613f74833981519152602052604090206001015490565b6103506103be366004613646565b610891565b6103506103d1366004613709565b6108ea565b6103506103e4366004613709565b61091c565b61033a600080516020613fbc83398151915281565b61035061094f565b610350610414366004613735565b610984565b61033a7f61a3517f153a09154844ed8be639dabc6e78dc22315c2d9a91f7eddf9398c00281565b61035061044e366004613692565b610b7f565b6103506104613660046137cd565b610bd6565b610479610474366004613692565b610d1f565b60405161030e9190613853565b610350610494366004613692565b610d80565b7fcd5ed15c6e187e77e9aee88184c21f4f2182ab5827cb3b7e07fbedcd63f033005460ff16610302565b610479610d98565b6103506104d9366004613692565b610e26565b610350610eb0565b6103506104f4366004613866565b610ee7565b610350610f49565b61035061050f3660046136d4565b610f7b565b610302610522366004613709565b6000918252600080516020613f74833981519152602090815260408084206001600160a01b0393909316845291905290205460ff1690565b7f1f22a6cf75eb7fcaad2fabbc6dbce35f91d9ea3ad7582b03d6421676b0930e04546040516001600160a01b03909116815260200161030e565b6001546103029060ff1681565b61033a7fe2f4eaae4a9751e85a3e4a7b9587827a877f29914755229b07a7b2da98285f7081565b61033a600081565b6105d8611089565b60405161030e91906138b7565b6105f86105f336600461394d565b6111b9565b60405161030e919061396f565b6103506106133660046136d4565b611270565b6103506106263660046139f6565b6112f8565b6103506114e7565b6106466106413660046137cd565b611520565b60405161030e9190613ac1565b610350610661366004613709565b6115d8565b61033a6106743660046136d4565b61160a565b61033a7f65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a81565b6103506106ae366004613866565b61168b565b6103026106c1366004613692565b6116e6565b6103506106d4366004613866565b611753565b61033a6106e7366004613692565b6117ae565b6105f86106fa3660046137cd565b61180b565b61033a60025481565b610350610716366004613692565b6118b1565b60006001600160e01b03198216637965db0b60e01b148061074c57506301ffc9a760e01b6001600160e01b03198316145b92915050565b600080516020613f5483398151915280546040805163143a99b560e21b815290516001600160a01b03909216916350ea66d4916004808201926020929091908290030181865afa1580156107aa573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906107ce9190613afb565b600390910155565b600080516020613fbc8339815191526107ee81611908565b61082f84848080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250869250611912915050565b50505050565b600080516020613fbc83398151915261084d81611908565b61088c83838080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250611bb592505050565b505050565b600080516020613fbc8339815191526108a981611908565b61082f84848080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250869250611c65915050565b6000828152600080516020613f74833981519152602052604090206001015461091281611908565b61082f8383611ea5565b6001600160a01b03811633146109455760405163334bd91960e11b815260040160405180910390fd5b61088c8282611f62565b7f65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a61097981611908565b610981611ff6565b50565b61098c612068565b60008481526005602052604090205460ff16156109f05760405162461bcd60e51b815260206004820152601b60248201527f436f6e73656e743a206e6f6e636520616c72656164792075736564000000000060448201526064015b60405180910390fd5b6040516bffffffffffffffffffffffff193060601b16602082015260348101859052600090610a6590605401604051602081830303815290604052805190602001207f19457468657265756d205369676e6564204d6573736167653a0a3332000000006000908152601c91909152603c902090565b9050610aa78184848080601f0160208091040260200160405190810160405280939291908181526020018383808284376000920191909152506120ad92505050565b610b195760405162461bcd60e51b815260206004820152603160248201527f436f6e73656e743a20436f6e7472616374206f776e657220646964206e6f742060448201527f7369676e2074686973206d65737361676500000000000000000000000000000060648201526084016109e7565b505060048054600181810183557f8a35acfbc15ff81a39ae7d344fd709f28e8600b4aa8c65c6b64bfe7fe36bd19b9091018490559054600093845260036020908152604080862092909255948452600590945292909120805460ff191690921790915550565b600080516020613fbc833981519152610b9781611908565b61088c83838080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525061215e92505050565b610bde612068565b60015460ff1615610c465760405162461bcd60e51b815260206004820152602c60248201527f436f6e73656e743a204f70656e206f70742d696e73206172652063757272656e60448201526b1d1b1e48191a5cd8589b195960a21b60648201526084016109e7565b8060005b8181101561082f576000848483818110610c6657610c66613b14565b9050602002013590506003600082815260200190815260200160002054600014610cd25760405162461bcd60e51b815260206004820152601960248201527f436f6d6d69746d656e742065786973747320616c72656164790000000000000060448201526064016109e7565b60048054600181810183557f8a35acfbc15ff81a39ae7d344fd709f28e8600b4aa8c65c6b64bfe7fe36bd19b90910183905590546000928352600360205260409092209190915501610c4a565b6060600080516020613fbc833981519152610d3981611908565b610d7884848080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525061220392505050565b949350505050565b6000610d8b81611908565b600061082f838583613bac565b60008054610da590613b2a565b80601f0160208091040260200160405190810160405280929190818152602001828054610dd190613b2a565b8015610e1e5780601f10610df357610100808354040283529160200191610e1e565b820191906000526020600020905b815481529060010190602001808311610e0157829003601f168201915b505050505081565b7f61a3517f153a09154844ed8be639dabc6e78dc22315c2d9a91f7eddf9398c002610e5081611908565b8282604051610e60929190613c6c565b6040518091039020336001600160a01b03167f31df2703b10660cea45214572e0616949f363a34b1c19dca24026609f46655708585604051610ea3929190613c7c565b60405180910390a3505050565b7f65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a610eda81611908565b506001805460ff19169055565b600080516020613fbc833981519152610eff81611908565b610f4285858080601f0160208091040260200160405190810160405280939291908181526020018383808284376000920191909152508792508691506126599050565b5050505050565b7f65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a610f7381611908565b6109816128de565b610f83612068565b60015460ff1615610feb5760405162461bcd60e51b815260206004820152602c60248201527f436f6e73656e743a204f70656e206f70742d696e73206172652063757272656e60448201526b1d1b1e48191a5cd8589b195960a21b60648201526084016109e7565b600081815260036020526040902054156110475760405162461bcd60e51b815260206004820152601960248201527f436f6d6d69746d656e742065786973747320616c72656164790000000000000060448201526064016109e7565b600480546001810182557f8a35acfbc15ff81a39ae7d344fd709f28e8600b4aa8c65c6b64bfe7fe36bd19b018290555460009182526003602052604090912055565b60606000600080516020613f548339815191526001810180546040805160208084028201810190925282815293945060009084015b828210156111af57838290600052602060002090600402016040518060800160405290816000820180546110f190613b2a565b80601f016020809104026020016040519081016040528092919081815260200182805461111d90613b2a565b801561116a5780601f1061113f5761010080835404028352916020019161116a565b820191906000526020600020905b81548152906001019060200180831161114d57829003601f168201915b505050918352505060018281015460208084019190915260028401546001600160a01b03166040840152600390930154606090920191909152918352920191016110be565b5050505091505090565b606060006111c78484613cc1565b905060008167ffffffffffffffff8111156111e4576111e46139b3565b60405190808252806020026020018201604052801561120d578160200160208202803683370190505b50905060005b828110156112675760046112278783613cd4565b8154811061123757611237613b14565b906000526020600020015482828151811061125457611254613b14565b6020908102919091010152600101611213565b50949350505050565b600061127b81611908565b60025482116112f25760405162461bcd60e51b815260206004820152603860248201527f4e657720686f72697a6f6e206d757374206265207374726963746c79206c617460448201527f6572207468616e2063757272656e7420686f72697a6f6e2e000000000000000060648201526084016109e7565b50600255565b7ff0c57e16840df040f15088dc2f81fe391c3923bec73e23a9662efc9c229c6a00805468010000000000000000810460ff16159067ffffffffffffffff166000811580156113435750825b905060008267ffffffffffffffff1660011480156113605750303b155b90508115801561136e575080155b1561138c5760405163f92ee8a960e01b815260040160405180910390fd5b845467ffffffffffffffff1916600117855583156113c057845468ff00000000000000001916680100000000000000001785555b6113c8612939565b6113d0612949565b6113da8787612951565b4360025560006113ea8982613ce7565b506113f660008a611ea5565b506114217f65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a8a611ea5565b5061144c7fe2f4eaae4a9751e85a3e4a7b9587827a877f29914755229b07a7b2da98285f708a611ea5565b506114777f61a3517f153a09154844ed8be639dabc6e78dc22315c2d9a91f7eddf9398c0028a611ea5565b50611490600080516020613fbc8339815191528a611ea5565b5083156114dc57845468ff000000000000000019168555604051600181527fc7f505b2f371ae2175ee4913f4499e1f2633a7b5936321eed1cdaeb6115181d29060200160405180910390a15b505050505050505050565b7f65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a61151181611908565b506001805460ff191681179055565b60608160008167ffffffffffffffff81111561153e5761153e6139b3565b604051908082528060200260200182016040528015611567578160200160208202803683370190505b50905060005b82811015611267576005600087878481811061158b5761158b613b14565b90506020020135815260200190815260200160002060009054906101000a900460ff168282815181106115c0576115c0613b14565b9115156020928302919091019091015260010161156d565b6000828152600080516020613f74833981519152602052604090206001015461160081611908565b61082f8383611f62565b6000670de0b6b3a764000080670de111a6b7de40005b841561168357611631600286613dbd565b60010361165057826116438284613dd1565b61164d9190613de8565b91505b8460010361166057509392505050565b8261166b8280613dd1565b6116759190613de8565b9050600185901c9450611620565b509392505050565b600080516020613fbc8339815191526116a381611908565b610f4285858080601f0160208091040260200160405190810160405280939291908181526020018383808284376000920191909152508792508691506129679050565b6040516000907f29912872bb1868dd74efe86230a05098a24ae1f39d64ec2129d982442801ac0090819083906117229087908790602001613c6c565b60408051808303601f190181529181528151602092830120835290820192909252016000205460ff16949350505050565b600080516020613fbc83398151915261176b81611908565b610f4285858080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250879250869150612bbe9050565b604051600090600080516020613f54833981519152907f1f22a6cf75eb7fcaad2fabbc6dbce35f91d9ea3ad7582b03d6421676b0930e02906117f39086908690613c6c565b90815260200160405180910390205491505092915050565b60608160008167ffffffffffffffff811115611829576118296139b3565b604051908082528060200260200182016040528015611852578160200160208202803683370190505b50905060005b82811015611267576003600087878481811061187657611876613b14565b9050602002013581526020019081526020016000205482828151811061189e5761189e613b14565b6020908102919091010152600101611858565b600080516020613fbc8339815191526118c981611908565b61088c83838080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250612e8392505050565b6109818133612ff6565b7f1f22a6cf75eb7fcaad2fabbc6dbce35f91d9ea3ad7582b03d6421676b0930e03547f1f22a6cf75eb7fcaad2fabbc6dbce35f91d9ea3ad7582b03d6421676b0930e0154600080516020613f5483398151915291116119c25760405162461bcd60e51b815260206004820152602660248201527f436f6e73656e7420436f6e74726163743a205461672062756467657420657868604482015265185d5cdd195960d21b60648201526084016109e7565b80600201836040516119d49190613dfc565b908152602001604051809103902054600014611a585760405162461bcd60e51b815260206004820152603d60248201527f436f6e73656e7420436f6e74726163743a20546869732074616720697320616c60448201527f7265616479207374616b6564206279207468697320636f6e747261637400000060648201526084016109e7565b6000611a638361160a565b9050816001016040518060800160405280868152602001858152602001611a873390565b6001600160a01b0316815260209081018490528254600181018455600093845292208151919260040201908190611abe9082613ce7565b506020820151816001015560408201518160020160006101000a8154816001600160a01b0302191690836001600160a01b0316021790555060608201518160030155505081600101805490508260020185604051611b1c9190613dfc565b90815260405190819003602001902055611b4c611b363390565b60048401546001600160a01b0316903084613058565b815460405163211b98bd60e01b81526001600160a01b039091169063211b98bd90611b7d9087908790600401613e18565b600060405180830381600087803b158015611b9757600080fd5b505af1158015611bab573d6000803e3d6000fd5b5050505050505050565b6040517f29912872bb1868dd74efe86230a05098a24ae1f39d64ec2129d982442801ac009060009082908290611bef908690602001613dfc565b60405160208183030381529060405280519060200120815260200190815260200160002060006101000a81548160ff0219169083151502179055507f549cfb509d34ba3a18b302f759af92977d405b9a59d1ad5eaf676b1b26fdd02782604051611c599190613853565b60405180910390a15050565b7f1f22a6cf75eb7fcaad2fabbc6dbce35f91d9ea3ad7582b03d6421676b0930e03547f1f22a6cf75eb7fcaad2fabbc6dbce35f91d9ea3ad7582b03d6421676b0930e0154600080516020613f548339815191529111611d125760405162461bcd60e51b8152602060048201526024808201527f436f6e74656e74204f626a6563743a20546167206275646765742065786861756044820152631cdd195960e21b60648201526084016109e7565b8060020183604051611d249190613dfc565b908152602001604051809103902054600014611d965760405162461bcd60e51b815260206004820152602b60248201527f436f6e74656e74204f626a6563743a20546869732074616720697320616c726560448201526a30b23c9039ba30b5b2b21760a91b60648201526084016109e7565b6000611da18361160a565b9050816001016040518060800160405280868152602001858152602001611dc53390565b6001600160a01b0316815260209081018490528254600181018455600093845292208151919260040201908190611dfc9082613ce7565b506020820151816001015560408201518160020160006101000a8154816001600160a01b0302191690836001600160a01b0316021790555060608201518160030155505081600101805490508260020185604051611e5a9190613dfc565b90815260405190819003602001902055611e74611b363390565b8154604051636f88c56160e11b81526001600160a01b039091169063df118ac290611b7d9087908790600401613e18565b6000828152600080516020613f74833981519152602081815260408084206001600160a01b038616855290915282205460ff16611f58576000848152602082815260408083206001600160a01b03871684529091529020805460ff19166001179055611f0e3390565b6001600160a01b0316836001600160a01b0316857f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a4600191505061074c565b600091505061074c565b6000828152600080516020613f74833981519152602081815260408084206001600160a01b038616855290915282205460ff1615611f58576000848152602082815260408083206001600160a01b0387168085529252808320805460ff1916905551339287917ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b9190a4600191505061074c565b611ffe6130c7565b7fcd5ed15c6e187e77e9aee88184c21f4f2182ab5827cb3b7e07fbedcd63f03300805460ff191681557f5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa335b6040516001600160a01b03909116815260200160405180910390a150565b7fcd5ed15c6e187e77e9aee88184c21f4f2182ab5827cb3b7e07fbedcd63f033005460ff16156120ab5760405163d93c066560e01b815260040160405180910390fd5b565b6000806120ba8484613109565b90506001600160a01b03811661211e5760405162461bcd60e51b8152602060048201526024808201527f436f6e73656e743a205369676e65722063616e6e6f742062652030206164647260448201526332b9b99760e11b60648201526084016109e7565b6001600160a01b03811660009081527fed82e8858f919528fd86c81da277f0812ef4876fae8bc5251645af9640d3f49f602052604090205460ff16610d78565b6040517f29912872bb1868dd74efe86230a05098a24ae1f39d64ec2129d982442801ac00906001908290600090612199908690602001613dfc565b60405160208183030381529060405280519060200120815260200190815260200160002060006101000a81548160ff0219169083151502179055507f518f4dd9e1ba750adb395696c0d4f5417dd0d7686a59f0ba155189e55042153382604051611c599190613853565b604051606090600080516020613f54833981519152906000907f1f22a6cf75eb7fcaad2fabbc6dbce35f91d9ea3ad7582b03d6421676b0930e0290612249908690613dfc565b908152602001604051809103902054116122bc5760405162461bcd60e51b815260206004820152602e60248201527f436f6e73656e7420436f6e74726163743a20546869732074616720686173206e60448201526d1bdd081899595b881cdd185ad95960921b60648201526084016109e7565b6001818101546000916122ce91613cc1565b90506000600183600201866040516122e69190613dfc565b9081526020016040518091039020546122ff9190613cc1565b9050600083600101838154811061231857612318613b14565b906000526020600020906004020160405180608001604052908160008201805461234190613b2a565b80601f016020809104026020016040519081016040528092919081815260200182805461236d90613b2a565b80156123ba5780601f1061238f576101008083540402835291602001916123ba565b820191906000526020600020905b81548152906001019060200180831161239d57829003601f168201915b5050509183525050600182810154602083015260028301546001600160a01b03166040830152600390920154606090910152850180549192506000918490811061240657612406613b14565b90600052602060002090600402016001015490508185600101848154811061243057612430613b14565b60009182526020909120825160049092020190819061244f9082613ce7565b50602082015160018281019190915560408301516002830180546001600160a01b0319166001600160a01b0390921691909117905560609092015160039091015561249b908490613cd4565b825160405160028801916124ae91613dfc565b90815260200160405180910390208190555084600201876040516124d29190613dfc565b908152602001604051809103902060009055846001018054806124f7576124f7613e3a565b600082815260208120600019909201916004830201906125178282613585565b506000600182018190556002820180546001600160a01b03191690556003909101559055604082015160608301516004870154612562926001600160a01b0390911691309190613058565b8454604051639d38c87b60e01b81526001600160a01b0390911690639d38c87b90612593908a908590600401613e18565b600060405180830381600087803b1580156125ad57600080fd5b505af19250505080156125be575060015b61261a576125ca613e50565b806308c379a00361260e57506125de613e6c565b806125e95750612610565b604051806060016040528060288152602001613f946028913998975050505050505050565b505b3d6000803e3d6000fd5b505060408051808201909152600f81527f4c697374696e672072656d6f7665640000000000000000000000000000000000602082015295945050505050565b7f1f22a6cf75eb7fcaad2fabbc6dbce35f91d9ea3ad7582b03d6421676b0930e03547f1f22a6cf75eb7fcaad2fabbc6dbce35f91d9ea3ad7582b03d6421676b0930e0154600080516020613f5483398151915291116127095760405162461bcd60e51b815260206004820152602660248201527f436f6e73656e7420436f6e74726163743a205461672062756467657420657868604482015265185d5cdd195960d21b60648201526084016109e7565b806002018460405161271b9190613dfc565b90815260200160405180910390205460001461279f5760405162461bcd60e51b815260206004820152603d60248201527f436f6e73656e7420436f6e74726163743a20546869732074616720697320616c60448201527f7265616479207374616b6564206279207468697320636f6e747261637400000060648201526084016109e7565b60006127aa8361160a565b90508160010160405180608001604052808781526020018581526020016127ce3390565b6001600160a01b03168152602090810184905282546001810184556000938452922081519192600402019081906128059082613ce7565b506020820151816001015560408201518160020160006101000a8154816001600160a01b0302191690836001600160a01b03160217905550606082015181600301555050816001018054905082600201866040516128639190613dfc565b9081526040519081900360200190205561287d611b363390565b8154604051636887f58f60e01b81526001600160a01b0390911690636887f58f906128b090889088908890600401613ef6565b600060405180830381600087803b1580156128ca57600080fd5b505af11580156114dc573d6000803e3d6000fd5b6128e6612068565b7fcd5ed15c6e187e77e9aee88184c21f4f2182ab5827cb3b7e07fbedcd63f03300805460ff191660011781557f62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a2583361204a565b612941613133565b6120ab613181565b6120ab613133565b612959613133565b61296382826131b4565b5050565b7f1f22a6cf75eb7fcaad2fabbc6dbce35f91d9ea3ad7582b03d6421676b0930e03547f1f22a6cf75eb7fcaad2fabbc6dbce35f91d9ea3ad7582b03d6421676b0930e0154600080516020613f548339815191529111612a175760405162461bcd60e51b815260206004820152602660248201527f436f6e73656e7420436f6e74726163743a205461672062756467657420657868604482015265185d5cdd195960d21b60648201526084016109e7565b8060020184604051612a299190613dfc565b908152602001604051809103902054600014612aad5760405162461bcd60e51b815260206004820152603d60248201527f436f6e73656e7420436f6e74726163743a20546869732074616720697320616c60448201527f7265616479207374616b6564206279207468697320636f6e747261637400000060648201526084016109e7565b6000612ab88461160a565b9050816001016040518060800160405280878152602001868152602001612adc3390565b6001600160a01b0316815260209081018490528254600181018455600093845292208151919260040201908190612b139082613ce7565b506020820151816001015560408201518160020160006101000a8154816001600160a01b0302191690836001600160a01b0316021790555060608201518160030155505081600101805490508260020186604051612b719190613dfc565b90815260405190819003602001902055612b8b611b363390565b81546040516371731b8360e01b81526001600160a01b03909116906371731b83906128b090889088908890600401613ef6565b604051600080516020613f54833981519152906000907f1f22a6cf75eb7fcaad2fabbc6dbce35f91d9ea3ad7582b03d6421676b0930e0290612c01908790613dfc565b90815260200160405180910390205411612c745760405162461bcd60e51b815260206004820152602e60248201527f436f6e73656e7420436f6e74726163743a20546869732074616720686173206e60448201526d1bdd081899595b881cdd185ad95960921b60648201526084016109e7565b60008160010160018360020187604051612c8e9190613dfc565b908152602001604051809103902054612ca79190613cc1565b81548110612cb757612cb7613b14565b9060005260206000209060040201600101549050838260010160018460020188604051612ce49190613dfc565b908152602001604051809103902054612cfd9190613cc1565b81548110612d0d57612d0d613b14565b60009182526020822060016004909202010191909155612d306106748387613cc1565b9050808360010160018560020189604051612d4b9190613dfc565b908152602001604051809103902054612d649190613cc1565b81548110612d7457612d74613b14565b90600052602060002090600402016003016000828254612d949190613cd4565b90915550506004830154612db3906001600160a01b0316333084613058565b8254604051639d38c87b60e01b81526001600160a01b0390911690639d38c87b90612de49089908690600401613e18565b600060405180830381600087803b158015612dfe57600080fd5b505af1158015612e12573d6000803e3d6000fd5b505084546040516371731b8360e01b81526001600160a01b0390911692506371731b839150612e4990899089908990600401613ef6565b600060405180830381600087803b158015612e6357600080fd5b505af1158015612e77573d6000803e3d6000fd5b50505050505050505050565b604051600080516020613f54833981519152906000907f1f22a6cf75eb7fcaad2fabbc6dbce35f91d9ea3ad7582b03d6421676b0930e0290612ec6908590613dfc565b90815260200160405180910390205411612f395760405162461bcd60e51b815260206004820152602e60248201527f436f6e73656e7420436f6e74726163743a20546869732074616720686173206e60448201526d1bdd081899595b881cdd185ad95960921b60648201526084016109e7565b80546040516001600160a01b039091169063211b98bd9084906001808601916002870190612f68908590613dfc565b908152602001604051809103902054612f819190613cc1565b81548110612f9157612f91613b14565b9060005260206000209060040201600101546040518363ffffffff1660e01b8152600401612fc0929190613e18565b600060405180830381600087803b158015612fda57600080fd5b505af1158015612fee573d6000803e3d6000fd5b505050505050565b6000828152600080516020613f74833981519152602090815260408083206001600160a01b038516845290915290205460ff166129635760405163e2517d3f60e01b81526001600160a01b0382166004820152602481018390526044016109e7565b604080516001600160a01b0385811660248301528416604482015260648082018490528251808303909101815260849091019091526020810180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff166323b872dd60e01b17905261082f908590613216565b7fcd5ed15c6e187e77e9aee88184c21f4f2182ab5827cb3b7e07fbedcd63f033005460ff166120ab57604051638dfc202b60e01b815260040160405180910390fd5b6000806000806131198686613279565b92509250925061312982826132c6565b5090949350505050565b7ff0c57e16840df040f15088dc2f81fe391c3923bec73e23a9662efc9c229c6a005468010000000000000000900460ff166120ab57604051631afcd79f60e31b815260040160405180910390fd5b613189613133565b7fcd5ed15c6e187e77e9aee88184c21f4f2182ab5827cb3b7e07fbedcd63f03300805460ff19169055565b6131bc613133565b600080516020613f5483398151915280546001600160a01b039384166001600160a01b0319918216179091557f1f22a6cf75eb7fcaad2fabbc6dbce35f91d9ea3ad7582b03d6421676b0930e048054929093169116179055565b600061322b6001600160a01b0384168361337f565b9050805160001415801561325057508080602001905181019061324e9190613f1b565b155b1561088c57604051635274afe760e01b81526001600160a01b03841660048201526024016109e7565b600080600083516041036132b35760208401516040850151606086015160001a6132a588828585613394565b9550955095505050506132bf565b50508151600091506002905b9250925092565b60008260038111156132da576132da613f3d565b036132e3575050565b60018260038111156132f7576132f7613f3d565b036133155760405163f645eedf60e01b815260040160405180910390fd5b600282600381111561332957613329613f3d565b0361334a5760405163fce698f760e01b8152600481018290526024016109e7565b600382600381111561335e5761335e613f3d565b03612963576040516335e2f38360e21b8152600481018290526024016109e7565b606061338d83836000613463565b9392505050565b600080807f7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a08411156133cf5750600091506003905082613459565b604080516000808252602082018084528a905260ff891692820192909252606081018790526080810186905260019060a0016020604051602081039080840390855afa158015613423573d6000803e3d6000fd5b5050604051601f1901519150506001600160a01b03811661344f57506000925060019150829050613459565b9250600091508190505b9450945094915050565b6060814710156134885760405163cd78605960e01b81523060048201526024016109e7565b600080856001600160a01b031684866040516134a49190613dfc565b60006040518083038185875af1925050503d80600081146134e1576040519150601f19603f3d011682016040523d82523d6000602084013e6134e6565b606091505b50915091506134f6868383613500565b9695505050505050565b606082613515576135108261355c565b61338d565b815115801561352c57506001600160a01b0384163b155b1561355557604051639996b31560e01b81526001600160a01b03851660048201526024016109e7565b508061338d565b80511561356c5780518082602001fd5b604051630a12f52160e11b815260040160405180910390fd5b50805461359190613b2a565b6000825580601f106135a1575050565b601f01602090049060005260206000209081019061098191905b808211156135cf57600081556001016135bb565b5090565b6000602082840312156135e557600080fd5b81356001600160e01b03198116811461338d57600080fd5b60008083601f84011261360f57600080fd5b50813567ffffffffffffffff81111561362757600080fd5b60208301915083602082850101111561363f57600080fd5b9250929050565b60008060006040848603121561365b57600080fd5b833567ffffffffffffffff81111561367257600080fd5b61367e868287016135fd565b909790965060209590950135949350505050565b600080602083850312156136a557600080fd5b823567ffffffffffffffff8111156136bc57600080fd5b6136c8858286016135fd565b90969095509350505050565b6000602082840312156136e657600080fd5b5035919050565b80356001600160a01b038116811461370457600080fd5b919050565b6000806040838503121561371c57600080fd5b8235915061372c602084016136ed565b90509250929050565b6000806000806060858703121561374b57600080fd5b8435935060208501359250604085013567ffffffffffffffff81111561377057600080fd5b61377c878288016135fd565b95989497509550505050565b60008083601f84011261379a57600080fd5b50813567ffffffffffffffff8111156137b257600080fd5b6020830191508360208260051b850101111561363f57600080fd5b600080602083850312156137e057600080fd5b823567ffffffffffffffff8111156137f757600080fd5b6136c885828601613788565b60005b8381101561381e578181015183820152602001613806565b50506000910152565b6000815180845261383f816020860160208601613803565b601f01601f19169290920160200192915050565b60208152600061338d6020830184613827565b6000806000806060858703121561387c57600080fd5b843567ffffffffffffffff81111561389357600080fd5b61389f878288016135fd565b90989097506020870135966040013595509350505050565b600060208083018184528085518083526040925060408601915060408160051b87010184880160005b8381101561393f57603f1989840301855281516080815181865261390682870182613827565b838b0151878c0152898401516001600160a01b03168a8801526060938401519390960192909252505093860193908601906001016138e0565b509098975050505050505050565b6000806040838503121561396057600080fd5b50508035926020909101359150565b6020808252825182820181905260009190848201906040850190845b818110156139a75783518352928401929184019160010161398b565b50909695505050505050565b634e487b7160e01b600052604160045260246000fd5b601f8201601f1916810167ffffffffffffffff811182821017156139ef576139ef6139b3565b6040525050565b60008060008060808587031215613a0c57600080fd5b613a15856136ed565b935060208086013567ffffffffffffffff80821115613a3357600080fd5b818801915088601f830112613a4757600080fd5b813581811115613a5957613a596139b3565b6040519150613a71601f8201601f19168501836139c9565b8082528984828501011115613a8557600080fd5b8084840185840137600084828401015250809550505050613aa8604086016136ed565b9150613ab6606086016136ed565b905092959194509250565b6020808252825182820181905260009190848201906040850190845b818110156139a7578351151583529284019291840191600101613add565b600060208284031215613b0d57600080fd5b5051919050565b634e487b7160e01b600052603260045260246000fd5b600181811c90821680613b3e57607f821691505b602082108103613b5e57634e487b7160e01b600052602260045260246000fd5b50919050565b601f82111561088c576000816000526020600020601f850160051c81016020861015613b8d5750805b601f850160051c820191505b81811015612fee57828155600101613b99565b67ffffffffffffffff831115613bc457613bc46139b3565b613bd883613bd28354613b2a565b83613b64565b6000601f841160018114613c0c5760008515613bf45750838201355b600019600387901b1c1916600186901b178355610f42565b600083815260209020601f19861690835b82811015613c3d5786850135825560209485019460019092019101613c1d565b5086821015613c5a5760001960f88860031b161c19848701351681555b505060018560011b0183555050505050565b8183823760009101908152919050565b60208152816020820152818360408301376000818301604090810191909152601f909201601f19160101919050565b634e487b7160e01b600052601160045260246000fd5b8181038181111561074c5761074c613cab565b8082018082111561074c5761074c613cab565b815167ffffffffffffffff811115613d0157613d016139b3565b613d1581613d0f8454613b2a565b84613b64565b602080601f831160018114613d4a5760008415613d325750858301515b600019600386901b1c1916600185901b178555612fee565b600085815260208120601f198616915b82811015613d7957888601518255948401946001909101908401613d5a565b5085821015613d975787850151600019600388901b60f8161c191681555b5050505050600190811b01905550565b634e487b7160e01b600052601260045260246000fd5b600082613dcc57613dcc613da7565b500690565b808202811582820484141761074c5761074c613cab565b600082613df757613df7613da7565b500490565b60008251613e0e818460208701613803565b9190910192915050565b604081526000613e2b6040830185613827565b90508260208301529392505050565b634e487b7160e01b600052603160045260246000fd5b600060033d1115613e695760046000803e5060005160e01c5b90565b600060443d1015613e7a5790565b6040516003193d81016004833e81513d67ffffffffffffffff8160248401118184111715613eaa57505050505090565b8285019150815181811115613ec25750505050505090565b843d8701016020828501011115613edc5750505050505090565b613eeb602082860101876139c9565b509095945050505050565b606081526000613f096060830186613827565b60208301949094525060400152919050565b600060208284031215613f2d57600080fd5b8151801515811461338d57600080fd5b634e487b7160e01b600052602160045260246000fdfe1f22a6cf75eb7fcaad2fabbc6dbce35f91d9ea3ad7582b03d6421676b0930e0002dd7bc7dec4dceedda775e58dd541e08a116c6c53815c0bd028192f7b6268004c697374696e6720776173207265706c6163656420627920616e6f7468657220636f6e7472616374b9e206fa2af7ee1331b72ce58b6d938ac810ce9b5cdb65d35ab723fd67badf9ea26469706673582212207cbcf1be467c6c155555ecd4bcfffa3ead8e27fac1552ae087b7fca82dbb471e64736f6c63430008180033",
  linkReferences: {},
  deployedLinkReferences: {},
};
