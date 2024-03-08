// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
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

    function redeem(address account, uint256 value, bytes memory signature) public {

        // Regenerate the message 
        bytes32 hash = ECDSA.toEthSignedMessageHash(
            keccak256(abi.encodePacked(address(this), account, value))
        );

        // Get the signer of the message
        address signer = _getSigner(hash, signature);

        // If the caller has is an admin, check the signer against the target account to burn tokens from
        // If the caller is not an admin, check that the function caller is the signer
        if (hasRole(DEFAULT_ADMIN_ROLE, _msgSender())) {
            require(signer == account, "ERC20Reward: Signer does not match account to redeem from");
        } else {
            require(signer == _msgSender(), "ERC20Reward: Caller did not sign the message"); 
        }

        // If signer is correct, burn the token to redeem
        _burn(account, value);
    }

    function _getSigner(
        bytes32 hash,
        bytes memory signature
    ) internal pure returns (address) {
        // retrieve the signature's signer
        address signer = ECDSA.recover(hash, signature);

        require(signer != address(0), "ERC20Reward: Signer cannot be 0 address.");

        return signer;
    }

    function _transfer(address from, address to, uint256 value) internal override {
        require(
            from == address(0) || to == address(0),
            "ERC20Reward: Tokens on this contract are non-transferable"
        );
        super._transfer(from, to, value);
    }
}