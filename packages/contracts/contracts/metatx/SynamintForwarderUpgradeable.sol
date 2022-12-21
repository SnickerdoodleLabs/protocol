// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ContextUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/metatx/MinimalForwarderUpgradeable.sol";
import "hardhat/console.sol";

contract SynamintForwarderUpgradeable is Initializable, MinimalForwarderUpgradeable {

    /// @notice Initializes the MinimalForwarder contract
    /// @dev Uses the initializer modifier to to ensure the contract is only initialized once
    function initialize() initializer public {
        __MinimalForwarder_init();
    }

}