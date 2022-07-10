// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlEnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/metatx/MinimalForwarderUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/cryptography/ECDSAUpgradeable.sol";

/// @title Consent 
/// @author Sean Sing
/// @notice Snickerdoodle Protocol's Consent Contract 
/// @dev This contract mints and burns non-transferable ERC721 consent tokens for users who opt in or out of sharing their data
/// @dev The contract's owners or addresses that have the right role granted can initiate a request for data
/// @dev The baseline contract was generated using OpenZeppelin's (OZ) Contracts Wizard and customized thereafter 
/// @dev ERC2771ContextUpgradeable's features were directly embedded into the contract (see isTrustedForwarder for details)
/// @dev The contract adopts OZ's upgradeable beacon proxy pattern and serves as an implementation contract
/// @dev It is also compatible with OZ's meta-transaction library

contract Consent is Initializable, ERC721URIStorageUpgradeable, PausableUpgradeable, AccessControlEnumerableUpgradeable, ERC721BurnableUpgradeable {

    /// @dev Interface for ConsentFactory
    address consentFactoryAddress;
    IConsentFactory consentFactoryInstance;

    /// @dev Role bytes
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant SIGNER_ROLE = keccak256("SIGNER_ROLE");
    bytes32 public constant REQUESTER_ROLE = keccak256("REQUESTER_ROLE");
    
    /// @dev Base uri for logo of Consent tokens
    string public baseURI;

    /// @dev Total supply of Consent tokens
    uint256 public totalSupply;
    
    /// @dev Flag of whether open opt in is disabled or not
    bool public openOptInDisabled;

    /// @dev Trusted forwarder address for meta-transactions 
    address public trustedForwarder;

    /// @dev Array of trusted domains
    string[] domains;

    /* EVENTS */ 

    /// @notice Emitted when a request for data is made
    /// @dev The SDQL services listens for this event
    /// @param requester Indexed address of data requester
    /// @param ipfsCIDIndexed The indexed IPFS CID pointing to an SDQL instruction 
    /// @param ipfsCID The IPFS CID pointing to an SDQL instruction 
    event RequestForData(address indexed requester, string indexed ipfsCIDIndexed, string ipfsCID);

    /// @notice Emitted when a domain is added
    /// @param domain Domain url added
    event LogAddDomain(string domain);

    /// @notice Emitted when a domain is removed
    /// @param domain Domain url removed
    event LogRemoveDomain(string domain);

    /* MODIFIERS */

    /// Checks if open opt in is current disabled 
    modifier whenNotDisabled() {
        require(!openOptInDisabled, "Consent: Open opt-ins are currently disabled");
        _;
    }

    /// @notice Initializes the contract
    /// @dev Uses the initializer modifier to to ensure the contract is only initialized once
    /// @param consentOwner Address of the owner of this contract
    /// @param baseURI_ The base uri 
    /// @param name Name of the Consent Contract  
    function initialize(address consentOwner, string memory baseURI_, string memory name, address _contractFactoryAddress) initializer public {
        
        __ERC721_init(name, "CONSENT");
        __ERC721URIStorage_init();
        __Pausable_init();
        __AccessControl_init();
        __ERC721Burnable_init();

        // set the consentFactoryAddress
        consentFactoryAddress = _contractFactoryAddress;
        consentFactoryInstance = IConsentFactory(consentFactoryAddress);

        // use user to bypass the call back to the ConsentFactory to update the user's roles array mapping 
        super._grantRole(DEFAULT_ADMIN_ROLE, consentOwner);
        super._grantRole(PAUSER_ROLE, consentOwner);
        super._grantRole(SIGNER_ROLE, consentOwner);
        super._grantRole(REQUESTER_ROLE, consentOwner);

        // required role grant to allow calling setBaseUri on initialization
        // as msg.sender is the Consent's BeaconProxy contract
        super._grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        setBaseURI(baseURI_);
    }

    /* CORE FUNCTIONS */

    /// @notice Allows any user to opt in to sharing their data
    /// @dev Mints user a Consent token
    /// @param tokenId User's Consent token id to mint against
    /// @param agreementURI User's Consent token uri containing agreement flags
    function optIn(uint256 tokenId, string memory agreementURI)
        external
        whenNotPaused
        whenNotDisabled
    {   
        /// if user has opted in before, revert
        require(balanceOf(msg.sender) == 0, "Consent: User has already opted in");

        /// mint the consent token and set its agreement uri
        _safeMint(_msgSender(), tokenId);
        _setTokenURI(tokenId, agreementURI);

        /// add user's consent contract to ConsentFactory
        consentFactoryInstance.addUserConsents(_msgSender());
        
        /// increase total supply count
        totalSupply++;
    }

    /// @notice Allows specific users to opt in to sharing their data
    /// @dev For restricted opt ins, the owner will first sign a digital signature on-chain
    /// @dev The function is called with the signed signature
    /// @dev If the message signature is valid, the user calling this function is minted a Consent token
    /// @param tokenId User's Consent token id to mint against
    /// @param agreementURI User's Consent token uri containing agreement flags
    /// @param signature Owner's signature to agree with user opt in
    function restrictedOptIn (
        uint256 tokenId, 
        string memory agreementURI,
        bytes memory signature
        )
        external
        whenNotPaused
    {
        /// if user has opted in before, revert
        require(balanceOf(msg.sender) == 0, "Consent: User has already opted in");
        
        /// check the signature against the payload
        require(
            _isValidSignature(_msgSender(), tokenId, agreementURI, signature),
            "Consent: Contract owner did not sign this message"
        );

        /// mint the consent token and set its uri
        _safeMint(_msgSender(), tokenId);
        _setTokenURI(tokenId, agreementURI);

        /// add user's consent contract to ConsentFactory
        consentFactoryInstance.addUserConsents(_msgSender());

        /// increase total supply count
        totalSupply++;
    }

    /// @notice Allows users to opt out of sharing their data
    /// @dev burns the user's consent token
    /// @param tokenId Token id of token being burnt
    function optOut(uint256 tokenId) external {
        /// burn checks if msg.sender is owner of tokenId
        /// burn also reduces totalSupply
        /// burn also remove user's consent contract to ConsentFactory
        burn(tokenId);
    }

    /// @notice Facilitates entity's request for data
    /// @param ipfsCID IPFS CID containing SDQL Query Instructions
    function requestForData(string memory ipfsCID) external onlyRole(REQUESTER_ROLE) {
        /// TODO implement fee structure 

        emit RequestForData(_msgSender(), ipfsCID, ipfsCID);
    }
    /// price for data request (calculates based on number of tokens minted (opt-ed in))

    /* SETTERS */

    /// @notice Set the trusted forwarder address 
    /// @param trustedForwarder_ Address of the trusted forwarder 
    function setTrustedForwarder(address trustedForwarder_) external onlyRole(DEFAULT_ADMIN_ROLE) {
        trustedForwarder = trustedForwarder_;
    }

    /// @notice Sets the Consent tokens base URI
    /// @param newURI New base uri
    function setBaseURI(string memory newURI) public onlyRole(DEFAULT_ADMIN_ROLE) {
        baseURI = newURI;
    }

    /// @notice Add a domain to the domains array 
    /// @param domain Domain to add
    function addDomain(string memory domain) external onlyRole(DEFAULT_ADMIN_ROLE) {     

        string[] memory domainsArr = domains;

        // check if domain already exists in the array
        for(uint256 i; i < domains.length;) {
            if(keccak256(abi.encodePacked((domainsArr[i]))) == keccak256(abi.encodePacked((domain)))) {
                revert("Consent : Domain already added");
            }
            unchecked {
                ++i;
            }
        }

        domains.push(domain);

        emit LogAddDomain(domain);
    }

    /// @notice Removes a domain from the domains array 
    /// @param domain Domain to remove
    function removeDomain(string memory domain) external onlyRole(DEFAULT_ADMIN_ROLE) {     
        
        string[] memory domainsArr = domains;
        
        // A check that is incremented if a requested domain exists
        uint8 flag; 

        for(uint256 i; i < domains.length;) {
            if(keccak256(abi.encodePacked((domainsArr[i]))) == keccak256(abi.encodePacked((domain)))) {
                // replace the index to delete with the last element
                domains[i] = domains[domains.length - 1];
                // delete the last element of the array
                domains.pop();
                // update to flag to indicate a match was found
                flag++;

                emit LogRemoveDomain(domain);

                break;
            }
            unchecked {
                ++i;
            }
        }
        require (flag > 0, "Consent : Domain is not in the list");
    }

    /// @notice Allows address with PAUSER_ROLE to pause the contract
    function pause() public onlyRole(PAUSER_ROLE) {
        _pause();
    }

    /// @notice Allows address with PAUSER_ROLE to unpause the contract
    function unpause() public onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    /// @notice Allows address with PAUSER_ROLE to disable open opt ins
    function disableOpenOptIn() public onlyRole(PAUSER_ROLE) {
        openOptInDisabled = true;
    }

    /// @notice Allows address with PAUSER_ROLE to enable open opt ins
    function enableOpenOptIn() public onlyRole(PAUSER_ROLE) {
        openOptInDisabled = false;
    }

    /* GETTER */ 

    /// @dev Inherited from ERC2771ContextUpgradeable to embed its features directly in this contract 
    /// @dev This is a workaround as ERC2771ContextUpgradeable does not have an _init() function
    /// @dev Allows the factory to deploy a BeaconProxy that initiates a Consent contract without a constructor 
    function isTrustedForwarder(address forwarder) public pure virtual returns (bool) {
        /// TODO: an arbitrary address is provided for now, to be replaced when Consent implementation contract deployed to live  
        address tf = 0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199; 
        return forwarder == tf;
    }

    /// @notice Gets the Consent tokens base URI
    function _baseURI() internal view virtual override returns (string memory baseURI_)  {
        return baseURI;
    }

    /// @notice Gets the array of registered domains
    /// @return domainsArr Array of registered domains
    function getDomains() external view returns (string[] memory domainsArr)  {     
        return domains;
    }

    /* INTERNAL FUNCTIONS */ 

    /// @notice Verify that a signature is valid
    /// @param user Address of the user calling the function
    /// @param tokenId Token id to be tied to current user
    /// @param agreementURI User's Consent token uri containing agreement flags
    /// @param signature Signature of approved user's message hash 
    /// @return Boolean of whether signature is valid
    function _isValidSignature(
        address user,
        uint256 tokenId,
        string memory agreementURI,
        bytes memory signature
    ) internal view returns (bool) {

        // convert the payload to a 32 byte hash
        bytes32 hash = ECDSAUpgradeable.toEthSignedMessageHash(keccak256(abi.encodePacked(user, tokenId, agreementURI)));
        
        // retrieve the signature's signer 
        address signer = ECDSAUpgradeable.recover(hash, signature);

        require(signer != address(0), "Consent: Signer cannot be 0 address.");

        // check if the recovered signature has the SIGNER_ROLE
        return hasRole(SIGNER_ROLE, signer);
    }

    /* OVERRIDES */

    /// @dev Override to add require statement to make tokens Consent token non-transferrable
    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
        internal
        whenNotPaused
        override
    {
        require(from == address(0) || to == address(0), "Consent: Consent tokens are non-transferrable");
        super._beforeTokenTransfer(from, to, tokenId);
    }

    /// @dev Overload {_grantRole} to add ConsentFactory update
    function _grantRole(bytes32 role, address account) internal virtual override {
        super._grantRole(role, account);

        /// update mapping in factory
        consentFactoryInstance.addUserRole(account, role);
    }

    /// @dev Overload {_revokeRole} to add ConsentFactory update 
    function _revokeRole(bytes32 role, address account) internal virtual override {
        super._revokeRole(role, account);

        /// update mapping in factory
        consentFactoryInstance.removeUserRole(account, role);
    }

    // The following functions are overrides required by Solidity.

    function _burn(uint256 tokenId)
        internal
        override(ERC721Upgradeable, ERC721URIStorageUpgradeable)
    {   
        /// decrease total supply count
        totalSupply--;

        /// remove user's consent contract to ConsentFactory
        consentFactoryInstance.removeUserConsents(_msgSender());

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

/// @dev a minimal interface for Consent contracts to update the ConsentFactory

interface IConsentFactory {

    function addUserConsents(address user) external;
    function removeUserConsents(address user) external;
    function addUserRole(address user, bytes32 role) external;
    function removeUserRole(address user, bytes32 role) external; 
    
}