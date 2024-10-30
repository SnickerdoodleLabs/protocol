export default {
  _format: "hh-sol-artifact-1",
  contractName: "ONFT721Reward",
  sourceName: "contracts/testing/ONFT721Reward.sol",
  abi: [
    {
      inputs: [
        {
          internalType: "string",
          name: "name",
          type: "string",
        },
        {
          internalType: "string",
          name: "symbol",
          type: "string",
        },
        {
          internalType: "string",
          name: "baseUri",
          type: "string",
        },
        {
          internalType: "uint256",
          name: "minGasToTransfer",
          type: "uint256",
        },
        {
          internalType: "address",
          name: "lzEndpoint",
          type: "address",
        },
      ],
      stateMutability: "nonpayable",
      type: "constructor",
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
          internalType: "bytes32",
          name: "_hashedPayload",
          type: "bytes32",
        },
      ],
      name: "CreditCleared",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "bytes32",
          name: "_hashedPayload",
          type: "bytes32",
        },
        {
          indexed: false,
          internalType: "bytes",
          name: "_payload",
          type: "bytes",
        },
      ],
      name: "CreditStored",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint16",
          name: "_srcChainId",
          type: "uint16",
        },
        {
          indexed: false,
          internalType: "bytes",
          name: "_srcAddress",
          type: "bytes",
        },
        {
          indexed: false,
          internalType: "uint64",
          name: "_nonce",
          type: "uint64",
        },
        {
          indexed: false,
          internalType: "bytes",
          name: "_payload",
          type: "bytes",
        },
        {
          indexed: false,
          internalType: "bytes",
          name: "_reason",
          type: "bytes",
        },
      ],
      name: "MessageFailed",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "previousOwner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "newOwner",
          type: "address",
        },
      ],
      name: "OwnershipTransferred",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "uint16",
          name: "_srcChainId",
          type: "uint16",
        },
        {
          indexed: true,
          internalType: "bytes",
          name: "_srcAddress",
          type: "bytes",
        },
        {
          indexed: true,
          internalType: "address",
          name: "_toAddress",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256[]",
          name: "_tokenIds",
          type: "uint256[]",
        },
      ],
      name: "ReceiveFromChain",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint16",
          name: "_srcChainId",
          type: "uint16",
        },
        {
          indexed: false,
          internalType: "bytes",
          name: "_srcAddress",
          type: "bytes",
        },
        {
          indexed: false,
          internalType: "uint64",
          name: "_nonce",
          type: "uint64",
        },
        {
          indexed: false,
          internalType: "bytes32",
          name: "_payloadHash",
          type: "bytes32",
        },
      ],
      name: "RetryMessageSuccess",
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
          internalType: "uint16",
          name: "_dstChainId",
          type: "uint16",
        },
        {
          indexed: true,
          internalType: "address",
          name: "_from",
          type: "address",
        },
        {
          indexed: true,
          internalType: "bytes",
          name: "_toAddress",
          type: "bytes",
        },
        {
          indexed: false,
          internalType: "uint256[]",
          name: "_tokenIds",
          type: "uint256[]",
        },
      ],
      name: "SendToChain",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint16",
          name: "_dstChainId",
          type: "uint16",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "_dstChainIdToBatchLimit",
          type: "uint256",
        },
      ],
      name: "SetDstChainIdToBatchLimit",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint16",
          name: "_dstChainId",
          type: "uint16",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "_dstChainIdToTransferGas",
          type: "uint256",
        },
      ],
      name: "SetDstChainIdToTransferGas",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint16",
          name: "_dstChainId",
          type: "uint16",
        },
        {
          indexed: false,
          internalType: "uint16",
          name: "_type",
          type: "uint16",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "_minDstGas",
          type: "uint256",
        },
      ],
      name: "SetMinDstGas",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint256",
          name: "_minGasToTransferAndStore",
          type: "uint256",
        },
      ],
      name: "SetMinGasToTransferAndStore",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "address",
          name: "precrime",
          type: "address",
        },
      ],
      name: "SetPrecrime",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint16",
          name: "_remoteChainId",
          type: "uint16",
        },
        {
          indexed: false,
          internalType: "bytes",
          name: "_path",
          type: "bytes",
        },
      ],
      name: "SetTrustedRemote",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint16",
          name: "_remoteChainId",
          type: "uint16",
        },
        {
          indexed: false,
          internalType: "bytes",
          name: "_remoteAddress",
          type: "bytes",
        },
      ],
      name: "SetTrustedRemoteAddress",
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
      name: "DEFAULT_PAYLOAD_SIZE_LIMIT",
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
      name: "FUNCTION_TYPE_SEND",
      outputs: [
        {
          internalType: "uint16",
          name: "",
          type: "uint16",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "MINTER_ROLE",
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
      inputs: [
        {
          internalType: "bytes",
          name: "_payload",
          type: "bytes",
        },
      ],
      name: "clearCredits",
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
          internalType: "uint16",
          name: "dstChainId",
          type: "uint16",
        },
        {
          internalType: "bytes",
          name: "toAddress",
          type: "bytes",
        },
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "gas",
          type: "uint256",
        },
      ],
      name: "crossChain",
      outputs: [],
      stateMutability: "payable",
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
      name: "domains",
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
          internalType: "uint16",
          name: "",
          type: "uint16",
        },
      ],
      name: "dstChainIdToBatchLimit",
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
          internalType: "uint16",
          name: "",
          type: "uint16",
        },
      ],
      name: "dstChainIdToTransferGas",
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
          internalType: "uint16",
          name: "_dstChainId",
          type: "uint16",
        },
        {
          internalType: "bytes",
          name: "_toAddress",
          type: "bytes",
        },
        {
          internalType: "uint256[]",
          name: "_tokenIds",
          type: "uint256[]",
        },
        {
          internalType: "bool",
          name: "_useZro",
          type: "bool",
        },
        {
          internalType: "bytes",
          name: "_adapterParams",
          type: "bytes",
        },
      ],
      name: "estimateSendBatchFee",
      outputs: [
        {
          internalType: "uint256",
          name: "nativeFee",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "zroFee",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint16",
          name: "_dstChainId",
          type: "uint16",
        },
        {
          internalType: "bytes",
          name: "_toAddress",
          type: "bytes",
        },
        {
          internalType: "uint256",
          name: "_tokenId",
          type: "uint256",
        },
        {
          internalType: "bool",
          name: "_useZro",
          type: "bool",
        },
        {
          internalType: "bytes",
          name: "_adapterParams",
          type: "bytes",
        },
      ],
      name: "estimateSendFee",
      outputs: [
        {
          internalType: "uint256",
          name: "nativeFee",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "zroFee",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint16",
          name: "",
          type: "uint16",
        },
        {
          internalType: "bytes",
          name: "",
          type: "bytes",
        },
        {
          internalType: "uint64",
          name: "",
          type: "uint64",
        },
      ],
      name: "failedMessages",
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
          internalType: "uint16",
          name: "_srcChainId",
          type: "uint16",
        },
        {
          internalType: "bytes",
          name: "_srcAddress",
          type: "bytes",
        },
      ],
      name: "forceResumeReceive",
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
      inputs: [
        {
          internalType: "uint16",
          name: "_version",
          type: "uint16",
        },
        {
          internalType: "uint16",
          name: "_chainId",
          type: "uint16",
        },
        {
          internalType: "address",
          name: "",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "_configType",
          type: "uint256",
        },
      ],
      name: "getConfig",
      outputs: [
        {
          internalType: "bytes",
          name: "",
          type: "bytes",
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
          internalType: "uint16",
          name: "_remoteChainId",
          type: "uint16",
        },
      ],
      name: "getTrustedRemoteAddress",
      outputs: [
        {
          internalType: "bytes",
          name: "",
          type: "bytes",
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
          internalType: "uint16",
          name: "_srcChainId",
          type: "uint16",
        },
        {
          internalType: "bytes",
          name: "_srcAddress",
          type: "bytes",
        },
      ],
      name: "isTrustedRemote",
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
      name: "lzEndpoint",
      outputs: [
        {
          internalType: "contract ILayerZeroEndpoint",
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
          internalType: "uint16",
          name: "_srcChainId",
          type: "uint16",
        },
        {
          internalType: "bytes",
          name: "_srcAddress",
          type: "bytes",
        },
        {
          internalType: "uint64",
          name: "_nonce",
          type: "uint64",
        },
        {
          internalType: "bytes",
          name: "_payload",
          type: "bytes",
        },
      ],
      name: "lzReceive",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint16",
          name: "",
          type: "uint16",
        },
        {
          internalType: "uint16",
          name: "",
          type: "uint16",
        },
      ],
      name: "minDstGasLookup",
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
      name: "minGasToTransferAndStore",
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
      inputs: [
        {
          internalType: "uint16",
          name: "_srcChainId",
          type: "uint16",
        },
        {
          internalType: "bytes",
          name: "_srcAddress",
          type: "bytes",
        },
        {
          internalType: "uint64",
          name: "_nonce",
          type: "uint64",
        },
        {
          internalType: "bytes",
          name: "_payload",
          type: "bytes",
        },
      ],
      name: "nonblockingLzReceive",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "owner",
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
      inputs: [
        {
          internalType: "uint16",
          name: "",
          type: "uint16",
        },
      ],
      name: "payloadSizeLimitLookup",
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
      name: "precrime",
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
      inputs: [],
      name: "renounceOwnership",
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
          internalType: "uint16",
          name: "_srcChainId",
          type: "uint16",
        },
        {
          internalType: "bytes",
          name: "_srcAddress",
          type: "bytes",
        },
        {
          internalType: "uint64",
          name: "_nonce",
          type: "uint64",
        },
        {
          internalType: "bytes",
          name: "_payload",
          type: "bytes",
        },
      ],
      name: "retryMessage",
      outputs: [],
      stateMutability: "payable",
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
          name: "to",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "safeMint",
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
          name: "_from",
          type: "address",
        },
        {
          internalType: "uint16",
          name: "_dstChainId",
          type: "uint16",
        },
        {
          internalType: "bytes",
          name: "_toAddress",
          type: "bytes",
        },
        {
          internalType: "uint256[]",
          name: "_tokenIds",
          type: "uint256[]",
        },
        {
          internalType: "address payable",
          name: "_refundAddress",
          type: "address",
        },
        {
          internalType: "address",
          name: "_zroPaymentAddress",
          type: "address",
        },
        {
          internalType: "bytes",
          name: "_adapterParams",
          type: "bytes",
        },
      ],
      name: "sendBatchFrom",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_from",
          type: "address",
        },
        {
          internalType: "uint16",
          name: "_dstChainId",
          type: "uint16",
        },
        {
          internalType: "bytes",
          name: "_toAddress",
          type: "bytes",
        },
        {
          internalType: "uint256",
          name: "_tokenId",
          type: "uint256",
        },
        {
          internalType: "address payable",
          name: "_refundAddress",
          type: "address",
        },
        {
          internalType: "address",
          name: "_zroPaymentAddress",
          type: "address",
        },
        {
          internalType: "bytes",
          name: "_adapterParams",
          type: "bytes",
        },
      ],
      name: "sendFrom",
      outputs: [],
      stateMutability: "payable",
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
          name: "newBaseURI",
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
          internalType: "uint16",
          name: "_version",
          type: "uint16",
        },
        {
          internalType: "uint16",
          name: "_chainId",
          type: "uint16",
        },
        {
          internalType: "uint256",
          name: "_configType",
          type: "uint256",
        },
        {
          internalType: "bytes",
          name: "_config",
          type: "bytes",
        },
      ],
      name: "setConfig",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint16",
          name: "_dstChainId",
          type: "uint16",
        },
        {
          internalType: "uint256",
          name: "_dstChainIdToBatchLimit",
          type: "uint256",
        },
      ],
      name: "setDstChainIdToBatchLimit",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint16",
          name: "_dstChainId",
          type: "uint16",
        },
        {
          internalType: "uint256",
          name: "_dstChainIdToTransferGas",
          type: "uint256",
        },
      ],
      name: "setDstChainIdToTransferGas",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint16",
          name: "_dstChainId",
          type: "uint16",
        },
        {
          internalType: "uint16",
          name: "_packetType",
          type: "uint16",
        },
        {
          internalType: "uint256",
          name: "_minGas",
          type: "uint256",
        },
      ],
      name: "setMinDstGas",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_minGasToTransferAndStore",
          type: "uint256",
        },
      ],
      name: "setMinGasToTransferAndStore",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint16",
          name: "_dstChainId",
          type: "uint16",
        },
        {
          internalType: "uint256",
          name: "_size",
          type: "uint256",
        },
      ],
      name: "setPayloadSizeLimit",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_precrime",
          type: "address",
        },
      ],
      name: "setPrecrime",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint16",
          name: "_version",
          type: "uint16",
        },
      ],
      name: "setReceiveVersion",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint16",
          name: "_version",
          type: "uint16",
        },
      ],
      name: "setSendVersion",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint16",
          name: "_remoteChainId",
          type: "uint16",
        },
        {
          internalType: "bytes",
          name: "_path",
          type: "bytes",
        },
      ],
      name: "setTrustedRemote",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint16",
          name: "_remoteChainId",
          type: "uint16",
        },
        {
          internalType: "bytes",
          name: "_remoteAddress",
          type: "bytes",
        },
      ],
      name: "setTrustedRemoteAddress",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "",
          type: "bytes32",
        },
      ],
      name: "storedCredits",
      outputs: [
        {
          internalType: "uint16",
          name: "srcChainId",
          type: "uint16",
        },
        {
          internalType: "address",
          name: "toAddress",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "index",
          type: "uint256",
        },
        {
          internalType: "bool",
          name: "creditsRemain",
          type: "bool",
        },
      ],
      stateMutability: "view",
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
      inputs: [
        {
          internalType: "address",
          name: "newOwner",
          type: "address",
        },
      ],
      name: "transferOwnership",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint16",
          name: "",
          type: "uint16",
        },
      ],
      name: "trustedRemoteLookup",
      outputs: [
        {
          internalType: "bytes",
          name: "",
          type: "bytes",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
  ],
  bytecode:
    "0x60a06040523480156200001157600080fd5b506040516200605338038062006053833981016040819052620000349162000571565b84848383838383838080620000493362000128565b6001600160a01b031660805250600160065581620000ba5760405162461bcd60e51b8152602060048201526024808201527f6d696e476173546f5472616e73666572416e6453746f7265206d7573742062656044820152630203e20360e41b60648201526084015b60405180910390fd5b50600755600b620000cc8382620006be565b50600c620000db8282620006be565b50505050505050620000f76000801b336200017860201b60201c565b62000112600080516020620060338339815191523362000178565b6200011d8362000203565b5050505050620008ae565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b62000184828262000231565b620001ff5760008281526011602090815260408083206001600160a01b03851684529091529020805460ff19166001179055620001be3390565b6001600160a01b0316816001600160a01b0316837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45b5050565b600080516020620060338339815191526200021e816200025e565b60146200022c8382620006be565b505050565b60008281526011602090815260408083206001600160a01b038516845290915290205460ff165b92915050565b6200026a81336200026d565b50565b62000279828262000231565b620001ff576200028981620002d1565b62000296836020620002e4565b604051602001620002a99291906200078a565b60408051601f198184030181529082905262461bcd60e51b8252620000b19160040162000803565b6060620002586001600160a01b03831660145b60606000620002f58360026200084e565b6200030290600262000868565b6001600160401b038111156200031c576200031c620004a4565b6040519080825280601f01601f19166020018201604052801562000347576020820181803683370190505b509050600360fc1b816000815181106200036557620003656200087e565b60200101906001600160f81b031916908160001a905350600f60fb1b816001815181106200039757620003976200087e565b60200101906001600160f81b031916908160001a9053506000620003bd8460026200084e565b620003ca90600162000868565b90505b60018111156200044c576f181899199a1a9b1b9c1cb0b131b232b360811b85600f16601081106200040257620004026200087e565b1a60f81b8282815181106200041b576200041b6200087e565b60200101906001600160f81b031916908160001a90535060049490941c93620004448162000894565b9050620003cd565b5083156200049d5760405162461bcd60e51b815260206004820181905260248201527f537472696e67733a20686578206c656e67746820696e73756666696369656e746044820152606401620000b1565b9392505050565b634e487b7160e01b600052604160045260246000fd5b60005b83811015620004d7578181015183820152602001620004bd565b50506000910152565b600082601f830112620004f257600080fd5b81516001600160401b03808211156200050f576200050f620004a4565b604051601f8301601f19908116603f011681019082821181831017156200053a576200053a620004a4565b816040528381528660208588010111156200055457600080fd5b62000567846020830160208901620004ba565b9695505050505050565b600080600080600060a086880312156200058a57600080fd5b85516001600160401b0380821115620005a257600080fd5b620005b089838a01620004e0565b96506020880151915080821115620005c757600080fd5b620005d589838a01620004e0565b95506040880151915080821115620005ec57600080fd5b50620005fb88828901620004e0565b60608801516080890151919550935090506001600160a01b03811681146200062257600080fd5b809150509295509295909350565b600181811c908216806200064557607f821691505b6020821081036200066657634e487b7160e01b600052602260045260246000fd5b50919050565b601f8211156200022c57600081815260208120601f850160051c81016020861015620006955750805b601f850160051c820191505b81811015620006b657828155600101620006a1565b505050505050565b81516001600160401b03811115620006da57620006da620004a4565b620006f281620006eb845462000630565b846200066c565b602080601f8311600181146200072a5760008415620007115750858301515b600019600386901b1c1916600185901b178555620006b6565b600085815260208120601f198616915b828110156200075b578886015182559484019460019091019084016200073a565b50858210156200077a5787850151600019600388901b60f8161c191681555b5050505050600190811b01905550565b7f416363657373436f6e74726f6c3a206163636f756e7420000000000000000000815260008351620007c4816017850160208801620004ba565b7001034b99036b4b9b9b4b733903937b6329607d1b6017918401918201528351620007f7816028840160208801620004ba565b01602801949350505050565b602081526000825180602084015262000824816040850160208701620004ba565b601f01601f19169190910160400192915050565b634e487b7160e01b600052601160045260246000fd5b808202811582820484141762000258576200025862000838565b8082018082111562000258576200025862000838565b634e487b7160e01b600052603260045260246000fd5b600081620008a657620008a662000838565b506000190190565b6080516157316200090260003960008181610afa01528181610d6501528181611057015281816112db015281816117a1015281816123fe0152818161298c01528181612abf0152613b9601526157316000f3fe6080604052600436106103e35760003560e01c80637533d78811610208578063b88d4fde11610118578063d5391393116100ab578063eb8d72b71161007a578063eb8d72b714610cb5578063f235364114610cd5578063f2fde38b14610cf5578063f5ecbdbc14610d15578063fa25f9b614610d3557600080fd5b8063d539139314610bf8578063d547741f14610c2c578063df2a5b3b14610c4c578063e985e9c514610c6c57600080fd5b8063cbed8b9c116100e7578063cbed8b9c14610b92578063d01912f014610bb2578063d12473a514610bc5578063d1deba1f14610be557600080fd5b8063b88d4fde14610b1c578063baf3292d14610b3c578063c446183414610b5c578063c87b56dd14610b7257600080fd5b80639ea5d6b11161019b578063a22cb4651161016a578063a22cb46514610a6d578063a6c3d16514610a8d578063ab3ffb9314610aad578063af3fb21c14610ac0578063b353aaa714610ae857600080fd5b80639ea5d6b1146109f85780639f38369a14610a18578063a144819414610a38578063a217fddf14610a5857600080fd5b80639101cc65116101d75780639101cc651461098157806391d14854146109a3578063950c8a74146109c357806395d89b41146109e357600080fd5b80637533d788146108eb5780638cfd8f5c1461090b5780638da5cb5b146109435780638ffa1f2a1461096157600080fd5b80633d8b38f611610303578063519056361161029657806366ad5c8a1161026557806366ad5c8a1461086157806366cf8fab146108815780636c0360eb146108a157806370a08231146108b6578063715018a6146108d657600080fd5b806351905636146107bf57806355f804b3146107d25780635b8c41e6146107f25780636352211e1461084157600080fd5b806342d65a8d116102d257806342d65a8d1461073c57806344e2e74c1461075c578063482881901461077c5780634ac3f4ff1461079257600080fd5b80633d8b38f6146106af5780633f1f4fa4146106cf57806342842e0e146106fc57806342966c681461071c57600080fd5b806310ddb1371161037b578063248a9ca31161034a578063248a9ca3146105fc5780632a205e3d1461063a5780632f2ff15d1461066f57806336568abe1461068f57600080fd5b806310ddb13714610519578063227789291461053957806322a3ecf91461055957806323b872dd146105dc57600080fd5b8063081812fc116103b7578063081812fc14610481578063095ea7b3146104b95780630b4cad4c146104d95780630df37483146104f957600080fd5b80621d3567146103e857806301ffc9a71461040a57806306fdde031461043f57806307e0db1714610461575b600080fd5b3480156103f457600080fd5b506104086104033660046143a9565b610d62565b005b34801561041657600080fd5b5061042a610425366004614452565b610f93565b60405190151581526020015b60405180910390f35b34801561044b57600080fd5b50610454610fa4565b60405161043691906144bf565b34801561046d57600080fd5b5061040861047c3660046144d2565b611036565b34801561048d57600080fd5b506104a161049c3660046144ed565b6110bf565b6040516001600160a01b039091168152602001610436565b3480156104c557600080fd5b506104086104d4366004614526565b6110e6565b3480156104e557600080fd5b506104086104f43660046144ed565b6111fb565b34801561050557600080fd5b50610408610514366004614552565b61129b565b34801561052557600080fd5b506104086105343660046144d2565b6112ba565b34801561054557600080fd5b50610408610554366004614619565b611312565b34801561056557600080fd5b506105ad6105743660046144ed565b600a6020526000908152604090208054600182015460029092015461ffff821692620100009092046001600160a01b0316919060ff1684565b6040805161ffff90951685526001600160a01b0390931660208501529183015215156060820152608001610436565b3480156105e857600080fd5b506104086105f7366004614661565b61156f565b34801561060857600080fd5b5061062c6106173660046144ed565b60009081526011602052604090206001015490565b604051908152602001610436565b34801561064657600080fd5b5061065a6106553660046146d2565b6115a1565b60408051928352602083019190915201610436565b34801561067b57600080fd5b5061040861068a366004614760565b6115c7565b34801561069b57600080fd5b506104086106aa366004614760565b6115ec565b3480156106bb57600080fd5b5061042a6106ca366004614790565b61166a565b3480156106db57600080fd5b5061062c6106ea3660046144d2565b60036020526000908152604090205481565b34801561070857600080fd5b50610408610717366004614661565b611736565b34801561072857600080fd5b506104086107373660046144ed565b611751565b34801561074857600080fd5b50610408610757366004614790565b611782565b34801561076857600080fd5b50610408610777366004614619565b611808565b34801561078857600080fd5b5061062c60075481565b34801561079e57600080fd5b5061062c6107ad3660046144d2565b60086020526000908152604090205481565b6104086107cd3660046147e2565b6119ef565b3480156107de57600080fd5b506104086107ed366004614619565b611a06565b3480156107fe57600080fd5b5061062c61080d36600461489b565b6005602090815260009384526040808520845180860184018051928152908401958401959095209452929052825290205481565b34801561084d57600080fd5b506104a161085c3660046144ed565b611a3c565b34801561086d57600080fd5b5061040861087c3660046143a9565b611a9c565b34801561088d57600080fd5b5061045461089c3660046144ed565b611b78565b3480156108ad57600080fd5b50610454611c24565b3480156108c257600080fd5b5061062c6108d13660046148f8565b611c31565b3480156108e257600080fd5b50610408611cb7565b3480156108f757600080fd5b506104546109063660046144d2565b611ccb565b34801561091757600080fd5b5061062c610926366004614915565b600260209081526000928352604080842090915290825290205481565b34801561094f57600080fd5b506000546001600160a01b03166104a1565b34801561096d57600080fd5b5061040861097c366004614948565b611ce4565b34801561098d57600080fd5b50610996611f2c565b604051610436919061497c565b3480156109af57600080fd5b5061042a6109be366004614760565b612005565b3480156109cf57600080fd5b506004546104a1906001600160a01b031681565b3480156109ef57600080fd5b50610454612030565b348015610a0457600080fd5b50610408610a13366004614552565b61203f565b348015610a2457600080fd5b50610454610a333660046144d2565b6120f6565b348015610a4457600080fd5b50610408610a53366004614526565b61220c565b348015610a6457600080fd5b5061062c600081565b348015610a7957600080fd5b50610408610a883660046149de565b61224e565b348015610a9957600080fd5b50610408610aa8366004614790565b612259565b610408610abb366004614a93565b6122e2565b348015610acc57600080fd5b50610ad5600181565b60405161ffff9091168152602001610436565b348015610af457600080fd5b506104a17f000000000000000000000000000000000000000000000000000000000000000081565b348015610b2857600080fd5b50610408610b37366004614b48565b6122f1565b348015610b4857600080fd5b50610408610b573660046148f8565b612323565b348015610b6857600080fd5b5061062c61271081565b348015610b7e57600080fd5b50610454610b8d3660046144ed565b612379565b348015610b9e57600080fd5b50610408610bad366004614bb3565b6123df565b610408610bc0366004614c21565b612474565b348015610bd157600080fd5b50610408610be0366004614552565b61259e565b610408610bf33660046143a9565b61264e565b348015610c0457600080fd5b5061062c7f9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a681565b348015610c3857600080fd5b50610408610c47366004614760565b612864565b348015610c5857600080fd5b50610408610c67366004614c92565b612889565b348015610c7857600080fd5b5061042a610c87366004614cce565b6001600160a01b03918216600090815260106020908152604080832093909416825291909152205460ff1690565b348015610cc157600080fd5b50610408610cd0366004614790565b6128f3565b348015610ce157600080fd5b5061065a610cf0366004614cfc565b61294d565b348015610d0157600080fd5b50610408610d103660046148f8565b612a18565b348015610d2157600080fd5b50610454610d30366004614d75565b612a8e565b348015610d4157600080fd5b5061062c610d503660046144d2565b60096020526000908152604090205481565b337f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031614610ddf5760405162461bcd60e51b815260206004820152601e60248201527f4c7a4170703a20696e76616c696420656e64706f696e742063616c6c6572000060448201526064015b60405180910390fd5b61ffff861660009081526001602052604081208054610dfd90614dc2565b80601f0160208091040260200160405190810160405280929190818152602001828054610e2990614dc2565b8015610e765780601f10610e4b57610100808354040283529160200191610e76565b820191906000526020600020905b815481529060010190602001808311610e5957829003601f168201915b50505050509050805186869050148015610e91575060008151115b8015610eb9575080516020820120604051610eaf9088908890614dfc565b6040518091039020145b610f145760405162461bcd60e51b815260206004820152602660248201527f4c7a4170703a20696e76616c696420736f757263652073656e64696e6720636f6044820152651b9d1c9858dd60d21b6064820152608401610dd6565b610f8a8787878080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525050604080516020601f8a018190048102820181019092528881528a935091508890889081908401838280828437600092019190915250612b4192505050565b50505050505050565b6000610f9e82612caa565b92915050565b6060600b8054610fb390614dc2565b80601f0160208091040260200160405190810160405280929190818152602001828054610fdf90614dc2565b801561102c5780601f106110015761010080835404028352916020019161102c565b820191906000526020600020905b81548152906001019060200180831161100f57829003601f168201915b5050505050905090565b61103e612cc7565b6040516307e0db1760e01b815261ffff821660048201527f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316906307e0db17906024015b600060405180830381600087803b1580156110a457600080fd5b505af11580156110b8573d6000803e3d6000fd5b5050505050565b60006110ca82612d21565b506000908152600f60205260409020546001600160a01b031690565b60006110f182611a3c565b9050806001600160a01b0316836001600160a01b03160361115e5760405162461bcd60e51b815260206004820152602160248201527f4552433732313a20617070726f76616c20746f2063757272656e74206f776e656044820152603960f91b6064820152608401610dd6565b336001600160a01b038216148061117a575061117a8133610c87565b6111ec5760405162461bcd60e51b815260206004820152603d60248201527f4552433732313a20617070726f76652063616c6c6572206973206e6f7420746f60448201527f6b656e206f776e6572206f7220617070726f76656420666f7220616c6c0000006064820152608401610dd6565b6111f68383612d71565b505050565b611203612cc7565b6000811161125f5760405162461bcd60e51b8152602060048201526024808201527f6d696e476173546f5472616e73666572416e6453746f7265206d7573742062656044820152630203e20360e41b6064820152608401610dd6565b60078190556040518181527ffebbc4f8bb9ec2313950c718d43123124b15778efda4c1f1d529de2995b4f34d906020015b60405180910390a150565b6112a3612cc7565b61ffff909116600090815260036020526040902055565b6112c2612cc7565b6040516310ddb13760e01b815261ffff821660048201527f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316906310ddb1379060240161108a565b600061131d81612ddf565b60006012805480602002602001604051908101604052809291908181526020016000905b828210156113ed57838290600052602060002001805461136090614dc2565b80601f016020809104026020016040519081016040528092919081815260200182805461138c90614dc2565b80156113d95780601f106113ae576101008083540402835291602001916113d9565b820191906000526020600020905b8154815290600101906020018083116113bc57829003601f168201915b505050505081526020019060010190611341565b5050505090506000805b60125481101561150a57846040516020016114129190614e0c565b6040516020818303038152906040528051906020012083828151811061143a5761143a614e28565b60200260200101516040516020016114529190614e0c565b6040516020818303038152906040528051906020012003611502576012805461147d90600190614e54565b8154811061148d5761148d614e28565b90600052602060002001601282815481106114aa576114aa614e28565b9060005260206000200190816114c09190614ec2565b5060128054806114d2576114d2614f98565b6001900381819060005260206000200160006114ee91906142e5565b9055816114fa81614fae565b92505061150a565b6001016113f7565b5060008160ff16116115695760405162461bcd60e51b815260206004820152602260248201527f526577617264203a20446f6d61696e206973206e6f7420696e20746865206c696044820152611cdd60f21b6064820152608401610dd6565b50505050565b61157a335b82612de9565b6115965760405162461bcd60e51b8152600401610dd690614fcd565b6111f6838383612e67565b6000806115b987876115b288612fd8565b878761294d565b915091509550959350505050565b6000828152601160205260409020600101546115e281612ddf565b6111f68383613023565b6001600160a01b038116331461165c5760405162461bcd60e51b815260206004820152602f60248201527f416363657373436f6e74726f6c3a2063616e206f6e6c792072656e6f756e636560448201526e103937b632b9903337b91039b2b63360891b6064820152608401610dd6565b61166682826130a9565b5050565b61ffff83166000908152600160205260408120805482919061168b90614dc2565b80601f01602080910402602001604051908101604052809291908181526020018280546116b790614dc2565b80156117045780601f106116d957610100808354040283529160200191611704565b820191906000526020600020905b8154815290600101906020018083116116e757829003601f168201915b50505050509050838360405161171b929190614dfc565b60405180910390208180519060200120149150509392505050565b6111f6838383604051806020016040528060008152506122f1565b61175a33611574565b6117765760405162461bcd60e51b8152600401610dd690614fcd565b61177f81613110565b50565b61178a612cc7565b6040516342d65a8d60e01b81526001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016906342d65a8d906117da90869086908690600401615043565b600060405180830381600087803b1580156117f457600080fd5b505af1158015610f8a573d6000803e3d6000fd5b600061181381612ddf565b60006012805480602002602001604051908101604052809291908181526020016000905b828210156118e357838290600052602060002001805461185690614dc2565b80601f016020809104026020016040519081016040528092919081815260200182805461188290614dc2565b80156118cf5780601f106118a4576101008083540402835291602001916118cf565b820191906000526020600020905b8154815290600101906020018083116118b257829003601f168201915b505050505081526020019060010190611837565b50505050905060005b6012548110156119b257836040516020016119079190614e0c565b6040516020818303038152906040528051906020012082828151811061192f5761192f614e28565b60200260200101516040516020016119479190614e0c565b60405160208183030381529060405280519060200120036119aa5760405162461bcd60e51b815260206004820152601d60248201527f526577617264203a20446f6d61696e20616c72656164792061646465640000006044820152606401610dd6565b6001016118ec565b50601280546001810182556000919091527fbb8a6a4669ba250d26cd7a459eca9d215f8307e33aebe50379bc5a3617ec3444016115698482615061565b610f8a8787876119fe88612fd8565b8787876131b3565b7f9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6611a3081612ddf565b60146111f68382615061565b6000818152600d60205260408120546001600160a01b031680610f9e5760405162461bcd60e51b8152602060048201526018602482015277115490cdcc8c4e881a5b9d985b1a59081d1bdad95b88125160421b6044820152606401610dd6565b333014611afa5760405162461bcd60e51b815260206004820152602660248201527f4e6f6e626c6f636b696e674c7a4170703a2063616c6c6572206d7573742062656044820152650204c7a4170760d41b6064820152608401610dd6565b611b708686868080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525050604080516020601f890181900481028201810190925287815289935091508790879081908401838280828437600092019190915250612b4192505050565b505050505050565b60128181548110611b8857600080fd5b906000526020600020016000915090508054611ba390614dc2565b80601f0160208091040260200160405190810160405280929190818152602001828054611bcf90614dc2565b8015611c1c5780601f10611bf157610100808354040283529160200191611c1c565b820191906000526020600020905b815481529060010190602001808311611bff57829003601f168201915b505050505081565b60148054611ba390614dc2565b60006001600160a01b038216611c9b5760405162461bcd60e51b815260206004820152602960248201527f4552433732313a2061646472657373207a65726f206973206e6f7420612076616044820152683634b21037bbb732b960b91b6064820152608401610dd6565b506001600160a01b03166000908152600e602052604090205490565b611cbf612cc7565b611cc96000613375565b565b60016020526000908152604090208054611ba390614dc2565b611cec6133c5565b80516020808301919091206000818152600a90925260409091206002015460ff16611d4d5760405162461bcd60e51b81526020600482015260116024820152701b9bc818dc99591a5d1cc81cdd1bdc9959607a1b6044820152606401610dd6565b600082806020019051810190611d639190615157565b6000848152600a602052604081208054600190910154929450909250611d9f9161ffff8216916201000090046001600160a01b0316908561341e565b6000848152600a60205260409020600101549091508111611e145760405162461bcd60e51b815260206004820152602960248201527f6e6f7420656e6f7567682067617320746f2070726f6365737320637265646974604482015268103a3930b739b332b960b91b6064820152608401610dd6565b81518103611e8b576000838152600a602052604080822080546001600160b01b031916815560018101929092556002909101805460ff19169055517fd7be02b8dd0d27bd0517a9cb4d7469ce27df4313821ae5ec1ff69acc594ba23390611e7e9085815260200190565b60405180910390a1611f1f565b604080516080810182526000858152600a6020818152848320805461ffff80821687526001600160a01b03620100008084048216868a019081529989018b8152600160608b01818152998f90529790965297519851169096026001600160b01b03199091169690951695909517939093178455915191830191909155516002909101805491151560ff199092169190911790555b50505061177f6001600655565b60606012805480602002602001604051908101604052809291908181526020016000905b82821015611ffc578382906000526020600020018054611f6f90614dc2565b80601f0160208091040260200160405190810160405280929190818152602001828054611f9b90614dc2565b8015611fe85780601f10611fbd57610100808354040283529160200191611fe8565b820191906000526020600020905b815481529060010190602001808311611fcb57829003601f168201915b505050505081526020019060010190611f50565b50505050905090565b60009182526011602090815260408084206001600160a01b0393909316845291905290205460ff1690565b6060600c8054610fb390614dc2565b612047612cc7565b600081116120a25760405162461bcd60e51b815260206004820152602260248201527f647374436861696e4964546f42617463684c696d6974206d757374206265203e604482015261020360f41b6064820152608401610dd6565b61ffff8216600081815260086020908152604091829020849055815192835282018390527f7315f7654d594ead24a30160ed9ba2d23247f543016b918343591e93d7afdb6d91015b60405180910390a15050565b61ffff811660009081526001602052604081208054606092919061211990614dc2565b80601f016020809104026020016040519081016040528092919081815260200182805461214590614dc2565b80156121925780601f1061216757610100808354040283529160200191612192565b820191906000526020600020905b81548152906001019060200180831161217557829003601f168201915b5050505050905080516000036121ea5760405162461bcd60e51b815260206004820152601d60248201527f4c7a4170703a206e6f20747275737465642070617468207265636f72640000006044820152606401610dd6565b6122056000601483516121fd9190614e54565b83919061346a565b9392505050565b7f9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a661223681612ddf565b612244601380546001019055565b6111f68383613577565b611666338383613591565b612261612cc7565b81813060405160200161227693929190615211565b60408051601f1981840301815291815261ffff85166000908152600160205220906122a19082615061565b507f8c0400cfe2d1199b1a725c78960bcc2a344d869b80590d0f2bd005db15a572ce8383836040516122d593929190615043565b60405180910390a1505050565b610f8a878787878787876131b3565b6122fb3383612de9565b6123175760405162461bcd60e51b8152600401610dd690614fcd565b6115698484848461365f565b61232b612cc7565b600480546001600160a01b0319166001600160a01b0383169081179091556040519081527f5db758e995a17ec1ad84bdef7e8c3293a0bd6179bcce400dff5d4c3d87db726b90602001611290565b606061238482612d21565b600061238e613692565b905060008151116123ae5760405180602001604052806000815250612205565b806123b8846136a1565b6040516020016123c9929190615237565b6040516020818303038152906040529392505050565b6123e7612cc7565b6040516332fb62e760e21b81526001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000169063cbed8b9c9061243b9088908890889088908890600401615266565b600060405180830381600087803b15801561245557600080fd5b505af1158015612469573d6000803e3d6000fd5b505050505050505050565b61247d82611a3c565b6001600160a01b0316336001600160a01b0316146124cd5760405162461bcd60e51b815260206004820152600d60248201526c2737ba103a34329037bbb732b960991b6044820152606401610dd6565b604051600160f01b6020820152602281018290526001906000906042016040516020818303038152906040529050600061250b8787876000866115a1565b509050803410156125715760405162461bcd60e51b815260206004820152602a60248201527f4d7573742073656e6420656e6f7567682076616c756520746f20636f766572206044820152696d65737361676546656560b01b6064820152608401610dd6565b61258188888888336000886119ef565b61258a85613110565b6125946013613733565b5050505050505050565b6125a6612cc7565b600081116126025760405162461bcd60e51b815260206004820152602360248201527f647374436861696e4964546f5472616e73666572476173206d7573742062652060448201526203e20360ec1b6064820152608401610dd6565b61ffff8216600081815260096020908152604091829020849055815192835282018390527fc46df2983228ac2d9754e94a0d565e6671665dc8ad38602bc8e544f0685a29fb91016120ea565b61ffff861660009081526005602052604080822090516126719088908890614dfc565b90815260408051602092819003830190206001600160401b038716600090815292529020549050806126f15760405162461bcd60e51b815260206004820152602360248201527f4e6f6e626c6f636b696e674c7a4170703a206e6f2073746f726564206d65737360448201526261676560e81b6064820152608401610dd6565b808383604051612702929190614dfc565b6040518091039020146127615760405162461bcd60e51b815260206004820152602160248201527f4e6f6e626c6f636b696e674c7a4170703a20696e76616c6964207061796c6f616044820152601960fa1b6064820152608401610dd6565b61ffff871660009081526005602052604080822090516127849089908990614dfc565b90815260408051602092819003830181206001600160401b038916600090815290845282902093909355601f8801829004820283018201905286825261281c918991899089908190840183828082843760009201919091525050604080516020601f8a018190048102820181019092528881528a935091508890889081908401838280828437600092019190915250612b4192505050565b7fc264d91f3adc5588250e1551f547752ca0cfa8f6b530d243b9f9f4cab10ea8e5878787878560405161285395949392919061529f565b60405180910390a150505050505050565b60008281526011602052604090206001015461287f81612ddf565b6111f683836130a9565b612891612cc7565b61ffff83811660008181526002602090815260408083209487168084529482529182902085905581519283528201929092529081018290527f9d5c7c0b934da8fefa9c7760c98383778a12dfbfc0c3b3106518f43fb9508ac0906060016122d5565b6128fb612cc7565b61ffff831660009081526001602052604090206129198284836152da565b507ffa41487ad5d6728f0b19276fa1eddc16558578f5109fc39d2dc33c3230470dab8383836040516122d593929190615043565b600080600086866040516020016129659291906153ce565b60408051601f198184030181529082905263040a7bb160e41b825291506001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016906340a7bb10906129c9908b90309086908b908b906004016153fc565b6040805180830381865afa1580156129e5573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190612a099190615450565b92509250509550959350505050565b612a20612cc7565b6001600160a01b038116612a855760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b6064820152608401610dd6565b61177f81613375565b604051633d7b2f6f60e21b815261ffff808616600483015284166024820152306044820152606481018290526060907f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03169063f5ecbdbc90608401600060405180830381865afa158015612b0e573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f19168201604052612b369190810190615474565b90505b949350505050565b60008082806020019051810190612b589190615157565b601482015191935091506000612b708883838661341e565b90508251811015612c445784516020808701919091206040805160808101825261ffff808d1682526001600160a01b038088168387019081528385018881526001606086018181526000898152600a909a529887902095518654935190941662010000026001600160b01b03199093169390941692909217178355519082015592516002909301805493151560ff199094169390931790925590517f10e0b70d256bccc84b7027506978bd8b68984a870788b93b479def144c839ad790612c3a90839089906154a8565b60405180910390a1505b816001600160a01b031687604051612c5c9190614e0c565b60405180910390208961ffff167f5b821db8a46f8ecbe1941ba2f51cfeea9643268b56631f70d45e2a745d99026586604051612c9891906154c1565b60405180910390a45050505050505050565b60006001600160e01b031982161580610f9e5750610f9e8261378a565b6000546001600160a01b03163314611cc95760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152606401610dd6565b612d2a816137af565b61177f5760405162461bcd60e51b8152602060048201526018602482015277115490cdcc8c4e881a5b9d985b1a59081d1bdad95b88125160421b6044820152606401610dd6565b6000818152600f6020526040902080546001600160a01b0319166001600160a01b0384169081179091558190612da682611a3c565b6001600160a01b03167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92560405160405180910390a45050565b61177f81336137cc565b600080612df583611a3c565b9050806001600160a01b0316846001600160a01b03161480612e3c57506001600160a01b0380821660009081526010602090815260408083209388168352929052205460ff165b80612b395750836001600160a01b0316612e55846110bf565b6001600160a01b031614949350505050565b826001600160a01b0316612e7a82611a3c565b6001600160a01b031614612ea05760405162461bcd60e51b8152600401610dd6906154d4565b6001600160a01b038216612f025760405162461bcd60e51b8152602060048201526024808201527f4552433732313a207472616e7366657220746f20746865207a65726f206164646044820152637265737360e01b6064820152608401610dd6565b612f0f8383836001613825565b826001600160a01b0316612f2282611a3c565b6001600160a01b031614612f485760405162461bcd60e51b8152600401610dd6906154d4565b6000818152600f6020908152604080832080546001600160a01b03199081169091556001600160a01b03878116808652600e8552838620805460001901905590871680865283862080546001019055868652600d90945282852080549092168417909155905184937fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef91a4505050565b6040805160018082528183019092526060916000919060208083019080368337019050509050828160008151811061301257613012614e28565b602090810291909101015292915050565b61302d8282612005565b6116665760008281526011602090815260408083206001600160a01b03851684529091529020805460ff191660011790556130653390565b6001600160a01b0316816001600160a01b0316837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45050565b6130b38282612005565b156116665760008281526011602090815260408083206001600160a01b0385168085529252808320805460ff1916905551339285917ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b9190a45050565b600061311b82611a3c565b905061312b816000846001613825565b61313482611a3c565b6000838152600f6020908152604080832080546001600160a01b03199081169091556001600160a01b038516808552600e84528285208054600019019055878552600d909352818420805490911690555192935084927fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef908390a45050565b60008451116131fa5760405162461bcd60e51b8152602060048201526013602482015272746f6b656e4964735b5d20697320656d70747960681b6044820152606401610dd6565b83516001148061321e575061ffff8616600090815260086020526040902054845111155b6132755760405162461bcd60e51b815260206004820152602260248201527f62617463682073697a65206578636565647320647374206261746368206c696d6044820152611a5d60f21b6064820152608401610dd6565b60005b84518110156132b8576132a688888888858151811061329957613299614e28565b60200260200101516138ad565b806132b081615519565b915050613278565b50600085856040516020016132ce9291906153ce565b6040516020818303038152906040529050613313876001848851600960008d61ffff1661ffff1681526020019081526020016000205461330e9190615532565b613998565b613321878286868634613a6d565b8560405161332f9190614e0c565b6040518091039020886001600160a01b03168861ffff167fe1b87c47fdeb4f9cbadbca9df3af7aba453bb6e501075d0440d88125b711522a88604051612c9891906154c1565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b6002600654036134175760405162461bcd60e51b815260206004820152601f60248201527f5265656e7472616e637947756172643a207265656e7472616e742063616c6c006044820152606401610dd6565b6002600655565b6000825b8251811015612b36576007545a10612b3657613458868685848151811061344b5761344b614e28565b6020026020010151613c12565b8061346281615519565b915050613422565b60608161347881601f615549565b10156134b75760405162461bcd60e51b815260206004820152600e60248201526d736c6963655f6f766572666c6f7760901b6044820152606401610dd6565b6134c18284615549565b845110156135055760405162461bcd60e51b8152602060048201526011602482015270736c6963655f6f75744f66426f756e647360781b6044820152606401610dd6565b606082158015613524576040519150600082526020820160405261356e565b6040519150601f8416801560200281840101858101878315602002848b0101015b8183101561355d578051835260209283019201613545565b5050858452601f01601f1916604052505b50949350505050565b611666828260405180602001604052806000815250613c72565b816001600160a01b0316836001600160a01b0316036135f25760405162461bcd60e51b815260206004820152601960248201527f4552433732313a20617070726f766520746f2063616c6c6572000000000000006044820152606401610dd6565b6001600160a01b03838116600081815260106020908152604080832094871680845294825291829020805460ff191686151590811790915591519182527f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31910160405180910390a3505050565b61366a848484612e67565b61367684848484613ca5565b6115695760405162461bcd60e51b8152600401610dd69061555c565b606060148054610fb390614dc2565b606060006136ae83613da3565b60010190506000816001600160401b038111156136cd576136cd61456e565b6040519080825280601f01601f1916602001820160405280156136f7576020820181803683370190505b5090508181016020015b600019016f181899199a1a9b1b9c1cb0b131b232b360811b600a86061a8153600a850494508461370157509392505050565b8054806137825760405162461bcd60e51b815260206004820152601b60248201527f436f756e7465723a2064656372656d656e74206f766572666c6f7700000000006044820152606401610dd6565b600019019055565b60006001600160e01b03198216637965db0b60e01b1480610f9e5750610f9e82613e7b565b6000908152600d60205260409020546001600160a01b0316151590565b6137d68282612005565b611666576137e381613ebb565b6137ee836020613ecd565b6040516020016137ff9291906155ae565b60408051601f198184030181529082905262461bcd60e51b8252610dd6916004016144bf565b6001811115611569576001600160a01b0384161561386b576001600160a01b0384166000908152600e602052604081208054839290613865908490614e54565b90915550505b6001600160a01b03831615611569576001600160a01b0383166000908152600e6020526040812080548392906138a2908490615549565b909155505050505050565b6138b633611574565b6139195760405162461bcd60e51b815260206004820152602e60248201527f4f4e46543732313a2073656e642063616c6c6572206973206e6f74206f776e6560448201526d1c881b9bdc88185c1c1c9bdd995960921b6064820152608401610dd6565b836001600160a01b031661392c82611a3c565b6001600160a01b03161461398d5760405162461bcd60e51b815260206004820152602260248201527f4f4e46543732313a2073656e642066726f6d20696e636f7272656374206f776e60448201526132b960f11b6064820152608401610dd6565b611569843083612e67565b60006139a383614068565b61ffff80871660009081526002602090815260408083209389168352929052205490915080613a145760405162461bcd60e51b815260206004820152601a60248201527f4c7a4170703a206d696e4761734c696d6974206e6f74207365740000000000006044820152606401610dd6565b613a1e8382615549565b821015611b705760405162461bcd60e51b815260206004820152601b60248201527f4c7a4170703a20676173206c696d697420697320746f6f206c6f7700000000006044820152606401610dd6565b61ffff861660009081526001602052604081208054613a8b90614dc2565b80601f0160208091040260200160405190810160405280929190818152602001828054613ab790614dc2565b8015613b045780601f10613ad957610100808354040283529160200191613b04565b820191906000526020600020905b815481529060010190602001808311613ae757829003601f168201915b505050505090508051600003613b755760405162461bcd60e51b815260206004820152603060248201527f4c7a4170703a2064657374696e6174696f6e20636861696e206973206e6f742060448201526f61207472757374656420736f7572636560801b6064820152608401610dd6565b613b808787516140c4565b60405162c5803160e81b81526001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000169063c5803100908490613bd7908b9086908c908c908c908c90600401615623565b6000604051808303818588803b158015613bf057600080fd5b505af1158015613c04573d6000803e3d6000fd5b505050505050505050505050565b613c1b816137af565b1580613c475750613c2b816137af565b8015613c47575030613c3c82611a3c565b6001600160a01b0316145b613c5057600080fd5b613c59816137af565b613c67576111f68282613577565b6111f6308383612e67565b613c7c8383614135565b613c896000848484613ca5565b6111f65760405162461bcd60e51b8152600401610dd69061555c565b60006001600160a01b0384163b15613d9b57604051630a85bd0160e11b81526001600160a01b0385169063150b7a0290613ce990339089908890889060040161568a565b6020604051808303816000875af1925050508015613d24575060408051601f3d908101601f19168201909252613d21918101906156c7565b60015b613d81573d808015613d52576040519150601f19603f3d011682016040523d82523d6000602084013e613d57565b606091505b508051600003613d795760405162461bcd60e51b8152600401610dd69061555c565b805181602001fd5b6001600160e01b031916630a85bd0160e11b149050612b39565b506001612b39565b60008072184f03e93ff9f4daa797ed6e38ed64bf6a1f0160401b8310613de25772184f03e93ff9f4daa797ed6e38ed64bf6a1f0160401b830492506040015b6d04ee2d6d415b85acef81000000008310613e0e576d04ee2d6d415b85acef8100000000830492506020015b662386f26fc100008310613e2c57662386f26fc10000830492506010015b6305f5e1008310613e44576305f5e100830492506008015b6127108310613e5857612710830492506004015b60648310613e6a576064830492506002015b600a8310610f9e5760010192915050565b60006001600160e01b031982166380ac58cd60e01b1480613eac57506001600160e01b03198216635b5e139f60e01b145b80610f9e5750610f9e826142b0565b6060610f9e6001600160a01b03831660145b60606000613edc836002615532565b613ee7906002615549565b6001600160401b03811115613efe57613efe61456e565b6040519080825280601f01601f191660200182016040528015613f28576020820181803683370190505b509050600360fc1b81600081518110613f4357613f43614e28565b60200101906001600160f81b031916908160001a905350600f60fb1b81600181518110613f7257613f72614e28565b60200101906001600160f81b031916908160001a9053506000613f96846002615532565b613fa1906001615549565b90505b6001811115614019576f181899199a1a9b1b9c1cb0b131b232b360811b85600f1660108110613fd557613fd5614e28565b1a60f81b828281518110613feb57613feb614e28565b60200101906001600160f81b031916908160001a90535060049490941c93614012816156e4565b9050613fa4565b5083156122055760405162461bcd60e51b815260206004820181905260248201527f537472696e67733a20686578206c656e67746820696e73756666696369656e746044820152606401610dd6565b60006022825110156140bc5760405162461bcd60e51b815260206004820152601c60248201527f4c7a4170703a20696e76616c69642061646170746572506172616d73000000006044820152606401610dd6565b506022015190565b61ffff8216600090815260036020526040812054908190036140e557506127105b808211156111f65760405162461bcd60e51b815260206004820181905260248201527f4c7a4170703a207061796c6f61642073697a6520697320746f6f206c617267656044820152606401610dd6565b6001600160a01b03821661418b5760405162461bcd60e51b815260206004820181905260248201527f4552433732313a206d696e7420746f20746865207a65726f20616464726573736044820152606401610dd6565b614194816137af565b156141e15760405162461bcd60e51b815260206004820152601c60248201527f4552433732313a20746f6b656e20616c7265616479206d696e746564000000006044820152606401610dd6565b6141ef600083836001613825565b6141f8816137af565b156142455760405162461bcd60e51b815260206004820152601c60248201527f4552433732313a20746f6b656e20616c7265616479206d696e746564000000006044820152606401610dd6565b6001600160a01b0382166000818152600e6020908152604080832080546001019055848352600d90915280822080546001600160a01b0319168417905551839291907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef908290a45050565b60006001600160e01b031982166322bac5d960e01b1480610f9e57506301ffc9a760e01b6001600160e01b0319831614610f9e565b5080546142f190614dc2565b6000825580601f10614301575050565b601f01602090049060005260206000209081019061177f91905b8082111561432f576000815560010161431b565b5090565b803561ffff8116811461434557600080fd5b919050565b60008083601f84011261435c57600080fd5b5081356001600160401b0381111561437357600080fd5b60208301915083602082850101111561438b57600080fd5b9250929050565b80356001600160401b038116811461434557600080fd5b600080600080600080608087890312156143c257600080fd5b6143cb87614333565b955060208701356001600160401b03808211156143e757600080fd5b6143f38a838b0161434a565b909750955085915061440760408a01614392565b9450606089013591508082111561441d57600080fd5b5061442a89828a0161434a565b979a9699509497509295939492505050565b6001600160e01b03198116811461177f57600080fd5b60006020828403121561446457600080fd5b81356122058161443c565b60005b8381101561448a578181015183820152602001614472565b50506000910152565b600081518084526144ab81602086016020860161446f565b601f01601f19169290920160200192915050565b6020815260006122056020830184614493565b6000602082840312156144e457600080fd5b61220582614333565b6000602082840312156144ff57600080fd5b5035919050565b6001600160a01b038116811461177f57600080fd5b803561434581614506565b6000806040838503121561453957600080fd5b823561454481614506565b946020939093013593505050565b6000806040838503121561456557600080fd5b61454483614333565b634e487b7160e01b600052604160045260246000fd5b604051601f8201601f191681016001600160401b03811182821017156145ac576145ac61456e565b604052919050565b60006001600160401b038211156145cd576145cd61456e565b50601f01601f191660200190565b60006145ee6145e9846145b4565b614584565b905082815283838301111561460257600080fd5b828260208301376000602084830101529392505050565b60006020828403121561462b57600080fd5b81356001600160401b0381111561464157600080fd5b8201601f8101841361465257600080fd5b612b39848235602084016145db565b60008060006060848603121561467657600080fd5b833561468181614506565b9250602084013561469181614506565b929592945050506040919091013590565b600082601f8301126146b357600080fd5b612205838335602085016145db565b8035801515811461434557600080fd5b600080600080600060a086880312156146ea57600080fd5b6146f386614333565b945060208601356001600160401b038082111561470f57600080fd5b61471b89838a016146a2565b955060408801359450614730606089016146c2565b9350608088013591508082111561474657600080fd5b50614753888289016146a2565b9150509295509295909350565b6000806040838503121561477357600080fd5b82359150602083013561478581614506565b809150509250929050565b6000806000604084860312156147a557600080fd5b6147ae84614333565b925060208401356001600160401b038111156147c957600080fd5b6147d58682870161434a565b9497909650939450505050565b600080600080600080600060e0888a0312156147fd57600080fd5b873561480881614506565b965061481660208901614333565b955060408801356001600160401b038082111561483257600080fd5b61483e8b838c016146a2565b965060608a0135955060808a0135915061485782614506565b90935060a08901359061486982614506565b90925060c0890135908082111561487f57600080fd5b5061488c8a828b016146a2565b91505092959891949750929550565b6000806000606084860312156148b057600080fd5b6148b984614333565b925060208401356001600160401b038111156148d457600080fd5b6148e0868287016146a2565b9250506148ef60408501614392565b90509250925092565b60006020828403121561490a57600080fd5b813561220581614506565b6000806040838503121561492857600080fd5b61493183614333565b915061493f60208401614333565b90509250929050565b60006020828403121561495a57600080fd5b81356001600160401b0381111561497057600080fd5b612b39848285016146a2565b6000602080830181845280855180835260408601915060408160051b870101925083870160005b828110156149d157603f198886030184526149bf858351614493565b945092850192908501906001016149a3565b5092979650505050505050565b600080604083850312156149f157600080fd5b82356149fc81614506565b915061493f602084016146c2565b60006001600160401b03821115614a2357614a2361456e565b5060051b60200190565b600082601f830112614a3e57600080fd5b81356020614a4e6145e983614a0a565b82815260059290921b84018101918181019086841115614a6d57600080fd5b8286015b84811015614a885780358352918301918301614a71565b509695505050505050565b600080600080600080600060e0888a031215614aae57600080fd5b8735614ab981614506565b9650614ac760208901614333565b955060408801356001600160401b0380821115614ae357600080fd5b614aef8b838c016146a2565b965060608a0135915080821115614b0557600080fd5b614b118b838c01614a2d565b955060808a01359150614b2382614506565b819450614b3260a08b0161451b565b935060c08a013591508082111561487f57600080fd5b60008060008060808587031215614b5e57600080fd5b8435614b6981614506565b93506020850135614b7981614506565b92506040850135915060608501356001600160401b03811115614b9b57600080fd5b614ba7878288016146a2565b91505092959194509250565b600080600080600060808688031215614bcb57600080fd5b614bd486614333565b9450614be260208701614333565b93506040860135925060608601356001600160401b03811115614c0457600080fd5b614c108882890161434a565b969995985093965092949392505050565b600080600080600060a08688031215614c3957600080fd5b8535614c4481614506565b9450614c5260208701614333565b935060408601356001600160401b03811115614c6d57600080fd5b614c79888289016146a2565b9598949750949560608101359550608001359392505050565b600080600060608486031215614ca757600080fd5b614cb084614333565b9250614cbe60208501614333565b9150604084013590509250925092565b60008060408385031215614ce157600080fd5b8235614cec81614506565b9150602083013561478581614506565b600080600080600060a08688031215614d1457600080fd5b614d1d86614333565b945060208601356001600160401b0380821115614d3957600080fd5b614d4589838a016146a2565b95506040880135915080821115614d5b57600080fd5b614d6789838a01614a2d565b9450614730606089016146c2565b60008060008060808587031215614d8b57600080fd5b614d9485614333565b9350614da260208601614333565b92506040850135614db281614506565b9396929550929360600135925050565b600181811c90821680614dd657607f821691505b602082108103614df657634e487b7160e01b600052602260045260246000fd5b50919050565b8183823760009101908152919050565b60008251614e1e81846020870161446f565b9190910192915050565b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052601160045260246000fd5b81810381811115610f9e57610f9e614e3e565b601f8211156111f657600081815260208120601f850160051c81016020861015614e8e5750805b601f850160051c820191505b81811015611b7057828155600101614e9a565b600019600383901b1c191660019190911b1790565b818103614ecd575050565b614ed78254614dc2565b6001600160401b03811115614eee57614eee61456e565b614f0281614efc8454614dc2565b84614e67565b6000601f821160018114614f305760008315614f1e5750848201545b614f288482614ead565b8555506110b8565b600085815260209020601f19841690600086815260209020845b83811015614f6a5782860154825560019586019590910190602001614f4a565b5085831015614f885781850154600019600388901b60f8161c191681555b5050505050600190811b01905550565b634e487b7160e01b600052603160045260246000fd5b600060ff821660ff8103614fc457614fc4614e3e565b60010192915050565b6020808252602d908201527f4552433732313a2063616c6c6572206973206e6f7420746f6b656e206f776e6560408201526c1c881bdc88185c1c1c9bdd9959609a1b606082015260800190565b81835281816020850137506000828201602090810191909152601f909101601f19169091010190565b61ffff84168152604060208201526000612b3660408301848661501a565b81516001600160401b0381111561507a5761507a61456e565b61508881614efc8454614dc2565b602080601f8311600181146150b757600084156150a55750858301515b6150af8582614ead565b865550611b70565b600085815260208120601f198616915b828110156150e6578886015182559484019460019091019084016150c7565b5085821015614f8857939096015160001960f8600387901b161c19169092555050600190811b01905550565b600082601f83011261512357600080fd5b81516151316145e9826145b4565b81815284602083860101111561514657600080fd5b612b3982602083016020870161446f565b6000806040838503121561516a57600080fd5b82516001600160401b038082111561518157600080fd5b61518d86838701615112565b93506020915081850151818111156151a457600080fd5b85019050601f810186136151b757600080fd5b80516151c56145e982614a0a565b81815260059190911b820183019083810190888311156151e457600080fd5b928401925b82841015615202578351825292840192908401906151e9565b80955050505050509250929050565b8284823760609190911b6bffffffffffffffffffffffff19169101908152601401919050565b6000835161524981846020880161446f565b83519083019061525d81836020880161446f565b01949350505050565b600061ffff80881683528087166020840152508460408301526080606083015261529460808301848661501a565b979650505050505050565b61ffff861681526080602082015260006152bd60808301868861501a565b6001600160401b0394909416604083015250606001529392505050565b6001600160401b038311156152f1576152f161456e565b615305836152ff8354614dc2565b83614e67565b6000601f84116001811461533357600085156153215750838201355b61532b8682614ead565b8455506110b8565b600083815260209020601f19861690835b828110156153645786850135825560209485019460019092019101615344565b50868210156153815760001960f88860031b161c19848701351681555b505060018560011b0183555050505050565b600081518084526020808501945080840160005b838110156153c3578151875295820195908201906001016153a7565b509495945050505050565b6040815260006153e16040830185614493565b82810360208401526153f38185615393565b95945050505050565b61ffff861681526001600160a01b038516602082015260a06040820181905260009061542a90830186614493565b841515606084015282810360808401526154448185614493565b98975050505050505050565b6000806040838503121561546357600080fd5b505080516020909101519092909150565b60006020828403121561548657600080fd5b81516001600160401b0381111561549c57600080fd5b612b3984828501615112565b828152604060208201526000612b396040830184614493565b6020815260006122056020830184615393565b60208082526025908201527f4552433732313a207472616e736665722066726f6d20696e636f72726563742060408201526437bbb732b960d91b606082015260800190565b60006001820161552b5761552b614e3e565b5060010190565b8082028115828204841417610f9e57610f9e614e3e565b80820180821115610f9e57610f9e614e3e565b60208082526032908201527f4552433732313a207472616e7366657220746f206e6f6e20455243373231526560408201527131b2b4bb32b91034b6b83632b6b2b73a32b960711b606082015260800190565b7f416363657373436f6e74726f6c3a206163636f756e74200000000000000000008152600083516155e681601785016020880161446f565b7001034b99036b4b9b9b4b733903937b6329607d1b601791840191820152835161561781602884016020880161446f565b01602801949350505050565b61ffff8716815260c06020820152600061564060c0830188614493565b82810360408401526156528188614493565b6001600160a01b0387811660608601528616608085015283810360a0850152905061567d8185614493565b9998505050505050505050565b6001600160a01b03858116825284166020820152604081018390526080606082018190526000906156bd90830184614493565b9695505050505050565b6000602082840312156156d957600080fd5b81516122058161443c565b6000816156f3576156f3614e3e565b50600019019056fea264697066735822122019738c3a2cc667d6910012970cc4f3df4833cfb908e00c21791ffe54c9ea727064736f6c634300081400339f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6",
  deployedBytecode:
    "0x6080604052600436106103e35760003560e01c80637533d78811610208578063b88d4fde11610118578063d5391393116100ab578063eb8d72b71161007a578063eb8d72b714610cb5578063f235364114610cd5578063f2fde38b14610cf5578063f5ecbdbc14610d15578063fa25f9b614610d3557600080fd5b8063d539139314610bf8578063d547741f14610c2c578063df2a5b3b14610c4c578063e985e9c514610c6c57600080fd5b8063cbed8b9c116100e7578063cbed8b9c14610b92578063d01912f014610bb2578063d12473a514610bc5578063d1deba1f14610be557600080fd5b8063b88d4fde14610b1c578063baf3292d14610b3c578063c446183414610b5c578063c87b56dd14610b7257600080fd5b80639ea5d6b11161019b578063a22cb4651161016a578063a22cb46514610a6d578063a6c3d16514610a8d578063ab3ffb9314610aad578063af3fb21c14610ac0578063b353aaa714610ae857600080fd5b80639ea5d6b1146109f85780639f38369a14610a18578063a144819414610a38578063a217fddf14610a5857600080fd5b80639101cc65116101d75780639101cc651461098157806391d14854146109a3578063950c8a74146109c357806395d89b41146109e357600080fd5b80637533d788146108eb5780638cfd8f5c1461090b5780638da5cb5b146109435780638ffa1f2a1461096157600080fd5b80633d8b38f611610303578063519056361161029657806366ad5c8a1161026557806366ad5c8a1461086157806366cf8fab146108815780636c0360eb146108a157806370a08231146108b6578063715018a6146108d657600080fd5b806351905636146107bf57806355f804b3146107d25780635b8c41e6146107f25780636352211e1461084157600080fd5b806342d65a8d116102d257806342d65a8d1461073c57806344e2e74c1461075c578063482881901461077c5780634ac3f4ff1461079257600080fd5b80633d8b38f6146106af5780633f1f4fa4146106cf57806342842e0e146106fc57806342966c681461071c57600080fd5b806310ddb1371161037b578063248a9ca31161034a578063248a9ca3146105fc5780632a205e3d1461063a5780632f2ff15d1461066f57806336568abe1461068f57600080fd5b806310ddb13714610519578063227789291461053957806322a3ecf91461055957806323b872dd146105dc57600080fd5b8063081812fc116103b7578063081812fc14610481578063095ea7b3146104b95780630b4cad4c146104d95780630df37483146104f957600080fd5b80621d3567146103e857806301ffc9a71461040a57806306fdde031461043f57806307e0db1714610461575b600080fd5b3480156103f457600080fd5b506104086104033660046143a9565b610d62565b005b34801561041657600080fd5b5061042a610425366004614452565b610f93565b60405190151581526020015b60405180910390f35b34801561044b57600080fd5b50610454610fa4565b60405161043691906144bf565b34801561046d57600080fd5b5061040861047c3660046144d2565b611036565b34801561048d57600080fd5b506104a161049c3660046144ed565b6110bf565b6040516001600160a01b039091168152602001610436565b3480156104c557600080fd5b506104086104d4366004614526565b6110e6565b3480156104e557600080fd5b506104086104f43660046144ed565b6111fb565b34801561050557600080fd5b50610408610514366004614552565b61129b565b34801561052557600080fd5b506104086105343660046144d2565b6112ba565b34801561054557600080fd5b50610408610554366004614619565b611312565b34801561056557600080fd5b506105ad6105743660046144ed565b600a6020526000908152604090208054600182015460029092015461ffff821692620100009092046001600160a01b0316919060ff1684565b6040805161ffff90951685526001600160a01b0390931660208501529183015215156060820152608001610436565b3480156105e857600080fd5b506104086105f7366004614661565b61156f565b34801561060857600080fd5b5061062c6106173660046144ed565b60009081526011602052604090206001015490565b604051908152602001610436565b34801561064657600080fd5b5061065a6106553660046146d2565b6115a1565b60408051928352602083019190915201610436565b34801561067b57600080fd5b5061040861068a366004614760565b6115c7565b34801561069b57600080fd5b506104086106aa366004614760565b6115ec565b3480156106bb57600080fd5b5061042a6106ca366004614790565b61166a565b3480156106db57600080fd5b5061062c6106ea3660046144d2565b60036020526000908152604090205481565b34801561070857600080fd5b50610408610717366004614661565b611736565b34801561072857600080fd5b506104086107373660046144ed565b611751565b34801561074857600080fd5b50610408610757366004614790565b611782565b34801561076857600080fd5b50610408610777366004614619565b611808565b34801561078857600080fd5b5061062c60075481565b34801561079e57600080fd5b5061062c6107ad3660046144d2565b60086020526000908152604090205481565b6104086107cd3660046147e2565b6119ef565b3480156107de57600080fd5b506104086107ed366004614619565b611a06565b3480156107fe57600080fd5b5061062c61080d36600461489b565b6005602090815260009384526040808520845180860184018051928152908401958401959095209452929052825290205481565b34801561084d57600080fd5b506104a161085c3660046144ed565b611a3c565b34801561086d57600080fd5b5061040861087c3660046143a9565b611a9c565b34801561088d57600080fd5b5061045461089c3660046144ed565b611b78565b3480156108ad57600080fd5b50610454611c24565b3480156108c257600080fd5b5061062c6108d13660046148f8565b611c31565b3480156108e257600080fd5b50610408611cb7565b3480156108f757600080fd5b506104546109063660046144d2565b611ccb565b34801561091757600080fd5b5061062c610926366004614915565b600260209081526000928352604080842090915290825290205481565b34801561094f57600080fd5b506000546001600160a01b03166104a1565b34801561096d57600080fd5b5061040861097c366004614948565b611ce4565b34801561098d57600080fd5b50610996611f2c565b604051610436919061497c565b3480156109af57600080fd5b5061042a6109be366004614760565b612005565b3480156109cf57600080fd5b506004546104a1906001600160a01b031681565b3480156109ef57600080fd5b50610454612030565b348015610a0457600080fd5b50610408610a13366004614552565b61203f565b348015610a2457600080fd5b50610454610a333660046144d2565b6120f6565b348015610a4457600080fd5b50610408610a53366004614526565b61220c565b348015610a6457600080fd5b5061062c600081565b348015610a7957600080fd5b50610408610a883660046149de565b61224e565b348015610a9957600080fd5b50610408610aa8366004614790565b612259565b610408610abb366004614a93565b6122e2565b348015610acc57600080fd5b50610ad5600181565b60405161ffff9091168152602001610436565b348015610af457600080fd5b506104a17f000000000000000000000000000000000000000000000000000000000000000081565b348015610b2857600080fd5b50610408610b37366004614b48565b6122f1565b348015610b4857600080fd5b50610408610b573660046148f8565b612323565b348015610b6857600080fd5b5061062c61271081565b348015610b7e57600080fd5b50610454610b8d3660046144ed565b612379565b348015610b9e57600080fd5b50610408610bad366004614bb3565b6123df565b610408610bc0366004614c21565b612474565b348015610bd157600080fd5b50610408610be0366004614552565b61259e565b610408610bf33660046143a9565b61264e565b348015610c0457600080fd5b5061062c7f9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a681565b348015610c3857600080fd5b50610408610c47366004614760565b612864565b348015610c5857600080fd5b50610408610c67366004614c92565b612889565b348015610c7857600080fd5b5061042a610c87366004614cce565b6001600160a01b03918216600090815260106020908152604080832093909416825291909152205460ff1690565b348015610cc157600080fd5b50610408610cd0366004614790565b6128f3565b348015610ce157600080fd5b5061065a610cf0366004614cfc565b61294d565b348015610d0157600080fd5b50610408610d103660046148f8565b612a18565b348015610d2157600080fd5b50610454610d30366004614d75565b612a8e565b348015610d4157600080fd5b5061062c610d503660046144d2565b60096020526000908152604090205481565b337f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031614610ddf5760405162461bcd60e51b815260206004820152601e60248201527f4c7a4170703a20696e76616c696420656e64706f696e742063616c6c6572000060448201526064015b60405180910390fd5b61ffff861660009081526001602052604081208054610dfd90614dc2565b80601f0160208091040260200160405190810160405280929190818152602001828054610e2990614dc2565b8015610e765780601f10610e4b57610100808354040283529160200191610e76565b820191906000526020600020905b815481529060010190602001808311610e5957829003601f168201915b50505050509050805186869050148015610e91575060008151115b8015610eb9575080516020820120604051610eaf9088908890614dfc565b6040518091039020145b610f145760405162461bcd60e51b815260206004820152602660248201527f4c7a4170703a20696e76616c696420736f757263652073656e64696e6720636f6044820152651b9d1c9858dd60d21b6064820152608401610dd6565b610f8a8787878080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525050604080516020601f8a018190048102820181019092528881528a935091508890889081908401838280828437600092019190915250612b4192505050565b50505050505050565b6000610f9e82612caa565b92915050565b6060600b8054610fb390614dc2565b80601f0160208091040260200160405190810160405280929190818152602001828054610fdf90614dc2565b801561102c5780601f106110015761010080835404028352916020019161102c565b820191906000526020600020905b81548152906001019060200180831161100f57829003601f168201915b5050505050905090565b61103e612cc7565b6040516307e0db1760e01b815261ffff821660048201527f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316906307e0db17906024015b600060405180830381600087803b1580156110a457600080fd5b505af11580156110b8573d6000803e3d6000fd5b5050505050565b60006110ca82612d21565b506000908152600f60205260409020546001600160a01b031690565b60006110f182611a3c565b9050806001600160a01b0316836001600160a01b03160361115e5760405162461bcd60e51b815260206004820152602160248201527f4552433732313a20617070726f76616c20746f2063757272656e74206f776e656044820152603960f91b6064820152608401610dd6565b336001600160a01b038216148061117a575061117a8133610c87565b6111ec5760405162461bcd60e51b815260206004820152603d60248201527f4552433732313a20617070726f76652063616c6c6572206973206e6f7420746f60448201527f6b656e206f776e6572206f7220617070726f76656420666f7220616c6c0000006064820152608401610dd6565b6111f68383612d71565b505050565b611203612cc7565b6000811161125f5760405162461bcd60e51b8152602060048201526024808201527f6d696e476173546f5472616e73666572416e6453746f7265206d7573742062656044820152630203e20360e41b6064820152608401610dd6565b60078190556040518181527ffebbc4f8bb9ec2313950c718d43123124b15778efda4c1f1d529de2995b4f34d906020015b60405180910390a150565b6112a3612cc7565b61ffff909116600090815260036020526040902055565b6112c2612cc7565b6040516310ddb13760e01b815261ffff821660048201527f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316906310ddb1379060240161108a565b600061131d81612ddf565b60006012805480602002602001604051908101604052809291908181526020016000905b828210156113ed57838290600052602060002001805461136090614dc2565b80601f016020809104026020016040519081016040528092919081815260200182805461138c90614dc2565b80156113d95780601f106113ae576101008083540402835291602001916113d9565b820191906000526020600020905b8154815290600101906020018083116113bc57829003601f168201915b505050505081526020019060010190611341565b5050505090506000805b60125481101561150a57846040516020016114129190614e0c565b6040516020818303038152906040528051906020012083828151811061143a5761143a614e28565b60200260200101516040516020016114529190614e0c565b6040516020818303038152906040528051906020012003611502576012805461147d90600190614e54565b8154811061148d5761148d614e28565b90600052602060002001601282815481106114aa576114aa614e28565b9060005260206000200190816114c09190614ec2565b5060128054806114d2576114d2614f98565b6001900381819060005260206000200160006114ee91906142e5565b9055816114fa81614fae565b92505061150a565b6001016113f7565b5060008160ff16116115695760405162461bcd60e51b815260206004820152602260248201527f526577617264203a20446f6d61696e206973206e6f7420696e20746865206c696044820152611cdd60f21b6064820152608401610dd6565b50505050565b61157a335b82612de9565b6115965760405162461bcd60e51b8152600401610dd690614fcd565b6111f6838383612e67565b6000806115b987876115b288612fd8565b878761294d565b915091509550959350505050565b6000828152601160205260409020600101546115e281612ddf565b6111f68383613023565b6001600160a01b038116331461165c5760405162461bcd60e51b815260206004820152602f60248201527f416363657373436f6e74726f6c3a2063616e206f6e6c792072656e6f756e636560448201526e103937b632b9903337b91039b2b63360891b6064820152608401610dd6565b61166682826130a9565b5050565b61ffff83166000908152600160205260408120805482919061168b90614dc2565b80601f01602080910402602001604051908101604052809291908181526020018280546116b790614dc2565b80156117045780601f106116d957610100808354040283529160200191611704565b820191906000526020600020905b8154815290600101906020018083116116e757829003601f168201915b50505050509050838360405161171b929190614dfc565b60405180910390208180519060200120149150509392505050565b6111f6838383604051806020016040528060008152506122f1565b61175a33611574565b6117765760405162461bcd60e51b8152600401610dd690614fcd565b61177f81613110565b50565b61178a612cc7565b6040516342d65a8d60e01b81526001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016906342d65a8d906117da90869086908690600401615043565b600060405180830381600087803b1580156117f457600080fd5b505af1158015610f8a573d6000803e3d6000fd5b600061181381612ddf565b60006012805480602002602001604051908101604052809291908181526020016000905b828210156118e357838290600052602060002001805461185690614dc2565b80601f016020809104026020016040519081016040528092919081815260200182805461188290614dc2565b80156118cf5780601f106118a4576101008083540402835291602001916118cf565b820191906000526020600020905b8154815290600101906020018083116118b257829003601f168201915b505050505081526020019060010190611837565b50505050905060005b6012548110156119b257836040516020016119079190614e0c565b6040516020818303038152906040528051906020012082828151811061192f5761192f614e28565b60200260200101516040516020016119479190614e0c565b60405160208183030381529060405280519060200120036119aa5760405162461bcd60e51b815260206004820152601d60248201527f526577617264203a20446f6d61696e20616c72656164792061646465640000006044820152606401610dd6565b6001016118ec565b50601280546001810182556000919091527fbb8a6a4669ba250d26cd7a459eca9d215f8307e33aebe50379bc5a3617ec3444016115698482615061565b610f8a8787876119fe88612fd8565b8787876131b3565b7f9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6611a3081612ddf565b60146111f68382615061565b6000818152600d60205260408120546001600160a01b031680610f9e5760405162461bcd60e51b8152602060048201526018602482015277115490cdcc8c4e881a5b9d985b1a59081d1bdad95b88125160421b6044820152606401610dd6565b333014611afa5760405162461bcd60e51b815260206004820152602660248201527f4e6f6e626c6f636b696e674c7a4170703a2063616c6c6572206d7573742062656044820152650204c7a4170760d41b6064820152608401610dd6565b611b708686868080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525050604080516020601f890181900481028201810190925287815289935091508790879081908401838280828437600092019190915250612b4192505050565b505050505050565b60128181548110611b8857600080fd5b906000526020600020016000915090508054611ba390614dc2565b80601f0160208091040260200160405190810160405280929190818152602001828054611bcf90614dc2565b8015611c1c5780601f10611bf157610100808354040283529160200191611c1c565b820191906000526020600020905b815481529060010190602001808311611bff57829003601f168201915b505050505081565b60148054611ba390614dc2565b60006001600160a01b038216611c9b5760405162461bcd60e51b815260206004820152602960248201527f4552433732313a2061646472657373207a65726f206973206e6f7420612076616044820152683634b21037bbb732b960b91b6064820152608401610dd6565b506001600160a01b03166000908152600e602052604090205490565b611cbf612cc7565b611cc96000613375565b565b60016020526000908152604090208054611ba390614dc2565b611cec6133c5565b80516020808301919091206000818152600a90925260409091206002015460ff16611d4d5760405162461bcd60e51b81526020600482015260116024820152701b9bc818dc99591a5d1cc81cdd1bdc9959607a1b6044820152606401610dd6565b600082806020019051810190611d639190615157565b6000848152600a602052604081208054600190910154929450909250611d9f9161ffff8216916201000090046001600160a01b0316908561341e565b6000848152600a60205260409020600101549091508111611e145760405162461bcd60e51b815260206004820152602960248201527f6e6f7420656e6f7567682067617320746f2070726f6365737320637265646974604482015268103a3930b739b332b960b91b6064820152608401610dd6565b81518103611e8b576000838152600a602052604080822080546001600160b01b031916815560018101929092556002909101805460ff19169055517fd7be02b8dd0d27bd0517a9cb4d7469ce27df4313821ae5ec1ff69acc594ba23390611e7e9085815260200190565b60405180910390a1611f1f565b604080516080810182526000858152600a6020818152848320805461ffff80821687526001600160a01b03620100008084048216868a019081529989018b8152600160608b01818152998f90529790965297519851169096026001600160b01b03199091169690951695909517939093178455915191830191909155516002909101805491151560ff199092169190911790555b50505061177f6001600655565b60606012805480602002602001604051908101604052809291908181526020016000905b82821015611ffc578382906000526020600020018054611f6f90614dc2565b80601f0160208091040260200160405190810160405280929190818152602001828054611f9b90614dc2565b8015611fe85780601f10611fbd57610100808354040283529160200191611fe8565b820191906000526020600020905b815481529060010190602001808311611fcb57829003601f168201915b505050505081526020019060010190611f50565b50505050905090565b60009182526011602090815260408084206001600160a01b0393909316845291905290205460ff1690565b6060600c8054610fb390614dc2565b612047612cc7565b600081116120a25760405162461bcd60e51b815260206004820152602260248201527f647374436861696e4964546f42617463684c696d6974206d757374206265203e604482015261020360f41b6064820152608401610dd6565b61ffff8216600081815260086020908152604091829020849055815192835282018390527f7315f7654d594ead24a30160ed9ba2d23247f543016b918343591e93d7afdb6d91015b60405180910390a15050565b61ffff811660009081526001602052604081208054606092919061211990614dc2565b80601f016020809104026020016040519081016040528092919081815260200182805461214590614dc2565b80156121925780601f1061216757610100808354040283529160200191612192565b820191906000526020600020905b81548152906001019060200180831161217557829003601f168201915b5050505050905080516000036121ea5760405162461bcd60e51b815260206004820152601d60248201527f4c7a4170703a206e6f20747275737465642070617468207265636f72640000006044820152606401610dd6565b6122056000601483516121fd9190614e54565b83919061346a565b9392505050565b7f9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a661223681612ddf565b612244601380546001019055565b6111f68383613577565b611666338383613591565b612261612cc7565b81813060405160200161227693929190615211565b60408051601f1981840301815291815261ffff85166000908152600160205220906122a19082615061565b507f8c0400cfe2d1199b1a725c78960bcc2a344d869b80590d0f2bd005db15a572ce8383836040516122d593929190615043565b60405180910390a1505050565b610f8a878787878787876131b3565b6122fb3383612de9565b6123175760405162461bcd60e51b8152600401610dd690614fcd565b6115698484848461365f565b61232b612cc7565b600480546001600160a01b0319166001600160a01b0383169081179091556040519081527f5db758e995a17ec1ad84bdef7e8c3293a0bd6179bcce400dff5d4c3d87db726b90602001611290565b606061238482612d21565b600061238e613692565b905060008151116123ae5760405180602001604052806000815250612205565b806123b8846136a1565b6040516020016123c9929190615237565b6040516020818303038152906040529392505050565b6123e7612cc7565b6040516332fb62e760e21b81526001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000169063cbed8b9c9061243b9088908890889088908890600401615266565b600060405180830381600087803b15801561245557600080fd5b505af1158015612469573d6000803e3d6000fd5b505050505050505050565b61247d82611a3c565b6001600160a01b0316336001600160a01b0316146124cd5760405162461bcd60e51b815260206004820152600d60248201526c2737ba103a34329037bbb732b960991b6044820152606401610dd6565b604051600160f01b6020820152602281018290526001906000906042016040516020818303038152906040529050600061250b8787876000866115a1565b509050803410156125715760405162461bcd60e51b815260206004820152602a60248201527f4d7573742073656e6420656e6f7567682076616c756520746f20636f766572206044820152696d65737361676546656560b01b6064820152608401610dd6565b61258188888888336000886119ef565b61258a85613110565b6125946013613733565b5050505050505050565b6125a6612cc7565b600081116126025760405162461bcd60e51b815260206004820152602360248201527f647374436861696e4964546f5472616e73666572476173206d7573742062652060448201526203e20360ec1b6064820152608401610dd6565b61ffff8216600081815260096020908152604091829020849055815192835282018390527fc46df2983228ac2d9754e94a0d565e6671665dc8ad38602bc8e544f0685a29fb91016120ea565b61ffff861660009081526005602052604080822090516126719088908890614dfc565b90815260408051602092819003830190206001600160401b038716600090815292529020549050806126f15760405162461bcd60e51b815260206004820152602360248201527f4e6f6e626c6f636b696e674c7a4170703a206e6f2073746f726564206d65737360448201526261676560e81b6064820152608401610dd6565b808383604051612702929190614dfc565b6040518091039020146127615760405162461bcd60e51b815260206004820152602160248201527f4e6f6e626c6f636b696e674c7a4170703a20696e76616c6964207061796c6f616044820152601960fa1b6064820152608401610dd6565b61ffff871660009081526005602052604080822090516127849089908990614dfc565b90815260408051602092819003830181206001600160401b038916600090815290845282902093909355601f8801829004820283018201905286825261281c918991899089908190840183828082843760009201919091525050604080516020601f8a018190048102820181019092528881528a935091508890889081908401838280828437600092019190915250612b4192505050565b7fc264d91f3adc5588250e1551f547752ca0cfa8f6b530d243b9f9f4cab10ea8e5878787878560405161285395949392919061529f565b60405180910390a150505050505050565b60008281526011602052604090206001015461287f81612ddf565b6111f683836130a9565b612891612cc7565b61ffff83811660008181526002602090815260408083209487168084529482529182902085905581519283528201929092529081018290527f9d5c7c0b934da8fefa9c7760c98383778a12dfbfc0c3b3106518f43fb9508ac0906060016122d5565b6128fb612cc7565b61ffff831660009081526001602052604090206129198284836152da565b507ffa41487ad5d6728f0b19276fa1eddc16558578f5109fc39d2dc33c3230470dab8383836040516122d593929190615043565b600080600086866040516020016129659291906153ce565b60408051601f198184030181529082905263040a7bb160e41b825291506001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016906340a7bb10906129c9908b90309086908b908b906004016153fc565b6040805180830381865afa1580156129e5573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190612a099190615450565b92509250509550959350505050565b612a20612cc7565b6001600160a01b038116612a855760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b6064820152608401610dd6565b61177f81613375565b604051633d7b2f6f60e21b815261ffff808616600483015284166024820152306044820152606481018290526060907f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03169063f5ecbdbc90608401600060405180830381865afa158015612b0e573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f19168201604052612b369190810190615474565b90505b949350505050565b60008082806020019051810190612b589190615157565b601482015191935091506000612b708883838661341e565b90508251811015612c445784516020808701919091206040805160808101825261ffff808d1682526001600160a01b038088168387019081528385018881526001606086018181526000898152600a909a529887902095518654935190941662010000026001600160b01b03199093169390941692909217178355519082015592516002909301805493151560ff199094169390931790925590517f10e0b70d256bccc84b7027506978bd8b68984a870788b93b479def144c839ad790612c3a90839089906154a8565b60405180910390a1505b816001600160a01b031687604051612c5c9190614e0c565b60405180910390208961ffff167f5b821db8a46f8ecbe1941ba2f51cfeea9643268b56631f70d45e2a745d99026586604051612c9891906154c1565b60405180910390a45050505050505050565b60006001600160e01b031982161580610f9e5750610f9e8261378a565b6000546001600160a01b03163314611cc95760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152606401610dd6565b612d2a816137af565b61177f5760405162461bcd60e51b8152602060048201526018602482015277115490cdcc8c4e881a5b9d985b1a59081d1bdad95b88125160421b6044820152606401610dd6565b6000818152600f6020526040902080546001600160a01b0319166001600160a01b0384169081179091558190612da682611a3c565b6001600160a01b03167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92560405160405180910390a45050565b61177f81336137cc565b600080612df583611a3c565b9050806001600160a01b0316846001600160a01b03161480612e3c57506001600160a01b0380821660009081526010602090815260408083209388168352929052205460ff165b80612b395750836001600160a01b0316612e55846110bf565b6001600160a01b031614949350505050565b826001600160a01b0316612e7a82611a3c565b6001600160a01b031614612ea05760405162461bcd60e51b8152600401610dd6906154d4565b6001600160a01b038216612f025760405162461bcd60e51b8152602060048201526024808201527f4552433732313a207472616e7366657220746f20746865207a65726f206164646044820152637265737360e01b6064820152608401610dd6565b612f0f8383836001613825565b826001600160a01b0316612f2282611a3c565b6001600160a01b031614612f485760405162461bcd60e51b8152600401610dd6906154d4565b6000818152600f6020908152604080832080546001600160a01b03199081169091556001600160a01b03878116808652600e8552838620805460001901905590871680865283862080546001019055868652600d90945282852080549092168417909155905184937fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef91a4505050565b6040805160018082528183019092526060916000919060208083019080368337019050509050828160008151811061301257613012614e28565b602090810291909101015292915050565b61302d8282612005565b6116665760008281526011602090815260408083206001600160a01b03851684529091529020805460ff191660011790556130653390565b6001600160a01b0316816001600160a01b0316837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45050565b6130b38282612005565b156116665760008281526011602090815260408083206001600160a01b0385168085529252808320805460ff1916905551339285917ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b9190a45050565b600061311b82611a3c565b905061312b816000846001613825565b61313482611a3c565b6000838152600f6020908152604080832080546001600160a01b03199081169091556001600160a01b038516808552600e84528285208054600019019055878552600d909352818420805490911690555192935084927fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef908390a45050565b60008451116131fa5760405162461bcd60e51b8152602060048201526013602482015272746f6b656e4964735b5d20697320656d70747960681b6044820152606401610dd6565b83516001148061321e575061ffff8616600090815260086020526040902054845111155b6132755760405162461bcd60e51b815260206004820152602260248201527f62617463682073697a65206578636565647320647374206261746368206c696d6044820152611a5d60f21b6064820152608401610dd6565b60005b84518110156132b8576132a688888888858151811061329957613299614e28565b60200260200101516138ad565b806132b081615519565b915050613278565b50600085856040516020016132ce9291906153ce565b6040516020818303038152906040529050613313876001848851600960008d61ffff1661ffff1681526020019081526020016000205461330e9190615532565b613998565b613321878286868634613a6d565b8560405161332f9190614e0c565b6040518091039020886001600160a01b03168861ffff167fe1b87c47fdeb4f9cbadbca9df3af7aba453bb6e501075d0440d88125b711522a88604051612c9891906154c1565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b6002600654036134175760405162461bcd60e51b815260206004820152601f60248201527f5265656e7472616e637947756172643a207265656e7472616e742063616c6c006044820152606401610dd6565b6002600655565b6000825b8251811015612b36576007545a10612b3657613458868685848151811061344b5761344b614e28565b6020026020010151613c12565b8061346281615519565b915050613422565b60608161347881601f615549565b10156134b75760405162461bcd60e51b815260206004820152600e60248201526d736c6963655f6f766572666c6f7760901b6044820152606401610dd6565b6134c18284615549565b845110156135055760405162461bcd60e51b8152602060048201526011602482015270736c6963655f6f75744f66426f756e647360781b6044820152606401610dd6565b606082158015613524576040519150600082526020820160405261356e565b6040519150601f8416801560200281840101858101878315602002848b0101015b8183101561355d578051835260209283019201613545565b5050858452601f01601f1916604052505b50949350505050565b611666828260405180602001604052806000815250613c72565b816001600160a01b0316836001600160a01b0316036135f25760405162461bcd60e51b815260206004820152601960248201527f4552433732313a20617070726f766520746f2063616c6c6572000000000000006044820152606401610dd6565b6001600160a01b03838116600081815260106020908152604080832094871680845294825291829020805460ff191686151590811790915591519182527f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31910160405180910390a3505050565b61366a848484612e67565b61367684848484613ca5565b6115695760405162461bcd60e51b8152600401610dd69061555c565b606060148054610fb390614dc2565b606060006136ae83613da3565b60010190506000816001600160401b038111156136cd576136cd61456e565b6040519080825280601f01601f1916602001820160405280156136f7576020820181803683370190505b5090508181016020015b600019016f181899199a1a9b1b9c1cb0b131b232b360811b600a86061a8153600a850494508461370157509392505050565b8054806137825760405162461bcd60e51b815260206004820152601b60248201527f436f756e7465723a2064656372656d656e74206f766572666c6f7700000000006044820152606401610dd6565b600019019055565b60006001600160e01b03198216637965db0b60e01b1480610f9e5750610f9e82613e7b565b6000908152600d60205260409020546001600160a01b0316151590565b6137d68282612005565b611666576137e381613ebb565b6137ee836020613ecd565b6040516020016137ff9291906155ae565b60408051601f198184030181529082905262461bcd60e51b8252610dd6916004016144bf565b6001811115611569576001600160a01b0384161561386b576001600160a01b0384166000908152600e602052604081208054839290613865908490614e54565b90915550505b6001600160a01b03831615611569576001600160a01b0383166000908152600e6020526040812080548392906138a2908490615549565b909155505050505050565b6138b633611574565b6139195760405162461bcd60e51b815260206004820152602e60248201527f4f4e46543732313a2073656e642063616c6c6572206973206e6f74206f776e6560448201526d1c881b9bdc88185c1c1c9bdd995960921b6064820152608401610dd6565b836001600160a01b031661392c82611a3c565b6001600160a01b03161461398d5760405162461bcd60e51b815260206004820152602260248201527f4f4e46543732313a2073656e642066726f6d20696e636f7272656374206f776e60448201526132b960f11b6064820152608401610dd6565b611569843083612e67565b60006139a383614068565b61ffff80871660009081526002602090815260408083209389168352929052205490915080613a145760405162461bcd60e51b815260206004820152601a60248201527f4c7a4170703a206d696e4761734c696d6974206e6f74207365740000000000006044820152606401610dd6565b613a1e8382615549565b821015611b705760405162461bcd60e51b815260206004820152601b60248201527f4c7a4170703a20676173206c696d697420697320746f6f206c6f7700000000006044820152606401610dd6565b61ffff861660009081526001602052604081208054613a8b90614dc2565b80601f0160208091040260200160405190810160405280929190818152602001828054613ab790614dc2565b8015613b045780601f10613ad957610100808354040283529160200191613b04565b820191906000526020600020905b815481529060010190602001808311613ae757829003601f168201915b505050505090508051600003613b755760405162461bcd60e51b815260206004820152603060248201527f4c7a4170703a2064657374696e6174696f6e20636861696e206973206e6f742060448201526f61207472757374656420736f7572636560801b6064820152608401610dd6565b613b808787516140c4565b60405162c5803160e81b81526001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000169063c5803100908490613bd7908b9086908c908c908c908c90600401615623565b6000604051808303818588803b158015613bf057600080fd5b505af1158015613c04573d6000803e3d6000fd5b505050505050505050505050565b613c1b816137af565b1580613c475750613c2b816137af565b8015613c47575030613c3c82611a3c565b6001600160a01b0316145b613c5057600080fd5b613c59816137af565b613c67576111f68282613577565b6111f6308383612e67565b613c7c8383614135565b613c896000848484613ca5565b6111f65760405162461bcd60e51b8152600401610dd69061555c565b60006001600160a01b0384163b15613d9b57604051630a85bd0160e11b81526001600160a01b0385169063150b7a0290613ce990339089908890889060040161568a565b6020604051808303816000875af1925050508015613d24575060408051601f3d908101601f19168201909252613d21918101906156c7565b60015b613d81573d808015613d52576040519150601f19603f3d011682016040523d82523d6000602084013e613d57565b606091505b508051600003613d795760405162461bcd60e51b8152600401610dd69061555c565b805181602001fd5b6001600160e01b031916630a85bd0160e11b149050612b39565b506001612b39565b60008072184f03e93ff9f4daa797ed6e38ed64bf6a1f0160401b8310613de25772184f03e93ff9f4daa797ed6e38ed64bf6a1f0160401b830492506040015b6d04ee2d6d415b85acef81000000008310613e0e576d04ee2d6d415b85acef8100000000830492506020015b662386f26fc100008310613e2c57662386f26fc10000830492506010015b6305f5e1008310613e44576305f5e100830492506008015b6127108310613e5857612710830492506004015b60648310613e6a576064830492506002015b600a8310610f9e5760010192915050565b60006001600160e01b031982166380ac58cd60e01b1480613eac57506001600160e01b03198216635b5e139f60e01b145b80610f9e5750610f9e826142b0565b6060610f9e6001600160a01b03831660145b60606000613edc836002615532565b613ee7906002615549565b6001600160401b03811115613efe57613efe61456e565b6040519080825280601f01601f191660200182016040528015613f28576020820181803683370190505b509050600360fc1b81600081518110613f4357613f43614e28565b60200101906001600160f81b031916908160001a905350600f60fb1b81600181518110613f7257613f72614e28565b60200101906001600160f81b031916908160001a9053506000613f96846002615532565b613fa1906001615549565b90505b6001811115614019576f181899199a1a9b1b9c1cb0b131b232b360811b85600f1660108110613fd557613fd5614e28565b1a60f81b828281518110613feb57613feb614e28565b60200101906001600160f81b031916908160001a90535060049490941c93614012816156e4565b9050613fa4565b5083156122055760405162461bcd60e51b815260206004820181905260248201527f537472696e67733a20686578206c656e67746820696e73756666696369656e746044820152606401610dd6565b60006022825110156140bc5760405162461bcd60e51b815260206004820152601c60248201527f4c7a4170703a20696e76616c69642061646170746572506172616d73000000006044820152606401610dd6565b506022015190565b61ffff8216600090815260036020526040812054908190036140e557506127105b808211156111f65760405162461bcd60e51b815260206004820181905260248201527f4c7a4170703a207061796c6f61642073697a6520697320746f6f206c617267656044820152606401610dd6565b6001600160a01b03821661418b5760405162461bcd60e51b815260206004820181905260248201527f4552433732313a206d696e7420746f20746865207a65726f20616464726573736044820152606401610dd6565b614194816137af565b156141e15760405162461bcd60e51b815260206004820152601c60248201527f4552433732313a20746f6b656e20616c7265616479206d696e746564000000006044820152606401610dd6565b6141ef600083836001613825565b6141f8816137af565b156142455760405162461bcd60e51b815260206004820152601c60248201527f4552433732313a20746f6b656e20616c7265616479206d696e746564000000006044820152606401610dd6565b6001600160a01b0382166000818152600e6020908152604080832080546001019055848352600d90915280822080546001600160a01b0319168417905551839291907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef908290a45050565b60006001600160e01b031982166322bac5d960e01b1480610f9e57506301ffc9a760e01b6001600160e01b0319831614610f9e565b5080546142f190614dc2565b6000825580601f10614301575050565b601f01602090049060005260206000209081019061177f91905b8082111561432f576000815560010161431b565b5090565b803561ffff8116811461434557600080fd5b919050565b60008083601f84011261435c57600080fd5b5081356001600160401b0381111561437357600080fd5b60208301915083602082850101111561438b57600080fd5b9250929050565b80356001600160401b038116811461434557600080fd5b600080600080600080608087890312156143c257600080fd5b6143cb87614333565b955060208701356001600160401b03808211156143e757600080fd5b6143f38a838b0161434a565b909750955085915061440760408a01614392565b9450606089013591508082111561441d57600080fd5b5061442a89828a0161434a565b979a9699509497509295939492505050565b6001600160e01b03198116811461177f57600080fd5b60006020828403121561446457600080fd5b81356122058161443c565b60005b8381101561448a578181015183820152602001614472565b50506000910152565b600081518084526144ab81602086016020860161446f565b601f01601f19169290920160200192915050565b6020815260006122056020830184614493565b6000602082840312156144e457600080fd5b61220582614333565b6000602082840312156144ff57600080fd5b5035919050565b6001600160a01b038116811461177f57600080fd5b803561434581614506565b6000806040838503121561453957600080fd5b823561454481614506565b946020939093013593505050565b6000806040838503121561456557600080fd5b61454483614333565b634e487b7160e01b600052604160045260246000fd5b604051601f8201601f191681016001600160401b03811182821017156145ac576145ac61456e565b604052919050565b60006001600160401b038211156145cd576145cd61456e565b50601f01601f191660200190565b60006145ee6145e9846145b4565b614584565b905082815283838301111561460257600080fd5b828260208301376000602084830101529392505050565b60006020828403121561462b57600080fd5b81356001600160401b0381111561464157600080fd5b8201601f8101841361465257600080fd5b612b39848235602084016145db565b60008060006060848603121561467657600080fd5b833561468181614506565b9250602084013561469181614506565b929592945050506040919091013590565b600082601f8301126146b357600080fd5b612205838335602085016145db565b8035801515811461434557600080fd5b600080600080600060a086880312156146ea57600080fd5b6146f386614333565b945060208601356001600160401b038082111561470f57600080fd5b61471b89838a016146a2565b955060408801359450614730606089016146c2565b9350608088013591508082111561474657600080fd5b50614753888289016146a2565b9150509295509295909350565b6000806040838503121561477357600080fd5b82359150602083013561478581614506565b809150509250929050565b6000806000604084860312156147a557600080fd5b6147ae84614333565b925060208401356001600160401b038111156147c957600080fd5b6147d58682870161434a565b9497909650939450505050565b600080600080600080600060e0888a0312156147fd57600080fd5b873561480881614506565b965061481660208901614333565b955060408801356001600160401b038082111561483257600080fd5b61483e8b838c016146a2565b965060608a0135955060808a0135915061485782614506565b90935060a08901359061486982614506565b90925060c0890135908082111561487f57600080fd5b5061488c8a828b016146a2565b91505092959891949750929550565b6000806000606084860312156148b057600080fd5b6148b984614333565b925060208401356001600160401b038111156148d457600080fd5b6148e0868287016146a2565b9250506148ef60408501614392565b90509250925092565b60006020828403121561490a57600080fd5b813561220581614506565b6000806040838503121561492857600080fd5b61493183614333565b915061493f60208401614333565b90509250929050565b60006020828403121561495a57600080fd5b81356001600160401b0381111561497057600080fd5b612b39848285016146a2565b6000602080830181845280855180835260408601915060408160051b870101925083870160005b828110156149d157603f198886030184526149bf858351614493565b945092850192908501906001016149a3565b5092979650505050505050565b600080604083850312156149f157600080fd5b82356149fc81614506565b915061493f602084016146c2565b60006001600160401b03821115614a2357614a2361456e565b5060051b60200190565b600082601f830112614a3e57600080fd5b81356020614a4e6145e983614a0a565b82815260059290921b84018101918181019086841115614a6d57600080fd5b8286015b84811015614a885780358352918301918301614a71565b509695505050505050565b600080600080600080600060e0888a031215614aae57600080fd5b8735614ab981614506565b9650614ac760208901614333565b955060408801356001600160401b0380821115614ae357600080fd5b614aef8b838c016146a2565b965060608a0135915080821115614b0557600080fd5b614b118b838c01614a2d565b955060808a01359150614b2382614506565b819450614b3260a08b0161451b565b935060c08a013591508082111561487f57600080fd5b60008060008060808587031215614b5e57600080fd5b8435614b6981614506565b93506020850135614b7981614506565b92506040850135915060608501356001600160401b03811115614b9b57600080fd5b614ba7878288016146a2565b91505092959194509250565b600080600080600060808688031215614bcb57600080fd5b614bd486614333565b9450614be260208701614333565b93506040860135925060608601356001600160401b03811115614c0457600080fd5b614c108882890161434a565b969995985093965092949392505050565b600080600080600060a08688031215614c3957600080fd5b8535614c4481614506565b9450614c5260208701614333565b935060408601356001600160401b03811115614c6d57600080fd5b614c79888289016146a2565b9598949750949560608101359550608001359392505050565b600080600060608486031215614ca757600080fd5b614cb084614333565b9250614cbe60208501614333565b9150604084013590509250925092565b60008060408385031215614ce157600080fd5b8235614cec81614506565b9150602083013561478581614506565b600080600080600060a08688031215614d1457600080fd5b614d1d86614333565b945060208601356001600160401b0380821115614d3957600080fd5b614d4589838a016146a2565b95506040880135915080821115614d5b57600080fd5b614d6789838a01614a2d565b9450614730606089016146c2565b60008060008060808587031215614d8b57600080fd5b614d9485614333565b9350614da260208601614333565b92506040850135614db281614506565b9396929550929360600135925050565b600181811c90821680614dd657607f821691505b602082108103614df657634e487b7160e01b600052602260045260246000fd5b50919050565b8183823760009101908152919050565b60008251614e1e81846020870161446f565b9190910192915050565b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052601160045260246000fd5b81810381811115610f9e57610f9e614e3e565b601f8211156111f657600081815260208120601f850160051c81016020861015614e8e5750805b601f850160051c820191505b81811015611b7057828155600101614e9a565b600019600383901b1c191660019190911b1790565b818103614ecd575050565b614ed78254614dc2565b6001600160401b03811115614eee57614eee61456e565b614f0281614efc8454614dc2565b84614e67565b6000601f821160018114614f305760008315614f1e5750848201545b614f288482614ead565b8555506110b8565b600085815260209020601f19841690600086815260209020845b83811015614f6a5782860154825560019586019590910190602001614f4a565b5085831015614f885781850154600019600388901b60f8161c191681555b5050505050600190811b01905550565b634e487b7160e01b600052603160045260246000fd5b600060ff821660ff8103614fc457614fc4614e3e565b60010192915050565b6020808252602d908201527f4552433732313a2063616c6c6572206973206e6f7420746f6b656e206f776e6560408201526c1c881bdc88185c1c1c9bdd9959609a1b606082015260800190565b81835281816020850137506000828201602090810191909152601f909101601f19169091010190565b61ffff84168152604060208201526000612b3660408301848661501a565b81516001600160401b0381111561507a5761507a61456e565b61508881614efc8454614dc2565b602080601f8311600181146150b757600084156150a55750858301515b6150af8582614ead565b865550611b70565b600085815260208120601f198616915b828110156150e6578886015182559484019460019091019084016150c7565b5085821015614f8857939096015160001960f8600387901b161c19169092555050600190811b01905550565b600082601f83011261512357600080fd5b81516151316145e9826145b4565b81815284602083860101111561514657600080fd5b612b3982602083016020870161446f565b6000806040838503121561516a57600080fd5b82516001600160401b038082111561518157600080fd5b61518d86838701615112565b93506020915081850151818111156151a457600080fd5b85019050601f810186136151b757600080fd5b80516151c56145e982614a0a565b81815260059190911b820183019083810190888311156151e457600080fd5b928401925b82841015615202578351825292840192908401906151e9565b80955050505050509250929050565b8284823760609190911b6bffffffffffffffffffffffff19169101908152601401919050565b6000835161524981846020880161446f565b83519083019061525d81836020880161446f565b01949350505050565b600061ffff80881683528087166020840152508460408301526080606083015261529460808301848661501a565b979650505050505050565b61ffff861681526080602082015260006152bd60808301868861501a565b6001600160401b0394909416604083015250606001529392505050565b6001600160401b038311156152f1576152f161456e565b615305836152ff8354614dc2565b83614e67565b6000601f84116001811461533357600085156153215750838201355b61532b8682614ead565b8455506110b8565b600083815260209020601f19861690835b828110156153645786850135825560209485019460019092019101615344565b50868210156153815760001960f88860031b161c19848701351681555b505060018560011b0183555050505050565b600081518084526020808501945080840160005b838110156153c3578151875295820195908201906001016153a7565b509495945050505050565b6040815260006153e16040830185614493565b82810360208401526153f38185615393565b95945050505050565b61ffff861681526001600160a01b038516602082015260a06040820181905260009061542a90830186614493565b841515606084015282810360808401526154448185614493565b98975050505050505050565b6000806040838503121561546357600080fd5b505080516020909101519092909150565b60006020828403121561548657600080fd5b81516001600160401b0381111561549c57600080fd5b612b3984828501615112565b828152604060208201526000612b396040830184614493565b6020815260006122056020830184615393565b60208082526025908201527f4552433732313a207472616e736665722066726f6d20696e636f72726563742060408201526437bbb732b960d91b606082015260800190565b60006001820161552b5761552b614e3e565b5060010190565b8082028115828204841417610f9e57610f9e614e3e565b80820180821115610f9e57610f9e614e3e565b60208082526032908201527f4552433732313a207472616e7366657220746f206e6f6e20455243373231526560408201527131b2b4bb32b91034b6b83632b6b2b73a32b960711b606082015260800190565b7f416363657373436f6e74726f6c3a206163636f756e74200000000000000000008152600083516155e681601785016020880161446f565b7001034b99036b4b9b9b4b733903937b6329607d1b601791840191820152835161561781602884016020880161446f565b01602801949350505050565b61ffff8716815260c06020820152600061564060c0830188614493565b82810360408401526156528188614493565b6001600160a01b0387811660608601528616608085015283810360a0850152905061567d8185614493565b9998505050505050505050565b6001600160a01b03858116825284166020820152604081018390526080606082018190526000906156bd90830184614493565b9695505050505050565b6000602082840312156156d957600080fd5b81516122058161443c565b6000816156f3576156f3614e3e565b50600019019056fea264697066735822122019738c3a2cc667d6910012970cc4f3df4833cfb908e00c21791ffe54c9ea727064736f6c63430008140033",
  linkReferences: {},
  deployedLinkReferences: {},
};
