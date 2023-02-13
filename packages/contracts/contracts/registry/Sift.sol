// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlEnumerableUpgradeable.sol";

/// @title Sift 
/// @author Snickerdoodle Labs
/// @notice Synamint Protocol Sift Contract
/// @dev The Sift contract is a simple registry that tracks verified or malicious urls
/// @dev If a url has been verified by the Snickerdoodle team, it is minted with a Sift ERC721 token with a 'VERIFIED' tokenURI
/// @dev If a url has been identified as malicious, it is minted a 'MALICIOUS' tokenURI
/// @dev SDL's data wallet browser extension will query the Sift contract with the url that its user is visiting
/// @dev Each url that enters the registry is mapped to a token id that has the corresponding tokenURI describe above
/// @dev If the url does not have a tokenId minted against it, the contract returns the 'NOT VERIFIED' status

contract Sift is Initializable, ERC721Upgradeable, ERC721URIStorageUpgradeable, ERC721BurnableUpgradeable, AccessControlEnumerableUpgradeable {
    using CountersUpgradeable for CountersUpgradeable.Counter;

    CountersUpgradeable.Counter private _tokenIdCounter;

    /// @dev mapping of hashed url to tokenId 
    mapping(bytes32 => uint256) public urlToTokenId;

    /// @dev Base uri of Sift
    string public baseURI;

    /// @dev Total supply of Sift tokens
    uint256 public totalSupply;

    /// @dev creating public strings, cleaning up hardcoded responses. 
    string verified = "VERIFIED";
    string not_verified = "NOT VERIFIED";
    string malicious = "MALICIOUS";

    /// @dev Order struct
    struct tokenContractMetadata {
        uint ID;
        string ticker;
        string chainId;
        string metadata;
        string status;		
    }

    //@dev initialized whiteListCount, used as mapping key
    uint256 whiteListCount;

    /// @dev mapping of hashed url to tokenId 
    mapping(address => uint256) public bytesToContract;

    /// @dev mapping of hashed url to tokenId 
    mapping(uint256 => tokenContractMetadata) public uintToContract;

    /// @dev mapping of addressToContractMetadata
    mapping(address => tokenContractMetadata) public addressToContractMetadata;


    /// @dev Role bytes
    bytes32 public constant VERIFIER_ROLE = keccak256("VERIFIER_ROLE");

    /// @dev Initializes the contract with the base URI, then disables any initializers as recommended by OpenZeppelin
    constructor(string memory baseURInew) {
        initialize(baseURInew);
    }

    /// @notice Initializes the contract
    /// @dev Uses the initializer modifier to to ensure the contract is only initialized once
    function initialize(string memory baseURI_) initializer public {
        __ERC721_init("Sift", "SIFT");
        __ERC721URIStorage_init();
        __ERC721Burnable_init();

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(VERIFIER_ROLE, msg.sender);

        setBaseURI(baseURI_);
    }
              
    /// @notice Verifies a url
    /// @dev Mints an NFT with the 'VERIFIED' tokenURI
    /// @dev Only addresses with VERIFIER_ROLE can call it and is checked in _safeMintAndRegister()
    /// @param url Site URL
    /// @param owner Address receiving the url's NFT   
    function verifyURL(string memory url, address owner) external {
        // check if the url has already been verified on the contract
        // if it has a token id mapped to it, it has been verified 
        require(urlToTokenId[keccak256(abi.encodePacked(url))] == 0, "Consent: URL already verified");

        // mint token id and append to the token URI "VERIFIED"
        _safeMintAndRegister(owner, "VERIFIED", url);
    }

    /// @notice Marks a url as malicious 
    /// @dev Mints an NFT with the 'MALICIOUS' tokenURI
    /// @dev Only addresses with VERIFIER_ROLE can call it and is checked in _safeMintAndRegister()
    /// @param url Site URL
    /// @param owner Address receiving the url's NFT  
    function maliciousURL(string memory url, address owner) external {
        // mint token id and append to the token URI "MALICIOUS"
        _safeMintAndRegister(owner, "MALICIOUS", url);
    }

    /// @notice Checks the status of a url 
    /// @param url Site URL
    /// @return result Returns the token uri of 'VERIFIED', 'MALICIOUS', or 'NOT VERIFIED'    
    function checkURL(string memory url) external view returns(string memory result) {
        // get the url's token using its hashed value
        uint256 tokenId = urlToTokenId[keccak256(abi.encodePacked(url))];

        // if token's id is 0, it has not been verified yet
        if (tokenId == 0) return not_verified;

        // else, return token's URI
        return tokenURI(tokenId);
    }

    /// @notice Sets the Sift tokens base URI
    /// @param newURI New base uri
    function setBaseURI(string memory newURI) public onlyRole(DEFAULT_ADMIN_ROLE) {
        baseURI = newURI;
    }

    /// @notice Internal function to carry out token minting and mapping updates
    /// @param to Address receiving the token
    /// @param uri Token uri containing status
    /// @param url Site URL
    function _safeMintAndRegister(address to, string memory uri, string memory url) internal onlyRole(VERIFIER_ROLE) {
        // ensure that tokenIds start from 1 so that 0 can be kept as tokens that are not verified yet
        uint256 tokenId = _tokenIdCounter.current() + 1;
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);

        // register hashed url to token mapping
        urlToTokenId[keccak256(abi.encodePacked(url))] = tokenId;

        /// increase total supply count
        totalSupply++;
    }
    


    /* SIFT CONTRACT WHITELISTING */ 
    /* Adding Contract to Whitelist, using their address as key */
    /// @notice Checks the status of a tokenContract 
    /// @param ID users ID
    /// @param ticker - ticker symbol
    /// @param chainId - chainId
    /// @param metadata - metadata
    /// @param status - "VERIFIED" or "MALICIOUS"
    /// @return result Returns the token uri of 'VERIFIED', 'MALICIOUS', or 'NOT VERIFIED' 
    function createWhitelistData(uint ID, string memory ticker, string memory chainId, string memory metadata, string memory status) external pure returns(tokenContractMetadata memory result) {
        tokenContractMetadata memory newWhitelistEntry;
        newWhitelistEntry.ID = ID;
        newWhitelistEntry.ticker = ticker;
        newWhitelistEntry.chainId = chainId;
        newWhitelistEntry.metadata = metadata;
        newWhitelistEntry.status = status;

        // mint token id and append to the token URI "VERIFIED"
        return newWhitelistEntry;
    }

    /// @notice Checks the status of a tokenContract 
    /// @param tokenAddress users token address
    /// @return result Returns the token uri of 'VERIFIED', 'MALICIOUS', or 'NOT VERIFIED'    
    function checkContract(address tokenAddress) external view returns(tokenContractMetadata memory result) {
        // get the url's token using its hashed value
        uint256 tokenId = bytesToContract[tokenAddress];

        require( tokenId > 0, "Sift error: Contract address's metadata doesnt exist");

        return uintToContract[tokenId];
    }

    /// @param tokenAddress users token address
    /// @param tokenContract token address
    function addContractToWhitelist(address tokenAddress, tokenContractMetadata memory tokenContract) external {
        // get the url's token using its hashed value
        addressToContractMetadata[tokenAddress] = tokenContract;
        whiteListCount++;
    }

    /// @param tokenAddress users token address
    function removeContractToWhitelist(address tokenAddress) external {
        // get the url's token using its hashed value
        delete addressToContractMetadata[tokenAddress];
        whiteListCount--;
    }

    /// @param tokenAddress users token address
    function setStatusToMalicious(address tokenAddress) external {
        // get the url's token using its hashed value
        tokenContractMetadata memory metadata = addressToContractMetadata[tokenAddress];
        metadata.status = "MALICIOUS";
        addressToContractMetadata[tokenAddress] = metadata;
    }

    /// @param tokenAddress users token address
    function setStatusToVerified(address tokenAddress) external {
        // get the url's token using its hashed value
        tokenContractMetadata memory metadata = addressToContractMetadata[tokenAddress];
        metadata.status = "VERIFIED";
        addressToContractMetadata[tokenAddress] = metadata;
    }


    /* OVERRIDES */ 

    /// @notice Override _baseURI to return the Sift tokens base URI
    function _baseURI() internal view virtual override returns (string memory baseURI_)  {
        return baseURI;
    }

    // The following functions are overrides required by Solidity.

    function _burn(uint256 tokenId)
        internal
        override(ERC721Upgradeable, ERC721URIStorageUpgradeable)
    {
        super._burn(tokenId);

        /// decrease total supply count
        totalSupply--;
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721Upgradeable, ERC721URIStorageUpgradeable)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721Upgradeable, AccessControlEnumerableUpgradeable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}