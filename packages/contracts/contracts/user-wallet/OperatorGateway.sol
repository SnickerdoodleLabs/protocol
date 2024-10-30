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

    /// @notice flag to determine if the gateway is on the source chain
    bool isSourceChain;

    /// @notice address of SnickerdoodleWallet contract
    address private factory;

    /// @notice salt string used to with Create2 to deploy the gateway proxy
    string private name;

    error ArrayLengthMismatch(uint a, uint b);
    error SourceChainMethodOnly(); 

    /// @notice creates a user wallet
    /// @dev the first account in the operatorAccounts array is the default admin
    /// @param _isSourceChain flag to determine if the gateway is on the source chain
    /// @param operatorAccounts the addresses of the operator accounts
    /// @param _factory the address of the SnickerdoodleFactory contract
    function initialize(
        bool _isSourceChain,
        string memory _name,
        address[] calldata adminAccounts,
        address[] calldata operatorAccounts,
        address _factory
    ) public initializer {
        __AccessControl_init();

        // Check that the admin accounts have at least one EOA
        bool hasEOA; 

        for (uint256 i = 0; i < adminAccounts.length; i++) {
            // If an EOA has not been found yet, check if the current account is an EOA
            if (!hasEOA) {
                // If it is not a contract, set hasEOA to true
                if (!isContract(adminAccounts[i])) {
                    hasEOA = true;
                }
            }
            _grantRole(DEFAULT_ADMIN_ROLE, adminAccounts[i]);
        }

        // Require that at least one admin account is an EOA
        require(hasEOA, "At least one admin account must be an EOA");

        for (uint256 i = 0; i < operatorAccounts.length; i++) {
            _grantRole(OPERATOR_ROLE, operatorAccounts[i]);
        }

        isSourceChain = _isSourceChain;
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
        require(isSourceChain, SourceChainMethodOnly());
        SnickerdoodleFactory(factory).authorizeWalletsOnDestinationChain{
            value: msg.value
        }(_destinationChainEID, usernames, _gas);
    }

    /// @notice Authorize the deployment of the operator gateway on the destination chain
    /// @param _destinationChainEID the destination chain's EID
    /// @param _gas the gas required to execute _lzReceive()
    function authorizeGatewayOnDestinationChain(
        uint32 _destinationChainEID,
        uint128 _gas
    ) external payable {
        require(isSourceChain, SourceChainMethodOnly());
        SnickerdoodleFactory(factory).authorizeGatewayOnDestinationChain{
            value: msg.value
        }(_destinationChainEID, _gas);
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

    /// @notice Quote the gas needed to authorize the deployment of the operator gateway on the destination chain 
    /// @param _dstEid the destination chain's EID
    /// @param domain the domain of the operator gateway
    /// @param _gas the gas required to execute _lzReceive()
    function quoteAuthorizeOperatorGatewayOnDestinationChain(
        uint32 _dstEid,
        string calldata domain,
        uint128 _gas
    ) external view returns (uint256 nativeFee, uint256 lzTokenFee) {
        return
            SnickerdoodleFactory(factory)
                .quoteAuthorizeOperatorGatewayOnDestinationChain(
                    _dstEid,
                    domain,
                    _gas
                );
    }

    /// @notice add new P256 keys to user accounts
    /// @param accounts the addresses of the target user wallets
    /// @param keyIds the keyIds of the users' P256 keys
    /// @param p256VerificationDatas the p256 verification data of the users' P256 keys
    /// @param newP256Keys the new P256 keys to add to the target user wallets
    /// @param p256Sigs the P256 signatures from the users' existing P256 keys
    function addP256KeysWithP256Keys(
        address[] calldata accounts,
        string[] calldata keyIds,
        P256VerificationData[] calldata p256VerificationDatas,
        P256Key[] calldata newP256Keys,
        P256Signature[] calldata p256Sigs
    ) external onlyRole(OPERATOR_ROLE) {
        require(
            accounts.length == keyIds.length,
            ArrayLengthMismatch(accounts.length, keyIds.length)
        );
        require(
            keyIds.length == p256VerificationDatas.length,
            ArrayLengthMismatch(accounts.length, keyIds.length)
        );
        require(
            p256VerificationDatas.length == newP256Keys.length,
            ArrayLengthMismatch(accounts.length, keyIds.length)
        );
        require(
            newP256Keys.length == p256Sigs.length,
            ArrayLengthMismatch(accounts.length, keyIds.length)
        );
        for (uint256 i = 0; i < accounts.length; i++) {
            SnickerdoodleWallet(payable(accounts[i])).addP256KeyWithP256Key(
                keyIds[i],
                p256VerificationDatas[i],
                newP256Keys[i],
                p256Sigs[i]
            );
        }
    }

    /// @notice override the AccessControl grantRole function to update the operator hash
    function grantRole(
        bytes32 role,
        address account
    )
        public
        override(AccessControlUpgradeable, IAccessControl)
        onlyRole(getRoleAdmin(role))
    {
        _grantRole(role, account);
        _updateOperatorHash();
    }

    /// @notice override the AccessControl revokeRole function to update the operator hash
    function revokeRole(
        bytes32 role,
        address account
    )
        public
        override(AccessControlUpgradeable, IAccessControl)
        onlyRole(getRoleAdmin(role))
    {
        _revokeRole(role, account);
        _updateOperatorHash();
    }

    /// @notice override the AccessControl renounceRole function to update the operator hash
    function renounceRole(
        bytes32 role,
        address callerConfirmation
    ) public override(AccessControlUpgradeable, IAccessControl) {
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
    function _updateOperatorHash() internal {
        if (isSourceChain) {
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
    }

    /// @notice Returns the Snickerdoodle factory address
    function getFactory() external view returns (address) {
        return factory;
    }

    /// @notice Returns the operator gateway's domain name
    function getDomainName() external view returns (string memory) {
        return name;
    }

    /// @notice Determines if an address is a contract address
    /// @param account The address to check
    /// @return True if the address is a contract, false otherwise
    function isContract(address account) internal view returns (bool) {
        uint256 size;
        assembly {
            size := extcodesize(account)
        }
        return size > 0;
    }
}
