// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IConsentFactory {

    /// @dev Listing object for storing marketplace listings
    struct Listing{
      uint256 previous; // pointer to the previous active slot
      uint256 next; // pointer to the next active slot
      address consentContract; // address of the target consent contract
      uint256 timeExpiring; // unix timestamp when the listing expires and can be replaced
    }

    /* EVENTS */ 

    /// @notice Emitted when a Consent contract's Beacon Proxy is deployed
    /// @param owner Indexed address of the owner of the deployed Consent contract Beacon Proxy 
    /// @param consentAddress Indexed address of the deployed Consent contract Beacon Proxy
    event ConsentDeployed(address indexed owner, address indexed consentAddress);

    /// @notice Emitted when a Consent contract's Beacon Proxy is deployed
    /// @param consentContract address of the target consent contract
    /// @param tag the human-readable tag the listing was filed under
    /// @param slot The slot (i.e. amount of stake) that the listing has posted to
    event NewListing(address indexed consentContract, string tag, uint256 slot);

    /* External Functions */ 

    function listingDuration() external returns (uint256);

    function maxTagsPerListing() external returns (uint256);

    function trustedForwarder() external returns (address);

    function initializeTag(string memory tag, uint256 _newHead) external;

    function insertUpstream(
        string memory tag,
        uint256 _newSlot,
        uint256 _existingSlot
    ) external;

    function insertDownstream(
        string memory tag,
        uint256 _existingSlot,
        uint256 _newSlot
    ) external;

    function replaceExpiredListing(string memory tag, uint256 _slot) external;

    function removeListing(string memory tag, uint256 _removedSlot) external;

    function addUserRole(address user, bytes32 role) external;

    function removeUserRole(address user, bytes32 role) external;
}