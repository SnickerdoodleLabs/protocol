// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import {IConsentFactory} from "./IConsentFactory.sol";
import {Consent} from "./Consent.sol";
import {ContentFactoryUpgradeable} from "../recomender/ContentFactoryUpgradeable.sol";
import {ERC7529Upgradeable} from "../erc7529/ERC7529Upgradeable.sol";
import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import {BeaconProxy} from "@openzeppelin/contracts/proxy/beacon/BeaconProxy.sol";
import {UpgradeableBeacon} from "@openzeppelin/contracts/proxy/beacon/UpgradeableBeacon.sol";
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {AccessControlUpgradeable} from "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";

contract ConsentFactory is 
    IConsentFactory,
    Initializable,
    ContentFactoryUpgradeable,
    ERC7529Upgradeable,
    AccessControlUpgradeable
{
    /* Storage Variables */

    /// @dev Address of the upgradeable beacon
    address public beaconAddress; 

    /// @notice Initializes the contract
    /// @dev Uses the initializer modifier to to ensure the contract is only initialized once
    /// @dev The deploying address recieves the DEFAULT_ADMIN_ROL on deployment
    /// @dev After deployment, the DAO contract should be given the DEFAULT_ADMIN_ROLE and deployer reliquish
    /// @param _consentImpAddress Address of implementation contract for the Consent Contract
    /// @param _governanceToken Address of the ERC20-compatible protocol token
    function initialize(address _consentImpAddress, address _governanceToken) initializer public {
        __AccessControl_init();
        __ContentFactory_init(_governanceToken, 2 weeks, 20);

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);

        // deploy the UpgradeableBeacon, transfer its ownership to the user and store its address
        UpgradeableBeacon _upgradeableBeacon = new UpgradeableBeacon(_consentImpAddress, msg.sender);
        beaconAddress = address(_upgradeableBeacon);
    }

    /* Function Implementations */

    /// @notice Creates a new Beacon Proxy contract pointing to the UpgradableBeacon 
    /// @dev This Beacon Proxy points to the UpgradableBeacon with the latest Consent implementation contract
    /// @dev Registers the deployed contract into the consentAddressCheck mapping
    /// @param owner Address of the owner of the Consent contract instance  
    /// @param baseURI Base uri for the for the Consent contract instance  
    function createConsent(address owner, string memory baseURI) external {

        BeaconProxy beaconProxy = new BeaconProxy(beaconAddress, 
        abi.encodeWithSelector(Consent(address(0)).initialize.selector, owner, baseURI, address(this)));

        address beaconProxyAddress = address(beaconProxy);

        _setContentObjectAddress(beaconProxyAddress);

        emit ConsentContractDeployed(owner, beaconProxyAddress);
    }

    /// @notice Sets the duration that a listing can remain active without restaking
    /// @dev can only be called by the DAO
    /// @param listingDuration The new value in seconds that a listing can remain active without restaking
    function setListingDuration(uint256 listingDuration) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _setListingDuration(listingDuration);
    }

    /// @notice Sets the maximum number of tags that can be staked by a content object
    /// @dev can only be called by the DAO
    /// @param maxTagsPerListing Integer number representing the new maximum number of tags a content object may stake
    function setMaxTagsPerListing(uint256 maxTagsPerListing) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _setMaxTagsPerListing(maxTagsPerListing);
    }

    /// @notice Adds a new staking token to the registered staking token set
    /// @param stakingToken Address of the new token to register for recommender system staking
    function registerStakingToken(address stakingToken) external {
        /// TODO: this should cost governance token somehow, either a vote or a fee
        _registerStakingToken(stakingToken);
    }

    /// @notice Associates an admin account with a staking token which can curate listins in that namespace
    /// @dev token admin role is calculated as keccak256(abi.encodePacked(stakingToken))
    /// @param tag Human readable string denoting the target tag
    /// @param stakingToken Address of the staking token whose admin account will be set
    /// @param removedSlots Address which will have curation rights for the specified staking token
    function adminRemoveListings(string memory tag, address stakingToken, uint256[] memory removedSlots) external {
        require(hasRole(keccak256(abi.encodePacked(stakingToken)), msg.sender), "Content Factory: Caller not a token admin");
        _adminRemoveListings(tag, stakingToken, removedSlots);
    }

    /// @notice Allows a namespace admin account to block a content object from its listings
    /// @param stakingToken the address of the staking token associated with the namespace
    /// @param contentAddress the address of the content object to block
    function blockContentObject(address stakingToken, address contentAddress) external {
        require(hasRole(keccak256(abi.encodePacked(stakingToken)), msg.sender), "Content Factory: Caller not a token admin");
        _blockContentObject(stakingToken, contentAddress);
    }

    /// @notice Allows a namespace admin account to unblock a content object from its listings
    /// @param stakingToken the address of the staking token associated with the namespace
    /// @param contentAddress the address of the content object to block
    function unblockContentObject(address stakingToken, address contentAddress) external {
        require(hasRole(keccak256(abi.encodePacked(stakingToken)), msg.sender), "Content Factory: Caller not a token admin");
        _unblockContentObject(stakingToken, contentAddress);
    }

    /// @notice Add a domain to the domains array
    /// @param domain Domain to add
    function addDomain(string calldata domain) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _addDomain(domain);
    }

    /// @notice Removes a domain from the domains array
    /// @param domain Domain to remove
    function removeDomain(
        string calldata domain
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _removeDomain(domain);
    }
}