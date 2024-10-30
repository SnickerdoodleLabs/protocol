#!/bin/bash

tmux new -d -s hardhat npx hardhat node

# Wait for the node to start, ignition was failing without waiting
sleep 5

# deploy the scripts to the running instance
npx hardhat ignition deploy ignition/modules/SnickerdoodleFactory.ts --network hardhat

# keeps main thread of execution from exiting
tail -f /dev/null
