// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IContentObject {
    /* Structs */

    struct Tag {
        string tag; // human-readable tag this contract has staked
        uint256 slot; // slot staked by this contract
        address staker; // address which staked the specific tag
        uint256 stake; // the amount staked by the staker
    }

    /* Functions */

    function tagIndices(string calldata tag, address stakingToken) external view returns (uint256);

    function getNumberOfStakedTags(address stakingToken) external view returns (uint256);

    function getTagArray(address stakingToken) external view returns (Tag[] memory);

    function updateMaxTagsLimit() external;
}
