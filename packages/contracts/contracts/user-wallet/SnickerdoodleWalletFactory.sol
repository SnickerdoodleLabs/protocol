// SPDX-License-Identifier: MIT

pragma solidity ^0.8.24;

import "@openzeppelin/contracts/utils/Create2.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import {BeaconProxy} from "@openzeppelin/contracts/proxy/beacon/BeaconProxy.sol";
import {UpgradeableBeacon} from "@openzeppelin/contracts/proxy/beacon/UpgradeableBeacon.sol";
import {Origin, MessagingFee} from "@layerzerolabs/lz-evm-oapp-v2/contracts/oapp/OApp.sol";
import {OptionsBuilder} from "@layerzerolabs/lz-evm-oapp-v2/contracts/oapp/libs/OptionsBuilder.sol";
import {OAppUpgradeable} from "../oapp-upgradeable/OAppUpgradeable.sol";

import "../operators/OperatorGateway.sol";
import "./SnickerdoodleWallet.sol";
import "./P256Structs.sol";

contract SnickerdoodleWalletFactory is OAppUpgradeable {
    /// @notice Layer Zero's option to support building the options param within the contract
    using OptionsBuilder for bytes;

    /// @notice The address of the wallet beacon should not change for this upgrade pattern
    address public walletBeacon;

    /// @notice The address of the operator beacon should not change for this upgrade pattern
    address public operatorBeacon;

    /// @notice  Flag if this SnickerdoodleWallet factory is the source chain
    bool public isSourceChain;

    /// @notice Tracks a deployed Snickerdoodle wallet proxy address to an owner
    /// @dev Functions as a claim lock, confirming that the user has deployed it on the source chain and claimed it on the destination chain
    mapping(address => WalletParams)
        public deployedSnickerdoodleWalletAddressToOwner;

    /// @notice Tracks a deployed OperatorGateway address to its parameters
    mapping(address => OperatorGatewayParams)
        public deployedOperatorGatewayAddressToParams;

    /// @notice Layer zero message types to support sending and receiving different messages
    enum MessageType {
        ClaimWalletOnDestinationChain,
        ClaimOperatorGatewayOnDestinationChain
    }

    /// @notice Emitted when a Snickerdoodle wallet proxy contract is deployed
    event SnickerdoodleWalletCreated(
        address indexed SnickerdoodleWallet,
        string name
    );

    /// @notice Emitted when an OperatorGateway contract is deployed
    event OperatorGatewayDeployed(
        address indexed OperatorGateway,
        string domain
    );

    /// @dev OApp inherits OAppCore which inherits OZ's Ownable
    function initialize(
        address _layerZeroEndpoint,
        address _owner
    ) public payable initializer {
        __OApp_init(_layerZeroEndpoint, _owner);

        /// If the chain id is Avalanche / Fuji, flag that it is the source chain
        if (block.chainid == 43113 || block.chainid == 43114) {
            isSourceChain = true;
        }
    }

    /// @notice Deploys the wallet implementation and its upgradeable beacon
    /// @dev This function can be called by anyone but can only be called one time
    /// @dev moved to a stand alone function to meet deployment gas limits
    function initWalletFactory() external {
        /// Deploy an instance of a SnickerdoodleWallet to use as the implementation contract
        /// the Deployer address (this) must be the same on every network to get the same addresses
        SnickerdoodleWallet snickerdoodleWalletImpl = new SnickerdoodleWallet{
            salt: keccak256("snickerdoodle-wallet-impl")
        }();
        snickerdoodleWalletImpl.initialize(
            owner(),
            P256Key(
                0x000000000000000000000000000000000000000000000000000000000000dEaD,
                0x000000000000000000000000000000000000000000000000000000000000dEaD,
                "1337"
            )
        );

        /// Deploy the Upgradeable Beacon that points to the implementation SnickerdoodleWallet contract address
        /// https://docs.openzeppelin.com/contracts/3.x/api/proxy#UpgradeableProxy
        /// All deployed proxies can be upgraded by changing the implementation address in the beacon
        UpgradeableBeacon _upgradeableBeacon = new UpgradeableBeacon{
            salt: keccak256("snickerdoodle-wallet-beacon")
        }(address(snickerdoodleWalletImpl), owner());
        walletBeacon = address(_upgradeableBeacon);
    }

    /// @notice Deploys the operator implementation and its upgradeable beacon
    /// @dev This function can be called by anyone but can only be called one time
    /// @dev moved to a stand alone function to meet deployment gas limits
    function initOperatorFactory() external {
        /// Deploy an instance of a SnickerdoodleWallet to use as the implementation contract
        /// the Deployer address (this) must be the same on every network to get the same addresses
        OperatorGateway operatorGatewayImpl = new OperatorGateway{
            salt: keccak256("snickerdoodle-operator-impl")
        }();
        address[] memory dummyOperators = new address[](1);
        dummyOperators[0] = owner();
        operatorGatewayImpl.initialize(dummyOperators, address(this));

        /// Deploy the Upgradeable Beacon that points to the implementation SnickerdoodleWallet contract address
        /// https://docs.openzeppelin.com/contracts/3.x/api/proxy#UpgradeableProxy
        /// All deployed proxies can be upgraded by changing the implementation address in the beacon
        UpgradeableBeacon _upgradeableBeacon = new UpgradeableBeacon{
            salt: keccak256("snickerdoodle-operator-beacon")
        }(address(operatorGatewayImpl), owner());
        operatorBeacon = address(_upgradeableBeacon);
    }

    function deploySnickerdoodleWalletProxies(
        string[] calldata names,
        P256Key[] calldata _p256Keys
    ) public {
        require(
            names.length == _p256Keys.length,
            "SnickerdoodleWalletFactory: Names and P256 points length mismatch"
        );

        for (uint256 i = 0; i < names.length; i++) {
            deploySnickerdoodleWalletProxy(names[i], _p256Keys[i]);
        }
    }

    /// @notice Deploys a Beacon Proxy with name keyword and salt to create an upgradeable SnickerdoodleWallet
    /// @dev https://docs.openzeppelin.com/contracts/5.x/api/proxy#UpgradeableBeacon
    /// @param username a string used to name the SnickerdoodleWallet deployed to make it easy to look up (hashed to create salt)
    /// @param p256Key a new 256 key used to deploy a user wallet; includes the keyId, x, and y coordinates.
    function deploySnickerdoodleWalletProxy(
        string calldata username,
        P256Key calldata p256Key
    ) public {
        OperatorGatewayParams
            memory operatorParams = deployedOperatorGatewayAddressToParams[
                msg.sender
            ];
        require(
            bytes(operatorParams.domain).length > 0,
            "SnickerdoodleWalletFactory: Caller not a valid operator"
        );
        string memory name = string.concat(username, ".", operatorParams.domain);

        /// these variables are set once we know if we are on the source or destination chain
        address operator;
        string memory saltString;
        P256Key memory newKey;

        if (isSourceChain) {
            /// if we are on the source chain, store wallet details for relaying to other chains
            saltString = name;
            operator = msg.sender;
            newKey = p256Key;

            deployedSnickerdoodleWalletAddressToOwner[
                computeProxyAddress(name, walletBeacon)
            ] = WalletParams(msg.sender, name, p256Key);
        } else {
            /// if we are on the destination chain, check that the wallet has been created on the source chain
            WalletParams
                memory params = deployedSnickerdoodleWalletAddressToOwner[
                    computeProxyAddress(name, walletBeacon)
                ];
            require(
                keccak256(abi.encodePacked(params.name)) ==
                    keccak256(abi.encodePacked(name)),
                "SnickerdoodleWalletFactory: Snickerdoodle wallet with selected name has not been created on the source chain"
            );
            operator = params.operator;
            saltString = params.name;
            newKey = params.p256Key;
        }

        /// NOTE: The address of the proxy contract will never change after deployment.
        /// The initializer is called after deployment so that the proxy address does not depend on the initializer's arguments.
        /// This means only the salt value is used to calculate the proxy address.
        BeaconProxy proxy = new BeaconProxy{
            salt: keccak256(abi.encodePacked(saltString))
        }(walletBeacon, "");
        SnickerdoodleWallet(address(proxy)).initialize(operator, newKey);

        emit SnickerdoodleWalletCreated(address(proxy), saltString);
    }

    /// @notice Deploys a Beacon Proxy with name keyword and salt to create an upgradeable OperatorGateway
    /// @dev https://docs.openzeppelin.com/contracts/5.x/api/proxy#UpgradeableBeacon
    /// @param domain a string used for the top-level domain of user wallets created by this operator
    /// @param operatorAccounts addresses to add as operators to the OperatorGateway
    function deployOperatorGatewayProxy(
        string calldata domain,
        address[] calldata operatorAccounts
    ) external {
        /// these variables are set once we know if we are on the source or destination chain
        string memory saltString;
        address[] memory newOperatorAccounts;

        if (isSourceChain) {
            /// if we are on the source chain, store wallet details for relaying to other chains
            deployedOperatorGatewayAddressToParams[
                computeProxyAddress(domain, operatorBeacon)
            ] = OperatorGatewayParams(domain, operatorAccounts);
            saltString = domain;
            newOperatorAccounts = operatorAccounts;
        } else {
            /// if we are on the destination chain, check that the wallet has been created on the source chain
            OperatorGatewayParams
                memory params = deployedOperatorGatewayAddressToParams[
                    computeProxyAddress(domain, operatorBeacon)
                ];
            require(
                keccak256(abi.encodePacked(params.domain)) ==
                    keccak256(abi.encodePacked(domain)),
                "SnickerdoodleWalletFactory: Snickerdoodle wallet with selected name has not been created on the source chain"
            );
            saltString = params.domain;
            newOperatorAccounts = params.operatorAccounts;
        }

        /// NOTE: The address of the proxy contract will never change after deployment.
        /// The initializer is called after deployment so that the proxy address does not depend on the initializer's arguments.
        /// This means only the salt value is used to calculate the proxy address.
        BeaconProxy proxy = new BeaconProxy{
            salt: keccak256(abi.encodePacked(saltString))
        }(operatorBeacon, "");
        OperatorGateway(address(proxy)).initialize(
            newOperatorAccounts,
            address(this)
        );

        emit OperatorGatewayDeployed(address(proxy), saltString);
    }

    /// @notice Sends a message from the source to the destination chain to claim a Snickerdoodle wallet address.
    /// @dev Call quoteClaimWalletOnDestinationChain() and include it's fee value as part of the msg.value for this function
    /// @dev If the destination chain has not been set as a peer contract, it will error NoPeer(_destinationChainEID)
    /// @param _destinationChainEID Layer Zero Endpoint id for the target destination chain
    /// @param _name a string used to name the SnickerdoodleWallet deployed to make it easy to look up (hashed to create salt)
    /// @param _gas Gas for message execution options, refer to : https://docs.layerzero.network/v2/developers/evm/oapp/overview#message-execution-options
    function reserveWalletOnDestinationChain(
        uint32 _destinationChainEID,
        string calldata _name,
        uint128 _gas
    ) external payable {
        require(
            isSourceChain,
            "SnickerdoodleWalletFactory: Snickerdoodle wallet only claimable via source chain"
        );
        /// Compute the Snickerdoodle wallet proxy address
        address proxy = computeProxyAddress(_name, walletBeacon);

        // Check that the details of the proxy address match the provided details
        WalletParams
            memory ownerDetails = deployedSnickerdoodleWalletAddressToOwner[
                proxy
            ];

        /// TODO: don't know if this check is actually necessary
        require(
            ownerDetails.operator == msg.sender,
            "SnickerdoodleWalletFactory: Operator of provided wallet name does not match caller"
        );

        /// Encodes the message before invoking _lzSend.
        bytes memory _payload = abi.encode(
            uint8(MessageType.ClaimWalletOnDestinationChain),
            abi.encode(
                WalletParams(
                    ownerDetails.operator,
                    _name,
                    ownerDetails.p256Key
                ),
                proxy
            )
        );

        /// Send a message to layer zero to the destination chain
        _lzSend(
            _destinationChainEID,
            _payload,
            OptionsBuilder.newOptions().addExecutorLzReceiveOption(_gas, 0),
            // Fee in native gas and ZRO token.
            MessagingFee(msg.value, 0),
            // Refund address in case of failed source message.
            payable(msg.sender)
        );
    }

    /// @notice Sends a message from the source to the destination chain to claim an operator gateway.
    /// @dev Call quoteClaimWalletOnDestinationChain() and include it's fee value as part of the msg.value for this function
    /// @dev If the destination chain has not been set as a peer contract, it will error NoPeer(_destinationChainEID)
    /// @param _destinationChainEID Layer Zero Endpoint id for the target destination chain
    /// @param _domain a string used by the gateway for user domain names
    /// @param _gas Gas for message execution options, refer to : https://docs.layerzero.network/v2/developers/evm/oapp/overview#message-execution-options
    function reserveOperatorGatewayOnDestinationChain(
        uint32 _destinationChainEID,
        string calldata _domain,
        uint128 _gas
    ) external payable {
        require(
            isSourceChain,
            "SnickerdoodleWalletFactory: Snickerdoodle wallet only claimable via source chain"
        );
        /// Compute the Snickerdoodle wallet proxy address
        address proxy = computeProxyAddress(_domain, operatorBeacon);

        // Check that the details of the proxy address match the provided details
        OperatorGatewayParams
            memory operatorDetails = deployedOperatorGatewayAddressToParams[
                proxy
            ];

        require(
            keccak256(abi.encodePacked(operatorDetails.domain)) ==
                keccak256(abi.encodePacked(_domain)),
            "SnickerdoodleWalletFactory: Domains do not match"
        );

        /// Encodes the message before invoking _lzSend.
        bytes memory _payload = abi.encode(
            uint8(MessageType.ClaimOperatorGatewayOnDestinationChain),
            abi.encode(
                OperatorGatewayParams(
                    operatorDetails.domain,
                    operatorDetails.operatorAccounts
                ),
                proxy
            )
        );

        /// Send a message to layer zero to the destination chain
        _lzSend(
            _destinationChainEID,
            _payload,
            OptionsBuilder.newOptions().addExecutorLzReceiveOption(_gas, 0),
            // Fee in native gas and ZRO token.
            MessagingFee(msg.value, 0),
            // Refund address in case of failed source message.
            payable(msg.sender)
        );
    }

    /// @notice Compute the address that a Proxy will be/is deployed to
    /// @param salt the string that was used for the SnickerdoodleWallet salt value
    function computeProxyAddress(
        string memory salt,
        address beaconAddress
    ) public view returns (address) {
        return
            Create2.computeAddress(
                keccak256(abi.encodePacked(salt)),
                keccak256(
                    abi.encodePacked(
                        type(BeaconProxy).creationCode,
                        abi.encode(beaconAddress, "")
                    )
                )
            );
    }

    /// @notice Estimating the fee for to send a message to claim a Snickerdoodle wallet on destination chain
    function quoteClaimWalletOnDestinationChain(
        uint32 _dstEid,
        string calldata _name,
        uint128 _gas
    ) external view returns (uint256 nativeFee, uint256 lzTokenFee) {
        address walletAddress = computeProxyAddress(_name, walletBeacon);
        bytes memory messageData = abi.encode(
            deployedSnickerdoodleWalletAddressToOwner[walletAddress],
            walletAddress
        );

        return
            quote(
                _dstEid,
                uint8(MessageType.ClaimWalletOnDestinationChain),
                messageData,
                OptionsBuilder.newOptions().addExecutorLzReceiveOption(_gas, 0),
                false
            );
    }

    /// @notice Estimating the fee for to send a message to claim a Snickerdoodle wallet on destination chain
    function quoteClaimOperatorGatewayOnDestinationChain(
        uint32 _dstEid,
        string calldata _domain,
        uint128 _gas
    ) external view returns (uint256 nativeFee, uint256 lzTokenFee) {
        address gatewayAddress = computeProxyAddress(_domain, operatorBeacon);
        bytes memory messageData = abi.encode(
            deployedOperatorGatewayAddressToParams[gatewayAddress],
            gatewayAddress
        );

        return
            quote(
                _dstEid,
                uint8(MessageType.ClaimWalletOnDestinationChain),
                messageData,
                OptionsBuilder.newOptions().addExecutorLzReceiveOption(_gas, 0),
                false
            );
    }

    /// @notice Returns the information of the owner of a deployed snickerdoodle wallet
    function getSnickerdoodleWalletParams(
        address _snickerdoodleWalletAddress
    ) external view returns (WalletParams memory) {
        return
            deployedSnickerdoodleWalletAddressToOwner[
                _snickerdoodleWalletAddress
            ];
    }

    /// @dev Quotes the gas needed to pay for the full omnichain transaction.
    /// @param _dstEid Destination chain's endpoint ID.
    /// @param _messageType Message type
    /// @param _messageData Message being passed by LayerZero.
    /// @param _options Message execution options (e.g., for sending gas to destination).
    /// @param _payInLzToken To pay in LZ token or not
    /// @return nativeFee Estimated gas fee in native gas.
    /// @return lzTokenFee Estimated gas fee in ZRO token.
    function quote(
        uint32 _dstEid,
        uint8 _messageType,
        bytes memory _messageData,
        bytes memory _options,
        bool _payInLzToken
    ) internal view returns (uint256 nativeFee, uint256 lzTokenFee) {
        // Prepare the message payload based on the message type
        bytes memory _payload = abi.encode(_messageType, _messageData);

        // Get the estimated fees
        MessagingFee memory fee = _quote(
            _dstEid,
            _payload,
            _options,
            _payInLzToken
        );
        return (fee.nativeFee, fee.lzTokenFee);
    }

    /// @notice Receives a message from the source chain.
    /// @dev Requires override to inherit OApp.
    /// @param _origin Information of the message's origin
    /// @param _guid Id for the receiving message
    /// @param _payload Message execution options (e.g., for sending gas to destination).
    function _lzReceive(
        Origin calldata _origin,
        bytes32 _guid,
        bytes calldata _payload,
        address, // Executor address as specified by the OApp.
        bytes calldata // Any extra data or options to trigger on receipt.
    ) internal override {
        // Decode the message type
        (uint8 messageType, bytes memory messageData) = abi.decode(
            _payload,
            (uint8, bytes)
        );

        // Handle the message type accordingly
        if (messageType == uint8(MessageType.ClaimWalletOnDestinationChain)) {
            _handleClaimWalletOnDestinationChain(messageData);
        } else if (
            messageType ==
            uint8(MessageType.ClaimOperatorGatewayOnDestinationChain)
        ) {
            _handleClaimOperatorGatewayOnDestinationChain(messageData);
        } else {
            revert("SnickerdoodleWalletFactory: Unknown message type");
        }
    }

    /// @notice Registers the owner of a deployed Snickerdoodle wallet that was deployed on the source chain
    /// @param messageData Data containing the owner details and Snickerdoodle wallet address
    function _handleClaimWalletOnDestinationChain(
        bytes memory messageData
    ) internal {
        /// Decode the message
        (WalletParams memory walletParams, address walletAddress) = abi.decode(
            messageData,
            (WalletParams, address)
        );

        /// Assign the deployed wallet to the owner
        /// After claiming on the destination chain, deploySnickerdoodleWalletProxy will work for this owner and name combination
        deployedSnickerdoodleWalletAddressToOwner[walletAddress] = walletParams;
    }

    /// @notice Registers the owner of a deployed Snickerdoodle wallet that was deployed on the source chain
    /// @param messageData Data containing the owner details and Snickerdoodle wallet address
    function _handleClaimOperatorGatewayOnDestinationChain(
        bytes memory messageData
    ) internal {
        /// Decode the message
        (
            OperatorGatewayParams memory operatorGatewayParams,
            address gatewayAddress
        ) = abi.decode(messageData, (OperatorGatewayParams, address));

        /// Assign the deployed wallet to the owner
        /// After claiming on the destination chain, deploySnickerdoodleWalletProxy will work for this owner and name combination
        deployedOperatorGatewayAddressToParams[
            gatewayAddress
        ] = operatorGatewayParams;
    }
}
