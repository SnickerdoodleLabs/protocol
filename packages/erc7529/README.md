![Snickerdoodle Protocol](https://github.com/SnickerdoodleLabs/Snickerdoodle-Theme-Light/blob/main/snickerdoodle_horizontal_notab.png?raw=true)

# [EIP-7529](https://eips.ethereum.org/EIPS/eip-7529)

The introduction of DNS-over-HTTPS (DoH) in [RFC 8484](https://www.rfc-editor.org/rfc/rfc8484) has enabled tamper-resistant client-side queries of DNS records directly from a web application context using standard browser APIs. [ERC-7529](./eip-7529.md) describes a simple standard leveraging DoH to fetch TXT records which are used for discovering and verifying the association of a smart contract with a common DNS domain.

This package is a library for interacting with and verifying EIP-7529 compliant contracts. It manages DoH as well as smart contract manipulation and interaction via the [Ethers](https://github.com/ethers-io/ethers.js) library. It should work on any [EVM-compatible](https://ethereum.org/en/developers/docs/evm) chain.

## Motivation

As mainstream businesses begin to adopt public blockchain and digital asset technologies more rapidly, there is a growing need for a discovery/search mechanism (compatible with conventional web technologies) of smart contracts associated with a known business domain as well as reasonable assurance that the smart contract does indeed belong to the business owner of the DNS domain. The relatively recent introduction and widespread support of DoH means it is possible to make direct, tamper-resistant queries of DNS records straight from a web application context and thus leverage a simple TXT record as a pointer to an on-chain smart contract. Prior to the introduction of DoH, web (and mobile) applications *could not* access DNS records directly; instead they would have to relay requests through a trusted, proprietary service provider who could easily manipulate response results. 

According to Cloudflare, the two most common use cases of TXT records today are email spam prevention (via [SPF](https://www.rfc-editor.org/rfc/rfc7208), [DKIM](https://www.rfc-editor.org/rfc/rfc6376), and [DMARC](https://www.rfc-editor.org/rfc/rfc7489) TXT records) and domain name ownership verification. The use case considered here for on-chain smart contract discovery and verification is essentially analogous. 

A TXT pointer coupled with an appropriate smart contract interface (described in this proposal) yields a simple, yet flexible and robust mechanism for the client-side detection and reasonably secure verification of on-chain logic and digital assets associated with the owner of a domain name. For example, a stablecoin issuer might leverage this standard to provide a method for an end user or web-based end user client to ensure that the asset their wallet is interacting with is indeed the contract issued or controlled by the owner or administrator of a well known DNS domain.

**Example 1**:

A user visits merchant.com who accepts payments via paymentprocessor.com. The business behind paymentprocessor.com has previously released a stable coin for easier cross-border payments which adheres to this ERC. On the checkout page, paymentprocessor.com is mounted as an iframe component. If the user has installed a browser-extension wallet compatible with this standard, then the wallet can detect the domain of the iframe in the context of the checkout page, discover and verify the stable coin’s association with paymentprocessor.com, and automatically prompt to complete the purchase in paymentprocessor.com’s stable coin.

**Example 2**:

A user visits nftmarketplace.io to buy a limited release NFT from theirfavoritebrand.com. The marketplace app can leverage this ERC to allow the user to search by domain name and also indicate to the user that an NFT of interest is indeed an authentic asset associated with theirfavoritebrand.com. 

## Installation

NPM:

```sh
npm install @snickerdoodlelabs/erc7529 --save
npm install @snickerdoodlelabs/objects --save
npm install @snickerdoodlelabs/contracts-sdk --save
```

Yarn:

```sh
yarn add @snickerdoodlelabs/erc7529
yarn add @snickerdoodlelabs/objects
yarn add @snickerdoodlelabs/contracts-sdk
```

#### Definition: eTLD+1 

The term TLD stands for *top-level domain* and is always the part of a domain name which follows the final dot in a URL (e.g. `.com` or `.net`). If only domains directly under TLDs where registrable by a single organization, then it would be guaranteed that `myexample.com`, `abc.myexample.com`, and `def.myexample.com` all belonged to the same organization. 

However, this is not the case in general since many DNS registrars allow organizations to register domain names below the top level (examples include `sussex.ac.uk` and `aber.ac.uk` which are controlled by different institutions). These types of domains are referred to as eTLDs (effective top-level domains) and represent a domain under which domain names can be registered by a single organization. For example, the eTLD of `myexample.com` is `.com` and the eTLD of `sussex.ac.uk` is `.ac.uk` since individual organizations can be issued their own domain names under both `.com` and `.ac.uk`. 

Therefore, an eTLD+1 is an eTLD *plus* this next part on the domain name. Since eTLDs are by definition registerable, all domains with the same eTLD+1 are owned by the same organization, which makes them appropriate to utilize in this proposal for associating a smart contract with a single business or organization entity. 

## Contract Pointers in TXT Records 

The owner of an eTLD+1 domain name MUST create a TXT record in their DNS settings that serves as a pointer to all relevant smart contracts they wish to associate with their domain.

[TXT records](https://www.rfc-editor.org/rfc/rfc1035#section-3.3.14) are not intended (nor permitted by most DNS servers) to store large amounts of data. Every DNS provider has their own vendor-specific character limits. However, an EVM-compatible address string is 42 characters, so most DNS providers will allow for dozens of contract addresses to be stored under a single record. Furthermore, a domain is allowed to have multiple TXT records associated with the same host and the content of all duplicate records can be retrieved in a single DoH query.

A TXT record pointing to an organization’s smart contracts MUST adhere to the following schema:

- `HOST`: ERC-7529.`chain_id`._domaincontracts
- `VALUE`: \<address 1\>,\<address 2\>,...

This `HOST` naming scheme is designed to mimic the [DKIM](https://www.rfc-editor.org/rfc/rfc6376) naming convention. Additionally, this naming scheme makes it simple to programmatically ascertain if any smart contracts are associated with the domain on a given blockchain network. Prepending with "ERC-7529" will prevent naming collisions. The value of `chain_id` is simply the integer associated with the target network (i.e. `1` for Ethereum mainnet or `42` for Polygon). So, a typical `HOST` might be: `ERC-7529.1._domainContracts`, `ERC-7529.42._domaincontracts`, etc.

It is recommended that EVM address strings adhere to [ERC-1191](./eip-1191.md) so that the browser client can checksum the validity of the address and its target network before making an RPC call. 

Use `@snickerdoodlelabs/erc7529` to check for contracts associated with a domain like this:

```typescript
import { staticUtils } from "@snickerdoodlelabs/erc7529";
import { ChainId, DomainName } from "@snickerdoodlelabs/objects";

// check for contract addresses associated with snickerdoodle.com on the Fuji testnet
const domainName = DomainName("snickerdoodle.com");
const chainId = ChainId(43113);
const results = await staticUtils.getContractsFromDomain(domainName,chainId);

if (results.isOk()) }{
  console.log("Contracts: ", results.value);
}
```

## Smart Contract Association with a Domain 

Any smart contract MAY implement this ERC to provide a verification mechanism of smart contract addresses listed in a compatible TXT record.

A smart contract need only store one new member variable, `domains`, which is a mapping from the keccak256 hash of all eTLD+1 domain strings associated with the business or organization which deployed (or is closely associated with) the contract to a boolean. This member variable can be written to with the external functions `addDomain` and `removeDomain`. The `domains` member variable can be queried by the `checkDomain` function which takes a string representing an eTLD+1 and returns true
if the contract has been associated with the domain and false otherwise. 

Lastly, the contract MAY emit events when eTLD+1 domains are added (`AddDomain`) or removed (`RemoveDomain`) from the `domains` map. This can be useful for 
determining all domains associated with a contract when they are not known ahead of time by the client. 

```solidity
{
  /// @notice Optional event emitted when a domain is added
  /// @param domain eTLD+1 associated with the contract
  event AddDomain(string domain);

  /// @notice Optional event emitted when a domain is removed
  /// @param domain eTLD+1 that is no longer associated with the contract
  event RemoveDomain(string domain);

  /// @dev a mapping from the keccak256 hash of eTLD+1 domains associated with this contract to a boolean
  mapping(bytes32 => bool) domains;

  /// @notice a getter function that takes an eTLD+1 domain string and returns true if associated with the contract
  /// @param domain a string representing an eTLD+1 domain
  function checkDomain(string calldata domain) external view returns (bool); 

  /// @notice an authenticated method to add an eTLD+1 domain
  /// @param domain a string representing an eTLD+1 domain associated with the contract
  function addDomain(string calldata domain) external;

  /// @notice an authenticated method to remove an eTLD+1 domain
  /// @param domain a string representing an eTLD+1 domain that is no longer associated with the contract
  function removeDomain(string calldata domain) external; 
}
```

Use `@snickerdoodlelabs/contracts-sdk` to interact with this interface on any contract on any EVM-compatible network: 

```typescript
import { ethers } from "ethers";
import { ERC7529ContractProxy } from "@snickerdoodlelabs/contracts-sdk";
import {
  ChainId,
  DomainName,
  EVMContractAddress,
  URLString,
} from "@snickerdoodlelabs/objects";

// set up your Ethers provider object
const myEthersProvider = new ethers.providers.JsonRpcProvider();

// get an Ethers signer object if you are going to be writing new domains
const myEthersSigner = myEthersProvider.getSigner();

// get an object handle on your contract
const myContractAddress = EVMContractAddress("0x...");
const myERC7529Contract = new ERC7529ContractProxy(myEthersSigner, myContractAddress);

// write domains to a contract if you have write permissions
await myERC7529Contract.addDomain("example.com");
await myERC7529Contract.removeDomain("example.com");

// check if a domain is associated with the contract
const result = await myERC7529Contract.checkDomain("example.com");
if (result.isOk()) {
  console.log("Contract Domains: ", result.value);
}
```

## Client-side Verification

The user client must verify that the eTLD+1 of the TXT record matches an entry in the `domains` list of the smart contract. This library handles that for you automatically: 

```typescript
import { ethers } from "ethers";
import { staticUtils } from "@snickerdoodlelabs/erc7529";
import { ERC7529ContractProxy } from "@snickerdoodlelabs/contracts-sdk";
import {
  ChainId,
  DomainName,
  EVMContractAddress,
  URLString,
} from "@snickerdoodlelabs/objects";

// set up your Ethers provider object
const myEthersProvider = new ethers.providers.JsonRpcProvider();

// check for contract addresses associated with snickerdoodle.com on the Fuji testnet
const domainName = DomainName("snickerdoodle.com");
const chainId = ChainId(43113);
const contractAddresses = await staticUtils.getContractsFromDomain(domainName,chainId);

// get an object handle on your contract
const myContractAddress = contractAddresses.value[0];
const myERC7529Contract = new ERC7529ContractProxy(myEthersProvider, myContractAddress);

// verify that the contracts at those addresses on Fuji testnet point back to snickerdoodle.com 
const isVerified = await staticUtils.verifyContractForDomain(myERC7529Contract, domainName, chainId);
console.log(isVerified.value);
```

## Security Considerations

Due to the reliance on traditional DNS systems, this ERC is susceptible to attacks on this technology, such as domain hijacking. Additionally, it is the responsibility of the smart contract author to ensure that `addDomain` and `removeDomain` are authenticated properly, otherwise an attacker could associate their smart contract with an undesirable domain, which would simply break the ability to verify association with the proper domain. 

It is worth noting that for an attacker to falsy verify a contract against a domain would require them to compromise both the DNS settings **and** the smart contract itself. In this scenario, the attacker has likely also compromised the business' email domains as well. 