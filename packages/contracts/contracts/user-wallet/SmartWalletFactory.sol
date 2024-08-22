// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.24;

import "./SmartWallet.sol";
import "@openzeppelin/contracts/utils/Create2.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import { BeaconProxy } from "@openzeppelin/contracts/proxy/beacon/BeaconProxy.sol";
import { UpgradeableBeacon } from "@openzeppelin/contracts/proxy/beacon/UpgradeableBeacon.sol";
import { OApp, Origin, MessagingFee } from "@layerzerolabs/lz-evm-oapp-v2/contracts/oapp/OApp.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { OptionsBuilder } from "@layerzerolabs/lz-evm-oapp-v2/contracts/oapp/libs/OptionsBuilder.sol";

contract SmartWalletFactory is OApp {

    /// @notice Layer Zero's option to support building the options param within the contract
    using OptionsBuilder for bytes;

    /// @notice Layer zero message types to support sending and receiving different messages
    enum MessageType {
        ClaimSmartWalletOnDestinationChain
    }

    /// @notice Emitted when a smart wallet proxy contract is deployed
    event SmartWalletCreated(address smartWallet);

    /// @notice The address of the beacon should never change for this upgrade pattern
    address public immutable beaconAddress;

    /// @notice  Flag if this smartWallet factory is the source chain
    bool public isSourceChain; 

    /// @notice Tracks a deployed smart wallet proxy address to an owner
    /// @dev Functions as a claim lock, confirming that the user has deployed it on the source chain and claimed it on the destination chain
    mapping(address => address) public deployedSmartWalletAddressToOwner; 

    /// @notice Tracks if an owner has deployed the smart wallet proxy on this chain's factory
    /// @dev eg. owner1 => wallet 1 => true
    ///                 => wallet 2 => false
    mapping(address => mapping(address => bool)) public ownerToSmartWalletDeployedFlag; 

    /// @dev OApp inherits OAppCore which inherits OZ's Ownable
    constructor(address _layerZeroEndpoint, address _owner) OApp(_layerZeroEndpoint, _owner) Ownable(_owner) payable {
       
        /// If the chain id is Avalanche / Fuji, flag that it is the source chain
        if (block.chainid == 43113 || block.chainid == 43114) {
            isSourceChain = true;
        } 

        /// Deploy an instance of a SmartWallet to use as the implementation contract
        SmartWallet smartWalletImpl = new SmartWallet();
        smartWalletImpl.initialize(payable(_owner));

        /// Deploy the Upgradeable Beacon that points to the implementation SmartWallet contract address
        /// https://docs.openzeppelin.com/contracts/3.x/api/proxy#UpgradeableProxy
        /// All deployed proxies can be upgraded by changing the implementation address in the beacon
        UpgradeableBeacon _upgradeableBeacon = new UpgradeableBeacon{salt: keccak256("create2-upgradeable-beacon")}(address(smartWalletImpl), _owner);
        beaconAddress = address(_upgradeableBeacon);
    }

    /// @notice Deploys a Beacon Proxy with name keyword and salt to create an upgradeable SmartWallet
    /// @dev https://docs.openzeppelin.com/contracts/5.x/api/proxy#UpgradeableBeacon
    /// @param _name a string used to name the SmartWallet deployed to make it easy to look up (hashed to create salt)
    /// @param _owner an address that will own the SmartWallet contract
    function deploySmartWalletUpgradeableBeacon(string memory _name, address payable _owner) public payable returns(address) {

        /// If called on a destination chain, check that the owner has created the smart wallet on the source chain
        if (!isSourceChain) {
            require(deployedSmartWalletAddressToOwner[computeSmartWalletProxyAddress(_name)] == _owner, "SmartWalletFactory: Smart wallet with selected name has not been created on the source chain");
        }

        /// NOTE: The address of the beacon contract will never change after deployment.
        /// The initializer is called after deployment so that the proxy address does not depend on the initializer's arguments.
        /// This means only the salt value is used to calculate the proxy address.
        BeaconProxy proxy = new BeaconProxy{salt: keccak256(abi.encodePacked(_name))}(beaconAddress,  '');
        SmartWallet(address(proxy)).initialize(_owner);

        /// Assign the deployed wallet to the owner here if it's a source chain
        /// If it's a destination chain, it will be handled in the _handleClaimSmartWalletOnDestinationChain()
        if (isSourceChain) {
            deployedSmartWalletAddressToOwner[address(proxy)] = _owner;
        }

        ownerToSmartWalletDeployedFlag[_owner][address(proxy)] = true;

        emit SmartWalletCreated(address(proxy));

        return address(proxy);
    }

    /// @notice Sends a message from the source to the destination chain to claim a smart wallet address.
    /// @dev Call quoteClaimSmartWalletOnDestinationChain() and include it's fee value as part of the msg.value for this function
    /// @dev If the destination chain has not been set as a peer contract, it will error NoPeer(_destinationChainEID)
    /// @param _destinationChainEID Layer Zero Endpoint id for the target destination chain
    /// @param _name a string used to name the SmartWallet deployed to make it easy to look up (hashed to create salt)
    /// @param _owner an address that will own the SmartWallet contract
    /// @param _gas Gas for message execution options, refer to : https://docs.layerzero.network/v2/developers/evm/oapp/overview#message-execution-options
    function claimSmartWalletOnDestinationChain(uint32 _destinationChainEID, string memory _name, address payable _owner, uint128 _gas) public payable returns(address) {

        require(isSourceChain, "SmartWalletFactory: Smart wallet only claimable via source chain");

        /// Compute the smart wallet proxy address
        address proxy = computeSmartWalletProxyAddress(_name);

        /// Encodes the message before invoking _lzSend.
        bytes memory _payload = abi.encode(uint8(MessageType.ClaimSmartWalletOnDestinationChain), abi.encode(_owner, proxy));

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

    /// @notice Compute the address that a SmartWallet will be/is deployed to
    /// @param name the string that was used for the SmartWallet salt value
    function computeSmartWalletAddress(string memory name) public view returns (address) {
        return Create2.computeAddress(keccak256(abi.encodePacked(name)), keccak256(type(SmartWallet).creationCode));
    }

    /// @notice Compute the address that a Proxy will be/is deployed to
    /// @param name the string that was used for the SmartWallet salt value
    function computeSmartWalletProxyAddress(string memory name) public view returns (address) {
        return Create2.computeAddress(keccak256(abi.encodePacked(name)), keccak256(abi.encodePacked(type(BeaconProxy).creationCode, abi.encode(beaconAddress,''))));
    }
    
    /// @notice send some ETH to the address that a SmartWallet will be/is deployed to 
    /// @param name the string used as the salt vault for the SmartWallet
    function sendValue(string memory name) external payable {
        address smartWalletAddress;
        
        smartWalletAddress = Create2.computeAddress(keccak256(abi.encodePacked(name)), keccak256(type(SmartWallet).creationCode));
        
        Address.sendValue(payable(smartWalletAddress), msg.value); 
    }

    // Estimating the fee for a Smart Wallet deployment message
    function quoteClaimSmartWalletOnDestinationChain(
        uint32 _dstEid, 
        address _owner, 
        address _smartWalletAddress, 
        bytes calldata _options
    ) external view returns (uint256 nativeFee, uint256 lzTokenFee) {
        bytes memory messageData = abi.encode(_owner, _smartWalletAddress);
        return quote(_dstEid, uint8(MessageType.ClaimSmartWalletOnDestinationChain), messageData, _options, false);
    }

    /// @dev Quotes the gas needed to pay for the full omnichain transaction.
    /// @param _dstEid Destination chain's endpoint ID.
    /// @param _messageType Message type
    /// @param _messageData Smart wallet address
    /// @param _options Message execution options (e.g., for sending gas to destination).
    /// @param _payInLzToken To pay in LZ token or not
    /// @return nativeFee Estimated gas fee in native gas.
    /// @return lzTokenFee Estimated gas fee in ZRO token.
    function quote(
        uint32 _dstEid, 
        uint8 _messageType, 
        bytes memory _messageData, 
        bytes calldata _options, 
        bool _payInLzToken 
    ) internal view returns (uint256 nativeFee, uint256 lzTokenFee) {
        // Prepare the message payload based on the message type
        bytes memory _payload = abi.encode(_messageType, _messageData);

        // Get the estimated fees
        MessagingFee memory fee = _quote(_dstEid, _payload, _options, _payInLzToken);
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
        address,  // Executor address as specified by the OApp.
        bytes calldata  // Any extra data or options to trigger on receipt.
    ) internal override {

        // Decode the message type
        (uint8 messageType, bytes memory messageData) = abi.decode(_payload, (uint8, bytes));

        // Handle the message type accordingly
        if (messageType == uint8(MessageType.ClaimSmartWalletOnDestinationChain)) {
            _handleClaimSmartWalletOnDestinationChain(messageData);
        } else {
            revert("SmartWalletFactory: Unknown message type");
        }
    }

    /// @notice Registers the owner of a deployed smart wallet that was deployed on the source chain
    /// @param messageData Data containing the owner and smart wallet address
    function _handleClaimSmartWalletOnDestinationChain(bytes memory messageData) internal {
        
        /// Decode the message
        (address owner, address smartWalletAddress) = abi.decode(messageData, (address, address));

        /// Assign the deployed wallet to the owner
        /// After claiming on the destination chain, deploySmartWalletUpgradeableBeacon will work for this owner and name combination
        deployedSmartWalletAddressToOwner[smartWalletAddress] = owner; 
    }
}