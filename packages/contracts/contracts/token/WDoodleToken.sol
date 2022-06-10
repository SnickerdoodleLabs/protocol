// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";

/// @title Wrapped Doodle Token 
/// @author Sean Sing
/// @notice Wrapped Doodle ERC-20 token contract
/// @dev Contract was generated using OpenZepplin Wizard with the 'Votes' feature 
/// @dev Purpose is to provide ERC-20 compatability to the native Doodle Token
/// @dev Token is intended to have a total cap supply so _mint() is called and transfered to the SDL foundationfoundation/DAO/treasury address

contract WDoodleToken is ERC20, ERC20Permit, ERC20Votes {

    constructor(address distributionAddress) ERC20("Wrapped Doodle", "WDOODLE") ERC20Permit("Wrapped Doodle") {
        // TODO: confirm total cap supply, mints to foundation/DAO/treasury address 
        _mint(distributionAddress, 10000);
    }

    ///@notice Allow a user to deposit underlying tokens and mint the corresponding number of wrapped tokens.
    function depositAndWrap() public payable {
        _mint(msg.sender, msg.value);
    }

    ///@notice Allow a user to burn a number of wrapped tokens and withdraw the corresponding number of underlying tokens.
    ///@param amount Amount to unwrap and withdraw in unit of wei
    function unwrapAndWithdraw(uint256 amount) public virtual {

        // check if user has sufficient wrapped token balance
        require(balanceOf(msg.sender) >= amount, "WDoodleToken: Insufficient balance for transfer");

        // burn first to avoid reentrancy (checks-effects-interactions pattern)
        _burn(_msgSender(), amount);

        // transfer the native token amount back to the user via call as recomended after Istanbul hard-fork
        // read more here: https://consensys.net/diligence/blog/2019/09/stop-using-soliditys-transfer-now/
        (bool success, ) = msg.sender.call{value:amount}("");
        require(success, "WDoodleToken: Transfer failed");
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