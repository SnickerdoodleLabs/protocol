
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Reward is ERC721, ERC721Burnable, AccessControl {
    using Counters for Counters.Counter;

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    Counters.Counter private _tokenIdCounter;
    string public baseURI;

    /// @dev Array of trusted domains
    string[] public domains;

    constructor(string memory name, string memory symbol, string memory baseUri ) ERC721(name, symbol) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        setBaseURI(baseUri);
    }

    function safeMint(address to) public onlyRole(MINTER_ROLE) {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
    }

    function setBaseURI(string memory newBaseURI) public onlyRole(MINTER_ROLE) {
        baseURI = newBaseURI;
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
                revert("Reward : Domain already added");
            }
            unchecked {
                ++i;
            }
        }

        domains.push(domain);
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

                break;
            }
            unchecked {
                ++i;
            }
        }
        require(flag > 0, "Reward : Domain is not in the list");
    }

    /// @notice Gets the array of registered domains
    /// @return domainsArr Array of registered domains
    function getDomains() external view returns (string[] memory domainsArr) {
        return domains;
    }

    // The following functions are overrides required by Solidity.
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function _baseURI() 
        internal 
        view 
        override(ERC721) 
        returns (string memory) {
        return baseURI;
    } 
}