# Consent

Snickerdoodle Protocol's Consent Contract

_This contract mints and burns non-transferable ERC721 consent tokens for users who opt in or out of sharing their data
The contract's owners or addresses that have the right role granted can initiate a request for data
The baseline contract was generated using OpenZeppelin's (OZ) Contracts Wizard and customized thereafter 
ERC2771ContextUpgradeable's features were directly embedded into the contract (see isTrustedForwarder for details)
The contract adopts OZ's upgradeable beacon proxy pattern and serves as an implementation contract
It is also compatible with OZ's meta-transaction library_

### consentFactoryAddress

```solidity
address consentFactoryAddress
```

_Interface for ConsentFactory_

### consentFactoryInstance

```solidity
contract IConsentFactory consentFactoryInstance
```

### PAUSER_ROLE

```solidity
bytes32 PAUSER_ROLE
```

_Role bytes_

### SIGNER_ROLE

```solidity
bytes32 SIGNER_ROLE
```

### REQUESTER_ROLE

```solidity
bytes32 REQUESTER_ROLE
```

### baseURI

```solidity
string baseURI
```

_Base uri for logo of Consent tokens_

### totalSupply

```solidity
uint256 totalSupply
```

_Total supply of Consent tokens_

### openOptInDisabled

```solidity
bool openOptInDisabled
```

_Flag of whether open opt in is disabled or not_

### trustedForwarder

```solidity
address trustedForwarder
```

_Trusted forwarder address for meta-transactions_

### domains

```solidity
string[] domains
```

_Array of trusted domains_

### RequestForData

```solidity
event RequestForData(address requester, string ipfsCIDIndexed, string ipfsCID)
```

Emitted when a request for data is made

_The SDQL services listens for this event_

| Name | Type | Description |
| ---- | ---- | ----------- |
| requester | address | Indexed address of data requester |
| ipfsCIDIndexed | string | The indexed IPFS CID pointing to an SDQL instruction |
| ipfsCID | string | The IPFS CID pointing to an SDQL instruction |

### LogAddDomain

```solidity
event LogAddDomain(string domain)
```

Emitted when a domain is added

| Name | Type | Description |
| ---- | ---- | ----------- |
| domain | string | Domain url added |

### LogRemoveDomain

```solidity
event LogRemoveDomain(string domain)
```

Emitted when a domain is removed

| Name | Type | Description |
| ---- | ---- | ----------- |
| domain | string | Domain url removed |

### whenNotDisabled

```solidity
modifier whenNotDisabled()
```

Checks if open opt in is current disabled

### initialize

```solidity
function initialize(address consentOwner, string baseURI_, string name, address _contractFactoryAddress) public
```

Initializes the contract

_Uses the initializer modifier to to ensure the contract is only initialized once_

| Name | Type | Description |
| ---- | ---- | ----------- |
| consentOwner | address | Address of the owner of this contract |
| baseURI_ | string | The base uri |
| name | string | Name of the Consent Contract |
| _contractFactoryAddress | address |  |

### optIn

```solidity
function optIn(uint256 tokenId, string agreementURI) external
```

Allows any user to opt in to sharing their data

_Mints user a Consent token_

| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenId | uint256 | User's Consent token id to mint against |
| agreementURI | string | User's Consent token uri containing agreement flags |

### restrictedOptIn

```solidity
function restrictedOptIn(uint256 tokenId, string agreementURI, bytes signature) external
```

Allows specific users to opt in to sharing their data

_For restricted opt ins, the owner will first sign a digital signature on-chain
The function is called with the signed signature
If the message signature is valid, the user calling this function is minted a Consent token_

| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenId | uint256 | User's Consent token id to mint against |
| agreementURI | string | User's Consent token uri containing agreement flags |
| signature | bytes | Owner's signature to agree with user opt in |

### optOut

```solidity
function optOut(uint256 tokenId) external
```

Allows users to opt out of sharing their data

_burns the user's consent token_

| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenId | uint256 | Token id of token being burnt |

### requestForData

```solidity
function requestForData(string ipfsCID) external
```

