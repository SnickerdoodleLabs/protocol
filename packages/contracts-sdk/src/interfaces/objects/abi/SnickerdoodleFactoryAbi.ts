export default {
  _format: "hh-sol-artifact-1",
  contractName: "SnickerdoodleFactory",
  sourceName: "contracts/user-wallet/SnickerdoodleFactory.sol",
  abi: [
    {
      inputs: [
        {
          internalType: "uint256",
          name: "a",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "b",
          type: "uint256",
        },
      ],
      name: "ArrayLengthMismatch",
      type: "error",
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "entity",
          type: "string",
        },
      ],
      name: "EntityNotClaimedOnSourceChain",
      type: "error",
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
      name: "InvalidInitialization",
      type: "error",
    },
    {
      inputs: [
        {
          internalType: "uint8",
          name: "messageType",
          type: "uint8",
        },
      ],
      name: "InvalidMessageType",
      type: "error",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "operator",
          type: "address",
        },
      ],
      name: "InvalidOperator",
      type: "error",
    },
    {
      inputs: [
        {
          internalType: "uint16",
          name: "optionType",
          type: "uint16",
        },
      ],
      name: "InvalidOptionType",
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
      inputs: [],
      name: "NotInitializing",
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
      inputs: [
        {
          internalType: "address",
          name: "owner",
          type: "address",
        },
      ],
      name: "OwnableInvalidOwner",
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
      name: "OwnableUnauthorizedAccount",
      type: "error",
    },
    {
      inputs: [
        {
          internalType: "uint8",
          name: "bits",
          type: "uint8",
        },
        {
          internalType: "uint256",
          name: "value",
          type: "uint256",
        },
      ],
      name: "SafeCastOverflowedUintDowncast",
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
      inputs: [
        {
          internalType: "uint256",
          name: "chainId",
          type: "uint256",
        },
      ],
      name: "SourceChainMethodOnly",
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
          indexed: true,
          internalType: "address",
          name: "OperatorGateway",
          type: "address",
        },
        {
          indexed: false,
          internalType: "string",
          name: "domain",
          type: "string",
        },
      ],
      name: "OperatorGatewayDeployed",
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
          indexed: true,
          internalType: "address",
          name: "wallet",
          type: "address",
        },
        {
          indexed: false,
          internalType: "string",
          name: "name",
          type: "string",
        },
      ],
      name: "WalletCreated",
      type: "event",
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
          internalType: "uint32",
          name: "_destinationChainEID",
          type: "uint32",
        },
        {
          internalType: "uint128",
          name: "_gas",
          type: "uint128",
        },
      ],
      name: "authorizeGatewayOnDestinationChain",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint32",
          name: "_destinationChainEID",
          type: "uint32",
        },
        {
          internalType: "string",
          name: "username",
          type: "string",
        },
        {
          internalType: "uint128",
          name: "_gas",
          type: "uint128",
        },
      ],
      name: "authorizeWalletOnDestinationChain",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint32",
          name: "_destinationChainEID",
          type: "uint32",
        },
        {
          internalType: "string[]",
          name: "usernames",
          type: "string[]",
        },
        {
          internalType: "uint128",
          name: "_gas",
          type: "uint128",
        },
      ],
      name: "authorizeWalletsOnDestinationChain",
      outputs: [],
      stateMutability: "payable",
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
      inputs: [
        {
          internalType: "string",
          name: "salt",
          type: "string",
        },
        {
          internalType: "address",
          name: "beaconAddress",
          type: "address",
        },
      ],
      name: "computeProxyAddress",
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
          name: "salt",
          type: "string",
        },
      ],
      name: "computeWalletAddress",
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
        {
          internalType: "address[]",
          name: "adminAccounts",
          type: "address[]",
        },
        {
          internalType: "address[]",
          name: "operatorAccounts",
          type: "address[]",
        },
      ],
      name: "deployOperatorGatewayProxy",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "string[]",
          name: "usernames",
          type: "string[]",
        },
        {
          components: [
            {
              internalType: "bytes32",
              name: "x",
              type: "bytes32",
            },
            {
              internalType: "bytes32",
              name: "y",
              type: "bytes32",
            },
            {
              internalType: "string",
              name: "keyId",
              type: "string",
            },
          ],
          internalType: "struct P256Key[][]",
          name: "p256Keys",
          type: "tuple[][]",
        },
        {
          internalType: "address[][]",
          name: "evmAccounts",
          type: "address[][]",
        },
      ],
      name: "deployWalletProxies",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "username",
          type: "string",
        },
        {
          components: [
            {
              internalType: "bytes32",
              name: "x",
              type: "bytes32",
            },
            {
              internalType: "bytes32",
              name: "y",
              type: "bytes32",
            },
            {
              internalType: "string",
              name: "keyId",
              type: "string",
            },
          ],
          internalType: "struct P256Key[]",
          name: "p256Keys",
          type: "tuple[]",
        },
        {
          internalType: "address[]",
          name: "evmAccounts",
          type: "address[]",
        },
      ],
      name: "deployWalletProxy",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "endpoint",
      outputs: [
        {
          internalType: "contract ILayerZeroEndpointV2",
          name: "iEndpoint",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getGatewayBeacon",
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
      name: "getIsSourceChain",
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
          name: "operator",
          type: "address",
        },
      ],
      name: "getOperatorDomain",
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
          name: "operator",
          type: "address",
        },
      ],
      name: "getOperatorHash",
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
      name: "getWalletBeacon",
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
          name: "wallet",
          type: "address",
        },
      ],
      name: "getWalletHash",
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
          name: "_layerZeroEndpoint",
          type: "address",
        },
        {
          internalType: "address",
          name: "_owner",
          type: "address",
        },
        {
          internalType: "address",
          name: "_walletBeacon",
          type: "address",
        },
        {
          internalType: "address",
          name: "_gatewayBeacon",
          type: "address",
        },
      ],
      name: "initialize",
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
          internalType: "bytes",
          name: "_message",
          type: "bytes",
        },
        {
          internalType: "address",
          name: "_sender",
          type: "address",
        },
      ],
      name: "isComposeMsgSender",
      outputs: [
        {
          internalType: "bool",
          name: "isSender",
          type: "bool",
        },
      ],
      stateMutability: "pure",
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
      stateMutability: "view",
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
          name: "_eid",
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
          internalType: "uint32",
          name: "_dstEid",
          type: "uint32",
        },
        {
          internalType: "string",
          name: "domain",
          type: "string",
        },
        {
          internalType: "uint128",
          name: "_gas",
          type: "uint128",
        },
      ],
      name: "quoteAuthorizeOperatorGatewayOnDestinationChain",
      outputs: [
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
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint32",
          name: "_dstEid",
          type: "uint32",
        },
        {
          internalType: "string",
          name: "username",
          type: "string",
        },
        {
          internalType: "address",
          name: "operator",
          type: "address",
        },
        {
          internalType: "uint128",
          name: "_gas",
          type: "uint128",
        },
      ],
      name: "quoteAuthorizeWalletOnDestinationChain",
      outputs: [
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
      stateMutability: "view",
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
          internalType: "bytes32",
          name: "newOperatorHash",
          type: "bytes32",
        },
      ],
      name: "updateOperatorHash",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "newWalletHash",
          type: "bytes32",
        },
      ],
      name: "updateWalletHash",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
  ],
  bytecode:
    "0x6080604052348015600f57600080fd5b50613a798061001f6000396000f3fe6080604052600436106101e35760003560e01c8063a9ba9d7a11610102578063d09d939b11610095578063f8c8765e11610064578063f8c8765e14610631578063faa0cb6c14610644578063fd7f40d31461067a578063ff7bd03d1461069a57600080fd5b8063d09d939b14610597578063ee3888a3146105b7578063f2fde38b146105e4578063f42420bd1461060457600080fd5b8063c5faede6116100d1578063c5faede614610521578063c9a34c3d14610541578063ca5eb5e114610564578063d06782961461058457600080fd5b8063a9ba9d7a1461047b578063b770110f146104b0578063b92d0eff146104ce578063bb0b6a53146104e157600080fd5b80637a4fbac41161017a5780638e9044fc116101495780638e9044fc146103d257806391f5f65a146103ea578063972982b11461040a57806399c3e3b41461044e57600080fd5b80637a4fbac4146103285780637d25a05e1461033b57806382413eac146103765780638da5cb5b146103bd57600080fd5b806349aa5039116101b657806349aa5039146102a6578063556b88f4146102c65780635e280f11146102fe578063715018a61461031357600080fd5b8063025dfeb0146101e857806313137d65146101fd57806317442b70146102105780633400288b14610286575b600080fd5b6101fb6101f6366004612450565b6106ba565b005b6101fb61020b366004612522565b610734565b34801561021c57600080fd5b507f8c8be9a8fe00448b6b1db0b4266c258cb8591a2c71892f428e1bc47acd7e8600547f915b8680288de3e23f5af915db3ef0bf76072681e96298857e44b3aec13b6c0054604080516001600160401b039384168152929091166020830152015b60405180910390f35b34801561029257600080fd5b506101fb6102a13660046125c3565b6107e0565b3480156102b257600080fd5b506101fb6102c13660046125ed565b61085b565b3480156102d257600080fd5b506102e66102e1366004612779565b610ae7565b6040516001600160a01b03909116815260200161027d565b34801561030a57600080fd5b506102e6610b0a565b34801561031f57600080fd5b506101fb610b2d565b6101fb6103363660046127b5565b610b41565b34801561034757600080fd5b5061035e6103563660046125c3565b600092915050565b6040516001600160401b03909116815260200161027d565b34801561038257600080fd5b506103ad6103913660046127e8565b60208401356001600160a01b0390811690821614949350505050565b604051901515815260200161027d565b3480156103c957600080fd5b506102e6610cf4565b3480156103de57600080fd5b5060005460ff166103ad565b3480156103f657600080fd5b506101fb6104053660046125ed565b610d1d565b34801561041657600080fd5b5061044061042536600461284e565b6001600160a01b031660009081526002602052604090205490565b60405190815260200161027d565b34801561045a57600080fd5b506101fb61046936600461286b565b33600090815260026020526040902055565b34801561048757600080fd5b5061049b610496366004612884565b610ffc565b6040805192835260208301919091520161027d565b3480156104bc57600080fd5b506001546001600160a01b03166102e6565b3480156104da57600080fd5b50306102e6565b3480156104ed57600080fd5b506104406104fc3660046128ca565b63ffffffff166000908152600080516020613a24833981519152602052604090205490565b34801561052d57600080fd5b5061049b61053c3660046128e5565b6110b8565b34801561054d57600080fd5b5060005461010090046001600160a01b03166102e6565b34801561057057600080fd5b506101fb61057f36600461284e565b611240565b6101fb610592366004612884565b6112bd565b3480156105a357600080fd5b506101fb6105b236600461295b565b6114c9565b3480156105c357600080fd5b506101fb6105d236600461286b565b33600090815260036020526040902055565b3480156105f057600080fd5b506101fb6105ff36600461284e565b611579565b34801561061057600080fd5b5061062461061f36600461284e565b6115b7565b60405161027d91906129e6565b6101fb61063f3660046129f9565b611663565b34801561065057600080fd5b5061044061065f36600461284e565b6001600160a01b031660009081526003602052604090205490565b34801561068657600080fd5b506102e6610695366004612a4a565b6117ed565b3480156106a657600080fd5b506103ad6106b5366004612a9b565b61189b565b600054469060ff166106eb57604051631d1537a160e11b81526004016106e291815260200190565b60405180910390fd5b5060005b8281101561072d576107258585858481811061070d5761070d612ab7565b905060200281019061071f9190612acd565b856112bd565b6001016106ef565b5050505050565b600080516020613a0483398151915280546001600160a01b0316331461076f576040516391ac5e4f60e01b81523360048201526024016106e2565b6020880180359061078990610784908b6128ca565b6118ee565b146107c75761079b60208901896128ca565b60405163309afaf360e21b815263ffffffff9091166004820152602089013560248201526044016106e2565b6107d688888888888888611947565b5050505050505050565b6107e86119a4565b63ffffffff82166000818152600080516020613a248339815191526020908152604091829020849055815192835282018390528051600080516020613a04833981519152927f238399d427b947898edb290f5ff0f9109849b1c3ba196a42e35f00c50a54b98b92908290030190a1505050565b60006108a987878080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250506001546001600160a01b031691506117ed9050565b60005490915060ff1615610906578686868686866040516020016108d296959493929190612b54565b60408051601f1981840301815291815281516020928301206001600160a01b03841660009081526003909352912055610978565b6001600160a01b03811660009081526003602090815260409182902054915161093b918a918a918a918a918a918a9101612b54565b6040516020818303038152906040528051906020012014878790916109755760405163f9a4257960e01b81526004016106e2929190612bac565b50505b6001600160a01b038116600090815260046020526040902061099b878983612c3b565b50600087876040516020016109b1929190612cfa565b60408051601f1981840301815290829052805160209091012060015490916001600160a01b03909116906109e490612381565b6001600160a01b0390911681526040602082018190526000908201526060018190604051809103906000f5905080158015610a23573d6000803e3d6000fd5b5060005460405163c94b105960e01b81529192506001600160a01b0383169163c94b105991610a689160ff909116908c908c908c908c908c908c903090600401612d4a565b600060405180830381600087803b158015610a8257600080fd5b505af1158015610a96573d6000803e3d6000fd5b50505050806001600160a01b03167f225f6288f037db495f4b266f35b49a55c345c2b1adc415162f7e1a962cf0a7608989604051610ad5929190612bac565b60405180910390a25050505050505050565b60008054610b0490839061010090046001600160a01b03166117ed565b92915050565b600080600080516020613a048339815191525b546001600160a01b031692915050565b610b356119a4565b610b3f60006119d6565b565b600054469060ff16610b6957604051631d1537a160e11b81526004016106e291815260200190565b503360009081526004602052604081208054610b8490612bc0565b80601f0160208091040260200160405190810160405280929190818152602001828054610bb090612bc0565b8015610bfd5780601f10610bd257610100808354040283529160200191610bfd565b820191906000526020600020905b815481529060010190602001808311610be057829003601f168201915b5050600154939450600093610c2093508592506001600160a01b031690506117ed565b6001600160a01b0381166000908152600360205260409020549091508281610c5c5760405163f9a4257960e01b81526004016106e291906129e6565b50600060018284604051602001610c869291909182526001600160a01b0316602082015260400190565b60408051601f1981840301815290829052610ca49291602001612dac565b6040516020818303038152906040529050610ceb8682610ccf886000610cc8611a47565b9190611a6a565b6040518060400160405280348152602001600081525033611ad2565b50505050505050565b6000807f9016d09d72d40fdae2fd8ceac6b6234c7706214fd39c1cd1e609a0528c199300610b1d565b3360009081526004602052604081208054610d3790612bc0565b9050113390610d6557604051633eaa03e360e01b81526001600160a01b0390911660048201526024016106e2565b503360009081526004602090815260408083209051610d8a928a928a92909101612dc8565b60405160208183030381529060405290506000610dbc82600060019054906101000a90046001600160a01b03166117ed565b905060008080610dd4610dcf898b612e5e565b611bd4565b600054929550909350915060ff1615610e385733858484848b8b604051602001610e049796959493929190612f56565b60408051601f1981840301815291815281516020928301206001600160a01b03871660009081526002909352912055610ea7565b33858484848b8b604051602001610e559796959493929190612f56565b60408051601f1981840301815291815281516020928301206001600160a01b03871660009081526002909352912054869114610ea55760405163f9a4257960e01b81526004016106e291906129e6565b505b600085604051602001610eba9190612fc8565b60405160208183030381529060405280519060200120600060019054906101000a90046001600160a01b0316604051610ef290612381565b6001600160a01b0390911681526040602082018190526000908201526060018190604051809103906000f5905080158015610f31573d6000803e3d6000fd5b509050806001600160a01b031663abfa3a8760008054906101000a900460ff1630338a8f8f8f8f6040518963ffffffff1660e01b8152600401610f7b989796959493929190612fe4565b600060405180830381600087803b158015610f9557600080fd5b505af1158015610fa9573d6000803e3d6000fd5b50505050806001600160a01b03167f03768bb3a703b01cc4c51e2f46596839eef3bdfc4d1dc810c789e342d2f405a787604051610fe691906129e6565b60405180910390a2505050505050505050505050565b600080600061104d86868080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250506001546001600160a01b031691506117ed9050565b6001600160a01b03811660008181526003602090815260408083205481519283015281019290925291925060600160408051601f1981840301815291905290506110a9886000836110a2896000610cc8611a47565b6000611d55565b93509350505094509492505050565b6001600160a01b03821660009081526004602052604081208054829182916110df90612bc0565b80601f016020809104026020016040519081016040528092919081815260200182805461110b90612bc0565b80156111585780601f1061112d57610100808354040283529160200191611158565b820191906000526020600020905b81548152906001019060200180831161113b57829003601f168201915b505050505090506000815111859061118f57604051633eaa03e360e01b81526001600160a01b0390911660048201526024016106e2565b5060008787836040516020016111a793929190613105565b604051602081830303815290604052905060006111d982600060019054906101000a90046001600160a01b03166117ed565b6001600160a01b03811660008181526002602090815260408083205481519283015281019290925291925060600160408051601f19818403018152919052905061122e8b6000836110a28b6000610cc8611a47565b95509550505050509550959350505050565b6112486119a4565b6000600080516020613a04833981519152805460405163ca5eb5e160e01b81526001600160a01b03858116600483015292935091169063ca5eb5e190602401600060405180830381600087803b1580156112a157600080fd5b505af11580156112b5573d6000803e3d6000fd5b505050505050565b600054469060ff166112e557604051631d1537a160e11b81526004016106e291815260200190565b50336000908152600460205260408120805461130090612bc0565b80601f016020809104026020016040519081016040528092919081815260200182805461132c90612bc0565b80156113795780601f1061134e57610100808354040283529160200191611379565b820191906000526020600020905b81548152906001019060200180831161135c57829003601f168201915b50505050509050600081511133906113b057604051633eaa03e360e01b81526001600160a01b0390911660048201526024016106e2565b5060008484836040516020016113c893929190613105565b604051602081830303815290604052905060006113fa82600060019054906101000a90046001600160a01b03166117ed565b6001600160a01b03811660009081526002602052604090205490915082816114365760405163f9a4257960e01b81526004016106e291906129e6565b50600080828460405160200161145f9291909182526001600160a01b0316602082015260400190565b60408051601f198184030181529082905261147d9291602001612dac565b60405160208183030381529060405290506114bd89826114a1896000610cc8611a47565b6040518060400160405280348152602001600081525032611ad2565b50505050505050505050565b84838181146114f457604051631f4bb7c160e31b8152600481019290925260248201526044016106e2565b50600090505b85811015610ceb5761157187878381811061151757611517612ab7565b90506020028101906115299190612acd565b87878581811061153b5761153b612ab7565b905060200281019061154d9190613135565b87878781811061155f5761155f612ab7565b90506020028101906104059190613135565b6001016114fa565b6115816119a4565b6001600160a01b0381166115ab57604051631e4fbdf760e01b8152600060048201526024016106e2565b6115b4816119d6565b50565b6001600160a01b03811660009081526004602052604090208054606091906115de90612bc0565b80601f016020809104026020016040519081016040528092919081815260200182805461160a90612bc0565b80156116575780601f1061162c57610100808354040283529160200191611657565b820191906000526020600020905b81548152906001019060200180831161163a57829003601f168201915b50505050509050919050565b7ff0c57e16840df040f15088dc2f81fe391c3923bec73e23a9662efc9c229c6a008054600160401b810460ff1615906001600160401b03166000811580156116a85750825b90506000826001600160401b031660011480156116c45750303b155b9050811580156116d2575080155b156116f05760405163f92ee8a960e01b815260040160405180910390fd5b845467ffffffffffffffff19166001178555831561171a57845460ff60401b1916600160401b1785555b6117248989611da4565b61172d88611dba565b4661a869148061173e57504661a86a145b8061174a575046617a69145b1561175d576000805460ff191660011790555b60008054610100600160a81b0319166101006001600160a01b038a81169190910291909117909155600180546001600160a01b03191691881691909117905583156117e257845460ff60401b19168555604051600181527fc7f505b2f371ae2175ee4913f4499e1f2633a7b5936321eed1cdaeb6115181d29060200160405180910390a15b505050505050505050565b6000611894836040516020016118039190612fc8565b604051602081830303815290604052805190602001206040518060200161182990612381565b601f1982820381018352601f9091011660408181526001600160a01b0387166020830152808201526000606082015260800160408051601f1981840301815290829052611879929160200161317e565b60405160208183030381529060405280519060200120611dcb565b9392505050565b6000600080516020613a0483398151915260208301803590600080516020613a248339815191529084906118cf90876128ca565b63ffffffff168152602081019190915260400160002054149392505050565b63ffffffff81166000908152600080516020613a248339815191526020526040812054600080516020613a0483398151915290806118945760405163f6ff4fb760e01b815263ffffffff851660048201526024016106e2565b600080611956868801886131ad565b909250905060ff82166119715761196c81611dd8565b6117e2565b60001960ff8316016119865761196c81611e0c565b6040516305bf7a5960e51b815260ff831660048201526024016106e2565b336119ad610cf4565b6001600160a01b031614610b3f5760405163118cdaa760e01b81523360048201526024016106e2565b7f9016d09d72d40fdae2fd8ceac6b6234c7706214fd39c1cd1e609a0528c19930080546001600160a01b031981166001600160a01b03848116918217845560405192169182907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a3505050565b60408051600360f01b602082015281516002818303018152602290910190915290565b6060836003611a7a826000611e40565b61ffff1614611aae57611a8e816000611e40565b604051633a51740d60e01b815261ffff90911660048201526024016106e2565b6000611aba8585611e9d565b9050611ac886600183611f16565b9695505050505050565b611ada61238e565b6000611ae98460000151611f81565b602085015190915015611b0357611b038460200151611fa9565b600080516020613a0483398151915280546040805160a0810190915263ffffffff8a1681526001600160a01b0390911690632637a45090849060208101611b498d6118ee565b81526020018b81526020018a815260200160008a60200151111515815250876040518463ffffffff1660e01b8152600401611b85929190613216565b60806040518083038185885af1158015611ba3573d6000803e3d6000fd5b50505050506040513d601f19601f82011682018060405250810190611bc891906132dd565b98975050505050505050565b60608060606000604051806020016040528060008152509050600085516001600160401b03811115611c0857611c08612690565b604051908082528060200260200182016040528015611c31578160200160208202803683370190505b509050600086516001600160401b03811115611c4f57611c4f612690565b604051908082528060200260200182016040528015611c78578160200160208202803683370190505b50905060005b8751811015611d475783888281518110611c9a57611c9a612ab7565b602002602001015160400151604051602001611cb792919061317e565b6040516020818303038152906040529350878181518110611cda57611cda612ab7565b602002602001015160000151838281518110611cf857611cf8612ab7565b602002602001018181525050878181518110611d1657611d16612ab7565b602002602001015160200151828281518110611d3457611d34612ab7565b6020908102919091010152600101611c7e565b509196909550909350915050565b60008060008686604051602001611d6d929190612dac565b60405160208183030381529060405290506000611d8c8983888861206e565b8051602090910151909a909950975050505050505050565b611dac61213e565b611db68282612187565b5050565b611dc261213e565b6115b481612199565b60006118948383306121a1565b60008082806020019051810190611def9190613335565b6001600160a01b0316600090815260026020526040902055505050565b60008082806020019051810190611e239190613335565b6001600160a01b0316600090815260036020526040902055505050565b6000611e4d826002613371565b83511015611e945760405162461bcd60e51b8152602060048201526014602482015273746f55696e7431365f6f75744f66426f756e647360601b60448201526064016106e2565b50016002015190565b60606001600160801b03821615611ee557604080516001600160801b0319608086811b8216602084015285901b16603082015201604051602081830303815290604052611894565b6040516001600160801b0319608085901b166020820152603001604051602081830303815290604052905092915050565b6060836003611f26826000611e40565b61ffff1614611f3a57611a8e816000611e40565b846001611f4785516121d4565b611f52906001613384565b8686604051602001611f6895949392919061339e565b6040516020818303038152906040529150509392505050565b6000813414611fa5576040516304fb820960e51b81523460048201526024016106e2565b5090565b600080516020613a0483398151915280546040805163393f876560e21b815290516000926001600160a01b03169163e4fe1d949160048083019260209291908290030181865afa158015612001573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906120259190613405565b90506001600160a01b03811661204e576040516329b99a9560e11b815260040160405180910390fd5b8154612069906001600160a01b038381169133911686612203565b505050565b60408051808201909152600080825260208201526000600080516020613a0483398151915280546040805160a0810190915263ffffffff891681529192506001600160a01b03169063ddc28c5890602081016120c98a6118ee565b8152602001888152602001878152602001861515815250306040518363ffffffff1660e01b81526004016120fe929190613216565b6040805180830381865afa15801561211a573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611ac89190613422565b7ff0c57e16840df040f15088dc2f81fe391c3923bec73e23a9662efc9c229c6a0054600160401b900460ff16610b3f57604051631afcd79f60e31b815260040160405180910390fd5b61218f61213e565b611db68282612263565b61158161213e565b6000604051836040820152846020820152828152600b8101905060ff8153605590206001600160a01b0316949350505050565b600061ffff821115611fa5576040516306dfcc6560e41b815260106004820152602481018390526044016106e2565b604080516001600160a01b0385811660248301528416604482015260648082018490528251808303909101815260849091019091526020810180516001600160e01b03166323b872dd60e01b17905261225d908590612310565b50505050565b61226b61213e565b600080516020613a0483398151915280546001600160a01b0319166001600160a01b0384811691909117825582166122b657604051632d618d8160e21b815260040160405180910390fd5b805460405163ca5eb5e160e01b81526001600160a01b0384811660048301529091169063ca5eb5e190602401600060405180830381600087803b1580156122fc57600080fd5b505af1158015610ceb573d6000803e3d6000fd5b600080602060008451602086016000885af180612333576040513d6000823e3d81fd5b50506000513d9150811561234b578060011415612358565b6001600160a01b0384163b155b1561225d57604051635274afe760e01b81526001600160a01b03851660048201526024016106e2565b6105c58061343f83390190565b60405180606001604052806000801916815260200160006001600160401b031681526020016123d0604051806040016040528060008152602001600081525090565b905290565b803563ffffffff811681146123e957600080fd5b919050565b60008083601f84011261240057600080fd5b5081356001600160401b0381111561241757600080fd5b6020830191508360208260051b850101111561243257600080fd5b9250929050565b80356001600160801b03811681146123e957600080fd5b6000806000806060858703121561246657600080fd5b61246f856123d5565b935060208501356001600160401b0381111561248a57600080fd5b612496878288016123ee565b90945092506124a9905060408601612439565b905092959194509250565b6000606082840312156124c657600080fd5b50919050565b60008083601f8401126124de57600080fd5b5081356001600160401b038111156124f557600080fd5b60208301915083602082850101111561243257600080fd5b6001600160a01b03811681146115b457600080fd5b600080600080600080600060e0888a03121561253d57600080fd5b61254789896124b4565b96506060880135955060808801356001600160401b0381111561256957600080fd5b6125758a828b016124cc565b90965094505060a08801356125898161250d565b925060c08801356001600160401b038111156125a457600080fd5b6125b08a828b016124cc565b989b979a50959850939692959293505050565b600080604083850312156125d657600080fd5b6125df836123d5565b946020939093013593505050565b6000806000806000806060878903121561260657600080fd5b86356001600160401b0381111561261c57600080fd5b61262889828a016124cc565b90975095505060208701356001600160401b0381111561264757600080fd5b61265389828a016123ee565b90955093505060408701356001600160401b0381111561267257600080fd5b61267e89828a016123ee565b979a9699509497509295939492505050565b634e487b7160e01b600052604160045260246000fd5b604051606081016001600160401b03811182821017156126c8576126c8612690565b60405290565b604051601f8201601f191681016001600160401b03811182821017156126f6576126f6612690565b604052919050565b6000806001600160401b0384111561271857612718612690565b50601f8301601f191660200161272d816126ce565b91505082815283838301111561274257600080fd5b828260208301376000602084830101529392505050565b600082601f83011261276a57600080fd5b611894838335602085016126fe565b60006020828403121561278b57600080fd5b81356001600160401b038111156127a157600080fd5b6127ad84828501612759565b949350505050565b600080604083850312156127c857600080fd5b6127d1836123d5565b91506127df60208401612439565b90509250929050565b60008060008060a085870312156127fe57600080fd5b61280886866124b4565b935060608501356001600160401b0381111561282357600080fd5b61282f878288016124cc565b90945092505060808501356128438161250d565b939692955090935050565b60006020828403121561286057600080fd5b81356118948161250d565b60006020828403121561287d57600080fd5b5035919050565b6000806000806060858703121561289a57600080fd5b6128a3856123d5565b935060208501356001600160401b038111156128be57600080fd5b612496878288016124cc565b6000602082840312156128dc57600080fd5b611894826123d5565b6000806000806000608086880312156128fd57600080fd5b612906866123d5565b945060208601356001600160401b0381111561292157600080fd5b61292d888289016124cc565b90955093505060408601356129418161250d565b915061294f60608701612439565b90509295509295909350565b6000806000806000806060878903121561297457600080fd5b86356001600160401b0381111561298a57600080fd5b61262889828a016123ee565b60005b838110156129b1578181015183820152602001612999565b50506000910152565b600081518084526129d2816020860160208601612996565b601f01601f19169290920160200192915050565b60208152600061189460208301846129ba565b60008060008060808587031215612a0f57600080fd5b8435612a1a8161250d565b93506020850135612a2a8161250d565b92506040850135612a3a8161250d565b915060608501356128438161250d565b60008060408385031215612a5d57600080fd5b82356001600160401b03811115612a7357600080fd5b612a7f85828601612759565b9250506020830135612a908161250d565b809150509250929050565b600060608284031215612aad57600080fd5b61189483836124b4565b634e487b7160e01b600052603260045260246000fd5b6000808335601e19843603018112612ae457600080fd5b8301803591506001600160401b03821115612afe57600080fd5b60200191503681900382131561243257600080fd5b60008160005b84811015612b4a578135612b2c8161250d565b6001600160a01b031686526020958601959190910190600101612b19565b5093949350505050565b85878237600086820160008152612b76612b6f82888a612b13565b8587612b13565b9998505050505050505050565b81835281816020850137506000828201602090810191909152601f909101601f19169091010190565b6020815260006127ad602083018486612b83565b600181811c90821680612bd457607f821691505b6020821081036124c657634e487b7160e01b600052602260045260246000fd5b601f82111561206957806000526020600020601f840160051c81016020851015612c1b5750805b601f840160051c820191505b8181101561072d5760008155600101612c27565b6001600160401b03831115612c5257612c52612690565b612c6683612c608354612bc0565b83612bf4565b6000601f841160018114612c9a5760008515612c825750838201355b600019600387901b1c1916600186901b17835561072d565b600083815260209020601f19861690835b82811015612ccb5786850135825560209485019460019092019101612cab565b5086821015612ce85760001960f88860031b161c19848701351681555b505060018560011b0183555050505050565b8183823760009101908152919050565b81835260208301925060008160005b84811015612b4a578135612d2c8161250d565b6001600160a01b031686526020958601959190910190600101612d19565b881515815260a060208201526000612d6660a08301898b612b83565b8281036040840152612d7981888a612d0a565b90508281036060840152612d8e818688612d0a565b91505060018060a01b03831660808301529998505050505050505050565b60ff831681526040602082015260006127ad60408301846129ba565b828482376000838201601760f91b815260008454612de581612bc0565b600182168015612dfc5760018114612e1757612e50565b60ff1983166001860152600182151583028601019350612e50565b87600052602060002060005b83811015612e4557815460018289010152600182019150602081019050612e23565b505060018286010193505b509198975050505050505050565b60006001600160401b03831115612e7757612e77612690565b8260051b612e87602082016126ce565b84815290830190602081019036831115612ea057600080fd5b845b83811015612f235780356001600160401b03811115612ec057600080fd5b86016060368290031215612ed357600080fd5b612edb6126a6565b813581526020808301359082015260408201356001600160401b03811115612f0257600080fd5b612f0e36828501612759565b60408301525084525060209283019201612ea2565b5095945050505050565b600081516020830160005b82811015612b4a578151865260209586019590910190600101612f38565b6bffffffffffffffffffffffff198860601b16815260008751612f80816014850160208c01612996565b875190830190612f97816014840160208c01612996565b612fb9612fb2612fac6014848601018b612f2d565b89612f2d565b8688612b13565b9b9a5050505050505050505050565b60008251612fda818460208701612996565b9190910192915050565b88151581526001600160a01b0388811660208301528716604082015260c060608201819052600090613018908301886129ba565b8281036080840152858152602080820190600588901b83010188600036829003605e19015b8a8210156130de57858403601f19018552823581811261305c57600080fd5b8c018035855260208082013590860152604081013536829003601e1901811261308457600080fd5b016020810190356001600160401b0381111561309f57600080fd5b8036038213156130ae57600080fd5b606060408701526130c3606087018284612b83565b9550505060208301925060208501945060018201915061303d565b50505084810360a08601526130f4818789612d0a565b9d9c50505050505050505050505050565b828482376000838201601760f91b81528351613128816001840160208801612996565b0160010195945050505050565b6000808335601e1984360301811261314c57600080fd5b8301803591506001600160401b0382111561316657600080fd5b6020019150600581901b360382131561243257600080fd5b60008351613190818460208801612996565b8351908301906131a4818360208801612996565b01949350505050565b600080604083850312156131c057600080fd5b823560ff811681146131d157600080fd5b915060208301356001600160401b038111156131ec57600080fd5b8301601f810185136131fd57600080fd5b61320c858235602084016126fe565b9150509250929050565b6040815263ffffffff8351166040820152602083015160608201526000604084015160a0608084015261324c60e08401826129ba565b90506060850151603f198483030160a085015261326982826129ba565b60809690960151151560c08501525050506001600160a01b039190911660209091015290565b6000604082840312156132a157600080fd5b604080519081016001600160401b03811182821017156132c3576132c3612690565b604052825181526020928301519281019290925250919050565b600060808284031280156132f057600080fd5b506132f96126a6565b8251815260208301516001600160401b038116811461331757600080fd5b6020820152613329846040850161328f565b60408201529392505050565b6000806040838503121561334857600080fd5b82516020840151909250612a908161250d565b634e487b7160e01b600052601160045260246000fd5b80820180821115610b0457610b0461335b565b61ffff8181168382160190811115610b0457610b0461335b565b600086516133b0818460208b01612996565b6001600160f81b031960f888811b82169285019283526001600160f01b031960f089901b16600184015286901b16600382015283516133f6816004840160208801612996565b01600401979650505050505050565b60006020828403121561341757600080fd5b81516118948161250d565b60006040828403121561343457600080fd5b611894838361328f56fe60a06040526040516105c53803806105c583398101604081905261002291610387565b61002c828261003e565b506001600160a01b0316608052610484565b610047826100fe565b6040516001600160a01b038316907f1cf3b03a6cf19fa2baba4df148e9dcabedea7f8a5c07840e207e5c089be95d3e90600090a28051156100f2576100ed826001600160a01b0316635c60da1b6040518163ffffffff1660e01b8152600401602060405180830381865afa1580156100c3573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906100e7919061044d565b82610211565b505050565b6100fa610288565b5050565b806001600160a01b03163b60000361013957604051631933b43b60e21b81526001600160a01b03821660048201526024015b60405180910390fd5b807fa3f0ad74e5423aebfd80d3ef4346578335a9a72aeaee59ff6cb3582b35133d5080546001600160a01b0319166001600160a01b0392831617905560408051635c60da1b60e01b81529051600092841691635c60da1b9160048083019260209291908290030181865afa1580156101b5573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906101d9919061044d565b9050806001600160a01b03163b6000036100fa57604051634c9c8ce360e01b81526001600160a01b0382166004820152602401610130565b6060600080846001600160a01b03168460405161022e9190610468565b600060405180830381855af49150503d8060008114610269576040519150601f19603f3d011682016040523d82523d6000602084013e61026e565b606091505b50909250905061027f8583836102a9565b95945050505050565b34156102a75760405163b398979f60e01b815260040160405180910390fd5b565b6060826102be576102b982610308565b610301565b81511580156102d557506001600160a01b0384163b155b156102fe57604051639996b31560e01b81526001600160a01b0385166004820152602401610130565b50805b9392505050565b8051156103185780518082602001fd5b60405163d6bda27560e01b815260040160405180910390fd5b80516001600160a01b038116811461034857600080fd5b919050565b634e487b7160e01b600052604160045260246000fd5b60005b8381101561037e578181015183820152602001610366565b50506000910152565b6000806040838503121561039a57600080fd5b6103a383610331565b60208401519092506001600160401b038111156103bf57600080fd5b8301601f810185136103d057600080fd5b80516001600160401b038111156103e9576103e961034d565b604051601f8201601f19908116603f011681016001600160401b03811182821017156104175761041761034d565b60405281815282820160200187101561042f57600080fd5b610440826020830160208601610363565b8093505050509250929050565b60006020828403121561045f57600080fd5b61030182610331565b6000825161047a818460208701610363565b9190910192915050565b60805161012761049e6000396000601e01526101276000f3fe6080604052600a600c565b005b60186014601a565b60a0565b565b60007f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316635c60da1b6040518163ffffffff1660e01b8152600401602060405180830381865afa1580156079573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190609b919060c3565b905090565b3660008037600080366000845af43d6000803e80801560be573d6000f35b3d6000fd5b60006020828403121560d457600080fd5b81516001600160a01b038116811460ea57600080fd5b939250505056fea2646970667358221220f0959ca51a58dfa33f8868f1214c44e6abd5c2555618646d963c304a98aa25ac64736f6c634300081c00336a0d2aba043cb44543431324191adac77f4308da25e5eafb339b7d48709cf9006a0d2aba043cb44543431324191adac77f4308da25e5eafb339b7d48709cf901a26469706673582212200448e92af6947ef1ef18a509584d19877bf49a565e7f3dbbd38161b2f417433264736f6c634300081c0033",
  deployedBytecode:
    "0x6080604052600436106101e35760003560e01c8063a9ba9d7a11610102578063d09d939b11610095578063f8c8765e11610064578063f8c8765e14610631578063faa0cb6c14610644578063fd7f40d31461067a578063ff7bd03d1461069a57600080fd5b8063d09d939b14610597578063ee3888a3146105b7578063f2fde38b146105e4578063f42420bd1461060457600080fd5b8063c5faede6116100d1578063c5faede614610521578063c9a34c3d14610541578063ca5eb5e114610564578063d06782961461058457600080fd5b8063a9ba9d7a1461047b578063b770110f146104b0578063b92d0eff146104ce578063bb0b6a53146104e157600080fd5b80637a4fbac41161017a5780638e9044fc116101495780638e9044fc146103d257806391f5f65a146103ea578063972982b11461040a57806399c3e3b41461044e57600080fd5b80637a4fbac4146103285780637d25a05e1461033b57806382413eac146103765780638da5cb5b146103bd57600080fd5b806349aa5039116101b657806349aa5039146102a6578063556b88f4146102c65780635e280f11146102fe578063715018a61461031357600080fd5b8063025dfeb0146101e857806313137d65146101fd57806317442b70146102105780633400288b14610286575b600080fd5b6101fb6101f6366004612450565b6106ba565b005b6101fb61020b366004612522565b610734565b34801561021c57600080fd5b507f8c8be9a8fe00448b6b1db0b4266c258cb8591a2c71892f428e1bc47acd7e8600547f915b8680288de3e23f5af915db3ef0bf76072681e96298857e44b3aec13b6c0054604080516001600160401b039384168152929091166020830152015b60405180910390f35b34801561029257600080fd5b506101fb6102a13660046125c3565b6107e0565b3480156102b257600080fd5b506101fb6102c13660046125ed565b61085b565b3480156102d257600080fd5b506102e66102e1366004612779565b610ae7565b6040516001600160a01b03909116815260200161027d565b34801561030a57600080fd5b506102e6610b0a565b34801561031f57600080fd5b506101fb610b2d565b6101fb6103363660046127b5565b610b41565b34801561034757600080fd5b5061035e6103563660046125c3565b600092915050565b6040516001600160401b03909116815260200161027d565b34801561038257600080fd5b506103ad6103913660046127e8565b60208401356001600160a01b0390811690821614949350505050565b604051901515815260200161027d565b3480156103c957600080fd5b506102e6610cf4565b3480156103de57600080fd5b5060005460ff166103ad565b3480156103f657600080fd5b506101fb6104053660046125ed565b610d1d565b34801561041657600080fd5b5061044061042536600461284e565b6001600160a01b031660009081526002602052604090205490565b60405190815260200161027d565b34801561045a57600080fd5b506101fb61046936600461286b565b33600090815260026020526040902055565b34801561048757600080fd5b5061049b610496366004612884565b610ffc565b6040805192835260208301919091520161027d565b3480156104bc57600080fd5b506001546001600160a01b03166102e6565b3480156104da57600080fd5b50306102e6565b3480156104ed57600080fd5b506104406104fc3660046128ca565b63ffffffff166000908152600080516020613a24833981519152602052604090205490565b34801561052d57600080fd5b5061049b61053c3660046128e5565b6110b8565b34801561054d57600080fd5b5060005461010090046001600160a01b03166102e6565b34801561057057600080fd5b506101fb61057f36600461284e565b611240565b6101fb610592366004612884565b6112bd565b3480156105a357600080fd5b506101fb6105b236600461295b565b6114c9565b3480156105c357600080fd5b506101fb6105d236600461286b565b33600090815260036020526040902055565b3480156105f057600080fd5b506101fb6105ff36600461284e565b611579565b34801561061057600080fd5b5061062461061f36600461284e565b6115b7565b60405161027d91906129e6565b6101fb61063f3660046129f9565b611663565b34801561065057600080fd5b5061044061065f36600461284e565b6001600160a01b031660009081526003602052604090205490565b34801561068657600080fd5b506102e6610695366004612a4a565b6117ed565b3480156106a657600080fd5b506103ad6106b5366004612a9b565b61189b565b600054469060ff166106eb57604051631d1537a160e11b81526004016106e291815260200190565b60405180910390fd5b5060005b8281101561072d576107258585858481811061070d5761070d612ab7565b905060200281019061071f9190612acd565b856112bd565b6001016106ef565b5050505050565b600080516020613a0483398151915280546001600160a01b0316331461076f576040516391ac5e4f60e01b81523360048201526024016106e2565b6020880180359061078990610784908b6128ca565b6118ee565b146107c75761079b60208901896128ca565b60405163309afaf360e21b815263ffffffff9091166004820152602089013560248201526044016106e2565b6107d688888888888888611947565b5050505050505050565b6107e86119a4565b63ffffffff82166000818152600080516020613a248339815191526020908152604091829020849055815192835282018390528051600080516020613a04833981519152927f238399d427b947898edb290f5ff0f9109849b1c3ba196a42e35f00c50a54b98b92908290030190a1505050565b60006108a987878080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250506001546001600160a01b031691506117ed9050565b60005490915060ff1615610906578686868686866040516020016108d296959493929190612b54565b60408051601f1981840301815291815281516020928301206001600160a01b03841660009081526003909352912055610978565b6001600160a01b03811660009081526003602090815260409182902054915161093b918a918a918a918a918a918a9101612b54565b6040516020818303038152906040528051906020012014878790916109755760405163f9a4257960e01b81526004016106e2929190612bac565b50505b6001600160a01b038116600090815260046020526040902061099b878983612c3b565b50600087876040516020016109b1929190612cfa565b60408051601f1981840301815290829052805160209091012060015490916001600160a01b03909116906109e490612381565b6001600160a01b0390911681526040602082018190526000908201526060018190604051809103906000f5905080158015610a23573d6000803e3d6000fd5b5060005460405163c94b105960e01b81529192506001600160a01b0383169163c94b105991610a689160ff909116908c908c908c908c908c908c903090600401612d4a565b600060405180830381600087803b158015610a8257600080fd5b505af1158015610a96573d6000803e3d6000fd5b50505050806001600160a01b03167f225f6288f037db495f4b266f35b49a55c345c2b1adc415162f7e1a962cf0a7608989604051610ad5929190612bac565b60405180910390a25050505050505050565b60008054610b0490839061010090046001600160a01b03166117ed565b92915050565b600080600080516020613a048339815191525b546001600160a01b031692915050565b610b356119a4565b610b3f60006119d6565b565b600054469060ff16610b6957604051631d1537a160e11b81526004016106e291815260200190565b503360009081526004602052604081208054610b8490612bc0565b80601f0160208091040260200160405190810160405280929190818152602001828054610bb090612bc0565b8015610bfd5780601f10610bd257610100808354040283529160200191610bfd565b820191906000526020600020905b815481529060010190602001808311610be057829003601f168201915b5050600154939450600093610c2093508592506001600160a01b031690506117ed565b6001600160a01b0381166000908152600360205260409020549091508281610c5c5760405163f9a4257960e01b81526004016106e291906129e6565b50600060018284604051602001610c869291909182526001600160a01b0316602082015260400190565b60408051601f1981840301815290829052610ca49291602001612dac565b6040516020818303038152906040529050610ceb8682610ccf886000610cc8611a47565b9190611a6a565b6040518060400160405280348152602001600081525033611ad2565b50505050505050565b6000807f9016d09d72d40fdae2fd8ceac6b6234c7706214fd39c1cd1e609a0528c199300610b1d565b3360009081526004602052604081208054610d3790612bc0565b9050113390610d6557604051633eaa03e360e01b81526001600160a01b0390911660048201526024016106e2565b503360009081526004602090815260408083209051610d8a928a928a92909101612dc8565b60405160208183030381529060405290506000610dbc82600060019054906101000a90046001600160a01b03166117ed565b905060008080610dd4610dcf898b612e5e565b611bd4565b600054929550909350915060ff1615610e385733858484848b8b604051602001610e049796959493929190612f56565b60408051601f1981840301815291815281516020928301206001600160a01b03871660009081526002909352912055610ea7565b33858484848b8b604051602001610e559796959493929190612f56565b60408051601f1981840301815291815281516020928301206001600160a01b03871660009081526002909352912054869114610ea55760405163f9a4257960e01b81526004016106e291906129e6565b505b600085604051602001610eba9190612fc8565b60405160208183030381529060405280519060200120600060019054906101000a90046001600160a01b0316604051610ef290612381565b6001600160a01b0390911681526040602082018190526000908201526060018190604051809103906000f5905080158015610f31573d6000803e3d6000fd5b509050806001600160a01b031663abfa3a8760008054906101000a900460ff1630338a8f8f8f8f6040518963ffffffff1660e01b8152600401610f7b989796959493929190612fe4565b600060405180830381600087803b158015610f9557600080fd5b505af1158015610fa9573d6000803e3d6000fd5b50505050806001600160a01b03167f03768bb3a703b01cc4c51e2f46596839eef3bdfc4d1dc810c789e342d2f405a787604051610fe691906129e6565b60405180910390a2505050505050505050505050565b600080600061104d86868080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250506001546001600160a01b031691506117ed9050565b6001600160a01b03811660008181526003602090815260408083205481519283015281019290925291925060600160408051601f1981840301815291905290506110a9886000836110a2896000610cc8611a47565b6000611d55565b93509350505094509492505050565b6001600160a01b03821660009081526004602052604081208054829182916110df90612bc0565b80601f016020809104026020016040519081016040528092919081815260200182805461110b90612bc0565b80156111585780601f1061112d57610100808354040283529160200191611158565b820191906000526020600020905b81548152906001019060200180831161113b57829003601f168201915b505050505090506000815111859061118f57604051633eaa03e360e01b81526001600160a01b0390911660048201526024016106e2565b5060008787836040516020016111a793929190613105565b604051602081830303815290604052905060006111d982600060019054906101000a90046001600160a01b03166117ed565b6001600160a01b03811660008181526002602090815260408083205481519283015281019290925291925060600160408051601f19818403018152919052905061122e8b6000836110a28b6000610cc8611a47565b95509550505050509550959350505050565b6112486119a4565b6000600080516020613a04833981519152805460405163ca5eb5e160e01b81526001600160a01b03858116600483015292935091169063ca5eb5e190602401600060405180830381600087803b1580156112a157600080fd5b505af11580156112b5573d6000803e3d6000fd5b505050505050565b600054469060ff166112e557604051631d1537a160e11b81526004016106e291815260200190565b50336000908152600460205260408120805461130090612bc0565b80601f016020809104026020016040519081016040528092919081815260200182805461132c90612bc0565b80156113795780601f1061134e57610100808354040283529160200191611379565b820191906000526020600020905b81548152906001019060200180831161135c57829003601f168201915b50505050509050600081511133906113b057604051633eaa03e360e01b81526001600160a01b0390911660048201526024016106e2565b5060008484836040516020016113c893929190613105565b604051602081830303815290604052905060006113fa82600060019054906101000a90046001600160a01b03166117ed565b6001600160a01b03811660009081526002602052604090205490915082816114365760405163f9a4257960e01b81526004016106e291906129e6565b50600080828460405160200161145f9291909182526001600160a01b0316602082015260400190565b60408051601f198184030181529082905261147d9291602001612dac565b60405160208183030381529060405290506114bd89826114a1896000610cc8611a47565b6040518060400160405280348152602001600081525032611ad2565b50505050505050505050565b84838181146114f457604051631f4bb7c160e31b8152600481019290925260248201526044016106e2565b50600090505b85811015610ceb5761157187878381811061151757611517612ab7565b90506020028101906115299190612acd565b87878581811061153b5761153b612ab7565b905060200281019061154d9190613135565b87878781811061155f5761155f612ab7565b90506020028101906104059190613135565b6001016114fa565b6115816119a4565b6001600160a01b0381166115ab57604051631e4fbdf760e01b8152600060048201526024016106e2565b6115b4816119d6565b50565b6001600160a01b03811660009081526004602052604090208054606091906115de90612bc0565b80601f016020809104026020016040519081016040528092919081815260200182805461160a90612bc0565b80156116575780601f1061162c57610100808354040283529160200191611657565b820191906000526020600020905b81548152906001019060200180831161163a57829003601f168201915b50505050509050919050565b7ff0c57e16840df040f15088dc2f81fe391c3923bec73e23a9662efc9c229c6a008054600160401b810460ff1615906001600160401b03166000811580156116a85750825b90506000826001600160401b031660011480156116c45750303b155b9050811580156116d2575080155b156116f05760405163f92ee8a960e01b815260040160405180910390fd5b845467ffffffffffffffff19166001178555831561171a57845460ff60401b1916600160401b1785555b6117248989611da4565b61172d88611dba565b4661a869148061173e57504661a86a145b8061174a575046617a69145b1561175d576000805460ff191660011790555b60008054610100600160a81b0319166101006001600160a01b038a81169190910291909117909155600180546001600160a01b03191691881691909117905583156117e257845460ff60401b19168555604051600181527fc7f505b2f371ae2175ee4913f4499e1f2633a7b5936321eed1cdaeb6115181d29060200160405180910390a15b505050505050505050565b6000611894836040516020016118039190612fc8565b604051602081830303815290604052805190602001206040518060200161182990612381565b601f1982820381018352601f9091011660408181526001600160a01b0387166020830152808201526000606082015260800160408051601f1981840301815290829052611879929160200161317e565b60405160208183030381529060405280519060200120611dcb565b9392505050565b6000600080516020613a0483398151915260208301803590600080516020613a248339815191529084906118cf90876128ca565b63ffffffff168152602081019190915260400160002054149392505050565b63ffffffff81166000908152600080516020613a248339815191526020526040812054600080516020613a0483398151915290806118945760405163f6ff4fb760e01b815263ffffffff851660048201526024016106e2565b600080611956868801886131ad565b909250905060ff82166119715761196c81611dd8565b6117e2565b60001960ff8316016119865761196c81611e0c565b6040516305bf7a5960e51b815260ff831660048201526024016106e2565b336119ad610cf4565b6001600160a01b031614610b3f5760405163118cdaa760e01b81523360048201526024016106e2565b7f9016d09d72d40fdae2fd8ceac6b6234c7706214fd39c1cd1e609a0528c19930080546001600160a01b031981166001600160a01b03848116918217845560405192169182907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a3505050565b60408051600360f01b602082015281516002818303018152602290910190915290565b6060836003611a7a826000611e40565b61ffff1614611aae57611a8e816000611e40565b604051633a51740d60e01b815261ffff90911660048201526024016106e2565b6000611aba8585611e9d565b9050611ac886600183611f16565b9695505050505050565b611ada61238e565b6000611ae98460000151611f81565b602085015190915015611b0357611b038460200151611fa9565b600080516020613a0483398151915280546040805160a0810190915263ffffffff8a1681526001600160a01b0390911690632637a45090849060208101611b498d6118ee565b81526020018b81526020018a815260200160008a60200151111515815250876040518463ffffffff1660e01b8152600401611b85929190613216565b60806040518083038185885af1158015611ba3573d6000803e3d6000fd5b50505050506040513d601f19601f82011682018060405250810190611bc891906132dd565b98975050505050505050565b60608060606000604051806020016040528060008152509050600085516001600160401b03811115611c0857611c08612690565b604051908082528060200260200182016040528015611c31578160200160208202803683370190505b509050600086516001600160401b03811115611c4f57611c4f612690565b604051908082528060200260200182016040528015611c78578160200160208202803683370190505b50905060005b8751811015611d475783888281518110611c9a57611c9a612ab7565b602002602001015160400151604051602001611cb792919061317e565b6040516020818303038152906040529350878181518110611cda57611cda612ab7565b602002602001015160000151838281518110611cf857611cf8612ab7565b602002602001018181525050878181518110611d1657611d16612ab7565b602002602001015160200151828281518110611d3457611d34612ab7565b6020908102919091010152600101611c7e565b509196909550909350915050565b60008060008686604051602001611d6d929190612dac565b60405160208183030381529060405290506000611d8c8983888861206e565b8051602090910151909a909950975050505050505050565b611dac61213e565b611db68282612187565b5050565b611dc261213e565b6115b481612199565b60006118948383306121a1565b60008082806020019051810190611def9190613335565b6001600160a01b0316600090815260026020526040902055505050565b60008082806020019051810190611e239190613335565b6001600160a01b0316600090815260036020526040902055505050565b6000611e4d826002613371565b83511015611e945760405162461bcd60e51b8152602060048201526014602482015273746f55696e7431365f6f75744f66426f756e647360601b60448201526064016106e2565b50016002015190565b60606001600160801b03821615611ee557604080516001600160801b0319608086811b8216602084015285901b16603082015201604051602081830303815290604052611894565b6040516001600160801b0319608085901b166020820152603001604051602081830303815290604052905092915050565b6060836003611f26826000611e40565b61ffff1614611f3a57611a8e816000611e40565b846001611f4785516121d4565b611f52906001613384565b8686604051602001611f6895949392919061339e565b6040516020818303038152906040529150509392505050565b6000813414611fa5576040516304fb820960e51b81523460048201526024016106e2565b5090565b600080516020613a0483398151915280546040805163393f876560e21b815290516000926001600160a01b03169163e4fe1d949160048083019260209291908290030181865afa158015612001573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906120259190613405565b90506001600160a01b03811661204e576040516329b99a9560e11b815260040160405180910390fd5b8154612069906001600160a01b038381169133911686612203565b505050565b60408051808201909152600080825260208201526000600080516020613a0483398151915280546040805160a0810190915263ffffffff891681529192506001600160a01b03169063ddc28c5890602081016120c98a6118ee565b8152602001888152602001878152602001861515815250306040518363ffffffff1660e01b81526004016120fe929190613216565b6040805180830381865afa15801561211a573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611ac89190613422565b7ff0c57e16840df040f15088dc2f81fe391c3923bec73e23a9662efc9c229c6a0054600160401b900460ff16610b3f57604051631afcd79f60e31b815260040160405180910390fd5b61218f61213e565b611db68282612263565b61158161213e565b6000604051836040820152846020820152828152600b8101905060ff8153605590206001600160a01b0316949350505050565b600061ffff821115611fa5576040516306dfcc6560e41b815260106004820152602481018390526044016106e2565b604080516001600160a01b0385811660248301528416604482015260648082018490528251808303909101815260849091019091526020810180516001600160e01b03166323b872dd60e01b17905261225d908590612310565b50505050565b61226b61213e565b600080516020613a0483398151915280546001600160a01b0319166001600160a01b0384811691909117825582166122b657604051632d618d8160e21b815260040160405180910390fd5b805460405163ca5eb5e160e01b81526001600160a01b0384811660048301529091169063ca5eb5e190602401600060405180830381600087803b1580156122fc57600080fd5b505af1158015610ceb573d6000803e3d6000fd5b600080602060008451602086016000885af180612333576040513d6000823e3d81fd5b50506000513d9150811561234b578060011415612358565b6001600160a01b0384163b155b1561225d57604051635274afe760e01b81526001600160a01b03851660048201526024016106e2565b6105c58061343f83390190565b60405180606001604052806000801916815260200160006001600160401b031681526020016123d0604051806040016040528060008152602001600081525090565b905290565b803563ffffffff811681146123e957600080fd5b919050565b60008083601f84011261240057600080fd5b5081356001600160401b0381111561241757600080fd5b6020830191508360208260051b850101111561243257600080fd5b9250929050565b80356001600160801b03811681146123e957600080fd5b6000806000806060858703121561246657600080fd5b61246f856123d5565b935060208501356001600160401b0381111561248a57600080fd5b612496878288016123ee565b90945092506124a9905060408601612439565b905092959194509250565b6000606082840312156124c657600080fd5b50919050565b60008083601f8401126124de57600080fd5b5081356001600160401b038111156124f557600080fd5b60208301915083602082850101111561243257600080fd5b6001600160a01b03811681146115b457600080fd5b600080600080600080600060e0888a03121561253d57600080fd5b61254789896124b4565b96506060880135955060808801356001600160401b0381111561256957600080fd5b6125758a828b016124cc565b90965094505060a08801356125898161250d565b925060c08801356001600160401b038111156125a457600080fd5b6125b08a828b016124cc565b989b979a50959850939692959293505050565b600080604083850312156125d657600080fd5b6125df836123d5565b946020939093013593505050565b6000806000806000806060878903121561260657600080fd5b86356001600160401b0381111561261c57600080fd5b61262889828a016124cc565b90975095505060208701356001600160401b0381111561264757600080fd5b61265389828a016123ee565b90955093505060408701356001600160401b0381111561267257600080fd5b61267e89828a016123ee565b979a9699509497509295939492505050565b634e487b7160e01b600052604160045260246000fd5b604051606081016001600160401b03811182821017156126c8576126c8612690565b60405290565b604051601f8201601f191681016001600160401b03811182821017156126f6576126f6612690565b604052919050565b6000806001600160401b0384111561271857612718612690565b50601f8301601f191660200161272d816126ce565b91505082815283838301111561274257600080fd5b828260208301376000602084830101529392505050565b600082601f83011261276a57600080fd5b611894838335602085016126fe565b60006020828403121561278b57600080fd5b81356001600160401b038111156127a157600080fd5b6127ad84828501612759565b949350505050565b600080604083850312156127c857600080fd5b6127d1836123d5565b91506127df60208401612439565b90509250929050565b60008060008060a085870312156127fe57600080fd5b61280886866124b4565b935060608501356001600160401b0381111561282357600080fd5b61282f878288016124cc565b90945092505060808501356128438161250d565b939692955090935050565b60006020828403121561286057600080fd5b81356118948161250d565b60006020828403121561287d57600080fd5b5035919050565b6000806000806060858703121561289a57600080fd5b6128a3856123d5565b935060208501356001600160401b038111156128be57600080fd5b612496878288016124cc565b6000602082840312156128dc57600080fd5b611894826123d5565b6000806000806000608086880312156128fd57600080fd5b612906866123d5565b945060208601356001600160401b0381111561292157600080fd5b61292d888289016124cc565b90955093505060408601356129418161250d565b915061294f60608701612439565b90509295509295909350565b6000806000806000806060878903121561297457600080fd5b86356001600160401b0381111561298a57600080fd5b61262889828a016123ee565b60005b838110156129b1578181015183820152602001612999565b50506000910152565b600081518084526129d2816020860160208601612996565b601f01601f19169290920160200192915050565b60208152600061189460208301846129ba565b60008060008060808587031215612a0f57600080fd5b8435612a1a8161250d565b93506020850135612a2a8161250d565b92506040850135612a3a8161250d565b915060608501356128438161250d565b60008060408385031215612a5d57600080fd5b82356001600160401b03811115612a7357600080fd5b612a7f85828601612759565b9250506020830135612a908161250d565b809150509250929050565b600060608284031215612aad57600080fd5b61189483836124b4565b634e487b7160e01b600052603260045260246000fd5b6000808335601e19843603018112612ae457600080fd5b8301803591506001600160401b03821115612afe57600080fd5b60200191503681900382131561243257600080fd5b60008160005b84811015612b4a578135612b2c8161250d565b6001600160a01b031686526020958601959190910190600101612b19565b5093949350505050565b85878237600086820160008152612b76612b6f82888a612b13565b8587612b13565b9998505050505050505050565b81835281816020850137506000828201602090810191909152601f909101601f19169091010190565b6020815260006127ad602083018486612b83565b600181811c90821680612bd457607f821691505b6020821081036124c657634e487b7160e01b600052602260045260246000fd5b601f82111561206957806000526020600020601f840160051c81016020851015612c1b5750805b601f840160051c820191505b8181101561072d5760008155600101612c27565b6001600160401b03831115612c5257612c52612690565b612c6683612c608354612bc0565b83612bf4565b6000601f841160018114612c9a5760008515612c825750838201355b600019600387901b1c1916600186901b17835561072d565b600083815260209020601f19861690835b82811015612ccb5786850135825560209485019460019092019101612cab565b5086821015612ce85760001960f88860031b161c19848701351681555b505060018560011b0183555050505050565b8183823760009101908152919050565b81835260208301925060008160005b84811015612b4a578135612d2c8161250d565b6001600160a01b031686526020958601959190910190600101612d19565b881515815260a060208201526000612d6660a08301898b612b83565b8281036040840152612d7981888a612d0a565b90508281036060840152612d8e818688612d0a565b91505060018060a01b03831660808301529998505050505050505050565b60ff831681526040602082015260006127ad60408301846129ba565b828482376000838201601760f91b815260008454612de581612bc0565b600182168015612dfc5760018114612e1757612e50565b60ff1983166001860152600182151583028601019350612e50565b87600052602060002060005b83811015612e4557815460018289010152600182019150602081019050612e23565b505060018286010193505b509198975050505050505050565b60006001600160401b03831115612e7757612e77612690565b8260051b612e87602082016126ce565b84815290830190602081019036831115612ea057600080fd5b845b83811015612f235780356001600160401b03811115612ec057600080fd5b86016060368290031215612ed357600080fd5b612edb6126a6565b813581526020808301359082015260408201356001600160401b03811115612f0257600080fd5b612f0e36828501612759565b60408301525084525060209283019201612ea2565b5095945050505050565b600081516020830160005b82811015612b4a578151865260209586019590910190600101612f38565b6bffffffffffffffffffffffff198860601b16815260008751612f80816014850160208c01612996565b875190830190612f97816014840160208c01612996565b612fb9612fb2612fac6014848601018b612f2d565b89612f2d565b8688612b13565b9b9a5050505050505050505050565b60008251612fda818460208701612996565b9190910192915050565b88151581526001600160a01b0388811660208301528716604082015260c060608201819052600090613018908301886129ba565b8281036080840152858152602080820190600588901b83010188600036829003605e19015b8a8210156130de57858403601f19018552823581811261305c57600080fd5b8c018035855260208082013590860152604081013536829003601e1901811261308457600080fd5b016020810190356001600160401b0381111561309f57600080fd5b8036038213156130ae57600080fd5b606060408701526130c3606087018284612b83565b9550505060208301925060208501945060018201915061303d565b50505084810360a08601526130f4818789612d0a565b9d9c50505050505050505050505050565b828482376000838201601760f91b81528351613128816001840160208801612996565b0160010195945050505050565b6000808335601e1984360301811261314c57600080fd5b8301803591506001600160401b0382111561316657600080fd5b6020019150600581901b360382131561243257600080fd5b60008351613190818460208801612996565b8351908301906131a4818360208801612996565b01949350505050565b600080604083850312156131c057600080fd5b823560ff811681146131d157600080fd5b915060208301356001600160401b038111156131ec57600080fd5b8301601f810185136131fd57600080fd5b61320c858235602084016126fe565b9150509250929050565b6040815263ffffffff8351166040820152602083015160608201526000604084015160a0608084015261324c60e08401826129ba565b90506060850151603f198483030160a085015261326982826129ba565b60809690960151151560c08501525050506001600160a01b039190911660209091015290565b6000604082840312156132a157600080fd5b604080519081016001600160401b03811182821017156132c3576132c3612690565b604052825181526020928301519281019290925250919050565b600060808284031280156132f057600080fd5b506132f96126a6565b8251815260208301516001600160401b038116811461331757600080fd5b6020820152613329846040850161328f565b60408201529392505050565b6000806040838503121561334857600080fd5b82516020840151909250612a908161250d565b634e487b7160e01b600052601160045260246000fd5b80820180821115610b0457610b0461335b565b61ffff8181168382160190811115610b0457610b0461335b565b600086516133b0818460208b01612996565b6001600160f81b031960f888811b82169285019283526001600160f01b031960f089901b16600184015286901b16600382015283516133f6816004840160208801612996565b01600401979650505050505050565b60006020828403121561341757600080fd5b81516118948161250d565b60006040828403121561343457600080fd5b611894838361328f56fe60a06040526040516105c53803806105c583398101604081905261002291610387565b61002c828261003e565b506001600160a01b0316608052610484565b610047826100fe565b6040516001600160a01b038316907f1cf3b03a6cf19fa2baba4df148e9dcabedea7f8a5c07840e207e5c089be95d3e90600090a28051156100f2576100ed826001600160a01b0316635c60da1b6040518163ffffffff1660e01b8152600401602060405180830381865afa1580156100c3573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906100e7919061044d565b82610211565b505050565b6100fa610288565b5050565b806001600160a01b03163b60000361013957604051631933b43b60e21b81526001600160a01b03821660048201526024015b60405180910390fd5b807fa3f0ad74e5423aebfd80d3ef4346578335a9a72aeaee59ff6cb3582b35133d5080546001600160a01b0319166001600160a01b0392831617905560408051635c60da1b60e01b81529051600092841691635c60da1b9160048083019260209291908290030181865afa1580156101b5573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906101d9919061044d565b9050806001600160a01b03163b6000036100fa57604051634c9c8ce360e01b81526001600160a01b0382166004820152602401610130565b6060600080846001600160a01b03168460405161022e9190610468565b600060405180830381855af49150503d8060008114610269576040519150601f19603f3d011682016040523d82523d6000602084013e61026e565b606091505b50909250905061027f8583836102a9565b95945050505050565b34156102a75760405163b398979f60e01b815260040160405180910390fd5b565b6060826102be576102b982610308565b610301565b81511580156102d557506001600160a01b0384163b155b156102fe57604051639996b31560e01b81526001600160a01b0385166004820152602401610130565b50805b9392505050565b8051156103185780518082602001fd5b60405163d6bda27560e01b815260040160405180910390fd5b80516001600160a01b038116811461034857600080fd5b919050565b634e487b7160e01b600052604160045260246000fd5b60005b8381101561037e578181015183820152602001610366565b50506000910152565b6000806040838503121561039a57600080fd5b6103a383610331565b60208401519092506001600160401b038111156103bf57600080fd5b8301601f810185136103d057600080fd5b80516001600160401b038111156103e9576103e961034d565b604051601f8201601f19908116603f011681016001600160401b03811182821017156104175761041761034d565b60405281815282820160200187101561042f57600080fd5b610440826020830160208601610363565b8093505050509250929050565b60006020828403121561045f57600080fd5b61030182610331565b6000825161047a818460208701610363565b9190910192915050565b60805161012761049e6000396000601e01526101276000f3fe6080604052600a600c565b005b60186014601a565b60a0565b565b60007f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316635c60da1b6040518163ffffffff1660e01b8152600401602060405180830381865afa1580156079573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190609b919060c3565b905090565b3660008037600080366000845af43d6000803e80801560be573d6000f35b3d6000fd5b60006020828403121560d457600080fd5b81516001600160a01b038116811460ea57600080fd5b939250505056fea2646970667358221220f0959ca51a58dfa33f8868f1214c44e6abd5c2555618646d963c304a98aa25ac64736f6c634300081c00336a0d2aba043cb44543431324191adac77f4308da25e5eafb339b7d48709cf9006a0d2aba043cb44543431324191adac77f4308da25e5eafb339b7d48709cf901a26469706673582212200448e92af6947ef1ef18a509584d19877bf49a565e7f3dbbd38161b2f417433264736f6c634300081c0033",
  linkReferences: {},
  deployedLinkReferences: {},
};
