# WDoodleToken

Wrapped Doodle ERC-20 token contract

_Contract was generated using OpenZepplin Wizard with the 'Votes' feature 
Purpose is to provide ERC-20 compatability to the native Doodle Token
Token is intended to have a total cap supply so _mint() is called and transfered to the SDL foundationfoundation/DAO/treasury address_

### constructor

```solidity
constructor(address distributionAddress) public
```

### depositAndWrap

```solidity
function depositAndWrap() public payable
```

Allow a user to deposit underlying tokens and mint the corresponding number of wrapped tokens.

### unwrapAndWithdraw

```solidity
function unwrapAndWithdraw(uint256 amount) public virtual
```

Allow a user to burn a number of wrapped tokens and withdraw the corresponding number of underlying tokens.

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount | uint256 | Amount to unwrap and withdraw in unit of wei |

### _afterTokenTransfer

```solidity
function _afterTokenTransfer(address from, address to, uint256 amount) internal
```

### _mint

```solidity
function _mint(address to, uint256 amount) internal
```

### _burn

```solidity
function _burn(address account, uint256 amount) internal
```

