FROM node:16.15-slim

RUN apt update -y \
  && apt install -y vim \
                    tmux \
                    curl \
                    git

WORKDIR /root

# install 

# install the subnet cli and put it in the path
RUN curl -sSfL https://raw.githubusercontent.com/ava-labs/avalanche-cli/main/scripts/install.sh | sh -s
ENV PATH="${PATH}:/root/bin"

# copy the genesis file into the working directory
COPY snickerdoodle_genesis.json .

# create the snickerdoodle subnet configs
RUN avalanche subnet create snickerdoodle --evm --file /root/snickerdoodle_genesis.json 

# copy the entrypoint script into the working directory
COPY entrypoint.sh .
ENTRYPOINT [ "/bin/bash", "entrypoint.sh" ]