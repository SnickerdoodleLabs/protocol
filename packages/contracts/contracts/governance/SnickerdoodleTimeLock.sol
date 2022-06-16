// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/governance/TimelockControllerUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract SnickerdoodleTimelock is Initializable, TimelockControllerUpgradeable {

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor(uint256 minDelay, address[] memory proposers, address[] memory executors) {
        initialize(minDelay, proposers, executors);
        _disableInitializers();
    }

    ///@param minDelay Minimum delay for an operation to become valid in seconds
    ///@param proposers Initial list of addresses approved as proposers
    ///@param executors Initial list of addresses approved as executors
    function initialize(uint256 minDelay, address[] memory proposers, address[] memory executors) initializer public {
        __TimelockController_init(minDelay, proposers, executors);
    }
    
} 