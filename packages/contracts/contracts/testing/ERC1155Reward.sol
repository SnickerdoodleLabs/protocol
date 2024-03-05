// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@snickerdoodlelabs/erc7529/contract/ERC7529.sol";

contract ERC1155Reward is ERC1155, AccessControl, ERC1155Supply, ERC7529 {
    bytes32 public constant URI_SETTER_ROLE = keccak256("URI_SETTER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    // Number of reward options
    uint256 public tokenCount; 

    /// @notice Takes the initial number of rewards offered and sets the current token id
    constructor(uint256 numberOfRewards) ERC1155("") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        
        require(numberOfRewards > 0, "ERC1155Reward: Number of rewards must be greater than zero");
        // Starts from token id 0
        tokenCount = numberOfRewards - 1;
    }

    function setURI(string memory newURI) public onlyRole(DEFAULT_ADMIN_ROLE) {
        _setURI(newURI); 
    }

    function mint(address account, uint256 tokenId, uint256 amount, bytes memory data)
        public
        onlyRole(MINTER_ROLE)
    {
        require(tokenId <= tokenCount, "ERC1155Reward: Token id does not exist");
        _mint(account, tokenId, amount, data);
    }

    function mintBatch(address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
        public
        onlyRole(MINTER_ROLE)
    {
        for(uint256 i; i < ids.length; i++) {
            require(ids[i] <= tokenCount, "ERC1155Reward: Token id does not exist");
        }
        _mintBatch(to, ids, amounts, data);
    }

    /// @notice Creates a new token id and registers the new uri
    function createNewToken(string memory newURI) public onlyRole(DEFAULT_ADMIN_ROLE) {
        tokenCount++;
        setURI(newURI);
    }

    // The following functions are overrides required by Solidity.
    function _beforeTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) override(ERC1155, ERC1155Supply) internal {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC1155, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
