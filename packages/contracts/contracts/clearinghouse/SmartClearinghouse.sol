// SPDX-License-Identifier: MIT

pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract SmartClearinghouse {
    using SafeERC20 for IERC20;

    /// TODO: write the contract
    address private factory;

    /// @notice mapping of allocationId to Allocation struct
    mapping(bytes32 => Allocation) public allocationParams;

    /// @notice mapping from an asset to the balance of a user
    mapping(address => mapping(address => uint)) public userBalances;

    /// @notice approved list of ERC20 asset addresses
    mapping(address => bool) public allowedAssets;

    struct Allocation {
        address asset;
        address ownerAccount;
        address operator;
        uint startingBalance;
        uint remainingBalance;
        bool paused;
    }

    constructor(address _factory) {
        factory = _factory;
    }

    /// @notice called by an operator to allocate funds for disbursal to users
    /// @param allocationId unique identifier for the allocation
    /// @param ownerAccount the account that controls the allocation
    /// @param asset the address of the erc20 asset to be allocated
    /// @param amount the amount of the asset to be allocated
    function allocate(
        bytes32 allocationId,
        address ownerAccount,
        IERC20 asset,
        uint amount
    ) external {
        require(allowedAssets[address(asset)], "asset not allowed");

        allocationParams[allocationId] = Allocation(
            address(asset),
            ownerAccount,
            msg.sender,
            amount,
            amount,
            false
        );

        asset.safeTransferFrom(msg.sender, address(this), amount);
    }

    /// @notice disburse funds from a prior allocation to a list of users
    /// @param allocationId unique identifier for the allocation
    /// @param users the list of user addresses to disburse to
    /// @param amounts the list of amounts to disburse to each user
    function disburse(
        bytes32 allocationId,
        address[] calldata users,
        uint[] calldata amounts
    ) external {
        Allocation memory allocation = allocationParams[allocationId];
        require(!allocation.paused, "allocation paused");
        require(allocation.remainingBalance > 0, "allocation fully disbursed");
        require(allocation.operator == msg.sender, "unauthorized operator");
        require(users.length == amounts.length, "Array length mismatch");

        for (uint i = 0; i < users.length; i++) {
            address user = users[i];
            uint amount = amounts[i];

            require(
                allocation.remainingBalance >= amount,
                "insufficient funds"
            );

            allocation.remainingBalance -= amount;
            userBalances[allocation.asset][user] += amount;
        }
    }

    /// @notice Allows the owner of an allocation to pause the allocation
    function pauseAllocation(bytes32 allocationId) external {
        require(
            allocationParams[allocationId].operator == msg.sender,
            "unauthorized operator"
        );
        allocationParams[allocationId].paused = true;
    }

    /// @notice Allows the owner (or operator if unpaused) of an allocation to withdraw the remaining balance
    /// @param allocationId the unique identifier for the allocation
    /// @param destination the address to withdraw the funds to
    function withdrawAllocation(
        bytes32 allocationId,
        address destination
    ) external {
        require(
            (msg.sender == allocationParams[allocationId].ownerAccount) ||
                (msg.sender == allocationParams[allocationId].operator &&
                    !allocationParams[allocationId].paused),
            "unauthorized withdrawal"
        );
        IERC20 asset = IERC20(allocationParams[allocationId].asset);
        uint amount = allocationParams[allocationId].remainingBalance;
        allocationParams[allocationId].remainingBalance = 0;
        asset.safeTransfer(
            destination,
            amount
        );
    }

    /// @notice Allows the owner (or operator if unpaused) of an allocation to transfer to a new operator
    /// @param allocationId the unique identifier for the allocation
    /// @param newOperator the address of the new operator
    function transferAllocationOperator(bytes32 allocationId, address newOperator) external {
        require(
            (msg.sender == allocationParams[allocationId].ownerAccount) ||
                (msg.sender == allocationParams[allocationId].operator &&
                    !allocationParams[allocationId].paused),
            "unauthorized transfer"
        );
        allocationParams[allocationId].operator = newOperator;
    }

    /// @notice Allows a user to withdraw their earned funds
    /// @param assets the addresses of the assets to withdraw
    /// @param destination the address to withdraw the funds to
    function withdrawEarnedFunds(
        IERC20[] calldata assets,
        address destination
    ) external {
        for (uint i = 0; i < assets.length; i++) {
            IERC20 asset = assets[i];
            uint amount = userBalances[address(asset)][msg.sender];
            require(amount > 0, "no funds to withdraw");

            userBalances[address(asset)][msg.sender] = 0;
            asset.safeTransfer(destination, amount);
        }
    }

    /// @notice Allows the owner of an allocation to pause the allocation
    function getRemainingAllocationBalance(
        bytes32[] calldata allocationId
    ) external view returns (uint[] memory) {
        uint[] memory balances = new uint[](allocationId.length);

        for (uint i = 0; i < allocationId.length; i++) {
            balances[i] = allocationParams[allocationId[i]].remainingBalance;
        }

        return balances;
    }

    /// @notice checks the balances of a user for a list of assets
    /// @param assets the list of asset addresses to check
    /// @param user the address of the user to check
    function getEarnedAssetBalancesForUser(
        address[] calldata assets,
        address user
    ) external view returns (uint[] memory) {
        uint[] memory balances = new uint[](assets.length);

        for (uint i = 0; i < assets.length; i++) {
            balances[i] = userBalances[assets[i]][user];
        }

        return balances;
    }

    /// @notice checks the balances of a list of users for an asset
    /// @param asset the address of the asset to check
    /// @param users the list of user addresses to check
    function getEarnedUserBalancesForAsset(
        address asset,
        address[] calldata users
    ) external view returns (uint[] memory) {
        uint[] memory balances = new uint[](users.length);

        for (uint i = 0; i < users.length; i++) {
            balances[i] = userBalances[asset][users[i]];
        }

        return balances;
    }
}
