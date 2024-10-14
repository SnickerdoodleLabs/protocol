// SPDX-License-Identifier: MIT

pragma solidity ^0.8.24;

import "./SnickerdoodleWallet.sol";
import "./P256Structs.sol";
import "@openzeppelin/contracts/utils/Create2.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import {BeaconProxy} from "@openzeppelin/contracts/proxy/beacon/BeaconProxy.sol";
import {UpgradeableBeacon} from "@openzeppelin/contracts/proxy/beacon/UpgradeableBeacon.sol";
import {OApp, Origin, MessagingFee} from "@layerzerolabs/lz-evm-oapp-v2/contracts/oapp/OApp.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {OptionsBuilder} from "@layerzerolabs/lz-evm-oapp-v2/contracts/oapp/libs/OptionsBuilder.sol";

contract SnickerdoodleWalletFactory is OApp {
    /// @notice Layer Zero's option to support building the options param within the contract
    using OptionsBuilder for bytes;

    /// @notice The address of the beacon should never change for this upgrade pattern
    address public immutable beaconAddress;

    /// @notice  Flag if this SnickerdoodleWallet factory is the source chain
    bool public isSourceChain;

    /// @notice Tracks operators and the keccak hash of their assigned user domain string
    mapping(address => bytes32) public operatorUserDomains;

    /// @notice Tracks a deployed Snickerdoodle wallet proxy address to an owner
    /// @dev Functions as a claim lock, confirming that the user has deployed it on the source chain and claimed it on the destination chain
    mapping(address => OperatorAndPoint)
        public deployedSnickerdoodleWalletAddressToOwner;

    /// @notice Layer zero message types to support sending and receiving different messages
    enum MessageType {
        ClaimSnickerdoodleWalletOnDestinationChain
    }

    /// @notice Emitted when a Snickerdoodle wallet proxy contract is deployed
    event SnickerdoodleWalletCreated(address indexed SnickerdoodleWallet, string name);

    /// @dev OApp inherits OAppCore which inherits OZ's Ownable
    constructor(
        address _layerZeroEndpoint,
        address _owner
    ) payable OApp(_layerZeroEndpoint, _owner) Ownable(_owner) {
        /// If the chain id is Avalanche / Fuji, flag that it is the source chain
        if (block.chainid == 43113 || block.chainid == 43114) {
            isSourceChain = true;
        }

        /// Deploy an instance of a SnickerdoodleWallet to use as the implementation contract
        /// the Deployer address (this) must be the same on every network to get the same addresses
        SnickerdoodleWallet SnickerdoodleWalletImpl = new SnickerdoodleWallet();
        SnickerdoodleWalletImpl.initialize(
            _owner,
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
            salt: keccak256("snickerdoodle-beacon")
        }(address(SnickerdoodleWalletImpl), _owner);
        beaconAddress = address(_upgradeableBeacon);
    }

    function deploySnickerdoodleWalletProxies(
        string[] calldata names,
        P256Key[] calldata _p256Keys
    ) public {
        require(names.length == _p256Keys.length, "SnickerdoodleWalletFactory: Names and P256 points length mismatch");

        for (uint256 i = 0; i < names.length; i++) {
            deploySnickerdoodleWalletProxy(names[i], _p256Keys[i]);
        }
    }

    /// @notice Deploys a Beacon Proxy with name keyword and salt to create an upgradeable SnickerdoodleWallet
    /// @dev https://docs.openzeppelin.com/contracts/5.x/api/proxy#UpgradeableBeacon
    /// @param name a string used to name the SnickerdoodleWallet deployed to make it easy to look up (hashed to create salt)
    /// @param p256Key a new 256 key used to deploy a user wallet; includes the keyId, x, and y coordinates. 
    function deploySnickerdoodleWalletProxy(
        string memory name,
        P256Key calldata p256Key
    ) public {
        /// If called on a destination chain, check that the owner has created the Snickerdoodle wallet on the source chain
        if (!isSourceChain) {
            require(
                deployedSnickerdoodleWalletAddressToOwner[
                    computeSnickerdoodleWalletProxyAddress(name)
                ].operator == msg.sender,
                "SnickerdoodleWalletFactory: Snickerdoodle wallet with selected name has not been created on the source chain"
            );
        }

        /// NOTE: The address of the proxy contract will never change after deployment.
        /// The initializer is called after deployment so that the proxy address does not depend on the initializer's arguments.
        /// This means only the salt value is used to calculate the proxy address.
        BeaconProxy proxy = new BeaconProxy{
            salt: keccak256(abi.encodePacked(name))
        }(beaconAddress, "");
        SnickerdoodleWallet(address(proxy)).initialize(
            msg.sender,
            p256Key
        );

        /// Assign the deployed wallet to the owner here if it's a source chain
        /// If it's a destination chain, it will be handled in the _handleClaimSnickerdoodleWalletOnDestinationChain()
        if (isSourceChain) {
            deployedSnickerdoodleWalletAddressToOwner[
                address(proxy)
            ] = OperatorAndPoint(msg.sender, p256Key);
        }

        emit SnickerdoodleWalletCreated(address(proxy), name);
    }

    /// @notice Sends a message from the source to the destination chain to claim a Snickerdoodle wallet address.
    /// @dev Call quoteClaimSnickerdoodleWalletOnDestinationChain() and include it's fee value as part of the msg.value for this function
    /// @dev If the destination chain has not been set as a peer contract, it will error NoPeer(_destinationChainEID)
    /// @param _destinationChainEID Layer Zero Endpoint id for the target destination chain
    /// @param _name a string used to name the SnickerdoodleWallet deployed to make it easy to look up (hashed to create salt)
    /// @param p256Key a new 256 key used to deploy a user wallet; includes the keyId, x, and y coordinates.
    /// @param _gas Gas for message execution options, refer to : https://docs.layerzero.network/v2/developers/evm/oapp/overview#message-execution-options
    function claimSnickerdoodleWalletOnDestinationChain(
        uint32 _destinationChainEID,
        string memory _name,
        P256Key memory p256Key,
        uint128 _gas
    ) external payable returns (address) {
        require(
            isSourceChain,
            "SnickerdoodleWalletFactory: Snickerdoodle wallet only claimable via source chain"
        );
        /// Compute the Snickerdoodle wallet proxy address
        address proxy = computeSnickerdoodleWalletProxyAddress(_name);

        // Check that the details of the proxy address match the provided details
        OperatorAndPoint memory ownerDetails = deployedSnickerdoodleWalletAddressToOwner[
            proxy
        ];

        require(ownerDetails.operator == msg.sender, "SnickerdoodleWalletFactory: Operator of provided wallet name does not match caller");
        require(ownerDetails.p256Key.x == p256Key.x, "SnickerdoodleWalletFactory: Point X of provided wallet name does not match of given _qx");
        require(ownerDetails.p256Key.y == p256Key.y, "SnickerdoodleWalletFactory: Point Y of provided wallet name does not match operator _qy ");
        require(keccak256(abi.encode(ownerDetails.p256Key.keyId)) == keccak256(abi.encode(p256Key.keyId)), "SnickerdoodleWalletFactory: Key id of provided wallet name does not match _keyId");

        /// Encodes the message before invoking _lzSend.
        bytes memory _payload = abi.encode(
            uint8(MessageType.ClaimSnickerdoodleWalletOnDestinationChain),
            abi.encode(OperatorAndPoint(msg.sender, p256Key), proxy)
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

    /// @notice Compute the address that a SnickerdoodleWallet will be/is deployed to
    /// @param name the string that was used for the SnickerdoodleWallet salt value
    function computeSnickerdoodleWalletAddress(
        string memory name
    ) public view returns (address) {
        return
            Create2.computeAddress(
                keccak256(abi.encodePacked(name)),
                keccak256(type(SnickerdoodleWallet).creationCode)
            );
    }

    /// @notice Compute the address that a Proxy will be/is deployed to
    /// @param name the string that was used for the SnickerdoodleWallet salt value
    function computeSnickerdoodleWalletProxyAddress(
        string memory name
    ) public view returns (address) {
        return
            Create2.computeAddress(
                keccak256(abi.encodePacked(name)),
                keccak256(
                    abi.encodePacked(
                        type(BeaconProxy).creationCode,
                        abi.encode(beaconAddress, "")
                    )
                )
            );
    }

    /// @notice Estimating the fee for to send a message to claim a Snickerdoodle wallet on destination chain
    function quoteClaimSnickerdoodleWalletOnDestinationChain(
        uint32 _dstEid,
        P256Key memory p256Key,
        address _snickerdoodleWalletAddress,
        uint128 _gas
    ) external view returns (uint256 nativeFee, uint256 lzTokenFee) {
        bytes memory messageData = abi.encode(
            OperatorAndPoint(msg.sender, p256Key),
            _snickerdoodleWalletAddress
        );

        return
            quote(
                _dstEid,
                uint8(MessageType.ClaimSnickerdoodleWalletOnDestinationChain),
                messageData,
                OptionsBuilder.newOptions().addExecutorLzReceiveOption(_gas, 0),
                false
            );
    }

    /// @notice Returns the information of the owner of a deployed snickerdoodle wallet
    function getSnickerdoodleWalletToOperatorOwnerPoint(
        address _snickerdoodleWalletAddress
    ) external view returns (OperatorAndPoint memory) {
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
        if (
            messageType ==
            uint8(MessageType.ClaimSnickerdoodleWalletOnDestinationChain)
        ) {
            _handleClaimSnickerdoodleWalletOnDestinationChain(messageData);
        } else {
            revert("SnickerdoodleWalletFactory: Unknown message type");
        }
    }

    /// @notice Registers the owner of a deployed Snickerdoodle wallet that was deployed on the source chain
    /// @param messageData Data containing the owner details and Snickerdoodle wallet address
    function _handleClaimSnickerdoodleWalletOnDestinationChain(
        bytes memory messageData
    ) internal {
        /// Decode the message
        (
            OperatorAndPoint memory operatorAndPoint,
            address snickerdoodleWalletAddress
        ) = abi.decode(messageData, (OperatorAndPoint, address));

        /// Assign the deployed wallet to the owner
        /// After claiming on the destination chain, deploySnickerdoodleWalletProxy will work for this owner and name combination
        deployedSnickerdoodleWalletAddressToOwner[
            snickerdoodleWalletAddress
        ] = operatorAndPoint;
    }
}
