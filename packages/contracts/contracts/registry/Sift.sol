// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";

/// @title Sift 
/// @author Sean Sing
/// @notice Snickerdoodle Protocol's Sift Contract
/// @dev The Sift contract is a simple registry that tracks verified or malicious urls
/// @dev  

contract Sift is Initializable, ERC721Upgradeable, ERC721URIStorageUpgradeable, ERC721BurnableUpgradeable, OwnableUpgradeable {
    using CountersUpgradeable for CountersUpgradeable.Counter;

    CountersUpgradeable.Counter private _tokenIdCounter;

    /// @dev mapping of hashed url to tokenId 
    mapping(bytes32 => uint256) public urlToTokenId;

    function initialize() initializer public {
        __ERC721_init("ScamFilterRegistry", "SFR");
        __ERC721URIStorage_init();
        __ERC721Burnable_init();
        __Ownable_init();
    }

    function verifyURL(string memory url, address owner) public onlyOwner {

        // mint token id and append to the token URI "VERIFIED"
        safeMint(owner, "VERIFIED", url);
    }

    function maliciousURL(string memory url, address owner) public onlyOwner {

        // mint token id and append to the token URI "MALICIOUS"
        safeMint(owner, "MALICIOUS", url);
    }

    function checkURL(string memory url) public view returns(string memory result) {

        uint256 tokenId = urlToTokenId[keccak256(abi.encodePacked(url))];

        // if token's id is 0, it has not been verified yet
        if (tokenId == 0) return "NOT VERIFIED";

        // else, return token's URI
        return tokenURI(tokenId);
    }

    function safeMint(address to, string memory uri, string memory url) public onlyOwner {

        // ensure that tokenIds start from 1 so that 0 can be kept as tokens that are not verfied yet
        uint256 tokenId = _tokenIdCounter.current() + 1;
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);

        // add hashed url to token mapping
        urlToTokenId[keccak256(abi.encodePacked(url))] = tokenId;
    }

    // The following functions are overrides required by Solidity.

    function _burn(uint256 tokenId)
        internal
        override(ERC721Upgradeable, ERC721URIStorageUpgradeable)
    {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721Upgradeable, ERC721URIStorageUpgradeable)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
}