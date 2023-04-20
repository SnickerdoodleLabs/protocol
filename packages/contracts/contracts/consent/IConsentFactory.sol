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

    /// @notice Emitted when a new marketplace listing is created
    /// @dev the full time-history of the marketplace can be reconstructed from this event
    /// @param oldOccupant address of the previous occupant of the given slot
    /// @param newOccupant address of the new occupant of the given slot
    /// @param tag the human-readable tag associated with the update
    /// @param slot The slot (i.e. amount of stake) associated with the update
    event MarketplaceUpdate(address indexed oldOccupant, address indexed newOccupant, string tag, uint256 slot);

    /* External Functions */ 

    function listingDuration() external view returns (uint256);

    function maxTagsPerListing() external view returns (uint256);

    function trustedForwarder() external view returns (address);

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