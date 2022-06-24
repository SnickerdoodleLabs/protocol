# ConsentV2

Snickerdoodle Protocol's ConsentV2 Contract

_PLACEHOLDER contract, currently only used for unit testing upgradeability of Consent
This contract mints and burns consent tokens for users who opt in or out of sharing their data
The contract's owners or addresses that have the right role granted can initiate a request for data
Consent's baseline contract was generated using OpenZeppelin (OZ) Wizard and customized thereafter  
Consent adopts OZ's upgradeable beacon proxy pattern and serves as an implementation contract_

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

### RequestForData

```solidity
event RequestForData(address requester, string ipfsCID)
```

Emitted when a request for data is made

_The SDQL services listens for this event_

| Name | Type | Description |
| ---- | ---- | ----------- |
| requester | address | Indexed address of data requester |
| ipfsCID | string | The IPFS CID pointing to an SDQL instruction |

### whenNotDisabled

```solidity
modifier whenNotDisabled()
```

Checks if open opt in is current disabled

### initialize

```solidity
function initialize(address consentOwner, string baseURI_, string name) public
```

Initializes the contract

_Uses the initializer modifier to to ensure the contract is only initialized once_

| Name | Type | Description |
| ---- | ---- | ----------- |
| consentOwner | address | Address of the owner of this contract |
| baseURI_ | string | The base uri |
| name | string | Name of the Consent Contract |

### optIn

```solidity
function optIn(uint256 tokenId, string agreementURI) public
```

Allows any user to opt in to sharing their data

_Mints user a Consent token_

| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenId | uint256 | User's Consent token id to mint against |
| agreementURI | string | User's Consent token uri containing agreement flags |

### restrictedOptIn

```solidity
function restrictedOptIn(uint256 tokenId, string agreementURI, uint256 nonce, bytes signature) public
```

Allows specific users to opt in to sharing their data

_For restricted opt ins, the owner will first sign a digital signature on-chain
The function is called with the signed signature
If the message signature is valid, the user calling this function is minted a Consent token_

| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenId | uint256 | User's Consent token id to mint against |
| agreementURI | string | User's Consent token uri containing agreement flags |
| nonce | uint256 | Salt to increase hashed message's security |
| signature | bytes | Owner's signature to agree with user opt in |

### optOut

```solidity
function optOut(uint256 tokenId) public
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

### _baseURI

```solidity
function _baseURI() internal view virtual returns (string baseURI_)
```

Gets the Consent tokens base URI

### setBaseURI

```solidity
function setBaseURI(string newURI) public
```

Sets the Consent tokens base URI

| Name | Type | Description |
| ---- | ---- | ----------- |
| newURI | string | New base uri |

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

### _isValidSignature

```solidity
function _isValidSignature(address user, uint256 nonce, string agreementURI, bytes signature) internal view returns (bool)
```

Verify that a signature is valid

| Name | Type | Description |
| ---- | ---- | ----------- |
| user | address | Address of the user calling the function |
| nonce | uint256 | Salt for hash security |
| agreementURI | string | User's Consent token uri containing agreement flags |
| signature | bytes | Signature of approved user's message hash |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | Boolean of whether signature is valid |

### isTrustedForwarder

```solidity
function isTrustedForwarder(address forwarder) public pure virtual returns (bool)
```

_Inherited from ERC2771ContextUpgradeable to embed its features directly in this contract 
This is a workaround as ERC2771ContextUpgradeable does not have an _init() function
Allows the factory to deploy a BeaconProxy that initiates a Consent contract without a constructor_

### setTrustedForwarder

```solidity
function setTrustedForwarder(address trustedForwarder_) public
```

Set the trusted forwarder address

| Name | Type | Description |
| ---- | ---- | ----------- |
| trustedForwarder_ | address | Address of the trusted forwarder |

### _beforeTokenTransfer

```solidity
function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal
```

_Override to add require statement to make tokens Consent token non-transferrable_

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

### isVersion2

```solidity
bool isVersion2
```

### setIsVersion2

```solidity
function setIsVersion2() public
```

### getIsVersion2

```solidity
function getIsVersion2() public view returns (bool)
```

