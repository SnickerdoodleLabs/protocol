# Sift

Snickerdoodle Protocol's Sift Contract

_The Sift contract is a simple registry that tracks verified or malicious urls
If a url has been verified by the Snickerdoodle team, it is minted with a Sift ERC721 token with a 'VERIFIED' tokenURI
If a url has been identified as malicious, it is minted a 'MALICIOUS' tokenURI
SDL's data wallet browser extension will query the Sift contract with the url that its user is visiting
Each url that enters the registry is mapped to a token id that has the corresponding tokenURI describe above
If the url does not have a tokenId minted against it, the contract returns the 'NOT VERIFIED' status_

### _tokenIdCounter

```solidity
struct CountersUpgradeable.Counter _tokenIdCounter
```

### urlToTokenId

```solidity
mapping(bytes32 => uint256) urlToTokenId
```

_mapping of hashed url to tokenId_

### baseURI

```solidity
string baseURI
```

_Base uri of Sift_

### totalSupply

```solidity
uint256 totalSupply
```

_Total supply of Sift tokens_

### VERIFIER_ROLE

```solidity
bytes32 VERIFIER_ROLE
```

_Role bytes_

### constructor

```solidity
constructor(string baseURInew) public
```

_Initializes the contract with the base URI, then disables any initializers as recommended by OpenZeppelin_

### initialize

```solidity
function initialize(string baseURI_) public
```

Initializes the contract

_Uses the initializer modifier to to ensure the contract is only initialized once_

### verifyURL

```solidity
function verifyURL(string url, address owner) external
```

Verifies a url

_Mints an NFT with the 'VERIFIED' tokenURI
Only addresses with VERIFIER_ROLE can call it and is checked in _safeMintAndRegister()_

| Name | Type | Description |
| ---- | ---- | ----------- |
| url | string | Site URL |
| owner | address | Address receiving the url's NFT |

### maliciousURL

```solidity
function maliciousURL(string url, address owner) external
```

Marks a url as malicious

_Mints an NFT with the 'MALICIOUS' tokenURI
Only addresses with VERIFIER_ROLE can call it and is checked in _safeMintAndRegister()_

| Name | Type | Description |
| ---- | ---- | ----------- |
| url | string | Site URL |
| owner | address | Address receiving the url's NFT |

### checkURL

```solidity
function checkURL(string url) external view returns (string result)
```

Checks the status of a url

| Name | Type | Description |
| ---- | ---- | ----------- |
| url | string | Site URL |

| Name | Type | Description |
| ---- | ---- | ----------- |
| result | string | Returns the token uri of 'VERIFIED', 'MALICIOUS', or 'NOT VERIFIED' |

### setBaseURI

```solidity
function setBaseURI(string newURI) public
```

Sets the Sift tokens base URI

| Name | Type | Description |
| ---- | ---- | ----------- |
| newURI | string | New base uri |

### _safeMintAndRegister

```solidity
function _safeMintAndRegister(address to, string uri, string url) internal
```

Internal function to carry out token minting and mapping updates

| Name | Type | Description |
| ---- | ---- | ----------- |
| to | address | Address receiving the token |
| uri | string | Token uri containing status |
| url | string | Site URL |

### _baseURI

```solidity
function _baseURI() internal view virtual returns (string baseURI_)
```

Override _baseURI to return the Sift tokens base URI

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

