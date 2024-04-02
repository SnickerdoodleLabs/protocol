// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import {IContentFactory} from "./IContentFactory.sol";
import {IContentObject} from "./IContentObject.sol";
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

abstract contract ContentObjectUpgradeable is
    IContentObject, 
    Initializable
{
    using SafeERC20 for IERC20;

    /* Storage Variables */

    /// @custom:storage-location erc7201:snickerdoodle.contentobject
    struct ContentObjectStorage {
        /// @dev Interface for ContentFactory
        IContentFactory contentFactoryInstance;
        /// @dev an unsorted tag array which this content object stakes against mapped by the staking asset
        mapping(address => Tag[]) tags;
        /// @dev map from staking asset to another map from a tag to its index in tags
        mapping(address => mapping(string => uint256)) tagIndices;
        /// @dev address which this content object represents (could be *this* or could be another pre-deployed contract)
        address contentAddress;
    }

    // keccak256(abi.encode(uint256(keccak256("snickerdoodle.contentobject")) - 1)) & ~bytes32(uint256(0xff))
    bytes32 private constant ContentObjectStorageLocation =
        0x1f22a6cf75eb7fcaad2fabbc6dbce35f91d9ea3ad7582b03d6421676b0930e00;

    function _getContentObjectStorage()
        private
        pure
        returns (ContentObjectStorage storage $)
    {
        assembly {
            $.slot := ContentObjectStorageLocation
        }
    }

    /**
     * @dev Initializes the contract by setting the address of the ContentFactory.
     */
    function __ContentObject_init(address factory, address contentAddress) internal onlyInitializing {
        __ContentObject_init_unchained(factory, contentAddress);
    }

    function __ContentObject_init_unchained(
        address factory,
        address contentAddress
    ) internal onlyInitializing {
        ContentObjectStorage storage $ = _getContentObjectStorage();
        $.contentFactoryInstance = IContentFactory(factory);
        $.contentAddress = contentAddress;
    }

    /* Function Implementations */

    /// @notice Get the local tag index for a given tag associated with this content object
    /// @param tag Human readable string to check
    /// @param stakingToken Address of the token used for staking recommender listings
    function tagIndices(string calldata tag, address stakingToken) external view returns (uint256) {
        return _tagIndices(tag, stakingToken);
    }

    /// @notice Get the number of tags staked by this content object
    /// @param stakingToken Address of the token used for staking recommender listings
    function getNumberOfStakedTags(address stakingToken) external view returns (uint256) {
        ContentObjectStorage storage $ = _getContentObjectStorage();
        return $.tags[stakingToken].length;
    }

    /// @notice Get the tag array
    /// @dev we assume the size of this array is small enough to return without windowing
    /// @param stakingToken Address of the token used for staking recommender listings
    function getTagArray(address stakingToken) external view returns (Tag[] memory) {
        ContentObjectStorage storage $ = _getContentObjectStorage();
        return $.tags[stakingToken];
    }

    /// @notice returns the address which this content object references
    /// @dev this content object could point to *this* or it could point to another pre-deployed contract
    function getContentAddress() external view returns (address) {
        ContentObjectStorage storage $ = _getContentObjectStorage();
        return $.contentAddress;
    }

    /// @notice Adds a new tag to the global namespace and stakes it for this consent contract
    /// @dev  2^256-1 <-> _newSlot <-> 0
    /// @param tag Human readable string denoting the target tag to stake
    /// @param stakingToken Address of the token used for staking recommender listings
    /// @param stake the amount of token needed to pay for _newSlot, use computeFee from factory
    /// @param _newSlot New linked list entry that prime the linked list for this tag
    function _newGlobalTag(string memory tag, address stakingToken, uint256 stake, uint256 _newSlot) internal {
        ContentObjectStorage storage $ = _getContentObjectStorage();
        // effects
        $.tags[stakingToken].push(Tag(tag, _newSlot));
        $.tagIndices[stakingToken][tag] = $.tags[stakingToken].length;

        // interaction: approve the content factory to pull stake
        IERC20(stakingToken).approve(address($.contentFactoryInstance), stake);
        $.contentFactoryInstance.initializeTag(tag, stakingToken, _newSlot);
    }

    /// @notice Stakes a tag that has already been added to the global namespace but hasn't been used locally yet
    /// @dev  _newSlot <-> _existingSlot
    /// @param tag Human readable string denoting the target tag to stake
    /// @param stakingToken Address of the token used for staking recommender listings
    /// @param stake the amount of token needed to pay for _newSlot, use computeFee from factory
    /// @param _newSlot New linked list entry that will point to _existingSlot slot
    /// @param _existingSlot slot that will be ranked next lowest to _newSlot
    function _newLocalTagUpstream(
        string memory tag,
        address stakingToken, 
        uint256 stake,
        uint256 _newSlot,
        uint256 _existingSlot
    ) internal {
        ContentObjectStorage storage $ = _getContentObjectStorage();

        // effects
        $.tags[stakingToken].push(Tag(tag, _newSlot));
        $.tagIndices[stakingToken][tag] = $.tags[stakingToken].length;

        // interaction: approve the content factory to pull stake
        IERC20(stakingToken).approve(address($.contentFactoryInstance), stake);
        $.contentFactoryInstance.insertUpstream(tag, stakingToken, _newSlot, _existingSlot);
    }

    /// @notice Stakes a tag that has already been added to the global namespace but hasn't been used locally yet
    /// @dev  _existingSlot <-> _newSlot
    /// @param tag Human readable string denoting the target tag to stake
    /// @param stakingToken Address of the token used for staking recommender listings
    /// @param stake the amount of token needed to pay for _newSlot, use computeFee from factory
    /// @param _existingSlot upstream pointer that will point to _newSlot
    /// @param _newSlot New linked list entry that will be ranked right below _existingSlot
    function _newLocalTagDownstream(
        string memory tag,
        address stakingToken, 
        uint256 stake,
        uint256 _existingSlot,
        uint256 _newSlot
    ) internal {
        ContentObjectStorage storage $ = _getContentObjectStorage();

        // effects
        $.tags[stakingToken].push(Tag(tag, _newSlot));
        $.tagIndices[stakingToken][tag] = $.tags[stakingToken].length;

        // interaction: approve the content factory to pull stake
        IERC20(stakingToken).approve(address($.contentFactoryInstance), stake);
        $.contentFactoryInstance.insertDownstream(tag, stakingToken, _existingSlot, _newSlot);
    }

    /// @notice Move an existing listing from its current slot to upstream of a new existing slot
    /// @dev This function assumes that tag is not the only member in the global list (i.e. getTagTotal(tag) > 1)
    /// @dev This function also assumes that the listing is not expired
    /// @param tag Human readable string denoting the target tag to stake
    /// @param stakingToken Address of the token used for staking recommender listings
    /// @param stake the amount of token needed to pay for _newSlot, use computeFee from factory
    /// @param _newSlot The new slot to move the listing to
    /// @param _existingSlot The neighboring listing to _newSlow
    function _moveExistingListingUpstream(
        string memory tag,
        address stakingToken,
        uint256 stake,
        uint256 _newSlot,
        uint256 _existingSlot
    ) internal {
        ContentObjectStorage storage $ = _getContentObjectStorage();

        Tag memory updatedTag = $.tags[stakingToken][$.tagIndices[stakingToken][tag] - 1];

        // check
        require(_newSlot > _existingSlot, "Content Object: New slot must be greater than current slot");
        require(
            $.tagIndices[stakingToken][tag] > 0,
            "Content Object: This tag has not been staked"
        );

        // effects
        uint256 removalSlot = updatedTag.slot; // get the old slot
        updatedTag.slot = _newSlot; // update with new slot

        $.tags[stakingToken][$.tagIndices[stakingToken][tag] - 1] = updatedTag; // update the listing

        // interaction
        // approve the content factory to pull the new required stake
        IERC20(stakingToken).approve(address($.contentFactoryInstance), stake);

        $.contentFactoryInstance.moveUpstream(tag, stakingToken, _newSlot, _existingSlot);
    }

    /// @notice Restakes a listing from this registry that has expired (works for head and tail listings)
    /// @param tag Human readable string denoting the target tag to stake
    /// @param stakingToken Address of the token used for staking recommender listings
    function _restakeExpiredListing(string memory tag, address stakingToken) internal {
        ContentObjectStorage storage $ = _getContentObjectStorage();
        // check
        require(
            $.tagIndices[stakingToken][tag] > 0,
            "Content Object: This tag has not been staked"
        );

        // interaction
        $.contentFactoryInstance.replaceExpiredListing(
            tag,
            stakingToken,
            $.tags[stakingToken][$.tagIndices[stakingToken][tag] - 1].slot
        );
    }

    /// @notice Replaces an existing listing that has expired (works for head and tail listings)
    /// @param tag Human readable string denoting the target tag to stake
    /// @param stakingToken Address of the token used for staking recommender listings
    /// @param stake the amount of token needed to pay for _newSlot, use computeFee from factory
    /// @param _slot The expired slot to replace with a new listing
    function _replaceExpiredListing(string memory tag, address stakingToken, uint256 stake, uint256 _slot) internal {
        ContentObjectStorage storage $ = _getContentObjectStorage();

        // effects
        $.tags[stakingToken].push(Tag(tag, _slot));
        $.tagIndices[stakingToken][tag] = $.tags[stakingToken].length;

        // interaction: approve the content factory to pull the new required stake
        IERC20(stakingToken).approve(address($.contentFactoryInstance), stake);
        $.contentFactoryInstance.replaceExpiredListing(tag, stakingToken, _slot);
    }

    /// @notice Removes this contract's listing under the specified tag
    /// @param tag Human readable string denoting the target tag to destake
    /// @param stakingToken Address of the token used for staking recommender listings
    function _removeListing(
        string memory tag,
        address stakingToken
    ) internal returns (string memory) {
        ContentObjectStorage storage $ = _getContentObjectStorage();
        // check
        require(
            $.tagIndices[stakingToken][tag] > 0,
            "Content Object: This tag has not been staked"
        );

        // effects - we use the array element deletion pattern used by OpenZeppelin
        uint256 lastIndex = $.tags[stakingToken].length - 1;
        uint256 removalIndex = $.tagIndices[stakingToken][tag] - 1; // remember to decriment the stored value by 1

        Tag memory lastListing = $.tags[stakingToken][lastIndex];

        uint256 removalSlot = $.tags[stakingToken][removalIndex].slot;
        $.tags[stakingToken][removalIndex] = lastListing;
        $.tagIndices[stakingToken][lastListing.tag] = removalIndex + 1; // add 1 back for storage in tagIndices

        delete $.tagIndices[stakingToken][tag];
        $.tags[stakingToken].pop();

        // interaction
        // when removing a listing, if it has expired, the slot may have been usurped by another user
        // we must catch this scenario as it is a valid token mechanic
        try $.contentFactoryInstance.removeListing(tag, stakingToken, removalSlot) {
            return "Listing removed";
        } catch Error(string memory /*reason*/) {
            // we don't revert because we want to local storage updated
            return "Listing was replaced by another contract";
        }
    }

    function _tagIndices(string calldata tag, address stakingToken) internal view returns (uint256) {
        ContentObjectStorage storage $ = _getContentObjectStorage();
        return $.tagIndices[stakingToken][tag] - 1; // have to subtract 1 from the stored index
    }

    function _getTag(address stakingToken, uint256 tagIndex) internal view returns (Tag memory) {
        ContentObjectStorage storage $ = _getContentObjectStorage();
        return $.tags[stakingToken][tagIndex];
    }
}
