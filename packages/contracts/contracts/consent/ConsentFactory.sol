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

contract ConsentFactory is Initializable, PausableUpgradeable, AccessControlEnumerableUpgradeable, ERC2771ContextUpgradeable {

    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    /// Mapping of addresses to an array of its deployed beacon proxy addresses
    mapping(address => address[]) public addressToConsentBP;

    /// Address of the upgradeable beacon
    address public beaconAddress; 

    /* EVENTS */ 

    /// Emitted when a Consent contract's Beacon Proxy is deployed
    /// @param owner Indexed address of the owner of the deployex Consent contract Beacon Proxy 
    /// @param consentAddress Indexed address of the deployed Consent contract Beacon Proxy
    event ConsentDeployed(address indexed owner, address indexed consentAddress);

    /* MODIFIERS */

    /// @dev Sets the trustedForwarder address, calls the initialize function, then disables any initializers as recomended by OpenZeppelin
    constructor(address trustedForwarder) ERC2771ContextUpgradeable(trustedForwarder) {
        initialize();
        _disableInitializers();
    }

    /// Initializes the contract
    /// @dev Uses the initializer modifier to to ensure the contract is only initialized once
    function initialize() initializer public  {
        __Pausable_init();
        __AccessControl_init();

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);

    }

    /* CORE FUNCTIONS */

    /// Deploys the UpgradableBeacon that all the Beacon Proxies point to
    /// @dev The UpgradableBeacon points to the latest Consent implementation contract  
    /// @dev Can only be called by address that has the ADMIN_ROLE
    /// @param consentContractAddress Address of the latest implementation verion of the Consent contract
    function deployBeacon(address consentContractAddress) public onlyRole(ADMIN_ROLE) {
        UpgradeableBeacon beacon = new UpgradeableBeacon(consentContractAddress); 
        
        beaconAddress = address(beacon);
    }

    /// Creates a new Beacon Proxy contract pointing to the UpgradableBeacon 
    /// @dev This Beacon Proxy points to the UpgradableBeacon with the latest Consent implementation contract
    /// @param owner Address of the owner of the Consent contract instance  
    /// @param baseURI Base uri for the for the Consent contract instance  
    function createConsent(address owner, string memory baseURI) public {

        BeaconProxy beaconProxy = new BeaconProxy(beaconAddress, 
        abi.encodeWithSelector(Consent(address(0)).initialize.selector, owner, baseURI));
        
        addressToConsentBP[owner].push(address(beaconProxy));

        emit ConsentDeployed(owner, address(beaconProxy));
    }

    /* GETTERS */

    /// Get the Beacon Proxy addresses of an owner address 
    /// @dev First checks if address has previously deployed Consent Beacon Proxies 
    /// @dev If user has deployed before, returns an array of the deployed addresses
    /// @param owner Address of owner that deployed Beacon Proxy Consent contracts  
    /// @return arrayOfBP Array of address of Beacon Proxies deployed
    function getConsentBP(address owner) public view returns(address[] memory arrayOfBP) {
        require(addressToConsentBP[owner].length > 0, "ConsentFactory : User has not deployed Consents");
        return addressToConsentBP[owner];
    }

    /* SETTERS */

    /// Sets the UpgradeableBeacon address for the factory 
    /// @param beaconAddress_ Address of the UpgradeableBeacon contract  
    function setBeaconAddress(address beaconAddress_) public onlyRole(ADMIN_ROLE) {
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