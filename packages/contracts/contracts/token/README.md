# Snickerdoodle Protocol Token Contracts

## Token Contracts List and Function Overview

- [DoodleToken.sol](/packages/contracts/docs/token/DoodleToken.md)
  - Adopts OpenZeppelin's [ERC20Votes](https://docs.openzeppelin.com/contracts/4.x/api/token/erc20#ERC20Votes) with no customizations. Used if tokens are deployed on regular EVM chain.
- [Vester.sol](/packages/contracts/docs/token/Vester.md)
  - Handles the vesting schedule, plan and token release for token holders.
- [WDoodleToken.sol](/packages/contracts/docs/token/WDoodleToken.md)
  - Adopts OpenZeppelin's [ERC20Votes](https://docs.openzeppelin.com/contracts/4.x/api/token/erc20#ERC20Votes) with additional functions to wrap native tokens. Used if tokens are deployed on subnets to allow the native tokens to be compatible with ERC20 standard.
