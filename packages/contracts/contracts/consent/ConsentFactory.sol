// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlEnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ContextUpgradeable.sol";
import "@openzeppelin/contracts/proxy/beacon/BeaconProxy.sol";
import "@openzeppelin/contracts/proxy/beacon/UpgradeableBeacon.sol";
import "./Consent.sol";
import "hardhat/console.sol";

/// @title Consent Factory
/// @author Snickerdoodle Labs
/// @notice Synamint Protocol Consent Registry Factory Contract 
/// @dev This contract deploys new BeaconProxy instances that all point to the latest Consent implementation contract via the UpgradeableBeacon 
/// @dev The baseline contract was generated using OpenZeppelin's (OZ) Contract Wizard with added features 
/// @dev The contract adopts OZ's proxy upgrade pattern and is compatible with OZ's meta-transaction library  
contract ConsentFactory is Initializable, PausableUpgradeable, AccessControlEnumerableUpgradeable {

    /// @dev Listing object for storing marketplace listings
    struct Listing{
      uint256 previous; // pointer to the previous active slot
      uint256 next; // pointer to the next active slot
      address consentContract; // address of the target consent contract
      uint256 timeExpiring; // unix timestamp when the listing expires and can be replaced
    }

    /// @dev the total number of listings in the marketplace
    mapping(bytes32 => uint256) public listingTotals; 

    /// @dev the default amount of time, in seconds, that a listing is valid for
    uint256 public listingDuration; 

    /// @dev nested mapping
    /// @dev first layer maps from hashed tag string to a linked list
    /// @dev second layer is the linked list mapping structure
    mapping(bytes32 => mapping(uint256 => Listing)) listings; 

    /// @dev The PAUSE_ROLE can pause all activity in the factory contract
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    /// @dev Address of the EIP2771-compatible trusted forwarder contract to be used by all consent contracts
    address public trustedForwarder;

    /// Mapping of addresses to an array of its deployed beacon proxy addresses
    mapping(address => address[]) public addressToDeployedConsents;

    /// Mapping of addresses to an array of its deployed beacon proxy addresses
    mapping(address => mapping(address => uint256)) public addressToDeployedConsentsIndex;

    /// @dev Mapping of deployed beacon proxy addresses to track that it is a Consent contract
    mapping(address => bool) public consentAddressCheck;

    /// @dev Mapping of user address to contracts addresses they have specific roles for
    /// @dev User address => role => Consent address array
    mapping(address => mapping(bytes32 => address[])) public addressToUserRolesArray;

    /// @dev Mapping of user address to contracts addresses they have specific roles for
    /// @dev User address => role => Consent address => index within the array
    mapping(address => mapping(bytes32 => mapping(address => uint256))) public addressToUserRolesArrayIndex;

    /// @dev Address of the upgradeable beacon
    address public beaconAddress; 

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

    /* MODIFIERS */

    /// @notice Modified to check if a caller of a function is a Consent contract
    /// @dev Every time a Consent contract is deployed, it is store into the consentAddressCheck mapping 
    modifier onlyConsentContract() {
        // ensure that the immediate caller of the function is a Consent contract or the DAO/DEFAULT_ADMIN_ROLE
        require(consentAddressCheck[msg.sender] == true , 'ConsentFactory: Caller is not a Consent Contract');
        _;
    }

    /// @notice Initializes the contract
    /// @dev Uses the initializer modifier to to ensure the contract is only initialized once
    /// @dev _trustedForwarder Address of the EIP-2771 compatible meta-tx forwarder contract
    /// @param _consentImpAddress Uses the initializer modifier to to ensure the contract is only initialized once
    function initialize(address _trustedForwarder, address _consentImpAddress) initializer public {
        __Pausable_init();
        __AccessControl_init();

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);

        // deploy the UpgradeableBeacon, transfer its ownership to the user and store its address
        UpgradeableBeacon _upgradeableBeacon = new UpgradeableBeacon(_consentImpAddress);
        _upgradeableBeacon.transferOwnership(msg.sender);
        beaconAddress = address(_upgradeableBeacon);

        trustedForwarder = _trustedForwarder;

        listingDuration = 2 weeks; 
    }

    /* CORE FUNCTIONS */

    /// @notice Initializes a doubly-linked list under the given attribute
    /// @param tag Human readable string denoting the target tag to stake
    /// @param _newHead Downstream pointer that will be pointed to by _newSlot
    function initializeTag(string memory tag, uint256 _newHead) external onlyConsentContract {

        bytes32 LLKey = keccak256(abi.encodePacked(tag));

        // the new linked list entry must be between two existing entries
        require(listingTotals[LLKey] == 0, "ConsentFactory: This tag is already initialized");

        // we use index 0 and 2^256-1 to be our boundary conditions so we don't have to use a dedicated storage variable for the head/tail listings
        listings[LLKey][2^256-1].next = _newHead; // not included in the totals
        listings[LLKey][_newHead] = Listing(2^256-1, 0, msg.sender, block.timestamp + listingDuration);
        listings[LLKey][0].previous = _newHead; // not included in the totals

        // increment the number of listings under this tag
        listingTotals[LLKey] += 1;

        emit NewListing(msg.sender, tag, _newHead);
    }

    /// @notice Inserts a new listing into the doubly-linked Listings mapping
    /// @dev _newSlot -> _existingSlot 
    /// @param tag Human readable string denoting the target tag to stake
    /// @param _newSlot New linked list entry that will point to the Listing at _existingSlot 
    /// @param _existingSlot Listing slot that will be pointed to by the new Listing at _newSlot  
    function insertUpstream(string memory tag, uint256 _newSlot, uint256 _existingSlot) external onlyConsentContract {

        require(_newSlot > 0, "ConsentFactory: _newSlot must be greater than 0");
        require(_newSlot > _existingSlot, "ConsentFactory: _newSlot must be greater than _existingSlot");

        // The new listing must fit between _upstream and its current downstresam
        // if the next variable is 0, it means the slot is uninitialized and thus it is invalid _upstream entry
        bytes32 LLKey = keccak256(abi.encodePacked(tag));
        Listing memory existingListing = listings[LLKey][_existingSlot];
        require(existingListing.previous > _newSlot, "ConsentFactory: _newSlot is greater than existingListing.previous");

        listings[LLKey][existingListing.previous].next = _newSlot;
        listings[LLKey][_newSlot] = Listing(existingListing.previous, _existingSlot, msg.sender, block.timestamp + listingDuration);
        listings[LLKey][_existingSlot].previous = _newSlot;

        listingTotals[LLKey] += 1; 

        emit NewListing(msg.sender, tag, _newSlot);
    }

    /// @notice Inserts a new listing into the doubly-linked Listings mapping
    /// @dev _existingSlot -> _newSlot
    /// @param tag Human readable string denoting the target tag to stake
    /// @param _existingSlot Listing slot that will be pointed to by the new Listing at _newSlot  
    /// @param _newSlot New linked list entry that will point to the Listing at _existingSlot 
    function insertDownstream(string memory tag, uint256 _existingSlot, uint256 _newSlot) external onlyConsentContract {

        require(_newSlot > 0, "ConsentFactory: _newSlot must be greater than 0");
        require(_existingSlot > _newSlot, "ConsentFactory: _existingSlot must be greater than _newSlot");

        // The new listing must fit between _upstream and its current downstresam
        // if the next variable is 0, it means the slot is uninitialized and thus it is invalid _upstream entry
        bytes32 LLKey = keccak256(abi.encodePacked(tag));
        Listing memory existingListing = listings[LLKey][_existingSlot];
        require(existingListing.next < _newSlot, "ConsentFactory: _newSlot is less than existingListing.next");
        
        listings[LLKey][_existingSlot].next = _newSlot;
        listings[LLKey][_newSlot] = Listing(existingListing.next, _existingSlot, msg.sender, block.timestamp + listingDuration);
        listings[LLKey][existingListing.next].previous = _newSlot;

        listingTotals[LLKey] += 1; 

        emit NewListing(msg.sender, tag, _newSlot);
    }

    /// @notice Replaces an existing listing that has expired (works for head and tail listings)
    /// @dev _newSlot -> oldHeadSlot
    /// @param tag Human readable string denoting the target tag to stake
    /// @param _slot The expired slot to replace with a new listing
    function replaceExpiredListing(string memory tag, uint256 _slot) external onlyConsentContract {

        // grab the old listing under the targeted tag
        bytes32 LLKey = keccak256(abi.encodePacked(tag));
        Listing memory oldListing = listings[LLKey][_slot];

        // you cannot replace an invalid slot nor one that has not expired yet
        require(oldListing.timeExpiring > 0, "ConsentFactory: Cannot replace an empty slot");
        require(block.timestamp > oldListing.timeExpiring, "ConsentFactory: current listing is still active");

        // slide the new listing into the existing slot
        listings[LLKey][_slot] = Listing(oldListing.previous, oldListing.next, msg.sender, block.timestamp + listingDuration);

        emit NewListing(msg.sender, tag, _slot);
    }

    /// @notice removes a listing in the marketplace listing map
    /// @param tag Human readable string denoting the target tag
    /// @param _removedSlot the slot to remove from the Listing data structure
    function removeListing(string memory tag, uint256 _removedSlot) external onlyConsentContract {

        // grab the candidate head listing to be removed
        bytes32 LLKey = keccak256(abi.encodePacked(tag));
        Listing memory removedSlot = listings[LLKey][_removedSlot];

        // the caller must own the listing which is being removed
        require(msg.sender == removedSlot.consentContract, "ConsentFactory: only listing owner can remove");

        listings[LLKey][removedSlot.previous].next = removedSlot.next;
        delete listings[LLKey][_removedSlot];
        listings[LLKey][removedSlot.next].previous = removedSlot.previous;

        // decrement the number of listings
        listingTotals[LLKey] -= 1;
    }

    /// @notice allows the DEFAULT_ADMINE_ROLE to remove a listing in the marketplace listing map
    /// @param tag Human readable string denoting the target tag
    /// @param _removedSlot the slot to remove from the Listing data structure
    function adminRemoveListing(string memory tag, uint256 _removedSlot) external onlyRole(DEFAULT_ADMIN_ROLE) {

        // grab the candidate head listing to be removed
        bytes32 LLKey = keccak256(abi.encodePacked(tag));
        Listing memory removedSlot = listings[LLKey][_removedSlot];
        require(removedSlot.timeExpiring > 0, "ConsentFactory: this slot is not initialized");

        listings[LLKey][removedSlot.previous].next = removedSlot.next;
        delete listings[LLKey][_removedSlot];
        listings[LLKey][removedSlot.next].previous = removedSlot.previous;

        // decrement the number of listings
        listingTotals[LLKey] -= 1;
    }

    /// @notice Returns an array of Listings from the marketplace linked list from highest to lowest ranked
    /// @param tag Human readable string denoting the target tag to stake
    /// @param _startingSlot slot to start at in the linked list
    /// @param numSlots number of entries to return
    function getListingsForward(string memory tag, uint256 _startingSlot, uint256 numSlots, bool filterActive) 
        external 
        view 
        returns (string [] memory, Listing [] memory) {

        string[] memory cids = new string[](numSlots);
        Listing[] memory sources = new Listing[](numSlots);

        bytes32 LLKey = keccak256(abi.encodePacked(tag));

        for (uint i = 0; i < numSlots; i++) {
            Listing memory listing = listings[LLKey][_startingSlot];
            require(listing.timeExpiring > 0, "ConsentFactory: invalid slot"); // ensure the listing is valid by looking at the timestamp
            if((filterActive == true) && (listing.timeExpiring < block.timestamp)) { continue; } // don't include expired listings if filtering enabled
            cids[i] = Consent(listing.consentContract).baseURI(); // grab the invitation details from the consent contract
            sources[i] = listing; // also grab the complete listing details
            _startingSlot = listing.next;
            if(_startingSlot == 0) { // slot 0 is the EOL tail slot
                break;
            }
        }
        return (cids, sources);
    }

    /// @notice Returns an array of Listings from the marketplace linked list from lowest to highest ranked
    /// @param tag Human readable string denoting the target tag to stake
    /// @param _startingSlot slot to start at in the linked list
    /// @param numSlots number of entries to return
    function getListingsBackward(string memory tag, uint256 _startingSlot, uint256 numSlots, bool filterActive) 
        external 
        view 
        returns (string [] memory, Listing [] memory) {

        string[] memory cids = new string[](numSlots);
        Listing[] memory sources = new Listing[](numSlots);

        bytes32 LLKey = keccak256(abi.encodePacked(tag));

        for (uint i = 0; i < numSlots; i++) {
            Listing memory listing = listings[LLKey][_startingSlot];
            require(listing.timeExpiring > 0, "ConsentFactory: invalid slot"); // ensure the listing is valid by looking at the timestamp
            if((filterActive == true) && (listing.timeExpiring < block.timestamp)) { continue; } // don't include expired listings if filtering enabled
            cids[i] = Consent(listing.consentContract).baseURI(); // grab the invitation details from the consent contract
            sources[i] = listing; // also grab the complete listing details
            _startingSlot = listing.previous;
            if(listing.previous == 2^256-1) { // slot 2^256-1 is the EOL head slot
                break;
            }
        }
        return (cids, sources);
    }

    /// @notice Creates a new Beacon Proxy contract pointing to the UpgradableBeacon 
    /// @dev This Beacon Proxy points to the UpgradableBeacon with the latest Consent implementation contract
    /// @dev Registers the deployed contract into the consentAddressCheck mapping
    /// @param owner Address of the owner of the Consent contract instance  
    /// @param baseURI Base uri for the for the Consent contract instance  
    /// @param name Name of the Consent Contract   
    function createConsent(address owner, string memory baseURI, string memory name) public {

        BeaconProxy beaconProxy = new BeaconProxy(beaconAddress, 
        abi.encodeWithSelector(Consent(address(0)).initialize.selector, trustedForwarder, owner, baseURI, name, address(this)));

        address beaconProxyAddress = address(beaconProxy);

        // register Consent address into mapping
        // so that it can call functions to update relevant mappings in future
        consentAddressCheck[beaconProxyAddress] = true;

        // add to owner's mapping of deployed Consents;
        addressToDeployedConsents[owner].push(beaconProxyAddress);

        // add the index within the array
        addressToDeployedConsentsIndex[owner][beaconProxyAddress] = addressToDeployedConsents[owner].length - 1;

        // add to the role mappings matching roles when initializing Consent contract 
        // DEFAULT_ADMIN_ROLE is 0x0 by default 
        addressToUserRolesArray[owner][keccak256("0")].push(beaconProxyAddress);
        addressToUserRolesArray[owner][keccak256("PAUSER_ROLE")].push(beaconProxyAddress);
        addressToUserRolesArray[owner][keccak256("SIGNER_ROLE")].push(beaconProxyAddress);
        addressToUserRolesArray[owner][keccak256("REQUESTER_ROLE")].push(beaconProxyAddress);

        // TODO revisit all emits to confirm we are emitting useful info
        emit ConsentDeployed(owner, beaconProxyAddress);
    }

    /// @notice Function to add roles a user address has on a specific contract
    /// @dev This allows us to retrieve a list of Consent contract addresses where the user has specific roles
    /// @param user Address of the user to update  
    /// @param role Role of the user in bytes32   
    function addUserRole(address user, bytes32 role) external onlyConsentContract {
       
       // retrieve the array of address a users has and add the latest
       addressToUserRolesArray[user][role].push(msg.sender);

       // store the index of the last pushed element
       addressToUserRolesArrayIndex[user][role][msg.sender] = addressToUserRolesArray[user][role].length - 1;
    }

    /// @notice Function to add roles a user address has on a specific contract
    /// @dev This allows us to retrieve a list of Consent contract addresses where the user has specific roles
    /// @param user Address of the user to update  
    /// @param role Role of the user in bytes32   
    function removeUserRole(address user, bytes32 role) external onlyConsentContract {

       // retrieve the user's list of Consents based on role
       address[] memory consentList = addressToUserRolesArray[user][role];

       // get the requesting Consent address's index
        uint256 indexToReplace = addressToUserRolesArrayIndex[user][role][msg.sender];

        // replace the index of interest with the last element in the array
        addressToUserRolesArray[user][role][indexToReplace] = consentList[consentList.length - 1];

        // update the index of the element to be moved in the mapping
        addressToUserRolesArrayIndex[user][role][consentList[consentList.length - 1]] = indexToReplace;

        // delete the last element now that is has been moved
        addressToUserRolesArray[user][role].pop();
    }

    /* GETTERS */

    /// @notice Return the number Consent addresses that user has deployed
    /// @param user Address of the user   
    /// @return count Count of user's current opted-in Consent contracts
    function getUserDeployedConsentsCount(address user) external view returns(uint256 count) {
        return addressToDeployedConsents[user].length;
    }

    /// @notice Return the an array of Consent addresses that user has deployed
    /// @param user Address of the user  
    /// @param startingIndex Starting index of query   
    /// @param endingIndex Ending index of query   
    function getUserDeployedConsentsByIndex(address user, uint256 startingIndex, uint256 endingIndex) external view returns(address[] memory) {
        
        return _queryList(startingIndex, endingIndex, addressToDeployedConsents[user]);
    }

    /// @notice Return an array of user's consent addresses that they have specific roles in
    /// @param user Address of the user  
    /// @param role Role in bytes32
    /// @return count Count of user's Consent contracts that they have specific role for
    function getUserRoleAddressesCount(address user, bytes32 role) external view returns(uint256 count) {
        return addressToUserRolesArray[user][role].length;
    }

    /// @notice Return the an array of Consent addresses that user currently has specific role for by index
    /// @param user Address of the user  
    /// @param role Bytes32 role  
    /// @param startingIndex Starting index of query   
    /// @param endingIndex Ending index of query   
    function getUserRoleAddressesCountByIndex(address user, bytes32 role, uint256 startingIndex, uint256 endingIndex) external view returns(address[] memory) {
        
        return _queryList(startingIndex, endingIndex, addressToUserRolesArray[user][role]);
    }

    /// @notice Internal function to help query an array of Consent addresses by indexes
    /// @param startingIndex Starting index of query   
    /// @param endingIndex Ending index of query 
    /// @param consentList Array of Consent contract addresses
    /// @return filteredList Array of Consent addresses after queries
    function _queryList(uint256 startingIndex, uint256 endingIndex, address[] memory consentList) internal pure returns(address[] memory filteredList) {

        require(endingIndex >= startingIndex, "ConsentFactory: Ending index must be larger then starting index");

        // if user does not have any consent addresses, return empty array
        if(consentList.length == 0) {
            address[] memory empty;
            return empty;
        }
        // else, make sure that the ending index does not exceed the max length
        if (endingIndex > consentList.length - 1) {
            endingIndex = consentList.length - 1;
        }

        // create a new array with length equal to number being queried
        address[] memory queriedList = new address[](endingIndex - startingIndex + 1);
        uint256 queriedIndex; 
        
        // push the addresses within the queried list 
        for(uint256 i = startingIndex; i <= endingIndex; i++) {
            queriedList[queriedIndex] = consentList[i];
            queriedIndex++;
        }

        return queriedList;
    }
}