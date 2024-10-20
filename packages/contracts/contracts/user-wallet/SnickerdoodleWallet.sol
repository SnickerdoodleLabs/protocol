// SPDX-License-Identifier: MIT

pragma solidity ^0.8.24;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./tmp/Base64.sol";
import "./tmp/P256.sol";
import "./Structs.sol";

contract SnickerdoodleWallet is Initializable {
    using SafeERC20 for IERC20;

    /// @notice P256 curve parameters
    uint256 internal constant N =
        0xFFFFFFFF00000000FFFFFFFFFFFFFFFFBCE6FAADA7179E84F3B9CAC2FC632551;

    /// @notice user's public key data
    mapping(bytes32 => P256Key) private p256Keys;

    /// @notice EVM addresses owned by the user
    mapping(address => bool) private evmAccounts;

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

    event EVMAccountAdded(address indexed account);

    event EVMAccountRemoved(address indexed account);

    error InvalideP256Signature(string keyId);
    error P256NoncedUsed(bytes32 hash);
    error EVMAccountNotFound(address account);
    error OperatorAlreadyAdded(address operator);
    error KeyAlreadyAdded();
    error OnlyOperators();
    error OnlyOwnerAccounts();

    modifier onlyOperator() {
        require(operators[msg.sender], OnlyOperators());
        _;
    }

    modifier onlyUserEVMAccount() {
        require(evmAccounts[msg.sender], OnlyOwnerAccounts());
        _;
    }

    /// @notice creates a user wallet
    /// @dev you can optionally deploy the wallet with an EVM account if availble from the user
    function initialize(
        address operator,
        P256Key calldata p256Key,
        address[] calldata evmAccount
    ) public initializer {
        _addOperator(operator);
        _addP256Key(p256Key);
        if (evmAccount.length > 0) {
            for (uint256 i = 0; i < evmAccount.length; i++) {
                _addEVMAccount(evmAccount[i]);
            }
        }
    }

    /// @notice authorizes the addition of a new P256 key via an existing P256 key
    /// @dev the client must sign an Uint8Array of the concatenated bytes of the keyId, and formatted Qx and Qy coordinates
    /// @dev the client signature is explicitly intended to be usable on multiple chains so that the user does not have to sign multiple times
    /// @param keyId the id of the signing key which is already added to this contract
    /// @param authenticatorData struct containing the authenticatorData, clientDataJSONLeft, and clientDataJSONRight
    /// @param newP256Key the new P256 key to be added to the user's wallet, contains the keyId, x, and y values
    /// @param p256Sig the P256 signature containing the r and s values
    function addP256KeyWithP256Key(
        string calldata keyId,
        AuthenticatorData calldata authenticatorData,
        P256Key calldata newP256Key,
        P256Signature calldata p256Sig
    ) public {
        bytes memory challenge = abi.encodePacked(
            newP256Key.keyId,
            newP256Key.x,
            newP256Key.y
        );
        require(
            _verifyP256(
                keyId,
                authenticatorData.authenticatorData,
                authenticatorData.clientDataJSONLeft,
                Base64.encodeURL(challenge),
                authenticatorData.clientDataJSONRight,
                p256Sig.r,
                p256Sig.s
            ),
            InvalideP256Signature(keyId)
        );
        _addP256Key(newP256Key);
    }

    /// @notice authorizes the addition of an EVM address via a P256 signature
    /// @dev the client must sign an Uint8Array representation of the target EVM address
    /// @dev the client signature is explicitly intended to be usable on multiple chains so that the user does not have to sign multiple times
    /// @param keyId the id of the signing key which is already added to this contract
    /// @param authenticatorData struct containing the authenticatorData, clientDataJSONLeft, and clientDataJSONRight
    /// @param evmAccount the key which will be added to the user's known EVM address list
    /// @param p256Sig the P256 signature containing the r and s values
    function addEVMAddressWithP256Key(
        string calldata keyId,
        AuthenticatorData calldata authenticatorData,
        address evmAccount,
        P256Signature calldata p256Sig
    ) external {
        // the P256 signature must be valid
        require(
            _verifyP256(
                keyId,
                authenticatorData.authenticatorData,
                authenticatorData.clientDataJSONLeft,
                _addressToBase64URLString(evmAccount),
                authenticatorData.clientDataJSONRight,
                p256Sig.r,
                p256Sig.s
            ),
            InvalideP256Signature(keyId)
        );
        // add the EVM address to the wallet
        _addEVMAccount(evmAccount);
    }

    /// @notice allows the owner to directly add a new EVM address through a known EVM address
    /// @param _evmAccount the address which will be added to the user's known EVM address list
    function addEVMAccountWithEVMAccount(
        address _evmAccount
    ) external onlyUserEVMAccount {
        _addEVMAccount(_evmAccount);
    }

    /// @notice allows the owner to directly remove an existing EVM address through a known EVM address
    /// @param _evmAccount the address which will be removed from the user's known EVM address list
    function removeEVMAccountWithEVMAccount(
        address _evmAccount
    ) external onlyUserEVMAccount {
        _removeEVMAccount(_evmAccount);
    }

    /// @notice withdraws any token held by (this) to the calling account
    /// @param asset the contract address of the token to be transferred from this to the user's EVM Address
    function withdrawLocalERC20Asset(IERC20 asset) external onlyUserEVMAccount {
        // get the balance of this wallet
        uint256 myBalance = IERC20(asset).balanceOf(address(this));
        // send the balance to the user's evm address
        asset.safeTransfer(msg.sender, myBalance);
    }

    /// @notice withdraws any native asset held by (this) to the calling account
    function withdrawNativeAsset() external onlyUserEVMAccount {
        // send the balance to the user's evm address
        uint256 amount = address(this).balance;
        (bool ok, ) = msg.sender.call{value: amount}("");
        require(ok, "transfer failed");
    }

    /// @notice allows native token to be sent to the wallet
    receive() external payable {}

    /// @notice adds an operator to the list of operators
    function _addOperator(address operator) private {
        require(!operators[operator], OperatorAlreadyAdded(operator));
        operators[operator] = true;
    }

    function _addEVMAccount(address evmAccount) private {
        // don't add an address that's already in the wallet
        require(!evmAccounts[evmAccount], KeyAlreadyAdded());
        evmAccounts[evmAccount] = true;
        emit EVMAccountAdded(evmAccount);
    }

    function _removeEVMAccount(address evmAccount) private {
        // don't add an address that's already in the wallet
        require(evmAccounts[evmAccount], EVMAccountNotFound(evmAccount));
        evmAccounts[evmAccount] = false;
        emit EVMAccountRemoved(evmAccount);
    }

    /// @notice adds a P256 public key to the user's wallet
    function _addP256Key(P256Key memory p256Key) private {
        bytes32 keyHash = keccak256(abi.encodePacked(p256Key.keyId));
        require(p256Keys[keyHash].x == 0, KeyAlreadyAdded());
        p256Keys[keyHash] = p256Key;
        emit P256KeyAdded(keyHash, p256Key.x, p256Key.y, p256Key.keyId);
    }

    /// @notice verifies a P256 signature
    /// @dev the challenge string should already be Base64URL encoded
    function _verifyP256(
        string calldata _keyId,
        bytes calldata authenticatorData,
        string calldata clientDataJSONLeft,
        string memory challenge,
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
        require(!hashDump[h], P256NoncedUsed(h));
        hashDump[h] = true;

        if (uint256(s) > N / 2) {
            uint256 us = N - uint256(s);
            s = bytes32(us);
        }

        bytes32 keyHash = keccak256(abi.encodePacked(_keyId));
        P256Key memory p256Key = p256Keys[keyHash];
        return P256.verify(h, r, s, p256Key.x, p256Key.y);
    }

    function _addressToBase64URLString(
        address _address
    ) private pure returns (string memory) {
        return Base64.encodeURL(bytes.concat(bytes20(uint160(_address))));
    }
}
