// SPDX-License-Identifier: MIT

pragma solidity ^0.8.24;

import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol"; 
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../user-wallet/P256Structs.sol";
import "../user-wallet/SnickerdoodleWalletFactory.sol";
import "../user-wallet/SnickerdoodleWallet.sol";
import "../erc7529/ERC7529Upgradeable.sol";

contract OperatorGateway is AccessControlUpgradeable, ERC7529Upgradeable {

    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");

    /// @notice address of SnickerdoodleWallet contract
    address private walletFactory; 

    /// @notice creates a user wallet
    function initialize(
        address[] calldata operatorAccounts, 
        address _walletFactory
    ) public initializer {
        __AccessControl_init(); 

        _grantRole(DEFAULT_ADMIN_ROLE, operatorAccounts[0]);
        for (uint256 i = 0; i < operatorAccounts.length; i++) {
            _grantRole(OPERATOR_ROLE, operatorAccounts[i]);
        }

        walletFactory = _walletFactory;
    }

    /// @notice deploy a user wallet with a P256 key from the wallet factory
    /// @param names the names of the user wallets
    /// @param p256Keys the P256 keys of the user wallets
    function deploySnickerdoodleWallets(
        string[] calldata names, 
        P256Key[] calldata p256Keys
    ) public onlyRole(OPERATOR_ROLE) {
        SnickerdoodleWalletFactory(walletFactory).deploySnickerdoodleWalletProxies(
            names,
            p256Keys
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
        require(accounts.length == keyIds.length, "OperatorGateway: invalid input length: accounts and keyIds");
        require(keyIds.length == authenticatorDatas.length, "OperatorGateway: invalid input length: keyIds and authenticatorDatas");
        require(authenticatorDatas.length == newP256Keys.length, "OperatorGateway: invalid input length: authenticatorDatas and newP256Keys");
        require(newP256Keys.length == p256Sigs.length, "OperatorGateway: invalid input length: newP256Keys and p256Sigs");
        for(uint256 i = 0; i < accounts.length; i++) {
            SnickerdoodleWallet(accounts[i]).addP256KeyWithP256Key(
                keyIds[i],
                authenticatorDatas[i],
                newP256Keys[i],
                p256Sigs[i]
            );
        }
    }

    /// @notice Add an associatd DNS eTLD+1 domain with this operator gateway contract
    /// @param domain a string representing an eTLD+1 domain associated with the contract
    function addERC7529Domain(string memory domain) external onlyRole(OPERATOR_ROLE) {
        _addDomain(domain);
    }   

    /// @notice Add an associatd DNS eTLD+1 domain with this operator gateway contract
    /// @param domain a string representing an eTLD+1 domain associated with the contract
    function removeERC7529Domain(string memory domain) external onlyRole(OPERATOR_ROLE) {
        _removeDomain(domain);
    }   

}