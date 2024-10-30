![Contracts](https://github.com/SnickerdoodleLabs/Snickerdoodle-Theme-Light/blob/main/snickerdoodle_horizontal_notab.png?raw=true)

# Snickerdoodle Protocol Contracts Package

## Package Contents

- [contracts](/packages/contracts/contracts/): Subdirectory containing all Snickerdoodle Protocol smart contracts
- [docs](/packages/contracts/docs/): Auto-generated API documentation of public and external contract methods
- [scripts](/packages/contracts/scripts/): Hardhat [scripts](https://hardhat.org/guides/scripts.html) for deploying different configurations of the smart contract stack
- [tasks](/packages/contracts/tasks/): Hardhat [task definitions](https://hardhat.org/guides/create-task.html) for interacting with smart contract deployments
- [test](/packages/contracts/test/): Hardhat [unit tests](https://hardhat.org/guides/waffle-testing.html) for the Snickerdoodle Protocol smart contract stack
- [hardhat.config.js](/packages/contracts/hardhat.config.js): [Configuration file](https://hardhat.org/config/) for the Hardhat development framework

## Summary

The Snickerdoodle Contracts stack consists of the following primary components:

### [ad-wallet](/packages/contracts/contracts/user-wallet/README.md)

Contains ad wallet contracts

### [user-wallet](/packages/contracts/contracts/user-wallet/README.md)

Contains the upgradable smart wallet implementation and an associated Layer Zero featured contract factory.

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