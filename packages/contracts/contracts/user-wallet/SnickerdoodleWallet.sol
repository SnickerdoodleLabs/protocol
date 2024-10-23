// SPDX-License-Identifier: MIT

pragma solidity ^0.8.28;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/cryptography/P256.sol";
import "./SnickerdoodleFactory.sol";
import "./Structs.sol";

contract SnickerdoodleWallet is Initializable {
    using SafeERC20 for IERC20;

    /// @notice P256 curve parameters
    uint256 internal constant N =
        0xFFFFFFFF00000000FFFFFFFFFFFFFFFFBCE6FAADA7179E84F3B9CAC2FC632551;

    /// @notice address of the factory contract
    address private factory;

    /// @notice address of the operator that deployed this wallet
    address private operator;

    /// @notice salt used to create the wallet address
    string private name;

    /// @notice used to iterate through p256Keys mapping
    bytes32[] private keyIdHashArray;

    /// @notice user's public key data
    mapping(bytes32 => P256Key) private p256Keys;

    /// @notice EVM addresses owned by the user
    address[] private evmAccounts;

    /// @notice index of known EVM addresses in the evmAccounts array
    mapping(address => uint) private evmAccountIndexes;

    /// @notice used P256 message hashes
    mapping(bytes32 => bool) private hashDump;

    event P256KeyAdded(
        bytes32 indexed keyhash,
        bytes32 qx,
        bytes32 qy,
        string keyId
    );

    event EVMAccountAdded(address indexed account);

    event EVMAccountRemoved(address indexed account);

    error InvalidP256Signature(string keyId);
    error P256NoncedUsed(bytes32 hash);
    error EVMAccountNotFound(address account);
    error OperatorAlreadyAdded(address operator);
    error KeyAlreadyAdded();
    error OnlyOperator();
    error OnlyOwnerAccounts();

    modifier onlyOperator() {
        require(msg.sender == operator, OnlyOperator());
        _;
    }

    modifier onlyUserEVMAccount() {
        require(evmAccountIndexes[msg.sender] == 0, OnlyOwnerAccounts());
        _;
    }

    /// @notice creates a user wallet
    /// @dev you can optionally initialize the wallet with known EVM accounts if available from the user
    /// @param _factory the address of the factory contract
    /// @param _operator the address of the operator that deployed this wallet
    /// @param _name the name of the wallet
    /// @param _p256Keys the P256 keys of the user wallets
    /// @param _evmAccounts the EVM accounts of the user wallets
    function initialize(
        address _factory,
        address _operator,
        string calldata _name,
        P256Key[] calldata _p256Keys,
        address[] calldata _evmAccounts
    ) public initializer {
        require(_p256Keys.length > 0, "P256Keys must be provided");

        for (uint256 i = 0; i < _p256Keys.length; i++) {
            _addP256Key(_p256Keys[i]);
        }

        if (_evmAccounts.length > 0) {
            for (uint256 i = 0; i < _evmAccounts.length; i++) {
                _addEVMAccount(_evmAccounts[i]);
            }
        }

        factory = _factory;
        operator = _operator;
        name = _name;
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
            InvalidP256Signature(keyId)
        );
        _addP256Key(newP256Key);
        _updateWalletHash();
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
            InvalidP256Signature(keyId)
        );
        // add the EVM address to the wallet
        _addEVMAccount(evmAccount);
        _updateWalletHash();
    }

    /// @notice allows the owner to directly add a new EVM address through a known EVM address
    /// @param _evmAccount the address which will be added to the user's known EVM address list
    function addEVMAccountWithEVMAccount(
        address _evmAccount
    ) external onlyUserEVMAccount {
        _addEVMAccount(_evmAccount);
        _updateWalletHash();
    }

    /// @notice allows the owner to directly remove an existing EVM address through a known EVM address
    /// @param _evmAccount the address which will be removed from the user's known EVM address list
    function removeEVMAccountWithEVMAccount(
        address _evmAccount
    ) external onlyUserEVMAccount {
        _removeEVMAccount(_evmAccount);
        _updateWalletHash();
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

    /// @notice adds an EVM account to the wallet
    /// @param evmAccount the address to add
    function _addEVMAccount(address evmAccount) private {
        // don't add an address that's already in the wallet
        require(evmAccountIndexes[evmAccount] == 0, KeyAlreadyAdded());
        evmAccounts.push(evmAccount);
        evmAccountIndexes[evmAccount] = evmAccounts.length;
        emit EVMAccountAdded(evmAccount);
    }

    /// @notice removes an EVM account from the wallet
    /// @param evmAccount the address to remove
    function _removeEVMAccount(address evmAccount) private {
        uint index = evmAccountIndexes[evmAccount];
        require(index > 0, EVMAccountNotFound(evmAccount));
        evmAccounts[index] = evmAccounts[evmAccounts.length - 1];
        evmAccounts.pop();
        emit EVMAccountRemoved(evmAccount);
    }

    /// @notice adds a P256 public key to the user's wallet
    /// @param p256Key the P256 key to add
    function _addP256Key(P256Key memory p256Key) private {
        bytes32 keyHash = keccak256(abi.encodePacked(p256Key.keyId));
        require(p256Keys[keyHash].x == 0, KeyAlreadyAdded());
        p256Keys[keyHash] = p256Key;
        keyIdHashArray.push(keyHash);
        emit P256KeyAdded(keyHash, p256Key.x, p256Key.y, p256Key.keyId);
    }

    /// @notice updates the wallet hash in the factory contract to reflect the current state of the wallet for layer0
    function _updateWalletHash() internal returns (bytes32) {
        string memory keyIds = "";
        bytes32[] memory xs = new bytes32[](keyIdHashArray.length);
        bytes32[] memory ys = new bytes32[](keyIdHashArray.length);
        for (uint256 i = 0; i < keyIdHashArray.length; i++) {
            keyIds = string.concat(keyIds, p256Keys[keyIdHashArray[i]].keyId);
            xs[i] = p256Keys[keyIdHashArray[i]].x;
            ys[i] = p256Keys[keyIdHashArray[i]].y;
        }

        bytes32 wallethash = keccak256(
            abi.encodePacked(operator, name, keyIds, xs, ys, evmAccounts)
        );
        SnickerdoodleFactory(factory).updateWalletHash(wallethash);
    }

    /// @notice verifies a P256 signature
    /// @dev the challenge string should already be Base64URL encoded
    /// @param _keyId the keyId of the P256
    /// @param authenticatorData the authenticatorData from the client
    /// @param clientDataJSONLeft the left side of the clientDataJSON
    /// @param challenge the challenge string
    /// @param clientDataJSONRight the right side of the clientDataJSON
    /// @param r the r value of the signature
    /// @param s the s value of the signature
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

    /// @notice Converts an address to a Base64URL string
    /// @param _address to be converted to a Base64URL string
    function _addressToBase64URLString(
        address _address
    ) private pure returns (string memory) {
        return Base64.encodeURL(bytes.concat(bytes20(uint160(_address))));
    }

    /// @notice Returns the Snickerdoodle factory address
    function getFactory() external view returns (address) {
        return factory;
    }

    /// @notice Returns the wallet operator's address
    function getOperator() external view returns (address) {
        return operator;
    }

    /// @notice Returns the name of the wallet
    function getName() external view returns (string memory) {
        return name;
    }

    /// @notice Returns stored P256 key id hashes
    function getP256KeyHashes() external view returns (bytes32[] memory) {
        return keyIdHashArray;
    }

    /// @notice Returns the P256 key data for a given keyId
    /// @param keyHash the hash of the keyId
    function getP256Key(bytes32 keyHash) external view returns (P256Key memory) {
        return p256Keys[keyHash];
    }

    /// @notice Returns the EVM addresses associated with the wallet
    function getEvmAccounts() external view returns (address[] memory) {
        return evmAccounts;
    }

    /// @notice Returns the EVM address index
    /// @param evmAccount the address to check
    function getEvmAccountIndex(address evmAccount) external view returns (uint) {
        return evmAccountIndexes[evmAccount];
    }

    /// @notice Returns if a hash has been used
    /// @param hash the hash to check
    function hashUsed(bytes32 hash) public view returns (bool) {
        return hashDump[hash];
    }
}
