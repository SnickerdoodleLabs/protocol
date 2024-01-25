#!/bin/bash

tmux new -d -s hardhat npx hardhat node --port 8569

# compile to get artifacts for ABI
npx hardhat compile
# deploy the scripts to the running instance
npx hardhat run scripts/deployment.js --network dev
npx hardhat run scripts/premint_reward.js --network dev

# keeps main thread of execution from exiting
tail -f /dev/null
