# Snickerdoodle Protocol Registry Contracts

## Register Contracts List and Function Overview

- [Crumbs.sol](/packages/contracts/docs/registry/Crumbs.md)
  - Serves as an account recovery registry. Users create Crumbs (ERC721 NFTs) and store hashes in the token's URI. These hashes allow users to recover their private keys.
- [Sift.sol](/packages/contracts/docs/registry/Sift.md)
  - Serves as a URL verification registry. URLs stored on this contract are minted a Sift token (ERC721 NFT) and tagged as VERIFIED or MALICIOUS in its token URI.
