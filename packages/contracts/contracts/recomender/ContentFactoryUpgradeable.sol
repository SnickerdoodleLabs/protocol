// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import {IContentFactory} from "./IContentFactory.sol";
import {IConsent} from "../consent/IConsent.sol";
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

abstract contract ContentFactoryUpgradeable is IContentFactory, Initializable {
    using SafeERC20 for IERC20;

    /* Storage Variables */
    /// @custom:storage-location erc7201:snickerdoodle.contentfactory
    struct ContentFactoryStorage {
        /// @dev governance token that controls DAO and fees
        address governanceToken;
        /// @dev the default amount of time, in seconds, that a listing is valid for
        uint256 listingDuration;
        /// @dev the default maximum number of tags that can be staked by a single consent constract listing
        uint256 maxTagsPerListing;
        /// @dev registered ERC20 tokens that can be used for staking the recommender system
        mapping(address => bool) stakingTokens;
        /// @dev Mapping of addresses of registered content objects
        mapping(address => bool) contentAddressCheck;
        /// @dev Mapping from staking token to content objects that have been blocked by that namespace
        mapping(address => mapping(address => bool)) namespaceBlockedList;
        /// @dev the total number of listings in the marketplace
        /// @dev first layer maps from a hashed tag to a staking token-keyed map
        /// @dev second layer maps from a staking token to the total number of listings
        mapping(bytes32 => mapping(address => uint256)) listingTotals;
        /// @dev nested mapping
        /// @dev first layer maps from hashed tag string to a staked token
        /// @dev second layer maps from a staking token the tokens linked list
        /// @dev third layer maps a rank slot to the actual listing
        mapping(bytes32 => mapping(address => mapping(uint256 => Listing))) listings;
        /// @dev nested mapping
        /// @dev first layer maps from hashed tag string to a staked token
        /// @dev second layer maps from a staking token the tokens linked list
        /// @dev third layer maps a content object address to its occupied slot
        mapping(bytes32 => mapping(address => mapping(address => uint256))) listingOccupants;
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
        address _governanceToken,
        uint256 _listingDuration,
        uint256 _maxTagsPerListing
    ) internal onlyInitializing {
        __ContentObject_init_unchained(
            _governanceToken,
            _listingDuration,
            _maxTagsPerListing
        );
    }

    function __ContentObject_init_unchained(
        address _governanceToken,
        uint256 _listingDuration,
        uint256 _maxTagsPerListing
    ) internal onlyInitializing {
        ContentFactoryStorage storage $ = _getContentFactoryStorage();
        // set the primary token address of the protocol
        $.governanceToken = _governanceToken;
        // register that token as a staking token
        $.stakingTokens[_governanceToken] = true;
        // set the default listing duration period (2 weeks = 60 * 60 * 24 * 14)
        $.listingDuration = _listingDuration;
        // set the maximum allowable tags per conent object (20)
        $.maxTagsPerListing = _maxTagsPerListing;
    }

    /* MODIFIERS */

    /// @notice Modified to check if a caller of a function is a content object that the factory knows about
    /// @dev Every time a content object is deployed, it must be registered via _setContentObjectAddress
    modifier onlyContentObject(address stakingToken) {
        ContentFactoryStorage storage $ = _getContentFactoryStorage();
        // ensure that the immediate caller of the function is a content object that is not blocked
        require(
            $.contentAddressCheck[msg.sender] == true,
            "Content Factory: Caller is not a content object"
        );
        require(
            $.namespaceBlockedList[stakingToken][msg.sender] == false,
            "Content Factory: Caller has been blocked"
        );
        _;
    }

    /* Function Implementations */

    /// @notice get the address of the primary staking token used for stake for rank
    function getGovernanceToken() external view returns (address) {
        ContentFactoryStorage storage $ = _getContentFactoryStorage();
        return $.governanceToken;
    }

    /// @notice returns true if the address is a registered staking token
    /// @param tokenAddress the address of an ERC20 token contract
    function isStakingToken(address tokenAddress) external view returns (bool) {
        return _isStakingToken(tokenAddress);
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
    /// @param stakedToken Address of the token used for staking recommender listings
    function getTagTotal(
        string calldata tag,
        address stakedToken
    ) external view returns (uint256) {
        ContentFactoryStorage storage $ = _getContentFactoryStorage();
        bytes32 LLKey = keccak256(abi.encodePacked(tag));
        return $.listingTotals[LLKey][stakedToken];
    }

    /// @notice Returns an array of Listings from the marketplace linked list from highest to lowest ranked
    /// @dev to start from the highest ranked slot, use (2^256)-1 for _startingSlot
    /// @param tag Human readable string denoting the target tag to stake
    /// @param stakingToken Address of the token used for staking recommender listings
    /// @param _startingSlot slot to start at in the linked list
    /// @param numSlots number of entries to return
    /// @param filterActive boolean flag indicating if the results should include expired listings (false) or not (true)
    function getListingsForward(
        string calldata tag,
        address stakingToken,
        uint256 _startingSlot,
        uint256 numSlots,
        bool filterActive
    ) external view returns (string[] memory, Listing[] memory) {
        ContentFactoryStorage storage $ = _getContentFactoryStorage();

        string[] memory cids = new string[](numSlots);
        Listing[] memory sources = new Listing[](numSlots);

        bytes32 LLKey = keccak256(abi.encodePacked(tag));

        // if the user passes in (2^256)-1, automatically jump to the highest staked slot
        if (_startingSlot == type(uint256).max) {
            _startingSlot = $.listings[LLKey][stakingToken][_startingSlot].next;
        }

        for (uint i = 0; i < numSlots; i++) {
            Listing memory listing = $.listings[LLKey][stakingToken][
                _startingSlot
            ];
            require(listing.timeExpiring > 0, "Content Factory: invalid slot"); // ensure the listing is valid by looking at the timestamp
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
    /// @param stakingToken Address of the token used for staking recommender listings
    /// @param _startingSlot slot to start at in the linked list
    /// @param numSlots number of entries to return
    /// @param filterActive boolean flag indicating if the results should include expired listings (false) or not (true)
    function getListingsBackward(
        string calldata tag,
        address stakingToken,
        uint256 _startingSlot,
        uint256 numSlots,
        bool filterActive
    ) external view returns (string[] memory, Listing[] memory) {
        ContentFactoryStorage storage $ = _getContentFactoryStorage();

        string[] memory cids = new string[](numSlots);
        Listing[] memory sources = new Listing[](numSlots);

        bytes32 LLKey = keccak256(abi.encodePacked(tag));

        for (uint i = 0; i < numSlots; i++) {
            Listing memory listing = $.listings[LLKey][stakingToken][
                _startingSlot
            ];
            require(listing.timeExpiring > 0, "Content Factory: invalid slot"); // ensure the listing is valid by looking at the timestamp
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

    /// @notice Initializes a doubly-linked list under the given attribute and staking token
    /// @dev a tag must be initialized before other functions can be called in order to fill the slots at (2^256)-1 and 0
    /// @param tag Human readable string denoting the target tag to stake
    /// @param stakingToken Address of the token used for staking recommender listings
    /// @param _newHead Slot that will initialize this tag in the given token namespace
    function initializeTag(
        string calldata tag,
        address stakingToken,
        uint256 _newHead
    ) external onlyContentObject(stakingToken) {
        ContentFactoryStorage storage $ = _getContentFactoryStorage();

        require(
            $.stakingTokens[stakingToken],
            "Content Factory: Staking token not registered"
        );

        // hash the tag to compute its storage key
        bytes32 LLKey = keccak256(abi.encodePacked(tag));

        // the tag must not have been initialized previously
        require(
            $.listingTotals[LLKey][stakingToken] == 0,
            "Content Factory: This tag is already initialized"
        );

        // calculate the price of the slot
        uint256 stake = _computeFee(_newHead);

        // we use index 0 and 2^256-1 to be our boundary conditions so we don't have to use a dedicated storage variable for the head/tail listings
        // (2^256)-1 <-> _newHead <-> 0
        $.listings[LLKey][stakingToken][type(uint256).max].next = _newHead; // not included in the totals
        $.listings[LLKey][stakingToken][_newHead] = Listing(
            type(uint256).max,
            0,
            msg.sender,
            stake,
            block.timestamp + $.listingDuration
        );
        $.listings[LLKey][stakingToken][0].previous = _newHead; // not included in the totals

        // set the tag occupancy so the object cannot stake more than once in the same tag namespace
        $.listingOccupants[LLKey][stakingToken][msg.sender] = _newHead;

        // increment the number of listings under this tag
        $.listingTotals[LLKey][stakingToken] += 1;

        // pull the stake from the content object
        IERC20(stakingToken).safeTransferFrom(msg.sender, address(this), stake);

        // we require the content object send the tag string so that it can be emitted from the factory
        emit RankingUpdate(address(0), msg.sender, stakingToken, tag, _newHead);
    }

    /// @notice Inserts a new listing into the doubly-linked Listings mapping
    /// @dev _newSlot (upstream) <-> _existingSlot (downstream); _newSlot > _existingSlot
    /// @param tag Human readable string denoting the target tag to stake
    /// @param stakingToken Address of the token used for staking recommender listings
    /// @param _newSlot New linked list entry that will point to the Listing at _existingSlot
    /// @param _existingSlot Listing slot that will be pointed to by the new Listing at _newSlot
    function insertUpstream(
        string calldata tag,
        address stakingToken,
        uint256 _newSlot,
        uint256 _existingSlot
    ) external onlyContentObject(stakingToken) {
        ContentFactoryStorage storage $ = _getContentFactoryStorage();
        bytes32 LLKey = keccak256(abi.encodePacked(tag));
        require(
            $.stakingTokens[stakingToken],
            "Content Factory: Staking token not registered"
        );
        require(
            _newSlot > 0,
            "Content Factory: _newSlot must be greater than 0"
        );
        require(
            _newSlot > _existingSlot,
            "Content Factory: _newSlot must be greater than _existingSlot"
        );
        require(
            $.listingOccupants[LLKey][stakingToken][msg.sender] == 0,
            "Content Factory: Content Object has already staked this tag"
        );

        // The new listing must fit between _upstream and its current downstresam
        // if the .previous variable is 0, it means the slot is uninitialized and thus it is invalid _upstream entry
        Listing memory existingListing = $.listings[LLKey][stakingToken][
            _existingSlot
        ];
        require(
            existingListing.previous > _newSlot,
            "Content Factory: _newSlot is greater than existingListing.previous"
        );

        // calculate the price of the slot
        uint256 stake = _computeFee(_newSlot);

        // insert the new listing
        $
        .listings[LLKey][stakingToken][existingListing.previous]
            .next = _newSlot;
        $.listings[LLKey][stakingToken][_newSlot] = Listing(
            existingListing.previous,
            _existingSlot,
            msg.sender,
            stake,
            block.timestamp + $.listingDuration
        );
        $.listings[LLKey][stakingToken][_existingSlot].previous = _newSlot;

        // set the tag occupancy so the object cannot stake more than once in the same tag namespace
        $.listingOccupants[LLKey][stakingToken][msg.sender] = _newSlot;

        // increment the number of listings under this tag
        $.listingTotals[LLKey][stakingToken] += 1;

        // pull the stake from the content object
        IERC20(stakingToken).safeTransferFrom(msg.sender, address(this), stake);

        emit RankingUpdate(address(0), msg.sender, stakingToken, tag, _newSlot);
    }

    /// @notice Moves an existing listing further up the doubly-linked Listings mapping
    /// @dev _newSlot (upstream) <-> _existingSlot (downstream); _newSlot > _existingSlot
    /// @param tag Human readable string denoting the target tag to stake
    /// @param stakingToken Address of the token used for staking recommender listings
    /// @param _newSlot New linked list entry that will point to the Listing at _existingSlot
    /// @param _downstreamSlot Listing slot that will be pointed to by the new Listing at _newSlot
    function moveUpstream(
        string calldata tag,
        address stakingToken,
        uint256 _newSlot,
        uint256 _downstreamSlot
    ) external onlyContentObject(stakingToken) {
        ContentFactoryStorage storage $ = _getContentFactoryStorage();
        bytes32 LLKey = keccak256(abi.encodePacked(tag));
        require(
            $.stakingTokens[stakingToken],
            "Content Factory: Staking token not registered"
        );

        uint256 currentSlot = $.listingOccupants[LLKey][stakingToken][
            msg.sender
        ];
        require(
            currentSlot < _newSlot,
            "Content Factory: _newSlot must be greater than current slot"
        );
        require(currentSlot != 0, "Content Factory: no existing listing");

        Listing memory oldListing = $.listings[LLKey][stakingToken][
            currentSlot
        ];

        // calculate the price of the slot
        uint256 stake = _computeFee(_newSlot);

        if (oldListing.previous > _newSlot) {
            // if we're just moving higher in the same bracket, we only update that listing neighborhood
            $
            .listings[LLKey][stakingToken][oldListing.previous].next = _newSlot;
            $.listings[LLKey][stakingToken][_newSlot] = Listing(
                oldListing.previous,
                oldListing.next,
                msg.sender,
                stake,
                block.timestamp + $.listingDuration
            );
            $
            .listings[LLKey][stakingToken][oldListing.next].previous = _newSlot;
        } else {
            // if the new slot is higher than the existing upstream listing, we have to update two neighborhoods
            $
            .listings[LLKey][stakingToken][oldListing.previous]
                .next = oldListing.next;
            $
            .listings[LLKey][stakingToken][oldListing.next]
                .previous = oldListing.previous;

            // The new listing must fit between _upstream and its current downstresam
            // we store only the downstreamListing.preview variable to avoid hitting the Solidity stack limit
            uint256 downstreamListingPrevious = $.listings[LLKey][stakingToken][
                _downstreamSlot
            ].previous;
            require(
                downstreamListingPrevious > _newSlot,
                "Content Factory: _newSlot is greater than existingListing.previous"
            );

            // insert the new listing
            $
            .listings[LLKey][stakingToken][downstreamListingPrevious]
                .next = _newSlot;
            $.listings[LLKey][stakingToken][_newSlot] = Listing(
                downstreamListingPrevious,
                _downstreamSlot,
                msg.sender,
                stake,
                block.timestamp + $.listingDuration
            );
            $
            .listings[LLKey][stakingToken][_downstreamSlot].previous = _newSlot;
        }

        // clear the old slot
        delete $.listings[LLKey][stakingToken][currentSlot]; 

        // set the tag occupancy so the object cannot stake more than once in the same tag namespace
        $.listingOccupants[LLKey][stakingToken][msg.sender] = _newSlot;

        // pull the stake from the content object
        IERC20(stakingToken).safeTransferFrom(
            msg.sender,
            address(this),
            (stake - oldListing.stake) // transfer the delta needed for the new slot
        );

        // emit event deleting the old listing and emit an event inserting the new listing
        emit RankingUpdate(
            msg.sender,
            address(0),
            stakingToken,
            tag,
            currentSlot
        );
        emit RankingUpdate(address(0), msg.sender, stakingToken, tag, _newSlot);
    }

    /// @notice Inserts a new listing into the doubly-linked Listings mapping
    /// @dev _existingSlot (upstream) <-> _newSlot (downstream): _existingSlot > _newSlot
    /// @param tag Human readable string denoting the target tag to stake
    /// @param stakingToken Address of the token used for staking recommender listings
    /// @param _existingSlot Listing slot that will be pointed to by the new Listing at _newSlot
    /// @param _newSlot New linked list entry that will point to the Listing at _existingSlot
    function insertDownstream(
        string calldata tag,
        address stakingToken,
        uint256 _existingSlot,
        uint256 _newSlot
    ) external onlyContentObject(stakingToken) {
        ContentFactoryStorage storage $ = _getContentFactoryStorage();
        bytes32 LLKey = keccak256(abi.encodePacked(tag));
        require(
            $.stakingTokens[stakingToken],
            "Content Factory: Staking token not registered"
        );
        require(
            _newSlot > 0,
            "Content Factory: _newSlot must be greater than 0"
        );
        require(
            _existingSlot > _newSlot,
            "Content Factory: _existingSlot must be greater than _newSlot"
        );
        require(
            $.listingOccupants[LLKey][stakingToken][msg.sender] == 0,
            "Content Factory: Content Object has already staked this tag"
        );

        // The new listing must fit between _upstream and its current downstream
        // if the next variable is 0, it means the slot is uninitialized and thus it is invalid _upstream entry
        Listing memory existingListing = $.listings[LLKey][stakingToken][
            _existingSlot
        ];
        require(
            existingListing.next < _newSlot,
            "Content Factory: _newSlot is less than existingListing.next"
        );

        // calculate the price of the slot
        uint256 stake = _computeFee(_newSlot);

        $.listings[LLKey][stakingToken][_existingSlot].next = _newSlot;
        $.listings[LLKey][stakingToken][_newSlot] = Listing(
            _existingSlot,
            existingListing.next,
            msg.sender,
            stake,
            block.timestamp + $.listingDuration
        );
        $
        .listings[LLKey][stakingToken][existingListing.next]
            .previous = _newSlot;

        // set the tag occupancy so the object cannot stake more than once in the same tag namespace
        $.listingOccupants[LLKey][stakingToken][msg.sender] = _newSlot;

        // increment the number of listings under this tag
        $.listingTotals[LLKey][stakingToken] += 1;

        // pull the stake from the content object
        IERC20(stakingToken).safeTransferFrom(msg.sender, address(this), stake);

        emit RankingUpdate(address(0), msg.sender, stakingToken, tag, _newSlot);
    }

    /// @notice Replaces an existing listing that has expired (works for head and tail listings)
    /// @param tag Human readable string denoting the target tag to stake
    /// @param stakingToken Address of the token used for staking recommender listings
    /// @param _slot The expired slot to replace with a new listing
    function replaceExpiredListing(
        string calldata tag,
        address stakingToken,
        uint256 _slot
    ) external onlyContentObject(stakingToken) {
        ContentFactoryStorage storage $ = _getContentFactoryStorage();
        bytes32 LLKey = keccak256(abi.encodePacked(tag));

        require(
            $.stakingTokens[stakingToken],
            "Content Factory: Staking token not registered"
        );

        // grab the old listing under the targeted tag
        Listing memory oldListing = $.listings[LLKey][stakingToken][_slot];

        // A content object cannot list twice in the same tag:token namespace
        // but it can restake its expired listing
        require(
            ($.listingOccupants[LLKey][stakingToken][msg.sender] == 0) ||
                (oldListing.contentObject == msg.sender),
            "Content Factory: Content Object has already staked this tag"
        );

        // you cannot replace an invalid slot nor one that has not expired yet
        require(
            oldListing.timeExpiring > 0,
            "Content Factory: Cannot replace an empty slot"
        );
        require(
            block.timestamp > oldListing.timeExpiring,
            "Content Factory: current listing is still active"
        );

        // slide the new listing into the existing slot
        $.listings[LLKey][stakingToken][_slot] = Listing(
            oldListing.previous,
            oldListing.next,
            msg.sender,
            oldListing.stake,
            block.timestamp + $.listingDuration
        );

        // if the caller was the old occupant, we are done
        if (msg.sender != oldListing.contentObject) {
            // set the tag occupancy so the object cannot stake more than once in the same tag namespace
            $.listingOccupants[LLKey][stakingToken][msg.sender] = _slot;
            delete $.listingOccupants[LLKey][stakingToken][
                oldListing.contentObject
            ];

            // push stake back to replaced object
            IERC20(stakingToken).safeTransferFrom(
                msg.sender,
                oldListing.contentObject,
                oldListing.stake
            );

            emit RankingUpdate(
                oldListing.contentObject,
                msg.sender,
                stakingToken,
                tag,
                _slot
            );
        }
    }

    /// @notice Removes expired listings for a specific tag-token list
    /// @dev This function can be called by anyone willing to curate the global listings
    /// @param tag Human readable string denoting the target tag to stake
    /// @param stakingToken Address of the token used for staking recommender listings
    /// @param slots An array of slot values that have expired that will be removed
    function removeExpiredListings(
        string calldata tag,
        address stakingToken,
        uint256[] calldata slots
    ) external onlyContentObject(stakingToken) {
        ContentFactoryStorage storage $ = _getContentFactoryStorage();

        require(
            $.stakingTokens[stakingToken],
            "Content Factory: Staking token not registered"
        );

        // grab the old listing under the targeted tag
        bytes32 LLKey = keccak256(abi.encodePacked(tag));
        uint numSlots = slots.length;
        for (uint i = 0; i < numSlots; i++) {
            Listing memory expiredListing = $.listings[LLKey][stakingToken][
                slots[i]
            ];

            // you cannot remove an invalid slot nor one that has not expired yet
            if (
                (expiredListing.timeExpiring == 0) ||
                (expiredListing.timeExpiring > block.timestamp)
            ) {
                continue; // skip this slot if its not initialized or still active
            }

            _ejectListing(expiredListing, stakingToken, tag, LLKey, slots[i]);
        }
    }

    /// @notice removes a listing in the marketplace listing map
    /// @param tag Human readable string denoting the target tag
    /// @param stakingToken Address of the token used for staking recommender listings
    /// @param removedSlot the slot to remove from the Listing data structure
    function removeListing(
        string calldata tag,
        address stakingToken,
        uint256 removedSlot
    ) external onlyContentObject(stakingToken) {
        ContentFactoryStorage storage $ = _getContentFactoryStorage();

        require(
            $.stakingTokens[stakingToken],
            "Content Factory: Staking token not registered"
        );

        // grab the candidate head listing to be removed
        bytes32 LLKey = keccak256(abi.encodePacked(tag));
        Listing memory removedListing = $.listings[LLKey][stakingToken][
            removedSlot
        ];

        // the caller must own the listing which is being removed
        require(
            msg.sender == removedListing.contentObject,
            "Content Factory: only listing owner can remove"
        );

        _ejectListing(removedListing, stakingToken, tag, LLKey, removedSlot);
    }

    /// @notice returns amount of token to pull for a given slot based on 1.0001^_slot
    /// @dev you can call this function from the client to compute the amount of token to allow this contract
    /// @param _slot integer representing the slot in the global linked list to aquire
    function computeFee(uint256 _slot) external pure returns (uint256) {
        return _computeFee(_slot);
    }

    function _computeFee(uint256 _slot) internal pure returns (uint256) {
        // To handle decimals
        uint256 scale = 1e18; // Scaling factor to represent decimals
        uint256 result = 1e18; // Initialize result to 1 with scale
        uint256 base = 1000100000000000000; // Represents 1.0001 with 18 decimal places

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

    /// @notice removes multiple listings from the global listings
    /// @param tag Human readable string denoting the target tag
    /// @param stakingToken Address of the token used for staking recommender listings
    /// @param removedSlots the slot to remove from the Listing data structure
    function _adminRemoveListings(
        string memory tag,
        address stakingToken,
        uint256[] memory removedSlots
    ) internal {
        ContentFactoryStorage storage $ = _getContentFactoryStorage();

        require(
            $.stakingTokens[stakingToken],
            "Content Factory: Staking token not registered"
        );

        // grab the candidate head listing to be removed
        bytes32 LLKey = keccak256(abi.encodePacked(tag));

        uint numSlots = removedSlots.length;
        for (uint i = 0; i < numSlots; i++) {
            Listing memory removedListing = $.listings[LLKey][stakingToken][
                removedSlots[i]
            ];

            // skip any provided slots that are not initialized
            if (removedListing.timeExpiring == 0) {
                continue;
            }

            _ejectListing(
                removedListing,
                stakingToken,
                tag,
                LLKey,
                removedSlots[i]
            );
        }
    }

    function _ejectListing(
        Listing memory removedListing,
        address stakingToken,
        string memory tag,
        bytes32 LLKey,
        uint removedSlot
    ) private {
        ContentFactoryStorage storage $ = _getContentFactoryStorage();
        $
        .listings[LLKey][stakingToken][removedListing.previous]
            .next = removedListing.next;
        delete $.listings[LLKey][stakingToken][removedSlot];
        $
        .listings[LLKey][stakingToken][removedListing.next]
            .previous = removedListing.previous;

        // delete the tag occupancy storage so that the object could re-enter later
        delete $.listingOccupants[LLKey][stakingToken][
            removedListing.contentObject
        ];

        // decrement the number of listings
        $.listingTotals[LLKey][stakingToken] -= 1;

        // push old stake back to ejected object
        IERC20(stakingToken).safeTransfer(
            removedListing.contentObject,
            removedListing.stake
        );

        emit RankingUpdate(
            removedListing.contentObject,
            address(0),
            stakingToken,
            tag,
            removedSlot
        );
    }

    /// @notice returns true if the address is a registered staking token
    function _isStakingToken(
        address tokenAddress
    ) internal view returns (bool) {
        ContentFactoryStorage storage $ = _getContentFactoryStorage();
        return $.stakingTokens[tokenAddress];
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

    /// @notice internal setter function for blocking a content object in a namespace
    /// @param stakingToken address of the staking token namespace
    /// @param contentAddress address of the newly deployed content object
    function _blockContentObject(
        address stakingToken,
        address contentAddress
    ) internal {
        ContentFactoryStorage storage $ = _getContentFactoryStorage();
        $.namespaceBlockedList[stakingToken][contentAddress] = true;
    }

    /// @notice internal setter function for unblocking a content object in a namespace
    /// @param stakingToken address of the staking token namespace
    /// @param contentAddress address of the newly deployed content object
    function _unblockContentObject(
        address stakingToken,
        address contentAddress
    ) internal {
        ContentFactoryStorage storage $ = _getContentFactoryStorage();
        $.namespaceBlockedList[stakingToken][contentAddress] = false;
    }

    /// @notice internal setter function for registering a new staking token
    /// @param stakingToken address of the new staking token
    function _registerStakingToken(address stakingToken) internal {
        ContentFactoryStorage storage $ = _getContentFactoryStorage();
        $.stakingTokens[stakingToken] = true;
    }
}
