// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";
import "@snickerdoodlelabs/erc7529/contract/ERC7529.sol";

contract ERC20Reward is ERC20, ERC20Burnable, ERC20Permit, ERC7529 {

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    constructor(string memory name, string memory symbol)
        ERC20(name, symbol)
        ERC20Permit(name)
    {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
    }

    function mint(address to, uint256 amount) public onlyRole(MINTER_ROLE) {
        _mint(to, amount);
    }

    function burnFrom(address account, uint256 value) public override {
        // If the caller is not the DEFAULT_ADMIN_ROLE, check the allowance before burning
        if(!hasRole(DEFAULT_ADMIN_ROLE, msg.sender)) {
            _spendAllowance(account, _msgSender(), value);
        }

        _burn(account, value);
    }

    function _transfer(address from, address to, uint256 value) internal override {
        require(
            from == address(0) || to == address(0),
            "ERC20Reward: Tokens on this contract are non-transferable"
        );
        super._transfer(from, to, value);
    }

}