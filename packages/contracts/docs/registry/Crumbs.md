# Crumbs

Snickerdoodle Protocol's Crumbs Contract

_A crumb is an ERC721 NFT that holds the masks of a user's private key as part of their token uri
Any user can create and the store masks for their private keys 
The ERC721's tokenId is labelled crumbId in this contract
The baseline contract was generated using OpenZeppelin's (OZ) Contracts Wizard and customized thereafter 
ERC2771ContextUpgradeable's features were directly embedded into the contract (see isTrustedForwarder for details)
The contract adopts OZ's upgradeable beacon proxy pattern and serves as an implementation contract
It is also compatible with OZ's meta-transaction library_

### addressToCrumbId

```solidity
mapping(address => uint256) addressToCrumbId
```

Mapping of address to respective crumbId that stores its mask

### totalSupply

```solidity
uint256 totalSupply
```

_Total supply of Crumb tokens_

### baseURI

```solidity
string baseURI
```

_Base uri of crumbs_

### CrumbCreated

```solidity
event CrumbCreated(address owner, uint256 crumbId, string mask)
```

Emitted when a crumb is created

| Name | Type | Description |
| ---- | ---- | ----------- |
| owner | address | Indexed address of data requester |
| crumbId | uint256 | Indexed crumb id |
| mask | string | Mask string |

### CrumbBurnt

```solidity
event CrumbBurnt(address owner, uint256 crumbId)
```

Emitted when a crumb is burnt

| Name | Type | Description |
| ---- | ---- | ----------- |
| owner | address | Indexed address of data requester |
| crumbId | uint256 | Indexed crumb id |

### constructor

```solidity
constructor(address trustedForwarder, string baseURInew) public
```

_Initializes the contract with the base URI, then disables any initializers as recommended by OpenZeppelin_

### initialize

```solidity
function initialize(string baseURI_) public
```

Initializes the contract

_Uses the initializer modifier to to ensure the contract is only initialized once_

### createCrumb

```solidity
function createCrumb(uint256 crumbId, string mask) public
```

Mints user a crumb

| Name | Type | Description |
| ---- | ---- | ----------- |
| crumbId | uint256 | Id of the crumb token |
| mask | string | String of mask of the calling address's private key |

### burnCrumb

```solidity
function burnCrumb(uint256 crumbId) public
```

Burns user's crumb

| Name | Type | Description |
| ---- | ---- | ----------- |
| crumbId | uint256 | Id of the crumb token |

### _baseURI

```solidity
function _baseURI() internal view virtual returns (string baseURI_)
```

Gets the Crumb tokens base URI

### setBaseURI

```solidity
function setBaseURI(string newURI) public
```

Sets the Crumb tokens base URI

| Name | Type | Description |
| ---- | ---- | ----------- |
| newURI | string | New base uri |

### _beforeTokenTransfer

```solidity
function _beforeTokenTransfer(address from, address to, uint256 crumbId) internal
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

