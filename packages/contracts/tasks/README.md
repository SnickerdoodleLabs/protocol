# CLI Tasks

This repository uses [Hardhat tasks](https://hardhat.org/hardhat-runner/docs/guides/tasks-and-scripts) as a simple for of a CLI for interacting with contract deployments on local and public networks. Tasks are defined in javascript files in this subdirectory and grouped based on their concerns. In order to register a new task with Hardhat, the file the task is written in must be imported into the [hardhat.config.js](/packages/contracts/hardhat.config.js) at the root of this package.

Look at available tasks defined by the CLI:

```
npx hardhat --help
```

## Start a Local Hardhat Node

First, start a Hardhat development node to host the contract stack on a local blockchain:
You need to specify the port to bypass a hardhat quirk.

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
Consent deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
Consent Gas Fee: 3320261

Deploying Consent Factory contract...
ConsentFactory deployed to: 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
ConsentFactory Gas Fee: 3296490

Deploying Doodle Token contract...
DoodleToken deployed to: 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
DoodleToken Gas Fee: 1769284

Deploying Timelock Controller contract...
SnickerdoodleTimeLock deployed to: 0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9
SnickerdoodleTimeLock Gas Fee: 2186574

Deploying SnickerdoodleGovernor (DAO) contract...
SnickerdoodleGovernor deployed to: 0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9
SnickerdoodleGovernor Gas Fee: 3663079

Deploying Crumbs contract...
Crumbs deployed to: 0x5FC8d32690cc91D4c39d9d3abcBD16989F875707
Crumbs Gas Fee: 2431053

Deploying Sift contract...
Sift deployed to: 0x0165878A594ca255338adfa4d48449f69242Eb8F
Sift Gas Fee: 2473661

Deploying MinimalForwarder contract...
MinimalForwarder deployed to: 0xa513E6E4b8f2a923D98304ec87F64353C4D5C853
MinimalForwarder Gas Fee: 679425

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
  Requester address:  0x70997970C51812dc3A010C7d01b50e0d17dc79C8
  Address of the deployed Consent's BeaconProxy: 0x9f1ac54BEF0DD2f6f3462EA0fa94fC62300d3a8e
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
Queried address: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8

Request number:  1
  Owner address:  0x70997970C51812dc3A010C7d01b50e0d17dc79C8
  Requested CID: Indexed {
  _isIndexed: true,
  hash: '0xea172f64d8e53ee2cffff03e0a04065867de5bbe379987734688b21f48db60ba'
}

Request number:  2
  Owner address:  0x70997970C51812dc3A010C7d01b50e0d17dc79C8
  Requested CID: Indexed {
  _isIndexed: true,
  hash: '0x6e31be4b71d6f7970b40f352416797fa9ccaae29de3e9da7b9628d09fe05642f'
}

Request number:  3
  Owner address:  0x70997970C51812dc3A010C7d01b50e0d17dc79C8
  Requested CID: Indexed {
  _isIndexed: true,
  hash: '0xb2e219a5e09a57fe679b4733fbf691f43e8658afdc51cdb81c9773b073545307'
}
*/
```

When an address that does not have the required role on the Consent contract's function tries to execute it, the transaction will revert. In the example below, owner address index 2 (0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc), does not have the REQUESTER_ROLE to request for data. Trying to make a request for data will fail.

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
