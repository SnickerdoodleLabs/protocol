![Snickerdoodle](https://github.com/SnickerdoodleLabs/Snickerdoodle-Theme-Light/blob/main/snickerdoodle_horizontal_notab.png?raw=true)

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
Deploying Consent Factory contract...
ConsentFactory deployed to: 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
ConsentFactory Gas Fee: 3368992

Deploying Doodle Token contract...
DoodleToken deployed to: 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
DoodleToken Gas Fee: 1769284

Deploying Timelock Controller contract...
SnickerdoodleTimeLock deployed to: 0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9
SnickerdoodleTimeLock Gas Fee: 2179751

Deploying SnickerdoodleGovernor (DAO) contract...
SnickerdoodleGovernor deployed to: 0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9
SnickerdoodleGovernor Gas Fee: 3673723

Deploying Crumbs contract...
Crumbs deployed to: 0x5FC8d32690cc91D4c39d9d3abcBD16989F875707
Crumbs Gas Fee: 2530175

Deploying Sift contract...
Sift deployed to: 0x0165878A594ca255338adfa4d48449f69242Eb8F
Sift Gas Fee: 2576760

Full deployment successful!
```

4. Hurray! To summarize with some details, you have successfully deployed:
   - the Consent implementation contract,
   - the Consent Factory contract which also deploys (through its constructor) the UpgradeableBeacon contract that the Beacon Proxies deployed by the Consent Factory contract points to upon creating a new 'Consent' instance, which in turn points to the Consent implementation contract deployed,
   - the Doodle Token contract,
   - the Timelock Controller contract that will help govern the proposal and execution processes on the SnickerdoodleGovernor contract,
   - the SnickerdoodleGovernor contract which serves as the DAO.
   - the Crumbs contract which will store all our registry of

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

## Consent Related Tasks

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
Deploying Consent Factory contract...
ConsentFactory deployed to: 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
ConsentFactory Gas Fee: 3368992

Deploying Doodle Token contract...
DoodleToken deployed to: 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
DoodleToken Gas Fee: 1769284

Deploying Timelock Controller contract...
SnickerdoodleTimeLock deployed to: 0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9
SnickerdoodleTimeLock Gas Fee: 2179751

Deploying SnickerdoodleGovernor (DAO) contract...
SnickerdoodleGovernor deployed to: 0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9
SnickerdoodleGovernor Gas Fee: 3673723

Deploying Crumbs contract...
Crumbs deployed to: 0x5FC8d32690cc91D4c39d9d3abcBD16989F875707
Crumbs Gas Fee: 2530175

Deploying Sift contract...
Sift deployed to: 0x0165878A594ca255338adfa4d48449f69242Eb8F
Sift Gas Fee: 2576760

Full deployment successful!
*/
```

Next, you make a request to the factory to create a consent contract. Provide the address to set as the owner of the deployed Consent contract.

```
npx hardhat createConsentContract --owneraddress 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 --baseuri www.uri.com --name MYCONSENT --network dev
/*
Owner of Consent deployed : 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
Deployed BeaconProxy Consent address : 0x9f1ac54BEF0DD2f6f3462EA0fa94fC62300d3a8e
*/
```

You can check confirm the deployed consent contract by running a check against the factory.

```
npx hardhat checkConsentsDeployedByOwner --owneraddress 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 --network dev
/*
Deployment count:  1
  Owner address:  0x70997970C51812dc3A010C7d01b50e0d17dc79C8
  Address of the deployed Consent BeaconProxy: 0x9f1ac54BEF0DD2f6f3462EA0fa94fC62300d3a8e
*/
```

You can now submit a few `requestForData` transaction in order to generate a few
`RequestForData` events that can be picked up by an event listener subscribed to
the contract. Provide the target consent address, the CID, and the index of the connect wallet that is the owner of the Consent contract (in this example, Hardhat's default test wallet's index 1 is account address 0x70997970C51812dc3A010C7d01b50e0d17dc79C8)

```
npx hardhat requestForData --network dev --consentaddress 0x9f1ac54BEF0DD2f6f3462EA0fa94fC62300d3a8e --owneraddressindex 1 --cid QmdsB4FMQ2jBfrTL2kx6Eaq5Up8rF44h6aqPP9BPpHDAq9

/*
Data request was successful!
*/

npx hardhat requestForData --network dev --consentaddress 0x9f1ac54BEF0DD2f6f3462EA0fa94fC62300d3a8e --owneraddressindex 1 --cid QmdsB4FMQ2jBfrTL2kx6Eaq5Up8rF44h6aqPP9BPpHDAq8

/*
Data request was successful!
*/

npx hardhat requestForData --network dev --consentaddress 0x9f1ac54BEF0DD2f6f3462EA0fa94fC62300d3a8e --owneraddressindex 1 --cid QmdsB4FMQ2jBfrTL2kx6Eaq5Up8rF44h6aqPP9BPpHDAq7

/*
Data request was successful!
*/
```

Finally, retrieve a list of the requested data through the events emitted by passing in the arguments for the target consent address and the owner's address.

```
npx hardhat listRequestedDataByOwner --consentaddress 0x9f1ac54BEF0DD2f6f3462EA0fa94fC62300d3a8e --owneraddress 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 --network dev

/*
Queried address: 0x9f1ac54BEF0DD2f6f3462EA0fa94fC62300d3a8e

Request number:  1
  Owner address:  0x70997970C51812dc3A010C7d01b50e0d17dc79C8
  Requested CID: QmdsB4FMQ2jBfrTL2kx6Eaq5Up8rF44h6aqPP9BPpHDAq9

Request number:  2
  Owner address:  0x70997970C51812dc3A010C7d01b50e0d17dc79C8
  Requested CID: QmdsB4FMQ2jBfrTL2kx6Eaq5Up8rF44h6aqPP9BPpHDAq8

Request number:  3
  Owner address:  0x70997970C51812dc3A010C7d01b50e0d17dc79C8
  Requested CID: QmdsB4FMQ2jBfrTL2kx6Eaq5Up8rF44h6aqPP9BPpHDAq7
*/
```

_Note: This step is WIP, pending check on querying indexed event using hashed value. Skip for now._
Alternatively, we can also search for the data requested by the owner if we have the keccak256 hash value of the IPFS CID.

```
npx hardhat keccak256 --input QmdsB4FMQ2jBfrTL2kx6Eaq5Up8rF44h6aqPP9BPpHDAq9

/*
0xea172f64d8e53ee2cffff03e0a04065867de5bbe379987734688b21f48db60ba
*/
```

```
npx hardhat listRequestedDataByCIDHex --consentaddress 0x9f1ac54BEF0DD2f6f3462EA0fa94fC62300d3a8e --cidhex 0xea172f64d8e53ee2cffff03e0a04065867de5bbe379987734688b21f48db60ba --network dev

/*
Queried address: 0x9f1ac54BEF0DD2f6f3462EA0fa94fC62300d3a8e

Request number:  1
  Owner address:  0x70997970C51812dc3A010C7d01b50e0d17dc79C8
  Requested CID: QmdsB4FMQ2jBfrTL2kx6Eaq5Up8rF44h6aqPP9BPpHDAq9

Request number:  2
  Owner address:  0x70997970C51812dc3A010C7d01b50e0d17dc79C8
  Requested CID: QmdsB4FMQ2jBfrTL2kx6Eaq5Up8rF44h6aqPP9BPpHDAq8

Request number:  3
  Owner address:  0x70997970C51812dc3A010C7d01b50e0d17dc79C8
  Requested CID: QmdsB4FMQ2jBfrTL2kx6Eaq5Up8rF44h6aqPP9BPpHDAq7
*/
```

When an address that does not have the required role on the Consent contract's function tries to excute it, the transaction will revert. In the example below, owner address index 2 (0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc), does not have the REQUESTER_ROLE to request for data. Trying to make a request for data will fail.

```
npx hardhat requestForData --network dev --consentaddress 0x9f1ac54BEF0DD2f6f3462EA0fa94fC62300d3a8e --owneraddressindex 2 --cid QmdsB4FMQ2jBfrTL2kx6Eaq5Up8rF44h6aqPP9BPpHDAq8

/*
An unexpected error occurred:
...
AccessControl: account 0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc is missing role 0x61a3517f153a09154844ed8be639dabc6e78dc22315c2d9a91f7eddf9398c002 //bytes32 of 'REQUESTER_ROLE'
*/
```

To solve this, we can grant roles to specific addresses to allow access to certain functions on the Consent contract.
The example below grants 0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc the REQUESTER_ROLE.

```
npx hardhat grantRole --consentaddress 0x9f1ac54BEF0DD2f6f3462EA0fa94fC62300d3a8e --owneraddressindex 1 --address 0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc --role REQUESTER_ROLE  --network dev

/*
Consent address: 0x9f1ac54BEF0DD2f6f3462EA0fa94fC62300d3a8e

Address 0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc has been granted role REQUESTER_ROLE
*/
```

Now it would be able to request for data as it was a function only executed by an address with the REQUESTER_ROLE.
0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc in this example is the address of index 2 in Hardhat's default addresses.

```
npx hardhat requestForData --network dev --consentaddress 0x9f1ac54BEF0DD2f6f3462EA0fa94fC62300d3a8e --owneraddressindex 2 --cid QmdsB4FMQ2jBfrTL2kx6Eaq5Up8rF44h6aqPP9BPpHDAq8

/*
Data request was successful!
*/
```

Similarly, we can also revoke the role as below.

```
npx hardhat revokeRole --consentaddress 0x9f1ac54BEF0DD2f6f3462EA0fa94fC62300d3a8e --owneraddressindex 1 --address 0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc --role REQUESTER_ROLE  --network dev

/*
Consent address: 0x9f1ac54BEF0DD2f6f3462EA0fa94fC62300d3a8e

Address 0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc has been revoked of role REQUESTER_ROLE
*/
```

Now when an address has been revoked the REQUESTER_ROLE tries to request for data, the transaction reverts with the following error.

```
npx hardhat requestForData --network dev --consentaddress 0x9f1ac54BEF0DD2f6f3462EA0fa94fC62300d3a8e --owneraddressindex 2 --cid QmdsB4FMQ2jBfrTL2kx6Eaq5Up8rF44h6aqPP9BPpHDAq8

/*
An unexpected error occurred:
...
AccessControl: account 0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc is missing role 0x61a3517f153a09154844ed8be639dabc6e78dc22315c2d9a91f7eddf9398c002 //bytes32 of 'REQUESTER_ROLE'
*/
```

## Crumbs Contract Tasks

We can create crumbs:

```
npx hardhat createCrumb --crumbid 1 --mask 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 --owneraddressindex 0 --network dev

/*

Success! Crumb id 1 created for address 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266.

*/

```

And burn crumbs:

```
npx hardhat burnCrumb --crumbid 1 --owneraddressindex 0 --network dev

/*

Success! Crumb id 1 burnt from address 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266.

*/
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
