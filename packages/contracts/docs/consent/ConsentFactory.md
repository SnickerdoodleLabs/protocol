# ConsentFactory

Snickerdoodle Protocol's Consent Factory Contract

_This contract deploys new BeaconProxy instances that all point to the latest Consent implementation contract via the UpgradeableBeacon 
The baseline contract was generated using OpenZeppelin's (OZ) Contract Wizard with added features 
The contract adopts OZ's proxy upgrade pattern and is compatible with OZ's meta-transaction library_

### PAUSER_ROLE

```solidity
bytes32 PAUSER_ROLE
```

### addressToConsentBP

```solidity
mapping(address => address[]) addressToConsentBP
```

Mapping of addresses to an array of its deployed beacon proxy addresses

### contractNameToAddress

```solidity
mapping(string => address) contractNameToAddress
```

_Mapping of contract name to its address_

### beaconAddress

```solidity
address beaconAddress
```

Address of the upgradeable beacon

### ConsentDeployed

```solidity
event ConsentDeployed(address owner, address consentAddress)
```

Emitted when a Consent contract's Beacon Proxy is deployed

| Name | Type | Description |
| ---- | ---- | ----------- |
| owner | address | Indexed address of the owner of the deployed Consent contract Beacon Proxy |
| consentAddress | address | Indexed address of the deployed Consent contract Beacon Proxy |

### constructor

```solidity
constructor(address trustedForwarder) public
```

_Sets the trustedForwarder address, calls the initialize function, then disables any initializers as recommended by OpenZeppelin_

### initialize

```solidity
function initialize() public
```

Initializes the contract

_Uses the initializer modifier to to ensure the contract is only initialized once_

### createConsent

```solidity
function createConsent(address owner, string baseURI, string name) public
```

Creates a new Beacon Proxy contract pointing to the UpgradableBeacon

_This Beacon Proxy points to the UpgradableBeacon with the latest Consent implementation contract_

| Name | Type | Description |
| ---- | ---- | ----------- |
| owner | address | Address of the owner of the Consent contract instance |
| baseURI | string | Base uri for the for the Consent contract instance |
| name | string | Name of the Consent Contract |

### setBeaconAddress

```solidity
function setBeaconAddress(address beaconAddress_) public
```

Sets the UpgradeableBeacon address for the factory

| Name | Type | Description |
| ---- | ---- | ----------- |
| beaconAddress_ | address | Address of the UpgradeableBeacon contract |

### _msgSender

```solidity
function _msgSender() internal view virtual returns (address sender)
```

### _msgData

```solidity
function _msgData() internal view virtual returns (bytes)
```

