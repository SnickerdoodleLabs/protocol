#!/bin/bash

if [ $NETWORK == "subnet" ]
then
  # if we're running a local subnet, use the avalanche subnet tool
  avalanche subnet deploy snickerdoodle -l 
else
  # otherwise, we are running a hardhat node to emulate an arbitrary layer 1
  # create the hardhat instance in a tmux session called "hardhat"
  tmux new -d -s hardhat npx hardhat node --port 8569
fi

# deploy the scripts to the running instance
npx hardhat run scripts/deployment.js --network $NETWORK

# keeps main thread of execution from exiting
tail -f /dev/null
