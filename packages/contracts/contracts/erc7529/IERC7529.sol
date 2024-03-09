// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IERC7529 {
    /* EVENTS */

    /// @notice Emitted when a domain is added
    /// @param domain Domain url added
    event LogAddDomain(string domain);

    /// @notice Emitted when a domain is removed
    /// @param domain Domain url removed
    event LogRemoveDomain(string domain);

    /* Functions */

    function getDomain(string calldata eTLDp1) external view returns (bool);
}
