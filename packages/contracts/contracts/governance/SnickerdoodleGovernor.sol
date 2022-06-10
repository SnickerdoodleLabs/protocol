// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/governance/GovernorUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/governance/extensions/GovernorSettingsUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/governance/extensions/GovernorCountingSimpleUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/governance/extensions/GovernorVotesUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/governance/extensions/GovernorVotesQuorumFractionUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/governance/extensions/GovernorTimelockControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

// proposalId : When a proposal is made, a proposalId is generated from hashing the proposal's parameters from the inherited propose() from the Governor contract. 
// votingPeriod, votingDelay and proposalThreshold : Inherited from GovernorSettings, has setVotingDelay(), setVotingPeriod() and setProposalThreshold() respectively.

contract SnickerdoodleGovernor is Initializable, GovernorUpgradeable, GovernorSettingsUpgradeable, GovernorCountingSimpleUpgradeable, GovernorVotesUpgradeable, GovernorVotesQuorumFractionUpgradeable, GovernorTimelockControlUpgradeable {
    
    using Counters for Counters.Counter;
    
    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor(IVotesUpgradeable _token, TimelockControllerUpgradeable _timelock) {
        initialize(_token, _timelock);
        _disableInitializers();
    }

    function initialize(IVotesUpgradeable _token, TimelockControllerUpgradeable _timelock)
        initializer public
    {
        __Governor_init("SnickerdoodleGovernor");
        // arguments: voting delay, voting period, proposalThreshold
        __GovernorSettings_init(1 /* 1 block */, 2 /* 2 block */, 10e18);
        __GovernorCountingSimple_init();
        __GovernorVotes_init(_token);
        // argument: quorum %
        __GovernorVotesQuorumFraction_init(4);
        __GovernorTimelockControl_init(_timelock);
    }

    // The following functions are overrides required by Solidity.

    ///@notice Getter function that returns the the number of blocks that must be mined after a proposal is created before it is active.
    ///@dev The voting delay is stored as number of blocks (1 block ~= 13 seconds)
    function votingDelay()
        public
        view
        override(IGovernorUpgradeable, GovernorSettingsUpgradeable)
        returns (uint256)
    {
        return super.votingDelay();
    }

    ///@notice Getter function that returns the number of blocks that a proposal stays active for after its activation. 
    ///@dev The voting period is stored as number of blocks (1 block ~= 13 seconds)
    function votingPeriod()
        public
        view
        override(IGovernorUpgradeable, GovernorSettingsUpgradeable)
        returns (uint256)
    {
        return super.votingPeriod();
    }

    ///@notice Getter that returns the number of votes at a given block number
    function quorum(uint256 blockNumber)
        public
        view
        override(IGovernorUpgradeable, GovernorVotesQuorumFractionUpgradeable)
        returns (uint256)
    {
        return super.quorum(blockNumber);
    }

    ///@notice Getter that returns the state of a proposal id
    ///@dev See {IGovernor-state} for list of ProposalState enums
    function state(uint256 proposalId)
        public
        view
        override(GovernorUpgradeable, GovernorTimelockControlUpgradeable)
        returns (ProposalState)
    {
        return super.state(proposalId);
    }

    function propose(address[] memory targets, uint256[] memory values, bytes[] memory calldatas, string memory description)
        public
        override(GovernorUpgradeable, IGovernorUpgradeable)
        returns (uint256)
    {
        return super.propose(targets, values, calldatas, description);
    }

    ///@notice Getter function that returns the minimum amount of tokens an accounts must have to create a proposal
    ///@dev Token amounts are in wei (18 decimals).
    function proposalThreshold()
        public
        view
        override(GovernorUpgradeable, GovernorSettingsUpgradeable)
        returns (uint256)
    {
        return super.proposalThreshold();
    }

    ///@dev This called when the public execute() function is called.
    function _execute(uint256 proposalId, address[] memory targets, uint256[] memory values, bytes[] memory calldatas, bytes32 descriptionHash)
        internal
        override(GovernorUpgradeable, GovernorTimelockControlUpgradeable)
    {
        super._execute(proposalId, targets, values, calldatas, descriptionHash);
    }

    function _cancel(address[] memory targets, uint256[] memory values, bytes[] memory calldatas, bytes32 descriptionHash)
        internal
        override(GovernorUpgradeable, GovernorTimelockControlUpgradeable)
        returns (uint256)
    {
        return super._cancel(targets, values, calldatas, descriptionHash);
    }

    function _executor()
        internal
        view
        override(GovernorUpgradeable, GovernorTimelockControlUpgradeable)
        returns (address)
    {
        return super._executor();
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(GovernorUpgradeable, GovernorTimelockControlUpgradeable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}