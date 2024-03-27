// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IContentObject} from "../recomender/IContentObject.sol";
import {IERC7529} from "../erc7529/IERC7529.sol";

interface IConsent is IContentObject, IERC7529 {

    /* EVENTS */

    /// @notice Emitted when a request for data is made
    /// @dev The SDQL services listens for this event
    /// @param requester Indexed address of data requester
    /// @param ipfsCIDIndexed The indexed IPFS CID pointing to an SDQL instruction
    /// @param ipfsCID The IPFS CID pointing to an SDQL instruction
    event RequestForData(
        address indexed requester,
        string indexed ipfsCIDIndexed,
        string ipfsCID
    );

    /// @notice Emitted when an identity commitment is created via optIn or restrictedOptIn
    /// @param index The index of the idenity commitment in the set
    /// @param commitment The Posiedon hash of the idenity commitment
    event Commitment(uint indexed index, bytes32 indexed commitment);

    /// @notice Emitted when a deposit of staking token is made to this contract
    /// @param depositor the address which has deposited staking token
    /// @param asset the address of the asset staked
    /// @param amount the amount of the asset deposited
    event Deposit(address indexed depositor, address indexed asset, uint256 amount);

    /// @notice Emitted when a depositor withdraws their asset from this contract
    /// @param depositor the address which is withdrawing their asset
    /// @param asset the addres of the asset being withdrawn
    /// @param amount the amount of the asset withdrawn
    event Withdraw(address indexed depositor, address indexed asset, uint256 amount);

    /* External Functions */

    function baseURI() external view returns (string memory);

    function totalSupply() external view returns (uint256);

    function checkCommitments(
        bytes32[] calldata commitmentArray
    ) external view returns (uint256[] memory);

    function checkNonces(
        uint256[] calldata nonce
    ) external view returns (bool[] memory);

    function openOptInDisabled() external view returns (bool);

    function queryHorizon() external view returns (uint);

    function fetchAnonymitySet(
        uint256 start,
        uint256 stop
    ) external view returns (bytes32[] memory);

    function disableOpenOptIn() external;

    function enableOpenOptIn() external;

    function pause() external;

    function unpause() external;

    function setBaseURI(string calldata newURI) external;

    function setQueryHorizon(uint queryHorizon_) external;

    function optIn(bytes32 commitment) external;

    function batchOptIn(bytes32[] calldata commitmentBatch) external;

    function restrictedOptIn(
        uint256 tokenId,
        bytes32 commitment,
        bytes calldata signature
    ) external;

    function requestForData(string calldata ipfsCID) external;

    // stake depositor functions
    function depositStake(address depositToken, uint256 amount) external; 

    function removeStake(address depositToken, uint256 amount) external; 

    // ranking functions
    function newGlobalTag(
        string calldata tag,
        address stakingToken,
        uint256 stake,
        uint256 _newSlot
    ) external;

    function newLocalTagUpstream(
        string calldata tag,
        address stakingToken,
        uint256 stake,
        uint256 _newSlot,
        uint256 _existingSlot
    ) external;

    function newLocalTagDownstream(
        string calldata tag,
        address stakingToken,
        uint256 stake,
        uint256 _existingSlot,
        uint256 _newSlot
    ) external;

    function moveExistingListingUpstream(
        string calldata tag,
        address stakingToken,
        uint256 stake,
        uint256 _newSlot,
        uint256 _existingSlot
    ) external;

    function restakeExpiredListing(
        string calldata tag,
        address stakingToken
    ) external;

    function replaceExpiredListing(
        string calldata tag,
        address stakingToken,
        uint256 stake,
        uint256 _slot
    ) external;

    function removeListing(
        string calldata tag,
        address stakingToken
    ) external returns (string memory);

    // erc7529 functions
    function addDomain(string memory domain) external;

    function removeDomain(string memory domain) external;
}
