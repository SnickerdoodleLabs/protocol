# ConsentFactory

Snickerdoodle Protocol's Consent Factory Contract

_This contract deploys new BeaconProxy instances that all point to the latest Consent implementation contract via the UpgradeableBeacon 
The baseline contract was generated using OpenZeppelin's (OZ) Contract Wizard with added features 
The contract adopts OZ's proxy upgrade pattern and is compatible with OZ's meta-transaction library_

### PAUSER_ROLE

```solidity
bytes32 PAUSER_ROLE
```

### addressToDeployedConsents

```solidity
mapping(address => address[]) addressToDeployedConsents
```

Mapping of addresses to an array of its deployed beacon proxy addresses

### addressToDeployedConsentsIndex

```solidity
mapping(address => mapping(address => uint256)) addressToDeployedConsentsIndex
```

Mapping of addresses to an array of its deployed beacon proxy addresses

### consentAddressCheck

```solidity
mapping(address => bool) consentAddressCheck
```

_Mapping of deployed beacon proxy addresses to track that it is a Consent contract_

### addressToUserArray

```solidity
mapping(address => address[]) addressToUserArray
```

_Mapping of user address to an array of Consent contracts they have opted-in to
User address => Consent address array_

### addressToUserArrayIndex

```solidity
mapping(address => mapping(address => uint256)) addressToUserArrayIndex
```

_Mapping of Consent contract address of a specific user's array to its index
Used look up index in the array and check if it exists in the array
User address => Consent address => index within the array_

### addressToUserRolesArray

```solidity
mapping(address => mapping(bytes32 => address[])) addressToUserRolesArray
```

_Mapping of user address to contracts addresses they have specific roles for
User address => role => Consent address array_

### addressToUserRolesArrayIndex

```solidity
mapping(address => mapping(bytes32 => mapping(address => uint256))) addressToUserRolesArrayIndex
```

_Mapping of user address to contracts addresses they have specific roles for
User address => role => Consent address => index within the array_

### beaconAddress

```solidity
address beaconAddress
```

