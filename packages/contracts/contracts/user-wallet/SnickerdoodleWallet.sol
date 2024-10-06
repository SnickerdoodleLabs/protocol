// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.24;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./tmp/Base64.sol";
import "./tmp/P256.sol";

contract SnickerdoodleWallet is Initializable {
    /// @notice P256 curve parameters
    uint256 internal constant N =
        0xFFFFFFFF00000000FFFFFFFFFFFFFFFFBCE6FAADA7179E84F3B9CAC2FC632551;

    /// @notice user's public key data
    mapping(bytes32 => P256Point) private p256Keys;
    bytes32[] private userKeysHashList;

    /// @notice EVM addresses owned by the user
    mapping(address => bool) private evmWallets;
    address[] private evmWalletsList;

    /// @notice address of operators allowed to relay P245 signatures to this contract
    mapping(address => bool) public operators;

    /// @notice used P256 message hashes
    mapping(bytes32 => bool) public hashDump;

    event P256KeyAdded(
        bytes32 indexed keyhash,
        bytes32 qx,
        bytes32 qy,
        string keyId
    );

    event EVMAddressAdded(
        address indexed address
    );

    struct P256Point {
        bytes32 x;
        bytes32 y;
        string keyId;
    }

    modifier onlyOperator() {
        require(operators[msg.sender], "only operators can call this function");
        _;
    }

    modifier onlyUserEVMAddress() {
        require(evmWallets[msg.sender], "only an owner can call this function");
        _;
    }

    /// @notice creates a user wallet
    function initialize(
        address operator,
        string calldata _keyId,
        bytes32 _qx,
        bytes32 _qy,
    ) public initializer {
        _addP256Key(_keyId, _qx, _qy);
    }

    /// @notice authorizes the addition of a new P256 key via an existing P256 key
    /// @dev the client must sign an Uint8Array of the concatenated bytes of the keyId, and formated Qx and Qy coordinates
    /// @param _keyId the id of the signing key which is already added to this contract
    /// @param authenticatorData hex byte array of the authenticatorData object returned by webauthn api
    /// @param clienDataJSONLeft the clientDataJSON contents to the left of the challenge value
    /// @param _newKeyId the key id of the new P256 key to be added to this wallet
    /// @param _qx the formatted, hex-encoded x-coordinate of the new P256 key
    /// @param _qy the formatted, hex-encoded y-coordinate of the new P256 key
    /// @param clientDataJSONRight the clientDataJSON contents to the right of the challenge value
    /// @param r the hex-encoded r component of the P256 signature
    /// @param s the hex-encoded s component of the P256 signature
    function addP256KeyWithP256Key(
        string memory _keyId
        bytes memory authenticatorData,
        string memory clientDataJSONLeft,
        string calldata _newKeyId
        bytes32 _qx,
        bytes32 _qy,
        string memory clientDataJSONRight,
        bytes32 r,
        bytes32 s
    ) public {
        require(
            p256Keys[keccak256(abi.encodePacked(_newKeyId))].x == 0,
            "P256 key aldready added"
        );
        bytes memory challenge = abi.encodePacked(_newKeyId, _qx, _qy);
        require(
            _verifyP256(
                _keyId,
                authenticatorData,
                clientDataJSONLeft,
                Base64.ecodeURL(challenge),
                clientDataJSONRight,
                r,
                s
            ),
            "Invalid P256 Signature"
        );
        _addP256Key(_keyId, _qx, _qy);
    }

    /// @notice authorizes the addition of an EVM address via a P256 signature
    /// @dev the client must sign an Uint8Array representation of the target EVM address
    /// @param _keyId the id of the signing key which is already added to this contract
    /// @param authenticatorData hex byte array of the authenticatorData object returned by webauthn api
    /// @param clienDataJSONLeft the clientDataJSON contents to the left of the challenge value
    /// @param _evmKey the key which will be added to the user's known EVM address list
    /// @param clientDataJSONRight the clientDataJSON contents to the right of the challenge value
    /// @param r the hex-encoded r component of the P256 signature
    /// @param s the hex-encoded s component of the P256 signature
    function addEMVAddressWithP256Key(
        string calldata _keyId,
        bytes calldata authenticatorData,
        string calldata clientDataJSONLeft,
        address _evmKey,
        string calldata clientDataJSONRight,
        bytes32 r,
        bytes32 s
    ) external {
        // the P256 signature must be valid
        require(
            _verifyP256(
                _keyId,
                authenticatorData,
                clientDataJSONLeft,
                _addressToBase64URLString(_evmKey),
                clientDataJSONRight,
                r,
                s
            ),
            "Invalid P256 Signature"
        );
        // add the EVM address to the wallet
        _addEVMAddress(_evmKey);
    }

    /// @notice allows the owner to directly add a new EVM address through a known EVM address
    /// @param _evmKey the address which will be added to the user's known EVM address list
    function addEVMAddressWithEVMAddress(
        address _evmKey
    ) external onlyUserEVMAddress {
        _addEVMAddress(_evmKey);
    }

    /// @notice withdraws any token held by (this) to the calling account
    /// @param the contract address of the token to be transfered from this to the user's EVM Address
    function withdrawLocalERC20Asset(
        address asset
    ) external onlyUserEVMAddress {
        // get the balance of this wallet
        uint256 myBalance = IERC20(asset).balanceOf(this);
        // send the balance to the user's evm address
        IERC20(asset).transfer(msg.sender, myBalance);
    }

    /// @notice adds an EVM address to the user's wallet
    function _addEVMAddress(address evmKey) private {
        // don't add an address that's already in the wallet
        require(
            !evmWallets[evmKey],
            "EVM address already added to the wallet"
        );
        evmWallets[evmKey] = true;
        evmWalletList.push(evmKey);
        emit EVMAddressAdded(emvKey);
    }

    /// @notice adds a P256 public key to the user's wallet
    function _addP256Key(
        string calldata _keyId,
        bytes32 _qx,
        bytes32 _qy,
    ) private {
        bytes32 keyHash = keccak256(abi.encodePacked(_keyId));
        p256Keys[keyHash] = P256Point(uint256(_qx), uint256(_qy), _keyId);
        userKeysHashList.push(keyHash);
        emit P256KeyAdded(keyHash, _qx, _qy, _keyId);
    }

    /// @notice verifies a P256 signature
    /// @dev the challenge string should already be Base64URL encoded
    function _verifyP256(
        string calldata _keyId,
        bytes calldata authenticatorData,
        string calldata clientDataJSONLeft,
        string calldata challenge,
        string calldata clientDataJSONRight,
        bytes32 r,
        bytes32 s
    ) private returns (bool) {
        string memory clientDataJSON = string.concat(
            clientDataJSONLeft,
            challenge,
            clientDataJSONRight
        );

        bytes32 cDataHash = sha256(bytes(clientDataJSON));
        bytes32 h = sha256(bytes.concat(authenticatorData, cDataHash));
        require(!hashDump[h], "P256 signature already used.");
        hashDump[h] = true;

        if (uint256(s) > N / 2) {
            uint256 us = N - uint256(s);
            s = bytes32(us);
        }

        P256Point memory p256Key = p256Keys[keccak256(abi.encodePacked(_keyId))];
        return P256.verify(h, r, s, p256Key.x, p256Key.y);
    }

    function _addressToBase64URLString(
        address _address
    ) private pure returns (string memory) {
        return Base64.encodeURL(bytes.concat(bytes20(uint160(_address))));
    }
}
