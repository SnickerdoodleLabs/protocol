#!/bin/bash

tmux new -d -s hardhat npx hardhat node --port 8569

# deploy the scripts to the running instance
npx hardhat run scripts/deploy-factory-and-consent.cts

# keeps main thread of execution from exiting
tail -f /dev/null
