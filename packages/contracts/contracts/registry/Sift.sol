// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlEnumerableUpgradeable.sol";
 
/// @title Sift 
/// @author Snickerdoodle Labs
/// @notice Synamint Protocol Sift Contract
/// @dev The Sift contract is a simple registry that tracks verified or malicious entities
/// @dev If an entity has been verified by the Snickerdoodle team, it is minted with a Sift ERC721 token with a 'VERIFIED' entity
/// @dev If an entity has been identified as malicious, it is minted a 'MALICIOUS' entity
/// @dev SDL's data wallet browser extension will query the Sift contract with the entity that its user is visiting
/// @dev Each entity that enters the registry is mapped to a token id that has the corresponding entity describe above
/// @dev If the entity does not have a tokenId minted against it, the contract returns the 'NOT VERIFIED' status

contract Sift is Initializable, ERC721Upgradeable, ERC721BurnableUpgradeable, AccessControlEnumerableUpgradeable {
    using CountersUpgradeable for CountersUpgradeable.Counter;

    CountersUpgradeable.Counter private _tokenIdCounter;

    /// @dev mapping of hashed label to tokenId (i.e. a URL, Tokens, NFTs, Ad Agents, Ad Banners, etc.)
    mapping(bytes32 => uint256) public labelToTokenId;

    /// @dev Base uri of Sift
    string public baseURI;

    /// @dev Total supply of Sift tokens
    uint256 public totalSupply;

    /// @dev Order struct
    struct entityStruct {
        bytes32 label; /// this is your hashed label 
        string metadata; /// this can be JSON i.e. a string
        uint8 status;	 /// i.e. Verified: 0, not_verified: 1, malicious: 2	
    }

    mapping(uint256 => entityStruct) public tokenIDtoEntity;

    /// @dev Role bytes
    bytes32 public constant VERIFIER_ROLE = keccak256("VERIFIER_ROLE");

    /// @notice Initializes the contract
    /// @dev Uses the initializer modifier to to ensure the contract is only initialized once
    function initialize(string memory baseURI_) initializer public {
        __ERC721_init("Sift", "SIFT");
        __ERC721Burnable_init();

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(VERIFIER_ROLE, msg.sender);

        setBaseURI(baseURI_);
    }
              
    /// @notice Verifies an entity
    /// @dev Mints an NFT with the 'VERIFIED' entity
    /// @dev Only addresses with VERIFIER_ROLE can call it and is checked in _safeMintAndRegister()
    /// @param label human-readable object label
    /// @param owner Address receiving the entity's NFT 
    /// @param metadata stringified JSON object with useful keyvalue pairs
    function verifyEntity(string memory label, address owner, string memory metadata) external {
        // check if the entity has already been verified on the contract
        // if it has a token id mapped to it, it has been verified 
        require(labelToTokenId[keccak256(abi.encodePacked(label))] == 0, "Consent: Entity already verified");

        // mint token with the associated label and metadata for a status of 1 (which means its safe)
        _safeMintAndRegister(owner, 1, label, metadata);
    }

    /// @notice Marks an entity as malicious 
    /// @dev Mints an NFT with the 'MALICIOUS' entity
    /// @dev Only addresses with VERIFIER_ROLE can call it and is checked in _safeMintAndRegister()
    /// @param label human-readable object label
    /// @param owner Address receiving the entity's NFT  
    /// @param metadata stringified JSON object with useful keyvalue pairs
    function maliciousEntity(string memory label, address owner, string memory metadata) external {
        // Label does not correspond to a token
        require(labelToTokenId[keccak256(abi.encodePacked(label))] == 0, "Consent: Entity already verified");
        
        // mint token id and append to the token URI "MALICIOUS"
        _safeMintAndRegister(owner, 2, label, metadata);
    }

    /// @notice Checks the status of an entity 
    /// @dev Returns status of entities
    /// @param label human-readable object labels
    /// @return result Returns the token uri of 'VERIFIED', 'MALICIOUS', or 'NOT VERIFIED'    
    function checkEntity(string memory label) external view returns(entityStruct memory result) {
        // get the entity's token using its hashed value
        bytes32 encodedLabel = keccak256(abi.encodePacked(label));
        uint256 tokenId = labelToTokenId[encodedLabel];

        // return unverified, empty-metadata entityStruct if tokenId not stored
        if (tokenId == 0) { 
            return entityStruct(encodedLabel, "", 0);
        }

        return tokenIDtoEntity[tokenId];
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
    function _safeMintAndRegister(address to, uint8 verifiedStatus, string memory label, string memory metadata) internal onlyRole(VERIFIER_ROLE) {
        // ensure that tokenIds start from 1 so that 0 can be kept as tokens that are not verified yet
        uint256 tokenId = _tokenIdCounter.current() + 1;
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);

        // register hashed entity to token mapping
        bytes32 encodedLabel = keccak256(abi.encodePacked(label));
        labelToTokenId[encodedLabel] = tokenId;

        /// set the metadata
        tokenIDtoEntity[tokenId] = entityStruct(encodedLabel, metadata, verifiedStatus);

        /// increase total supply count
        totalSupply++;
    }

    /* OVERRIDES */ 
    /// @notice Override _baseURI to return the Sift tokens base URI
    function _baseURI() internal view virtual override returns (string memory baseURI_)  {
        return baseURI;
    }
    
    // The following functions are overrides required by Solidity.
    function _burn(uint256 tokenId)
        internal
        override(ERC721Upgradeable)
    {
        entityStruct memory entity = tokenIDtoEntity[tokenId];

        // Zero out mapping to remove value, its better than delete call
        delete labelToTokenId[entity.label];

        // Zero out mapping to remove value, its better than delete call
        delete tokenIDtoEntity[tokenId];

        super._burn(tokenId);
        /// decrease total supply count
        totalSupply--;
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