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

## Deployment Addresses

A list of Snickerdoodle Protocol contract addresses can be found [here](/packages/contracts/DEPLOYMENTS.md). 

## Install Dependencies

Steps to install and run this project this locally:

```shell
git clone https://github.com/SnickerdoodleLabs/protocol.git
cd packages/contracts
npm install
```

## Compiling Contracts 

```shell
npx hardhat compile
```

## Deployment

Steps to deploy the contracts locally:

1. Spin up a local hardhat node, this will run a local blockchain network on localhost.

```shell
npx hardhat node
```

2. On a separate terminal, run the deployment scripts

```shell
npx hardhat run scripts/deployment.js --network localhost
```

3. If the deployment was successful, you should see the following in logged (addresses will differ).

```shell
Deploying Consent implementation contract...
Consent implementation contract deployed to: 0x5081a39b8A5f0E35a8D959395a630b68B74Dd30f

Deploying Consent Factory contract...
Consent Factory deployed to: 0x1fA02b2d6A771842690194Cf62D91bdd92BfE28d

Deploying UpgradeableBeacon contract...
UpgradeableBeacon deployed to: 0xdbC43Ba45381e02825b14322cDdd15eC4B3164E6

Setting beacons address on Consent Factory...
Beacon address on Consent Factory set to: 0xdbC43Ba45381e02825b14322cDdd15eC4B3164E6

Deploying Doodle Token contract...
DoodleToken deployed to: 0x4C4a2f8c81640e47606d3fd77B353E87Ba015584

Deploying Timelock Controller contract...
SnickerdoodleTimeLock deployed to: 0x21dF544947ba3E8b3c32561399E88B52Dc8b2823

Deploying SnickerdoodleGovernor (DAO) contract...
SnickerdoodleGovernor deployed to: 0x2E2Ed0Cfd3AD2f1d34481277b3204d807Ca2F8c2

Full deployment successful!
```

4. Hurray! To summarize with some details, you have successfully deployed:
   - the Consent implementation contract,
   - the Consent Factory contract,
   - the UpgradeableBeacon contract that the Beacon Proxies deployed by the Consent Factory contract points to upon creating a new 'Consent' instance, which in turn points to the Consent implementation contract deployed,
   - the Doodle Token contract,
   - the Timelock Controller contract that will help govern the proposal and execution processes on the SnickerdoodleGovernor contract,
   - the SnickerdoodleGovernor contract which serves as the DAO.

---

# Snickerdoodle Labs CLI

A command line interface tool based on the Hardhat framework for rapid prototyping with SDQL and insight service.

## System Requirements

In order to use all capabilities of the CLI, you need the following tools installed on your machine:

1. [Nodejs](https://nodejs.org/en/)
2. [Docker engine](https://docs.docker.com/engine/install/)
3. [Docker Compose](https://docs.docker.com/compose/install/)

## Getting Started

Clone the repository and install local dependencies:

```
git clone https://github.com/SnickerdoodleLabs/SDL-Contracts.git
cd SDL-Contracts
npm install
```

Look at available tasks defined by the CLI:

```
npx hardhat --help
```

## Docker

A pre-built docker image for local development against the contract stack is available at
[`snickerdoodlelabs/devchain`](https://hub.docker.com/repository/docker/snickerdoodlelabs/devchain).
Run a local subnet like this:

```shell
docker run -d -p 8569:9650 --name devchain --rm --env NETWORK=subnet snickerdoodlelabs/devchain
```

Check the status of the subnet like this:

```shell
docker exec devchain avalanche network status
```

Run a regular old hardhat node like this:

```shell
docker run -d -p 8569:8569 --name devchain --rm --env NETWORK=dev snickerdoodlelabs/devchain
```