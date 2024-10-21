// SPDX-License-Identifier: MIT

pragma solidity ^0.8.24;
import "hardhat/console.sol";

import "@openzeppelin/contracts/utils/Create2.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import {BeaconProxy} from "@openzeppelin/contracts/proxy/beacon/BeaconProxy.sol";
import {UpgradeableBeacon} from "@openzeppelin/contracts/proxy/beacon/UpgradeableBeacon.sol";
import {Origin, MessagingFee} from "@layerzerolabs/lz-evm-oapp-v2/contracts/oapp/OApp.sol";
import {OptionsBuilder} from "@layerzerolabs/lz-evm-oapp-v2/contracts/oapp/libs/OptionsBuilder.sol";
import {OAppUpgradeable} from "../oapp-upgradeable/OAppUpgradeable.sol";

import "./OperatorGateway.sol";
import "./SnickerdoodleWallet.sol";
import "./Structs.sol";

contract SnickerdoodleFactory is OAppUpgradeable {
    /// @notice Layer Zero's option to support building the options param within the contract
    using OptionsBuilder for bytes;

    /// @notice  Flag if this SnickerdoodleWallet factory is the source chain
    bool public isSourceChain;

    /// @notice The address of the wallet beacon should not change for this upgrade pattern
    address public walletBeacon;

    /// @notice The address of the operator beacon should not change for this upgrade pattern
    address public gatewayBeacon;

    /// @notice Tracks the hash of ownership parameters of a user wallet for network bridgings
    mapping(address => bytes32) walletToHash;

    /// @notice Tracks the hash of ownership parameters of an operator gateway for network bridgings
    mapping(address => bytes32) public operatorToHash;

    /// @notice Tracks the domain that belongs to an operator
    mapping(address => string) public operatorToDomain;

    /// @notice Layer zero message types to support sending and receiving different messages
    enum MessageType {
        AuthorizeWalletOnDestinationChain,
        AuthorizeOperatorGatewayOnDestinationChain
    }

    /// @notice Emitted when a Snickerdoodle wallet proxy contract is deployed
    event WalletCreated(address indexed wallet, string name);

    /// @notice Emitted when an OperatorGateway contract is deployed
    event OperatorGatewayDeployed(
        address indexed OperatorGateway,
        string domain
    );

    error ArrayLengthMismatch(uint a, uint b);
    error SourceChainMethodOnly(uint chainId);
    error InvalidOperator(address operator);
    error EntityNotClaimedOnSouceChain(string entity);
    error InvalidMessageType(uint8 messageType);

    /// @dev OApp inherits OAppCore which inherits OZ's Ownable
    function initialize(
        address _layerZeroEndpoint,
        address _owner,
        address _walletBeacon,
        address _gatewayBeacon
    ) public payable initializer {
        __OApp_init(_layerZeroEndpoint, _owner);

        __Ownable_init(_owner);

        /// If the chain id is Avalanche / Fuji, flag that it is the source chain
        if (
            block.chainid == 43113 ||
            block.chainid == 43114 ||
            block.chainid == 31337
        ) {
            isSourceChain = true;
        }

        walletBeacon = _walletBeacon;
        gatewayBeacon = _gatewayBeacon;
    }

    function deployWalletProxies(
        string[] calldata usernames,
        P256Key[][] calldata _p256Keys,
        address[][] calldata evmAccounts
    ) public {
        require(
            usernames.length == _p256Keys.length,
            ArrayLengthMismatch(usernames.length, _p256Keys.length)
        );
        require(
            _p256Keys.length == _p256Keys.length,
            ArrayLengthMismatch(_p256Keys.length, evmAccounts.length)
        );

        for (uint256 i = 0; i < usernames.length; i++) {
            deployWalletProxy(usernames[i], _p256Keys[i], evmAccounts[i]);
        }
    }

    /// @notice Deploys a Beacon Proxy with name keyword and salt to create an upgradeable SnickerdoodleWallet
    /// @dev https://docs.openzeppelin.com/contracts/5.x/api/proxy#UpgradeableBeacon
    /// @param username a string that will be prepended to the calling operator's domain to create a unique name for a create2 salt
    /// @param p256Keys a new 256 key used to deploy a user wallet; includes the keyId, x, and y coordinates.
    /// @param evmAccounts addresses to add as operators to the OperatorGateway
    function deployWalletProxy(
        string calldata username,
        P256Key[] calldata p256Keys,
        address[] calldata evmAccounts
    ) public {
        string memory domain = operatorToDomain[msg.sender];
        require(bytes(domain).length > 0, InvalidOperator(msg.sender));

        string memory name = string.concat(username, ".", domain);
        address proxyAddress = computeProxyAddress(name, walletBeacon);
        (string memory keyIds, bytes32[] memory xs, bytes32[] memory ys) = _p256KeyArrayToArrays(
            p256Keys
        );
        if (isSourceChain) {
            walletToHash[proxyAddress] = keccak256(
                abi.encodePacked(
                    msg.sender,
                    name,
                    keyIds,
                    xs,
                    ys,
                    evmAccounts
                )
            );
        } else {
            require(
                walletToHash[proxyAddress] ==
                    keccak256(
                        abi.encodePacked(
                            msg.sender,
                            name,
                            keyIds,
                            xs,
                            ys,
                            evmAccounts
                        )
                    ),
                EntityNotClaimedOnSouceChain(name)
            );
        }

        /// NOTE: The address of the proxy contract will never change after deployment.
        /// The initializer is called after deployment so that the proxy address does not depend on the initializer's arguments.
        /// This means only the salt value is used to calculate the proxy address.
        BeaconProxy proxy = new BeaconProxy{
            salt: keccak256(abi.encodePacked(name))
        }(walletBeacon, "");
        SnickerdoodleWallet(payable(address(proxy))).initialize(
            msg.sender,
            p256Keys,
            evmAccounts
        );

        emit WalletCreated(address(proxy), name);
    }

    /// @notice Deploys a Beacon Proxy with name keyword and salt to create an upgradeable OperatorGateway
    /// @dev if a domain has already been claimed, this function will revert
    /// @param domain a string used for the top-level domain of user wallets created by this operator
    /// @param operatorAccounts addresses to add as operators to the OperatorGateway
    function deployOperatorGatewayProxy(
        string calldata domain,
        address[] calldata operatorAccounts
    ) external {
        address proxyAddress = computeProxyAddress(domain, gatewayBeacon);
        if (isSourceChain) {
            operatorToHash[proxyAddress] = keccak256(
                abi.encodePacked(domain, operatorAccounts)
            );
        } else {
            require(
                keccak256(abi.encodePacked(domain, operatorAccounts)) ==
                    operatorToHash[proxyAddress],
                EntityNotClaimedOnSouceChain(domain)
            );
        }
        operatorToDomain[proxyAddress] = domain;

        /// NOTE: The address of the proxy contract will never change after deployment.
        /// The initializer is called after deployment so that the proxy address does not depend on the initializer's arguments.
        /// This means only the salt value is used to calculate the proxy address.
        BeaconProxy proxy = new BeaconProxy{
            salt: keccak256(abi.encodePacked(domain))
        }(gatewayBeacon, "");
        OperatorGateway(payable(proxy)).initialize(
            operatorAccounts,
            address(this)
        );

        emit OperatorGatewayDeployed(address(proxy), domain);
    }

    /// @notice A batch function to authorize multiple wallets on the destination chain in one call
    /// @param _destinationChainEID Layer Zero Endpoint id for the target destination chain
    /// @param usernames an array of strings used to name the SnickerdoodleWallet deployed to make it easy to look up (hashed to create salt)
    /// @param _gas Gas for message execution options, refer to : https://docs.layerzero.network/v2/developers/evm/oapp/overview#message-execution-options
    function authorizeWalletsOnDestinationChain(
        uint32 _destinationChainEID,
        string[] calldata usernames,
        uint128 _gas
    ) external payable {
        require(isSourceChain, SourceChainMethodOnly(block.chainid));

        for (uint256 i = 0; i < usernames.length; i++) {
            authorizeWalletOnDestinationChain(
                _destinationChainEID,
                usernames[i],
                _gas
            );
        }
    }

    /// @notice Sends a message from the source to the destination chain to authorize a Snickerdoodle wallet address.
    /// @dev Call quoteAuthorizeWalletOnDestinationChain() and include it's fee value as part of the msg.value for this function
    /// @dev If the destination chain has not been set as a peer contract, it will error NoPeer(_destinationChainEID)
    /// @param _destinationChainEID Layer Zero Endpoint id for the target destination chain
    /// @param username a string used to name the SnickerdoodleWallet deployed to make it easy to look up (hashed to create salt)
    /// @param _gas Gas for message execution options, refer to : https://docs.layerzero.network/v2/developers/evm/oapp/overview#message-execution-options
    function authorizeWalletOnDestinationChain(
        uint32 _destinationChainEID,
        string calldata username,
        uint128 _gas
    ) public payable {
        require(isSourceChain, SourceChainMethodOnly(block.chainid));

        /// look up the operator details for the caller
        string memory domain = operatorToDomain[msg.sender];
        require(bytes(domain).length > 0, InvalidOperator(msg.sender));

        /// Compute the wallet proxy address
        string memory name = string.concat(username, ".", domain);
        address proxyAddress = computeProxyAddress(name, walletBeacon);

        // Check that the details of the proxy address match the provided details
        bytes32 walletHash = walletToHash[proxyAddress];
        require(walletHash != bytes32(0), EntityNotClaimedOnSouceChain(name));

        /// Encodes the message before invoking _lzSend.
        bytes memory _payload = abi.encode(
            uint8(MessageType.AuthorizeWalletOnDestinationChain),
            abi.encode(walletHash, proxyAddress)
        );

        /// Send a message to layer zero to the destination chain
        _lzSend(
            _destinationChainEID,
            _payload,
            OptionsBuilder.newOptions().addExecutorLzReceiveOption(_gas, 0),
            // Fee in native gas and ZRO token.
            MessagingFee(msg.value, 0),
            // Refund address in case of failed source message.
            // To void fund getting into the Operator Gateway, send it back to the caller
            payable(tx.origin)
        );
    }

    /// @notice Sends a message from the source to the destination chain to authorize an operator gateway.
    /// @dev Call quoteAuthorizeWalletOnDestinationChain() and include it's fee value as part of the msg.value for this function
    /// @dev If the destination chain has not been set as a peer contract, it will error NoPeer(_destinationChainEID)
    /// @param _destinationChainEID Layer Zero Endpoint id for the target destination chain
    /// @param domain a string used by the gateway for user domain names
    /// @param _gas Gas for message execution options, refer to : https://docs.layerzero.network/v2/developers/evm/oapp/overview#message-execution-options
    function authorizeGatewayOnDestinationChain(
        uint32 _destinationChainEID,
        string calldata domain,
        uint128 _gas
    ) external payable {
        require(isSourceChain, SourceChainMethodOnly(block.chainid));
        /// Compute the Snickerdoodle wallet proxy address
        address proxyAddress = computeProxyAddress(domain, gatewayBeacon);
        bytes32 operatorHash = operatorToHash[proxyAddress];
        require(
            operatorHash != bytes32(0),
            EntityNotClaimedOnSouceChain(domain)
        );

        /// Encodes the message before invoking _lzSend.
        bytes memory _payload = abi.encode(
            uint8(MessageType.AuthorizeOperatorGatewayOnDestinationChain),
            abi.encode(operatorHash, proxyAddress)
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
    /// @param beaconAddress the address of the beacon contract
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

    /// @notice Estimating the fee for to send a message to authorize a Snickerdoodle wallet on destination chain
    function quoteAuthorizeWalletOnDestinationChain(
        uint32 _dstEid,
        string calldata username,
        address operator,
        uint128 _gas
    ) external view returns (uint256 nativeFee, uint256 lzTokenFee) {
        string memory domain = operatorToDomain[operator];
        require(bytes(domain).length > 0, InvalidOperator(operator));

        // compute the wallet proxy address
        string memory name = string.concat(username, ".", domain);
        address walletAddress = computeProxyAddress(name, walletBeacon);
        bytes memory messageData = abi.encode(
            walletToHash[walletAddress],
            walletAddress
        );

        return
            quote(
                _dstEid,
                uint8(MessageType.AuthorizeWalletOnDestinationChain),
                messageData,
                OptionsBuilder.newOptions().addExecutorLzReceiveOption(_gas, 0),
                false
            );
    }

    /// @notice Estimating the fee for to send a message to authorize a Snickerdoodle wallet on destination chain
    function quoteAuthorizeOperatorGatewayOnDestinationChain(
        uint32 _dstEid,
        string calldata domain,
        uint128 _gas
    ) external view returns (uint256 nativeFee, uint256 lzTokenFee) {
        address gatewayAddress = computeProxyAddress(domain, gatewayBeacon);
        bytes memory messageData = abi.encode(
            operatorToHash[gatewayAddress],
            gatewayAddress
        );

        return
            quote(
                _dstEid,
                uint8(MessageType.AuthorizeWalletOnDestinationChain),
                messageData,
                OptionsBuilder.newOptions().addExecutorLzReceiveOption(_gas, 0),
                false
            );
    }

    /// @dev Converts a p256Key array into keyId, x, and y arrays for easier hashing
    function _p256KeyArrayToArrays(P256Key[] memory p256Keys)
        internal
        pure
        returns (string memory, bytes32[] memory, bytes32[] memory)
    {
        string memory keyIds = ""; // string arrays are not compatible with abi.encodePacked
        bytes32[] memory x = new bytes32[](p256Keys.length);
        bytes32[] memory y = new bytes32[](p256Keys.length);

        for (uint256 i = 0; i < p256Keys.length; i++) {
            keyIds = string.concat(keyIds,  p256Keys[i].keyId);
            x[i] = p256Keys[i].x;
            y[i] = p256Keys[i].y;
        }

        return (keyIds, x, y);
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
        if (
            messageType == uint8(MessageType.AuthorizeWalletOnDestinationChain)
        ) {
            _handleAuthorizeWalletOnDestinationChain(messageData);
        } else if (
            messageType ==
            uint8(MessageType.AuthorizeOperatorGatewayOnDestinationChain)
        ) {
            _handleAuthorizeOperatorGatewayOnDestinationChain(messageData);
        } else {
            revert InvalidMessageType(messageType);
        }
    }

    /// @notice Registers the owner of a deployed Snickerdoodle wallet that was deployed on the source chain
    /// @param messageData Data containing the owner details and Snickerdoodle wallet address
    function _handleAuthorizeWalletOnDestinationChain(
        bytes memory messageData
    ) internal {
        /// Decode the message
        (bytes32 walletHash, address walletAddress) = abi.decode(
            messageData,
            (bytes32, address)
        );

        /// Assign the deployed wallet to the owner
        /// After reserving on the destination chain, deployWalletProxy will work for this owner and name combination
        walletToHash[walletAddress] = walletHash;
    }

    /// @notice Registers the owner of a deployed Snickerdoodle wallet that was deployed on the source chain
    /// @param messageData Data containing the owner details and Snickerdoodle wallet address
    function _handleAuthorizeOperatorGatewayOnDestinationChain(
        bytes memory messageData
    ) internal {
        /// Decode the message
        (bytes32 operatorHash, address gatewayAddress) = abi.decode(
            messageData,
            (bytes32, address)
        );

        /// Assign the deployed wallet to the owner
        /// After reserving on the destination chain, deployWalletProxy will work for this owner and name combination
        operatorToHash[gatewayAddress] = operatorHash;
    }
}
