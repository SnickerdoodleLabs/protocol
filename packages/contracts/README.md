# Snickerdoodle Protocol Contracts and CLI Tool

This package contains two sections at the moment: 
1. Snickerdoodle Protocol Contracts - contains the Hardhat project of the latest contracts for of the SDL protocol.
2. Snickerdoodle Labs CLI - contains commands for for rapid prototyping with SDQL and insight service based on the HardHat framework.

# Snickerdoodle Protocol Contracts 

This Hardhat project contains the Snickerdoodle Protocol's contracts, unit tests and deployment script to deploy the contracts. 

## Installation
Steps to install and run this project this locally:

1. Clone the repo 
```shell
git clone https://github.com/SnickerdoodleLabs/SDL-Contracts.git
```
2. Install the npm packages 
```shell
cd SDL-Contracts
npm install
```
3. Compile the contracts  
```shell
npx hardhat compile
```
4. Test the contracts  
```shell
npx hardhat test
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


***
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

## Starting a local IPFS node

To start a local IPFS, you need `docker-compose` installed on you machine:

```
docker-compose up -d
```

This will start a node inside a docker container named `ipfs_host`. Once it is started, you can interact with
it through its build-in browser-based [GUI](http://localhost:5001/webui). The container mounts two data volumes,
`ipfs_staging` and `ipfs_data`, to persist the node identity and files you've pinned between starts. You can clear
this data with the docker cli, `docker volume prune`.

You can shut the node down like this:

```
docker-compose down
```

Make sure you can pin an asset to the node like this:

```
npx hardhat ipfstest
```

If it's successful, it should output the following:

```
{
  path: 'QmZoBFCYa4gJRYhpKuVWXon461apqQYKb7FUqS2h9HPM3e',
  cid: CID(QmZoBFCYa4gJRYhpKuVWXon461apqQYKb7FUqS2h9HPM3e),
  size: 21
}
```

## IPFS Tasks

Canned IPFS methods are written in `.\tasks\ipfs.js` and registered with the Hardhat cli via `hardhat.config.js`.

Try pinning the readme to your local IPFS node like this:

```
npx hardhat pinToIPFS --filename README.md
/*
{
  path: 'filename',
  cid: CID(QmdsB4FMQ2jBfrTL2kx6Eaq5Up8rF44h6aqPP9BPpHDAq9),
  size: 1672
}
*/
```

Then retrieve it and write it to a local file named after the CID:

```
npx hardhat getIPFSCID --cid QmdsB4FMQ2jBfrTL2kx6Eaq5Up8rF44h6aqPP9BPpHDAq9
/*
This will write a file locally named QmdsB4FMQ2jBfrTL2kx6Eaq5Up8rF44h6aqPP9BPpHDAq9
containing the contents of the README you pinned in the first step.
*\
```

## Consent Contract Tasks

First start a hardhat node to host the consent contracts on a local dev network:
You need to specify the port to bypass hardhat bug.

```
npx hardhat node --port 8569
```

Leave this process running and start a new terminal/console. In the new console, deploy the
contract stack:
network 'dev' is configured to listen to 8569

```
npx hardhat run scripts/deployment.js --network dev

/*
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
*/
```
Next, you make a request to the factory to create a consent contract. Provide the address to set as the owner of the deployed Consent contract.
```
npx hardhat createConsentContract --owneraddress 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 --network dev
/*
Owner of Consent deployed : 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
Deployed BeaconProxy Consent address [ '0xCafac3dD18aC6c6e92c921884f9E4176737C052c' ]
*/
```

You can check confirm the deployed consent contract by running a check against the factory.
```
npx hardhat checkConsentsDeployedByOwner --owneraddress 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 --network dev
/*
Deployment count:  1
  Requester address:  0x70997970C51812dc3A010C7d01b50e0d17dc79C8
  Address of the deployed Consent's BeaconProxy: 0xCafac3dD18aC6c6e92c921884f9E4176737C052c
*/
```

You can now submit a few `requestForData` transaction in order to generate a few
`RequestForData` events that can be picked up by an event listener subscribed to
the contract. Provide the target consent address, the CID, and the index of the connect wallet that is the owner of the Consent contract (in this example, Hardhat's default test wallet's index 1 is account address 0x70997970C51812dc3A010C7d01b50e0d17dc79C8)

```
npx hardhat requestForData --network dev --consentaddress 0xCafac3dD18aC6c6e92c921884f9E4176737C052c --owneraddressindex 1 --cid QmdsB4FMQ2jBfrTL2kx6Eaq5Up8rF44h6aqPP9BPpHDAq9

