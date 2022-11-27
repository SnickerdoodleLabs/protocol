# Snickerdoodle Protocol Consent Contracts

## Consent Contracts List and Function Overview

- [Consent.sol](/packages/contracts/docs/consent/Consent.md)
  - The Consent implementation contract that is deployed by the ConsentFactory when a new Consent contract is created by a user.
  - Contains logic for users to opt-in and out of sharing their data.
- [ConsentFactory.sol](/packages/contracts/docs/consent/ConsentFactory.md)
  - Allows users to create new Consent contracts.
  - Stores various mappings and queries to obtain ownership of Consent contracts, and contracts in which users have specific roles on.
