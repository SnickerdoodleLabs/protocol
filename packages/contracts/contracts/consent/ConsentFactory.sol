// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlEnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/metatx/ERC2771ContextUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/metatx/MinimalForwarderUpgradeable.sol";
import "@openzeppelin/contracts/proxy/beacon/BeaconProxy.sol";
import "@openzeppelin/contracts/proxy/beacon/UpgradeableBeacon.sol";
import "./Consent.sol";

/// @title Consent Factory
/// @author Sean Sing
/// @notice Snickerdoodle Protocol's Consent Factory Contract 
/// @dev This contract deploys new BeaconProxy instances that all point to the latest Consent implementation contract via the UpgradeableBeacon 
/// @dev The baseline contract was generated using OpenZeppelin's (OZ) Contract Wizard with added features 
/// @dev The contract adopts OZ's proxy upgrade pattern and is compatible with OZ's meta-transaction library  

contract ConsentFactory is Initializable, PausableUpgradeable, AccessControlEnumerableUpgradeable, ERC2771ContextUpgradeable {

    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    /// Mapping of addresses to an array of its deployed beacon proxy addresses
    mapping(address => address[]) public addressToConsentBP;

    /// @dev Mapping of deployed beacon proxy addresses to track that it is a Consent contract
    mapping(address => bool) public consentAddressCheck;

    /// @dev Mapping of user address to an array of Consent contracts they have opted-in to
    /// @dev User address => Consent address array
    mapping(address => address[]) public addressToUserArray;

    /// @dev Mapping of Consent contract address of a specific user's array to its index
    /// @dev Used look up index in the array and check if it exists in the array
    /// @dev User address => Consent address => index within the array
    mapping(address => mapping(address => uint256)) addressToUserArrayIndex;

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

    /// @dev Sets the trustedForwarder address, calls the initialize function, then disables any initializers as recommended by OpenZeppelin
    constructor(address trustedForwarder) ERC2771ContextUpgradeable(trustedForwarder) {
        initialize();
        _disableInitializers();
    }

    /* MODIFIERS */

    /// @notice Modified to check if a caller of a function is a Consent contract
    /// @dev Every time a Consent contract is deployed, it is store into the consentAddressCheck mapping 
    modifier onlyConsentContract() {
        // ensure that the immediate caller of the function is a Consent contract
        require(consentAddressCheck[msg.sender] == true, 'ConsentFactory: Caller is not a Consent Contract');
        _;
    }

    /// @notice Modified to check the indexes used for querying the array
    /// @param user Address of user to query   
    /// @param startingIndex Starting index of query   
    /// @param endingIndex Ending index of query 
    modifier checkIndexes(address user, uint256 startingIndex, uint256 endingIndex) {
        if (endingIndex > addressToUserArray[user].length) {
            endingIndex = addressToUserArray[user].length;
        }

        require(endingIndex > startingIndex, "Consent: Ending index must be larger then starting index");
        _;
    }

    /// @notice Initializes the contract
    /// @dev Uses the initializer modifier to to ensure the contract is only initialized once
    function initialize() initializer public  {
        __Pausable_init();
        __AccessControl_init();

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);
    }

    /* CORE FUNCTIONS */

    /// @notice Creates a new Beacon Proxy contract pointing to the UpgradableBeacon 
    /// @dev This Beacon Proxy points to the UpgradableBeacon with the latest Consent implementation contract
    /// @dev Registers the deployed contract into the consentAddressCheck mapping
    /// @param owner Address of the owner of the Consent contract instance  
    /// @param baseURI Base uri for the for the Consent contract instance  
    /// @param name Name of the Consent Contract   
    function createConsent(address owner, string memory baseURI, string memory name) public {

        BeaconProxy beaconProxy = new BeaconProxy(beaconAddress, 
        abi.encodeWithSelector(Consent(address(0)).initialize.selector, owner, baseURI, name));

        // register Consent address into mapping
        consentAddressCheck[address(beaconProxy)] = true;

        // TODO revisit all emits to confirm we are emitting useful info
        emit ConsentDeployed(owner, address(beaconProxy));
    }

    /// @notice Function to add consent addresses that users have opted-in to
    /// @param user Address of the user to update  
    function addUserConsents(address user) public onlyConsentContract {
        // retrieve the array of address a users has and add the latest
        addressToUserArray[user].push(msg.sender);

        // store the index of the last pushed element
        addressToUserArrayIndex[user][msg.sender] = addressToUserArray[user].length - 1;
    }

    /// @notice Function to remove consent addresses that users have opted-in to
    /// @dev This allows us to retrieve a list of Consent contract addresses the user has opted-in to
    /// @param user Address of the user to update  
    function removeUserConsents(address user) public onlyConsentContract {
        
        // retrieve the user's list of Consents
        address[] memory consentList = addressToUserArray[user];

        // get the requesting Consent address's index
        uint256 indexToReplace = addressToUserArrayIndex[user][msg.sender];

        // replace the index of interest with the last element in the array
        addressToUserArray[user][indexToReplace] = consentList[consentList.length - 1];

        // update the index of the element to be moved in the mapping
        addressToUserArrayIndex[user][consentList[consentList.length - 1]] = indexToReplace;

        // delete the last element now that is has been moved
        delete addressToUserArray[user][consentList.length - 1];
    }

    /// @notice Function to add roles a user address has on a specific contract
    /// @dev This allows us to retrieve a list of Consent contract addresses where the user has specific roles
    /// @param user Address of the user to update  
    /// @param role Role of the user in bytes32   
    function addUserRole(address user, bytes32 role) public onlyConsentContract {
       addressToUserRolesArray[user][role].push(msg.sender);
    }

    /// @notice Function to add roles a user address has on a specific contract
    /// @dev This allows us to retrieve a list of Consent contract addresses where the user has specific roles
    /// @param user Address of the user to update  
    /// @param role Role of the user in bytes32   
    function removeUserRole(address user, bytes32 role) public onlyConsentContract {

       // retrieve the user's list of Consents based on role
       address[] memory consentList = addressToUserRolesArray[user][role];

       // get the requesting Consent address's index
        uint256 indexToReplace = addressToUserRolesArrayIndex[user][role][msg.sender];

        // replace the index of interest with the last element in the array
        addressToUserRolesArray[user][role][indexToReplace] = consentList[consentList.length - 1];

        // update the index of the element to be moved in the mapping
        addressToUserRolesArrayIndex[user][role][consentList[consentList.length - 1]] = indexToReplace;

        // delete the last element now that is has been moved
        delete addressToUserRolesArray[user][role][consentList.length - 1];
    }
     
    /* SETTERS */

    /// @notice Sets the UpgradeableBeacon address for the factory 
    /// @param beaconAddress_ Address of the UpgradeableBeacon contract  
    function setBeaconAddress(address beaconAddress_) public onlyRole(DEFAULT_ADMIN_ROLE) {
        beaconAddress = beaconAddress_;
    }

    /* GETTERS */

    /// @notice Return the number Consent addresses that user is currently opted-in
    /// @param user Address of the user   
    /// @return count Count of user's current opted-in Consent contracts
    function getUserConsentAddressesCount(address user) external view returns(uint256 count) {
        return addressToUserArray[user].length;
    }

    /// @notice Return the an array of Consent addresses that user is currently opted-in by index
    /// @param user Address of the user  
    /// @param startingIndex Starting index of query   
    /// @param endingIndex Ending index of query   
    function getUserConsentAddressesByIndex(address user, uint256 startingIndex, uint256 endingIndex) external view checkIndexes(user, startingIndex, endingIndex) returns(address[] memory) {
        
        return _queryList(startingIndex, endingIndex, addressToUserArray[user]);
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
    function getUserRoleAddressesCountByIndex(address user, bytes32 role, uint256 startingIndex, uint256 endingIndex) external view checkIndexes(user, startingIndex, endingIndex) returns(address[] memory) {
        
        return _queryList(startingIndex, endingIndex, addressToUserRolesArray[user][role]);
    }

    /// @notice Internal function to help query an array of Consent addresses by indexes
    /// @param startingIndex Starting index of query   
    /// @param endingIndex Ending index of query 
    /// @param consentList Array of Consent contract addresses
    /// @return filteredList Array of Consent addresses after queries
    function _queryList(uint256 startingIndex, uint256 endingIndex, address[] memory consentList) internal pure returns(address[] memory filteredList) {
        
        address[] memory queriedList;
        uint256 queriedIndex; 
        
        // push the addresses within the queried list 
        for(uint256 i = startingIndex; i < consentList.length; i++) {
            if(startingIndex <= endingIndex) {
                queriedList[queriedIndex] = consentList[i];
                queriedIndex++;
            }
        }

        return queriedList;
    }

    /* OVERRIDES */

    // The following functions are overrides required by Solidity.

    function _msgSender() internal view virtual override(ContextUpgradeable, ERC2771ContextUpgradeable) returns (address sender) {
        if (isTrustedForwarder(msg.sender)) {
            // The assembly code is more direct than the Solidity version using `abi.decode`.
            assembly {
                sender := shr(96, calldataload(sub(calldatasize(), 20)))
            }
        } else {
            return super._msgSender();
        }
    }

    function _msgData() internal view virtual override(ContextUpgradeable, ERC2771ContextUpgradeable) returns (bytes calldata) {
        if (isTrustedForwarder(msg.sender)) {
            return msg.data[:msg.data.length - 20];
        } else {
            return super._msgData();
        }
    }
}