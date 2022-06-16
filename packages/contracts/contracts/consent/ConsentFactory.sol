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
/// @dev The baseline contract was generated using OpenZepplin's (OZ) Contract Wizard with added features 
/// @dev The contract adopts OZ's proxy upgrade pattern and is compatible with OZ's meta-transaction library  

contract ConsentFactory is Initializable, PausableUpgradeable, AccessControlEnumerableUpgradeable, ERC2771ContextUpgradeable {

    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    /// Mapping of addresses to an array of its deployed beacon proxy addresses
    mapping(address => address[]) public addressToConsentBP;

    /// @dev Mapping of contract name to its address
    mapping(string => address) public contractNameToAddress;

    /// Address of the upgradeable beacon
    address public beaconAddress; 

    /* EVENTS */ 

    /// @notice Emitted when a Consent contract's Beacon Proxy is deployed
    /// @param owner Indexed address of the owner of the deployex Consent contract Beacon Proxy 
    /// @param consentAddress Indexed address of the deployed Consent contract Beacon Proxy
    event ConsentDeployed(address indexed owner, address indexed consentAddress);

    /* MODIFIERS */

    /// @dev Sets the trustedForwarder address, calls the initialize function, then disables any initializers as recomended by OpenZeppelin
    constructor(address trustedForwarder) ERC2771ContextUpgradeable(trustedForwarder) {
        initialize();
        _disableInitializers();
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
    /// @param owner Address of the owner of the Consent contract instance  
    /// @param baseURI Base uri for the for the Consent contract instance  
    /// @param name Name of the Consent Contract   
    function createConsent(address owner, string memory baseURI, string memory name) public {

        // check if name already has a deployed address
        require(contractNameToAddress[name] == address(0), "CF: Name already used");

        BeaconProxy beaconProxy = new BeaconProxy(beaconAddress, 
        abi.encodeWithSelector(Consent(address(0)).initialize.selector, owner, baseURI, name));

        contractNameToAddress[name] = address(beaconProxy);

        emit ConsentDeployed(owner, address(beaconProxy));
    }

    /* SETTERS */

    /// @notice Sets the UpgradeableBeacon address for the factory 
    /// @param beaconAddress_ Address of the UpgradeableBeacon contract  
    function setBeaconAddress(address beaconAddress_) public onlyRole(DEFAULT_ADMIN_ROLE) {
        beaconAddress = beaconAddress_;
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