// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IConsent {

    /* Structs */

    struct Tag {
        uint256 slot; // slot staked by this contract
        string tag; // human-readable tag this contract has staked
        address staker; // address which staked the specific tag
    }

    // helper struct to retrieve nearly all registry details in one http request
    struct RegistryDetails{
        string name;
        string desc;
        string imgURL;
        string baseURI;
        uint maxCapacity;
        uint totalSupply;
        bool openOptInDisabled;
        uint queryHorizon;
        string[] domains; 
        Tag[] tags;
    }

    /* EVENTS */

    /// @notice Emitted when a request for data is made
    /// @dev The data wallet client subscribes to this event
    /// @param requester Indexed address of data requester
    /// @param ipfsCIDIndexed The indexed IPFS CID pointing to an SDQL instruction
    /// @param ipfsCID The IPFS CID pointing to an SDQL instruction
    event RequestForData(
        address indexed requester,
        string indexed ipfsCIDIndexed,
        string ipfsCID
    );

    /// @notice Emitted when a domain is added
    /// @param domain Domain url added
    event LogAddDomain(string domain);

    /// @notice Emitted when a domain is removed
    /// @param domain Domain url removed
    event LogRemoveDomain(string domain);

    /* External Functions */

    function getRegistryDetails() external view returns(RegistryDetails memory);

    function updateConsentRegistryDetails(string calldata _name, string calldata _desc, string calldata _img) external;

    function tagIndices(string calldata) external view returns(uint256);

    function baseURI() external view returns(string memory);

    function totalSupply() external view returns(uint256);

    function openOptInDisabled() external view returns(bool);

    function trustedForwarder() external view returns(address);

    function queryHorizon() external view returns(uint);

    function agreementFlagsArray(uint256) external view returns(bytes32);

    function maxCapacity() external view returns(uint);

    function getNumberOfStakedTags() external view returns (uint256);

    function getTagArray() external view returns (Tag[] memory);

    function newGlobalTag(string memory tag, uint256 _newSlot) external;

    function newLocalTagUpstream(string memory tag, uint256 _newSlot, uint256 _existingSlot) external;

    function newLocalTagDownstream(string memory tag, uint256 _existingSlot, uint256 _newSlot) external;

    function moveExistingListingUpstream(string memory tag, uint256 _newSlot, uint256 _existingSlot) external;

    function restakeExpiredListing(string memory tag) external;

    function replaceExpiredListing(string memory tag, uint256 _slot) external;

    function removeListing(string memory tag) external returns (string memory);

    function optIn(uint256 tokenId, bytes32 agreementFlags) external;

    function restrictedOptIn(uint256 tokenId, bytes32 agreementFlags, bytes memory signature) external;

    function anonymousRestrictedOptIn(uint256 tokenId, bytes32 agreementFlags, bytes memory signature) external;

    function optOut(uint256 tokenId) external;

    function requestForData(string memory ipfsCID) external;

    function updateMaxCapacity(uint _maxCapacity) external;

    function updateAgreementFlags(uint256 tokenId, bytes32 newAgreementFlags) external;

    function setQueryHorizon(uint queryHorizon_) external;

    function updateTrustedForwarder() external;

    function updateMaxTagsLimit() external;

    function setBaseURI(string memory newURI) external;

    function addDomain(string memory domain) external;

    function removeDomain(string memory domain) external;

    function pause() external;

    function unpause() external;

    function disableOpenOptIn() external;

    function enableOpenOptIn() external;

    function getDomains() external view returns (string[] memory);    
}