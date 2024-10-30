![Contracts](https://github.com/SnickerdoodleLabs/Snickerdoodle-Theme-Light/blob/main/snickerdoodle_horizontal_notab.png?raw=true)

# Snickerdoodle Protocol Contracts Package

## Package Contents

- [contracts](/packages/contracts/contracts/): Subdirectory containing all Snickerdoodle Protocol smart contracts
- [docs](/packages/contracts/docs/): Auto-generated API documentation of public and external contract methods
- [scripts](/packages/contracts/scripts/): Hardhat [scripts](https://hardhat.org/guides/scripts.html) for deploying different configurations of the smart contract stack
- [subnets](/packages/contracts/subnets/): A subdirectory containing configurations for launching local, testnet, and mainnet [Avalanche Subnets](https://docs.avax.network/subnets)
- [tasks](/packages/contracts/tasks/): Hardhat [task definitions](https://hardhat.org/guides/create-task.html) for interacting with smart contract deployments
- [test](/packages/contracts/test/): Hardhat [unit tests](https://hardhat.org/guides/waffle-testing.html) for the Snickerdoodle Protocol smart contract stack
- [hardhat.config.js](/packages/contracts/hardhat.config.js): [Configuration file](https://hardhat.org/config/) for the Hardhat development framework

## Summary

The Snickerdoodle Contracts stack consists of the following primary components:

### [consent](/packages/contracts/contracts/consent/README.md)

Contains an upgradable EIP721 compatible NFT implementation and an associated contract factory.

### [token](/packages/contracts/contracts/token/README.md)

Contains an EIP20 compatible token, wrapper token (for subnet deployments), and a vesting contract.

### [registry](/packages/contracts/contracts/registry/README.md)

Contains an EIP721 compatible registry contract for storing Snickerdoodle account recovery details.

### [governance](/packages/contracts/contracts/governance/README.md)

Contains the implementation of the Snickerdoodle Protocol governance DAO.

### Install Dependencies

Steps to install and run this project this locally:

```shell
git clone https://github.com/SnickerdoodleLabs/protocol.git
cd protocol
yarn install
```

### Compiling Contracts

Use Hardhat to compile the protocol contracts like this:

```shell
cd /packages/contracts
yarn compile
yarn test
```

This command will create a subdirectory called `artifacts` which will contain the contract [ABI](https://docs.soliditylang.org/en/v0.8.13/abi-spec.html) and bytecode for all contracts in the `contracts` subdirectory.

### Docker

A pre-built docker image for local development against the contract stack is available at
[`snickerdoodlelabs/devchain`](https://hub.docker.com/repository/docker/snickerdoodlelabs/devchain).
Run a local subnet like this:

```shell
docker run -d -p 8545:8545 --rm snickerdoodlelabs/devchain
```

Run a [Hardhat node](https://hardhat.org/hardhat-network/docs/overview) like this:

```shell
docker run -d -p 8569:8569 --name devchain --rm --env NETWORK=dev snickerdoodlelabs/devchain
```

## Deployment Addresses

A list of Snickerdoodle Protocol contract addresses can be found [here](/packages/contracts/DEPLOYMENTS.md).
