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
    "0x608060405234801561001057600080fd5b50614ba8806100206000396000f3fe60806040523480156200001157600080fd5b5060043610620002a95760003560e01c806391d14854116200016d578063b9ed16ec11620000d3578063e50c201f1162000092578063e50c201f14620006dd578063e63ab1e91462000703578063e68122e2146200072b578063ebf120d31462000742578063f75a39a21462000759578063fba81d74146200077057600080fd5b8063b9ed16ec1462000647578063ca15c8731462000681578063d171f61a1462000698578063d547741f14620006af578063df118ac214620006c657600080fd5b8063a8b2b8cd116200012c578063a8b2b8cd1462000590578063aa6311e714620005b6578063ac97b7d214620005cd578063b164786c14620005e4578063b89a0b2414620005fb578063b8cab4aa146200063057600080fd5b806391d1485414620005155780639d38c87b146200052c5780639f83597b1462000543578063a1faf0081462000570578063a217fddf146200058757600080fd5b80635c975abb11620002135780637659125311620001d25780637659125314620004815780637da0a87714620004985780637e2ec6d014620004ac578063841a5c4814620004c15780638daad50814620004d85780639010d07c14620004fe57600080fd5b80635c975abb14620004075780636887f58f14620004135780636b1993b2146200042a5780636df515b8146200045157806371731b83146200046a57600080fd5b80632f2ff15d116200026c5780632f2ff15d146200035957806336568abe1462000370578063485cc95514620003875780634cc1f7af146200039e5780634e69ec4f14620003ce57806350ea66d414620003fd57600080fd5b806301ffc9a714620002ae5780631bcea2b314620002da578063211b98bd1462000301578063248a9ca3146200031a5780632850df1a146200034f575b600080fd5b620002c5620002bf3660046200330a565b62000787565b60405190151581526020015b60405180910390f35b620002c5620002eb36600462003353565b6101026020526000908152604090205460ff1681565b620003186200031236600462003440565b620007b5565b005b620003406200032b36600462003488565b60009081526097602052604090206001015490565b604051908152602001620002d1565b6200034060fc5481565b620003186200036a366004620034a2565b62000a10565b6200031862000381366004620034a2565b62000a3e565b6200031862000398366004620034d1565b62000ac0565b620003b5620003af36600462003500565b62000cf8565b6040516001600160a01b039091168152602001620002d1565b62000340620003df366004620034d1565b61010160209081526000928352604080842090915290825290205481565b6200034060fd5481565b60335460ff16620002c5565b62000318620004243660046200352d565b62000d32565b620004416200043b3660046200357e565b6200100f565b604051620002d1929190620036a4565b6200045b620012d2565b604051620002d1919062003731565b620003186200047b3660046200352d565b620013b6565b620003186200049236600462003500565b62001681565b60ff54620003b5906001600160a01b031681565b61010554620003b5906001600160a01b031681565b62000318620004d236600462003488565b620018b2565b620004ef620004e936600462003488565b620018c5565b604051620002d1919062003746565b620003b56200050f3660046200375b565b6200197b565b620002c562000526366004620034a2565b6200199c565b620003186200053d36600462003440565b620019c7565b620003406200055436600462003353565b6001600160a01b03166000908152610100602052604090205490565b620003b5620005813660046200377e565b62001ba0565b62000340600081565b620005a7620005a13660046200377e565b62001be7565b604051620002d19190620037b4565b62000318620005c736600462003488565b62001c7e565b62000340620005de36600462003803565b62001c91565b62000318620005f536600462003440565b62001cd3565b620003406200060c3660046200383b565b61010460209081526000938452604080852082529284528284209052825290205481565b620003186200064136600462003500565b62001e80565b620003406200065836600462003500565b6001600160a01b0391909116600090815261010360209081526040808320938352929052205490565b620003406200069236600462003488565b62001f3c565b620005a7620006a93660046200387c565b62001f55565b62000318620006c0366004620034a2565b62001fe6565b62000318620006d736600462003440565b6200200f565b620006f4620006ee36600462003440565b620021f8565b604051620002d19190620038b8565b620003407f65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a81565b620003186200073c366004620038ed565b62002280565b620003186200075336600462003969565b620024fe565b620003186200076a36600462003803565b6200261f565b62000441620007813660046200357e565b620026ed565b60006001600160e01b03198216635a05180f60e01b1480620007af5750620007af82620029a1565b92915050565b336000908152610102602052604090205460ff161515600114620007f65760405162461bcd60e51b8152600401620007ed906200398e565b60405180910390fd5b6000826040516020016200080b9190620039de565b60408051601f198184030181528282528051602091820120600081815260fe835283812087825283528390206080850184528054855260018101549285019290925260028201546001600160a01b0316928401929092526003015460608301819052909250620008d35760405162461bcd60e51b815260206004820152602c60248201527f436f6e73656e74466163746f72793a2043616e6e6f74207265706c616365206160448201526b1b88195b5c1d1e481cdb1bdd60a21b6064820152608401620007ed565b80606001514211620009405760405162461bcd60e51b815260206004820152602f60248201527f436f6e73656e74466163746f72793a2063757272656e74206c697374696e672060448201526e6973207374696c6c2061637469766560881b6064820152608401620007ed565b60405180608001604052808260000151815260200182602001518152602001336001600160a01b0316815260200160fc54426200097e919062003a12565b9052600083815260fe6020908152604080832087845282529182902083518155908301516001820155828201516002820180546001600160a01b0319166001600160a01b039283161790556060909301516003909101558281015190513392919091169060008051602062004b538339815191529062000a02908890889062003a2d565b60405180910390a350505050565b60008281526097602052604090206001015462000a2d81620029d8565b62000a398383620029e7565b505050565b6001600160a01b038116331462000ab05760405162461bcd60e51b815260206004820152602f60248201527f416363657373436f6e74726f6c3a2063616e206f6e6c792072656e6f756e636560448201526e103937b632b9903337b91039b2b63360891b6064820152608401620007ed565b62000abc828262002a0d565b5050565b600054610100900460ff161580801562000ae15750600054600160ff909116105b8062000afd5750303b15801562000afd575060005460ff166001145b62000b625760405162461bcd60e51b815260206004820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201526d191e481a5b9a5d1a585b1a5e995960921b6064820152608401620007ed565b6000805460ff19166001179055801562000b86576000805461ff0019166101001790555b62000b9062002a33565b62000b9a62002a69565b62000ba7600033620029e7565b62000bd37f65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a33620029e7565b60008260405162000be49062003154565b6001600160a01b039091168152602001604051809103906000f08015801562000c11573d6000803e3d6000fd5b5060405163f2fde38b60e01b81523360048201529091506001600160a01b0382169063f2fde38b90602401600060405180830381600087803b15801562000c5757600080fd5b505af115801562000c6c573d6000803e3d6000fd5b505061010580546001600160a01b03199081166001600160a01b039586161790915560ff80549091169387169390931790925550506212750060fc55601460fd55801562000a39576000805461ff0019169055604051600181527f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb38474024989060200160405180910390a1505050565b610100602052816000526040600020818154811062000d1657600080fd5b6000918252602090912001546001600160a01b03169150829050565b336000908152610102602052604090205460ff16151560011462000d6a5760405162461bcd60e51b8152600401620007ed906200398e565b6000811162000d8d5760405162461bcd60e51b8152600401620007ed9062003a51565b80821162000e045760405162461bcd60e51b815260206004820152603b60248201527f436f6e73656e74466163746f72793a205f6578697374696e67536c6f74206d7560448201527f73742062652067726561746572207468616e205f6e6577536c6f7400000000006064820152608401620007ed565b60008360405160200162000e199190620039de565b60408051601f198184030181528282528051602091820120600081815260fe8352838120888252835283902060808501845280548552600181015492850183905260028101546001600160a01b0316938501939093526003909201546060840152909250831162000ef35760405162461bcd60e51b815260206004820152603a60248201527f436f6e73656e74466163746f72793a205f6e6577536c6f74206973206c65737360448201527f207468616e206578697374696e674c697374696e672e6e6578740000000000006064820152608401620007ed565b600082815260fe6020908152604080832087845282529182902060010185905581516080810183528681528382015191810191909152339181019190915260fc54606082019062000f45904262003a12565b9052600083815260fe602081815260408084208885528083528185208651815586840151600180830191909155878401516002830180546001600160a01b0319166001600160a01b0390921691909117905560609097015160039091015587855292825285820151845291815281832087905585835260fb90528120805490919062000fd390849062003a12565b9091555050604051339060009060008051602062004b538339815191529062001000908990889062003a2d565b60405180910390a35050505050565b6060806000846001600160401b038111156200102f576200102f62003371565b6040519080825280602002602001820160405280156200106457816020015b60608152602001906001900390816200104e5790505b5090506000856001600160401b0381111562001084576200108462003371565b604051908082528060200260200182016040528015620010c157816020015b620010ad62003162565b815260200190600190039081620010a35790505b509050600088604051602001620010d99190620039de565b60405160208183030381529060405280519060200120905060005b87811015620012c357600082815260fe602090815260408083208c845282529182902082516080810184528154815260018201549281019290925260028101546001600160a01b031692820192909252600390910154606082018190526200119f5760405162461bcd60e51b815260206004820152601c60248201527f436f6e73656e74466163746f72793a20696e76616c696420736c6f74000000006044820152606401620007ed565b6001881515148015620011b55750428160600151105b15620011d6576020810151995089620011cf5750620012c3565b50620012ae565b80604001516001600160a01b0316636c0360eb6040518163ffffffff1660e01b815260040160006040518083038186803b1580156200121457600080fd5b505afa15801562001229573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f1916820160405262001253919081019062003aa0565b85838151811062001268576200126862003b16565b60200260200101819052508084838151811062001289576200128962003b16565b6020026020010181905250806020015199508960001415620012ac5750620012c3565b505b80620012ba8162003b2c565b915050620010f4565b50919890975095505050505050565b6060610106805480602002602001604051908101604052809291908181526020016000905b82821015620013ad578382906000526020600020018054620013199062003b4a565b80601f0160208091040260200160405190810160405280929190818152602001828054620013479062003b4a565b8015620013985780601f106200136c5761010080835404028352916020019162001398565b820191906000526020600020905b8154815290600101906020018083116200137a57829003601f168201915b505050505081526020019060010190620012f7565b50505050905090565b336000908152610102602052604090205460ff161515600114620013ee5760405162461bcd60e51b8152600401620007ed906200398e565b60008211620014115760405162461bcd60e51b8152600401620007ed9062003a51565b808211620014885760405162461bcd60e51b815260206004820152603b60248201527f436f6e73656e74466163746f72793a205f6e6577536c6f74206d75737420626560448201527f2067726561746572207468616e205f6578697374696e67536c6f7400000000006064820152608401620007ed565b6000836040516020016200149d9190620039de565b60408051601f198184030181528282528051602091820120600081815260fe83528381208782528352839020608085018452805480865260018201549386019390935260028101546001600160a01b03169385019390935260039092015460608401529092508410620015835760405162461bcd60e51b815260206004820152604160248201527f436f6e73656e74466163746f72793a205f6e6577536c6f74206973206772656160448201527f746572207468616e206578697374696e674c697374696e672e70726576696f756064820152607360f81b608482015260a401620007ed565b600082815260fe6020908152604080832084518452825291829020600101869055815160808101835283518152908101859052339181019190915260fc546060820190620015d2904262003a12565b9052600083815260fe6020908152604080832088845282528083208451815584830151600180830191909155858301516002830180546001600160a01b0319166001600160a01b0390921691909117905560609095015160039091015586835280832088905585835260fb909152812080549091906200165490849062003a12565b9091555050604051339060009060008051602062004b538339815191529062001000908990899062003a2d565b336000908152610102602052604090205460ff161515600114620016b95760405162461bcd60e51b8152600401620007ed906200398e565b6001600160a01b0382166000908152610103602090815260408083208484528252808320805482518185028101850190935280835291929091908301828280156200172e57602002820191906000526020600020905b81546001600160a01b031681526001909101906020018083116200170f575b5050506001600160a01b038616600090815261010460209081526040808320888452825280832033845290915290205483519394509284925062001776915060019062003b87565b8151811062001789576200178962003b16565b6020908102919091018101516001600160a01b03861660009081526101038352604080822087835290935291909120805483908110620017cd57620017cd62003b16565b600091825260208083209190910180546001600160a01b0319166001600160a01b0394851617905591861681526101048252604080822086835290925290812083518392908590620018229060019062003b87565b8151811062001835576200183562003b16565b6020908102919091018101516001600160a01b0390811683528282019390935260409182016000908120949094559187168352610103825280832086845290915290208054806200188a576200188a62003ba1565b600082815260209020810160001990810180546001600160a01b031916905501905550505050565b6000620018bf81620029d8565b5060fc55565b6101068181548110620018d757600080fd5b906000526020600020016000915090508054620018f49062003b4a565b80601f0160208091040260200160405190810160405280929190818152602001828054620019229062003b4a565b8015620019735780601f10620019475761010080835404028352916020019162001973565b820191906000526020600020905b8154815290600101906020018083116200195557829003601f168201915b505050505081565b600082815260c96020526040812062001995908362002a93565b9392505050565b60009182526097602090815260408084206001600160a01b0393909316845291905290205460ff1690565b336000908152610102602052604090205460ff161515600114620019ff5760405162461bcd60e51b8152600401620007ed906200398e565b60008260405160200162001a149190620039de565b60408051601f198184030181528282528051602091820120600081815260fe835283812087825283528390206080850184528054855260018101549285019290925260028201546001600160a01b031692840183905260039091015460608401529250331462001add5760405162461bcd60e51b815260206004820152602d60248201527f436f6e73656e74466163746f72793a206f6e6c79206c697374696e67206f776e60448201526c65722063616e2072656d6f766560981b6064820152608401620007ed565b60208181018051600085815260fe8085526040808320875184528087528184206001908101959095558984528184208481558086018590556002810180546001600160a01b03191690556003018490558751898552928752945183529385528382205585815260fb90935290822080549192909162001b5e90849062003b87565b9250508190555060006001600160a01b031681604001516001600160a01b031660008051602062004b53833981519152868660405162000a0292919062003a2d565b610103602052826000526040600020602052816000526040600020818154811062001bca57600080fd5b6000918252602090912001546001600160a01b0316925083915050565b606062001c7683836101006000886001600160a01b03166001600160a01b0316815260200190815260200160002080548060200260200160405190810160405280929190818152602001828054801562001c6b57602002820191906000526020600020905b81546001600160a01b0316815260019091019060200180831162001c4c575b505050505062002aa1565b949350505050565b600062001c8b81620029d8565b5060fd55565b6000808260405160200162001ca79190620039de565b60408051601f198184030181529181528151602092830120600090815260fb9092529020549392505050565b600062001ce081620029d8565b60008360405160200162001cf59190620039de565b60408051601f198184030181528282528051602091820120600081815260fe835283812088825283528390206080850184528054855260018101549285019290925260028201546001600160a01b031692840192909252600301546060830181905290925062001dbd5760405162461bcd60e51b815260206004820152602c60248201527f436f6e73656e74466163746f72793a207468697320736c6f74206973206e6f7460448201526b081a5b9a5d1a585b1a5e995960a21b6064820152608401620007ed565b60208181018051600085815260fe8085526040808320875184528087528184206001908101959095558a84528184208481558086018590556002810180546001600160a01b03191690556003018490558751898552928752945183529385528382205585815260fb90935290822080549192909162001e3e90849062003b87565b9250508190555060006001600160a01b031681604001516001600160a01b031660008051602062004b5383398151915287876040516200100092919062003a2d565b336000908152610102602052604090205460ff16151560011462001eb85760405162461bcd60e51b8152600401620007ed906200398e565b6001600160a01b038216600090815261010360209081526040808320848452825282208054600180820183558285529284200180546001600160a01b0319163317905591839052905462001f0d919062003b87565b6001600160a01b0390921660009081526101046020908152604080832093835292815282822033835290522055565b600081815260c960205260408120620007af9062002c3e565b6001600160a01b038416600090815261010360209081526040808320868452825291829020805483518184028101840190945280845260609362001fdd9387938793909183018282801562001c6b576020028201919060005260206000209081546001600160a01b0316815260019091019060200180831162001c4c57505050505062002aa1565b95945050505050565b6000828152609760205260409020600101546200200381620029d8565b62000a39838362002a0d565b336000908152610102602052604090205460ff161515600114620020475760405162461bcd60e51b8152600401620007ed906200398e565b6000826040516020016200205c9190620039de565b60408051601f198184030181529181528151602092830120600081815260fb90935291205490915015620020eb5760405162461bcd60e51b815260206004820152602f60248201527f436f6e73656e74466163746f72793a20546869732074616720697320616c726560448201526e18591e481a5b9a5d1a585b1a5e9959608a1b6064820152608401620007ed565b600081815260fe60209081526040808320600019808552908352818420600101869055815160808101835290815291820192909252339181019190915260fc5460608201906200213c904262003a12565b9052600082815260fe6020908152604080832086845282528083208451815584830151600180830191909155858301516002830180546001600160a01b0319166001600160a01b0390921691909117905560609095015160039091015582805280832086905584835260fb90915281208054909190620021be90849062003a12565b9091555050604051339060009060008051602062004b5383398151915290620021eb908790879062003a2d565b60405180910390a3505050565b6200220262003162565b600083604051602001620022179190620039de565b60408051601f198184030181528282528051602091820120600090815260fe825282812087825282528290206080840183528054845260018101549184019190915260028101546001600160a01b03169183019190915260030154606082015291505092915050565b6101055460ff546040516000926001600160a01b0390811692631b1492e160e11b92620022bc9290911690889088908890309060240162003bb7565b60408051601f198184030181529181526020820180516001600160e01b03166001600160e01b0319909416939093179092529051620022fb9062003193565b6200230892919062003c0d565b604051809103906000f08015801562002325573d6000803e3d6000fd5b506001600160a01b03808216600081815261010260209081526040808320805460ff19166001908117909155948a1680845261010083529083208054808701825581855292842090920180546001600160a01b03191690941790935591905254919250829162002396919062003b87565b6001600160a01b038681166000818152610101602090815260408083209487168084529482528083209590955582825261010381528482207f044852b2a670ade5407e78fb2863c51de9fcb96542a07186fe3aeda6bb8a116d835281528482208054600180820183559184528284200180546001600160a01b031990811687179091557f65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a8452868420805480840182559085528385200180548216871790557fe2f4eaae4a9751e85a3e4a7b9587827a877f29914755229b07a7b2da98285f708452868420805480840182559085528385200180548216871790557f61a3517f153a09154844ed8be639dabc6e78dc22315c2d9a91f7eddf9398c0028452868420805492830181558452918320018054909116841790559251919290917f3386ce5565b3a847e6f22d2ab7aa20347cfda2d3dfbfb4534805ce4cbbdd50019190a35050505050565b60006200250b81620029d8565b6101065460ff83161115620025765760405162461bcd60e51b815260206004820152602a60248201527f436f6e73656e743a205175657374696f6e6e6169726520696e646578206f7574604482015269206f6620626f756e647360b01b6064820152608401620007ed565b6101068054620025899060019062003b87565b815481106200259c576200259c62003b16565b906000526020600020016101068360ff1681548110620025c057620025c062003b16565b90600052602060002001908054620025d89062003b4a565b620025e5929190620031a1565b50610106805480620025fb57620025fb62003ba1565b60019003818190600052602060002001600062002619919062003237565b90555050565b60006200262c81620029d8565b61010654608011620026a75760405162461bcd60e51b815260206004820152603960248201527f436f6e73656e7420466163746f72793a204d6178696d756d206e756d6265722060448201527f6f66207175657374696f6e6e61697265732072656163686564000000000000006064820152608401620007ed565b6101068054600181018255600091909152825162000a39917fc9ef9fceea91e87b2c84ea400a44fde78842aae8aa24cd4b502ce5fb4d91e63b0190602085019062003276565b6060806000846001600160401b038111156200270d576200270d62003371565b6040519080825280602002602001820160405280156200274257816020015b60608152602001906001900390816200272c5790505b5090506000856001600160401b0381111562002762576200276262003371565b6040519080825280602002602001820160405280156200279f57816020015b6200278b62003162565b815260200190600190039081620027815790505b509050600088604051602001620027b79190620039de565b60405160208183030381529060405280519060200120905060005b87811015620012c357600082815260fe602090815260408083208c845282529182902082516080810184528154815260018201549281019290925260028101546001600160a01b031692820192909252600390910154606082018190526200287d5760405162461bcd60e51b815260206004820152601c60248201527f436f6e73656e74466163746f72793a20696e76616c696420736c6f74000000006044820152606401620007ed565b6001881515148015620028935750428160600151105b15620028b657805199506000198a1415620028af5750620012c3565b506200298c565b80604001516001600160a01b0316636c0360eb6040518163ffffffff1660e01b815260040160006040518083038186803b158015620028f457600080fd5b505afa15801562002909573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f1916820160405262002933919081019062003aa0565b85838151811062002948576200294862003b16565b60200260200101819052508084838151811062002969576200296962003b16565b6020908102919091010152805199506000198a14156200298a5750620012c3565b505b80620029988162003b2c565b915050620027d2565b60006001600160e01b03198216637965db0b60e01b1480620007af57506301ffc9a760e01b6001600160e01b0319831614620007af565b620029e4813362002c49565b50565b620029f3828262002cad565b600082815260c96020526040902062000a39908262002d37565b62002a19828262002d4e565b600082815260c96020526040902062000a39908262002db8565b600054610100900460ff1662002a5d5760405162461bcd60e51b8152600401620007ed9062003c33565b62002a6762002dcf565b565b600054610100900460ff1662002a675760405162461bcd60e51b8152600401620007ed9062003c33565b600062001995838362002e05565b60608383101562002b1b5760405162461bcd60e51b815260206004820152603f60248201527f436f6e73656e74466163746f72793a20456e64696e6720696e646578206d757360448201527f74206265206c6172676572207468656e207374617274696e6720696e646578006064820152608401620007ed565b815162002b2b5750606062001995565b6001825162002b3b919062003b87565b83111562002b56576001825162002b53919062003b87565b92505b600062002b64858562003b87565b62002b7190600162003a12565b6001600160401b0381111562002b8b5762002b8b62003371565b60405190808252806020026020018201604052801562002bb5578160200160208202803683370190505b5090506000855b85811162002c335784818151811062002bd95762002bd962003b16565b602002602001015183838151811062002bf65762002bf662003b16565b6001600160a01b03909216602092830291909101909101528162002c1a8162003b2c565b925050808062002c2a9062003b2c565b91505062002bbc565b509095945050505050565b6000620007af825490565b62002c5582826200199c565b62000abc5762002c658162002e32565b62002c7283602062002e45565b60405160200162002c8592919062003c7e565b60408051601f198184030181529082905262461bcd60e51b8252620007ed9160040162003746565b62002cb982826200199c565b62000abc5760008281526097602090815260408083206001600160a01b03851684529091529020805460ff1916600117905562002cf33390565b6001600160a01b0316816001600160a01b0316837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45050565b600062001995836001600160a01b03841662002ffe565b62002d5a82826200199c565b1562000abc5760008281526097602090815260408083206001600160a01b0385168085529252808320805460ff1916905551339285917ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b9190a45050565b600062001995836001600160a01b03841662003050565b600054610100900460ff1662002df95760405162461bcd60e51b8152600401620007ed9062003c33565b6033805460ff19169055565b600082600001828154811062002e1f5762002e1f62003b16565b9060005260206000200154905092915050565b6060620007af6001600160a01b03831660145b6060600062002e5683600262003cf7565b62002e6390600262003a12565b6001600160401b0381111562002e7d5762002e7d62003371565b6040519080825280601f01601f19166020018201604052801562002ea8576020820181803683370190505b509050600360fc1b8160008151811062002ec65762002ec662003b16565b60200101906001600160f81b031916908160001a905350600f60fb1b8160018151811062002ef85762002ef862003b16565b60200101906001600160f81b031916908160001a905350600062002f1e84600262003cf7565b62002f2b90600162003a12565b90505b600181111562002fad576f181899199a1a9b1b9c1cb0b131b232b360811b85600f166010811062002f635762002f6362003b16565b1a60f81b82828151811062002f7c5762002f7c62003b16565b60200101906001600160f81b031916908160001a90535060049490941c9362002fa58162003d19565b905062002f2e565b508315620019955760405162461bcd60e51b815260206004820181905260248201527f537472696e67733a20686578206c656e67746820696e73756666696369656e746044820152606401620007ed565b60008181526001830160205260408120546200304757508154600181810184556000848152602080822090930184905584548482528286019093526040902091909155620007af565b506000620007af565b60008181526001830160205260408120548015620031495760006200307760018362003b87565b85549091506000906200308d9060019062003b87565b9050818114620030f9576000866000018281548110620030b157620030b162003b16565b9060005260206000200154905080876000018481548110620030d757620030d762003b16565b6000918252602080832090910192909255918252600188019052604090208390555b85548690806200310d576200310d62003ba1565b600190038181906000526020600020016000905590558560010160008681526020019081526020016000206000905560019350505050620007af565b6000915050620007af565b6104e48062003d3483390190565b6040518060800160405280600081526020016000815260200160006001600160a01b03168152602001600081525090565b61093b806200421883390190565b828054620031af9062003b4a565b90600052602060002090601f016020900481019282620031d3576000855562003225565b82601f10620031e6578054855562003225565b828001600101855582156200322557600052602060002091601f016020900482015b828111156200322557825482559160010191906001019062003208565b5062003233929150620032f3565b5090565b508054620032459062003b4a565b6000825580601f1062003256575050565b601f016020900490600052602060002090810190620029e49190620032f3565b828054620032849062003b4a565b90600052602060002090601f016020900481019282620032a8576000855562003225565b82601f10620032c357805160ff191683800117855562003225565b8280016001018555821562003225579182015b8281111562003225578251825591602001919060010190620032d6565b5b80821115620032335760008155600101620032f4565b6000602082840312156200331d57600080fd5b81356001600160e01b0319811681146200199557600080fd5b80356001600160a01b03811681146200334e57600080fd5b919050565b6000602082840312156200336657600080fd5b620019958262003336565b634e487b7160e01b600052604160045260246000fd5b604051601f8201601f191681016001600160401b0381118282101715620033b257620033b262003371565b604052919050565b60006001600160401b03821115620033d657620033d662003371565b50601f01601f191660200190565b600082601f830112620033f657600080fd5b81356200340d6200340782620033ba565b62003387565b8181528460208386010111156200342357600080fd5b816020850160208301376000918101602001919091529392505050565b600080604083850312156200345457600080fd5b82356001600160401b038111156200346b57600080fd5b6200347985828601620033e4565b95602094909401359450505050565b6000602082840312156200349b57600080fd5b5035919050565b60008060408385031215620034b657600080fd5b82359150620034c86020840162003336565b90509250929050565b60008060408385031215620034e557600080fd5b620034f08362003336565b9150620034c86020840162003336565b600080604083850312156200351457600080fd5b6200351f8362003336565b946020939093013593505050565b6000806000606084860312156200354357600080fd5b83356001600160401b038111156200355a57600080fd5b6200356886828701620033e4565b9660208601359650604090950135949350505050565b600080600080608085870312156200359557600080fd5b84356001600160401b03811115620035ac57600080fd5b620035ba87828801620033e4565b945050602085013592506040850135915060608501358015158114620035df57600080fd5b939692955090935050565b60005b8381101562003607578181015183820152602001620035ed565b8381111562003617576000848401525b50505050565b6000815180845262003637816020860160208601620035ea565b601f01601f19169290920160200192915050565b600081518084526020808501808196508360051b8101915082860160005b8581101562003697578284038952620036848483516200361d565b9885019893509084019060010162003669565b5091979650505050505050565b604081526000620036b960408301856200364b565b82810360208481019190915284518083528582019282019060005b8181101562003724576200371083865180518252602080820151908301526040808201516001600160a01b031690830152606090810151910152565b9383019360809290920191600101620036d4565b5090979650505050505050565b6020815260006200199560208301846200364b565b6020815260006200199560208301846200361d565b600080604083850312156200376f57600080fd5b50508035926020909101359150565b6000806000606084860312156200379457600080fd5b6200379f8462003336565b95602085013595506040909401359392505050565b6020808252825182820181905260009190848201906040850190845b81811015620037f75783516001600160a01b031683529284019291840191600101620037d0565b50909695505050505050565b6000602082840312156200381657600080fd5b81356001600160401b038111156200382d57600080fd5b62001c7684828501620033e4565b6000806000606084860312156200385157600080fd5b6200385c8462003336565b925060208401359150620038736040850162003336565b90509250925092565b600080600080608085870312156200389357600080fd5b6200389e8562003336565b966020860135965060408601359560600135945092505050565b81518152602080830151908201526040808301516001600160a01b0316908201526060808301519082015260808101620007af565b6000806000606084860312156200390357600080fd5b6200390e8462003336565b925060208401356001600160401b03808211156200392b57600080fd5b6200393987838801620033e4565b935060408601359150808211156200395057600080fd5b506200395f86828701620033e4565b9150509250925092565b6000602082840312156200397c57600080fd5b813560ff811681146200199557600080fd5b60208082526030908201527f436f6e73656e74466163746f72793a2043616c6c6572206973206e6f7420612060408201526f10dbdb9cd95b9d0810dbdb9d1c9858dd60821b606082015260800190565b60008251620039f2818460208701620035ea565b9190910192915050565b634e487b7160e01b600052601160045260246000fd5b6000821982111562003a285762003a28620039fc565b500190565b60408152600062003a4260408301856200361d565b90508260208301529392505050565b6020808252602f908201527f436f6e73656e74466163746f72793a205f6e6577536c6f74206d75737420626560408201526e02067726561746572207468616e203608c1b606082015260800190565b60006020828403121562003ab357600080fd5b81516001600160401b0381111562003aca57600080fd5b8201601f8101841362003adc57600080fd5b805162003aed6200340782620033ba565b81815285602083850101111562003b0357600080fd5b62001fdd826020830160208601620035ea565b634e487b7160e01b600052603260045260246000fd5b600060001982141562003b435762003b43620039fc565b5060010190565b600181811c9082168062003b5f57607f821691505b6020821081141562003b8157634e487b7160e01b600052602260045260246000fd5b50919050565b60008282101562003b9c5762003b9c620039fc565b500390565b634e487b7160e01b600052603160045260246000fd5b600060018060a01b038088168352808716602084015260a0604084015262003be360a08401876200361d565b838103606085015262003bf781876200361d565b9250508084166080840152509695505050505050565b6001600160a01b038316815260406020820181905260009062001c76908301846200361d565b6020808252602b908201527f496e697469616c697a61626c653a20636f6e7472616374206973206e6f74206960408201526a6e697469616c697a696e6760a81b606082015260800190565b7f416363657373436f6e74726f6c3a206163636f756e742000000000000000000081526000835162003cb8816017850160208801620035ea565b7001034b99036b4b9b9b4b733903937b6329607d1b601791840191820152835162003ceb816028840160208801620035ea565b01602801949350505050565b600081600019048311821515161562003d145762003d14620039fc565b500290565b60008162003d2b5762003d2b620039fc565b50600019019056fe608060405234801561001057600080fd5b506040516104e43803806104e483398101604081905261002f91610151565b61003833610047565b61004181610097565b50610181565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b6100aa8161014260201b6101a01760201c565b6101205760405162461bcd60e51b815260206004820152603360248201527f5570677261646561626c65426561636f6e3a20696d706c656d656e746174696f60448201527f6e206973206e6f74206120636f6e747261637400000000000000000000000000606482015260840160405180910390fd5b600180546001600160a01b0319166001600160a01b0392909216919091179055565b6001600160a01b03163b151590565b60006020828403121561016357600080fd5b81516001600160a01b038116811461017a57600080fd5b9392505050565b610354806101906000396000f3fe608060405234801561001057600080fd5b50600436106100575760003560e01c80633659cfe61461005c5780635c60da1b14610071578063715018a61461009a5780638da5cb5b146100a2578063f2fde38b146100b3575b600080fd5b61006f61006a3660046102ee565b6100c6565b005b6001546001600160a01b03165b6040516001600160a01b03909116815260200160405180910390f35b61006f61010e565b6000546001600160a01b031661007e565b61006f6100c13660046102ee565b610122565b6100ce6101af565b6100d781610209565b6040516001600160a01b038216907fbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b90600090a250565b6101166101af565b610120600061029e565b565b61012a6101af565b6001600160a01b0381166101945760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b60648201526084015b60405180910390fd5b61019d8161029e565b50565b6001600160a01b03163b151590565b6000546001600160a01b031633146101205760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604482015260640161018b565b6001600160a01b0381163b61027c5760405162461bcd60e51b815260206004820152603360248201527f5570677261646561626c65426561636f6e3a20696d706c656d656e746174696f6044820152721b881a5cc81b9bdd08184818dbdb9d1c9858dd606a1b606482015260840161018b565b600180546001600160a01b0319166001600160a01b0392909216919091179055565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b60006020828403121561030057600080fd5b81356001600160a01b038116811461031757600080fd5b939250505056fea264697066735822122037f5e761a584b5cfedfedcacdd35de142872479851fbaecf66f55a175ffa1d1d64736f6c63430008090033608060405260405161093b38038061093b8339810160408190526100229161047e565b61002e82826000610035565b50506105a8565b61003e8361010f565b6040516001600160a01b038416907f1cf3b03a6cf19fa2baba4df148e9dcabedea7f8a5c07840e207e5c089be95d3e90600090a260008251118061007f5750805b1561010a57610108836001600160a01b0316635c60da1b6040518163ffffffff1660e01b815260040160206040518083038186803b1580156100c057600080fd5b505afa1580156100d4573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906100f8919061053e565b836102c160201b6100291760201c565b505b505050565b610122816102ed60201b6100551760201c565b6101815760405162461bcd60e51b815260206004820152602560248201527f455243313936373a206e657720626561636f6e206973206e6f74206120636f6e6044820152641d1c9858dd60da1b60648201526084015b60405180910390fd5b610204816001600160a01b0316635c60da1b6040518163ffffffff1660e01b815260040160206040518083038186803b1580156101bd57600080fd5b505afa1580156101d1573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906101f5919061053e565b6102ed60201b6100551760201c565b6102695760405162461bcd60e51b815260206004820152603060248201527f455243313936373a20626561636f6e20696d706c656d656e746174696f6e206960448201526f1cc81b9bdd08184818dbdb9d1c9858dd60821b6064820152608401610178565b806102a07fa3f0ad74e5423aebfd80d3ef4346578335a9a72aeaee59ff6cb3582b35133d5060001b6102fc60201b6100641760201c565b80546001600160a01b0319166001600160a01b039290921691909117905550565b60606102e68383604051806060016040528060278152602001610914602791396102ff565b9392505050565b6001600160a01b03163b151590565b90565b6060600080856001600160a01b03168560405161031c9190610559565b600060405180830381855af49150503d8060008114610357576040519150601f19603f3d011682016040523d82523d6000602084013e61035c565b606091505b50909250905061036e86838387610378565b9695505050505050565b606083156103e45782516103dd576001600160a01b0385163b6103dd5760405162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e74726163740000006044820152606401610178565b50816103ee565b6103ee83836103f6565b949350505050565b8151156104065781518083602001fd5b8060405162461bcd60e51b81526004016101789190610575565b80516001600160a01b038116811461043757600080fd5b919050565b634e487b7160e01b600052604160045260246000fd5b60005b8381101561046d578181015183820152602001610455565b838111156101085750506000910152565b6000806040838503121561049157600080fd5b61049a83610420565b60208401519092506001600160401b03808211156104b757600080fd5b818501915085601f8301126104cb57600080fd5b8151818111156104dd576104dd61043c565b604051601f8201601f19908116603f011681019083821181831017156105055761050561043c565b8160405282815288602084870101111561051e57600080fd5b61052f836020830160208801610452565b80955050505050509250929050565b60006020828403121561055057600080fd5b6102e682610420565b6000825161056b818460208701610452565b9190910192915050565b6020815260008251806020840152610594816040850160208701610452565b601f01601f19169190910160400192915050565b61035d806105b76000396000f3fe60806040523661001357610011610017565b005b6100115b610027610022610067565b61010f565b565b606061004e838360405180606001604052806027815260200161030160279139610133565b9392505050565b6001600160a01b03163b151590565b90565b600061009a7fa3f0ad74e5423aebfd80d3ef4346578335a9a72aeaee59ff6cb3582b35133d50546001600160a01b031690565b6001600160a01b0316635c60da1b6040518163ffffffff1660e01b815260040160206040518083038186803b1580156100d257600080fd5b505afa1580156100e6573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061010a9190610258565b905090565b3660008037600080366000845af43d6000803e80801561012e573d6000f35b3d6000fd5b6060600080856001600160a01b03168560405161015091906102b1565b600060405180830381855af49150503d806000811461018b576040519150601f19603f3d011682016040523d82523d6000602084013e610190565b606091505b50915091506101a1868383876101ab565b9695505050505050565b6060831561021c578251610215576001600160a01b0385163b6102155760405162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e747261637400000060448201526064015b60405180910390fd5b5081610226565b610226838361022e565b949350505050565b81511561023e5781518083602001fd5b8060405162461bcd60e51b815260040161020c91906102cd565b60006020828403121561026a57600080fd5b81516001600160a01b038116811461004e57600080fd5b60005b8381101561029c578181015183820152602001610284565b838111156102ab576000848401525b50505050565b600082516102c3818460208701610281565b9190910192915050565b60208152600082518060208401526102ec816040850160208701610281565b601f01601f1916919091016040019291505056fe416464726573733a206c6f772d6c6576656c2064656c65676174652063616c6c206661696c6564a26469706673582212203b163e80fb6d2725d90c67ab296adb4976d35afe4e99831fd03cf02178370bee64736f6c63430008090033416464726573733a206c6f772d6c6576656c2064656c65676174652063616c6c206661696c6564d0231052a39e12006e39a6a3e2efefdbe9507c7e2178ab3c63b1a248f6949beaa2646970667358221220a22777f857495d0273afa2e49ac6da860cb7283a1a522a03c3f4279fc7f211fc64736f6c63430008090033",
  deployedBytecode:
    "0x60806040523480156200001157600080fd5b5060043610620002a95760003560e01c806391d14854116200016d578063b9ed16ec11620000d3578063e50c201f1162000092578063e50c201f14620006dd578063e63ab1e91462000703578063e68122e2146200072b578063ebf120d31462000742578063f75a39a21462000759578063fba81d74146200077057600080fd5b8063b9ed16ec1462000647578063ca15c8731462000681578063d171f61a1462000698578063d547741f14620006af578063df118ac214620006c657600080fd5b8063a8b2b8cd116200012c578063a8b2b8cd1462000590578063aa6311e714620005b6578063ac97b7d214620005cd578063b164786c14620005e4578063b89a0b2414620005fb578063b8cab4aa146200063057600080fd5b806391d1485414620005155780639d38c87b146200052c5780639f83597b1462000543578063a1faf0081462000570578063a217fddf146200058757600080fd5b80635c975abb11620002135780637659125311620001d25780637659125314620004815780637da0a87714620004985780637e2ec6d014620004ac578063841a5c4814620004c15780638daad50814620004d85780639010d07c14620004fe57600080fd5b80635c975abb14620004075780636887f58f14620004135780636b1993b2146200042a5780636df515b8146200045157806371731b83146200046a57600080fd5b80632f2ff15d116200026c5780632f2ff15d146200035957806336568abe1462000370578063485cc95514620003875780634cc1f7af146200039e5780634e69ec4f14620003ce57806350ea66d414620003fd57600080fd5b806301ffc9a714620002ae5780631bcea2b314620002da578063211b98bd1462000301578063248a9ca3146200031a5780632850df1a146200034f575b600080fd5b620002c5620002bf3660046200330a565b62000787565b60405190151581526020015b60405180910390f35b620002c5620002eb36600462003353565b6101026020526000908152604090205460ff1681565b620003186200031236600462003440565b620007b5565b005b620003406200032b36600462003488565b60009081526097602052604090206001015490565b604051908152602001620002d1565b6200034060fc5481565b620003186200036a366004620034a2565b62000a10565b6200031862000381366004620034a2565b62000a3e565b6200031862000398366004620034d1565b62000ac0565b620003b5620003af36600462003500565b62000cf8565b6040516001600160a01b039091168152602001620002d1565b62000340620003df366004620034d1565b61010160209081526000928352604080842090915290825290205481565b6200034060fd5481565b60335460ff16620002c5565b62000318620004243660046200352d565b62000d32565b620004416200043b3660046200357e565b6200100f565b604051620002d1929190620036a4565b6200045b620012d2565b604051620002d1919062003731565b620003186200047b3660046200352d565b620013b6565b620003186200049236600462003500565b62001681565b60ff54620003b5906001600160a01b031681565b61010554620003b5906001600160a01b031681565b62000318620004d236600462003488565b620018b2565b620004ef620004e936600462003488565b620018c5565b604051620002d1919062003746565b620003b56200050f3660046200375b565b6200197b565b620002c562000526366004620034a2565b6200199c565b620003186200053d36600462003440565b620019c7565b620003406200055436600462003353565b6001600160a01b03166000908152610100602052604090205490565b620003b5620005813660046200377e565b62001ba0565b62000340600081565b620005a7620005a13660046200377e565b62001be7565b604051620002d19190620037b4565b62000318620005c736600462003488565b62001c7e565b62000340620005de36600462003803565b62001c91565b62000318620005f536600462003440565b62001cd3565b620003406200060c3660046200383b565b61010460209081526000938452604080852082529284528284209052825290205481565b620003186200064136600462003500565b62001e80565b620003406200065836600462003500565b6001600160a01b0391909116600090815261010360209081526040808320938352929052205490565b620003406200069236600462003488565b62001f3c565b620005a7620006a93660046200387c565b62001f55565b62000318620006c0366004620034a2565b62001fe6565b62000318620006d736600462003440565b6200200f565b620006f4620006ee36600462003440565b620021f8565b604051620002d19190620038b8565b620003407f65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a81565b620003186200073c366004620038ed565b62002280565b620003186200075336600462003969565b620024fe565b620003186200076a36600462003803565b6200261f565b62000441620007813660046200357e565b620026ed565b60006001600160e01b03198216635a05180f60e01b1480620007af5750620007af82620029a1565b92915050565b336000908152610102602052604090205460ff161515600114620007f65760405162461bcd60e51b8152600401620007ed906200398e565b60405180910390fd5b6000826040516020016200080b9190620039de565b60408051601f198184030181528282528051602091820120600081815260fe835283812087825283528390206080850184528054855260018101549285019290925260028201546001600160a01b0316928401929092526003015460608301819052909250620008d35760405162461bcd60e51b815260206004820152602c60248201527f436f6e73656e74466163746f72793a2043616e6e6f74207265706c616365206160448201526b1b88195b5c1d1e481cdb1bdd60a21b6064820152608401620007ed565b80606001514211620009405760405162461bcd60e51b815260206004820152602f60248201527f436f6e73656e74466163746f72793a2063757272656e74206c697374696e672060448201526e6973207374696c6c2061637469766560881b6064820152608401620007ed565b60405180608001604052808260000151815260200182602001518152602001336001600160a01b0316815260200160fc54426200097e919062003a12565b9052600083815260fe6020908152604080832087845282529182902083518155908301516001820155828201516002820180546001600160a01b0319166001600160a01b039283161790556060909301516003909101558281015190513392919091169060008051602062004b538339815191529062000a02908890889062003a2d565b60405180910390a350505050565b60008281526097602052604090206001015462000a2d81620029d8565b62000a398383620029e7565b505050565b6001600160a01b038116331462000ab05760405162461bcd60e51b815260206004820152602f60248201527f416363657373436f6e74726f6c3a2063616e206f6e6c792072656e6f756e636560448201526e103937b632b9903337b91039b2b63360891b6064820152608401620007ed565b62000abc828262002a0d565b5050565b600054610100900460ff161580801562000ae15750600054600160ff909116105b8062000afd5750303b15801562000afd575060005460ff166001145b62000b625760405162461bcd60e51b815260206004820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201526d191e481a5b9a5d1a585b1a5e995960921b6064820152608401620007ed565b6000805460ff19166001179055801562000b86576000805461ff0019166101001790555b62000b9062002a33565b62000b9a62002a69565b62000ba7600033620029e7565b62000bd37f65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a33620029e7565b60008260405162000be49062003154565b6001600160a01b039091168152602001604051809103906000f08015801562000c11573d6000803e3d6000fd5b5060405163f2fde38b60e01b81523360048201529091506001600160a01b0382169063f2fde38b90602401600060405180830381600087803b15801562000c5757600080fd5b505af115801562000c6c573d6000803e3d6000fd5b505061010580546001600160a01b03199081166001600160a01b039586161790915560ff80549091169387169390931790925550506212750060fc55601460fd55801562000a39576000805461ff0019169055604051600181527f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb38474024989060200160405180910390a1505050565b610100602052816000526040600020818154811062000d1657600080fd5b6000918252602090912001546001600160a01b03169150829050565b336000908152610102602052604090205460ff16151560011462000d6a5760405162461bcd60e51b8152600401620007ed906200398e565b6000811162000d8d5760405162461bcd60e51b8152600401620007ed9062003a51565b80821162000e045760405162461bcd60e51b815260206004820152603b60248201527f436f6e73656e74466163746f72793a205f6578697374696e67536c6f74206d7560448201527f73742062652067726561746572207468616e205f6e6577536c6f7400000000006064820152608401620007ed565b60008360405160200162000e199190620039de565b60408051601f198184030181528282528051602091820120600081815260fe8352838120888252835283902060808501845280548552600181015492850183905260028101546001600160a01b0316938501939093526003909201546060840152909250831162000ef35760405162461bcd60e51b815260206004820152603a60248201527f436f6e73656e74466163746f72793a205f6e6577536c6f74206973206c65737360448201527f207468616e206578697374696e674c697374696e672e6e6578740000000000006064820152608401620007ed565b600082815260fe6020908152604080832087845282529182902060010185905581516080810183528681528382015191810191909152339181019190915260fc54606082019062000f45904262003a12565b9052600083815260fe602081815260408084208885528083528185208651815586840151600180830191909155878401516002830180546001600160a01b0319166001600160a01b0390921691909117905560609097015160039091015587855292825285820151845291815281832087905585835260fb90528120805490919062000fd390849062003a12565b9091555050604051339060009060008051602062004b538339815191529062001000908990889062003a2d565b60405180910390a35050505050565b6060806000846001600160401b038111156200102f576200102f62003371565b6040519080825280602002602001820160405280156200106457816020015b60608152602001906001900390816200104e5790505b5090506000856001600160401b0381111562001084576200108462003371565b604051908082528060200260200182016040528015620010c157816020015b620010ad62003162565b815260200190600190039081620010a35790505b509050600088604051602001620010d99190620039de565b60405160208183030381529060405280519060200120905060005b87811015620012c357600082815260fe602090815260408083208c845282529182902082516080810184528154815260018201549281019290925260028101546001600160a01b031692820192909252600390910154606082018190526200119f5760405162461bcd60e51b815260206004820152601c60248201527f436f6e73656e74466163746f72793a20696e76616c696420736c6f74000000006044820152606401620007ed565b6001881515148015620011b55750428160600151105b15620011d6576020810151995089620011cf5750620012c3565b50620012ae565b80604001516001600160a01b0316636c0360eb6040518163ffffffff1660e01b815260040160006040518083038186803b1580156200121457600080fd5b505afa15801562001229573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f1916820160405262001253919081019062003aa0565b85838151811062001268576200126862003b16565b60200260200101819052508084838151811062001289576200128962003b16565b6020026020010181905250806020015199508960001415620012ac5750620012c3565b505b80620012ba8162003b2c565b915050620010f4565b50919890975095505050505050565b6060610106805480602002602001604051908101604052809291908181526020016000905b82821015620013ad578382906000526020600020018054620013199062003b4a565b80601f0160208091040260200160405190810160405280929190818152602001828054620013479062003b4a565b8015620013985780601f106200136c5761010080835404028352916020019162001398565b820191906000526020600020905b8154815290600101906020018083116200137a57829003601f168201915b505050505081526020019060010190620012f7565b50505050905090565b336000908152610102602052604090205460ff161515600114620013ee5760405162461bcd60e51b8152600401620007ed906200398e565b60008211620014115760405162461bcd60e51b8152600401620007ed9062003a51565b808211620014885760405162461bcd60e51b815260206004820152603b60248201527f436f6e73656e74466163746f72793a205f6e6577536c6f74206d75737420626560448201527f2067726561746572207468616e205f6578697374696e67536c6f7400000000006064820152608401620007ed565b6000836040516020016200149d9190620039de565b60408051601f198184030181528282528051602091820120600081815260fe83528381208782528352839020608085018452805480865260018201549386019390935260028101546001600160a01b03169385019390935260039092015460608401529092508410620015835760405162461bcd60e51b815260206004820152604160248201527f436f6e73656e74466163746f72793a205f6e6577536c6f74206973206772656160448201527f746572207468616e206578697374696e674c697374696e672e70726576696f756064820152607360f81b608482015260a401620007ed565b600082815260fe6020908152604080832084518452825291829020600101869055815160808101835283518152908101859052339181019190915260fc546060820190620015d2904262003a12565b9052600083815260fe6020908152604080832088845282528083208451815584830151600180830191909155858301516002830180546001600160a01b0319166001600160a01b0390921691909117905560609095015160039091015586835280832088905585835260fb909152812080549091906200165490849062003a12565b9091555050604051339060009060008051602062004b538339815191529062001000908990899062003a2d565b336000908152610102602052604090205460ff161515600114620016b95760405162461bcd60e51b8152600401620007ed906200398e565b6001600160a01b0382166000908152610103602090815260408083208484528252808320805482518185028101850190935280835291929091908301828280156200172e57602002820191906000526020600020905b81546001600160a01b031681526001909101906020018083116200170f575b5050506001600160a01b038616600090815261010460209081526040808320888452825280832033845290915290205483519394509284925062001776915060019062003b87565b8151811062001789576200178962003b16565b6020908102919091018101516001600160a01b03861660009081526101038352604080822087835290935291909120805483908110620017cd57620017cd62003b16565b600091825260208083209190910180546001600160a01b0319166001600160a01b0394851617905591861681526101048252604080822086835290925290812083518392908590620018229060019062003b87565b8151811062001835576200183562003b16565b6020908102919091018101516001600160a01b0390811683528282019390935260409182016000908120949094559187168352610103825280832086845290915290208054806200188a576200188a62003ba1565b600082815260209020810160001990810180546001600160a01b031916905501905550505050565b6000620018bf81620029d8565b5060fc55565b6101068181548110620018d757600080fd5b906000526020600020016000915090508054620018f49062003b4a565b80601f0160208091040260200160405190810160405280929190818152602001828054620019229062003b4a565b8015620019735780601f10620019475761010080835404028352916020019162001973565b820191906000526020600020905b8154815290600101906020018083116200195557829003601f168201915b505050505081565b600082815260c96020526040812062001995908362002a93565b9392505050565b60009182526097602090815260408084206001600160a01b0393909316845291905290205460ff1690565b336000908152610102602052604090205460ff161515600114620019ff5760405162461bcd60e51b8152600401620007ed906200398e565b60008260405160200162001a149190620039de565b60408051601f198184030181528282528051602091820120600081815260fe835283812087825283528390206080850184528054855260018101549285019290925260028201546001600160a01b031692840183905260039091015460608401529250331462001add5760405162461bcd60e51b815260206004820152602d60248201527f436f6e73656e74466163746f72793a206f6e6c79206c697374696e67206f776e60448201526c65722063616e2072656d6f766560981b6064820152608401620007ed565b60208181018051600085815260fe8085526040808320875184528087528184206001908101959095558984528184208481558086018590556002810180546001600160a01b03191690556003018490558751898552928752945183529385528382205585815260fb90935290822080549192909162001b5e90849062003b87565b9250508190555060006001600160a01b031681604001516001600160a01b031660008051602062004b53833981519152868660405162000a0292919062003a2d565b610103602052826000526040600020602052816000526040600020818154811062001bca57600080fd5b6000918252602090912001546001600160a01b0316925083915050565b606062001c7683836101006000886001600160a01b03166001600160a01b0316815260200190815260200160002080548060200260200160405190810160405280929190818152602001828054801562001c6b57602002820191906000526020600020905b81546001600160a01b0316815260019091019060200180831162001c4c575b505050505062002aa1565b949350505050565b600062001c8b81620029d8565b5060fd55565b6000808260405160200162001ca79190620039de565b60408051601f198184030181529181528151602092830120600090815260fb9092529020549392505050565b600062001ce081620029d8565b60008360405160200162001cf59190620039de565b60408051601f198184030181528282528051602091820120600081815260fe835283812088825283528390206080850184528054855260018101549285019290925260028201546001600160a01b031692840192909252600301546060830181905290925062001dbd5760405162461bcd60e51b815260206004820152602c60248201527f436f6e73656e74466163746f72793a207468697320736c6f74206973206e6f7460448201526b081a5b9a5d1a585b1a5e995960a21b6064820152608401620007ed565b60208181018051600085815260fe8085526040808320875184528087528184206001908101959095558a84528184208481558086018590556002810180546001600160a01b03191690556003018490558751898552928752945183529385528382205585815260fb90935290822080549192909162001e3e90849062003b87565b9250508190555060006001600160a01b031681604001516001600160a01b031660008051602062004b5383398151915287876040516200100092919062003a2d565b336000908152610102602052604090205460ff16151560011462001eb85760405162461bcd60e51b8152600401620007ed906200398e565b6001600160a01b038216600090815261010360209081526040808320848452825282208054600180820183558285529284200180546001600160a01b0319163317905591839052905462001f0d919062003b87565b6001600160a01b0390921660009081526101046020908152604080832093835292815282822033835290522055565b600081815260c960205260408120620007af9062002c3e565b6001600160a01b038416600090815261010360209081526040808320868452825291829020805483518184028101840190945280845260609362001fdd9387938793909183018282801562001c6b576020028201919060005260206000209081546001600160a01b0316815260019091019060200180831162001c4c57505050505062002aa1565b95945050505050565b6000828152609760205260409020600101546200200381620029d8565b62000a39838362002a0d565b336000908152610102602052604090205460ff161515600114620020475760405162461bcd60e51b8152600401620007ed906200398e565b6000826040516020016200205c9190620039de565b60408051601f198184030181529181528151602092830120600081815260fb90935291205490915015620020eb5760405162461bcd60e51b815260206004820152602f60248201527f436f6e73656e74466163746f72793a20546869732074616720697320616c726560448201526e18591e481a5b9a5d1a585b1a5e9959608a1b6064820152608401620007ed565b600081815260fe60209081526040808320600019808552908352818420600101869055815160808101835290815291820192909252339181019190915260fc5460608201906200213c904262003a12565b9052600082815260fe6020908152604080832086845282528083208451815584830151600180830191909155858301516002830180546001600160a01b0319166001600160a01b0390921691909117905560609095015160039091015582805280832086905584835260fb90915281208054909190620021be90849062003a12565b9091555050604051339060009060008051602062004b5383398151915290620021eb908790879062003a2d565b60405180910390a3505050565b6200220262003162565b600083604051602001620022179190620039de565b60408051601f198184030181528282528051602091820120600090815260fe825282812087825282528290206080840183528054845260018101549184019190915260028101546001600160a01b03169183019190915260030154606082015291505092915050565b6101055460ff546040516000926001600160a01b0390811692631b1492e160e11b92620022bc9290911690889088908890309060240162003bb7565b60408051601f198184030181529181526020820180516001600160e01b03166001600160e01b0319909416939093179092529051620022fb9062003193565b6200230892919062003c0d565b604051809103906000f08015801562002325573d6000803e3d6000fd5b506001600160a01b03808216600081815261010260209081526040808320805460ff19166001908117909155948a1680845261010083529083208054808701825581855292842090920180546001600160a01b03191690941790935591905254919250829162002396919062003b87565b6001600160a01b038681166000818152610101602090815260408083209487168084529482528083209590955582825261010381528482207f044852b2a670ade5407e78fb2863c51de9fcb96542a07186fe3aeda6bb8a116d835281528482208054600180820183559184528284200180546001600160a01b031990811687179091557f65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a8452868420805480840182559085528385200180548216871790557fe2f4eaae4a9751e85a3e4a7b9587827a877f29914755229b07a7b2da98285f708452868420805480840182559085528385200180548216871790557f61a3517f153a09154844ed8be639dabc6e78dc22315c2d9a91f7eddf9398c0028452868420805492830181558452918320018054909116841790559251919290917f3386ce5565b3a847e6f22d2ab7aa20347cfda2d3dfbfb4534805ce4cbbdd50019190a35050505050565b60006200250b81620029d8565b6101065460ff83161115620025765760405162461bcd60e51b815260206004820152602a60248201527f436f6e73656e743a205175657374696f6e6e6169726520696e646578206f7574604482015269206f6620626f756e647360b01b6064820152608401620007ed565b6101068054620025899060019062003b87565b815481106200259c576200259c62003b16565b906000526020600020016101068360ff1681548110620025c057620025c062003b16565b90600052602060002001908054620025d89062003b4a565b620025e5929190620031a1565b50610106805480620025fb57620025fb62003ba1565b60019003818190600052602060002001600062002619919062003237565b90555050565b60006200262c81620029d8565b61010654608011620026a75760405162461bcd60e51b815260206004820152603960248201527f436f6e73656e7420466163746f72793a204d6178696d756d206e756d6265722060448201527f6f66207175657374696f6e6e61697265732072656163686564000000000000006064820152608401620007ed565b6101068054600181018255600091909152825162000a39917fc9ef9fceea91e87b2c84ea400a44fde78842aae8aa24cd4b502ce5fb4d91e63b0190602085019062003276565b6060806000846001600160401b038111156200270d576200270d62003371565b6040519080825280602002602001820160405280156200274257816020015b60608152602001906001900390816200272c5790505b5090506000856001600160401b0381111562002762576200276262003371565b6040519080825280602002602001820160405280156200279f57816020015b6200278b62003162565b815260200190600190039081620027815790505b509050600088604051602001620027b79190620039de565b60405160208183030381529060405280519060200120905060005b87811015620012c357600082815260fe602090815260408083208c845282529182902082516080810184528154815260018201549281019290925260028101546001600160a01b031692820192909252600390910154606082018190526200287d5760405162461bcd60e51b815260206004820152601c60248201527f436f6e73656e74466163746f72793a20696e76616c696420736c6f74000000006044820152606401620007ed565b6001881515148015620028935750428160600151105b15620028b657805199506000198a1415620028af5750620012c3565b506200298c565b80604001516001600160a01b0316636c0360eb6040518163ffffffff1660e01b815260040160006040518083038186803b158015620028f457600080fd5b505afa15801562002909573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f1916820160405262002933919081019062003aa0565b85838151811062002948576200294862003b16565b60200260200101819052508084838151811062002969576200296962003b16565b6020908102919091010152805199506000198a14156200298a5750620012c3565b505b80620029988162003b2c565b915050620027d2565b60006001600160e01b03198216637965db0b60e01b1480620007af57506301ffc9a760e01b6001600160e01b0319831614620007af565b620029e4813362002c49565b50565b620029f3828262002cad565b600082815260c96020526040902062000a39908262002d37565b62002a19828262002d4e565b600082815260c96020526040902062000a39908262002db8565b600054610100900460ff1662002a5d5760405162461bcd60e51b8152600401620007ed9062003c33565b62002a6762002dcf565b565b600054610100900460ff1662002a675760405162461bcd60e51b8152600401620007ed9062003c33565b600062001995838362002e05565b60608383101562002b1b5760405162461bcd60e51b815260206004820152603f60248201527f436f6e73656e74466163746f72793a20456e64696e6720696e646578206d757360448201527f74206265206c6172676572207468656e207374617274696e6720696e646578006064820152608401620007ed565b815162002b2b5750606062001995565b6001825162002b3b919062003b87565b83111562002b56576001825162002b53919062003b87565b92505b600062002b64858562003b87565b62002b7190600162003a12565b6001600160401b0381111562002b8b5762002b8b62003371565b60405190808252806020026020018201604052801562002bb5578160200160208202803683370190505b5090506000855b85811162002c335784818151811062002bd95762002bd962003b16565b602002602001015183838151811062002bf65762002bf662003b16565b6001600160a01b03909216602092830291909101909101528162002c1a8162003b2c565b925050808062002c2a9062003b2c565b91505062002bbc565b509095945050505050565b6000620007af825490565b62002c5582826200199c565b62000abc5762002c658162002e32565b62002c7283602062002e45565b60405160200162002c8592919062003c7e565b60408051601f198184030181529082905262461bcd60e51b8252620007ed9160040162003746565b62002cb982826200199c565b62000abc5760008281526097602090815260408083206001600160a01b03851684529091529020805460ff1916600117905562002cf33390565b6001600160a01b0316816001600160a01b0316837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45050565b600062001995836001600160a01b03841662002ffe565b62002d5a82826200199c565b1562000abc5760008281526097602090815260408083206001600160a01b0385168085529252808320805460ff1916905551339285917ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b9190a45050565b600062001995836001600160a01b03841662003050565b600054610100900460ff1662002df95760405162461bcd60e51b8152600401620007ed9062003c33565b6033805460ff19169055565b600082600001828154811062002e1f5762002e1f62003b16565b9060005260206000200154905092915050565b6060620007af6001600160a01b03831660145b6060600062002e5683600262003cf7565b62002e6390600262003a12565b6001600160401b0381111562002e7d5762002e7d62003371565b6040519080825280601f01601f19166020018201604052801562002ea8576020820181803683370190505b509050600360fc1b8160008151811062002ec65762002ec662003b16565b60200101906001600160f81b031916908160001a905350600f60fb1b8160018151811062002ef85762002ef862003b16565b60200101906001600160f81b031916908160001a905350600062002f1e84600262003cf7565b62002f2b90600162003a12565b90505b600181111562002fad576f181899199a1a9b1b9c1cb0b131b232b360811b85600f166010811062002f635762002f6362003b16565b1a60f81b82828151811062002f7c5762002f7c62003b16565b60200101906001600160f81b031916908160001a90535060049490941c9362002fa58162003d19565b905062002f2e565b508315620019955760405162461bcd60e51b815260206004820181905260248201527f537472696e67733a20686578206c656e67746820696e73756666696369656e746044820152606401620007ed565b60008181526001830160205260408120546200304757508154600181810184556000848152602080822090930184905584548482528286019093526040902091909155620007af565b506000620007af565b60008181526001830160205260408120548015620031495760006200307760018362003b87565b85549091506000906200308d9060019062003b87565b9050818114620030f9576000866000018281548110620030b157620030b162003b16565b9060005260206000200154905080876000018481548110620030d757620030d762003b16565b6000918252602080832090910192909255918252600188019052604090208390555b85548690806200310d576200310d62003ba1565b600190038181906000526020600020016000905590558560010160008681526020019081526020016000206000905560019350505050620007af565b6000915050620007af565b6104e48062003d3483390190565b6040518060800160405280600081526020016000815260200160006001600160a01b03168152602001600081525090565b61093b806200421883390190565b828054620031af9062003b4a565b90600052602060002090601f016020900481019282620031d3576000855562003225565b82601f10620031e6578054855562003225565b828001600101855582156200322557600052602060002091601f016020900482015b828111156200322557825482559160010191906001019062003208565b5062003233929150620032f3565b5090565b508054620032459062003b4a565b6000825580601f1062003256575050565b601f016020900490600052602060002090810190620029e49190620032f3565b828054620032849062003b4a565b90600052602060002090601f016020900481019282620032a8576000855562003225565b82601f10620032c357805160ff191683800117855562003225565b8280016001018555821562003225579182015b8281111562003225578251825591602001919060010190620032d6565b5b80821115620032335760008155600101620032f4565b6000602082840312156200331d57600080fd5b81356001600160e01b0319811681146200199557600080fd5b80356001600160a01b03811681146200334e57600080fd5b919050565b6000602082840312156200336657600080fd5b620019958262003336565b634e487b7160e01b600052604160045260246000fd5b604051601f8201601f191681016001600160401b0381118282101715620033b257620033b262003371565b604052919050565b60006001600160401b03821115620033d657620033d662003371565b50601f01601f191660200190565b600082601f830112620033f657600080fd5b81356200340d6200340782620033ba565b62003387565b8181528460208386010111156200342357600080fd5b816020850160208301376000918101602001919091529392505050565b600080604083850312156200345457600080fd5b82356001600160401b038111156200346b57600080fd5b6200347985828601620033e4565b95602094909401359450505050565b6000602082840312156200349b57600080fd5b5035919050565b60008060408385031215620034b657600080fd5b82359150620034c86020840162003336565b90509250929050565b60008060408385031215620034e557600080fd5b620034f08362003336565b9150620034c86020840162003336565b600080604083850312156200351457600080fd5b6200351f8362003336565b946020939093013593505050565b6000806000606084860312156200354357600080fd5b83356001600160401b038111156200355a57600080fd5b6200356886828701620033e4565b9660208601359650604090950135949350505050565b600080600080608085870312156200359557600080fd5b84356001600160401b03811115620035ac57600080fd5b620035ba87828801620033e4565b945050602085013592506040850135915060608501358015158114620035df57600080fd5b939692955090935050565b60005b8381101562003607578181015183820152602001620035ed565b8381111562003617576000848401525b50505050565b6000815180845262003637816020860160208601620035ea565b601f01601f19169290920160200192915050565b600081518084526020808501808196508360051b8101915082860160005b8581101562003697578284038952620036848483516200361d565b9885019893509084019060010162003669565b5091979650505050505050565b604081526000620036b960408301856200364b565b82810360208481019190915284518083528582019282019060005b8181101562003724576200371083865180518252602080820151908301526040808201516001600160a01b031690830152606090810151910152565b9383019360809290920191600101620036d4565b5090979650505050505050565b6020815260006200199560208301846200364b565b6020815260006200199560208301846200361d565b600080604083850312156200376f57600080fd5b50508035926020909101359150565b6000806000606084860312156200379457600080fd5b6200379f8462003336565b95602085013595506040909401359392505050565b6020808252825182820181905260009190848201906040850190845b81811015620037f75783516001600160a01b031683529284019291840191600101620037d0565b50909695505050505050565b6000602082840312156200381657600080fd5b81356001600160401b038111156200382d57600080fd5b62001c7684828501620033e4565b6000806000606084860312156200385157600080fd5b6200385c8462003336565b925060208401359150620038736040850162003336565b90509250925092565b600080600080608085870312156200389357600080fd5b6200389e8562003336565b966020860135965060408601359560600135945092505050565b81518152602080830151908201526040808301516001600160a01b0316908201526060808301519082015260808101620007af565b6000806000606084860312156200390357600080fd5b6200390e8462003336565b925060208401356001600160401b03808211156200392b57600080fd5b6200393987838801620033e4565b935060408601359150808211156200395057600080fd5b506200395f86828701620033e4565b9150509250925092565b6000602082840312156200397c57600080fd5b813560ff811681146200199557600080fd5b60208082526030908201527f436f6e73656e74466163746f72793a2043616c6c6572206973206e6f7420612060408201526f10dbdb9cd95b9d0810dbdb9d1c9858dd60821b606082015260800190565b60008251620039f2818460208701620035ea565b9190910192915050565b634e487b7160e01b600052601160045260246000fd5b6000821982111562003a285762003a28620039fc565b500190565b60408152600062003a4260408301856200361d565b90508260208301529392505050565b6020808252602f908201527f436f6e73656e74466163746f72793a205f6e6577536c6f74206d75737420626560408201526e02067726561746572207468616e203608c1b606082015260800190565b60006020828403121562003ab357600080fd5b81516001600160401b0381111562003aca57600080fd5b8201601f8101841362003adc57600080fd5b805162003aed6200340782620033ba565b81815285602083850101111562003b0357600080fd5b62001fdd826020830160208601620035ea565b634e487b7160e01b600052603260045260246000fd5b600060001982141562003b435762003b43620039fc565b5060010190565b600181811c9082168062003b5f57607f821691505b6020821081141562003b8157634e487b7160e01b600052602260045260246000fd5b50919050565b60008282101562003b9c5762003b9c620039fc565b500390565b634e487b7160e01b600052603160045260246000fd5b600060018060a01b038088168352808716602084015260a0604084015262003be360a08401876200361d565b838103606085015262003bf781876200361d565b9250508084166080840152509695505050505050565b6001600160a01b038316815260406020820181905260009062001c76908301846200361d565b6020808252602b908201527f496e697469616c697a61626c653a20636f6e7472616374206973206e6f74206960408201526a6e697469616c697a696e6760a81b606082015260800190565b7f416363657373436f6e74726f6c3a206163636f756e742000000000000000000081526000835162003cb8816017850160208801620035ea565b7001034b99036b4b9b9b4b733903937b6329607d1b601791840191820152835162003ceb816028840160208801620035ea565b01602801949350505050565b600081600019048311821515161562003d145762003d14620039fc565b500290565b60008162003d2b5762003d2b620039fc565b50600019019056fe608060405234801561001057600080fd5b506040516104e43803806104e483398101604081905261002f91610151565b61003833610047565b61004181610097565b50610181565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b6100aa8161014260201b6101a01760201c565b6101205760405162461bcd60e51b815260206004820152603360248201527f5570677261646561626c65426561636f6e3a20696d706c656d656e746174696f60448201527f6e206973206e6f74206120636f6e747261637400000000000000000000000000606482015260840160405180910390fd5b600180546001600160a01b0319166001600160a01b0392909216919091179055565b6001600160a01b03163b151590565b60006020828403121561016357600080fd5b81516001600160a01b038116811461017a57600080fd5b9392505050565b610354806101906000396000f3fe608060405234801561001057600080fd5b50600436106100575760003560e01c80633659cfe61461005c5780635c60da1b14610071578063715018a61461009a5780638da5cb5b146100a2578063f2fde38b146100b3575b600080fd5b61006f61006a3660046102ee565b6100c6565b005b6001546001600160a01b03165b6040516001600160a01b03909116815260200160405180910390f35b61006f61010e565b6000546001600160a01b031661007e565b61006f6100c13660046102ee565b610122565b6100ce6101af565b6100d781610209565b6040516001600160a01b038216907fbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b90600090a250565b6101166101af565b610120600061029e565b565b61012a6101af565b6001600160a01b0381166101945760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b60648201526084015b60405180910390fd5b61019d8161029e565b50565b6001600160a01b03163b151590565b6000546001600160a01b031633146101205760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604482015260640161018b565b6001600160a01b0381163b61027c5760405162461bcd60e51b815260206004820152603360248201527f5570677261646561626c65426561636f6e3a20696d706c656d656e746174696f6044820152721b881a5cc81b9bdd08184818dbdb9d1c9858dd606a1b606482015260840161018b565b600180546001600160a01b0319166001600160a01b0392909216919091179055565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b60006020828403121561030057600080fd5b81356001600160a01b038116811461031757600080fd5b939250505056fea264697066735822122037f5e761a584b5cfedfedcacdd35de142872479851fbaecf66f55a175ffa1d1d64736f6c63430008090033608060405260405161093b38038061093b8339810160408190526100229161047e565b61002e82826000610035565b50506105a8565b61003e8361010f565b6040516001600160a01b038416907f1cf3b03a6cf19fa2baba4df148e9dcabedea7f8a5c07840e207e5c089be95d3e90600090a260008251118061007f5750805b1561010a57610108836001600160a01b0316635c60da1b6040518163ffffffff1660e01b815260040160206040518083038186803b1580156100c057600080fd5b505afa1580156100d4573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906100f8919061053e565b836102c160201b6100291760201c565b505b505050565b610122816102ed60201b6100551760201c565b6101815760405162461bcd60e51b815260206004820152602560248201527f455243313936373a206e657720626561636f6e206973206e6f74206120636f6e6044820152641d1c9858dd60da1b60648201526084015b60405180910390fd5b610204816001600160a01b0316635c60da1b6040518163ffffffff1660e01b815260040160206040518083038186803b1580156101bd57600080fd5b505afa1580156101d1573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906101f5919061053e565b6102ed60201b6100551760201c565b6102695760405162461bcd60e51b815260206004820152603060248201527f455243313936373a20626561636f6e20696d706c656d656e746174696f6e206960448201526f1cc81b9bdd08184818dbdb9d1c9858dd60821b6064820152608401610178565b806102a07fa3f0ad74e5423aebfd80d3ef4346578335a9a72aeaee59ff6cb3582b35133d5060001b6102fc60201b6100641760201c565b80546001600160a01b0319166001600160a01b039290921691909117905550565b60606102e68383604051806060016040528060278152602001610914602791396102ff565b9392505050565b6001600160a01b03163b151590565b90565b6060600080856001600160a01b03168560405161031c9190610559565b600060405180830381855af49150503d8060008114610357576040519150601f19603f3d011682016040523d82523d6000602084013e61035c565b606091505b50909250905061036e86838387610378565b9695505050505050565b606083156103e45782516103dd576001600160a01b0385163b6103dd5760405162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e74726163740000006044820152606401610178565b50816103ee565b6103ee83836103f6565b949350505050565b8151156104065781518083602001fd5b8060405162461bcd60e51b81526004016101789190610575565b80516001600160a01b038116811461043757600080fd5b919050565b634e487b7160e01b600052604160045260246000fd5b60005b8381101561046d578181015183820152602001610455565b838111156101085750506000910152565b6000806040838503121561049157600080fd5b61049a83610420565b60208401519092506001600160401b03808211156104b757600080fd5b818501915085601f8301126104cb57600080fd5b8151818111156104dd576104dd61043c565b604051601f8201601f19908116603f011681019083821181831017156105055761050561043c565b8160405282815288602084870101111561051e57600080fd5b61052f836020830160208801610452565b80955050505050509250929050565b60006020828403121561055057600080fd5b6102e682610420565b6000825161056b818460208701610452565b9190910192915050565b6020815260008251806020840152610594816040850160208701610452565b601f01601f19169190910160400192915050565b61035d806105b76000396000f3fe60806040523661001357610011610017565b005b6100115b610027610022610067565b61010f565b565b606061004e838360405180606001604052806027815260200161030160279139610133565b9392505050565b6001600160a01b03163b151590565b90565b600061009a7fa3f0ad74e5423aebfd80d3ef4346578335a9a72aeaee59ff6cb3582b35133d50546001600160a01b031690565b6001600160a01b0316635c60da1b6040518163ffffffff1660e01b815260040160206040518083038186803b1580156100d257600080fd5b505afa1580156100e6573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061010a9190610258565b905090565b3660008037600080366000845af43d6000803e80801561012e573d6000f35b3d6000fd5b6060600080856001600160a01b03168560405161015091906102b1565b600060405180830381855af49150503d806000811461018b576040519150601f19603f3d011682016040523d82523d6000602084013e610190565b606091505b50915091506101a1868383876101ab565b9695505050505050565b6060831561021c578251610215576001600160a01b0385163b6102155760405162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e747261637400000060448201526064015b60405180910390fd5b5081610226565b610226838361022e565b949350505050565b81511561023e5781518083602001fd5b8060405162461bcd60e51b815260040161020c91906102cd565b60006020828403121561026a57600080fd5b81516001600160a01b038116811461004e57600080fd5b60005b8381101561029c578181015183820152602001610284565b838111156102ab576000848401525b50505050565b600082516102c3818460208701610281565b9190910192915050565b60208152600082518060208401526102ec816040850160208701610281565b601f01601f1916919091016040019291505056fe416464726573733a206c6f772d6c6576656c2064656c65676174652063616c6c206661696c6564a26469706673582212203b163e80fb6d2725d90c67ab296adb4976d35afe4e99831fd03cf02178370bee64736f6c63430008090033416464726573733a206c6f772d6c6576656c2064656c65676174652063616c6c206661696c6564d0231052a39e12006e39a6a3e2efefdbe9507c7e2178ab3c63b1a248f6949beaa2646970667358221220a22777f857495d0273afa2e49ac6da860cb7283a1a522a03c3f4279fc7f211fc64736f6c63430008090033",
  linkReferences: {},
  deployedLinkReferences: {},
};
