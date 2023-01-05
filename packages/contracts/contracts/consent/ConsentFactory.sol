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
      uint256 next; // pointer to the next active slot
      address consentContract; // address of the target consent contract
      uint256 timePosted; // unix timestamp when the listing was posted or updated
      uint256 timeExpiring; // unix timestamp when the listing expires and can be replaced
    }

    /// @dev starting slot of the linked list
    mapping(bytes32 => uint256) public listingHeads;

    /// @dev the total number of listings in the marketplace
    mapping(bytes32 => uint256) public listingTotals; 

    /// @dev the default amount of time, in seconds, that a listing is valid for
    uint256 public listingDuration; 

    /// @dev nested mapping
    /// @dev first layer maps from hashed attribute string to a linked list
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
    /// @param attribute the human-readable attribute the listing was filed under
    /// @param slot The slot (i.e. amount of stake) that the listing has posted to
    event NewListing(address indexed consentContract, string attribute, uint256 slot);

    /* MODIFIERS */

    /// @notice Modified to check if a caller of a function is a Consent contract
    /// @dev Every time a Consent contract is deployed, it is store into the consentAddressCheck mapping 
    modifier onlyConsentContract() {
        // ensure that the immediate caller of the function is a Consent contract
        require(consentAddressCheck[msg.sender] == true, 'ConsentFactory: Caller is not a Consent Contract');
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

    /// @notice Inserts a new listing into the Listing linked-list mapping
    /// @dev _upstream -> _newSlot -> _downstream
    /// @param attribute Human readable string denoting the target attribute to stake
    /// @param _newSlot New linked list entry that will point to _downstream slot
    /// @param _upstream upstream pointer that will point to _newSlot  
    function insertListing(string memory attribute, uint256 _newSlot, uint256 _upstream) external onlyConsentContract {

        // the new linked list entry must be between two existing entries
        require(_newSlot > 0, "ConsentFactory: _newSlot must be greater than 0");
        require(_upstream > _newSlot, "ConsentFactory: _upstream must be greater than _newSlot");

        // The new listing must fit between _upstream and its current downstresam
        // if the next variable is 0, it means the slot is uninitialized and thus it is invalid _upstream entry
        bytes32 LLKey = keccak256(abi.encodePacked(attribute));
        Listing memory listingA = listings[LLKey][_upstream];
        require(_newSlot > listingA.next, "ConsentFactory: invalid insertion");
        
        // make the new slot point to the old downstream
        // downstream slot can remain as it is
        listings[LLKey][_newSlot] = Listing(listingA.next, msg.sender, block.timestamp, block.timestamp + listingDuration);

        // make the upstream slot point to the new slot
        listings[LLKey][_upstream].next = _newSlot;

        listingTotals[LLKey] += 1; 

        emit NewListing(msg.sender, attribute, _newSlot);
    }

    /// @notice Creates a new head listing in the marketplace listing map
    /// @dev _newSlot -> oldHeadSlot
    /// @param attribute Human readable string denoting the target attribute to stake
    /// @param _newHead Downstream pointer that will be pointed to by _newSlot
    function newListingHead(string memory attribute, uint256 _newHead) external onlyConsentContract {

        bytes32 LLKey = keccak256(abi.encodePacked(attribute));

        // the new linked list entry must be between two existing entries
        require(_newHead > listingHeads[LLKey], "ConsentFactory: The new head must be greater than old head");

        // make the new head point to the old head
        listings[LLKey][_newHead] = Listing(listingHeads[LLKey], msg.sender, block.timestamp, block.timestamp + listingDuration);

        // update the head variable
        listingHeads[LLKey] = _newHead;

        // increment the number of listings under this attribute
        listingTotals[LLKey] += 1;

        emit NewListing(msg.sender, attribute, _newHead);
    }

    /// @notice Replaces an existing listing that has expired
    /// @dev _newSlot -> oldHeadSlot
    /// @param attribute Human readable string denoting the target attribute to stake
    /// @param _slot The expired slot to replace with a new listing
    function replaceExpiredListing(string memory attribute, uint256 _slot) external onlyConsentContract {

        // grab the old listing under the targeted attribute
        bytes32 LLKey = keccak256(abi.encodePacked(attribute));
        Listing memory oldListing = listings[LLKey][_slot];

        // the new linked list entry must be between two existing entries
        require(oldListing.timeExpiring > 0, "ConsentFactory: Cannot replace an empty slot");
        require(block.timestamp > oldListing.timeExpiring, "ConsentFactory: current listing is still active");

        // slide the new listing into the existing slot
        listings[LLKey][_slot] = Listing(oldListing.next, msg.sender, block.timestamp, block.timestamp + listingDuration);

        emit NewListing(msg.sender, attribute, _slot);
    }

    /// @notice removes a head listing in the marketplace listing map
    /// @param attribute Human readable string denoting the target attribute
    function removeHeadListing(string memory attribute) external onlyConsentContract {

        // grab the candidate head listing to be removed
        bytes32 LLKey = keccak256(abi.encodePacked(attribute));
        Listing memory oldHead = listings[LLKey][listingHeads[LLKey]];

        // the caller must own the listing which is being removed
        require(msg.sender == oldHead.consentContract, "ConsentFactory: only listing owner can remove");

        // delete the old head listings
        delete listings[LLKey][listingHeads[LLKey]];

        // update the linked list head for this attribute
        listingHeads[LLKey] = oldHead.next;

        // decriment the number of listings
        listingTotals[LLKey] -= 1;
    }

    /// @notice Remove an existing listing that is not a head listing
    /// @param attribute Human readable string denoting the target attribute
    /// @param _upstream The slot number of the listing which points to the listing to be removed
    function removeTailListing(string memory attribute, uint256 _upstream) external onlyConsentContract {

        // grab the old listing under the targeted attribute
        bytes32 LLKey = keccak256(abi.encodePacked(attribute));
        uint256 oldSlot = listings[LLKey][_upstream].next;
        Listing memory oldListing = listings[LLKey][oldSlot];

        // the caller must own the listing which is being removed
        require(msg.sender == oldListing.consentContract, "ConsentFactory: only listing owner can remove");

        // point the _upstream listing to the next in line
        listings[LLKey][_upstream].next = oldListing.next;

        // delete the old listing
        delete listings[LLKey][oldSlot];

        // decriment the number of listings
        listingTotals[LLKey] -= 1;
    }

    /// @notice Returns an array of cids from the marketplace linked list and the next active slot for pagination
    /// @param attribute Human readable string denoting the target attribute to stake
    /// @param _startingSlot slot to start at in the linked list
    /// @param numSlots number of entries to return
    function getListings(string memory attribute, uint256 _startingSlot, uint256 numSlots) 
        external 
        view 
        returns (string [] memory, uint256 activeSlot) {

        bytes32 LLKey = keccak256(abi.encodePacked(attribute));

        string[] memory cids = new string[](numSlots);

        activeSlot =  _startingSlot;
        // loop over the slots 
        for (uint i = 0; i < numSlots; i++) {
            Listing memory listing = listings[LLKey][activeSlot];
            require(listing.timeExpiring > 0, "ConsentFactory: invalid slot"); // make sure the first listing is valid
            if(listing.timeExpiring < block.timestamp) { continue; } // don't include expired listings
            cids[i] = Consent(listing.consentContract).baseURI(); // grab the invitation details from the consent contract
            activeSlot = listing.next;
            if(activeSlot == 0) { // slot 0 is the EOL slot
                break;
            }
        }
        return (cids, activeSlot);
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

    /* EIP-2771 MetaTX */

    function isTrustedForwarder(address forwarder) public view returns (bool) {
        return forwarder == trustedForwarder;
    }

    function _msgSender() internal view virtual override(ContextUpgradeable) returns (address sender) {
        if (isTrustedForwarder(msg.sender)) {
            // The assembly code is more direct than the Solidity version using `abi.decode`.
            assembly {
                sender := shr(96, calldataload(sub(calldatasize(), 20)))
            }
        } else {
            return super._msgSender();
        }
    }

    function _msgData() internal view virtual override(ContextUpgradeable) returns (bytes calldata) {
        if (isTrustedForwarder(msg.sender)) {
            return msg.data[:msg.data.length - 20];
        } else {
            return super._msgData();
        }
    }
}