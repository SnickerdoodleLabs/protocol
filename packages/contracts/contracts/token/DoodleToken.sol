// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";

/// @title Doodle Token 
/// @author Sean Sing
/// @notice Doodle ERC-20 token contract
/// @dev Contract was generated using OpenZeppling Wizard with the 'Votes' feature 
/// @dev Token is intended to have a total cap supply so _mint() is called and transfered to the SDL foundationfoundation/DAO/treasury address

contract DoodleToken is ERC20, ERC20Permit, ERC20Votes {

    constructor(address distributionAddress) ERC20("Doodle", "DOODLE") ERC20Permit("Doodle") {
        // TODO: confirm total cap supply, mints to foundation/DAO/treasury address 
        _mint(distributionAddress, 100000000000000000000000000);
    }

    // The following functions are overrides required by Solidity.

    function _afterTokenTransfer(address from, address to, uint256 amount)
        internal
        override(ERC20, ERC20Votes)
    {
        super._afterTokenTransfer(from, to, amount);
    }

    function _mint(address to, uint256 amount)
        internal
        override(ERC20, ERC20Votes)
    {
        super._mint(to, amount);
    }

    function _burn(address account, uint256 amount)
        internal
        override(ERC20, ERC20Votes)
    {
        super._burn(account, amount);
    }
}