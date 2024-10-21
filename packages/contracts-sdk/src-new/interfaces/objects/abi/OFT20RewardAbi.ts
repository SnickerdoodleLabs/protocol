export default {
  _format: "hh-sol-artifact-1",
  contractName: "OFT20Reward",
  sourceName: "contracts/testing/OFT20Reward.sol",
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
          internalType: "address",
          name: "layerZeroEndpoint",
          type: "address",
        },
      ],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      inputs: [],
      name: "InvalidDelegate",
      type: "error",
    },
    {
      inputs: [],
      name: "InvalidEndpointCall",
      type: "error",
    },
    {
      inputs: [],
      name: "InvalidLocalDecimals",
      type: "error",
    },
    {
      inputs: [
        {
          internalType: "bytes",
          name: "options",
          type: "bytes",
        },
      ],
      name: "InvalidOptions",
      type: "error",
    },
    {
      inputs: [],
      name: "LzTokenUnavailable",
      type: "error",
    },
    {
      inputs: [
        {
          internalType: "uint32",
          name: "eid",
          type: "uint32",
        },
      ],
      name: "NoPeer",
      type: "error",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "msgValue",
          type: "uint256",
        },
      ],
      name: "NotEnoughNative",
      type: "error",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "addr",
          type: "address",
        },
      ],
      name: "OnlyEndpoint",
      type: "error",
    },
    {
      inputs: [
        {
          internalType: "uint32",
          name: "eid",
          type: "uint32",
        },
        {
          internalType: "bytes32",
          name: "sender",
          type: "bytes32",
        },
      ],
      name: "OnlyPeer",
      type: "error",
    },
    {
      inputs: [],
      name: "OnlySelf",
      type: "error",
    },
    {
      inputs: [
        {
          internalType: "bytes",
          name: "result",
          type: "bytes",
        },
      ],
      name: "SimulationResult",
      type: "error",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "amountLD",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "minAmountLD",
          type: "uint256",
        },
      ],
      name: "SlippageExceeded",
      type: "error",
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
          name: "spender",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "value",
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
          components: [
            {
              internalType: "uint32",
              name: "eid",
              type: "uint32",
            },
            {
              internalType: "uint16",
              name: "msgType",
              type: "uint16",
            },
            {
              internalType: "bytes",
              name: "options",
              type: "bytes",
            },
          ],
          indexed: false,
          internalType: "struct EnforcedOptionParam[]",
          name: "_enforcedOptions",
          type: "tuple[]",
        },
      ],
      name: "EnforcedOptionSet",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "address",
          name: "inspector",
          type: "address",
        },
      ],
      name: "MsgInspectorSet",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "bytes32",
          name: "guid",
          type: "bytes32",
        },
        {
          indexed: false,
          internalType: "uint32",
          name: "srcEid",
          type: "uint32",
        },
        {
          indexed: true,
          internalType: "address",
          name: "toAddress",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "amountReceivedLD",
          type: "uint256",
        },
      ],
      name: "OFTReceived",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "bytes32",
          name: "guid",
          type: "bytes32",
        },
        {
          indexed: false,
          internalType: "uint32",
          name: "dstEid",
          type: "uint32",
        },
        {
          indexed: true,
          internalType: "address",
          name: "fromAddress",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "amountSentLD",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "amountReceivedLD",
          type: "uint256",
        },
      ],
      name: "OFTSent",
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
          indexed: false,
          internalType: "uint32",
          name: "eid",
          type: "uint32",
        },
        {
          indexed: false,
          internalType: "bytes32",
          name: "peer",
          type: "bytes32",
        },
      ],
      name: "PeerSet",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "address",
          name: "preCrimeAddress",
          type: "address",
        },
      ],
      name: "PreCrimeSet",
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
          indexed: false,
          internalType: "uint256",
          name: "value",
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
      name: "DOMAIN_SEPARATOR",
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
      inputs: [],
      name: "REDEEM_DETAILS_TYPEHASH",
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
      name: "SEND",
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
      name: "SEND_AND_CALL",
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
          components: [
            {
              internalType: "uint32",
              name: "srcEid",
              type: "uint32",
            },
            {
              internalType: "bytes32",
              name: "sender",
              type: "bytes32",
            },
            {
              internalType: "uint64",
              name: "nonce",
              type: "uint64",
            },
          ],
          internalType: "struct Origin",
          name: "origin",
          type: "tuple",
        },
      ],
      name: "allowInitializePath",
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
          name: "spender",
          type: "address",
        },
      ],
      name: "allowance",
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
      name: "approvalRequired",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "pure",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "spender",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
      ],
      name: "approve",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "account",
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
      inputs: [
        {
          internalType: "uint256",
          name: "amount",
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
          internalType: "address",
          name: "account",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
      ],
      name: "burnFrom",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint32",
          name: "_eid",
          type: "uint32",
        },
        {
          internalType: "uint16",
          name: "_msgType",
          type: "uint16",
        },
        {
          internalType: "bytes",
          name: "_extraOptions",
          type: "bytes",
        },
      ],
      name: "combineOptions",
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
      name: "composeMsgSender",
      outputs: [
        {
          internalType: "address",
          name: "sender",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "decimalConversionRate",
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
      name: "decimals",
      outputs: [
        {
          internalType: "uint8",
          name: "",
          type: "uint8",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "spender",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "subtractedValue",
          type: "uint256",
        },
      ],
      name: "decreaseAllowance",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
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
      inputs: [],
      name: "endpoint",
      outputs: [
        {
          internalType: "contract ILayerZeroEndpointV2",
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
          internalType: "uint32",
          name: "eid",
          type: "uint32",
        },
        {
          internalType: "uint16",
          name: "msgType",
          type: "uint16",
        },
      ],
      name: "enforcedOptions",
      outputs: [
        {
          internalType: "bytes",
          name: "enforcedOption",
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
          components: [
            {
              internalType: "address",
              name: "contractAddress",
              type: "address",
            },
            {
              internalType: "address",
              name: "redeemFrom",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "redeemAmount",
              type: "uint256",
            },
            {
              internalType: "address",
              name: "redeemer",
              type: "address",
            },
          ],
          internalType: "struct OFT20Reward.RedeemDetails",
          name: "redeemDetails",
          type: "tuple",
        },
      ],
      name: "hashRedeemDetails",
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
          name: "spender",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "addedValue",
          type: "uint256",
        },
      ],
      name: "increaseAllowance",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint32",
          name: "_eid",
          type: "uint32",
        },
        {
          internalType: "bytes32",
          name: "_peer",
          type: "bytes32",
        },
      ],
      name: "isPeer",
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
          components: [
            {
              internalType: "uint32",
              name: "srcEid",
              type: "uint32",
            },
            {
              internalType: "bytes32",
              name: "sender",
              type: "bytes32",
            },
            {
              internalType: "uint64",
              name: "nonce",
              type: "uint64",
            },
          ],
          internalType: "struct Origin",
          name: "_origin",
          type: "tuple",
        },
        {
          internalType: "bytes32",
          name: "_guid",
          type: "bytes32",
        },
        {
          internalType: "bytes",
          name: "_message",
          type: "bytes",
        },
        {
          internalType: "address",
          name: "_executor",
          type: "address",
        },
        {
          internalType: "bytes",
          name: "_extraData",
          type: "bytes",
        },
      ],
      name: "lzReceive",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [
        {
          components: [
            {
              components: [
                {
                  internalType: "uint32",
                  name: "srcEid",
                  type: "uint32",
                },
                {
                  internalType: "bytes32",
                  name: "sender",
                  type: "bytes32",
                },
                {
                  internalType: "uint64",
                  name: "nonce",
                  type: "uint64",
                },
              ],
              internalType: "struct Origin",
              name: "origin",
              type: "tuple",
            },
            {
              internalType: "uint32",
              name: "dstEid",
              type: "uint32",
            },
            {
              internalType: "address",
              name: "receiver",
              type: "address",
            },
            {
              internalType: "bytes32",
              name: "guid",
              type: "bytes32",
            },
            {
              internalType: "uint256",
              name: "value",
              type: "uint256",
            },
            {
              internalType: "address",
              name: "executor",
              type: "address",
            },
            {
              internalType: "bytes",
              name: "message",
              type: "bytes",
            },
            {
              internalType: "bytes",
              name: "extraData",
              type: "bytes",
            },
          ],
          internalType: "struct InboundPacket[]",
          name: "_packets",
          type: "tuple[]",
        },
      ],
      name: "lzReceiveAndRevert",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [
        {
          components: [
            {
              internalType: "uint32",
              name: "srcEid",
              type: "uint32",
            },
            {
              internalType: "bytes32",
              name: "sender",
              type: "bytes32",
            },
            {
              internalType: "uint64",
              name: "nonce",
              type: "uint64",
            },
          ],
          internalType: "struct Origin",
          name: "_origin",
          type: "tuple",
        },
        {
          internalType: "bytes32",
          name: "_guid",
          type: "bytes32",
        },
        {
          internalType: "bytes",
          name: "_message",
          type: "bytes",
        },
        {
          internalType: "address",
          name: "_executor",
          type: "address",
        },
        {
          internalType: "bytes",
          name: "_extraData",
          type: "bytes",
        },
      ],
      name: "lzReceiveSimulate",
      outputs: [],
      stateMutability: "payable",
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
          name: "amount",
          type: "uint256",
        },
      ],
      name: "mint",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "msgInspector",
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
          internalType: "uint32",
          name: "",
          type: "uint32",
        },
        {
          internalType: "bytes32",
          name: "",
          type: "bytes32",
        },
      ],
      name: "nextNonce",
      outputs: [
        {
          internalType: "uint64",
          name: "nonce",
          type: "uint64",
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
      ],
      name: "nonces",
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
      name: "oApp",
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
      name: "oAppVersion",
      outputs: [
        {
          internalType: "uint64",
          name: "senderVersion",
          type: "uint64",
        },
        {
          internalType: "uint64",
          name: "receiverVersion",
          type: "uint64",
        },
      ],
      stateMutability: "pure",
      type: "function",
    },
    {
      inputs: [],
      name: "oftVersion",
      outputs: [
        {
          internalType: "bytes4",
          name: "interfaceId",
          type: "bytes4",
        },
        {
          internalType: "uint64",
          name: "version",
          type: "uint64",
        },
      ],
      stateMutability: "pure",
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
          internalType: "uint32",
          name: "eid",
          type: "uint32",
        },
      ],
      name: "peers",
      outputs: [
        {
          internalType: "bytes32",
          name: "peer",
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
          name: "owner",
          type: "address",
        },
        {
          internalType: "address",
          name: "spender",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "value",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "deadline",
          type: "uint256",
        },
        {
          internalType: "uint8",
          name: "v",
          type: "uint8",
        },
        {
          internalType: "bytes32",
          name: "r",
          type: "bytes32",
        },
        {
          internalType: "bytes32",
          name: "s",
          type: "bytes32",
        },
      ],
      name: "permit",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "preCrime",
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
          components: [
            {
              internalType: "uint32",
              name: "dstEid",
              type: "uint32",
            },
            {
              internalType: "bytes32",
              name: "to",
              type: "bytes32",
            },
            {
              internalType: "uint256",
              name: "amountLD",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "minAmountLD",
              type: "uint256",
            },
            {
              internalType: "bytes",
              name: "extraOptions",
              type: "bytes",
            },
            {
              internalType: "bytes",
              name: "composeMsg",
              type: "bytes",
            },
            {
              internalType: "bytes",
              name: "oftCmd",
              type: "bytes",
            },
          ],
          internalType: "struct SendParam",
          name: "_sendParam",
          type: "tuple",
        },
      ],
      name: "quoteOFT",
      outputs: [
        {
          components: [
            {
              internalType: "uint256",
              name: "minAmountLD",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "maxAmountLD",
              type: "uint256",
            },
          ],
          internalType: "struct OFTLimit",
          name: "oftLimit",
          type: "tuple",
        },
        {
          components: [
            {
              internalType: "int256",
              name: "feeAmountLD",
              type: "int256",
            },
            {
              internalType: "string",
              name: "description",
              type: "string",
            },
          ],
          internalType: "struct OFTFeeDetail[]",
          name: "oftFeeDetails",
          type: "tuple[]",
        },
        {
          components: [
            {
              internalType: "uint256",
              name: "amountSentLD",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "amountReceivedLD",
              type: "uint256",
            },
          ],
          internalType: "struct OFTReceipt",
          name: "oftReceipt",
          type: "tuple",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          components: [
            {
              internalType: "uint32",
              name: "dstEid",
              type: "uint32",
            },
            {
              internalType: "bytes32",
              name: "to",
              type: "bytes32",
            },
            {
              internalType: "uint256",
              name: "amountLD",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "minAmountLD",
              type: "uint256",
            },
            {
              internalType: "bytes",
              name: "extraOptions",
              type: "bytes",
            },
            {
              internalType: "bytes",
              name: "composeMsg",
              type: "bytes",
            },
            {
              internalType: "bytes",
              name: "oftCmd",
              type: "bytes",
            },
          ],
          internalType: "struct SendParam",
          name: "_sendParam",
          type: "tuple",
        },
        {
          internalType: "bool",
          name: "_payInLzToken",
          type: "bool",
        },
      ],
      name: "quoteSend",
      outputs: [
        {
          components: [
            {
              internalType: "uint256",
              name: "nativeFee",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "lzTokenFee",
              type: "uint256",
            },
          ],
          internalType: "struct MessagingFee",
          name: "msgFee",
          type: "tuple",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "redeemFrom",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "redeemAmount",
          type: "uint256",
        },
        {
          internalType: "bytes",
          name: "signature",
          type: "bytes",
        },
      ],
      name: "redeem",
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
          components: [
            {
              internalType: "uint32",
              name: "dstEid",
              type: "uint32",
            },
            {
              internalType: "bytes32",
              name: "to",
              type: "bytes32",
            },
            {
              internalType: "uint256",
              name: "amountLD",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "minAmountLD",
              type: "uint256",
            },
            {
              internalType: "bytes",
              name: "extraOptions",
              type: "bytes",
            },
            {
              internalType: "bytes",
              name: "composeMsg",
              type: "bytes",
            },
            {
              internalType: "bytes",
              name: "oftCmd",
              type: "bytes",
            },
          ],
          internalType: "struct SendParam",
          name: "_sendParam",
          type: "tuple",
        },
        {
          components: [
            {
              internalType: "uint256",
              name: "nativeFee",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "lzTokenFee",
              type: "uint256",
            },
          ],
          internalType: "struct MessagingFee",
          name: "_fee",
          type: "tuple",
        },
        {
          internalType: "address",
          name: "_refundAddress",
          type: "address",
        },
      ],
      name: "send",
      outputs: [
        {
          components: [
            {
              internalType: "bytes32",
              name: "guid",
              type: "bytes32",
            },
            {
              internalType: "uint64",
              name: "nonce",
              type: "uint64",
            },
            {
              components: [
                {
                  internalType: "uint256",
                  name: "nativeFee",
                  type: "uint256",
                },
                {
                  internalType: "uint256",
                  name: "lzTokenFee",
                  type: "uint256",
                },
              ],
              internalType: "struct MessagingFee",
              name: "fee",
              type: "tuple",
            },
          ],
          internalType: "struct MessagingReceipt",
          name: "msgReceipt",
          type: "tuple",
        },
        {
          components: [
            {
              internalType: "uint256",
              name: "amountSentLD",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "amountReceivedLD",
              type: "uint256",
            },
          ],
          internalType: "struct OFTReceipt",
          name: "oftReceipt",
          type: "tuple",
        },
      ],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_delegate",
          type: "address",
        },
      ],
      name: "setDelegate",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          components: [
            {
              internalType: "uint32",
              name: "eid",
              type: "uint32",
            },
            {
              internalType: "uint16",
              name: "msgType",
              type: "uint16",
            },
            {
              internalType: "bytes",
              name: "options",
              type: "bytes",
            },
          ],
          internalType: "struct EnforcedOptionParam[]",
          name: "_enforcedOptions",
          type: "tuple[]",
        },
      ],
      name: "setEnforcedOptions",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_msgInspector",
          type: "address",
        },
      ],
      name: "setMsgInspector",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint32",
          name: "_eid",
          type: "uint32",
        },
        {
          internalType: "bytes32",
          name: "_peer",
          type: "bytes32",
        },
      ],
      name: "setPeer",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_preCrime",
          type: "address",
        },
      ],
      name: "setPreCrime",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "sharedDecimals",
      outputs: [
        {
          internalType: "uint8",
          name: "",
          type: "uint8",
        },
      ],
      stateMutability: "pure",
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
      inputs: [],
      name: "token",
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
          name: "to",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
      ],
      name: "transfer",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
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
          name: "amount",
          type: "uint256",
        },
      ],
      name: "transferFrom",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
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
  ],
  bytecode:
    "0x6101806040523480156200001257600080fd5b506040516200578338038062005783833981016040819052620000359162000449565b8280604051806040016040528060018152602001603160f81b815250858585338383620000676200027260201b60201c565b848481818181620000783362000277565b6001600160a01b038083166080528116620000a657604051632d618d8160e21b815260040160405180910390fd5b60805160405163ca5eb5e160e01b81526001600160a01b0383811660048301529091169063ca5eb5e190602401600060405180830381600087803b158015620000ee57600080fd5b505af115801562000103573d6000803e3d6000fd5b50505050505050506200011b620002c760201b60201c565b60ff168360ff16101562000142576040516301e9714b60e41b815260040160405180910390fd5b6200014f600684620004ec565b6200015c90600a62000605565b60a05250600891506200017290508382620006ac565b506009620001818282620006ac565b505086516020808901919091208751888301206101208290526101408190524660e0819052604080517f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f8187018190528183018690526060820185905260808201939093523060a0808301919091528251808303909101815260c09091019091528051940193909320919750955090935091506200021c9050565b60c052306101005261016052506200023d93506000925033915050620002cc565b620002697f9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a633620002cc565b50505062000778565b601290565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b600690565b620002d8828262000357565b62000353576000828152600c602090815260408083206001600160a01b03851684529091529020805460ff19166001179055620003123390565b6001600160a01b0316816001600160a01b0316837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45b5050565b6000828152600c602090815260408083206001600160a01b038516845290915290205460ff165b92915050565b634e487b7160e01b600052604160045260246000fd5b600082601f830112620003ac57600080fd5b81516001600160401b0380821115620003c957620003c962000384565b604051601f8301601f19908116603f01168101908282118183101715620003f457620003f462000384565b816040528381526020925086838588010111156200041157600080fd5b600091505b8382101562000435578582018301518183018401529082019062000416565b600093810190920192909252949350505050565b6000806000606084860312156200045f57600080fd5b83516001600160401b03808211156200047757600080fd5b62000485878388016200039a565b945060208601519150808211156200049c57600080fd5b50620004ab868287016200039a565b604086015190935090506001600160a01b0381168114620004cb57600080fd5b809150509250925092565b634e487b7160e01b600052601160045260246000fd5b60ff82811682821603908111156200037e576200037e620004d6565b600181815b80851115620005495781600019048211156200052d576200052d620004d6565b808516156200053b57918102915b93841c93908002906200050d565b509250929050565b60008262000562575060016200037e565b8162000571575060006200037e565b81600181146200058a57600281146200059557620005b5565b60019150506200037e565b60ff841115620005a957620005a9620004d6565b50506001821b6200037e565b5060208310610133831016604e8410600b8410161715620005da575081810a6200037e565b620005e6838362000508565b8060001904821115620005fd57620005fd620004d6565b029392505050565b60006200061660ff84168362000551565b9392505050565b600181811c908216806200063257607f821691505b6020821081036200065357634e487b7160e01b600052602260045260246000fd5b50919050565b601f821115620006a757600081815260208120601f850160051c81016020861015620006825750805b601f850160051c820191505b81811015620006a3578281556001016200068e565b5050505b505050565b81516001600160401b03811115620006c857620006c862000384565b620006e081620006d984546200061d565b8462000659565b602080601f831160018114620007185760008415620006ff5750858301515b600019600386901b1c1916600185901b178555620006a3565b600085815260208120601f198616915b82811015620007495788860151825594840194600190910190840162000728565b5085821015620007685787850151600019600388901b60f8161c191681555b5050505050600190811b01905550565b60805160a05160c05160e05161010051610120516101405161016051614f5f62000824600039600061299b015260006129ea015260006129c50152600061291e01526000612948015260006129720152600081816109d101528181612fc10152818161305a01526133240152600081816107ee01528181610edf01528181611f270152818161264701528181612bd901528181612e95015281816133ef01526134a80152614f5f6000f3fe6080604052600436106103ce5760003560e01c806370a08231116101fd578063b731ea0a11610118578063d045a0dc116100ab578063d547741f1161007a578063d547741f14610bc4578063dd62ed3e14610be4578063f2fde38b14610c04578063fc0c546a14610772578063ff7bd03d14610c2457600080fd5b8063d045a0dc14610b3d578063d424388514610b50578063d505accf14610b70578063d539139314610b9057600080fd5b8063bc70b354116100e7578063bc70b35414610ac9578063bd815db014610ae9578063c7c7f5b314610afc578063ca5eb5e114610b1d57600080fd5b8063b731ea0a14610a5c578063b92d0eff14610772578063b98bd07014610a7c578063bb0b6a5314610a9c57600080fd5b806391d14854116101905780639f68b9641161015f5780639f68b964146109f3578063a217fddf14610a07578063a457c2d714610a1c578063a9059cbb14610a3c57600080fd5b806391d148541461096a57806392a913241461098a57806395d89b41146109aa578063963efcaa146109bf57600080fd5b80637ecebe00116101cc5780637ecebe00146108f6578063857749b0146109165780638da5cb5b1461092a5780639101cc651461094857600080fd5b806370a0823114610850578063715018a61461088657806379cc67901461089b5780637d25a05e146108bb57600080fd5b8063313ce567116102ed57806342966c68116102805780635a0dfe4d1161024f5780635a0dfe4d146107a55780635e280f11146107dc57806366cf8fab146108105780636fc1b31e1461083057600080fd5b806342966c681461073257806344e2e74c1461075257806352ae2879146107725780635535d4611461078557600080fd5b806336568abe116102bc57806336568abe146106a557806339509351146106c55780633b6f743b146106e557806340c10f191461071257600080fd5b8063313ce5671461061a5780633400288b1461063c57806335dfc2271461065c5780633644e5151461069057600080fd5b8063156a0d0f116103655780632277892911610334578063227789291461058a57806323b872dd146105aa578063248a9ca3146105ca5780632f2ff15d146105fa57600080fd5b8063156a0d0f1461050e57806317442b701461053557806318160ddd146105565780631f5e13341461057557600080fd5b806310badf4e116103a157806310badf4e14610479578063111ecdad1461049b57806313137d65146104d3578063134d4f25146104e657600080fd5b806301ffc9a7146103d357806306fdde0314610408578063095ea7b31461042a5780630d35b4151461044a575b600080fd5b3480156103df57600080fd5b506103f36103ee366004613b8b565b610c44565b60405190151581526020015b60405180910390f35b34801561041457600080fd5b5061041d610c7b565b6040516103ff9190613c05565b34801561043657600080fd5b506103f3610445366004613c2d565b610d0d565b34801561045657600080fd5b5061046a610465366004613c6b565b610d25565b6040516103ff93929190613c9f565b34801561048557600080fd5b50610499610494366004613e0a565b610df6565b005b3480156104a757600080fd5b506004546104bb906001600160a01b031681565b6040516001600160a01b0390911681526020016103ff565b6104996104e1366004613ec9565b610edd565b3480156104f257600080fd5b506104fb600281565b60405161ffff90911681526020016103ff565b34801561051a57600080fd5b506040805162b9270b60e21b815260016020820152016103ff565b34801561054157600080fd5b506040805160018082526020820152016103ff565b34801561056257600080fd5b506007545b6040519081526020016103ff565b34801561058157600080fd5b506104fb600181565b34801561059657600080fd5b506104996105a5366004613f68565b610f98565b3480156105b657600080fd5b506103f36105c5366004613fb0565b6111f5565b3480156105d657600080fd5b506105676105e5366004613ff1565b6000908152600c602052604090206001015490565b34801561060657600080fd5b5061049961061536600461400a565b61121b565b34801561062657600080fd5b5060125b60405160ff90911681526020016103ff565b34801561064857600080fd5b50610499610657366004614053565b611245565b34801561066857600080fd5b506105677f60387982703d420143663fc92e81a87e17ce20479575276c7c1a05ec5c825ee981565b34801561069c57600080fd5b506105676112a3565b3480156106b157600080fd5b506104996106c036600461400a565b6112b2565b3480156106d157600080fd5b506103f36106e0366004613c2d565b611330565b3480156106f157600080fd5b5061070561070036600461407d565b611352565b6040516103ff91906140c3565b34801561071e57600080fd5b5061049961072d366004613c2d565b6113b9565b34801561073e57600080fd5b5061049961074d366004613ff1565b6113ed565b34801561075e57600080fd5b5061049961076d366004613f68565b6113fa565b34801561077e57600080fd5b50306104bb565b34801561079157600080fd5b5061041d6107a03660046140ec565b6115e1565b3480156107b157600080fd5b506103f36107c0366004614053565b63ffffffff919091166000908152600160205260409020541490565b3480156107e857600080fd5b506104bb7f000000000000000000000000000000000000000000000000000000000000000081565b34801561081c57600080fd5b5061041d61082b366004613ff1565b611686565b34801561083c57600080fd5b5061049961084b36600461411f565b6116b1565b34801561085c57600080fd5b5061056761086b36600461411f565b6001600160a01b031660009081526005602052604090205490565b34801561089257600080fd5b5061049961170e565b3480156108a757600080fd5b506104996108b6366004613c2d565b611722565b3480156108c757600080fd5b506108de6108d6366004614053565b600092915050565b6040516001600160401b0390911681526020016103ff565b34801561090257600080fd5b5061056761091136600461411f565b611737565b34801561092257600080fd5b50600661062a565b34801561093657600080fd5b506000546001600160a01b03166104bb565b34801561095457600080fd5b5061095d611755565b6040516103ff919061413c565b34801561097657600080fd5b506103f361098536600461400a565b61182e565b34801561099657600080fd5b506105676109a536600461419e565b611859565b3480156109b657600080fd5b5061041d6118e9565b3480156109cb57600080fd5b506105677f000000000000000000000000000000000000000000000000000000000000000081565b3480156109ff57600080fd5b5060006103f3565b348015610a1357600080fd5b50610567600081565b348015610a2857600080fd5b506103f3610a37366004613c2d565b6118f8565b348015610a4857600080fd5b506103f3610a57366004613c2d565b61197e565b348015610a6857600080fd5b506002546104bb906001600160a01b031681565b348015610a8857600080fd5b50610499610a9736600461425d565b61198c565b348015610aa857600080fd5b50610567610ab736600461429e565b60016020526000908152604090205481565b348015610ad557600080fd5b5061041d610ae43660046142b9565b611af7565b610499610af736600461425d565b611c72565b610b0f610b0a366004614319565b611e06565b6040516103ff929190614386565b348015610b2957600080fd5b50610499610b3836600461411f565b611f00565b610499610b4b366004613ec9565b611f7f565b348015610b5c57600080fd5b50610499610b6b36600461411f565b611fae565b348015610b7c57600080fd5b50610499610b8b3660046143d8565b612004565b348015610b9c57600080fd5b506105677f9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a681565b348015610bd057600080fd5b50610499610bdf36600461400a565b612168565b348015610bf057600080fd5b50610567610bff36600461444f565b61218d565b348015610c1057600080fd5b50610499610c1f36600461411f565b6121b8565b348015610c3057600080fd5b506103f3610c3f36600461447d565b61222e565b60006001600160e01b03198216637965db0b60e01b1480610c7557506301ffc9a760e01b6001600160e01b03198316145b92915050565b606060088054610c8a90614499565b80601f0160208091040260200160405190810160405280929190818152602001828054610cb690614499565b8015610d035780601f10610cd857610100808354040283529160200191610d03565b820191906000526020600020905b815481529060010190602001808311610ce657829003601f168201915b5050505050905090565b600033610d1b818585612264565b5060019392505050565b60408051808201909152600080825260208201526060610d58604051806040016040528060008152602001600081525090565b60408051808201825260008082526001600160401b03602080840182905284518381529081019094529195509182610db3565b604080518082019091526000815260606020820152815260200190600190039081610d8b5790505b509350600080610dd8604089013560608a0135610dd360208c018c61429e565b612388565b60408051808201909152918252602082015296989597505050505050565b6000610e416040518060800160405280306001600160a01b03168152602001866001600160a01b03168152602001858152602001610e313390565b6001600160a01b03169052611859565b90506000610e4f82846123cc565b9050846001600160a01b0316816001600160a01b031614610ecc5760405162461bcd60e51b815260206004820152602c60248201527f45524332305265776172643a2043616c6c657220646964206e6f74207369676e60448201526b20746865206d65737361676560a01b60648201526084015b60405180910390fd5b610ed68585612442565b5050505050565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03163314610f28576040516391ac5e4f60e01b8152336004820152602401610ec3565b60208701803590610f4290610f3d908a61429e565b612576565b14610f8057610f54602088018861429e565b60405163309afaf360e21b815263ffffffff909116600482015260208801356024820152604401610ec3565b610f8f878787878787876125b2565b50505050505050565b6000610fa381612719565b6000600d805480602002602001604051908101604052809291908181526020016000905b82821015611073578382906000526020600020018054610fe690614499565b80601f016020809104026020016040519081016040528092919081815260200182805461101290614499565b801561105f5780601f106110345761010080835404028352916020019161105f565b820191906000526020600020905b81548152906001019060200180831161104257829003601f168201915b505050505081526020019060010190610fc7565b5050505090506000805b600d54811015611190578460405160200161109891906144cd565b604051602081830303815290604052805190602001208382815181106110c0576110c06144e9565b60200260200101516040516020016110d891906144cd565b604051602081830303815290604052805190602001200361118857600d805461110390600190614515565b81548110611113576111136144e9565b90600052602060002001600d8281548110611130576111306144e9565b906000526020600020019081611146919061458b565b50600d80548061115857611158614661565b6001900381819060005260206000200160006111749190613af5565b90558161118081614677565b925050611190565b60010161107d565b5060008160ff16116111ef5760405162461bcd60e51b815260206004820152602260248201527f526577617264203a20446f6d61696e206973206e6f7420696e20746865206c696044820152611cdd60f21b6064820152608401610ec3565b50505050565b600033611203858285612723565b61120e858585612797565b60019150505b9392505050565b6000828152600c602052604090206001015461123681612719565b6112408383612831565b505050565b61124d6128b7565b63ffffffff8216600081815260016020908152604091829020849055815192835282018390527f238399d427b947898edb290f5ff0f9109849b1c3ba196a42e35f00c50a54b98b91015b60405180910390a15050565b60006112ad612911565b905090565b6001600160a01b03811633146113225760405162461bcd60e51b815260206004820152602f60248201527f416363657373436f6e74726f6c3a2063616e206f6e6c792072656e6f756e636560448201526e103937b632b9903337b91039b2b63360891b6064820152608401610ec3565b61132c8282612a38565b5050565b600033610d1b818585611343838361218d565b61134d9190614696565b612264565b6040805180820190915260008082526020820152600061138260408501356060860135610dd3602088018861429e565b9150506000806113928684612a9f565b90925090506113af6113a7602088018861429e565b838388612bc3565b9695505050505050565b7f9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a66113e381612719565b6112408383612ca4565b6113f73382612442565b50565b600061140581612719565b6000600d805480602002602001604051908101604052809291908181526020016000905b828210156114d557838290600052602060002001805461144890614499565b80601f016020809104026020016040519081016040528092919081815260200182805461147490614499565b80156114c15780601f10611496576101008083540402835291602001916114c1565b820191906000526020600020905b8154815290600101906020018083116114a457829003601f168201915b505050505081526020019060010190611429565b50505050905060005b600d548110156115a457836040516020016114f991906144cd565b60405160208183030381529060405280519060200120828281518110611521576115216144e9565b602002602001015160405160200161153991906144cd565b604051602081830303815290604052805190602001200361159c5760405162461bcd60e51b815260206004820152601d60248201527f526577617264203a20446f6d61696e20616c72656164792061646465640000006044820152606401610ec3565b6001016114de565b50600d80546001810182556000919091527fd7b6990105719101dabeb77144f2a3385c8033acd3af97e9423a695e81ad1eb5016111ef84826146a9565b60036020908152600092835260408084209091529082529020805461160590614499565b80601f016020809104026020016040519081016040528092919081815260200182805461163190614499565b801561167e5780601f106116535761010080835404028352916020019161167e565b820191906000526020600020905b81548152906001019060200180831161166157829003601f168201915b505050505081565b600d818154811061169657600080fd5b90600052602060002001600091509050805461160590614499565b6116b96128b7565b600480546001600160a01b0319166001600160a01b0383169081179091556040519081527ff0be4f1e87349231d80c36b33f9e8639658eeaf474014dee15a3e6a4d4414197906020015b60405180910390a150565b6117166128b7565b6117206000612d65565b565b61172d823383612723565b61132c8282612442565b6001600160a01b0381166000908152600a6020526040812054610c75565b6060600d805480602002602001604051908101604052809291908181526020016000905b8282101561182557838290600052602060002001805461179890614499565b80601f01602080910402602001604051908101604052809291908181526020018280546117c490614499565b80156118115780601f106117e657610100808354040283529160200191611811565b820191906000526020600020905b8154815290600101906020018083116117f457829003601f168201915b505050505081526020019060010190611779565b50505050905090565b6000918252600c602090815260408084206001600160a01b0393909316845291905290205460ff1690565b6000610c757f60387982703d420143663fc92e81a87e17ce20479575276c7c1a05ec5c825ee983600001518460200151856040015186606001516040516020016118ce9594939291909485526001600160a01b0393841660208601529183166040850152606084015216608082015260a00190565b60405160208183030381529060405280519060200120612db5565b606060098054610c8a90614499565b60003381611906828661218d565b9050838110156119665760405162461bcd60e51b815260206004820152602560248201527f45524332303a2064656372656173656420616c6c6f77616e63652062656c6f77604482015264207a65726f60d81b6064820152608401610ec3565b6119738286868403612264565b506001949350505050565b600033610d1b818585612797565b6119946128b7565b60005b81811015611ac5576119d98383838181106119b4576119b46144e9565b90506020028101906119c6919061475a565b6119d4906040810190614770565b612e03565b8282828181106119eb576119eb6144e9565b90506020028101906119fd919061475a565b611a0b906040810190614770565b60036000868686818110611a2157611a216144e9565b9050602002810190611a33919061475a565b611a4190602081019061429e565b63ffffffff1663ffffffff1681526020019081526020016000206000868686818110611a6f57611a6f6144e9565b9050602002810190611a81919061475a565b611a929060408101906020016147b6565b61ffff168152602081019190915260400160002091611ab29190836147d1565b5080611abd8161488a565b915050611997565b507fbe4864a8e820971c0247f5992e2da559595f7bf076a21cb5928d443d2a13b67482826040516112979291906148cc565b63ffffffff8416600090815260036020908152604080832061ffff87168452909152812080546060929190611b2b90614499565b80601f0160208091040260200160405190810160405280929190818152602001828054611b5790614499565b8015611ba45780601f10611b7957610100808354040283529160200191611ba4565b820191906000526020600020905b815481529060010190602001808311611b8757829003601f168201915b505050505090508051600003611bf45783838080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250929450611c6a9350505050565b6000839003611c04579050611c6a565b60028310611c4d57611c168484612e03565b80611c2484600281886149b0565b604051602001611c36939291906149da565b604051602081830303815290604052915050611c6a565b8383604051639a6d49cd60e01b8152600401610ec3929190614a02565b949350505050565b60005b81811015611d855736838383818110611c9057611c906144e9565b9050602002810190611ca29190614a16565b9050611cd5611cb4602083018361429e565b602083013563ffffffff919091166000908152600160205260409020541490565b611cdf5750611d73565b3063d045a0dc60c08301358360a0810135611cfe610100830183614770565b611d0f610100890160e08a0161411f565b611d1d6101208a018a614770565b6040518963ffffffff1660e01b8152600401611d3f9796959493929190614a42565b6000604051808303818588803b158015611d5857600080fd5b505af1158015611d6c573d6000803e3d6000fd5b5050505050505b80611d7d8161488a565b915050611c75565b50336001600160a01b0316638e9e70996040518163ffffffff1660e01b8152600401600060405180830381865afa158015611dc4573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f19168201604052611dec9190810190614ac8565b604051638351eea760e01b8152600401610ec39190613c05565b611e0e613b2f565b6040805180820190915260008082526020820152600080611e4460408801356060890135611e3f60208b018b61429e565b612e45565b91509150600080611e558984612a9f565b9092509050611e81611e6a60208b018b61429e565b8383611e7b368d90038d018d614b35565b8b612e62565b60408051808201909152858152602080820186905282519298509096503391907f85496b760a4b7f8d66384b9df21b381f5d1b1e79f229a47aaf4c232edc2fe59a90611ecf908d018d61429e565b6040805163ffffffff909216825260208201899052810187905260600160405180910390a350505050935093915050565b611f086128b7565b60405163ca5eb5e160e01b81526001600160a01b0382811660048301527f0000000000000000000000000000000000000000000000000000000000000000169063ca5eb5e190602401600060405180830381600087803b158015611f6b57600080fd5b505af1158015610ed6573d6000803e3d6000fd5b333014611f9f5760405163029a949d60e31b815260040160405180910390fd5b610f8f87878787878787610f80565b611fb66128b7565b600280546001600160a01b0319166001600160a01b0383169081179091556040519081527fd48d879cef83a1c0bdda516f27b13ddb1b3f8bbac1c9e1511bb2a659c242776090602001611703565b834211156120545760405162461bcd60e51b815260206004820152601d60248201527f45524332305065726d69743a206578706972656420646561646c696e650000006044820152606401610ec3565b60007f6e71edae12b1b97f4d1f60370fef10105fa2faae0126114a169c64845d6126c98888886120838c612f6d565b6040805160208101969096526001600160a01b0394851690860152929091166060840152608083015260a082015260c0810186905260e00160405160208183030381529060405280519060200120905060006120de82612db5565b905060006120ee82878787612f95565b9050896001600160a01b0316816001600160a01b0316146121515760405162461bcd60e51b815260206004820152601e60248201527f45524332305065726d69743a20696e76616c6964207369676e617475726500006044820152606401610ec3565b61215c8a8a8a612264565b50505050505050505050565b6000828152600c602052604090206001015461218381612719565b6112408383612a38565b6001600160a01b03918216600090815260066020908152604080832093909416825291909152205490565b6121c06128b7565b6001600160a01b0381166122255760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b6064820152608401610ec3565b6113f781612d65565b6000602082018035906001908390612246908661429e565b63ffffffff1681526020810191909152604001600020541492915050565b6001600160a01b0383166122c65760405162461bcd60e51b8152602060048201526024808201527f45524332303a20617070726f76652066726f6d20746865207a65726f206164646044820152637265737360e01b6064820152608401610ec3565b6001600160a01b0382166123275760405162461bcd60e51b815260206004820152602260248201527f45524332303a20617070726f766520746f20746865207a65726f206164647265604482015261737360f01b6064820152608401610ec3565b6001600160a01b0383811660008181526006602090815260408083209487168084529482529182902085905590518481527f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925910160405180910390a3505050565b60008061239485612fbd565b9150819050838110156123c4576040516371c4efed60e01b81526004810182905260248101859052604401610ec3565b935093915050565b6000806123d98484612ff4565b90506001600160a01b0381166112145760405162461bcd60e51b815260206004820152602860248201527f45524332305265776172643a205369676e65722063616e6e6f7420626520302060448201526730b2323932b9b99760c11b6064820152608401610ec3565b6001600160a01b0382166124a25760405162461bcd60e51b815260206004820152602160248201527f45524332303a206275726e2066726f6d20746865207a65726f206164647265736044820152607360f81b6064820152608401610ec3565b6001600160a01b038216600090815260056020526040902054818110156125165760405162461bcd60e51b815260206004820152602260248201527f45524332303a206275726e20616d6f756e7420657863656564732062616c616e604482015261636560f01b6064820152608401610ec3565b6001600160a01b03831660008181526005602090815260408083208686039055600780548790039055518581529192917fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef910160405180910390a3505050565b63ffffffff811660009081526001602052604081205480610c755760405163f6ff4fb760e01b815263ffffffff84166004820152602401610ec3565b60006125c46125c18787613018565b90565b905060006125f0826125de6125d98a8a613030565b613053565b6125eb60208d018d61429e565b613088565b905060288611156126b757600061262d61261060608c0160408d01614b67565b61261d60208d018d61429e565b846126288c8c61309c565b6130e7565b604051633e5ac80960e11b81529091506001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001690637cb59012906126839086908d906000908790600401614b84565b600060405180830381600087803b15801561269d57600080fd5b505af11580156126b1573d6000803e3d6000fd5b50505050505b6001600160a01b038216887fefed6d3500546b29533b128a29e3a94d70788727f0507505ac12eaf2e578fd9c6126f060208d018d61429e565b6040805163ffffffff9092168252602082018690520160405180910390a3505050505050505050565b6113f78133613119565b600061272f848461218d565b905060001981146111ef578181101561278a5760405162461bcd60e51b815260206004820152601d60248201527f45524332303a20696e73756666696369656e7420616c6c6f77616e63650000006044820152606401610ec3565b6111ef8484848403612264565b6001600160a01b03831615806127b457506001600160a01b038216155b6128265760405162461bcd60e51b815260206004820152603960248201527f45524332305265776172643a20546f6b656e73206f6e207468697320636f6e7460448201527f7261637420617265206e6f6e2d7472616e7366657261626c65000000000000006064820152608401610ec3565b611240838383613172565b61283b828261182e565b61132c576000828152600c602090815260408083206001600160a01b03851684529091529020805460ff191660011790556128733390565b6001600160a01b0316816001600160a01b0316837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45050565b6000546001600160a01b031633146117205760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152606401610ec3565b6000306001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001614801561296a57507f000000000000000000000000000000000000000000000000000000000000000046145b1561299457507f000000000000000000000000000000000000000000000000000000000000000090565b50604080517f00000000000000000000000000000000000000000000000000000000000000006020808301919091527f0000000000000000000000000000000000000000000000000000000000000000828401527f000000000000000000000000000000000000000000000000000000000000000060608301524660808301523060a0808401919091528351808403909101815260c0909201909252805191012090565b612a42828261182e565b1561132c576000828152600c602090815260408083206001600160a01b0385168085529252808320805460ff1916905551339285917ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b9190a45050565b6060806000612afc8560200135612ab58661331d565b612ac260a0890189614770565b8080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525061334992505050565b9093509050600081612b0f576001612b12565b60025b9050612b32612b24602088018861429e565b82610ae460808a018a614770565b6004549093506001600160a01b031615612bba576004805460405163043a78eb60e01b81526001600160a01b039091169163043a78eb91612b77918891889101614bb5565b602060405180830381865afa158015612b94573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190612bb89190614bda565b505b50509250929050565b60408051808201909152600080825260208201527f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031663ddc28c586040518060a001604052808863ffffffff168152602001612c2689612576565b8152602001878152602001868152602001851515815250306040518363ffffffff1660e01b8152600401612c5b929190614bf7565b6040805180830381865afa158015612c77573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190612c9b9190614ca0565b95945050505050565b6001600160a01b038216612cfa5760405162461bcd60e51b815260206004820152601f60248201527f45524332303a206d696e7420746f20746865207a65726f2061646472657373006044820152606401610ec3565b8060076000828254612d0c9190614696565b90915550506001600160a01b0382166000818152600560209081526040808320805486019055518481527fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef910160405180910390a35050565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b6000610c75612dc2612911565b8360405161190160f01b6020820152602281018390526042810182905260009060620160405160208183030381529060405280519060200120905092915050565b6000612e1260028284866149b0565b612e1b91614cbc565b60f01c905060038114611240578282604051639a6d49cd60e01b8152600401610ec3929190614a02565b600080612e53858585612388565b90925090506123c43383612442565b612e6a613b2f565b6000612e7984600001516133c3565b602085015190915015612e9357612e9384602001516133eb565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316632637a450826040518060a001604052808b63ffffffff168152602001612ee38c612576565b81526020018a815260200189815260200160008960200151111515815250866040518463ffffffff1660e01b8152600401612f1f929190614bf7565b60806040518083038185885af1158015612f3d573d6000803e3d6000fd5b50505050506040513d601f19601f82011682018060405250810190612f629190614cec565b979650505050505050565b6001600160a01b0381166000908152600a602052604090208054600181018255905b50919050565b6000806000612fa6878787876134cd565b91509150612fb381613591565b5095945050505050565b60007f0000000000000000000000000000000000000000000000000000000000000000612fea8184614d53565b610c759190614d75565b600080600061300385856136db565b9150915061301081613591565b509392505050565b600061302760208284866149b0565b61121491614d8c565b60006130406028602084866149b0565b61304991614daa565b60c01c9392505050565b6000610c757f00000000000000000000000000000000000000000000000000000000000000006001600160401b038416614d75565b60006130948484612ca4565b509092915050565b60606130ab82602881866149b0565b8080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250929695505050505050565b6060848484846040516020016131009493929190614dd8565b6040516020818303038152906040529050949350505050565b613123828261182e565b61132c5761313081613720565b61313b836020613732565b60405160200161314c929190614e27565b60408051601f198184030181529082905262461bcd60e51b8252610ec391600401613c05565b6001600160a01b0383166131d65760405162461bcd60e51b815260206004820152602560248201527f45524332303a207472616e736665722066726f6d20746865207a65726f206164604482015264647265737360d81b6064820152608401610ec3565b6001600160a01b0382166132385760405162461bcd60e51b815260206004820152602360248201527f45524332303a207472616e7366657220746f20746865207a65726f206164647260448201526265737360e81b6064820152608401610ec3565b6001600160a01b038316600090815260056020526040902054818110156132b05760405162461bcd60e51b815260206004820152602660248201527f45524332303a207472616e7366657220616d6f756e7420657863656564732062604482015265616c616e636560d01b6064820152608401610ec3565b6001600160a01b0380851660008181526005602052604080822086860390559286168082529083902080548601905591517fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef906133109086815260200190565b60405180910390a36111ef565b6000610c757f000000000000000000000000000000000000000000000000000000000000000083614d53565b805160609015158061339257848460405160200161337e92919091825260c01b6001600160c01b031916602082015260280190565b6040516020818303038152906040526133b9565b848433856040516020016133a99493929190614e9c565b6040516020818303038152906040525b9150935093915050565b60008134146133e7576040516304fb820960e51b8152346004820152602401610ec3565b5090565b60007f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031663e4fe1d946040518163ffffffff1660e01b8152600401602060405180830381865afa15801561344b573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061346f9190614edf565b90506001600160a01b038116613498576040516329b99a9560e11b815260040160405180910390fd5b61132c6001600160a01b038216337f0000000000000000000000000000000000000000000000000000000000000000856138cd565b6000807f7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a08311156135045750600090506003613588565b6040805160008082526020820180845289905260ff881692820192909252606081018690526080810185905260019060a0016020604051602081039080840390855afa158015613558573d6000803e3d6000fd5b5050604051601f1901519150506001600160a01b03811661358157600060019250925050613588565b9150600090505b94509492505050565b60008160048111156135a5576135a5614efc565b036135ad5750565b60018160048111156135c1576135c1614efc565b0361360e5760405162461bcd60e51b815260206004820152601860248201527f45434453413a20696e76616c6964207369676e617475726500000000000000006044820152606401610ec3565b600281600481111561362257613622614efc565b0361366f5760405162461bcd60e51b815260206004820152601f60248201527f45434453413a20696e76616c6964207369676e6174757265206c656e677468006044820152606401610ec3565b600381600481111561368357613683614efc565b036113f75760405162461bcd60e51b815260206004820152602260248201527f45434453413a20696e76616c6964207369676e6174757265202773272076616c604482015261756560f01b6064820152608401610ec3565b60008082516041036137115760208301516040840151606085015160001a613705878285856134cd565b94509450505050613719565b506000905060025b9250929050565b6060610c756001600160a01b03831660145b60606000613741836002614d75565b61374c906002614696565b6001600160401b0381111561376357613763613d37565b6040519080825280601f01601f19166020018201604052801561378d576020820181803683370190505b509050600360fc1b816000815181106137a8576137a86144e9565b60200101906001600160f81b031916908160001a905350600f60fb1b816001815181106137d7576137d76144e9565b60200101906001600160f81b031916908160001a90535060006137fb846002614d75565b613806906001614696565b90505b600181111561387e576f181899199a1a9b1b9c1cb0b131b232b360811b85600f166010811061383a5761383a6144e9565b1a60f81b828281518110613850576138506144e9565b60200101906001600160f81b031916908160001a90535060049490941c9361387781614f12565b9050613809565b5083156112145760405162461bcd60e51b815260206004820181905260248201527f537472696e67733a20686578206c656e67746820696e73756666696369656e746044820152606401610ec3565b604080516001600160a01b038581166024830152848116604483015260648083018590528351808403909101815260849092018352602080830180516001600160e01b03166323b872dd60e01b17905283518085019094528084527f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c6564908401526111ef928792916000916139659185169084906139e2565b80519091501561124057808060200190518101906139839190614bda565b6112405760405162461bcd60e51b815260206004820152602a60248201527f5361666545524332303a204552433230206f7065726174696f6e20646964206e6044820152691bdd081cdd58d8d9595960b21b6064820152608401610ec3565b6060611c6a848460008585600080866001600160a01b03168587604051613a0991906144cd565b60006040518083038185875af1925050503d8060008114613a46576040519150601f19603f3d011682016040523d82523d6000602084013e613a4b565b606091505b5091509150612f628783838760608315613ac6578251600003613abf576001600160a01b0385163b613abf5760405162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e74726163740000006044820152606401610ec3565b5081611c6a565b611c6a8383815115613adb5781518083602001fd5b8060405162461bcd60e51b8152600401610ec39190613c05565b508054613b0190614499565b6000825580601f10613b11575050565b601f0160209004906000526020600020908101906113f79190613b76565b60405180606001604052806000801916815260200160006001600160401b03168152602001613b71604051806040016040528060008152602001600081525090565b905290565b5b808211156133e75760008155600101613b77565b600060208284031215613b9d57600080fd5b81356001600160e01b03198116811461121457600080fd5b60005b83811015613bd0578181015183820152602001613bb8565b50506000910152565b60008151808452613bf1816020860160208601613bb5565b601f01601f19169290920160200192915050565b6020815260006112146020830184613bd9565b6001600160a01b03811681146113f757600080fd5b60008060408385031215613c4057600080fd5b8235613c4b81613c18565b946020939093013593505050565b600060e08284031215612f8f57600080fd5b600060208284031215613c7d57600080fd5b81356001600160401b03811115613c9357600080fd5b611c6a84828501613c59565b8351815260208085015190820152600060a08201604060a08185015281865180845260c08601915060c08160051b8701019350602080890160005b83811015613d195788870360bf19018552815180518852830151838801879052613d0687890182613bd9565b9750509382019390820190600101613cda565b50508751606088015250505060208501516080850152509050611c6a565b634e487b7160e01b600052604160045260246000fd5b604080519081016001600160401b0381118282101715613d6f57613d6f613d37565b60405290565b604051601f8201601f191681016001600160401b0381118282101715613d9d57613d9d613d37565b604052919050565b60006001600160401b03821115613dbe57613dbe613d37565b50601f01601f191660200190565b6000613ddf613dda84613da5565b613d75565b9050828152838383011115613df357600080fd5b828260208301376000602084830101529392505050565b600080600060608486031215613e1f57600080fd5b8335613e2a81613c18565b92506020840135915060408401356001600160401b03811115613e4c57600080fd5b8401601f81018613613e5d57600080fd5b613e6c86823560208401613dcc565b9150509250925092565b600060608284031215612f8f57600080fd5b60008083601f840112613e9a57600080fd5b5081356001600160401b03811115613eb157600080fd5b60208301915083602082850101111561371957600080fd5b600080600080600080600060e0888a031215613ee457600080fd5b613eee8989613e76565b96506060880135955060808801356001600160401b0380821115613f1157600080fd5b613f1d8b838c01613e88565b909750955060a08a01359150613f3282613c18565b90935060c08901359080821115613f4857600080fd5b50613f558a828b01613e88565b989b979a50959850939692959293505050565b600060208284031215613f7a57600080fd5b81356001600160401b03811115613f9057600080fd5b8201601f81018413613fa157600080fd5b611c6a84823560208401613dcc565b600080600060608486031215613fc557600080fd5b8335613fd081613c18565b92506020840135613fe081613c18565b929592945050506040919091013590565b60006020828403121561400357600080fd5b5035919050565b6000806040838503121561401d57600080fd5b82359150602083013561402f81613c18565b809150509250929050565b803563ffffffff8116811461404e57600080fd5b919050565b6000806040838503121561406657600080fd5b613c4b8361403a565b80151581146113f757600080fd5b6000806040838503121561409057600080fd5b82356001600160401b038111156140a657600080fd5b6140b285828601613c59565b925050602083013561402f8161406f565b815181526020808301519082015260408101610c75565b803561ffff8116811461404e57600080fd5b600080604083850312156140ff57600080fd5b6141088361403a565b9150614116602084016140da565b90509250929050565b60006020828403121561413157600080fd5b813561121481613c18565b6000602080830181845280855180835260408601915060408160051b870101925083870160005b8281101561419157603f1988860301845261417f858351613bd9565b94509285019290850190600101614163565b5092979650505050505050565b6000608082840312156141b057600080fd5b604051608081018181106001600160401b03821117156141d2576141d2613d37565b60405282356141e081613c18565b815260208301356141f081613c18565b602082015260408381013590820152606083013561420d81613c18565b60608201529392505050565b60008083601f84011261422b57600080fd5b5081356001600160401b0381111561424257600080fd5b6020830191508360208260051b850101111561371957600080fd5b6000806020838503121561427057600080fd5b82356001600160401b0381111561428657600080fd5b61429285828601614219565b90969095509350505050565b6000602082840312156142b057600080fd5b6112148261403a565b600080600080606085870312156142cf57600080fd5b6142d88561403a565b93506142e6602086016140da565b925060408501356001600160401b0381111561430157600080fd5b61430d87828801613e88565b95989497509550505050565b6000806000838503608081121561432f57600080fd5b84356001600160401b0381111561434557600080fd5b61435187828801613c59565b9450506040601f198201121561436657600080fd5b50602084019150606084013561437b81613c18565b809150509250925092565b600060c082019050835182526001600160401b03602085015116602083015260408401516143c1604084018280518252602090810151910152565b5082516080830152602083015160a0830152611214565b600080600080600080600060e0888a0312156143f357600080fd5b87356143fe81613c18565b9650602088013561440e81613c18565b95506040880135945060608801359350608088013560ff8116811461443257600080fd5b9699959850939692959460a0840135945060c09093013592915050565b6000806040838503121561446257600080fd5b823561446d81613c18565b9150602083013561402f81613c18565b60006060828403121561448f57600080fd5b6112148383613e76565b600181811c908216806144ad57607f821691505b602082108103612f8f57634e487b7160e01b600052602260045260246000fd5b600082516144df818460208701613bb5565b9190910192915050565b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052601160045260246000fd5b81810381811115610c7557610c756144ff565b601f82111561124057600081815260208120601f850160051c8101602086101561454f5750805b601f850160051c820191505b8181101561456e5782815560010161455b565b505050505050565b600019600383901b1c191660019190911b1790565b818103614596575050565b6145a08254614499565b6001600160401b038111156145b7576145b7613d37565b6145cb816145c58454614499565b84614528565b6000601f8211600181146145f957600083156145e75750848201545b6145f18482614576565b855550610ed6565b600085815260209020601f19841690600086815260209020845b838110156146335782860154825560019586019590910190602001614613565b50858310156146515781850154600019600388901b60f8161c191681555b5050505050600190811b01905550565b634e487b7160e01b600052603160045260246000fd5b600060ff821660ff810361468d5761468d6144ff565b60010192915050565b80820180821115610c7557610c756144ff565b81516001600160401b038111156146c2576146c2613d37565b6146d0816145c58454614499565b602080601f8311600181146146ff57600084156146ed5750858301515b6146f78582614576565b86555061456e565b600085815260208120601f198616915b8281101561472e5788860151825594840194600190910190840161470f565b508582101561465157939096015160001960f8600387901b161c19169092555050600190811b01905550565b60008235605e198336030181126144df57600080fd5b6000808335601e1984360301811261478757600080fd5b8301803591506001600160401b038211156147a157600080fd5b60200191503681900382131561371957600080fd5b6000602082840312156147c857600080fd5b611214826140da565b6001600160401b038311156147e8576147e8613d37565b6147fc836147f68354614499565b83614528565b6000601f84116001811461482a57600085156148185750838201355b6148228682614576565b845550610ed6565b600083815260209020601f19861690835b8281101561485b578685013582556020948501946001909201910161483b565b50868210156148785760001960f88860031b161c19848701351681555b505060018560011b0183555050505050565b60006001820161489c5761489c6144ff565b5060010190565b81835281816020850137506000828201602090810191909152601f909101601f19169091010190565b60208082528181018390526000906040808401600586901b8501820187855b888110156149a257878303603f190184528135368b9003605e1901811261491157600080fd5b8a01606063ffffffff6149238361403a565b16855261ffff6149348984016140da565b168886015286820135601e1983360301811261494f57600080fd5b9091018781019190356001600160401b0381111561496c57600080fd5b80360383131561497b57600080fd5b818887015261498d82870182856148a3565b968901969550505091860191506001016148eb565b509098975050505050505050565b600080858511156149c057600080fd5b838611156149cd57600080fd5b5050820193919092039150565b600084516149ec818460208901613bb5565b8201838582376000930192835250909392505050565b602081526000611c6a6020830184866148a3565b6000823561013e198336030181126144df57600080fd5b6001600160401b03811681146113f757600080fd5b63ffffffff614a508961403a565b1681526020880135602082015260006040890135614a6d81614a2d565b6001600160401b03811660408401525087606083015260e06080830152614a9860e0830187896148a3565b6001600160a01b03861660a084015282810360c0840152614aba8185876148a3565b9a9950505050505050505050565b600060208284031215614ada57600080fd5b81516001600160401b03811115614af057600080fd5b8201601f81018413614b0157600080fd5b8051614b0f613dda82613da5565b818152856020838501011115614b2457600080fd5b612c9b826020830160208601613bb5565b600060408284031215614b4757600080fd5b614b4f613d4d565b82358152602083013560208201528091505092915050565b600060208284031215614b7957600080fd5b813561121481614a2d565b60018060a01b038516815283602082015261ffff831660408201526080606082015260006113af6080830184613bd9565b604081526000614bc86040830185613bd9565b8281036020840152612c9b8185613bd9565b600060208284031215614bec57600080fd5b81516112148161406f565b6040815263ffffffff8351166040820152602083015160608201526000604084015160a06080840152614c2d60e0840182613bd9565b90506060850151603f198483030160a0850152614c4a8282613bd9565b60809690960151151560c08501525050506001600160a01b039190911660209091015290565b600060408284031215614c8257600080fd5b614c8a613d4d565b9050815181526020820151602082015292915050565b600060408284031215614cb257600080fd5b6112148383614c70565b6001600160f01b03198135818116916002851015614ce45780818660020360031b1b83161692505b505092915050565b600060808284031215614cfe57600080fd5b604051606081018181106001600160401b0382111715614d2057614d20613d37565b604052825181526020830151614d3581614a2d565b6020820152614d478460408501614c70565b60408201529392505050565b600082614d7057634e487b7160e01b600052601260045260246000fd5b500490565b8082028115828204841417610c7557610c756144ff565b80356020831015610c7557600019602084900360031b1b1692915050565b6001600160c01b03198135818116916008851015614ce45760089490940360031b84901b1690921692915050565b6001600160401b0360c01b8560c01b16815263ffffffff60e01b8460e01b16600882015282600c82015260008251614e1781602c850160208701613bb5565b91909101602c0195945050505050565b7f416363657373436f6e74726f6c3a206163636f756e7420000000000000000000815260008351614e5f816017850160208801613bb5565b7001034b99036b4b9b9b4b733903937b6329607d1b6017918401918201528351614e90816028840160208801613bb5565b01602801949350505050565b8481526001600160401b0360c01b8460c01b16602082015282602882015260008251614ecf816048850160208701613bb5565b9190910160480195945050505050565b600060208284031215614ef157600080fd5b815161121481613c18565b634e487b7160e01b600052602160045260246000fd5b600081614f2157614f216144ff565b50600019019056fea264697066735822122097d57303fa082c9f52ce768e87986ba812ac95e4d38de17e6e20bf91b2faaafb64736f6c63430008140033",
  deployedBytecode:
    "0x6080604052600436106103ce5760003560e01c806370a08231116101fd578063b731ea0a11610118578063d045a0dc116100ab578063d547741f1161007a578063d547741f14610bc4578063dd62ed3e14610be4578063f2fde38b14610c04578063fc0c546a14610772578063ff7bd03d14610c2457600080fd5b8063d045a0dc14610b3d578063d424388514610b50578063d505accf14610b70578063d539139314610b9057600080fd5b8063bc70b354116100e7578063bc70b35414610ac9578063bd815db014610ae9578063c7c7f5b314610afc578063ca5eb5e114610b1d57600080fd5b8063b731ea0a14610a5c578063b92d0eff14610772578063b98bd07014610a7c578063bb0b6a5314610a9c57600080fd5b806391d14854116101905780639f68b9641161015f5780639f68b964146109f3578063a217fddf14610a07578063a457c2d714610a1c578063a9059cbb14610a3c57600080fd5b806391d148541461096a57806392a913241461098a57806395d89b41146109aa578063963efcaa146109bf57600080fd5b80637ecebe00116101cc5780637ecebe00146108f6578063857749b0146109165780638da5cb5b1461092a5780639101cc651461094857600080fd5b806370a0823114610850578063715018a61461088657806379cc67901461089b5780637d25a05e146108bb57600080fd5b8063313ce567116102ed57806342966c68116102805780635a0dfe4d1161024f5780635a0dfe4d146107a55780635e280f11146107dc57806366cf8fab146108105780636fc1b31e1461083057600080fd5b806342966c681461073257806344e2e74c1461075257806352ae2879146107725780635535d4611461078557600080fd5b806336568abe116102bc57806336568abe146106a557806339509351146106c55780633b6f743b146106e557806340c10f191461071257600080fd5b8063313ce5671461061a5780633400288b1461063c57806335dfc2271461065c5780633644e5151461069057600080fd5b8063156a0d0f116103655780632277892911610334578063227789291461058a57806323b872dd146105aa578063248a9ca3146105ca5780632f2ff15d146105fa57600080fd5b8063156a0d0f1461050e57806317442b701461053557806318160ddd146105565780631f5e13341461057557600080fd5b806310badf4e116103a157806310badf4e14610479578063111ecdad1461049b57806313137d65146104d3578063134d4f25146104e657600080fd5b806301ffc9a7146103d357806306fdde0314610408578063095ea7b31461042a5780630d35b4151461044a575b600080fd5b3480156103df57600080fd5b506103f36103ee366004613b8b565b610c44565b60405190151581526020015b60405180910390f35b34801561041457600080fd5b5061041d610c7b565b6040516103ff9190613c05565b34801561043657600080fd5b506103f3610445366004613c2d565b610d0d565b34801561045657600080fd5b5061046a610465366004613c6b565b610d25565b6040516103ff93929190613c9f565b34801561048557600080fd5b50610499610494366004613e0a565b610df6565b005b3480156104a757600080fd5b506004546104bb906001600160a01b031681565b6040516001600160a01b0390911681526020016103ff565b6104996104e1366004613ec9565b610edd565b3480156104f257600080fd5b506104fb600281565b60405161ffff90911681526020016103ff565b34801561051a57600080fd5b506040805162b9270b60e21b815260016020820152016103ff565b34801561054157600080fd5b506040805160018082526020820152016103ff565b34801561056257600080fd5b506007545b6040519081526020016103ff565b34801561058157600080fd5b506104fb600181565b34801561059657600080fd5b506104996105a5366004613f68565b610f98565b3480156105b657600080fd5b506103f36105c5366004613fb0565b6111f5565b3480156105d657600080fd5b506105676105e5366004613ff1565b6000908152600c602052604090206001015490565b34801561060657600080fd5b5061049961061536600461400a565b61121b565b34801561062657600080fd5b5060125b60405160ff90911681526020016103ff565b34801561064857600080fd5b50610499610657366004614053565b611245565b34801561066857600080fd5b506105677f60387982703d420143663fc92e81a87e17ce20479575276c7c1a05ec5c825ee981565b34801561069c57600080fd5b506105676112a3565b3480156106b157600080fd5b506104996106c036600461400a565b6112b2565b3480156106d157600080fd5b506103f36106e0366004613c2d565b611330565b3480156106f157600080fd5b5061070561070036600461407d565b611352565b6040516103ff91906140c3565b34801561071e57600080fd5b5061049961072d366004613c2d565b6113b9565b34801561073e57600080fd5b5061049961074d366004613ff1565b6113ed565b34801561075e57600080fd5b5061049961076d366004613f68565b6113fa565b34801561077e57600080fd5b50306104bb565b34801561079157600080fd5b5061041d6107a03660046140ec565b6115e1565b3480156107b157600080fd5b506103f36107c0366004614053565b63ffffffff919091166000908152600160205260409020541490565b3480156107e857600080fd5b506104bb7f000000000000000000000000000000000000000000000000000000000000000081565b34801561081c57600080fd5b5061041d61082b366004613ff1565b611686565b34801561083c57600080fd5b5061049961084b36600461411f565b6116b1565b34801561085c57600080fd5b5061056761086b36600461411f565b6001600160a01b031660009081526005602052604090205490565b34801561089257600080fd5b5061049961170e565b3480156108a757600080fd5b506104996108b6366004613c2d565b611722565b3480156108c757600080fd5b506108de6108d6366004614053565b600092915050565b6040516001600160401b0390911681526020016103ff565b34801561090257600080fd5b5061056761091136600461411f565b611737565b34801561092257600080fd5b50600661062a565b34801561093657600080fd5b506000546001600160a01b03166104bb565b34801561095457600080fd5b5061095d611755565b6040516103ff919061413c565b34801561097657600080fd5b506103f361098536600461400a565b61182e565b34801561099657600080fd5b506105676109a536600461419e565b611859565b3480156109b657600080fd5b5061041d6118e9565b3480156109cb57600080fd5b506105677f000000000000000000000000000000000000000000000000000000000000000081565b3480156109ff57600080fd5b5060006103f3565b348015610a1357600080fd5b50610567600081565b348015610a2857600080fd5b506103f3610a37366004613c2d565b6118f8565b348015610a4857600080fd5b506103f3610a57366004613c2d565b61197e565b348015610a6857600080fd5b506002546104bb906001600160a01b031681565b348015610a8857600080fd5b50610499610a9736600461425d565b61198c565b348015610aa857600080fd5b50610567610ab736600461429e565b60016020526000908152604090205481565b348015610ad557600080fd5b5061041d610ae43660046142b9565b611af7565b610499610af736600461425d565b611c72565b610b0f610b0a366004614319565b611e06565b6040516103ff929190614386565b348015610b2957600080fd5b50610499610b3836600461411f565b611f00565b610499610b4b366004613ec9565b611f7f565b348015610b5c57600080fd5b50610499610b6b36600461411f565b611fae565b348015610b7c57600080fd5b50610499610b8b3660046143d8565b612004565b348015610b9c57600080fd5b506105677f9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a681565b348015610bd057600080fd5b50610499610bdf36600461400a565b612168565b348015610bf057600080fd5b50610567610bff36600461444f565b61218d565b348015610c1057600080fd5b50610499610c1f36600461411f565b6121b8565b348015610c3057600080fd5b506103f3610c3f36600461447d565b61222e565b60006001600160e01b03198216637965db0b60e01b1480610c7557506301ffc9a760e01b6001600160e01b03198316145b92915050565b606060088054610c8a90614499565b80601f0160208091040260200160405190810160405280929190818152602001828054610cb690614499565b8015610d035780601f10610cd857610100808354040283529160200191610d03565b820191906000526020600020905b815481529060010190602001808311610ce657829003601f168201915b5050505050905090565b600033610d1b818585612264565b5060019392505050565b60408051808201909152600080825260208201526060610d58604051806040016040528060008152602001600081525090565b60408051808201825260008082526001600160401b03602080840182905284518381529081019094529195509182610db3565b604080518082019091526000815260606020820152815260200190600190039081610d8b5790505b509350600080610dd8604089013560608a0135610dd360208c018c61429e565b612388565b60408051808201909152918252602082015296989597505050505050565b6000610e416040518060800160405280306001600160a01b03168152602001866001600160a01b03168152602001858152602001610e313390565b6001600160a01b03169052611859565b90506000610e4f82846123cc565b9050846001600160a01b0316816001600160a01b031614610ecc5760405162461bcd60e51b815260206004820152602c60248201527f45524332305265776172643a2043616c6c657220646964206e6f74207369676e60448201526b20746865206d65737361676560a01b60648201526084015b60405180910390fd5b610ed68585612442565b5050505050565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03163314610f28576040516391ac5e4f60e01b8152336004820152602401610ec3565b60208701803590610f4290610f3d908a61429e565b612576565b14610f8057610f54602088018861429e565b60405163309afaf360e21b815263ffffffff909116600482015260208801356024820152604401610ec3565b610f8f878787878787876125b2565b50505050505050565b6000610fa381612719565b6000600d805480602002602001604051908101604052809291908181526020016000905b82821015611073578382906000526020600020018054610fe690614499565b80601f016020809104026020016040519081016040528092919081815260200182805461101290614499565b801561105f5780601f106110345761010080835404028352916020019161105f565b820191906000526020600020905b81548152906001019060200180831161104257829003601f168201915b505050505081526020019060010190610fc7565b5050505090506000805b600d54811015611190578460405160200161109891906144cd565b604051602081830303815290604052805190602001208382815181106110c0576110c06144e9565b60200260200101516040516020016110d891906144cd565b604051602081830303815290604052805190602001200361118857600d805461110390600190614515565b81548110611113576111136144e9565b90600052602060002001600d8281548110611130576111306144e9565b906000526020600020019081611146919061458b565b50600d80548061115857611158614661565b6001900381819060005260206000200160006111749190613af5565b90558161118081614677565b925050611190565b60010161107d565b5060008160ff16116111ef5760405162461bcd60e51b815260206004820152602260248201527f526577617264203a20446f6d61696e206973206e6f7420696e20746865206c696044820152611cdd60f21b6064820152608401610ec3565b50505050565b600033611203858285612723565b61120e858585612797565b60019150505b9392505050565b6000828152600c602052604090206001015461123681612719565b6112408383612831565b505050565b61124d6128b7565b63ffffffff8216600081815260016020908152604091829020849055815192835282018390527f238399d427b947898edb290f5ff0f9109849b1c3ba196a42e35f00c50a54b98b91015b60405180910390a15050565b60006112ad612911565b905090565b6001600160a01b03811633146113225760405162461bcd60e51b815260206004820152602f60248201527f416363657373436f6e74726f6c3a2063616e206f6e6c792072656e6f756e636560448201526e103937b632b9903337b91039b2b63360891b6064820152608401610ec3565b61132c8282612a38565b5050565b600033610d1b818585611343838361218d565b61134d9190614696565b612264565b6040805180820190915260008082526020820152600061138260408501356060860135610dd3602088018861429e565b9150506000806113928684612a9f565b90925090506113af6113a7602088018861429e565b838388612bc3565b9695505050505050565b7f9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a66113e381612719565b6112408383612ca4565b6113f73382612442565b50565b600061140581612719565b6000600d805480602002602001604051908101604052809291908181526020016000905b828210156114d557838290600052602060002001805461144890614499565b80601f016020809104026020016040519081016040528092919081815260200182805461147490614499565b80156114c15780601f10611496576101008083540402835291602001916114c1565b820191906000526020600020905b8154815290600101906020018083116114a457829003601f168201915b505050505081526020019060010190611429565b50505050905060005b600d548110156115a457836040516020016114f991906144cd565b60405160208183030381529060405280519060200120828281518110611521576115216144e9565b602002602001015160405160200161153991906144cd565b604051602081830303815290604052805190602001200361159c5760405162461bcd60e51b815260206004820152601d60248201527f526577617264203a20446f6d61696e20616c72656164792061646465640000006044820152606401610ec3565b6001016114de565b50600d80546001810182556000919091527fd7b6990105719101dabeb77144f2a3385c8033acd3af97e9423a695e81ad1eb5016111ef84826146a9565b60036020908152600092835260408084209091529082529020805461160590614499565b80601f016020809104026020016040519081016040528092919081815260200182805461163190614499565b801561167e5780601f106116535761010080835404028352916020019161167e565b820191906000526020600020905b81548152906001019060200180831161166157829003601f168201915b505050505081565b600d818154811061169657600080fd5b90600052602060002001600091509050805461160590614499565b6116b96128b7565b600480546001600160a01b0319166001600160a01b0383169081179091556040519081527ff0be4f1e87349231d80c36b33f9e8639658eeaf474014dee15a3e6a4d4414197906020015b60405180910390a150565b6117166128b7565b6117206000612d65565b565b61172d823383612723565b61132c8282612442565b6001600160a01b0381166000908152600a6020526040812054610c75565b6060600d805480602002602001604051908101604052809291908181526020016000905b8282101561182557838290600052602060002001805461179890614499565b80601f01602080910402602001604051908101604052809291908181526020018280546117c490614499565b80156118115780601f106117e657610100808354040283529160200191611811565b820191906000526020600020905b8154815290600101906020018083116117f457829003601f168201915b505050505081526020019060010190611779565b50505050905090565b6000918252600c602090815260408084206001600160a01b0393909316845291905290205460ff1690565b6000610c757f60387982703d420143663fc92e81a87e17ce20479575276c7c1a05ec5c825ee983600001518460200151856040015186606001516040516020016118ce9594939291909485526001600160a01b0393841660208601529183166040850152606084015216608082015260a00190565b60405160208183030381529060405280519060200120612db5565b606060098054610c8a90614499565b60003381611906828661218d565b9050838110156119665760405162461bcd60e51b815260206004820152602560248201527f45524332303a2064656372656173656420616c6c6f77616e63652062656c6f77604482015264207a65726f60d81b6064820152608401610ec3565b6119738286868403612264565b506001949350505050565b600033610d1b818585612797565b6119946128b7565b60005b81811015611ac5576119d98383838181106119b4576119b46144e9565b90506020028101906119c6919061475a565b6119d4906040810190614770565b612e03565b8282828181106119eb576119eb6144e9565b90506020028101906119fd919061475a565b611a0b906040810190614770565b60036000868686818110611a2157611a216144e9565b9050602002810190611a33919061475a565b611a4190602081019061429e565b63ffffffff1663ffffffff1681526020019081526020016000206000868686818110611a6f57611a6f6144e9565b9050602002810190611a81919061475a565b611a929060408101906020016147b6565b61ffff168152602081019190915260400160002091611ab29190836147d1565b5080611abd8161488a565b915050611997565b507fbe4864a8e820971c0247f5992e2da559595f7bf076a21cb5928d443d2a13b67482826040516112979291906148cc565b63ffffffff8416600090815260036020908152604080832061ffff87168452909152812080546060929190611b2b90614499565b80601f0160208091040260200160405190810160405280929190818152602001828054611b5790614499565b8015611ba45780601f10611b7957610100808354040283529160200191611ba4565b820191906000526020600020905b815481529060010190602001808311611b8757829003601f168201915b505050505090508051600003611bf45783838080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250929450611c6a9350505050565b6000839003611c04579050611c6a565b60028310611c4d57611c168484612e03565b80611c2484600281886149b0565b604051602001611c36939291906149da565b604051602081830303815290604052915050611c6a565b8383604051639a6d49cd60e01b8152600401610ec3929190614a02565b949350505050565b60005b81811015611d855736838383818110611c9057611c906144e9565b9050602002810190611ca29190614a16565b9050611cd5611cb4602083018361429e565b602083013563ffffffff919091166000908152600160205260409020541490565b611cdf5750611d73565b3063d045a0dc60c08301358360a0810135611cfe610100830183614770565b611d0f610100890160e08a0161411f565b611d1d6101208a018a614770565b6040518963ffffffff1660e01b8152600401611d3f9796959493929190614a42565b6000604051808303818588803b158015611d5857600080fd5b505af1158015611d6c573d6000803e3d6000fd5b5050505050505b80611d7d8161488a565b915050611c75565b50336001600160a01b0316638e9e70996040518163ffffffff1660e01b8152600401600060405180830381865afa158015611dc4573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f19168201604052611dec9190810190614ac8565b604051638351eea760e01b8152600401610ec39190613c05565b611e0e613b2f565b6040805180820190915260008082526020820152600080611e4460408801356060890135611e3f60208b018b61429e565b612e45565b91509150600080611e558984612a9f565b9092509050611e81611e6a60208b018b61429e565b8383611e7b368d90038d018d614b35565b8b612e62565b60408051808201909152858152602080820186905282519298509096503391907f85496b760a4b7f8d66384b9df21b381f5d1b1e79f229a47aaf4c232edc2fe59a90611ecf908d018d61429e565b6040805163ffffffff909216825260208201899052810187905260600160405180910390a350505050935093915050565b611f086128b7565b60405163ca5eb5e160e01b81526001600160a01b0382811660048301527f0000000000000000000000000000000000000000000000000000000000000000169063ca5eb5e190602401600060405180830381600087803b158015611f6b57600080fd5b505af1158015610ed6573d6000803e3d6000fd5b333014611f9f5760405163029a949d60e31b815260040160405180910390fd5b610f8f87878787878787610f80565b611fb66128b7565b600280546001600160a01b0319166001600160a01b0383169081179091556040519081527fd48d879cef83a1c0bdda516f27b13ddb1b3f8bbac1c9e1511bb2a659c242776090602001611703565b834211156120545760405162461bcd60e51b815260206004820152601d60248201527f45524332305065726d69743a206578706972656420646561646c696e650000006044820152606401610ec3565b60007f6e71edae12b1b97f4d1f60370fef10105fa2faae0126114a169c64845d6126c98888886120838c612f6d565b6040805160208101969096526001600160a01b0394851690860152929091166060840152608083015260a082015260c0810186905260e00160405160208183030381529060405280519060200120905060006120de82612db5565b905060006120ee82878787612f95565b9050896001600160a01b0316816001600160a01b0316146121515760405162461bcd60e51b815260206004820152601e60248201527f45524332305065726d69743a20696e76616c6964207369676e617475726500006044820152606401610ec3565b61215c8a8a8a612264565b50505050505050505050565b6000828152600c602052604090206001015461218381612719565b6112408383612a38565b6001600160a01b03918216600090815260066020908152604080832093909416825291909152205490565b6121c06128b7565b6001600160a01b0381166122255760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b6064820152608401610ec3565b6113f781612d65565b6000602082018035906001908390612246908661429e565b63ffffffff1681526020810191909152604001600020541492915050565b6001600160a01b0383166122c65760405162461bcd60e51b8152602060048201526024808201527f45524332303a20617070726f76652066726f6d20746865207a65726f206164646044820152637265737360e01b6064820152608401610ec3565b6001600160a01b0382166123275760405162461bcd60e51b815260206004820152602260248201527f45524332303a20617070726f766520746f20746865207a65726f206164647265604482015261737360f01b6064820152608401610ec3565b6001600160a01b0383811660008181526006602090815260408083209487168084529482529182902085905590518481527f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925910160405180910390a3505050565b60008061239485612fbd565b9150819050838110156123c4576040516371c4efed60e01b81526004810182905260248101859052604401610ec3565b935093915050565b6000806123d98484612ff4565b90506001600160a01b0381166112145760405162461bcd60e51b815260206004820152602860248201527f45524332305265776172643a205369676e65722063616e6e6f7420626520302060448201526730b2323932b9b99760c11b6064820152608401610ec3565b6001600160a01b0382166124a25760405162461bcd60e51b815260206004820152602160248201527f45524332303a206275726e2066726f6d20746865207a65726f206164647265736044820152607360f81b6064820152608401610ec3565b6001600160a01b038216600090815260056020526040902054818110156125165760405162461bcd60e51b815260206004820152602260248201527f45524332303a206275726e20616d6f756e7420657863656564732062616c616e604482015261636560f01b6064820152608401610ec3565b6001600160a01b03831660008181526005602090815260408083208686039055600780548790039055518581529192917fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef910160405180910390a3505050565b63ffffffff811660009081526001602052604081205480610c755760405163f6ff4fb760e01b815263ffffffff84166004820152602401610ec3565b60006125c46125c18787613018565b90565b905060006125f0826125de6125d98a8a613030565b613053565b6125eb60208d018d61429e565b613088565b905060288611156126b757600061262d61261060608c0160408d01614b67565b61261d60208d018d61429e565b846126288c8c61309c565b6130e7565b604051633e5ac80960e11b81529091506001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001690637cb59012906126839086908d906000908790600401614b84565b600060405180830381600087803b15801561269d57600080fd5b505af11580156126b1573d6000803e3d6000fd5b50505050505b6001600160a01b038216887fefed6d3500546b29533b128a29e3a94d70788727f0507505ac12eaf2e578fd9c6126f060208d018d61429e565b6040805163ffffffff9092168252602082018690520160405180910390a3505050505050505050565b6113f78133613119565b600061272f848461218d565b905060001981146111ef578181101561278a5760405162461bcd60e51b815260206004820152601d60248201527f45524332303a20696e73756666696369656e7420616c6c6f77616e63650000006044820152606401610ec3565b6111ef8484848403612264565b6001600160a01b03831615806127b457506001600160a01b038216155b6128265760405162461bcd60e51b815260206004820152603960248201527f45524332305265776172643a20546f6b656e73206f6e207468697320636f6e7460448201527f7261637420617265206e6f6e2d7472616e7366657261626c65000000000000006064820152608401610ec3565b611240838383613172565b61283b828261182e565b61132c576000828152600c602090815260408083206001600160a01b03851684529091529020805460ff191660011790556128733390565b6001600160a01b0316816001600160a01b0316837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45050565b6000546001600160a01b031633146117205760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152606401610ec3565b6000306001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001614801561296a57507f000000000000000000000000000000000000000000000000000000000000000046145b1561299457507f000000000000000000000000000000000000000000000000000000000000000090565b50604080517f00000000000000000000000000000000000000000000000000000000000000006020808301919091527f0000000000000000000000000000000000000000000000000000000000000000828401527f000000000000000000000000000000000000000000000000000000000000000060608301524660808301523060a0808401919091528351808403909101815260c0909201909252805191012090565b612a42828261182e565b1561132c576000828152600c602090815260408083206001600160a01b0385168085529252808320805460ff1916905551339285917ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b9190a45050565b6060806000612afc8560200135612ab58661331d565b612ac260a0890189614770565b8080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525061334992505050565b9093509050600081612b0f576001612b12565b60025b9050612b32612b24602088018861429e565b82610ae460808a018a614770565b6004549093506001600160a01b031615612bba576004805460405163043a78eb60e01b81526001600160a01b039091169163043a78eb91612b77918891889101614bb5565b602060405180830381865afa158015612b94573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190612bb89190614bda565b505b50509250929050565b60408051808201909152600080825260208201527f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031663ddc28c586040518060a001604052808863ffffffff168152602001612c2689612576565b8152602001878152602001868152602001851515815250306040518363ffffffff1660e01b8152600401612c5b929190614bf7565b6040805180830381865afa158015612c77573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190612c9b9190614ca0565b95945050505050565b6001600160a01b038216612cfa5760405162461bcd60e51b815260206004820152601f60248201527f45524332303a206d696e7420746f20746865207a65726f2061646472657373006044820152606401610ec3565b8060076000828254612d0c9190614696565b90915550506001600160a01b0382166000818152600560209081526040808320805486019055518481527fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef910160405180910390a35050565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b6000610c75612dc2612911565b8360405161190160f01b6020820152602281018390526042810182905260009060620160405160208183030381529060405280519060200120905092915050565b6000612e1260028284866149b0565b612e1b91614cbc565b60f01c905060038114611240578282604051639a6d49cd60e01b8152600401610ec3929190614a02565b600080612e53858585612388565b90925090506123c43383612442565b612e6a613b2f565b6000612e7984600001516133c3565b602085015190915015612e9357612e9384602001516133eb565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316632637a450826040518060a001604052808b63ffffffff168152602001612ee38c612576565b81526020018a815260200189815260200160008960200151111515815250866040518463ffffffff1660e01b8152600401612f1f929190614bf7565b60806040518083038185885af1158015612f3d573d6000803e3d6000fd5b50505050506040513d601f19601f82011682018060405250810190612f629190614cec565b979650505050505050565b6001600160a01b0381166000908152600a602052604090208054600181018255905b50919050565b6000806000612fa6878787876134cd565b91509150612fb381613591565b5095945050505050565b60007f0000000000000000000000000000000000000000000000000000000000000000612fea8184614d53565b610c759190614d75565b600080600061300385856136db565b9150915061301081613591565b509392505050565b600061302760208284866149b0565b61121491614d8c565b60006130406028602084866149b0565b61304991614daa565b60c01c9392505050565b6000610c757f00000000000000000000000000000000000000000000000000000000000000006001600160401b038416614d75565b60006130948484612ca4565b509092915050565b60606130ab82602881866149b0565b8080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250929695505050505050565b6060848484846040516020016131009493929190614dd8565b6040516020818303038152906040529050949350505050565b613123828261182e565b61132c5761313081613720565b61313b836020613732565b60405160200161314c929190614e27565b60408051601f198184030181529082905262461bcd60e51b8252610ec391600401613c05565b6001600160a01b0383166131d65760405162461bcd60e51b815260206004820152602560248201527f45524332303a207472616e736665722066726f6d20746865207a65726f206164604482015264647265737360d81b6064820152608401610ec3565b6001600160a01b0382166132385760405162461bcd60e51b815260206004820152602360248201527f45524332303a207472616e7366657220746f20746865207a65726f206164647260448201526265737360e81b6064820152608401610ec3565b6001600160a01b038316600090815260056020526040902054818110156132b05760405162461bcd60e51b815260206004820152602660248201527f45524332303a207472616e7366657220616d6f756e7420657863656564732062604482015265616c616e636560d01b6064820152608401610ec3565b6001600160a01b0380851660008181526005602052604080822086860390559286168082529083902080548601905591517fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef906133109086815260200190565b60405180910390a36111ef565b6000610c757f000000000000000000000000000000000000000000000000000000000000000083614d53565b805160609015158061339257848460405160200161337e92919091825260c01b6001600160c01b031916602082015260280190565b6040516020818303038152906040526133b9565b848433856040516020016133a99493929190614e9c565b6040516020818303038152906040525b9150935093915050565b60008134146133e7576040516304fb820960e51b8152346004820152602401610ec3565b5090565b60007f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031663e4fe1d946040518163ffffffff1660e01b8152600401602060405180830381865afa15801561344b573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061346f9190614edf565b90506001600160a01b038116613498576040516329b99a9560e11b815260040160405180910390fd5b61132c6001600160a01b038216337f0000000000000000000000000000000000000000000000000000000000000000856138cd565b6000807f7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a08311156135045750600090506003613588565b6040805160008082526020820180845289905260ff881692820192909252606081018690526080810185905260019060a0016020604051602081039080840390855afa158015613558573d6000803e3d6000fd5b5050604051601f1901519150506001600160a01b03811661358157600060019250925050613588565b9150600090505b94509492505050565b60008160048111156135a5576135a5614efc565b036135ad5750565b60018160048111156135c1576135c1614efc565b0361360e5760405162461bcd60e51b815260206004820152601860248201527f45434453413a20696e76616c6964207369676e617475726500000000000000006044820152606401610ec3565b600281600481111561362257613622614efc565b0361366f5760405162461bcd60e51b815260206004820152601f60248201527f45434453413a20696e76616c6964207369676e6174757265206c656e677468006044820152606401610ec3565b600381600481111561368357613683614efc565b036113f75760405162461bcd60e51b815260206004820152602260248201527f45434453413a20696e76616c6964207369676e6174757265202773272076616c604482015261756560f01b6064820152608401610ec3565b60008082516041036137115760208301516040840151606085015160001a613705878285856134cd565b94509450505050613719565b506000905060025b9250929050565b6060610c756001600160a01b03831660145b60606000613741836002614d75565b61374c906002614696565b6001600160401b0381111561376357613763613d37565b6040519080825280601f01601f19166020018201604052801561378d576020820181803683370190505b509050600360fc1b816000815181106137a8576137a86144e9565b60200101906001600160f81b031916908160001a905350600f60fb1b816001815181106137d7576137d76144e9565b60200101906001600160f81b031916908160001a90535060006137fb846002614d75565b613806906001614696565b90505b600181111561387e576f181899199a1a9b1b9c1cb0b131b232b360811b85600f166010811061383a5761383a6144e9565b1a60f81b828281518110613850576138506144e9565b60200101906001600160f81b031916908160001a90535060049490941c9361387781614f12565b9050613809565b5083156112145760405162461bcd60e51b815260206004820181905260248201527f537472696e67733a20686578206c656e67746820696e73756666696369656e746044820152606401610ec3565b604080516001600160a01b038581166024830152848116604483015260648083018590528351808403909101815260849092018352602080830180516001600160e01b03166323b872dd60e01b17905283518085019094528084527f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c6564908401526111ef928792916000916139659185169084906139e2565b80519091501561124057808060200190518101906139839190614bda565b6112405760405162461bcd60e51b815260206004820152602a60248201527f5361666545524332303a204552433230206f7065726174696f6e20646964206e6044820152691bdd081cdd58d8d9595960b21b6064820152608401610ec3565b6060611c6a848460008585600080866001600160a01b03168587604051613a0991906144cd565b60006040518083038185875af1925050503d8060008114613a46576040519150601f19603f3d011682016040523d82523d6000602084013e613a4b565b606091505b5091509150612f628783838760608315613ac6578251600003613abf576001600160a01b0385163b613abf5760405162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e74726163740000006044820152606401610ec3565b5081611c6a565b611c6a8383815115613adb5781518083602001fd5b8060405162461bcd60e51b8152600401610ec39190613c05565b508054613b0190614499565b6000825580601f10613b11575050565b601f0160209004906000526020600020908101906113f79190613b76565b60405180606001604052806000801916815260200160006001600160401b03168152602001613b71604051806040016040528060008152602001600081525090565b905290565b5b808211156133e75760008155600101613b77565b600060208284031215613b9d57600080fd5b81356001600160e01b03198116811461121457600080fd5b60005b83811015613bd0578181015183820152602001613bb8565b50506000910152565b60008151808452613bf1816020860160208601613bb5565b601f01601f19169290920160200192915050565b6020815260006112146020830184613bd9565b6001600160a01b03811681146113f757600080fd5b60008060408385031215613c4057600080fd5b8235613c4b81613c18565b946020939093013593505050565b600060e08284031215612f8f57600080fd5b600060208284031215613c7d57600080fd5b81356001600160401b03811115613c9357600080fd5b611c6a84828501613c59565b8351815260208085015190820152600060a08201604060a08185015281865180845260c08601915060c08160051b8701019350602080890160005b83811015613d195788870360bf19018552815180518852830151838801879052613d0687890182613bd9565b9750509382019390820190600101613cda565b50508751606088015250505060208501516080850152509050611c6a565b634e487b7160e01b600052604160045260246000fd5b604080519081016001600160401b0381118282101715613d6f57613d6f613d37565b60405290565b604051601f8201601f191681016001600160401b0381118282101715613d9d57613d9d613d37565b604052919050565b60006001600160401b03821115613dbe57613dbe613d37565b50601f01601f191660200190565b6000613ddf613dda84613da5565b613d75565b9050828152838383011115613df357600080fd5b828260208301376000602084830101529392505050565b600080600060608486031215613e1f57600080fd5b8335613e2a81613c18565b92506020840135915060408401356001600160401b03811115613e4c57600080fd5b8401601f81018613613e5d57600080fd5b613e6c86823560208401613dcc565b9150509250925092565b600060608284031215612f8f57600080fd5b60008083601f840112613e9a57600080fd5b5081356001600160401b03811115613eb157600080fd5b60208301915083602082850101111561371957600080fd5b600080600080600080600060e0888a031215613ee457600080fd5b613eee8989613e76565b96506060880135955060808801356001600160401b0380821115613f1157600080fd5b613f1d8b838c01613e88565b909750955060a08a01359150613f3282613c18565b90935060c08901359080821115613f4857600080fd5b50613f558a828b01613e88565b989b979a50959850939692959293505050565b600060208284031215613f7a57600080fd5b81356001600160401b03811115613f9057600080fd5b8201601f81018413613fa157600080fd5b611c6a84823560208401613dcc565b600080600060608486031215613fc557600080fd5b8335613fd081613c18565b92506020840135613fe081613c18565b929592945050506040919091013590565b60006020828403121561400357600080fd5b5035919050565b6000806040838503121561401d57600080fd5b82359150602083013561402f81613c18565b809150509250929050565b803563ffffffff8116811461404e57600080fd5b919050565b6000806040838503121561406657600080fd5b613c4b8361403a565b80151581146113f757600080fd5b6000806040838503121561409057600080fd5b82356001600160401b038111156140a657600080fd5b6140b285828601613c59565b925050602083013561402f8161406f565b815181526020808301519082015260408101610c75565b803561ffff8116811461404e57600080fd5b600080604083850312156140ff57600080fd5b6141088361403a565b9150614116602084016140da565b90509250929050565b60006020828403121561413157600080fd5b813561121481613c18565b6000602080830181845280855180835260408601915060408160051b870101925083870160005b8281101561419157603f1988860301845261417f858351613bd9565b94509285019290850190600101614163565b5092979650505050505050565b6000608082840312156141b057600080fd5b604051608081018181106001600160401b03821117156141d2576141d2613d37565b60405282356141e081613c18565b815260208301356141f081613c18565b602082015260408381013590820152606083013561420d81613c18565b60608201529392505050565b60008083601f84011261422b57600080fd5b5081356001600160401b0381111561424257600080fd5b6020830191508360208260051b850101111561371957600080fd5b6000806020838503121561427057600080fd5b82356001600160401b0381111561428657600080fd5b61429285828601614219565b90969095509350505050565b6000602082840312156142b057600080fd5b6112148261403a565b600080600080606085870312156142cf57600080fd5b6142d88561403a565b93506142e6602086016140da565b925060408501356001600160401b0381111561430157600080fd5b61430d87828801613e88565b95989497509550505050565b6000806000838503608081121561432f57600080fd5b84356001600160401b0381111561434557600080fd5b61435187828801613c59565b9450506040601f198201121561436657600080fd5b50602084019150606084013561437b81613c18565b809150509250925092565b600060c082019050835182526001600160401b03602085015116602083015260408401516143c1604084018280518252602090810151910152565b5082516080830152602083015160a0830152611214565b600080600080600080600060e0888a0312156143f357600080fd5b87356143fe81613c18565b9650602088013561440e81613c18565b95506040880135945060608801359350608088013560ff8116811461443257600080fd5b9699959850939692959460a0840135945060c09093013592915050565b6000806040838503121561446257600080fd5b823561446d81613c18565b9150602083013561402f81613c18565b60006060828403121561448f57600080fd5b6112148383613e76565b600181811c908216806144ad57607f821691505b602082108103612f8f57634e487b7160e01b600052602260045260246000fd5b600082516144df818460208701613bb5565b9190910192915050565b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052601160045260246000fd5b81810381811115610c7557610c756144ff565b601f82111561124057600081815260208120601f850160051c8101602086101561454f5750805b601f850160051c820191505b8181101561456e5782815560010161455b565b505050505050565b600019600383901b1c191660019190911b1790565b818103614596575050565b6145a08254614499565b6001600160401b038111156145b7576145b7613d37565b6145cb816145c58454614499565b84614528565b6000601f8211600181146145f957600083156145e75750848201545b6145f18482614576565b855550610ed6565b600085815260209020601f19841690600086815260209020845b838110156146335782860154825560019586019590910190602001614613565b50858310156146515781850154600019600388901b60f8161c191681555b5050505050600190811b01905550565b634e487b7160e01b600052603160045260246000fd5b600060ff821660ff810361468d5761468d6144ff565b60010192915050565b80820180821115610c7557610c756144ff565b81516001600160401b038111156146c2576146c2613d37565b6146d0816145c58454614499565b602080601f8311600181146146ff57600084156146ed5750858301515b6146f78582614576565b86555061456e565b600085815260208120601f198616915b8281101561472e5788860151825594840194600190910190840161470f565b508582101561465157939096015160001960f8600387901b161c19169092555050600190811b01905550565b60008235605e198336030181126144df57600080fd5b6000808335601e1984360301811261478757600080fd5b8301803591506001600160401b038211156147a157600080fd5b60200191503681900382131561371957600080fd5b6000602082840312156147c857600080fd5b611214826140da565b6001600160401b038311156147e8576147e8613d37565b6147fc836147f68354614499565b83614528565b6000601f84116001811461482a57600085156148185750838201355b6148228682614576565b845550610ed6565b600083815260209020601f19861690835b8281101561485b578685013582556020948501946001909201910161483b565b50868210156148785760001960f88860031b161c19848701351681555b505060018560011b0183555050505050565b60006001820161489c5761489c6144ff565b5060010190565b81835281816020850137506000828201602090810191909152601f909101601f19169091010190565b60208082528181018390526000906040808401600586901b8501820187855b888110156149a257878303603f190184528135368b9003605e1901811261491157600080fd5b8a01606063ffffffff6149238361403a565b16855261ffff6149348984016140da565b168886015286820135601e1983360301811261494f57600080fd5b9091018781019190356001600160401b0381111561496c57600080fd5b80360383131561497b57600080fd5b818887015261498d82870182856148a3565b968901969550505091860191506001016148eb565b509098975050505050505050565b600080858511156149c057600080fd5b838611156149cd57600080fd5b5050820193919092039150565b600084516149ec818460208901613bb5565b8201838582376000930192835250909392505050565b602081526000611c6a6020830184866148a3565b6000823561013e198336030181126144df57600080fd5b6001600160401b03811681146113f757600080fd5b63ffffffff614a508961403a565b1681526020880135602082015260006040890135614a6d81614a2d565b6001600160401b03811660408401525087606083015260e06080830152614a9860e0830187896148a3565b6001600160a01b03861660a084015282810360c0840152614aba8185876148a3565b9a9950505050505050505050565b600060208284031215614ada57600080fd5b81516001600160401b03811115614af057600080fd5b8201601f81018413614b0157600080fd5b8051614b0f613dda82613da5565b818152856020838501011115614b2457600080fd5b612c9b826020830160208601613bb5565b600060408284031215614b4757600080fd5b614b4f613d4d565b82358152602083013560208201528091505092915050565b600060208284031215614b7957600080fd5b813561121481614a2d565b60018060a01b038516815283602082015261ffff831660408201526080606082015260006113af6080830184613bd9565b604081526000614bc86040830185613bd9565b8281036020840152612c9b8185613bd9565b600060208284031215614bec57600080fd5b81516112148161406f565b6040815263ffffffff8351166040820152602083015160608201526000604084015160a06080840152614c2d60e0840182613bd9565b90506060850151603f198483030160a0850152614c4a8282613bd9565b60809690960151151560c08501525050506001600160a01b039190911660209091015290565b600060408284031215614c8257600080fd5b614c8a613d4d565b9050815181526020820151602082015292915050565b600060408284031215614cb257600080fd5b6112148383614c70565b6001600160f01b03198135818116916002851015614ce45780818660020360031b1b83161692505b505092915050565b600060808284031215614cfe57600080fd5b604051606081018181106001600160401b0382111715614d2057614d20613d37565b604052825181526020830151614d3581614a2d565b6020820152614d478460408501614c70565b60408201529392505050565b600082614d7057634e487b7160e01b600052601260045260246000fd5b500490565b8082028115828204841417610c7557610c756144ff565b80356020831015610c7557600019602084900360031b1b1692915050565b6001600160c01b03198135818116916008851015614ce45760089490940360031b84901b1690921692915050565b6001600160401b0360c01b8560c01b16815263ffffffff60e01b8460e01b16600882015282600c82015260008251614e1781602c850160208701613bb5565b91909101602c0195945050505050565b7f416363657373436f6e74726f6c3a206163636f756e7420000000000000000000815260008351614e5f816017850160208801613bb5565b7001034b99036b4b9b9b4b733903937b6329607d1b6017918401918201528351614e90816028840160208801613bb5565b01602801949350505050565b8481526001600160401b0360c01b8460c01b16602082015282602882015260008251614ecf816048850160208701613bb5565b9190910160480195945050505050565b600060208284031215614ef157600080fd5b815161121481613c18565b634e487b7160e01b600052602160045260246000fd5b600081614f2157614f216144ff565b50600019019056fea264697066735822122097d57303fa082c9f52ce768e87986ba812ac95e4d38de17e6e20bf91b2faaafb64736f6c63430008140033",
  linkReferences: {},
  deployedLinkReferences: {},
};
