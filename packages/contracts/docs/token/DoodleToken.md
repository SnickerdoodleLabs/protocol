# DoodleToken

Doodle ERC-20 token contract

_Contract was generated using OpenZeppling Wizard with the 'Votes' feature 
Token is intended to have a total cap supply so _mint() is called and transfered to the SDL foundationfoundation/DAO/treasury address_

### constructor

```solidity
constructor(address distributionAddress) public
```

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

