// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract StorageHash {
    constructor() {}

    function ContentFactory() public pure returns(bytes32) {
        bytes32 storageHash = keccak256(abi.encode(uint256(keccak256("snickerdoodle.contentfactory")) - 1)) & ~bytes32(uint256(0xff));
        return storageHash;
    }

    function ContentObject() public pure returns(bytes32) {
        bytes32 storageHash = keccak256(abi.encode(uint256(keccak256("snickerdoodle.contentobject")) - 1)) & ~bytes32(uint256(0xff));
        return storageHash;
    }

    function ERC7529() public pure returns(bytes32) {
        bytes32 storageHash = keccak256(abi.encode(uint256(keccak256("snickerdoodle.erc7529")) - 1)) & ~bytes32(uint256(0xff));
        return storageHash;
    }

    function Pausable() public pure returns(bytes32) {
        bytes32 storageHash = keccak256(abi.encode(uint256(keccak256("openzeppelin.storage.Pausable")) - 1)) & ~bytes32(uint256(0xff));
        return storageHash;
    }
}
