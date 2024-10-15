// SPDX-License-Identifier: MIT

pragma solidity ^0.8.22;

import { OwnableUpgradeable } from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import { IOAppCore, ILayerZeroEndpointV2 } from "@layerzerolabs/lz-evm-oapp-v2/contracts/oapp/interfaces/IOAppCore.sol";

/**
 * @title OAppCoreUpgradeable
 * @dev Abstract upgradable contract implementing the IOAppCore interface with basic OApp configurations.
 */
abstract contract OAppCoreUpgradeable is IOAppCore, OwnableUpgradeable {

    // The LayerZero endpoint associated with the given OApp
    // Mapping to store peers associated with corresponding endpoints
    struct OAppCoreStorage {
        ILayerZeroEndpointV2 endpoint;
        mapping(uint32 eid => bytes32 peer) peers;
    }

    // keccak256(abi.encode(uint256(keccak256("snickerdoodle.storage.oappcore")) - 1)) & ~bytes32(uint256(0xff));
    bytes32 private constant OAppCoreStorageLocation  =
        0xd3f6e13938ee9e098b8b2f8c04dc01d0c58da95291a8a4564992bb6c3e15f900;


    /**
     * @dev Initializer to initialize the OAppCoreUpgradeable with the provided endpoint and delegate.
     * @param _endpoint The address of the LOCAL Layer Zero endpoint.
     * @param _delegate The delegate capable of making OApp configurations inside of the endpoint.
     *
     * @dev The delegate typically should be set as the owner of the contract.
     */
    function __OAppCore_init(address _endpoint, address _delegate) internal onlyInitializing {
        __OAppCore_init_unchained(_endpoint, _delegate);
    }

    function __OAppCore_init_unchained(address _endpoint, address _delegate) internal onlyInitializing {
        OAppCoreStorage storage $ = _getOAppCoreStorage();
        
        $.endpoint = ILayerZeroEndpointV2(_endpoint);

        if (_delegate == address(0)) revert InvalidDelegate();
        $.endpoint.setDelegate(_delegate);
    }

    function _getOAppCoreStorage()
        internal // To be accessed by OAppSenderUpgradeable and OAppReceiverUpgradeable
        pure
        returns (OAppCoreStorage storage $)
    {
        assembly {
            $.slot := OAppCoreStorageLocation
        }
    }

    /**
     * @notice Retrieves the LayerZero endpoint associated with the OApp.
     * @return iEndpoint The LayerZero endpoint as an interface.
     */
    function endpoint() external view returns (ILayerZeroEndpointV2 iEndpoint) {
        OAppCoreStorage storage $ = _getOAppCoreStorage();
        return $.endpoint;
    }

    /**
     * @notice Retrieves the peer (OApp) associated with a corresponding endpoint.
     * @param _eid The endpoint ID.
     * @return peer The peer address (OApp instance) associated with the corresponding endpoint.
     */
    function peers(uint32 _eid) external view returns (bytes32 peer) {
        OAppCoreStorage storage $ = _getOAppCoreStorage();
        return $.peers[_eid];
    }

    /**
     * @notice Sets the peer address (OApp instance) for a corresponding endpoint.
     * @param _eid The endpoint ID.
     * @param _peer The address of the peer to be associated with the corresponding endpoint.
     *
     * @dev Only the owner/admin of the OApp can call this function.
     * @dev Indicates that the peer is trusted to send LayerZero messages to this OApp.
     * @dev Set this to bytes32(0) to remove the peer address.
     * @dev Peer is a bytes32 to accommodate non-evm chains.
     */
    function setPeer(uint32 _eid, bytes32 _peer) public virtual onlyOwner {
        OAppCoreStorage storage $ = _getOAppCoreStorage();
        $.peers[_eid] = _peer;
        emit PeerSet(_eid, _peer);
    }

    /**
     * @notice Internal function to get the peer address associated with a specific endpoint; reverts if NOT set.
     * ie. the peer is set to bytes32(0).
     * @param _eid The endpoint ID.
     * @return peer The address of the peer associated with the specified endpoint.
     */
    function _getPeerOrRevert(uint32 _eid) internal view virtual returns (bytes32) {
        OAppCoreStorage storage $ = _getOAppCoreStorage();
        bytes32 peer = $.peers[_eid];
        if (peer == bytes32(0)) revert NoPeer(_eid);
        return peer;
    }

    /**
     * @notice Sets the delegate address for the OApp.
     * @param _delegate The address of the delegate to be set.
     *
     * @dev Only the owner/admin of the OApp can call this function.
     * @dev Provides the ability for a delegate to set configs, on behalf of the OApp, directly on the Endpoint contract.
     */
    function setDelegate(address _delegate) public onlyOwner {
        OAppCoreStorage storage $ = _getOAppCoreStorage();
        $.endpoint.setDelegate(_delegate);
    }
}