// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.24;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract SmartWallet is Initializable {
    address payable owner;

    function initialize(address payable _owner) public initializer {
        owner = _owner;
    }

    function withdraw() public {
        require(owner == msg.sender);
        owner.transfer(address(this).balance);
    }

    function getOwner() public view returns (address) {
        return owner;
    }
}