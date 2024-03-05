// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract ERC7529 is AccessControl {

    /// @dev Array of trusted domains
    string[] public domains;

    /// @notice Add a domain to the domains array
    /// @param domain Domain to add
    function addDomain(
        string memory domain
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        string[] memory domainsArr = domains;

        // check if domain already exists in the array
        for (uint256 i; i < domains.length; ) {
            if (
                keccak256(abi.encodePacked((domainsArr[i]))) ==
                keccak256(abi.encodePacked((domain)))
            ) {
                revert("Reward : Domain already added");
            }
            unchecked {
                ++i;
            }
        }

        domains.push(domain);
    }

    /// @notice Removes a domain from the domains array
    /// @param domain Domain to remove
    function removeDomain(
        string memory domain
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        string[] memory domainsArr = domains;

        // A check that is incremented if a requested domain exists
        uint8 flag;

        for (uint256 i; i < domains.length; ) {
            if (
                keccak256(abi.encodePacked((domainsArr[i]))) ==
                keccak256(abi.encodePacked((domain)))
            ) {
                // replace the index to delete with the last element
                domains[i] = domains[domains.length - 1];
                // delete the last element of the array
                domains.pop();
                // update to flag to indicate a match was found
                flag++;

                break;
            }
            unchecked {
                ++i;
            }
        }
        require(flag > 0, "Reward : Domain is not in the list");
    }

    /// @notice Gets the array of registered domains
    /// @return domainsArr Array of registered domains
    function getDomains() external view returns (string[] memory domainsArr) {
        return domains;
    }
}