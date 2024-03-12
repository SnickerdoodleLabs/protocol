// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";
import "@snickerdoodlelabs/erc7529/contract/ERC7529.sol";
import "@layerzerolabs/lz-evm-oapp-v2/contracts/oft/OFT.sol";

contract OFT20Reward is OFT, ERC20Burnable, ERC20Permit, ERC7529 {

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    constructor(string memory name, string memory symbol, address layerZeroEndpoint)
        OFT(name, symbol, layerZeroEndpoint, msg.sender)
        ERC20Permit(name)
    {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
    }

    function mint(address to, uint256 amount) public onlyRole(MINTER_ROLE) {
        _mint(to, amount);
    }
}