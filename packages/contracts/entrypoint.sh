#!/bin/bash

# create the hardhat instance in a tmux session called "hardhat"
tmux new -d -s hardhat npx hardhat node --port 8569

# deploy the scripts to the running instance
npx hardhat run scripts/deployment.js --network dev

# parks additional logs into dev/null
# tail -f /dev/null