// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract ERC7529 is AccessControl {
    /// @notice Optional event emitted when a domain is added
    /// @param domain eTLD+1 associated with the contract
    event AddDomain(string domain);

    /// @notice Optional event emitted when a domain is removed
    /// @param domain eTLD+1 that is no longer associated with the contract
    event RemoveDomain(string domain);

    /// @dev a mapping from the keccak256 hash of eTLD+1 domains associated with this contract to a boolean
    mapping(bytes32 => bool) domains;

    /// @notice a getter function that takes an eTLD+1 domain string and returns true if associated with the contract
    /// @param domain a string representing an eTLD+1 domain
    function checkDomain(string calldata domain) external view returns (bool) {
        return domains[keccak256(abi.encodePacked(domain))];
    }

    /// @notice an authenticated method to add an eTLD+1 domain
    /// @param domain a string representing an eTLD+1 domain associated with the contract
    function addDomain(
        string memory domain
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        domains[keccak256(abi.encodePacked(domain))] = true;
        emit AddDomain(domain);
    }

    /// @notice an authenticated method to remove an eTLD+1 domain
    /// @param domain a string representing an eTLD+1 domain that is no longer associated with the contract
    function removeDomain(
        string memory domain
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(
            domains[keccak256(abi.encodePacked(domain))] == true,
            "ERC7529: eTLD+1 currently not associated with this contract"
        );
        domains[keccak256(abi.encodePacked(domain))] = false;
        emit RemoveDomain(domain);
    }
}
