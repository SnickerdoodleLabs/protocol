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

    uint256 public currentTokenId; 

    mapping(uint256 => string) public tokenIdToURI; 
    mapping(uint256 => uint256) public tokenIdToMaxSupply; 

    modifier tokenIdExists(uint256 tokenId) {
        require(tokenId <= currentTokenId, "ERC1155Reward: Token id does not exist");
        _;
    }

    constructor(string[] memory newuris) ERC1155("") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);

        // For each given uri, create a token id for it starting with id 1
        for(uint256 i; i < newuris.length; i++) {
            createNewToken(newuris[i]);
        }
    }

    function setURI(uint256 tokenId, string memory newURI) public onlyRole(DEFAULT_ADMIN_ROLE) tokenIdExists(tokenId) {
        tokenIdToURI[tokenId] = newURI;
    }

    function mint(address account, uint256 tokenId, uint256 amount, bytes memory data)
        public
        onlyRole(MINTER_ROLE)
        tokenIdExists(tokenId)
    {
        _mint(account, tokenId, amount, data);
    }

    function mintBatch(address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
        public
        onlyRole(MINTER_ROLE)
    {
        for(uint256 i; i < ids.length; i++) {
            require(ids[i] <= currentTokenId, "ERC1155Reward: Token id does not exist");
        }
        _mintBatch(to, ids, amounts, data);
    }

    /// @notice Returns the uri for a given token id
    /// @dev This method overrides ERC1155's uri to allow unique uris for each token id
    function uri(uint256 tokenId) override public view tokenIdExists(tokenId) returns (string memory) {
        return tokenIdToURI[tokenId]; 
    }

    /// @notice Creates a new token id and registers its uri
    function createNewToken(string memory newTokenURI) public onlyRole(DEFAULT_ADMIN_ROLE) {
        tokenIdToURI[currentTokenId++] = newTokenURI; 
    }

    // The following functions are overrides required by Solidity.

   /*  function _update(address from, address to, uint256[] memory ids, uint256[] memory values)
        internal
        override(ERC1155, ERC1155Supply)
    {
        super._update(from, to, ids, values);
    } */


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
