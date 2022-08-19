# Vester

Use this contract with OpenZeppelin ERC-20 contracts that are used for voting

_Minimalist implementation of a ERC-20 token vesting contract 

The base implementation was taken from Uniswap's governance repository:
https://github.com/Uniswap/governance/blob/master/contracts/TreasuryVester.sol

This vesting contract allows the deployer to set a recipient, a vesting amount,
a cliff, and vesting end date. Tokens linearly vest from the cliff date to the end 
date. 

Since Doodle Tokens also serve as voting tokens, and thus has an extension function for delegating
voting power to an address other than the holder of the Doodle balance, this vesting
contract allows the beneficiary to claim their voting rights while the vesting contract 
is in custody of their token through a call to `delegate`. 

For more info on ERC-20 voting extension see:
https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/extensions/ERC20Votes.sol

See unit tests for example usage:_

### token

```solidity
address token
```

_address of token to be vested_

### recipient

```solidity
address recipient
```

_address of the beneficiary of the vesting contract_

### vestingAmount

```solidity
uint256 vestingAmount
```

_amount of token to be vested_

### vestingBegin

```solidity
uint256 vestingBegin
```

_timestamp when vesting begins; use timeNow to help set an appropriate time_

### vestingCliff

```solidity
uint256 vestingCliff
```

_timestamp when first token becomes available to the beneficiary; use timeNow to help set an appropriate time_

### vestingEnd

```solidity
uint256 vestingEnd
```

_timestamp when entirety of vestingAmount is available to the beneficiary; use timeNow to help set an appropriate time_

### lastUpdate

```solidity
uint256 lastUpdate
```

_last timestamp that claim was successfully called_

### constructor

```solidity
constructor(address token_, address recipient_, uint256 vestingAmount_, uint256 vestingBegin_, uint256 vestingCliff_, uint256 vestingEnd_) public
```

_Constructor definition_

| Name | Type | Description |
| ---- | ---- | ----------- |
| token_ | address | address of the ERC-20 token implementing Doodle Token |
| recipient_ | address | address of the beneficiary account |
| vestingAmount_ | uint256 | total amount of h_ due to recipient_ |
| vestingBegin_ | uint256 | timestamp to use for the starting point of vesting period |
| vestingCliff_ | uint256 | timestamp when recipient can redeem first allocation of token |
| vestingEnd_ | uint256 | timestamp when all tokens are available to the beneficiary |

### timeNow

```solidity
function timeNow() public view returns (uint256 timenow)
```

helper function that returns the current timestamp

_This function can help get your timestamp format right in testing_

| Name | Type | Description |
| ---- | ---- | ----------- |
| timenow | uint256 | returns the current block timestamp |

### setRecipient

```solidity
function setRecipient(address recipient_) public
```

allows the beneficiary to change the beneficiary address to a new address

_This function can only be called by the account set in the recipient variable_

| Name | Type | Description |
| ---- | ---- | ----------- |
| recipient_ | address | address to set as the new beneficiary |

### delegate

```solidity
function delegate(address delegate_) public
```

delegate delegates votes associated with tokens held by this contract to an address specified by the beneficiary

_The function allows for beneficiaries to have voting rights before they take possession of their tokens_

| Name | Type | Description |
| ---- | ---- | ----------- |
| delegate_ | address | address to recieve the voting rights, does not necessarily have to be the beneficiary |

### claim

```solidity
function claim() public
```

Call this function to disperse holdings to the beneficiary account

_This function can be called by any account to save gas for the recipient, but vested token is only sent to the address stored in recipient_

## IDoodleToken

_a minimal interface for ERC-20 token with external delegate function call_

### balanceOf

```solidity
function balanceOf(address account) external view returns (uint256)
```

### transfer

```solidity
function transfer(address to, uint256 amount) external returns (bool)
```

### delegate

```solidity
function delegate(address delegatee) external
```

