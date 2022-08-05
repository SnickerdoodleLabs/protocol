![Core](https://github.com/SnickerdoodleLabs/Snickerdoodle-Theme-Light/blob/main/snickerdoodle_horizontal_notab.png?raw=true)

# Snickerdoodle Core Test Harness

## Package Contents

- [src](/packages/core/src/): source code for the testing the [Core](/packages/core/README.md) package and running a minimal aggregation service in the form of an [Express](https://expressjs.com/) server

## Summary

This package provides a CLI interface for running and testing the [Core](/packages/core/README.md) package. After running it with `yarn start`, it will start a persistent copy of SDC and give you a menu of options for interacting with the core. The core operates asyncronously, so you may recieve notification of events recieved.

This harness amounts to a bare-bones form factor, and thus has to follow the processes of any form factor when interacting with the core. Thus, it is an excellent proving ground for patterns in SDC.

## Getting Started

![Test Harness Demo](/documentation/images/test-harness-demo.gif)

As currently configured, this package is meant to run locally, and not INSIDE a docker environment. That will be the next upgrade. It is an interactive CLI app, and can be exited via the in-app menu or via ctrl-c. Use `yarn start` to start the app, which will compile the code and run it with ts-node.

### Step 1

At the top level of the protocol repository, start a local [Hardhat](https://hardhat.org) node and [IPFS](https://ipfs.io) node:

```shell
cd /protocol
yarn install
yarn start
```

### Step 2

After the Hardhat and IPFS containers have started, open a new terminal, move to the [test-harness](/packages/test-harness/README.md) directory and start the CLI:

```shell
cd /protocol/packages/test-harness
yarn start
```

### Step 3

After the CLI start, first select "Core" and unlock one of the pre-seeded test wallets. 

### Step 4

Next, select "Insight Platform Simulator" and create a campaign which will deploy a Consent Contract from the Consent Contract Factory in the Hardhat node.

### Step 5

Select Core again and *opt into* the consent contract you just deployed when creating a campaign from the platform simulator.

### Step 6

Now that you have opted into a campaign, Core will respond to `requestForData` events. Select "Insight Platform Simulator", then select "Query", choose the campaign ID you 
just created, and finally select which query you wish to broadcast. 