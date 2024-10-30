// SPDX-License-Identifier: MIT

pragma solidity ^0.8.22;

import { IOAppReceiver, Origin } from "@layerzerolabs/lz-evm-oapp-v2/contracts/oapp/interfaces/IOAppReceiver.sol";
import { OAppCoreUpgradeable } from "./OAppCoreUpgradeable.sol";

/**
 * @title OAppReceiverUpgradeable
 * @dev Abstract upgradeable contract implementing the ILayerZeroReceiver interface and extending OAppCore for OApp receivers.
 */
abstract contract OAppReceiverUpgradeable is IOAppReceiver, OAppCoreUpgradeable {
    // Custom error message for when the caller is not the registered endpoint/
    error OnlyEndpoint(address addr);

    // @dev The version of the OAppReceiver implementation.
    // @dev Version is bumped when changes are made to this contract.
    struct OAppReceiverStorage {
        uint64 RECEIVER_VERSION;
    }

    // keccak256(abi.encode(uint256(keccak256("snickerdoodle.storage.OAppReceiver")) - 1)) & ~bytes32(uint256(0xff));
    bytes32 private constant OAppReceiverStorageLocation  =
        0x915b8680288de3e23f5af915db3ef0bf76072681e96298857e44b3aec13b6c00;


    function _getOAppReceiverStorage()
        internal
        pure
        returns (OAppReceiverStorage storage $)
    {
        assembly {
            $.slot := OAppReceiverStorageLocation
        }
    }

    function __OAppReceiver_init() internal onlyInitializing {
        OAppReceiverStorage storage $ = _getOAppReceiverStorage();
        $.RECEIVER_VERSION = 1;
    }

    function __OAppReceiver_init_unchained() internal onlyInitializing {}

    /**
     * @notice Retrieves the OApp version information.
     * @return senderVersion The version of the OAppSender.sol contract.
     * @return receiverVersion The version of the OAppReceiver.sol contract.
     *
     * @dev Providing 0 as the default for OAppSender version. Indicates that the OAppSender is not implemented.
     * ie. this is a RECEIVE only OApp.
     * @dev If the OApp uses both OAppSender and OAppReceiver, then this needs to be override returning the correct versions.
     */
    function oAppVersion() public view virtual returns (uint64 senderVersion, uint64 receiverVersion) {
        OAppReceiverStorage storage $ = _getOAppReceiverStorage();
        return (0, $.RECEIVER_VERSION);
    }

    /**
     * @notice Retrieves the address responsible for 'sending' composeMsg's to the Endpoint.
     * @return sender The address responsible for 'sending' composeMsg's to the Endpoint.
     *
     * @dev Applications can optionally choose to implement a separate composeMsg sender that is NOT the bridging layer.
     * @dev The default sender IS the OApp implementer.
     */
    function composeMsgSender() public view virtual returns (address sender) {
        return address(this);
    }

    /**
     * @notice Checks if the path initialization is allowed based on the provided origin.
     * @param origin The origin information containing the source endpoint and sender address.
     * @return Whether the path has been initialized.
     *
     * @dev This indicates to the endpoint that the OApp has enabled msgs for this particular path to be received.
     * @dev This defaults to assuming if a peer has been set, its initialized.
     * Can be overridden by the OApp if there is other logic to determine this.
     */
    function allowInitializePath(Origin calldata origin) public view virtual returns (bool) {
        OAppCoreStorage storage $ = _getOAppCoreStorage();
        return $.peers[origin.srcEid] == origin.sender;
    }

    /**
     * @notice Retrieves the next nonce for a given source endpoint and sender address.
     * @dev _srcEid The source endpoint ID.
     * @dev _sender The sender address.
     * @return nonce The next nonce.
     *
     * @dev The path nonce starts from 1. If 0 is returned it means that there is NO nonce ordered enforcement.
     * @dev Is required by the off-chain executor to determine the OApp expects msg execution is ordered.
     * @dev This is also enforced by the OApp.
     * @dev By default this is NOT enabled. ie. nextNonce is hardcoded to return 0.
     */
    function nextNonce(uint32 /*_srcEid*/, bytes32 /*_sender*/) public view virtual returns (uint64 nonce) {
        return 0;
    }

    /**
     * @dev Entry point for receiving messages or packets from the endpoint.
     * @param _origin The origin information containing the source endpoint and sender address.
     *  - srcEid: The source chain endpoint ID.
     *  - sender: The sender address on the src chain.
     *  - nonce: The nonce of the message.
     * @param _guid The unique identifier for the received LayerZero message.
     * @param _message The payload of the received message.
     * @param _executor The address of the executor for the received message.
     * @param _extraData Additional arbitrary data provided by the corresponding executor.
     *
     * @dev Entry point for receiving msg/packet from the LayerZero endpoint.
     */
    function lzReceive(
        Origin calldata _origin,
        bytes32 _guid,
        bytes calldata _message,
        address _executor,
        bytes calldata _extraData
    ) public payable virtual {
        OAppCoreStorage storage $ = _getOAppCoreStorage();
        // Ensures that only the endpoint can attempt to lzReceive() messages to this OApp.
        if (address($.endpoint) != msg.sender) revert OnlyEndpoint(msg.sender);

        // Ensure that the sender matches the expected peer for the source endpoint.
        if (_getPeerOrRevert(_origin.srcEid) != _origin.sender) revert OnlyPeer(_origin.srcEid, _origin.sender);

        // Call the internal OApp implementation of lzReceive.
        _lzReceive(_origin, _guid, _message, _executor, _extraData);
    }

    /**
     * @dev Internal function to implement lzReceive logic without needing to copy the basic parameter validation.
     */
    function _lzReceive(
        Origin calldata _origin,
        bytes32 _guid,
        bytes calldata _message,
        address _executor,
        bytes calldata _extraData
    ) internal virtual;

    /**
     * @notice Indicates whether an address is an approved composeMsg sender to the Endpoint.
     * @dev Required implementation of the IOAppCore interface.
     * @param _origin The origin information containing the source endpoint and sender address.
     *  - srcEid: The source chain endpoint ID.
     *  - sender: The sender address on the src chain.
     *  - nonce: The nonce of the message.
     * @param _message The lzReceive payload.
     * @param _sender The sender address.
     * @return isSender Is a valid sender.
     *
     * @dev Applications can optionally choose to implement a separate composeMsg sender that is NOT the bridging layer.
     * @dev The default sender IS the OAppReceiver implementer.
     */
    function isComposeMsgSender(
        Origin calldata _origin,
        bytes calldata _message,
        address _sender
    ) external pure returns (bool isSender) {        
        // Ensure the sender matches the one in the origin
        return address(uint160(uint256(_origin.sender))) == _sender;
    }
}