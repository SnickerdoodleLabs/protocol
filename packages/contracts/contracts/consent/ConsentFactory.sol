// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlEnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ContextUpgradeable.sol";
import "@openzeppelin/contracts/proxy/beacon/BeaconProxy.sol";
import "@openzeppelin/contracts/proxy/beacon/UpgradeableBeacon.sol";
import "@openzeppelin/contracts-upgradeable/metatx/MinimalForwarderUpgradeable.sol";
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
      uint256 next;
      string cid;
    }

    /// @dev starting slot of the linked list
    uint256 public listingsHead;

    /// @dev the total number of listings in the marketplact
    uint256 public listingsTotal;

    /// @dev mapping from listing slot to Listing object
    mapping (uint256 => Listing) public listings;

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
        listingsHead = 1; // head slot is 1, this value must be >=1
        listingsTotal = 0; 
    }

    /* CORE FUNCTIONS */

    /// @notice Inserts a new listing into the Listing linked-list mapping
    /// @dev _upstream -> _newSlot -> _downstream
    /// @param _downstream Downstream pointer that will be pointed to by _newSlot
    /// @param _newSlot New linked list entry that will point to _downstream slot
    /// @param _upstream upstream pointer that will point to _newSlot  
    /// @param cid IPFS address of the listing content
    function insertListing(uint256 _downstream, uint256 _newSlot, uint256 _upstream, string memory cid) public onlyRole(DEFAULT_ADMIN_ROLE) {

        // the new linked list entry must be between two existing entries
        require(_upstream > _newSlot, "ConsentFactory: _upstream must be greater than _newSlot");
        require(_newSlot > _downstream, "ConsentFactory: _newSlot must be greater than _downstream");

        // the upstream entry must exist and it must point to the specified downstream listing
        // if the next variable is 0, it means the slot is uninitialized and thus it is invalid
        Listing memory listingA = listings[_upstream];
        require(listingA.next >= 1, "ConsentFactory: invalid upstream slot");
        require(listingA.next == _downstream, "ConsentFactory: _upstream listing points to different downstream listing");

        // ensure the downstream listing exists. 
        // if the next variable is 0, it means the slot is uninitialized
        Listing memory listingB = listings[_downstream];
        require(listingB.next >= 1, "ConsentFactory: invalid downstream slot");
        
        // make the upstream slot point to the new slot
        listings[_upstream] = Listing(_newSlot, listingA.cid);

        // make the new slot point to the downstream
        // downstream slot can remain as it is
        listings[_newSlot] = Listing(_downstream, cid);

        listingsTotal += 1; 
    }

    /// @notice Creates a new head listing in the marketplace listing map
    /// @dev _newSlot -> oldHeadSlot
    /// @param _newHead Downstream pointer that will be pointed to by _newSlot
    /// @param cid IPFS address of the listing content
    function newListingHead(uint256 _newHead, string memory cid) public onlyRole(DEFAULT_ADMIN_ROLE) {

        // the new linked list entry must be between two existing entries
        require(_newHead > listingsHead, "ConsentFactory: The new head must be greater than old head");

        // make the new head point to the old head
        listings[_newHead] = Listing(listingsHead, cid);

        // update the head variable
        listingsHead = _newHead;

        listingsTotal += 1; 
    }

    /// @notice Returns an array of cids from the marketplace linked list and the next active slot for pagination
    /// @param _startingSlot slot to start at in the linked list
    /// @param numSlots number of entries to return
    function getListings(uint256 _startingSlot, uint256 numSlots) public view returns (string [] memory, uint256 activeSlot) {

        // the new linked list entry must be between two existing entries
        require(numSlots <= listingsTotal, "ConsentFactory: total listings are less than requested slots");
        string[] memory cids = new string[](numSlots);

        activeSlot =  _startingSlot;
        // loop over the slots 
        for (uint i = 0; i < numSlots; i++) {
            Listing memory listing = listings[activeSlot];
            require(listing.next >= 1, "ConsentFactory: invalid slot");
            cids[i] = listing.cid;
            activeSlot = listing.next;
            if (activeSlot == 1) {
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