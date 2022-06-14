// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlEnumerableUpgradeable.sol";

/// @title Crumbs 
/// @author Sean Sing
/// @notice Snickerdoodle Protocol's Crumbs Contract
/// @dev A crumb is an ERC721 NFT that holds the masks of a user's private key as part of their token uri
/// @dev Any user can create and the store masks for their private keys 
/// @dev THe ERC721's tokenId is labelled crumbId in this contract
/// @dev The baseline contract was generated using OpenZepplin's (OZ) Contracts Wizard and customized thereafter 
/// @dev ERC2771ContextUpgradeable's features were directly embeded into the contract (see isTrustedForwarder for details)
/// @dev The contract adopts OZ's upgradeable beacon proxy pattern and serves as an implementation contract
/// @dev It is also compatible with OZ's meta-transaction library

contract Crumbs is Initializable, ERC721Upgradeable, ERC721URIStorageUpgradeable, AccessControlEnumerableUpgradeable, ERC721BurnableUpgradeable, OwnableUpgradeable {

    /// @notice Mapping of address to respective tokenId that stores its mask
    mapping(address => uint256) addressToCrumbId;

    /// @dev Total supply of Crumb tokens
    uint256 public totalSupply;

    /// @dev Base uri of crumbs
    string public baseURI;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(string memory baseURI_) initializer public {
        __ERC721_init("Crumbs", "CRU");
        __ERC721URIStorage_init();
        __ERC721Burnable_init();
        __Ownable_init();

        setBaseURI(baseURI_);
    }

    /// @notice Mints user a crumb 
    function createCrumb(address owner, uint256 crumbId, string memory mask) public onlyOwner {
        require(addressToCrumbId[owner] == 0, "Crumb: Address already has a crumb");

        _safeMint(owner, crumbId);
        _setTokenURI(crumbId, mask);

        // increase total supply
        totalSupply++;
    }

    function burnCrumb(uint256 crumbId) public {
        burn(crumbId);
        // remove the crum id from the mapping
        delete addressToCrumbId[_msgSender()];
        // reduce total supply
        totalSupply--;
    }

    /* GETTERS */

    /// @notice Gets the Consent tokens base URI
    function _baseURI() internal view virtual override returns (string memory baseURI_)  {
        return baseURI;
    }

    /// @dev Inherited from ERC2771ContextUpgradeable to embed its features directly in this contract 
    /// @dev This is a workaround as ERC2771ContextUpgradeable does not have an _init() function
    /// @dev Allows the factory to deploy a BeaconProxy that initiates a Consent contract without a constructor 
    function isTrustedForwarder(address forwarder) public pure virtual returns (bool) {
        /// TODO: an arbitrary address is provided for now, to be replaced when Consent implementation contract deployed to live  
        address tf = 0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199; 
        return forwarder == tf;
    }

     /* SETTERS */

    /// @notice Sets the Consent tokens base URI
    /// @param newURI New base uri
    function setBaseURI(string memory newURI) public onlyRole(DEFAULT_ADMIN_ROLE) {
        baseURI = newURI;
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