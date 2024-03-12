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
import {PausableUpgradeable} from "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";
import {AccessControlUpgradeable} from "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";

contract ConsentFactory is 
    IConsentFactory,
    Initializable,
    ContentFactoryUpgradeable,
    ERC7529Upgradeable,
    AccessControlUpgradeable,
    PausableUpgradeable
{
    /* Storage Variables */

    /// @dev The PAUSE_ROLE can pause all activity in the factory contract
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    /// @dev Address of the upgradeable beacon
    address public beaconAddress; 

    /// @dev Default questionnaires, added by the DAO. Stores the IPFS CID
    string[] public questionnaires;

    /// @notice Initializes the contract
    /// @dev Uses the initializer modifier to to ensure the contract is only initialized once
    /// @dev The deploying address recieves the DEFAULT_ADMIN_ROL on deployment
    /// @dev After deployment, the DAO contract should be given the DEFAULT_ADMIN_ROLE and deployer reliquish
    /// @param _consentImpAddress Address of implementation contract for the Consent Contract
    /// @param _governanceToken Address of the ERC20-compatible protocol token
    function initialize(address _consentImpAddress, address _governanceToken) initializer public {
        __Pausable_init();
        __AccessControl_init();
        __ContentFactory_init(_governanceToken, 2 weeks, 20);

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);

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

    /// @notice Gets the array of questionnaires
    /// @return questionnaireArr Array of registered questionnaires
    function getQuestionnaires() external view returns (string[] memory questionnaireArr) {
        return questionnaires;
    }

    function addQuestionnaire(
        string memory ipfsCid
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(questionnaires.length < 128, "Consent Factory: Maximum number of questionnaires reached");
       
        questionnaires.push(ipfsCid);
    }

    /// @notice Removes a questionnaire from the questionnaires array
    /// @param index Index of questionnaire to remove
    function removeQuestionnaire(
        uint8 index
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(index >= 0 && index <= questionnaires.length, "Consent: Questionnaire index out of bounds");

        questionnaires[index] = questionnaires[questionnaires.length - 1];
        questionnaires.pop();
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