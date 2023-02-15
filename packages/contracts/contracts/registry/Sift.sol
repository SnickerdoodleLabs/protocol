// S// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
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

contract Sift is Initializable, ERC721Upgradeable, ERC721BurnableUpgradeable, AccessControlEnumerableUpgradeable {
    using CountersUpgradeable for CountersUpgradeable.Counter;

    CountersUpgradeable.Counter private _tokenIdCounter;

    CountersUpgradeable.Counter private _whiteListCounter;

    /// @dev mapping of hashed label to tokenId (i.e. a URL, Ticker, )
    mapping(bytes32 => uint256) public labelToTokenId;

    /// @dev Base uri of Sift
    string public baseURI;

    /// @dev Total supply of Sift tokens
    uint256 public totalSupply;

    /// @dev Order struct
    struct entityStruct {
        string metadata; /// this can be JSON i.e. a string
        uint256 status;	 /// i.e. Verified: 0, not_verified: 1, malicious: 2	
    }

    //@dev initialized whiteListCount
    uint256 public whiteListCount;

    mapping(uint256 => entityStruct) public tokenIDtoEntity;

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
        __ERC721Burnable_init();

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(VERIFIER_ROLE, msg.sender);

        setBaseURI(baseURI_);
    }
              
    /// @notice Verifies a url
    /// @dev Mints an NFT with the 'VERIFIED' tokenURI
    /// @dev Only addresses with VERIFIER_ROLE can call it and is checked in _safeMintAndRegister()
    /// @param label human-readable object label
    /// @param owner Address receiving the url's NFT 
    /// @param metadata stringified JSON object with useful keyvalue pairs
    function verifyEntity(string memory label, address owner, string memory metadata) external {
        // check if the url has already been verified on the contract
        // if it has a token id mapped to it, it has been verified 
        require(labelToTokenId[keccak256(abi.encodePacked(label))] == 0, "Consent: URL already verified");

        // mint token id and append to the token URI "VERIFIED"
        _safeMintAndRegister(owner, 1, label, metadata);
    }

    /// @notice Marks a url as malicious 
    /// @dev Mints an NFT with the 'MALICIOUS' tokenURI
    /// @dev Only addresses with VERIFIER_ROLE can call it and is checked in _safeMintAndRegister()
    /// @param label human-readable object label
    /// @param owner Address receiving the url's NFT  
    /// @param metadata stringified JSON object with useful keyvalue pairs
    function maliciousEntity(string memory label, address owner, string memory metadata) external {
        // mint token id and append to the token URI "MALICIOUS"
        _safeMintAndRegister(owner, 2, label, metadata);
    }

    /// @notice Checks the status of a url 
    /// @dev Returns status of entities
    /// @param labels human-readable object labels
    /// @return result Returns the token uri of 'VERIFIED', 'MALICIOUS', or 'NOT VERIFIED'    
    function checkEntities(string[] memory labels) external view returns(entityStruct[] memory result) {
        // get the url's token using its hashed value
        entityStruct[] memory returnedValues = new entityStruct[](labels.length);

        for (uint i = 0; i < labels.length; i++) {
            uint256 tokenId = labelToTokenId[keccak256(abi.encodePacked(labels[i]))];

            // if token's id is 0, it has not been verified yet
            if (tokenId == 0) { 
                returnedValues[i] = entityStruct("", 0);
            }
            else
            {
                // else, return token's entityStruct
                returnedValues[i] = tokenIDtoEntity[tokenId];
            } 

        }

        return returnedValues;
    }

    /// @notice Sets the Sift tokens base URI
    /// @param newURI New base uri
    function setBaseURI(string memory newURI) public onlyRole(DEFAULT_ADMIN_ROLE) {
        baseURI = newURI;
    }

    /// @notice Internal function to carry out token minting and mapping updates
    /// @param to Address receiving the token
    /// @param verifiedStatus Status passed from the token
    /// @param label Status passed from the token
    /// @param metadata Token's metadata
    function _safeMintAndRegister(address to, uint256 verifiedStatus, string memory label, string memory metadata) internal onlyRole(VERIFIER_ROLE) {
        // ensure that tokenIds start from 1 so that 0 can be kept as tokens that are not verified yet
        uint256 tokenId = _tokenIdCounter.current() + 1;
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);

        // register hashed url to token mapping
        labelToTokenId[keccak256(abi.encodePacked(label))] = tokenId;

        /// set the metadata
        tokenIDtoEntity[tokenId] = entityStruct(metadata, verifiedStatus);

        /// increase total supply count
        totalSupply++;
    }

    function returnWhiteListCount() external view returns(uint256 Val) {
        return whiteListCount;
    }

    /* OVERRIDES */ 

    /// @notice Override _baseURI to return the Sift tokens base URI
    function _baseURI() internal view virtual override returns (string memory baseURI_)  {
        return baseURI;
    }

    // The following functions are overrides required by Solidity.

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721Upgradeable, AccessControlEnumerableUpgradeable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}