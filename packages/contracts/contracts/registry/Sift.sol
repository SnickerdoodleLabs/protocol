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
/// @dev If a url has been verified by the Snickerdoodle team, it is minted with a ERC721 token with a 'VERIFIED' tokenURI
/// @dev If a url has been identified as malicious, it is minted a 'MALICIOUS' tokenURI
/// @dev SDL's data wallet browser extension will query the Sift contract with the url that its user is visiting
/// @dev Each url that enters the registry is mapped to a token id that has the corresponding tokenURI describe above
/// @dev If the url does not have a tokenId minted against it, the contract returns the 'NOT VERIFIED' status

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

    /// @notice Verifies a url
    /// @dev Mints an NFT with the 'VERIFIED' tokenURI
    /// @param url Site URL
    /// @param owner Address receiving the url's NFT   
    function verifyURL(string memory url, address owner) external onlyOwner {

        // mint token id and append to the token URI "VERIFIED"
        _safeMintAndRegister(owner, "VERIFIED", url);
    }

    /// @notice Marks a url as malicious 
    /// @dev Mints an NFT with the 'MALICIOUS' tokenURI
    /// @param url Site URL
    /// @param owner Address receiving the url's NFT  
    function maliciousURL(string memory url, address owner) external onlyOwner {

        // mint token id and append to the token URI "MALICIOUS"
        _safeMintAndRegister(owner, "MALICIOUS", url);
    }

    /// @notice Checks the status of a url 
    /// @param url Site URL
    /// @return result Returns the token uri of 'VERIFIED', 'MALICIOUS', or 'NOT VERIFIED'    
    function checkURL(string memory url) external view returns(string memory result) {

        uint256 tokenId = urlToTokenId[keccak256(abi.encodePacked(url))];

        // if token's id is 0, it has not been verified yet
        if (tokenId == 0) return "NOT VERIFIED";

        // else, return token's URI
        return tokenURI(tokenId);
    }

    /// @notice Internal function to carry out token minting and mapping updates
    /// @param to Address receiving the token
    /// @param uri Token uri containing status
    /// @param url Site URL
    /// @return result Returns the token uri of 'VERIFIED', 'MALICIOUS', or 'NOT VERIFIED'  
    function _safeMintAndRegister(address to, string memory uri, string memory url) internal onlyOwner {
        // ensure that tokenIds start from 1 so that 0 can be kept as tokens that are not verified yet
        uint256 tokenId = _tokenIdCounter.current() + 1;
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);

        // register hashed url to token mapping
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