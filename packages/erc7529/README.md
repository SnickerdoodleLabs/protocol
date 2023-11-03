![Snickerdoodle Protocol](https://github.com/SnickerdoodleLabs/Snickerdoodle-Theme-Light/blob/main/snickerdoodle_horizontal_notab.png?raw=true)

# ERC-7529

The introduction of DNS-over-HTTPS (DoH) in [RFC 8484](https://www.rfc-editor.org/rfc/rfc8484) has enabled tamper-resistant client-side queries of DNS records directly from the browser context. [ERC-7529](./erc-7529.md) describes a simple standard leveraging DoH to fetch TXT records which are used for discovering and verifying the association of a smart contract with a common DNS domain.

This package is a library for interacting with and verifying ERC-7529 compliant contracts. It manages DoH as well as smart contract manipulation and interaction via the [Ethers](https://github.com/ethers-io/ethers.js) library. It should work on any [EVM-compatible](https://ethereum.org/en/developers/docs/evm) chain.

## Motivation

As mainstream businesses begin to adopt public blockchain and digital asset technologies more rapidly, there is a growing need for a discovery/search mechanism (compatible with conventional browser resources) of smart contracts associated with a known business domain as well as reasonable assurance that the smart contract does indeed belong to the business owner of the DNS domain. The relatively recent introduction and widespread support of DoH means it is possible to make direct queries of DNS records straight from the browser context and thus leverage a simple TXT record as a pointer to an on-chain smart contract. 

A TXT pointer coupled with an appropriate smart contract interface (described in this ERC) yields a simple, yet flexible and robust mechanism for the client-side detection and reasonably secure verification of on-chain logic and digital assets associated with a the owner of a domain name. For example, a stablecoin issuer might leverage this standard to provide a method for an end user or web-based end user client to ensure that the asset their wallet is interacting with is indeed the contract issued or controlled by the owner or administrator of a well known DNS domain.

**Example 1**:

A user visits merchant.com who accepts payments via paymentprocessor.com. The business behind paymentprocessor.com has previously released a stable coin for easier cross-border payments which adheres to this ERC. On the checkout page, paymentprocessor.com is mounted as an iframe component. If the user has installed a browser-extension wallet compatible with this standard, then the wallet can detect the domain of the iframe in the context of the checkout page, discover and verify the stable coin's association with paymentprocessor.com, and automatically prompt to complete the purchase in paymentprocessor.com's stable coin. 

**Example 2**:

A user visits nftmarketplace.io to buy a limited release NFT from theirfavoritebrand.com. The marketplace app can leverage this ERC to allow the user to search by domain name and also indicate to the user that an NFT of interest is indeed an authentic asset associated with theirfavoritebrand.com. 

## Contract Pointers in TXT Records 

The owner of a domain name must create a TXT record in their DNS settings that serves as a pointer to all relevant smart contracts they wish to associate with their domain. 

[TXT records](https://www.rfc-editor.org/rfc/rfc1035#section-3.3.14) are not intended (nor permitted by most DNS servers) to store large amounts of data. Every DNS provider has their own vendor-specific character limits. However, an EVM-compatible address string is 42 characters, so most DNS providers will allow for dozens of contract addresses to be stored under a single record. Furthermore, a domain is allowed to have multiple TXT records associated with the same host and the content of all duplicate records can be retrived in a single DoH query. 

The TXT record must adhere to the following schema:

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
  console.log("Contracts: ", results.ok);
}
```

## Smart Contract Association with a Domain 

Any smart contract may implement this ERC to provide a verification mechanism of smart contract addresses listed in a compatible TXT record.

A smart contract need only store one new member variable, `domains`, which is an array of all unique eTLD+1 domains associated with the contract. This member variable can be written to with the external functions `addDomain` and `removeDomain`.

```solidity
{
  public string[] domains; // a string list of eTLD+1 domains associated with this contract
  function addDomain(string memory domain) external; // an authenticated method to add an eTLD+1
  function removeDomain(string memory domain) external; // an authenticated method to remove an eTLD+1
}
```

Use `@snickerdoodlelabs/contracts-sdk` to interact with this interface on any contract on any EVM-compatible network: 

```typescript
import { ethers } from "ethers";
import { ERC7529Contract } from "@snickerdoodlelabs/contracts-sdk";
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
const myERC7529Contract = new ERC7529Contract(myEthersSigner, myContractAddress);

// write domains to a contract if you have write permissions
await myERC7529Contract.addDomain("example.com");
await myERC7529Contract.removeDomain("example.com");

// read domains from a contract if it supports the interface
const result = await myERC7529Contract.getDomains();
if (result.isOk()) {
  console.log("Contract Domains: ", result.ok);
}
```

## Client-side Verification

The user client must verify that the eTLD+1 of the TXT record matches an entry in the `domains` list of the smart contract. This library handles that for you automatically: 

```typescript
import { ethers } from "ethers";
import { staticUtils } from "@snickerdoodlelabs/erc7529";
import { ERC7529Contract } from "@snickerdoodlelabs/contracts-sdk";
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
const myContractAddress = contractAddresses.ok[0];
const myERC7529Contract = new ERC7529Contract(myEthersProvider, myContractAddress);

// verify that the contracts at those addresses on Fuji testnet point back to snickerdoodle.com 
const isVerified = await staticUtils.verifyContractForDomain(myERC7529Contract, domainName, chainId);
console.log(isVerified.ok);
```

## Security Considerations

Due to the reliance on traditional DNS systems, this ERC is susceptible to attacks on this technology, such as domain hijacking. Additionally, it is the responsibility of the smart contract author to ensure that `addDomain` and `removeDomain` are authenticated properly, otherwise an attacker could associate their smart contract with an undesirable domain, which would simply break the ability to verify association with the proper domain. 

It is worth noting that for an attacker to falsy verify a contract against a domain would require them to compromise both the DNS settings **and** the smart contract itself. In this scenario, the attacker has likely also compromised the business' email domains as well. 