// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

//import "hardhat/console.sol";

import {IConsent} from "./IConsent.sol";
import {ContentObjectUpgradeable} from "../recomender/ContentObjectUpgradeable.sol";
import {ERC7529Upgradeable} from "../erc7529/ERC7529Upgradeable.sol";
import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import {MessageHashUtils} from "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {PausableUpgradeable} from "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";
import {AccessControlUpgradeable} from "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";

contract Consent is
    IConsent,
    Initializable,
    ContentObjectUpgradeable,
    ERC7529Upgradeable,
    AccessControlUpgradeable,
    PausableUpgradeable
{
    /* Roles */

    /// @dev Role bytes
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant SIGNER_ROLE = keccak256("SIGNER_ROLE");
    bytes32 public constant REQUESTER_ROLE = keccak256("REQUESTER_ROLE");
    bytes32 public constant STAKER_ROLE = keccak256("STAKER_ROLE");

    /* Storage Variables */

    /// @dev URI that points to info about this consent contract
    string public baseURI;

    /// @dev Flag of whether open opt in is disabled or not
    bool public openOptInDisabled;

    /// @dev Oldest block that should be scanned for requestForData events
    uint public queryHorizon;

    /// @dev map from a identity commitment to a bool indicating if the commitment as been registered
    mapping(bytes32 => uint256) commitments;

    /// @dev array used for fetch an anonymity set from existing commitments
    bytes32[] private commitmentArray;

    /// @dev used for private audiences to prevent replay attack
    mapping(uint256 => bool) private nonces;

    /* Modifiers */

    /// Checks if open opt in is current disabled
    modifier whenNotDisabled() {
        require(
            !openOptInDisabled,
            "Consent: Open opt-ins are currently disabled"
        );
        _;
    }

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    /// @notice Initializes the contract
    /// @dev Uses the initializer modifier to to ensure the contract is only initialized once
    /// @param _consentOwner Address of the owner of this contract
    /// @param baseURI_ The base uri
    /// @param _contractFactoryAddress address of the originating consent factory
    function initialize(
        address _consentOwner,
        string memory baseURI_,
        address _contractFactoryAddress,
        address _stakingToken
    ) public initializer {
        __Pausable_init();
        __AccessControl_init();
        __ContentObject_init(_contractFactoryAddress, _stakingToken);

        // set the queryHorizon to be the current block number;
        queryHorizon = block.number;

        // set the base uri so the consent contract has content to display in the marketplace
        baseURI = baseURI_;

        // use user to bypass the call back to the ConsentFactory to update the user's roles array mapping
        super._grantRole(DEFAULT_ADMIN_ROLE, _consentOwner);
        super._grantRole(PAUSER_ROLE, _consentOwner);
        super._grantRole(SIGNER_ROLE, _consentOwner);
        super._grantRole(REQUESTER_ROLE, _consentOwner);
        super._grantRole(STAKER_ROLE, _consentOwner);
    }

    /* Function Implemenations */

    /// @notice Get the current total number of identity commitments
    function totalSupply() external view returns (uint256) {
        return commitmentArray.length;
    }

    /// @notice Allows address with PAUSER_ROLE to disable open opt ins
    function disableOpenOptIn() external onlyRole(PAUSER_ROLE) {
        openOptInDisabled = true;
    }

    /// @notice Fetch a set of identity commitments for use as an anonymity set
    /// @param start first index to return from commitments array (inclusive)
    /// @param stop last index to return from commitments array (not inclusive)
    function fetchAnonymitySet(
        uint256 start,
        uint256 stop
    ) external view returns (bytes32[] memory) {
        uint setSize = stop - start;
        bytes32[] memory anonymitySet = new bytes32[](setSize);
        for (uint i = 0; i < setSize; i++)
            anonymitySet[i] = commitmentArray[i + start];
        return anonymitySet;
    }

    /// @notice Allows address with PAUSER_ROLE to enable open opt ins
    function enableOpenOptIn() external onlyRole(PAUSER_ROLE) {
        openOptInDisabled = false;
    }

    /// @notice Allows address with PAUSER_ROLE to pause the contract
    function pause() external onlyRole(PAUSER_ROLE) {
        _pause();
    }

    /// @notice Allows address with PAUSER_ROLE to unpause the contract
    function unpause() external onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    /// @notice Sets the Consent tokens base URI
    /// @param newURI New base uri
    function setBaseURI(
        string calldata newURI
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        baseURI = newURI;
    }

    function setQueryHorizon(
        uint queryHorizon_
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(
            queryHorizon_ > queryHorizon,
            "New horizon must be strictly later than current horizon."
        );
        queryHorizon = queryHorizon_;
    }

    /// @notice Allows any user to opt in to sharing their data
    /// @dev Registers an identity commitment for a user
    /// @param commitment A bytes32 identity commitment computed with Posiedon hash function
    function optIn(bytes32 commitment) external whenNotPaused whenNotDisabled {
        // don't allow commitments to be committed twice
        require(commitments[commitment] == 0, "Commitment exists already");

        // add to commitment array for fetching anonymity set
        commitmentArray.push(commitment);

        // save the index of the commitment, indexing must start at 1
        commitments[commitment] = commitmentArray.length;
    }

    /// @notice Allows multiple identity commitments to be written at once
    /// @dev Registers a batch of identity commitments for multiple users
    /// @param commitmentBatch A bytes32 array of identity commitments computed with Posiedon hash function
    function batchOptIn(
        bytes32[] calldata commitmentBatch
    ) external whenNotPaused whenNotDisabled {
        // don't allow commitments to be committed twice
        uint sizeBatch = commitmentBatch.length;
        for (uint i = 0; i < sizeBatch; i++) {
            bytes32 commitment = commitmentBatch[i];
            require(commitments[commitment] == 0, "Commitment exists already");
            // add to commitment array for fetching anonymity set
            commitmentArray.push(commitment);
            // save the index of the commitment, indexing must start at 1
            commitments[commitment] = commitmentArray.length;
        }
    }

    /// @notice Allows Signature Issuer to send anonymous invitation link to end user to opt in
    /// @dev For restricted opt ins, the owner must first sign a nonce to prevent replays
    /// @dev The function is called with the signature from SIGNER_ROLE
    /// @dev If the message signature is valid, the user calling this may create an identity commitment
    /// @param nonce A one-time use integer to commit without replay
    /// @param commitment A bytes32 identity commitment computed with Posiedon hash function
    /// @param signature Signature to be recovered from the hash of the target contract address and nonce
    function restrictedOptIn(
        uint256 nonce,
        bytes32 commitment,
        bytes calldata signature
    ) external whenNotPaused {
        require(!nonces[nonce], "Consent: nonce already used");

        bytes32 hash = MessageHashUtils.toEthSignedMessageHash(
            keccak256(abi.encodePacked(address(this), nonce))
        );

        /// check the signature against the payload
        require(
            _isValidSignature(hash, signature),
            "Consent: Contract owner did not sign this message"
        );

        // add to commitment array for fetching anonymity set
        commitmentArray.push(commitment);

        // save the index of the commitment, indexing must start at 1
        commitments[commitment] = commitmentArray.length;

        // set tokenId so that it cannot be used again
        nonces[nonce] = true;
    }

    /// @notice Facilitates entity's request for data
    /// @param ipfsCID IPFS CID containing SDQL Query Instructions
    function requestForData(
        string calldata ipfsCID
    ) external onlyRole(REQUESTER_ROLE) {
        emit RequestForData(_msgSender(), ipfsCID, ipfsCID);
    }

    /// @notice Adds a new tag to the global namespace and stakes it for this consent contract
    /// @dev  2^256-1 <-> _newSlot <-> 0
    /// @dev Caller must approve a sufficient amount of staking token before calling
    /// @param tag Human readable string denoting the target tag to stake
    /// @param _newSlot New linked list entry that prime the linked list for this tag
    function newGlobalTag(
        string calldata tag,
        uint256 _newSlot
    ) external onlyRole(STAKER_ROLE) {
        _newGlobalTag(tag, _newSlot);
    }

    /// @notice Stakes a tag that has already been added to the global namespace but hasn't been used locally yet
    /// @dev  _newSlot <-> _existingSlot
    /// @dev Caller must approve a sufficient amount of staking token before calling
    /// @param tag Human readable string denoting the target tag to stake
    /// @param _newSlot New linked list entry that will point to _existingSlot slot
    /// @param _existingSlot slot that will be ranked next lowest to _newSlot
    function newLocalTagUpstream(
        string calldata tag,
        uint256 _newSlot,
        uint256 _existingSlot
    ) external onlyRole(STAKER_ROLE) {
        _newLocalTagUpstream(tag, _newSlot, _existingSlot);
    }

    /// @notice Stakes a tag that has already been added to the global namespace but hasn't been used locally yet
    /// @dev  _existingSlot -> _newSlot
    /// @dev Caller must approve a sufficient amount of staking token before calling
    /// @param tag Human readable string denoting the target tag to stake
    /// @param _existingSlot upstream pointer that will point to _newSlot
    /// @param _newSlot New linked list entry that will be ranked right below _existingSlot
    function newLocalTagDownstream(
        string calldata tag,
        uint256 _existingSlot,
        uint256 _newSlot
    ) external onlyRole(STAKER_ROLE) {
        _newLocalTagDownstream(tag, _existingSlot, _newSlot);
    }

    /// @notice Move an existing listing from its current slot to upstream of a new existing slot
    /// @dev This function assumes that tag is not the only member in the global list (i.e. getTagTotal(tag) > 1)
    /// @dev This function also assumes that the listing is not expired
    /// @dev Caller must approve a sufficient amount of staking token before calling
    /// @param tag Human readable string denoting the target tag to stake
    /// @param _newSlot The new slot to move the listing to
    /// @param _existingSlot The neighboring listing to _newSlow
    function moveExistingListingUpstream(
        string calldata tag,
        uint256 _newSlot,
        uint256 _existingSlot
    ) external onlyRole(STAKER_ROLE) {
        _moveExistingListingUpstream(tag, _newSlot, _existingSlot);
    }

    /// @notice Restakes a listing from this registry that has expired (works for head and tail listings)
    /// @param tag Human readable string denoting the target tag to stake
    function restakeExpiredListing(
        string calldata tag
    ) external onlyRole(STAKER_ROLE) {
        _restakeExpiredListing(tag);
    }

    /// @notice Replaces an existing listing that has expired (works for head and tail listings)
    /// @param tag Human readable string denoting the target tag to stake
    /// @param _slot The expired slot to replace with a new listing
    function replaceExpiredListing(
        string calldata tag,
        uint256 _slot
    ) external onlyRole(STAKER_ROLE) {
        _replaceExpiredListing(tag, _slot);
    }

    /// @notice Removes this contract's listing under the specified tag
    /// @param tag Human readable string denoting the target tag to destake
    function removeListing(
        string calldata tag
    ) external onlyRole(STAKER_ROLE) returns (string memory) {
        return _removeListing(tag);
    }

    /// @notice Add a domain to the domains array
    /// @param domain Domain to add
    function addDomain(string calldata domain) external onlyRole(STAKER_ROLE) {
        _addDomain(domain);
    }

    /// @notice Removes a domain from the domains array
    /// @param domain Domain to remove
    function removeDomain(
        string calldata domain
    ) external onlyRole(STAKER_ROLE) {
        _removeDomain(domain);
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
        address signer = ECDSA.recover(hash, signature);

        require(signer != address(0), "Consent: Signer cannot be 0 address.");

        // check if the recovered signature has the SIGNER_ROLE
        return hasRole(SIGNER_ROLE, signer);
    }
}
