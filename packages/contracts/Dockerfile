FROM node:16.15-slim

# we need tmux for background sessions and curl for fetching avalanche tools
RUN apt update -y \
  && apt install -y vim tmux curl

WORKDIR /root

# copy the contracts package into the working directory
COPY . .

# install the subnet cli and put it in the container path
RUN curl -sSfL https://raw.githubusercontent.com/ava-labs/avalanche-cli/main/scripts/install.sh | sh -s
ENV PATH="${PATH}:/root/bin"

# create the snickerdoodle subnet configs
RUN avalanche subnet create snickerdoodle --evm --file /root/subnets/local/snickerdoodle_local_genesis.json 

# install contracts package dependencies
RUN npm install

ENTRYPOINT [ "/bin/bash", "entrypoint.sh" ]