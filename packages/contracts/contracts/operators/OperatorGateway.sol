// SPDX-License-Identifier: MIT

pragma solidity ^0.8.24;

import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol"; 
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../user-wallet/P256Structs.sol";
import "../user-wallet/SnickerdoodleWalletFactory.sol";
import "../erc7529/ERC7529Upgradeable.sol";

contract OperatorGateway is AccessControlUpgradeable, ERC7529Upgradeable {

    /// @notice accounts associated with this operator gateway contract
    mapping(address => bool) public operatorAccounts;

    /// @notice address of SnickerdoodleWallet contract
    address private walletFactory; 

    event OperatorAccountAdded(address indexed account);

    modifier onlyOperatorAccount() {
        require(operatorAccounts[msg.sender], "OperatorGateway: only operator accounts can call this function");
        _;
    }

    /// @notice creates a user wallet
    function initialize(
        address[] memory _operatorAccounts, 
        address _walletFactory
    ) public initializer {
        __AccessControl_init(); 
        for (uint256 i = 0; i < _operatorAccounts.length; i++) {
            operatorAccounts[_operatorAccounts[i]] = true;
        }
        walletFactory = _walletFactory;
    }

    /// @notice deploy a user wallet with a P256 key from the wallet factory
    /// @param names the names of the user wallets
    /// @param p256Keys the P256 keys of the user wallets
    function deploySnickerdoodleWallets(
        string[] calldata names, 
        P256Key[] calldata p256Keys
    ) public onlyOperatorAccount {
        SnickerdoodleWalletFactory(walletFactory).deploySnickerdoodleWalletProxies(
            names,
            p256Keys
        );
    }

    /// @notice Add an associatd DNS eTLD+1 domain with this operator gateway contract
    /// @param domain a string representing an eTLD+1 domain associated with the contract
    function addERC7529Domain(string memory domain) external onlyOperatorAccount {
        _addDomain(domain);
    }   

    function _addOperatorAccount(address operatorAccount) private {
        operatorAccounts[operatorAccount] = true;
        emit OperatorAccountAdded(operatorAccount);
    }

}