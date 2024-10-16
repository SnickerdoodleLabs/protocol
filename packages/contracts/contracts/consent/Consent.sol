// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "hardhat/console.sol";

import {IConsent} from "./IConsent.sol";
import {ContentObjectUpgradeable} from "../recomender/ContentObjectUpgradeable.sol";
import {ERC7529Upgradeable} from "../erc7529/ERC7529Upgradeable.sol";
import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import {MessageHashUtils} from "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {PausableUpgradeable} from "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";
import {AccessControlUpgradeable} from "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract Consent is
    IConsent,
    Initializable,
    ContentObjectUpgradeable,
    ERC7529Upgradeable,
    AccessControlUpgradeable,
    PausableUpgradeable
{
    using SafeERC20 for IERC20;
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

    /// @dev map from a identity commitment to an index in commitmentArray indicating if the commitment as been registered
    mapping(bytes32 => uint256) commitments;

    /// @dev array used for fetch an anonymity set from existing commitments
    bytes32[] private commitmentArray;

    /// @dev used for private audiences to prevent replay attack
    mapping(uint256 => bool) private nonces;

    /// @dev used to keep track of address which have deposited staking token
    /// @dev outer mapping maps from a token asset to an inner mapping
    /// @dev inner mapping maps from a depositor to an amount
    mapping(address => mapping(address => uint256)) deposits;

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
        address _contractFactoryAddress
    ) public initializer {
        __Pausable_init();
        __AccessControl_init();
        __ContentObject_init(_contractFactoryAddress, address(this));

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

    /* Function Implementations */

    /// @notice Get the current total number of identity commitments
    function totalSupply() external view returns (uint256) {
        return commitmentArray.length;
    }

    /// @notice Returns the index for each identity commitment in the input array
    /// @dev If a commitment doesn't exist, its index will be 0
    /// @param commitsToCheck an array of 32 byte identity commitments
    function checkCommitments(
        bytes32[] calldata commitsToCheck
    ) external view returns (uint256[] memory) {
        uint256 arraySize = commitsToCheck.length;
        uint256[] memory commitmentIndexes = new uint256[](arraySize);
        for (uint i = 0; i < arraySize; i++) {
            commitmentIndexes[i] = commitments[commitsToCheck[i]];
        }
        return commitmentIndexes;
    }

    /// @notice Used to check if some nonces have been used before
    /// @dev returns an array of bools
    /// @param noncesToCheck an array of uint256 ints
    function checkNonces(
        uint256[] calldata noncesToCheck
    ) external view returns (bool[] memory) {
        uint256 arraySize = noncesToCheck.length;
        bool[] memory noncesUsed = new bool[](arraySize);
        for (uint i = 0; i < arraySize; i++) {
            noncesUsed[i] = nonces[noncesToCheck[i]];
        }
        return noncesUsed;
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
    /// @param commitment A bytes32 identity commitment computed with Poseidon hash function
    function optIn(bytes32 commitment) external whenNotPaused whenNotDisabled {
        // don't allow commitments to be committed twice
        require(commitments[commitment] == 0, "Commitment exists already");

        // add to commitment array for fetching anonymity set
        commitmentArray.push(commitment);

        // save the index of the commitment, indexing must start at 1
        commitments[commitment] = commitmentArray.length;

        emit Commitment(commitmentArray.length, commitment);
    }

    /// @notice Allows multiple identity commitments to be written at once
    /// @dev Registers a batch of identity commitments for multiple users
    /// @param commitmentBatch A bytes32 array of identity commitments computed with Poseidon hash function
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

            emit Commitment(commitmentArray.length, commitment);
        }
    }

    /// @notice Allows Signature Issuer to send anonymous invitation link to end user to opt in
    /// @dev For restricted opt ins, the owner must first sign a nonce to prevent replays
    /// @dev The function is called with the signature from SIGNER_ROLE
    /// @dev If the message signature is valid, the user calling this may create an identity commitment
    /// @param nonce A one-time use integer to commit without replay
    /// @param commitment A bytes32 identity commitment computed with Poseidon hash function
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

        emit Commitment(commitmentArray.length, commitment);
    }

    /// @notice Facilitates entity's request for data
    /// @param ipfsCID IPFS CID containing SDQL Query Instructions
    function requestForData(
        string calldata ipfsCID
    ) external onlyRole(REQUESTER_ROLE) {
        emit RequestForData(msg.sender, ipfsCID, ipfsCID);
    }

    /// @notice this function is called by an account with the STAKER_ROLE privilege to deposit tokens for use in global rankings
    /// @dev a depositor can deposit multiple times
    /// @param depositToken the address of the token to deposit into the contract
    /// @param amount the amount of depositToken to send to this contract
    function depositStake(
        address depositToken,
        uint256 amount
    ) external onlyRole(STAKER_ROLE) {
        // update deposits data structure
        deposits[depositToken][msg.sender] += amount;

        // pull the deposit from the depositor
        IERC20(depositToken).safeTransferFrom(
            msg.sender,
            address(this),
            amount
        );
        emit Deposit(msg.sender, depositToken, amount);
    }

    /// @notice this function allows a depositor to remove there funds from this contract
    /// @dev there is no authentication on this function so that if a depositor no longer has the STAKER_ROLE, then can still recall their funds
    /// @param depositToken the address of the token the depositor is reclaiming
    /// @param amount the amount of depositToken that is being reclaimed
    function removeStake(address depositToken, uint256 amount) external {
        require(
            amount <= deposits[depositToken][msg.sender],
            "Consent Contract: amount larger than outstanding depositor balance"
        );

        // update the depositor's balance
        deposits[depositToken][msg.sender] -= amount;

        // send the amount back to the depositor
        IERC20(depositToken).safeTransfer(
            msg.sender,
            amount
        );
        emit Withdraw(msg.sender, depositToken, amount);
    }

    /// @notice Adds a new tag to the global namespace and stakes it for this consent contract
    /// @dev  2^256-1 <-> _newSlot <-> 0
    /// @dev Caller must approve a sufficient amount of staking token before calling
    /// @param tag Human readable string denoting the target tag to stake
    /// @param stakingToken Address of the token used for staking recommender listings
    /// @param stake the amount of token needed to pay for _newSlot, use computeFee from factory
    /// @param _newSlot New linked list entry that prime the linked list for this tag
    function newGlobalTag(
        string calldata tag,
        address stakingToken,
        uint256 stake,
        uint256 _newSlot
    ) external onlyRole(STAKER_ROLE) {
        _newGlobalTag(tag, stakingToken, stake, _newSlot);
    }

    /// @notice Stakes a tag that has already been added to the global namespace but hasn't been used locally yet
    /// @dev  _newSlot <-> _existingSlot
    /// @dev Caller must approve a sufficient amount of staking token before calling
    /// @param tag Human readable string denoting the target tag to stake
    /// @param stakingToken Address of the token used for staking recommender listings
    /// @param stake the amount of token needed to pay for _newSlot, use computeFee from factory
    /// @param _newSlot New linked list entry that will point to _existingSlot slot
    /// @param _existingSlot slot that will be ranked next lowest to _newSlot
    function newLocalTagUpstream(
        string calldata tag,
        address stakingToken,
        uint256 stake,
        uint256 _newSlot,
        uint256 _existingSlot
    ) external onlyRole(STAKER_ROLE) {
        _newLocalTagUpstream(tag, stakingToken, stake, _newSlot, _existingSlot);
    }

    /// @notice Stakes a tag that has already been added to the global namespace but hasn't been used locally yet
    /// @dev  _existingSlot -> _newSlot
    /// @dev Caller must approve a sufficient amount of staking token before calling
    /// @param tag Human readable string denoting the target tag to stake
    /// @param stakingToken Address of the token used for staking recommender listings
    /// @param stake the amount of token needed to pay for _newSlot, use computeFee from factory
    /// @param _existingSlot upstream pointer that will point to _newSlot
    /// @param _newSlot New linked list entry that will be ranked right below _existingSlot
    function newLocalTagDownstream(
        string calldata tag,
        address stakingToken,
        uint256 stake,
        uint256 _existingSlot,
        uint256 _newSlot
    ) external onlyRole(STAKER_ROLE) {
        _newLocalTagDownstream(
            tag,
            stakingToken,
            stake,
            _existingSlot,
            _newSlot
        );
    }

    /// @notice Move an existing listing from its current slot to upstream of a new existing slot
    /// @dev This function assumes that tag is not the only member in the global list (i.e. getTagTotal(tag) > 1)
    /// @dev This function also assumes that the listing is not expired
    /// @dev Caller must approve a sufficient amount of staking token before calling
    /// @param tag Human readable string denoting the target tag to stake
    /// @param stakingToken Address of the token used for staking recommender listings
    /// @param stake the amount of token needed to pay for _newSlot, use computeFee from factory
    /// @param _newSlot The new slot to move the listing to
    /// @param _existingSlot The neighboring listing to _newSlow
    function moveExistingListingUpstream(
        string calldata tag,
        address stakingToken,
        uint256 stake,
        uint256 _newSlot,
        uint256 _existingSlot
    ) external onlyRole(STAKER_ROLE) {
        _moveExistingListingUpstream(
            tag,
            stakingToken,
            stake,
            _newSlot,
            _existingSlot
        );
    }

    /// @notice Restakes a listing from this registry that has expired (works for head and tail listings)
    /// @param tag Human readable string denoting the target tag to stake
    /// @param stakingToken Address of the token used for staking recommender listings
    function restakeExpiredListing(
        string calldata tag,
        address stakingToken
    ) external onlyRole(STAKER_ROLE) {
        _restakeExpiredListing(tag, stakingToken);
    }

    /// @notice Replaces an existing listing that has expired (works for head and tail listings)
    /// @param tag Human readable string denoting the target tag to stake
    /// @param stakingToken Address of the token used for staking recommender listings
    /// @param stake the amount of token needed to pay for _newSlot, use computeFee from factory
    /// @param _slot The expired slot to replace with a new listing
    function replaceExpiredListing(
        string calldata tag,
        address stakingToken,
        uint256 stake,
        uint256 _slot
    ) external onlyRole(STAKER_ROLE) {
        _replaceExpiredListing(tag, stakingToken, stake, _slot);
    }

    /// @notice Removes this contract's listing under the specified tag
    /// @dev either an address with STAKER_ROLE or a stake owner can call this function
    /// @param tag Human readable string denoting the target tag to unstake
    /// @param stakingToken Address of the token used for staking recommender listings
    function removeListing(
        string calldata tag,
        address stakingToken
    ) external onlyRole(STAKER_ROLE) returns (string memory) {
        return _removeListing(tag, stakingToken);
    }

    /// @notice Add a domain to the domains array
    /// @param domain Domain to add
    function addDomain(
        string calldata domain
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _addDomain(domain);
    }

    /// @notice Removes a domain from the domains array
    /// @param domain Domain to remove
    function removeDomain(
        string calldata domain
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
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
