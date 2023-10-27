![Snickerdoodle Protocol](https://github.com/SnickerdoodleLabs/Snickerdoodle-Theme-Light/blob/main/snickerdoodle_horizontal_notab.png?raw=true)

# EIP-7529

The introduction of DNS-over-HTTPS (DoH) in [RFC 8484](https://www.rfc-editor.org/rfc/rfc8484) has enabled tamper-resistant client-side queries of DNS records directly from the browser context. [ERC-7529](./eip-7529.md) describes a simple standard leveraging DoH to fetch TXT records which are used for discovering and verifying the association of a smart contract with a common DNS domain.

This package is a library for interacting with and verifying EIP-7529 compliant contracts. It manages DoH as well as smart contract manipulation and interaction via the [Ethers](https://github.com/ethers-io/ethers.js) library. It should work on any [EVM-compatible](https://ethereum.org/en/developers/docs/evm) chain.

## Contract Pointers in TXT Records 

The owner of a domain name must create a TXT record in their DNS settings that serves as a pointer to all relevant smart contracts they wish to associate with their domain. 

[TXT records](https://www.rfc-editor.org/rfc/rfc1035#section-3.3.14) are not intended (nor permitted by most DNS servers) to store large amounts of data. Every DNS provider has their own vendor-specific character limits. However, an EVM-compatible address string is 42 characters, so most DNS providers will allow for dozens of contract addresses to be stored under a single record. Furthermore, a domain is allowed to have multiple TXT records associated with the same host and the content of all duplicate records can be retrived in a single DoH query. 

The TXT record msut adhere to the following schema:

- `HOST`: ERC-7529.`chain_id`._domaincontracts
- `VALUE`: \<address 1\>,\<address 2\>,...

This `HOST` naming scheme is designed to mimic the [DKIM](https://www.rfc-editor.org/rfc/rfc6376) naming convention. Additionally, this naming scheme makes it simple to programmatically ascertain if any smart contracts are associated with the domain on a given blockchain network. Prepending with "ERC-7529" will prevent naming collisions. The value of `chain_id` is simply the integer associated with the target network (i.e. `1` for Ethereum mainnet or `42` for Polygon). So, a typical `HOST` might be: `ERC-7529.1._domainContracts`, `ERC-7529.42._domaincontracts`, etc.

It is RECOMMENDED that EVM address strings adhere to [ERC-1191](./eip-1191.md) so that the browser client can checksum the validity of the address and its target network before making an RPC call. 

Use `@snickerdoodlelabs/erc7529` to check for contracts associated with a domain like this:

```
import { ERC7529Utils } from "@snickerdoodlelabs/erc7529";

// check for contract addresses associated with snickerdoodle.com on the Fuji testnet
const domainContracts = ERC7529Utils.getContractsFromDOmain("snickerdoodle.com","43113");
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

```
import { ERC7529Contract } from "@snickerdoodlelabs/contracts-sdk";
import {
  ChainId,
  DomainName,
  EVMContractAddress,
  URLString,
} from "@snickerdoodlelabs/objects";

// write domains to a contract if you have write permissions

// read domains from a contract if it supports the interface


```

## Client-side Verification

The user client must verify that the eTLD+1 of the TXT record matches an entry in the `domains` list of the smart contract. This library handles that for you automatically: 

```
import { ERC7529Utils } from "@snickerdoodlelabs/erc7529";
import { ERC7529Contract } from "@snickerdoodlelabs/contracts-sdk";
import {
  ChainId,
  DomainName,
  EVMContractAddress,
  URLString,
} from "@snickerdoodlelabs/objects";

// check for contract addresses associated with snickerdoodle.com on the Fuji testnet
const domainContracts = ERC7529Utils.getContractsFromDOmain("snickerdoodle.com","43113");
```

## Security Considerations

Due to the reliance on traditional DNS systems, this ERC is susceptible to attacks on this technology, such as domain hijacking. Additionally, it is the responsibility of the smart contract author to ensure that `addDomain` and `removeDomain` are authenticated properly, otherwise an attacker could associate their smart contract with an undesirable domain, which would simply break the ability to verify association with the proper domain. 

It is worth noting that for an attacker to falsy verify a contract against a domain would require them to compromise both the DNS settings **and** the smart contract itself. In this scenario, the attacker has likely also compromised the business' email domains as well. 