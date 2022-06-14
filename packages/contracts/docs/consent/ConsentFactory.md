# ConsentFactory

### PAUSER_ROLE

```solidity
bytes32 PAUSER_ROLE
```

### ADMIN_ROLE

```solidity
bytes32 ADMIN_ROLE
```

### addressToConsentBP

```solidity
mapping(address => address[]) addressToConsentBP
```

Mapping of addresses to an array of its deployed beacon proxy addresses

### beaconAddress

```solidity
address beaconAddress
```

Address of the upgradeable beacon

### ConsentDeployed

```solidity
event ConsentDeployed(address requester, address consentAddress)
```

Emitted when a Consent contract's Beacon Proxy is deployed

| Name | Type | Description |
| ---- | ---- | ----------- |
| requester | address | Indexed address of the requester to deploy a Consent contract |
| consentAddress | address | Indexed address of the deployed Consent contract Beacon Proxy |

### constructor

```solidity
constructor(address trustedForwarder) public
```

_Sets the trustedForwarder address, calls the initialize function, then disables any initializers as recomended by OpenZeppelin_

### initialize

```solidity
function initialize() public
```

Initializes the contract

_Uses the initializer modifier to to ensure the contract is only initialized once_

### deployBeacon

```solidity
function deployBeacon(address consentContractAddress) public
```

Deploys the UpgradableBeacon that all the Beacon Proxies point to

_The UpgradableBeacon points to the latest Consent implementation contract  
Can only be called by address that has the ADMIN_ROLE_

| Name | Type | Description |
| ---- | ---- | ----------- |
| consentContractAddress | address | Address of the latest implementation verion of the Consent contract |

### createConsent

```solidity
function createConsent(string baseURI) public
```

Creates a new Beacon Proxy contract pointing to the UpgradableBeacon

_This Beacon Proxy points to the UpgradableBeacon with the latest Consent implementation contract_

| Name | Type | Description |
| ---- | ---- | ----------- |
| baseURI | string | Base uri for the for the Consent contract instance |

### getConsentBP

```solidity
function getConsentBP(address owner) public view returns (address[] arrayOfBP)
```

Get the Beacon Proxy addresses of an owner address

_First checks if address has previously deployed Consent Beacon Proxies 
If user has deployed before, returns an array of the deployed addresses_

| Name | Type | Description |
| ---- | ---- | ----------- |
| owner | address | Address of owner that deployed Beacon Proxy Consent contracts |

| Name | Type | Description |
| ---- | ---- | ----------- |
| arrayOfBP | address[] | Array of address of Beacon Proxies deployed |

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

