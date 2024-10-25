// SPDX-License-Identifier: MIT

pragma solidity ^0.8.28;

import "@openzeppelin/contracts-upgradeable/access/extensions/AccessControlEnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./Structs.sol";
import "./SnickerdoodleFactory.sol";
import "./SnickerdoodleWallet.sol";
import "../erc7529/ERC7529Upgradeable.sol";

contract OperatorGateway is
    AccessControlEnumerableUpgradeable,
    ERC7529Upgradeable
{
    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");

    /// @notice address of SnickerdoodleWallet contract
    address private factory;

    /// @notice salt string used to with Create2 to deploy the gateway proxy
    string public name;

    error ArrayLengthMismatch(uint a, uint b);

    /// @notice creates a user wallet
    /// @dev the first account in the operatorAccounts array is the default admin
    /// @param operatorAccounts the addresses of the operator accounts
    /// @param _factory the address of the SnickerdoodleFactory contract
    function initialize(
        string memory _name,
        address[] calldata adminAccounts,
        address[] calldata operatorAccounts,
        address _factory
    ) public initializer {
        __AccessControl_init();

        for (uint256 i = 0; i < adminAccounts.length; i++) {
            _grantRole(DEFAULT_ADMIN_ROLE, adminAccounts[i]);
        }
        
        for (uint256 i = 0; i < operatorAccounts.length; i++) {
            _grantRole(OPERATOR_ROLE, operatorAccounts[i]);
        }

        factory = _factory;
        name = _name;
    }

    /// @notice deploy a user wallet with a P256 key from the wallet factory
    /// @param usernames the usernames of the user wallets that will be prepended with the operator's domain
    /// @param p256Keys the P256 keys of the user wallets
    /// @param evmAccounts the EVM accounts of the user wallets
    function deployWallets(
        string[] calldata usernames,
        P256Key[][] calldata p256Keys,
        address[][] calldata evmAccounts
    ) public onlyRole(OPERATOR_ROLE) {
        SnickerdoodleFactory(factory).deployWalletProxies(
            usernames,
            p256Keys,
            evmAccounts
        );
    }

    /// @notice Authorize multiple usernames on the destination chain with a single transaction
    /// @param _destinationChainEID the destination chain's EID
    /// @param usernames the usernames of the user wallets that will be prepended with the operator's domain
    /// @param _gas the gas required to execute _lzReceive()
    function authorizeWalletsOnDestinationChain(
        uint32 _destinationChainEID,
        string[] calldata usernames,
        uint128 _gas
    ) external payable {
        SnickerdoodleFactory(factory).authorizeWalletsOnDestinationChain{
            value: msg.value
        }(_destinationChainEID, usernames, _gas);
    }

    /// @notice Quote the gas needed to reserve a username on the destination chain with a single transaction
    /// @dev This function is just for operator convenience, you can also call the factory quote function directly
    /// @param _dstEid the destination chain's EID
    /// @param username the username of the user wallet that will be prepended with the operator's domain
    /// @param _gas the gas required to execute _lzReceive()
    function quoteAuthorizeWalletOnDestinationChain(
        uint32 _dstEid,
        string calldata username,
        uint128 _gas
    ) external view returns (uint256, uint256) {
        return
            SnickerdoodleFactory(factory)
                .quoteAuthorizeWalletOnDestinationChain(
                    _dstEid,
                    username,
                    address(this),
                    _gas
                );
    }

    /// @notice add new P256 keys to user accounts
    /// @param accounts the addresses of the target user wallets
    /// @param keyIds the keyIds of the users' P256 keys
    /// @param authenticatorDatas the authenticator data of the users' P256 keys
    /// @param newP256Keys the new P256 keys to add to the target user wallets
    /// @param p256Sigs the P256 signatures from the users' existing P256 keys
    function addP256KeysWithP256Keys(
        address[] calldata accounts,
        string[] calldata keyIds,
        AuthenticatorData[] calldata authenticatorDatas,
        P256Key[] calldata newP256Keys,
        P256Signature[] calldata p256Sigs
    ) external onlyRole(OPERATOR_ROLE) {
        require(
            accounts.length == keyIds.length,
            ArrayLengthMismatch(accounts.length, keyIds.length)
        );
        require(
            keyIds.length == authenticatorDatas.length,
            ArrayLengthMismatch(accounts.length, keyIds.length)
        );
        require(
            authenticatorDatas.length == newP256Keys.length,
            ArrayLengthMismatch(accounts.length, keyIds.length)
        );
        require(
            newP256Keys.length == p256Sigs.length,
            ArrayLengthMismatch(accounts.length, keyIds.length)
        );
        for (uint256 i = 0; i < accounts.length; i++) {
            SnickerdoodleWallet(payable(accounts[i])).addP256KeyWithP256Key(
                keyIds[i],
                authenticatorDatas[i],
                newP256Keys[i],
                p256Sigs[i]
            );
        }
    }

    /// @notice override the AccessControl grantRole function to update the operator hash
    function grantRole(bytes32 role, address account) public override(AccessControlUpgradeable, IAccessControl) onlyRole(getRoleAdmin(role)) {
        _grantRole(role, account);
        _updateOperatorHash();
    }

    /// @notice override the AccessControl revokeRole function to update the operator hash
    function revokeRole(bytes32 role, address account) public override(AccessControlUpgradeable, IAccessControl) onlyRole(getRoleAdmin(role)) {
        _revokeRole(role, account);
        _updateOperatorHash();
    }

    /// @notice override the AccessControl renounceRole function to update the operator hash
    function renounceRole(bytes32 role, address callerConfirmation) public override(AccessControlUpgradeable, IAccessControl) {
        super.renounceRole(role, callerConfirmation);
        _updateOperatorHash();
    }

    /// @notice Add an associated DNS eTLD+1 domain with this operator gateway contract
    /// @param domain a string representing an eTLD+1 domain associated with the contract
    function addERC7529Domain(
        string memory domain
    ) external onlyRole(OPERATOR_ROLE) {
        _addDomain(domain);
    }

    /// @notice Add an associated DNS eTLD+1 domain with this operator gateway contract
    /// @param domain a string representing an eTLD+1 domain associated with the contract
    function removeERC7529Domain(
        string memory domain
    ) external onlyRole(OPERATOR_ROLE) {
        _removeDomain(domain);
    }

        /// @notice updates the wallet hash in the factory contract to reflect the current state of the wallet for layer0
    function _updateOperatorHash() internal returns (bytes32) {
        uint numAdmins = getRoleMemberCount(DEFAULT_ADMIN_ROLE);
        uint numOperators = getRoleMemberCount(OPERATOR_ROLE);

        address[] memory adminAccounts = new address[](numAdmins);
        address[] memory operatorAccounts = new address[](numOperators);

        for (uint256 i = 0; i < numAdmins; i++) {
            adminAccounts[i] = getRoleMember(DEFAULT_ADMIN_ROLE, i);
        }

        for (uint256 i = 0; i < numOperators; i++) {
            operatorAccounts[i] = getRoleMember(OPERATOR_ROLE, i);
        }

        bytes32 operatorHash = keccak256(
            abi.encodePacked(name, adminAccounts, operatorAccounts)
        );
        SnickerdoodleFactory(factory).updateOperatorHash(operatorHash);
    }

    /// @notice Returns the Snickerdoodle factory address
    function getFactory() external view returns (address) {
        return factory;
    }
}