/*
Data request was successful!
*/

npx hardhat requestForData --network dev --consentaddress 0xCafac3dD18aC6c6e92c921884f9E4176737C052c --owneraddressindex 1 --cid QmdsB4FMQ2jBfrTL2kx6Eaq5Up8rF44h6aqPP9BPpHDAq8

/*
Data request was successful!
*/

npx hardhat requestForData --network dev --consentaddress 0xCafac3dD18aC6c6e92c921884f9E4176737C052c --owneraddressindex 1 --cid QmdsB4FMQ2jBfrTL2kx6Eaq5Up8rF44h6aqPP9BPpHDAq7

/*
Data request was successful!
*/
```

Finally, retrieve a list of the requested data through the events emitted by passing in the arguments for the target consent address and the owner's address. 
```
npx hardhat listRequestedDataByOwner --consentaddress 0xCafac3dD18aC6c6e92c921884f9E4176737C052c --owneraddress 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 --network dev

/*
Queried address: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8

Request number:  1
  Owner address:  0x70997970C51812dc3A010C7d01b50e0d17dc79C8
  Requested CID: QmdsB4FMQ2jBfrTL2kx6Eaq5Up8rF44h6aqPP9BPpHDAq9

Request number:  2
  Owner address:  0x70997970C51812dc3A010C7d01b50e0d17dc79C8
  Requested CID: QmdsB4FMQ2jBfrTL2kx6Eaq5Up8rF44h6aqPP9BPpHDAq6

Request number:  3
  Owner address:  0x70997970C51812dc3A010C7d01b50e0d17dc79C8
  Requested CID: QmdsB4FMQ2jBfrTL2kx6Eaq5Up8rF44h6aqPP9BPpHDAq5
*/
```

When an address that does not have the required role on the Consent contract's function tries to excute it, the transaction will revert. In the example below, owner address index 2 (0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc), does not have the MINTER_ROLE to request for data. Trying to make a request for data will fail. 
```
npx hardhat requestForData --network dev --consentaddress 0xCafac3dD18aC6c6e92c921884f9E4176737C052c --owneraddressindex 2 --cid QmdsB4FMQ2jBfrTL2kx6Eaq5Up8rF44h6aqPP9BPpHDAq8

/*
...
AccessControl: account 0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc is missing role 0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6 //bytes32 of 'MINTER_ROLE'
*/
```

To solve this, we can grant roles to specific addresses to allow access to certain functions on the Consent contract.
The example below grants 0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc the MINTER_ROLE. 
```
npx hardhat grantRole --consentaddress 0xCafac3dD18aC6c6e92c921884f9E4176737C052c --owneraddressindex 1 --address 0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc --role MINTER_ROLE  --network dev

/*
Consent address: 0xCafac3dD18aC6c6e92c921884f9E4176737C052c

Address 0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc has been granted role MINTER_ROLE
*/
```

Now it would be able to request for data as it was a function only executed by an address with the MINTER_ROLE. 
0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc in this example is the address of index 2 in Hardhat's default addresses. 
```
npx hardhat requestForData --network dev --consentaddress 0xCafac3dD18aC6c6e92c921884f9E4176737C052c --owneraddressindex 2 --cid QmdsB4FMQ2jBfrTL2kx6Eaq5Up8rF44h6aqPP9BPpHDAq8

/*
Data request was successful!
*/
```

Similarly, we can also revoke the role as below. 
```
npx hardhat revokeRole --consentaddress 0xCafac3dD18aC6c6e92c921884f9E4176737C052c --owneraddressindex 1 --address 0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc --role MINTER_ROLE  --network dev

/*
Consent address: 0xCafac3dD18aC6c6e92c921884f9E4176737C052c

Address 0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc has been revoked of role MINTER_ROLE
*/
```

Now when an address has been revoked the MINTER_ROLE tries to request for data, the transaction reverts with the following error.
```
npx hardhat requestForData --network dev --consentaddress 0xCafac3dD18aC6c6e92c921884f9E4176737C052c --owneraddressindex 2 --cid QmdsB4FMQ2jBfrTL2kx6Eaq5Up8rF44h6aqPP9BPpHDAq8

/*
...
AccessControl: account 0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc is missing role 0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6 //bytes32 of 'MINTER_ROLE'
*/
```


## Docker

A pre-built docker image for local development against the contract stack is available at 
[`snickerdoodlelabs/devchain`](https://hub.docker.com/repository/docker/snickerdoodlelabs/devchain). 
Run locally like this:

```shell
docker run -p 8545:8569 --name devchain --rm snickerdoodlelabs/devchain
   ```


