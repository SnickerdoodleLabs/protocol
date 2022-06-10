# SnickerdoodleGovernor

### constructor

```solidity
constructor(contract IVotesUpgradeable _token, contract TimelockControllerUpgradeable _timelock) public
```

### initialize

```solidity
function initialize(contract IVotesUpgradeable _token, contract TimelockControllerUpgradeable _timelock) public
```

### votingDelay

```solidity
function votingDelay() public view returns (uint256)
```

Getter function that returns the the number of blocks that must be mined after a proposal is created before it is active.

_The voting delay is stored as number of blocks (1 block ~= 13 seconds)_

### votingPeriod

```solidity
function votingPeriod() public view returns (uint256)
```

Getter function that returns the number of blocks that a proposal stays active for after its activation.

_The voting period is stored as number of blocks (1 block ~= 13 seconds)_

### quorum

```solidity
function quorum(uint256 blockNumber) public view returns (uint256)
```

Getter that returns the number of votes at a given block number

### state

```solidity
function state(uint256 proposalId) public view returns (enum IGovernorUpgradeable.ProposalState)
```

Getter that returns the state of a proposal id

_See {IGovernor-state} for list of ProposalState enums_

### propose

```solidity
function propose(address[] targets, uint256[] values, bytes[] calldatas, string description) public returns (uint256)
```

### proposalThreshold

```solidity
function proposalThreshold() public view returns (uint256)
```

Getter function that returns the minimum amount of tokens an accounts must have to create a proposal

_Token amounts are in wei (18 decimals)._

### _execute

```solidity
function _execute(uint256 proposalId, address[] targets, uint256[] values, bytes[] calldatas, bytes32 descriptionHash) internal
```

_This called when the public execute() function is called._

### _cancel

```solidity
function _cancel(address[] targets, uint256[] values, bytes[] calldatas, bytes32 descriptionHash) internal returns (uint256)
```

### _executor

```solidity
function _executor() internal view returns (address)
```

### supportsInterface

```solidity
function supportsInterface(bytes4 interfaceId) public view returns (bool)
```

