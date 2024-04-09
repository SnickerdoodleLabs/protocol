// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "hardhat/console.sol";

import {ERC7529Upgradeable} from "../erc7529/ERC7529Upgradeable.sol";
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {AccessControlUpgradeable} from "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";

contract Questionnaires is
    Initializable,
    ERC7529Upgradeable,
    AccessControlUpgradeable
{
    /// @dev Default questionnaires, added by the DAO. Stores the IPFS CID
    string[] public questionnaires;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    /// @notice Initializes the contract
    /// @dev Uses the initializer modifier to to ensure the contract is only initialized once
    function initialize(string[] calldata cids) public initializer {
        __AccessControl_init();
        _addDomain("snickerdoodle.com");

         super._grantRole(DEFAULT_ADMIN_ROLE, msg.sender);

        uint numCIDs = cids.length;
        for (uint i = 0; i < numCIDs; i++) {
            questionnaires.push(cids[i]);
        }
    }

    /// @notice Gets the array of questionnaires
    /// @return questionnaireArr Array of registered questionnaires
    function getQuestionnaires() external view returns (string[] memory questionnaireArr) {
        return questionnaires;
    }

    /// @notice an authenticated function that allows for a new questionnaire CID to be added to the array
    /// @param ipfsCid the CID of a questioniare to add to the discovery array
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