// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;


/// @dev a minimal interface for Consent contracts to update the ConsentFactory

interface IConsentFactory {

    function addUserConsents(address user, address consentAddressToAdd) external;
    function removeUserConsents(address user, address consentAddressToRemove) external;
    function addUserRole(address user, address consentAddressToAdd, bytes32 role) external;
    function removeUserRole(address user, address consentAddressToRemove, bytes32 role) external; 
    
}
