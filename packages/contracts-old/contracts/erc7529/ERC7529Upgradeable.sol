// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import {IERC7529} from "./IERC7529.sol";
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

abstract contract ERC7529Upgradeable is IERC7529, Initializable {
    /* Storage Variables */

    /// @custom:storage-location erc7201:snickerdoodle.erc7529
    struct ERC7529Storage {
        /// @dev Mapping of trusted eTLD+1s
        mapping(bytes32 => bool) domains;
    }

    // keccak256(abi.encode(uint256(keccak256("snickerdoodle.erc7529")) - 1)) & ~bytes32(uint256(0xff))
    bytes32 private constant ERC7529StorageLocation =
        0x29912872bb1868dd74efe86230a05098a24ae1f39d64ec2129d982442801ac00;

    function _getERC7529Storage()
        private
        pure
        returns (ERC7529Storage storage $)
    {
        assembly {
            $.slot := ERC7529StorageLocation
        }
    }

    function __ERC7529_init() internal onlyInitializing {}

    function __ERC7529_init_unchained() internal onlyInitializing {}

    /// @notice a getter function that takes an eTLD+1 domain string and returns true if associated with the contract
    /// @param domain a string representing an eTLD+1 domain
    function checkDomain(string calldata domain) external view returns (bool) {
        ERC7529Storage storage $ = _getERC7529Storage();
        return $.domains[keccak256(abi.encodePacked(domain))];
    }

    /// @notice an authenticated method to add an eTLD+1 domain
    /// @param domain a string representing an eTLD+1 domain associated with the contract
    function _addDomain(string memory domain) internal virtual {
        ERC7529Storage storage $ = _getERC7529Storage();
        $.domains[keccak256(abi.encodePacked(domain))] = true;
        emit AddDomain(domain);
    }

    /// @notice an authenticated method to remove an eTLD+1 domain
    /// @param domain a string representing an eTLD+1 domain that is no longer associated with the contract
    function _removeDomain(string memory domain) internal virtual {
        ERC7529Storage storage $ = _getERC7529Storage();
        require($.domains[keccak256(abi.encodePacked(domain))] == true, "ERC7529: eTLD+1 currently not associated with this contract");
        $.domains[keccak256(abi.encodePacked(domain))] = false;
        emit RemoveDomain(domain);
    }
}
