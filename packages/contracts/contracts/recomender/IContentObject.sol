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

    function getStakingToken() external view returns(address); 

    function tagIndices(string calldata) external view returns (uint256);

    function getNumberOfStakedTags() external view returns (uint256);

    function updateMaxTagsLimit() external;

    function getTagArray() external view returns (Tag[] memory);
}
