// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlEnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/cryptography/ECDSAUpgradeable.sol";
import "./IConsent.sol";
import "./IConsentFactory.sol";

/// @title Consent
/// @author Snickerdoodle Labs
/// @notice Synamint Protocol Consent Registry Contract
/// @dev This contract mints and burns non-transferable ERC721 consent tokens for users who opt in or out of sharing their data
/// @dev The contract's owners or addresses that have the right role granted can initiate a request for data
/// @dev The baseline contract was generated using OpenZeppelin's (OZ) Contracts Wizard and customized thereafter
/// @dev The contract adopts OZ's upgradeable beacon proxy pattern and serves as an implementation contract
/// @dev It is also compatible with OZ's meta-transaction library

contract Consent is
    Initializable,
    PausableUpgradeable,
    AccessControlEnumerableUpgradeable,
    ERC721BurnableUpgradeable,
    IConsent
{
    /// @dev Interface for ConsentFactory
    address consentFactoryAddress;
    IConsentFactory consentFactoryInstance;

    /// @dev an unsorted tag array which this consent contract stakes against
    Tag[] tags;

    /// @dev helpful
    mapping(string => uint256) public tagIndices;

    /// @dev max number of attributes a consent contract can stake against
    uint public maxTags;

    /// @dev Role bytes
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant SIGNER_ROLE = keccak256("SIGNER_ROLE");
    bytes32 public constant REQUESTER_ROLE = keccak256("REQUESTER_ROLE");
    bytes32 public constant STAKER_ROLE = keccak256("STAKER_ROLE");

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

    /// @dev Oldest block that should be scanned for requestForData events
    uint public queryHorizon;

    /// @dev mapping from token id to consent token permissions
    mapping(uint256 => bytes32) public agreementFlagsArray;

    /// @dev the maximum number of consent tokens that can be issued
    uint public maxCapacity;

    /* MODIFIERS */

    /// Checks if open opt in is current disabled
    modifier whenNotDisabled() {
        require(
            !openOptInDisabled,
            "Consent: Open opt-ins are currently disabled"
        );
        _;
    }

    /// @notice Initializes the contract
    /// @dev Uses the initializer modifier to to ensure the contract is only initialized once
    /// @param _trustedForwarder Address of EIP2771-compatible meta-tx forwarding contract
    /// @param _consentOwner Address of the owner of this contract
    /// @param baseURI_ The base uri
    /// @param _name Name of the Consent Contract
    /// @param _contractFactoryAddress address of the originating consent factory
    function initialize(
        address _trustedForwarder,
        address _consentOwner,
        string memory baseURI_,
        string memory _name,
        address _contractFactoryAddress
    ) public initializer {
        __ERC721_init(_name, "CONSENT");
        __Pausable_init();
        __AccessControl_init();
        __ERC721Burnable_init();

        // set the consentFactoryAddress
        consentFactoryAddress = _contractFactoryAddress;
        consentFactoryInstance = IConsentFactory(consentFactoryAddress);
        maxTags = consentFactoryInstance.maxTagsPerListing();

        // set trusted forwarder for meta-txs
        trustedForwarder = _trustedForwarder;

        // set the queryHorizon to be the current block number;
        queryHorizon = block.number;

        // set the initial maximum capacity
        maxCapacity = 50;

        // use user to bypass the call back to the ConsentFactory to update the user's roles array mapping
        super._grantRole(DEFAULT_ADMIN_ROLE, _consentOwner);
        super._grantRole(PAUSER_ROLE, _consentOwner);
        super._grantRole(SIGNER_ROLE, _consentOwner);
        super._grantRole(REQUESTER_ROLE, _consentOwner);
        super._grantRole(STAKER_ROLE, _consentOwner);

        // required role grant to allow calling setBaseUri on initialization
        // as msg.sender is the Consent's BeaconProxy contract
        super._grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        baseURI = baseURI_;
    }

    /* CORE FUNCTIONS */

    /// @notice Get the number of tags staked by this contract
    function getNumberOfStakedTags() external view returns (uint256) {
        return tags.length;
    }

    /// @notice Get the tag array
    function getTagArray() external view returns (Tag[] memory) {
        return tags;
    }

    /// @notice Adds a new tag to the global namespace and stakes it for this consent contract
    /// @dev  _newSlot -> _existingSlot
    /// @param tag Human readable string denoting the target tag to stake
    /// @param _newSlot New linked list entry that will point to _downstream slot
    function newGlobalTag(
        string memory tag,
        uint256 _newSlot
    ) external onlyRole(STAKER_ROLE) {
        // check
        require(
            tags.length < maxTags,
            "Consent Contract: Tag budget exhausted"
        );
        require(
            tagIndices[tag] == 0,
            "Consent Contract: This tag is already staked by this contract"
        );

        // effects
        tags.push(Tag(_newSlot, tag, _msgSender()));
        tagIndices[tag] = tags.length;

        // interaction
        consentFactoryInstance.initializeTag(tag, _newSlot);
    }

    /// @notice Stakes a tag that has already been added to the global namespace but hasn't been used locally yet
    /// @dev  _newSlot -> _existingSlot
    /// @param tag Human readable string denoting the target tag to stake
    /// @param _newSlot New linked list entry that will point to _downstream slot
    /// @param _existingSlot upstream pointer that will point to _newSlot
    function newLocalTagUpstream(
        string memory tag,
        uint256 _newSlot,
        uint256 _existingSlot
    ) external onlyRole(STAKER_ROLE) {
        // check
        require(
            tags.length < maxTags,
            "Consent Contract: Tag budget exhausted"
        );
        require(
            tagIndices[tag] == 0,
            "Consent Contract: This tag is already staked by this contract"
        );

        // effects
        tags.push(Tag(_newSlot, tag, _msgSender()));
        tagIndices[tag] = tags.length;

        // interaction
        consentFactoryInstance.insertUpstream(tag, _newSlot, _existingSlot);
    }

    /// @notice Stakes a tag that has already been added to the global namespace but hasn't been used locally yet
    /// @dev  _existingSlot -> _newSlot
    /// @param tag Human readable string denoting the target tag to stake
    /// @param _existingSlot upstream pointer that will point to _newSlot
    /// @param _newSlot New linked list entry that will point to _downstream slot
    function newLocalTagDownstream(
        string memory tag,
        uint256 _existingSlot,
        uint256 _newSlot
    ) external onlyRole(STAKER_ROLE) {
        // check
        require(
            tags.length < maxTags,
            "Consent Contract: Tag budget exhausted"
        );
        require(
            tagIndices[tag] == 0,
            "Consent Contract: This tag is already staked by this contract"
        );

        // effects
        tags.push(Tag(_newSlot, tag, _msgSender()));
        tagIndices[tag] = tags.length;

        // interaction
        consentFactoryInstance.insertDownstream(tag, _existingSlot, _newSlot);
    }

    /// @notice Replaces an existing listing that has expired (works for head and tail listings)
    /// @param tag Human readable string denoting the target tag to stake
    /// @param _slot The expired slot to replace with a new listing
    function replaceExpiredListing(
        string memory tag,
        uint256 _slot
    ) external onlyRole(STAKER_ROLE) {
        // check
        require(
            tags.length < maxTags,
            "Consent Contract: Tag budget exhausted"
        );
        require(
            tagIndices[tag] == 0,
            "Consent Contract: This tag is already staked by this contract"
        );

        // effects
        tags.push(Tag(_slot, tag, _msgSender()));
        tagIndices[tag] = tags.length;

        // interaction
        consentFactoryInstance.replaceExpiredListing(tag, _slot);
    }

    /// @notice Removes this contract's listing under the specified tag
    /// @param tag Human readable string denoting the target tag to destake
    function removeListing(
        string memory tag
    ) external onlyRole(STAKER_ROLE) returns (string memory) {
        // check
        require(
            tagIndices[tag] > 0,
            "Consent Contract: This tag has not been staked"
        );

        // effects - we use the array element deletion pattern used by OpenZeppelin
        uint256 lastIndex = tags.length - 1;
        uint256 removalIndex = tagIndices[tag] - 1; // remember to decriment the stored value by 1

        Tag memory lastListing = tags[lastIndex];

        uint256 removalSlot = tags[removalIndex].slot;
        tags[removalIndex] = lastListing;
        tagIndices[lastListing.tag] = removalIndex + 1; // add 1 back for storage in tagIndices

        delete tagIndices[tag];
        tags.pop();

        // interaction
        // when removing a listing, if it has expired, the slot may have been usurped by another user
        // we must catch this scenario as it is a valid token mechanic
        try consentFactoryInstance.removeListing(tag, removalSlot) {
            return "Listing removed";
        } catch Error(string memory /*reason*/) {
            // we don't revert because we want to reclaimed the staked tag
            return "Listing was replaced by another contract";
        }
    }

    /// @notice Allows any user to opt in to sharing their data
    /// @dev Mints user a Consent token
    /// @param tokenId User's Consent token id to mint against
    /// @param agreementFlags A bytes32 array of the user's consent token flag indicating their data permissioning settings
    function optIn(
        uint256 tokenId,
        bytes32 agreementFlags
    ) external whenNotPaused whenNotDisabled {
        /// if user has opted in before, revert
        require(
            balanceOf(_msgSender()) == 0,
            "Consent: User has already opted in"
        );

        /// if consent cohort is at capacity, revert
        require(!_atCapacity(), "Consent: cohort is at capacity");

        /// mint the consent token and set its agreement uri
        _safeMint(_msgSender(), tokenId);

        _updateCounterAndTokenFlags(tokenId, agreementFlags);

        /// increase total supply count, this is 20,0000 gas
        totalSupply++;
    }

    /// @notice Allows specific users to opt in to sharing their data
    /// @dev For restricted opt ins, the owner will first sign a digital signature on-chain
    /// @dev The function is called with the signature from SIGNER_ROLE
    /// @dev If the message signature is valid, the user calling this function is minted a Consent token
    /// @param tokenId User's Consent token id to mint against (also serves as a nonce)
    /// @param agreementFlags A bytes32 array of the user's consent token flag indicating their data permissioning settings (this param is not included in the sig hash)
    /// @param signature Signature to be recovered from the hash of the target contract address, target recipient address, and token id to be redeemeed
    function restrictedOptIn(
        uint256 tokenId,
        bytes32 agreementFlags,
        bytes memory signature
    ) external whenNotPaused {
        /// if user has opted in before, revert
        require(
            balanceOf(_msgSender()) == 0,
            "Consent: User has already opted in"
        );

        /// if consent cohort is at capacity, revert
        require(!_atCapacity(), "Consent: cohort is at capacity");

        bytes32 hash = ECDSAUpgradeable.toEthSignedMessageHash(
            keccak256(abi.encodePacked(address(this), _msgSender(), tokenId))
        );

        /// check the signature against the payload
        require(
            _isValidSignature(hash, signature),
            "Consent: Contract owner did not sign this message"
        );

        /// mint the consent token and set its uri
        _safeMint(_msgSender(), tokenId);
        _updateCounterAndTokenFlags(tokenId, agreementFlags);

        /// increase total supply count
        totalSupply++;
    }

    /// @notice Allows Signature Issuer to send anonymous invitation link to end user to opt in
    /// @dev For restricted opt ins, the owner will first sign a digital signature on-chain
    /// @dev The function is called with the a signature from SIGNER_ROLE
    /// @dev If the message signature is valid, the user calling this function is minted a Consent token
    /// @param tokenId User's Consent token id to mint against (also serves as a nonce)
    /// @param agreementFlags A bytes32 array of the user's consent token flag indicating their data permissioning settings (this param is not included in the sig hash)
    /// @param signature Signature to be recovered from the hash of the target contract address and token id to be redeemeed
    function anonymousRestrictedOptIn(
        uint256 tokenId,
        bytes32 agreementFlags,
        bytes memory signature
    ) external whenNotPaused {
        /// if user has opted in before, revert
        require(
            balanceOf(_msgSender()) == 0,
            "Consent: User has already opted in"
        );

        /// if consent cohort is at capacity, revert
        require(!_atCapacity(), "Consent: cohort is at capacity");

        bytes32 hash = ECDSAUpgradeable.toEthSignedMessageHash(
            keccak256(abi.encodePacked(address(this), tokenId))
        );
        /// check the signature against the payload
        /// Any account possessing the signature and payload can call this method
        require(
            _isValidSignature(hash, signature),
            "Consent: Contract owner did not sign this message"
        );

        /// mint the consent token and set its uri
        _safeMint(_msgSender(), tokenId);
        _updateCounterAndTokenFlags(tokenId, agreementFlags);

        /// increase total supply count before interaction
        totalSupply++;
    }

    /// @notice Allows users to opt out of sharing their data
    /// @dev burns the user's consent token
    /// @param tokenId Token id of token being burnt
    function optOut(uint256 tokenId) external {
        /// burn checks if _msgSender() is owner of tokenId
        /// burn also reduces totalSupply
        /// burn also remove user's consent contract to ConsentFactory
        burn(tokenId);
    }

    /// @notice Facilitates entity's request for data
    /// @param ipfsCID IPFS CID containing SDQL Query Instructions
    function requestForData(
        string memory ipfsCID
    ) external onlyRole(REQUESTER_ROLE) {
        /// TODO implement fee structure

        emit RequestForData(_msgSender(), ipfsCID, ipfsCID);
    }

    /// @notice This function allows an EOA with the DEFAULT_ADMIN_ROLE to update the maxCapacity variable
    /// @param _maxCapacity Token id being updated
    function updateMaxCapacity(
        uint _maxCapacity
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        // prevent setting the new maxCapacity below the current value of totalSupply
        require(
            _maxCapacity >= totalSupply,
            "Consent: cannot reduce capacity below current enrollment."
        );

        maxCapacity = _maxCapacity;
    }

    /// price for data request (calculates based on number of tokens minted (opt-ed in))

    /// @notice Allows user to update their agreement flags
    /// @param tokenId Token id being updated
    /// @param newAgreementFlags a bytes32 array of a user's new agreement flag (bits that need to change should be 1, those that should remain the same should be 0)
    function updateAgreementFlags(
        uint256 tokenId,
        bytes32 newAgreementFlags
    ) external {
        /// check if user is msgSender() of token Id
        require(
            _isApprovedOrOwner(_msgSender(), tokenId),
            "Consent: caller is not token owner"
        );

        /// update the data access permissions for the user
        _updateCounterAndTokenFlags(tokenId, newAgreementFlags);
    }

    /* SETTERS */

    function setQueryHorizon(
        uint queryHorizon_
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(
            queryHorizon_ > queryHorizon,
            "New horizon must be strictly later than current horizon."
        );
        queryHorizon = queryHorizon_;
    }

    /// @notice update the trusted forwarder address based on factory settings
    function updateTrustedForwarder() external onlyRole(DEFAULT_ADMIN_ROLE) {
        trustedForwarder = consentFactoryInstance.trustedForwarder();
    }

    /// @notice Admin endpoint to change the maximum number of tags a consent contract can stake against
    function updateMaxTagsLimit() external onlyRole(DEFAULT_ADMIN_ROLE) {
        maxTags = consentFactoryInstance.maxTagsPerListing();
    }

    /// @notice Sets the Consent tokens base URI
    /// @param newURI New base uri
    function setBaseURI(
        string memory newURI
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        baseURI = newURI;
    }

    /// @notice Add a domain to the domains array
    /// @param domain Domain to add
    function addDomain(
        string memory domain
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        string[] memory domainsArr = domains;

        // check if domain already exists in the array
        for (uint256 i; i < domains.length; ) {
            if (
                keccak256(abi.encodePacked((domainsArr[i]))) ==
                keccak256(abi.encodePacked((domain)))
            ) {
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
    function removeDomain(
        string memory domain
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        string[] memory domainsArr = domains;

        // A check that is incremented if a requested domain exists
        uint8 flag;

        for (uint256 i; i < domains.length; ) {
            if (
                keccak256(abi.encodePacked((domainsArr[i]))) ==
                keccak256(abi.encodePacked((domain)))
            ) {
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
        require(flag > 0, "Consent : Domain is not in the list");
    }

    /// @notice Allows address with PAUSER_ROLE to pause the contract
    function pause() external onlyRole(PAUSER_ROLE) {
        _pause();
    }

    /// @notice Allows address with PAUSER_ROLE to unpause the contract
    function unpause() external onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    /// @notice Allows address with PAUSER_ROLE to disable open opt ins
    function disableOpenOptIn() external onlyRole(PAUSER_ROLE) {
        openOptInDisabled = true;
    }

    /// @notice Allows address with PAUSER_ROLE to enable open opt ins
    function enableOpenOptIn() external onlyRole(PAUSER_ROLE) {
        openOptInDisabled = false;
    }

    /* GETTER */

    /// @dev Inherited from ERC2771ContextUpgradeable to embed its features directly in this contract
    /// @dev This is a workaround as ERC2771ContextUpgradeable does not have an _init() function
    /// @dev Allows the factory to deploy a BeaconProxy that initiates a Consent contract without a constructor
    function isTrustedForwarder(
        address forwarder
    ) public view virtual returns (bool) {
        return forwarder == trustedForwarder;
    }

    /// @notice Convenient function for asking contract if there is room left in the campaign in one function call
    function _atCapacity() internal view virtual returns (bool atCapacity) {
        return (totalSupply == maxCapacity);
    }

    /// @notice Gets the Consent tokens base URI
    function _baseURI()
        internal
        view
        virtual
        override
        returns (string memory baseURI_)
    {
        return baseURI;
    }

    /// @notice Gets the array of registered domains
    /// @return domainsArr Array of registered domains
    function getDomains() external view returns (string[] memory domainsArr) {
        return domains;
    }

    /* INTERNAL FUNCTIONS */
    /// @notice Updates the token's current counter and agreement flags
    /// @param tokenId Token id being updated
    /// @param flagsToUpdate Bytes32 containing flags to be updated
    function _updateCounterAndTokenFlags(
        uint256 tokenId,
        bytes32 flagsToUpdate
    ) internal {
        /// Get current agreement flags
        bytes32 currentAgreementFlags = agreementFlagsArray[tokenId];

        /// Flip flags that need to be updated
        bytes32 XOR = currentAgreementFlags ^ flagsToUpdate;

        /// Update the user with new agreement flags
        agreementFlagsArray[tokenId] = XOR;

        /// TODO: update counter and then update the cost to call requestForData
    }

    /// @notice Kernighan’s Algorithm to count number of sets bits in an integer
    /// @param tokenId Token id to check bit count for
    function _getBitCountByTokenId(
        uint256 tokenId
    ) public view returns (uint256) {
        uint256 count = 0;
        uint256 num = uint256(agreementFlagsArray[tokenId]);
        while (num > 0) {
            count += num & 1;
            num >>= 1;
        }
        return count;
    }

    /// @notice Verify that a signature is valid
    /// @param hash Hashed message containing user address (if restricted opt in), token id and agreementFlags
    /// @param signature Signature of approved user's message hash
    /// @return Boolean of whether signature is valid
    function _isValidSignature(
        bytes32 hash,
        bytes memory signature
    ) internal view returns (bool) {
        // retrieve the signature's signer
        address signer = ECDSAUpgradeable.recover(hash, signature);

        require(signer != address(0), "Consent: Signer cannot be 0 address.");

        // check if the recovered signature has the SIGNER_ROLE
        return hasRole(SIGNER_ROLE, signer);
    }

    /* OVERRIDES */

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override whenNotPaused {
        require(
            from == address(0) || to == address(0),
            "Consent: Consent tokens are non-transferrable"
        );
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    /// @dev Overload {_grantRole} to add ConsentFactory update
    function _grantRole(
        bytes32 role,
        address account
    ) internal virtual override(AccessControlEnumerableUpgradeable) {
        super._grantRole(role, account);

        /// update mapping in factory
        consentFactoryInstance.addUserRole(account, role);
    }

    /// @dev Overload {_revokeRole} to add ConsentFactory update
    function _revokeRole(
        bytes32 role,
        address account
    ) internal virtual override(AccessControlEnumerableUpgradeable) {
        super._revokeRole(role, account);

        /// update mapping in factory
        consentFactoryInstance.removeUserRole(account, role);
    }

    // The following functions are overrides required by Solidity.

    function _burn(uint256 tokenId) internal override(ERC721Upgradeable) {
        /// decrease total supply count
        totalSupply--;

        _updateCounterAndTokenFlags(tokenId, agreementFlagsArray[tokenId]);

        super._burn(tokenId);
    }

    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721Upgradeable) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(
        bytes4 interfaceId
    )
        public
        view
        override(ERC721Upgradeable, AccessControlEnumerableUpgradeable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function _msgSender()
        internal
        view
        virtual
        override(ContextUpgradeable)
        returns (address sender)
    {
        if (isTrustedForwarder(msg.sender)) {
            // The assembly code is more direct than the Solidity version using `abi.decode`.
            assembly {
                sender := shr(96, calldataload(sub(calldatasize(), 20)))
            }
        } else {
            return super._msgSender();
        }
    }

    function _msgData()
        internal
        view
        virtual
        override(ContextUpgradeable)
        returns (bytes calldata)
    {
        if (isTrustedForwarder(msg.sender)) {
            return msg.data[:msg.data.length - 20];
        } else {
            return super._msgData();
        }
    }
}