// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@snickerdoodlelabs/erc7529/contract/ERC7529.sol";

contract ERC20Reward is ERC20, ERC20Burnable, ERC20Permit, ERC7529 {

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    bytes32 public constant REDEEM_DETAILS_TYPEHASH = keccak256("RedeemDetails(address contractAddress,address redeemFrom,uint256 redeemAmount,address redeemer)");

    // Define the details for redeeming
    struct RedeemDetails {
        address contractAddress;
        address redeemFrom;
        uint256 redeemAmount; 
        address redeemer;
    }

    using ECDSA for bytes32;

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

    function redeem(address redeemFrom, uint256 redeemAmount, bytes memory signature) public {

        // Hash the message
        bytes32 hash = hashRedeemDetails(RedeemDetails(address(this), redeemFrom, redeemAmount, _msgSender()));

        // Get the signer of the message using the hash and signature
        address signer = _getSigner(hash, signature);

        // Check that the signer matches redeemFrom
        require(signer == redeemFrom, "ERC20Reward: Caller did not sign the message"); 

        // This means that the 
        // If signer is correct, burn the token to redeem
        _burn(redeemFrom, redeemAmount);
    }

    // Function to hash the redeem message 
    // Refer to RedeemDetails struct for properties
    function hashRedeemDetails(RedeemDetails memory redeemDetails) public view returns(bytes32) {
        return _hashTypedDataV4(keccak256(abi.encode(REDEEM_DETAILS_TYPEHASH,
            redeemDetails.contractAddress,
            redeemDetails.redeemFrom,
            redeemDetails.redeemAmount,
            redeemDetails.redeemer
        )));
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