Facilitates entity's request for data

| Name | Type | Description |
| ---- | ---- | ----------- |
| ipfsCID | string | IPFS CID containing SDQL Query Instructions |

### setTrustedForwarder

```solidity
function setTrustedForwarder(address trustedForwarder_) external
```

Set the trusted forwarder address

| Name | Type | Description |
| ---- | ---- | ----------- |
| trustedForwarder_ | address | Address of the trusted forwarder |

### setBaseURI

```solidity
function setBaseURI(string newURI) public
```

Sets the Consent tokens base URI

| Name | Type | Description |
| ---- | ---- | ----------- |
| newURI | string | New base uri |

### addDomain

```solidity
function addDomain(string domain) external
```

Add a domain to the domains array

| Name | Type | Description |
| ---- | ---- | ----------- |
| domain | string | Domain to add |

### removeDomain

```solidity
function removeDomain(string domain) external
```

Removes a domain from the domains array

| Name | Type | Description |
| ---- | ---- | ----------- |
| domain | string | Domain to remove |

### pause

```solidity
function pause() public
```

Allows address with PAUSER_ROLE to pause the contract

### unpause

```solidity
function unpause() public
```

Allows address with PAUSER_ROLE to unpause the contract

### disableOpenOptIn

```solidity
function disableOpenOptIn() public
```

Allows address with PAUSER_ROLE to disable open opt ins

### enableOpenOptIn

```solidity
function enableOpenOptIn() public
```

Allows address with PAUSER_ROLE to enable open opt ins

### isTrustedForwarder

```solidity
function isTrustedForwarder(address forwarder) public pure virtual returns (bool)
```

_Inherited from ERC2771ContextUpgradeable to embed its features directly in this contract 
This is a workaround as ERC2771ContextUpgradeable does not have an _init() function
Allows the factory to deploy a BeaconProxy that initiates a Consent contract without a constructor_

### _baseURI

```solidity
function _baseURI() internal view virtual returns (string baseURI_)
```

Gets the Consent tokens base URI

### getDomains

```solidity
function getDomains() external view returns (string[] domainsArr)
```

Gets the array of registered domains

| Name | Type | Description |
| ---- | ---- | ----------- |
| domainsArr | string[] | Array of registered domains |

### _isValidSignature

```solidity
function _isValidSignature(address user, uint256 tokenId, string agreementURI, bytes signature) internal view returns (bool)
```

Verify that a signature is valid

| Name | Type | Description |
| ---- | ---- | ----------- |
| user | address | Address of the user calling the function |
| tokenId | uint256 | Token id to be tied to current user |
| agreementURI | string | User's Consent token uri containing agreement flags |
| signature | bytes | Signature of approved user's message hash |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | Boolean of whether signature is valid |

### _beforeTokenTransfer

```solidity
function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal
```

_Override to add require statement to make tokens Consent token non-transferrable_

### _grantRole

```solidity
function _grantRole(bytes32 role, address account) internal virtual
```

_Overload {_grantRole} to add ConsentFactory update_

### _revokeRole

```solidity
function _revokeRole(bytes32 role, address account) internal virtual
```

_Overload {_revokeRole} to add ConsentFactory update_

### _burn

```solidity
function _burn(uint256 tokenId) internal
```

### tokenURI

```solidity
function tokenURI(uint256 tokenId) public view returns (string)
```

### supportsInterface

```solidity
function supportsInterface(bytes4 interfaceId) public view returns (bool)
```

### _msgSender

```solidity
function _msgSender() internal view virtual returns (address sender)
```

### _msgData

```solidity
function _msgData() internal view virtual returns (bytes)
```

## IConsentFactory

_a minimal interface for Consent contracts to update the ConsentFactory_

### addUserConsents

```solidity
function addUserConsents(address user) external
```

### removeUserConsents

```solidity
function removeUserConsents(address user) external
```

### addUserRole

```solidity
function addUserRole(address user, bytes32 role) external
```

### removeUserRole

```solidity
function removeUserRole(address user, bytes32 role) external
```

