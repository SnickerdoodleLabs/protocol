export default {
  _format: "hh-sol-artifact-1",
  contractName: "ConsentFactory",
  sourceName: "contracts/consent/ConsentFactory.sol",
  abi: [
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
      name: "ConsentDeployed",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint8",
          name: "version",
          type: "uint8",
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
      name: "MarketplaceUpdate",
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
      inputs: [
        {
          internalType: "address",
          name: "user",
          type: "address",
        },
        {
          internalType: "bytes32",
          name: "role",
          type: "bytes32",
        },
      ],
      name: "addUserRole",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "addressToDeployedConsents",
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
          name: "",
          type: "address",
        },
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      name: "addressToDeployedConsentsIndex",
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
          internalType: "address",
          name: "",
          type: "address",
        },
        {
          internalType: "bytes32",
          name: "",
          type: "bytes32",
        },
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "addressToUserRolesArray",
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
          name: "",
          type: "address",
        },
        {
          internalType: "bytes32",
          name: "",
          type: "bytes32",
        },
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      name: "addressToUserRolesArrayIndex",
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
          name: "tag",
          type: "string",
        },
        {
          internalType: "uint256",
          name: "_removedSlot",
          type: "uint256",
        },
      ],
      name: "adminRemoveListing",
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
          name: "",
          type: "address",
        },
      ],
      name: "consentAddressCheck",
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
          name: "owner",
          type: "address",
        },
        {
          internalType: "string",
          name: "baseURI",
          type: "string",
        },
        {
          internalType: "string",
          name: "name",
          type: "string",
        },
      ],
      name: "createConsent",
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
      name: "getListing",
      outputs: [
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
              name: "consentContract",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "timeExpiring",
              type: "uint256",
            },
          ],
          internalType: "struct IConsentFactory.Listing",
          name: "",
          type: "tuple",
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
              name: "consentContract",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "timeExpiring",
              type: "uint256",
            },
          ],
          internalType: "struct IConsentFactory.Listing[]",
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
              name: "consentContract",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "timeExpiring",
              type: "uint256",
            },
          ],
          internalType: "struct IConsentFactory.Listing[]",
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
          internalType: "bytes32",
          name: "role",
          type: "bytes32",
        },
        {
          internalType: "uint256",
          name: "index",
          type: "uint256",
        },
      ],
      name: "getRoleMember",
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
          internalType: "bytes32",
          name: "role",
          type: "bytes32",
        },
      ],
      name: "getRoleMemberCount",
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
          name: "tag",
          type: "string",
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
          internalType: "address",
          name: "user",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "startingIndex",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "endingIndex",
          type: "uint256",
        },
      ],
      name: "getUserDeployedConsentsByIndex",
      outputs: [
        {
          internalType: "address[]",
          name: "",
          type: "address[]",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "user",
          type: "address",
        },
      ],
      name: "getUserDeployedConsentsCount",
      outputs: [
        {
          internalType: "uint256",
          name: "count",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "user",
          type: "address",
        },
        {
          internalType: "bytes32",
          name: "role",
          type: "bytes32",
        },
      ],
      name: "getUserRoleAddressesCount",
      outputs: [
        {
          internalType: "uint256",
          name: "count",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "user",
          type: "address",
        },
        {
          internalType: "bytes32",
          name: "role",
          type: "bytes32",
        },
        {
          internalType: "uint256",
          name: "startingIndex",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "endingIndex",
          type: "uint256",
        },
      ],
      name: "getUserRoleAddressesCountByIndex",
      outputs: [
        {
          internalType: "address[]",
          name: "",
          type: "address[]",
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
          name: "_trustedForwarder",
          type: "address",
        },
        {
          internalType: "address",
          name: "_consentImpAddress",
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
      inputs: [
        {
          internalType: "string",
          name: "tag",
          type: "string",
        },
        {
          internalType: "uint256",
          name: "_removedSlot",
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
          internalType: "address",
          name: "user",
          type: "address",
        },
        {
          internalType: "bytes32",
          name: "role",
          type: "bytes32",
        },
      ],
      name: "removeUserRole",
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
          name: "_listingDuration",
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
          name: "_maxTagsPerListing",
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
      inputs: [],
      name: "trustedForwarder",
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
  ],
  bytecode:
    "0x608060405234801561001057600080fd5b50614563806100206000396000f3fe60806040523480156200001157600080fd5b5060043610620002795760003560e01c806391d148541162000155578063b8cab4aa11620000c7578063df118ac21162000086578063df118ac21462000657578063e50c201f146200066e578063e63ab1e91462000694578063e68122e214620006bc578063fba81d7414620006d357600080fd5b8063b8cab4aa14620005c1578063b9ed16ec14620005d8578063ca15c8731462000612578063d171f61a1462000629578063d547741f146200064057600080fd5b8063a8b2b8cd1162000114578063a8b2b8cd1462000521578063aa6311e71462000547578063ac97b7d2146200055e578063b164786c1462000575578063b89a0b24146200058c57600080fd5b806391d1485414620004a65780639d38c87b14620004bd5780639f83597b14620004d4578063a1faf0081462000501578063a217fddf146200051857600080fd5b806350ea66d411620001ef5780637659125311620001ae5780637659125314620004385780637da0a877146200044f5780637e2ec6d01462000463578063841a5c4814620004785780639010d07c146200048f57600080fd5b806350ea66d414620003cd5780635c975abb14620003d75780636887f58f14620003e35780636b1993b214620003fa57806371731b83146200042157600080fd5b80632f2ff15d116200023c5780632f2ff15d146200032957806336568abe1462000340578063485cc95514620003575780634cc1f7af146200036e5780634e69ec4f146200039e57600080fd5b806301ffc9a7146200027e5780631bcea2b314620002aa578063211b98bd14620002d1578063248a9ca314620002ea5780632850df1a146200031f575b600080fd5b620002956200028f36600462002d4f565b620006ea565b60405190151581526020015b60405180910390f35b62000295620002bb36600462002d98565b6101026020526000908152604090205460ff1681565b620002e8620002e236600462002e85565b62000718565b005b62000310620002fb36600462002ecd565b60009081526097602052604090206001015490565b604051908152602001620002a1565b6200031060fc5481565b620002e86200033a36600462002ee7565b62000973565b620002e86200035136600462002ee7565b620009a1565b620002e86200036836600462002f16565b62000a23565b620003856200037f36600462002f45565b62000c5b565b6040516001600160a01b039091168152602001620002a1565b62000310620003af36600462002f16565b61010160209081526000928352604080842090915290825290205481565b6200031060fd5481565b60335460ff1662000295565b620002e8620003f436600462002f72565b62000c95565b620004116200040b36600462002fc3565b62000f70565b604051620002a192919062003090565b620002e86200043236600462002f72565b6200121f565b620002e86200044936600462002f45565b620014ea565b60ff5462000385906001600160a01b031681565b6101055462000385906001600160a01b031681565b620002e86200048936600462002ecd565b6200171b565b62000385620004a036600462003163565b6200172e565b62000295620004b736600462002ee7565b6200174f565b620002e8620004ce36600462002e85565b6200177a565b62000310620004e536600462002d98565b6001600160a01b03166000908152610100602052604090205490565b620003856200051236600462003186565b62001953565b62000310600081565b620005386200053236600462003186565b6200199a565b604051620002a19190620031bc565b620002e86200055836600462002ecd565b62001a31565b620003106200056f3660046200320b565b62001a44565b620002e86200058636600462002e85565b62001a86565b620003106200059d36600462003243565b61010460209081526000938452604080852082529284528284209052825290205481565b620002e8620005d236600462002f45565b62001c33565b62000310620005e936600462002f45565b6001600160a01b0391909116600090815261010360209081526040808320938352929052205490565b620003106200062336600462002ecd565b62001cef565b620005386200063a36600462003284565b62001d08565b620002e86200065136600462002ee7565b62001d99565b620002e86200066836600462002e85565b62001dc2565b620006856200067f36600462002e85565b62001fab565b604051620002a19190620032c0565b620003107f65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a81565b620002e8620006cd366004620032f5565b62002033565b62000411620006e436600462002fc3565b620022b1565b60006001600160e01b03198216635a05180f60e01b148062000712575062000712826200254f565b92915050565b336000908152610102602052604090205460ff161515600114620007595760405162461bcd60e51b8152600401620007509062003371565b60405180910390fd5b6000826040516020016200076e9190620033c1565b60408051601f198184030181528282528051602091820120600081815260fe835283812087825283528390206080850184528054855260018101549285019290925260028201546001600160a01b0316928401929092526003015460608301819052909250620008365760405162461bcd60e51b815260206004820152602c60248201527f436f6e73656e74466163746f72793a2043616e6e6f74207265706c616365206160448201526b1b88195b5c1d1e481cdb1bdd60a21b606482015260840162000750565b80606001514211620008a35760405162461bcd60e51b815260206004820152602f60248201527f436f6e73656e74466163746f72793a2063757272656e74206c697374696e672060448201526e6973207374696c6c2061637469766560881b606482015260840162000750565b60405180608001604052808260000151815260200182602001518152602001336001600160a01b0316815260200160fc5442620008e19190620033f5565b9052600083815260fe6020908152604080832087845282529182902083518155908301516001820155828201516002820180546001600160a01b0319166001600160a01b03928316179055606090930151600390910155828101519051339291909116906000805160206200450e8339815191529062000965908890889062003410565b60405180910390a350505050565b600082815260976020526040902060010154620009908162002586565b6200099c838362002595565b505050565b6001600160a01b038116331462000a135760405162461bcd60e51b815260206004820152602f60248201527f416363657373436f6e74726f6c3a2063616e206f6e6c792072656e6f756e636560448201526e103937b632b9903337b91039b2b63360891b606482015260840162000750565b62000a1f8282620025bb565b5050565b600054610100900460ff161580801562000a445750600054600160ff909116105b8062000a605750303b15801562000a60575060005460ff166001145b62000ac55760405162461bcd60e51b815260206004820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201526d191e481a5b9a5d1a585b1a5e995960921b606482015260840162000750565b6000805460ff19166001179055801562000ae9576000805461ff0019166101001790555b62000af3620025e1565b62000afd62002617565b62000b0a60003362002595565b62000b367f65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a3362002595565b60008260405162000b479062002d02565b6001600160a01b039091168152602001604051809103906000f08015801562000b74573d6000803e3d6000fd5b5060405163f2fde38b60e01b81523360048201529091506001600160a01b0382169063f2fde38b90602401600060405180830381600087803b15801562000bba57600080fd5b505af115801562000bcf573d6000803e3d6000fd5b505061010580546001600160a01b03199081166001600160a01b039586161790915560ff80549091169387169390931790925550506212750060fc55601460fd5580156200099c576000805461ff0019169055604051600181527f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb38474024989060200160405180910390a1505050565b610100602052816000526040600020818154811062000c7957600080fd5b6000918252602090912001546001600160a01b03169150829050565b336000908152610102602052604090205460ff16151560011462000ccd5760405162461bcd60e51b8152600401620007509062003371565b6000811162000cf05760405162461bcd60e51b8152600401620007509062003434565b80821162000d675760405162461bcd60e51b815260206004820152603b60248201527f436f6e73656e74466163746f72793a205f6578697374696e67536c6f74206d7560448201527f73742062652067726561746572207468616e205f6e6577536c6f740000000000606482015260840162000750565b60008360405160200162000d7c9190620033c1565b60408051601f198184030181528282528051602091820120600081815260fe8352838120888252835283902060808501845280548552600181015492850183905260028101546001600160a01b0316938501939093526003909201546060840152909250831162000e565760405162461bcd60e51b815260206004820152603a60248201527f436f6e73656e74466163746f72793a205f6e6577536c6f74206973206c65737360448201527f207468616e206578697374696e674c697374696e672e6e657874000000000000606482015260840162000750565b600082815260fe602090815260408083208784528252918290206001018590558151608081018352838201518152908101869052339181019190915260fc54606082019062000ea69042620033f5565b9052600083815260fe602081815260408084208885528083528185208651815586840151600180830191909155878401516002830180546001600160a01b0319166001600160a01b0390921691909117905560609097015160039091015587855292825285820151845291815281832087905585835260fb90528120805490919062000f34908490620033f5565b909155505060405133906000906000805160206200450e8339815191529062000f61908990889062003410565b60405180910390a35050505050565b6060806000846001600160401b0381111562000f905762000f9062002db6565b60405190808252806020026020018201604052801562000fc557816020015b606081526020019060019003908162000faf5790505b5090506000856001600160401b0381111562000fe55762000fe562002db6565b6040519080825280602002602001820160405280156200102257816020015b6200100e62002d10565b815260200190600190039081620010045790505b5090506000886040516020016200103a9190620033c1565b60405160208183030381529060405280519060200120905060005b878110156200121057600082815260fe602090815260408083208c845282529182902082516080810184528154815260018201549281019290925260028101546001600160a01b03169282019290925260039091015460608201819052620011005760405162461bcd60e51b815260206004820152601c60248201527f436f6e73656e74466163746f72793a20696e76616c696420736c6f7400000000604482015260640162000750565b6001881515148015620011165750428160600151105b15620011235750620011fb565b80604001516001600160a01b0316636c0360eb6040518163ffffffff1660e01b815260040160006040518083038186803b1580156200116157600080fd5b505afa15801562001176573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f19168201604052620011a0919081019062003483565b858381518110620011b557620011b5620034f9565b602002602001018190525080848381518110620011d657620011d6620034f9565b6020026020010181905250806020015199508960001415620011f9575062001210565b505b8062001207816200350f565b91505062001055565b50919890975095505050505050565b336000908152610102602052604090205460ff161515600114620012575760405162461bcd60e51b8152600401620007509062003371565b600082116200127a5760405162461bcd60e51b8152600401620007509062003434565b808211620012f15760405162461bcd60e51b815260206004820152603b60248201527f436f6e73656e74466163746f72793a205f6e6577536c6f74206d75737420626560448201527f2067726561746572207468616e205f6578697374696e67536c6f740000000000606482015260840162000750565b600083604051602001620013069190620033c1565b60408051601f198184030181528282528051602091820120600081815260fe83528381208782528352839020608085018452805480865260018201549386019390935260028101546001600160a01b03169385019390935260039092015460608401529092508410620013ec5760405162461bcd60e51b815260206004820152604160248201527f436f6e73656e74466163746f72793a205f6e6577536c6f74206973206772656160448201527f746572207468616e206578697374696e674c697374696e672e70726576696f756064820152607360f81b608482015260a40162000750565b600082815260fe6020908152604080832084518452825291829020600101869055815160808101835283518152908101859052339181019190915260fc5460608201906200143b9042620033f5565b9052600083815260fe6020908152604080832088845282528083208451815584830151600180830191909155858301516002830180546001600160a01b0319166001600160a01b0390921691909117905560609095015160039091015586835280832088905585835260fb90915281208054909190620014bd908490620033f5565b909155505060405133906000906000805160206200450e8339815191529062000f61908990899062003410565b336000908152610102602052604090205460ff161515600114620015225760405162461bcd60e51b8152600401620007509062003371565b6001600160a01b0382166000908152610103602090815260408083208484528252808320805482518185028101850190935280835291929091908301828280156200159757602002820191906000526020600020905b81546001600160a01b0316815260019091019060200180831162001578575b5050506001600160a01b0386166000908152610104602090815260408083208884528252808320338452909152902054835193945092849250620015df91506001906200352d565b81518110620015f257620015f2620034f9565b6020908102919091018101516001600160a01b03861660009081526101038352604080822087835290935291909120805483908110620016365762001636620034f9565b600091825260208083209190910180546001600160a01b0319166001600160a01b03948516179055918616815261010482526040808220868352909252908120835183929085906200168b906001906200352d565b815181106200169e576200169e620034f9565b6020908102919091018101516001600160a01b039081168352828201939093526040918201600090812094909455918716835261010382528083208684529091529020805480620016f357620016f362003547565b600082815260209020810160001990810180546001600160a01b031916905501905550505050565b6000620017288162002586565b5060fc55565b600082815260c96020526040812062001748908362002641565b9392505050565b60009182526097602090815260408084206001600160a01b0393909316845291905290205460ff1690565b336000908152610102602052604090205460ff161515600114620017b25760405162461bcd60e51b8152600401620007509062003371565b600082604051602001620017c79190620033c1565b60408051601f198184030181528282528051602091820120600081815260fe835283812087825283528390206080850184528054855260018101549285019290925260028201546001600160a01b0316928401839052600390910154606084015292503314620018905760405162461bcd60e51b815260206004820152602d60248201527f436f6e73656e74466163746f72793a206f6e6c79206c697374696e67206f776e60448201526c65722063616e2072656d6f766560981b606482015260840162000750565b60208181018051600085815260fe8085526040808320875184528087528184206001908101959095558984528184208481558086018590556002810180546001600160a01b03191690556003018490558751898552928752945183529385528382205585815260fb909352908220805491929091620019119084906200352d565b9250508190555060006001600160a01b031681604001516001600160a01b03166000805160206200450e83398151915286866040516200096592919062003410565b61010360205282600052604060002060205281600052604060002081815481106200197d57600080fd5b6000918252602090912001546001600160a01b0316925083915050565b606062001a2983836101006000886001600160a01b03166001600160a01b0316815260200190815260200160002080548060200260200160405190810160405280929190818152602001828054801562001a1e57602002820191906000526020600020905b81546001600160a01b03168152600190910190602001808311620019ff575b50505050506200264f565b949350505050565b600062001a3e8162002586565b5060fd55565b6000808260405160200162001a5a9190620033c1565b60408051601f198184030181529181528151602092830120600090815260fb9092529020549392505050565b600062001a938162002586565b60008360405160200162001aa89190620033c1565b60408051601f198184030181528282528051602091820120600081815260fe835283812088825283528390206080850184528054855260018101549285019290925260028201546001600160a01b031692840192909252600301546060830181905290925062001b705760405162461bcd60e51b815260206004820152602c60248201527f436f6e73656e74466163746f72793a207468697320736c6f74206973206e6f7460448201526b081a5b9a5d1a585b1a5e995960a21b606482015260840162000750565b60208181018051600085815260fe8085526040808320875184528087528184206001908101959095558a84528184208481558086018590556002810180546001600160a01b03191690556003018490558751898552928752945183529385528382205585815260fb90935290822080549192909162001bf19084906200352d565b9250508190555060006001600160a01b031681604001516001600160a01b03166000805160206200450e833981519152878760405162000f6192919062003410565b336000908152610102602052604090205460ff16151560011462001c6b5760405162461bcd60e51b8152600401620007509062003371565b6001600160a01b038216600090815261010360209081526040808320848452825282208054600180820183558285529284200180546001600160a01b0319163317905591839052905462001cc091906200352d565b6001600160a01b0390921660009081526101046020908152604080832093835292815282822033835290522055565b600081815260c9602052604081206200071290620027ec565b6001600160a01b038416600090815261010360209081526040808320868452825291829020805483518184028101840190945280845260609362001d909387938793909183018282801562001a1e576020028201919060005260206000209081546001600160a01b03168152600190910190602001808311620019ff5750505050506200264f565b95945050505050565b60008281526097602052604090206001015462001db68162002586565b6200099c8383620025bb565b336000908152610102602052604090205460ff16151560011462001dfa5760405162461bcd60e51b8152600401620007509062003371565b60008260405160200162001e0f9190620033c1565b60408051601f198184030181529181528151602092830120600081815260fb9093529120549091501562001e9e5760405162461bcd60e51b815260206004820152602f60248201527f436f6e73656e74466163746f72793a20546869732074616720697320616c726560448201526e18591e481a5b9a5d1a585b1a5e9959608a1b606482015260840162000750565b600081815260fe60209081526040808320600019808552908352818420600101869055815160808101835290815291820192909252339181019190915260fc54606082019062001eef9042620033f5565b9052600082815260fe6020908152604080832086845282528083208451815584830151600180830191909155858301516002830180546001600160a01b0319166001600160a01b0390921691909117905560609095015160039091015582805280832086905584835260fb9091528120805490919062001f71908490620033f5565b909155505060405133906000906000805160206200450e8339815191529062001f9e908790879062003410565b60405180910390a3505050565b62001fb562002d10565b60008360405160200162001fca9190620033c1565b60408051601f198184030181528282528051602091820120600090815260fe825282812087825282528290206080840183528054845260018101549184019190915260028101546001600160a01b03169183019190915260030154606082015291505092915050565b6101055460ff546040516000926001600160a01b0390811692631b1492e160e11b926200206f929091169088908890889030906024016200355d565b60408051601f198184030181529181526020820180516001600160e01b03166001600160e01b0319909416939093179092529051620020ae9062002d41565b620020bb929190620035b3565b604051809103906000f080158015620020d8573d6000803e3d6000fd5b506001600160a01b03808216600081815261010260209081526040808320805460ff19166001908117909155948a1680845261010083529083208054808701825581855292842090920180546001600160a01b0319169094179093559190525491925082916200214991906200352d565b6001600160a01b038681166000818152610101602090815260408083209487168084529482528083209590955582825261010381528482207f044852b2a670ade5407e78fb2863c51de9fcb96542a07186fe3aeda6bb8a116d835281528482208054600180820183559184528284200180546001600160a01b031990811687179091557f65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a8452868420805480840182559085528385200180548216871790557fe2f4eaae4a9751e85a3e4a7b9587827a877f29914755229b07a7b2da98285f708452868420805480840182559085528385200180548216871790557f61a3517f153a09154844ed8be639dabc6e78dc22315c2d9a91f7eddf9398c0028452868420805492830181558452918320018054909116841790559251919290917f3386ce5565b3a847e6f22d2ab7aa20347cfda2d3dfbfb4534805ce4cbbdd50019190a35050505050565b6060806000846001600160401b03811115620022d157620022d162002db6565b6040519080825280602002602001820160405280156200230657816020015b6060815260200190600190039081620022f05790505b5090506000856001600160401b0381111562002326576200232662002db6565b6040519080825280602002602001820160405280156200236357816020015b6200234f62002d10565b815260200190600190039081620023455790505b5090506000886040516020016200237b9190620033c1565b60405160208183030381529060405280519060200120905060005b878110156200121057600082815260fe602090815260408083208c845282529182902082516080810184528154815260018201549281019290925260028101546001600160a01b03169282019290925260039091015460608201819052620024415760405162461bcd60e51b815260206004820152601c60248201527f436f6e73656e74466163746f72793a20696e76616c696420736c6f7400000000604482015260640162000750565b6001881515148015620024575750428160600151105b156200246457506200253a565b80604001516001600160a01b0316636c0360eb6040518163ffffffff1660e01b815260040160006040518083038186803b158015620024a257600080fd5b505afa158015620024b7573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f19168201604052620024e1919081019062003483565b858381518110620024f657620024f6620034f9565b602002602001018190525080848381518110620025175762002517620034f9565b6020908102919091010152805199506000198a141562002538575062001210565b505b8062002546816200350f565b91505062002396565b60006001600160e01b03198216637965db0b60e01b14806200071257506301ffc9a760e01b6001600160e01b031983161462000712565b620025928133620027f7565b50565b620025a182826200285b565b600082815260c9602052604090206200099c9082620028e5565b620025c78282620028fc565b600082815260c9602052604090206200099c908262002966565b600054610100900460ff166200260b5760405162461bcd60e51b81526004016200075090620035d9565b620026156200297d565b565b600054610100900460ff16620026155760405162461bcd60e51b81526004016200075090620035d9565b6000620017488383620029b3565b606083831015620026c95760405162461bcd60e51b815260206004820152603f60248201527f436f6e73656e74466163746f72793a20456e64696e6720696e646578206d757360448201527f74206265206c6172676572207468656e207374617274696e6720696e64657800606482015260840162000750565b8151620026d95750606062001748565b60018251620026e991906200352d565b8311156200270457600182516200270191906200352d565b92505b60006200271285856200352d565b6200271f906001620033f5565b6001600160401b0381111562002739576200273962002db6565b60405190808252806020026020018201604052801562002763578160200160208202803683370190505b5090506000855b858111620027e157848181518110620027875762002787620034f9565b6020026020010151838381518110620027a457620027a4620034f9565b6001600160a01b039092166020928302919091019091015281620027c8816200350f565b9250508080620027d8906200350f565b9150506200276a565b509095945050505050565b600062000712825490565b6200280382826200174f565b62000a1f576200281381620029e0565b62002820836020620029f3565b6040516020016200283392919062003624565b60408051601f198184030181529082905262461bcd60e51b825262000750916004016200369d565b6200286782826200174f565b62000a1f5760008281526097602090815260408083206001600160a01b03851684529091529020805460ff19166001179055620028a13390565b6001600160a01b0316816001600160a01b0316837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45050565b600062001748836001600160a01b03841662002bac565b6200290882826200174f565b1562000a1f5760008281526097602090815260408083206001600160a01b0385168085529252808320805460ff1916905551339285917ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b9190a45050565b600062001748836001600160a01b03841662002bfe565b600054610100900460ff16620029a75760405162461bcd60e51b81526004016200075090620035d9565b6033805460ff19169055565b6000826000018281548110620029cd57620029cd620034f9565b9060005260206000200154905092915050565b6060620007126001600160a01b03831660145b6060600062002a04836002620036b2565b62002a11906002620033f5565b6001600160401b0381111562002a2b5762002a2b62002db6565b6040519080825280601f01601f19166020018201604052801562002a56576020820181803683370190505b509050600360fc1b8160008151811062002a745762002a74620034f9565b60200101906001600160f81b031916908160001a905350600f60fb1b8160018151811062002aa65762002aa6620034f9565b60200101906001600160f81b031916908160001a905350600062002acc846002620036b2565b62002ad9906001620033f5565b90505b600181111562002b5b576f181899199a1a9b1b9c1cb0b131b232b360811b85600f166010811062002b115762002b11620034f9565b1a60f81b82828151811062002b2a5762002b2a620034f9565b60200101906001600160f81b031916908160001a90535060049490941c9362002b5381620036d4565b905062002adc565b508315620017485760405162461bcd60e51b815260206004820181905260248201527f537472696e67733a20686578206c656e67746820696e73756666696369656e74604482015260640162000750565b600081815260018301602052604081205462002bf55750815460018181018455600084815260208082209093018490558454848252828601909352604090209190915562000712565b50600062000712565b6000818152600183016020526040812054801562002cf757600062002c256001836200352d565b855490915060009062002c3b906001906200352d565b905081811462002ca757600086600001828154811062002c5f5762002c5f620034f9565b906000526020600020015490508087600001848154811062002c855762002c85620034f9565b6000918252602080832090910192909255918252600188019052604090208390555b855486908062002cbb5762002cbb62003547565b60019003818190600052602060002001600090559055856001016000868152602001908152602001600020600090556001935050505062000712565b600091505062000712565b6104e480620036ef83390190565b6040518060800160405280600081526020016000815260200160006001600160a01b03168152602001600081525090565b61093b8062003bd383390190565b60006020828403121562002d6257600080fd5b81356001600160e01b0319811681146200174857600080fd5b80356001600160a01b038116811462002d9357600080fd5b919050565b60006020828403121562002dab57600080fd5b620017488262002d7b565b634e487b7160e01b600052604160045260246000fd5b604051601f8201601f191681016001600160401b038111828210171562002df75762002df762002db6565b604052919050565b60006001600160401b0382111562002e1b5762002e1b62002db6565b50601f01601f191660200190565b600082601f83011262002e3b57600080fd5b813562002e5262002e4c8262002dff565b62002dcc565b81815284602083860101111562002e6857600080fd5b816020850160208301376000918101602001919091529392505050565b6000806040838503121562002e9957600080fd5b82356001600160401b0381111562002eb057600080fd5b62002ebe8582860162002e29565b95602094909401359450505050565b60006020828403121562002ee057600080fd5b5035919050565b6000806040838503121562002efb57600080fd5b8235915062002f0d6020840162002d7b565b90509250929050565b6000806040838503121562002f2a57600080fd5b62002f358362002d7b565b915062002f0d6020840162002d7b565b6000806040838503121562002f5957600080fd5b62002f648362002d7b565b946020939093013593505050565b60008060006060848603121562002f8857600080fd5b83356001600160401b0381111562002f9f57600080fd5b62002fad8682870162002e29565b9660208601359650604090950135949350505050565b6000806000806080858703121562002fda57600080fd5b84356001600160401b0381111562002ff157600080fd5b62002fff8782880162002e29565b9450506020850135925060408501359150606085013580151581146200302457600080fd5b939692955090935050565b60005b838110156200304c57818101518382015260200162003032565b838111156200305c576000848401525b50505050565b600081518084526200307c8160208601602086016200302f565b601f01601f19169290920160200192915050565b6000604082016040835280855180835260608501915060608160051b8601019250602080880160005b83811015620030eb57605f19888703018552620030d886835162003062565b95509382019390820190600101620030b9565b50508584038187015286518085528782019482019350915060005b8281101562003156576200314284865180518252602080820151908301526040808201516001600160a01b031690830152606090810151910152565b938101936080939093019260010162003106565b5091979650505050505050565b600080604083850312156200317757600080fd5b50508035926020909101359150565b6000806000606084860312156200319c57600080fd5b620031a78462002d7b565b95602085013595506040909401359392505050565b6020808252825182820181905260009190848201906040850190845b81811015620031ff5783516001600160a01b031683529284019291840191600101620031d8565b50909695505050505050565b6000602082840312156200321e57600080fd5b81356001600160401b038111156200323557600080fd5b62001a298482850162002e29565b6000806000606084860312156200325957600080fd5b620032648462002d7b565b9250602084013591506200327b6040850162002d7b565b90509250925092565b600080600080608085870312156200329b57600080fd5b620032a68562002d7b565b966020860135965060408601359560600135945092505050565b81518152602080830151908201526040808301516001600160a01b031690820152606080830151908201526080810162000712565b6000806000606084860312156200330b57600080fd5b620033168462002d7b565b925060208401356001600160401b03808211156200333357600080fd5b620033418783880162002e29565b935060408601359150808211156200335857600080fd5b50620033678682870162002e29565b9150509250925092565b60208082526030908201527f436f6e73656e74466163746f72793a2043616c6c6572206973206e6f7420612060408201526f10dbdb9cd95b9d0810dbdb9d1c9858dd60821b606082015260800190565b60008251620033d58184602087016200302f565b9190910192915050565b634e487b7160e01b600052601160045260246000fd5b600082198211156200340b576200340b620033df565b500190565b60408152600062003425604083018562003062565b90508260208301529392505050565b6020808252602f908201527f436f6e73656e74466163746f72793a205f6e6577536c6f74206d75737420626560408201526e02067726561746572207468616e203608c1b606082015260800190565b6000602082840312156200349657600080fd5b81516001600160401b03811115620034ad57600080fd5b8201601f81018413620034bf57600080fd5b8051620034d062002e4c8262002dff565b818152856020838501011115620034e657600080fd5b62001d908260208301602086016200302f565b634e487b7160e01b600052603260045260246000fd5b6000600019821415620035265762003526620033df565b5060010190565b600082821015620035425762003542620033df565b500390565b634e487b7160e01b600052603160045260246000fd5b600060018060a01b038088168352808716602084015260a060408401526200358960a084018762003062565b83810360608501526200359d818762003062565b9250508084166080840152509695505050505050565b6001600160a01b038316815260406020820181905260009062001a299083018462003062565b6020808252602b908201527f496e697469616c697a61626c653a20636f6e7472616374206973206e6f74206960408201526a6e697469616c697a696e6760a81b606082015260800190565b7f416363657373436f6e74726f6c3a206163636f756e74200000000000000000008152600083516200365e8160178501602088016200302f565b7001034b99036b4b9b9b4b733903937b6329607d1b6017918401918201528351620036918160288401602088016200302f565b01602801949350505050565b60208152600062001748602083018462003062565b6000816000190483118215151615620036cf57620036cf620033df565b500290565b600081620036e657620036e6620033df565b50600019019056fe608060405234801561001057600080fd5b506040516104e43803806104e483398101604081905261002f91610151565b61003833610047565b61004181610097565b50610181565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b6100aa8161014260201b6101a01760201c565b6101205760405162461bcd60e51b815260206004820152603360248201527f5570677261646561626c65426561636f6e3a20696d706c656d656e746174696f60448201527f6e206973206e6f74206120636f6e747261637400000000000000000000000000606482015260840160405180910390fd5b600180546001600160a01b0319166001600160a01b0392909216919091179055565b6001600160a01b03163b151590565b60006020828403121561016357600080fd5b81516001600160a01b038116811461017a57600080fd5b9392505050565b610354806101906000396000f3fe608060405234801561001057600080fd5b50600436106100575760003560e01c80633659cfe61461005c5780635c60da1b14610071578063715018a61461009a5780638da5cb5b146100a2578063f2fde38b146100b3575b600080fd5b61006f61006a3660046102ee565b6100c6565b005b6001546001600160a01b03165b6040516001600160a01b03909116815260200160405180910390f35b61006f61010e565b6000546001600160a01b031661007e565b61006f6100c13660046102ee565b610122565b6100ce6101af565b6100d781610209565b6040516001600160a01b038216907fbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b90600090a250565b6101166101af565b610120600061029e565b565b61012a6101af565b6001600160a01b0381166101945760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b60648201526084015b60405180910390fd5b61019d8161029e565b50565b6001600160a01b03163b151590565b6000546001600160a01b031633146101205760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604482015260640161018b565b6001600160a01b0381163b61027c5760405162461bcd60e51b815260206004820152603360248201527f5570677261646561626c65426561636f6e3a20696d706c656d656e746174696f6044820152721b881a5cc81b9bdd08184818dbdb9d1c9858dd606a1b606482015260840161018b565b600180546001600160a01b0319166001600160a01b0392909216919091179055565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b60006020828403121561030057600080fd5b81356001600160a01b038116811461031757600080fd5b939250505056fea264697066735822122037f5e761a584b5cfedfedcacdd35de142872479851fbaecf66f55a175ffa1d1d64736f6c63430008090033608060405260405161093b38038061093b8339810160408190526100229161047e565b61002e82826000610035565b50506105a8565b61003e8361010f565b6040516001600160a01b038416907f1cf3b03a6cf19fa2baba4df148e9dcabedea7f8a5c07840e207e5c089be95d3e90600090a260008251118061007f5750805b1561010a57610108836001600160a01b0316635c60da1b6040518163ffffffff1660e01b815260040160206040518083038186803b1580156100c057600080fd5b505afa1580156100d4573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906100f8919061053e565b836102c160201b6100291760201c565b505b505050565b610122816102ed60201b6100551760201c565b6101815760405162461bcd60e51b815260206004820152602560248201527f455243313936373a206e657720626561636f6e206973206e6f74206120636f6e6044820152641d1c9858dd60da1b60648201526084015b60405180910390fd5b610204816001600160a01b0316635c60da1b6040518163ffffffff1660e01b815260040160206040518083038186803b1580156101bd57600080fd5b505afa1580156101d1573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906101f5919061053e565b6102ed60201b6100551760201c565b6102695760405162461bcd60e51b815260206004820152603060248201527f455243313936373a20626561636f6e20696d706c656d656e746174696f6e206960448201526f1cc81b9bdd08184818dbdb9d1c9858dd60821b6064820152608401610178565b806102a07fa3f0ad74e5423aebfd80d3ef4346578335a9a72aeaee59ff6cb3582b35133d5060001b6102fc60201b6100641760201c565b80546001600160a01b0319166001600160a01b039290921691909117905550565b60606102e68383604051806060016040528060278152602001610914602791396102ff565b9392505050565b6001600160a01b03163b151590565b90565b6060600080856001600160a01b03168560405161031c9190610559565b600060405180830381855af49150503d8060008114610357576040519150601f19603f3d011682016040523d82523d6000602084013e61035c565b606091505b50909250905061036e86838387610378565b9695505050505050565b606083156103e45782516103dd576001600160a01b0385163b6103dd5760405162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e74726163740000006044820152606401610178565b50816103ee565b6103ee83836103f6565b949350505050565b8151156104065781518083602001fd5b8060405162461bcd60e51b81526004016101789190610575565b80516001600160a01b038116811461043757600080fd5b919050565b634e487b7160e01b600052604160045260246000fd5b60005b8381101561046d578181015183820152602001610455565b838111156101085750506000910152565b6000806040838503121561049157600080fd5b61049a83610420565b60208401519092506001600160401b03808211156104b757600080fd5b818501915085601f8301126104cb57600080fd5b8151818111156104dd576104dd61043c565b604051601f8201601f19908116603f011681019083821181831017156105055761050561043c565b8160405282815288602084870101111561051e57600080fd5b61052f836020830160208801610452565b80955050505050509250929050565b60006020828403121561055057600080fd5b6102e682610420565b6000825161056b818460208701610452565b9190910192915050565b6020815260008251806020840152610594816040850160208701610452565b601f01601f19169190910160400192915050565b61035d806105b76000396000f3fe60806040523661001357610011610017565b005b6100115b610027610022610067565b61010f565b565b606061004e838360405180606001604052806027815260200161030160279139610133565b9392505050565b6001600160a01b03163b151590565b90565b600061009a7fa3f0ad74e5423aebfd80d3ef4346578335a9a72aeaee59ff6cb3582b35133d50546001600160a01b031690565b6001600160a01b0316635c60da1b6040518163ffffffff1660e01b815260040160206040518083038186803b1580156100d257600080fd5b505afa1580156100e6573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061010a9190610258565b905090565b3660008037600080366000845af43d6000803e80801561012e573d6000f35b3d6000fd5b6060600080856001600160a01b03168560405161015091906102b1565b600060405180830381855af49150503d806000811461018b576040519150601f19603f3d011682016040523d82523d6000602084013e610190565b606091505b50915091506101a1868383876101ab565b9695505050505050565b6060831561021c578251610215576001600160a01b0385163b6102155760405162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e747261637400000060448201526064015b60405180910390fd5b5081610226565b610226838361022e565b949350505050565b81511561023e5781518083602001fd5b8060405162461bcd60e51b815260040161020c91906102cd565b60006020828403121561026a57600080fd5b81516001600160a01b038116811461004e57600080fd5b60005b8381101561029c578181015183820152602001610284565b838111156102ab576000848401525b50505050565b600082516102c3818460208701610281565b9190910192915050565b60208152600082518060208401526102ec816040850160208701610281565b601f01601f1916919091016040019291505056fe416464726573733a206c6f772d6c6576656c2064656c65676174652063616c6c206661696c6564a26469706673582212203b163e80fb6d2725d90c67ab296adb4976d35afe4e99831fd03cf02178370bee64736f6c63430008090033416464726573733a206c6f772d6c6576656c2064656c65676174652063616c6c206661696c6564d0231052a39e12006e39a6a3e2efefdbe9507c7e2178ab3c63b1a248f6949beaa264697066735822122010361c62607f06b11bfe2b023f01ce3218c64a60cbe623bfc7fb8567791c341a64736f6c63430008090033",
  deployedBytecode:
    "0x60806040523480156200001157600080fd5b5060043610620002795760003560e01c806391d148541162000155578063b8cab4aa11620000c7578063df118ac21162000086578063df118ac21462000657578063e50c201f146200066e578063e63ab1e91462000694578063e68122e214620006bc578063fba81d7414620006d357600080fd5b8063b8cab4aa14620005c1578063b9ed16ec14620005d8578063ca15c8731462000612578063d171f61a1462000629578063d547741f146200064057600080fd5b8063a8b2b8cd1162000114578063a8b2b8cd1462000521578063aa6311e71462000547578063ac97b7d2146200055e578063b164786c1462000575578063b89a0b24146200058c57600080fd5b806391d1485414620004a65780639d38c87b14620004bd5780639f83597b14620004d4578063a1faf0081462000501578063a217fddf146200051857600080fd5b806350ea66d411620001ef5780637659125311620001ae5780637659125314620004385780637da0a877146200044f5780637e2ec6d01462000463578063841a5c4814620004785780639010d07c146200048f57600080fd5b806350ea66d414620003cd5780635c975abb14620003d75780636887f58f14620003e35780636b1993b214620003fa57806371731b83146200042157600080fd5b80632f2ff15d116200023c5780632f2ff15d146200032957806336568abe1462000340578063485cc95514620003575780634cc1f7af146200036e5780634e69ec4f146200039e57600080fd5b806301ffc9a7146200027e5780631bcea2b314620002aa578063211b98bd14620002d1578063248a9ca314620002ea5780632850df1a146200031f575b600080fd5b620002956200028f36600462002d4f565b620006ea565b60405190151581526020015b60405180910390f35b62000295620002bb36600462002d98565b6101026020526000908152604090205460ff1681565b620002e8620002e236600462002e85565b62000718565b005b62000310620002fb36600462002ecd565b60009081526097602052604090206001015490565b604051908152602001620002a1565b6200031060fc5481565b620002e86200033a36600462002ee7565b62000973565b620002e86200035136600462002ee7565b620009a1565b620002e86200036836600462002f16565b62000a23565b620003856200037f36600462002f45565b62000c5b565b6040516001600160a01b039091168152602001620002a1565b62000310620003af36600462002f16565b61010160209081526000928352604080842090915290825290205481565b6200031060fd5481565b60335460ff1662000295565b620002e8620003f436600462002f72565b62000c95565b620004116200040b36600462002fc3565b62000f70565b604051620002a192919062003090565b620002e86200043236600462002f72565b6200121f565b620002e86200044936600462002f45565b620014ea565b60ff5462000385906001600160a01b031681565b6101055462000385906001600160a01b031681565b620002e86200048936600462002ecd565b6200171b565b62000385620004a036600462003163565b6200172e565b62000295620004b736600462002ee7565b6200174f565b620002e8620004ce36600462002e85565b6200177a565b62000310620004e536600462002d98565b6001600160a01b03166000908152610100602052604090205490565b620003856200051236600462003186565b62001953565b62000310600081565b620005386200053236600462003186565b6200199a565b604051620002a19190620031bc565b620002e86200055836600462002ecd565b62001a31565b620003106200056f3660046200320b565b62001a44565b620002e86200058636600462002e85565b62001a86565b620003106200059d36600462003243565b61010460209081526000938452604080852082529284528284209052825290205481565b620002e8620005d236600462002f45565b62001c33565b62000310620005e936600462002f45565b6001600160a01b0391909116600090815261010360209081526040808320938352929052205490565b620003106200062336600462002ecd565b62001cef565b620005386200063a36600462003284565b62001d08565b620002e86200065136600462002ee7565b62001d99565b620002e86200066836600462002e85565b62001dc2565b620006856200067f36600462002e85565b62001fab565b604051620002a19190620032c0565b620003107f65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a81565b620002e8620006cd366004620032f5565b62002033565b62000411620006e436600462002fc3565b620022b1565b60006001600160e01b03198216635a05180f60e01b148062000712575062000712826200254f565b92915050565b336000908152610102602052604090205460ff161515600114620007595760405162461bcd60e51b8152600401620007509062003371565b60405180910390fd5b6000826040516020016200076e9190620033c1565b60408051601f198184030181528282528051602091820120600081815260fe835283812087825283528390206080850184528054855260018101549285019290925260028201546001600160a01b0316928401929092526003015460608301819052909250620008365760405162461bcd60e51b815260206004820152602c60248201527f436f6e73656e74466163746f72793a2043616e6e6f74207265706c616365206160448201526b1b88195b5c1d1e481cdb1bdd60a21b606482015260840162000750565b80606001514211620008a35760405162461bcd60e51b815260206004820152602f60248201527f436f6e73656e74466163746f72793a2063757272656e74206c697374696e672060448201526e6973207374696c6c2061637469766560881b606482015260840162000750565b60405180608001604052808260000151815260200182602001518152602001336001600160a01b0316815260200160fc5442620008e19190620033f5565b9052600083815260fe6020908152604080832087845282529182902083518155908301516001820155828201516002820180546001600160a01b0319166001600160a01b03928316179055606090930151600390910155828101519051339291909116906000805160206200450e8339815191529062000965908890889062003410565b60405180910390a350505050565b600082815260976020526040902060010154620009908162002586565b6200099c838362002595565b505050565b6001600160a01b038116331462000a135760405162461bcd60e51b815260206004820152602f60248201527f416363657373436f6e74726f6c3a2063616e206f6e6c792072656e6f756e636560448201526e103937b632b9903337b91039b2b63360891b606482015260840162000750565b62000a1f8282620025bb565b5050565b600054610100900460ff161580801562000a445750600054600160ff909116105b8062000a605750303b15801562000a60575060005460ff166001145b62000ac55760405162461bcd60e51b815260206004820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201526d191e481a5b9a5d1a585b1a5e995960921b606482015260840162000750565b6000805460ff19166001179055801562000ae9576000805461ff0019166101001790555b62000af3620025e1565b62000afd62002617565b62000b0a60003362002595565b62000b367f65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a3362002595565b60008260405162000b479062002d02565b6001600160a01b039091168152602001604051809103906000f08015801562000b74573d6000803e3d6000fd5b5060405163f2fde38b60e01b81523360048201529091506001600160a01b0382169063f2fde38b90602401600060405180830381600087803b15801562000bba57600080fd5b505af115801562000bcf573d6000803e3d6000fd5b505061010580546001600160a01b03199081166001600160a01b039586161790915560ff80549091169387169390931790925550506212750060fc55601460fd5580156200099c576000805461ff0019169055604051600181527f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb38474024989060200160405180910390a1505050565b610100602052816000526040600020818154811062000c7957600080fd5b6000918252602090912001546001600160a01b03169150829050565b336000908152610102602052604090205460ff16151560011462000ccd5760405162461bcd60e51b8152600401620007509062003371565b6000811162000cf05760405162461bcd60e51b8152600401620007509062003434565b80821162000d675760405162461bcd60e51b815260206004820152603b60248201527f436f6e73656e74466163746f72793a205f6578697374696e67536c6f74206d7560448201527f73742062652067726561746572207468616e205f6e6577536c6f740000000000606482015260840162000750565b60008360405160200162000d7c9190620033c1565b60408051601f198184030181528282528051602091820120600081815260fe8352838120888252835283902060808501845280548552600181015492850183905260028101546001600160a01b0316938501939093526003909201546060840152909250831162000e565760405162461bcd60e51b815260206004820152603a60248201527f436f6e73656e74466163746f72793a205f6e6577536c6f74206973206c65737360448201527f207468616e206578697374696e674c697374696e672e6e657874000000000000606482015260840162000750565b600082815260fe602090815260408083208784528252918290206001018590558151608081018352838201518152908101869052339181019190915260fc54606082019062000ea69042620033f5565b9052600083815260fe602081815260408084208885528083528185208651815586840151600180830191909155878401516002830180546001600160a01b0319166001600160a01b0390921691909117905560609097015160039091015587855292825285820151845291815281832087905585835260fb90528120805490919062000f34908490620033f5565b909155505060405133906000906000805160206200450e8339815191529062000f61908990889062003410565b60405180910390a35050505050565b6060806000846001600160401b0381111562000f905762000f9062002db6565b60405190808252806020026020018201604052801562000fc557816020015b606081526020019060019003908162000faf5790505b5090506000856001600160401b0381111562000fe55762000fe562002db6565b6040519080825280602002602001820160405280156200102257816020015b6200100e62002d10565b815260200190600190039081620010045790505b5090506000886040516020016200103a9190620033c1565b60405160208183030381529060405280519060200120905060005b878110156200121057600082815260fe602090815260408083208c845282529182902082516080810184528154815260018201549281019290925260028101546001600160a01b03169282019290925260039091015460608201819052620011005760405162461bcd60e51b815260206004820152601c60248201527f436f6e73656e74466163746f72793a20696e76616c696420736c6f7400000000604482015260640162000750565b6001881515148015620011165750428160600151105b15620011235750620011fb565b80604001516001600160a01b0316636c0360eb6040518163ffffffff1660e01b815260040160006040518083038186803b1580156200116157600080fd5b505afa15801562001176573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f19168201604052620011a0919081019062003483565b858381518110620011b557620011b5620034f9565b602002602001018190525080848381518110620011d657620011d6620034f9565b6020026020010181905250806020015199508960001415620011f9575062001210565b505b8062001207816200350f565b91505062001055565b50919890975095505050505050565b336000908152610102602052604090205460ff161515600114620012575760405162461bcd60e51b8152600401620007509062003371565b600082116200127a5760405162461bcd60e51b8152600401620007509062003434565b808211620012f15760405162461bcd60e51b815260206004820152603b60248201527f436f6e73656e74466163746f72793a205f6e6577536c6f74206d75737420626560448201527f2067726561746572207468616e205f6578697374696e67536c6f740000000000606482015260840162000750565b600083604051602001620013069190620033c1565b60408051601f198184030181528282528051602091820120600081815260fe83528381208782528352839020608085018452805480865260018201549386019390935260028101546001600160a01b03169385019390935260039092015460608401529092508410620013ec5760405162461bcd60e51b815260206004820152604160248201527f436f6e73656e74466163746f72793a205f6e6577536c6f74206973206772656160448201527f746572207468616e206578697374696e674c697374696e672e70726576696f756064820152607360f81b608482015260a40162000750565b600082815260fe6020908152604080832084518452825291829020600101869055815160808101835283518152908101859052339181019190915260fc5460608201906200143b9042620033f5565b9052600083815260fe6020908152604080832088845282528083208451815584830151600180830191909155858301516002830180546001600160a01b0319166001600160a01b0390921691909117905560609095015160039091015586835280832088905585835260fb90915281208054909190620014bd908490620033f5565b909155505060405133906000906000805160206200450e8339815191529062000f61908990899062003410565b336000908152610102602052604090205460ff161515600114620015225760405162461bcd60e51b8152600401620007509062003371565b6001600160a01b0382166000908152610103602090815260408083208484528252808320805482518185028101850190935280835291929091908301828280156200159757602002820191906000526020600020905b81546001600160a01b0316815260019091019060200180831162001578575b5050506001600160a01b0386166000908152610104602090815260408083208884528252808320338452909152902054835193945092849250620015df91506001906200352d565b81518110620015f257620015f2620034f9565b6020908102919091018101516001600160a01b03861660009081526101038352604080822087835290935291909120805483908110620016365762001636620034f9565b600091825260208083209190910180546001600160a01b0319166001600160a01b03948516179055918616815261010482526040808220868352909252908120835183929085906200168b906001906200352d565b815181106200169e576200169e620034f9565b6020908102919091018101516001600160a01b039081168352828201939093526040918201600090812094909455918716835261010382528083208684529091529020805480620016f357620016f362003547565b600082815260209020810160001990810180546001600160a01b031916905501905550505050565b6000620017288162002586565b5060fc55565b600082815260c96020526040812062001748908362002641565b9392505050565b60009182526097602090815260408084206001600160a01b0393909316845291905290205460ff1690565b336000908152610102602052604090205460ff161515600114620017b25760405162461bcd60e51b8152600401620007509062003371565b600082604051602001620017c79190620033c1565b60408051601f198184030181528282528051602091820120600081815260fe835283812087825283528390206080850184528054855260018101549285019290925260028201546001600160a01b0316928401839052600390910154606084015292503314620018905760405162461bcd60e51b815260206004820152602d60248201527f436f6e73656e74466163746f72793a206f6e6c79206c697374696e67206f776e60448201526c65722063616e2072656d6f766560981b606482015260840162000750565b60208181018051600085815260fe8085526040808320875184528087528184206001908101959095558984528184208481558086018590556002810180546001600160a01b03191690556003018490558751898552928752945183529385528382205585815260fb909352908220805491929091620019119084906200352d565b9250508190555060006001600160a01b031681604001516001600160a01b03166000805160206200450e83398151915286866040516200096592919062003410565b61010360205282600052604060002060205281600052604060002081815481106200197d57600080fd5b6000918252602090912001546001600160a01b0316925083915050565b606062001a2983836101006000886001600160a01b03166001600160a01b0316815260200190815260200160002080548060200260200160405190810160405280929190818152602001828054801562001a1e57602002820191906000526020600020905b81546001600160a01b03168152600190910190602001808311620019ff575b50505050506200264f565b949350505050565b600062001a3e8162002586565b5060fd55565b6000808260405160200162001a5a9190620033c1565b60408051601f198184030181529181528151602092830120600090815260fb9092529020549392505050565b600062001a938162002586565b60008360405160200162001aa89190620033c1565b60408051601f198184030181528282528051602091820120600081815260fe835283812088825283528390206080850184528054855260018101549285019290925260028201546001600160a01b031692840192909252600301546060830181905290925062001b705760405162461bcd60e51b815260206004820152602c60248201527f436f6e73656e74466163746f72793a207468697320736c6f74206973206e6f7460448201526b081a5b9a5d1a585b1a5e995960a21b606482015260840162000750565b60208181018051600085815260fe8085526040808320875184528087528184206001908101959095558a84528184208481558086018590556002810180546001600160a01b03191690556003018490558751898552928752945183529385528382205585815260fb90935290822080549192909162001bf19084906200352d565b9250508190555060006001600160a01b031681604001516001600160a01b03166000805160206200450e833981519152878760405162000f6192919062003410565b336000908152610102602052604090205460ff16151560011462001c6b5760405162461bcd60e51b8152600401620007509062003371565b6001600160a01b038216600090815261010360209081526040808320848452825282208054600180820183558285529284200180546001600160a01b0319163317905591839052905462001cc091906200352d565b6001600160a01b0390921660009081526101046020908152604080832093835292815282822033835290522055565b600081815260c9602052604081206200071290620027ec565b6001600160a01b038416600090815261010360209081526040808320868452825291829020805483518184028101840190945280845260609362001d909387938793909183018282801562001a1e576020028201919060005260206000209081546001600160a01b03168152600190910190602001808311620019ff5750505050506200264f565b95945050505050565b60008281526097602052604090206001015462001db68162002586565b6200099c8383620025bb565b336000908152610102602052604090205460ff16151560011462001dfa5760405162461bcd60e51b8152600401620007509062003371565b60008260405160200162001e0f9190620033c1565b60408051601f198184030181529181528151602092830120600081815260fb9093529120549091501562001e9e5760405162461bcd60e51b815260206004820152602f60248201527f436f6e73656e74466163746f72793a20546869732074616720697320616c726560448201526e18591e481a5b9a5d1a585b1a5e9959608a1b606482015260840162000750565b600081815260fe60209081526040808320600019808552908352818420600101869055815160808101835290815291820192909252339181019190915260fc54606082019062001eef9042620033f5565b9052600082815260fe6020908152604080832086845282528083208451815584830151600180830191909155858301516002830180546001600160a01b0319166001600160a01b0390921691909117905560609095015160039091015582805280832086905584835260fb9091528120805490919062001f71908490620033f5565b909155505060405133906000906000805160206200450e8339815191529062001f9e908790879062003410565b60405180910390a3505050565b62001fb562002d10565b60008360405160200162001fca9190620033c1565b60408051601f198184030181528282528051602091820120600090815260fe825282812087825282528290206080840183528054845260018101549184019190915260028101546001600160a01b03169183019190915260030154606082015291505092915050565b6101055460ff546040516000926001600160a01b0390811692631b1492e160e11b926200206f929091169088908890889030906024016200355d565b60408051601f198184030181529181526020820180516001600160e01b03166001600160e01b0319909416939093179092529051620020ae9062002d41565b620020bb929190620035b3565b604051809103906000f080158015620020d8573d6000803e3d6000fd5b506001600160a01b03808216600081815261010260209081526040808320805460ff19166001908117909155948a1680845261010083529083208054808701825581855292842090920180546001600160a01b0319169094179093559190525491925082916200214991906200352d565b6001600160a01b038681166000818152610101602090815260408083209487168084529482528083209590955582825261010381528482207f044852b2a670ade5407e78fb2863c51de9fcb96542a07186fe3aeda6bb8a116d835281528482208054600180820183559184528284200180546001600160a01b031990811687179091557f65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a8452868420805480840182559085528385200180548216871790557fe2f4eaae4a9751e85a3e4a7b9587827a877f29914755229b07a7b2da98285f708452868420805480840182559085528385200180548216871790557f61a3517f153a09154844ed8be639dabc6e78dc22315c2d9a91f7eddf9398c0028452868420805492830181558452918320018054909116841790559251919290917f3386ce5565b3a847e6f22d2ab7aa20347cfda2d3dfbfb4534805ce4cbbdd50019190a35050505050565b6060806000846001600160401b03811115620022d157620022d162002db6565b6040519080825280602002602001820160405280156200230657816020015b6060815260200190600190039081620022f05790505b5090506000856001600160401b0381111562002326576200232662002db6565b6040519080825280602002602001820160405280156200236357816020015b6200234f62002d10565b815260200190600190039081620023455790505b5090506000886040516020016200237b9190620033c1565b60405160208183030381529060405280519060200120905060005b878110156200121057600082815260fe602090815260408083208c845282529182902082516080810184528154815260018201549281019290925260028101546001600160a01b03169282019290925260039091015460608201819052620024415760405162461bcd60e51b815260206004820152601c60248201527f436f6e73656e74466163746f72793a20696e76616c696420736c6f7400000000604482015260640162000750565b6001881515148015620024575750428160600151105b156200246457506200253a565b80604001516001600160a01b0316636c0360eb6040518163ffffffff1660e01b815260040160006040518083038186803b158015620024a257600080fd5b505afa158015620024b7573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f19168201604052620024e1919081019062003483565b858381518110620024f657620024f6620034f9565b602002602001018190525080848381518110620025175762002517620034f9565b6020908102919091010152805199506000198a141562002538575062001210565b505b8062002546816200350f565b91505062002396565b60006001600160e01b03198216637965db0b60e01b14806200071257506301ffc9a760e01b6001600160e01b031983161462000712565b620025928133620027f7565b50565b620025a182826200285b565b600082815260c9602052604090206200099c9082620028e5565b620025c78282620028fc565b600082815260c9602052604090206200099c908262002966565b600054610100900460ff166200260b5760405162461bcd60e51b81526004016200075090620035d9565b620026156200297d565b565b600054610100900460ff16620026155760405162461bcd60e51b81526004016200075090620035d9565b6000620017488383620029b3565b606083831015620026c95760405162461bcd60e51b815260206004820152603f60248201527f436f6e73656e74466163746f72793a20456e64696e6720696e646578206d757360448201527f74206265206c6172676572207468656e207374617274696e6720696e64657800606482015260840162000750565b8151620026d95750606062001748565b60018251620026e991906200352d565b8311156200270457600182516200270191906200352d565b92505b60006200271285856200352d565b6200271f906001620033f5565b6001600160401b0381111562002739576200273962002db6565b60405190808252806020026020018201604052801562002763578160200160208202803683370190505b5090506000855b858111620027e157848181518110620027875762002787620034f9565b6020026020010151838381518110620027a457620027a4620034f9565b6001600160a01b039092166020928302919091019091015281620027c8816200350f565b9250508080620027d8906200350f565b9150506200276a565b509095945050505050565b600062000712825490565b6200280382826200174f565b62000a1f576200281381620029e0565b62002820836020620029f3565b6040516020016200283392919062003624565b60408051601f198184030181529082905262461bcd60e51b825262000750916004016200369d565b6200286782826200174f565b62000a1f5760008281526097602090815260408083206001600160a01b03851684529091529020805460ff19166001179055620028a13390565b6001600160a01b0316816001600160a01b0316837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45050565b600062001748836001600160a01b03841662002bac565b6200290882826200174f565b1562000a1f5760008281526097602090815260408083206001600160a01b0385168085529252808320805460ff1916905551339285917ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b9190a45050565b600062001748836001600160a01b03841662002bfe565b600054610100900460ff16620029a75760405162461bcd60e51b81526004016200075090620035d9565b6033805460ff19169055565b6000826000018281548110620029cd57620029cd620034f9565b9060005260206000200154905092915050565b6060620007126001600160a01b03831660145b6060600062002a04836002620036b2565b62002a11906002620033f5565b6001600160401b0381111562002a2b5762002a2b62002db6565b6040519080825280601f01601f19166020018201604052801562002a56576020820181803683370190505b509050600360fc1b8160008151811062002a745762002a74620034f9565b60200101906001600160f81b031916908160001a905350600f60fb1b8160018151811062002aa65762002aa6620034f9565b60200101906001600160f81b031916908160001a905350600062002acc846002620036b2565b62002ad9906001620033f5565b90505b600181111562002b5b576f181899199a1a9b1b9c1cb0b131b232b360811b85600f166010811062002b115762002b11620034f9565b1a60f81b82828151811062002b2a5762002b2a620034f9565b60200101906001600160f81b031916908160001a90535060049490941c9362002b5381620036d4565b905062002adc565b508315620017485760405162461bcd60e51b815260206004820181905260248201527f537472696e67733a20686578206c656e67746820696e73756666696369656e74604482015260640162000750565b600081815260018301602052604081205462002bf55750815460018181018455600084815260208082209093018490558454848252828601909352604090209190915562000712565b50600062000712565b6000818152600183016020526040812054801562002cf757600062002c256001836200352d565b855490915060009062002c3b906001906200352d565b905081811462002ca757600086600001828154811062002c5f5762002c5f620034f9565b906000526020600020015490508087600001848154811062002c855762002c85620034f9565b6000918252602080832090910192909255918252600188019052604090208390555b855486908062002cbb5762002cbb62003547565b60019003818190600052602060002001600090559055856001016000868152602001908152602001600020600090556001935050505062000712565b600091505062000712565b6104e480620036ef83390190565b6040518060800160405280600081526020016000815260200160006001600160a01b03168152602001600081525090565b61093b8062003bd383390190565b60006020828403121562002d6257600080fd5b81356001600160e01b0319811681146200174857600080fd5b80356001600160a01b038116811462002d9357600080fd5b919050565b60006020828403121562002dab57600080fd5b620017488262002d7b565b634e487b7160e01b600052604160045260246000fd5b604051601f8201601f191681016001600160401b038111828210171562002df75762002df762002db6565b604052919050565b60006001600160401b0382111562002e1b5762002e1b62002db6565b50601f01601f191660200190565b600082601f83011262002e3b57600080fd5b813562002e5262002e4c8262002dff565b62002dcc565b81815284602083860101111562002e6857600080fd5b816020850160208301376000918101602001919091529392505050565b6000806040838503121562002e9957600080fd5b82356001600160401b0381111562002eb057600080fd5b62002ebe8582860162002e29565b95602094909401359450505050565b60006020828403121562002ee057600080fd5b5035919050565b6000806040838503121562002efb57600080fd5b8235915062002f0d6020840162002d7b565b90509250929050565b6000806040838503121562002f2a57600080fd5b62002f358362002d7b565b915062002f0d6020840162002d7b565b6000806040838503121562002f5957600080fd5b62002f648362002d7b565b946020939093013593505050565b60008060006060848603121562002f8857600080fd5b83356001600160401b0381111562002f9f57600080fd5b62002fad8682870162002e29565b9660208601359650604090950135949350505050565b6000806000806080858703121562002fda57600080fd5b84356001600160401b0381111562002ff157600080fd5b62002fff8782880162002e29565b9450506020850135925060408501359150606085013580151581146200302457600080fd5b939692955090935050565b60005b838110156200304c57818101518382015260200162003032565b838111156200305c576000848401525b50505050565b600081518084526200307c8160208601602086016200302f565b601f01601f19169290920160200192915050565b6000604082016040835280855180835260608501915060608160051b8601019250602080880160005b83811015620030eb57605f19888703018552620030d886835162003062565b95509382019390820190600101620030b9565b50508584038187015286518085528782019482019350915060005b8281101562003156576200314284865180518252602080820151908301526040808201516001600160a01b031690830152606090810151910152565b938101936080939093019260010162003106565b5091979650505050505050565b600080604083850312156200317757600080fd5b50508035926020909101359150565b6000806000606084860312156200319c57600080fd5b620031a78462002d7b565b95602085013595506040909401359392505050565b6020808252825182820181905260009190848201906040850190845b81811015620031ff5783516001600160a01b031683529284019291840191600101620031d8565b50909695505050505050565b6000602082840312156200321e57600080fd5b81356001600160401b038111156200323557600080fd5b62001a298482850162002e29565b6000806000606084860312156200325957600080fd5b620032648462002d7b565b9250602084013591506200327b6040850162002d7b565b90509250925092565b600080600080608085870312156200329b57600080fd5b620032a68562002d7b565b966020860135965060408601359560600135945092505050565b81518152602080830151908201526040808301516001600160a01b031690820152606080830151908201526080810162000712565b6000806000606084860312156200330b57600080fd5b620033168462002d7b565b925060208401356001600160401b03808211156200333357600080fd5b620033418783880162002e29565b935060408601359150808211156200335857600080fd5b50620033678682870162002e29565b9150509250925092565b60208082526030908201527f436f6e73656e74466163746f72793a2043616c6c6572206973206e6f7420612060408201526f10dbdb9cd95b9d0810dbdb9d1c9858dd60821b606082015260800190565b60008251620033d58184602087016200302f565b9190910192915050565b634e487b7160e01b600052601160045260246000fd5b600082198211156200340b576200340b620033df565b500190565b60408152600062003425604083018562003062565b90508260208301529392505050565b6020808252602f908201527f436f6e73656e74466163746f72793a205f6e6577536c6f74206d75737420626560408201526e02067726561746572207468616e203608c1b606082015260800190565b6000602082840312156200349657600080fd5b81516001600160401b03811115620034ad57600080fd5b8201601f81018413620034bf57600080fd5b8051620034d062002e4c8262002dff565b818152856020838501011115620034e657600080fd5b62001d908260208301602086016200302f565b634e487b7160e01b600052603260045260246000fd5b6000600019821415620035265762003526620033df565b5060010190565b600082821015620035425762003542620033df565b500390565b634e487b7160e01b600052603160045260246000fd5b600060018060a01b038088168352808716602084015260a060408401526200358960a084018762003062565b83810360608501526200359d818762003062565b9250508084166080840152509695505050505050565b6001600160a01b038316815260406020820181905260009062001a299083018462003062565b6020808252602b908201527f496e697469616c697a61626c653a20636f6e7472616374206973206e6f74206960408201526a6e697469616c697a696e6760a81b606082015260800190565b7f416363657373436f6e74726f6c3a206163636f756e74200000000000000000008152600083516200365e8160178501602088016200302f565b7001034b99036b4b9b9b4b733903937b6329607d1b6017918401918201528351620036918160288401602088016200302f565b01602801949350505050565b60208152600062001748602083018462003062565b6000816000190483118215151615620036cf57620036cf620033df565b500290565b600081620036e657620036e6620033df565b50600019019056fe608060405234801561001057600080fd5b506040516104e43803806104e483398101604081905261002f91610151565b61003833610047565b61004181610097565b50610181565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b6100aa8161014260201b6101a01760201c565b6101205760405162461bcd60e51b815260206004820152603360248201527f5570677261646561626c65426561636f6e3a20696d706c656d656e746174696f60448201527f6e206973206e6f74206120636f6e747261637400000000000000000000000000606482015260840160405180910390fd5b600180546001600160a01b0319166001600160a01b0392909216919091179055565b6001600160a01b03163b151590565b60006020828403121561016357600080fd5b81516001600160a01b038116811461017a57600080fd5b9392505050565b610354806101906000396000f3fe608060405234801561001057600080fd5b50600436106100575760003560e01c80633659cfe61461005c5780635c60da1b14610071578063715018a61461009a5780638da5cb5b146100a2578063f2fde38b146100b3575b600080fd5b61006f61006a3660046102ee565b6100c6565b005b6001546001600160a01b03165b6040516001600160a01b03909116815260200160405180910390f35b61006f61010e565b6000546001600160a01b031661007e565b61006f6100c13660046102ee565b610122565b6100ce6101af565b6100d781610209565b6040516001600160a01b038216907fbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b90600090a250565b6101166101af565b610120600061029e565b565b61012a6101af565b6001600160a01b0381166101945760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b60648201526084015b60405180910390fd5b61019d8161029e565b50565b6001600160a01b03163b151590565b6000546001600160a01b031633146101205760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604482015260640161018b565b6001600160a01b0381163b61027c5760405162461bcd60e51b815260206004820152603360248201527f5570677261646561626c65426561636f6e3a20696d706c656d656e746174696f6044820152721b881a5cc81b9bdd08184818dbdb9d1c9858dd606a1b606482015260840161018b565b600180546001600160a01b0319166001600160a01b0392909216919091179055565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b60006020828403121561030057600080fd5b81356001600160a01b038116811461031757600080fd5b939250505056fea264697066735822122037f5e761a584b5cfedfedcacdd35de142872479851fbaecf66f55a175ffa1d1d64736f6c63430008090033608060405260405161093b38038061093b8339810160408190526100229161047e565b61002e82826000610035565b50506105a8565b61003e8361010f565b6040516001600160a01b038416907f1cf3b03a6cf19fa2baba4df148e9dcabedea7f8a5c07840e207e5c089be95d3e90600090a260008251118061007f5750805b1561010a57610108836001600160a01b0316635c60da1b6040518163ffffffff1660e01b815260040160206040518083038186803b1580156100c057600080fd5b505afa1580156100d4573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906100f8919061053e565b836102c160201b6100291760201c565b505b505050565b610122816102ed60201b6100551760201c565b6101815760405162461bcd60e51b815260206004820152602560248201527f455243313936373a206e657720626561636f6e206973206e6f74206120636f6e6044820152641d1c9858dd60da1b60648201526084015b60405180910390fd5b610204816001600160a01b0316635c60da1b6040518163ffffffff1660e01b815260040160206040518083038186803b1580156101bd57600080fd5b505afa1580156101d1573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906101f5919061053e565b6102ed60201b6100551760201c565b6102695760405162461bcd60e51b815260206004820152603060248201527f455243313936373a20626561636f6e20696d706c656d656e746174696f6e206960448201526f1cc81b9bdd08184818dbdb9d1c9858dd60821b6064820152608401610178565b806102a07fa3f0ad74e5423aebfd80d3ef4346578335a9a72aeaee59ff6cb3582b35133d5060001b6102fc60201b6100641760201c565b80546001600160a01b0319166001600160a01b039290921691909117905550565b60606102e68383604051806060016040528060278152602001610914602791396102ff565b9392505050565b6001600160a01b03163b151590565b90565b6060600080856001600160a01b03168560405161031c9190610559565b600060405180830381855af49150503d8060008114610357576040519150601f19603f3d011682016040523d82523d6000602084013e61035c565b606091505b50909250905061036e86838387610378565b9695505050505050565b606083156103e45782516103dd576001600160a01b0385163b6103dd5760405162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e74726163740000006044820152606401610178565b50816103ee565b6103ee83836103f6565b949350505050565b8151156104065781518083602001fd5b8060405162461bcd60e51b81526004016101789190610575565b80516001600160a01b038116811461043757600080fd5b919050565b634e487b7160e01b600052604160045260246000fd5b60005b8381101561046d578181015183820152602001610455565b838111156101085750506000910152565b6000806040838503121561049157600080fd5b61049a83610420565b60208401519092506001600160401b03808211156104b757600080fd5b818501915085601f8301126104cb57600080fd5b8151818111156104dd576104dd61043c565b604051601f8201601f19908116603f011681019083821181831017156105055761050561043c565b8160405282815288602084870101111561051e57600080fd5b61052f836020830160208801610452565b80955050505050509250929050565b60006020828403121561055057600080fd5b6102e682610420565b6000825161056b818460208701610452565b9190910192915050565b6020815260008251806020840152610594816040850160208701610452565b601f01601f19169190910160400192915050565b61035d806105b76000396000f3fe60806040523661001357610011610017565b005b6100115b610027610022610067565b61010f565b565b606061004e838360405180606001604052806027815260200161030160279139610133565b9392505050565b6001600160a01b03163b151590565b90565b600061009a7fa3f0ad74e5423aebfd80d3ef4346578335a9a72aeaee59ff6cb3582b35133d50546001600160a01b031690565b6001600160a01b0316635c60da1b6040518163ffffffff1660e01b815260040160206040518083038186803b1580156100d257600080fd5b505afa1580156100e6573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061010a9190610258565b905090565b3660008037600080366000845af43d6000803e80801561012e573d6000f35b3d6000fd5b6060600080856001600160a01b03168560405161015091906102b1565b600060405180830381855af49150503d806000811461018b576040519150601f19603f3d011682016040523d82523d6000602084013e610190565b606091505b50915091506101a1868383876101ab565b9695505050505050565b6060831561021c578251610215576001600160a01b0385163b6102155760405162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e747261637400000060448201526064015b60405180910390fd5b5081610226565b610226838361022e565b949350505050565b81511561023e5781518083602001fd5b8060405162461bcd60e51b815260040161020c91906102cd565b60006020828403121561026a57600080fd5b81516001600160a01b038116811461004e57600080fd5b60005b8381101561029c578181015183820152602001610284565b838111156102ab576000848401525b50505050565b600082516102c3818460208701610281565b9190910192915050565b60208152600082518060208401526102ec816040850160208701610281565b601f01601f1916919091016040019291505056fe416464726573733a206c6f772d6c6576656c2064656c65676174652063616c6c206661696c6564a26469706673582212203b163e80fb6d2725d90c67ab296adb4976d35afe4e99831fd03cf02178370bee64736f6c63430008090033416464726573733a206c6f772d6c6576656c2064656c65676174652063616c6c206661696c6564d0231052a39e12006e39a6a3e2efefdbe9507c7e2178ab3c63b1a248f6949beaa264697066735822122010361c62607f06b11bfe2b023f01ce3218c64a60cbe623bfc7fb8567791c341a64736f6c63430008090033",
  linkReferences: {},
  deployedLinkReferences: {},
};
