
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@layerzerolabs/solidity-examples/contracts/lzApp/interfaces/ILayerZeroEndpoint.sol";
import "@layerzerolabs/solidity-examples/contracts/lzApp/interfaces/ILayerZeroReceiver.sol";
import "@layerzerolabs/solidity-examples/contracts/lzApp/LzApp.sol";

contract ONFT721Reward is ERC721Burnable, AccessControl, ONFT721 {
    using Counters for Counters.Counter;

    uint256 gas;
    ILayerZeroEndpoint public endpoint;

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    Counters.Counter private _tokenIdCounter;
    string public baseURI;

    /// @dev Array of trusted domains
    string[] public domains;

    constructor(string memory name, string memory symbol, string memory baseUri, uint256 minGasToTransfer, address lzEndpoint) ERC721(name, symbol) LzApp(lzEndpoint) {
        gas = minGasToTransfer;
        endpoint = ILayerZeroEndpoint(lzEndpoint); 
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

    function bridgeToChain(address from, uint tokenId) public {
        // Call ONFT721Core's send 
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

    // Layer Zero ONFT implementation
    function crossChain(
        uint16 _dstChainId,
        bytes calldata _destination,
        uint256 tokenId
    ) public payable {
        require(msg.sender == ownerOf(tokenId), "Not the owner");
        // burn NFT
        _burn(tokenId);

        _tokenIdCounter.decrement();

        bytes memory payload = abi.encode(msg.sender, tokenId);
        // encode adapterParams to specify more gas for the destination
        uint16 version = 1;
        bytes memory adapterParams = abi.encodePacked(version, gas);
        (uint256 messageFee, ) = endpoint.estimateFees(
            _dstChainId,
            address(this),
            payload,
            false,
            adapterParams
        );
        require(
            msg.value >= messageFee,
            "Must send enough value to cover messageFee"
        );
        endpoint.send{value: msg.value}(
            _dstChainId,
            _destination,
            payload,
            payable(msg.sender),
            address(0x0),
            adapterParams
        );
    }
    function lzReceive(
        uint16 _srcChainId,
        bytes calldata _from,
        uint64,
        bytes calldata _payload
    ) public override {
        require(msg.sender == address(endpoint));
        address from;
        assembly {
            from := mload(add(_from, 20))
        }
        (address toAddress, uint256 tokenId) = abi.decode(
            _payload,
            (address, uint256)
        );
        // mint the tokens
        _safeMint(toAddress, tokenId);

        _tokenIdCounter.increment();
    }

    // Endpoint.sol estimateFees() returns the fees for the message
    function estimateFees(
        uint16 _dstChainId,
        address _userApplication,
        bytes calldata _payload,
        bool _payInZRO,
        bytes calldata _adapterParams
    ) external view returns (uint256 nativeFee, uint256 zroFee) {
        return
            endpoint.estimateFees(
                _dstChainId,
                _userApplication,
                _payload,
                _payInZRO,
                _adapterParams
            );
    }

        function _blockingLzReceive(
        uint16 _srcChainId,
        bytes memory _srcAddress,
        uint64 _nonce,
        bytes memory _payload
    ) internal virtual;
}