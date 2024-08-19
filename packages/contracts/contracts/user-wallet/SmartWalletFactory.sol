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

    using OptionsBuilder for bytes;

    uint32 sourceChainEID = 40106;

    /// Layer zero message types to support sending and receiving different messages
    enum MessageType {
        SmartWalletDeployedOnSourceChain,
        FactoryDeployedOnDestinationChain
    }

    event SmartWalletCreated(address smartWallet);

    /// The address of the beacon should never change for this upgrade pattern
    address public immutable beaconAddress;

    /// Flag if this smartWallet factory is the source chain
    bool public isSourceChain = false; 

    /// Flag if this smartWallet factory is the source chain
    bool public deploymentAnnounced; 

    /// List of supported destination chains
    uint32[] public supportedDestinationChainEIDs;

    /// Mapping to store all the EIDs for supported chain ids
    /// @dev This only needs to be captured on the source chain since Layer Zero contracts do not have this info
    mapping(uint256 => uint32) public chainIdToEID;  

    // Tracks a deployed smart wallet address to an owner to log ownership on all chains 
    mapping(address => address) public deployedSmartWalletAddressToOwner; 

    // Tracks an owner to their deployed smart wallet addresses, this will confirm if the smart wallet has been deployed on this chain
    // eg. owner1 => wallet1 => true
    //            => wallet2 => true
    mapping(address => mapping(address => bool)) public ownerToDeployedSmartWalletAddressFlag; 
 
    /// @dev OApp inherits OAppCore which inherits OZ's Ownable
    constructor(address _layerZeroEndpoint, address _owner) OApp(_layerZeroEndpoint, _owner) Ownable(_owner) payable {
       
        // If the chain id is Avalanche / Fuji, flag that it is the source chain
        if (block.chainid == 43113 || block.chainid == 43114) {
            isSourceChain = true;
        } 

        // Deploy an instance of a SmartWallet to use as the implementation contract
        SmartWallet smartWalletImpl = new SmartWallet();
        smartWalletImpl.initialize(payable(_owner));

        // Deploy the Upgradeable Beacon that points to the implementation SmartWallet contract address
        // https://docs.openzeppelin.com/contracts/3.x/api/proxy#UpgradeableProxy
        // All deployed proxies can be upgraded by changing the implementation address in the beacon
        UpgradeableBeacon _upgradeableBeacon = new UpgradeableBeacon{salt: keccak256("create2-upgradeable-beacon")}(address(smartWalletImpl), _owner);
        beaconAddress = address(_upgradeableBeacon);
    }

    /// @notice Deploys a Beacon Proxy with name keyword and salt to create an upgradeable SmartWallet
    /// @dev https://docs.openzeppelin.com/contracts/5.x/api/proxy#UpgradeableBeacon
    /// @param _name a string used to name the SmartWallet deployed to make it easy to look up (hashed to create salt)
    /// @param _owner an address that will own the SmartWallet contract
    /// @param _gas Gas for message execution options, refer to : https://docs.layerzero.network/v2/developers/evm/oapp/overview#message-execution-options
    function deploySmartWalletUpgradeableBeacon(string memory _name, address payable _owner, uint128 _gas) public payable returns(address) {

        // If called on a destination chain, check that the owner has created the smart wallet on the source chain
        if (!isSourceChain) {
            require(deployedSmartWalletAddressToOwner[computeProxyAddress(_name)] == _owner, "SmartWalletFactory: Smart wallet with selected name has not been created on the source chain");
        }

        /// NOTE: The address of the beacon contract will never change after deployment. Additionally, in this example we call 
        /// the initializer after deployment so that the proxy address does not depend on the initializer arguments. The means you only
        /// need to use the salt value to calculate the proxy address.
        BeaconProxy proxy = new BeaconProxy{salt: keccak256(abi.encodePacked(_name))}(beaconAddress,  '');
        SmartWallet(address(proxy)).initialize(_owner);

        // If this is the source chain, once the factory is deployed, send a message to each supported destination chain
        // If it's a destination chain that is deploying this smart wallet, it does not need to send a message to the source chain
        if (isSourceChain) {
            for(uint256 i; i < supportedDestinationChainEIDs.length; i++) {
                _sendSmartWalletDeployedOnSourceChain(supportedDestinationChainEIDs[i], _owner, address(proxy), OptionsBuilder.newOptions().addExecutorLzReceiveOption(_gas, 0));
            }
            
            // Assign the deployed wallet to the owner here if it's a source chain
            // If it's a destination chain, it will be handled in the _handleSmartWalletDeployedOnSourceChain()
            deployedSmartWalletAddressToOwner[address(proxy)] = _owner;  
        }
        
        // Update to confirm that the owner has deployed on the destination chain
        ownerToDeployedSmartWalletAddressFlag[_owner][address(proxy)] = true;

        emit SmartWalletCreated(address(proxy));

        return address(proxy);
    }

    /// @notice Compute the address that a SmartWallet will be/is deployed to
    /// @param name the string that was used for the SmartWallet salt value
    function computeSmartWalletAddress(string memory name) public view returns (address) {
        return Create2.computeAddress(keccak256(abi.encodePacked(name)), keccak256(type(SmartWallet).creationCode));
    }

    /// @notice Compute the address that a Proxy will be/is deployed to
    /// @param name the string that was used for the SmartWallet salt value
    function computeProxyAddress(string memory name) public view returns (address) {
        return Create2.computeAddress(keccak256(abi.encodePacked(name)), keccak256(abi.encodePacked(type(BeaconProxy).creationCode, abi.encode(beaconAddress,''))));
    }
    
    /// @notice send some ETH to the address that a SmartWallet will be/is deployed to 
    /// @param name the string used as the salt vault for the SmartWallet
    function sendValue(string memory name) external payable {
        address smartWalletAddress;
        
        smartWalletAddress = Create2.computeAddress(keccak256(abi.encodePacked(name)), keccak256(type(SmartWallet).creationCode));
        
        Address.sendValue(payable(smartWalletAddress), msg.value); 
    }
     
    /// @notice Sends a message from the source to the destination chain that a smart wallet has been deployed.
    /// @param _dstEid Destination chain's endpoint ID.
    /// @param _owner Smart wallet owner
    /// @param _smartWalletAddress Smart wallet address
    /// @param _options Message execution options (e.g., for sending gas to destination).
    function _sendSmartWalletDeployedOnSourceChain(
        uint32 _dstEid,
        address _owner,
        address _smartWalletAddress,
        bytes memory _options
    ) internal {

        // Encodes the message before invoking _lzSend.
        bytes memory _payload = abi.encode(uint8(MessageType.SmartWalletDeployedOnSourceChain), abi.encode(_owner, _smartWalletAddress));

        // Send the message
        _lzSend(
            _dstEid,
            _payload,
            _options,
            // Fee in native gas and ZRO token.
            MessagingFee(msg.value, 0),
            // Refund address in case of failed source message.
            payable(msg.sender)
        );
    }

    /// @notice Sends a message from the destination chain to the source chain that a factory has been deployed
    function sendFactoryDeployedOnDestinationChain(uint128 _gas) external payable {
        require(deploymentAnnounced == false, "SmartWalletFactory: Deployment already announced to source chain"); 

        // Encodes the message before invoking _lzSend.
        bytes memory _payload = abi.encode(uint8(MessageType.FactoryDeployedOnDestinationChain), abi.encode(block.chainid, address(this)));

        // Send the message
        _lzSend(
            sourceChainEID, // source chain's EID
            _payload,
            OptionsBuilder.newOptions().addExecutorLzReceiveOption(_gas, 0),
            // Fee in native gas and ZRO token.
            MessagingFee(msg.value, 0),
            // Refund address in case of failed source message.
            payable(msg.sender)
        );

        deploymentAnnounced = true;
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
    ) public view returns (uint256 nativeFee, uint256 lzTokenFee) {
        // Prepare the message payload based on the message type
        bytes memory _payload = abi.encode(_messageType, _messageData);

        // Get the estimated fees
        MessagingFee memory fee = _quote(_dstEid, _payload, _options, _payInLzToken);
        return (fee.nativeFee, fee.lzTokenFee);
    }

    // Estimating the fee for a Smart Wallet deployment message
    function quoteSmartWalletDeployedOnSourceChain(
        uint32 _dstEid, 
        address _owner, 
        address _smartWalletAddress, 
        bytes calldata _options
    ) external view returns (uint256 nativeFee, uint256 lzTokenFee) {
        bytes memory messageData = abi.encode(_owner, _smartWalletAddress);
        return quote(_dstEid, uint8(MessageType.SmartWalletDeployedOnSourceChain), messageData, _options, false);
    }

    // Estimating the fee for a Chain Registration message
    function quoteFactoryDeployedOnDestinationChain(
        uint32 _dstEid, 
        uint256 _chainId, 
        address _sourceContractAddress, 
        bytes calldata _options
    ) external view returns (uint256 nativeFee, uint256 lzTokenFee) {
        bytes memory messageData = abi.encode(_chainId, _sourceContractAddress);
        return quote(_dstEid, uint8(MessageType.FactoryDeployedOnDestinationChain), messageData, _options, false);
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
        if (messageType == uint8(MessageType.SmartWalletDeployedOnSourceChain)) {
            _handleSmartWalletDeployedOnSourceChain(messageData);
        } else if (messageType == uint8(MessageType.FactoryDeployedOnDestinationChain)) {
            _handleFactoryDeployedOnDestinationChain(messageData);
        } else {
            revert("SmartWalletFactory: Unknown message type");
        }
    }

    /// @notice Registers the owner of a deployed smart wallet that was deployed on the source chain
    /// @param messageData Data containing the owner and smart wallet address
    function _handleSmartWalletDeployedOnSourceChain(bytes memory messageData) internal {
        
        // Decode the message
        (address owner, address smartWalletAddress) = abi.decode(messageData, (address, address));

        // Assign the deployed wallet to the owner
        deployedSmartWalletAddressToOwner[smartWalletAddress] = owner; 
    }

    /// @notice Registers the owner of a deployed smart wallet that was deployed on the source chain
    /// @param messageData Data containing the owner and smart wallet address
    function _handleFactoryDeployedOnDestinationChain(bytes memory messageData) internal {

        // Decode the chain id
        (uint256 chainId, address destinationChainFactoryAddress) = abi.decode(messageData, (uint256, address));

        // Add the EID to the list of supported destination chains
        supportedDestinationChainEIDs.push(chainIdToEID[chainId]);
    }

    /// @notice Sets the Layer Zero EIDs for a given chain id
    /// @dev Only settable on source chain.
    /// @param _chainIDs List of chain ids.
    /// @param _chainEIDs List of corresponding Layer Zero EIDs. 
    function updateChainEIDs(uint256[] memory _chainIDs, uint32[] memory _chainEIDs) external onlyOwner() {
        require(isSourceChain, "SmartWalletFactory: Not source chain");

        for(uint i; i < _chainEIDs.length; i++) {
            chainIdToEID[_chainIDs[i]] = _chainEIDs[i];
        }
    }

    /// @notice Gets the list of supported Layer Zero EIDs
    function getSupportedChainEIDs() external view returns(uint32[] memory) {
        return supportedDestinationChainEIDs;
    }

    /// @notice Creates options for executing `lzReceive` on the destination chain.
    /// @param _gas The gas amount for the `lzReceive` execution.
    /// @param _value The msg.value for the `lzReceive` execution.
    /// @return bytes-encoded option set for `lzReceive` executor.
    function createLzReceiveOption(uint128 _gas, uint128 _value) public pure returns(bytes memory) {
        return OptionsBuilder.newOptions().addExecutorLzReceiveOption(_gas, _value);
    }
}