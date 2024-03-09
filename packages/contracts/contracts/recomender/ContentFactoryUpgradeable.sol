// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import {IContentFactory} from "./IContentFactory.sol";
import {IConsent} from "../consent/IConsent.sol";
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

abstract contract ContentFactoryUpgradeable is IContentFactory, Initializable {
    /* Storage Variables */
    /// @custom:storage-location erc7201:snickerdoodle.contentfactory
    struct ContentFactoryStorage {
        /// @dev the address of the erc20 token used for staking in this contract
        address stakingToken; 
        /// @dev the default amount of time, in seconds, that a listing is valid for
        uint256 listingDuration;
        /// @dev the default maximum number of tags that can be staked by a single consent constract listing
        uint256 maxTagsPerListing;
        /// @dev Mapping of deployed beacon proxy addresses to track that it is a Consent contract
        mapping(address => bool) contentAddressCheck;
        /// @dev the total number of listings in the marketplace
        mapping(bytes32 => uint256) listingTotals;
        /// @dev nested mapping
        /// @dev first layer maps from hashed tag string to a linked list
        /// @dev second layer is the linked list mapping structure
        mapping(bytes32 => mapping(uint256 => Listing)) listings;
    }

    // keccak256(abi.encode(uint256(keccak256("snickerdoodle.contentfactory")) - 1)) & ~bytes32(uint256(0xff))
    bytes32 private constant ContentFactoryStorageLocation =
        0x584565e90fa9ec9ac82afca62b5a80e321f6d503f72d0884875cf353a2703f00;

    function _getContentFactoryStorage()
        private
        pure
        returns (ContentFactoryStorage storage $)
    {
        assembly {
            $.slot := ContentFactoryStorageLocation
        }
    }

    function __ContentFactory_init(
        address _stakingToken,
        uint256 _listingDuration,
        uint256 _maxTagsPerListing
    ) internal onlyInitializing {
        __ContentObject_init_unchained(_stakingToken, _listingDuration, _maxTagsPerListing);
    }

    function __ContentObject_init_unchained(
        address _stakingToken, 
        uint256 _listingDuration,
        uint256 _maxTagsPerListing
    ) internal onlyInitializing {
        ContentFactoryStorage storage $ = _getContentFactoryStorage();
        $.stakingToken = _stakingToken;
        $.listingDuration = _listingDuration;
        $.maxTagsPerListing = _maxTagsPerListing;
    }

    /* MODIFIERS */

    /// @notice Modified to check if a caller of a function is a content object that the factory knows about
    /// @dev Every time a content object is deployed, it must be registered via _setContentObjectAddress
    modifier onlyContentObject() {
        ContentFactoryStorage storage $ = _getContentFactoryStorage();
        // ensure that the immediate caller of the function is a Consent contract or the DAO/DEFAULT_ADMIN_ROLE
        require(
            $.contentAddressCheck[msg.sender] == true,
            "ConsentFactory: Caller is not a Consent Contract"
        );
        _;
    }

    /* Function Implementations */

    /// @notice get the address of the primary staking token used for stake for rank
    function getStakingToken() public view returns (address) {
        ContentFactoryStorage storage $ = _getContentFactoryStorage();
        return $.stakingToken;
    }

    /// @notice get the amount of time a tag is allowed to persist before its slot can be usurped
    function listingDuration() external view returns (uint256) {
        ContentFactoryStorage storage $ = _getContentFactoryStorage();
        return $.listingDuration;
    }

    /// @notice return the maximum number of tags a content object is allowed to register
    function maxTagsPerListing() external view returns (uint256) {
        ContentFactoryStorage storage $ = _getContentFactoryStorage();
        return $.maxTagsPerListing;
    }

    /// @notice Returns the total number of listings under a given tag (including expired listings which have not been removed)
    /// @param tag Human readable string denoting the target tag to stake
    function getTagTotal(string calldata tag) external view returns (uint256) {
        ContentFactoryStorage storage $ = _getContentFactoryStorage();
        bytes32 LLKey = keccak256(abi.encodePacked(tag));
        return $.listingTotals[LLKey];
    }

    /// @notice Returns an array of Listings from the marketplace linked list from highest to lowest ranked
    /// @param tag Human readable string denoting the target tag to stake
    /// @param _startingSlot slot to start at in the linked list
    /// @param numSlots number of entries to return
    /// @param filterActive boolean flag indicating if the results should include expired listings (false) or not (true)
    function getListingsForward(
        string calldata tag,
        uint256 _startingSlot,
        uint256 numSlots,
        bool filterActive
    ) external view returns (string[] memory, Listing[] memory) {
        ContentFactoryStorage storage $ = _getContentFactoryStorage();

        string[] memory cids = new string[](numSlots);
        Listing[] memory sources = new Listing[](numSlots);

        bytes32 LLKey = keccak256(abi.encodePacked(tag));

        for (uint i = 0; i < numSlots; i++) {
            Listing memory listing = $.listings[LLKey][_startingSlot];
            require(listing.timeExpiring > 0, "ConsentFactory: invalid slot"); // ensure the listing is valid by looking at the timestamp
            if (
                (filterActive == true) &&
                (listing.timeExpiring < block.timestamp)
            ) {
                _startingSlot = listing.next; // Move on to downstream slot
                if (_startingSlot == 0) {
                    // slot 0 is the EOL tail slot
                    break;
                }
                continue;
            } // don't include expired listings if filtering enabled
            cids[i] = IConsent(listing.contentObject).baseURI(); // grab the invitation details from the consent contract
            sources[i] = listing; // also grab the complete listing details
            _startingSlot = listing.next;
            if (_startingSlot == 0) {
                // slot 0 is the EOL tail slot
                break;
            }
        }
        return (cids, sources);
    }

    /// @notice Returns an array of Listings from the marketplace linked list from lowest to highest ranked
    /// @param tag Human readable string denoting the target tag to stake
    /// @param _startingSlot slot to start at in the linked list
    /// @param numSlots number of entries to return
    /// @param filterActive boolean flag indicating if the results should include expired listings (false) or not (true)
    function getListingsBackward(
        string calldata tag,
        uint256 _startingSlot,
        uint256 numSlots,
        bool filterActive
    ) external view returns (string[] memory, Listing[] memory) {
        ContentFactoryStorage storage $ = _getContentFactoryStorage();

        string[] memory cids = new string[](numSlots);
        Listing[] memory sources = new Listing[](numSlots);

        bytes32 LLKey = keccak256(abi.encodePacked(tag));

        for (uint i = 0; i < numSlots; i++) {
            Listing memory listing = $.listings[LLKey][_startingSlot];
            require(listing.timeExpiring > 0, "ConsentFactory: invalid slot"); // ensure the listing is valid by looking at the timestamp
            if (
                (filterActive == true) &&
                (listing.timeExpiring < block.timestamp)
            ) {
                _startingSlot = listing.previous; // Move on to upstream slot
                if (listing.previous == type(uint256).max) {
                    // slot 2^256-1 is the EOL head slot
                    break;
                }
                continue;
            } // don't include expired listings if filtering enabled
            cids[i] = IConsent(listing.contentObject).baseURI(); // grab the invitation details from the consent contract
            sources[i] = listing; // also grab the complete listing details
            _startingSlot = listing.previous;
            if (listing.previous == type(uint256).max) {
                // slot 2^256-1 is the EOL head slot
                break;
            }
        }
        return (cids, sources);
    }

    /// @notice Initializes a doubly-linked list under the given attribute
    /// @param tag Human readable string denoting the target tag to stake
    /// @param _newHead Downstream pointer that will be pointed to by _newSlot
    function initializeTag(
        string calldata tag,
        uint256 _newHead
    ) external onlyContentObject {
        ContentFactoryStorage storage $ = _getContentFactoryStorage();

        bytes32 LLKey = keccak256(abi.encodePacked(tag));

        // the tag must not have been initialized previously
        require(
            $.listingTotals[LLKey] == 0,
            "ConsentFactory: This tag is already initialized"
        );

        // we use index 0 and 2^256-1 to be our boundary conditions so we don't have to use a dedicated storage variable for the head/tail listings
        // infinity <-> _newHead <-> 0
        $.listings[LLKey][type(uint256).max].next = _newHead; // not included in the totals
        $.listings[LLKey][_newHead] = Listing(
            type(uint256).max,
            0,
            msg.sender,
            block.timestamp + $.listingDuration
        );
        $.listings[LLKey][0].previous = _newHead; // not included in the totals

        // increment the number of listings under this tag
        $.listingTotals[LLKey] += 1;

        emit RankingUpdate(address(0), msg.sender, tag, _newHead);
    }

    /// @notice Inserts a new listing into the doubly-linked Listings mapping
    /// @dev _newSlot <-> _existingSlot
    /// @param tag Human readable string denoting the target tag to stake
    /// @param _newSlot New linked list entry that will point to the Listing at _existingSlot
    /// @param _existingSlot Listing slot that will be pointed to by the new Listing at _newSlot
    function insertUpstream(
        string calldata tag,
        uint256 _newSlot,
        uint256 _existingSlot
    ) external onlyContentObject {
        ContentFactoryStorage storage $ = _getContentFactoryStorage();

        require(
            _newSlot > 0,
            "ConsentFactory: _newSlot must be greater than 0"
        );
        require(
            _newSlot > _existingSlot,
            "ConsentFactory: _newSlot must be greater than _existingSlot"
        );

        // The new listing must fit between _upstream and its current downstresam
        // if the next variable is 0, it means the slot is uninitialized and thus it is invalid _upstream entry
        bytes32 LLKey = keccak256(abi.encodePacked(tag));
        Listing memory existingListing = $.listings[LLKey][_existingSlot];
        require(
            existingListing.previous > _newSlot,
            "ConsentFactory: _newSlot is greater than existingListing.previous"
        );

        $.listings[LLKey][existingListing.previous].next = _newSlot;
        $.listings[LLKey][_newSlot] = Listing(
            existingListing.previous,
            _existingSlot,
            msg.sender,
            block.timestamp + $.listingDuration
        );
        $.listings[LLKey][_existingSlot].previous = _newSlot;

        $.listingTotals[LLKey] += 1;

        emit RankingUpdate(address(0), msg.sender, tag, _newSlot);
    }

    /// @notice Inserts a new listing into the doubly-linked Listings mapping
    /// @dev _existingSlot <-> _newSlot
    /// @param tag Human readable string denoting the target tag to stake
    /// @param _existingSlot Listing slot that will be pointed to by the new Listing at _newSlot
    /// @param _newSlot New linked list entry that will point to the Listing at _existingSlot
    function insertDownstream(
        string calldata tag,
        uint256 _existingSlot,
        uint256 _newSlot
    ) external onlyContentObject {
        ContentFactoryStorage storage $ = _getContentFactoryStorage();

        require(
            _newSlot > 0,
            "ConsentFactory: _newSlot must be greater than 0"
        );
        require(
            _existingSlot > _newSlot,
            "ConsentFactory: _existingSlot must be greater than _newSlot"
        );

        // The new listing must fit between _upstream and its current downstream
        // if the next variable is 0, it means the slot is uninitialized and thus it is invalid _upstream entry
        bytes32 LLKey = keccak256(abi.encodePacked(tag));
        Listing memory existingListing = $.listings[LLKey][_existingSlot];
        require(
            existingListing.next < _newSlot,
            "ConsentFactory: _newSlot is less than existingListing.next"
        );

        $.listings[LLKey][_existingSlot].next = _newSlot;
        $.listings[LLKey][_newSlot] = Listing(
            _existingSlot,
            existingListing.next,
            msg.sender,
            block.timestamp + $.listingDuration
        );
        $.listings[LLKey][existingListing.next].previous = _newSlot;

        $.listingTotals[LLKey] += 1;

        emit RankingUpdate(address(0), msg.sender, tag, _newSlot);
    }

    /// @notice Replaces an existing listing that has expired (works for head and tail listings)
    /// @param tag Human readable string denoting the target tag to stake
    /// @param _slot The expired slot to replace with a new listing
    function replaceExpiredListing(
        string calldata tag,
        uint256 _slot
    ) external onlyContentObject {
        ContentFactoryStorage storage $ = _getContentFactoryStorage();

        // grab the old listing under the targeted tag
        bytes32 LLKey = keccak256(abi.encodePacked(tag));
        Listing memory oldListing = $.listings[LLKey][_slot];

        // you cannot replace an invalid slot nor one that has not expired yet
        require(
            oldListing.timeExpiring > 0,
            "ConsentFactory: Cannot replace an empty slot"
        );
        require(
            block.timestamp > oldListing.timeExpiring,
            "ConsentFactory: current listing is still active"
        );

        // slide the new listing into the existing slot
        $.listings[LLKey][_slot] = Listing(
            oldListing.previous,
            oldListing.next,
            msg.sender,
            block.timestamp + $.listingDuration
        );

        emit RankingUpdate(oldListing.contentObject, msg.sender, tag, _slot);
    }

    /// @notice removes a listing in the marketplace listing map
    /// @param tag Human readable string denoting the target tag
    /// @param _removedSlot the slot to remove from the Listing data structure
    function removeListing(
        string calldata tag,
        uint256 _removedSlot
    ) external onlyContentObject {
        ContentFactoryStorage storage $ = _getContentFactoryStorage();

        // grab the candidate head listing to be removed
        bytes32 LLKey = keccak256(abi.encodePacked(tag));
        Listing memory removedListing = $.listings[LLKey][_removedSlot];

        // the caller must own the listing which is being removed
        require(
            msg.sender == removedListing.contentObject,
            "ConsentFactory: only listing owner can remove"
        );

        $.listings[LLKey][removedListing.previous].next = removedListing.next;
        delete $.listings[LLKey][_removedSlot];
        $.listings[LLKey][removedListing.next].previous = removedListing
            .previous;

        // decrement the number of listings
        $.listingTotals[LLKey] -= 1;

        emit RankingUpdate(
            removedListing.contentObject,
            address(0),
            tag,
            _removedSlot
        );
    }

    /// @notice allows the DEFAULT_ADMINE_ROLE to remove a listing in the marketplace listing map
    /// @param tag Human readable string denoting the target tag
    /// @param _removedSlot the slot to remove from the Listing data structure
    function _adminRemoveListing(
        string memory tag,
        uint256 _removedSlot
    ) internal {
        ContentFactoryStorage storage $ = _getContentFactoryStorage();

        // grab the candidate head listing to be removed
        bytes32 LLKey = keccak256(abi.encodePacked(tag));
        Listing memory removedListing = $.listings[LLKey][_removedSlot];
        require(
            removedListing.timeExpiring > 0,
            "ConsentFactory: this slot is not initialized"
        );

        $.listings[LLKey][removedListing.previous].next = removedListing.next;
        delete $.listings[LLKey][_removedSlot];
        $.listings[LLKey][removedListing.next].previous = removedListing
            .previous;

        // decrement the number of listings
        $.listingTotals[LLKey] -= 1;

        emit RankingUpdate(
            removedListing.contentObject,
            address(0),
            tag,
            _removedSlot
        );
    }

    /// @notice Admin endpoint to change the default time (in seconds) a listing is valid
    /// @param _listingDuration duration period in seconds
    function _setListingDuration(uint256 _listingDuration) internal {
        ContentFactoryStorage storage $ = _getContentFactoryStorage();
        $.listingDuration = _listingDuration;
    }

    /// @notice Admin endpoint to change the maximum number of tags a consent contract can stake against
    /// @param _maxTagsPerListing Integer number of tags that each consent contract will be limited to
    function _setMaxTagsPerListing(uint256 _maxTagsPerListing) internal {
        ContentFactoryStorage storage $ = _getContentFactoryStorage();
        $.maxTagsPerListing = _maxTagsPerListing;
    }

    /// @notice internal setter function for keeping track of deployed content objects
    /// @param contentAddress address of the newly deployed content object
    function _setContentObjectAddress(address contentAddress) internal {
        ContentFactoryStorage storage $ = _getContentFactoryStorage();
        $.contentAddressCheck[contentAddress] = true;
    }
}