// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.24;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract SmartWallet is Initializable {
    address payable public owner;

    function initialize(address payable _owner) public initializer {
        owner = _owner;
    }

    modifier onlyOwner() {
        require(owner == msg.sender, "Caller is not the owner");
        _;
    }

    function withdraw() public onlyOwner {
        owner.transfer(address(this).balance);
    }

    function getOwner() public view returns (address) {
        return owner;
    }

    /// @notice Asset transfer functions

    /// @notice Transfer ERC20 tokens
    /// @param tokenAddress The contract address of the ERC20 token
    /// @param to The receiver address
    /// @param amount The amount to transfer in wei
    function transferERC20(address tokenAddress, address to, uint256 amount) public onlyOwner {
        require(IERC20(tokenAddress).transfer(to, amount), "ERC20 transfer failed");
    }

    /// @notice Transfer a ERC721 token
    /// @param tokenAddress The contract address of the ERC721 token
    /// @param to The receiver address
    /// @param tokenId The token id to transfer
    function transferERC721(address tokenAddress, address to, uint256 tokenId) public onlyOwner {
        IERC721(tokenAddress).safeTransferFrom(address(this), to, tokenId);
    }

    /// @notice Transfer ERC1155 tokens
    /// @param tokenAddress The contract address of the ERC1155 token
    /// @param to The receiver address
    /// @param id The token id to transfer
    /// @param amount The amount to transfer in wei
    /// @param data Additional data for the call
    function safeTransferERC1155(address tokenAddress, address to, uint256 id, uint256 amount, bytes memory data) public onlyOwner {
        IERC1155(tokenAddress).safeTransferFrom(address(this), to, id, amount, data);
    }
}

// ERC-20 interface
interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
}

// ERC-721 interface
interface IERC721 {
    function safeTransferFrom(address from, address to, uint256 tokenId) external;
}

// ERC-1155 interface
interface IERC1155 {
    function safeTransferFrom(address from, address to, uint256 id, uint256 amount, bytes calldata data) external;
}
