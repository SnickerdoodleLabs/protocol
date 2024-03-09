// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import {IContentFactory} from "../recomender/IContentFactory.sol";

interface IConsentFactory is IContentFactory {
    /* EVENTS */

    /// @notice Emitted when a Consent contract's Beacon Proxy is deployed
    /// @param owner Indexed address of the owner of the deployed Consent contract Beacon Proxy
    /// @param consentAddress Indexed address of the deployed Consent contract Beacon Proxy
    /// @param stakingToken Address of the token used to for staking 
    event ConsentContractDeployed(
        address indexed owner,
        address indexed consentAddress,
        address indexed stakingToken
    );

    function createConsent(address owner, string memory baseURI) external;

    function getQuestionnaires()
        external
        view
        returns (string[] memory questionnaireArr);

    function addQuestionnaire(string memory ipfsCid) external;

    function removeQuestionnaire(uint8 index) external;
}
