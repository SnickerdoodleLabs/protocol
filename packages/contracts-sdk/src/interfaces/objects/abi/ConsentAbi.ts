export default {
  _format: "hh-sol-artifact-1",
  contractName: "Consent",
  sourceName: "contracts/consent/Consent.sol",
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
          name: "approved",
          type: "address",
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "Approval",
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
          name: "operator",
          type: "address",
        },
        {
          indexed: false,
          internalType: "bool",
          name: "approved",
          type: "bool",
        },
      ],
      name: "ApprovalForAll",
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
          indexed: true,
          internalType: "address",
          name: "from",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "Transfer",
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
      inputs: [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "_getBitCountByTokenId",
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
      name: "addDomain",
      outputs: [],
      stateMutability: "nonpayable",
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
      name: "agreementFlagsArray",
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
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
        {
          internalType: "bytes32",
          name: "agreementFlags",
          type: "bytes32",
        },
        {
          internalType: "bytes",
          name: "signature",
          type: "bytes",
        },
      ],
      name: "anonymousRestrictedOptIn",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "approve",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "owner",
          type: "address",
        },
      ],
      name: "balanceOf",
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
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "burn",
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
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "getApproved",
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
      name: "getDomains",
      outputs: [
        {
          internalType: "string[]",
          name: "domainsArr",
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
          name: "consentOwner",
          type: "address",
        },
        {
          internalType: "string",
          name: "baseURI_",
          type: "string",
        },
        {
          internalType: "string",
          name: "name",
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
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          internalType: "address",
          name: "operator",
          type: "address",
        },
      ],
      name: "isApprovedForAll",
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
          name: "forwarder",
          type: "address",
        },
      ],
      name: "isTrustedForwarder",
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
      name: "name",
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
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
        {
          internalType: "bytes32",
          name: "agreementFlags",
          type: "bytes32",
        },
      ],
      name: "optIn",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "optOut",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "ownerOf",
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
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
        {
          internalType: "bytes32",
          name: "agreementFlags",
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
          internalType: "address",
          name: "from",
          type: "address",
        },
        {
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "safeTransferFrom",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "from",
          type: "address",
        },
        {
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
        {
          internalType: "bytes",
          name: "data",
          type: "bytes",
        },
      ],
      name: "safeTransferFrom",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "operator",
          type: "address",
        },
        {
          internalType: "bool",
          name: "approved",
          type: "bool",
        },
      ],
      name: "setApprovalForAll",
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
          internalType: "address",
          name: "trustedForwarder_",
          type: "address",
        },
      ],
      name: "setTrustedForwarder",
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
      name: "symbol",
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
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "tokenURI",
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
      inputs: [
        {
          internalType: "address",
          name: "from",
          type: "address",
        },
        {
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "transferFrom",
      outputs: [],
      stateMutability: "nonpayable",
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
    {
      inputs: [],
      name: "unpause",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
        {
          internalType: "bytes32",
          name: "newAgreementFlags",
          type: "bytes32",
        },
      ],
      name: "updateAgreementFlags",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
  ],
  bytecode:
    "0x608060405234801561001057600080fd5b50613c78806100206000396000f3fe608060405234801561001057600080fd5b50600436106102f15760003560e01c80636c0360eb1161019d578063a22cb465116100e9578063ca15c873116100a2578063da7422281161007c578063da742228146106b2578063e63ab1e9146106c5578063e985e9c5146106da578063fafc130b1461071657600080fd5b8063ca15c87314610684578063cecc2eac14610697578063d547741f1461069f57600080fd5b8063a22cb46514610612578063a56016ca14610625578063aad83e3514610638578063ae23c7821461064b578063b88d4fde1461065e578063c87b56dd1461067157600080fd5b80639010d07c1161015657806395d89b411161013057806395d89b41146105cd578063a1260cdf146105d5578063a1ebf35d146105e3578063a217fddf1461060a57600080fd5b80639010d07c146105925780639101cc65146105a557806391d14854146105ba57600080fd5b80636c0360eb1461053b5780636cf0dc301461054357806370a082311461055657806372be0f1f146105695780637da0a877146105715780638456cb591461058a57600080fd5b80633f4ba83a1161025c57806344e2e74c116102155780635c975abb116101ef5780635c975abb146104f75780636044245414610502578063613d25bb146105155780636352211e1461052857600080fd5b806344e2e74c146104a957806355f804b3146104bc578063572b6c05146104cf57600080fd5b80633f4ba83a1461042e57806340018a251461043657806342842e0e1461044957806342966c681461045c5780634430db7e1461046f57806344dc6e1a1461049657600080fd5b806322778929116102ae578063227789291461039e57806323b872dd146103b1578063248a9ca3146103c45780632f2ff15d146103e757806336568abe146103fa5780633bfa852b1461040d57600080fd5b806301ffc9a7146102f657806306fdde031461031e578063072bf4cd14610333578063081812fc14610348578063095ea7b31461037357806318160ddd14610386575b600080fd5b610309610304366004613401565b610720565b60405190151581526020015b60405180910390f35b610326610731565b6040516103159190613476565b610346610341366004613489565b6107c3565b005b61035b6103563660046134ab565b61084d565b6040516001600160a01b039091168152602001610315565b6103466103813660046134e0565b610874565b6103906101945481565b604051908152602001610315565b6103466103ac3660046135ad565b61099c565b6103466103bf3660046135e2565b610c42565b6103906103d23660046134ab565b600090815260fb602052604090206001015490565b6103466103f536600461361e565b610c7a565b61034661040836600461361e565b610c9f565b61039061041b3660046134ab565b6101986020526000908152604090205481565b610346610d29565b61034661044436600461364a565b610d4c565b6103466104573660046135e2565b610f3d565b61034661046a3660046134ab565b610f58565b6103907f61a3517f153a09154844ed8be639dabc6e78dc22315c2d9a91f7eddf9398c00281565b6103466104a43660046134ab565b610f88565b6103466104b73660046135ad565b610f91565b6103466104ca3660046135ad565b6111c0565b6103096104dd36600461369a565b6101955461010090046001600160a01b0390811691161490565b60c95460ff16610309565b6103906105103660046134ab565b6111df565b6103466105233660046136b5565b611216565b61035b6105363660046134ab565b611453565b6103266114b3565b6103466105513660046135ad565b611542565b61039061056436600461369a565b6115ce565b610346611654565b6101955461035b9061010090046001600160a01b031681565b61034661167a565b61035b6105a0366004613489565b61169a565b6105ad6116ba565b604051610315919061373a565b6103096105c836600461361e565b611794565b6103266117bf565b610195546103099060ff1681565b6103907fe2f4eaae4a9751e85a3e4a7b9587827a877f29914755229b07a7b2da98285f7081565b610390600081565b61034661062036600461379c565b6117ce565b61034661063336600461364a565b6117e0565b610346610646366004613489565b611831565b6103466106593660046134ab565b61197c565b61034661066c3660046137d8565b611a06565b61032661067f3660046134ab565b611a39565b6103906106923660046134ab565b611a44565b610346611a5c565b6103466106ad36600461361e565b611a85565b6103466106c036600461369a565b611aaa565b610390600080516020613c2383398151915281565b6103096106e8366004613840565b6001600160a01b039182166000908152606a6020908152604080832093909416825291909152205460ff1690565b6103906101975481565b600061072b82611adf565b92915050565b6060606580546107409061386a565b80601f016020809104026020016040519081016040528092919081815260200182805461076c9061386a565b80156107b95780601f1061078e576101008083540402835291602001916107b9565b820191906000526020600020905b81548152906001019060200180831161079c57829003601f168201915b5050505050905090565b6107d46107ce611b04565b83611b32565b6108305760405162461bcd60e51b815260206004820152602260248201527f436f6e73656e743a2063616c6c6572206973206e6f7420746f6b656e206f776e60448201526132b960f11b60648201526084015b60405180910390fd5b6000828152610198602052604090208054821890555050565b5050565b600061085882611bb1565b506000908152606960205260409020546001600160a01b031690565b600061087f82611453565b9050806001600160a01b0316836001600160a01b031614156108ed5760405162461bcd60e51b815260206004820152602160248201527f4552433732313a20617070726f76616c20746f2063757272656e74206f776e656044820152603960f91b6064820152608401610827565b806001600160a01b03166108ff611b04565b6001600160a01b0316148061091b575061091b816106e8611b04565b61098d5760405162461bcd60e51b815260206004820152603e60248201527f4552433732313a20617070726f76652063616c6c6572206973206e6f7420746f60448201527f6b656e206f776e6572206e6f7220617070726f76656420666f7220616c6c00006064820152608401610827565b6109978383611c10565b505050565b60006109a781611c7e565b6000610196805480602002602001604051908101604052809291908181526020016000905b82821015610a785783829060005260206000200180546109eb9061386a565b80601f0160208091040260200160405190810160405280929190818152602001828054610a179061386a565b8015610a645780601f10610a3957610100808354040283529160200191610a64565b820191906000526020600020905b815481529060010190602001808311610a4757829003601f168201915b5050505050815260200190600101906109cc565b5050505090506000805b61019654811015610bdc5784604051602001610a9e91906138a5565b60405160208183030381529060405280519060200120838281518110610ac657610ac66138c1565b6020026020010151604051602001610ade91906138a5565b604051602081830303815290604052805190602001201415610bd4576101968054610b0b906001906138ed565b81548110610b1b57610b1b6138c1565b906000526020600020016101968281548110610b3957610b396138c1565b90600052602060002001908054610b4f9061386a565b610b5a92919061329d565b50610196805480610b6d57610b6d613904565b600190038181906000526020600020016000610b899190613328565b905581610b958161391a565b9250507f549cfb509d34ba3a18b302f759af92977d405b9a59d1ad5eaf676b1b26fdd02785604051610bc79190613476565b60405180910390a1610bdc565b600101610a82565b5060008160ff1611610c3c5760405162461bcd60e51b815260206004820152602360248201527f436f6e73656e74203a20446f6d61696e206973206e6f7420696e20746865206c6044820152621a5cdd60ea1b6064820152608401610827565b50505050565b610c53610c4d611b04565b82611b32565b610c6f5760405162461bcd60e51b81526004016108279061393a565b610997838383611c8f565b600082815260fb6020526040902060010154610c9581611c7e565b6109978383611e36565b610ca7611b04565b6001600160a01b0316816001600160a01b031614610d1f5760405162461bcd60e51b815260206004820152602f60248201527f416363657373436f6e74726f6c3a2063616e206f6e6c792072656e6f756e636560448201526e103937b632b9903337b91039b2b63360891b6064820152608401610827565b6108498282611e7a565b600080516020613c23833981519152610d4181611c7e565b610d49611ebe565b50565b610d54611f16565b610d5f610564611b04565b15610d7c5760405162461bcd60e51b815260040161082790613988565b6000610e18610d89611b04565b60405160609190911b6bffffffffffffffffffffffff1916602082015260348101869052605481018590526074015b60408051601f1981840301815282825280516020918201207f19457468657265756d205369676e6564204d6573736167653a0a33320000000084830152603c8085019190915282518085039091018152605c909301909152815191012090565b9050610e248183611f5e565b610e8a5760405162461bcd60e51b815260206004820152603160248201527f436f6e73656e743a20436f6e7472616374206f776e657220646964206e6f74206044820152707369676e2074686973206d65737361676560781b6064820152608401610827565b610e9b610e95611b04565b85611ff9565b600084815261019860205260408120805485189055610194805491610ebf836139ca565b9091555050610192546001600160a01b03166335f011d9610ede611b04565b6040516001600160e01b031960e084901b1681526001600160a01b039091166004820152602401600060405180830381600087803b158015610f1f57600080fd5b505af1158015610f33573d6000803e3d6000fd5b5050505050505050565b61099783838360405180602001604052806000815250611a06565b610f63610c4d611b04565b610f7f5760405162461bcd60e51b81526004016108279061393a565b610d4981612013565b610d4981610f58565b6000610f9c81611c7e565b6000610196805480602002602001604051908101604052809291908181526020016000905b8282101561106d578382906000526020600020018054610fe09061386a565b80601f016020809104026020016040519081016040528092919081815260200182805461100c9061386a565b80156110595780601f1061102e57610100808354040283529160200191611059565b820191906000526020600020905b81548152906001019060200180831161103c57829003601f168201915b505050505081526020019060010190610fc1565b50505050905060005b6101965481101561113e578360405160200161109291906138a5565b604051602081830303815290604052805190602001208282815181106110ba576110ba6138c1565b60200260200101516040516020016110d291906138a5565b6040516020818303038152906040528051906020012014156111365760405162461bcd60e51b815260206004820152601e60248201527f436f6e73656e74203a20446f6d61696e20616c726561647920616464656400006044820152606401610827565b600101611076565b5061019680546001810182556000919091528351611183917f828feda00a4b64eb35101b6df8f6c29717b1ea6bae5dd03d3ddada8de0a9e7cb01906020860190613362565b507f518f4dd9e1ba750adb395696c0d4f5417dd0d7686a59f0ba155189e550421533836040516111b39190613476565b60405180910390a1505050565b60006111cb81611c7e565b815161099790610193906020850190613362565b6000818152610198602052604081205481905b801561120f5761120560018216836139e5565b915060011c6111f2565b5092915050565b600054610100900460ff16158080156112365750600054600160ff909116105b806112505750303b158015611250575060005460ff166001145b6112b35760405162461bcd60e51b815260206004820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201526d191e481a5b9a5d1a585b1a5e995960921b6064820152608401610827565b6000805460ff1916600117905580156112d6576000805461ff0019166101001790555b6112ff836040518060400160405280600781526020016610d3d394d1539560ca1b8152506120b1565b6113076120e2565b61130f612109565b6113176120e2565b61131f6120e2565b61019180546001600160a01b03199081166001600160a01b038516908117909255610192805490911690911790556101958054610100600160a81b03191674f7c6dc708550d89558110caecd20a8a6a184427e001790554361019755611386600086612138565b61139e600080516020613c2383398151915286612138565b6113c87fe2f4eaae4a9751e85a3e4a7b9587827a877f29914755229b07a7b2da98285f7086612138565b6113f27f61a3517f153a09154844ed8be639dabc6e78dc22315c2d9a91f7eddf9398c00286612138565b6113fd600033612138565b611406846111c0565b801561144c576000805461ff0019169055604051600181527f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb38474024989060200160405180910390a15b5050505050565b6000818152606760205260408120546001600160a01b03168061072b5760405162461bcd60e51b8152602060048201526018602482015277115490cdcc8c4e881a5b9d985b1a59081d1bdad95b88125160421b6044820152606401610827565b61019380546114c19061386a565b80601f01602080910402602001604051908101604052809291908181526020018280546114ed9061386a565b801561153a5780601f1061150f5761010080835404028352916020019161153a565b820191906000526020600020905b81548152906001019060200180831161151d57829003601f168201915b505050505081565b7f61a3517f153a09154844ed8be639dabc6e78dc22315c2d9a91f7eddf9398c00261156c81611c7e565b8160405161157a91906138a5565b604051809103902061158a611b04565b6001600160a01b03167f31df2703b10660cea45214572e0616949f363a34b1c19dca24026609f4665570846040516115c29190613476565b60405180910390a35050565b60006001600160a01b0382166116385760405162461bcd60e51b815260206004820152602960248201527f4552433732313a2061646472657373207a65726f206973206e6f7420612076616044820152683634b21037bbb732b960b91b6064820152608401610827565b506001600160a01b031660009081526068602052604090205490565b600080516020613c2383398151915261166c81611c7e565b50610195805460ff19169055565b600080516020613c2383398151915261169281611c7e565b610d4961215b565b600082815261012d602052604081206116b39083612199565b9392505050565b6060610196805480602002602001604051908101604052809291908181526020016000905b8282101561178b5783829060005260206000200180546116fe9061386a565b80601f016020809104026020016040519081016040528092919081815260200182805461172a9061386a565b80156117775780601f1061174c57610100808354040283529160200191611777565b820191906000526020600020905b81548152906001019060200180831161175a57829003601f168201915b5050505050815260200190600101906116df565b50505050905090565b600091825260fb602090815260408084206001600160a01b0393909316845291905290205460ff1690565b6060606680546107409061386a565b6108496117d9611b04565b83836121a5565b6117e8611f16565b6117f3610564611b04565b156118105760405162461bcd60e51b815260040161082790613988565b6000610e188484604051602001610db8929190918252602082015260400190565b611839611f16565b6101955460ff16156118a25760405162461bcd60e51b815260206004820152602c60248201527f436f6e73656e743a204f70656e206f70742d696e73206172652063757272656e60448201526b1d1b1e48191a5cd8589b195960a21b6064820152608401610827565b6118ad610564611b04565b156118ca5760405162461bcd60e51b815260040161082790613988565b6118db6118d5611b04565b83611ff9565b6000828152610198602052604081208054831890556101948054916118ff836139ca565b9091555050610192546001600160a01b03166335f011d961191e611b04565b6040516001600160e01b031960e084901b1681526001600160a01b0390911660048201526024015b600060405180830381600087803b15801561196057600080fd5b505af1158015611974573d6000803e3d6000fd5b505050505050565b600061198781611c7e565b6101975482116119ff5760405162461bcd60e51b815260206004820152603860248201527f4e657720686f72697a6f6e206d757374206265207374726963746c79206c617460448201527f6572207468616e2063757272656e7420686f72697a6f6e2e00000000000000006064820152608401610827565b5061019755565b611a116107ce611b04565b611a2d5760405162461bcd60e51b81526004016108279061393a565b610c3c84848484612274565b606061072b826122a7565b600081815261012d6020526040812061072b906123a3565b600080516020613c23833981519152611a7481611c7e565b50610195805460ff19166001179055565b600082815260fb6020526040902060010154611aa081611c7e565b6109978383611e7a565b6000611ab581611c7e565b5061019580546001600160a01b0390921661010002610100600160a81b0319909216919091179055565b60006001600160e01b03198216635a05180f60e01b148061072b575061072b826123ad565b6101955460009061010090046001600160a01b0316331415611b2d575060131936013560601c90565b503390565b600080611b3e83611453565b9050806001600160a01b0316846001600160a01b03161480611b8557506001600160a01b038082166000908152606a602090815260408083209388168352929052205460ff165b80611ba95750836001600160a01b0316611b9e8461084d565b6001600160a01b0316145b949350505050565b6000818152606760205260409020546001600160a01b0316610d495760405162461bcd60e51b8152602060048201526018602482015277115490cdcc8c4e881a5b9d985b1a59081d1bdad95b88125160421b6044820152606401610827565b600081815260696020526040902080546001600160a01b0319166001600160a01b0384169081179091558190611c4582611453565b6001600160a01b03167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92560405160405180910390a45050565b610d4981611c8a611b04565b6123d2565b826001600160a01b0316611ca282611453565b6001600160a01b031614611d065760405162461bcd60e51b815260206004820152602560248201527f4552433732313a207472616e736665722066726f6d20696e636f72726563742060448201526437bbb732b960d91b6064820152608401610827565b6001600160a01b038216611d685760405162461bcd60e51b8152602060048201526024808201527f4552433732313a207472616e7366657220746f20746865207a65726f206164646044820152637265737360e01b6064820152608401610827565b611d73838383612436565b611d7e600082611c10565b6001600160a01b0383166000908152606860205260408120805460019290611da79084906138ed565b90915550506001600160a01b0382166000908152606860205260408120805460019290611dd59084906139e5565b909155505060008181526067602052604080822080546001600160a01b0319166001600160a01b0386811691821790925591518493918716917fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef91a4505050565b611e408282612138565b61019254604051635c655a5560e11b81526001600160a01b038381166004830152602482018590529091169063b8cab4aa90604401611946565b611e8482826124bd565b61019254604051637659125360e01b81526001600160a01b0383811660048301526024820185905290911690637659125390604401611946565b611ec66124e0565b60c9805460ff191690557f5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa611ef9611b04565b6040516001600160a01b03909116815260200160405180910390a1565b60c95460ff1615611f5c5760405162461bcd60e51b815260206004820152601060248201526f14185d5cd8589b194e881c185d5cd95960821b6044820152606401610827565b565b600080611f6b8484612529565b90506001600160a01b038116611fcf5760405162461bcd60e51b8152602060048201526024808201527f436f6e73656e743a205369676e65722063616e6e6f742062652030206164647260448201526332b9b99760e11b6064820152608401610827565b611ba97fe2f4eaae4a9751e85a3e4a7b9587827a877f29914755229b07a7b2da98285f7082611794565b61084982826040518060200160405280600081525061254d565b6101948054906000612024836139fd565b90915550506000818152610198602052604081205561204281612580565b610192546001600160a01b031663385f725a61205c611b04565b6040516001600160e01b031960e084901b1681526001600160a01b039091166004820152602401600060405180830381600087803b15801561209d57600080fd5b505af115801561144c573d6000803e3d6000fd5b600054610100900460ff166120d85760405162461bcd60e51b815260040161082790613a14565b61084982826125c0565b600054610100900460ff16611f5c5760405162461bcd60e51b815260040161082790613a14565b600054610100900460ff166121305760405162461bcd60e51b815260040161082790613a14565b611f5c61260e565b6121428282612641565b600082815261012d6020526040902061099790826126c8565b612163611f16565b60c9805460ff191660011790557f62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a258611ef9611b04565b60006116b383836126dd565b816001600160a01b0316836001600160a01b031614156122075760405162461bcd60e51b815260206004820152601960248201527f4552433732313a20617070726f766520746f2063616c6c6572000000000000006044820152606401610827565b6001600160a01b038381166000818152606a6020908152604080832094871680845294825291829020805460ff191686151590811790915591519182527f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31910160405180910390a3505050565b61227f848484611c8f565b61228b84848484612707565b610c3c5760405162461bcd60e51b815260040161082790613a5f565b60606122b282611bb1565b600082815260976020526040812080546122cb9061386a565b80601f01602080910402602001604051908101604052809291908181526020018280546122f79061386a565b80156123445780601f1061231957610100808354040283529160200191612344565b820191906000526020600020905b81548152906001019060200180831161232757829003601f168201915b50505050509050600061235561281b565b9050805160001415612368575092915050565b81511561239a578082604051602001612382929190613ab1565b60405160208183030381529060405292505050919050565b611ba98461282b565b600061072b825490565b60006001600160e01b03198216637965db0b60e01b148061072b575061072b82612891565b6123dc8282611794565b610849576123f4816001600160a01b031660146128e1565b6123ff8360206128e1565b604051602001612410929190613ae0565b60408051601f198184030181529082905262461bcd60e51b825261082791600401613476565b61243e611f16565b6001600160a01b038316158061245b57506001600160a01b038216155b6109975760405162461bcd60e51b815260206004820152602d60248201527f436f6e73656e743a20436f6e73656e7420746f6b656e7320617265206e6f6e2d60448201526c7472616e736665727261626c6560981b6064820152608401610827565b6124c78282612a7d565b600082815261012d602052604090206109979082612b02565b60c95460ff16611f5c5760405162461bcd60e51b815260206004820152601460248201527314185d5cd8589b194e881b9bdd081c185d5cd95960621b6044820152606401610827565b60008060006125388585612b17565b9150915061254581612b87565b509392505050565b6125578383612d42565b6125646000848484612707565b6109975760405162461bcd60e51b815260040161082790613a5f565b61258981612e90565b600081815260976020526040902080546125a29061386a565b159050610d49576000818152609760205260408120610d4991613328565b600054610100900460ff166125e75760405162461bcd60e51b815260040161082790613a14565b81516125fa906065906020850190613362565b508051610997906066906020840190613362565b600054610100900460ff166126355760405162461bcd60e51b815260040161082790613a14565b60c9805460ff19169055565b61264b8282611794565b61084957600082815260fb602090815260408083206001600160a01b03851684529091529020805460ff19166001179055612684611b04565b6001600160a01b0316816001600160a01b0316837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45050565b60006116b3836001600160a01b038416612f37565b60008260000182815481106126f4576126f46138c1565b9060005260206000200154905092915050565b60006001600160a01b0384163b1561281057836001600160a01b031663150b7a02612730611b04565b8786866040518563ffffffff1660e01b81526004016127529493929190613b55565b602060405180830381600087803b15801561276c57600080fd5b505af192505050801561279c575060408051601f3d908101601f1916820190925261279991810190613b92565b60015b6127f6573d8080156127ca576040519150601f19603f3d011682016040523d82523d6000602084013e6127cf565b606091505b5080516127ee5760405162461bcd60e51b815260040161082790613a5f565b805181602001fd5b6001600160e01b031916630a85bd0160e11b149050611ba9565b506001949350505050565b606061019380546107409061386a565b606061283682611bb1565b600061284061281b565b9050600081511161286057604051806020016040528060008152506116b3565b8061286a84612f86565b60405160200161287b929190613ab1565b6040516020818303038152906040529392505050565b60006001600160e01b031982166380ac58cd60e01b14806128c257506001600160e01b03198216635b5e139f60e01b145b8061072b57506301ffc9a760e01b6001600160e01b031983161461072b565b606060006128f0836002613baf565b6128fb9060026139e5565b67ffffffffffffffff8111156129135761291361350a565b6040519080825280601f01601f19166020018201604052801561293d576020820181803683370190505b509050600360fc1b81600081518110612958576129586138c1565b60200101906001600160f81b031916908160001a905350600f60fb1b81600181518110612987576129876138c1565b60200101906001600160f81b031916908160001a90535060006129ab846002613baf565b6129b69060016139e5565b90505b6001811115612a2e576f181899199a1a9b1b9c1cb0b131b232b360811b85600f16601081106129ea576129ea6138c1565b1a60f81b828281518110612a0057612a006138c1565b60200101906001600160f81b031916908160001a90535060049490941c93612a27816139fd565b90506129b9565b5083156116b35760405162461bcd60e51b815260206004820181905260248201527f537472696e67733a20686578206c656e67746820696e73756666696369656e746044820152606401610827565b612a878282611794565b1561084957600082815260fb602090815260408083206001600160a01b03851684529091529020805460ff19169055612abe611b04565b6001600160a01b0316816001600160a01b0316837ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b60405160405180910390a45050565b60006116b3836001600160a01b038416613084565b600080825160411415612b4e5760208301516040840151606085015160001a612b4287828585613177565b94509450505050612b80565b825160401415612b785760208301516040840151612b6d868383613264565b935093505050612b80565b506000905060025b9250929050565b6000816004811115612b9b57612b9b613bce565b1415612ba45750565b6001816004811115612bb857612bb8613bce565b1415612c065760405162461bcd60e51b815260206004820152601860248201527f45434453413a20696e76616c6964207369676e617475726500000000000000006044820152606401610827565b6002816004811115612c1a57612c1a613bce565b1415612c685760405162461bcd60e51b815260206004820152601f60248201527f45434453413a20696e76616c6964207369676e6174757265206c656e677468006044820152606401610827565b6003816004811115612c7c57612c7c613bce565b1415612cd55760405162461bcd60e51b815260206004820152602260248201527f45434453413a20696e76616c6964207369676e6174757265202773272076616c604482015261756560f01b6064820152608401610827565b6004816004811115612ce957612ce9613bce565b1415610d495760405162461bcd60e51b815260206004820152602260248201527f45434453413a20696e76616c6964207369676e6174757265202776272076616c604482015261756560f01b6064820152608401610827565b6001600160a01b038216612d985760405162461bcd60e51b815260206004820181905260248201527f4552433732313a206d696e7420746f20746865207a65726f20616464726573736044820152606401610827565b6000818152606760205260409020546001600160a01b031615612dfd5760405162461bcd60e51b815260206004820152601c60248201527f4552433732313a20746f6b656e20616c7265616479206d696e746564000000006044820152606401610827565b612e0960008383612436565b6001600160a01b0382166000908152606860205260408120805460019290612e329084906139e5565b909155505060008181526067602052604080822080546001600160a01b0319166001600160a01b03861690811790915590518392907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef908290a45050565b6000612e9b82611453565b9050612ea981600084612436565b612eb4600083611c10565b6001600160a01b0381166000908152606860205260408120805460019290612edd9084906138ed565b909155505060008281526067602052604080822080546001600160a01b0319169055518391906001600160a01b038416907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef908390a45050565b6000818152600183016020526040812054612f7e5750815460018181018455600084815260208082209093018490558454848252828601909352604090209190915561072b565b50600061072b565b606081612faa5750506040805180820190915260018152600360fc1b602082015290565b8160005b8115612fd45780612fbe816139ca565b9150612fcd9050600a83613bfa565b9150612fae565b60008167ffffffffffffffff811115612fef57612fef61350a565b6040519080825280601f01601f191660200182016040528015613019576020820181803683370190505b5090505b8415611ba95761302e6001836138ed565b915061303b600a86613c0e565b6130469060306139e5565b60f81b81838151811061305b5761305b6138c1565b60200101906001600160f81b031916908160001a90535061307d600a86613bfa565b945061301d565b6000818152600183016020526040812054801561316d5760006130a86001836138ed565b85549091506000906130bc906001906138ed565b90508181146131215760008660000182815481106130dc576130dc6138c1565b90600052602060002001549050808760000184815481106130ff576130ff6138c1565b6000918252602080832090910192909255918252600188019052604090208390555b855486908061313257613132613904565b60019003818190600052602060002001600090559055856001016000868152602001908152602001600020600090556001935050505061072b565b600091505061072b565b6000807f7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a08311156131ae575060009050600361325b565b8460ff16601b141580156131c657508460ff16601c14155b156131d7575060009050600461325b565b6040805160008082526020820180845289905260ff881692820192909252606081018690526080810185905260019060a0016020604051602081039080840390855afa15801561322b573d6000803e3d6000fd5b5050604051601f1901519150506001600160a01b0381166132545760006001925092505061325b565b9150600090505b94509492505050565b6000806001600160ff1b0383168161328160ff86901c601b6139e5565b905061328f87828885613177565b935093505050935093915050565b8280546132a99061386a565b90600052602060002090601f0160209004810192826132cb5760008555613318565b82601f106132dc5780548555613318565b8280016001018555821561331857600052602060002091601f016020900482015b828111156133185782548255916001019190600101906132fd565b506133249291506133d6565b5090565b5080546133349061386a565b6000825580601f10613344575050565b601f016020900490600052602060002090810190610d4991906133d6565b82805461336e9061386a565b90600052602060002090601f0160209004810192826133905760008555613318565b82601f106133a957805160ff1916838001178555613318565b82800160010185558215613318579182015b828111156133185782518255916020019190600101906133bb565b5b8082111561332457600081556001016133d7565b6001600160e01b031981168114610d4957600080fd5b60006020828403121561341357600080fd5b81356116b3816133eb565b60005b83811015613439578181015183820152602001613421565b83811115610c3c5750506000910152565b6000815180845261346281602086016020860161341e565b601f01601f19169290920160200192915050565b6020815260006116b3602083018461344a565b6000806040838503121561349c57600080fd5b50508035926020909101359150565b6000602082840312156134bd57600080fd5b5035919050565b80356001600160a01b03811681146134db57600080fd5b919050565b600080604083850312156134f357600080fd5b6134fc836134c4565b946020939093013593505050565b634e487b7160e01b600052604160045260246000fd5b600082601f83011261353157600080fd5b813567ffffffffffffffff8082111561354c5761354c61350a565b604051601f8301601f19908116603f011681019082821181831017156135745761357461350a565b8160405283815286602085880101111561358d57600080fd5b836020870160208301376000602085830101528094505050505092915050565b6000602082840312156135bf57600080fd5b813567ffffffffffffffff8111156135d657600080fd5b611ba984828501613520565b6000806000606084860312156135f757600080fd5b613600846134c4565b925061360e602085016134c4565b9150604084013590509250925092565b6000806040838503121561363157600080fd5b82359150613641602084016134c4565b90509250929050565b60008060006060848603121561365f57600080fd5b8335925060208401359150604084013567ffffffffffffffff81111561368457600080fd5b61369086828701613520565b9150509250925092565b6000602082840312156136ac57600080fd5b6116b3826134c4565b600080600080608085870312156136cb57600080fd5b6136d4856134c4565b9350602085013567ffffffffffffffff808211156136f157600080fd5b6136fd88838901613520565b9450604087013591508082111561371357600080fd5b5061372087828801613520565b92505061372f606086016134c4565b905092959194509250565b6000602080830181845280855180835260408601915060408160051b870101925083870160005b8281101561378f57603f1988860301845261377d85835161344a565b94509285019290850190600101613761565b5092979650505050505050565b600080604083850312156137af57600080fd5b6137b8836134c4565b9150602083013580151581146137cd57600080fd5b809150509250929050565b600080600080608085870312156137ee57600080fd5b6137f7856134c4565b9350613805602086016134c4565b925060408501359150606085013567ffffffffffffffff81111561382857600080fd5b61383487828801613520565b91505092959194509250565b6000806040838503121561385357600080fd5b61385c836134c4565b9150613641602084016134c4565b600181811c9082168061387e57607f821691505b6020821081141561389f57634e487b7160e01b600052602260045260246000fd5b50919050565b600082516138b781846020870161341e565b9190910192915050565b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052601160045260246000fd5b6000828210156138ff576138ff6138d7565b500390565b634e487b7160e01b600052603160045260246000fd5b600060ff821660ff811415613931576139316138d7565b60010192915050565b6020808252602e908201527f4552433732313a2063616c6c6572206973206e6f7420746f6b656e206f776e6560408201526d1c881b9bdc88185c1c1c9bdd995960921b606082015260800190565b60208082526022908201527f436f6e73656e743a20557365722068617320616c7265616479206f707465642060408201526134b760f11b606082015260800190565b60006000198214156139de576139de6138d7565b5060010190565b600082198211156139f8576139f86138d7565b500190565b600081613a0c57613a0c6138d7565b506000190190565b6020808252602b908201527f496e697469616c697a61626c653a20636f6e7472616374206973206e6f74206960408201526a6e697469616c697a696e6760a81b606082015260800190565b60208082526032908201527f4552433732313a207472616e7366657220746f206e6f6e20455243373231526560408201527131b2b4bb32b91034b6b83632b6b2b73a32b960711b606082015260800190565b60008351613ac381846020880161341e565b835190830190613ad781836020880161341e565b01949350505050565b7f416363657373436f6e74726f6c3a206163636f756e7420000000000000000000815260008351613b1881601785016020880161341e565b7001034b99036b4b9b9b4b733903937b6329607d1b6017918401918201528351613b4981602884016020880161341e565b01602801949350505050565b6001600160a01b0385811682528416602082015260408101839052608060608201819052600090613b889083018461344a565b9695505050505050565b600060208284031215613ba457600080fd5b81516116b3816133eb565b6000816000190483118215151615613bc957613bc96138d7565b500290565b634e487b7160e01b600052602160045260246000fd5b634e487b7160e01b600052601260045260246000fd5b600082613c0957613c09613be4565b500490565b600082613c1d57613c1d613be4565b50069056fe65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862aa26469706673582212201b12ec8bfd6f7f69fbdb03d18290ec2c7a6042384f4ae823b06a0bbf2028c43064736f6c63430008090033",
  deployedBytecode:
    "0x608060405234801561001057600080fd5b50600436106102f15760003560e01c80636c0360eb1161019d578063a22cb465116100e9578063ca15c873116100a2578063da7422281161007c578063da742228146106b2578063e63ab1e9146106c5578063e985e9c5146106da578063fafc130b1461071657600080fd5b8063ca15c87314610684578063cecc2eac14610697578063d547741f1461069f57600080fd5b8063a22cb46514610612578063a56016ca14610625578063aad83e3514610638578063ae23c7821461064b578063b88d4fde1461065e578063c87b56dd1461067157600080fd5b80639010d07c1161015657806395d89b411161013057806395d89b41146105cd578063a1260cdf146105d5578063a1ebf35d146105e3578063a217fddf1461060a57600080fd5b80639010d07c146105925780639101cc65146105a557806391d14854146105ba57600080fd5b80636c0360eb1461053b5780636cf0dc301461054357806370a082311461055657806372be0f1f146105695780637da0a877146105715780638456cb591461058a57600080fd5b80633f4ba83a1161025c57806344e2e74c116102155780635c975abb116101ef5780635c975abb146104f75780636044245414610502578063613d25bb146105155780636352211e1461052857600080fd5b806344e2e74c146104a957806355f804b3146104bc578063572b6c05146104cf57600080fd5b80633f4ba83a1461042e57806340018a251461043657806342842e0e1461044957806342966c681461045c5780634430db7e1461046f57806344dc6e1a1461049657600080fd5b806322778929116102ae578063227789291461039e57806323b872dd146103b1578063248a9ca3146103c45780632f2ff15d146103e757806336568abe146103fa5780633bfa852b1461040d57600080fd5b806301ffc9a7146102f657806306fdde031461031e578063072bf4cd14610333578063081812fc14610348578063095ea7b31461037357806318160ddd14610386575b600080fd5b610309610304366004613401565b610720565b60405190151581526020015b60405180910390f35b610326610731565b6040516103159190613476565b610346610341366004613489565b6107c3565b005b61035b6103563660046134ab565b61084d565b6040516001600160a01b039091168152602001610315565b6103466103813660046134e0565b610874565b6103906101945481565b604051908152602001610315565b6103466103ac3660046135ad565b61099c565b6103466103bf3660046135e2565b610c42565b6103906103d23660046134ab565b600090815260fb602052604090206001015490565b6103466103f536600461361e565b610c7a565b61034661040836600461361e565b610c9f565b61039061041b3660046134ab565b6101986020526000908152604090205481565b610346610d29565b61034661044436600461364a565b610d4c565b6103466104573660046135e2565b610f3d565b61034661046a3660046134ab565b610f58565b6103907f61a3517f153a09154844ed8be639dabc6e78dc22315c2d9a91f7eddf9398c00281565b6103466104a43660046134ab565b610f88565b6103466104b73660046135ad565b610f91565b6103466104ca3660046135ad565b6111c0565b6103096104dd36600461369a565b6101955461010090046001600160a01b0390811691161490565b60c95460ff16610309565b6103906105103660046134ab565b6111df565b6103466105233660046136b5565b611216565b61035b6105363660046134ab565b611453565b6103266114b3565b6103466105513660046135ad565b611542565b61039061056436600461369a565b6115ce565b610346611654565b6101955461035b9061010090046001600160a01b031681565b61034661167a565b61035b6105a0366004613489565b61169a565b6105ad6116ba565b604051610315919061373a565b6103096105c836600461361e565b611794565b6103266117bf565b610195546103099060ff1681565b6103907fe2f4eaae4a9751e85a3e4a7b9587827a877f29914755229b07a7b2da98285f7081565b610390600081565b61034661062036600461379c565b6117ce565b61034661063336600461364a565b6117e0565b610346610646366004613489565b611831565b6103466106593660046134ab565b61197c565b61034661066c3660046137d8565b611a06565b61032661067f3660046134ab565b611a39565b6103906106923660046134ab565b611a44565b610346611a5c565b6103466106ad36600461361e565b611a85565b6103466106c036600461369a565b611aaa565b610390600080516020613c2383398151915281565b6103096106e8366004613840565b6001600160a01b039182166000908152606a6020908152604080832093909416825291909152205460ff1690565b6103906101975481565b600061072b82611adf565b92915050565b6060606580546107409061386a565b80601f016020809104026020016040519081016040528092919081815260200182805461076c9061386a565b80156107b95780601f1061078e576101008083540402835291602001916107b9565b820191906000526020600020905b81548152906001019060200180831161079c57829003601f168201915b5050505050905090565b6107d46107ce611b04565b83611b32565b6108305760405162461bcd60e51b815260206004820152602260248201527f436f6e73656e743a2063616c6c6572206973206e6f7420746f6b656e206f776e60448201526132b960f11b60648201526084015b60405180910390fd5b6000828152610198602052604090208054821890555050565b5050565b600061085882611bb1565b506000908152606960205260409020546001600160a01b031690565b600061087f82611453565b9050806001600160a01b0316836001600160a01b031614156108ed5760405162461bcd60e51b815260206004820152602160248201527f4552433732313a20617070726f76616c20746f2063757272656e74206f776e656044820152603960f91b6064820152608401610827565b806001600160a01b03166108ff611b04565b6001600160a01b0316148061091b575061091b816106e8611b04565b61098d5760405162461bcd60e51b815260206004820152603e60248201527f4552433732313a20617070726f76652063616c6c6572206973206e6f7420746f60448201527f6b656e206f776e6572206e6f7220617070726f76656420666f7220616c6c00006064820152608401610827565b6109978383611c10565b505050565b60006109a781611c7e565b6000610196805480602002602001604051908101604052809291908181526020016000905b82821015610a785783829060005260206000200180546109eb9061386a565b80601f0160208091040260200160405190810160405280929190818152602001828054610a179061386a565b8015610a645780601f10610a3957610100808354040283529160200191610a64565b820191906000526020600020905b815481529060010190602001808311610a4757829003601f168201915b5050505050815260200190600101906109cc565b5050505090506000805b61019654811015610bdc5784604051602001610a9e91906138a5565b60405160208183030381529060405280519060200120838281518110610ac657610ac66138c1565b6020026020010151604051602001610ade91906138a5565b604051602081830303815290604052805190602001201415610bd4576101968054610b0b906001906138ed565b81548110610b1b57610b1b6138c1565b906000526020600020016101968281548110610b3957610b396138c1565b90600052602060002001908054610b4f9061386a565b610b5a92919061329d565b50610196805480610b6d57610b6d613904565b600190038181906000526020600020016000610b899190613328565b905581610b958161391a565b9250507f549cfb509d34ba3a18b302f759af92977d405b9a59d1ad5eaf676b1b26fdd02785604051610bc79190613476565b60405180910390a1610bdc565b600101610a82565b5060008160ff1611610c3c5760405162461bcd60e51b815260206004820152602360248201527f436f6e73656e74203a20446f6d61696e206973206e6f7420696e20746865206c6044820152621a5cdd60ea1b6064820152608401610827565b50505050565b610c53610c4d611b04565b82611b32565b610c6f5760405162461bcd60e51b81526004016108279061393a565b610997838383611c8f565b600082815260fb6020526040902060010154610c9581611c7e565b6109978383611e36565b610ca7611b04565b6001600160a01b0316816001600160a01b031614610d1f5760405162461bcd60e51b815260206004820152602f60248201527f416363657373436f6e74726f6c3a2063616e206f6e6c792072656e6f756e636560448201526e103937b632b9903337b91039b2b63360891b6064820152608401610827565b6108498282611e7a565b600080516020613c23833981519152610d4181611c7e565b610d49611ebe565b50565b610d54611f16565b610d5f610564611b04565b15610d7c5760405162461bcd60e51b815260040161082790613988565b6000610e18610d89611b04565b60405160609190911b6bffffffffffffffffffffffff1916602082015260348101869052605481018590526074015b60408051601f1981840301815282825280516020918201207f19457468657265756d205369676e6564204d6573736167653a0a33320000000084830152603c8085019190915282518085039091018152605c909301909152815191012090565b9050610e248183611f5e565b610e8a5760405162461bcd60e51b815260206004820152603160248201527f436f6e73656e743a20436f6e7472616374206f776e657220646964206e6f74206044820152707369676e2074686973206d65737361676560781b6064820152608401610827565b610e9b610e95611b04565b85611ff9565b600084815261019860205260408120805485189055610194805491610ebf836139ca565b9091555050610192546001600160a01b03166335f011d9610ede611b04565b6040516001600160e01b031960e084901b1681526001600160a01b039091166004820152602401600060405180830381600087803b158015610f1f57600080fd5b505af1158015610f33573d6000803e3d6000fd5b5050505050505050565b61099783838360405180602001604052806000815250611a06565b610f63610c4d611b04565b610f7f5760405162461bcd60e51b81526004016108279061393a565b610d4981612013565b610d4981610f58565b6000610f9c81611c7e565b6000610196805480602002602001604051908101604052809291908181526020016000905b8282101561106d578382906000526020600020018054610fe09061386a565b80601f016020809104026020016040519081016040528092919081815260200182805461100c9061386a565b80156110595780601f1061102e57610100808354040283529160200191611059565b820191906000526020600020905b81548152906001019060200180831161103c57829003601f168201915b505050505081526020019060010190610fc1565b50505050905060005b6101965481101561113e578360405160200161109291906138a5565b604051602081830303815290604052805190602001208282815181106110ba576110ba6138c1565b60200260200101516040516020016110d291906138a5565b6040516020818303038152906040528051906020012014156111365760405162461bcd60e51b815260206004820152601e60248201527f436f6e73656e74203a20446f6d61696e20616c726561647920616464656400006044820152606401610827565b600101611076565b5061019680546001810182556000919091528351611183917f828feda00a4b64eb35101b6df8f6c29717b1ea6bae5dd03d3ddada8de0a9e7cb01906020860190613362565b507f518f4dd9e1ba750adb395696c0d4f5417dd0d7686a59f0ba155189e550421533836040516111b39190613476565b60405180910390a1505050565b60006111cb81611c7e565b815161099790610193906020850190613362565b6000818152610198602052604081205481905b801561120f5761120560018216836139e5565b915060011c6111f2565b5092915050565b600054610100900460ff16158080156112365750600054600160ff909116105b806112505750303b158015611250575060005460ff166001145b6112b35760405162461bcd60e51b815260206004820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201526d191e481a5b9a5d1a585b1a5e995960921b6064820152608401610827565b6000805460ff1916600117905580156112d6576000805461ff0019166101001790555b6112ff836040518060400160405280600781526020016610d3d394d1539560ca1b8152506120b1565b6113076120e2565b61130f612109565b6113176120e2565b61131f6120e2565b61019180546001600160a01b03199081166001600160a01b038516908117909255610192805490911690911790556101958054610100600160a81b03191674f7c6dc708550d89558110caecd20a8a6a184427e001790554361019755611386600086612138565b61139e600080516020613c2383398151915286612138565b6113c87fe2f4eaae4a9751e85a3e4a7b9587827a877f29914755229b07a7b2da98285f7086612138565b6113f27f61a3517f153a09154844ed8be639dabc6e78dc22315c2d9a91f7eddf9398c00286612138565b6113fd600033612138565b611406846111c0565b801561144c576000805461ff0019169055604051600181527f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb38474024989060200160405180910390a15b5050505050565b6000818152606760205260408120546001600160a01b03168061072b5760405162461bcd60e51b8152602060048201526018602482015277115490cdcc8c4e881a5b9d985b1a59081d1bdad95b88125160421b6044820152606401610827565b61019380546114c19061386a565b80601f01602080910402602001604051908101604052809291908181526020018280546114ed9061386a565b801561153a5780601f1061150f5761010080835404028352916020019161153a565b820191906000526020600020905b81548152906001019060200180831161151d57829003601f168201915b505050505081565b7f61a3517f153a09154844ed8be639dabc6e78dc22315c2d9a91f7eddf9398c00261156c81611c7e565b8160405161157a91906138a5565b604051809103902061158a611b04565b6001600160a01b03167f31df2703b10660cea45214572e0616949f363a34b1c19dca24026609f4665570846040516115c29190613476565b60405180910390a35050565b60006001600160a01b0382166116385760405162461bcd60e51b815260206004820152602960248201527f4552433732313a2061646472657373207a65726f206973206e6f7420612076616044820152683634b21037bbb732b960b91b6064820152608401610827565b506001600160a01b031660009081526068602052604090205490565b600080516020613c2383398151915261166c81611c7e565b50610195805460ff19169055565b600080516020613c2383398151915261169281611c7e565b610d4961215b565b600082815261012d602052604081206116b39083612199565b9392505050565b6060610196805480602002602001604051908101604052809291908181526020016000905b8282101561178b5783829060005260206000200180546116fe9061386a565b80601f016020809104026020016040519081016040528092919081815260200182805461172a9061386a565b80156117775780601f1061174c57610100808354040283529160200191611777565b820191906000526020600020905b81548152906001019060200180831161175a57829003601f168201915b5050505050815260200190600101906116df565b50505050905090565b600091825260fb602090815260408084206001600160a01b0393909316845291905290205460ff1690565b6060606680546107409061386a565b6108496117d9611b04565b83836121a5565b6117e8611f16565b6117f3610564611b04565b156118105760405162461bcd60e51b815260040161082790613988565b6000610e188484604051602001610db8929190918252602082015260400190565b611839611f16565b6101955460ff16156118a25760405162461bcd60e51b815260206004820152602c60248201527f436f6e73656e743a204f70656e206f70742d696e73206172652063757272656e60448201526b1d1b1e48191a5cd8589b195960a21b6064820152608401610827565b6118ad610564611b04565b156118ca5760405162461bcd60e51b815260040161082790613988565b6118db6118d5611b04565b83611ff9565b6000828152610198602052604081208054831890556101948054916118ff836139ca565b9091555050610192546001600160a01b03166335f011d961191e611b04565b6040516001600160e01b031960e084901b1681526001600160a01b0390911660048201526024015b600060405180830381600087803b15801561196057600080fd5b505af1158015611974573d6000803e3d6000fd5b505050505050565b600061198781611c7e565b6101975482116119ff5760405162461bcd60e51b815260206004820152603860248201527f4e657720686f72697a6f6e206d757374206265207374726963746c79206c617460448201527f6572207468616e2063757272656e7420686f72697a6f6e2e00000000000000006064820152608401610827565b5061019755565b611a116107ce611b04565b611a2d5760405162461bcd60e51b81526004016108279061393a565b610c3c84848484612274565b606061072b826122a7565b600081815261012d6020526040812061072b906123a3565b600080516020613c23833981519152611a7481611c7e565b50610195805460ff19166001179055565b600082815260fb6020526040902060010154611aa081611c7e565b6109978383611e7a565b6000611ab581611c7e565b5061019580546001600160a01b0390921661010002610100600160a81b0319909216919091179055565b60006001600160e01b03198216635a05180f60e01b148061072b575061072b826123ad565b6101955460009061010090046001600160a01b0316331415611b2d575060131936013560601c90565b503390565b600080611b3e83611453565b9050806001600160a01b0316846001600160a01b03161480611b8557506001600160a01b038082166000908152606a602090815260408083209388168352929052205460ff165b80611ba95750836001600160a01b0316611b9e8461084d565b6001600160a01b0316145b949350505050565b6000818152606760205260409020546001600160a01b0316610d495760405162461bcd60e51b8152602060048201526018602482015277115490cdcc8c4e881a5b9d985b1a59081d1bdad95b88125160421b6044820152606401610827565b600081815260696020526040902080546001600160a01b0319166001600160a01b0384169081179091558190611c4582611453565b6001600160a01b03167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92560405160405180910390a45050565b610d4981611c8a611b04565b6123d2565b826001600160a01b0316611ca282611453565b6001600160a01b031614611d065760405162461bcd60e51b815260206004820152602560248201527f4552433732313a207472616e736665722066726f6d20696e636f72726563742060448201526437bbb732b960d91b6064820152608401610827565b6001600160a01b038216611d685760405162461bcd60e51b8152602060048201526024808201527f4552433732313a207472616e7366657220746f20746865207a65726f206164646044820152637265737360e01b6064820152608401610827565b611d73838383612436565b611d7e600082611c10565b6001600160a01b0383166000908152606860205260408120805460019290611da79084906138ed565b90915550506001600160a01b0382166000908152606860205260408120805460019290611dd59084906139e5565b909155505060008181526067602052604080822080546001600160a01b0319166001600160a01b0386811691821790925591518493918716917fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef91a4505050565b611e408282612138565b61019254604051635c655a5560e11b81526001600160a01b038381166004830152602482018590529091169063b8cab4aa90604401611946565b611e8482826124bd565b61019254604051637659125360e01b81526001600160a01b0383811660048301526024820185905290911690637659125390604401611946565b611ec66124e0565b60c9805460ff191690557f5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa611ef9611b04565b6040516001600160a01b03909116815260200160405180910390a1565b60c95460ff1615611f5c5760405162461bcd60e51b815260206004820152601060248201526f14185d5cd8589b194e881c185d5cd95960821b6044820152606401610827565b565b600080611f6b8484612529565b90506001600160a01b038116611fcf5760405162461bcd60e51b8152602060048201526024808201527f436f6e73656e743a205369676e65722063616e6e6f742062652030206164647260448201526332b9b99760e11b6064820152608401610827565b611ba97fe2f4eaae4a9751e85a3e4a7b9587827a877f29914755229b07a7b2da98285f7082611794565b61084982826040518060200160405280600081525061254d565b6101948054906000612024836139fd565b90915550506000818152610198602052604081205561204281612580565b610192546001600160a01b031663385f725a61205c611b04565b6040516001600160e01b031960e084901b1681526001600160a01b039091166004820152602401600060405180830381600087803b15801561209d57600080fd5b505af115801561144c573d6000803e3d6000fd5b600054610100900460ff166120d85760405162461bcd60e51b815260040161082790613a14565b61084982826125c0565b600054610100900460ff16611f5c5760405162461bcd60e51b815260040161082790613a14565b600054610100900460ff166121305760405162461bcd60e51b815260040161082790613a14565b611f5c61260e565b6121428282612641565b600082815261012d6020526040902061099790826126c8565b612163611f16565b60c9805460ff191660011790557f62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a258611ef9611b04565b60006116b383836126dd565b816001600160a01b0316836001600160a01b031614156122075760405162461bcd60e51b815260206004820152601960248201527f4552433732313a20617070726f766520746f2063616c6c6572000000000000006044820152606401610827565b6001600160a01b038381166000818152606a6020908152604080832094871680845294825291829020805460ff191686151590811790915591519182527f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31910160405180910390a3505050565b61227f848484611c8f565b61228b84848484612707565b610c3c5760405162461bcd60e51b815260040161082790613a5f565b60606122b282611bb1565b600082815260976020526040812080546122cb9061386a565b80601f01602080910402602001604051908101604052809291908181526020018280546122f79061386a565b80156123445780601f1061231957610100808354040283529160200191612344565b820191906000526020600020905b81548152906001019060200180831161232757829003601f168201915b50505050509050600061235561281b565b9050805160001415612368575092915050565b81511561239a578082604051602001612382929190613ab1565b60405160208183030381529060405292505050919050565b611ba98461282b565b600061072b825490565b60006001600160e01b03198216637965db0b60e01b148061072b575061072b82612891565b6123dc8282611794565b610849576123f4816001600160a01b031660146128e1565b6123ff8360206128e1565b604051602001612410929190613ae0565b60408051601f198184030181529082905262461bcd60e51b825261082791600401613476565b61243e611f16565b6001600160a01b038316158061245b57506001600160a01b038216155b6109975760405162461bcd60e51b815260206004820152602d60248201527f436f6e73656e743a20436f6e73656e7420746f6b656e7320617265206e6f6e2d60448201526c7472616e736665727261626c6560981b6064820152608401610827565b6124c78282612a7d565b600082815261012d602052604090206109979082612b02565b60c95460ff16611f5c5760405162461bcd60e51b815260206004820152601460248201527314185d5cd8589b194e881b9bdd081c185d5cd95960621b6044820152606401610827565b60008060006125388585612b17565b9150915061254581612b87565b509392505050565b6125578383612d42565b6125646000848484612707565b6109975760405162461bcd60e51b815260040161082790613a5f565b61258981612e90565b600081815260976020526040902080546125a29061386a565b159050610d49576000818152609760205260408120610d4991613328565b600054610100900460ff166125e75760405162461bcd60e51b815260040161082790613a14565b81516125fa906065906020850190613362565b508051610997906066906020840190613362565b600054610100900460ff166126355760405162461bcd60e51b815260040161082790613a14565b60c9805460ff19169055565b61264b8282611794565b61084957600082815260fb602090815260408083206001600160a01b03851684529091529020805460ff19166001179055612684611b04565b6001600160a01b0316816001600160a01b0316837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45050565b60006116b3836001600160a01b038416612f37565b60008260000182815481106126f4576126f46138c1565b9060005260206000200154905092915050565b60006001600160a01b0384163b1561281057836001600160a01b031663150b7a02612730611b04565b8786866040518563ffffffff1660e01b81526004016127529493929190613b55565b602060405180830381600087803b15801561276c57600080fd5b505af192505050801561279c575060408051601f3d908101601f1916820190925261279991810190613b92565b60015b6127f6573d8080156127ca576040519150601f19603f3d011682016040523d82523d6000602084013e6127cf565b606091505b5080516127ee5760405162461bcd60e51b815260040161082790613a5f565b805181602001fd5b6001600160e01b031916630a85bd0160e11b149050611ba9565b506001949350505050565b606061019380546107409061386a565b606061283682611bb1565b600061284061281b565b9050600081511161286057604051806020016040528060008152506116b3565b8061286a84612f86565b60405160200161287b929190613ab1565b6040516020818303038152906040529392505050565b60006001600160e01b031982166380ac58cd60e01b14806128c257506001600160e01b03198216635b5e139f60e01b145b8061072b57506301ffc9a760e01b6001600160e01b031983161461072b565b606060006128f0836002613baf565b6128fb9060026139e5565b67ffffffffffffffff8111156129135761291361350a565b6040519080825280601f01601f19166020018201604052801561293d576020820181803683370190505b509050600360fc1b81600081518110612958576129586138c1565b60200101906001600160f81b031916908160001a905350600f60fb1b81600181518110612987576129876138c1565b60200101906001600160f81b031916908160001a90535060006129ab846002613baf565b6129b69060016139e5565b90505b6001811115612a2e576f181899199a1a9b1b9c1cb0b131b232b360811b85600f16601081106129ea576129ea6138c1565b1a60f81b828281518110612a0057612a006138c1565b60200101906001600160f81b031916908160001a90535060049490941c93612a27816139fd565b90506129b9565b5083156116b35760405162461bcd60e51b815260206004820181905260248201527f537472696e67733a20686578206c656e67746820696e73756666696369656e746044820152606401610827565b612a878282611794565b1561084957600082815260fb602090815260408083206001600160a01b03851684529091529020805460ff19169055612abe611b04565b6001600160a01b0316816001600160a01b0316837ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b60405160405180910390a45050565b60006116b3836001600160a01b038416613084565b600080825160411415612b4e5760208301516040840151606085015160001a612b4287828585613177565b94509450505050612b80565b825160401415612b785760208301516040840151612b6d868383613264565b935093505050612b80565b506000905060025b9250929050565b6000816004811115612b9b57612b9b613bce565b1415612ba45750565b6001816004811115612bb857612bb8613bce565b1415612c065760405162461bcd60e51b815260206004820152601860248201527f45434453413a20696e76616c6964207369676e617475726500000000000000006044820152606401610827565b6002816004811115612c1a57612c1a613bce565b1415612c685760405162461bcd60e51b815260206004820152601f60248201527f45434453413a20696e76616c6964207369676e6174757265206c656e677468006044820152606401610827565b6003816004811115612c7c57612c7c613bce565b1415612cd55760405162461bcd60e51b815260206004820152602260248201527f45434453413a20696e76616c6964207369676e6174757265202773272076616c604482015261756560f01b6064820152608401610827565b6004816004811115612ce957612ce9613bce565b1415610d495760405162461bcd60e51b815260206004820152602260248201527f45434453413a20696e76616c6964207369676e6174757265202776272076616c604482015261756560f01b6064820152608401610827565b6001600160a01b038216612d985760405162461bcd60e51b815260206004820181905260248201527f4552433732313a206d696e7420746f20746865207a65726f20616464726573736044820152606401610827565b6000818152606760205260409020546001600160a01b031615612dfd5760405162461bcd60e51b815260206004820152601c60248201527f4552433732313a20746f6b656e20616c7265616479206d696e746564000000006044820152606401610827565b612e0960008383612436565b6001600160a01b0382166000908152606860205260408120805460019290612e329084906139e5565b909155505060008181526067602052604080822080546001600160a01b0319166001600160a01b03861690811790915590518392907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef908290a45050565b6000612e9b82611453565b9050612ea981600084612436565b612eb4600083611c10565b6001600160a01b0381166000908152606860205260408120805460019290612edd9084906138ed565b909155505060008281526067602052604080822080546001600160a01b0319169055518391906001600160a01b038416907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef908390a45050565b6000818152600183016020526040812054612f7e5750815460018181018455600084815260208082209093018490558454848252828601909352604090209190915561072b565b50600061072b565b606081612faa5750506040805180820190915260018152600360fc1b602082015290565b8160005b8115612fd45780612fbe816139ca565b9150612fcd9050600a83613bfa565b9150612fae565b60008167ffffffffffffffff811115612fef57612fef61350a565b6040519080825280601f01601f191660200182016040528015613019576020820181803683370190505b5090505b8415611ba95761302e6001836138ed565b915061303b600a86613c0e565b6130469060306139e5565b60f81b81838151811061305b5761305b6138c1565b60200101906001600160f81b031916908160001a90535061307d600a86613bfa565b945061301d565b6000818152600183016020526040812054801561316d5760006130a86001836138ed565b85549091506000906130bc906001906138ed565b90508181146131215760008660000182815481106130dc576130dc6138c1565b90600052602060002001549050808760000184815481106130ff576130ff6138c1565b6000918252602080832090910192909255918252600188019052604090208390555b855486908061313257613132613904565b60019003818190600052602060002001600090559055856001016000868152602001908152602001600020600090556001935050505061072b565b600091505061072b565b6000807f7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a08311156131ae575060009050600361325b565b8460ff16601b141580156131c657508460ff16601c14155b156131d7575060009050600461325b565b6040805160008082526020820180845289905260ff881692820192909252606081018690526080810185905260019060a0016020604051602081039080840390855afa15801561322b573d6000803e3d6000fd5b5050604051601f1901519150506001600160a01b0381166132545760006001925092505061325b565b9150600090505b94509492505050565b6000806001600160ff1b0383168161328160ff86901c601b6139e5565b905061328f87828885613177565b935093505050935093915050565b8280546132a99061386a565b90600052602060002090601f0160209004810192826132cb5760008555613318565b82601f106132dc5780548555613318565b8280016001018555821561331857600052602060002091601f016020900482015b828111156133185782548255916001019190600101906132fd565b506133249291506133d6565b5090565b5080546133349061386a565b6000825580601f10613344575050565b601f016020900490600052602060002090810190610d4991906133d6565b82805461336e9061386a565b90600052602060002090601f0160209004810192826133905760008555613318565b82601f106133a957805160ff1916838001178555613318565b82800160010185558215613318579182015b828111156133185782518255916020019190600101906133bb565b5b8082111561332457600081556001016133d7565b6001600160e01b031981168114610d4957600080fd5b60006020828403121561341357600080fd5b81356116b3816133eb565b60005b83811015613439578181015183820152602001613421565b83811115610c3c5750506000910152565b6000815180845261346281602086016020860161341e565b601f01601f19169290920160200192915050565b6020815260006116b3602083018461344a565b6000806040838503121561349c57600080fd5b50508035926020909101359150565b6000602082840312156134bd57600080fd5b5035919050565b80356001600160a01b03811681146134db57600080fd5b919050565b600080604083850312156134f357600080fd5b6134fc836134c4565b946020939093013593505050565b634e487b7160e01b600052604160045260246000fd5b600082601f83011261353157600080fd5b813567ffffffffffffffff8082111561354c5761354c61350a565b604051601f8301601f19908116603f011681019082821181831017156135745761357461350a565b8160405283815286602085880101111561358d57600080fd5b836020870160208301376000602085830101528094505050505092915050565b6000602082840312156135bf57600080fd5b813567ffffffffffffffff8111156135d657600080fd5b611ba984828501613520565b6000806000606084860312156135f757600080fd5b613600846134c4565b925061360e602085016134c4565b9150604084013590509250925092565b6000806040838503121561363157600080fd5b82359150613641602084016134c4565b90509250929050565b60008060006060848603121561365f57600080fd5b8335925060208401359150604084013567ffffffffffffffff81111561368457600080fd5b61369086828701613520565b9150509250925092565b6000602082840312156136ac57600080fd5b6116b3826134c4565b600080600080608085870312156136cb57600080fd5b6136d4856134c4565b9350602085013567ffffffffffffffff808211156136f157600080fd5b6136fd88838901613520565b9450604087013591508082111561371357600080fd5b5061372087828801613520565b92505061372f606086016134c4565b905092959194509250565b6000602080830181845280855180835260408601915060408160051b870101925083870160005b8281101561378f57603f1988860301845261377d85835161344a565b94509285019290850190600101613761565b5092979650505050505050565b600080604083850312156137af57600080fd5b6137b8836134c4565b9150602083013580151581146137cd57600080fd5b809150509250929050565b600080600080608085870312156137ee57600080fd5b6137f7856134c4565b9350613805602086016134c4565b925060408501359150606085013567ffffffffffffffff81111561382857600080fd5b61383487828801613520565b91505092959194509250565b6000806040838503121561385357600080fd5b61385c836134c4565b9150613641602084016134c4565b600181811c9082168061387e57607f821691505b6020821081141561389f57634e487b7160e01b600052602260045260246000fd5b50919050565b600082516138b781846020870161341e565b9190910192915050565b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052601160045260246000fd5b6000828210156138ff576138ff6138d7565b500390565b634e487b7160e01b600052603160045260246000fd5b600060ff821660ff811415613931576139316138d7565b60010192915050565b6020808252602e908201527f4552433732313a2063616c6c6572206973206e6f7420746f6b656e206f776e6560408201526d1c881b9bdc88185c1c1c9bdd995960921b606082015260800190565b60208082526022908201527f436f6e73656e743a20557365722068617320616c7265616479206f707465642060408201526134b760f11b606082015260800190565b60006000198214156139de576139de6138d7565b5060010190565b600082198211156139f8576139f86138d7565b500190565b600081613a0c57613a0c6138d7565b506000190190565b6020808252602b908201527f496e697469616c697a61626c653a20636f6e7472616374206973206e6f74206960408201526a6e697469616c697a696e6760a81b606082015260800190565b60208082526032908201527f4552433732313a207472616e7366657220746f206e6f6e20455243373231526560408201527131b2b4bb32b91034b6b83632b6b2b73a32b960711b606082015260800190565b60008351613ac381846020880161341e565b835190830190613ad781836020880161341e565b01949350505050565b7f416363657373436f6e74726f6c3a206163636f756e7420000000000000000000815260008351613b1881601785016020880161341e565b7001034b99036b4b9b9b4b733903937b6329607d1b6017918401918201528351613b4981602884016020880161341e565b01602801949350505050565b6001600160a01b0385811682528416602082015260408101839052608060608201819052600090613b889083018461344a565b9695505050505050565b600060208284031215613ba457600080fd5b81516116b3816133eb565b6000816000190483118215151615613bc957613bc96138d7565b500290565b634e487b7160e01b600052602160045260246000fd5b634e487b7160e01b600052601260045260246000fd5b600082613c0957613c09613be4565b500490565b600082613c1d57613c1d613be4565b50069056fe65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862aa26469706673582212201b12ec8bfd6f7f69fbdb03d18290ec2c7a6042384f4ae823b06a0bbf2028c43064736f6c63430008090033",
  linkReferences: {},
  deployedLinkReferences: {},
};
