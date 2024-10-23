// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IERC7529 {
    /* EVENTS */

    /// @notice Emitted when a domain is added
    /// @param domain Domain url added
    event AddERC7529Domain(string domain);

    /// @notice Emitted when a domain is removed
    /// @param domain Domain url removed
    event RemoveERC7529Domain(string domain);

    /* Functions */

    function checkERC7529Domain(string calldata domain) external view returns (bool);
}
