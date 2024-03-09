// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import {IContentFactory} from "./IContentFactory.sol";
import {IContentObject} from "./IContentObject.sol";
import {ContextUpgradeable} from "@openzeppelin/contracts-upgradeable/utils/ContextUpgradeable.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

abstract contract ContentObjectUpgradeable is
    IContentObject,
    ContextUpgradeable
{
    using SafeERC20 for IERC20;

    /* Storage Variables */

    /// @custom:storage-location erc7201:snickerdoodle.contentobject
    struct ContentObjectStorage {
        /// @dev Interface for ContentFactory
        IContentFactory contentFactoryInstance;
        /// @dev an unsorted tag array which this content object stakes against
        Tag[] tags;
        /// @dev helpful
        mapping(string => uint256) tagIndices;
        /// @dev max number of attributes a consent contract can stake against
        uint maxTags;
        /// @dev address of ERC20 token used for stake for rank
        address stakingToken;
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
    function __ContentObject_init(address factory, address _stakingToken) internal onlyInitializing {
        __ContentObject_init_unchained(factory, _stakingToken);
    }

    function __ContentObject_init_unchained(
        address factory, 
        address _stakingToken
    ) internal onlyInitializing {
        ContentObjectStorage storage $ = _getContentObjectStorage();
        $.contentFactoryInstance = IContentFactory(factory);
        $.stakingToken = _stakingToken;
    }

    /* Function Implementations */

    /// @notice get the address of the primary staking token used for stake for rank
    function getStakingToken() external view returns (address) {
        ContentObjectStorage storage $ = _getContentObjectStorage();
        return $.stakingToken;
    }

    /// @notice Get the slot number for a given tag associated with this content object
    /// @param tag Human readable string to check
    function tagIndices(string calldata tag) external view returns (uint256) {
        ContentObjectStorage storage $ = _getContentObjectStorage();
        return $.tagIndices[tag];
    }

    /// @notice Get the number of tags staked by this content object
    function getNumberOfStakedTags() external view returns (uint256) {
        ContentObjectStorage storage $ = _getContentObjectStorage();
        return $.tags.length;
    }

    /// @notice endpoint to update tag limit to that specified by ContentFactory
    function updateMaxTagsLimit() external {
        ContentObjectStorage storage $ = _getContentObjectStorage();
        $.maxTags = $.contentFactoryInstance.maxTagsPerListing();
    }

    /// @notice Get the tag array (we assume the size of this array is small enough to return without windowing)
    function getTagArray() external view returns (Tag[] memory) {
        ContentObjectStorage storage $ = _getContentObjectStorage();
        return $.tags;
    }

    /// @notice Adds a new tag to the global namespace and stakes it for this consent contract
    /// @dev  2^256-1 <-> _newSlot <-> 0
    /// @param tag Human readable string denoting the target tag to stake
    /// @param _newSlot New linked list entry that prime the linked list for this tag
    function _newGlobalTag(string memory tag, uint256 _newSlot) internal {
        ContentObjectStorage storage $ = _getContentObjectStorage();
        // check
        require(
            $.tags.length < $.maxTags,
            "Content Object: Tag budget exhausted"
        );
        require(
            $.tagIndices[tag] == 0,
            "Content Object: This tag is already staked."
        );

        // effects
        uint256 stake = computeFee(_newSlot);
        $.tags.push(Tag(tag, _newSlot, _msgSender(), stake));
        $.tagIndices[tag] = $.tags.length;

        // interaction
        IERC20($.stakingToken).safeTransferFrom(
            _msgSender(),
            address(this),
            stake
        );
        $.contentFactoryInstance.initializeTag(tag, _newSlot);
    }

    /// @notice Stakes a tag that has already been added to the global namespace but hasn't been used locally yet
    /// @dev  _newSlot <-> _existingSlot
    /// @param tag Human readable string denoting the target tag to stake
    /// @param _newSlot New linked list entry that will point to _existingSlot slot
    /// @param _existingSlot slot that will be ranked next lowest to _newSlot
    function _newLocalTagUpstream(
        string memory tag,
        uint256 _newSlot,
        uint256 _existingSlot
    ) internal {
        ContentObjectStorage storage $ = _getContentObjectStorage();
        // check
        require(
            $.tags.length < $.maxTags,
            "Consent Contract: Tag budget exhausted"
        );
        require(
            $.tagIndices[tag] == 0,
            "Consent Contract: This tag is already staked by this contract"
        );

        // effects
        uint256 stake = computeFee(_newSlot);
        $.tags.push(Tag(tag, _newSlot, _msgSender(), stake));
        $.tagIndices[tag] = $.tags.length;

        // interaction
        IERC20($.stakingToken).safeTransferFrom(
            _msgSender(),
            address(this),
            stake
        );
        $.contentFactoryInstance.insertUpstream(tag, _newSlot, _existingSlot);
    }

    /// @notice Stakes a tag that has already been added to the global namespace but hasn't been used locally yet
    /// @dev  _existingSlot <-> _newSlot
    /// @param tag Human readable string denoting the target tag to stake
    /// @param _existingSlot upstream pointer that will point to _newSlot
    /// @param _newSlot New linked list entry that will be ranked right below _existingSlot
    function _newLocalTagDownstream(
        string memory tag,
        uint256 _existingSlot,
        uint256 _newSlot
    ) internal {
        ContentObjectStorage storage $ = _getContentObjectStorage();
        // check
        require(
            $.tags.length < $.maxTags,
            "Consent Contract: Tag budget exhausted"
        );
        require(
            $.tagIndices[tag] == 0,
            "Consent Contract: This tag is already staked by this contract"
        );

        // effects
        uint256 stake = computeFee(_newSlot);
        $.tags.push(Tag(tag, _newSlot, _msgSender(), stake));
        $.tagIndices[tag] = $.tags.length;

        // interaction
        IERC20($.stakingToken).safeTransferFrom(
            _msgSender(),
            address(this),
            stake
        );
        $.contentFactoryInstance.insertDownstream(tag, _existingSlot, _newSlot);
    }

    /// @notice Move an existing listing from its current slot to upstream of a new existing slot
    /// @dev This function assumes that tag is not the only member in the global list (i.e. getTagTotal(tag) > 1)
    /// @dev This function also assumes that the listing is not expired
    /// @param tag Human readable string denoting the target tag to stake
    /// @param _newSlot The new slot to move the listing to
    /// @param _existingSlot The neighboring listing to _newSlow
    function _moveExistingListingUpstream(
        string memory tag,
        uint256 _newSlot,
        uint256 _existingSlot
    ) internal {
        ContentObjectStorage storage $ = _getContentObjectStorage();

        // check
        require(
            $.tagIndices[tag] > 0,
            "Consent Contract: This tag has not been staked"
        );

        // effects
        uint256 removalSlot = $.tags[$.tagIndices[tag] - 1].slot;
        $.tags[$.tagIndices[tag] - 1].slot = _newSlot;

        uint256 deltaStake = computeFee(_newSlot - removalSlot); // compute the extra stake required
        $.tags[$.tagIndices[tag] - 1].stake += deltaStake; // update tag listing with stake delta

        // interaction
        // pull stake equal to the delta between old slot and new slot
        IERC20($.stakingToken).safeTransferFrom(
            _msgSender(),
            address(this),
            deltaStake
        );
        // remove from current slot, reverts if the listing was replaced after expiration
        $.contentFactoryInstance.removeListing(tag, removalSlot);
        // add to the new slot, reverts if _existingSlot is not initialized already
        $.contentFactoryInstance.insertUpstream(tag, _newSlot, _existingSlot);
    }

    /// @notice Restakes a listing from this registry that has expired (works for head and tail listings)
    /// @param tag Human readable string denoting the target tag to stake
    function _restakeExpiredListing(string memory tag) internal {
        ContentObjectStorage storage $ = _getContentObjectStorage();
        // check
        require(
            $.tagIndices[tag] > 0,
            "Consent Contract: This tag has not been staked"
        );

        // interaction
        $.contentFactoryInstance.replaceExpiredListing(
            tag,
            $.tags[$.tagIndices[tag] - 1].slot
        );
    }

    /// @notice Replaces an existing listing that has expired (works for head and tail listings)
    /// @param tag Human readable string denoting the target tag to stake
    /// @param _slot The expired slot to replace with a new listing
    function _replaceExpiredListing(string memory tag, uint256 _slot) internal {
        ContentObjectStorage storage $ = _getContentObjectStorage();
        // check
        require(
            $.tags.length < $.maxTags,
            "Consent Contract: Tag budget exhausted"
        );
        require(
            $.tagIndices[tag] == 0,
            "Consent Contract: This tag is already staked by this contract"
        );

        // effects
        uint256 stake = computeFee(_slot);
        $.tags.push(Tag(tag, _slot, _msgSender(), stake));
        $.tagIndices[tag] = $.tags.length;

        // interaction
        IERC20($.stakingToken).safeTransferFrom(
            _msgSender(),
            address(this),
            stake
        );
        $.contentFactoryInstance.replaceExpiredListing(tag, _slot);
    }

    /// @notice Removes this contract's listing under the specified tag
    /// @param tag Human readable string denoting the target tag to destake
    function _removeListing(
        string memory tag
    ) internal returns (string memory) {
        ContentObjectStorage storage $ = _getContentObjectStorage();
        // check
        require(
            $.tagIndices[tag] > 0,
            "Consent Contract: This tag has not been staked"
        );

        // effects - we use the array element deletion pattern used by OpenZeppelin
        uint256 lastIndex = $.tags.length - 1;
        uint256 removalIndex = $.tagIndices[tag] - 1; // remember to decriment the stored value by 1

        Tag memory lastListing = $.tags[lastIndex];

        uint256 removalSlot = $.tags[removalIndex].slot;
        $.tags[removalIndex] = lastListing;
        $.tagIndices[lastListing.tag] = removalIndex + 1; // add 1 back for storage in tagIndices

        delete $.tagIndices[tag];
        $.tags.pop();

        // interaction
        // refund the staked token to the staker address
        IERC20($.stakingToken).safeTransferFrom(
            address(this),
            lastListing.staker,
            lastListing.stake
        );
        // when removing a listing, if it has expired, the slot may have been usurped by another user
        // we must catch this scenario as it is a valid token mechanic
        try $.contentFactoryInstance.removeListing(tag, removalSlot) {
            return "Listing removed";
        } catch Error(string memory /*reason*/) {
            // we don't revert because we want to reclaimed the staked tag
            return "Listing was replaced by another contract";
        }
    }

    /// @notice returns amount of token to pull for a given slot based on 1.0001^_slot
    /// @dev you can call this function from the client to compute the amount of token to allow this contract
    /// @param _slot integer representing the slot in the global linked list to aquire
    function computeFee(uint256 _slot) public pure returns (uint256) {
        // @TODO, potentially make the function take base as a parameter so that price scaling is adjustable
        // To handle decimals
        uint256 scale = 1e18; // Scaling factor to represent decimals
        uint256 result = 1e18; // Initialize result to 1 with scale
        uint256 base = 1000100000000000000; // Represents 1.0001 without scale

        // Using binary exponentiation algorithm:
        // https://www.geeksforgeeks.org/binary-exponentiation-for-competitive-programming/

        while (_slot > 0) {
            // If x is odd, multiply result by base
            if (_slot % 2 == 1) {
                result = (result * base) / scale;
            }

            if (_slot == 1) {
                return result;
            }

            // Square base
            base = (base * base) / scale;

            // Divide x by 2 using bitwise right shift
            _slot >>= 1;
        }
        return result;
    }
}
