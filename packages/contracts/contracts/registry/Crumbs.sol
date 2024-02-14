// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlEnumerableUpgradeable.sol";

/// @title Crumbs 
/// @author Snickerdoodle Labs
/// @notice Synamint Protocol Crumbs Contract
/// @dev A crumb is a non-transferable ERC721 NFT that holds the JSON object (for SDL's parsing) of a user within the token uri
/// @dev Any user can create a crumb, store and update the JSON object 
/// @dev The ERC721's tokenId is labelled crumbId in this contract
/// @dev The baseline contract was generated using OpenZeppelin's (OZ) Contracts Wizard and customized thereafter 
/// @dev The contract adopts OZ's upgradeable beacon proxy pattern and serves as an implementation contract
/// @dev It is also compatible with OZ's meta-transaction library

contract Crumbs is Initializable, AccessControlEnumerableUpgradeable, PausableUpgradeable, ERC721URIStorageUpgradeable, ERC721BurnableUpgradeable {

    /// @dev Trusted forwarder address for meta-transactions 
    address public trustedForwarder;

    /// @notice Mapping of address to respective crumbId that stores its JSON object
    mapping(address => uint256) public addressToCrumbId;

    /// @dev Total supply of Crumb tokens
    uint256 public totalSupply;

    /// @dev Base uri of crumbs
    string public baseURI;

    /// @notice Emitted when a crumb is created
    /// @param owner Indexed address of data requester
    /// @param crumbId Indexed crumb id
    /// @param tokenURI tokenURI containing JSON object 
    event CrumbCreated(address indexed owner, uint256 indexed crumbId, string tokenURI);

    /// @notice Emitted when a crumb is burnt
    /// @param owner Indexed address of data requester
    /// @param crumbId Indexed crumb id
    event CrumbBurnt(address indexed owner, uint256 indexed crumbId);

    /// @notice Emitted when a crumb is updated
    /// @param owner Indexed address of data requester
    /// @param crumbId Indexed crumb id
    /// @param tokenURI New token URI
    event CrumbUpdated(address indexed owner, uint256 indexed crumbId, string tokenURI);

    /// @notice Initializes the contract
    /// @dev Uses the initializer modifier to to ensure the contract is only initialized once
    function initialize(address trustedForwarder_, string memory baseURI_) initializer public {
        __ERC721_init("Crumbs", "CRU");
        __ERC721URIStorage_init();
        __ERC721Burnable_init();
        __AccessControl_init();

        trustedForwarder = trustedForwarder_;

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        setBaseURI(baseURI_);
    }

    /// @notice Mints user a crumb 
    /// @param crumbId Id of the crumb token
    /// @param _tokenURI String of JSON object
    function createCrumb(uint256 crumbId, string memory _tokenURI) public {
        require(addressToCrumbId[_msgSender()] == 0, "Crumb: Address already has a crumb");

        // add address and crumbId to the mapping
        addressToCrumbId[_msgSender()] = crumbId;

        // mint the crumb
        _safeMint(_msgSender(), crumbId);
        // set the JSON object as the crumb's URI
        _setTokenURI(crumbId, _tokenURI);

        // increase total supply
        totalSupply++;

        emit CrumbCreated(_msgSender(), crumbId, _tokenURI);
    }

    /// @notice Burns user's crumb 
    /// @param crumbId Id of the crumb token
    function burnCrumb(uint256 crumbId) public {
        // check is caller is the owner of the crumbId and burns if true
        burn(crumbId);
        // remove the crum id from the mapping
        delete addressToCrumbId[_msgSender()];
        // reduce total supply
        totalSupply--;

        emit CrumbBurnt(_msgSender(), crumbId);
    }

    /// @notice Update a user's crumb 
    /// @param crumbId Id of the crumb token to update
    /// @param _tokenURI Id of the crumb token to update
    function updateCrumb(uint256 crumbId, string memory _tokenURI) public {
        
        require(addressToCrumbId[_msgSender()] == crumbId, "Crumbs: Caller is not crumb id's owner");

        _setTokenURI(crumbId, _tokenURI);

        emit CrumbUpdated(_msgSender(), crumbId, _tokenURI);
    }

     /* SETTERS */

    /// @notice Sets the Crumb tokens base URI
    /// @param newURI New base uri
    function setBaseURI(string memory newURI) public onlyRole(DEFAULT_ADMIN_ROLE) {
        baseURI = newURI;
    }

    /* OVERRIDES */

    /// @notice Override _baseURI to return the Crumb tokens base URI
    function _baseURI() internal view virtual override returns (string memory baseURI_)  {
        return baseURI;
    }

    /// @dev Override to add require statement to make crumb tokens non-transferable
    /// @dev Remove an address's mapping to its crumb id once its transferred
    function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize)
        internal
        whenNotPaused
        override
    {
        // ensures crumbs are non-transferable
        require(from == address(0) || to == address(0), "Crumbs: Crumb tokens are non-transferrable");
        
        // carry out checks before transfer
        super._beforeTokenTransfer(from, to, tokenId, batchSize);

        // if checks pass, delete crumb id of sender
        delete addressToCrumbId[from];

        // update crumb id to the receiver
        addressToCrumbId[to] = tokenId;
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

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721Upgradeable, AccessControlEnumerableUpgradeable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    /// @dev Inherited from ERC2771ContextUpgradeable to embed its features directly in this contract 
    /// @dev This is a workaround as ERC2771ContextUpgradeable does not have an _init() function
    /// @dev Allows the factory to deploy a BeaconProxy that initiates a Consent contract without a constructor 
    function isTrustedForwarder(address forwarder) public view virtual returns (bool) {
        return forwarder == trustedForwarder;
    }

    function _msgSender() internal view virtual override(ContextUpgradeable) returns (address sender) {
        if (isTrustedForwarder(msg.sender)) {
            // The assembly code is more direct than the Solidity version using `abi.decode`.
            assembly {
                sender := shr(96, calldataload(sub(calldatasize(), 20)))
            }
        } else {
            return super._msgSender();
        }
    }

    function _msgData() internal view virtual override(ContextUpgradeable) returns (bytes calldata) {
        if (isTrustedForwarder(msg.sender)) {
            return msg.data[:msg.data.length - 20];
        } else {
            return super._msgData();
        }
    }

}