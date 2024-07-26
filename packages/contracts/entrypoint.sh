#!/bin/bash

tmux new -d -s hardhat npx hardhat node

# deploy the scripts to the running instance
npx hardhat run scripts/deploy-factory-and-consent.cts --network localhost

# keeps main thread of execution from exiting
tail -f /dev/null
