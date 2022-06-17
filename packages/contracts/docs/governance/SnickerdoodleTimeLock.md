# SnickerdoodleTimelock

Snickerdoodle Protocol's DAO Timelock Contract

_Snickerdoodle (SDL) adopts OpenZeppelin's (OZ) Governor Library
The contract adopts OZ's proxy upgrade pattern_

### constructor

```solidity
constructor(uint256 minDelay, address[] proposers, address[] executors) public
```

### initialize

```solidity
function initialize(uint256 minDelay, address[] proposers, address[] executors) public
```

Initializes the contract

_Uses the initializer modifier to to ensure the contract is only initialized once_

| Name | Type | Description |
| ---- | ---- | ----------- |
| minDelay | uint256 | Minimum delay for an operation to become valid in seconds |
| proposers | address[] | Initial list of addresses approved as proposers |
| executors | address[] | Initial list of addresses approved as executors |