_Address of the upgradeable beacon_

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
constructor(address trustedForwarder, address consentImpAddress) public
```

_Sets the trustedForwarder address, calls the initialize function, then disables any initializers as recommended by OpenZeppelin
consentImpAddress address of the Consent contract implementation address for the upgradeable beacon_

| Name | Type | Description |
| ---- | ---- | ----------- |
| trustedForwarder | address | Address of the trusted forwarder for meta tx |
| consentImpAddress | address |  |

### onlyConsentContract

```solidity
modifier onlyConsentContract()
```

Modified to check if a caller of a function is a Consent contract

_Every time a Consent contract is deployed, it is store into the consentAddressCheck mapping_

### initialize

```solidity
function initialize(address consentImpAddress) public
```

Initializes the contract

_Uses the initializer modifier to to ensure the contract is only initialized once_

| Name | Type | Description |
| ---- | ---- | ----------- |
| consentImpAddress | address | Uses the initializer modifier to to ensure the contract is only initialized once |

### createConsent

```solidity
function createConsent(address owner, string baseURI, string name) public
```

Creates a new Beacon Proxy contract pointing to the UpgradableBeacon

_This Beacon Proxy points to the UpgradableBeacon with the latest Consent implementation contract
Registers the deployed contract into the consentAddressCheck mapping_

| Name | Type | Description |
| ---- | ---- | ----------- |
| owner | address | Address of the owner of the Consent contract instance |
| baseURI | string | Base uri for the for the Consent contract instance |
| name | string | Name of the Consent Contract |

### addUserConsents

```solidity
function addUserConsents(address user) external
```

Function to add consent addresses that users have opted-in to

| Name | Type | Description |
| ---- | ---- | ----------- |
| user | address | Address of the user to update |

### removeUserConsents

```solidity
function removeUserConsents(address user) external
```

Function to remove consent addresses that users have opted-in to

_This allows us to retrieve a list of Consent contract addresses the user has opted-in to_

| Name | Type | Description |
| ---- | ---- | ----------- |
| user | address | Address of the user to update |

### addUserRole

```solidity
function addUserRole(address user, bytes32 role) external
```

Function to add roles a user address has on a specific contract

_This allows us to retrieve a list of Consent contract addresses where the user has specific roles_

| Name | Type | Description |
| ---- | ---- | ----------- |
| user | address | Address of the user to update |
| role | bytes32 | Role of the user in bytes32 |

### removeUserRole

```solidity
function removeUserRole(address user, bytes32 role) external
```

Function to add roles a user address has on a specific contract

_This allows us to retrieve a list of Consent contract addresses where the user has specific roles_

| Name | Type | Description |
| ---- | ---- | ----------- |
| user | address | Address of the user to update |
| role | bytes32 | Role of the user in bytes32 |

### getUserDeployedConsentsCount

```solidity
function getUserDeployedConsentsCount(address user) external view returns (uint256 count)
```

Return the number Consent addresses that user has deployed

| Name | Type | Description |
| ---- | ---- | ----------- |
| user | address | Address of the user |

| Name | Type | Description |
| ---- | ---- | ----------- |
| count | uint256 | Count of user's current opted-in Consent contracts |

### getUserDeployedConsentsByIndex

```solidity
function getUserDeployedConsentsByIndex(address user, uint256 startingIndex, uint256 endingIndex) external view returns (address[])
```

Return the an array of Consent addresses that user has deployed

| Name | Type | Description |
| ---- | ---- | ----------- |
| user | address | Address of the user |
| startingIndex | uint256 | Starting index of query |
| endingIndex | uint256 | Ending index of query |

### getUserConsentAddressesCount

```solidity
function getUserConsentAddressesCount(address user) external view returns (uint256 count)
```

Return the number Consent addresses that user is currently opted-in

| Name | Type | Description |
| ---- | ---- | ----------- |
| user | address | Address of the user |

| Name | Type | Description |
| ---- | ---- | ----------- |
| count | uint256 | Count of user's current opted-in Consent contracts |

### getUserConsentAddressesByIndex

```solidity
function getUserConsentAddressesByIndex(address user, uint256 startingIndex, uint256 endingIndex) external view returns (address[])
```

Return the an array of Consent addresses that user is currently opted-in by index

| Name | Type | Description |
| ---- | ---- | ----------- |
| user | address | Address of the user |
| startingIndex | uint256 | Starting index of query |
| endingIndex | uint256 | Ending index of query |

### getUserRoleAddressesCount

```solidity
function getUserRoleAddressesCount(address user, bytes32 role) external view returns (uint256 count)
```

Return an array of user's consent addresses that they have specific roles in

| Name | Type | Description |
| ---- | ---- | ----------- |
| user | address | Address of the user |
| role | bytes32 | Role in bytes32 |

| Name | Type | Description |
| ---- | ---- | ----------- |
| count | uint256 | Count of user's Consent contracts that they have specific role for |

### getUserRoleAddressesCountByIndex

```solidity
function getUserRoleAddressesCountByIndex(address user, bytes32 role, uint256 startingIndex, uint256 endingIndex) external view returns (address[])
```

Return the an array of Consent addresses that user currently has specific role for by index

| Name | Type | Description |
| ---- | ---- | ----------- |
| user | address | Address of the user |
| role | bytes32 | Bytes32 role |
| startingIndex | uint256 | Starting index of query |
| endingIndex | uint256 | Ending index of query |

### _queryList

```solidity
function _queryList(uint256 startingIndex, uint256 endingIndex, address[] consentList) internal pure returns (address[] filteredList)
```

Internal function to help query an array of Consent addresses by indexes

| Name | Type | Description |
| ---- | ---- | ----------- |
| startingIndex | uint256 | Starting index of query |
| endingIndex | uint256 | Ending index of query |
| consentList | address[] | Array of Consent contract addresses |

| Name | Type | Description |
| ---- | ---- | ----------- |
| filteredList | address[] | Array of Consent addresses after queries |

### _msgSender

```solidity
function _msgSender() internal view virtual returns (address sender)
```

### _msgData

```solidity
function _msgData() internal view virtual returns (bytes)
```

