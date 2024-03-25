// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IContentFactory {
    /* Structs */

    /// @dev Listing object for storing marketplace listings
    struct Listing {
        uint256 previous; // pointer to the previous active slot
        uint256 next; // pointer to the next active slot
        address contentObject; // address of the target content object
        uint256 timeExpiring; // unix timestamp when the listing expires and can be replaced
    }

    /* Events */

    /// @notice Emitted when a new ranking created
    /// @dev the full time-history of the marketplace can be reconstructed from this event
    /// @param oldOccupant address of the previous occupant of the given slot
    /// @param newOccupant address of the new occupant of the given slot
    /// @param stakingToken the token used for staking listings in the recommender system
    /// @param tag the human-readable tag associated with the update
    /// @param slot The slot (i.e. amount of stake) associated with the update
    event RankingUpdate(
        address indexed oldOccupant,
        address indexed newOccupant,
        address indexed stakingToken,
        string tag,
        uint256 slot
    );

    /* Function Declarations */

    function getGovernanceToken() external view returns (address);

    function isStakingToken(address tokenAddress) external view returns (bool);

    function listingDuration() external view returns (uint256);

    function maxTagsPerListing() external view returns (uint256);

    function getTagTotal(string calldata tag, address stakingToken) external view returns (uint256);

    function getListingsForward(
        string calldata tag,
        address stakingToken,
        uint256 _startingSlot,
        uint256 numSlots,
        bool filterActive
    ) external view returns (string[] memory, Listing[] memory);

    function getListingsBackward(
        string calldata tag,
        address stakingToken,
        uint256 _startingSlot,
        uint256 numSlots,
        bool filterActive
    ) external view returns (string[] memory, Listing[] memory);

    function initializeTag(string calldata tag, address stakingToken, uint256 _newHead) external;

    function insertUpstream(string calldata tag, address stakingToken, uint256 _newSlot, uint256 _existingSlot) external;

    function insertDownstream(string calldata tag, address stakingToken, uint256 _existingSlot, uint256 _newSlot) external;

    function replaceExpiredListing(string calldata tag, address stakingToken, uint256 _slot) external;

    function removeExpiredListings(string calldata tag, address stakingToken, uint256[] calldata _slots) external;

    function removeListing(string calldata tag, address stakingToken, uint256 _removedSlot) external;
}