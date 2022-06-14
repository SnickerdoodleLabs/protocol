// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

/**
 * @title A vesting contract for ERC-20 tokens with a voting extension
 * @author Todd Chapman
 * @notice Use this contract with OpenZepplin ERC-20 contracts that are used for voting
 * @dev Minimalist implementation of a ERC-20 token vesting contract 
 *
 * The base implementation was taken from Uniswap's governance repository:
 * https://github.com/Uniswap/governance/blob/master/contracts/TreasuryVester.sol
 *
 * This vesting contract allows the deployer to set a recipient, a vesting amount,
 * a cliff, and vesting end date. Tokens linearly vest from the cliff date to the end 
 * date. 
 *
 * Since Doodle Tokens also serve as voting tokens, and thus has an extension function for delegating
 * voting power to an address other than the holder of the Doodle balance, this vesting
 * contract allows the beneficiary to claim their voting rights while the vesting contract 
 * is in custody of their token through a call to `delegate`. 
 * 
 * For more info on ERC-20 voting extension see:
 * https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/extensions/ERC20Votes.sol
 * 
 * See unit tests for example usage:
 * 
 */
 
contract Vester {

    /// @dev address of token to be vested
    address public token;

    /// @dev address of the beneficiary of the vesting contract
    address public recipient;

    /// @dev amount of token to be vested
    uint256 public vestingAmount;

    /// @dev timestamp when vesting begins; use timeNow to help set an appropriate time
    uint256 public vestingBegin;

    /// @dev timestamp when first token becomes available to the beneficiary; use timeNow to help set an appropriate time
    uint256 public vestingCliff;

    /// @dev timestamp when entirety of vestingAmount is available to the beneficiary; use timeNow to help set an appropriate time
    uint256 public vestingEnd;

    /// @dev last timestamp that claim was successfully called
    uint256 public lastUpdate;

    /// @dev Constructor definition
    /// @param token_ address of the ERC-20 token implementing Hypernetoken
    /// @param recipient_ address of the beneficiary account
    /// @param vestingAmount_ total amount of h_ due to recipient_
    /// @param vestingBegin_ timestamp to use for the starting point of vesting period
    /// @param vestingCliff_ timestamp when recipient can redeem first allocation of token
    /// @param vestingEnd_ timestamp when all tokens are available to the beneficiary
    constructor(
        address token_,
        address recipient_,
        uint256 vestingAmount_,
        uint256 vestingBegin_,
        uint256 vestingCliff_,
        uint256 vestingEnd_
    ) {
        require(vestingBegin_ >= block.timestamp, 'Vesting::constructor: vesting begin too early');
        require(vestingCliff_ >= vestingBegin_, 'Vester::constructor: cliff is too early');
        require(vestingEnd_ > vestingCliff_, 'Vester::constructor: end is too early');

        token = token_;
        recipient = recipient_;

        vestingAmount = vestingAmount_;
        vestingBegin = vestingBegin_;
        vestingCliff = vestingCliff_;
        vestingEnd = vestingEnd_;

        lastUpdate = vestingBegin;
    }

    /// @notice helper function that returns the current timestamp 
    /// @dev This function can help get your timestamp format right in testing
    /// @return timenow returns the current block timestamp
    function timeNow() public view returns (uint256 timenow) {
        timenow = block.timestamp;
    }

    /// @notice allows the beneficiary to change the beneficiary address to a new address 
    /// @dev This function can only be called by the account set in the recipient variable
    /// @param recipient_ address to set as the new beneficiary
    function setRecipient(address recipient_) public {
        require(msg.sender == recipient, 'Vester::setRecipient: unauthorized');
        recipient = recipient_;
    }

    /// @notice delegate delegates votes associated with tokens held by this contract to an address specified by the beneficiary
    /// @dev The function allows for beneficiaries to have voting rights before they take possession of their tokens
    /// @param delegate_ address to recieve the voting rights, does not necessarly have to be the beneficiary
    function delegate(address delegate_) public {
        require(msg.sender == recipient, 'Vester::setRecipient: unauthorized');
        IDoodleToken(token).delegate(delegate_);        
    }

    /// @notice Call this function to disperse holdings to the beneficiary account
    /// @dev This function can be called by any account to save gas for the recipient, but vested token is only sent to the address stored in recipient
    function claim() public {
        require(block.timestamp >= vestingCliff, 'Vester::claim: not time yet');
        uint256 amount;
        if (block.timestamp >= vestingEnd) {
            amount = IDoodleToken(token).balanceOf(address(this));
        } else {
            amount = vestingAmount * ((block.timestamp - lastUpdate) / (vestingEnd - vestingBegin));
            lastUpdate = block.timestamp;
        }
        require(IDoodleToken(token).transfer(recipient, amount), "Vester::claim: token transfer failed");
    }
}

/// @dev a minimal interface for ERC-20 token with external delegate function call
interface IDoodleToken {
    function balanceOf(address account) external view returns (uint256);
    function transfer(address to, uint256 amount) external returns (bool);
    function delegate(address delegatee) external; 
}