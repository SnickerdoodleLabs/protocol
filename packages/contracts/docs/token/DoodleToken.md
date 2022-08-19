# DoodleToken

Doodle ERC-20 token contract

_Contract was generated using OpenZeppelin(OZ)'s Contracts Wizard with the 'Votes' extension 
Token is intended to have a total cap supply and hence _mint() is called and transferred to the Snickerdoodle distribution address_

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

