export default {
  _format: "hh-sol-artifact-1",
  contractName: "ConsentFactory",
  sourceName: "contracts/consent/ConsentFactory.sol",
  abi: [
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
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "consentAddress",
          type: "address",
        },
      ],
      name: "ConsentContractDeployed",
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
          indexed: true,
          internalType: "address",
          name: "oldOccupant",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "newOccupant",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "stakingToken",
          type: "address",
        },
        {
          indexed: false,
          internalType: "string",
          name: "tag",
          type: "string",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "slot",
          type: "uint256",
        },
      ],
      name: "RankingUpdate",
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
      inputs: [
        {
          internalType: "string",
          name: "ipfsCid",
          type: "string",
        },
      ],
      name: "addQuestionnaire",
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
          internalType: "uint256[]",
          name: "removedSlots",
          type: "uint256[]",
        },
      ],
      name: "adminRemoveListings",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "beaconAddress",
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
        {
          internalType: "address",
          name: "contentAddress",
          type: "address",
        },
      ],
      name: "blockContentObject",
      outputs: [],
      stateMutability: "nonpayable",
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
      inputs: [
        {
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          internalType: "string",
          name: "baseURI",
          type: "string",
        },
      ],
      name: "createConsent",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "getGovernanceToken",
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
          name: "_startingSlot",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "numSlots",
          type: "uint256",
        },
        {
          internalType: "bool",
          name: "filterActive",
          type: "bool",
        },
      ],
      name: "getListingsBackward",
      outputs: [
        {
          internalType: "string[]",
          name: "",
          type: "string[]",
        },
        {
          components: [
            {
              internalType: "uint256",
              name: "previous",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "next",
              type: "uint256",
            },
            {
              internalType: "address",
              name: "contentObject",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "stake",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "timeExpiring",
              type: "uint256",
            },
          ],
          internalType: "struct IContentFactory.Listing[]",
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
          name: "_startingSlot",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "numSlots",
          type: "uint256",
        },
        {
          internalType: "bool",
          name: "filterActive",
          type: "bool",
        },
      ],
      name: "getListingsForward",
      outputs: [
        {
          internalType: "string[]",
          name: "",
          type: "string[]",
        },
        {
          components: [
            {
              internalType: "uint256",
              name: "previous",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "next",
              type: "uint256",
            },
            {
              internalType: "address",
              name: "contentObject",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "stake",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "timeExpiring",
              type: "uint256",
            },
          ],
          internalType: "struct IContentFactory.Listing[]",
          name: "",
          type: "tuple[]",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getQuestionnaires",
      outputs: [
        {
          internalType: "string[]",
          name: "questionnaireArr",
          type: "string[]",
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
          internalType: "string",
          name: "tag",
          type: "string",
        },
        {
          internalType: "address",
          name: "stakedToken",
          type: "address",
        },
      ],
      name: "getTagTotal",
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
          name: "_consentImpAddress",
          type: "address",
        },
        {
          internalType: "address",
          name: "_governanceToken",
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
          name: "_newHead",
          type: "uint256",
        },
      ],
      name: "initializeTag",
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
          name: "_existingSlot",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "_newSlot",
          type: "uint256",
        },
      ],
      name: "insertDownstream",
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
          name: "_newSlot",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "_existingSlot",
          type: "uint256",
        },
      ],
      name: "insertUpstream",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "tokenAddress",
          type: "address",
        },
      ],
      name: "isStakingToken",
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
      name: "listingDuration",
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
      name: "maxTagsPerListing",
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
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "questionnaires",
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
          internalType: "address",
          name: "stakingToken",
          type: "address",
        },
      ],
      name: "registerStakingToken",
      outputs: [],
      stateMutability: "nonpayable",
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
        {
          internalType: "uint256[]",
          name: "slots",
          type: "uint256[]",
        },
      ],
      name: "removeExpiredListings",
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
          name: "removedSlot",
          type: "uint256",
        },
      ],
      name: "removeListing",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint8",
          name: "index",
          type: "uint8",
        },
      ],
      name: "removeQuestionnaire",
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
          internalType: "uint256",
          name: "listingDuration",
          type: "uint256",
        },
      ],
      name: "setListingDuration",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "maxTagsPerListing",
          type: "uint256",
        },
      ],
      name: "setMaxTagsPerListing",
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
          internalType: "address",
          name: "stakingToken",
          type: "address",
        },
        {
          internalType: "address",
          name: "contentAddress",
          type: "address",
        },
      ],
      name: "unblockContentObject",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
  ],
  bytecode:
    "0x608060405234801561001057600080fd5b5061544c806100206000396000f3fe60806040523480156200001157600080fd5b5060043610620002555760003560e01c806350ea66d41162000149578063aa6311e711620000c7578063e1bf9c081162000086578063e1bf9c08146200062d578063ebf120d31462000644578063eee9665e146200065b578063efcd84c31462000672578063f75a39a2146200068957600080fd5b8063aa6311e714620005ba578063b3fae4a514620005d1578063c05109e014620005e8578063c0817bbd14620005ff578063d547741f146200061657600080fd5b8063841a5c481162000114578063841a5c4814620005135780638daad508146200052a57806391d1485414620005505780639f160158146200059a578063a217fddf14620005b157600080fd5b806350ea66d414620004a75780636df515b814620004cf5780637d7b0e9a14620004e85780637e2ec6d014620004ff57600080fd5b806331c1c65011620001d7578063376cc74d11620001a2578063376cc74d14620004175780633f8a037d146200042e57806343166d78146200046257806344e2e74c1462000479578063485cc955146200049057600080fd5b806331c1c65014620003bb57806333bfb30914620003d257806336568abe14620003e957806336a8e097146200040057600080fd5b806322778929116200022457806322778929146200030b578063248a9ca314620003225780632850df1a14620003655780632b0559e6146200038d5780632f2ff15d14620003a457600080fd5b806301ffc9a7146200025a57806308f5929414620002865780630b340a1914620002ad5780631760a7ee14620002f4575b600080fd5b620002716200026b36600462003c0e565b620006a0565b60405190151581526020015b60405180910390f35b6200029d6200029736600462003cb2565b620006d8565b6040516200027d92919062003de7565b620002f2620002be36600462003e75565b6001600160a01b03811660009081526000805160206200539783398151915260205260409020805460ff1916600117905550565b005b620002f26200030536600462003e93565b62000a72565b620002f26200031c36600462003f4e565b62000cdd565b620003566200033336600462003f94565b6000908152600080516020620053f7833981519152602052604090206001015490565b6040519081526020016200027d565b7f584565e90fa9ec9ac82afca62b5a80e321f6d503f72d0884875cf353a2703f015462000356565b620002f26200039e36600462003fae565b62000d30565b620002f2620003b536600462004010565b62000f85565b6200029d620003cc36600462003cb2565b62000fc2565b620002f2620003e336600462004110565b620012ff565b620002f2620003fa36600462004010565b62001413565b620002716200041136600462003e75565b62001449565b620002f26200042836600462004164565b62001479565b600080516020620053d7833981519152546001600160a01b03165b6040516001600160a01b0390911681526020016200027d565b620002716200047336600462003f4e565b620019d0565b620002f26200048a36600462003f4e565b62001a3f565b620002f2620004a1366004620041d0565b62001a8d565b7f584565e90fa9ec9ac82afca62b5a80e321f6d503f72d0884875cf353a2703f025462000356565b620004d962001c40565b6040516200027d9190620041ff565b620002f2620004f936600462004164565b62001d23565b60005462000449906001600160a01b031681565b620002f26200052436600462003f94565b62002268565b620005416200053b36600462003f94565b620022a2565b6040516200027d919062004214565b620002716200056136600462004010565b6000918252600080516020620053f7833981519152602090815260408084206001600160a01b0393909316845291905290205460ff1690565b620002f2620005ab366004620041d0565b62002357565b62000356600081565b620002f2620005cb36600462003f94565b6200246d565b620002f2620005e236600462003fae565b620024a3565b620002f2620005f9366004620041d0565b62002829565b620002f26200061036600462004229565b62002906565b620002f26200062736600462004010565b6200299d565b620003566200063e36600462003f94565b620029d4565b620002f26200065536600462004313565b620029e1565b620002f26200066c36600462003fae565b62002af0565b620003566200068336600462004338565b62002f85565b620002f26200069a36600462004392565b62002ff6565b60006001600160e01b03198216637965db0b60e01b1480620006d257506301ffc9a760e01b6001600160e01b03198316145b92915050565b606080600080516020620053d783398151915260008567ffffffffffffffff8111156200070957620007096200403f565b6040519080825280602002602001820160405280156200073e57816020015b6060815260200190600190039081620007285790505b50905060008667ffffffffffffffff8111156200075f576200075f6200403f565b604051908082528060200260200182016040528015620007ce57816020015b620007ba6040518060a00160405280600081526020016000815260200160006001600160a01b0316815260200160008152602001600081525090565b8152602001906001900390816200077e5790505b50905060008b8b604051602001620007e8929190620043d3565b60405160208183030381529060405280519060200120905060001989036200083e57600081815260078501602090815260408083206001600160a01b038e16845282528083209b83529a90529890982060010154975b60005b8881101562000a5d57600085600701600084815260200190815260200160002060008d6001600160a01b03166001600160a01b0316815260200190815260200160002060008c81526020019081526020016000206040518060a001604052908160008201548152602001600182015481526020016002820160009054906101000a90046001600160a01b03166001600160a01b03166001600160a01b031681526020016003820154815260200160048201548152505090506000816080015111620009535760405162461bcd60e51b815260206004820152601d60248201527f436f6e74656e7420466163746f72793a20696e76616c696420736c6f7400000060448201526064015b60405180910390fd5b6001891515148015620009695750428160800151105b156200098d5780602001519a508a60000362000986575062000a5d565b5062000a54565b80604001516001600160a01b0316636c0360eb6040518163ffffffff1660e01b8152600401600060405180830381865afa158015620009d0573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f19168201604052620009fa9190810190620043e3565b85838151811062000a0f5762000a0f62004463565b60200260200101819052508084838151811062000a305762000a3062004463565b602002602001018190525080602001519a508a60000362000a52575062000a5d565b505b60010162000841565b50919b909a5098505050505050505050565b50565b336000908152600080516020620053b783398151915260205260409020548390600080516020620053d78339815191529060ff16151560011462000aca5760405162461bcd60e51b81526004016200094a9062004479565b6001600160a01b0382166000908152600582016020908152604080832033845290915290205460ff161562000b135760405162461bcd60e51b81526004016200094a90620044d6565b6001600160a01b0385166000908152600080516020620053978339815191526020526040902054600080516020620053d78339815191529060ff1662000b6d5760405162461bcd60e51b81526004016200094a906200451e565b6000888860405160200162000b84929190620043d3565b60408051601f19818403018152919052805160209091012090508460005b8181101562000cd057600083815260078501602090815260408083206001600160a01b038d1684529091528120818a8a8581811062000be55762000be562004463565b60209081029290920135835250818101929092526040908101600020815160a0810183528154815260018201549381019390935260028101546001600160a01b031691830191909152600381015460608301526004015460808201819052909150158062000c565750428160800151115b1562000c63575062000cc7565b62000cc5818b8e8e8080601f0160208091040260200160405190810160405280939291908181526020018383808284376000920191909152508a92508f91508e90508881811062000cb85762000cb862004463565b90506020020135620030ba565b505b60010162000ba2565b5050505050505050505050565b600062000cea816200327a565b62000d2b83838080601f0160208091040260200160405190810160405280939291908181526020018383808284376000920191909152506200328692505050565b505050565b336000908152600080516020620053b783398151915260205260409020548290600080516020620053d78339815191529060ff16151560011462000d885760405162461bcd60e51b81526004016200094a9062004479565b6001600160a01b0382166000908152600582016020908152604080832033845290915290205460ff161562000dd15760405162461bcd60e51b81526004016200094a90620044d6565b6001600160a01b0384166000908152600080516020620053978339815191526020526040902054600080516020620053d78339815191529060ff1662000e2b5760405162461bcd60e51b81526004016200094a906200451e565b6000878760405160200162000e42929190620043d3565b60408051601f19818403018152828252805160209182012060008181526007870183528381206001600160a01b03808d1683529084528482208b835284529084902060a086018552805486526001810154938601939093526002830154169284018390526003820154606085015260049091015460808401529250331462000f335760405162461bcd60e51b815260206004820152602e60248201527f436f6e74656e7420466163746f72793a206f6e6c79206c697374696e67206f7760448201527f6e65722063616e2072656d6f766500000000000000000000000000000000000060648201526084016200094a565b62000f7a81888b8b8080601f0160208091040260200160405190810160405280939291908181526020018383808284376000920191909152508892508c9150620030ba9050565b505050505050505050565b6000828152600080516020620053f7833981519152602052604090206001015462000fb0816200327a565b62000fbc8383620033f5565b50505050565b606080600080516020620053d783398151915260008567ffffffffffffffff81111562000ff35762000ff36200403f565b6040519080825280602002602001820160405280156200102857816020015b6060815260200190600190039081620010125790505b50905060008667ffffffffffffffff8111156200104957620010496200403f565b604051908082528060200260200182016040528015620010b857816020015b620010a46040518060a00160405280600081526020016000815260200160006001600160a01b0316815260200160008152602001600081525090565b815260200190600190039081620010685790505b50905060008b8b604051602001620010d2929190620043d3565b60405160208183030381529060405280519060200120905060005b8881101562000a5d57600085600701600084815260200190815260200160002060008d6001600160a01b03166001600160a01b0316815260200190815260200160002060008c81526020019081526020016000206040518060a001604052908160008201548152602001600182015481526020016002820160009054906101000a90046001600160a01b03166001600160a01b03166001600160a01b031681526020016003820154815260200160048201548152505090506000816080015111620011fb5760405162461bcd60e51b815260206004820152601d60248201527f436f6e74656e7420466163746f72793a20696e76616c696420736c6f7400000060448201526064016200094a565b6001891515148015620012115750428160800151105b15620012325780519a5060018b016200122b575062000a5d565b50620012f6565b80604001516001600160a01b0316636c0360eb6040518163ffffffff1660e01b8152600401600060405180830381865afa15801562001275573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f191682016040526200129f9190810190620043e3565b858381518110620012b457620012b462004463565b602002602001018190525080848381518110620012d557620012d562004463565b602090810291909101015280519a5060018b01620012f4575062000a5d565b505b600101620010ed565b600080546040516001600160a01b0390911690630f76f81b60e31b906200132f908690869030906024016200456b565b60408051601f198184030181529181526020820180516001600160e01b03166001600160e01b03199094169390931790925290516200136e9062003b9e565b6200137b929190620045a3565b604051809103906000f08015801562001398573d6000803e3d6000fd5b506001600160a01b0381166000908152600080516020620053b783398151915260205260409020805460ff19166001179055905080806001600160a01b0316846001600160a01b03167fa65e7f7b3e14f1740f5b4a7fb9587515756d58c6e406cea3b515a211448556f860405160405180910390a350505050565b6001600160a01b03811633146200143d5760405163334bd91960e11b815260040160405180910390fd5b62000d2b8282620034b7565b6001600160a01b038116600090815260008051602062005397833981519152602052604081205460ff16620006d2565b336000908152600080516020620053b783398151915260205260409020548390600080516020620053d78339815191529060ff161515600114620014d15760405162461bcd60e51b81526004016200094a9062004479565b6001600160a01b0382166000908152600582016020908152604080832033845290915290205460ff16156200151a5760405162461bcd60e51b81526004016200094a90620044d6565b604051600080516020620053d78339815191529060009062001543908a908a90602001620043d3565b60408051601f1981840301815291815281516020928301206001600160a01b038a1660009081526003860190935291205490915060ff16620015995760405162461bcd60e51b81526004016200094a906200451e565b60008611620016045760405162461bcd60e51b815260206004820152603060248201527f436f6e74656e7420466163746f72793a205f6e6577536c6f74206d757374206260448201526f0652067726561746572207468616e20360841b60648201526084016200094a565b8486116200167b5760405162461bcd60e51b815260206004820152603c60248201527f436f6e74656e7420466163746f72793a205f6e6577536c6f74206d757374206260448201527f652067726561746572207468616e205f6578697374696e67536c6f740000000060648201526084016200094a565b600081815260088301602090815260408083206001600160a01b038b1684528252808320338452909152902054156200171d5760405162461bcd60e51b815260206004820152603b60248201527f436f6e74656e7420466163746f72793a20436f6e74656e74204f626a6563742060448201527f68617320616c7265616479207374616b6564207468697320746167000000000060648201526084016200094a565b600081815260078301602090815260408083206001600160a01b03808c168552908352818420898552835292819020815160a0810183528154808252600183015494820194909452600282015490941691840191909152600381015460608401526004015460808301528710620018085760405162461bcd60e51b815260206004820152604260248201527f436f6e74656e7420466163746f72793a205f6e6577536c6f742069732067726560448201527f61746572207468616e206578697374696e674c697374696e672e70726576696f606482015261757360f01b608482015260a4016200094a565b600062001815886200354e565b600084815260078601602090815260408083206001600160a01b038e16845282528083208651845282529182902060019081018c9055825160a081018452865181529182018b905233928201929092526060810183905290860154919250906080820190620018859042620045dd565b9052600084815260078601602090815260408083206001600160a01b038e81168086529184528285208e865284528285208651815586850151600180830191909155878501516002830180546001600160a01b0319169190941617909255606087015160038201556080909601516004909601959095558b84528184208d9055878452600889018352818420818552835281842033855283528184208d9055878452600689018352818420908452909152812080549091906200194a908490620045dd565b909155506200196790506001600160a01b038a16333084620035dd565b886001600160a01b0316336001600160a01b031660006001600160a01b03167ff93869cb3b0589c7164a965b5cca41692d3e745dbb1292578cb1cca6eeba8b998e8e8d604051620019bb93929190620045f3565b60405180910390a45050505050505050505050565b6040516000907f29912872bb1868dd74efe86230a05098a24ae1f39d64ec2129d982442801ac00908190839062001a0e9087908790602001620043d3565b60408051808303601f190181529181528151602092830120835290820192909252016000205460ff16949350505050565b600062001a4c816200327a565b62000d2b83838080601f0160208091040260200160405190810160405280939291908181526020018383808284376000920191909152506200364692505050565b7ff0c57e16840df040f15088dc2f81fe391c3923bec73e23a9662efc9c229c6a00805468010000000000000000810460ff16159067ffffffffffffffff1660008115801562001ad95750825b905060008267ffffffffffffffff16600114801562001af75750303b155b90508115801562001b06575080155b1562001b255760405163f92ee8a960e01b815260040160405180910390fd5b845467ffffffffffffffff19166001178555831562001b5a57845468ff00000000000000001916680100000000000000001785555b62001b64620036ef565b62001b7586621275006014620036fb565b62001b82600033620033f5565b506000873360405162001b959062003bac565b6001600160a01b03928316815291166020820152604001604051809103906000f08015801562001bc9573d6000803e3d6000fd5b50600080546001600160a01b0319166001600160a01b039290921691909117905550831562001c3757845468ff000000000000000019168555604051600181527fc7f505b2f371ae2175ee4913f4499e1f2633a7b5936321eed1cdaeb6115181d29060200160405180910390a15b50505050505050565b60606001805480602002602001604051908101604052809291908181526020016000905b8282101562001d1a57838290600052602060002001805462001c86906200462c565b80601f016020809104026020016040519081016040528092919081815260200182805462001cb4906200462c565b801562001d055780601f1062001cd95761010080835404028352916020019162001d05565b820191906000526020600020905b81548152906001019060200180831162001ce757829003601f168201915b50505050508152602001906001019062001c64565b50505050905090565b336000908152600080516020620053b783398151915260205260409020548390600080516020620053d78339815191529060ff16151560011462001d7b5760405162461bcd60e51b81526004016200094a9062004479565b6001600160a01b0382166000908152600582016020908152604080832033845290915290205460ff161562001dc45760405162461bcd60e51b81526004016200094a90620044d6565b604051600080516020620053d78339815191529060009062001ded908a908a90602001620043d3565b60408051601f1981840301815291815281516020928301206001600160a01b038a1660009081526003860190935291205490915060ff1662001e435760405162461bcd60e51b81526004016200094a906200451e565b6000851162001eae5760405162461bcd60e51b815260206004820152603060248201527f436f6e74656e7420466163746f72793a205f6e6577536c6f74206d757374206260448201526f0652067726561746572207468616e20360841b60648201526084016200094a565b84861162001f255760405162461bcd60e51b815260206004820152603c60248201527f436f6e74656e7420466163746f72793a205f6578697374696e67536c6f74206d60448201527f7573742062652067726561746572207468616e205f6e6577536c6f740000000060648201526084016200094a565b600081815260088301602090815260408083206001600160a01b038b16845282528083203384529091529020541562001fc75760405162461bcd60e51b815260206004820152603b60248201527f436f6e74656e7420466163746f72793a20436f6e74656e74204f626a6563742060448201527f68617320616c7265616479207374616b6564207468697320746167000000000060648201526084016200094a565b600081815260078301602090815260408083206001600160a01b03808c1685529083528184208a8552835292819020815160a081018352815481526001820154938101849052600282015490941691840191909152600381015460608401526004015460808301528611620020a55760405162461bcd60e51b815260206004820152603b60248201527f436f6e74656e7420466163746f72793a205f6e6577536c6f74206973206c657360448201527f73207468616e206578697374696e674c697374696e672e6e657874000000000060648201526084016200094a565b6000620020b2876200354e565b600084815260078601602090815260408083206001600160a01b038e16845282528083208c845282529182902060019081018b9055825160a0810184528c8152868301519281019290925233928201929092526060810183905290860154919250906080820190620021259042620045dd565b9052600084815260078601602090815260408083206001600160a01b038e81168086528285528386208e87528086528487208851815588870151600180830191909155898701516002830180546001600160a01b0319169190961617909455606089015160038201556080909801516004909801979097558086529184528784015185529483528184208c9055878452600889018352818420818552835281842033855283528184208c905587845260068901835281842090845290915281208054909190620021f7908490620045dd565b909155506200221490506001600160a01b038a16333084620035dd565b886001600160a01b0316336001600160a01b031660006001600160a01b03167ff93869cb3b0589c7164a965b5cca41692d3e745dbb1292578cb1cca6eeba8b998e8e8c604051620019bb93929190620045f3565b600062002275816200327a565b6200229e827f584565e90fa9ec9ac82afca62b5a80e321f6d503f72d0884875cf353a2703f0155565b5050565b60018181548110620022b357600080fd5b906000526020600020016000915090508054620022d0906200462c565b80601f0160208091040260200160405190810160405280929190818152602001828054620022fe906200462c565b80156200234f5780601f1062002323576101008083540402835291602001916200234f565b820191906000526020600020905b8154815290600101906020018083116200233157829003601f168201915b505050505081565b6040516bffffffffffffffffffffffff19606084901b166020820152620023bd906034015b60408051601f1981840301815291815281516020928301206000908152600080516020620053f7833981519152835281812033825290925290205460ff1690565b6200241d5760405162461bcd60e51b815260206004820152602960248201527f436f6e74656e7420466163746f72793a2043616c6c6572206e6f74206120746f60448201526835b2b71030b236b4b760b91b60648201526084016200094a565b6001600160a01b0380831660009081527f584565e90fa9ec9ac82afca62b5a80e321f6d503f72d0884875cf353a2703f0560209081526040808320938516835292905220805460ff191690555050565b60006200247a816200327a565b6200229e827f584565e90fa9ec9ac82afca62b5a80e321f6d503f72d0884875cf353a2703f0255565b336000908152600080516020620053b783398151915260205260409020548290600080516020620053d78339815191529060ff161515600114620024fb5760405162461bcd60e51b81526004016200094a9062004479565b6001600160a01b0382166000908152600582016020908152604080832033845290915290205460ff1615620025445760405162461bcd60e51b81526004016200094a90620044d6565b6001600160a01b0384166000908152600080516020620053978339815191526020526040902054600080516020620053d78339815191529060ff166200259e5760405162461bcd60e51b81526004016200094a906200451e565b60008787604051602001620025b5929190620043d3565b60408051601f19818403018152918152815160209283012060008181526006860184528281206001600160a01b038b16825290935291205490915015620026655760405162461bcd60e51b815260206004820152603060248201527f436f6e74656e7420466163746f72793a20546869732074616720697320616c7260448201527f6561647920696e697469616c697a65640000000000000000000000000000000060648201526084016200094a565b600062002672866200354e565b600083815260078501602090815260408083206001600160a01b038c168452825280832060001980855290835281842060019081018c9055825160a08101845291825292810193909352339083015260608201839052850154919250906080820190620026e09042620045dd565b9052600083815260078501602090815260408083206001600160a01b038c81168086529184528285208c865284528285208651815586850151600180830191909155878501516002830180546001600160a01b0319169190941617909255606087015160038201556080909601516004909601959095558380528184208b9055868452600888018352818420818552835281842033855283528184208b905586845260068801835281842090845290915281208054909190620027a5908490620045dd565b90915550620027c290506001600160a01b038816333084620035dd565b866001600160a01b0316336001600160a01b031660006001600160a01b03167ff93869cb3b0589c7164a965b5cca41692d3e745dbb1292578cb1cca6eeba8b998c8c8b6040516200281693929190620045f3565b60405180910390a4505050505050505050565b6040516bffffffffffffffffffffffff19606084901b16602082015262002853906034016200237c565b620028b35760405162461bcd60e51b815260206004820152602960248201527f436f6e74656e7420466163746f72793a2043616c6c6572206e6f74206120746f60448201526835b2b71030b236b4b760b91b60648201526084016200094a565b6001600160a01b0380831660009081527f584565e90fa9ec9ac82afca62b5a80e321f6d503f72d0884875cf353a2703f0560209081526040808320938516835292905220805460ff191660011790555050565b6040516bffffffffffffffffffffffff19606084901b16602082015262002930906034016200237c565b620029905760405162461bcd60e51b815260206004820152602960248201527f436f6e74656e7420466163746f72793a2043616c6c6572206e6f74206120746f60448201526835b2b71030b236b4b760b91b60648201526084016200094a565b62000d2b83838362003712565b6000828152600080516020620053f78339815191526020526040902060010154620029c8816200327a565b62000fbc8383620034b7565b6000620006d2826200354e565b6000620029ee816200327a565b60015460ff8316111562002a585760405162461bcd60e51b815260206004820152602a60248201527f436f6e73656e743a205175657374696f6e6e6169726520696e646578206f7574604482015269206f6620626f756e647360b01b60648201526084016200094a565b6001805462002a6990829062004668565b8154811062002a7c5762002a7c62004463565b9060005260206000200160018360ff168154811062002a9f5762002a9f62004463565b90600052602060002001908162002ab79190620046d2565b50600180548062002acc5762002acc620047c3565b60019003818190600052602060002001600062002aea919062003bba565b90555050565b336000908152600080516020620053b783398151915260205260409020548290600080516020620053d78339815191529060ff16151560011462002b485760405162461bcd60e51b81526004016200094a9062004479565b6001600160a01b0382166000908152600582016020908152604080832033845290915290205460ff161562002b915760405162461bcd60e51b81526004016200094a90620044d6565b604051600080516020620053d78339815191529060009062002bba9089908990602001620043d3565b60408051601f1981840301815291815281516020928301206001600160a01b03891660009081526003860190935291205490915060ff1662002c105760405162461bcd60e51b81526004016200094a906200451e565b600081815260078301602090815260408083206001600160a01b03808b168086529184528285208a86528452828520835160a081018552815481526001820154818701526002820154909216828501526003810154606083015260040154608082015285855260088701845282852091855290835281842033855290925290912054158062002cab575060408101516001600160a01b031633145b62002d1f5760405162461bcd60e51b815260206004820152603b60248201527f436f6e74656e7420466163746f72793a20436f6e74656e74204f626a6563742060448201527f68617320616c7265616479207374616b6564207468697320746167000000000060648201526084016200094a565b600081608001511162002d8b5760405162461bcd60e51b815260206004820152602d60248201527f436f6e74656e7420466163746f72793a2043616e6e6f74207265706c6163652060448201526c185b88195b5c1d1e481cdb1bdd609a1b60648201526084016200094a565b8060800151421162002e065760405162461bcd60e51b815260206004820152603060248201527f436f6e74656e7420466163746f72793a2063757272656e74206c697374696e6760448201527f206973207374696c6c206163746976650000000000000000000000000000000060648201526084016200094a565b6040518060a001604052808260000151815260200182602001518152602001336001600160a01b031681526020018260600151815260200184600101544262002e509190620045dd565b9052600083815260078501602090815260408083206001600160a01b038c811685529083528184208b855283529281902084518155918401516001830155838101516002830180546001600160a01b031916918516919091179055606084015160038301556080909301516004909101559082015116331462000f7a57600082815260088401602090815260408083206001600160a01b03808c16808652828552838620338088528187528588208e9055828852938652878501805190931687529094529184209390935551606084015162002f2e939190620035dd565b866001600160a01b0316336001600160a01b031682604001516001600160a01b03167ff93869cb3b0589c7164a965b5cca41692d3e745dbb1292578cb1cca6eeba8b998c8c8b6040516200281693929190620045f3565b600080600080516020620053d783398151915290506000858560405160200162002fb1929190620043d3565b60408051601f1981840301815291815281516020928301206000908152600690940182528084206001600160a01b0387168552909152909120549150505b9392505050565b600062003003816200327a565b6001546080116200307d5760405162461bcd60e51b815260206004820152603960248201527f436f6e73656e7420466163746f72793a204d6178696d756d206e756d6265722060448201527f6f66207175657374696f6e6e616972657320726561636865640000000000000060648201526084016200094a565b6001805480820182556000919091527fb10e2d527612073b26eecdfd717e6a320cf44b4afac2b0732d9fcbe2b7fa0cf60162000d2b8382620047d9565b6020858101805160008581527f584565e90fa9ec9ac82afca62b5a80e321f6d503f72d0884875cf353a2703f07845260408082206001600160a01b038a81168085528288528385208d5186528089528486206001908101979097558986528486208681558088018790556002810180546001600160a01b0319169055600381018790556004018690558d5182875293895296518552958752828420919091558783527f584565e90fa9ec9ac82afca62b5a80e321f6d503f72d0884875cf353a2703f0886528183208584528652818320828c0151909116835285528082208290558682527f584565e90fa9ec9ac82afca62b5a80e321f6d503f72d0884875cf353a2703f068552808220938252929093529082208054600080516020620053d78339815191529390620031ef90849062004668565b90915550506040860151606087015162003214916001600160a01b0388169162003891565b846001600160a01b031660006001600160a01b031687604001516001600160a01b03167ff93869cb3b0589c7164a965b5cca41692d3e745dbb1292578cb1cca6eeba8b9987866040516200326a9291906200489f565b60405180910390a4505050505050565b62000a6f8133620038c4565b6040517f29912872bb1868dd74efe86230a05098a24ae1f39d64ec2129d982442801ac00908190600090620032c0908590602001620048c3565b60408051601f198184030181529181528151602092830120835290820192909252016000205460ff161515600114620033625760405162461bcd60e51b815260206004820152603b60248201527f455243373532393a2065544c442b312063757272656e746c79206e6f7420617360448201527f736f6369617465642077697468207468697320636f6e7472616374000000000060648201526084016200094a565b6000816000016000846040516020016200337d9190620048c3565b60405160208183030381529060405280519060200120815260200190815260200160002060006101000a81548160ff0219169083151502179055507f1a5c07d8ee1fce30d5e52fe9097bc41e0e7e43c9d74ef7bf98133120d3ea5dc282604051620033e9919062004214565b60405180910390a15050565b6000828152600080516020620053f7833981519152602081815260408084206001600160a01b038616855290915282205460ff16620034ac576000848152602082815260408083206001600160a01b03871684529091529020805460ff19166001179055620034613390565b6001600160a01b0316836001600160a01b0316857f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a46001915050620006d2565b6000915050620006d2565b6000828152600080516020620053f7833981519152602081815260408084206001600160a01b038616855290915282205460ff1615620034ac576000848152602082815260408083206001600160a01b0387168085529252808320805460ff1916905551339287917ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b9190a46001915050620006d2565b6000670de0b6b3a764000080670de111a6b7de40005b8415620035d55762003578600286620048f7565b6001036200359c57826200358d82846200490e565b62003599919062004928565b91505b84600103620035ad57509392505050565b82620035ba82806200490e565b620035c6919062004928565b9050600185901c945062003564565b509392505050565b6040516001600160a01b03848116602483015283811660448301526064820183905262000fbc9186918216906323b872dd906084015b604051602081830303815290604052915060e01b6020820180516001600160e01b03838183161783525050505062003929565b6040517f29912872bb1868dd74efe86230a05098a24ae1f39d64ec2129d982442801ac0090600190829060009062003683908690602001620048c3565b60405160208183030381529060405280519060200120815260200190815260200160002060006101000a81548160ff0219169083151502179055507f1fc1bae1e5cc41896c1cdee7a380b003c14fea22313ef3fe9d0a965625dfd37682604051620033e9919062004214565b620036f962003993565b565b6200370562003993565b62000d2b838383620039e2565b6001600160a01b0382166000908152600080516020620053978339815191526020526040902054600080516020620053d78339815191529060ff166200376c5760405162461bcd60e51b81526004016200094a906200451e565b600084604051602001620037819190620048c3565b60405160208183030381529060405280519060200120905060008351905060005b8181101562001c3757600083815260078501602090815260408083206001600160a01b038a168452909152812086518290889085908110620037e857620037e862004463565b60209081029190910181015182528181019290925260409081016000908120825160a0810184528154815260018201549481019490945260028101546001600160a01b0316928401929092526003820154606084015260049091015460808301819052919250036200385b575062003888565b6200388681888a878a878151811062003878576200387862004463565b6020026020010151620030ba565b505b600101620037a2565b6040516001600160a01b0383811660248301526044820183905262000d2b91859182169063a9059cbb9060640162003613565b6000828152600080516020620053f7833981519152602090815260408083206001600160a01b038516845290915290205460ff166200229e5760405163e2517d3f60e01b81526001600160a01b0382166004820152602481018390526044016200094a565b6000620039406001600160a01b0384168362003a87565b90508051600014158015620039685750808060200190518101906200396691906200493f565b155b1562000d2b57604051635274afe760e01b81526001600160a01b03841660048201526024016200094a565b7ff0c57e16840df040f15088dc2f81fe391c3923bec73e23a9662efc9c229c6a005468010000000000000000900460ff16620036f957604051631afcd79f60e31b815260040160405180910390fd5b620039ec62003993565b600080516020620053d783398151915280546001600160a01b0319166001600160a01b039490941693841790556000928352600080516020620053978339815191526020526040909220805460ff191660011790557f584565e90fa9ec9ac82afca62b5a80e321f6d503f72d0884875cf353a2703f01557f584565e90fa9ec9ac82afca62b5a80e321f6d503f72d0884875cf353a2703f0255565b606062002fef8383600084600080856001600160a01b0316848660405162003ab09190620048c3565b60006040518083038185875af1925050503d806000811462003aef576040519150601f19603f3d011682016040523d82523d6000602084013e62003af4565b606091505b509150915062003b0686838362003b10565b9695505050505050565b60608262003b295762003b238262003b74565b62002fef565b815115801562003b4157506001600160a01b0384163b155b1562003b6c57604051639996b31560e01b81526001600160a01b03851660048201526024016200094a565b508062002fef565b80511562003b855780518082602001fd5b604051630a12f52160e11b815260040160405180910390fd5b6105e5806200496083390190565b6104528062004f4583390190565b50805462003bc8906200462c565b6000825580601f1062003bd9575050565b601f01602090049060005260206000209081019062000a6f91905b8082111562003c0a576000815560010162003bf4565b5090565b60006020828403121562003c2157600080fd5b81356001600160e01b03198116811462002fef57600080fd5b60008083601f84011262003c4d57600080fd5b50813567ffffffffffffffff81111562003c6657600080fd5b60208301915083602082850101111562003c7f57600080fd5b9250929050565b80356001600160a01b038116811462003c9e57600080fd5b919050565b801515811462000a6f57600080fd5b60008060008060008060a0878903121562003ccc57600080fd5b863567ffffffffffffffff81111562003ce457600080fd5b62003cf289828a0162003c3a565b909750955062003d0790506020880162003c86565b93506040870135925060608701359150608087013562003d278162003ca3565b809150509295509295509295565b60005b8381101562003d5257818101518382015260200162003d38565b50506000910152565b6000815180845262003d7581602086016020860162003d35565b601f01601f19169290920160200192915050565b60008282518085526020808601955060208260051b8401016020860160005b8481101562003dda57601f1986840301895262003dc783835162003d5b565b9884019892509083019060010162003da8565b5090979650505050505050565b6000604080835262003dfd604084018662003d89565b83810360208581019190915285518083528682019282019060005b8181101562003e67578451805184528481015185850152868101516001600160a01b03168785015260608082015190850152608090810151908401529383019360a09092019160010162003e18565b509098975050505050505050565b60006020828403121562003e8857600080fd5b62002fef8262003c86565b60008060008060006060868803121562003eac57600080fd5b853567ffffffffffffffff8082111562003ec557600080fd5b62003ed389838a0162003c3a565b909750955085915062003ee96020890162003c86565b9450604088013591508082111562003f0057600080fd5b818801915088601f83011262003f1557600080fd5b81358181111562003f2557600080fd5b8960208260051b850101111562003f3b57600080fd5b9699959850939650602001949392505050565b6000806020838503121562003f6257600080fd5b823567ffffffffffffffff81111562003f7a57600080fd5b62003f888582860162003c3a565b90969095509350505050565b60006020828403121562003fa757600080fd5b5035919050565b6000806000806060858703121562003fc557600080fd5b843567ffffffffffffffff81111562003fdd57600080fd5b62003feb8782880162003c3a565b90955093506200400090506020860162003c86565b9396929550929360400135925050565b600080604083850312156200402457600080fd5b82359150620040366020840162003c86565b90509250929050565b634e487b7160e01b600052604160045260246000fd5b604051601f8201601f1916810167ffffffffffffffff811182821017156200408157620040816200403f565b604052919050565b600067ffffffffffffffff821115620040a657620040a66200403f565b50601f01601f191660200190565b600082601f830112620040c657600080fd5b8135620040dd620040d78262004089565b62004055565b818152846020838601011115620040f357600080fd5b816020850160208301376000918101602001919091529392505050565b600080604083850312156200412457600080fd5b6200412f8362003c86565b9150602083013567ffffffffffffffff8111156200414c57600080fd5b6200415a85828601620040b4565b9150509250929050565b6000806000806000608086880312156200417d57600080fd5b853567ffffffffffffffff8111156200419557600080fd5b620041a38882890162003c3a565b9096509450620041b890506020870162003c86565b94979396509394604081013594506060013592915050565b60008060408385031215620041e457600080fd5b620041ef8362003c86565b9150620040366020840162003c86565b60208152600062002fef602083018462003d89565b60208152600062002fef602083018462003d5b565b6000806000606084860312156200423f57600080fd5b833567ffffffffffffffff808211156200425857600080fd5b6200426687838801620040b4565b9450602091506200427982870162003c86565b93506040860135818111156200428e57600080fd5b8601601f81018813620042a057600080fd5b803582811115620042b557620042b56200403f565b8060051b9250620042c884840162004055565b818152928201840192848101908a851115620042e357600080fd5b928501925b848410156200430357833582529285019290850190620042e8565b8096505050505050509250925092565b6000602082840312156200432657600080fd5b813560ff8116811462002fef57600080fd5b6000806000604084860312156200434e57600080fd5b833567ffffffffffffffff8111156200436657600080fd5b620043748682870162003c3a565b90945092506200438990506020850162003c86565b90509250925092565b600060208284031215620043a557600080fd5b813567ffffffffffffffff811115620043bd57600080fd5b620043cb84828501620040b4565b949350505050565b8183823760009101908152919050565b600060208284031215620043f657600080fd5b815167ffffffffffffffff8111156200440e57600080fd5b8201601f810184136200442057600080fd5b805162004431620040d78262004089565b8181528560208385010111156200444757600080fd5b6200445a82602083016020860162003d35565b95945050505050565b634e487b7160e01b600052603260045260246000fd5b6020808252602f908201527f436f6e74656e7420466163746f72793a2043616c6c6572206973206e6f74206160408201527f20636f6e74656e74206f626a6563740000000000000000000000000000000000606082015260800190565b60208082526028908201527f436f6e74656e7420466163746f72793a2043616c6c657220686173206265656e60408201526708189b1bd8dad95960c21b606082015260800190565b6020808252602d908201527f436f6e74656e7420466163746f72793a205374616b696e6720746f6b656e206e60408201526c1bdd081c9959da5cdd195c9959609a1b606082015260800190565b60006001600160a01b0380861683526060602084015262004590606084018662003d5b565b9150808416604084015250949350505050565b6001600160a01b0383168152604060208201526000620043cb604083018462003d5b565b634e487b7160e01b600052601160045260246000fd5b80820180821115620006d257620006d2620045c7565b604081528260408201528284606083013760006060848301015260006060601f19601f8601168301019050826020830152949350505050565b600181811c908216806200464157607f821691505b6020821081036200466257634e487b7160e01b600052602260045260246000fd5b50919050565b81810381811115620006d257620006d2620045c7565b601f82111562000d2b576000816000526020600020601f850160051c81016020861015620046a95750805b601f850160051c820191505b81811015620046ca57828155600101620046b5565b505050505050565b818103620046de575050565b620046ea82546200462c565b67ffffffffffffffff8111156200470557620047056200403f565b6200471d816200471684546200462c565b846200467e565b6000601f8211600181146200475457600083156200473b5750848201545b600019600385901b1c1916600184901b178455620047bc565b600085815260209020601f19841690600086815260209020845b838110156200479057828601548255600195860195909101906020016200476e565b5085831015620047af5781850154600019600388901b60f8161c191681555b50505060018360011b0184555b5050505050565b634e487b7160e01b600052603160045260246000fd5b815167ffffffffffffffff811115620047f657620047f66200403f565b62004807816200471684546200462c565b602080601f8311600181146200483f5760008415620048265750858301515b600019600386901b1c1916600185901b178555620046ca565b600085815260208120601f198616915b8281101562004870578886015182559484019460019091019084016200484f565b50858210156200488f5787850151600019600388901b60f8161c191681555b5050505050600190811b01905550565b604081526000620048b4604083018562003d5b565b90508260208301529392505050565b60008251620048d781846020870162003d35565b9190910192915050565b634e487b7160e01b600052601260045260246000fd5b600082620049095762004909620048e1565b500690565b8082028115828204841417620006d257620006d2620045c7565b6000826200493a576200493a620048e1565b500490565b6000602082840312156200495257600080fd5b815162002fef8162003ca356fe60a06040526040516105e53803806105e583398101604081905261002291610387565b61002c828261003e565b506001600160a01b031660805261047e565b610047826100fe565b6040516001600160a01b038316907f1cf3b03a6cf19fa2baba4df148e9dcabedea7f8a5c07840e207e5c089be95d3e90600090a28051156100f2576100ed826001600160a01b0316635c60da1b6040518163ffffffff1660e01b8152600401602060405180830381865afa1580156100c3573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906100e79190610447565b82610211565b505050565b6100fa610288565b5050565b806001600160a01b03163b60000361013957604051631933b43b60e21b81526001600160a01b03821660048201526024015b60405180910390fd5b807fa3f0ad74e5423aebfd80d3ef4346578335a9a72aeaee59ff6cb3582b35133d5080546001600160a01b0319166001600160a01b0392831617905560408051635c60da1b60e01b81529051600092841691635c60da1b9160048083019260209291908290030181865afa1580156101b5573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906101d99190610447565b9050806001600160a01b03163b6000036100fa57604051634c9c8ce360e01b81526001600160a01b0382166004820152602401610130565b6060600080846001600160a01b03168460405161022e9190610462565b600060405180830381855af49150503d8060008114610269576040519150601f19603f3d011682016040523d82523d6000602084013e61026e565b606091505b50909250905061027f8583836102a9565b95945050505050565b34156102a75760405163b398979f60e01b815260040160405180910390fd5b565b6060826102be576102b982610308565b610301565b81511580156102d557506001600160a01b0384163b155b156102fe57604051639996b31560e01b81526001600160a01b0385166004820152602401610130565b50805b9392505050565b8051156103185780518082602001fd5b604051630a12f52160e11b815260040160405180910390fd5b80516001600160a01b038116811461034857600080fd5b919050565b634e487b7160e01b600052604160045260246000fd5b60005b8381101561037e578181015183820152602001610366565b50506000910152565b6000806040838503121561039a57600080fd5b6103a383610331565b60208401519092506001600160401b03808211156103c057600080fd5b818501915085601f8301126103d457600080fd5b8151818111156103e6576103e661034d565b604051601f8201601f19908116603f0116810190838211818310171561040e5761040e61034d565b8160405282815288602084870101111561042757600080fd5b610438836020830160208801610363565b80955050505050509250929050565b60006020828403121561045957600080fd5b61030182610331565b60008251610474818460208701610363565b9190910192915050565b60805161014d61049860003960006024015261014d6000f3fe608060405261000c61000e565b005b61001e610019610020565b6100b6565b565b60007f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff16635c60da1b6040518163ffffffff1660e01b8152600401602060405180830381865afa15801561008d573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906100b191906100da565b905090565b3660008037600080366000845af43d6000803e8080156100d5573d6000f35b3d6000fd5b6000602082840312156100ec57600080fd5b815173ffffffffffffffffffffffffffffffffffffffff8116811461011057600080fd5b939250505056fea2646970667358221220df8f0215aba840b20c044b86b48ebcc41b929e9e2dbacf6884d35d1802d59af064736f6c63430008180033608060405234801561001057600080fd5b5060405161045238038061045283398101604081905261002f91610165565b806001600160a01b03811661005f57604051631e4fbdf760e01b8152600060048201526024015b60405180910390fd5b61006881610079565b50610072826100c9565b5050610198565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b806001600160a01b03163b6000036100ff5760405163211eb15960e21b81526001600160a01b0382166004820152602401610056565b600180546001600160a01b0319166001600160a01b0383169081179091556040517fbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b90600090a250565b80516001600160a01b038116811461016057600080fd5b919050565b6000806040838503121561017857600080fd5b61018183610149565b915061018f60208401610149565b90509250929050565b6102ab806101a76000396000f3fe608060405234801561001057600080fd5b50600436106100575760003560e01c80633659cfe61461005c5780635c60da1b14610071578063715018a61461009a5780638da5cb5b146100a2578063f2fde38b146100b3575b600080fd5b61006f61006a366004610245565b6100c6565b005b6001546001600160a01b03165b6040516001600160a01b03909116815260200160405180910390f35b61006f6100da565b6000546001600160a01b031661007e565b61006f6100c1366004610245565b6100ee565b6100ce61012e565b6100d78161015b565b50565b6100e261012e565b6100ec60006101e8565b565b6100f661012e565b6001600160a01b03811661012557604051631e4fbdf760e01b8152600060048201526024015b60405180910390fd5b6100d7816101e8565b6000546001600160a01b031633146100ec5760405163118cdaa760e01b815233600482015260240161011c565b806001600160a01b03163b6000036101915760405163211eb15960e21b81526001600160a01b038216600482015260240161011c565b6001805473ffffffffffffffffffffffffffffffffffffffff19166001600160a01b0383169081179091556040517fbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b90600090a250565b600080546001600160a01b0383811673ffffffffffffffffffffffffffffffffffffffff19831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b60006020828403121561025757600080fd5b81356001600160a01b038116811461026e57600080fd5b939250505056fea2646970667358221220c3c8577b42a50e08e8e61a579b7a615c4b9e7fdf171625b4fc020b621f62415e64736f6c63430008180033584565e90fa9ec9ac82afca62b5a80e321f6d503f72d0884875cf353a2703f03584565e90fa9ec9ac82afca62b5a80e321f6d503f72d0884875cf353a2703f04584565e90fa9ec9ac82afca62b5a80e321f6d503f72d0884875cf353a2703f0002dd7bc7dec4dceedda775e58dd541e08a116c6c53815c0bd028192f7b626800a2646970667358221220b2264d13f647a795cf985e92f9e0495c9bb471eb341ea7bc733d235a6e3504cf64736f6c63430008180033",
  deployedBytecode:
    "0x60806040523480156200001157600080fd5b5060043610620002555760003560e01c806350ea66d41162000149578063aa6311e711620000c7578063e1bf9c081162000086578063e1bf9c08146200062d578063ebf120d31462000644578063eee9665e146200065b578063efcd84c31462000672578063f75a39a2146200068957600080fd5b8063aa6311e714620005ba578063b3fae4a514620005d1578063c05109e014620005e8578063c0817bbd14620005ff578063d547741f146200061657600080fd5b8063841a5c481162000114578063841a5c4814620005135780638daad508146200052a57806391d1485414620005505780639f160158146200059a578063a217fddf14620005b157600080fd5b806350ea66d414620004a75780636df515b814620004cf5780637d7b0e9a14620004e85780637e2ec6d014620004ff57600080fd5b806331c1c65011620001d7578063376cc74d11620001a2578063376cc74d14620004175780633f8a037d146200042e57806343166d78146200046257806344e2e74c1462000479578063485cc955146200049057600080fd5b806331c1c65014620003bb57806333bfb30914620003d257806336568abe14620003e957806336a8e097146200040057600080fd5b806322778929116200022457806322778929146200030b578063248a9ca314620003225780632850df1a14620003655780632b0559e6146200038d5780632f2ff15d14620003a457600080fd5b806301ffc9a7146200025a57806308f5929414620002865780630b340a1914620002ad5780631760a7ee14620002f4575b600080fd5b620002716200026b36600462003c0e565b620006a0565b60405190151581526020015b60405180910390f35b6200029d6200029736600462003cb2565b620006d8565b6040516200027d92919062003de7565b620002f2620002be36600462003e75565b6001600160a01b03811660009081526000805160206200539783398151915260205260409020805460ff1916600117905550565b005b620002f26200030536600462003e93565b62000a72565b620002f26200031c36600462003f4e565b62000cdd565b620003566200033336600462003f94565b6000908152600080516020620053f7833981519152602052604090206001015490565b6040519081526020016200027d565b7f584565e90fa9ec9ac82afca62b5a80e321f6d503f72d0884875cf353a2703f015462000356565b620002f26200039e36600462003fae565b62000d30565b620002f2620003b536600462004010565b62000f85565b6200029d620003cc36600462003cb2565b62000fc2565b620002f2620003e336600462004110565b620012ff565b620002f2620003fa36600462004010565b62001413565b620002716200041136600462003e75565b62001449565b620002f26200042836600462004164565b62001479565b600080516020620053d7833981519152546001600160a01b03165b6040516001600160a01b0390911681526020016200027d565b620002716200047336600462003f4e565b620019d0565b620002f26200048a36600462003f4e565b62001a3f565b620002f2620004a1366004620041d0565b62001a8d565b7f584565e90fa9ec9ac82afca62b5a80e321f6d503f72d0884875cf353a2703f025462000356565b620004d962001c40565b6040516200027d9190620041ff565b620002f2620004f936600462004164565b62001d23565b60005462000449906001600160a01b031681565b620002f26200052436600462003f94565b62002268565b620005416200053b36600462003f94565b620022a2565b6040516200027d919062004214565b620002716200056136600462004010565b6000918252600080516020620053f7833981519152602090815260408084206001600160a01b0393909316845291905290205460ff1690565b620002f2620005ab366004620041d0565b62002357565b62000356600081565b620002f2620005cb36600462003f94565b6200246d565b620002f2620005e236600462003fae565b620024a3565b620002f2620005f9366004620041d0565b62002829565b620002f26200061036600462004229565b62002906565b620002f26200062736600462004010565b6200299d565b620003566200063e36600462003f94565b620029d4565b620002f26200065536600462004313565b620029e1565b620002f26200066c36600462003fae565b62002af0565b620003566200068336600462004338565b62002f85565b620002f26200069a36600462004392565b62002ff6565b60006001600160e01b03198216637965db0b60e01b1480620006d257506301ffc9a760e01b6001600160e01b03198316145b92915050565b606080600080516020620053d783398151915260008567ffffffffffffffff8111156200070957620007096200403f565b6040519080825280602002602001820160405280156200073e57816020015b6060815260200190600190039081620007285790505b50905060008667ffffffffffffffff8111156200075f576200075f6200403f565b604051908082528060200260200182016040528015620007ce57816020015b620007ba6040518060a00160405280600081526020016000815260200160006001600160a01b0316815260200160008152602001600081525090565b8152602001906001900390816200077e5790505b50905060008b8b604051602001620007e8929190620043d3565b60405160208183030381529060405280519060200120905060001989036200083e57600081815260078501602090815260408083206001600160a01b038e16845282528083209b83529a90529890982060010154975b60005b8881101562000a5d57600085600701600084815260200190815260200160002060008d6001600160a01b03166001600160a01b0316815260200190815260200160002060008c81526020019081526020016000206040518060a001604052908160008201548152602001600182015481526020016002820160009054906101000a90046001600160a01b03166001600160a01b03166001600160a01b031681526020016003820154815260200160048201548152505090506000816080015111620009535760405162461bcd60e51b815260206004820152601d60248201527f436f6e74656e7420466163746f72793a20696e76616c696420736c6f7400000060448201526064015b60405180910390fd5b6001891515148015620009695750428160800151105b156200098d5780602001519a508a60000362000986575062000a5d565b5062000a54565b80604001516001600160a01b0316636c0360eb6040518163ffffffff1660e01b8152600401600060405180830381865afa158015620009d0573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f19168201604052620009fa9190810190620043e3565b85838151811062000a0f5762000a0f62004463565b60200260200101819052508084838151811062000a305762000a3062004463565b602002602001018190525080602001519a508a60000362000a52575062000a5d565b505b60010162000841565b50919b909a5098505050505050505050565b50565b336000908152600080516020620053b783398151915260205260409020548390600080516020620053d78339815191529060ff16151560011462000aca5760405162461bcd60e51b81526004016200094a9062004479565b6001600160a01b0382166000908152600582016020908152604080832033845290915290205460ff161562000b135760405162461bcd60e51b81526004016200094a90620044d6565b6001600160a01b0385166000908152600080516020620053978339815191526020526040902054600080516020620053d78339815191529060ff1662000b6d5760405162461bcd60e51b81526004016200094a906200451e565b6000888860405160200162000b84929190620043d3565b60408051601f19818403018152919052805160209091012090508460005b8181101562000cd057600083815260078501602090815260408083206001600160a01b038d1684529091528120818a8a8581811062000be55762000be562004463565b60209081029290920135835250818101929092526040908101600020815160a0810183528154815260018201549381019390935260028101546001600160a01b031691830191909152600381015460608301526004015460808201819052909150158062000c565750428160800151115b1562000c63575062000cc7565b62000cc5818b8e8e8080601f0160208091040260200160405190810160405280939291908181526020018383808284376000920191909152508a92508f91508e90508881811062000cb85762000cb862004463565b90506020020135620030ba565b505b60010162000ba2565b5050505050505050505050565b600062000cea816200327a565b62000d2b83838080601f0160208091040260200160405190810160405280939291908181526020018383808284376000920191909152506200328692505050565b505050565b336000908152600080516020620053b783398151915260205260409020548290600080516020620053d78339815191529060ff16151560011462000d885760405162461bcd60e51b81526004016200094a9062004479565b6001600160a01b0382166000908152600582016020908152604080832033845290915290205460ff161562000dd15760405162461bcd60e51b81526004016200094a90620044d6565b6001600160a01b0384166000908152600080516020620053978339815191526020526040902054600080516020620053d78339815191529060ff1662000e2b5760405162461bcd60e51b81526004016200094a906200451e565b6000878760405160200162000e42929190620043d3565b60408051601f19818403018152828252805160209182012060008181526007870183528381206001600160a01b03808d1683529084528482208b835284529084902060a086018552805486526001810154938601939093526002830154169284018390526003820154606085015260049091015460808401529250331462000f335760405162461bcd60e51b815260206004820152602e60248201527f436f6e74656e7420466163746f72793a206f6e6c79206c697374696e67206f7760448201527f6e65722063616e2072656d6f766500000000000000000000000000000000000060648201526084016200094a565b62000f7a81888b8b8080601f0160208091040260200160405190810160405280939291908181526020018383808284376000920191909152508892508c9150620030ba9050565b505050505050505050565b6000828152600080516020620053f7833981519152602052604090206001015462000fb0816200327a565b62000fbc8383620033f5565b50505050565b606080600080516020620053d783398151915260008567ffffffffffffffff81111562000ff35762000ff36200403f565b6040519080825280602002602001820160405280156200102857816020015b6060815260200190600190039081620010125790505b50905060008667ffffffffffffffff8111156200104957620010496200403f565b604051908082528060200260200182016040528015620010b857816020015b620010a46040518060a00160405280600081526020016000815260200160006001600160a01b0316815260200160008152602001600081525090565b815260200190600190039081620010685790505b50905060008b8b604051602001620010d2929190620043d3565b60405160208183030381529060405280519060200120905060005b8881101562000a5d57600085600701600084815260200190815260200160002060008d6001600160a01b03166001600160a01b0316815260200190815260200160002060008c81526020019081526020016000206040518060a001604052908160008201548152602001600182015481526020016002820160009054906101000a90046001600160a01b03166001600160a01b03166001600160a01b031681526020016003820154815260200160048201548152505090506000816080015111620011fb5760405162461bcd60e51b815260206004820152601d60248201527f436f6e74656e7420466163746f72793a20696e76616c696420736c6f7400000060448201526064016200094a565b6001891515148015620012115750428160800151105b15620012325780519a5060018b016200122b575062000a5d565b50620012f6565b80604001516001600160a01b0316636c0360eb6040518163ffffffff1660e01b8152600401600060405180830381865afa15801562001275573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f191682016040526200129f9190810190620043e3565b858381518110620012b457620012b462004463565b602002602001018190525080848381518110620012d557620012d562004463565b602090810291909101015280519a5060018b01620012f4575062000a5d565b505b600101620010ed565b600080546040516001600160a01b0390911690630f76f81b60e31b906200132f908690869030906024016200456b565b60408051601f198184030181529181526020820180516001600160e01b03166001600160e01b03199094169390931790925290516200136e9062003b9e565b6200137b929190620045a3565b604051809103906000f08015801562001398573d6000803e3d6000fd5b506001600160a01b0381166000908152600080516020620053b783398151915260205260409020805460ff19166001179055905080806001600160a01b0316846001600160a01b03167fa65e7f7b3e14f1740f5b4a7fb9587515756d58c6e406cea3b515a211448556f860405160405180910390a350505050565b6001600160a01b03811633146200143d5760405163334bd91960e11b815260040160405180910390fd5b62000d2b8282620034b7565b6001600160a01b038116600090815260008051602062005397833981519152602052604081205460ff16620006d2565b336000908152600080516020620053b783398151915260205260409020548390600080516020620053d78339815191529060ff161515600114620014d15760405162461bcd60e51b81526004016200094a9062004479565b6001600160a01b0382166000908152600582016020908152604080832033845290915290205460ff16156200151a5760405162461bcd60e51b81526004016200094a90620044d6565b604051600080516020620053d78339815191529060009062001543908a908a90602001620043d3565b60408051601f1981840301815291815281516020928301206001600160a01b038a1660009081526003860190935291205490915060ff16620015995760405162461bcd60e51b81526004016200094a906200451e565b60008611620016045760405162461bcd60e51b815260206004820152603060248201527f436f6e74656e7420466163746f72793a205f6e6577536c6f74206d757374206260448201526f0652067726561746572207468616e20360841b60648201526084016200094a565b8486116200167b5760405162461bcd60e51b815260206004820152603c60248201527f436f6e74656e7420466163746f72793a205f6e6577536c6f74206d757374206260448201527f652067726561746572207468616e205f6578697374696e67536c6f740000000060648201526084016200094a565b600081815260088301602090815260408083206001600160a01b038b1684528252808320338452909152902054156200171d5760405162461bcd60e51b815260206004820152603b60248201527f436f6e74656e7420466163746f72793a20436f6e74656e74204f626a6563742060448201527f68617320616c7265616479207374616b6564207468697320746167000000000060648201526084016200094a565b600081815260078301602090815260408083206001600160a01b03808c168552908352818420898552835292819020815160a0810183528154808252600183015494820194909452600282015490941691840191909152600381015460608401526004015460808301528710620018085760405162461bcd60e51b815260206004820152604260248201527f436f6e74656e7420466163746f72793a205f6e6577536c6f742069732067726560448201527f61746572207468616e206578697374696e674c697374696e672e70726576696f606482015261757360f01b608482015260a4016200094a565b600062001815886200354e565b600084815260078601602090815260408083206001600160a01b038e16845282528083208651845282529182902060019081018c9055825160a081018452865181529182018b905233928201929092526060810183905290860154919250906080820190620018859042620045dd565b9052600084815260078601602090815260408083206001600160a01b038e81168086529184528285208e865284528285208651815586850151600180830191909155878501516002830180546001600160a01b0319169190941617909255606087015160038201556080909601516004909601959095558b84528184208d9055878452600889018352818420818552835281842033855283528184208d9055878452600689018352818420908452909152812080549091906200194a908490620045dd565b909155506200196790506001600160a01b038a16333084620035dd565b886001600160a01b0316336001600160a01b031660006001600160a01b03167ff93869cb3b0589c7164a965b5cca41692d3e745dbb1292578cb1cca6eeba8b998e8e8d604051620019bb93929190620045f3565b60405180910390a45050505050505050505050565b6040516000907f29912872bb1868dd74efe86230a05098a24ae1f39d64ec2129d982442801ac00908190839062001a0e9087908790602001620043d3565b60408051808303601f190181529181528151602092830120835290820192909252016000205460ff16949350505050565b600062001a4c816200327a565b62000d2b83838080601f0160208091040260200160405190810160405280939291908181526020018383808284376000920191909152506200364692505050565b7ff0c57e16840df040f15088dc2f81fe391c3923bec73e23a9662efc9c229c6a00805468010000000000000000810460ff16159067ffffffffffffffff1660008115801562001ad95750825b905060008267ffffffffffffffff16600114801562001af75750303b155b90508115801562001b06575080155b1562001b255760405163f92ee8a960e01b815260040160405180910390fd5b845467ffffffffffffffff19166001178555831562001b5a57845468ff00000000000000001916680100000000000000001785555b62001b64620036ef565b62001b7586621275006014620036fb565b62001b82600033620033f5565b506000873360405162001b959062003bac565b6001600160a01b03928316815291166020820152604001604051809103906000f08015801562001bc9573d6000803e3d6000fd5b50600080546001600160a01b0319166001600160a01b039290921691909117905550831562001c3757845468ff000000000000000019168555604051600181527fc7f505b2f371ae2175ee4913f4499e1f2633a7b5936321eed1cdaeb6115181d29060200160405180910390a15b50505050505050565b60606001805480602002602001604051908101604052809291908181526020016000905b8282101562001d1a57838290600052602060002001805462001c86906200462c565b80601f016020809104026020016040519081016040528092919081815260200182805462001cb4906200462c565b801562001d055780601f1062001cd95761010080835404028352916020019162001d05565b820191906000526020600020905b81548152906001019060200180831162001ce757829003601f168201915b50505050508152602001906001019062001c64565b50505050905090565b336000908152600080516020620053b783398151915260205260409020548390600080516020620053d78339815191529060ff16151560011462001d7b5760405162461bcd60e51b81526004016200094a9062004479565b6001600160a01b0382166000908152600582016020908152604080832033845290915290205460ff161562001dc45760405162461bcd60e51b81526004016200094a90620044d6565b604051600080516020620053d78339815191529060009062001ded908a908a90602001620043d3565b60408051601f1981840301815291815281516020928301206001600160a01b038a1660009081526003860190935291205490915060ff1662001e435760405162461bcd60e51b81526004016200094a906200451e565b6000851162001eae5760405162461bcd60e51b815260206004820152603060248201527f436f6e74656e7420466163746f72793a205f6e6577536c6f74206d757374206260448201526f0652067726561746572207468616e20360841b60648201526084016200094a565b84861162001f255760405162461bcd60e51b815260206004820152603c60248201527f436f6e74656e7420466163746f72793a205f6578697374696e67536c6f74206d60448201527f7573742062652067726561746572207468616e205f6e6577536c6f740000000060648201526084016200094a565b600081815260088301602090815260408083206001600160a01b038b16845282528083203384529091529020541562001fc75760405162461bcd60e51b815260206004820152603b60248201527f436f6e74656e7420466163746f72793a20436f6e74656e74204f626a6563742060448201527f68617320616c7265616479207374616b6564207468697320746167000000000060648201526084016200094a565b600081815260078301602090815260408083206001600160a01b03808c1685529083528184208a8552835292819020815160a081018352815481526001820154938101849052600282015490941691840191909152600381015460608401526004015460808301528611620020a55760405162461bcd60e51b815260206004820152603b60248201527f436f6e74656e7420466163746f72793a205f6e6577536c6f74206973206c657360448201527f73207468616e206578697374696e674c697374696e672e6e657874000000000060648201526084016200094a565b6000620020b2876200354e565b600084815260078601602090815260408083206001600160a01b038e16845282528083208c845282529182902060019081018b9055825160a0810184528c8152868301519281019290925233928201929092526060810183905290860154919250906080820190620021259042620045dd565b9052600084815260078601602090815260408083206001600160a01b038e81168086528285528386208e87528086528487208851815588870151600180830191909155898701516002830180546001600160a01b0319169190961617909455606089015160038201556080909801516004909801979097558086529184528784015185529483528184208c9055878452600889018352818420818552835281842033855283528184208c905587845260068901835281842090845290915281208054909190620021f7908490620045dd565b909155506200221490506001600160a01b038a16333084620035dd565b886001600160a01b0316336001600160a01b031660006001600160a01b03167ff93869cb3b0589c7164a965b5cca41692d3e745dbb1292578cb1cca6eeba8b998e8e8c604051620019bb93929190620045f3565b600062002275816200327a565b6200229e827f584565e90fa9ec9ac82afca62b5a80e321f6d503f72d0884875cf353a2703f0155565b5050565b60018181548110620022b357600080fd5b906000526020600020016000915090508054620022d0906200462c565b80601f0160208091040260200160405190810160405280929190818152602001828054620022fe906200462c565b80156200234f5780601f1062002323576101008083540402835291602001916200234f565b820191906000526020600020905b8154815290600101906020018083116200233157829003601f168201915b505050505081565b6040516bffffffffffffffffffffffff19606084901b166020820152620023bd906034015b60408051601f1981840301815291815281516020928301206000908152600080516020620053f7833981519152835281812033825290925290205460ff1690565b6200241d5760405162461bcd60e51b815260206004820152602960248201527f436f6e74656e7420466163746f72793a2043616c6c6572206e6f74206120746f60448201526835b2b71030b236b4b760b91b60648201526084016200094a565b6001600160a01b0380831660009081527f584565e90fa9ec9ac82afca62b5a80e321f6d503f72d0884875cf353a2703f0560209081526040808320938516835292905220805460ff191690555050565b60006200247a816200327a565b6200229e827f584565e90fa9ec9ac82afca62b5a80e321f6d503f72d0884875cf353a2703f0255565b336000908152600080516020620053b783398151915260205260409020548290600080516020620053d78339815191529060ff161515600114620024fb5760405162461bcd60e51b81526004016200094a9062004479565b6001600160a01b0382166000908152600582016020908152604080832033845290915290205460ff1615620025445760405162461bcd60e51b81526004016200094a90620044d6565b6001600160a01b0384166000908152600080516020620053978339815191526020526040902054600080516020620053d78339815191529060ff166200259e5760405162461bcd60e51b81526004016200094a906200451e565b60008787604051602001620025b5929190620043d3565b60408051601f19818403018152918152815160209283012060008181526006860184528281206001600160a01b038b16825290935291205490915015620026655760405162461bcd60e51b815260206004820152603060248201527f436f6e74656e7420466163746f72793a20546869732074616720697320616c7260448201527f6561647920696e697469616c697a65640000000000000000000000000000000060648201526084016200094a565b600062002672866200354e565b600083815260078501602090815260408083206001600160a01b038c168452825280832060001980855290835281842060019081018c9055825160a08101845291825292810193909352339083015260608201839052850154919250906080820190620026e09042620045dd565b9052600083815260078501602090815260408083206001600160a01b038c81168086529184528285208c865284528285208651815586850151600180830191909155878501516002830180546001600160a01b0319169190941617909255606087015160038201556080909601516004909601959095558380528184208b9055868452600888018352818420818552835281842033855283528184208b905586845260068801835281842090845290915281208054909190620027a5908490620045dd565b90915550620027c290506001600160a01b038816333084620035dd565b866001600160a01b0316336001600160a01b031660006001600160a01b03167ff93869cb3b0589c7164a965b5cca41692d3e745dbb1292578cb1cca6eeba8b998c8c8b6040516200281693929190620045f3565b60405180910390a4505050505050505050565b6040516bffffffffffffffffffffffff19606084901b16602082015262002853906034016200237c565b620028b35760405162461bcd60e51b815260206004820152602960248201527f436f6e74656e7420466163746f72793a2043616c6c6572206e6f74206120746f60448201526835b2b71030b236b4b760b91b60648201526084016200094a565b6001600160a01b0380831660009081527f584565e90fa9ec9ac82afca62b5a80e321f6d503f72d0884875cf353a2703f0560209081526040808320938516835292905220805460ff191660011790555050565b6040516bffffffffffffffffffffffff19606084901b16602082015262002930906034016200237c565b620029905760405162461bcd60e51b815260206004820152602960248201527f436f6e74656e7420466163746f72793a2043616c6c6572206e6f74206120746f60448201526835b2b71030b236b4b760b91b60648201526084016200094a565b62000d2b83838362003712565b6000828152600080516020620053f78339815191526020526040902060010154620029c8816200327a565b62000fbc8383620034b7565b6000620006d2826200354e565b6000620029ee816200327a565b60015460ff8316111562002a585760405162461bcd60e51b815260206004820152602a60248201527f436f6e73656e743a205175657374696f6e6e6169726520696e646578206f7574604482015269206f6620626f756e647360b01b60648201526084016200094a565b6001805462002a6990829062004668565b8154811062002a7c5762002a7c62004463565b9060005260206000200160018360ff168154811062002a9f5762002a9f62004463565b90600052602060002001908162002ab79190620046d2565b50600180548062002acc5762002acc620047c3565b60019003818190600052602060002001600062002aea919062003bba565b90555050565b336000908152600080516020620053b783398151915260205260409020548290600080516020620053d78339815191529060ff16151560011462002b485760405162461bcd60e51b81526004016200094a9062004479565b6001600160a01b0382166000908152600582016020908152604080832033845290915290205460ff161562002b915760405162461bcd60e51b81526004016200094a90620044d6565b604051600080516020620053d78339815191529060009062002bba9089908990602001620043d3565b60408051601f1981840301815291815281516020928301206001600160a01b03891660009081526003860190935291205490915060ff1662002c105760405162461bcd60e51b81526004016200094a906200451e565b600081815260078301602090815260408083206001600160a01b03808b168086529184528285208a86528452828520835160a081018552815481526001820154818701526002820154909216828501526003810154606083015260040154608082015285855260088701845282852091855290835281842033855290925290912054158062002cab575060408101516001600160a01b031633145b62002d1f5760405162461bcd60e51b815260206004820152603b60248201527f436f6e74656e7420466163746f72793a20436f6e74656e74204f626a6563742060448201527f68617320616c7265616479207374616b6564207468697320746167000000000060648201526084016200094a565b600081608001511162002d8b5760405162461bcd60e51b815260206004820152602d60248201527f436f6e74656e7420466163746f72793a2043616e6e6f74207265706c6163652060448201526c185b88195b5c1d1e481cdb1bdd609a1b60648201526084016200094a565b8060800151421162002e065760405162461bcd60e51b815260206004820152603060248201527f436f6e74656e7420466163746f72793a2063757272656e74206c697374696e6760448201527f206973207374696c6c206163746976650000000000000000000000000000000060648201526084016200094a565b6040518060a001604052808260000151815260200182602001518152602001336001600160a01b031681526020018260600151815260200184600101544262002e509190620045dd565b9052600083815260078501602090815260408083206001600160a01b038c811685529083528184208b855283529281902084518155918401516001830155838101516002830180546001600160a01b031916918516919091179055606084015160038301556080909301516004909101559082015116331462000f7a57600082815260088401602090815260408083206001600160a01b03808c16808652828552838620338088528187528588208e9055828852938652878501805190931687529094529184209390935551606084015162002f2e939190620035dd565b866001600160a01b0316336001600160a01b031682604001516001600160a01b03167ff93869cb3b0589c7164a965b5cca41692d3e745dbb1292578cb1cca6eeba8b998c8c8b6040516200281693929190620045f3565b600080600080516020620053d783398151915290506000858560405160200162002fb1929190620043d3565b60408051601f1981840301815291815281516020928301206000908152600690940182528084206001600160a01b0387168552909152909120549150505b9392505050565b600062003003816200327a565b6001546080116200307d5760405162461bcd60e51b815260206004820152603960248201527f436f6e73656e7420466163746f72793a204d6178696d756d206e756d6265722060448201527f6f66207175657374696f6e6e616972657320726561636865640000000000000060648201526084016200094a565b6001805480820182556000919091527fb10e2d527612073b26eecdfd717e6a320cf44b4afac2b0732d9fcbe2b7fa0cf60162000d2b8382620047d9565b6020858101805160008581527f584565e90fa9ec9ac82afca62b5a80e321f6d503f72d0884875cf353a2703f07845260408082206001600160a01b038a81168085528288528385208d5186528089528486206001908101979097558986528486208681558088018790556002810180546001600160a01b0319169055600381018790556004018690558d5182875293895296518552958752828420919091558783527f584565e90fa9ec9ac82afca62b5a80e321f6d503f72d0884875cf353a2703f0886528183208584528652818320828c0151909116835285528082208290558682527f584565e90fa9ec9ac82afca62b5a80e321f6d503f72d0884875cf353a2703f068552808220938252929093529082208054600080516020620053d78339815191529390620031ef90849062004668565b90915550506040860151606087015162003214916001600160a01b0388169162003891565b846001600160a01b031660006001600160a01b031687604001516001600160a01b03167ff93869cb3b0589c7164a965b5cca41692d3e745dbb1292578cb1cca6eeba8b9987866040516200326a9291906200489f565b60405180910390a4505050505050565b62000a6f8133620038c4565b6040517f29912872bb1868dd74efe86230a05098a24ae1f39d64ec2129d982442801ac00908190600090620032c0908590602001620048c3565b60408051601f198184030181529181528151602092830120835290820192909252016000205460ff161515600114620033625760405162461bcd60e51b815260206004820152603b60248201527f455243373532393a2065544c442b312063757272656e746c79206e6f7420617360448201527f736f6369617465642077697468207468697320636f6e7472616374000000000060648201526084016200094a565b6000816000016000846040516020016200337d9190620048c3565b60405160208183030381529060405280519060200120815260200190815260200160002060006101000a81548160ff0219169083151502179055507f1a5c07d8ee1fce30d5e52fe9097bc41e0e7e43c9d74ef7bf98133120d3ea5dc282604051620033e9919062004214565b60405180910390a15050565b6000828152600080516020620053f7833981519152602081815260408084206001600160a01b038616855290915282205460ff16620034ac576000848152602082815260408083206001600160a01b03871684529091529020805460ff19166001179055620034613390565b6001600160a01b0316836001600160a01b0316857f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a46001915050620006d2565b6000915050620006d2565b6000828152600080516020620053f7833981519152602081815260408084206001600160a01b038616855290915282205460ff1615620034ac576000848152602082815260408083206001600160a01b0387168085529252808320805460ff1916905551339287917ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b9190a46001915050620006d2565b6000670de0b6b3a764000080670de111a6b7de40005b8415620035d55762003578600286620048f7565b6001036200359c57826200358d82846200490e565b62003599919062004928565b91505b84600103620035ad57509392505050565b82620035ba82806200490e565b620035c6919062004928565b9050600185901c945062003564565b509392505050565b6040516001600160a01b03848116602483015283811660448301526064820183905262000fbc9186918216906323b872dd906084015b604051602081830303815290604052915060e01b6020820180516001600160e01b03838183161783525050505062003929565b6040517f29912872bb1868dd74efe86230a05098a24ae1f39d64ec2129d982442801ac0090600190829060009062003683908690602001620048c3565b60405160208183030381529060405280519060200120815260200190815260200160002060006101000a81548160ff0219169083151502179055507f1fc1bae1e5cc41896c1cdee7a380b003c14fea22313ef3fe9d0a965625dfd37682604051620033e9919062004214565b620036f962003993565b565b6200370562003993565b62000d2b838383620039e2565b6001600160a01b0382166000908152600080516020620053978339815191526020526040902054600080516020620053d78339815191529060ff166200376c5760405162461bcd60e51b81526004016200094a906200451e565b600084604051602001620037819190620048c3565b60405160208183030381529060405280519060200120905060008351905060005b8181101562001c3757600083815260078501602090815260408083206001600160a01b038a168452909152812086518290889085908110620037e857620037e862004463565b60209081029190910181015182528181019290925260409081016000908120825160a0810184528154815260018201549481019490945260028101546001600160a01b0316928401929092526003820154606084015260049091015460808301819052919250036200385b575062003888565b6200388681888a878a878151811062003878576200387862004463565b6020026020010151620030ba565b505b600101620037a2565b6040516001600160a01b0383811660248301526044820183905262000d2b91859182169063a9059cbb9060640162003613565b6000828152600080516020620053f7833981519152602090815260408083206001600160a01b038516845290915290205460ff166200229e5760405163e2517d3f60e01b81526001600160a01b0382166004820152602481018390526044016200094a565b6000620039406001600160a01b0384168362003a87565b90508051600014158015620039685750808060200190518101906200396691906200493f565b155b1562000d2b57604051635274afe760e01b81526001600160a01b03841660048201526024016200094a565b7ff0c57e16840df040f15088dc2f81fe391c3923bec73e23a9662efc9c229c6a005468010000000000000000900460ff16620036f957604051631afcd79f60e31b815260040160405180910390fd5b620039ec62003993565b600080516020620053d783398151915280546001600160a01b0319166001600160a01b039490941693841790556000928352600080516020620053978339815191526020526040909220805460ff191660011790557f584565e90fa9ec9ac82afca62b5a80e321f6d503f72d0884875cf353a2703f01557f584565e90fa9ec9ac82afca62b5a80e321f6d503f72d0884875cf353a2703f0255565b606062002fef8383600084600080856001600160a01b0316848660405162003ab09190620048c3565b60006040518083038185875af1925050503d806000811462003aef576040519150601f19603f3d011682016040523d82523d6000602084013e62003af4565b606091505b509150915062003b0686838362003b10565b9695505050505050565b60608262003b295762003b238262003b74565b62002fef565b815115801562003b4157506001600160a01b0384163b155b1562003b6c57604051639996b31560e01b81526001600160a01b03851660048201526024016200094a565b508062002fef565b80511562003b855780518082602001fd5b604051630a12f52160e11b815260040160405180910390fd5b6105e5806200496083390190565b6104528062004f4583390190565b50805462003bc8906200462c565b6000825580601f1062003bd9575050565b601f01602090049060005260206000209081019062000a6f91905b8082111562003c0a576000815560010162003bf4565b5090565b60006020828403121562003c2157600080fd5b81356001600160e01b03198116811462002fef57600080fd5b60008083601f84011262003c4d57600080fd5b50813567ffffffffffffffff81111562003c6657600080fd5b60208301915083602082850101111562003c7f57600080fd5b9250929050565b80356001600160a01b038116811462003c9e57600080fd5b919050565b801515811462000a6f57600080fd5b60008060008060008060a0878903121562003ccc57600080fd5b863567ffffffffffffffff81111562003ce457600080fd5b62003cf289828a0162003c3a565b909750955062003d0790506020880162003c86565b93506040870135925060608701359150608087013562003d278162003ca3565b809150509295509295509295565b60005b8381101562003d5257818101518382015260200162003d38565b50506000910152565b6000815180845262003d7581602086016020860162003d35565b601f01601f19169290920160200192915050565b60008282518085526020808601955060208260051b8401016020860160005b8481101562003dda57601f1986840301895262003dc783835162003d5b565b9884019892509083019060010162003da8565b5090979650505050505050565b6000604080835262003dfd604084018662003d89565b83810360208581019190915285518083528682019282019060005b8181101562003e67578451805184528481015185850152868101516001600160a01b03168785015260608082015190850152608090810151908401529383019360a09092019160010162003e18565b509098975050505050505050565b60006020828403121562003e8857600080fd5b62002fef8262003c86565b60008060008060006060868803121562003eac57600080fd5b853567ffffffffffffffff8082111562003ec557600080fd5b62003ed389838a0162003c3a565b909750955085915062003ee96020890162003c86565b9450604088013591508082111562003f0057600080fd5b818801915088601f83011262003f1557600080fd5b81358181111562003f2557600080fd5b8960208260051b850101111562003f3b57600080fd5b9699959850939650602001949392505050565b6000806020838503121562003f6257600080fd5b823567ffffffffffffffff81111562003f7a57600080fd5b62003f888582860162003c3a565b90969095509350505050565b60006020828403121562003fa757600080fd5b5035919050565b6000806000806060858703121562003fc557600080fd5b843567ffffffffffffffff81111562003fdd57600080fd5b62003feb8782880162003c3a565b90955093506200400090506020860162003c86565b9396929550929360400135925050565b600080604083850312156200402457600080fd5b82359150620040366020840162003c86565b90509250929050565b634e487b7160e01b600052604160045260246000fd5b604051601f8201601f1916810167ffffffffffffffff811182821017156200408157620040816200403f565b604052919050565b600067ffffffffffffffff821115620040a657620040a66200403f565b50601f01601f191660200190565b600082601f830112620040c657600080fd5b8135620040dd620040d78262004089565b62004055565b818152846020838601011115620040f357600080fd5b816020850160208301376000918101602001919091529392505050565b600080604083850312156200412457600080fd5b6200412f8362003c86565b9150602083013567ffffffffffffffff8111156200414c57600080fd5b6200415a85828601620040b4565b9150509250929050565b6000806000806000608086880312156200417d57600080fd5b853567ffffffffffffffff8111156200419557600080fd5b620041a38882890162003c3a565b9096509450620041b890506020870162003c86565b94979396509394604081013594506060013592915050565b60008060408385031215620041e457600080fd5b620041ef8362003c86565b9150620040366020840162003c86565b60208152600062002fef602083018462003d89565b60208152600062002fef602083018462003d5b565b6000806000606084860312156200423f57600080fd5b833567ffffffffffffffff808211156200425857600080fd5b6200426687838801620040b4565b9450602091506200427982870162003c86565b93506040860135818111156200428e57600080fd5b8601601f81018813620042a057600080fd5b803582811115620042b557620042b56200403f565b8060051b9250620042c884840162004055565b818152928201840192848101908a851115620042e357600080fd5b928501925b848410156200430357833582529285019290850190620042e8565b8096505050505050509250925092565b6000602082840312156200432657600080fd5b813560ff8116811462002fef57600080fd5b6000806000604084860312156200434e57600080fd5b833567ffffffffffffffff8111156200436657600080fd5b620043748682870162003c3a565b90945092506200438990506020850162003c86565b90509250925092565b600060208284031215620043a557600080fd5b813567ffffffffffffffff811115620043bd57600080fd5b620043cb84828501620040b4565b949350505050565b8183823760009101908152919050565b600060208284031215620043f657600080fd5b815167ffffffffffffffff8111156200440e57600080fd5b8201601f810184136200442057600080fd5b805162004431620040d78262004089565b8181528560208385010111156200444757600080fd5b6200445a82602083016020860162003d35565b95945050505050565b634e487b7160e01b600052603260045260246000fd5b6020808252602f908201527f436f6e74656e7420466163746f72793a2043616c6c6572206973206e6f74206160408201527f20636f6e74656e74206f626a6563740000000000000000000000000000000000606082015260800190565b60208082526028908201527f436f6e74656e7420466163746f72793a2043616c6c657220686173206265656e60408201526708189b1bd8dad95960c21b606082015260800190565b6020808252602d908201527f436f6e74656e7420466163746f72793a205374616b696e6720746f6b656e206e60408201526c1bdd081c9959da5cdd195c9959609a1b606082015260800190565b60006001600160a01b0380861683526060602084015262004590606084018662003d5b565b9150808416604084015250949350505050565b6001600160a01b0383168152604060208201526000620043cb604083018462003d5b565b634e487b7160e01b600052601160045260246000fd5b80820180821115620006d257620006d2620045c7565b604081528260408201528284606083013760006060848301015260006060601f19601f8601168301019050826020830152949350505050565b600181811c908216806200464157607f821691505b6020821081036200466257634e487b7160e01b600052602260045260246000fd5b50919050565b81810381811115620006d257620006d2620045c7565b601f82111562000d2b576000816000526020600020601f850160051c81016020861015620046a95750805b601f850160051c820191505b81811015620046ca57828155600101620046b5565b505050505050565b818103620046de575050565b620046ea82546200462c565b67ffffffffffffffff8111156200470557620047056200403f565b6200471d816200471684546200462c565b846200467e565b6000601f8211600181146200475457600083156200473b5750848201545b600019600385901b1c1916600184901b178455620047bc565b600085815260209020601f19841690600086815260209020845b838110156200479057828601548255600195860195909101906020016200476e565b5085831015620047af5781850154600019600388901b60f8161c191681555b50505060018360011b0184555b5050505050565b634e487b7160e01b600052603160045260246000fd5b815167ffffffffffffffff811115620047f657620047f66200403f565b62004807816200471684546200462c565b602080601f8311600181146200483f5760008415620048265750858301515b600019600386901b1c1916600185901b178555620046ca565b600085815260208120601f198616915b8281101562004870578886015182559484019460019091019084016200484f565b50858210156200488f5787850151600019600388901b60f8161c191681555b5050505050600190811b01905550565b604081526000620048b4604083018562003d5b565b90508260208301529392505050565b60008251620048d781846020870162003d35565b9190910192915050565b634e487b7160e01b600052601260045260246000fd5b600082620049095762004909620048e1565b500690565b8082028115828204841417620006d257620006d2620045c7565b6000826200493a576200493a620048e1565b500490565b6000602082840312156200495257600080fd5b815162002fef8162003ca356fe60a06040526040516105e53803806105e583398101604081905261002291610387565b61002c828261003e565b506001600160a01b031660805261047e565b610047826100fe565b6040516001600160a01b038316907f1cf3b03a6cf19fa2baba4df148e9dcabedea7f8a5c07840e207e5c089be95d3e90600090a28051156100f2576100ed826001600160a01b0316635c60da1b6040518163ffffffff1660e01b8152600401602060405180830381865afa1580156100c3573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906100e79190610447565b82610211565b505050565b6100fa610288565b5050565b806001600160a01b03163b60000361013957604051631933b43b60e21b81526001600160a01b03821660048201526024015b60405180910390fd5b807fa3f0ad74e5423aebfd80d3ef4346578335a9a72aeaee59ff6cb3582b35133d5080546001600160a01b0319166001600160a01b0392831617905560408051635c60da1b60e01b81529051600092841691635c60da1b9160048083019260209291908290030181865afa1580156101b5573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906101d99190610447565b9050806001600160a01b03163b6000036100fa57604051634c9c8ce360e01b81526001600160a01b0382166004820152602401610130565b6060600080846001600160a01b03168460405161022e9190610462565b600060405180830381855af49150503d8060008114610269576040519150601f19603f3d011682016040523d82523d6000602084013e61026e565b606091505b50909250905061027f8583836102a9565b95945050505050565b34156102a75760405163b398979f60e01b815260040160405180910390fd5b565b6060826102be576102b982610308565b610301565b81511580156102d557506001600160a01b0384163b155b156102fe57604051639996b31560e01b81526001600160a01b0385166004820152602401610130565b50805b9392505050565b8051156103185780518082602001fd5b604051630a12f52160e11b815260040160405180910390fd5b80516001600160a01b038116811461034857600080fd5b919050565b634e487b7160e01b600052604160045260246000fd5b60005b8381101561037e578181015183820152602001610366565b50506000910152565b6000806040838503121561039a57600080fd5b6103a383610331565b60208401519092506001600160401b03808211156103c057600080fd5b818501915085601f8301126103d457600080fd5b8151818111156103e6576103e661034d565b604051601f8201601f19908116603f0116810190838211818310171561040e5761040e61034d565b8160405282815288602084870101111561042757600080fd5b610438836020830160208801610363565b80955050505050509250929050565b60006020828403121561045957600080fd5b61030182610331565b60008251610474818460208701610363565b9190910192915050565b60805161014d61049860003960006024015261014d6000f3fe608060405261000c61000e565b005b61001e610019610020565b6100b6565b565b60007f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff16635c60da1b6040518163ffffffff1660e01b8152600401602060405180830381865afa15801561008d573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906100b191906100da565b905090565b3660008037600080366000845af43d6000803e8080156100d5573d6000f35b3d6000fd5b6000602082840312156100ec57600080fd5b815173ffffffffffffffffffffffffffffffffffffffff8116811461011057600080fd5b939250505056fea2646970667358221220df8f0215aba840b20c044b86b48ebcc41b929e9e2dbacf6884d35d1802d59af064736f6c63430008180033608060405234801561001057600080fd5b5060405161045238038061045283398101604081905261002f91610165565b806001600160a01b03811661005f57604051631e4fbdf760e01b8152600060048201526024015b60405180910390fd5b61006881610079565b50610072826100c9565b5050610198565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b806001600160a01b03163b6000036100ff5760405163211eb15960e21b81526001600160a01b0382166004820152602401610056565b600180546001600160a01b0319166001600160a01b0383169081179091556040517fbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b90600090a250565b80516001600160a01b038116811461016057600080fd5b919050565b6000806040838503121561017857600080fd5b61018183610149565b915061018f60208401610149565b90509250929050565b6102ab806101a76000396000f3fe608060405234801561001057600080fd5b50600436106100575760003560e01c80633659cfe61461005c5780635c60da1b14610071578063715018a61461009a5780638da5cb5b146100a2578063f2fde38b146100b3575b600080fd5b61006f61006a366004610245565b6100c6565b005b6001546001600160a01b03165b6040516001600160a01b03909116815260200160405180910390f35b61006f6100da565b6000546001600160a01b031661007e565b61006f6100c1366004610245565b6100ee565b6100ce61012e565b6100d78161015b565b50565b6100e261012e565b6100ec60006101e8565b565b6100f661012e565b6001600160a01b03811661012557604051631e4fbdf760e01b8152600060048201526024015b60405180910390fd5b6100d7816101e8565b6000546001600160a01b031633146100ec5760405163118cdaa760e01b815233600482015260240161011c565b806001600160a01b03163b6000036101915760405163211eb15960e21b81526001600160a01b038216600482015260240161011c565b6001805473ffffffffffffffffffffffffffffffffffffffff19166001600160a01b0383169081179091556040517fbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b90600090a250565b600080546001600160a01b0383811673ffffffffffffffffffffffffffffffffffffffff19831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b60006020828403121561025757600080fd5b81356001600160a01b038116811461026e57600080fd5b939250505056fea2646970667358221220c3c8577b42a50e08e8e61a579b7a615c4b9e7fdf171625b4fc020b621f62415e64736f6c63430008180033584565e90fa9ec9ac82afca62b5a80e321f6d503f72d0884875cf353a2703f03584565e90fa9ec9ac82afca62b5a80e321f6d503f72d0884875cf353a2703f04584565e90fa9ec9ac82afca62b5a80e321f6d503f72d0884875cf353a2703f0002dd7bc7dec4dceedda775e58dd541e08a116c6c53815c0bd028192f7b626800a2646970667358221220b2264d13f647a795cf985e92f9e0495c9bb471eb341ea7bc733d235a6e3504cf64736f6c63430008180033",
  linkReferences: {},
  deployedLinkReferences: {},
};
