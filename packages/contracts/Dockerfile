FROM node:18-slim

# we need tmux for background sessions and curl for fetching avalanche tools
RUN apt update -y \
  && apt install -y vim tmux curl git

WORKDIR /root

# copy the contracts package into the working directory
COPY . .

# install contracts package dependencies
RUN yarn install
RUN yarn add -D @nomicfoundation/hardhat-toolbox @openzeppelin/hardhat-upgrades @layerzerolabs/lz-evm-oapp-v2 solidity-coverage dotenv  @nomicfoundation/hardhat-chai-matchers@^2.0.0 @nomicfoundation/hardhat-ethers@^3.0.0 @nomicfoundation/hardhat-network-helpers@^1.0.0 @nomicfoundation/hardhat-verify@^2.0.0 @typechain/ethers-v6@^0.5.0 @typechain/hardhat@^9.0.0 @types/chai@^4.2.0 @types/mocha@>=9.1.0 chai@^4.2.0 typechain@^8.3.0
ENTRYPOINT [ "/bin/bash", "entrypoint.sh" ]