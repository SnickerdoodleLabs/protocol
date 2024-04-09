// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import {IContentFactory} from "../recomender/IContentFactory.sol";

interface IConsentFactory is IContentFactory {
    /* EVENTS */

    /// @notice Emitted when a Consent contract's Beacon Proxy is deployed
    /// @param owner Indexed address of the owner of the deployed Consent contract Beacon Proxy
    /// @param consentAddress Indexed address of the deployed Consent contract Beacon Proxy
    event ConsentContractDeployed(
        address indexed owner,
        address indexed consentAddress
    );

    function createConsent(address owner, string memory baseURI) external;

    function setListingDuration(uint256 listingDuration) external; 

    function setMaxTagsPerListing(uint256 maxTagsPerListing) external; 

    function registerStakingToken(address stakingToken) external;

    function adminRemoveListings(string memory tag, address stakingToken, uint256[] memory removedSlots) external;

    function blockContentObject(address stakingToken, address contentAddress) external;

    function unblockContentObject(address stakingToken, address contentAddress) external;

}
